// ============================================
// CLINICAL ENGINE — single source of truth
//
// Before this file existed, three different routes computed pain trend,
// severity, and treatment status with conflicting rules. The same patient
// could simultaneously appear as "Evolução Positiva" in one card and
// "Atenção — evolução lenta" in another, on the same screen.
//
// This module owns those calculations. suporte.ts, alertas.ts, and
// clinical-context.ts all consume from here. If you need to change a
// threshold, change it ONCE, here.
// ============================================

export interface EvolutionPoint {
  pain_level: number | null;
  patient_response?: string | null;
  session_date?: string;
}

export interface InitialEvalPoint {
  pain_level: number | null;
  created_at?: string;
  functional_status?: string | null;
}

// ─── Pain phase (acute / subacute / chronic) ─────────────────────────────────
//
// Days since the reference event. Reference is the latest evaluation's
// created_at, falling back to the first evolution's session_date, falling
// back to "now" (i.e. 0 days — fresh case).

export interface ClinicalPhase {
  daysSince: number;
  isAcute: boolean;     // <= 7 days
  isSubacute: boolean;  // 8-21 days
  isChronic: boolean;   // > 21 days
  label: "agudo" | "subagudo" | "crônico";
}

export function computePhase(
  latestEval: InitialEvalPoint | null,
  evolutions: EvolutionPoint[]
): ClinicalPhase {
  const referenceDate =
    latestEval?.created_at ??
    (evolutions[0]?.session_date ?? null);
  const daysSince = referenceDate
    ? Math.floor((Date.now() - new Date(referenceDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isAcute = daysSince <= 7;
  const isSubacute = daysSince > 7 && daysSince <= 21;
  const isChronic = daysSince > 21;
  const label = isAcute ? "agudo" : isSubacute ? "subagudo" : "crônico";
  return { daysSince, isAcute, isSubacute, isChronic, label };
}

// ─── Pain severity ────────────────────────────────────────────────────────────
//
// Composite, not pure threshold. Same EVA score means different things in
// different contexts:
//   - EVA 6 stable for 30 days vs EVA 6 dropping from 9 in a week.
//   - EVA 7 with full ADLs vs EVA 7 confined to bed.
//
// Output `urgency` is what UIs should sort by; `level` is the raw EVA bucket
// for compatibility with old code.

export type SeverityLevel = "none" | "low" | "moderate" | "high";
export type Urgency = "info" | "watch" | "concern" | "urgent";

export interface SeverityAssessment {
  level: SeverityLevel;        // raw bucket from current pain
  urgency: Urgency;            // composite for triage / sort
  label: string;               // human-readable
  modifiers: string[];         // explains what shifted urgency up/down
}

export function computeSeverity(
  currentPain: number | null,
  trend: PainTrend,
  phase: ClinicalPhase,
  functionalStatus: string | null | undefined
): SeverityAssessment {
  const modifiers: string[] = [];

  // Base level from current pain
  let level: SeverityLevel = "none";
  if (currentPain == null) level = "none";
  else if (currentPain >= 7) level = "high";
  else if (currentPain >= 4) level = "moderate";
  else if (currentPain >= 1) level = "low";

  // Start urgency from level
  let urgency: Urgency =
    level === "high" ? "concern" :
    level === "moderate" ? "watch" :
    level === "low" ? "info" : "info";

  // Modifier: rapid improvement → de-escalate one notch
  if (trend.direction === "improving" && trend.changePercent != null && trend.changePercent >= 30) {
    if (urgency === "concern") urgency = "watch";
    else if (urgency === "watch") urgency = "info";
    modifiers.push(`melhora ${trend.changePercent}%`);
  }

  // Modifier: high pain + acute + worsening → escalate
  if (level === "high" && phase.isAcute && trend.direction === "worsening") {
    urgency = "urgent";
    modifiers.push("agudo + piora");
  }

  // Modifier: high pain in chronic phase that's not improving → escalate
  if (level === "high" && phase.isChronic && trend.direction !== "improving") {
    urgency = "urgent";
    modifiers.push("crônico sem melhora");
  }

  // Modifier: any pain with poor function → bump up
  const fn = (functionalStatus ?? "").toLowerCase();
  if (fn && (fn.includes("ruim") || fn.includes("limit") || fn.includes("incapaz") || fn.includes("acam"))) {
    if (urgency === "info") urgency = "watch";
    else if (urgency === "watch") urgency = "concern";
    modifiers.push("limitação funcional");
  }

  const label = labelFor(level);
  return { level, urgency, label, modifiers };
}

function labelFor(level: SeverityLevel): string {
  switch (level) {
    case "high": return "Intensa";
    case "moderate": return "Moderada";
    case "low": return "Leve";
    case "none": return "Sem dor";
  }
}

// ─── Pain trend ───────────────────────────────────────────────────────────────
//
// One single definition. Compares last-3-avg vs first-3-avg for stability,
// falls back to (currentPain vs initialEvalPain) when there are fewer than
// 3 evolution points. Threshold: >=1.5 EVA change to declare improving/worsening
// (smaller deltas are noise from session-to-session variability).

export type TrendDirection = "improving" | "stable" | "worsening" | "unknown";

export interface PainTrend {
  direction: TrendDirection;
  changePercent: number | null;  // signed percentage from initial reference
  initial: number | null;
  current: number | null;
  basis: "last3-vs-first3" | "current-vs-initial" | "single-point" | "no-data";
}

export function computeTrend(
  latestEval: InitialEvalPoint | null,
  evolutions: EvolutionPoint[]
): PainTrend {
  const painLevels = evolutions
    .map((e) => e.pain_level)
    .filter((p): p is number => p !== null && p !== undefined);

  // Strongest basis: 6+ evolutions → first-3 vs last-3 with NO overlap.
  // Below 6, the 3-point windows share 1-2 points and dilute signal,
  // declaring "stable" for cases that are clearly improving (e.g. 8→7→6→5).
  if (painLevels.length >= 6) {
    const first3 = painLevels.slice(0, 3);
    const last3 = painLevels.slice(-3);
    const initialAvg = avg(first3);
    const currentAvg = avg(last3);
    const diff = initialAvg - currentAvg;
    let direction: TrendDirection = "stable";
    if (diff >= 1.5) direction = "improving";
    else if (diff <= -1.5) direction = "worsening";
    const changePercent = initialAvg > 0
      ? Math.round((diff / initialAvg) * 100)
      : null;
    return {
      direction,
      changePercent,
      initial: round1(initialAvg),
      current: round1(currentAvg),
      basis: "last3-vs-first3",
    };
  }

  // Mid basis (2-5 evolutions OR fewer + latestEval): compare evaluation
  // anchor vs most recent evolution. Reflects the trajectory the patient
  // actually experienced from initial assessment to today.
  const anchor = latestEval?.pain_level ?? (painLevels.length >= 2 ? painLevels[0] : null);
  if (anchor != null && painLevels.length >= 1) {
    const current = painLevels[painLevels.length - 1];
    const diff = anchor - current;
    let direction: TrendDirection = "stable";
    if (diff >= 1.5) direction = "improving";
    else if (diff <= -1.5) direction = "worsening";
    const changePercent = anchor > 0
      ? Math.round((diff / anchor) * 100)
      : null;
    return {
      direction,
      changePercent,
      initial: anchor,
      current,
      basis: "current-vs-initial",
    };
  }

  // Weak basis: only one data point — declare unknown trend, but expose value
  if (painLevels.length === 1) {
    return {
      direction: "unknown",
      changePercent: null,
      initial: painLevels[0],
      current: painLevels[0],
      basis: "single-point",
    };
  }
  if (latestEval?.pain_level != null) {
    return {
      direction: "unknown",
      changePercent: null,
      initial: latestEval.pain_level,
      current: latestEval.pain_level,
      basis: "single-point",
    };
  }

  return {
    direction: "unknown",
    changePercent: null,
    initial: null,
    current: null,
    basis: "no-data",
  };
}

// ─── Treatment status (green/yellow/red) ──────────────────────────────────────
//
// Used by the patient-overview card. Single rule that consumes trend +
// severity + sessionsCount.

export type TreatmentStatus = "green" | "yellow" | "red" | "pending";

export interface TreatmentStatusAssessment {
  status: TreatmentStatus;
  message: string;
  reason: string;
}

export function computeTreatmentStatus(
  trend: PainTrend,
  severity: SeverityAssessment,
  sessionsCount: number,
  hasInitialEval: boolean
): TreatmentStatusAssessment {
  if (!hasInitialEval) {
    return {
      status: "pending",
      message: "Avaliação inicial pendente",
      reason: "Sem avaliação registrada para comparação",
    };
  }
  if (sessionsCount === 0) {
    return {
      status: "pending",
      message: "Aguardando primeira evolução",
      reason: "Sem evoluções para análise",
    };
  }

  // Urgent flags trump everything
  if (severity.urgency === "urgent") {
    return {
      status: "red",
      message: "Alerta — situação prioritária",
      reason: severity.modifiers.join(" + ") || "Dor intensa com piora",
    };
  }

  // Worsening trend is yellow at minimum, red if severity is also high
  if (trend.direction === "worsening") {
    if (severity.level === "high") {
      return {
        status: "red",
        message: "Atenção — dor intensa em piora",
        reason: `Dor ${trend.initial}/10 → ${trend.current}/10 (${trend.changePercent}%)`,
      };
    }
    return {
      status: "yellow",
      message: "Atenção — tendência de piora",
      reason: `Dor ${trend.initial}/10 → ${trend.current}/10`,
    };
  }

  // Improving → green if change is meaningful or current pain is low
  if (trend.direction === "improving" && trend.changePercent != null) {
    if (trend.changePercent >= 30 || (trend.current != null && trend.current <= 3)) {
      return {
        status: "green",
        message: "Evolução adequada",
        reason: `Redução de ${trend.changePercent}% na dor em ${sessionsCount} sessões`,
      };
    }
    return {
      status: "yellow",
      message: "Evolução lenta",
      reason: `Redução de apenas ${trend.changePercent}% após ${sessionsCount} sessões`,
    };
  }

  // Stable: yellow if pain still moderate/high; green if low
  if (trend.direction === "stable") {
    if (severity.level === "high") {
      return {
        status: "red",
        message: "Estagnação com dor intensa",
        reason: `Dor ${trend.current}/10 sem variação significativa`,
      };
    }
    if (severity.level === "moderate") {
      return {
        status: "yellow",
        message: "Estagnação",
        reason: `Dor ${trend.current}/10 estável — considerar ajuste de conduta`,
      };
    }
    return {
      status: "green",
      message: "Quadro controlado",
      reason: `Dor ${trend.current}/10 estável e tolerável`,
    };
  }

  // Unknown / single point
  return {
    status: "yellow",
    message: "Dados insuficientes",
    reason: `${sessionsCount} sessão(ões) — precisa mais pontos para tendência`,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
