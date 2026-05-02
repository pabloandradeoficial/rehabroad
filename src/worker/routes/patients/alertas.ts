import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";
import {
  computeTrend,
  computeSeverity,
  computePhase,
  computeTreatmentStatus,
  type EvolutionPoint,
  type InitialEvalPoint,
} from "../../lib/clinical-engine";

// ============================================
// ALERTAS (ALERTS) API
//
// Status (green/yellow/red) for patient overview cards. Uses the single
// clinical engine — same rules as Apoio Clínico's other surfaces.
// ============================================

interface InitialEval extends InitialEvalPoint {
  pain_level: number | null;
  created_at?: string;
  functional_status?: string | null;
}

interface EvolutionRow extends EvolutionPoint {
  pain_level: number | null;
  patient_response: string | null;
  session_date?: string;
}

const STATUS_COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  pending: "#eab308",
} as const;

export function registerAlertasRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/alertas", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");

    const patient = await c.env.DB.prepare(
      `SELECT * FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first();

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const { results: evolutions } = await c.env.DB.prepare(
      `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
    ).bind(patientId).all<EvolutionRow>();

    const initialEval = await c.env.DB.prepare(
      `SELECT * FROM evaluations WHERE patient_id = ? AND type = 'initial' ORDER BY created_at ASC LIMIT 1`
    ).bind(patientId).first<InitialEval>();

    const phase = computePhase(initialEval ?? null, evolutions);
    const trend = computeTrend(initialEval ?? null, evolutions);
    const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] : null;
    const currentPain = lastEvolution?.pain_level ?? initialEval?.pain_level ?? null;
    const severity = computeSeverity(currentPain, trend, phase, initialEval?.functional_status);
    const status = computeTreatmentStatus(trend, severity, evolutions.length, !!initialEval);

    const details: string[] = [];
    if (trend.initial != null) details.push(`Dor inicial: ${trend.initial}/10`);
    if (trend.current != null) details.push(`Dor atual: ${trend.current}/10`);
    details.push(`Sessões registradas: ${evolutions.length}`);
    if (status.reason) details.push(status.reason);

    return c.json({
      status: status.status,
      color: STATUS_COLORS[status.status],
      message: status.message,
      details,
      evolutionCount: evolutions.length,
      lastEvolution,
      // New engine outputs — surfaces are free to read these directly so we
      // never recompute the same thing two ways again.
      trend,
      severity,
      phase,
    });
  });

  router.get("/alertas/overview", authMiddleware, async (c) => {
    const user = c.get("user");

    const { results: patients } = await c.env.DB.prepare(
      `SELECT p.*,
       (SELECT COUNT(*) FROM evolutions WHERE patient_id = p.id) as evolution_count,
       (SELECT pain_level FROM evolutions WHERE patient_id = p.id ORDER BY session_date DESC LIMIT 1) as last_pain_level,
       (SELECT pain_level FROM evaluations WHERE patient_id = p.id AND type = 'initial' ORDER BY created_at ASC LIMIT 1) as initial_pain_level,
       (SELECT created_at FROM evaluations WHERE patient_id = p.id AND type = 'initial' ORDER BY created_at ASC LIMIT 1) as initial_eval_created_at
       FROM patients p WHERE p.user_id = ?`
    ).bind(user!.id).all<{
      id: number;
      name: string;
      evolution_count: number;
      last_pain_level: number | null;
      initial_pain_level: number | null;
      initial_eval_created_at: string | null;
    }>();

    type OverviewPatient = {
      id: number;
      name: string;
      evolution_count: number;
      last_pain_level: number | null;
      initial_pain_level: number | null;
      initial_eval_created_at: string | null;
    };

    // Per-patient: build minimal engine inputs from the aggregated query.
    // We only have 2 pain points per patient (initial + last) — that's the
    // "current-vs-initial" basis in the engine, sufficient for an overview.
    const overview = patients.map((p: OverviewPatient) => {
      const hasEval = p.initial_pain_level != null || !!p.initial_eval_created_at;
      const synthEvolutions =
        p.last_pain_level != null
          ? [{ pain_level: p.last_pain_level } as EvolutionPoint]
          : [];
      const synthInitial: InitialEvalPoint | null = hasEval
        ? {
            pain_level: p.initial_pain_level,
            created_at: p.initial_eval_created_at ?? undefined,
          }
        : null;
      const phase = computePhase(synthInitial, synthEvolutions);
      const trend = computeTrend(synthInitial, synthEvolutions);
      const currentPain = p.last_pain_level ?? p.initial_pain_level ?? null;
      const severity = computeSeverity(currentPain, trend, phase, null);
      const status = computeTreatmentStatus(trend, severity, p.evolution_count, hasEval);

      return {
        id: p.id,
        name: p.name,
        status: status.status,
        message: status.message,
        evolutionCount: p.evolution_count,
      };
    });

    return c.json(overview);
  });
}
