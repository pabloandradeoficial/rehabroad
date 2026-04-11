import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const comiteRouter = new Hono<{ Bindings: Env }>();

comiteRouter.use("/*", authMiddleware);

const getLevel = (xp: number) => {
  if (xp <= 50) return "Residente";
  if (xp <= 150) return "Especialista";
  if (xp <= 300) return "Sênior";
  return "Referência";
};

// ─────────────────────────────────────────────
// GET /agents — list all active agents
// ─────────────────────────────────────────────
comiteRouter.get("/agents", async (c) => {
  const db = c.env.DB;
  const { results } = await db
    .prepare(`SELECT id, categoria, nome, descricao_curta, icone FROM comite_agentes WHERE is_active = 1`)
    .all();
  return c.json(results);
});

// ─────────────────────────────────────────────
// GET /xp — get current user's XP and Level
// ─────────────────────────────────────────────
comiteRouter.get("/xp", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const userId = user.id;
  const db = c.env.DB;

  let xpData = await db
    .prepare(`SELECT xp_total FROM comite_xp_usuario WHERE user_id = ?`)
    .bind(userId)
    .first<{ xp_total: number }>();

  if (!xpData) {
    await db
      .prepare(`INSERT INTO comite_xp_usuario (user_id, xp_total) VALUES (?, 0)`)
      .bind(userId)
      .run();
    xpData = { xp_total: 0 };
  }

  const xp = xpData.xp_total;
  return c.json({ xp, level: getLevel(xp) });
});

// ─────────────────────────────────────────────
// GET /weekly-case — fetch the active weekly case
// ─────────────────────────────────────────────
comiteRouter.get("/weekly-case", async (c) => {
  const db = c.env.DB;
  const caso = await db
    .prepare(`SELECT * FROM comite_caso_semana WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1`)
    .first();
  return c.json(caso);
});

// ─────────────────────────────────────────────
// GET /library — fetch user's saved cases
// ─────────────────────────────────────────────
comiteRouter.get("/library", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const db = c.env.DB;
  const { results } = await db
    .prepare(`SELECT c.*, a.nome as agent_name, a.icone as agent_icon 
              FROM comite_casos_salvos c
              JOIN comite_agentes a ON c.agent_id = a.id
              WHERE c.user_id = ? ORDER BY c.created_at DESC`)
    .bind(user.id)
    .all();
  return c.json(results);
});

// ─────────────────────────────────────────────
// POST /library/save — save a case to DB and award XP
// ─────────────────────────────────────────────
comiteRouter.post("/library/save", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const db = c.env.DB;
  const body = await c.req.json<{
    id?: string;
    agentId: string;
    title: string;
    history: { role: string; content: string }[];
  }>();

  if (!body.agentId || !body.history) {
    return c.json({ error: "agentId and history are required" }, 400);
  }

  const caseId = body.id || crypto.randomUUID();

  // Se já existe um com esse ID, atualiza e não dá XP extra
  const existing = await db
    .prepare(`SELECT id FROM comite_casos_salvos WHERE id = ? AND user_id = ?`)
    .bind(caseId, user.id)
    .first();

  if (existing) {
    await db
      .prepare(`UPDATE comite_casos_salvos SET history_json = ?, title = ? WHERE id = ?`)
      .bind(JSON.stringify(body.history), body.title, caseId)
      .run();
    return c.json({ success: true, caseId, xpAdded: 0 });
  } else {
    await db
      .prepare(`INSERT INTO comite_casos_salvos (id, user_id, agent_id, title, history_json) VALUES (?, ?, ?, ?, ?)`)
      .bind(caseId, user.id, body.agentId, body.title, JSON.stringify(body.history))
      .run();
      
    // Award +5 XP for saving
    await db
      .prepare(`UPDATE comite_xp_usuario SET xp_total = xp_total + 5, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`)
      .bind(user.id)
      .run();

    return c.json({ success: true, caseId, xpAdded: 5 });
  }
});

// ─────────────────────────────────────────────
// POST /complete-case — award +10 XP
// ─────────────────────────────────────────────
comiteRouter.post("/complete-case", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const db = c.env.DB;
  
  await db
    .prepare(`UPDATE comite_xp_usuario SET xp_total = xp_total + 10, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`)
    .bind(user.id)
    .run();
    
  return c.json({ success: true, xpAdded: 10 });
});

// ─────────────────────────────────────────────
// POST /chat — chat with an agent
// ─────────────────────────────────────────────
comiteRouter.post("/chat", async (c) => {
  const user = c.get("user" as never) as { id: string };
  const db = c.env.DB;
  const body = await c.req.json<{
    agentId: string;
    message: string;
    history?: { role: string; content: string }[];
  }>();

  if (!body.agentId || !body.message) {
    return c.json({ error: "agentId and message are required" }, 400);
  }

  const agent = await db
    .prepare(`SELECT system_prompt FROM comite_agentes WHERE id = ?`)
    .bind(body.agentId)
    .first<{ system_prompt: string }>();

  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const finalSystemPrompt = 
    agent.system_prompt + 
    "\n\nInstrução obrigatória: Se você basear algo que disse em evidência científica, você deve referenciá-la explicitamente em seu texto no formato: '[REFERENCIAL TEÓRICO:' seguido do nome ou sumário do artigo de referência e então ']'. Não use citações indiretas misteriosas. Ao invés disso, coloque a citação dentro da tag para que o front-end mostre a blockquote.";

  const history = (body.history ?? []).slice(-10);

  const messages = [
    { role: "system", content: finalSystemPrompt },
    ...history,
    { role: "user", content: body.message },
  ];

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!openaiRes.ok) {
    return c.json({ error: "Erro ao comunicar com a IA" }, 502);
  }

  const openaiData = await openaiRes.json<{
    choices: { message: { content: string } }[];
  }>();

  const content = openaiData.choices?.[0]?.message?.content ?? "";

  return c.json({ content });
});
