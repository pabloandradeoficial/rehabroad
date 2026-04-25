import type { Hono } from "hono";
import { authMiddleware, normalizeDelimitedTextValue, normalizeCaminhoRecord } from "../../lib/helpers";

// ============================================
// CAMINHO (PATHWAY) API
// ============================================

export function registerCaminhoRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/caminho", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");

    const patient = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const caminho = await c.env.DB.prepare(
      `SELECT * FROM caminho WHERE patient_id = ?`
    ).bind(patientId).first();

    return c.json(normalizeCaminhoRecord(caminho as Record<string, unknown> | null));
  });

  router.post("/patients/:patientId/caminho", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");
    const body = await c.req.json<Record<string, unknown>>();

    const patient = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const normalizedPainPattern = normalizeDelimitedTextValue(
      body.pain_pattern ?? body.pain_patterns
    );

    const existing = await c.env.DB.prepare(
      `SELECT id FROM caminho WHERE patient_id = ?`
    ).bind(patientId).first();

    let result;
    if (existing) {
      result = await c.env.DB.prepare(
        `UPDATE caminho SET
         pain_pattern = ?, aggravating_factors = ?, relieving_factors = ?,
         functional_limitations = ?, treatment_goals = ?, red_flags = ?,
         updated_at = CURRENT_TIMESTAMP
         WHERE patient_id = ?
         RETURNING *`
      ).bind(
        normalizedPainPattern,
        normalizeDelimitedTextValue(body.aggravating_factors),
        normalizeDelimitedTextValue(body.relieving_factors),
        normalizeDelimitedTextValue(body.functional_limitations),
        normalizeDelimitedTextValue(body.treatment_goals),
        normalizeDelimitedTextValue(body.red_flags),
        patientId
      ).first();
    } else {
      result = await c.env.DB.prepare(
        `INSERT INTO caminho (patient_id, pain_pattern, aggravating_factors, relieving_factors, functional_limitations, treatment_goals, red_flags)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING *`
      ).bind(
        patientId,
        normalizedPainPattern,
        normalizeDelimitedTextValue(body.aggravating_factors),
        normalizeDelimitedTextValue(body.relieving_factors),
        normalizeDelimitedTextValue(body.functional_limitations),
        normalizeDelimitedTextValue(body.treatment_goals),
        normalizeDelimitedTextValue(body.red_flags)
      ).first();
    }

    return c.json(normalizeCaminhoRecord(result as Record<string, unknown> | null), existing ? 200 : 201);
  });
}
