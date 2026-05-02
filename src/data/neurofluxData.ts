/* eslint-disable @typescript-eslint/no-unused-vars */
export type ClinicalData = {
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  patientContext?: {
    painTrend?: "improving" | "worsening" | "stable";
    totalSessions?: number;
    proceduresUsed?: string[];
    identifiedContraindications?: string[];
  };
};

export type Parameter = {
  name: string;
  value: string;
};

export type HowToApply = {
  description: string;
  techniques?: string[];
  tips?: string[];
};

export type Recommendation = {
  name: string;
  mode?: string;
  evidenceLevel: "A" | "B" | "C";
  mainIndication: string;
  parameters: Parameter[];
  applicationTime: string;
  howToApply: HowToApply;
  practicalTips: string[];
  contraindications: string[];
  scientificRationale: string;
  evidenceDescription: string;
  references?: string[];
  clinicalObservation?: string;
  patientSpecificAlerts?: string[];
  isContraindicated?: boolean;
};

// Base data for each modality
const modalityData: Record<string, Omit<Recommendation, "mainIndication" | "mode">> = {
  TENS: {
    name: "TENS",
    evidenceLevel: "A",
    parameters: [
      { name: "Frequência", value: "80 a 120 Hz" },
      { name: "Largura de pulso", value: "50 a 100 microssegundos" },
      { name: "Intensidade", value: "Sensorial forte sem contração visível" },
    ],
    applicationTime: "20 a 30 minutos",
    howToApply: {
      description: "Posicionamento de eletrodos sobre ou próximo à área dolorosa, seguindo trajetos nervosos e pontos motores. Requer conhecimento de anatomia e neurofisiologia.",
      techniques: [
        "Cruzada (X): eletrodos diagonais circundando a área dolorosa - útil para dores articulares",
        "Paralela: eletrodos no mesmo trajeto do nervo ou músculo - útil para dores musculares e neurais",
        "Pontos motores: eletrodos sobre pontos motores do músculo afetado",
        "Dermátomos: eletrodos seguindo o dermátomo correspondente à dor radicular",
      ],
      tips: [
        "Limpe a pele com álcool antes da aplicação",
        "Use gel condutor ou eletrodos autoadesivos",
        "Distância entre eletrodos: 5 a 10 cm (ou equivalente ao tamanho da área dolorosa)",
        "Para dor lombar: eletrodos paravertebrais ou em X sobre a região",
        "Para dor no joelho: eletrodos acima e abaixo da linha articular ou em diagonal",
        "Para dor no ombro: eletrodos sobre deltoide e/ou trajeto supraescapular",
        "Para dor cervical: eletrodos paravertebrais cervicais, NUNCA sobre a carótida",
      ],
    },
    practicalTips: [
      'Pergunte ao paciente "Você está sentindo formigamento?" - ele deve sentir claramente',
      "Aumente a intensidade gradualmente até sensação forte mas confortável",
      "Se a dor for unilateral, pode aplicar bilateral de forma simétrica para efeito sistêmico",
      "Nunca deixe o aparelho ligado sem supervisão",
      "Se os eletrodos não grudarem bem, a pele pode estar oleosa ou com pelos",
    ],
    contraindications: [
      "Marcapasso cardíaco",
      "Região carotídea",
      "Alteração importante de sensibilidade",
      "Gestantes (região abdominal/lombar)",
      "Sobre tumores malignos",
      "Trombose venosa profunda ativa",
    ],
    scientificRationale: "O TENS no modo convencional (alta frequência) age rapidamente nos nervos da região, bloqueando a transmissão da dor para o cérebro. É como 'fechar uma porta' para os sinais dolorosos, dando alívio imediato sem agravar a inflamação.",
    evidenceDescription: "Forte evidência para analgesia em dor aguda através do mecanismo de comportas",
    references: [
      "Sluka & Walsh, 2003 - Phys Ther",
      "Johnson et al., 2015 - Cochrane Database",
    ],
    clinicalObservation: "Na fase aguda, com objetivo de controle da dor, o TENS no modo Convencional é indicado pois modulação segmentar da dor através da teoria das comportas (gate control), inibindo a transmissão nociceptiva no corno dorsal da medula.",
  },
  Ultrassom: {
    name: "Ultrassom",
    evidenceLevel: "B",
    parameters: [
      { name: "Frequência", value: "1 MHz (profundo) ou 3 MHz (superficial)" },
      { name: "Intensidade", value: "0.5 a 1.5 W/cm²" },
      { name: "Modo", value: "Pulsado (20-50%) para fase aguda, Contínuo para crônico" },
      { name: "ERA (Área de Radiação Efetiva)", value: "Adequar ao tamanho da lesão" },
    ],
    applicationTime: "5 a 10 minutos por área",
    howToApply: {
      description: "Aplicação com movimentos circulares lentos e contínuos sobre a área alvo. O cabeçote deve estar em contato constante com a pele através do gel.",
      techniques: [
        "Movimentos circulares: padrão mais comum, mantendo velocidade de 4 cm/s",
        "Movimentos longitudinais: útil para estruturas alongadas (tendões)",
        "Estacionário pulsado: apenas em modo pulsado de baixa intensidade",
      ],
      tips: [
        "Use gel de acoplamento em quantidade adequada",
        "Mantenha o cabeçote perpendicular à pele (90°)",
        "Não pare o movimento em modo contínuo (risco de queimadura)",
        "Para tendões: use 3 MHz com modo pulsado",
        "Para músculos profundos: use 1 MHz",
        "Área de tratamento não deve exceder 2x a ERA do cabeçote",
      ],
    },
    practicalTips: [
      "Verifique se há gel suficiente - bolhas de ar reduzem a transmissão",
      "Observe a pele durante o tratamento para sinais de aquecimento excessivo",
      "Em modo contínuo, o paciente pode sentir calor suave - isso é normal",
      "Limpe o cabeçote com álcool após cada uso",
      "Calibre o equipamento periodicamente",
    ],
    contraindications: [
      "Sobre placas epifisárias em crescimento",
      "Sobre tumores malignos",
      "Gestantes (região abdominal/pélvica)",
      "Sobre implantes metálicos (relativo - usar modo pulsado)",
      "Tromboflebite ativa",
      "Sobre olhos, coração, gônadas",
      "Áreas com infecção ativa",
    ],
    scientificRationale: "O ultrassom terapêutico promove microagitação molecular que aumenta o metabolismo celular, a síntese de colágeno e a circulação local. Em modo pulsado, os efeitos são predominantemente não-térmicos, favorecendo a regeneração tecidual.",
    evidenceDescription: "Evidência moderada para reparo tecidual e redução de inflamação",
    references: [
      "Robertson et al., 2006 - Physical Therapy",
      "Draper et al., 2010 - J Athl Train",
    ],
    clinicalObservation: "O ultrassom pulsado é preferido na fase aguda/subaguda por seus efeitos não-térmicos que auxiliam no reparo tecidual sem aumentar a inflamação.",
  },
  Laser: {
    name: "Laser",
    evidenceLevel: "A",
    parameters: [
      { name: "Comprimento de onda", value: "660nm (superficial) ou 808-904nm (profundo)" },
      { name: "Dose", value: "2 a 4 J/ponto (agudo) ou 4 a 8 J/ponto (crônico)" },
      { name: "Potência", value: "30 a 100 mW típico" },
      { name: "Técnica", value: "Pontual ou varredura" },
    ],
    applicationTime: "30 segundos a 2 minutos por ponto",
    howToApply: {
      description: "Aplicação perpendicular à pele, em contato direto ou com pequena distância. Identificar pontos-gatilho, pontos de acupuntura ou distribuir em grade sobre a área lesada.",
      techniques: [
        "Pontual: aplicação em pontos específicos (trigger points, pontos de acupuntura)",
        "Grade: distribuição de pontos em padrão de grade sobre a área",
        "Varredura: movimento lento sobre a área (menos comum)",
      ],
      tips: [
        "Limpe a pele antes da aplicação",
        "Mantenha o laser perpendicular à superfície",
        "Use óculos de proteção apropriados",
        "Marque os pontos de aplicação se necessário",
        "Pele mais escura pode requerer doses ligeiramente maiores",
        "Pelos devem ser removidos da área de aplicação",
      ],
    },
    practicalTips: [
      "Sempre use óculos de proteção (você e o paciente)",
      "Nunca aponte o laser para os olhos",
      "Documente os pontos de aplicação para reprodutibilidade",
      "Lasers de maior potência reduzem o tempo de aplicação",
      "Inicie com doses menores e aumente conforme resposta",
    ],
    contraindications: [
      "Sobre os olhos (mesmo fechados)",
      "Sobre tumores malignos",
      "Gestantes (região abdominal)",
      "Fotossensibilidade por medicamentos",
      "Sobre tatuagens escuras (risco de queimadura)",
      "Hemorragia ativa",
    ],
    scientificRationale: "A fotobiomodulação estimula a mitocôndria (citocromo c oxidase), aumentando a produção de ATP celular. Isso acelera o metabolismo, reduz mediadores inflamatórios e promove a síntese de colágeno e regeneração tecidual.",
    evidenceDescription: "Forte evidência para reparo tecidual, redução de dor e inflamação",
    references: [
      "Chung et al., 2012 - Ann Biomed Eng",
      "Bjordal et al., 2003 - Phys Ther",
    ],
    clinicalObservation: "O laser de baixa potência (LLLT) é excelente para bioestimulação em todas as fases, sendo particularmente útil quando há necessidade de acelerar o reparo tecidual com mínimo estresse ao tecido.",
  },
  Crioterapia: {
    name: "Crioterapia",
    evidenceLevel: "A",
    parameters: [
      { name: "Método", value: "Gelo protegido com tecido ou bolsa de gel fria" },
      { name: "Temperatura", value: "0 a 10°C na superfície" },
      { name: "Intervalo mínimo", value: "1 a 2 horas entre aplicações" },
    ],
    applicationTime: "15 a 20 minutos",
    howToApply: {
      description: "Aplicação direta sobre a área afetada com proteção de tecido fino. O gelo deve ser modelado à região anatômica para maximizar o contato.",
      techniques: [
        "Bolsa de gelo: cubos de gelo em saco plástico, envolvido em tecido fino",
        "Gel pack: bolsa de gel reutilizável, mais confortável",
        "Imersão: para extremidades (mãos, pés, tornozelos)",
        "Criocompressão: gelo + compressão elástica (ideal para edema)",
        "Massagem com gelo: movimento circular com gelo para áreas pequenas",
      ],
      tips: [
        "Sempre proteja a pele com tecido fino",
        "Eleve o membro se houver edema",
        "Monitore a pele a cada 5 minutos (vermelhidão é normal)",
        "Interrompa se pele ficar branca ou paciente sentir dormência intensa",
        "Não aplicar sobre feridas abertas",
        "Cuidado extra com pacientes diabéticos ou com alteração de sensibilidade",
      ],
    },
    practicalTips: [
      "O paciente sentirá frio → queimação → dor → dormência (sequência normal)",
      "Gelo em cubos é mais eficiente que gel pack por absorver mais calor",
      "Para entorses agudas: gelo + compressão + elevação (PRICE)",
      "Não aplique gelo diretamente na pele sem proteção",
      "Após cirurgia, siga as orientações específicas do cirurgião",
    ],
    contraindications: [
      "Síndrome de Raynaud",
      "Crioglobulinemia",
      "Alergia ao frio (urticária ao frio)",
      "Alteração importante de sensibilidade",
      "Doença vascular periférica grave",
      "Feridas abertas (aplicar ao redor)",
    ],
    scientificRationale: "A redução da temperatura tecidual causa vasoconstrição, diminuição do metabolismo celular e redução da velocidade de condução nervosa. Isso resulta em menor edema, menos dor e proteção contra lesão secundária por hipóxia.",
    evidenceDescription: "Forte evidência para controle de edema e analgesia em lesões agudas",
    references: [
      "Bleakley et al., 2004 - J Athl Train",
      "Mac Auley, 2001 - Br J Sports Med",
    ],
    clinicalObservation: "Na fase aguda com presença de edema, a crioterapia é fundamental como primeira linha de tratamento. A combinação com compressão e elevação potencializa os resultados.",
  },
  Termoterapia: {
    name: "Termoterapia",
    evidenceLevel: "B",
    parameters: [
      { name: "Método", value: "Bolsa térmica, infravermelho ou compressas quentes" },
      { name: "Temperatura", value: "40 a 45°C na superfície da pele" },
      { name: "Profundidade", value: "Superficial (até 1cm) ou profundo (ondas curtas/micro-ondas)" },
    ],
    applicationTime: "15 a 20 minutos",
    howToApply: {
      description: "Aplicação de calor sobre a musculatura tensa ou articulações rígidas. O calor deve ser confortável, nunca causar dor ou desconforto.",
      techniques: [
        "Bolsa térmica: preencher com água quente, envolver em tecido",
        "Compressas úmidas quentes: toalha úmida aquecida",
        "Infravermelho: lâmpada a 50-75 cm da pele",
        "Parafina: imersão para mãos e pés (artrite)",
        "Turbilhão: imersão em água aquecida com agitação (extremidades)",
      ],
      tips: [
        "Teste a temperatura antes de aplicar",
        "Nunca use calor em lesões agudas (primeiras 48-72h)",
        "Monitore a pele durante a aplicação",
        "Paciente deve sentir calor agradável, não queimação",
        "Ideal aplicar antes de exercícios de alongamento",
        "Combine com mobilização articular para rigidez",
      ],
    },
    practicalTips: [
      "Calor é excelente para relaxamento muscular pré-exercício",
      "Aumenta a extensibilidade do colágeno - ideal antes de alongamentos",
      "Pode aumentar edema se usado em fase aguda - contraindicado!",
      "Para contraturas crônicas: calor + alongamento sustentado",
      "Pacientes idosos têm menor percepção de temperatura - cuidado",
    ],
    contraindications: [
      "Fase aguda de lesão (primeiras 48-72h)",
      "Presença de edema ativo",
      "Inflamação aguda",
      "Alteração de sensibilidade",
      "Insuficiência vascular",
      "Sobre tumores malignos",
      "Áreas com hemorragia recente",
    ],
    scientificRationale: "O aumento da temperatura tecidual promove vasodilatação, aumento do fluxo sanguíneo, relaxamento muscular e aumento da extensibilidade do tecido conjuntivo. Ideal para preparar tecidos para mobilização e alongamento.",
    evidenceDescription: "Evidência moderada para relaxamento muscular e ganho de mobilidade",
    references: [
      "Lehmann & de Lateur, 1990 - Therapeutic Heat",
      "Draper et al., 2002 - J Athl Train",
    ],
    clinicalObservation: "A termoterapia é especialmente indicada na fase crônica quando há rigidez articular ou tensão muscular. A combinação com exercícios de mobilidade potencializa os ganhos funcionais.",
  },
};

// Scoring function based on clinical parameters
function calculateScore(
  modality: string,
  data: ClinicalData
): { score: number; indication: string; mode?: string; alerts: string[]; isContraindicated: boolean } {
  let score = 0;
  let indication = "";
  let mode: string | undefined;
  const alerts: string[] = [];
  let isContraindicated = false;

  const { phase, objective, irritability, pathophysiology, tissue, patientContext } = data;

  // 1. Safety Check (Contraindications)
  if (patientContext?.identifiedContraindications?.length) {
    const { contraindications } = modalityData[modality];
    for (const flag of patientContext.identifiedContraindications) {
      const match = contraindications.some(c => c.toLowerCase().includes(flag.toLowerCase()) || 
        (flag === "Marcapasso" && modality === "TENS") ||
        (flag === "Tumor maligno" && (modality === "TENS" || modality === "Ultrassom" || modality === "Laser" || modality === "Termoterapia")) ||
        (flag === "Gestante" && (modality === "TENS" || modality === "Ultrassom" || modality === "Laser")) ||
        (flag === "Trombose Venosa Profunda (TVP)" && (modality === "Ultrassom" || modality === "TENS")) ||
        (flag === "Diabetes" && (modality === "Crioterapia" || modality === "Termoterapia")) || // risco sensibilidade
        (flag === "Síndrome de Raynaud" && modality === "Crioterapia")
      );
      if (match) {
        isContraindicated = true;
        alerts.push(`⚠️ ALERTA CLÍNICO: Possível contraindicação detectada no prontuário (${flag}).`);
      }
    }
  }

  // 2. Prior Outcome Check (Worsening with modality)
  if (patientContext?.painTrend === "worsening" && patientContext?.proceduresUsed?.some(p => p.toLowerCase().includes(modality.toLowerCase()))) {
    score -= 40;
    alerts.push(`💡 Paciente apresentou piora de dor (Tendência: Piorando) e já utilizou ${modality} recentemente. Considere reduzir dose ou trocar modalidade.`);
  }

  switch (modality) {
    case "TENS":
      // TENS is excellent for pain control
      if (objective === "Analgesia") {
        score += 40;
        indication = "Analgesia";
      }
      if (phase === "Aguda") {
        score += 30;
        indication += indication ? " em fase aguda" : "Controle de dor aguda";
        mode = "Convencional";
      } else if (phase === "Subaguda") {
        score += 20;
        mode = "Convencional";
      } else {
        score += 15;
        mode = "Acupuntura ou Burst";
      }
      if (irritability === "Alta") {
        score += 15;
      } else if (irritability === "Média") {
        score += 10;
      }
      // Bonus for muscle/neural pain
      if (tissue === "Músculo") score += 5;
      if (!indication) indication = "Modulação da dor";
      break;

    case "Crioterapia":
      // Cryo is excellent for acute/inflammatory conditions
      if (phase === "Aguda") {
        score += 35;
        indication = "Redução da temperatura tecidual";
      } else if (phase === "Subaguda") {
        score += 15;
      }
      if (pathophysiology === "Inflamatório Agudo") {
        score += 30;
        indication = "Controle inflamatório em fase aguda";
      }
      if (objective === "Redução de Edema") {
        score += 25;
        indication = indication || "Redução de edema e inflamação";
      }
      if (objective === "Analgesia" && phase === "Aguda") {
        score += 15;
      }
      if (irritability === "Alta") {
        score += 10;
      }
      if (!indication) indication = "Redução da temperatura tecidual com efeitos vasculares, metabólicos e neurais";
      break;

    case "Ultrassom":
      // US is good for tissue repair and chronic conditions
      if (objective === "Bioestimulação") {
        score += 35;
        indication = "Estímulo ao reparo tecidual";
        mode = "Pulsado";
      }
      if (phase === "Subaguda") {
        score += 25;
        mode = "Pulsado 20-50%";
        indication = indication || "Bioestimulação em fase de reparo";
      } else if (phase === "Crônica") {
        score += 20;
        mode = "Contínuo ou Pulsado";
      } else if (phase === "Aguda") {
        score += 10;
        mode = "Pulsado 10-20%";
      }
      if (tissue === "Tendão" || tissue === "Ligamento") {
        score += 15;
        indication = indication || "Reparo de tecidos conectivos";
      }
      if (pathophysiology === "Desgaste / Crônico") {
        score += 10;
      }
      if (!indication) indication = "Efeitos mecânicos e térmicos para reparo tecidual";
      break;

    case "Laser":
      // Laser is excellent for bioestimulation
      if (objective === "Bioestimulação") {
        score += 40;
        indication = "Fotobiomodulação para regeneração tecidual";
      }
      if (phase === "Subaguda") {
        score += 25;
        indication = indication || "Aceleração do reparo tecidual";
      } else if (phase === "Aguda") {
        score += 20;
        indication = indication || "Modulação inflamatória e regeneração";
      } else {
        score += 15;
      }
      if (tissue === "Tendão" || tissue === "Ligamento") {
        score += 15;
      }
      if (pathophysiology === "Pós-operatório") {
        score += 20;
        indication = indication || "Cicatrização pós-cirúrgica";
      }
      if (objective === "Analgesia") {
        score += 10;
      }
      if (!indication) indication = "Estímulo celular e modulação inflamatória";
      break;

    case "Termoterapia":
      // Heat is good for chronic conditions and mobility
      if (phase === "Crônica") {
        score += 35;
        indication = "Relaxamento e aumento de extensibilidade tecidual";
      } else if (phase === "Subaguda" && irritability === "Baixa") {
        score += 15;
      }
      // Penalize for acute phase
      if (phase === "Aguda") {
        score -= 20;
      }
      if (pathophysiology === "Inflamatório Agudo") {
        score -= 15;
      }
      if (objective === "Relaxamento Muscular") {
        score += 35;
        indication = "Relaxamento muscular e redução de tensão";
      }
      if (objective === "Ganho de Mobilidade") {
        score += 30;
        indication = indication || "Aumento da extensibilidade tecidual pré-mobilização";
      }
      if (tissue === "Músculo" && phase !== "Aguda") {
        score += 10;
      }
      if (pathophysiology === "Desgaste / Crônico") {
        score += 15;
      }
      if (irritability === "Baixa") {
        score += 10;
      }
      if (!indication) indication = "Vasodilatação e relaxamento muscular";
      break;
  }

  if (isContraindicated) {
    score = -100; // Force to bottom
  }

  return { score: Math.max(-100, score), indication, mode, alerts, isContraindicated };
}

export function getRecommendations(data: ClinicalData): Recommendation[] {
  const modalities = ["TENS", "Ultrassom", "Laser", "Crioterapia", "Termoterapia"];
  
  const scored = modalities.map((mod) => {
    const { score, indication, mode, alerts, isContraindicated } = calculateScore(mod, data);
    return {
      ...modalityData[mod],
      mainIndication: indication,
      mode,
      score,
      patientSpecificAlerts: alerts.length > 0 ? alerts : undefined,
      isContraindicated
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Filter out very low scores (unless contraindicated, we keep it to show the red warning)
  const filtered = scored
    .filter((s) => s.score > 0 || s.isContraindicated)
    .map((rec) => {
      const adjusted = { ...rec };
      
      // Adjust TENS parameters based on irritability
      if (rec.name === "TENS") {
        if (data.irritability === "Alta") {
          adjusted.parameters = [
            { name: "Frequência", value: "80 a 150 Hz" },
            { name: "Largura de pulso", value: "50 a 80 microssegundos" },
            { name: "Intensidade", value: "Sensorial confortável (iniciar baixo)" },
          ];
        } else if (data.phase === "Crônica") {
          adjusted.parameters = [
            { name: "Frequência", value: "2 a 10 Hz (acupuntura) ou burst" },
            { name: "Largura de pulso", value: "150 a 250 microssegundos" },
            { name: "Intensidade", value: "Até contração muscular visível" },
          ];
        }
      }

      // Adjust Ultrasound based on phase
      if (rec.name === "Ultrassom") {
        if (data.phase === "Aguda") {
          adjusted.parameters = [
            { name: "Frequência", value: "3 MHz (superficial) ou 1 MHz (profundo)" },
            { name: "Intensidade", value: "0.1 a 0.5 W/cm²" },
            { name: "Modo", value: "Pulsado 10-20%" },
            { name: "ERA", value: "Adequar ao tamanho da lesão" },
          ];
        } else if (data.phase === "Crônica") {
          adjusted.parameters = [
            { name: "Frequência", value: "1 MHz (profundo) ou 3 MHz (superficial)" },
            { name: "Intensidade", value: "1.0 a 2.0 W/cm²" },
            { name: "Modo", value: "Contínuo ou Pulsado 50%" },
            { name: "ERA", value: "Adequar ao tamanho da lesão" },
          ];
        }
      }

      // Adjust Laser based on phase
      if (rec.name === "Laser") {
        if (data.phase === "Aguda") {
          adjusted.parameters = [
            { name: "Comprimento de onda", value: "660nm (superficial) ou 808nm (profundo)" },
            { name: "Dose", value: "1 a 3 J/ponto" },
            { name: "Potência", value: "30 a 50 mW" },
            { name: "Técnica", value: "Pontual em grade" },
          ];
        } else if (data.phase === "Crônica") {
          adjusted.parameters = [
            { name: "Comprimento de onda", value: "808-904nm (profundo)" },
            { name: "Dose", value: "4 a 8 J/ponto" },
            { name: "Potência", value: "50 a 100 mW" },
            { name: "Técnica", value: "Pontual ou varredura" },
          ];
        }
      }
      
      // Adjust parameters based on total sessions (if chronic/many sessions)
      if (data.patientContext?.totalSessions && data.patientContext.totalSessions > 10) {
        if (rec.name === "Laser" && data.phase === "Crônica") {
          adjusted.parameters.find(p => p.name === "Dose")!.value = "6 a 10 J/ponto (estágio crônico avançado)";
          adjusted.patientSpecificAlerts = [...(adjusted.patientSpecificAlerts || []), "💡 Dose de laser aumentada considerando número elevado de sessões sem resolução total."];
        }
        if (rec.name === "Ultrassom" && data.phase === "Crônica") {
          adjusted.parameters.find(p => p.name === "Intensidade")!.value = "1.5 a 2.0 W/cm²";
          adjusted.patientSpecificAlerts = [...(adjusted.patientSpecificAlerts || []), "💡 Intensidade de US ajustada para estágio crônico avançado."];
        }
      }

      // Remove the score from the final output
      const { score, ...rest } = adjusted;
      return rest as Recommendation;
    });

  return filtered;
}
