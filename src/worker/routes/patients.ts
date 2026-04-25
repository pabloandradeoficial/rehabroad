/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware, getInsertedId, normalizeDelimitedTextValue, splitDelimitedText, normalizeCaminhoRecord } from "../lib/helpers";
import { registerSuporteRoutes } from "./patients/suporte";
import { registerClinicalSummaryRoutes } from "./patients/clinical-summary";

export const patientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  birth_date: z.string().optional().nullable(),
  phone: z.string().max(20, "Telefone deve ter no máximo 20 caracteres").optional().nullable(),
  email: z.string().email("E-mail inválido").or(z.literal("")).optional().nullable(),
  notes: z.string().max(2000, "Notas devem ter no máximo 2000 caracteres").optional().nullable(),
});

export const patientsRouter = new Hono<{ Bindings: Env }>();

registerSuporteRoutes(patientsRouter);
registerClinicalSummaryRoutes(patientsRouter);

// ============================================
// PATIENTS API
// ============================================

patientsRouter.get("/patients", authMiddleware, async (c) => {
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

patientsRouter.get("/patients/:id", authMiddleware, async (c) => {
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

patientsRouter.post("/patients", authMiddleware, zValidator("json", patientSchema), async (c) => {
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

patientsRouter.put("/patients/:id", authMiddleware, zValidator("json", patientSchema), async (c) => {
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

patientsRouter.delete("/patients/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("id");
  const db = c.env.DB;

  // Verify ownership before deleting anything
  const patient = await db
    .prepare(`SELECT id FROM patients WHERE id = ? AND user_id = ?`)
    .bind(patientId, user!.id)
    .first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  // Delete children in FK-safe order (deepest first)
  // 1. hep_checkins references hep_plans and hep_exercises
  await db.prepare(
    `DELETE FROM hep_checkins WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
  ).bind(patientId).run();

  // 2. hep_access_tokens references hep_plans
  await db.prepare(
    `DELETE FROM hep_access_tokens WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
  ).bind(patientId).run();

  // 3. hep_exercises references hep_plans
  await db.prepare(
    `DELETE FROM hep_exercises WHERE plan_id IN (SELECT id FROM hep_plans WHERE patient_id = ?)`
  ).bind(patientId).run();

  // 4. hep_plans references patients (FK constraint — must go before patients)
  await db.prepare(`DELETE FROM hep_plans WHERE patient_id = ?`).bind(patientId).run();

  // 5. Tables with patient_id but no FK constraint
  await db.prepare(`DELETE FROM evolutions WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM evaluations WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM caminho WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM appointments WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM report_exports WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM neuroflux_consultations WHERE patient_id = ?`).bind(patientId).run();
  await db.prepare(`DELETE FROM rehab_friend_messages WHERE patient_id = ?`).bind(patientId).run();

  // 6. Finally delete the patient
  await db.prepare(`DELETE FROM patients WHERE id = ? AND user_id = ?`).bind(patientId, user!.id).run();

  return c.json({ success: true });
});

// ============================================
// EVALUATIONS API
// ============================================

patientsRouter.get("/patients/:patientId/evaluations", authMiddleware, async (c) => {
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

patientsRouter.post("/patients/:patientId/evaluations", authMiddleware, async (c) => {
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

patientsRouter.put("/evaluations/:id", authMiddleware, async (c) => {
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

// ============================================
// CLINICAL INSIGHTS API (Anonymized aggregate data)
// ============================================

patientsRouter.get("/clinical-insights", authMiddleware, async (c) => {
  const painLocation = c.req.query("pain_location") || "";
  const chiefComplaint = c.req.query("chief_complaint") || "";

  if (!painLocation && !chiefComplaint) {
    return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
  }

  const locationKeywords = painLocation.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const complaintKeywords = chiefComplaint.toLowerCase().split(/[\s,]+/).filter(Boolean);

  const likeConditions: string[] = [];
  const likeValues: string[] = [];

  for (const keyword of [...locationKeywords, ...complaintKeywords]) {
    if (keyword.length >= 3) {
      likeConditions.push("(LOWER(pain_location) LIKE ? OR LOWER(chief_complaint) LIKE ?)");
      likeValues.push(`%${keyword}%`, `%${keyword}%`);
    }
  }

  if (likeConditions.length === 0) {
    return c.json({ similarCases: 0, topDiagnoses: [], topTests: [] });
  }

  const countQuery = `SELECT COUNT(*) as count FROM evaluations WHERE ${likeConditions.join(" OR ")}`;
  const countResult = await c.env.DB.prepare(countQuery).bind(...likeValues).first<{ count: number }>();
  const similarCases = countResult?.count || 0;

  const diagnosisQuery = `
    SELECT chief_complaint, COUNT(*) as count
    FROM evaluations
    WHERE chief_complaint IS NOT NULL AND chief_complaint != '' AND (${likeConditions.join(" OR ")})
    GROUP BY chief_complaint
    ORDER BY count DESC
    LIMIT 5
  `;
  const diagnosisResults = await c.env.DB.prepare(diagnosisQuery).bind(...likeValues).all<{ chief_complaint: string; count: number }>();

  const totalDiagnoses = diagnosisResults.results?.reduce((sum, d) => sum + d.count, 0) || 1;
  const topDiagnoses = (diagnosisResults.results || []).slice(0, 3).map(d => ({
    name: d.chief_complaint,
    count: d.count,
    percentage: Math.round((d.count / totalDiagnoses) * 100)
  }));

  const testsQuery = `
    SELECT orthopedic_tests FROM evaluations
    WHERE orthopedic_tests IS NOT NULL AND orthopedic_tests != '' AND (${likeConditions.join(" OR ")})
  `;
  const testsResults = await c.env.DB.prepare(testsQuery).bind(...likeValues).all<{ orthopedic_tests: string }>();

  const testCounts: Record<string, number> = {};
  for (const row of testsResults.results || []) {
    try {
      const tests = JSON.parse(row.orthopedic_tests);
      if (Array.isArray(tests)) {
        for (const test of tests) {
          if (typeof test === 'string' && test.trim()) {
            testCounts[test.trim()] = (testCounts[test.trim()] || 0) + 1;
          }
        }
      }
    } catch {
      const tests = row.orthopedic_tests.split(',').map((t: string) => t.trim()).filter(Boolean);
      for (const test of tests) {
        testCounts[test] = (testCounts[test] || 0) + 1;
      }
    }
  }

  const topTests = Object.entries(testCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  return c.json({ similarCases, topDiagnoses, topTests });
});

// ============================================
// EVOLUTIONS API
// ============================================

patientsRouter.get("/patients/:patientId/evolutions", authMiddleware, async (c) => {
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

patientsRouter.post("/patients/:patientId/evolutions", authMiddleware, async (c) => {
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

patientsRouter.put("/evolutions/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const evolutionId = c.req.param("id");
  const body = await c.req.json();

  const evolution = await c.env.DB.prepare(
    `SELECT e.* FROM evolutions e
     JOIN patients p ON e.patient_id = p.id
     WHERE e.id = ? AND p.user_id = ?`
  ).bind(evolutionId, user!.id).first();

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
    body.session_date || (evolution as any).session_date,
    body.pain_level ?? (evolution as any).pain_level,
    body.functional_status || (evolution as any).functional_status,
    body.procedures || (evolution as any).procedures,
    body.patient_response || (evolution as any).patient_response,
    body.observations || (evolution as any).observations,
    body.attendance_status || (evolution as any).attendance_status,
    evolutionId
  ).first();

  return c.json(result);
});

// ============================================
// CAMINHO (PATHWAY) API
// ============================================

patientsRouter.get("/patients/:patientId/caminho", authMiddleware, async (c) => {
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

patientsRouter.post("/patients/:patientId/caminho", authMiddleware, async (c) => {
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

patientsRouter.get("/patients/:patientId/alertas", authMiddleware, async (c) => {
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

patientsRouter.get("/alertas/overview", authMiddleware, async (c) => {
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

