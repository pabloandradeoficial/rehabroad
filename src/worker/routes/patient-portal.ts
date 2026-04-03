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
  // If multiple patients share the same email, prefer the one with an active HEP plan,
  // then fall back to the most recently created one.
  return db
    .prepare(`
      SELECT p.id, p.name, p.patient_notes, p.user_id
      FROM patients p
      WHERE LOWER(p.email) = LOWER(?)
      ORDER BY (
        SELECT COUNT(*) FROM hep_plans hp
        WHERE hp.patient_id = p.id AND hp.status = 'active'
      ) DESC, p.id DESC
      LIMIT 1
    `)
    .bind(email)
    .first<PatientRow>();
}

// ── GET /api/patient-portal/me ────────────────────────────────────────────────
// Check whether the authenticated Supabase user is a registered patient.
// Therapists always take priority: if the email exists in user_profiles, treat
// the user as a therapist regardless of the patients table.

patientPortalRouter.get("/patient-portal/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const db = c.env.DB;

  // If this email belongs to a therapist, never redirect to /patient
  const therapist = await db
    .prepare("SELECT id FROM user_profiles WHERE LOWER(email) = LOWER(?) LIMIT 1")
    .bind(user.email)
    .first<{ id: string }>();

  if (therapist) {
    return c.json({ isPatient: false }, 200);
  }

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

  // Fetch last-7-days checkins for all exercises in one query, grouped by exercise + day.
  // Using date() ensures a clean daily reset — each UTC day starts fresh.
  const checkinSummaryResult = await db
    .prepare(`
      SELECT exercise_id, date(checked_at) AS dia, MAX(completed) AS completed
      FROM hep_checkins
      WHERE plan_id = ? AND checked_at >= datetime('now', '-7 days')
      GROUP BY exercise_id, date(checked_at)
      ORDER BY exercise_id, dia ASC
    `)
    .bind(plan.id)
    .all<{ exercise_id: number; dia: string; completed: number }>();

  const today = new Date().toISOString().slice(0, 10);

  // Build per-exercise history map
  const historyMap = new Map<number, { dia: string; completed: boolean }[]>();
  for (const row of checkinSummaryResult.results) {
    if (!historyMap.has(row.exercise_id)) historyMap.set(row.exercise_id, []);
    historyMap.get(row.exercise_id)!.push({ dia: row.dia, completed: row.completed === 1 });
  }

  // Enrich each exercise with daily history and today's status
  const exercises = exercisesResult.results.map((ex) => {
    const checkins7dias = historyMap.get(ex.id) ?? [];
    return {
      ...ex,
      feitoHoje: checkins7dias.some((h) => h.dia === today && h.completed),
      checkins7dias,
    };
  });

  const commentsResult = await db
    .prepare(
      "SELECT * FROM patient_comments WHERE patient_id = ? AND hep_plan_id = ? ORDER BY created_at DESC LIMIT 20"
    )
    .bind(patient.id, plan.id)
    .all<PatientCommentRow>();

  return c.json({
    plan,
    exercises,
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

  // Also persist to logs_exercicios for PBE/adherence analytics
  await db
    .prepare(
      `INSERT INTO logs_exercicios (patient_id, exercicio_id, plano_id, concluido, nivel_dor, nivel_esforco, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      patient.id,
      body.exercise_id,
      body.plan_id,
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
