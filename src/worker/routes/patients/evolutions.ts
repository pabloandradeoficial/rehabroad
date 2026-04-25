import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// EVOLUTIONS API
// ============================================

export function registerEvolutionsRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/evolutions", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");

    const patient = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date DESC, created_at DESC`
    ).bind(patientId).all();

    return c.json(results);
  });

  router.post("/patients/:patientId/evolutions", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");
    const body = await c.req.json();

    const patient = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const result = await c.env.DB.prepare(
      `INSERT INTO evolutions (patient_id, session_date, pain_level, functional_status, procedures, patient_response, observations, attendance_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    ).bind(
      patientId,
      body.session_date || new Date().toISOString().split("T")[0],
      body.pain_level || null,
      body.functional_status || null,
      body.procedures || null,
      body.patient_response || null,
      body.observations || null,
      body.attendance_status || "attended"
    ).first();

    return c.json(result, 201);
  });

  router.put("/evolutions/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    const evolutionId = c.req.param("id");
    const body = await c.req.json();

    const evolution = await c.env.DB.prepare(
      `SELECT e.* FROM evolutions e
       JOIN patients p ON e.patient_id = p.id
       WHERE e.id = ? AND p.user_id = ?`
    ).bind(evolutionId, user!.id).first<{
      session_date: string;
      pain_level: number | null;
      functional_status: string | null;
      procedures: string | null;
      patient_response: string | null;
      observations: string | null;
      attendance_status: string | null;
    }>();

    if (!evolution) {
      return c.json({ error: "Evolution not found" }, 404);
    }

    const result = await c.env.DB.prepare(
      `UPDATE evolutions SET
        session_date = ?,
        pain_level = ?,
        functional_status = ?,
        procedures = ?,
        patient_response = ?,
        observations = ?,
        attendance_status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING *`
    ).bind(
      body.session_date || evolution.session_date,
      body.pain_level ?? evolution.pain_level,
      body.functional_status || evolution.functional_status,
      body.procedures || evolution.procedures,
      body.patient_response || evolution.patient_response,
      body.observations || evolution.observations,
      body.attendance_status || evolution.attendance_status,
      evolutionId
    ).first();

    return c.json(result);
  });
}
