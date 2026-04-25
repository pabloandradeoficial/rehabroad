/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// EVALUATIONS API
// ============================================

export function registerEvaluationsRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/evaluations", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");

    const patient = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM evaluations WHERE patient_id = ? ORDER BY created_at DESC`
    ).bind(patientId).all();

    return c.json(results);
  });

  router.post("/patients/:patientId/evaluations", authMiddleware, async (c) => {
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
      `INSERT INTO evaluations (patient_id, type, chief_complaint, history, pain_level, pain_location, functional_status, orthopedic_tests, observations)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    ).bind(
      patientId,
      body.type || "initial",
      body.chief_complaint || null,
      body.history || null,
      body.pain_level || null,
      body.pain_location || null,
      body.functional_status || null,
      body.orthopedic_tests || null,
      body.observations || null
    ).first();

    return c.json(result, 201);
  });

  router.put("/evaluations/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    const evalId = c.req.param("id");
    const body = await c.req.json();

    const evaluation = await c.env.DB.prepare(
      `SELECT e.id FROM evaluations e
       JOIN patients p ON e.patient_id = p.id
       WHERE e.id = ? AND p.user_id = ?`
    ).bind(evalId, user!.id).first();

    if (!evaluation) {
      return c.json({ error: "Evaluation not found" }, 404);
    }

    const result = await c.env.DB.prepare(
      `UPDATE evaluations SET
       chief_complaint = ?, history = ?, pain_level = ?, pain_location = ?,
       functional_status = ?, orthopedic_tests = ?, observations = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING *`
    ).bind(
      body.chief_complaint || null,
      body.history || null,
      body.pain_level || null,
      body.pain_location || null,
      body.functional_status || null,
      body.orthopedic_tests || null,
      body.observations || null,
      evalId
    ).first();

    return c.json(result);
  });
}
