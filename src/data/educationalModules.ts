// Dados educacionais para os módulos do Modo Estudante

// ===== MAPA DA DOR =====
export interface PainMapRegion {
  id: string;
  name: string;
  icon: string;
  clinicalHypotheses: string[];
  involvedMuscles: string[];
  clinicalTests: string[];
  initialTreatments: string[];
}

export const painMapRegions: PainMapRegion[] = [
  {
    id: 'cervical',
    name: 'Cervical',
    icon: '🦴',
    clinicalHypotheses: [
      'Cervicalgia mecânica',
      'Cefaleia cervicogênica',
      'Radiculopatia cervical',
      'Síndrome miofascial cervical',
      'Whiplash (lesão por chicotada)',
      'Espondilose cervical'
    ],
    involvedMuscles: [
      'Trapézio superior',
      'Levantador da escápula',
      'Esternocleidomastóideo',
      'Escalenos',
      'Esplênio da cabeça',
      'Suboccipitais'
    ],
    clinicalTests: [
      'Teste de Spurling',
      'Teste de distração cervical',
      'Teste de flexão-rotação',
      'Teste de compressão cervical',
      'Upper Limb Tension Test (ULTT)',
      'Teste de artéria vertebral'
    ],
    initialTreatments: [
      'Mobilização articular cervical',
      'Liberação miofascial',
      'Treino de flexores profundos do pescoço',
      'Exercícios de retração cervical',
      'Correção postural',
      'Educação em dor'
    ]
  },
  {
    id: 'ombro',
    name: 'Ombro',
    icon: '💪',
    clinicalHypotheses: [
      'Síndrome do impacto subacromial',
      'Tendinopatia do manguito rotador',
      'Capsulite adesiva (ombro congelado)',
      'Bursite subacromial',
      'Instabilidade glenoumeral',
      'Lesão SLAP'
    ],
    involvedMuscles: [
      'Supraespinhal',
      'Infraespinhal',
      'Subescapular',
      'Redondo menor',
      'Deltóide',
      'Bíceps braquial',
      'Peitoral menor'
    ],
    clinicalTests: [
      'Teste de Neer',
      'Teste de Hawkins-Kennedy',
      'Teste de Jobe (Empty Can)',
      'Teste de Gerber (Lift-off)',
      'Teste de Speed',
      'Teste de apreensão',
      'Teste de relocação'
    ],
    initialTreatments: [
      'Fortalecimento do manguito rotador',
      'Estabilização escapular',
      'Mobilização articular glenoumeral',
      'Alongamento da cápsula posterior',
      'Controle de dor e inflamação',
      'Exercícios de mobilidade'
    ]
  },
  {
    id: 'lombar',
    name: 'Coluna Lombar',
    icon: '🔙',
    clinicalHypotheses: [
      'Lombalgia mecânica inespecífica',
      'Hérnia de disco lombar',
      'Radiculopatia lombar',
      'Estenose de canal lombar',
      'Síndrome facetária',
      'Disfunção sacroilíaca',
      'Espondilólise/Espondilolistese'
    ],
    involvedMuscles: [
      'Eretor da espinha',
      'Multífidos',
      'Quadrado lombar',
      'Psoas maior',
      'Glúteo médio',
      'Piriforme',
      'Transverso do abdome'
    ],
    clinicalTests: [
      'Teste de Lasègue (Elevação da perna reta)',
      'Slump test',
      'Teste de Patrick (FABER)',
      'Teste de Gaenslen',
      'Teste de instabilidade em prono',
      'Teste de Kemp',
      'Teste de compressão sacroilíaca'
    ],
    initialTreatments: [
      'Educação em neurociência da dor',
      'Estabilização lombar (core)',
      'Mobilização articular',
      'Exercícios de McKenzie (se centraliza)',
      'Fortalecimento de glúteos',
      'Alongamento de flexores do quadril',
      'Progressão funcional gradual'
    ]
  },
  {
    id: 'quadril',
    name: 'Quadril',
    icon: '🦵',
    clinicalHypotheses: [
      'Síndrome da dor trocantérica',
      'Tendinopatia glútea',
      'Impacto femoroacetabular (FAI)',
      'Lesão labral do quadril',
      'Artrose de quadril',
      'Pubalgia atlética',
      'Síndrome do piriforme'
    ],
    involvedMuscles: [
      'Glúteo médio',
      'Glúteo mínimo',
      'Tensor da fáscia lata',
      'Piriforme',
      'Psoas ilíaco',
      'Adutores',
      'Reto femoral'
    ],
    clinicalTests: [
      'Teste FADIR',
      'Teste FABER (Patrick)',
      'Trendelenburg',
      'Teste de Ober',
      'Teste de Thomas',
      'Teste de FAIR (piriforme)',
      'Teste de Pace'
    ],
    initialTreatments: [
      'Fortalecimento de glúteo médio',
      'Estabilização pélvica',
      'Alongamento de flexores do quadril',
      'Liberação miofascial de TFL',
      'Exercícios de controle motor',
      'Mobilização articular do quadril',
      'Treino de marcha'
    ]
  },
  {
    id: 'joelho',
    name: 'Joelho',
    icon: '🦿',
    clinicalHypotheses: [
      'Síndrome da dor patelofemoral',
      'Lesão de ligamento cruzado anterior (LCA)',
      'Lesão de menisco',
      'Tendinopatia patelar',
      'Síndrome da banda iliotibial',
      'Lesão de ligamento colateral',
      'Artrose de joelho'
    ],
    involvedMuscles: [
      'Quadríceps (VMO)',
      'Isquiotibiais',
      'Gastrocnêmios',
      'Tensor da fáscia lata',
      'Poplíteo',
      'Sartório',
      'Grácil'
    ],
    clinicalTests: [
      'Teste de Lachman',
      'Pivot shift',
      'McMurray',
      'Teste de Apley',
      'Teste de gaveta anterior/posterior',
      'Teste de estresse em valgo/varo',
      'Teste de Clarke (compressão patelar)'
    ],
    initialTreatments: [
      'Fortalecimento de quadríceps (ênfase VMO)',
      'Fortalecimento de glúteo médio',
      'Alongamento de isquiotibiais',
      'Taping patelar (McConnell)',
      'Exercícios de cadeia cinética fechada',
      'Controle neuromuscular',
      'Treino proprioceptivo'
    ]
  },
  {
    id: 'tornozelo',
    name: 'Tornozelo',
    icon: '🦶',
    clinicalHypotheses: [
      'Entorse lateral de tornozelo',
      'Instabilidade crônica de tornozelo',
      'Tendinopatia de Aquiles',
      'Fasceíte plantar',
      'Lesão de sindesmose',
      'Síndrome do túnel do tarso',
      'Fratura de estresse'
    ],
    involvedMuscles: [
      'Fibulares (longo e curto)',
      'Tibial anterior',
      'Tibial posterior',
      'Gastrocnêmio',
      'Sóleo',
      'Flexor longo do hálux',
      'Intrínsecos do pé'
    ],
    clinicalTests: [
      'Teste de gaveta anterior do tornozelo',
      'Teste de tilt talar',
      'Squeeze test (sindesmose)',
      'Teste de Thompson (Aquiles)',
      'Windlass test (fáscia plantar)',
      'Teste de Tinel (túnel do tarso)',
      'Star Excursion Balance Test (SEBT)'
    ],
    initialTreatments: [
      'Fortalecimento de fibulares',
      'Treino proprioceptivo',
      'Mobilização articular',
      'Exercícios excêntricos (Aquiles)',
      'Alongamento de gastrocnêmio/sóleo',
      'Fortalecimento de intrínsecos',
      'Treino de equilíbrio'
    ]
  },
  {
    id: 'punho-mao',
    name: 'Punho e Mão',
    icon: '✋',
    clinicalHypotheses: [
      'Síndrome do túnel do carpo',
      'Tendinite de De Quervain',
      'Dedo em gatilho',
      'Rizartrose (artrose trapéziometacárpica)',
      'Síndrome do canal de Guyon',
      'Epicondilite lateral (cotovelo de tenista)',
      'Epicondilite medial (cotovelo de golfista)'
    ],
    involvedMuscles: [
      'Flexores do punho',
      'Extensores do punho',
      'Oponente do polegar',
      'Abdutor curto do polegar',
      'Interósseos',
      'Lumbricais',
      'Pronador redondo'
    ],
    clinicalTests: [
      'Teste de Phalen',
      'Teste de Tinel (carpo)',
      'Teste de Finkelstein',
      'Teste de Grind (rizartrose)',
      'Teste de Mill',
      'Teste de Cozen',
      'Teste de força de preensão'
    ],
    initialTreatments: [
      'Órtese de posicionamento',
      'Deslizamento neural do mediano',
      'Alongamento de flexores/extensores',
      'Fortalecimento de punho e mão',
      'Mobilização articular',
      'Modificação ergonômica',
      'Técnicas de liberação miofascial'
    ]
  }
];

// ===== MÚSCULOS-CHAVE =====
export interface KeyMuscle {
  id: string;
  name: string;
  region: string;
  whereToPalpate: string;
  whyToPalpate: string;
  referredPain: string;
  relatedPathologies: string[];
}

export const keyMuscles: KeyMuscle[] = [
  // CERVICAL
  {
    id: 'trapezio-superior',
    name: 'Trapézio Superior',
    region: 'Cervical',
    whereToPalpate: 'Região entre o acrômio e a coluna cervical, seguindo as fibras em direção à base do crânio.',
    whyToPalpate: 'Principal músculo envolvido em tensão cervical relacionada a postura de trabalho. Muito sensível ao estresse.',
    referredPain: 'Região temporal (lado da cabeça), região posterior do pescoço e ângulo da mandíbula.',
    relatedPathologies: ['Cervicalgia mecânica', 'Cefaleia tensional', 'Síndrome miofascial', 'Disfunção da ATM']
  },
  {
    id: 'levantador-escapula',
    name: 'Levantador da Escápula',
    region: 'Cervical',
    whereToPalpate: 'Região superomedial da escápula até os processos transversos cervicais (C1-C4). Palpar profundamente ao trapézio.',
    whyToPalpate: 'Frequentemente envolvido em cervicalgia associada a postura prolongada no computador.',
    referredPain: 'Região cervical posterior, borda medial da escápula e ângulo do pescoço.',
    relatedPathologies: ['Cervicalgia mecânica', 'Cefaleia cervicogênica', 'Síndrome miofascial', 'Torcicolo']
  },
  {
    id: 'esternocleidomastoideo',
    name: 'Esternocleidomastóideo (ECM)',
    region: 'Cervical',
    whereToPalpate: 'Região anterolateral do pescoço, do processo mastóide ao esterno e clavícula. Pedir ao paciente para rodar a cabeça contra resistência.',
    whyToPalpate: 'Importante em cefaleia, tontura cervicogênica e disfunções vestibulares.',
    referredPain: 'Região frontal, têmpora, região ao redor do olho, ouvido e região occipital.',
    relatedPathologies: ['Cefaleia tensional', 'Tontura cervicogênica', 'Torcicolo', 'Whiplash']
  },
  {
    id: 'escalenos',
    name: 'Escalenos',
    region: 'Cervical',
    whereToPalpate: 'Região lateral do pescoço, posterior ao ECM. Palpar com cuidado devido à proximidade do plexo braquial.',
    whyToPalpate: 'Podem comprimir plexo braquial e artéria subclávia (síndrome do desfiladeiro torácico).',
    referredPain: 'Face anterior e posterior do braço, região peitoral, borda medial da escápula, polegar e indicador.',
    relatedPathologies: ['Síndrome do desfiladeiro torácico', 'Parestesias em membro superior', 'Cervicalgia', 'Cefaleia']
  },
  {
    id: 'suboccipitais',
    name: 'Suboccipitais',
    region: 'Cervical',
    whereToPalpate: 'Base do crânio, na região posterior entre C1-C2 e o occipital. Palpar profundamente.',
    whyToPalpate: 'Muito relacionados à cefaleia cervicogênica e disfunções da cervical alta.',
    referredPain: 'Região occipital, frontal (acima do olho) e temporal. Dor "em faixa" ao redor da cabeça.',
    relatedPathologies: ['Cefaleia cervicogênica', 'Cefaleia tensional', 'Disfunção de C0-C2', 'Vertigem cervicogênica']
  },
  // OMBRO
  {
    id: 'supraespinhal',
    name: 'Supraespinhal',
    region: 'Ombro',
    whereToPalpate: 'Fossa supraespinhal da escápula (acima da espinha da escápula) e tendão no tubérculo maior do úmero.',
    whyToPalpate: 'Músculo mais lesionado do manguito rotador. Principal iniciador da abdução do ombro.',
    referredPain: 'Região lateral do braço (deltóide), podendo irradiar até o antebraço lateral.',
    relatedPathologies: ['Síndrome do impacto', 'Tendinopatia do manguito', 'Ruptura do manguito', 'Bursite subacromial']
  },
  {
    id: 'infraespinhal',
    name: 'Infraespinhal',
    region: 'Ombro',
    whereToPalpate: 'Fossa infraespinhal da escápula (abaixo da espinha da escápula). Músculo grande e superficial.',
    whyToPalpate: 'Rotador externo importante. Frequentemente envolvido em dor profunda do ombro.',
    referredPain: 'Região anterior do ombro, face anterolateral do braço, podendo irradiar para mão.',
    relatedPathologies: ['Tendinopatia do manguito', 'Síndrome do impacto', 'Instabilidade glenoumeral', 'Síndrome miofascial']
  },
  {
    id: 'peitoral-menor',
    name: 'Peitoral Menor',
    region: 'Ombro',
    whereToPalpate: 'Profundo ao peitoral maior, inserção no processo coracóide. Palpar pressionando lateralmente sob o peitoral maior.',
    whyToPalpate: 'Quando encurtado, causa anteriorização do ombro e pode comprimir plexo braquial.',
    referredPain: 'Região anterior do ombro e face anterior do braço.',
    relatedPathologies: ['Síndrome do desfiladeiro torácico', 'Disfunção postural', 'Síndrome do impacto', 'Dor precordial referida']
  },
  // LOMBAR
  {
    id: 'quadrado-lombar',
    name: 'Quadrado Lombar',
    region: 'Lombar',
    whereToPalpate: 'Região lateral da coluna lombar, entre a 12ª costela e a crista ilíaca. Palpar profundamente lateral ao eretor da espinha.',
    whyToPalpate: 'Principal causa de lombalgia mecânica unilateral. Muito sensível em assimetrias posturais.',
    referredPain: 'Região glútea, região sacroilíaca, virilha e lateral do quadril.',
    relatedPathologies: ['Lombalgia mecânica', 'Disfunção sacroilíaca', 'Escoliose funcional', 'Discrepância de membros']
  },
  {
    id: 'multifidos',
    name: 'Multífidos Lombares',
    region: 'Lombar',
    whereToPalpate: 'Região paravertebral profunda, entre os processos espinhosos e transversos. Palpar durante contração em posição prona.',
    whyToPalpate: 'Atrofiam rapidamente após episódios de lombalgia. Essenciais para estabilidade segmentar.',
    referredPain: 'Dor local na coluna lombar, podendo irradiar para região glútea.',
    relatedPathologies: ['Lombalgia crônica', 'Instabilidade lombar', 'Pós-operatório de coluna', 'Disfunção segmentar']
  },
  {
    id: 'piriforme',
    name: 'Piriforme',
    region: 'Lombar',
    whereToPalpate: 'Região glútea profunda, linha entre o sacro e o trocânter maior. Paciente em decúbito lateral.',
    whyToPalpate: 'Pode comprimir o nervo ciático causando sintomas similares à radiculopatia.',
    referredPain: 'Região glútea, face posterior da coxa, podendo irradiar até a panturrilha.',
    relatedPathologies: ['Síndrome do piriforme', 'Dor ciática não radicular', 'Disfunção sacroilíaca', 'Dor glútea profunda']
  },
  {
    id: 'psoas-maior',
    name: 'Psoas Maior',
    region: 'Lombar',
    whereToPalpate: 'Palpação profunda na região abdominal lateral, medial à EIAS. Alternativa: em decúbito lateral com quadril e joelho fletidos.',
    whyToPalpate: 'Quando encurtado, aumenta lordose lombar e compressão facetária.',
    referredPain: 'Região lombar paravertebral ipsilateral, podendo irradiar para face anterior da coxa.',
    relatedPathologies: ['Lombalgia com componente postural', 'Síndrome facetária', 'Disfunção do quadril', 'Dor anterior do quadril']
  },
  // QUADRIL
  {
    id: 'gluteo-medio',
    name: 'Glúteo Médio',
    region: 'Quadril',
    whereToPalpate: 'Região lateral do quadril, entre a crista ilíaca e o trocânter maior. Palpar durante abdução em decúbito lateral.',
    whyToPalpate: 'Principal estabilizador do quadril na marcha. Fraqueza causa Trendelenburg positivo.',
    referredPain: 'Região lombar baixa, região glútea, lateral do quadril até a coxa.',
    relatedPathologies: ['Síndrome da dor trocantérica', 'Tendinopatia glútea', 'Lombalgia', 'Disfunções da marcha']
  },
  {
    id: 'tensor-fascia-lata',
    name: 'Tensor da Fáscia Lata (TFL)',
    region: 'Quadril',
    whereToPalpate: 'Região anterolateral do quadril, logo abaixo da EIAS. Palpar durante flexão e abdução do quadril.',
    whyToPalpate: 'Quando encurtado, tensiona a banda iliotibial causando dor no joelho.',
    referredPain: 'Região lateral da coxa, podendo irradiar até o joelho lateral.',
    relatedPathologies: ['Síndrome da banda iliotibial', 'Dor trocantérica', 'Síndrome patelofemoral', 'Disfunção da marcha']
  },
  // JOELHO
  {
    id: 'vmo',
    name: 'Vasto Medial Oblíquo (VMO)',
    region: 'Joelho',
    whereToPalpate: 'Região medial do joelho, porção distal e oblíqua do vasto medial. Palpar durante extensão terminal do joelho.',
    whyToPalpate: 'Estabilizador patelar medial. Hipotrofia está associada à dor patelofemoral.',
    referredPain: 'Região anterior e medial do joelho.',
    relatedPathologies: ['Síndrome da dor patelofemoral', 'Instabilidade patelar', 'Artrose de joelho', 'Pós-operatório de LCA']
  },
  {
    id: 'gastrocnemio',
    name: 'Gastrocnêmio',
    region: 'Joelho',
    whereToPalpate: 'Região posterior da perna, os dois ventres musculares são facilmente palpáveis na panturrilha.',
    whyToPalpate: 'Cruza o joelho posteriormente. Encurtamento limita extensão do joelho.',
    referredPain: 'Região posterior do joelho, arco plantar e face posterior da panturrilha.',
    relatedPathologies: ['Dor posterior do joelho', 'Tendinopatia de Aquiles', 'Fasceíte plantar', 'Câimbras noturnas']
  },
  // TORNOZELO
  {
    id: 'fibulares',
    name: 'Fibulares (Longo e Curto)',
    region: 'Tornozelo',
    whereToPalpate: 'Região lateral da perna, acompanhando a fíbula. Tendões passam posterior ao maléolo lateral.',
    whyToPalpate: 'Eversores do tornozelo. Essenciais na estabilidade dinâmica contra entorses.',
    referredPain: 'Região lateral do tornozelo e lateral do pé.',
    relatedPathologies: ['Entorse de tornozelo', 'Instabilidade crônica de tornozelo', 'Tendinopatia fibular', 'Síndrome do túnel fibular']
  },
  {
    id: 'tibial-posterior',
    name: 'Tibial Posterior',
    region: 'Tornozelo',
    whereToPalpate: 'Tendão palpável posterior ao maléolo medial. Músculo é profundo na panturrilha.',
    whyToPalpate: 'Principal suporte do arco medial. Disfunção causa pé plano adquirido.',
    referredPain: 'Região medial do tornozelo, arco plantar medial e região posterior da panturrilha.',
    relatedPathologies: ['Tendinopatia do tibial posterior', 'Pé plano adquirido', 'Síndrome do estresse tibial medial', 'Dor no arco plantar']
  }
];

// ===== TESTES ORTOPÉDICOS =====
export interface OrthopedicTest {
  id: string;
  name: string;
  region: string;
  objective: string;
  execution: string;
  positiveResult: string;
  clinicalInterpretation: string;
  imageUrl?: string;
}

export const orthopedicTests: OrthopedicTest[] = [
  // OMBRO
  {
    id: 'teste-neer',
    name: 'Teste de Neer',
    region: 'Ombro',
    objective: 'Avaliar possível síndrome do impacto subacromial.',
    execution: 'Com o paciente sentado, estabilize a escápula com uma mão. Com a outra, eleve passivamente o braço do paciente em rotação interna até o máximo.',
    positiveResult: 'Dor na região anterior ou lateral do ombro durante a elevação passiva.',
    clinicalInterpretation: 'Sugere compressão do manguito rotador (principalmente supraespinhal) ou bursa subacromial contra o arco coracoacromial.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_12_09.png'
  },
  {
    id: 'teste-hawkins',
    name: 'Teste de Hawkins-Kennedy',
    region: 'Ombro',
    objective: 'Avaliar impacto subacromial, especialmente do tendão supraespinhal.',
    execution: 'Paciente sentado. Flexione o ombro e cotovelo a 90°. Realize rotação interna passiva do ombro.',
    positiveResult: 'Dor na região anterior ou lateral do ombro durante a rotação interna.',
    clinicalInterpretation: 'Sugere impacto do supraespinhal contra o ligamento coracoacromial. Alta sensibilidade para síndrome do impacto.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_12_13.png'
  },
  {
    id: 'teste-jobe',
    name: 'Teste de Jobe (Empty Can)',
    region: 'Ombro',
    objective: 'Avaliar integridade do músculo supraespinhal.',
    execution: 'Paciente em pé. Braços a 90° de abdução no plano escapular, rotação interna (polegares para baixo). Aplicar pressão para baixo enquanto paciente resiste.',
    positiveResult: 'Dor ou fraqueza durante a resistência.',
    clinicalInterpretation: 'Dor sugere tendinopatia do supraespinhal. Fraqueza significativa pode indicar ruptura parcial ou completa.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_12_16.png'
  },
  {
    id: 'teste-speed',
    name: 'Teste de Speed',
    region: 'Ombro',
    objective: 'Avaliar tendinopatia ou lesão do tendão do bíceps braquial (cabeça longa).',
    execution: 'Paciente em pé. Ombro em flexão de 60°, cotovelo estendido, antebraço supinado. Aplicar pressão para baixo enquanto paciente resiste à flexão.',
    positiveResult: 'Dor na região anterior do ombro, no sulco bicipital.',
    clinicalInterpretation: 'Sugere tendinopatia da cabeça longa do bíceps ou lesão SLAP.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_12_24.png'
  },
  {
    id: 'teste-apreensao',
    name: 'Teste de Apreensão',
    region: 'Ombro',
    objective: 'Avaliar instabilidade glenoumeral anterior.',
    execution: 'Paciente em decúbito dorsal. Ombro a 90° de abdução, cotovelo a 90°. Realizar rotação externa passiva máxima.',
    positiveResult: 'Sensação de apreensão (medo de luxação), não apenas dor.',
    clinicalInterpretation: 'Sugere instabilidade anterior do ombro. Confirmar com teste de relocação.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_12_20.png'
  },
  // CERVICAL
  {
    id: 'teste-spurling',
    name: 'Teste de Spurling',
    region: 'Cervical',
    objective: 'Avaliar radiculopatia cervical por compressão foraminal.',
    execution: 'Paciente sentado. Realize extensão, inclinação lateral e rotação para o lado sintomático. Aplique compressão axial.',
    positiveResult: 'Reprodução da dor irradiada para o membro superior no dermátomo correspondente.',
    clinicalInterpretation: 'Alta especificidade para radiculopatia cervical. Positivo sugere compressão de raiz nervosa.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/cervical.png'
  },
  {
    id: 'teste-flexao-rotacao',
    name: 'Teste de Flexão-Rotação',
    region: 'Cervical',
    objective: 'Avaliar disfunção de C1-C2 em cefaleia cervicogênica.',
    execution: 'Paciente em decúbito dorsal. Flexione completamente a cervical. Mantenha a flexão e realize rotação passiva para cada lado.',
    positiveResult: 'Restrição de rotação (< 32-33°) e/ou reprodução da cefaleia.',
    clinicalInterpretation: 'Sugere disfunção da articulação atlantoaxial. Útil para diagnóstico diferencial de cefaleia cervicogênica.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/ChatGPT-Image-9-de-mar.-de-2026-11_21_29.png'
  },
  {
    id: 'teste-distracao-cervical',
    name: 'Teste de Distração Cervical',
    region: 'Cervical',
    objective: 'Diferenciar dor radicular de dor muscular cervical.',
    execution: 'Paciente sentado. Segure a cabeça sob o occipital e maxilar. Aplique força de tração axial suave.',
    positiveResult: 'Alívio dos sintomas cervicais e/ou radiculares.',
    clinicalInterpretation: 'Alívio sugere compressão radicular ou facetária. Útil para indicar tração como tratamento.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_5608.png'
  },
  // LOMBAR
  {
    id: 'teste-lasegue',
    name: 'Teste de Lasègue (Elevação da Perna Reta)',
    region: 'Lombar',
    objective: 'Avaliar irritação ou compressão de raízes nervosas lombossacrais (L4-S1).',
    execution: 'Paciente em decúbito dorsal. Eleve passivamente a perna estendida até o limite da dor ou 70°.',
    positiveResult: 'Dor irradiada para o membro inferior (dermátomo) entre 30° e 70° de elevação.',
    clinicalInterpretation: 'Sugere tensão/compressão das raízes L4-S1. Sensibilizar com dorsiflexão do tornozelo.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_1280.png'
  },
  {
    id: 'slump-test',
    name: 'Slump Test',
    region: 'Lombar',
    objective: 'Avaliar mecanossensibilidade do sistema neural (dura-máter e raízes nervosas).',
    execution: 'Paciente sentado. Sequência: flexão torácica → flexão cervical → extensão do joelho → dorsiflexão do tornozelo. Liberar flexão cervical.',
    positiveResult: 'Reprodução dos sintomas que aliviam com extensão cervical.',
    clinicalInterpretation: 'Confirma componente neural da dor. Mais sensível que Lasègue para hérnia de disco.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_0452.png'
  },
  {
    id: 'teste-patrick',
    name: 'Teste de Patrick (FABER)',
    region: 'Lombar',
    objective: 'Diferenciar dor de quadril de dor sacroilíaca.',
    execution: 'Paciente em decúbito dorsal. Posicione o pé do lado testado sobre o joelho contralateral (posição de 4). Pressione o joelho em direção à maca.',
    positiveResult: 'Dor na virilha sugere quadril. Dor na região sacroilíaca sugere disfunção SI.',
    clinicalInterpretation: 'Útil para diferenciar origem da dor. Deve ser combinado com outros testes sacroilíacos.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_5743.png'
  },
  // JOELHO
  {
    id: 'teste-lachman',
    name: 'Teste de Lachman',
    region: 'Joelho',
    objective: 'Avaliar integridade do ligamento cruzado anterior (LCA).',
    execution: 'Paciente em decúbito dorsal. Joelho em 20-30° de flexão. Estabilize o fêmur e aplique força anterior na tíbia.',
    positiveResult: 'Translação anterior excessiva da tíbia com fim mole (sem batente firme).',
    clinicalInterpretation: 'Teste mais sensível para ruptura de LCA. Fim mole indica ruptura completa.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_4612.png'
  },
  {
    id: 'teste-mcmurray',
    name: 'Teste de McMurray',
    region: 'Joelho',
    objective: 'Avaliar lesão de meniscos.',
    execution: 'Paciente em decúbito dorsal. Flexione maximamente o joelho. Realize rotação externa + estresse em valgo + extensão (menisco medial). Rotação interna + varo + extensão (lateral).',
    positiveResult: 'Estalido palpável ou audível associado a dor na interlinha articular.',
    clinicalInterpretation: 'Sugere lesão meniscal. Mais específico quando positivo com dor e estalido.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_2843.png'
  },
  {
    id: 'teste-gaveta-anterior',
    name: 'Teste de Gaveta Anterior',
    region: 'Joelho',
    objective: 'Avaliar integridade do LCA.',
    execution: 'Paciente em decúbito dorsal. Joelho a 90° de flexão, pé apoiado na maca. Sente sobre o pé e aplique força anterior na tíbia.',
    positiveResult: 'Translação anterior excessiva da tíbia.',
    clinicalInterpretation: 'Menos sensível que Lachman devido à estabilização pelos isquiotibiais. Útil para confirmar achado de Lachman.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_6998.png'
  },
  {
    id: 'teste-estresse-valgo',
    name: 'Teste de Estresse em Valgo',
    region: 'Joelho',
    objective: 'Avaliar integridade do ligamento colateral medial (LCM).',
    execution: 'Paciente em decúbito dorsal. Teste em extensão completa e em 30° de flexão. Estabilize o fêmur e aplique força em valgo.',
    positiveResult: 'Abertura medial excessiva (gap) do espaço articular.',
    clinicalInterpretation: 'Abertura a 30° = lesão de LCM. Abertura em extensão = lesão de LCM + possível lesão de LCA ou cápsula posterior.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_4255.png'
  },
  // TORNOZELO
  {
    id: 'teste-gaveta-tornozelo',
    name: 'Teste de Gaveta Anterior do Tornozelo',
    region: 'Tornozelo',
    objective: 'Avaliar integridade do ligamento talofibular anterior (LTFA).',
    execution: 'Paciente sentado com pé relaxado. Estabilize a tíbia e aplique força anterior no calcâneo/tálus.',
    positiveResult: 'Translação anterior excessiva do tálus.',
    clinicalInterpretation: 'Sugere ruptura do LTFA. Comparar sempre com lado contralateral.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_6406.png'
  },
  {
    id: 'squeeze-test',
    name: 'Squeeze Test',
    region: 'Tornozelo',
    objective: 'Avaliar lesão da sindesmose tibiofibular.',
    execution: 'Paciente sentado ou deitado. Comprima a tíbia e fíbula no terço médio da perna.',
    positiveResult: 'Dor na região da sindesmose (acima do tornozelo).',
    clinicalInterpretation: 'Sugere lesão de sindesmose (high ankle sprain). Tempo de recuperação maior que entorse lateral.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_2337.png'
  },
  {
    id: 'teste-thompson',
    name: 'Teste de Thompson',
    region: 'Tornozelo',
    objective: 'Avaliar integridade do tendão de Aquiles.',
    execution: 'Paciente em decúbito ventral com pé para fora da maca. Comprima a panturrilha.',
    positiveResult: 'Ausência de flexão plantar do pé.',
    clinicalInterpretation: 'Ausência de movimento indica ruptura do tendão de Aquiles. Encaminhar para avaliação ortopédica.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_7543.png'
  },
  {
    id: 'windlass-test',
    name: 'Windlass Test',
    region: 'Tornozelo',
    objective: 'Avaliar fasceíte plantar.',
    execution: 'Paciente sentado ou em pé. Realize dorsiflexão passiva do hálux.',
    positiveResult: 'Dor na região medial do calcâneo (inserção da fáscia plantar).',
    clinicalInterpretation: 'Sugere fasceíte plantar. A dorsiflexão do hálux tensiona a fáscia plantar.',
    imageUrl: 'https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.mochausercontent.com/image.png_9133.png'
  }
];

// ===== CONDUTAS INICIAIS =====
export interface InitialTreatment {
  id: string;
  condition: string;
  region: string;
  objectives: string[];
  initialConducts: string[];
  progressionCriteria?: string;
  redFlags?: string[];
}

export const initialTreatments: InitialTreatment[] = [
  // CERVICAL
  {
    id: 'cervicalgia-mecanica',
    condition: 'Cervicalgia Mecânica',
    region: 'Cervical',
    objectives: [
      'Reduzir dor e espasmo muscular',
      'Restaurar mobilidade cervical',
      'Melhorar controle motor cervical',
      'Corrigir postura'
    ],
    initialConducts: [
      'Educação do paciente sobre prognóstico favorável',
      'Mobilização articular cervical (graus I-II)',
      'Liberação miofascial de trapézio e levantador',
      'Exercícios de flexão craniocervical (DCF)',
      'Exercícios de retração cervical',
      'Correção postural e ergonômica',
      'Orientação sobre pausas ativas'
    ],
    progressionCriteria: 'Progredir quando dor permitir ADM funcional e contração sustentada de DCF por 10s.'
  },
  {
    id: 'cefaleia-cervicogenica',
    condition: 'Cefaleia Cervicogênica',
    region: 'Cervical',
    objectives: [
      'Reduzir frequência e intensidade da cefaleia',
      'Restaurar mobilidade da cervical alta (C0-C3)',
      'Fortalecer flexores profundos',
      'Abordar fatores posturais'
    ],
    initialConducts: [
      'Mobilização da cervical alta (C1-C2)',
      'Liberação de suboccipitais',
      'Treino de flexores profundos do pescoço',
      'Exercícios de retração cervical',
      'Correção de postura anteriorizada de cabeça',
      'Técnicas de relaxamento',
      'Orientação sobre gatilhos'
    ],
    progressionCriteria: 'Progredir quando flexão-rotação test melhorar e frequência de cefaleia diminuir.'
  },
  // OMBRO
  {
    id: 'sindrome-impacto',
    condition: 'Síndrome do Impacto Subacromial',
    region: 'Ombro',
    objectives: [
      'Reduzir dor e inflamação',
      'Restaurar mobilidade do ombro',
      'Corrigir discinesia escapular',
      'Fortalecer manguito rotador'
    ],
    initialConducts: [
      'Crioterapia pós-atividade',
      'Mobilização articular glenoumeral',
      'Alongamento da cápsula posterior',
      'Exercícios escapulares (retração, depressão)',
      'Fortalecimento de rotadores externos',
      'Exercícios pendulares de Codman',
      'Modificação de atividades que agravam'
    ],
    progressionCriteria: 'Progredir para fortalecimento resistido quando ADM indolor em flexão > 120° e RE > 60°.'
  },
  {
    id: 'capsulite-adesiva',
    condition: 'Capsulite Adesiva (Ombro Congelado)',
    region: 'Ombro',
    objectives: [
      'Manter e progressivamente ganhar ADM',
      'Reduzir dor noturna',
      'Preservar função durante recuperação',
      'Orientar sobre prognóstico (12-24 meses)'
    ],
    initialConducts: [
      'Educação sobre evolução natural da condição',
      'Mobilização articular graus I e II (dentro da tolerância)',
      'Alongamentos suaves de cápsula',
      'Exercícios pendulares de Codman',
      'Termoterapia antes da mobilização',
      'Exercícios ativos assistidos',
      'Orientação sobre posição para dormir'
    ],
    progressionCriteria: 'Fase congelada: foco em manutenção. Fase de degelo: progredir mobilização agressivamente.'
  },
  // LOMBAR
  {
    id: 'lombalgia-mecanica',
    condition: 'Lombalgia Mecânica Inespecífica',
    region: 'Lombar',
    objectives: [
      'Reduzir dor e incapacidade',
      'Restaurar função',
      'Melhorar estabilidade lombar',
      'Prevenir cronicidade'
    ],
    initialConducts: [
      'Educação em neurociência da dor',
      'Manter atividade dentro do tolerável (evitar repouso)',
      'Exercícios de estabilização lombar (core)',
      'Mobilização articular se hipomobilidade',
      'Alongamento de flexores do quadril',
      'Exercícios de McKenzie (se centralização)',
      'Progressão funcional gradual'
    ],
    redFlags: ['Síndrome da cauda equina', 'Fratura', 'Infecção', 'Câncer', 'Déficit neurológico progressivo'],
    progressionCriteria: 'Progredir quando dor < 4/10 e capacidade de manter contração de core por 30s.'
  },
  {
    id: 'hernia-disco-radiculopatia',
    condition: 'Hérnia de Disco com Radiculopatia',
    region: 'Lombar',
    objectives: [
      'Reduzir sintomas radiculares',
      'Centralizar a dor',
      'Restaurar função',
      'Evitar cirurgia quando possível'
    ],
    initialConducts: [
      'Educação sobre prognóstico (maioria melhora sem cirurgia)',
      'Posições de alívio (extensão se centraliza)',
      'Exercícios de McKenzie (se centralização)',
      'Mobilização neural (sliders antes de tensioners)',
      'Evitar flexão lombar prolongada',
      'Manter atividade modificada',
      'Monitorar déficit motor'
    ],
    redFlags: ['Perda de controle vesical/intestinal', 'Anestesia em sela', 'Fraqueza bilateral progressiva'],
    progressionCriteria: 'Progredir quando dor centralizar e sintomas radiculares diminuírem.'
  },
  // QUADRIL
  {
    id: 'dor-trocenterica',
    condition: 'Síndrome da Dor Trocantérica',
    region: 'Quadril',
    objectives: [
      'Reduzir dor e inflamação',
      'Fortalecer glúteo médio',
      'Corrigir biomecânica',
      'Reduzir compressão tendinosa'
    ],
    initialConducts: [
      'Evitar posições de compressão (deitar de lado)',
      'Isométricos de abdutores em posição neutra',
      'Progressão para excêntricos',
      'Alongamento de TFL (cuidado para não comprimir)',
      'Fortalecimento de core e estabilização pélvica',
      'Correção de biomecânica de marcha',
      'Avaliar calçado e modificar treino'
    ],
    progressionCriteria: 'Progredir quando caminhar sem dor e conseguir contrair isométrico sem provocar sintomas.'
  },
  // JOELHO
  {
    id: 'sindrome-patelofemoral',
    condition: 'Síndrome da Dor Patelofemoral',
    region: 'Joelho',
    objectives: [
      'Reduzir dor anterior do joelho',
      'Melhorar tracking patelar',
      'Fortalecer VMO e glúteos',
      'Corrigir fatores contribuintes'
    ],
    initialConducts: [
      'Taping patelar (McConnell)',
      'Fortalecimento de VMO (arco terminal 40-0°)',
      'Fortalecimento de glúteo médio',
      'Alongamento de isquiotibiais e TFL',
      'Exercícios de cadeia cinética fechada',
      'Educação sobre atividades de alto estresse patelar',
      'Avaliar uso de palmilhas'
    ],
    progressionCriteria: 'Progredir quando conseguir agachar até 60° sem dor e descer escadas sem sintomas.'
  },
  {
    id: 'pos-lca',
    condition: 'Pós-Operatório de LCA',
    region: 'Joelho',
    objectives: [
      'Controlar edema e dor',
      'Restaurar ADM completa',
      'Recuperar força de quadríceps',
      'Progredir para retorno ao esporte'
    ],
    initialConducts: [
      'Crioterapia e elevação',
      'Mobilização patelar',
      'Extensão passiva completa (prioridade)',
      'Flexão progressiva (meta: 90° em 2 semanas)',
      'Ativação de quadríceps (isométricos)',
      'Marcha com descarga progressiva',
      'Exercícios de cadeia cinética fechada precoces'
    ],
    progressionCriteria: 'Progredir quando extensão completa, flexão > 120°, marcha sem muletas, controle de edema.'
  },
  // TORNOZELO
  {
    id: 'entorse-tornozelo',
    condition: 'Entorse Lateral de Tornozelo',
    region: 'Tornozelo',
    objectives: [
      'Controlar dor e edema',
      'Restaurar ADM',
      'Fortalecer eversores',
      'Treinar propriocepção'
    ],
    initialConducts: [
      'PRICE nas primeiras 48-72h',
      'Proteção com órtese funcional',
      'Mobilização precoce ativa',
      'Carga conforme tolerância (evitar repouso total)',
      'Exercícios de ADM (alfabeto com o pé)',
      'Isométricos de fibulares',
      'Propriocepção precoce (apoio unipodal)'
    ],
    progressionCriteria: 'Progredir quando marcha sem claudicação e ADM completa sem dor.'
  },
  {
    id: 'fasceite-plantar',
    condition: 'Fasceíte Plantar',
    region: 'Tornozelo',
    objectives: [
      'Reduzir dor matinal e com carga',
      'Restaurar flexibilidade do tríceps sural',
      'Fortalecer musculatura intrínseca',
      'Modificar fatores de sobrecarga'
    ],
    initialConducts: [
      'Alongamento de gastrocnêmio e sóleo',
      'Alongamento específico da fáscia plantar',
      'Fortalecimento de intrínsecos do pé',
      'Night splint (se dor matinal severa)',
      'Avaliação e modificação de calçado',
      'Palmilhas com suporte de arco',
      'Massagem com bolinha na fáscia'
    ],
    progressionCriteria: 'Progredir quando dor matinal < 3/10 e conseguir caminhar 30 minutos sem piora.'
  },
  // PUNHO E MÃO
  {
    id: 'tunel-carpo',
    condition: 'Síndrome do Túnel do Carpo',
    region: 'Punho e Mão',
    objectives: [
      'Reduzir compressão do nervo mediano',
      'Aliviar sintomas noturnos',
      'Manter função da mão',
      'Prevenir atrofia tenar'
    ],
    initialConducts: [
      'Órtese noturna em posição neutra',
      'Deslizamento neural do mediano',
      'Deslizamento tendinoso de flexores',
      'Modificação ergonômica',
      'Exercícios de mobilidade do punho',
      'Avaliação de atividades provocativas',
      'Encaminhar para ENMG se grave'
    ],
    progressionCriteria: 'Progredir quando sintomas noturnos melhorarem e parestesias diminuírem.'
  },
  {
    id: 'de-quervain',
    condition: 'Tendinite de De Quervain',
    region: 'Punho e Mão',
    objectives: [
      'Reduzir dor e inflamação',
      'Restaurar função do polegar',
      'Modificar atividades provocativas'
    ],
    initialConducts: [
      'Órtese que inclua polegar (spica)',
      'Crioterapia local',
      'Modificação de atividades repetitivas',
      'Deslizamento tendinoso de APL e EPB',
      'Mobilização articular do polegar',
      'Fortalecimento gradual após controle da dor',
      'Considerar infiltração se refratário'
    ],
    progressionCriteria: 'Progredir quando Finkelstein negativo e conseguir fazer pinça sem dor.'
  }
];

// ===== ELETROTERAPIA =====
export interface ElectrotherapyModality {
  id: string;
  name: string;
  category: 'analgesica' | 'termica' | 'laser' | 'correntes';
  description: string;
  mechanism: string;
  parameters: {
    name: string;
    values: string;
    description: string;
  }[];
  indications: string[];
  contraindications: string[];
  applicationTips: string[];
  evidenceLevel: 'alto' | 'moderado' | 'baixo';
  references: string[];
}

export const electrotherapyModalities: ElectrotherapyModality[] = [
  {
    id: 'tens-convencional',
    name: 'TENS Convencional',
    category: 'analgesica',
    description: 'Estimulação elétrica nervosa transcutânea de alta frequência e baixa intensidade para analgesia.',
    mechanism: 'Ativa fibras Aβ de grande diâmetro, fechando o "portão da dor" na medula espinhal (Teoria das Comportas de Melzack e Wall).',
    parameters: [
      { name: 'Frequência', values: '80-150 Hz', description: 'Alta frequência para ativar fibras Aβ' },
      { name: 'Largura de pulso', values: '50-100 μs', description: 'Curta duração, mais confortável' },
      { name: 'Intensidade', values: 'Formigamento forte sem dor', description: 'Nível sensorial, sem contração muscular' },
      { name: 'Tempo', values: '20-60 min', description: 'Pode ser usado várias vezes ao dia' }
    ],
    indications: [
      'Dor aguda pós-operatória',
      'Dor crônica musculoesquelética',
      'Cervicalgia e lombalgia',
      'Dor neuropática periférica',
      'Fibromialgia',
      'Osteoartrose'
    ],
    contraindications: [
      'Marca-passo cardíaco',
      'Região anterior do pescoço (seio carotídeo)',
      'Útero gravídico',
      'Sobre áreas com trombose',
      'Pele lesada ou infectada',
      'Pacientes com epilepsia não controlada'
    ],
    applicationTips: [
      'Posicionar eletrodos ao redor da área dolorosa',
      'Técnica cruzada para dor profunda',
      'Ajustar intensidade até formigamento confortável',
      'Efeito dura enquanto estiver ligado + 30min após'
    ],
    evidenceLevel: 'alto',
    references: ['Sluka KA, Walsh D. Transcutaneous electrical nerve stimulation. Pain. 2003', 'Johnson MI. Transcutaneous Electrical Nerve Stimulation (TENS). 2014']
  },
  {
    id: 'tens-acupuntura',
    name: 'TENS Acupuntura (Burst)',
    category: 'analgesica',
    description: 'TENS de baixa frequência que estimula liberação de endorfinas para analgesia prolongada.',
    mechanism: 'Ativa fibras Aδ e estimula liberação de opioides endógenos (β-endorfina, encefalinas) no SNC.',
    parameters: [
      { name: 'Frequência', values: '2-10 Hz', description: 'Baixa frequência para liberação de endorfinas' },
      { name: 'Largura de pulso', values: '150-250 μs', description: 'Maior duração para recrutar fibras Aδ' },
      { name: 'Intensidade', values: 'Contração muscular visível', description: 'Nível motor, deve contrair' },
      { name: 'Tempo', values: '20-30 min', description: 'Sessões mais curtas devido à fadiga muscular' }
    ],
    indications: [
      'Dor crônica de difícil controle',
      'Pontos-gatilho miofasciais',
      'Fibromialgia',
      'Dor neuropática',
      'Quando TENS convencional perde efeito'
    ],
    contraindications: [
      'Marca-passo cardíaco',
      'Região anterior do pescoço',
      'Útero gravídico',
      'Pacientes que não toleram contração muscular'
    ],
    applicationTips: [
      'Posicionar sobre pontos motores ou acupontos',
      'Aumentar intensidade até contração rítmica',
      'Efeito analgésico demora mais (15-20min) mas dura mais',
      'Alternar com TENS convencional se necessário'
    ],
    evidenceLevel: 'moderado',
    references: ['Han JS. Acupuncture and endorphins. Neurosci Lett. 2004', 'Sluka KA. Mechanisms and management of pain. 2009']
  },
  {
    id: 'fes',
    name: 'FES - Estimulação Elétrica Funcional',
    category: 'correntes',
    description: 'Corrente que produz contração muscular funcional para reabilitação neuromuscular.',
    mechanism: 'Despolariza neurônios motores periféricos, causando contração muscular que pode ser sincronizada com movimento funcional.',
    parameters: [
      { name: 'Frequência', values: '20-50 Hz', description: '35 Hz ideal para contração tetânica suave' },
      { name: 'Largura de pulso', values: '200-400 μs', description: 'Suficiente para recrutar unidades motoras' },
      { name: 'Tempo ON', values: '5-10 seg', description: 'Duração da contração' },
      { name: 'Tempo OFF', values: '10-20 seg', description: 'Repouso 2:1 ou 3:1 inicialmente' },
      { name: 'Rampa', values: '1-2 seg', description: 'Subida gradual para conforto' },
      { name: 'Intensidade', values: 'Contração funcional', description: 'Suficiente para movimento ou sustentação' }
    ],
    indications: [
      'AVE - pé equino, subluxação de ombro',
      'Lesão medular incompleta',
      'Paralisia cerebral',
      'Fraqueza pós-cirúrgica (ex: quadríceps pós-LCA)',
      'Atrofia muscular por desuso',
      'Incontinência urinária'
    ],
    contraindications: [
      'Marca-passo',
      'Espasticidade severa',
      'Fraturas não consolidadas',
      'Infecção local',
      'Lesão de nervo periférico completa'
    ],
    applicationTips: [
      'Identificar ponto motor do músculo',
      'Sincronizar com movimento voluntário quando possível',
      'Progredir relação ON:OFF conforme resistência',
      'Combinar com treino funcional para neuroplasticidade'
    ],
    evidenceLevel: 'alto',
    references: ['Peckham PH, Knutson JS. Functional electrical stimulation. Annu Rev Biomed Eng. 2005', 'Doucet BM. FES: maximizing neuroplasticity. Phys Ther. 2012']
  },
  {
    id: 'corrente-russa',
    name: 'Corrente Russa',
    category: 'correntes',
    description: 'Corrente de média frequência modulada em bursts para fortalecimento muscular.',
    mechanism: 'Frequência portadora de 2500 Hz modulada em bursts de 50 Hz permite maior penetração e recrutamento de fibras tipo II.',
    parameters: [
      { name: 'Frequência portadora', values: '2500 Hz', description: 'Frequência média característica' },
      { name: 'Modulação', values: '50 Hz (bursts)', description: 'Frequência dos bursts para tetania' },
      { name: 'Ciclo de trabalho', values: '50%', description: 'Duty cycle padrão' },
      { name: 'Tempo ON', values: '10 seg', description: 'Contração sustentada' },
      { name: 'Tempo OFF', values: '50 seg', description: 'Relação 1:5 para evitar fadiga' },
      { name: 'Intensidade', values: 'Máxima tolerada', description: 'Maior intensidade = maior recrutamento' }
    ],
    indications: [
      'Fortalecimento muscular em atletas',
      'Reabilitação pós-cirúrgica',
      'Atrofia por imobilização',
      'Preparação para retorno ao esporte'
    ],
    contraindications: [
      'Marca-passo',
      'Gestação (abdome)',
      'Neoplasias',
      'Processos inflamatórios agudos'
    ],
    applicationTips: [
      'Posicionar eletrodos nos ventres musculares',
      'Associar com contração voluntária para maior efeito',
      '2-3x/semana com descanso entre sessões',
      'Aumentar intensidade progressivamente nas sessões'
    ],
    evidenceLevel: 'moderado',
    references: ['Ward AR, Shkuratova N. Russian electrical stimulation: the early experiments. Phys Ther. 2002', 'Selkowitz DM. Improvement in isometric strength. Phys Ther. 1985']
  },
  {
    id: 'ultrassom-terapeutico',
    name: 'Ultrassom Terapêutico',
    category: 'termica',
    description: 'Ondas sonoras de alta frequência para aquecimento profundo e efeitos não-térmicos.',
    mechanism: 'Efeito térmico: aumento de temperatura em tecidos profundos. Efeito não-térmico: cavitação estável, streaming acústico, aumento de permeabilidade celular.',
    parameters: [
      { name: 'Frequência', values: '1 MHz (profundo) ou 3 MHz (superficial)', description: '1 MHz penetra 3-5cm, 3 MHz penetra 1-2cm' },
      { name: 'Intensidade', values: '0.5-2.0 W/cm²', description: 'Contínuo para térmico, pulsado para não-térmico' },
      { name: 'Modo', values: 'Contínuo ou Pulsado', description: 'Pulsado 20% para fase aguda' },
      { name: 'Tempo', values: '5-10 min', description: '1-2 min por ERA (área do cabeçote)' },
      { name: 'ERA', values: '1-10 cm²', description: 'Área de radiação efetiva do cabeçote' }
    ],
    indications: [
      'Tendinopatias crônicas',
      'Contraturas articulares',
      'Cicatrização tecidual',
      'Dor miofascial',
      'Calcificações (fonoforese)',
      'Pré-alongamento de tecidos'
    ],
    contraindications: [
      'Sobre útero gravídico',
      'Sobre gônadas',
      'Áreas com implantes metálicos (relativo)',
      'Sobre placas de crescimento',
      'Tumores',
      'Sobre olhos, coração, cérebro',
      'Tromboflebite'
    ],
    applicationTips: [
      'Manter cabeçote em movimento circular ou linear lento',
      'Usar gel suficiente - sem bolhas de ar',
      'Para tendões, usar 3 MHz e modo pulsado',
      'Combinar com alongamento após (janela de 5 min)'
    ],
    evidenceLevel: 'moderado',
    references: ['Robertson VJ. Electrotherapy Explained. 2006', 'Watson T. Therapeutic Ultrasound. 2008']
  },
  {
    id: 'laser-baixa-potencia',
    name: 'Laser de Baixa Potência (LLLT)',
    category: 'laser',
    description: 'Fototerapia com laser para bioestimulação, analgesia e reparo tecidual.',
    mechanism: 'Fotobiomodulação: fótons são absorvidos por cromóforos mitocondriais (citocromo c oxidase), aumentando ATP, modulando ROS e ativando fatores de transcrição.',
    parameters: [
      { name: 'Comprimento de onda', values: '630-670nm (vermelho) ou 780-860nm (infravermelho)', description: 'Vermelho superficial, IV profundo' },
      { name: 'Potência', values: '10-500 mW', description: 'Baixa potência característica do LLLT' },
      { name: 'Dose (Fluência)', values: '1-4 J/cm² (superficial) ou 4-10 J/cm² (profundo)', description: 'Dose = Potência × Tempo / Área' },
      { name: 'Modo', values: 'Contínuo ou Pulsado', description: 'Contínuo mais comum em LLLT' },
      { name: 'Tempo por ponto', values: '20-60 seg', description: 'Depende da dose e potência' }
    ],
    indications: [
      'Cicatrização de feridas',
      'Tendinopatias',
      'Dor musculoesquelética',
      'Artrite/Osteoartrose',
      'Pontos-gatilho',
      'Linfedema',
      'Mucosite oral'
    ],
    contraindications: [
      'Sobre olhos (sem proteção)',
      'Sobre tumores malignos',
      'Sobre útero gravídico',
      'Sobre glândula tireoide',
      'Fotossensibilidade'
    ],
    applicationTips: [
      'Usar óculos de proteção apropriados',
      'Aplicar perpendicular à pele',
      'Para dor, doses mais baixas (2-4 J/cm²)',
      'Para cicatrização, doses moderadas (4-8 J/cm²)',
      'Manter ponteira em contato ou 1cm de distância'
    ],
    evidenceLevel: 'moderado',
    references: ['Chung H, Dai T. The nuts and bolts of LLLT. Ann Biomed Eng. 2012', 'Bjordal JM. LLLT for tendinopathy. Phys Ther Sport. 2006']
  },
  {
    id: 'ondas-curtas',
    name: 'Ondas Curtas (Diatermia)',
    category: 'termica',
    description: 'Aquecimento profundo por ondas eletromagnéticas de alta frequência.',
    mechanism: 'Radiação eletromagnética (27.12 MHz) causa vibração molecular e aquecimento em tecidos profundos ricos em água.',
    parameters: [
      { name: 'Frequência', values: '27.12 MHz', description: 'Frequência padrão internacional' },
      { name: 'Modo', values: 'Contínuo ou Pulsado', description: 'Pulsado para fase subaguda' },
      { name: 'Intensidade', values: 'Calor leve a moderado', description: 'Sensação térmica agradável' },
      { name: 'Tempo', values: '15-30 min', description: 'Depende da intensidade e objetivo' },
      { name: 'Tipo de eletrodo', values: 'Capacitivo ou Indutivo', description: 'Capacitivo para gordura, Indutivo para músculo' }
    ],
    indications: [
      'Artrose de grandes articulações',
      'Contraturas musculares profundas',
      'Espasmo muscular',
      'Pré-alongamento',
      'Dor lombar crônica',
      'Sinusite (com cautela)'
    ],
    contraindications: [
      'Implantes metálicos',
      'Marca-passo',
      'Gestação',
      'Tumores',
      'Áreas hemorrágicas',
      'Perda de sensibilidade térmica',
      'Isquemia',
      'DIU metálico'
    ],
    applicationTips: [
      'Remover todos os metais do paciente',
      'Verificar sensibilidade térmica antes',
      'Manter distância segura de outros equipamentos',
      'Eletrodos indutivos para músculos profundos'
    ],
    evidenceLevel: 'baixo',
    references: ['Robertson VJ. Dosage and treatment response in SWD. Phys Ther. 2005', 'Draper DO. Shortwave diathermy. Athletic Ther Today. 2002']
  },
  {
    id: 'crioterapia',
    name: 'Crioterapia',
    category: 'termica',
    description: 'Aplicação de frio para analgesia, redução de edema e controle inflamatório.',
    mechanism: 'Vasoconstrição inicial, diminuição do metabolismo celular, redução da velocidade de condução nervosa, diminuição da espasticidade.',
    parameters: [
      { name: 'Temperatura', values: '0-15°C', description: 'Gelo, bolsa gel, spray, imersão' },
      { name: 'Tempo', values: '10-20 min', description: 'Depende do tecido e adiposidade' },
      { name: 'Frequência', values: 'A cada 2-3h na fase aguda', description: 'Primeiras 48-72h pós-lesão' },
      { name: 'Método', values: 'Compressas, imersão, spray, massagem com gelo', description: 'Escolher conforme área e objetivo' }
    ],
    indications: [
      'Lesões agudas (primeiras 72h)',
      'Pós-operatório',
      'Espasticidade',
      'Dor aguda',
      'Edema',
      'Bursite/tendinite aguda',
      'Contusões e entorses'
    ],
    contraindications: [
      'Fenômeno de Raynaud',
      'Crioglobulinemia',
      'Hemoglobinúria paroxística',
      'Hipersensibilidade ao frio',
      'Áreas com circulação comprometida',
      'Sobre nervos superficiais por tempo prolongado'
    ],
    applicationTips: [
      'Proteger pele com tecido fino',
      'Elevar membro para potencializar efeito',
      'PRICE/POLICE nas primeiras 48h',
      'Evitar em áreas anestesiadas',
      'Monitorar sinais de queimadura por frio'
    ],
    evidenceLevel: 'alto',
    references: ['Bleakley C. Cryotherapy for acute ankle sprains. J Athl Train. 2004', 'Malanga GA. Mechanisms and efficacy of cold therapy. Postgrad Med. 2015']
  },
  {
    id: 'termoterapia',
    name: 'Termoterapia Superficial',
    category: 'termica',
    description: 'Aplicação de calor superficial para relaxamento muscular e preparação tecidual.',
    mechanism: 'Vasodilatação, aumento do fluxo sanguíneo, relaxamento muscular, aumento da extensibilidade do colágeno, diminuição da rigidez articular.',
    parameters: [
      { name: 'Temperatura', values: '40-45°C', description: 'Calor confortável, não queimante' },
      { name: 'Tempo', values: '15-30 min', description: 'Tempo para atingir tecido-alvo' },
      { name: 'Método', values: 'Bolsa térmica, infravermelho, compressas, parafina', description: 'Escolher conforme área' }
    ],
    indications: [
      'Espasmo muscular',
      'Contraturas crônicas',
      'Rigidez articular matinal',
      'Pré-alongamento e mobilização',
      'Dor crônica musculoesquelética',
      'Artrose (fase crônica)'
    ],
    contraindications: [
      'Inflamação aguda',
      'Sangramento ou hematoma recente',
      'Áreas com déficit sensorial',
      'Tumores',
      'Insuficiência vascular',
      'Dermatite ou feridas abertas'
    ],
    applicationTips: [
      'Verificar sensibilidade térmica antes',
      'Não aplicar sobre áreas anestesiadas',
      'Realizar alongamento imediatamente após (janela térmica)',
      'Combinar com mobilização para melhor resultado'
    ],
    evidenceLevel: 'moderado',
    references: ['Nadler SF. The physiologic basis for superficial heat. Am J Phys Med Rehabil. 2004', 'French SD. Heat wrap for LBP. Spine. 2006']
  },
  {
    id: 'terapia-combinada',
    name: 'Terapia Combinada (US + Corrente)',
    category: 'correntes',
    description: 'Aplicação simultânea de ultrassom e corrente elétrica para efeitos sinérgicos.',
    mechanism: 'Ultrassom aumenta permeabilidade das membranas e condutância tecidual, potencializando efeitos da corrente elétrica em tecidos mais profundos.',
    parameters: [
      { name: 'US Frequência', values: '1 MHz', description: 'Para alcançar tecidos profundos' },
      { name: 'US Intensidade', values: '0.5-1.0 W/cm²', description: 'Menor que US isolado' },
      { name: 'Corrente', values: 'TENS ou Interferencial', description: 'Conforme objetivo terapêutico' },
      { name: 'Tempo', values: '8-12 min', description: 'Tempo combinado' }
    ],
    indications: [
      'Pontos-gatilho profundos',
      'Tendinopatias crônicas',
      'Dor miofascial refratária',
      'Cicatrizes fibróticas',
      'Quando recursos isolados não funcionam'
    ],
    contraindications: [
      'Todas as contraindicações do US',
      'Todas as contraindicações das correntes',
      'Implantes metálicos',
      'Marca-passo'
    ],
    applicationTips: [
      'Usar cabeçote de US como eletrodo móvel',
      'Eletrodo dispersivo fixo em área proximal',
      'Manter movimento constante do cabeçote',
      'Gel condutor abundante'
    ],
    evidenceLevel: 'baixo',
    references: ['Warden SJ, McMeeken JM. Ultrasound usage and dosage. Phys Ther. 2002']
  }
];

export const getElectrotherapyByCategory = (category: string) => 
  electrotherapyModalities.filter(m => category === 'all' || m.category === category);

// ===== BIOMECÂNICA ARTICULAR =====
export interface JointBiomechanics {
  id: string;
  name: string;
  category: 'membro-superior' | 'membro-inferior' | 'coluna' | 'complexos';
  type: string;
  degreesOfFreedom: number;
  movements: {
    name: string;
    rom: string;
    plane: string;
    axis: string;
  }[];
  primeMuscles: string[];
  stabilizers: string[];
  commonDysfunctions: string[];
  clinicalRelevance: string[];
  functionalImportance: string;
  references: string[];
}

export const jointBiomechanics: JointBiomechanics[] = [
  // MEMBRO SUPERIOR
  {
    id: 'ombro-glenoumeral',
    name: 'Glenoumeral (Ombro)',
    category: 'membro-superior',
    type: 'Esferoide (Bola e Soquete)',
    degreesOfFreedom: 3,
    movements: [
      { name: 'Flexão', rom: '0-180°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '0-45°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Abdução', rom: '0-180°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Adução', rom: '180-0°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Rotação Externa', rom: '0-90°', plane: 'Transverso', axis: 'Longitudinal' },
      { name: 'Rotação Interna', rom: '0-70°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Deltóide', 'Supraespinhal', 'Peitoral Maior', 'Grande Dorsal', 'Infraespinhal', 'Subescapular'],
    stabilizers: ['Manguito Rotador', 'Bíceps (cabeça longa)', 'Lábio Glenoidal', 'Cápsula articular'],
    commonDysfunctions: ['Síndrome do Impacto', 'Capsulite Adesiva', 'Instabilidade Glenoumeral', 'Lesão do Manguito Rotador'],
    clinicalRelevance: [
      'Alta mobilidade = baixa estabilidade intrínseca',
      'Ritmo escapuloumeral: 2:1 (120° GU : 60° escapula)',
      'Posição de maior instabilidade: ABER (abdução + rotação externa)',
      'Centro instantâneo de rotação muda com movimento'
    ],
    functionalImportance: 'Permite posicionamento da mão no espaço para AVDs, trabalho e esportes. Articulação mais móvel do corpo.',
    references: ['Neumann DA. Kinesiology of the Musculoskeletal System. 3rd ed. 2017']
  },
  {
    id: 'cotovelo',
    name: 'Cotovelo',
    category: 'membro-superior',
    type: 'Gínglimo (Dobradiça) + Trocoide',
    degreesOfFreedom: 2,
    movements: [
      { name: 'Flexão', rom: '0-145°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '145-0°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Pronação', rom: '0-80°', plane: 'Transverso', axis: 'Longitudinal' },
      { name: 'Supinação', rom: '0-85°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Bíceps Braquial', 'Braquial', 'Braquiorradial', 'Tríceps Braquial', 'Pronador Redondo', 'Supinador'],
    stabilizers: ['Ligamento Colateral Medial', 'Ligamento Colateral Lateral', 'Ligamento Anular'],
    commonDysfunctions: ['Epicondilite Lateral', 'Epicondilite Medial', 'Síndrome do Túnel Cubital', 'Bursite Olecraniana'],
    clinicalRelevance: [
      'Ângulo de carregamento (valgo fisiológico): 5-15°',
      'Flexão funcional mínima: 30-130° para AVDs',
      'Pronação/supinação ocorre nas articulações radioulnares',
      'Força de extensão depende do ângulo articular'
    ],
    functionalImportance: 'Essencial para alimentação, higiene pessoal e posicionamento da mão. Arco funcional crítico para independência.',
    references: ['Morrey BF. The Elbow and Its Disorders. 4th ed. 2009']
  },
  {
    id: 'punho',
    name: 'Punho (Radiocarpal)',
    category: 'membro-superior',
    type: 'Condilar (Elipsóide)',
    degreesOfFreedom: 2,
    movements: [
      { name: 'Flexão', rom: '0-80°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '0-70°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Desvio Radial', rom: '0-20°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Desvio Ulnar', rom: '0-35°', plane: 'Frontal', axis: 'Anteroposterior' }
    ],
    primeMuscles: ['Flexor Radial do Carpo', 'Flexor Ulnar do Carpo', 'Extensor Radial Longo', 'Extensor Radial Curto', 'Extensor Ulnar do Carpo'],
    stabilizers: ['Ligamentos Radiocarpal', 'Fibrocartilagem Triangular (TFCC)', 'Ligamentos Intercarpais'],
    commonDysfunctions: ['Síndrome do Túnel do Carpo', 'Tendinite de De Quervain', 'Fratura de Colles', 'Instabilidade Escafolunar'],
    clinicalRelevance: [
      'Posição funcional: 20-30° extensão + leve desvio ulnar',
      'Força de preensão máxima em 35° extensão',
      'Movimento combinado das fileiras carpais proximal e distal',
      'Extensão > flexão para função da mão'
    ],
    functionalImportance: 'Posiciona a mão para preensão e manipulação fina. Estabilidade essencial para força de garra.',
    references: ['Berger RA. The anatomy of the ligaments of the wrist. Clin Orthop. 2001']
  },
  // MEMBRO INFERIOR
  {
    id: 'quadril',
    name: 'Quadril (Coxofemoral)',
    category: 'membro-inferior',
    type: 'Esferoide (Bola e Soquete)',
    degreesOfFreedom: 3,
    movements: [
      { name: 'Flexão', rom: '0-120°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '0-30°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Abdução', rom: '0-45°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Adução', rom: '0-30°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Rotação Externa', rom: '0-45°', plane: 'Transverso', axis: 'Longitudinal' },
      { name: 'Rotação Interna', rom: '0-40°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Iliopsoas', 'Glúteo Máximo', 'Glúteo Médio', 'Adutores', 'Piriforme', 'Tensor da Fáscia Lata'],
    stabilizers: ['Lábio Acetabular', 'Cápsula Articular', 'Ligamento Iliofemoral', 'Ligamento da Cabeça do Fêmur'],
    commonDysfunctions: ['Impacto Femoroacetabular', 'Osteoartrose', 'Lesão Labral', 'Síndrome do Piriforme', 'Bursite Trocantérica'],
    clinicalRelevance: [
      'Ângulo de anteversão femoral: 12-15°',
      'Ângulo cervicodiafisário: 125-135°',
      'Close-packed position: extensão + rotação interna + abdução',
      'Trendelenburg positivo indica fraqueza de glúteo médio'
    ],
    functionalImportance: 'Sustenta peso corporal, permite locomoção e transferências. Equilíbrio entre mobilidade e estabilidade para marcha.',
    references: ['Byrd JWT. Hip arthroscopy. J Am Acad Orthop Surg. 2006']
  },
  {
    id: 'joelho',
    name: 'Joelho (Tibiofemoral)',
    category: 'membro-inferior',
    type: 'Gínglimo Modificado (Dobradiça)',
    degreesOfFreedom: 2,
    movements: [
      { name: 'Flexão', rom: '0-135°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '135-0°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Rotação Interna', rom: '0-10°', plane: 'Transverso', axis: 'Longitudinal' },
      { name: 'Rotação Externa', rom: '0-30°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Quadríceps', 'Isquiotibiais', 'Gastrocnêmio', 'Poplíteo', 'Sartório', 'Grácil'],
    stabilizers: ['LCA', 'LCP', 'LCM', 'LCL', 'Meniscos Medial e Lateral', 'Cápsula Posterior'],
    commonDysfunctions: ['Lesão de LCA', 'Lesão Meniscal', 'Síndrome Patelofemoral', 'Condromalácia', 'Osteoartrose', 'Tendinopatia Patelar'],
    clinicalRelevance: [
      'Mecanismo de parafuso (screw-home): rotação externa automática nos últimos 30° de extensão',
      'Angulação Q normal: 12-15° (mulheres) e 8-12° (homens)',
      'Rotações só possíveis com joelho fletido',
      'Patela aumenta braço de momento do quadríceps em 50%'
    ],
    functionalImportance: 'Absorve impacto, permite agachamento, subir escadas. Equilíbrio entre estabilidade sagital e rotação para marcha normal.',
    references: ['Kapandji AI. Fisiologia Articular Vol. 2. 6ª ed. 2011']
  },
  {
    id: 'tornozelo',
    name: 'Tornozelo (Talocrural)',
    category: 'membro-inferior',
    type: 'Gínglimo (Dobradiça)',
    degreesOfFreedom: 1,
    movements: [
      { name: 'Dorsiflexão', rom: '0-20°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Flexão Plantar', rom: '0-50°', plane: 'Sagital', axis: 'Transverso' }
    ],
    primeMuscles: ['Tibial Anterior', 'Gastrocnêmio', 'Sóleo', 'Fibulares', 'Tibial Posterior'],
    stabilizers: ['Ligamento Talofibular Anterior', 'Ligamento Calcaneofibular', 'Ligamento Deltoide', 'Sindesmose'],
    commonDysfunctions: ['Entorse Lateral', 'Instabilidade Crônica', 'Tendinopatia de Aquiles', 'Síndrome do Impacto Anterior'],
    clinicalRelevance: [
      'Tálus mais largo anteriormente: mais estável em dorsiflexão',
      'Dorsiflexão mínima para marcha: 10°',
      'Dorsiflexão mínima para subir escadas: 15°',
      'Gastrocnêmio biarticular: teste de Silfverskiöld'
    ],
    functionalImportance: 'Propulsão na marcha, absorção de impacto, adaptação ao terreno. Essencial para equilíbrio e locomoção.',
    references: ['Hintermann B. Biomechanics of the ankle joint complex. Foot Ankle Clin. 2003']
  },
  // COLUNA
  {
    id: 'cervical',
    name: 'Coluna Cervical',
    category: 'coluna',
    type: 'Complexo Articular (C0-C2 especializado)',
    degreesOfFreedom: 3,
    movements: [
      { name: 'Flexão', rom: '0-45°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '0-45°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Inclinação Lateral', rom: '0-45°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Rotação', rom: '0-80°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Esternocleidomastóideo', 'Escalenos', 'Trapézio Superior', 'Esplênio', 'Longuíssimo', 'Reto Anterior'],
    stabilizers: ['Ligamento Longitudinal Anterior e Posterior', 'Ligamento Nucal', 'Músculos Profundos (Multífidos, Rotadores)'],
    commonDysfunctions: ['Cervicalgia Mecânica', 'Hérnia Discal Cervical', 'Radiculopatia', 'Cefaleia Cervicogênica', 'Síndrome do Chicote'],
    clinicalRelevance: [
      'C0-C1 (atlanto-occipital): 50% da flexão/extensão cervical',
      'C1-C2 (atlanto-axial): 50% da rotação cervical',
      'Teste de rotação em flexão isola C1-C2',
      'Instabilidade cervical superior: teste de ligamento alar'
    ],
    functionalImportance: 'Posiciona a cabeça para visão, audição e equilíbrio. Protege medula cervical. Alta mobilidade para orientação espacial.',
    references: ['Bogduk N. Clinical Anatomy of the Lumbar Spine. 5th ed. 2012']
  },
  {
    id: 'lombar',
    name: 'Coluna Lombar',
    category: 'coluna',
    type: 'Articulações Facetárias (Planas)',
    degreesOfFreedom: 3,
    movements: [
      { name: 'Flexão', rom: '0-60°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Extensão', rom: '0-25°', plane: 'Sagital', axis: 'Transverso' },
      { name: 'Inclinação Lateral', rom: '0-25°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Rotação', rom: '0-5°', plane: 'Transverso', axis: 'Longitudinal' }
    ],
    primeMuscles: ['Eretor da Espinha', 'Multífidos', 'Reto Abdominal', 'Oblíquos', 'Quadrado Lombar', 'Psoas Maior'],
    stabilizers: ['Ligamento Longitudinal', 'Ligamento Amarelo', 'Ligamentos Interespinhosos', 'Fáscia Toracolombar', 'Core Profundo'],
    commonDysfunctions: ['Lombalgia Mecânica', 'Hérnia Discal', 'Estenose Espinhal', 'Espondilolistese', 'Síndrome Facetária'],
    clinicalRelevance: [
      'Maior carga compressiva da coluna: L4-L5 e L5-S1',
      'Facetas orientadas sagitalmente: favorecem flexão/extensão',
      'Pressão discal aumenta 40% sentado vs em pé',
      'Ritmo lombopélvico normal: flexão inicia na lombar'
    ],
    functionalImportance: 'Sustenta peso do tronco, transmite cargas para pelve. Estabilidade dinâmica essencial para todas as atividades.',
    references: ['McGill SM. Low Back Disorders. 3rd ed. 2016']
  },
  // COMPLEXOS ARTICULARES
  {
    id: 'escapulotoracica',
    name: 'Escapulotorácica',
    category: 'complexos',
    type: 'Articulação Funcional (Não-sinovial)',
    degreesOfFreedom: 6,
    movements: [
      { name: 'Elevação', rom: '0-12 cm', plane: 'Frontal', axis: '-' },
      { name: 'Depressão', rom: '0-3 cm', plane: 'Frontal', axis: '-' },
      { name: 'Protração', rom: '0-15 cm', plane: 'Transverso', axis: '-' },
      { name: 'Retração', rom: '0-10 cm', plane: 'Transverso', axis: '-' },
      { name: 'Rotação Superior', rom: '0-60°', plane: 'Frontal', axis: 'Anteroposterior' },
      { name: 'Rotação Inferior', rom: '0-5°', plane: 'Frontal', axis: 'Anteroposterior' }
    ],
    primeMuscles: ['Trapézio (Superior, Médio, Inferior)', 'Serrátil Anterior', 'Romboides', 'Elevador da Escápula', 'Peitoral Menor'],
    stabilizers: ['Músculos Periscapulares em sinergia', 'Manguito Rotador (estabilização dinâmica)'],
    commonDysfunctions: ['Discinesia Escapular', 'Escápula Alada', 'Síndrome SICK', 'Aderências na interface'],
    clinicalRelevance: [
      'Ritmo escapuloumeral 2:1 após 30° de abdução',
      'Rotação superior necessária para abdução completa',
      'Serrátil anterior: principal rotador superior',
      'Avaliação: teste de assistência escapular'
    ],
    functionalImportance: 'Base estável para movimento do ombro. Posiciona glenoide para manter congruência articular durante movimento do braço.',
    references: ['Kibler WB. The role of the scapula in athletic shoulder function. Am J Sports Med. 1998']
  },
  {
    id: 'pe-subtalar',
    name: 'Complexo do Pé (Subtalar)',
    category: 'complexos',
    type: 'Articulação Triplanar',
    degreesOfFreedom: 1,
    movements: [
      { name: 'Inversão/Supinação', rom: '0-30°', plane: 'Triplanar', axis: 'Oblíquo' },
      { name: 'Eversão/Pronação', rom: '0-15°', plane: 'Triplanar', axis: 'Oblíquo' }
    ],
    primeMuscles: ['Tibial Posterior', 'Tibial Anterior', 'Fibulares Longo e Curto', 'Flexores dos Dedos'],
    stabilizers: ['Ligamento Talocalcâneo Interósseo', 'Ligamento Cervical', 'Retináculo dos Flexores/Extensores'],
    commonDysfunctions: ['Pé Plano Flexível', 'Pé Cavo', 'Síndrome do Seio do Tarso', 'Coalizão Tarsal', 'Disfunção do Tibial Posterior'],
    clinicalRelevance: [
      'Eixo de Henke: 42° do plano sagital, 16° do transverso',
      'Pronação = dorsiflexão + eversão + abdução',
      'Supinação = flexão plantar + inversão + adução',
      'Influencia toda a cadeia cinética do membro inferior'
    ],
    functionalImportance: 'Adapta o pé ao terreno, absorve impacto, converte pé móvel em alavanca rígida para propulsão na marcha.',
    references: ['Root ML. Normal and Abnormal Function of the Foot. Clinical Biomechanics Corp. 1977']
  }
];

export const getBiomechanicsByCategory = (category: string) => 
  jointBiomechanics.filter(j => category === 'all' || j.category === category);

// ========== ANAMNESE E AVALIAÇÃO ==========
export interface AnamneseTopic {
  id: string;
  name: string;
  category: 'entrevista' | 'avaliacao' | 'bandeiras' | 'documentacao';
  description: string;
  keyQuestions?: string[];
  techniques?: string[];
  redFlags?: string[];
  clinicalTips: string[];
  commonMistakes: string[];
  references: string[];
}

export const anamneseTopics: AnamneseTopic[] = [
  // ENTREVISTA CLÍNICA
  {
    id: 'queixa-principal',
    name: 'Queixa Principal (QP)',
    category: 'entrevista',
    description: 'Primeiro passo da anamnese - identificar o motivo da consulta nas palavras do paciente.',
    keyQuestions: [
      'O que trouxe você aqui hoje?',
      'Qual é o seu principal problema?',
      'O que mais te incomoda no momento?',
      'Se você pudesse resolver uma coisa, qual seria?'
    ],
    clinicalTips: [
      'Registre nas palavras do paciente (entre aspas)',
      'Evite termos técnicos na QP',
      'Deve ser breve: 1-2 frases',
      'Identifique se há mais de uma queixa e priorize'
    ],
    commonMistakes: [
      'Usar terminologia médica na QP',
      'Interpretar a queixa antes de registrá-la',
      'Ignorar queixas secundárias importantes'
    ],
    references: ['Magee DJ. Orthopedic Physical Assessment. 7th ed. 2021', 'Hoppenfeld S. Physical Examination of the Spine and Extremities. 1976']
  },
  {
    id: 'historia-molestia',
    name: 'História da Moléstia Atual (HMA)',
    category: 'entrevista',
    description: 'Investigação detalhada da queixa principal - cronologia, características e fatores associados.',
    keyQuestions: [
      'Quando começou? (há quanto tempo)',
      'Como começou? (súbito, gradual, trauma)',
      'O que você estava fazendo quando começou?',
      'Está melhorando, piorando ou estável?',
      'O que melhora? O que piora?',
      'Já tratou antes? Com que resultado?',
      'Há outros sintomas associados?'
    ],
    techniques: [
      'Mnemônico OPQRST: Onset, Provocação, Qualidade, Radiação, Severidade, Tempo',
      'Mnemônico SOCRATES: Site, Onset, Character, Radiation, Association, Time, Exacerbating, Severity'
    ],
    clinicalTips: [
      'Deixe o paciente contar a história primeiro',
      'Use perguntas abertas antes de fechadas',
      'Investigue padrão temporal (manhã/noite, contínuo/intermitente)',
      'Pergunte sobre tratamentos prévios e resposta'
    ],
    commonMistakes: [
      'Interromper o paciente',
      'Fazer apenas perguntas fechadas (sim/não)',
      'Não investigar tratamentos anteriores',
      'Ignorar o contexto psicossocial'
    ],
    references: ['Petty NJ. Neuromusculoskeletal Examination and Assessment. 5th ed. 2017', 'Maitland GD. Vertebral Manipulation. 8th ed. 2013']
  },
  {
    id: 'caracterizacao-dor',
    name: 'Caracterização da Dor',
    category: 'entrevista',
    description: 'Avaliação detalhada das características da dor para direcionar diagnóstico diferencial.',
    keyQuestions: [
      'Como é a dor? (latejante, pontada, queimação, peso)',
      'A dor vai para algum outro lugar? (irradiação)',
      'De 0 a 10, quanto dói agora? No pior momento? No melhor?',
      'A dor acorda você à noite?',
      'Há dormência, formigamento ou fraqueza?',
      'A dor está relacionada com algum movimento específico?'
    ],
    techniques: [
      'EVA (Escala Visual Analógica): 0-10',
      'Mapa corporal da dor',
      'Questionário McGill de Dor',
      'Diagrama de dermátomos para dor radicular'
    ],
    clinicalTips: [
      'Dor noturna que acorda: investigar causas sistêmicas',
      'Dor em queimação/formigamento: componente neuropático',
      'Dor matinal com rigidez >30min: inflamatória',
      'Dor que piora com repouso: considerar patologia séria'
    ],
    commonMistakes: [
      'Não usar escalas padronizadas',
      'Ignorar padrão de irradiação',
      'Não investigar sintomas neurológicos associados',
      'Não perguntar sobre dor noturna'
    ],
    references: ['Melzack R. The McGill Pain Questionnaire. Pain. 1975', 'Jensen MP. The validity of visual analogue scale. Pain. 1986']
  },
  {
    id: 'historia-pregressa',
    name: 'História Patológica Pregressa',
    category: 'entrevista',
    description: 'Levantamento de condições prévias que podem influenciar o quadro atual.',
    keyQuestions: [
      'Você tem alguma doença diagnosticada?',
      'Já fez alguma cirurgia? Qual? Quando?',
      'Toma algum medicamento regularmente?',
      'Tem alergia a algum medicamento ou substância?',
      'Já teve problemas semelhantes antes?',
      'Há histórico familiar de doenças articulares/reumatológicas?'
    ],
    clinicalTips: [
      'Diabetes: compromete cicatrização e sensibilidade',
      'Hipertensão: cuidado com exercícios isométricos',
      'Osteoporose: adaptar cargas e impactos',
      'Uso de corticoides: fragilidade tecidual',
      'Anticoagulantes: evitar técnicas de fricção profunda'
    ],
    commonMistakes: [
      'Não perguntar sobre medicamentos',
      'Ignorar cirurgias prévias na região',
      'Não considerar comorbidades no plano de tratamento'
    ],
    references: ['Goodman CC. Pathology: Implications for the Physical Therapist. 5th ed. 2020']
  },
  {
    id: 'historia-social',
    name: 'História Social e Ocupacional',
    category: 'entrevista',
    description: 'Contexto de vida do paciente que influencia a condição e o tratamento.',
    keyQuestions: [
      'Qual sua profissão? O que você faz no trabalho?',
      'Pratica alguma atividade física ou esporte?',
      'Como é sua rotina diária típica?',
      'O problema afeta seu trabalho ou lazer?',
      'Quais são seus objetivos com o tratamento?',
      'Você tem apoio em casa para os exercícios?'
    ],
    clinicalTips: [
      'Identifique gestos ocupacionais repetitivos',
      'Avalie ergonomia básica do posto de trabalho',
      'Considere demandas físicas (sedentário vs trabalho braçal)',
      'Entenda expectativas e objetivos funcionais',
      'Avalie barreiras para adesão ao tratamento'
    ],
    commonMistakes: [
      'Não relacionar ocupação com a queixa',
      'Ignorar atividades de lazer e esporte',
      'Não definir objetivos funcionais claros',
      'Desconsiderar contexto psicossocial (estresse, suporte)'
    ],
    references: ['Linton SJ. A review of psychological risk factors in back and neck pain. Spine. 2000', 'WHO ICF Framework. 2001']
  },
  // AVALIAÇÃO FÍSICA
  {
    id: 'inspecao',
    name: 'Inspeção e Observação',
    category: 'avaliacao',
    description: 'Avaliação visual sistemática da postura, marcha, pele e comportamento do paciente.',
    techniques: [
      'Inspeção estática: postura em pé (anterior, posterior, lateral)',
      'Inspeção dinâmica: marcha, transferências, movimentos funcionais',
      'Observação da pele: coloração, cicatrizes, edema, atrofia',
      'Expressão facial e comportamento de dor'
    ],
    clinicalTips: [
      'Comece observando desde a sala de espera',
      'Compare bilateralmente sempre que possível',
      'Note assimetrias posturais significativas',
      'Observe padrão de marcha: fase de apoio e balanço',
      'Atrofias musculares indicam desuso prolongado'
    ],
    commonMistakes: [
      'Pular a inspeção e ir direto para palpação',
      'Não observar a marcha',
      'Ignorar achados cutâneos (cicatrizes, alterações tróficas)',
      'Não comparar bilateralmente'
    ],
    references: ['Kendall FP. Muscles: Testing and Function. 5th ed. 2005', 'Magee DJ. Orthopedic Physical Assessment. 7th ed. 2021']
  },
  {
    id: 'palpacao',
    name: 'Palpação',
    category: 'avaliacao',
    description: 'Avaliação manual de estruturas musculoesqueléticas para identificar alterações teciduais.',
    techniques: [
      'Palpação superficial: temperatura, textura, umidade',
      'Palpação profunda: tônus muscular, pontos-gatilho, crepitação',
      'Palpação óssea: proeminências, alinhamento',
      'Palpação de pulsos periféricos quando indicado'
    ],
    clinicalTips: [
      'Aqueça as mãos antes de palpar',
      'Comece pelo lado não afetado para comparação',
      'Use pressão graduada: superficial → profunda',
      'Identifique estruturas anatômicas de referência',
      'Ponto-gatilho: nódulo + dor referida característica',
      'Crepitação articular: significado varia conforme contexto'
    ],
    commonMistakes: [
      'Palpar com muita pressão inicial',
      'Não comparar bilateralmente',
      'Ignorar temperatura local (calor = inflamação)',
      'Não correlacionar achados com sintomas'
    ],
    references: ['Travell JG, Simons DG. Myofascial Pain and Dysfunction. 2nd ed. 1999', 'Hoppenfeld S. Physical Examination of the Spine. 1976']
  },
  {
    id: 'goniometria',
    name: 'Amplitude de Movimento (ADM)',
    category: 'avaliacao',
    description: 'Mensuração objetiva da mobilidade articular ativa e passiva.',
    techniques: [
      'ADM Ativa: paciente move sozinho - avalia força e coordenação',
      'ADM Passiva: terapeuta move - avalia integridade articular',
      'Goniometria: medição com goniômetro universal',
      'Inclinômetro: especialmente para coluna'
    ],
    clinicalTips: [
      'Sempre meça ativo antes de passivo',
      'Compare com lado contralateral',
      'Note a qualidade do movimento (fluido vs compensado)',
      'Sensação final (end-feel): osso, cápsula, músculo',
      'ADM passiva > ativa: sugere fraqueza ou dor',
      'ADM passiva = ativa e reduzida: restrição articular'
    ],
    commonMistakes: [
      'Não estabilizar o segmento proximal',
      'Alinhar incorretamente o goniômetro',
      'Não registrar valores objetivos',
      'Ignorar compensações durante o movimento'
    ],
    references: ['Norkin CC, White DJ. Measurement of Joint Motion. 5th ed. 2016', 'American Academy of Orthopaedic Surgeons. Joint Motion: Method of Measuring']
  },
  {
    id: 'forca-muscular',
    name: 'Teste de Força Muscular',
    category: 'avaliacao',
    description: 'Avaliação da capacidade de geração de força muscular usando escalas padronizadas.',
    techniques: [
      'Escala de Oxford (0-5): 0=nenhuma contração, 3=vence gravidade, 5=normal',
      'Teste manual de força (TMF): posicionamento padronizado',
      'Dinamometria: medição objetiva com dinamômetro',
      'Testes funcionais: agachamento, subir escada, ponte'
    ],
    clinicalTips: [
      'Grau 3 (regular) = consegue vencer a gravidade',
      'Compare sempre com lado não afetado',
      'Considere dor como fator limitante da força',
      'Fraqueza em padrão de nervo: lesão neurológica',
      'Fraqueza difusa: desuso, miopatia, dor generalizada'
    ],
    commonMistakes: [
      'Não posicionar corretamente para isolar o músculo',
      'Aplicar resistência instável',
      'Confundir incapacidade por dor com fraqueza real',
      'Não testar músculos-chave de cada miotomo'
    ],
    references: ['Kendall FP. Muscles: Testing and Function. 5th ed. 2005', 'Hislop HJ. Daniels and Worthingham Muscle Testing. 10th ed. 2018']
  },
  {
    id: 'exame-neurologico',
    name: 'Exame Neurológico Básico',
    category: 'avaliacao',
    description: 'Triagem neurológica essencial para fisioterapeutas: sensibilidade, reflexos e força.',
    techniques: [
      'Sensibilidade: toque leve, dor (picada), propriocepção',
      'Reflexos tendinosos profundos: bicipital, tricipital, patelar, aquileu',
      'Força por miotomo: raiz nervosa específica',
      'Testes de tensão neural: Lasègue, Slump, ULTT'
    ],
    clinicalTips: [
      'Dermátomos: C5 (deltóide), C6 (polegar), C7 (dedo médio), L4 (medial perna), L5 (dorso pé), S1 (lateral pé)',
      'Miotomas: C5 (deltóide), C6 (bíceps), C7 (tríceps), L3 (quadríceps), L4 (tibial anterior), S1 (gastrocnêmio)',
      'Hiporreflexia: lesão de nervo periférico ou raiz',
      'Hiperreflexia: lesão do neurônio motor superior'
    ],
    commonMistakes: [
      'Não testar sensibilidade em dermátomos específicos',
      'Técnica inadequada nos reflexos',
      'Não correlacionar achados sensitivos, motores e reflexos',
      'Ignorar sinais de comprometimento de cauda equina'
    ],
    references: ['Butler DS. The Sensitive Nervous System. 2000', 'Magee DJ. Orthopedic Physical Assessment. 7th ed. 2021']
  },
  // BANDEIRAS VERMELHAS
  {
    id: 'bandeiras-vermelhas-gerais',
    name: 'Bandeiras Vermelhas - Gerais',
    category: 'bandeiras',
    description: 'Sinais de alerta que indicam possível patologia grave necessitando encaminhamento médico.',
    redFlags: [
      'Perda de peso inexplicada (>10% em 6 meses)',
      'Febre persistente sem causa aparente',
      'Dor noturna que não alivia com repouso',
      'Dor constante, progressiva, sem relação mecânica',
      'História de câncer',
      'Uso prolongado de corticoides',
      'Trauma significativo (especialmente em idosos/osteoporose)',
      'Imunossupressão (HIV, quimioterapia)',
      'Uso de drogas intravenosas'
    ],
    clinicalTips: [
      'Sempre pergunte sobre perda de peso e febre',
      'Dor noturna + perda de peso = investigar neoplasia',
      'Trauma + idoso + corticoide = fratura por fragilidade',
      'Na dúvida, encaminhe para avaliação médica',
      'Documente os achados e sua conduta'
    ],
    commonMistakes: [
      'Não perguntar sistematicamente sobre bandeiras vermelhas',
      'Ignorar sintomas constitucionais (febre, perda de peso)',
      'Atrasar encaminhamento por incerteza'
    ],
    references: ['Greenhalgh S, Selfe J. Red Flags: A Guide to Identifying Serious Pathology. 2nd ed. 2010', 'NICE Guidelines. Low back pain and sciatica. 2016']
  },
  {
    id: 'bandeiras-coluna',
    name: 'Bandeiras Vermelhas - Coluna',
    category: 'bandeiras',
    description: 'Sinais específicos de alerta para patologias graves da coluna vertebral.',
    redFlags: [
      'Síndrome da Cauda Equina: anestesia em sela, retenção/incontinência urinária, incontinência fecal',
      'Mielopatia cervical: alteração de marcha, sinal de Babinski, clônus',
      'Fratura: trauma significativo, osteoporose conhecida, uso de corticoide',
      'Infecção: febre + dor lombar, procedimento recente, imunossupressão',
      'Neoplasia: história de câncer, dor noturna, perda de peso',
      'Aneurisma abdominal: homem >60 anos, dor abdominal pulsátil'
    ],
    clinicalTips: [
      'Cauda equina é EMERGÊNCIA CIRÚRGICA - encaminhar imediatamente',
      'Pergunte sempre sobre função vesical/intestinal em dor lombar',
      'Déficit neurológico progressivo requer avaliação urgente',
      '5 Ds da mielopatia: Dizziness, Drop attacks, Dysarthria, Dysphagia, Diplopia'
    ],
    commonMistakes: [
      'Não perguntar sobre incontinência em lombalgia',
      'Não reconhecer apresentação insidiosa de cauda equina',
      'Tratar dor cervical sem triagem de mielopatia',
      'Minimizar déficits neurológicos progressivos'
    ],
    references: ['Greenhalgh S. Red Flags II. 2010', 'Deyo RA. What can the history tell us about low back pain? JAMA. 1992']
  },
  {
    id: 'bandeiras-amarelas',
    name: 'Bandeiras Amarelas - Fatores Psicossociais',
    category: 'bandeiras',
    description: 'Fatores de risco para cronificação e incapacidade prolongada - requerem abordagem biopsicossocial.',
    redFlags: [
      'Catastrofização: pensamentos negativos exagerados sobre a dor',
      'Cinesiofobia: medo excessivo de movimento',
      'Crenças de evitação: "preciso descansar até a dor passar"',
      'Expectativas negativas sobre recuperação',
      'Ganhos secundários (afastamento, litígio)',
      'Depressão e ansiedade',
      'Insatisfação no trabalho',
      'Baixo suporte social'
    ],
    clinicalTips: [
      'Use questionários: Tampa Scale (cinesiofobia), PCS (catastrofização)',
      'Educação sobre dor é fundamental',
      'Exposição gradual ao movimento temido',
      'Abordagem colaborativa: paciente ativo no tratamento',
      'Considere encaminhamento para psicólogo quando indicado'
    ],
    commonMistakes: [
      'Ignorar fatores psicossociais',
      'Reforçar comportamentos de evitação',
      'Focar apenas em tratamentos passivos',
      'Não validar a experiência de dor do paciente'
    ],
    references: ['Linton SJ. A review of psychological risk factors. Spine. 2000', 'Nicholas MK. Psychological Risk Factors. 2011']
  },
  // DOCUMENTAÇÃO
  {
    id: 'documentacao-soap',
    name: 'Registro SOAP',
    category: 'documentacao',
    description: 'Formato padronizado para documentação clínica estruturada.',
    techniques: [
      'S (Subjetivo): queixa do paciente, história, sintomas relatados',
      'O (Objetivo): achados do exame físico, medidas, testes',
      'A (Avaliação): diagnóstico fisioterapêutico, análise dos achados',
      'P (Plano): objetivos, intervenções, frequência, prognóstico'
    ],
    clinicalTips: [
      'Subjetivo: use aspas para fala do paciente',
      'Objetivo: seja específico (ADM 120°, força 4/5)',
      'Avaliação: relacione achados com a disfunção',
      'Plano: inclua objetivos SMART',
      'Reavalie e documente progressão regularmente'
    ],
    commonMistakes: [
      'Misturar dados subjetivos com objetivos',
      'Não incluir medidas objetivas',
      'Avaliação vaga sem hipótese diagnóstica',
      'Plano sem objetivos mensuráveis'
    ],
    references: ['APTA Guide to Physical Therapist Practice. 4th ed. 2023', 'COFFITO Resolução 414/2012']
  },
  {
    id: 'objetivos-smart',
    name: 'Objetivos SMART',
    category: 'documentacao',
    description: 'Metodologia para definição de objetivos terapêuticos claros e mensuráveis.',
    techniques: [
      'S (Específico): o que exatamente será alcançado',
      'M (Mensurável): como será medido o progresso',
      'A (Alcançável): realista para o paciente',
      'R (Relevante): importante para o paciente',
      'T (Temporal): prazo definido'
    ],
    clinicalTips: [
      'Envolva o paciente na definição dos objetivos',
      'Exemplo: "Aumentar flexão de joelho de 90° para 120° em 4 semanas"',
      'Objetivos funcionais: "Subir escada sem corrimão em 6 semanas"',
      'Divida objetivos grandes em metas menores',
      'Reavalie e ajuste objetivos conforme evolução'
    ],
    commonMistakes: [
      'Objetivos vagos ("melhorar dor")',
      'Não definir prazo',
      'Objetivos não alinhados com expectativas do paciente',
      'Não revisar objetivos durante o tratamento'
    ],
    references: ['APTA Guide to Physical Therapist Practice. 4th ed. 2023', 'Doran GT. There\'s a SMART way to write goals. Management Review. 1981']
  }
];

export const getAnamneseByCategory = (category: string) =>
  anamneseTopics.filter(t => category === 'all' || t.category === category);

// Funções utilitárias
export const getRegions = () => painMapRegions.map(r => ({ id: r.id, name: r.name, icon: r.icon }));

export const getMusclesByRegion = (region: string) => keyMuscles.filter(m => m.region === region);

export const getTestsByRegion = (region: string) => orthopedicTests.filter(t => t.region === region);

export const getTreatmentsByRegion = (region: string) => initialTreatments.filter(t => t.region === region);

export const getPainMapByRegion = (regionId: string) => painMapRegions.find(r => r.id === regionId);
