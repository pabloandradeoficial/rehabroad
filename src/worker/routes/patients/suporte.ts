import type { Hono } from "hono";
import { authMiddleware, splitDelimitedText } from "../../lib/helpers";

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

function generateStructuredSuporte(evaluation: EvaluationRow | null, caminho: CaminhoRow | null, evolution: EvolutionRow | null): StructuredSuporte {
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

    if (initialPain != null && currentPain != null) {
      const diff = initialPain - currentPain;
      if (diff > 0) {
        trend = "improving";
        changePercent = initialPain > 0 ? Math.round((diff / initialPain) * 100) : 0;
      } else if (diff < 0) {
        trend = "worsening";
        changePercent = initialPain > 0 ? Math.round((Math.abs(diff) / initialPain) * 100) : 0;
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

  const diagnosticHypotheses = generateDiagnosticHypotheses(evaluation, caminho);

  return {
    painStatus: { level: painLevel ?? null, severity, trend, changePercent },
    insights,
    nextSteps,
    diagnosticHypotheses
  };
}

function generateDiagnosticHypotheses(evaluation: EvaluationRow | null, caminho: CaminhoRow | null): DiagnosticHypothesis[] {
  const hypotheses: DiagnosticHypothesis[] = [];

  if (!evaluation) return hypotheses;

  const painLocation = (evaluation.pain_location || "").toLowerCase();
  const chiefComplaint = (evaluation.chief_complaint || "").toLowerCase();

  const painPatterns = splitDelimitedText(caminho?.pain_pattern);
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

    const latestEvolution = await c.env.DB.prepare(
      `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date DESC LIMIT 1`
    ).bind(patientId).first<EvolutionRow>();

    const structured = generateStructuredSuporte(evaluation, caminho, latestEvolution);

    return c.json({
      evaluation,
      caminho,
      latestEvolution,
      suggestions: structured.insights.map(i => `${i.title}: ${i.description}`),
      structured
    });
  });
}
