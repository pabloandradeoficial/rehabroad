import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const rehabFriendRouter = new Hono<{ Bindings: Env }>();

const DAILY_LIMIT = 15;

const SYSTEM_PROMPT = `Você é o Rehab Friend, um assistente clínico inteligente para fisioterapeutas.
Seu objetivo é apoiar profissionais de reabilitação com:
- Raciocínio clínico e hipóteses diagnósticas
- Sugestões de protocolos e técnicas terapêuticas baseadas em evidências
- Interpretação de achados clínicos
- Planejamento de progressão de exercícios
- Orientações sobre avaliação funcional

Importante:
- Sempre reforce que suas sugestões são de apoio clínico, não substituem o julgamento profissional
- Baseie suas respostas em evidências científicas quando possível
- Seja objetivo e prático, focando em aplicações clínicas
- Responda sempre em português brasileiro
- Quando houver contexto do paciente, use-o para personalizar suas respostas`;

rehabFriendRouter.use("/chat", authMiddleware);
rehabFriendRouter.use("/usage", authMiddleware);

// ─────────────────────────────────────────────
// GET /usage — daily usage info
// ─────────────────────────────────────────────

rehabFriendRouter.get("/usage", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const userId = user.id;
  const db = c.env.DB;

  const now = new Date();
  const usage = await db
    .prepare(`SELECT message_count, reset_at FROM rehab_friend_usage WHERE user_id = ?`)
    .bind(userId)
    .first<{ message_count: number; reset_at: string }>();

  if (!usage) {
    return c.json({ used: 0, limit: DAILY_LIMIT, remaining: DAILY_LIMIT });
  }

  const resetAt = new Date(usage.reset_at);
  if (now >= resetAt) {
    return c.json({ used: 0, limit: DAILY_LIMIT, remaining: DAILY_LIMIT });
  }

  const remaining = Math.max(0, DAILY_LIMIT - usage.message_count);
  return c.json({ used: usage.message_count, limit: DAILY_LIMIT, remaining });
});

// ─────────────────────────────────────────────
// POST /chat — send message
// ─────────────────────────────────────────────

rehabFriendRouter.post("/chat", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const userId = user.id;
  const db = c.env.DB;

  const body = await c.req.json<{
    message?: string;
    patientId?: number;
    history?: { role: string; content: string }[];
    imageBase64?: string | null;
    imageMimeType?: string | null;
  }>();

  if (!body.message?.trim() && !body.imageBase64) {
    return c.json({ error: "Mensagem ou imagem obrigatória" }, 400);
  }

  // ── Rate limiting ──
  const now = new Date();
  const tomorrowMidnight = new Date(now);
  tomorrowMidnight.setUTCHours(24, 0, 0, 0);

  const usage = await db
    .prepare(`SELECT message_count, reset_at FROM rehab_friend_usage WHERE user_id = ?`)
    .bind(userId)
    .first<{ message_count: number; reset_at: string }>();

  if (usage) {
    const resetAt = new Date(usage.reset_at);
    const isExpired = now >= resetAt;

    if (isExpired) {
      await db
        .prepare(
          `UPDATE rehab_friend_usage SET message_count = 1, reset_at = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`
        )
        .bind(tomorrowMidnight.toISOString(), userId)
        .run();
    } else if (usage.message_count >= DAILY_LIMIT) {
      return c.json(
        {
          error: "Limite diário atingido",
          resetAt: usage.reset_at,
          remaining: 0,
        },
        429
      );
    } else {
      await db
        .prepare(
          `UPDATE rehab_friend_usage SET message_count = message_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`
        )
        .bind(userId)
        .run();
    }
  } else {
    await db
      .prepare(
        `INSERT INTO rehab_friend_usage (user_id, message_count, reset_at) VALUES (?, 1, ?)`
      )
      .bind(userId, tomorrowMidnight.toISOString())
      .run();
  }

  // ── Build patient clinical context if provided ──
  let patientContext = "";
  if (body.patientId) {
    const patient = await db
      .prepare(
        `SELECT p.name, p.age, p.diagnosis, p.notes,
          (SELECT content FROM evolutions WHERE patient_id = p.id ORDER BY created_at DESC LIMIT 1) as last_evolution
         FROM patients p WHERE p.id = ? AND p.user_id = ?`
      )
      .bind(body.patientId, userId)
      .first<{
        name: string;
        age: number | null;
        diagnosis: string | null;
        notes: string | null;
        last_evolution: string | null;
      }>();

    if (patient) {
      patientContext = `\n\n[CONTEXTO DO PACIENTE]\nNome: ${patient.name}${patient.age ? `\nIdade: ${patient.age} anos` : ""}${patient.diagnosis ? `\nDiagnóstico: ${patient.diagnosis}` : ""}${patient.notes ? `\nObservações: ${patient.notes}` : ""}${patient.last_evolution ? `\nÚltima evolução: ${patient.last_evolution}` : ""}`;
    }
  }

  // ── Build messages array ──
  const systemContent = SYSTEM_PROMPT + patientContext;
  const history = (body.history ?? []).slice(-6);

  type UserContent =
    | string
    | { type: string; image_url?: { url: string; detail: string }; text?: string }[];

  const userContent: UserContent = body.imageBase64
    ? [
        {
          type: "image_url",
          image_url: {
            url: `data:${body.imageMimeType};base64,${body.imageBase64}`,
            detail: "high",
          },
        },
        {
          type: "text",
          text:
            body.message?.trim() ||
            "Analise este laudo/imagem clínica e me dê os principais achados relevantes para fisioterapia.",
        },
      ]
    : (body.message ?? "");

  const messages = [
    { role: "system", content: systemContent },
    ...history,
    { role: "user", content: userContent },
  ];

  // ── Call OpenAI ──
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    console.error("OpenAI error:", errText);
    return c.json({ error: "Erro ao processar mensagem. Tente novamente." }, 502);
  }

  const openaiData = await openaiRes.json<{
    choices: { message: { content: string } }[];
  }>();

  const assistantContent = openaiData.choices?.[0]?.message?.content ?? "";

  // ── Persist messages ──
  const savedUserContent = body.imageBase64
    ? `[imagem: ${body.imageMimeType}] ${body.message?.trim() ?? ""}`.trim()
    : (body.message ?? "");

  await db
    .prepare(
      `INSERT INTO rehab_friend_messages (user_id, role, content, patient_id) VALUES (?, ?, ?, ?)`
    )
    .bind(userId, "user", savedUserContent, body.patientId ?? null)
    .run();

  await db
    .prepare(
      `INSERT INTO rehab_friend_messages (user_id, role, content, patient_id) VALUES (?, ?, ?, ?)`
    )
    .bind(userId, "assistant", assistantContent, body.patientId ?? null)
    .run();

  // ── Return response ──
  const updatedUsage = await db
    .prepare(`SELECT message_count FROM rehab_friend_usage WHERE user_id = ?`)
    .bind(userId)
    .first<{ message_count: number }>();

  const used = updatedUsage?.message_count ?? 1;

  return c.json({
    content: assistantContent,
    used,
    remaining: Math.max(0, DAILY_LIMIT - used),
  });
});
