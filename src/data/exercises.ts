export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  sets: string;
  reps: string;
  frequency: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
  equipment: string[];
  contraindications: string[];
  tips: string[];
}

export interface ExerciseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const exerciseCategories: ExerciseCategory[] = [
  { id: "ombro", name: "Ombro", icon: "💪", color: "from-blue-500 to-cyan-500" },
  { id: "coluna", name: "Coluna Lombar", icon: "🦴", color: "from-emerald-500 to-teal-500" },
  { id: "cervical", name: "Cervical", icon: "🧘", color: "from-violet-500 to-purple-500" },
  { id: "joelho", name: "Joelho", icon: "🦵", color: "from-orange-500 to-amber-500" },
  { id: "tornozelo", name: "Tornozelo e Pé", icon: "🦶", color: "from-rose-500 to-pink-500" },
  { id: "quadril", name: "Quadril", icon: "🏃", color: "from-indigo-500 to-blue-500" },
  { id: "mao", name: "Mão e Punho", icon: "✋", color: "from-yellow-500 to-orange-500" },
  { id: "respiratorio", name: "Respiratório", icon: "🫁", color: "from-sky-500 to-blue-500" },
];

export const exercises: Exercise[] = [
  // OMBRO
  {
    id: "ombro-pendulo",
    name: "Exercício de Pêndulo de Codman",
    category: "ombro",
    description: "Exercício de mobilização passiva para ganho de amplitude de movimento do ombro, utilizando a gravidade para promover movimento suave da articulação.",
    instructions: [
      "Apoie-se em uma mesa ou cadeira com o braço não afetado",
      "Incline o tronco para frente, deixando o braço afetado pendente",
      "Realize movimentos circulares pequenos no sentido horário",
      "Repita no sentido anti-horário",
      "Pode-se adicionar movimentos de frente/trás e lado/lado"
    ],
    sets: "3 séries",
    reps: "10 círculos cada direção",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Mesa ou cadeira para apoio"],
    contraindications: [
      "Fratura não consolidada",
      "Luxação aguda do ombro",
      "Infecção local"
    ],
    tips: [
      "Mantenha o braço relaxado durante todo o movimento",
      "Não force amplitude além do confortável",
      "O movimento deve ser indolor"
    ]
  },
  {
    id: "ombro-isometrico-re",
    name: "Isométrico de Rotadores Externos",
    category: "ombro",
    description: "Fortalecimento isométrico dos músculos rotadores externos do ombro (infraespinal e redondo menor), essencial para estabilidade glenoumeral.",
    instructions: [
      "Fique de lado próximo a uma parede ou batente de porta",
      "Cotovelo flexionado a 90°, junto ao corpo",
      "Pressione o dorso da mão contra a parede",
      "Mantenha a contração por 5-10 segundos",
      "Relaxe e repita"
    ],
    sets: "3 séries",
    reps: "10 repetições de 5-10 segundos",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Parede ou batente de porta"],
    contraindications: [
      "Lesão aguda do manguito rotador",
      "Dor intensa durante a contração",
      "Pós-operatório imediato"
    ],
    tips: [
      "Comece com intensidade leve e progrida gradualmente",
      "Mantenha os ombros relaxados, não eleve",
      "Respire normalmente durante a contração"
    ]
  },
  {
    id: "ombro-flexao-ativa",
    name: "Flexão Ativa Assistida com Bastão",
    category: "ombro",
    description: "Exercício de mobilização ativa-assistida para ganho de amplitude de flexão do ombro, usando um bastão para auxiliar o movimento.",
    instructions: [
      "Deite-se de costas segurando um bastão com ambas as mãos",
      "Braços estendidos, mãos na largura dos ombros",
      "Use o braço saudável para ajudar a elevar o braço afetado",
      "Eleve até o limite confortável, segure 2-3 segundos",
      "Retorne lentamente à posição inicial"
    ],
    sets: "3 séries",
    reps: "15 repetições",
    frequency: "2x ao dia",
    difficulty: "iniciante",
    equipment: ["Bastão ou cabo de vassoura"],
    contraindications: [
      "Instabilidade glenoumeral severa",
      "Dor aguda durante o movimento"
    ],
    tips: [
      "Movimento deve ser lento e controlado",
      "Não force além do limite de dor",
      "Progrida a amplitude gradualmente"
    ]
  },
  {
    id: "ombro-rotacao-externa-faixa",
    name: "Rotação Externa com Faixa Elástica",
    category: "ombro",
    description: "Fortalecimento dos rotadores externos do ombro com resistência elástica progressiva.",
    instructions: [
      "Prenda a faixa elástica em uma maçaneta ou objeto fixo",
      "Segure a faixa com a mão do lado afetado",
      "Cotovelo flexionado a 90°, junto ao corpo",
      "Rode o antebraço para fora, afastando da linha média",
      "Retorne lentamente controlando o movimento"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Faixa elástica", "Toalha pequena (opcional para apoio)"],
    contraindications: [
      "Lesão aguda do manguito",
      "Tendinopatia em fase inflamatória aguda"
    ],
    tips: [
      "Use uma toalha enrolada entre o cotovelo e o corpo",
      "Controle tanto a ida quanto a volta",
      "Progrida a resistência da faixa gradualmente"
    ]
  },

  // OMBRO - MAIS EXERCÍCIOS
  {
    id: "ombro-crucifixo-inverso",
    name: "Crucifixo Inverso com Faixa",
    category: "ombro",
    description: "Fortalecimento dos músculos posteriores do ombro (deltóide posterior, romboides) para correção postural.",
    instructions: [
      "Em pé, segure a faixa elástica à frente com braços estendidos",
      "Abra os braços lateralmente, puxando a faixa",
      "Junte as escápulas no final do movimento",
      "Retorne controladamente à posição inicial",
      "Mantenha os cotovelos levemente flexionados"
    ],
    sets: "3 séries",
    reps: "15 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Faixa elástica"],
    contraindications: [
      "Lesão do manguito rotador aguda",
      "Dor escapular intensa"
    ],
    tips: [
      "Foque em juntar as escápulas",
      "Não eleve os ombros",
      "Excelente para postura de escritório"
    ]
  },
  {
    id: "ombro-elevacao-lateral",
    name: "Elevação Lateral com Halteres",
    category: "ombro",
    description: "Fortalecimento do deltóide médio para definição e estabilidade do ombro.",
    instructions: [
      "Em pé, halteres ao lado do corpo",
      "Cotovelos levemente flexionados",
      "Eleve os braços lateralmente até altura dos ombros",
      "Palmas voltadas para o chão no topo",
      "Desça controladamente"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Halteres leves (1-3kg)"],
    contraindications: [
      "Síndrome do impacto",
      "Bursite subacromial aguda"
    ],
    tips: [
      "Não eleve acima de 90°",
      "Polegares levemente para cima reduz impacto",
      "Peso leve com boa técnica"
    ]
  },
  {
    id: "ombro-rotacao-interna-faixa",
    name: "Rotação Interna com Faixa Elástica",
    category: "ombro",
    description: "Fortalecimento dos rotadores internos do ombro (subescapular) com resistência elástica.",
    instructions: [
      "Prenda a faixa em uma maçaneta ou objeto fixo",
      "Cotovelo a 90°, junto ao corpo",
      "Puxe a faixa rodando o antebraço para dentro",
      "Mantenha o cotovelo fixo ao lado do corpo",
      "Retorne lentamente"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Faixa elástica"],
    contraindications: [
      "Instabilidade anterior do ombro",
      "Pós-operatório de Bankart"
    ],
    tips: [
      "Equilibre com exercício de rotação externa",
      "Use toalha entre cotovelo e corpo",
      "Controle a fase excêntrica"
    ]
  },
  {
    id: "ombro-sleeper-stretch",
    name: "Sleeper Stretch (Alongamento do Dorminhoco)",
    category: "ombro",
    description: "Alongamento da cápsula posterior do ombro, importante para atletas de arremesso e ombro rígido.",
    instructions: [
      "Deite sobre o lado afetado",
      "Ombro e cotovelo a 90°",
      "Com a outra mão, pressione o punho em direção ao chão",
      "Rode internamente o ombro",
      "Mantenha 30 segundos, sem dor"
    ],
    sets: "3 repetições",
    reps: "30 segundos",
    frequency: "2x ao dia",
    difficulty: "intermediário",
    equipment: ["Nenhum"],
    contraindications: [
      "Instabilidade posterior",
      "Lesão SLAP"
    ],
    tips: [
      "Pressão suave e progressiva",
      "Não deve causar dor",
      "Ideal para GIRD em atletas"
    ]
  },
  {
    id: "ombro-wall-angels",
    name: "Wall Angels (Anjos na Parede)",
    category: "ombro",
    description: "Exercício de mobilidade e ativação escapular contra a parede.",
    instructions: [
      "Costas e cabeça encostadas na parede",
      "Braços em 'W' (cotovelos 90°) contra a parede",
      "Deslize os braços para cima formando 'Y'",
      "Mantenha costas das mãos na parede",
      "Retorne ao 'W' e repita"
    ],
    sets: "2-3 séries",
    reps: "10-12 repetições",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Parede"],
    contraindications: [
      "Capsulite adesiva com limitação severa",
      "Dor durante o movimento"
    ],
    tips: [
      "Mantenha lombar neutra na parede",
      "Se não conseguir encostar, trabalhe a mobilidade",
      "Ótimo aquecimento para treinos"
    ]
  },

  // COLUNA LOMBAR
  {
    id: "coluna-cat-cow",
    name: "Gato e Camelo (Cat-Cow)",
    category: "coluna",
    description: "Exercício de mobilização da coluna vertebral que promove flexibilidade e alívio de tensão na região lombar e torácica.",
    instructions: [
      "Posição de quatro apoios (mãos e joelhos no chão)",
      "Mãos alinhadas com os ombros, joelhos com os quadris",
      "Inspire arqueando as costas para baixo (extensão), olhe para cima",
      "Expire arredondando as costas para cima (flexão), queixo no peito",
      "Alterne os movimentos de forma fluida"
    ],
    sets: "2-3 séries",
    reps: "10-15 repetições de cada movimento",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Colchonete ou tapete"],
    contraindications: [
      "Hérnia discal em fase aguda",
      "Espondilolistese instável",
      "Fratura vertebral recente"
    ],
    tips: [
      "Movimentos lentos e coordenados com a respiração",
      "Não force amplitude extrema",
      "Excelente para aquecimento"
    ]
  },
  {
    id: "coluna-ponte",
    name: "Ponte Glútea",
    category: "coluna",
    description: "Fortalecimento de glúteos e estabilizadores lombares, fundamental para suporte da coluna e prevenção de lombalgias.",
    instructions: [
      "Deite de costas, joelhos flexionados, pés apoiados no chão",
      "Braços ao lado do corpo, palmas para baixo",
      "Contraia glúteos e abdômen, elevando o quadril",
      "Forme uma linha reta dos ombros aos joelhos",
      "Segure 3-5 segundos e desça controladamente"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Dor lombar aguda que piora com extensão",
      "Ciatalgia em fase aguda"
    ],
    tips: [
      "Evite hiperextender a coluna no topo",
      "Mantenha abdômen contraído durante todo movimento",
      "Pode progredir para ponte unilateral"
    ]
  },
  {
    id: "coluna-bird-dog",
    name: "Bird Dog (Cachorro-Pássaro)",
    category: "coluna",
    description: "Exercício de estabilização do core que trabalha coordenação, equilíbrio e fortalecimento dos músculos paravertebrais.",
    instructions: [
      "Posição de quatro apoios com coluna neutra",
      "Contraia o abdômen mantendo a coluna estável",
      "Estenda simultaneamente braço direito e perna esquerda",
      "Mantenha alinhados com o tronco por 3-5 segundos",
      "Retorne e alterne para o outro lado"
    ],
    sets: "3 séries",
    reps: "10 repetições cada lado",
    frequency: "Diariamente",
    difficulty: "intermediário",
    equipment: ["Colchonete"],
    contraindications: [
      "Dor lombar que piora com a posição",
      "Incapacidade de manter estabilidade"
    ],
    tips: [
      "Mantenha quadris nivelados, sem rotação",
      "Não deixe a lombar afundar",
      "Olhe para o chão, pescoço neutro"
    ]
  },
  {
    id: "coluna-flexao-williams",
    name: "Flexão de Williams (Joelhos ao Peito)",
    category: "coluna",
    description: "Alongamento dos extensores lombares e abertura dos forames intervertebrais, útil para alívio de compressões.",
    instructions: [
      "Deite de costas em superfície firme",
      "Flexione ambos os joelhos em direção ao peito",
      "Abrace os joelhos com as mãos",
      "Mantenha a posição por 20-30 segundos",
      "Pode realizar pequenos movimentos de balanço lateral"
    ],
    sets: "3-5 repetições",
    reps: "20-30 segundos cada",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Hérnia discal com piora em flexão",
      "Estenose do canal em alguns casos"
    ],
    tips: [
      "Respiração profunda durante o alongamento",
      "Não puxe com força excessiva",
      "Ideal para fazer ao acordar"
    ]
  },

  // COLUNA - MAIS EXERCÍCIOS
  {
    id: "coluna-dead-bug",
    name: "Dead Bug (Inseto Morto)",
    category: "coluna",
    description: "Exercício de estabilização do core com dissociação de membros, excelente para lombalgia.",
    instructions: [
      "Deite de costas, joelhos e quadris a 90°",
      "Braços estendidos em direção ao teto",
      "Pressione a lombar no chão (ative o core)",
      "Estenda braço direito para trás e perna esquerda para frente",
      "Retorne e alterne os lados"
    ],
    sets: "3 séries",
    reps: "10-12 repetições cada lado",
    frequency: "Diariamente",
    difficulty: "intermediário",
    equipment: ["Colchonete"],
    contraindications: [
      "Hérnia discal com piora ao deitar",
      "Diastase abdominal importante"
    ],
    tips: [
      "Lombar SEMPRE pressionada no chão",
      "Movimento lento e controlado",
      "Se perder a lombar, reduza amplitude"
    ]
  },
  {
    id: "coluna-prancha-frontal",
    name: "Prancha Frontal (Plank)",
    category: "coluna",
    description: "Exercício isométrico para fortalecimento global do core e estabilização da coluna.",
    instructions: [
      "Apoie antebraços e pontas dos pés no chão",
      "Corpo em linha reta dos ombros aos calcanhares",
      "Contraia abdômen e glúteos",
      "Não deixe o quadril subir ou descer",
      "Mantenha o tempo determinado"
    ],
    sets: "3 séries",
    reps: "20-60 segundos",
    frequency: "Diariamente",
    difficulty: "intermediário",
    equipment: ["Colchonete"],
    contraindications: [
      "Dor lombar que piora na posição",
      "Pressão alta não controlada"
    ],
    tips: [
      "Comece com tempos curtos e progrida",
      "Olhe para o chão, pescoço neutro",
      "Pode começar de joelhos"
    ]
  },
  {
    id: "coluna-prancha-lateral",
    name: "Prancha Lateral (Side Plank)",
    category: "coluna",
    description: "Fortalecimento dos estabilizadores laterais do tronco (quadrado lombar, oblíquos).",
    instructions: [
      "Deite de lado apoiando no antebraço",
      "Pés empilhados ou um à frente do outro",
      "Eleve o quadril formando linha reta",
      "Braço livre no quadril ou estendido para cima",
      "Mantenha e desça controladamente"
    ],
    sets: "3 séries cada lado",
    reps: "20-45 segundos",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Colchonete"],
    contraindications: [
      "Escoliose severa",
      "Lesão do ombro de apoio"
    ],
    tips: [
      "Pode começar com joelhos apoiados",
      "Quadril não deve cair para frente ou trás",
      "Importante para assimetrias"
    ]
  },
  {
    id: "coluna-extensao-mckenzie",
    name: "Extensão de McKenzie (Press Up)",
    category: "coluna",
    description: "Exercício de extensão lombar em decúbito ventral, usado no método McKenzie para centralização de dor.",
    instructions: [
      "Deite de bruços, mãos sob os ombros",
      "Relaxe completamente a lombar e glúteos",
      "Empurre o tronco para cima, estendendo os cotovelos",
      "Mantenha o quadril no chão",
      "Retorne lentamente e repita"
    ],
    sets: "10 repetições",
    reps: "A cada 2 horas se indicado",
    frequency: "Várias vezes ao dia",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Estenose central",
      "Espondilolistese",
      "Dor que irradia para a perna com extensão"
    ],
    tips: [
      "Observe se a dor centraliza (sinal positivo)",
      "Se a dor aumentar ou irradiar mais, pare",
      "Consulte fisioterapeuta para avaliação"
    ]
  },
  {
    id: "coluna-rotacao-tronco",
    name: "Rotação de Tronco Deitado",
    category: "coluna",
    description: "Mobilização rotacional da coluna lombar e torácica em posição de baixa carga.",
    instructions: [
      "Deite de costas, joelhos flexionados juntos",
      "Braços abertos em cruz",
      "Deixe os joelhos caírem para um lado",
      "Mantenha os ombros no chão",
      "Segure 20-30 segundos e troque de lado"
    ],
    sets: "3 repetições cada lado",
    reps: "20-30 segundos",
    frequency: "2x ao dia",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Hérnia discal aguda",
      "Dor que irradia com rotação"
    ],
    tips: [
      "Movimento relaxado, não force",
      "Ótimo para fazer ao acordar",
      "Respire profundamente na posição"
    ]
  },

  // CERVICAL
  {
    id: "cervical-retracao",
    name: "Retração Cervical (Chin Tuck)",
    category: "cervical",
    description: "Exercício para fortalecimento dos flexores profundos do pescoço e correção postural da anteriorização da cabeça.",
    instructions: [
      "Sente-se ou fique em pé com postura ereta",
      "Olhe para frente, ombros relaxados",
      "Puxe o queixo para trás, como fazendo 'papada'",
      "Mantenha o olhar horizontal (não incline)",
      "Segure 5-10 segundos e relaxe"
    ],
    sets: "3 séries",
    reps: "10-15 repetições",
    frequency: "Várias vezes ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Vertigem associada ao movimento",
      "Artrose cervical severa com dor"
    ],
    tips: [
      "Imagine um fio puxando o topo da cabeça para cima",
      "Pode usar a parede como referência",
      "Ideal para quem trabalha no computador"
    ]
  },
  {
    id: "cervical-alongamento-trapezio",
    name: "Alongamento do Trapézio Superior",
    category: "cervical",
    description: "Alongamento do músculo trapézio superior, frequentemente tensionado em pacientes com cervicalgia e cefaleia tensional.",
    instructions: [
      "Sente-se ereto, segure a lateral da cadeira com uma mão",
      "Incline a cabeça para o lado oposto",
      "Com a outra mão, aplique leve pressão na lateral da cabeça",
      "Sinta o alongamento na lateral do pescoço",
      "Mantenha 20-30 segundos e troque de lado"
    ],
    sets: "3 repetições",
    reps: "20-30 segundos cada lado",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Cadeira"],
    contraindications: [
      "Hérnia cervical com sintomas radiculares",
      "Vertigem posicional"
    ],
    tips: [
      "Mantenha os ombros baixos e relaxados",
      "Pressão suave, nunca forçada",
      "Respire profundamente durante o alongamento"
    ]
  },
  {
    id: "cervical-isometrico-flexao",
    name: "Isométrico Cervical em Flexão",
    category: "cervical",
    description: "Fortalecimento isométrico dos músculos flexores cervicais para melhor suporte e estabilidade do pescoço.",
    instructions: [
      "Sente-se ou fique em pé com postura ereta",
      "Coloque a palma da mão na testa",
      "Pressione a cabeça contra a mão sem movimento",
      "Mantenha a contração por 5-10 segundos",
      "Relaxe e repita"
    ],
    sets: "3 séries",
    reps: "10 repetições",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Dor aguda intensa",
      "Instabilidade cervical"
    ],
    tips: [
      "Comece com força leve, progrida gradualmente",
      "Pode fazer nas 4 direções (flexão, extensão, laterais)",
      "Respire normalmente"
    ]
  },

  // CERVICAL - MAIS EXERCÍCIOS
  {
    id: "cervical-levator-alongamento",
    name: "Alongamento do Elevador da Escápula",
    category: "cervical",
    description: "Alongamento do músculo elevador da escápula, frequentemente tenso em dor cervical e cefaleia.",
    instructions: [
      "Sente-se ereto, segure a lateral da cadeira",
      "Rode a cabeça 45° para o lado oposto",
      "Incline a cabeça para frente, olhando para a axila",
      "Com a outra mão, aplique leve pressão na nuca",
      "Sinta o alongamento na lateral posterior do pescoço"
    ],
    sets: "3 repetições",
    reps: "30 segundos cada lado",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Cadeira"],
    contraindications: [
      "Vertigem com flexão cervical",
      "Radiculopatia cervical"
    ],
    tips: [
      "Pressão suave na nuca",
      "Ombro oposto relaxado e baixo",
      "Muito efetivo para tensão no pescoço"
    ]
  },
  {
    id: "cervical-scapular-squeeze",
    name: "Retração Escapular (Squeeze)",
    category: "cervical",
    description: "Fortalecimento dos retratores escapulares para correção de postura cifótica.",
    instructions: [
      "Sentado ou em pé com postura ereta",
      "Braços relaxados ao lado do corpo",
      "Junte as escápulas apertando-as para trás",
      "Imagine segurar um lápis entre elas",
      "Mantenha 5-10 segundos e relaxe"
    ],
    sets: "3 séries",
    reps: "15 repetições",
    frequency: "Várias vezes ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Raramente contraindicado"
    ],
    tips: [
      "Não eleve os ombros, apenas junte as escápulas",
      "Ideal para pausas no computador",
      "Combine com chin tuck"
    ]
  },
  {
    id: "cervical-flexao-resistida",
    name: "Flexão Cervical com Toalha",
    category: "cervical",
    description: "Fortalecimento dos flexores cervicais profundos com resistência de toalha.",
    instructions: [
      "Deite de costas, joelhos flexionados",
      "Passe uma toalha atrás da cabeça, segure as pontas",
      "Faça o chin tuck (queixo para dentro)",
      "Levante levemente a cabeça do chão (poucos centímetros)",
      "Mantenha 5-10 segundos e desça"
    ],
    sets: "2-3 séries",
    reps: "10-12 repetições",
    frequency: "Diariamente",
    difficulty: "intermediário",
    equipment: ["Toalha"],
    contraindications: [
      "Mielopatia cervical",
      "Vertigem cervicogênica"
    ],
    tips: [
      "Não puxe com a toalha, ela é só suporte",
      "Movimento muito sutil",
      "Foco na musculatura profunda"
    ]
  },
  {
    id: "cervical-snag",
    name: "Auto-SNAG Cervical",
    category: "cervical",
    description: "Técnica de mobilização articular cervical com movimento ativo.",
    instructions: [
      "Sentado, coloque uma toalha na base do crânio",
      "Cruze as pontas da toalha na frente",
      "Puxe a toalha para frente e para cima",
      "Enquanto puxa, mova a cabeça no sentido doloroso",
      "O movimento deve ficar indolor com a técnica"
    ],
    sets: "6-10 repetições",
    reps: "Por sessão",
    frequency: "2-3x ao dia se alivia",
    difficulty: "avançado",
    equipment: ["Toalha"],
    contraindications: [
      "Instabilidade cervical",
      "Artéria vertebral comprometida",
      "Dor que não alivia com técnica"
    ],
    tips: [
      "Aprenda com fisioterapeuta primeiro",
      "Deve haver alívio imediato",
      "Se piora, não é a técnica correta"
    ]
  },

  // JOELHO
  {
    id: "joelho-quad-isometrico",
    name: "Isométrico de Quadríceps",
    category: "joelho",
    description: "Fortalecimento isométrico do quadríceps sem movimentação articular, ideal para fases iniciais de reabilitação do joelho.",
    instructions: [
      "Deite de costas com a perna estendida",
      "Coloque uma toalha enrolada sob o joelho",
      "Pressione o joelho contra a toalha, contraindo o quadríceps",
      "Observe a patela subir com a contração",
      "Mantenha 5-10 segundos e relaxe"
    ],
    sets: "3 séries",
    reps: "15-20 repetições",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Toalha enrolada"],
    contraindications: [
      "Pós-operatório imediato (verificar protocolo)",
      "Derrame articular importante"
    ],
    tips: [
      "Foque na contração do vasto medial",
      "Pode progredir para elevação da perna estendida",
      "Fundamental antes de exercícios dinâmicos"
    ]
  },
  {
    id: "joelho-elevacao-perna-estendida",
    name: "Elevação da Perna Estendida (SLR)",
    category: "joelho",
    description: "Fortalecimento de quadríceps e flexores do quadril com a perna estendida, minimizando estresse articular.",
    instructions: [
      "Deite de costas, uma perna flexionada e outra estendida",
      "Contraia o quadríceps da perna estendida",
      "Mantenha o joelho em extensão, eleve a perna 30-45°",
      "Segure 3 segundos no alto",
      "Desça controladamente"
    ],
    sets: "3 séries",
    reps: "15 repetições cada perna",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Ciatalgia que piora com o movimento",
      "Dor lombar que irradia"
    ],
    tips: [
      "Mantenha a lombar pressionada no chão",
      "Pode progredir com caneleira",
      "Realize também nas posições lateral e prona"
    ]
  },
  {
    id: "joelho-agachamento-parede",
    name: "Agachamento na Parede (Wall Sit)",
    category: "joelho",
    description: "Fortalecimento isométrico de quadríceps e glúteos em cadeia cinética fechada, seguro para articulação do joelho.",
    instructions: [
      "Apoie as costas na parede, pés afastados da parede",
      "Deslize até as coxas ficarem paralelas ao chão (ou menos)",
      "Joelhos alinhados com os pés, não ultrapassando os dedos",
      "Mantenha a posição pelo tempo determinado",
      "Deslize de volta para cima para descansar"
    ],
    sets: "3 séries",
    reps: "30-60 segundos",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Parede"],
    contraindications: [
      "Síndrome patelofemoral em fase aguda",
      "Lesão meniscal com bloqueio"
    ],
    tips: [
      "Comece com menos flexão e progrida",
      "Mantenha o peso nos calcanhares",
      "Pode variar ângulos de flexão"
    ]
  },
  {
    id: "joelho-step-lateral",
    name: "Step Lateral com Mini Band",
    category: "joelho",
    description: "Fortalecimento de abdutores do quadril e estabilizadores laterais, importante para alinhamento do joelho.",
    instructions: [
      "Coloque mini band acima dos joelhos ou tornozelos",
      "Posição de semi-agachamento, pés paralelos",
      "Dê passos laterais mantendo tensão na faixa",
      "10 passos para um lado, depois retorne",
      "Mantenha joelhos alinhados, não deixe ceder para dentro"
    ],
    sets: "3 séries",
    reps: "10 passos cada direção",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Mini band elástica"],
    contraindications: [
      "Dor aguda no joelho durante o exercício",
      "Lesão ligamentar recente"
    ],
    tips: [
      "Mantenha o tronco ereto",
      "Passos pequenos e controlados",
      "Foco na ativação do glúteo médio"
    ]
  },

  // JOELHO - MAIS EXERCÍCIOS
  {
    id: "joelho-terminal-extensao",
    name: "Extensão Terminal de Joelho",
    category: "joelho",
    description: "Fortalecimento do vasto medial nos últimos graus de extensão do joelho.",
    instructions: [
      "Sentado na borda de uma cadeira ou maca",
      "Coloque uma faixa elástica na perna da cadeira e no tornozelo",
      "Joelho flexionado a 30-40°",
      "Estenda completamente o joelho contra a resistência",
      "Segure 3 segundos na extensão completa"
    ],
    sets: "3 séries",
    reps: "15 repetições",
    frequency: "Diariamente",
    difficulty: "intermediário",
    equipment: ["Faixa elástica", "Cadeira ou maca"],
    contraindications: [
      "Dor patelofemoral que piora com extensão",
      "Pós-operatório de LCA (seguir protocolo)"
    ],
    tips: [
      "Foco nos últimos 30° de extensão",
      "Sinta a contração do vasto medial",
      "Fundamental para síndrome patelofemoral"
    ]
  },
  {
    id: "joelho-mini-agachamento",
    name: "Mini Agachamento Funcional",
    category: "joelho",
    description: "Fortalecimento de quadríceps e glúteos em cadeia fechada com amplitude controlada.",
    instructions: [
      "Em pé, pés na largura do quadril",
      "Pode segurar em uma cadeira para equilíbrio",
      "Flexione os joelhos até 45-60° (1/4 de agachamento)",
      "Mantenha joelhos alinhados com os pés",
      "Retorne à posição inicial"
    ],
    sets: "3 séries",
    reps: "15-20 repetições",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Cadeira para apoio (opcional)"],
    contraindications: [
      "Dor anterior do joelho que piora",
      "Derrame articular"
    ],
    tips: [
      "Peso nos calcanhares",
      "Não deixe os joelhos passar dos dedos",
      "Progrida amplitude gradualmente"
    ]
  },
  {
    id: "joelho-leg-curl-deitado",
    name: "Flexão de Joelho em Prono",
    category: "joelho",
    description: "Fortalecimento dos isquiotibiais em posição deitada.",
    instructions: [
      "Deite de bruços, pernas estendidas",
      "Pode colocar caneleira no tornozelo",
      "Flexione o joelho trazendo calcanhar ao glúteo",
      "Mantenha quadril no chão",
      "Desça controladamente"
    ],
    sets: "3 séries",
    reps: "15 repetições cada perna",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Caneleira (opcional)", "Colchonete"],
    contraindications: [
      "Câimbra frequente em isquiotibiais",
      "Lesão muscular recente"
    ],
    tips: [
      "Não eleve o quadril do chão",
      "Movimento controlado em toda amplitude",
      "Importante para equilíbrio quad/isquios"
    ]
  },
  {
    id: "joelho-step-up",
    name: "Subida no Degrau (Step Up)",
    category: "joelho",
    description: "Exercício funcional de fortalecimento em cadeia fechada simulando subir escadas.",
    instructions: [
      "Em frente a um degrau ou step (10-20cm)",
      "Coloque o pé inteiro no degrau",
      "Suba estendendo o joelho e quadril",
      "Desça controladamente com a mesma perna",
      "Complete todas as repetições antes de trocar"
    ],
    sets: "3 séries",
    reps: "12-15 repetições cada perna",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Degrau ou step"],
    contraindications: [
      "Instabilidade severa do joelho",
      "Risco de queda"
    ],
    tips: [
      "Tronco ereto, não incline para frente",
      "Comece com degrau baixo",
      "Progrida altura conforme força aumenta"
    ]
  },
  {
    id: "joelho-alongamento-quad",
    name: "Alongamento do Quadríceps em Pé",
    category: "joelho",
    description: "Alongamento do reto femoral e quadríceps em posição funcional.",
    instructions: [
      "Em pé, apoie-se em uma parede ou cadeira",
      "Flexione o joelho, segure o tornozelo com a mão",
      "Puxe o calcanhar em direção ao glúteo",
      "Mantenha os joelhos próximos",
      "Segure 30 segundos e troque de lado"
    ],
    sets: "3 repetições",
    reps: "30 segundos cada lado",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Parede ou cadeira para apoio"],
    contraindications: [
      "Lesão meniscal com bloqueio",
      "Dor patelofemoral severa com flexão"
    ],
    tips: [
      "Mantenha o tronco ereto",
      "Não compense arqueando a lombar",
      "Pode fazer deitado de lado também"
    ]
  },

  // TORNOZELO E PÉ
  {
    id: "tornozelo-alfabeto",
    name: "Alfabeto com o Tornozelo",
    category: "tornozelo",
    description: "Exercício de mobilização ativa do tornozelo em todas as direções, usando movimentos de escrita para trabalhar amplitude completa.",
    instructions: [
      "Sente-se com a perna elevada ou cruzada",
      "Use o dedão do pé como ponteiro",
      "Desenhe as letras do alfabeto no ar",
      "Movimentos amplos e controlados",
      "Complete todo o alfabeto (A-Z)"
    ],
    sets: "1-2 séries",
    reps: "Alfabeto completo",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Fratura não consolidada",
      "Luxação recente"
    ],
    tips: [
      "Movimento deve partir do tornozelo, não do joelho",
      "Ideal para pós-entorse após fase aguda",
      "Pode fazer sentado no trabalho"
    ]
  },
  {
    id: "tornozelo-propriocepcao-unipodal",
    name: "Equilíbrio Unipodal Progressivo",
    category: "tornozelo",
    description: "Treino de propriocepção e equilíbrio em apoio unilateral, com progressões para desafiar o sistema sensório-motor.",
    instructions: [
      "Fique em pé apoiado em uma perna",
      "Mantenha joelho levemente flexionado",
      "Olhe para frente, braços livres para equilíbrio",
      "Mantenha 30 segundos, depois troque de perna",
      "Progressão: olhos fechados, superfície instável"
    ],
    sets: "3 repetições",
    reps: "30-60 segundos cada perna",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Opcional: almofada de equilíbrio"],
    contraindications: [
      "Risco de queda sem supervisão",
      "Lesão aguda com instabilidade"
    ],
    tips: [
      "Fique próximo a uma parede para segurança",
      "Progrida: olhos fechados → superfície instável → ambos",
      "Fundamental na prevenção de entorses recorrentes"
    ]
  },
  {
    id: "tornozelo-panturrilha",
    name: "Elevação de Panturrilha (Bilateral/Unilateral)",
    category: "tornozelo",
    description: "Fortalecimento dos músculos gastrocnêmio e sóleo, essenciais para propulsão na marcha e estabilidade do tornozelo.",
    instructions: [
      "Fique em pé com os pés na largura do quadril",
      "Segure em uma parede ou cadeira para equilíbrio",
      "Eleve os calcanhares ficando na ponta dos pés",
      "Segure 2-3 segundos no topo",
      "Desça lentamente até o calcanhar tocar o chão"
    ],
    sets: "3 séries",
    reps: "15-20 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Degrau (opcional para maior amplitude)"],
    contraindications: [
      "Tendinopatia de Aquiles em fase inflamatória aguda",
      "Fascite plantar com dor intensa"
    ],
    tips: [
      "Progrida para unilateral quando confortável",
      "Pode fazer excêntrico no degrau para Aquiles",
      "Trabalhe também com joelhos flexionados (sóleo)"
    ]
  },

  // TORNOZELO - MAIS EXERCÍCIOS
  {
    id: "tornozelo-dorsiflexao-faixa",
    name: "Dorsiflexão com Faixa Elástica",
    category: "tornozelo",
    description: "Fortalecimento dos dorsiflexores do tornozelo (tibial anterior).",
    instructions: [
      "Sentado, perna estendida à frente",
      "Passe a faixa elástica ao redor do pé",
      "Segure as pontas da faixa",
      "Puxe o pé para cima contra a resistência",
      "Retorne controladamente"
    ],
    sets: "3 séries",
    reps: "15-20 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Faixa elástica"],
    contraindications: [
      "Fratura não consolidada",
      "Síndrome compartimental"
    ],
    tips: [
      "Movimento apenas do tornozelo",
      "Fortalece para prevenção de 'pé caído'",
      "Importante após entorses"
    ]
  },
  {
    id: "tornozelo-eversao-inversao",
    name: "Eversão e Inversão com Faixa",
    category: "tornozelo",
    description: "Fortalecimento dos estabilizadores laterais e mediais do tornozelo.",
    instructions: [
      "Sentado, pé no chão",
      "Prenda a faixa em um objeto fixo lateral",
      "Eversão: puxe o pé para fora contra a faixa",
      "Inversão: puxe o pé para dentro contra a faixa",
      "Faça séries separadas para cada direção"
    ],
    sets: "3 séries de cada",
    reps: "15 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Faixa elástica"],
    contraindications: [
      "Entorse aguda",
      "Instabilidade severa"
    ],
    tips: [
      "Fundamental para prevenir entorses recorrentes",
      "Movimento apenas do pé, não da perna",
      "Progrida para exercícios em pé"
    ]
  },
  {
    id: "tornozelo-alongamento-panturrilha-degrau",
    name: "Alongamento de Panturrilha no Degrau",
    category: "tornozelo",
    description: "Alongamento profundo do gastrocnêmio e sóleo usando um degrau.",
    instructions: [
      "Em pé no degrau, calcanhares para fora da borda",
      "Segure em um apoio para equilíbrio",
      "Deixe os calcanhares caírem abaixo do nível do degrau",
      "Sinta o alongamento na panturrilha",
      "Mantenha 30 segundos"
    ],
    sets: "3 repetições",
    reps: "30 segundos",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Degrau", "Corrimão ou parede"],
    contraindications: [
      "Ruptura do tendão de Aquiles",
      "Tendinopatia aguda muito dolorosa"
    ],
    tips: [
      "Joelho estendido alonga gastrocnêmio",
      "Joelho flexionado alonga sóleo",
      "Faça ambas as versões"
    ]
  },
  {
    id: "tornozelo-exercicio-toalha",
    name: "Exercício da Toalha (Towel Scrunches)",
    category: "tornozelo",
    description: "Fortalecimento dos músculos intrínsecos do pé usando movimentos de preensão.",
    instructions: [
      "Sentado, pé descalço sobre uma toalha no chão",
      "Use os dedos para 'amassar' a toalha em sua direção",
      "Puxe a toalha inteira usando apenas os dedos",
      "Estenda a toalha e repita",
      "Pode adicionar peso na ponta da toalha"
    ],
    sets: "3 séries",
    reps: "5 puxadas completas",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Toalha pequena"],
    contraindications: [
      "Câimbra severa nos dedos",
      "Artrite aguda nos pés"
    ],
    tips: [
      "Excelente para fascite plantar",
      "Fortalece arco do pé",
      "Pode fazer assistindo TV"
    ]
  },
  {
    id: "tornozelo-bosu-balance",
    name: "Equilíbrio no BOSU/Almofada",
    category: "tornozelo",
    description: "Treino proprioceptivo avançado em superfície instável.",
    instructions: [
      "Fique em pé sobre BOSU ou almofada de equilíbrio",
      "Mantenha joelhos levemente flexionados",
      "Tente estabilizar-se sem apoio",
      "Progrida: bipodal → unipodal → olhos fechados",
      "Mantenha pelo tempo determinado"
    ],
    sets: "3-5 repetições",
    reps: "30-60 segundos",
    frequency: "3x por semana",
    difficulty: "avançado",
    equipment: ["BOSU ou almofada de equilíbrio"],
    contraindications: [
      "Risco de queda sem supervisão",
      "Entorse recente (fase aguda)"
    ],
    tips: [
      "Comece perto de parede para segurança",
      "Progrida lentamente",
      "Adicione perturbações quando dominar"
    ]
  },

  // QUADRIL
  {
    id: "quadril-concha",
    name: "Exercício da Concha (Clamshell)",
    category: "quadril",
    description: "Fortalecimento do glúteo médio em posição lateral, fundamental para estabilidade pélvica e do joelho.",
    instructions: [
      "Deite de lado com joelhos flexionados a 45°",
      "Pés unidos, quadris alinhados (não rode para trás)",
      "Mantenha os pés juntos, abra o joelho de cima",
      "Eleve como uma concha abrindo",
      "Retorne controladamente"
    ],
    sets: "3 séries",
    reps: "15-20 repetições cada lado",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Colchonete", "Mini band (opcional)"],
    contraindications: [
      "Bursite trocantérica com dor na posição",
      "Pós-operatório de quadril (verificar protocolo)"
    ],
    tips: [
      "Não deixe o quadril rodar para trás",
      "Adicione mini band para progressão",
      "Foco na ativação do glúteo, não na amplitude"
    ]
  },
  {
    id: "quadril-alongamento-flexores",
    name: "Alongamento dos Flexores do Quadril",
    category: "quadril",
    description: "Alongamento do iliopsoas e reto femoral, músculos frequentemente encurtados em pessoas que ficam muito sentadas.",
    instructions: [
      "Posição de avanço (um joelho no chão, outro pé à frente)",
      "Mantenha tronco ereto, não incline para frente",
      "Desloque o peso do corpo para frente",
      "Sinta o alongamento na frente do quadril de trás",
      "Pode elevar o braço do mesmo lado para intensificar"
    ],
    sets: "3 repetições",
    reps: "30 segundos cada lado",
    frequency: "2x ao dia",
    difficulty: "iniciante",
    equipment: ["Almofada para joelho (opcional)"],
    contraindications: [
      "Lesão no quadril que limite a posição",
      "Prótese de quadril (verificar limitações)"
    ],
    tips: [
      "Contraia o glúteo do lado de trás para intensificar",
      "Mantenha o joelho da frente atrás do pé",
      "Essencial para quem fica muito sentado"
    ]
  },
  {
    id: "quadril-abducao-lateral",
    name: "Abdução de Quadril em Decúbito Lateral",
    category: "quadril",
    description: "Fortalecimento dos abdutores do quadril (glúteo médio e mínimo) na posição lateral.",
    instructions: [
      "Deite de lado, perna de baixo levemente flexionada",
      "Perna de cima estendida, pé em posição neutra ou leve rotação interna",
      "Eleve a perna para o teto, mantendo o quadril estável",
      "Não deixe o corpo rodar para trás",
      "Desça controladamente"
    ],
    sets: "3 séries",
    reps: "15-20 repetições cada lado",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Colchonete", "Caneleira (opcional)"],
    contraindications: [
      "Bursite trocantérica aguda",
      "Dor lateral do quadril que piora"
    ],
    tips: [
      "Pé em leve rotação interna ativa mais glúteo médio",
      "Amplitude moderada, sem compensações",
      "Progrida com caneleira"
    ]
  },

  // QUADRIL - MAIS EXERCÍCIOS
  {
    id: "quadril-piriforme-alongamento",
    name: "Alongamento do Piriforme",
    category: "quadril",
    description: "Alongamento do músculo piriforme, frequentemente envolvido em dor glútea e ciática.",
    instructions: [
      "Deite de costas, joelhos flexionados",
      "Cruze a perna afetada sobre a outra (tornozelo no joelho)",
      "Puxe o joelho da perna de baixo em direção ao peito",
      "Sinta o alongamento profundo no glúteo",
      "Mantenha 30 segundos e troque"
    ],
    sets: "3 repetições",
    reps: "30 segundos cada lado",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Prótese de quadril com restrições",
      "Dor aguda que irradia"
    ],
    tips: [
      "Também chamado de 'alongamento do pombo'",
      "Respiração profunda durante o alongamento",
      "Ótimo para síndrome do piriforme"
    ]
  },
  {
    id: "quadril-fire-hydrant",
    name: "Fire Hydrant (Hidrante)",
    category: "quadril",
    description: "Fortalecimento dos abdutores e rotadores externos do quadril em quatro apoios.",
    instructions: [
      "Posição de quatro apoios",
      "Mantenha o joelho flexionado a 90°",
      "Abra o joelho lateralmente, mantendo o quadril estável",
      "Eleve até a altura do quadril",
      "Retorne controladamente"
    ],
    sets: "3 séries",
    reps: "15 repetições cada lado",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Dor no joelho na posição",
      "Lesão labral aguda"
    ],
    tips: [
      "Não deixe o tronco rodar",
      "Pode adicionar faixa elástica",
      "Complementa o exercício da concha"
    ]
  },
  {
    id: "quadril-hip-thrust",
    name: "Hip Thrust (Elevação de Quadril)",
    category: "quadril",
    description: "Fortalecimento avançado de glúteos com maior ativação que a ponte tradicional.",
    instructions: [
      "Apoie as costas superiores em um banco ou sofá",
      "Pés apoiados no chão, joelhos a 90°",
      "Peso pode ser colocado no quadril",
      "Eleve o quadril até formar linha reta",
      "Aperte os glúteos no topo e desça"
    ],
    sets: "3-4 séries",
    reps: "12-15 repetições",
    frequency: "2-3x por semana",
    difficulty: "intermediário",
    equipment: ["Banco ou sofá", "Peso (opcional)"],
    contraindications: [
      "Dor lombar que piora com extensão",
      "Lesão do quadril"
    ],
    tips: [
      "Queixo no peito durante todo movimento",
      "Foco na contração dos glúteos",
      "Progrida com peso gradualmente"
    ]
  },
  {
    id: "quadril-rotacao-interna-externa",
    name: "Rotação de Quadril Sentado",
    category: "quadril",
    description: "Mobilização da rotação interna e externa do quadril em posição sentada.",
    instructions: [
      "Sente-se no chão, joelhos flexionados a 90°",
      "Rotação interna: deixe os joelhos caírem para dentro",
      "Rotação externa: deixe os joelhos caírem para fora",
      "Pés ficam no chão durante o movimento",
      "Alterne as rotações suavemente"
    ],
    sets: "2-3 séries",
    reps: "15-20 repetições",
    frequency: "Diariamente",
    difficulty: "iniciante",
    equipment: ["Colchonete"],
    contraindications: [
      "Impacto femoroacetabular sintomático",
      "Pós-operatório de quadril"
    ],
    tips: [
      "Movimentos suaves e controlados",
      "Bom aquecimento para o quadril",
      "Identifique limitações de mobilidade"
    ]
  },
  {
    id: "quadril-marcha-no-lugar",
    name: "Marcha Estacionária com Resistência",
    category: "quadril",
    description: "Fortalecimento dos flexores do quadril e estabilizadores com resistência elástica.",
    instructions: [
      "Em pé, mini band acima dos joelhos",
      "Eleve um joelho como se marchasse",
      "Mantenha a tensão na faixa",
      "Alterne as pernas em ritmo controlado",
      "Mantenha tronco ereto"
    ],
    sets: "3 séries",
    reps: "20 passos (10 cada perna)",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Mini band elástica"],
    contraindications: [
      "Dor lombar com flexão de quadril",
      "Pubalgia aguda"
    ],
    tips: [
      "Bom aquecimento para corrida",
      "Pode fazer sem faixa primeiro",
      "Trabalha iliopsoas e estabilidade"
    ]
  },

  // MÃO E PUNHO
  {
    id: "mao-extensores-punho",
    name: "Alongamento dos Extensores do Punho",
    category: "mao",
    description: "Alongamento dos músculos extensores do punho, frequentemente afetados na epicondilite lateral (cotovelo de tenista).",
    instructions: [
      "Estenda o braço afetado à frente, palma para baixo",
      "Com a outra mão, flexione o punho para baixo",
      "Dedos apontando para o chão",
      "Mantenha o cotovelo estendido",
      "Sinta o alongamento na parte externa do antebraço"
    ],
    sets: "3 repetições",
    reps: "30 segundos cada braço",
    frequency: "3-4x ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Fratura recente no punho",
      "Epicondilite em fase muito aguda"
    ],
    tips: [
      "Alongamento suave, sem forçar",
      "Pode variar a posição dos dedos",
      "Faça antes e após atividades manuais repetitivas"
    ]
  },
  {
    id: "mao-preensao-bola",
    name: "Exercício de Preensão com Bola",
    category: "mao",
    description: "Fortalecimento dos músculos flexores dos dedos e da mão utilizando uma bola de stress ou terapêutica.",
    instructions: [
      "Segure uma bola macia na palma da mão",
      "Aperte a bola com todos os dedos",
      "Mantenha a contração por 3-5 segundos",
      "Relaxe completamente",
      "Repita com intensidade moderada"
    ],
    sets: "3 séries",
    reps: "15-20 repetições",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Bola de stress ou terapêutica"],
    contraindications: [
      "Artrite reumatoide em fase inflamatória",
      "Síndrome do túnel do carpo com sintomas intensos"
    ],
    tips: [
      "Use bola com resistência adequada ao seu nível",
      "Trabalhe também pinças (polegar-indicador, etc.)",
      "Ótimo para fazer durante pausas no trabalho"
    ]
  },
  {
    id: "mao-deslizamento-tendao",
    name: "Deslizamento de Tendão (Tendon Gliding)",
    category: "mao",
    description: "Exercício de mobilização dos tendões flexores dos dedos, promovendo deslizamento e prevenindo aderências.",
    instructions: [
      "Comece com a mão aberta, dedos estendidos",
      "Posição 1: Flexione apenas as articulações distais (garra)",
      "Posição 2: Punho fechado completo",
      "Posição 3: Dedos em gancho (metacarpos estendidos, IFs flexionadas)",
      "Posição 4: Mesa (metacarpos 90°, IFs estendidas)"
    ],
    sets: "2-3 séries",
    reps: "10 ciclos completos",
    frequency: "4-5x ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Reparo tendíneo recente (seguir protocolo específico)",
      "Dedo em gatilho travado"
    ],
    tips: [
      "Movimentos lentos e completos em cada posição",
      "Ideal após cirurgias de mão (quando liberado)",
      "Previne rigidez após imobilização"
    ]
  },

  // PUNHO E COTOVELO
  {
    id: "cotovelo-flexao-biceps",
    name: "Flexão de Bíceps com Faixa Elástica",
    category: "mao",
    description: "Fortalecimento do bíceps braquial usando resistência elástica progressiva.",
    instructions: [
      "Pise na faixa elástica com o pé",
      "Segure as pontas da faixa com as mãos",
      "Cotovelos junto ao corpo",
      "Flexione os cotovelos trazendo as mãos aos ombros",
      "Retorne controladamente à posição inicial"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Faixa elástica"],
    contraindications: [
      "Epicondilite medial aguda",
      "Tendinite do bíceps"
    ],
    tips: [
      "Mantenha os cotovelos fixos ao lado do corpo",
      "Não balance o tronco para ajudar",
      "Progrida a resistência da faixa"
    ]
  },
  {
    id: "cotovelo-extensao-triceps",
    name: "Extensão de Tríceps Overhead",
    category: "mao",
    description: "Fortalecimento do tríceps braquial em posição elevada.",
    instructions: [
      "Sentado ou em pé, segure um peso ou faixa atrás da cabeça",
      "Cotovelos apontados para cima, próximos às orelhas",
      "Estenda os cotovelos elevando a resistência",
      "Mantenha os cotovelos fixos, só o antebraço move",
      "Retorne lentamente"
    ],
    sets: "3 séries",
    reps: "12-15 repetições",
    frequency: "3x por semana",
    difficulty: "intermediário",
    equipment: ["Peso leve ou faixa elástica"],
    contraindications: [
      "Bursite do olécrano",
      "Dor no ombro com elevação"
    ],
    tips: [
      "Comece sem peso para aprender o movimento",
      "Mantenha abdômen contraído",
      "Pode fazer unilateral"
    ]
  },
  {
    id: "punho-flexao-extensao",
    name: "Flexão e Extensão de Punho com Peso",
    category: "mao",
    description: "Fortalecimento dos flexores e extensores do punho usando resistência.",
    instructions: [
      "Apoie o antebraço em uma mesa, punho livre na borda",
      "Segure um peso leve (0,5-2kg)",
      "Palma para cima: flexione o punho para cima",
      "Palma para baixo: estenda o punho para cima",
      "Faça séries em cada posição"
    ],
    sets: "3 séries de cada",
    reps: "15 repetições",
    frequency: "3x por semana",
    difficulty: "iniciante",
    equipment: ["Peso leve ou garrafa d'água"],
    contraindications: [
      "Epicondilite lateral ou medial aguda",
      "Síndrome do túnel do carpo sintomática"
    ],
    tips: [
      "Movimento apenas do punho",
      "Peso leve é suficiente",
      "Ideal para prevenção de LER/DORT"
    ]
  },
  {
    id: "mao-oposicao-polegar",
    name: "Exercício de Oposição do Polegar",
    category: "mao",
    description: "Fortalecimento e mobilização da articulação carpometacarpal do polegar.",
    instructions: [
      "Mão aberta, dedos estendidos",
      "Toque a ponta do polegar na ponta de cada dedo",
      "Indicador → médio → anelar → mínimo",
      "Faça o ciclo completo e retorne",
      "Forme um 'O' perfeito a cada toque"
    ],
    sets: "2-3 séries",
    reps: "10 ciclos completos",
    frequency: "3-4x ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Rizartrose severa com dor",
      "Lesão do ligamento colateral do polegar"
    ],
    tips: [
      "Movimentos precisos e controlados",
      "Ótimo para artrose do polegar",
      "Pode fazer enquanto assiste TV"
    ]
  },

  // RESPIRATÓRIO
  {
    id: "respiratorio-diafragmatico",
    name: "Respiração Diafragmática",
    category: "respiratorio",
    description: "Técnica de respiração focada no diafragma para melhorar eficiência ventilatória, reduzir ansiedade e auxiliar na estabilização lombar.",
    instructions: [
      "Deite de costas com joelhos flexionados",
      "Uma mão no peito, outra no abdômen",
      "Inspire pelo nariz, expandindo o abdômen (mão sobe)",
      "O peito deve mover minimamente",
      "Expire lentamente pela boca, abdômen desce"
    ],
    sets: "5-10 minutos",
    reps: "Respirações contínuas",
    frequency: "2-3x ao dia",
    difficulty: "iniciante",
    equipment: ["Colchonete (opcional)"],
    contraindications: [
      "Raramente contraindicado",
      "Adaptar em casos de dor abdominal"
    ],
    tips: [
      "Pode fazer sentado ou em pé quando dominar a técnica",
      "Excelente para manejo de dor e ansiedade",
      "Base para exercícios de estabilização do core"
    ]
  },
  {
    id: "respiratorio-freno-labial",
    name: "Respiração com Freno Labial",
    category: "respiratorio",
    description: "Técnica respiratória para pacientes com DPOC ou dispneia, que ajuda a prolongar a expiração e reduzir aprisionamento aéreo.",
    instructions: [
      "Inspire lentamente pelo nariz (conte até 2)",
      "Feche os lábios como se fosse assoviar",
      "Expire lentamente pelos lábios franzidos (conte até 4)",
      "A expiração deve ser o dobro da inspiração",
      "Não force a expiração, deixe o ar sair naturalmente"
    ],
    sets: "5-10 minutos",
    reps: "Respirações contínuas",
    frequency: "Quando necessário",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Pacientes que não toleram expiração prolongada"
    ],
    tips: [
      "Usar durante atividades que causam dispneia",
      "Ajuda no controle da falta de ar",
      "Pode combinar com atividades diárias"
    ]
  },
  {
    id: "respiratorio-expansao-toracica",
    name: "Exercícios de Expansão Torácica",
    category: "respiratorio",
    description: "Exercícios para melhorar a expansibilidade torácica e a ventilação pulmonar, úteis no pós-operatório e em condições restritivas.",
    instructions: [
      "Sente-se ereto ou deite de costas",
      "Coloque as mãos nas laterais das costelas",
      "Inspire profundamente, expandindo as costelas lateralmente",
      "Sinta as costelas empurrando as mãos",
      "Expire lentamente e repita"
    ],
    sets: "3 séries",
    reps: "10 respirações profundas",
    frequency: "3-4x ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Fratura de costela recente",
      "Pneumotórax não tratado"
    ],
    tips: [
      "Pode usar as mãos para dar feedback tátil",
      "Combinar com incentivador respiratório se disponível",
      "Importante no pós-operatório torácico/abdominal"
    ]
  },
  {
    id: "respiratorio-huffing",
    name: "Técnica de Huffing (Sopro Forçado)",
    category: "respiratorio",
    description: "Técnica de higiene brônquica para mobilização de secreções sem tossir violentamente.",
    instructions: [
      "Inspire profundamente pelo nariz",
      "Faça uma pausa de 2-3 segundos",
      "Expire rapidamente com a boca aberta, como se embaçasse um espelho",
      "Diga 'HAAA' de forma forçada mas curta",
      "Mais efetivo que tosse em muitos casos"
    ],
    sets: "3-5 huffs",
    reps: "Por sessão de higiene",
    frequency: "Conforme necessário",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Hemoptise ativa",
      "Pneumotórax não drenado"
    ],
    tips: [
      "Combine com exercícios respiratórios antes",
      "Mais gentil que a tosse para mobilizar secreção",
      "Ideal para DPOC e bronquiectasias"
    ]
  },
  {
    id: "respiratorio-sustentacao-inspiratoria",
    name: "Sustentação Inspiratória Máxima",
    category: "respiratorio",
    description: "Exercício para melhorar a capacidade inspiratória e prevenir atelectasias.",
    instructions: [
      "Sentado confortavelmente",
      "Inspire profundamente pelo nariz ao máximo",
      "Segure a respiração por 3-5 segundos",
      "Expire lentamente pela boca",
      "Descanse e repita"
    ],
    sets: "10 respirações",
    reps: "A cada hora em pacientes acamados",
    frequency: "Várias vezes ao dia",
    difficulty: "iniciante",
    equipment: ["Nenhum"],
    contraindications: [
      "Hipertensão não controlada",
      "Aumento da pressão intracraniana"
    ],
    tips: [
      "Essencial no pós-operatório",
      "Simula o incentivador inspiratório",
      "Previne complicações pulmonares"
    ]
  },
  {
    id: "respiratorio-respiracao-segmentar",
    name: "Respiração Segmentar",
    category: "respiratorio",
    description: "Técnica para direcionar a ventilação para regiões específicas do pulmão.",
    instructions: [
      "Posicione a mão na região alvo (base, ápice, lateral)",
      "Aplique leve pressão com a mão",
      "Inspire direcionando o ar contra a pressão da mão",
      "Sinta a expansão na região específica",
      "Expire e repita focando na mesma área"
    ],
    sets: "3 séries",
    reps: "10 respirações por região",
    frequency: "3x ao dia",
    difficulty: "intermediário",
    equipment: ["Nenhum"],
    contraindications: [
      "Fratura de costela na região",
      "Dor torácica ao toque"
    ],
    tips: [
      "Útil para atelectasias localizadas",
      "A pressão da mão serve como feedback",
      "Combine com posicionamento adequado"
    ]
  },
  {
    id: "respiratorio-ciclo-ativo",
    name: "Ciclo Ativo da Respiração (ACBT)",
    category: "respiratorio",
    description: "Técnica cíclica de higiene brônquica combinando controle respiratório, expansão e huffing.",
    instructions: [
      "1. Controle respiratório: 3-4 respirações diafragmáticas relaxadas",
      "2. Expansão torácica: 3-4 inspirações profundas com pausa",
      "3. Huffing: 2-3 huffs forçados",
      "Repita o ciclo 3-4 vezes",
      "Termine quando secreção for eliminada ou 15-20min"
    ],
    sets: "3-4 ciclos",
    reps: "Por sessão",
    frequency: "2-3x ao dia",
    difficulty: "intermediário",
    equipment: ["Nenhum"],
    contraindications: [
      "Hemoptise",
      "Broncoespasmo severo"
    ],
    tips: [
      "Técnica autoaplicável e eficaz",
      "Paciente deve aprender a sequência",
      "Gold standard para higiene brônquica"
    ]
  }
];

export function getExercisesByCategory(categoryId: string): Exercise[] {
  return exercises.filter(ex => ex.category === categoryId);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(ex => ex.id === id);
}

export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return exercises.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.description.toLowerCase().includes(lowerQuery) ||
    ex.category.toLowerCase().includes(lowerQuery)
  );
}

// Mapeamento de termos de localização da dor para categorias de exercícios
const painLocationToCategory: Record<string, string[]> = {
  // Ombro
  "ombro": ["ombro"],
  "deltóide": ["ombro"],
  "manguito": ["ombro"],
  "escapula": ["ombro"],
  "escápula": ["ombro"],
  
  // Coluna lombar
  "lombar": ["coluna"],
  "costas": ["coluna"],
  "coluna": ["coluna"],
  "ciático": ["coluna", "quadril"],
  "ciática": ["coluna", "quadril"],
  "espinha": ["coluna"],
  "dorsal": ["coluna"],
  "sacro": ["coluna"],
  "quadrado lombar": ["coluna"],
  
  // Cervical
  "cervical": ["cervical"],
  "pescoço": ["cervical"],
  "nuca": ["cervical"],
  "trapézio": ["cervical", "ombro"],
  
  // Joelho
  "joelho": ["joelho"],
  "patela": ["joelho"],
  "patelar": ["joelho"],
  "menisco": ["joelho"],
  "ligamento": ["joelho"],
  "quadríceps": ["joelho"],
  "isquiotibiais": ["joelho"],
  
  // Tornozelo e pé
  "tornozelo": ["tornozelo"],
  "pé": ["tornozelo"],
  "calcanhar": ["tornozelo"],
  "plantar": ["tornozelo"],
  "aquiles": ["tornozelo"],
  "panturrilha": ["tornozelo"],
  
  // Quadril
  "quadril": ["quadril"],
  "glúteo": ["quadril"],
  "virilha": ["quadril"],
  "piriforme": ["quadril"],
  "sacroilíaca": ["quadril", "coluna"],
  "coxa": ["quadril", "joelho"],
  
  // Mão e punho
  "punho": ["mao"],
  "mão": ["mao"],
  "carpo": ["mao"],
  "túnel do carpo": ["mao"],
  "dedos": ["mao"],
  "cotovelo": ["mao", "ombro"],
  "epicondilite": ["mao"],
  
  // Respiratório
  "respiratório": ["respiratorio"],
  "pulmonar": ["respiratorio"],
  "torácico": ["respiratorio"],
  "dispneia": ["respiratorio"],
  "dpoc": ["respiratorio"],
};

// Mapeamento de queixas principais para categorias
const chiefComplaintKeywords: Record<string, string[]> = {
  // Condições do ombro
  "capsulite": ["ombro"],
  "congelado": ["ombro"],
  "tendinite ombro": ["ombro"],
  "bursite ombro": ["ombro"],
  "síndrome do impacto": ["ombro"],
  
  // Condições da coluna
  "hérnia": ["coluna"],
  "protrusão": ["coluna"],
  "lombalgia": ["coluna"],
  "dor nas costas": ["coluna"],
  "escoliose": ["coluna"],
  "espondilose": ["coluna"],
  
  // Condições cervicais
  "cervicalgia": ["cervical"],
  "torcicolo": ["cervical"],
  "whiplash": ["cervical"],
  "cefaleia tensional": ["cervical"],
  
  // Condições do joelho
  "condromalácia": ["joelho"],
  "síndrome patelofemoral": ["joelho"],
  "lesão meniscal": ["joelho"],
  "lca": ["joelho"],
  "lcp": ["joelho"],
  "gonalgia": ["joelho"],
  "artrose joelho": ["joelho"],
  
  // Condições do tornozelo
  "entorse": ["tornozelo"],
  "fascite plantar": ["tornozelo"],
  "tendinopatia aquiles": ["tornozelo"],
  "esporão": ["tornozelo"],
  
  // Condições do quadril
  "pubalgia": ["quadril"],
  "impacto femoroacetabular": ["quadril"],
  "bursite trocantérica": ["quadril"],
  "artrose quadril": ["quadril"],
  "síndrome do piriforme": ["quadril"],
  
  // Condições da mão
  "túnel do carpo": ["mao"],
  "tenossinovite": ["mao"],
  "dedo em gatilho": ["mao"],
  "de quervain": ["mao"],
  
  // Condições respiratórias
  "pós-operatório": ["respiratorio", "coluna"],
  "cirurgia": ["respiratorio"],
  "covid": ["respiratorio"],
  "pneumonia": ["respiratorio"],
};

export interface SuggestedExercise extends Exercise {
  relevanceScore: number;
  matchReason: string;
}

export function getSuggestedExercises(
  painLocation: string | null | undefined,
  chiefComplaint: string | null | undefined,
  maxResults: number = 6
): SuggestedExercise[] {
  const categoryScores: Record<string, { score: number; reasons: string[] }> = {};
  
  // Analisa localização da dor
  if (painLocation) {
    const lowerLocation = painLocation.toLowerCase();
    for (const [keyword, categories] of Object.entries(painLocationToCategory)) {
      if (lowerLocation.includes(keyword)) {
        for (const cat of categories) {
          if (!categoryScores[cat]) {
            categoryScores[cat] = { score: 0, reasons: [] };
          }
          categoryScores[cat].score += 2;
          categoryScores[cat].reasons.push(`Localização: ${keyword}`);
        }
      }
    }
  }
  
  // Analisa queixa principal
  if (chiefComplaint) {
    const lowerComplaint = chiefComplaint.toLowerCase();
    for (const [keyword, categories] of Object.entries(chiefComplaintKeywords)) {
      if (lowerComplaint.includes(keyword)) {
        for (const cat of categories) {
          if (!categoryScores[cat]) {
            categoryScores[cat] = { score: 0, reasons: [] };
          }
          categoryScores[cat].score += 3;
          categoryScores[cat].reasons.push(`Queixa: ${keyword}`);
        }
      }
    }
  }
  
  // Se não encontrou nenhuma correspondência, retorna array vazio
  if (Object.keys(categoryScores).length === 0) {
    return [];
  }
  
  // Ordena categorias por score
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1].score - a[1].score);
  
  // Coleta exercícios das categorias mais relevantes
  const suggestedExercises: SuggestedExercise[] = [];
  
  for (const [category, { score, reasons }] of sortedCategories) {
    const categoryExercises = exercises.filter(ex => ex.category === category);
    
    // Prioriza exercícios iniciantes/intermediários
    const sortedExercises = categoryExercises.sort((a, b) => {
      const difficultyOrder = { iniciante: 0, intermediário: 1, avançado: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
    
    // Pega até 3 exercícios por categoria
    const exercisesToAdd = sortedExercises.slice(0, 3);
    
    for (const ex of exercisesToAdd) {
      if (!suggestedExercises.find(s => s.id === ex.id)) {
        suggestedExercises.push({
          ...ex,
          relevanceScore: score,
          matchReason: reasons.join(", ")
        });
      }
    }
  }
  
  // Ordena por relevância e retorna os melhores
  return suggestedExercises
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}
