/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const dashboardRouter = new Hono<{ Bindings: Env }>();

// ============================================
// DASHBOARD STATS API
// ============================================

dashboardRouter.get("/dashboard/stats", authMiddleware, async (c) => {
  const user = c.get("user");

  const results = await c.env.DB.batch([
    c.env.DB.prepare(`SELECT COUNT(*) as count FROM patients WHERE user_id = ?`).bind(user!.id),
    c.env.DB.prepare(`SELECT COUNT(*) as count FROM evaluations WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`).bind(user!.id),
    c.env.DB.prepare(`SELECT COUNT(*) as count FROM evolutions WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`).bind(user!.id)
  ]);

  const totalPatients = (results[0].results?.[0] as any)?.count ?? 0;
  const totalEvaluations = (results[1].results?.[0] as any)?.count ?? 0;
  const totalEvolutions = (results[2].results?.[0] as any)?.count ?? 0;

  let recentActivities: Array<{
    id: number;
    type: "evaluation" | "evolution";
    patientName: string;
    patientId: number;
    date: string;
    description: string;
  }> = [];

  if (totalPatients > 0) {
    // Single UNION ALL — DB does the merge instead of two roundtrips + JS sort/concat.
    type ActivityRow = {
      id: number;
      created_at: string;
      patient_id: number;
      patient_name: string;
      activity_type: "evaluation" | "evolution";
      eval_type: string | null;
    };
    const { results: activities } = await c.env.DB.prepare(
      `SELECT e.id, e.created_at, p.id AS patient_id, p.name AS patient_name,
              'evaluation' AS activity_type, e.type AS eval_type
       FROM evaluations e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?1
       UNION ALL
       SELECT ev.id, ev.created_at, p.id AS patient_id, p.name AS patient_name,
              'evolution' AS activity_type, NULL AS eval_type
       FROM evolutions ev
       JOIN patients p ON ev.patient_id = p.id
       WHERE p.user_id = ?1
       ORDER BY created_at DESC
       LIMIT 5`
    ).bind(user!.id).all<ActivityRow>();

    recentActivities = activities.map((a: ActivityRow) => ({
      id: a.id,
      type: a.activity_type,
      patientName: a.patient_name,
      patientId: a.patient_id,
      date: a.created_at,
      description:
        a.activity_type === "evaluation"
          ? a.eval_type === "initial"
            ? "Avaliação inicial criada"
            : "Reavaliação registrada"
          : "Evolução registrada",
    }));
  }

  const lastActivityDate = recentActivities[0]?.date ?? null;

  return c.json({
    stats: {
      totalPatients,
      totalEvaluations,
      totalEvolutions,
      lastActivityDate,
    },
    recentActivities,
  });
});

// ============================================
// DASHBOARD CHARTS API
// ============================================

dashboardRouter.get("/dashboard/charts", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results: patientIds } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const patientIdList = patientIds.map((p: any) => p.id);

  const chartData = {
    weeklyActivity: [] as { week: string; evolutions: number; evaluations: number }[],
    painTrend: [] as { date: string; avgPain: number; sessions: number }[],
    statusDistribution: { green: 0, yellow: 0, red: 0 },
    monthlyGrowth: [] as { month: string; patients: number; evolutions: number }[]
  };

  if (patientIdList.length === 0) {
    return c.json(chartData);
  }

  const { results: weeklyEvols } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%W', session_date) as week,
      COUNT(*) as count
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-8 weeks')
    GROUP BY week
    ORDER BY week ASC`
  ).bind(user!.id).all();

  const { results: weeklyEvals } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%W', created_at) as week,
      COUNT(*) as count
    FROM evaluations
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND created_at >= date('now', '-8 weeks')
    GROUP BY week
    ORDER BY week ASC`
  ).bind(user!.id).all();

  const weeklyMap = new Map<string, { evolutions: number; evaluations: number }>();
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 7));
    const weekKey = `${d.getFullYear()}-${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2, '0')}`;
    weeklyMap.set(weekKey, { evolutions: 0, evaluations: 0 });
  }

  weeklyEvols.forEach((r: any) => {
    if (weeklyMap.has(r.week)) {
      weeklyMap.get(r.week)!.evolutions = r.count;
    }
  });
  weeklyEvals.forEach((r: any) => {
    if (weeklyMap.has(r.week)) {
      weeklyMap.get(r.week)!.evaluations = r.count;
    }
  });

  const weekNames = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Atual'];
  let weekIdx = 0;
  weeklyMap.forEach((data) => {
    chartData.weeklyActivity.push({
      week: weekNames[weekIdx] || `Sem ${weekIdx + 1}`,
      evolutions: data.evolutions,
      evaluations: data.evaluations
    });
    weekIdx++;
  });

  const { results: painData } = await c.env.DB.prepare(
    `SELECT
      session_date,
      pain_level
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-30 days')
      AND pain_level IS NOT NULL
    ORDER BY session_date ASC`
  ).bind(user!.id).all();

  const painPeriods = new Map<string, { total: number; count: number }>();
  painData.forEach((r: any) => {
    const date = new Date(r.session_date);
    const periodStart = new Date(date);
    periodStart.setDate(periodStart.getDate() - (periodStart.getDate() % 5));
    const key = periodStart.toISOString().split('T')[0];

    if (!painPeriods.has(key)) {
      painPeriods.set(key, { total: 0, count: 0 });
    }
    const period = painPeriods.get(key)!;
    period.total += r.pain_level;
    period.count += 1;
  });

  painPeriods.forEach((data, dateKey) => {
    const d = new Date(dateKey);
    chartData.painTrend.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      avgPain: Math.round((data.total / data.count) * 10) / 10,
      sessions: data.count
    });
  });

  // Single query: last 3 pain levels per patient via window function.
  // Avoids N queries (one per patient) for status distribution.
  const { results: painRanked } = await c.env.DB.prepare(
    `SELECT patient_id, pain_level, rn
     FROM (
       SELECT patient_id, pain_level,
         ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY session_date DESC) as rn
       FROM evolutions
       WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
         AND pain_level IS NOT NULL
     ) WHERE rn <= 3`
  ).bind(user!.id).all();

  // Build per-patient map: { patientId -> [pain1 (latest), pain2, pain3] }
  const painByPatient = new Map<number, number[]>();
  for (const row of painRanked as any[]) {
    if (!painByPatient.has(row.patient_id)) painByPatient.set(row.patient_id, []);
    painByPatient.get(row.patient_id)!.push(row.pain_level);
  }

  for (const patientId of patientIdList) {
    const pains = painByPatient.get(patientId) ?? [];
    if (pains.length === 0) {
      chartData.statusDistribution.yellow += 1;
    } else if (pains.length >= 2) {
      const trend = pains[0] - pains[pains.length - 1];
      if (trend < 0) {
        chartData.statusDistribution.green += 1;
      } else if (trend > 2 || pains[0] >= 7) {
        chartData.statusDistribution.red += 1;
      } else {
        chartData.statusDistribution.yellow += 1;
      }
    } else {
      chartData.statusDistribution.yellow += 1;
    }
  }

  const { results: monthlyPatients } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as count
    FROM patients
    WHERE user_id = ?
      AND created_at >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC`
  ).bind(user!.id).all();

  const { results: monthlyEvols } = await c.env.DB.prepare(
    `SELECT
      strftime('%Y-%m', session_date) as month,
      COUNT(*) as count
    FROM evolutions
    WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
      AND session_date >= date('now', '-6 months')
    GROUP BY month
    ORDER BY month ASC`
  ).bind(user!.id).all();

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyMap = new Map<string, { patients: number; evolutions: number }>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, { patients: 0, evolutions: 0 });
  }

  monthlyPatients.forEach((r: any) => {
    if (monthlyMap.has(r.month)) {
      monthlyMap.get(r.month)!.patients = r.count;
    }
  });
  monthlyEvols.forEach((r: any) => {
    if (monthlyMap.has(r.month)) {
      monthlyMap.get(r.month)!.evolutions = r.count;
    }
  });

  monthlyMap.forEach((data, monthKey) => {
    const [, m] = monthKey.split('-');
    chartData.monthlyGrowth.push({
      month: monthNames[parseInt(m) - 1],
      patients: data.patients,
      evolutions: data.evolutions
    });
  });

  return c.json(chartData);
});

// ============================================
// ONBOARDING PROGRESS API
// ============================================

dashboardRouter.get("/onboarding/progress", authMiddleware, async (c) => {
  const user = c.get("user");

  const progressResults = await c.env.DB.batch([
    c.env.DB.prepare(`SELECT 1 FROM patients WHERE user_id = ? LIMIT 1`).bind(user!.id),
    c.env.DB.prepare(`SELECT patient_id FROM evaluations e JOIN patients p ON e.patient_id = p.id WHERE p.user_id = ? ORDER BY e.created_at ASC LIMIT 1`).bind(user!.id),
    c.env.DB.prepare(`SELECT 1 FROM caminho c JOIN patients p ON c.patient_id = p.id WHERE p.user_id = ? AND c.treatment_goals IS NOT NULL AND c.treatment_goals != '' LIMIT 1`).bind(user!.id),
    c.env.DB.prepare(`SELECT 1 FROM evolutions e JOIN patients p ON e.patient_id = p.id WHERE p.user_id = ? LIMIT 1`).bind(user!.id),
    c.env.DB.prepare(`SELECT 1 FROM report_exports WHERE user_id = ? LIMIT 1`).bind(user!.id)
  ]);

  const has_patient = progressResults[0].results.length > 0;
  const first_eval_patient_id = progressResults[1].results.length > 0 ? (progressResults[1].results[0] as any).patient_id : null;
  const has_objectives = progressResults[2].results.length > 0;
  const has_evolution = progressResults[3].results.length > 0;
  const has_report = progressResults[4].results.length > 0;

  return c.json({
    hasPatient: has_patient,
    hasEvaluation: first_eval_patient_id != null,
    hasObjectives: has_objectives,
    hasEvolution: has_evolution,
    hasReport: has_report,
    firstEvaluationPatientId: first_eval_patient_id,
  });
});

dashboardRouter.post("/onboarding/report-exported", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  await c.env.DB.prepare(
    `INSERT INTO report_exports (user_id, patient_id) VALUES (?, ?)`
  ).bind(user!.id, body.patientId || null).run();

  return c.json({ success: true });
});

// ============================================
// SMART ALERTS API
// ============================================

dashboardRouter.get("/smart-alerts", authMiddleware, async (c) => {
  const user = c.get("user");

  // 3 fixed queries instead of N*3-4 queries (one set per patient).
  // Query 1: all patients + their latest evolution + latest evaluation via window functions.
  const { results: patients } = await c.env.DB.prepare(
    `SELECT
       p.id, p.name, p.created_at,
       ev.pain_level  AS ev_pain,
       ev.session_date AS ev_session_date,
       ev.created_at  AS ev_created_at,
       e.pain_level   AS eval_pain,
       e.created_at   AS eval_created_at
     FROM patients p
     LEFT JOIN (
       SELECT patient_id, pain_level, session_date, created_at,
         ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY created_at DESC) AS rn
       FROM evolutions
     ) ev ON ev.patient_id = p.id AND ev.rn = 1
     LEFT JOIN (
       SELECT patient_id, pain_level, created_at,
         ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY created_at DESC) AS rn
       FROM evaluations
     ) e ON e.patient_id = p.id AND e.rn = 1
     WHERE p.user_id = ?`
  ).bind(user!.id).all();

  // Query 2: evolution counts per patient.
  const { results: evolCounts } = await c.env.DB.prepare(
    `SELECT patient_id, COUNT(*) as count
     FROM evolutions
     WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
     GROUP BY patient_id`
  ).bind(user!.id).all();

  const evolCountMap = new Map<number, number>();
  for (const row of evolCounts as any[]) {
    evolCountMap.set(row.patient_id, row.count);
  }

  // Query 3: last 2 evolutions with pain per patient (for stagnant pain detection).
  const { results: lastTwoPains } = await c.env.DB.prepare(
    `SELECT patient_id, pain_level, rn
     FROM (
       SELECT patient_id, pain_level,
         ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY created_at DESC) AS rn
       FROM evolutions
       WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)
         AND pain_level IS NOT NULL
     ) WHERE rn <= 2`
  ).bind(user!.id).all();

  const lastTwoPainMap = new Map<number, { latest: number; previous: number }>();
  for (const row of lastTwoPains as any[]) {
    if (!lastTwoPainMap.has(row.patient_id)) {
      lastTwoPainMap.set(row.patient_id, { latest: row.pain_level, previous: row.pain_level });
    } else if (row.rn === 2) {
      lastTwoPainMap.get(row.patient_id)!.previous = row.pain_level;
    }
  }

  const alerts: any[] = [];
  const weeklyPriorities: any[] = [];
  const now = new Date();

  for (const patient of patients as any[]) {
    const evolutionCount = evolCountMap.get(patient.id) ?? 0;

    const latestActivityDate = patient.ev_created_at || patient.eval_created_at || patient.created_at;
    const daysSinceActivity = Math.floor((now.getTime() - new Date(latestActivityDate).getTime()) / (1000 * 60 * 60 * 24));

    const currentPainLevel = patient.ev_pain ?? patient.eval_pain ?? null;

    if (currentPainLevel !== null && currentPainLevel >= 7) {
      alerts.push({
        id: alerts.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        type: "high_pain",
        severity: currentPainLevel >= 8 ? "critical" : "warning",
        title: `Dor Elevada (EVA ${currentPainLevel})`,
        description: `Paciente apresenta nível de dor ${currentPainLevel}/10, requer atenção imediata.`,
        actionLabel: "Ver Prontuário",
        painLevel: currentPainLevel,
      });
    }

    if (evolutionCount === 0 && patient.eval_created_at) {
      const daysSinceEval = Math.floor((now.getTime() - new Date(patient.eval_created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceEval >= 3) {
        alerts.push({
          id: alerts.length + 1,
          patientId: patient.id,
          patientName: patient.name,
          type: "no_evolution",
          severity: daysSinceEval >= 7 ? "warning" : "info",
          title: "Sem Evolução Registrada",
          description: `Paciente avaliado há ${daysSinceEval} dias sem nenhuma evolução.`,
          actionLabel: "Registrar Evolução",
          daysSince: daysSinceEval,
        });
      }
    }

    if (daysSinceActivity >= 14) {
      alerts.push({
        id: alerts.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        type: "inactive",
        severity: daysSinceActivity >= 30 ? "warning" : "info",
        title: "Paciente Inativo",
        description: `Sem atividade há ${daysSinceActivity} dias. Verificar continuidade.`,
        actionLabel: "Verificar Paciente",
        daysSince: daysSinceActivity,
      });
    }

    if (evolutionCount >= 2) {
      const pains = lastTwoPainMap.get(patient.id);
      if (pains && pains.latest >= pains.previous && pains.latest >= 5) {
        alerts.push({
          id: alerts.length + 1,
          patientId: patient.id,
          patientName: patient.name,
          type: "stagnant_pain",
          severity: "warning",
          title: "Dor Não Evoluindo",
          description: `Dor mantida ou aumentada nas últimas sessões (${pains.previous} → ${pains.latest}).`,
          actionLabel: "Revisar Conduta",
          painLevel: pains.latest,
        });
      }
    }

    let priorityReason = null;
    let priorityLevel = 3;

    if (currentPainLevel !== null && currentPainLevel >= 7) {
      priorityReason = `Dor elevada (EVA ${currentPainLevel})`;
      priorityLevel = 1;
    } else if (evolutionCount === 0 && patient.eval_created_at) {
      priorityReason = "Aguardando primeira evolução";
      priorityLevel = 2;
    } else if (daysSinceActivity >= 7 && daysSinceActivity < 14) {
      priorityReason = `Última atividade há ${daysSinceActivity} dias`;
      priorityLevel = 2;
    }

    if (priorityReason) {
      weeklyPriorities.push({
        id: weeklyPriorities.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        reason: priorityReason,
        priority: priorityLevel,
      });
    }
  }

  const severityOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]);

  weeklyPriorities.sort((a, b) => a.priority - b.priority);

  const stats = {
    criticalCount: alerts.filter(a => a.severity === "critical").length,
    warningCount: alerts.filter(a => a.severity === "warning").length,
    totalPatientsNeedingAttention: new Set([...alerts.map(a => a.patientId), ...weeklyPriorities.map(p => p.patientId)]).size,
  };

  return c.json({
    alerts: alerts.slice(0, 10),
    weeklyPriorities: weeklyPriorities.slice(0, 5),
    stats,
  });
});
