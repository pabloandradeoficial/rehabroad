/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../../lib/helpers";
import { patientSchema } from "./schema";

// ============================================
// PATIENTS API
// ============================================

export function registerPatientsCrudRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients", authMiddleware, async (c) => {
    const user = c.get("user");

    const pageParam = parseInt(c.req.query("page") ?? "1", 10);
    const limitParam = parseInt(c.req.query("limit") ?? "50", 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 || limitParam > 100 ? 50 : limitParam;
    const offset = (page - 1) * limit;

    const [{ results }, totalRow] = await Promise.all([
      c.env.DB.prepare(
        `SELECT * FROM patients WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
      ).bind(user!.id, limit, offset).all(),
      c.env.DB.prepare(
        `SELECT COUNT(*) as count FROM patients WHERE user_id = ?`
      ).bind(user!.id).first() as Promise<{ count: number } | null>,
    ]);

    const total = totalRow?.count ?? 0;

    return c.json({
      data: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  });

  router.get("/patients/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("id");

    const patient = await c.env.DB.prepare(
      `SELECT * FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    return c.json(patient);
  });

  router.post("/patients", authMiddleware, zValidator("json", patientSchema), async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    const result = await c.env.DB.prepare(
      `INSERT INTO patients (user_id, name, birth_date, phone, email, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING *`
    ).bind(
      user!.id,
      body.name,
      body.birth_date || null,
      body.phone || null,
      body.email || null,
      body.notes || null
    ).first();

    return c.json(result, 201);
  });

  router.put("/patients/:id", authMiddleware, zValidator("json", patientSchema), async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("id");
    const body = c.req.valid("json");

    const result = await c.env.DB.prepare(
      `UPDATE patients SET
       name = ?, birth_date = ?, phone = ?, email = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?
       RETURNING *`
    ).bind(
      body.name,
      body.birth_date || null,
      body.phone || null,
      body.email || null,
      body.notes || null,
      patientId,
      user!.id
    ).first();

    if (!result) {
      return c.json({ error: "Patient not found" }, 404);
    }

    return c.json(result);
  });

  router.delete("/patients/:id", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("id");
    const db = c.env.DB;

    const patient = await db
      .prepare(`SELECT id FROM patients WHERE id = ? AND user_id = ?`)
      .bind(patientId, user!.id)
      .first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    // Delete children in FK-safe order (deepest first)
    await db.prepare(
      `DELETE FROM hep_checkins WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
    ).bind(patientId).run();

    await db.prepare(
      `DELETE FROM hep_access_tokens WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
    ).bind(patientId).run();

    await db.prepare(
      `DELETE FROM hep_exercises WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
    ).bind(patientId).run();

    await db.prepare(`DELETE FROM hep_plans WHERE patient_id = ?`).bind(patientId).run();

    await db.prepare(`DELETE FROM evolutions WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM evaluations WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM caminho WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM appointments WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM report_exports WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM neuroflux_consultations WHERE patient_id = ?`).bind(patientId).run();
    await db.prepare(`DELETE FROM rehab_friend_messages WHERE patient_id = ?`).bind(patientId).run();

    await db.prepare(`DELETE FROM patients WHERE id = ? AND user_id = ?`).bind(patientId, user!.id).run();

    return c.json({ success: true });
  });
}
