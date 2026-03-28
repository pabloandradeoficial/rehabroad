import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const patientPortalRouter = new Hono<{ Bindings: Env }>();

// ── Types ─────────────────────────────────────────────────────────────────────

type PatientRow = {
  id: number;
  name: string;
  patient_notes: string | null;
  user_id: string;
};

type HepPlanRow = {
  id: number;
  patient_id: number;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  diagnostico_explicado: string | null;
  orientacoes: string | null;
  metas: string | null;
};

type HepExerciseRow = {
  id: number;
  plan_id: number;
  exercise_name: string;
  exercise_category: string | null;
  sets: number | null;
  reps: string | null;
  frequency: string | null;
  instructions: string | null;
  order_index: number;
  created_at: string;
};

type HepCheckinRow = {
  id: number;
  plan_id: number;
  exercise_id: number;
  completed: number;
  pain_level: number | null;
  difficulty: string | null;
  notes: string | null;
  checked_at: string;
};

type PatientCommentRow = {
  id: number;
  patient_id: number;
  hep_plan_id: number | null;
  hep_exercise_id: number | null;
  section: string | null;
  comment: string;
  created_at: string;
  read_by_therapist: number;
};

// ── Helper: find patient by authenticated user's email ────────────────────────

async function findPatientByEmail(db: D1Database, email: string): Promise<PatientRow | null> {
  return db
    .prepare("SELECT id, name, patient_notes, user_id FROM patients WHERE LOWER(email) = LOWER(?) LIMIT 1")
    .bind(email)
    .first<PatientRow>();
}

// ── GET /api/patient-portal/me ────────────────────────────────────────────────
// Check whether the authenticated Supabase user is a registered patient.

patientPortalRouter.get("/patient-portal/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  const patient = await findPatientByEmail(db, user.email);

  if (!patient) {
    return c.json({ isPatient: false }, 200);
  }

  return c.json({
    isPatient: true,
    patientId: patient.id,
    patientName: patient.name,
    patientNotes: patient.patient_notes,
  }, 200);
});

// ── GET /api/patient-portal/plan ──────────────────────────────────────────────
// Returns the most recent active HEP plan + exercises + last-7-days checkins.

patientPortalRouter.get("/patient-portal/plan", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  const patient = await findPatientByEmail(db, user.email);
  if (!patient) {
    return c.json({ error: "Not a registered patient" }, 403);
  }

  const plan = await db
    .prepare(
      "SELECT * FROM hep_plans WHERE patient_id = ? AND status = 'active' ORDER BY updated_at DESC LIMIT 1"
    )
    .bind(patient.id)
    .first<HepPlanRow>();

  if (!plan) {
    return c.json({ plan: null, exercises: [], checkins: [] }, 200);
  }

  const exercisesResult = await db
    .prepare("SELECT * FROM hep_exercises WHERE plan_id = ? ORDER BY order_index ASC")
    .bind(plan.id)
    .all<HepExerciseRow>();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const checkinsResult = await db
    .prepare(
      "SELECT * FROM hep_checkins WHERE plan_id = ? AND checked_at >= ? ORDER BY checked_at DESC"
    )
    .bind(plan.id, sevenDaysAgo)
    .all<HepCheckinRow>();

  const commentsResult = await db
    .prepare(
      "SELECT * FROM patient_comments WHERE patient_id = ? AND hep_plan_id = ? ORDER BY created_at DESC LIMIT 20"
    )
    .bind(patient.id, plan.id)
    .all<PatientCommentRow>();

  return c.json({
    plan,
    exercises: exercisesResult.results,
    checkins: checkinsResult.results,
    comments: commentsResult.results,
  }, 200);
});

// ── POST /api/patient-portal/checkin ─────────────────────────────────────────
// Submit a check-in for an exercise in the patient's active plan.

patientPortalRouter.post("/patient-portal/checkin", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  const patient = await findPatientByEmail(db, user.email);
  if (!patient) {
    return c.json({ error: "Not a registered patient" }, 403);
  }

  const body = await c.req.json() as {
    plan_id: number;
    exercise_id: number;
    completed: boolean;
    pain_level?: number | null;
    difficulty?: string | null;
    notes?: string | null;
  };

  // Verify plan belongs to this patient
  const plan = await db
    .prepare("SELECT id FROM hep_plans WHERE id = ? AND patient_id = ?")
    .bind(body.plan_id, patient.id)
    .first<{ id: number }>();

  if (!plan) {
    return c.json({ error: "Plan not found or access denied" }, 404);
  }

  const result = await db
    .prepare(
      "INSERT INTO hep_checkins (plan_id, exercise_id, completed, pain_level, difficulty, notes) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      body.plan_id,
      body.exercise_id,
      body.completed ? 1 : 0,
      body.pain_level ?? null,
      body.difficulty ?? null,
      body.notes ?? null
    )
    .run();

  return c.json({ success: true, checkinId: result.meta?.last_row_id ?? null }, 201);
});

// ── POST /api/patient-portal/comment ─────────────────────────────────────────
// Patient sends a question/comment about a section or exercise.

patientPortalRouter.post("/patient-portal/comment", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  const patient = await findPatientByEmail(db, user.email);
  if (!patient) {
    return c.json({ error: "Not a registered patient" }, 403);
  }

  const body = await c.req.json() as {
    hep_plan_id: number;
    hep_exercise_id?: number | null;
    section?: string | null;
    comment: string;
  };

  if (!body.comment?.trim()) {
    return c.json({ error: "comment é obrigatório" }, 400);
  }

  // Verify the plan belongs to this patient
  const plan = await db
    .prepare("SELECT id FROM hep_plans WHERE id = ? AND patient_id = ?")
    .bind(body.hep_plan_id, patient.id)
    .first<{ id: number }>();

  if (!plan) {
    return c.json({ error: "Plano não encontrado" }, 404);
  }

  const result = await db
    .prepare(
      `INSERT INTO patient_comments (patient_id, hep_plan_id, hep_exercise_id, section, comment)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      patient.id,
      body.hep_plan_id,
      body.hep_exercise_id ?? null,
      body.section ?? null,
      body.comment.trim()
    )
    .run();

  return c.json({ success: true, id: result.meta?.last_row_id ?? null }, 201);
});
