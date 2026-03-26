import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const dashboardRouter = new Hono<{ Bindings: Env }>();

// ============================================
// DASHBOARD STATS API
// ============================================

dashboardRouter.get("/dashboard/stats", authMiddleware, async (c) => {
  const user = c.get("user");

  const patientsResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM patients WHERE user_id = ?`
  ).bind(user!.id).first() as any;

  const { results: patientIds } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const patientIdList = patientIds.map((p: any) => p.id);

  let totalEvaluations = 0;
  let totalEvolutions = 0;
  let recentActivities: any[] = [];

  if (patientIdList.length > 0) {
    const evalResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evaluations WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`
    ).bind(user!.id).first() as any;
    totalEvaluations = evalResult?.count || 0;

    const evolResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evolutions WHERE patient_id IN (SELECT id FROM patients WHERE user_id = ?)`
    ).bind(user!.id).first() as any;
    totalEvolutions = evolResult?.count || 0;

    const { results: recentEvals } = await c.env.DB.prepare(
      `SELECT e.id, e.created_at, e.type, p.id as patient_id, p.name as patient_name, 'evaluation' as activity_type
       FROM evaluations e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       ORDER BY e.created_at DESC
       LIMIT 5`
    ).bind(user!.id).all();

    const { results: recentEvols } = await c.env.DB.prepare(
      `SELECT e.id, e.created_at, e.session_date, p.id as patient_id, p.name as patient_name, 'evolution' as activity_type
       FROM evolutions e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       ORDER BY e.created_at DESC
       LIMIT 5`
    ).bind(user!.id).all();

    const allActivities = [
      ...recentEvals.map((a: any) => ({
        id: a.id,
        type: "evaluation" as const,
        patientName: a.patient_name,
        patientId: a.patient_id,
        date: a.created_at,
        description: a.type === "initial" ? "Avaliação inicial criada" : "Reavaliação registrada"
      })),
      ...recentEvols.map((a: any) => ({
        id: a.id,
        type: "evolution" as const,
        patientName: a.patient_name,
        patientId: a.patient_id,
        date: a.created_at,
        description: "Evolução registrada"
      }))
    ];

    recentActivities = allActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  let lastActivityDate: string | null = null;
  if (recentActivities.length > 0) {
    lastActivityDate = recentActivities[0].date;
  }

  return c.json({
    stats: {
      totalPatients: patientsResult?.count || 0,
      totalEvaluations,
      totalEvolutions,
      lastActivityDate
    },
    recentActivities
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

  for (const patientId of patientIdList) {
    const { results: evolutions } = await c.env.DB.prepare(
      `SELECT pain_level, session_date FROM evolutions
       WHERE patient_id = ? ORDER BY session_date DESC LIMIT 3`
    ).bind(patientId).all();

    if (evolutions.length === 0) {
      chartData.statusDistribution.yellow += 1;
    } else {
      const recentPains = evolutions.map((e: any) => e.pain_level).filter((p: any) => p !== null);
      if (recentPains.length >= 2) {
        const trend = recentPains[0] - recentPains[recentPains.length - 1];
        if (trend < 0) {
          chartData.statusDistribution.green += 1;
        } else if (trend > 2 || recentPains[0] >= 7) {
          chartData.statusDistribution.red += 1;
        } else {
          chartData.statusDistribution.yellow += 1;
        }
      } else {
        chartData.statusDistribution.yellow += 1;
      }
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

  const { results: patients } = await c.env.DB.prepare(
    `SELECT id FROM patients WHERE user_id = ?`
  ).bind(user!.id).all();

  const hasPatient = patients.length > 0;
  const patientIdList = patients.map((p: any) => p.id);

  let hasEvaluation = false;
  let hasObjectives = false;
  let hasEvolution = false;
  let hasReport = false;
  let firstEvaluationPatientId: number | null = null;

  if (patientIdList.length > 0) {
    const evalResult = await c.env.DB.prepare(
      `SELECT e.id, e.patient_id FROM evaluations e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       ORDER BY e.created_at ASC LIMIT 1`
    ).bind(user!.id).first() as any;

    hasEvaluation = !!evalResult;
    if (evalResult) {
      firstEvaluationPatientId = evalResult.patient_id;
    }

    const objectivesResult = await c.env.DB.prepare(
      `SELECT c.id FROM caminho c
       JOIN patients p ON c.patient_id = p.id
       WHERE p.user_id = ? AND c.treatment_goals IS NOT NULL AND c.treatment_goals != ''
       LIMIT 1`
    ).bind(user!.id).first();
    hasObjectives = !!objectivesResult;

    const evolResult = await c.env.DB.prepare(
      `SELECT e.id FROM evolutions e
       JOIN patients p ON e.patient_id = p.id
       WHERE p.user_id = ?
       LIMIT 1`
    ).bind(user!.id).first();
    hasEvolution = !!evolResult;

    const reportResult = await c.env.DB.prepare(
      `SELECT id FROM report_exports WHERE user_id = ? LIMIT 1`
    ).bind(user!.id).first();
    hasReport = !!reportResult;
  }

  return c.json({
    hasPatient,
    hasEvaluation,
    hasObjectives,
    hasEvolution,
    hasReport,
    firstEvaluationPatientId,
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

  const { results: patients } = await c.env.DB.prepare(
    `SELECT p.id, p.name, p.created_at FROM patients p WHERE p.user_id = ?`
  ).bind(user!.id).all();

  const alerts: any[] = [];
  const weeklyPriorities: any[] = [];
  const now = new Date();

  for (const patient of patients as any[]) {
    const latestEvolution = await c.env.DB.prepare(
      `SELECT ev.id, ev.pain_level, ev.session_date, ev.created_at
       FROM evolutions ev
       WHERE ev.patient_id = ?
       ORDER BY ev.created_at DESC
       LIMIT 1`
    ).bind(patient.id).first() as any;

    const latestEvaluation = await c.env.DB.prepare(
      `SELECT e.id, e.pain_level, e.created_at
       FROM evaluations e
       WHERE e.patient_id = ?
       ORDER BY e.created_at DESC
       LIMIT 1`
    ).bind(patient.id).first() as any;

    const evolCount = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM evolutions WHERE patient_id = ?`
    ).bind(patient.id).first() as any;

    const evolutionCount = evolCount?.count || 0;

    const latestActivityDate = latestEvolution?.created_at || latestEvaluation?.created_at || patient.created_at;
    const daysSinceActivity = Math.floor((now.getTime() - new Date(latestActivityDate).getTime()) / (1000 * 60 * 60 * 24));

    const currentPainLevel = latestEvolution?.pain_level ?? latestEvaluation?.pain_level ?? null;

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

    if (evolutionCount === 0 && latestEvaluation) {
      const daysSinceEval = Math.floor((now.getTime() - new Date(latestEvaluation.created_at).getTime()) / (1000 * 60 * 60 * 24));
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
      const { results: lastTwoEvols } = await c.env.DB.prepare(
        `SELECT pain_level FROM evolutions WHERE patient_id = ? AND pain_level IS NOT NULL ORDER BY created_at DESC LIMIT 2`
      ).bind(patient.id).all();

      if (lastTwoEvols.length === 2) {
        const [latest, previous] = lastTwoEvols as any[];
        if (latest.pain_level !== null && previous.pain_level !== null && latest.pain_level >= previous.pain_level && latest.pain_level >= 5) {
          alerts.push({
            id: alerts.length + 1,
            patientId: patient.id,
            patientName: patient.name,
            type: "stagnant_pain",
            severity: "warning",
            title: "Dor Não Evoluindo",
            description: `Dor mantida ou aumentada nas últimas sessões (${previous.pain_level} → ${latest.pain_level}).`,
            actionLabel: "Revisar Conduta",
            painLevel: latest.pain_level,
          });
        }
      }
    }

    let priorityReason = null;
    let priorityLevel = 3;

    if (currentPainLevel !== null && currentPainLevel >= 7) {
      priorityReason = `Dor elevada (EVA ${currentPainLevel})`;
      priorityLevel = 1;
    } else if (evolutionCount === 0 && latestEvaluation) {
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
