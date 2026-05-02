import type { Hono } from "hono";
import { authMiddleware, splitDelimitedText } from "../../lib/helpers";
import {
  computeTrend,
  computeSeverity,
  computePhase,
  type ClinicalPhase,
  type PainTrend,
  type SeverityAssessment,
} from "../../lib/clinical-engine";

// ============================================
// SUPORTE (SUPPORT) API - Read Only
//
// Generates clinical insights, next steps, and diagnostic hypotheses.
// Trend, severity, and phase calculations are delegated to clinical-engine.ts
// (single source of truth across the app).
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
  evidenceNote?: string; // short citation/standard, e.g. "Neer 1972; Hawkins 1980"
}

interface StructuredSuporte {
  painStatus: {
    level: number | null;
    severity: SeverityAssessment["level"];
    urgency: SeverityAssessment["urgency"];
    trend: PainTrend["direction"];
    changePercent: number | null;
    phase: ClinicalPhase["label"];
  };
  insights: ClinicalInsight[];
  nextSteps: string[];
  diagnosticHypotheses: DiagnosticHypothesis[];
}

interface EvaluationRow {
  pain_level: number | null;
  pain_location: string | null;
  chief_complaint: string | null;
  history?: string | null;
  functional_status?: string | null;
}

interface EvolutionRow {
  pain_level: number | null;
  patient_response?: string | null;
  observations?: string | null;
  functional_status?: string | null;
  procedures?: string | null;
  session_date?: string;
}

interface CaminhoRow {
  pain_pattern: string | null;
  red_flags: string | null;
  treatment_goals: string | null;
  aggravating_factors?: string | null;
  relieving_factors?: string | null;
  functional_limitations?: string | null;
}

function generateStructuredSuporte(
  evaluation: EvaluationRow | null,
  caminho: CaminhoRow | null,
  evolution: EvolutionRow | null,
  allEvolutions: EvolutionRow[],
): StructuredSuporte {
  const insights: ClinicalInsight[] = [];
  const nextSteps: string[] = [];

  const painLocation = evaluation?.pain_location || "";
  const chiefComplaint = evaluation?.chief_complaint || "";

  // Engine-computed (single source of truth — same numbers used by alertas
  // and clinical-context endpoints).
  const phase = computePhase(evaluation, allEvolutions);
  const trend = computeTrend(evaluation, allEvolutions);
  const currentPain = evolution?.pain_level ?? trend.current ?? evaluation?.pain_level ?? null;
  const severity = computeSeverity(currentPain, trend, phase, evaluation?.functional_status);

  if (!evaluation) {
    insights.push({
      category: "alert",
      priority: "info",
      title: "Avaliação Pendente",
      description: "Complete a avaliação inicial para ativar o apoio clínico.",
      actions: ["Registrar queixa principal", "Documentar EVA inicial", "Exame físico"]
    });
  } else {
    // Phase-aware analgesia. Acute = gate-control TENS (100Hz). Chronic =
    // endorphinic TENS (2-10Hz). Sluka KA, Walsh D. J Pain 2003;4(3):109-21.
    if (severity.level === "high") {
      const tensFreq = phase.isAcute ? "TENS 80-150Hz (convencional)" : "TENS 2-10Hz (acupuntura-like)";
      const thermal = phase.isAcute ? "Crioterapia 15-20min" : "Termoterapia superficial 15-20min";
      insights.push({
        category: "pain",
        priority: "high",
        title: `Dor Intensa (fase ${phase.label})`,
        description: phase.isAcute
          ? "Fase aguda com dor elevada — priorizar analgesia passiva e minimizar carga."
          : "Dor intensa em fase prolongada — combinar analgesia com componente educacional e progressão gradual.",
        actions: [tensFreq, thermal, "Repouso relativo guiado", "Reavaliar em 48-72h"],
      });
    } else if (severity.level === "moderate") {
      insights.push({
        category: "pain",
        priority: "medium",
        title: `Dor Moderada (fase ${phase.label})`,
        description: phase.isAcute
          ? "Fase de irritabilidade — graus baixos de mobilização + analgesia."
          : "Janela ideal para cinesioterapia ativa com analgesia complementar.",
        actions: phase.isAcute
          ? ["Mobilização Maitland I-II", "TENS convencional", "Isometria submáxima"]
          : ["Mobilização Maitland III-IV", "Isotônico progressivo", "Educação em dor"],
      });
    } else if (severity.level === "low") {
      insights.push({
        category: "pain",
        priority: "low",
        title: "Dor Leve",
        description: "Momento ideal para progressão funcional e retomada de atividades.",
        actions: ["Fortalecimento isotônico", "Propriocepção/equilíbrio", "Retorno gradual ao esporte/AVDs"],
      });
    }

    // Trend insights — derived from the same engine, no contradictions.
    if (trend.direction === "improving" && trend.changePercent != null) {
      insights.push({
        category: "progression",
        priority: "low",
        title: "Evolução Positiva",
        description: `Redução de ${trend.changePercent}% na dor (${trend.initial}/10 → ${trend.current}/10). Manter abordagem.`,
        actions: ["Progressão gradual de cargas", "Documentar técnicas eficazes"],
      });
    } else if (trend.direction === "worsening") {
      insights.push({
        category: "progression",
        priority: "high",
        title: "Atenção: Piora",
        description: trend.changePercent != null
          ? `Aumento de ${Math.abs(trend.changePercent)}% na dor (${trend.initial}/10 → ${trend.current}/10). Reavaliar conduta.`
          : "Paciente com tendência de piora. Reavaliar conduta.",
        actions: ["Verificar sobrecarga", "Considerar nova avaliação", "Ajustar plano"],
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

  const diagnosticHypotheses = generateDiagnosticHypotheses(evaluation, caminho);

  return {
    painStatus: {
      level: currentPain,
      severity: severity.level,
      urgency: severity.urgency,
      trend: trend.direction,
      changePercent: trend.changePercent,
      phase: phase.label,
    },
    insights,
    nextSteps,
    diagnosticHypotheses,
  };
}

// ============================================
// DIAGNOSTIC HYPOTHESES — declarative rule engine
//
// Replaces the previous substring-matching system. Improvements:
//   1. Negation handling — "não tem irradiação" no longer triggers the
//      irradiation-positive feature.
//   2. Confidence is grounded — ratio of features matched out of features
//      defined for the rule, not "1 match = média / 2 = alta".
//   3. Each rule carries a short evidenceNote with the seminal reference,
//      so users can verify the reasoning standard.
//   4. New rules added: Síndrome Femoropatelar, Tendinopatia Patelar,
//      Bursite Trocantérica, Cervicalgia Tensional. Previous version
//      returned ZERO hypotheses for "dor no joelho ao subir escadas",
//      which is the most common knee complaint in PT clinics.
// ============================================

interface FeatureMatch {
  pattern: RegExp;
  label: string;
}

interface DxRule {
  condition: string;
  region: RegExp;
  features: FeatureMatch[];
  excludeIf?: RegExp[];
  differentials: string[];
  suggestedTests: string[];
  evidenceNote?: string;
  minFeatures?: number;
}

const NEGATION_TOKENS = /\b(n[aã]o|sem|nunca|nego|negou|nega|nenhuma?|no|without|never)\b/iu;

function isNegated(text: string, matchIndex: number): boolean {
  const windowStart = Math.max(0, matchIndex - 60);
  const windowText = text.slice(windowStart, matchIndex);
  return NEGATION_TOKENS.test(windowText);
}

function hasFeatureMatch(text: string, pattern: RegExp): boolean {
  if (!text) return false;
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  const re = new RegExp(pattern.source, flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (!isNegated(text, m.index)) return true;
  }
  return false;
}

function confidenceFromRatio(ratio: number): "alta" | "média" | "baixa" {
  if (ratio >= 0.6) return "alta";
  if (ratio >= 0.3) return "média";
  return "baixa";
}

const DX_RULES: DxRule[] = [
  // ─── SHOULDER ──────────────────────────────────────────────────────────────
  {
    condition: "Síndrome do Impacto do Ombro",
    region: /ombro|shoulder|delt[oó]ide/i,
    features: [
      { pattern: /eleva[cç][aã]o|acima|levantar|erguer|alto|pentear|vestir|alcan[cç]ar/i, label: "Dor ao elevar o braço acima de 90°" },
      { pattern: /movimento|mexer|mover/i, label: "Dor relacionada ao movimento" },
      { pattern: /arco doloroso|abdu[cç][aã]o|abrir o bra[cç]o|lateral/i, label: "Arco doloroso na abdução" },
    ],
    differentials: ["Tendinopatia do Manguito Rotador", "Bursite Subacromial", "Capsulite Adesiva"],
    suggestedTests: ["Teste de Neer", "Teste de Hawkins-Kennedy", "Teste de Jobe"],
    evidenceNote: "Neer 1972; Hawkins & Kennedy 1980",
  },
  {
    condition: "Capsulite Adesiva (Ombro Congelado)",
    region: /ombro|shoulder|delt[oó]ide/i,
    features: [
      { pattern: /rota[cç][aã]o|rigidez|duro|preso|limitado|n[aã]o consegue/i, label: "Limitação ativa+passiva (rotação externa)" },
      { pattern: /congelado|r[ií]gido|travado|preso|n[aã]o mexe|trancado/i, label: "Relato de ombro congelado/travado" },
      { pattern: /noturna|repouso|dormir|noite|deitar/i, label: "Dor noturna significativa" },
    ],
    differentials: ["Artrose Glenoumeral", "Lesão SLAP", "Síndrome do Impacto"],
    suggestedTests: ["ADM passiva (perda de RE >50%)", "Rotação Externa Passiva", "Teste de Apley"],
    evidenceNote: "Codman 1934; Hand et al. JSES 2008",
  },

  // ─── LUMBAR ────────────────────────────────────────────────────────────────
  {
    condition: "Hérnia Discal Lombar / Síndrome Radicular",
    region: /lombar|lumbar|coluna|costas|dorso/i,
    features: [
      { pattern: /sentar|flex[aã]o|dobrar|inclinar|frente/i, label: "Piora com flexão/sentado" },
      { pattern: /irradia[cç][aã]o|irradia|descendo|perna|ci[aá]tic|formigamento/i, label: "Dor com irradiação para MMII" },
    ],
    differentials: ["Estenose de Canal", "Lombalgia Mecânica", "Síndrome Piriforme"],
    suggestedTests: ["Teste de Lasègue", "Teste SLUMP", "Sinal de Bragard"],
    evidenceNote: "Lasègue 1864; Devillé et al. Spine 2000",
  },
  {
    condition: "Lombalgia Mecânica Inespecífica",
    region: /lombar|lumbar|coluna|costas|dorso/i,
    excludeIf: [/irradia[cç][aã]o|formigamento|ci[aá]tic|descendo|perna/i],
    features: [
      { pattern: /movimento|carregar|levantar|trabalho|atividade/i, label: "Piora com atividades funcionais" },
      { pattern: /repouso|deitar|descanso/i, label: "Alívio com repouso" },
    ],
    differentials: ["Hérnia Discal", "Estenose", "Síndrome Facetária"],
    suggestedTests: ["Avaliação Postural", "Teste de Flexão Lombar", "Palpação Paravertebral"],
    evidenceNote: "Maher et al. Lancet 2017 (~85% lombalgia é inespecífica)",
  },

  // ─── KNEE ──────────────────────────────────────────────────────────────────
  {
    condition: "Lesão do Ligamento Cruzado Anterior",
    region: /joelho|knee/i,
    features: [
      { pattern: /instabilidade|falha|cede|travamento|tor[cç][aã]o|torceu/i, label: "Episódio de torção / instabilidade" },
      { pattern: /pivotar|mudar dire[cç][aã]o|correr|saltar|descer escada/i, label: "Instabilidade em pivô/saltos" },
      { pattern: /estalo|crack|pop/i, label: "Estalo audível no momento da lesão" },
    ],
    differentials: ["Lesão Meniscal", "Lesão LCM", "Luxação Patelar"],
    suggestedTests: ["Teste de Lachman (mais sensível)", "Gaveta Anterior", "Pivot Shift"],
    evidenceNote: "Benjaminse et al. JOSPT 2006 (Lachman SE 0.85)",
  },
  {
    condition: "Lesão Meniscal",
    region: /joelho|knee/i,
    features: [
      { pattern: /estalo|estalos|travamento|derrame|incha[cç]o|linha do joelho/i, label: "Sintomas mecânicos típicos" },
      { pattern: /agachar|torcer|rota[cç][aã]o/i, label: "Piora com agachamento/rotação" },
    ],
    differentials: ["LCA", "Síndrome Femoropatelar", "Síndrome de Plica"],
    suggestedTests: ["Teste de McMurray", "Teste de Apley", "Thessaly Test"],
    evidenceNote: "Hegedus et al. JOSPT 2007",
  },
  {
    // NEW — was missing entirely. Most common knee complaint in PT clinics.
    condition: "Síndrome da Dor Femoropatelar",
    region: /joelho|knee|patela|patel[aá]|anterior do joelho/i,
    excludeIf: [/instabilidade aguda|estalo de torção|tor[cç][aã]o recente/i],
    features: [
      { pattern: /escad|degrau|subir|descer/i, label: "Dor ao subir/descer escadas" },
      { pattern: /agachar|sentar prolongado|cinema|carro/i, label: "Dor ao agachar ou após sentar prolongado" },
      { pattern: /anterior|frente|atr[aá]s da patela|atr[aá]s da r[oó]tula/i, label: "Dor anterior do joelho" },
      { pattern: /correr|corrida/i, label: "Dor durante/após corrida" },
    ],
    minFeatures: 2,
    differentials: ["Tendinopatia Patelar", "Lesão Meniscal", "Condromalácia"],
    suggestedTests: ["Sinal de Clarke (compressão patelar)", "Single-leg squat", "Step-down test"],
    evidenceNote: "Crossley et al. BJSM 2016 (Patellofemoral Pain Consensus)",
  },
  {
    // NEW — common in jumping athletes
    condition: "Tendinopatia Patelar (Jumper's Knee)",
    region: /joelho|knee|patela|tend[aã]o patelar/i,
    features: [
      { pattern: /salt|aterrissagem|p[ií]os|jump/i, label: "Dor associada a saltos/aterrissagem" },
      { pattern: /polo inferior|abaixo da patela/i, label: "Dor no polo inferior da patela" },
      { pattern: /matinal|in[ií]cio.*atividade|aquece/i, label: "Dor matinal que melhora com aquecimento" },
    ],
    differentials: ["Síndrome Femoropatelar", "Bursite Pré-patelar", "Doença de Osgood-Schlatter"],
    suggestedTests: ["Palpação polo inferior", "Single-leg decline squat", "VISA-P score"],
    evidenceNote: "Cook & Purdam BJSM 2009 (continuum model)",
  },

  // ─── CERVICAL ──────────────────────────────────────────────────────────────
  {
    condition: "Síndrome Radicular Cervical",
    region: /cervical|pesco[cç]o|neck|nuca|occipital/i,
    features: [
      { pattern: /irradia[cç][aã]o|bra[cç]o|formigamento|m[aã]o|dorm[eê]ncia/i, label: "Irradiação para membros superiores" },
      { pattern: /piora.*rota[cç][aã]o|olhar para tr[aá]s/i, label: "Piora à rotação cervical" },
    ],
    differentials: ["Hérnia Cervical", "Estenose Cervical", "Síndrome do Desfiladeiro"],
    suggestedTests: ["Teste de Spurling", "Distração Cervical", "Teste de Adson"],
    evidenceNote: "Wainner et al. Spine 2003 (CPR for cervical radiculopathy)",
  },
  {
    // NEW — most common cervical complaint, was missing
    condition: "Cervicalgia Tensional / Mecânica",
    region: /cervical|pesco[cç]o|neck|nuca|occipital|trap[eé]zio/i,
    excludeIf: [/irradia[cç][aã]o|formigamento|dorm[eê]ncia.*bra[cç]o|m[aã]o/i],
    features: [
      { pattern: /tens[aã]o|n[oó]|endurecid|contrai|estresse/i, label: "Tensão/contratura muscular" },
      { pattern: /trabalho|computador|postur|cabe[cç]a baixa|celular/i, label: "Padrão postural sustentado" },
      { pattern: /cefaleia|dor de cabe[cç]a/i, label: "Cefaleia tensional associada" },
    ],
    differentials: ["Síndrome Radicular Cervical", "Cefaleia Cervicogênica", "Disfunção ATM"],
    suggestedTests: ["Palpação suboccipital + trapézio superior", "ADM Cervical", "Teste de Jackson"],
    evidenceNote: "Blanpied et al. JOSPT 2017 (Neck Pain CPG)",
  },

  // ─── HIP ───────────────────────────────────────────────────────────────────
  {
    // NEW — was a single fallback rule for "any hip pain". Now specific.
    condition: "Bursite Trocantérica / Síndrome da Dor Glútea Lateral",
    region: /quadril|hip|trocant|lateral.*quadril|virilha|gl[uú]teo/i,
    features: [
      { pattern: /lateral|de lado|deitar.*lado/i, label: "Dor lateral, piora ao deitar do lado afetado" },
      { pattern: /caminhar|andar|escada/i, label: "Piora ao caminhar/escadas" },
      { pattern: /trocant[eé]r|protuber[aâ]ncia/i, label: "Sensibilidade sobre o trocânter maior" },
    ],
    differentials: ["Impacto Femoroacetabular", "Lesão de Glúteo Médio", "Radiculopatia L4-L5"],
    suggestedTests: ["Palpação trocânter maior", "Single-leg stance (Trendelenburg)", "FABER"],
    evidenceNote: "Grimaldi et al. BJSM 2017 (GTPS)",
  },
  {
    condition: "Síndrome de Impacto Femoroacetabular",
    region: /quadril|hip|virilha|inguinal/i,
    features: [
      { pattern: /virilha|inguinal/i, label: "Dor inguinal/anterior" },
      { pattern: /agachar|sentar prolongado|cruzar perna/i, label: "Piora com flexão profunda" },
      { pattern: /jovem|atleta|esport/i, label: "Atleta jovem" },
    ],
    differentials: ["Bursite Trocantérica", "Artrose de Quadril", "Síndrome do Piriforme"],
    suggestedTests: ["FABER", "FADIR (anterior impingement)", "Thomas"],
    evidenceNote: "Reiman et al. BJSM 2015 (FADIR SE 0.94)",
  },

  // ─── ELBOW / WRIST ─────────────────────────────────────────────────────────
  {
    condition: "Epicondilite Lateral (Cotovelo do Tenista)",
    region: /cotovelo|elbow|epic[oô]ndilo/i,
    features: [
      { pattern: /lateral|extens[aã]o|extensor|t[eê]nis|raquete/i, label: "Dor lateral, padrão de tendinopatia extensora" },
      { pattern: /pegar peso|apertar|preensão/i, label: "Piora à preensão" },
    ],
    differentials: ["Epicondilite Medial", "Síndrome do Túnel Radial", "Artrose"],
    suggestedTests: ["Teste de Cozen", "Teste de Mill", "Palpação Epicôndilo Lateral"],
    evidenceNote: "Vicenzino BJSM 2003",
  },
  {
    condition: "Síndrome do Túnel do Carpo",
    region: /punho|wrist|m[aã]o|dedos|carpo/i,
    features: [
      { pattern: /formigamento|dorm[eê]ncia/i, label: "Parestesias em distribuição do nervo mediano" },
      { pattern: /noturn|noite|acorda/i, label: "Sintomas noturnos típicos" },
      { pattern: /dedos.*polegar|indicador|m[eé]dio/i, label: "Distribuição em primeiros 3 dedos" },
    ],
    differentials: ["Síndrome de De Quervain", "Radiculopatia Cervical C6-C7", "Neuropatia Periférica"],
    suggestedTests: ["Teste de Phalen", "Sinal de Tinel", "Teste de Durkan (mais sensível)"],
    evidenceNote: "Wainner et al. Arch Phys Med Rehabil 2005",
  },

  // ─── ANKLE / FOOT ──────────────────────────────────────────────────────────
  {
    condition: "Entorse / Instabilidade Crônica de Tornozelo",
    region: /tornozelo|ankle|p[eé]/i,
    features: [
      { pattern: /entorse|tor[cç][aã]o|instabilidade|lateral/i, label: "Histórico de entorse / sensação de instabilidade" },
      { pattern: /falha|cede|d[oó]i ao caminhar em irregular/i, label: "Falseio em terreno irregular" },
    ],
    differentials: ["Lesão Peroneal", "Síndrome do Seio do Tarso", "Fratura por Estresse"],
    suggestedTests: ["Gaveta Anterior", "Tilt Talar", "Compressão Peroneal"],
    evidenceNote: "Hertel JAT 2002 (chronic ankle instability)",
  },
  {
    condition: "Fascite Plantar",
    region: /tornozelo|p[eé]|calc[aâ]neo|plantar/i,
    features: [
      { pattern: /calcanhar|plant/i, label: "Dor no calcanhar/planta" },
      { pattern: /matinal|primeiro passo|ao acordar|in[ií]cio do dia/i, label: "Padrão típico matinal (primeiros passos)" },
    ],
    differentials: ["Esporão Calcâneo", "Neuroma de Morton", "Tendinopatia Aquiliana"],
    suggestedTests: ["Palpação Tuberosidade Calcâneo", "Teste de Windlass", "Avaliação de Pisada"],
    evidenceNote: "Riddle et al. JBJS 2003",
  },

  // ─── WIDESPREAD / CHRONIC ──────────────────────────────────────────────────
  {
    condition: "Dor Crônica / Sensibilização Central",
    region: /.*/,
    features: [
      { pattern: /cr[oô]nic|anos|meses|constante/i, label: "Duração prolongada (>3 meses)" },
      { pattern: /todo lugar|v[aá]rias partes|generalizada|corpo todo/i, label: "Dor difusa/generalizada" },
      { pattern: /cansa[cç]o|fadiga|sono|dormir|insônia/i, label: "Fadiga/alteração do sono associada" },
      { pattern: /catastr|piorar nunca|sempre vai doer/i, label: "Catastrofização presente" },
    ],
    minFeatures: 2,
    differentials: ["Fibromialgia", "Síndrome Miofascial", "Condição reumática"],
    suggestedTests: ["Avaliação Pontos-Gatilho", "PCS (Pain Catastrophizing Scale)", "TSK (Tampa Scale)"],
    evidenceNote: "Nijs et al. Phys Ther 2014 (central sensitization in PT)",
  },
];

function generateDiagnosticHypotheses(
  evaluation: EvaluationRow | null,
  caminho: CaminhoRow | null,
): DiagnosticHypothesis[] {
  const hypotheses: DiagnosticHypothesis[] = [];

  if (!evaluation) return hypotheses;

  const painLocation = (evaluation.pain_location || "").toLowerCase();
  const chiefComplaint = (evaluation.chief_complaint || "").toLowerCase();
  const history = (evaluation.history || "").toLowerCase();

  const caminhoBlob = [
    caminho?.pain_pattern,
    caminho?.aggravating_factors,
    caminho?.relieving_factors,
    caminho?.functional_limitations,
  ].filter(Boolean).join(" | ").toLowerCase();
  const blob = `${chiefComplaint} | ${history} | ${caminhoBlob}`;

  for (const rule of DX_RULES) {
    if (!rule.region.test(painLocation)) continue;
    if (rule.excludeIf?.some((re) => hasFeatureMatch(blob, re))) continue;

    const matched: string[] = [];
    for (const feat of rule.features) {
      if (hasFeatureMatch(blob, feat.pattern)) matched.push(feat.label);
    }

    const min = rule.minFeatures ?? 1;
    if (matched.length < min) continue;

    const ratio = matched.length / rule.features.length;
    hypotheses.push({
      condition: rule.condition,
      confidence: confidenceFromRatio(ratio),
      reasoning: matched,
      differentials: rule.differentials,
      suggestedTests: rule.suggestedTests,
      evidenceNote: rule.evidenceNote,
    });
  }

  // Red flags float to the top regardless of where they were detected.
  const redFlags = splitDelimitedText(caminho?.red_flags);
  if (redFlags.length > 0 && !redFlags.includes("none")) {
    hypotheses.unshift({
      condition: "⚠️ Red Flags Identificados — Avaliação Médica Prioritária",
      confidence: "alta",
      reasoning: ["Sinais de alerta identificados no Caminho Clínico", "Possível patologia grave subjacente"],
      differentials: ["Fratura", "Infecção", "Neoplasia", "Síndrome da Cauda Equina"],
      suggestedTests: ["Encaminhamento médico urgente", "Exames de imagem", "Exames laboratoriais"],
      evidenceNote: "Henschke et al. BMJ 2009 (red flags in low back pain)",
    });
  }

  return hypotheses;
}


export function registerSuporteRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/suporte", authMiddleware, async (c) => {
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
    ).bind(patientId).first<EvaluationRow>();

    const caminho = await c.env.DB.prepare(
      `SELECT * FROM caminho WHERE patient_id = ?`
    ).bind(patientId).first<CaminhoRow>();

    // All evolutions chronologically — needed by clinical-engine for trend
    // calculations (last3-vs-first3 basis). Worth the single extra query to
    // get the unified, consistent trend across all surfaces.
    const { results: allEvolutions } = await c.env.DB.prepare(
      `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
    ).bind(patientId).all<EvolutionRow>();
    const latestEvolution = allEvolutions.length > 0 ? allEvolutions[allEvolutions.length - 1] : null;

    const structured = generateStructuredSuporte(evaluation, caminho, latestEvolution, allEvolutions);

    return c.json({
      evaluation,
      caminho,
      latestEvolution,
      suggestions: structured.insights.map(i => `${i.title}: ${i.description}`),
      structured
    });
  });
}
