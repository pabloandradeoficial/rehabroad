import { Hono } from "hono";
import { authMiddleware, optionalAuthMiddleware } from "../lib/helpers";

export const studentCasesRouter = new Hono<{ Bindings: Env }>();

// ── Types ─────────────────────────────────────────────────────────────────────

type ClinicalCaseRow = {
  id: number;
  area: string;
  regiao: string;
  dificuldade: string;
  titulo: string;
  paciente: string;
  historia: string;
  sintomas: string;
  achados_clinicos: string;
  tempo_estimado: number;
  hipotese_correta: string;
  alternativas: string;
  explicacao: string;
  dica_clinica: string | null;
  status: string;
  generated_by: string;
  created_at: string;
};

const REGIOES = [
  "ombro", "joelho", "coluna_lombar", "coluna_cervical",
  "quadril", "tornozelo_pe", "cotovelo", "punho_mao", "neurologica",
];

// ── POST /api/student/cases/generate ─────────────────────────────────────────
// Generate a clinical case with GPT-4o. ?manual=true skips auth check (owner only).

studentCasesRouter.post("/cases/generate", authMiddleware, async (c) => {
  const { area, regiao, dificuldade } = await c.req.json<{
    area?: string;
    regiao?: string;
    dificuldade?: string;
  }>();

  const selectedArea = area || "ortopedia";
  const selectedRegiao = regiao || REGIOES[Math.floor(Math.random() * REGIOES.length)];
  const selectedDificuldade = dificuldade || "intermediario";

  const systemPrompt = `Você é um professor de fisioterapia especialista em raciocínio clínico.
Gere casos clínicos realistas para estudantes praticarem diagnóstico diferencial.
Responda SOMENTE com JSON válido, sem texto extra.`;

  const userPrompt = `Gere um caso clínico de fisioterapia com as seguintes especificações:
- Área: ${selectedArea}
- Região: ${selectedRegiao.replace("_", " ")}
- Dificuldade: ${selectedDificuldade}

Responda com este JSON exato:
{
  "titulo": "título curto do caso",
  "paciente": {
    "nome": "nome fictício",
    "idade": número,
    "sexo": "masculino" ou "feminino",
    "profissao": "profissão relevante"
  },
  "historia": "história clínica detalhada em 3-4 frases",
  "sintomas": ["sintoma 1", "sintoma 2", "sintoma 3"],
  "achados_clinicos": {
    "inspecao": "achados de inspeção",
    "palpacao": "achados de palpação",
    "amplitude": "limitações de ADM",
    "testes_positivos": ["teste 1", "teste 2"]
  },
  "tempo_estimado": 5,
  "hipotese_correta": "diagnóstico correto",
  "alternativas": [
    "diagnóstico correto",
    "diagnóstico diferencial 1",
    "diagnóstico diferencial 2",
    "diagnóstico diferencial 3"
  ],
  "explicacao": "explicação detalhada de 2-3 frases sobre o diagnóstico e raciocínio clínico",
  "dica_clinica": "dica prática para o estudante"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${c.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return c.json({ error: "Falha ao gerar caso clínico" }, 500);
  }

  const aiData = await response.json() as {
    choices: { message: { content: string } }[];
  };

  let caseData: {
    titulo: string;
    paciente: { nome: string; idade: number; sexo: string; profissao: string };
    historia: string;
    sintomas: string[];
    achados_clinicos: Record<string, unknown>;
    tempo_estimado: number;
    hipotese_correta: string;
    alternativas: string[];
    explicacao: string;
    dica_clinica?: string;
  };

  try {
    caseData = JSON.parse(aiData.choices[0].message.content);
  } catch {
    return c.json({ error: "Resposta inválida da IA" }, 500);
  }

  // Shuffle alternativas so correct answer is not always first
  const shuffled = [...caseData.alternativas].sort(() => Math.random() - 0.5);

  const result = await c.env.DB.prepare(`
    INSERT INTO clinical_cases
      (area, regiao, dificuldade, titulo, paciente, historia, sintomas,
       achados_clinicos, tempo_estimado, hipotese_correta, alternativas,
       explicacao, dica_clinica, status, generated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', 'ai')
  `).bind(
    selectedArea,
    selectedRegiao,
    selectedDificuldade,
    caseData.titulo,
    JSON.stringify(caseData.paciente),
    caseData.historia,
    JSON.stringify(caseData.sintomas),
    JSON.stringify(caseData.achados_clinicos),
    caseData.tempo_estimado || 5,
    caseData.hipotese_correta,
    JSON.stringify(shuffled),
    caseData.explicacao,
    caseData.dica_clinica ?? null,
  ).run();

  return c.json({
    success: true,
    caseId: result.meta?.last_row_id ?? null,
    case: {
      ...caseData,
      id: result.meta?.last_row_id,
      area: selectedArea,
      regiao: selectedRegiao,
      dificuldade: selectedDificuldade,
      alternativas: shuffled,
      status: "pending_review",
    },
  }, 201);
});

// ── GET /api/student/cases ─────────────────────────────────────────────────────
// List published cases. Optionally filter by area, regiao, dificuldade.

studentCasesRouter.get("/cases", optionalAuthMiddleware, async (c) => {
  const area = c.req.query("area");
  const regiao = c.req.query("regiao");
  const dificuldade = c.req.query("dificuldade");
  const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50);

  const conditions: string[] = ["status = 'published'"];
  const binds: (string | number)[] = [];

  if (area) {
    conditions.push("area = ?");
    binds.push(area);
  }
  if (regiao) {
    conditions.push("regiao = ?");
    binds.push(regiao);
  }
  if (dificuldade) {
    conditions.push("dificuldade = ?");
    binds.push(dificuldade);
  }

  binds.push(limit);

  const { results } = await c.env.DB.prepare(`
    SELECT id, area, regiao, dificuldade, titulo, paciente, historia, sintomas,
           achados_clinicos, tempo_estimado, hipotese_correta, alternativas,
           explicacao, dica_clinica, created_at
    FROM clinical_cases
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(...binds).all<ClinicalCaseRow>();

  const cases = (results || []).map(parseCase);

  return c.json({ cases }, 200);
});

// ── GET /api/student/cases/:id ─────────────────────────────────────────────────

studentCasesRouter.get("/cases/:id", optionalAuthMiddleware, async (c) => {
  const id = c.req.param("id");

  const row = await c.env.DB.prepare(`
    SELECT id, area, regiao, dificuldade, titulo, paciente, historia, sintomas,
           achados_clinicos, tempo_estimado, hipotese_correta, alternativas,
           explicacao, dica_clinica, created_at
    FROM clinical_cases
    WHERE id = ? AND status = 'published'
  `).bind(id).first<ClinicalCaseRow>();

  if (!row) {
    return c.json({ error: "Caso não encontrado" }, 404);
  }

  return c.json({ case: parseCase(row) }, 200);
});

// ── GET /api/student/region-progress ─────────────────────────────────────────

studentCasesRouter.get("/region-progress", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM student_region_progress WHERE student_id = ?"
  ).bind(user.id).all<{
    student_id: string; regiao: string; casos_resolvidos: number;
    casos_total: number; acertos: number; dominio_percent: number; status: string;
  }>();

  return c.json({ regions: results || [] }, 200);
});

// ── POST /api/student/region-progress ─────────────────────────────────────────
// Update progress after solving a case in a region.

studentCasesRouter.post("/region-progress", authMiddleware, async (c) => {
  const user = c.get("user");
  const { regiao, correto } = await c.req.json<{ regiao: string; correto: boolean }>();

  if (!regiao) {
    return c.json({ error: "regiao é obrigatório" }, 400);
  }

  const existing = await c.env.DB.prepare(
    "SELECT * FROM student_region_progress WHERE student_id = ? AND regiao = ?"
  ).bind(user.id, regiao).first<{
    casos_resolvidos: number; casos_total: number; acertos: number;
  }>();

  if (!existing) {
    await c.env.DB.prepare(`
      INSERT INTO student_region_progress
        (student_id, regiao, casos_resolvidos, casos_total, acertos, dominio_percent, status)
      VALUES (?, ?, 1, 10, ?, ?, 'in_progress')
    `).bind(
      user.id, regiao,
      correto ? 1 : 0,
      correto ? 10 : 0
    ).run();
  } else {
    const newResolvidos = existing.casos_resolvidos + 1;
    const newAcertos = existing.acertos + (correto ? 1 : 0);
    const dominio = Math.round((newAcertos / Math.max(newResolvidos, 1)) * 100);
    const status = dominio >= 70 && newResolvidos >= 5 ? "dominated" : "in_progress";

    await c.env.DB.prepare(`
      UPDATE student_region_progress
      SET casos_resolvidos = ?, acertos = ?, dominio_percent = ?,
          status = ?, updated_at = datetime('now')
      WHERE student_id = ? AND regiao = ?
    `).bind(newResolvidos, newAcertos, dominio, status, user.id, regiao).run();
  }

  return c.json({ success: true }, 200);
});

// ── POST /api/student/flashcards/progress ─────────────────────────────────────

studentCasesRouter.post("/flashcards/progress", authMiddleware, async (c) => {
  const user = c.get("user");
  const { card_id, resultado } = await c.req.json<{
    card_id: string;
    resultado: "sabia" | "nao_sabia" | "quase";
  }>();

  if (!card_id || !resultado) {
    return c.json({ error: "card_id e resultado são obrigatórios" }, 400);
  }

  await c.env.DB.prepare(`
    INSERT INTO student_flashcard_progress (student_id, card_id, resultado, reviewed_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(student_id, card_id) DO UPDATE SET
      resultado = excluded.resultado,
      reviewed_at = excluded.reviewed_at
  `).bind(user.id, card_id, resultado).run();

  return c.json({ success: true }, 200);
});

// ── GET /api/student/flashcards/progress ──────────────────────────────────────

studentCasesRouter.get("/flashcards/progress", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results } = await c.env.DB.prepare(
    "SELECT card_id, resultado, reviewed_at FROM student_flashcard_progress WHERE student_id = ?"
  ).bind(user.id).all<{ card_id: string; resultado: string; reviewed_at: string }>();

  return c.json({ progress: results || [] }, 200);
});

// ── PATCH /api/student/progress/estagio ───────────────────────────────────────

studentCasesRouter.patch("/progress/estagio", authMiddleware, async (c) => {
  const user = c.get("user");
  const { estagio_atual } = await c.req.json<{ estagio_atual: string }>();

  if (!estagio_atual) {
    return c.json({ error: "estagio_atual é obrigatório" }, 400);
  }

  await c.env.DB.prepare(`
    UPDATE student_progress SET estagio_atual = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).bind(estagio_atual, user.id).run();

  return c.json({ success: true }, 200);
});

// ── PATCH /api/student/progress/ponte-pro ─────────────────────────────────────

studentCasesRouter.patch("/progress/ponte-pro", authMiddleware, async (c) => {
  const user = c.get("user");

  await c.env.DB.prepare(`
    UPDATE student_progress SET ponte_pro_shown = 1, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).bind(user.id).run();

  return c.json({ success: true }, 200);
});

// ── GET /api/student/certificate/:regiao ─────────────────────────────────────

studentCasesRouter.get("/certificate/:regiao", authMiddleware, async (c) => {
  const user = c.get("user");
  const regiao = c.req.param("regiao");

  const regionProgress = await c.env.DB.prepare(
    "SELECT * FROM student_region_progress WHERE student_id = ? AND regiao = ?"
  ).bind(user.id, regiao).first<{
    dominio_percent: number; casos_resolvidos: number; status: string;
  }>();

  if (!regionProgress || regionProgress.status !== "dominated") {
    return c.json({ error: "Região ainda não dominada" }, 403);
  }

  const studentRow = await c.env.DB.prepare(
    "SELECT user_name FROM student_progress WHERE user_id = ?"
  ).bind(user.id).first<{ user_name: string }>();

  const userName = studentRow?.user_name ?? "Estudante";
  const regiaoFormatted = regiao.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const issuedAt = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return c.json({
    certificate: {
      student_name: userName,
      regiao: regiaoFormatted,
      dominio_percent: regionProgress.dominio_percent,
      casos_resolvidos: regionProgress.casos_resolvidos,
      issued_at: issuedAt,
      badge: `🏆 Especialista em ${regiaoFormatted}`,
    },
  }, 200);
});

// ── Helper ─────────────────────────────────────────────────────────────────────

function parseCase(row: ClinicalCaseRow) {
  return {
    ...row,
    paciente: safeJson(row.paciente, {}),
    sintomas: safeJson(row.sintomas, []),
    achados_clinicos: safeJson(row.achados_clinicos, {}),
    alternativas: safeJson(row.alternativas, []),
  };
}

function safeJson<T>(raw: string, fallback: T): T {
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ── Weekly case generation (called from cron) ─────────────────────────────────

export async function generateWeeklyCases(env: Env, countPerRegiao = 3) {
  if (!env.OPENAI_API_KEY) return;

  for (const regiao of REGIOES) {
    for (let i = 0; i < countPerRegiao; i++) {
      const dificuldades = ["basico", "intermediario", "avancado"];
      const dificuldade = dificuldades[i % 3];

      try {
        const systemPrompt = `Você é um professor de fisioterapia. Gere casos clínicos realistas. Responda SOMENTE com JSON válido.`;
        const userPrompt = `Caso de ${regiao.replace("_", " ")}, dificuldade ${dificuldade}. JSON:
{
  "titulo": "...",
  "paciente": { "nome": "...", "idade": N, "sexo": "...", "profissao": "..." },
  "historia": "...",
  "sintomas": ["...", "..."],
  "achados_clinicos": { "inspecao": "...", "palpacao": "...", "amplitude": "...", "testes_positivos": ["..."] },
  "tempo_estimado": 5,
  "hipotese_correta": "...",
  "alternativas": ["hipotese_correta", "diferencial1", "diferencial2", "diferencial3"],
  "explicacao": "...",
  "dica_clinica": "..."
}`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.8,
            max_tokens: 800,
            response_format: { type: "json_object" },
          }),
        });

        if (!res.ok) continue;

        const aiData = await res.json() as { choices: { message: { content: string } }[] };
        const caseData = JSON.parse(aiData.choices[0].message.content);
        const shuffled = [...caseData.alternativas].sort(() => Math.random() - 0.5);

        await env.DB.prepare(`
          INSERT INTO clinical_cases
            (area, regiao, dificuldade, titulo, paciente, historia, sintomas,
             achados_clinicos, tempo_estimado, hipotese_correta, alternativas,
             explicacao, dica_clinica, status, generated_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'ai')
        `).bind(
          "ortopedia", regiao, dificuldade,
          caseData.titulo,
          JSON.stringify(caseData.paciente),
          caseData.historia,
          JSON.stringify(caseData.sintomas),
          JSON.stringify(caseData.achados_clinicos),
          caseData.tempo_estimado || 5,
          caseData.hipotese_correta,
          JSON.stringify(shuffled),
          caseData.explicacao,
          caseData.dica_clinica ?? null,
        ).run();
      } catch {
        // non-critical — continue with next case
      }
    }
  }
}
