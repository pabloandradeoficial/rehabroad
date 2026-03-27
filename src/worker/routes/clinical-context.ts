import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const clinicalContextRouter = new Hono<{ Bindings: Env }>();

interface PatientRow {
  id: number;
  name: string;
  birth_date: string | null;
  created_at: string;
}

interface EvaluationRow {
  id: number;
  chief_complaint: string | null;
  pain_level: number | null;
  pain_location: string | null;
  functional_status: string | null;
  orthopedic_tests: string | null;
  history: string | null;
  created_at: string;
}

interface EvolutionRow {
  id: number;
  pain_level: number | null;
  procedures: string | null;
  patient_response: string | null;
  session_date: string;
  created_at: string;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function calcAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const now = new Date();
  const birth = new Date(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function parseProcedures(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /api/clinical-context/:patient_id
clinicalContextRouter.get("/clinical-context/:patient_id", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const patientId = c.req.param("patient_id");

  const patient = await c.env.DB.prepare(
    `SELECT id, name, birth_date, created_at FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user.id).first<PatientRow>();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  // Latest evaluation (DESC → first row is most recent)
  const latestEval = await c.env.DB.prepare(
    `SELECT id, chief_complaint, pain_level, pain_location, functional_status, orthopedic_tests, history, created_at
     FROM evaluations WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1`
  ).bind(patientId).first<EvaluationRow>();

  // All evolutions ordered chronologically
  const { results: evolutions } = await c.env.DB.prepare(
    `SELECT id, pain_level, procedures, patient_response, session_date, created_at
     FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
  ).bind(patientId).all<EvolutionRow>();

  const totalSessions = evolutions.length;
  const lastEvolution = totalSessions > 0 ? evolutions[totalSessions - 1] : null;
  const firstEvolution = totalSessions > 0 ? evolutions[0] : null;

  const painLevels = evolutions
    .filter((e) => e.pain_level !== null)
    .map((e) => e.pain_level as number);

  const initialPainLevel = firstEvolution?.pain_level ?? latestEval?.pain_level ?? null;
  const currentPainLevel = lastEvolution?.pain_level ?? latestEval?.pain_level ?? null;

  // Pain trend: compare first-3 avg vs last-3 avg
  let painTrend: "improving" | "worsening" | "stable" = "stable";
  if (painLevels.length >= 2) {
    const firstAvg = avg(painLevels.slice(0, 3));
    const lastAvg = avg(painLevels.slice(-3));
    const diff = firstAvg - lastAvg;
    if (diff > 1.5) painTrend = "improving";
    else if (diff < -1.5) painTrend = "worsening";
  }

  // Deduplicated procedures list
  const allProcedures = evolutions.flatMap((e) => parseProcedures(e.procedures));
  const proceduresUsed = [...new Set(allProcedures)].slice(0, 20);

  // Not improving: last-3 avg >= (previous-3 avg - 0.5)
  const notImproving = (() => {
    if (painLevels.length < 3) return false;
    const last3 = painLevels.slice(-3);
    const ref = painLevels.length >= 6 ? painLevels.slice(-6, -3) : painLevels.slice(0, 3);
    return avg(last3) >= avg(ref) - 0.5;
  })();

  const last3Pain = painLevels.slice(-3);
  const averagePainLast3Sessions =
    last3Pain.length > 0 ? Math.round(avg(last3Pain) * 10) / 10 : null;

  // Clinical phase flags (based on days since latest evaluation/patient creation)
  const referenceDate = latestEval?.created_at ?? patient.created_at;
  const daysSinceEval = Math.floor(
    (Date.now() - new Date(referenceDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const highPain = (currentPainLevel ?? 0) >= 7;
  const isAcute = daysSinceEval <= 7;
  const isSubacute = daysSinceEval > 7 && daysSinceEval <= 21;
  const isChronic = daysSinceEval > 21;

  return c.json({
    patient: {
      id: patient.id,
      name: patient.name,
      age: calcAge(patient.birth_date),
    },
    latestEvaluation: latestEval
      ? {
          chief_complaint: latestEval.chief_complaint,
          pain_level: latestEval.pain_level,
          pain_location: latestEval.pain_location,
          functional_status: latestEval.functional_status,
          orthopedic_tests: latestEval.orthopedic_tests,
          history: latestEval.history,
          created_at: latestEval.created_at,
        }
      : null,
    evolutionSummary: {
      totalSessions,
      lastSessionDate: lastEvolution?.session_date ?? null,
      initialPainLevel,
      currentPainLevel,
      painTrend,
      proceduresUsed,
      lastPatientResponse: lastEvolution?.patient_response ?? null,
      averagePainLast3Sessions,
    },
    clinicalFlags: {
      isAcute,
      isSubacute,
      isChronic,
      highPain,
      notImproving,
      fewSessions: totalSessions < 3,
    },
  });
});
