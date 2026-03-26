import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const neurofluxRouter = new Hono<{ Bindings: Env }>();

interface Consultation {
  id: number;
  user_id: string;
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  created_at: string;
}

// GET /api/neuroflux — return the authenticated user's last 10 consultations
neurofluxRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };

  const { results } = await c.env.DB.prepare(`
    SELECT id, diagnosis, tissue, pathophysiology, phase, objective, irritability, created_at
    FROM neuroflux_consultations
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10
  `).bind(user.id).all<Consultation>();

  return c.json(results ?? []);
});

// POST /api/neuroflux — save a consultation record for the authenticated user
neurofluxRouter.post("/", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const body = await c.req.json<{
    diagnosis?: string;
    tissue?: string | null;
    pathophysiology?: string | null;
    phase?: string | null;
    objective?: string | null;
    irritability?: string | null;
  }>();

  const { diagnosis, tissue, pathophysiology, phase, objective, irritability } = body;

  if (!diagnosis?.trim()) {
    return c.json({ error: "diagnosis is required" }, 400);
  }

  await c.env.DB.prepare(`
    INSERT INTO neuroflux_consultations (user_id, diagnosis, tissue, pathophysiology, phase, objective, irritability)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    diagnosis.trim(),
    tissue ?? null,
    pathophysiology ?? null,
    phase ?? null,
    objective ?? null,
    irritability ?? null,
  ).run();

  return c.json({ success: true }, 201);
});
