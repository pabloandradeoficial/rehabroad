/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware, getInsertedId, normalizeDelimitedTextValue, splitDelimitedText, normalizeCaminhoRecord } from "../lib/helpers";

export const patientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  birth_date: z.string().optional().nullable(),
  phone: z.string().max(20, "Telefone deve ter no máximo 20 caracteres").optional().nullable(),
  email: z.string().email("E-mail inválido").or(z.literal("")).optional().nullable(),
  notes: z.string().max(2000, "Notas devem ter no máximo 2000 caracteres").optional().nullable(),
});

export const patientsRouter = new Hono<{ Bindings: Env }>();

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
// SUPORTE (SUPPORT) API - Read Only
// ============================================

// Types for structured clinical support
interface ClinicalInsight {
  category: "pain" | "progression" | "region" | "caminho" | "evolution" | "alert";
  priority: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  actions?: string[];
}

interface DiagnosticHypothesis {
  condition: string;
  confidence: "alta" | "média" | "baixa";
  reasoning: string[];
  differentials: string[];
  suggestedTests: string[];
}

interface StructuredSuporte {
  painStatus: {
    level: number | null;
    severity: "none" | "low" | "moderate" | "high";
    trend: "improving" | "stable" | "worsening" | null;
    changePercent: number | null;
  };
  insights: ClinicalInsight[];
  nextSteps: string[];
  diagnosticHypotheses: DiagnosticHypothesis[];
}

function generateStructuredSuporte(evaluation: any, caminho: any, evolution: any): StructuredSuporte {
  const insights: ClinicalInsight[] = [];
  const nextSteps: string[] = [];

  const painLevel = evolution?.pain_level ?? evaluation?.pain_level;
  const initialPain = evaluation?.pain_level;
  const currentPain = evolution?.pain_level;
  const painLocation = evaluation?.pain_location || "";
  const chiefComplaint = evaluation?.chief_complaint || "";

  let severity: "none" | "low" | "moderate" | "high" = "none";
  let trend: "improving" | "stable" | "worsening" | null = null;
  let changePercent: number | null = null;

  if (painLevel !== null && painLevel !== undefined) {
    if (painLevel >= 7) severity = "high";
    else if (painLevel >= 4) severity = "moderate";
    else if (painLevel >= 1) severity = "low";
    else severity = "none";

    if (initialPain !== null && currentPain !== null) {
      const diff = initialPain - currentPain;
      if (diff > 0) {
        trend = "improving";
        changePercent = Math.round((diff / initialPain) * 100);
      } else if (diff < 0) {
        trend = "worsening";
        changePercent = Math.round((Math.abs(diff) / initialPain) * 100);
      } else {
        trend = "stable";
        changePercent = 0;
      }
    }
  }

  if (!evaluation) {
    insights.push({
      category: "alert",
      priority: "info",
      title: "Avaliação Pendente",
      description: "Complete a avaliação inicial para ativar o apoio clínico.",
      actions: ["Registrar queixa principal", "Documentar EVA inicial", "Exame físico"]
    });
  } else {
    if (severity === "high") {
      insights.push({
        category: "pain",
        priority: "high",
        title: "Dor Intensa",
        description: "Priorizar analgesia antes de exercícios intensos.",
        actions: ["TENS 100-150Hz", "Crioterapia 15-20min", "Mobilização neural suave"]
      });
    } else if (severity === "moderate") {
      insights.push({
        category: "pain",
        priority: "medium",
        title: "Dor Moderada",
        description: "Fase adequada para combinar analgesia com cinesioterapia.",
        actions: ["Terapia manual graus I-II", "Alongamentos suaves", "Isometria progressiva"]
      });
    } else if (severity === "low") {
      insights.push({
        category: "pain",
        priority: "low",
        title: "Dor Leve",
        description: "Momento ideal para progressão funcional.",
        actions: ["Fortalecimento isotônico", "Propriocepção", "Retorno às atividades"]
      });
    }

    if (trend === "improving" && changePercent) {
      insights.push({
        category: "progression",
        priority: "low",
        title: "Evolução Positiva",
        description: `Redução de ${changePercent}% na dor. Manter abordagem atual.`,
        actions: ["Progressão gradual de cargas", "Documentar técnicas eficazes"]
      });
    } else if (trend === "worsening") {
      insights.push({
        category: "progression",
        priority: "high",
        title: "Atenção: Piora",
        description: "Paciente com aumento da dor. Reavaliar conduta.",
        actions: ["Verificar sobrecarga", "Considerar nova avaliação", "Ajustar plano"]
      });
    }

    const regiaoLower = painLocation.toLowerCase();
    if (regiaoLower.includes("ombro") || regiaoLower.includes("shoulder")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Ombro",
        description: "Atenção à estabilidade escapular e manguito rotador.",
        actions: ["Testes de Neer/Hawkins", "Fortalecimento serrátil", "Mobilidade glenoumeral"]
      });
    } else if (regiaoLower.includes("coluna") || regiaoLower.includes("lombar") || regiaoLower.includes("cervical")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Coluna",
        description: "Avaliar padrão de dor e controle motor profundo.",
        actions: ["Estabilização segmentar", "Avaliação postural", "Orientação ergonômica"]
      });
    } else if (regiaoLower.includes("joelho") || regiaoLower.includes("knee")) {
      insights.push({
        category: "region",
        priority: "info",
        title: "Joelho",
        description: "Avaliar alinhamento e controle neuromuscular.",
        actions: ["Exercícios CCA/CCF", "Propriocepção", "Análise da marcha"]
      });
    }

    if (caminho?.red_flags && caminho.red_flags !== "none") {
      insights.push({
        category: "alert",
        priority: "high",
        title: "Red Flags",
        description: "Sinais de alerta identificados. Considerar encaminhamento.",
        actions: ["Avaliação médica", "Exames complementares", "Documentar conduta"]
      });
    }

    if (evolution) {
      if (evolution.patient_response === "positive") {
        nextSteps.push("Manter abordagem atual");
        nextSteps.push("Considerar progressão de cargas");
      } else if (evolution.patient_response === "negative") {
        insights.push({
          category: "evolution",
          priority: "high",
          title: "Resposta Negativa",
          description: "Paciente não responde ao tratamento atual.",
          actions: ["Reavaliação completa", "Ajuste de técnicas", "Avaliar fatores psicossociais"]
        });
      }
    }

    if (chiefComplaint.toLowerCase().includes("crônic") || chiefComplaint.toLowerCase().includes("meses")) {
      insights.push({
        category: "alert",
        priority: "info",
        title: "Condição Crônica",
        description: "Considerar abordagem biopsicossocial.",
        actions: ["Educação em dor", "Pacing de atividades", "Expectativas realistas"]
      });
    }
  }

  if (nextSteps.length === 0) {
    if (!evaluation) {
      nextSteps.push("Completar avaliação inicial");
    } else if (!caminho) {
      nextSteps.push("Preencher módulo Caminho");
    } else if (!evolution) {
      nextSteps.push("Registrar primeira evolução");
    } else {
      nextSteps.push("Continuar plano terapêutico");
    }
  }

  const diagnosticHypotheses = generateDiagnosticHypotheses(evaluation, caminho, evolution);

  return {
    painStatus: { level: painLevel ?? null, severity, trend, changePercent },
    insights,
    nextSteps,
    diagnosticHypotheses
  };
}

function generateDiagnosticHypotheses(evaluation: any, caminho: any): DiagnosticHypothesis[] {
  const hypotheses: DiagnosticHypothesis[] = [];

  if (!evaluation) return hypotheses;

  const painLocation = (evaluation.pain_location || "").toLowerCase();
  const chiefComplaint = (evaluation.chief_complaint || "").toLowerCase();

  const painPatterns = splitDelimitedText(caminho?.pain_pattern ?? caminho?.pain_patterns);
  const aggravatingFactors = splitDelimitedText(caminho?.aggravating_factors);
  const relievingFactors = splitDelimitedText(caminho?.relieving_factors);
  const functionalLimitations = splitDelimitedText(caminho?.functional_limitations);
  const redFlags = splitDelimitedText(caminho?.red_flags);

  // ========== SHOULDER CONDITIONS ==========
  if (painLocation.includes("ombro") || painLocation.includes("shoulder") || painLocation.includes("deltóide") || painLocation.includes("deltoide")) {
    const impactReasons: string[] = [];
    if (aggravatingFactors.some((f: string) =>
      f.includes("elevação") || f.includes("acima") || f.includes("levantar") ||
      f.includes("erguer") || f.includes("braço") || f.includes("alto") ||
      f.includes("pentear") || f.includes("vestir") || f.includes("alcançar"))) {
      impactReasons.push("Dor ao elevar o braço acima de 90°");
    }
    if (painPatterns.some((p: string) => p.includes("movimento") || p.includes("mexer") || p.includes("mover"))) {
      impactReasons.push("Dor relacionada ao movimento");
    }
    if (chiefComplaint.includes("arco doloroso") || chiefComplaint.includes("abdução") ||
        chiefComplaint.includes("abrir o braço") || chiefComplaint.includes("lateral")) {
      impactReasons.push("Arco doloroso na abdução");
    }
    if (impactReasons.length >= 1) {
      hypotheses.push({
        condition: "Síndrome do Impacto do Ombro",
        confidence: impactReasons.length >= 2 ? "alta" : "média",
        reasoning: impactReasons.length > 0 ? impactReasons : ["Localização de dor compatível"],
        differentials: ["Tendinopatia do Manguito Rotador", "Bursite Subacromial", "Capsulite Adesiva"],
        suggestedTests: ["Teste de Neer", "Teste de Hawkins-Kennedy", "Teste de Jobe"]
      });
    }

    const capsuliteReasons: string[] = [];
    if (functionalLimitations.some((l: string) =>
      l.includes("rotação") || l.includes("rigidez") || l.includes("duro") ||
      l.includes("preso") || l.includes("limitado") || l.includes("não consegue"))) {
      capsuliteReasons.push("Limitação de rotação externa");
    }
    if (chiefComplaint.includes("congelado") || chiefComplaint.includes("rígido") ||
        chiefComplaint.includes("travado") || chiefComplaint.includes("preso") ||
        chiefComplaint.includes("não mexe") || chiefComplaint.includes("duro") ||
        chiefComplaint.includes("trancado")) {
      capsuliteReasons.push("Relato de ombro congelado/travado");
    }
    if (painPatterns.some((p: string) =>
      p.includes("noturna") || p.includes("repouso") || p.includes("dormir") ||
      p.includes("noite") || p.includes("deitar"))) {
      capsuliteReasons.push("Dor noturna significativa");
    }
    if (capsuliteReasons.length >= 1) {
      hypotheses.push({
        condition: "Capsulite Adesiva (Ombro Congelado)",
        confidence: capsuliteReasons.length >= 2 ? "alta" : "média",
        reasoning: capsuliteReasons,
        differentials: ["Artrose Glenoumeral", "Lesão SLAP", "Síndrome do Impacto"],
        suggestedTests: ["Amplitude de Movimento Passiva", "Rotação Externa Passiva", "Teste de Apley"]
      });
    }
  }

  // ========== LUMBAR CONDITIONS ==========
  if (painLocation.includes("lombar") || painLocation.includes("lumbar") || painLocation.includes("coluna") ||
      painLocation.includes("costas") || painLocation.includes("dorso")) {
    const herniaReasons: string[] = [];
    if (aggravatingFactors.some((f: string) =>
      f.includes("sentar") || f.includes("flexão") || f.includes("dobrar") ||
      f.includes("inclinar") || f.includes("frente"))) {
      herniaReasons.push("Piora com flexão/sentado");
    }
    if (chiefComplaint.includes("irradiação") || chiefComplaint.includes("irradia") ||
        chiefComplaint.includes("descendo") || chiefComplaint.includes("perna") ||
        chiefComplaint.includes("ciático") || chiefComplaint.includes("formigamento")) {
      herniaReasons.push("Dor com irradiação para membros inferiores");
    }
    if (herniaReasons.length >= 1) {
      hypotheses.push({
        condition: "Hérnia Discal Lombar / Síndrome Radicular",
        confidence: herniaReasons.length >= 2 ? "alta" : "média",
        reasoning: herniaReasons,
        differentials: ["Estenose de Canal", "Lombalgia Mecânica", "Síndrome Piriforme"],
        suggestedTests: ["Teste de Lasègue", "Teste SLUMP", "Sinal de Bragard"]
      });
    }

    const lombarReasons: string[] = ["Localização lombar compatível"];
    if (aggravatingFactors.some((f: string) =>
      f.includes("movimento") || f.includes("carregar") || f.includes("levantar") ||
      f.includes("trabalho") || f.includes("atividade"))) {
      lombarReasons.push("Piora com atividades funcionais");
    }
    if (relievingFactors.some((f: string) =>
      f.includes("repouso") || f.includes("deitar") || f.includes("descanso"))) {
      lombarReasons.push("Alívio com repouso");
    }
    if (lombarReasons.length >= 1 && herniaReasons.length === 0) {
      hypotheses.push({
        condition: "Lombalgia Mecânica Inespecífica",
        confidence: "média",
        reasoning: lombarReasons,
        differentials: ["Hérnia Discal", "Estenose", "Síndrome Facetária"],
        suggestedTests: ["Avaliação Postural", "Teste de Flexão Lombar", "Palpação Paravertebral"]
      });
    }
  }

  // ========== KNEE CONDITIONS ==========
  if (painLocation.includes("joelho") || painLocation.includes("knee") || painLocation.includes("patelá") ||
      painLocation.includes("patela") || painLocation.includes("perna")) {
    const lca_reasons: string[] = [];
    if (chiefComplaint.includes("instabilidade") || chiefComplaint.includes("falha") ||
        chiefComplaint.includes("cede") || chiefComplaint.includes("travamento") ||
        chiefComplaint.includes("torção") || chiefComplaint.includes("torceu")) {
      lca_reasons.push("Relato de instabilidade/episódio de torção");
    }
    if (aggravatingFactors.some((f: string) =>
      f.includes("pivotar") || f.includes("mudar direção") || f.includes("correr") ||
      f.includes("saltar") || f.includes("descer escada"))) {
      lca_reasons.push("Instabilidade em atividades de pivô");
    }
    if (lca_reasons.length >= 1) {
      hypotheses.push({
        condition: "Lesão do Ligamento Cruzado Anterior",
        confidence: lca_reasons.length >= 2 ? "alta" : "média",
        reasoning: lca_reasons,
        differentials: ["Lesão Meniscal", "Lesão LCM", "Luxação Patelar"],
        suggestedTests: ["Teste de Lachman", "Teste da Gaveta Anterior", "Teste Pivot Shift"]
      });
    }

    const meniscalReasons: string[] = [];
    if (chiefComplaint.includes("estalos") || chiefComplaint.includes("travamento") ||
        chiefComplaint.includes("derrame") || chiefComplaint.includes("inchaço") ||
        chiefComplaint.includes("linha do joelho")) {
      meniscalReasons.push("Sintomas mecânicos típicos de menisco");
    }
    if (aggravatingFactors.some((f: string) =>
      f.includes("agachar") || f.includes("torcer") || f.includes("rotação"))) {
      meniscalReasons.push("Piora com agachamento/rotação");
    }
    if (meniscalReasons.length >= 1) {
      hypotheses.push({
        condition: "Lesão Meniscal",
        confidence: meniscalReasons.length >= 2 ? "alta" : "média",
        reasoning: meniscalReasons,
        differentials: ["LCA", "Artrose", "Síndrome de Plica"],
        suggestedTests: ["Teste de McMurray", "Teste de Apley", "Thessaly Test"]
      });
    }
  }

  // ========== CERVICAL CONDITIONS ==========
  if (painLocation.includes("cervical") || painLocation.includes("pescoço") || painLocation.includes("neck") ||
      painLocation.includes("nuca") || painLocation.includes("occipital")) {
    const cervicalReasons: string[] = ["Localização cervical"];
    if (chiefComplaint.includes("irradiação") || chiefComplaint.includes("braço") ||
        chiefComplaint.includes("formigamento") || chiefComplaint.includes("mão")) {
      cervicalReasons.push("Irradiação para membros superiores");
      hypotheses.push({
        condition: "Síndrome Radicular Cervical",
        confidence: "média",
        reasoning: cervicalReasons,
        differentials: ["Hérnia Cervical", "Estenose Cervical", "Síndrome do Desfiladeiro"],
        suggestedTests: ["Teste de Spurling", "Distração Cervical", "Teste de Adson"]
      });
    } else {
      hypotheses.push({
        condition: "Cervicalgia Mecânica",
        confidence: "média",
        reasoning: cervicalReasons,
        differentials: ["Tensão Muscular", "Artrose Cervical", "Cefaleia Cervicogênica"],
        suggestedTests: ["ADM Cervical", "Palpação Muscular", "Teste de Jackson"]
      });
    }
  }

  // ========== ANKLE/FOOT CONDITIONS ==========
  if (painLocation.includes("tornozelo") || painLocation.includes("ankle") || painLocation.includes("pé") ||
      painLocation.includes("calcâneo") || painLocation.includes("plantar")) {
    if (chiefComplaint.includes("entorse") || chiefComplaint.includes("torção") ||
        chiefComplaint.includes("instabilidade") || chiefComplaint.includes("lateral")) {
      hypotheses.push({
        condition: "Entorse / Instabilidade Crônica de Tornozelo",
        confidence: "média",
        reasoning: ["Histórico de entorse", "Possível instabilidade ligamentar"],
        differentials: ["Lesão Peroneal", "Síndrome do Seio do Tarso", "Fratura por Estresse"],
        suggestedTests: ["Teste da Gaveta Anterior", "Tilt Talar", "Compressão Peroneal"]
      });
    }
    if (chiefComplaint.includes("calcanhar") || chiefComplaint.includes("plantar") ||
        chiefComplaint.includes("manhã") || chiefComplaint.includes("primeiro passo")) {
      hypotheses.push({
        condition: "Fascite Plantar",
        confidence: "média",
        reasoning: ["Dor no calcanhar/planta", "Padrão típico matinal"],
        differentials: ["Esporão Calcâneo", "Neuroma de Morton", "Tendinopatia Aquiliana"],
        suggestedTests: ["Palpação Tuberosidade Calcâneo", "Teste de Windlass", "Avaliação Pisada"]
      });
    }
  }

  // ========== HIP CONDITIONS ==========
  if (painLocation.includes("quadril") || painLocation.includes("hip") || painLocation.includes("virilha") ||
      painLocation.includes("glúteo") || painLocation.includes("gluteo")) {
    hypotheses.push({
      condition: "Síndrome de Impacto Femoroacetabular",
      confidence: "média",
      reasoning: ["Localização quadril/virilha", "Avaliar padrão de dor"],
      differentials: ["Artrose de Quadril", "Bursite Trocantérica", "Síndrome do Piriforme"],
      suggestedTests: ["Teste FABER", "Teste FADIR", "Teste de Thomas"]
    });
  }

  // ========== ELBOW/WRIST CONDITIONS ==========
  if (painLocation.includes("cotovelo") || painLocation.includes("elbow") || painLocation.includes("epicôndilo") ||
      painLocation.includes("epicondilo")) {
    if (chiefComplaint.includes("lateral") || chiefComplaint.includes("extensão") ||
        chiefComplaint.includes("extensor") || chiefComplaint.includes("tênis")) {
      hypotheses.push({
        condition: "Epicondilite Lateral (Cotovelo do Tenista)",
        confidence: "média",
        reasoning: ["Dor lateral no cotovelo", "Padrão compatível com tendinopatia extensora"],
        differentials: ["Epicondilite Medial", "Síndrome do Túnel Radial", "Artrose"],
        suggestedTests: ["Teste de Cozen", "Teste de Mill", "Palpação Epicôndilo"]
      });
    }
  }

  if (painLocation.includes("punho") || painLocation.includes("wrist") || painLocation.includes("mão") ||
      painLocation.includes("dedos") || painLocation.includes("carpo")) {
    if (chiefComplaint.includes("formigamento") || chiefComplaint.includes("dormência") ||
        chiefComplaint.includes("noturno") || chiefComplaint.includes("noite")) {
      hypotheses.push({
        condition: "Síndrome do Túnel do Carpo",
        confidence: "média",
        reasoning: ["Parestesias em distribuição do nervo mediano", "Sintomas noturnos típicos"],
        differentials: ["Síndrome de De Quervain", "Radiculopatia Cervical", "Neuropatia Periférica"],
        suggestedTests: ["Teste de Phalen", "Sinal de Tinel", "Teste de Durkan"]
      });
    }
  }

  // ========== CHRONIC / WIDESPREAD PAIN ==========
  if (chiefComplaint.includes("crônic") || chiefComplaint.includes("anos") ||
      chiefComplaint.includes("meses") || chiefComplaint.includes("constante")) {
    const chronicReasons: string[] = ["Duração prolongada dos sintomas"];
    if (chiefComplaint.includes("todo lugar") || chiefComplaint.includes("várias partes") ||
        chiefComplaint.includes("generalizada") || chiefComplaint.includes("corpo todo")) {
      chronicReasons.push("Dor difusa/generalizada");
    }
    if (chiefComplaint.includes("cansaço") || chiefComplaint.includes("fadiga") ||
        chiefComplaint.includes("sono") || chiefComplaint.includes("dormir")) {
      chronicReasons.push("Fadiga/alteração do sono associada");
    }
    hypotheses.push({
      condition: "Dor Crônica / Sensibilização Central",
      confidence: chronicReasons.length >= 2 ? "alta" : "média",
      reasoning: chronicReasons,
      differentials: ["Fibromialgia", "Síndrome Miofascial", "Condição reumática"],
      suggestedTests: ["Avaliação de Pontos-Gatilho", "Questionário de Catastrofização", "Avaliação Biopsicossocial"]
    });
  }

  // ========== MUSCLE/GENERAL PAIN ==========
  if (chiefComplaint.includes("musculo") || chiefComplaint.includes("músculo") ||
      chiefComplaint.includes("muscular") || chiefComplaint.includes("contratura") ||
      chiefComplaint.includes("tensão") || chiefComplaint.includes("nó") ||
      chiefComplaint.includes("endurecido") || chiefComplaint.includes("espasmo")) {
    hypotheses.push({
      condition: "Dor Muscular / Síndrome Miofascial",
      confidence: "média",
      reasoning: ["Sintomas compatíveis com dor muscular", "Possíveis pontos-gatilho"],
      differentials: ["Tensão Muscular", "Pontos-Gatilho", "Contratura"],
      suggestedTests: ["Palpação de Pontos-Gatilho", "Avaliação de Encurtamentos", "Teste de Força"]
    });
  }

  // ========== POSTURAL CONDITIONS ==========
  if (chiefComplaint.includes("postura") || chiefComplaint.includes("torto") ||
      chiefComplaint.includes("curvado") || chiefComplaint.includes("escoliose") ||
      chiefComplaint.includes("cifose") || chiefComplaint.includes("lordose") ||
      chiefComplaint.includes("desalinhado") || chiefComplaint.includes("desnivelado")) {
    hypotheses.push({
      condition: "Disfunção Postural",
      confidence: "média",
      reasoning: ["Alteração postural relatada", "Possível desequilíbrio muscular"],
      differentials: ["Escoliose", "Hipercifose", "Hiperlordose", "Desequilíbrio Muscular"],
      suggestedTests: ["Avaliação Postural", "Teste de Flexibilidade", "Avaliação de Força"]
    });
  }

  // ========== RED FLAGS ==========
  if (redFlags.length > 0 && !redFlags.includes("none")) {
    hypotheses.push({
      condition: "⚠️ Red Flags Identificados - Avaliação Médica Prioritária",
      confidence: "alta",
      reasoning: ["Sinais de alerta identificados no Caminho Clínico", "Possível patologia grave subjacente"],
      differentials: ["Fratura", "Infecção", "Neoplasia", "Síndrome da Cauda Equina"],
      suggestedTests: ["Encaminhamento médico urgente", "Exames de imagem", "Exames laboratoriais"]
    });
  }

  return hypotheses;
}

patientsRouter.get("/patients/:patientId/suporte", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first();

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const evaluation = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? AND type = 'initial' ORDER BY created_at DESC LIMIT 1`
  ).bind(patientId).first();

  const caminho = await c.env.DB.prepare(
    `SELECT * FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first();

  const latestEvolution = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date DESC LIMIT 1`
  ).bind(patientId).first();

  const structured = generateStructuredSuporte(evaluation, caminho, latestEvolution);

  return c.json({
    evaluation,
    caminho,
    latestEvolution,
    suggestions: structured.insights.map(i => `${i.title}: ${i.description}`),
    structured
  });
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

// ============================================
// CLINICAL SUMMARY API
// ============================================

patientsRouter.get("/patients/:patientId/clinical-summary", authMiddleware, async (c) => {
  const user = c.get("user");
  const patientId = c.req.param("patientId");

  const patient = await c.env.DB.prepare(
    `SELECT * FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user!.id).first() as any;

  if (!patient) {
    return c.json({ error: "Patient not found" }, 404);
  }

  const { results: evaluations } = await c.env.DB.prepare(
    `SELECT * FROM evaluations WHERE patient_id = ? ORDER BY created_at ASC`
  ).bind(patientId).all();

  const { results: evolutions } = await c.env.DB.prepare(
    `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
  ).bind(patientId).all();

  const caminho = await c.env.DB.prepare(
    `SELECT * FROM caminho WHERE patient_id = ?`
  ).bind(patientId).first() as any;

  const initialEval = evaluations.find((e: any) => e.type === "initial") as any;
  const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] as any : null;

  const initialPain = initialEval?.pain_level ?? null;
  const currentPain = lastEvolution?.pain_level ?? initialPain;
  const painChange = initialPain !== null && currentPain !== null ? initialPain - currentPain : null;

  const firstDate = initialEval?.created_at || patient.created_at;
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  let responsePattern: "positive" | "neutral" | "negative" | "mixed" | null = null;
  if (evolutions.length > 0) {
    const responses = evolutions.map((e: any) => e.patient_response).filter(Boolean);
    const positiveCount = responses.filter((r: string) => r === "positive").length;
    const negativeCount = responses.filter((r: string) => r === "negative").length;
    const neutralCount = responses.filter((r: string) => r === "neutral").length;

    if (responses.length > 0) {
      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        responsePattern = "positive";
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        responsePattern = "negative";
      } else if (positiveCount > 0 && negativeCount > 0) {
        responsePattern = "mixed";
      } else {
        responsePattern = "neutral";
      }
    }
  }

  const highlights: { type: "positive" | "neutral" | "warning" | "critical"; text: string }[] = [];

  if (painChange !== null) {
    if (painChange >= 3) {
      highlights.push({ type: "positive", text: `Redução significativa de dor: ${painChange} pontos` });
    } else if (painChange > 0) {
      highlights.push({ type: "positive", text: `Melhora na dor: ${painChange} ponto${painChange > 1 ? "s" : ""}` });
    } else if (painChange < 0) {
      highlights.push({ type: "warning", text: `Aumento de dor: ${Math.abs(painChange)} ponto${Math.abs(painChange) > 1 ? "s" : ""}` });
    }
  }

  if (currentPain !== null) {
    if (currentPain >= 7) {
      highlights.push({ type: "critical", text: `Dor intensa atual: ${currentPain}/10` });
    } else if (currentPain <= 3 && currentPain > 0) {
      highlights.push({ type: "positive", text: `Dor controlada: ${currentPain}/10` });
    } else if (currentPain === 0) {
      highlights.push({ type: "positive", text: "Paciente sem dor" });
    }
  }

  if (responsePattern === "positive") {
    highlights.push({ type: "positive", text: "Resposta predominantemente positiva às sessões" });
  } else if (responsePattern === "negative") {
    highlights.push({ type: "warning", text: "Resposta negativa frequente - considerar ajuste" });
  }

  if (caminho?.red_flags) {
    highlights.push({ type: "critical", text: "Red flags identificados no Caminho Clínico" });
  }

  if (evolutions.length === 0 && evaluations.length > 0 && daysSinceStart > 7) {
    highlights.push({ type: "warning", text: `${daysSinceStart} dias sem registro de evolução` });
  }

  let summaryText = "";
  if (!initialEval) {
    summaryText = "Paciente cadastrado, aguardando avaliação inicial para início do acompanhamento clínico estruturado.";
  } else if (evolutions.length === 0) {
    summaryText = `Avaliação inicial registrada com queixa de "${initialEval.chief_complaint || "não especificada"}". Dor inicial: ${initialPain ?? "não informada"}/10. Aguardando registro de sessões de evolução para análise de progressão.`;
  } else {
    const sessions = evolutions.length;
    const painStatus = currentPain !== null
      ? currentPain <= 3 ? "controlada" : currentPain >= 7 ? "intensa" : "moderada"
      : "não avaliada";

    summaryText = `Paciente com ${sessions} ${sessions === 1 ? "sessão" : "sessões"} de tratamento em ${daysSinceStart} dias. `;

    if (painChange !== null && painChange > 0) {
      summaryText += `Apresenta evolução positiva com redução de ${painChange} pontos na escala de dor. `;
    } else if (painChange !== null && painChange < 0) {
      summaryText += `Atenção: aumento de ${Math.abs(painChange)} pontos na dor desde avaliação inicial. `;
    }

    summaryText += `Dor atual ${painStatus}${currentPain !== null ? ` (${currentPain}/10)` : ""}. `;

    if (responsePattern === "positive") {
      summaryText += "Boa resposta ao tratamento nas últimas sessões.";
    } else if (responsePattern === "mixed") {
      summaryText += "Resposta variável - monitorar padrão nas próximas sessões.";
    } else if (responsePattern === "negative") {
      summaryText += "Considerar reavaliação do plano terapêutico.";
    }
  }

  const recommendations: string[] = [];

  if (!initialEval) {
    recommendations.push("Realizar avaliação inicial completa");
  }

  if (evolutions.length === 0 && initialEval) {
    recommendations.push("Registrar primeira sessão de evolução");
  }

  if (currentPain !== null && currentPain >= 7) {
    recommendations.push("Priorizar manejo da dor com TENS ou crioterapia");
    recommendations.push("Considerar ajuste de carga nos exercícios");
  }

  if (painChange !== null && painChange < 0) {
    recommendations.push("Reavaliar abordagem terapêutica");
    recommendations.push("Investigar possíveis fatores de piora");
  }

  if (caminho?.treatment_goals) {
    recommendations.push("Revisar progresso em relação aos objetivos definidos");
  }

  if (!caminho && initialEval) {
    recommendations.push("Completar documentação no módulo Caminho Clínico");
  }

  if (evolutions.length >= 5 && painChange !== null && painChange >= 3) {
    recommendations.push("Considerar critérios para alta ou manutenção");
  }

  return c.json({
    patientId: patient.id,
    patientName: patient.name,
    summaryText,
    highlights,
    metrics: {
      currentPain,
      initialPain,
      painChange,
      sessionsCount: evolutions.length,
      daysSinceStart,
      lastSessionDate: lastEvolution?.session_date || null,
      responsePattern
    },
    recommendations
  });
});

// GET /api/patients/:id/progress
patientsRouter.get("/patients/:id/progress", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const patientId = c.req.param("id");

  const patient = await c.env.DB.prepare(
    `SELECT id, name FROM patients WHERE id = ? AND user_id = ?`
  ).bind(patientId, user.id).first<{ id: number; name: string }>();

  if (!patient) return c.json({ error: "Patient not found" }, 404);

  const { results: evolutions } = await c.env.DB.prepare(
    `SELECT pain_level, patient_response, session_date, functional_status, procedures
     FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
  ).bind(patientId).all<{
    pain_level: number | null;
    patient_response: string | null;
    session_date: string;
    functional_status: string | null;
    procedures: string | null;
  }>();

  const responseToScore = (r: string | null): number | null => {
    if (!r) return null;
    const map: Record<string, number> = {
      positive: 8, improving: 8,
      neutral: 5, stable: 5,
      negative: 2, worsening: 2,
    };
    return map[r] ?? null;
  };

  const painTimeline = evolutions
    .filter((e) => e.pain_level !== null)
    .map((e, i) => ({
      session: i + 1,
      date: e.session_date,
      pain: e.pain_level as number,
    }));

  const functionalTimeline = evolutions
    .map((e, i) => {
      const score = responseToScore(e.patient_response);
      if (score === null) return null;
      return { session: i + 1, date: e.session_date, score };
    })
    .filter(Boolean) as { session: number; date: string; score: number }[];

  const painLevels = evolutions.filter((e) => e.pain_level !== null).map((e) => e.pain_level as number);
  const initialPain = painLevels[0] ?? null;
  const currentPain = painLevels[painLevels.length - 1] ?? null;
  const painChange = initialPain !== null && currentPain !== null ? initialPain - currentPain : null;

  const avgPain = painLevels.length > 0
    ? Math.round((painLevels.reduce((a, b) => a + b, 0) / painLevels.length) * 10) / 10
    : null;

  const positiveCount = evolutions.filter((e) => e.patient_response === "positive" || e.patient_response === "improving").length;
  const positiveRate = evolutions.length > 0 ? Math.round((positiveCount / evolutions.length) * 100) : null;

  const milestones: { label: string; date: string; type: "start" | "improvement" | "goal" | "warning" }[] = [];

  if (evolutions.length > 0) {
    milestones.push({ label: "Início do tratamento", date: evolutions[0].session_date, type: "start" });
  }

  if (painChange !== null && painChange >= 3 && evolutions.length >= 3) {
    const idx = painLevels.findIndex((p, i) => i > 0 && (painLevels[0] - p) >= 3);
    if (idx >= 0) {
      milestones.push({ label: `Redução significativa da dor (-${painChange} pts)`, date: evolutions[idx].session_date, type: "improvement" });
    }
  }

  if (evolutions.length >= 5) {
    milestones.push({ label: "5ª sessão concluída", date: evolutions[4].session_date, type: "goal" });
  }
  if (evolutions.length >= 10) {
    milestones.push({ label: "10ª sessão concluída", date: evolutions[9].session_date, type: "goal" });
  }

  const last3 = evolutions.slice(-3);
  const allNegative = last3.length >= 3 && last3.every((e) => e.patient_response === "negative" || e.patient_response === "worsening");
  if (allNegative) {
    milestones.push({ label: "3 sessões consecutivas negativas", date: last3[last3.length - 1].session_date, type: "warning" });
  }

  if (currentPain !== null && currentPain <= 2 && evolutions.length >= 3) {
    milestones.push({ label: "Dor controlada (≤2/10)", date: evolutions[evolutions.length - 1].session_date, type: "goal" });
  }

  return c.json({
    patientId: patient.id,
    patientName: patient.name,
    painTimeline,
    functionalTimeline,
    summary: {
      totalSessions: evolutions.length,
      initialPain,
      currentPain,
      painChange,
      avgPain,
      positiveRate,
    },
    milestones,
  });
});
