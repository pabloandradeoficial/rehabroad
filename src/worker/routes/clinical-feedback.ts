import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../lib/helpers";

// ============================================
// CLINICAL SUGGESTION FEEDBACK
//
// Captures fisio reaction to insights/hypotheses/alerts/HEP signals
// surfaced by Apoio Clínico. Required to calibrate confidence over
// time — without ground truth the engine flies blind.
//
// Schema: see migrations/30.sql.
// ============================================

export const clinicalFeedbackRouter = new Hono<{ Bindings: Env }>();

const SUGGESTION_TYPES = ["insight", "hypothesis", "alert", "hep_signal"] as const;
const FEEDBACK_VALUES = ["useful", "not_applicable", "disagree", "confirmed"] as const;

const feedbackSchema = z.object({
  patient_id: z.number().int().positive(),
  suggestion_type: z.enum(SUGGESTION_TYPES),
  suggestion_key: z.string().min(1).max(200),
  feedback: z.enum(FEEDBACK_VALUES),
  notes: z.string().max(1000).optional(),
  context_snapshot: z.unknown().optional(),
});

// Confirmed only makes sense for diagnostic hypotheses.
function isFeedbackValidForType(
  type: typeof SUGGESTION_TYPES[number],
  feedback: typeof FEEDBACK_VALUES[number],
): boolean {
  if (feedback === "confirmed" && type !== "hypothesis") return false;
  return true;
}

clinicalFeedbackRouter.post(
  "/clinical-feedback",
  authMiddleware,
  zValidator("json", feedbackSchema),
  async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    if (!isFeedbackValidForType(body.suggestion_type, body.feedback)) {
      return c.json(
        { error: "'confirmed' feedback only applies to diagnostic hypotheses" },
        400,
      );
    }

    // Confirm patient ownership before writing — defends against IDOR
    // where a fisio sends another tenant's patient_id.
    const owner = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`,
    )
      .bind(body.patient_id, user!.id)
      .first();

    if (!owner) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const snapshot =
      body.context_snapshot !== undefined ? JSON.stringify(body.context_snapshot) : null;

    // UPSERT — fisio can change their mind. updated_at refreshed on conflict.
    await c.env.DB.prepare(
      `INSERT INTO clinical_suggestion_feedback
         (user_id, patient_id, suggestion_type, suggestion_key, feedback, notes, context_snapshot)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, patient_id, suggestion_type, suggestion_key)
       DO UPDATE SET
         feedback = excluded.feedback,
         notes = excluded.notes,
         context_snapshot = excluded.context_snapshot,
         updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(
        user!.id,
        body.patient_id,
        body.suggestion_type,
        body.suggestion_key,
        body.feedback,
        body.notes ?? null,
        snapshot,
      )
      .run();

    return c.json({ success: true });
  },
);

// Returns all feedback the fisio has ever given for one patient. The
// frontend uses this to render persistent UI state (a card the fisio
// already marked as "útil" stays marked).
clinicalFeedbackRouter.get(
  "/clinical-feedback/:patient_id",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    const patientId = parseInt(c.req.param("patient_id"), 10);
    if (isNaN(patientId)) return c.json({ error: "Invalid patient_id" }, 400);

    const owner = await c.env.DB.prepare(
      `SELECT id FROM patients WHERE id = ? AND user_id = ?`,
    )
      .bind(patientId, user!.id)
      .first();
    if (!owner) return c.json({ error: "Patient not found" }, 404);

    const { results } = await c.env.DB.prepare(
      `SELECT suggestion_type, suggestion_key, feedback, notes, updated_at
       FROM clinical_suggestion_feedback
       WHERE user_id = ? AND patient_id = ?`,
    )
      .bind(user!.id, patientId)
      .all<{
        suggestion_type: string;
        suggestion_key: string;
        feedback: string;
        notes: string | null;
        updated_at: string;
      }>();

    return c.json({ feedback: results });
  },
);

// Aggregate stats — useful for the fisio to see calibration of the
// suggestions they've seen, and for us (eventually) to retune confidence.
// Scoped to the requesting fisio's own data only.
clinicalFeedbackRouter.get(
  "/clinical-feedback-stats",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    const { results } = await c.env.DB.prepare(
      `SELECT
         suggestion_type,
         suggestion_key,
         feedback,
         COUNT(*) AS n
       FROM clinical_suggestion_feedback
       WHERE user_id = ?
       GROUP BY suggestion_type, suggestion_key, feedback
       ORDER BY suggestion_type, suggestion_key, feedback`,
    )
      .bind(user!.id)
      .all<{
        suggestion_type: string;
        suggestion_key: string;
        feedback: string;
        n: number;
      }>();

    return c.json({ stats: results });
  },
);
