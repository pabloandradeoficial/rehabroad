import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const neurofluxRouter = new Hono<{ Bindings: Env }>();

interface Consultation {
  id: number;
  user_id: string;
  patient_id: string | null;
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  created_at: string;
}

// GET /api/neuroflux — last 10 consultations; optional ?patient_id= filter
neurofluxRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const patientId = c.req.query("patient_id");

  let sql = `
    SELECT id, patient_id, diagnosis, tissue, pathophysiology, phase, objective, irritability, created_at
    FROM neuroflux_consultations
    WHERE user_id = ?
  `;
  const params: string[] = [user.id];

  if (patientId) {
    sql += ` AND patient_id = ?`;
    params.push(patientId);
  }

  sql += ` ORDER BY created_at DESC LIMIT 10`;

  const { results } = await c.env.DB.prepare(sql).bind(...params).all<Consultation>();

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
    patient_id?: string | null;
  }>();

  const { diagnosis, tissue, pathophysiology, phase, objective, irritability, patient_id } = body;

  if (!diagnosis?.trim()) {
    return c.json({ error: "diagnosis is required" }, 400);
  }

  await c.env.DB.prepare(`
    INSERT INTO neuroflux_consultations (user_id, patient_id, diagnosis, tissue, pathophysiology, phase, objective, irritability)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    patient_id ?? null,
    diagnosis.trim(),
    tissue ?? null,
    pathophysiology ?? null,
    phase ?? null,
    objective ?? null,
    irritability ?? null,
  ).run();

  return c.json({ success: true }, 201);
});
