/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// ALERTAS (ALERTS) API
// ============================================

function calculateAlertStatus(initialEval: any, evolutions: any[]): {
  status: "green" | "yellow" | "red";
  color: string;
  message: string;
  details: string[];
} {
  const details: string[] = [];

  if (!initialEval) {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Avaliação inicial pendente",
      details: ["Complete a avaliação inicial para acompanhar a evolução do paciente."]
    };
  }

  if (evolutions.length === 0) {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Aguardando primeira evolução",
      details: ["Registre a primeira sessão de evolução para iniciar o monitoramento."]
    };
  }

  const initialPain = initialEval.pain_level || 0;
  const lastEvolution = evolutions[evolutions.length - 1];
  const currentPain = lastEvolution.pain_level || 0;
  const painDiff = initialPain - currentPain;

  const recentEvolutions = evolutions.slice(-3);
  let trend = "stable";
  if (recentEvolutions.length >= 2) {
    const painValues = recentEvolutions.map((e: any) => e.pain_level || 0);
    const firstPain = painValues[0];
    const lastPain = painValues[painValues.length - 1];
    if (lastPain < firstPain) trend = "improving";
    else if (lastPain > firstPain) trend = "worsening";
  }

  details.push(`Dor inicial: ${initialPain}/10`);
  details.push(`Dor atual: ${currentPain}/10`);
  details.push(`Sessões registradas: ${evolutions.length}`);

  if (painDiff >= 3 || (currentPain <= 3 && trend === "improving")) {
    return {
      status: "green",
      color: "#22c55e",
      message: "Evolução adequada",
      details: [...details, "Paciente apresenta melhora significativa."]
    };
  }

  if (painDiff >= 1 || trend === "stable") {
    return {
      status: "yellow",
      color: "#eab308",
      message: "Atenção - evolução lenta",
      details: [...details, "Considerar reavaliação do plano terapêutico."]
    };
  }

  return {
    status: "red",
    color: "#ef4444",
    message: "Alerta - estagnação ou piora",
    details: [...details, "Recomenda-se reavaliação urgente do paciente."]
  };
}

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
    ).bind(patientId).all();

    const initialEval = await c.env.DB.prepare(
      `SELECT * FROM evaluations WHERE patient_id = ? AND type = 'initial' ORDER BY created_at ASC LIMIT 1`
    ).bind(patientId).first();

    const alertStatus = calculateAlertStatus(initialEval, evolutions as any[]);

    return c.json({
      status: alertStatus.status,
      color: alertStatus.color,
      message: alertStatus.message,
      details: alertStatus.details,
      evolutionCount: evolutions.length,
      lastEvolution: evolutions.length > 0 ? evolutions[evolutions.length - 1] : null
    });
  });

  router.get("/alertas/overview", authMiddleware, async (c) => {
    const user = c.get("user");

    const { results: patients } = await c.env.DB.prepare(
      `SELECT p.*,
       (SELECT COUNT(*) FROM evolutions WHERE patient_id = p.id) as evolution_count,
       (SELECT pain_level FROM evolutions WHERE patient_id = p.id ORDER BY session_date DESC LIMIT 1) as last_pain_level,
       (SELECT pain_level FROM evaluations WHERE patient_id = p.id AND type = 'initial' ORDER BY created_at ASC LIMIT 1) as initial_pain_level
       FROM patients p WHERE p.user_id = ?`
    ).bind(user!.id).all();

    const overview = patients.map((patient: any) => {
      let status: "green" | "yellow" | "red" = "yellow";
      let message = "Aguardando avaliação";

      if (patient.initial_pain_level !== null && patient.last_pain_level !== null) {
        const improvement = patient.initial_pain_level - patient.last_pain_level;
        if (improvement >= 2) {
          status = "green";
          message = "Evolução adequada";
        } else if (improvement >= 0) {
          status = "yellow";
          message = "Evolução lenta";
        } else {
          status = "red";
          message = "Atenção - possível piora";
        }
      } else if (patient.evolution_count === 0) {
        status = "yellow";
        message = "Sem evoluções registradas";
      }

      return {
        id: patient.id,
        name: patient.name,
        status,
        message,
        evolutionCount: patient.evolution_count
      };
    });

    return c.json(overview);
  });
}
