import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";
import {
  computeTrend,
  computePhase,
  computeSeverity,
} from "../lib/clinical-engine";

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

interface HepCheckinRow {
  id: number;
  plan_id: number;
  exercise_id: number;
  completed: number;
  pain_level: number | null;
  difficulty: string | null;
  notes: string | null;
  checked_at: string;
}

export interface ClinicalAlert {
  severity: "danger" | "warning" | "info" | "success";
  title: string;
  description: string;
  conduta: string;
  baseadoEm: string;
  confidence: number;
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

function generateClinicalAlerts(
  evolutions: EvolutionRow[],
  latestEval: EvaluationRow | null,
  hepCheckins: HepCheckinRow[]
): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];

  const painLevels = evolutions
    .filter((e) => e.pain_level !== null)
    .map((e) => e.pain_level as number);

  const totalSessions = evolutions.length;
  const firstEvolution = totalSessions > 0 ? evolutions[0] : null;
  const lastEvolution = totalSessions > 0 ? evolutions[totalSessions - 1] : null;

  const initialPain = firstEvolution?.pain_level ?? latestEval?.pain_level ?? null;
  const currentPain = lastEvolution?.pain_level ?? latestEval?.pain_level ?? null;
  const currentPainLevel = currentPain ?? 0;

  // Phase flags
  const referenceDate = latestEval?.created_at ?? (totalSessions > 0 ? evolutions[0].created_at : null);
  const daysSince = referenceDate
    ? Math.floor((Date.now() - new Date(referenceDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isAcute = daysSince <= 7;
  const isChronic = daysSince > 21;

  // ─── Rule 1: Safe progression ───────────────────────────────────────────────
  if (
    initialPain !== null &&
    currentPain !== null &&
    initialPain > 0 &&
    (initialPain - currentPain) / initialPain >= 0.5 &&
    isChronic &&
    totalSessions >= 6
  ) {
    const pct = Math.round(((initialPain - currentPain) / initialPain) * 100);
    alerts.push({
      severity: "success",
      title: "Progressão Segura",
      description: `Redução de ${pct}% na dor ao longo de ${totalSessions} sessões — excelente resposta terapêutica.`,
      conduta: "Considerar alta ou manutenção com menor frequência. Reforçar exercícios domiciliares.",
      baseadoEm: `Dor inicial ${initialPain}/10 → atual ${currentPain}/10 em ${totalSessions} sessões`,
      confidence: 90,
    });
  }

  // ─── Rule 2: Day-of-week pain pattern ────────────────────────────────────────
  if (evolutions.length >= 4) {
    const generalAvgPain = avg(painLevels);
    const byDay: Record<string, number[]> = {};
    for (const evo of evolutions) {
      if (evo.pain_level === null) continue;
      const day = new Date(evo.session_date).toLocaleDateString("pt-BR", { weekday: "long" });
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(evo.pain_level);
    }
    for (const [day, vals] of Object.entries(byDay)) {
      if (vals.length >= 2 && avg(vals) > generalAvgPain + 1.5) {
        const dayAvg = avg(vals);
        alerts.push({
          severity: "warning",
          title: "Padrão de Dor Semanal",
          description: `Nas sessões de ${day}, a dor média (${dayAvg.toFixed(1)}/10) é consistentemente superior à média geral (${generalAvgPain.toFixed(1)}/10).`,
          conduta: "Investigar atividades realizadas no dia anterior. Considerar ajuste na programação de sessões.",
          baseadoEm: `${vals.length} sessões de ${day} analisadas`,
          confidence: 70,
        });
        break; // report only the most prominent day
      }
    }
  }

  // ─── Rule 3: HEP adherence ───────────────────────────────────────────────────
  if (hepCheckins.length > 0) {
    const completed = hepCheckins.filter((c) => c.completed === 1).length;
    const adherenceRate = completed / hepCheckins.length;
    if (adherenceRate < 0.5) {
      alerts.push({
        severity: "danger",
        title: "Baixa Adesão ao Plano Domiciliar",
        description: `Apenas ${Math.round(adherenceRate * 100)}% dos exercícios domiciliares foram realizados nos últimos 7 dias.`,
        conduta: "Revisar dificuldades do paciente, simplificar o plano ou reduzir o número de exercícios.",
        baseadoEm: `${completed}/${hepCheckins.length} check-ins completados nos últimos 7 dias`,
        confidence: 95,
      });
    } else if (adherenceRate >= 0.8) {
      alerts.push({
        severity: "success",
        title: "Excelente Adesão ao Plano Domiciliar",
        description: `${Math.round(adherenceRate * 100)}% dos exercícios domiciliares realizados nos últimos 7 dias — ótima disciplina.`,
        conduta: "Reforçar positivamente e considerar progressão do plano domiciliar.",
        baseadoEm: `${completed}/${hepCheckins.length} check-ins completados nos últimos 7 dias`,
        confidence: 95,
      });
    }
  }

  // ─── Rule 4: Clinical stagnation ─────────────────────────────────────────────
  if (painLevels.length >= 4) {
    const last4 = painLevels.slice(-4);
    const maxPain = Math.max(...last4);
    const minPain = Math.min(...last4);
    if (maxPain - minPain <= 1) {
      alerts.push({
        severity: "warning",
        title: "Estagnação Clínica",
        description: `Variação máxima de ${maxPain - minPain} ponto(s) nas últimas 4 sessões — resposta analgésica insuficiente.`,
        conduta: "Reavaliar abordagem terapêutica. Considerar técnicas complementares ou referência para avaliação médica.",
        baseadoEm: `Dor nas últimas 4 sessões: ${last4.join(", ")}`,
        confidence: 80,
      });
    }
  }

  // ─── Rule 5: Post-procedure worsening ────────────────────────────────────────
  if (evolutions.length >= 2) {
    const invasiveKeywords = ["agulhamento", "punção", "bloqueio", "manipulação", "thrust"];
    for (let i = evolutions.length - 1; i >= 1; i--) {
      const prev = evolutions[i - 1];
      const curr = evolutions[i];
      if (
        curr.pain_level !== null &&
        prev.pain_level !== null &&
        curr.pain_level > prev.pain_level + 1
      ) {
        const procs = parseProcedures(prev.procedures);
        const hadInvasive = procs.some((p) =>
          invasiveKeywords.some((kw) => p.toLowerCase().includes(kw))
        );
        if (hadInvasive) {
          alerts.push({
            severity: "warning",
            title: "Piora Pós-Procedimento",
            description: `Aumento de dor de ${prev.pain_level}/10 para ${curr.pain_level}/10 após procedimento invasivo.`,
            conduta: "Documentar reação. Considerar modificação da técnica ou redução da carga do procedimento.",
            baseadoEm: `Procedimento anterior: ${procs.join(", ")}`,
            confidence: 75,
          });
          break;
        }
      }
    }
  }

  // ─── Rule 6: Negative response pattern ───────────────────────────────────────
  if (evolutions.length >= 3) {
    const last3 = evolutions.slice(-3);
    const negatives = last3.filter((e) => e.patient_response === "negative").length;
    if (negatives >= 2) {
      alerts.push({
        severity: "danger",
        title: "Padrão de Resposta Negativa",
        description: `${negatives} das últimas 3 sessões com resposta negativa — resistência ao tratamento atual.`,
        conduta: "Revisão completa do plano terapêutico. Considerar avaliação de fatores psicossociais.",
        baseadoEm: "Análise das últimas 3 respostas do paciente",
        confidence: 85,
      });
    }
  }

  // ─── Rule 7: High irritability + invasive procedure ──────────────────────────
  if (currentPainLevel >= 7 && isAcute) {
    const recentProcs = parseProcedures(lastEvolution?.procedures ?? null);
    const invasiveKeywords = ["agulhamento", "manipulação", "thrust", "punção", "bloqueio"];
    const hadInvasive = recentProcs.some((p) =>
      invasiveKeywords.some((kw) => p.toLowerCase().includes(kw))
    );
    if (hadInvasive) {
      alerts.push({
        severity: "danger",
        title: "Alta Irritabilidade Tecidual",
        description: `Dor ${currentPainLevel}/10 em fase aguda com uso recente de procedimento invasivo — risco de exacerbação.`,
        conduta: "Priorizar analgesia passiva (crioterapia, TENS, repouso relativo). Suspender manipulações de alta velocidade.",
        baseadoEm: `Dor atual ${currentPainLevel}/10, fase aguda, procedimento: ${recentProcs.join(", ")}`,
        confidence: 88,
      });
    }
  }

  // ─── Rule 8: High frequency without progress ─────────────────────────────────
  if (
    totalSessions >= 10 &&
    initialPain !== null &&
    currentPain !== null &&
    initialPain > 0 &&
    (initialPain - currentPain) / initialPain < 0.25
  ) {
    const pct = Math.round(((initialPain - currentPain) / initialPain) * 100);
    alerts.push({
      severity: "warning",
      title: "Alta Frequência sem Progresso Proporcional",
      description: `${totalSessions} sessões realizadas com redução de apenas ${pct}% da dor inicial.`,
      conduta: "Revisar diagnóstico, objetivos terapêuticos e abordagem. Considerar referência multidisciplinar.",
      baseadoEm: `Dor inicial ${initialPain}/10 → atual ${currentPain}/10 em ${totalSessions} sessões`,
      confidence: 82,
    });
  }

  // ─── Rule 9: Goal achieved ────────────────────────────────────────────────────
  const funcStatus = (latestEval?.functional_status ?? "").toLowerCase();
  if (
    currentPainLevel <= 2 &&
    (funcStatus.includes("bom") || funcStatus.includes("independ") || funcStatus.includes("alta"))
  ) {
    alerts.push({
      severity: "success",
      title: "Objetivo Terapêutico Alcançado",
      description: `Dor controlada (${currentPainLevel}/10) com bom estado funcional — critérios de alta atingidos.`,
      conduta: "Considerar alta clínica com plano de manutenção domiciliar e retorno em caso de recidiva.",
      baseadoEm: `Dor atual ${currentPainLevel}/10, status funcional: ${latestEval?.functional_status}`,
      confidence: 85,
    });
  }

  // Sort: danger=0, warning=1, info=2, success=3
  const order: Record<string, number> = { danger: 0, warning: 1, info: 2, success: 3 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
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

  // HEP checkins from last 7 days
  const { results: hepCheckins } = await c.env.DB.prepare(
    `SELECT hc.id, hc.plan_id, hc.exercise_id, hc.completed, hc.pain_level, hc.difficulty, hc.notes, hc.checked_at
     FROM hep_checkins hc
     JOIN hep_plans hp ON hc.plan_id = hp.id
     WHERE hp.patient_id = ?
     AND hc.checked_at >= datetime('now', '-7 days')
     ORDER BY hc.checked_at DESC`
  ).bind(patientId).all<HepCheckinRow>();

  const totalSessions = evolutions.length;
  const lastEvolution = totalSessions > 0 ? evolutions[totalSessions - 1] : null;

  const painLevels = evolutions
    .filter((e: EvolutionRow) => e.pain_level !== null)
    .map((e: EvolutionRow) => e.pain_level as number);

  // Engine-computed trend, phase, severity. Same numbers used by suporte
  // and alertas — guarantees no cross-surface contradictions.
  const phase = computePhase(latestEval ?? null, evolutions);
  const trend = computeTrend(latestEval ?? null, evolutions);
  const currentPainLevel = lastEvolution?.pain_level ?? trend.current ?? null;
  const initialPainLevel = trend.initial;
  const painTrend = trend.direction === "unknown" ? "stable" : trend.direction;
  const severity = computeSeverity(currentPainLevel, trend, phase, latestEval?.functional_status);

  // Deduplicated procedures list
  const allProcedures = evolutions.flatMap((e: EvolutionRow) => parseProcedures(e.procedures));
  const proceduresUsed = [...new Set(allProcedures)].slice(0, 20);

  const last3Pain = painLevels.slice(-3);
  const averagePainLast3Sessions =
    last3Pain.length > 0 ? Math.round(avg(last3Pain) * 10) / 10 : null;

  const notImproving = trend.direction !== "improving" && totalSessions >= 3;
  const highPain = severity.level === "high";

  const alerts = generateClinicalAlerts(evolutions, latestEval ?? null, hepCheckins);

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
      lastPatientResponse: (() => {
        const raw = lastEvolution?.patient_response ?? null;
        if (!raw) return null;
        const map: Record<string, string> = {
          positive: "Positiva",
          negative: "Negativa",
          neutral: "Neutra",
          improving: "Melhorando",
          worsening: "Piorando",
          stable: "Estável",
        };
        return map[raw] ?? raw;
      })(),
      averagePainLast3Sessions,
    },
    clinicalFlags: {
      isAcute: phase.isAcute,
      isSubacute: phase.isSubacute,
      isChronic: phase.isChronic,
      phase: phase.label,
      daysSinceEval: phase.daysSince,
      highPain,
      notImproving,
      fewSessions: totalSessions < 3,
      severityLevel: severity.level,
      urgency: severity.urgency,
    },
    alerts,
  });
});
