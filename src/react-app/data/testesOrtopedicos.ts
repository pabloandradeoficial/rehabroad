// Base de dados de testes ortopédicos organizados por região e tags estruturadas

export interface TagsTeste {
  regiao: string;
  categoria: string;
  indicacoes: string[];
  sintomas: string[];
  historico?: string[];
}

export interface TesteOrtopedico {
  id: string;
  nome: string;
  regiao: string;
  tags: TagsTeste;
  objetivo: string;
  execucao: string;
  resultadoPositivo: string;
  interpretacao: string;
  // Campos legados para compatibilidade
  indicacoes: string[];
  tiposDor: string[];
  descricao: string;
}

export const testesOrtopedicos: TesteOrtopedico[] = [
  // ============================================
  // OMBRO - 5 TESTES ESTRUTURADOS
  // ============================================
  {
    id: "neer",
    nome: "Teste de Neer",
    regiao: "ombro",
    tags: {
      regiao: "Ombro",
      categoria: "Impacto Subacromial",
      indicacoes: ["Dor anterior", "Dor ao elevar braço"],
      sintomas: ["Dor na flexão"],
      historico: []
    },
    objetivo: "Avaliar síndrome do impacto subacromial, comprimindo estruturas subacromiais (tendão do supraespinhal e bursa) contra o arco coracoacromial.",
    execucao: "Paciente sentado ou em pé. O examinador estabiliza a escápula com uma mão, impedindo sua rotação superior. Com a outra mão, eleva passivamente o braço do paciente em flexão máxima no plano escapular, mantendo o ombro em rotação interna.",
    resultadoPositivo: "Reprodução da dor na região anterolateral do ombro durante a elevação passiva, especialmente entre 70° e 120° de flexão.",
    interpretacao: "Um teste positivo sugere síndrome do impacto subacromial, podendo indicar tendinopatia do supraespinhal, bursite subacromial ou lesão do manguito rotador. Deve ser correlacionado com outros testes e achados clínicos.",
    // Campos legados
    indicacoes: ["impacto", "bursite", "tendinopatia", "dor anterior", "dor ao elevar braço"],
    tiposDor: ["anterior", "arco doloroso", "flexão"],
    descricao: "Teste de impacto subacromial."
  },
  {
    id: "hawkins-kennedy",
    nome: "Teste de Hawkins-Kennedy",
    regiao: "ombro",
    tags: {
      regiao: "Ombro",
      categoria: "Impacto",
      indicacoes: ["Dor lateral", "Dor ao elevar braço"],
      sintomas: ["Dor na rotação interna"],
      historico: []
    },
    objetivo: "Avaliar impacto subacromial através da compressão do tendão do supraespinhal e bursa subacromial contra o ligamento coracoacromial.",
    execucao: "Paciente sentado ou em pé. O examinador posiciona o ombro do paciente a 90° de flexão e o cotovelo a 90° de flexão. Em seguida, realiza rotação interna passiva forçada do ombro.",
    resultadoPositivo: "Reprodução da dor na região anterolateral do ombro durante a rotação interna forçada.",
    interpretacao: "Teste positivo sugere síndrome do impacto subacromial, tendinopatia do manguito rotador ou bursite. Sensibilidade maior que o teste de Neer quando combinados. A especificidade aumenta quando ambos são positivos.",
    // Campos legados
    indicacoes: ["impacto", "bursite", "manguito rotador", "dor lateral", "dor ao elevar braço"],
    tiposDor: ["lateral", "rotação interna"],
    descricao: "Teste de impacto subacromial variante."
  },
  {
    id: "jobe",
    nome: "Teste de Jobe (Empty Can)",
    regiao: "ombro",
    tags: {
      regiao: "Ombro",
      categoria: "Manguito Rotador",
      indicacoes: ["Fraqueza", "Dor lateral"],
      sintomas: ["Dor em abdução"],
      historico: []
    },
    objetivo: "Avaliar a integridade e função do músculo supraespinhal, principal responsável pela iniciação da abdução do ombro.",
    execucao: "Paciente sentado ou em pé. Posicionar ambos os ombros a 90° de abdução no plano escapular (30° anterior ao plano frontal) com os polegares apontando para baixo (rotação interna máxima - posição de 'lata vazia'). O examinador aplica resistência para baixo enquanto o paciente tenta manter a posição.",
    resultadoPositivo: "Dor significativa na região lateral do ombro e/ou fraqueza (incapacidade de resistir à pressão) comparada ao lado contralateral.",
    interpretacao: "Dor isolada sugere tendinopatia do supraespinhal. Fraqueza significativa pode indicar lesão parcial ou completa do tendão. Fraqueza bilateral pode dificultar a interpretação. Correlacionar com outros testes do manguito.",
    // Campos legados
    indicacoes: ["supraespinhal", "manguito rotador", "fraqueza", "dor lateral"],
    tiposDor: ["fraqueza", "dor ao esforço", "abdução"],
    descricao: "Avalia integridade do músculo supraespinhal."
  },
  {
    id: "apprehension-ombro",
    nome: "Teste de Apreensão (Apprehension)",
    regiao: "ombro",
    tags: {
      regiao: "Ombro",
      categoria: "Instabilidade",
      indicacoes: ["Sensação de instabilidade"],
      sintomas: ["Medo ao abduzir e rodar externamente"],
      historico: ["Luxação prévia"]
    },
    objetivo: "Avaliar instabilidade glenoumeral anterior, testando a integridade do complexo capsulo-ligamentar anterior e do labrum.",
    execucao: "Paciente em supino com o ombro na borda da maca. Posicionar o ombro a 90° de abdução e o cotovelo a 90° de flexão. O examinador realiza rotação externa passiva progressiva do ombro, podendo aplicar leve pressão anteroposterior na cabeça umeral.",
    resultadoPositivo: "Sensação de apreensão (medo de luxação iminente), resistência muscular reflexa ou expressão facial de desconforto. O paciente pode verbalizar medo ou tentar interromper o movimento.",
    interpretacao: "Teste positivo é altamente sugestivo de instabilidade glenoumeral anterior. Em pacientes com histórico de luxação, confirma instabilidade residual. Pode ser complementado com teste de relocação (alívio com pressão posterior na cabeça umeral).",
    // Campos legados
    indicacoes: ["instabilidade", "luxação prévia", "sensação de instabilidade"],
    tiposDor: ["instabilidade", "medo"],
    descricao: "Avalia instabilidade glenoumeral anterior."
  },
  {
    id: "speed",
    nome: "Teste de Speed",
    regiao: "ombro",
    tags: {
      regiao: "Ombro",
      categoria: "Tendinopatia do Bíceps",
      indicacoes: ["Dor anterior"],
      sintomas: ["Dor ao elevar contra resistência"],
      historico: []
    },
    objetivo: "Avaliar a integridade do tendão da cabeça longa do bíceps braquial no sulco intertubercular.",
    execucao: "Paciente sentado ou em pé com o ombro a 90° de flexão, cotovelo em extensão completa e antebraço em supinação. O examinador aplica resistência para baixo no antebraço distal enquanto o paciente tenta manter ou aumentar a flexão do ombro.",
    resultadoPositivo: "Dor localizada no sulco bicipital (região anterior do ombro, entre as tuberosidades) durante a resistência.",
    interpretacao: "Teste positivo sugere tendinopatia ou tenossinovite da cabeça longa do bíceps. Pode haver sobreposição com patologia do manguito rotador. Correlacionar com palpação do sulco bicipital e teste de Yergason.",
    // Campos legados
    indicacoes: ["bíceps", "tendinopatia bicipital", "dor anterior"],
    tiposDor: ["anterior", "específica", "resistência"],
    descricao: "Avalia tendão do bíceps braquial."
  },

  // ============================================
  // COLUNA CERVICAL
  // ============================================
  {
    id: "spurling",
    nome: "Teste de Spurling",
    regiao: "cervical",
    tags: {
      regiao: "Cervical",
      categoria: "Radiculopatia",
      indicacoes: ["Dor irradiada para braço", "Formigamento"],
      sintomas: ["Dor ao comprimir"],
      historico: []
    },
    objetivo: "Avaliar radiculopatia cervical por compressão foraminal.",
    execucao: "Paciente sentado. Realizar extensão, inclinação lateral e rotação para o lado sintomático, seguido de compressão axial.",
    resultadoPositivo: "Reprodução ou exacerbação de sintomas radiculares no membro superior ipsilateral.",
    interpretacao: "Positivo sugere compressão de raiz nervosa cervical. Alta especificidade para radiculopatia.",
    indicacoes: ["radiculopatia", "dor irradiada", "formigamento"],
    tiposDor: ["irradiada", "queimação", "formigamento"],
    descricao: "Teste de compressão foraminal cervical para avaliação de radiculopatia."
  },
  {
    id: "distraction-cervical",
    nome: "Teste de Distração Cervical",
    regiao: "cervical",
    tags: {
      regiao: "Cervical",
      categoria: "Radiculopatia",
      indicacoes: ["Dor irradiada", "Compressão discal"],
      sintomas: ["Alívio com tração"],
      historico: []
    },
    objetivo: "Avaliar alívio de sintomas radiculares por descompressão.",
    execucao: "Paciente em supino. Terapeuta aplica tração axial na coluna cervical.",
    resultadoPositivo: "Alívio dos sintomas durante a tração.",
    interpretacao: "Positivo se houver alívio, sugerindo componente compressivo da dor.",
    indicacoes: ["radiculopatia", "compressão discal"],
    tiposDor: ["irradiada", "compressiva"],
    descricao: "Avalia alívio de sintomas radiculares por descompressão."
  },
  {
    id: "ucl-test",
    nome: "Teste do Ligamento Transverso",
    regiao: "cervical",
    tags: {
      regiao: "Cervical",
      categoria: "Instabilidade",
      indicacoes: ["Instabilidade cervical alta", "Trauma cervical"],
      sintomas: ["Instabilidade", "Medo de movimento"],
      historico: ["Trauma"]
    },
    objetivo: "Avaliar integridade do ligamento transverso (C1-C2).",
    execucao: "Paciente supino. Flexão cervical com translação anterior de C1 sobre C2.",
    resultadoPositivo: "Sensação de instabilidade ou sintomas neurológicos.",
    interpretacao: "Positivo indica instabilidade atlantoaxial. CONTRAINDICADO se suspeita de fratura.",
    indicacoes: ["instabilidade", "trauma"],
    tiposDor: ["instabilidade", "medo de movimento"],
    descricao: "Avalia integridade do ligamento transverso (C1-C2)."
  },

  // ============================================
  // COLUNA LOMBAR
  // ============================================
  {
    id: "lasegue",
    nome: "Teste de Lasègue (SLR)",
    regiao: "lombar",
    tags: {
      regiao: "Lombar",
      categoria: "Radiculopatia",
      indicacoes: ["Dor ciática", "Dor irradiada para perna"],
      sintomas: ["Dor na elevação da perna"],
      historico: ["Hérnia discal"]
    },
    objetivo: "Avaliar tensionamento neural e radiculopatia lombar.",
    execucao: "Paciente em supino. Elevar passivamente a perna estendida até reproduzir sintomas ou resistência.",
    resultadoPositivo: "Dor irradiada para membro inferior entre 30-70° de elevação.",
    interpretacao: "Positivo sugere compressão de raiz nervosa lombar, comumente L4-S1.",
    indicacoes: ["hérnia discal", "radiculopatia", "ciática"],
    tiposDor: ["irradiada", "queimação", "elétrica"],
    descricao: "Teste de elevação da perna reta para tensionamento neural."
  },
  {
    id: "slump",
    nome: "Teste de Slump",
    regiao: "lombar",
    tags: {
      regiao: "Lombar",
      categoria: "Tensão Neural",
      indicacoes: ["Dor ciática", "Dor irradiada"],
      sintomas: ["Dor ao flexionar coluna"],
      historico: []
    },
    objetivo: "Avaliar tensão neural combinando flexão espinhal com tensionamento do neuroeixo.",
    execucao: "Paciente sentado. Flexão cervical, torácica e lombar, seguida de extensão de joelho e dorsiflexão.",
    resultadoPositivo: "Reprodução de sintomas que aliviam com extensão cervical.",
    interpretacao: "Positivo sugere tensão neural adversa no trajeto do nervo ciático.",
    indicacoes: ["tensão neural", "radiculopatia", "dor ciática"],
    tiposDor: ["irradiada", "queimação", "tensão"],
    descricao: "Teste de tensão neural que combina flexão espinhal com tensionamento do neuroeixo."
  },
  {
    id: "prone-instability",
    nome: "Teste de Instabilidade em Prono",
    regiao: "lombar",
    tags: {
      regiao: "Lombar",
      categoria: "Instabilidade",
      indicacoes: ["Dor lombar com movimento", "Sensação de falseio"],
      sintomas: ["Dor que alivia com contração muscular"],
      historico: []
    },
    objetivo: "Avaliar instabilidade segmentar lombar.",
    execucao: "Paciente em prono na borda da maca, pés no chão. Pressão PA nos segmentos lombares. Repetir com pernas elevadas.",
    resultadoPositivo: "Dor que diminui quando musculatura extensora está ativa (pernas elevadas).",
    interpretacao: "Positivo sugere instabilidade segmentar que se beneficia de estabilização muscular.",
    indicacoes: ["instabilidade lombar", "dor com movimento"],
    tiposDor: ["mecânica", "instabilidade"],
    descricao: "Avalia instabilidade segmentar lombar."
  },
  {
    id: "kemp",
    nome: "Teste de Kemp",
    regiao: "lombar",
    tags: {
      regiao: "Lombar",
      categoria: "Facetário/Estenose",
      indicacoes: ["Dor lombar localizada", "Dor com extensão"],
      sintomas: ["Dor ao estender e rodar"],
      historico: []
    },
    objetivo: "Avaliar estruturas posteriores da coluna lombar.",
    execucao: "Paciente em pé. Extensão com inclinação lateral e rotação para o mesmo lado.",
    resultadoPositivo: "Reprodução de dor lombar localizada (facetária) ou irradiada (estenose).",
    interpretacao: "Dor localizada sugere síndrome facetária; dor irradiada sugere estenose foraminal.",
    indicacoes: ["facetário", "estenose"],
    tiposDor: ["localizada", "mecânica"],
    descricao: "Teste de extensão e rotação lombar para estruturas posteriores."
  },

  // ============================================
  // COTOVELO
  // ============================================
  {
    id: "cozen",
    nome: "Teste de Cozen",
    regiao: "cotovelo",
    tags: {
      regiao: "Cotovelo",
      categoria: "Epicondilite Lateral",
      indicacoes: ["Dor lateral no cotovelo", "Dor ao pegar objetos"],
      sintomas: ["Dor ao estender punho"],
      historico: []
    },
    objetivo: "Avaliar epicondilite lateral (cotovelo de tenista).",
    execucao: "Cotovelo em extensão, punho fechado. Resistir extensão do punho.",
    resultadoPositivo: "Dor no epicôndilo lateral.",
    interpretacao: "Positivo sugere tendinopatia dos extensores do punho.",
    indicacoes: ["epicondilite lateral", "tendinopatia extensora"],
    tiposDor: ["lateral", "ao esforço"],
    descricao: "Teste para epicondilite lateral (cotovelo de tenista)."
  },
  {
    id: "mill",
    nome: "Teste de Mill",
    regiao: "cotovelo",
    tags: {
      regiao: "Cotovelo",
      categoria: "Epicondilite Lateral",
      indicacoes: ["Dor lateral no cotovelo"],
      sintomas: ["Dor ao alongar extensores"],
      historico: []
    },
    objetivo: "Avaliar epicondilite lateral por alongamento.",
    execucao: "Pronação, flexão de punho e dedos com cotovelo em extensão.",
    resultadoPositivo: "Dor no epicôndilo lateral.",
    interpretacao: "Positivo sugere tendinopatia dos extensores.",
    indicacoes: ["epicondilite lateral"],
    tiposDor: ["lateral", "alongamento"],
    descricao: "Teste de alongamento para epicondilite lateral."
  },
  {
    id: "epicondilite-medial",
    nome: "Teste de Epicondilite Medial",
    regiao: "cotovelo",
    tags: {
      regiao: "Cotovelo",
      categoria: "Epicondilite Medial",
      indicacoes: ["Dor medial no cotovelo"],
      sintomas: ["Dor ao flexionar punho"],
      historico: []
    },
    objetivo: "Avaliar epicondilite medial (cotovelo de golfista).",
    execucao: "Cotovelo em extensão, supinação e extensão de punho contra resistência.",
    resultadoPositivo: "Dor no epicôndilo medial.",
    interpretacao: "Positivo sugere tendinopatia dos flexores do punho.",
    indicacoes: ["epicondilite medial", "cotovelo de golfista"],
    tiposDor: ["medial", "ao esforço"],
    descricao: "Teste para epicondilite medial."
  },

  // ============================================
  // PUNHO E MÃO
  // ============================================
  {
    id: "phalen",
    nome: "Teste de Phalen",
    regiao: "punho",
    tags: {
      regiao: "Punho",
      categoria: "Síndrome do Túnel do Carpo",
      indicacoes: ["Formigamento nos dedos", "Dor noturna na mão"],
      sintomas: ["Parestesia ao flexionar punho"],
      historico: []
    },
    objetivo: "Avaliar compressão do nervo mediano no túnel do carpo.",
    execucao: "Flexão máxima de ambos os punhos por 60 segundos.",
    resultadoPositivo: "Parestesia no território do nervo mediano (polegar, indicador, médio).",
    interpretacao: "Positivo sugere síndrome do túnel do carpo.",
    indicacoes: ["síndrome do túnel do carpo", "compressão nervosa"],
    tiposDor: ["formigamento", "noturna"],
    descricao: "Teste de compressão do nervo mediano."
  },
  {
    id: "tinel-punho",
    nome: "Teste de Tinel (Punho)",
    regiao: "punho",
    tags: {
      regiao: "Punho",
      categoria: "Síndrome do Túnel do Carpo",
      indicacoes: ["Formigamento nos dedos"],
      sintomas: ["Choque ao percutir punho"],
      historico: []
    },
    objetivo: "Avaliar irritabilidade do nervo mediano.",
    execucao: "Percussão sobre o túnel do carpo.",
    resultadoPositivo: "Parestesia irradiada para dedos.",
    interpretacao: "Positivo sugere neuropatia do mediano.",
    indicacoes: ["síndrome do túnel do carpo", "neuropatia"],
    tiposDor: ["formigamento", "elétrica"],
    descricao: "Teste de percussão do nervo mediano."
  },
  {
    id: "finkelstein",
    nome: "Teste de Finkelstein",
    regiao: "punho",
    tags: {
      regiao: "Punho",
      categoria: "Tenossinovite de De Quervain",
      indicacoes: ["Dor no polegar", "Dor radial do punho"],
      sintomas: ["Dor ao desviar ulnarmente"],
      historico: []
    },
    objetivo: "Avaliar tenossinovite de De Quervain.",
    execucao: "Polegar fletido dentro da mão fechada. Desvio ulnar do punho.",
    resultadoPositivo: "Dor aguda no processo estiloide do rádio.",
    interpretacao: "Positivo sugere tenossinovite do primeiro compartimento extensor.",
    indicacoes: ["de quervain", "tenossinovite"],
    tiposDor: ["radial", "movimento específico"],
    descricao: "Teste para tenossinovite de De Quervain."
  },

  // ============================================
  // QUADRIL
  // ============================================
  {
    id: "faber",
    nome: "Teste de FABER (Patrick)",
    regiao: "quadril",
    tags: {
      regiao: "Quadril",
      categoria: "Articulação/Sacroilíaca",
      indicacoes: ["Dor na virilha", "Dor glútea"],
      sintomas: ["Dor ao cruzar perna"],
      historico: []
    },
    objetivo: "Avaliar articulação do quadril e sacroilíaca.",
    execucao: "Paciente supino. Flexão, abdução e rotação externa do quadril (posição de 4).",
    resultadoPositivo: "Dor na virilha (quadril) ou dor posterior (sacroilíaca).",
    interpretacao: "Localização da dor diferencia patologia do quadril de sacroilíaca.",
    indicacoes: ["sacroilíaca", "artrose quadril", "impacto"],
    tiposDor: ["profunda", "virilha"],
    descricao: "Teste combinado para articulação do quadril e sacroilíaca."
  },
  {
    id: "fadir",
    nome: "Teste de FADIR",
    regiao: "quadril",
    tags: {
      regiao: "Quadril",
      categoria: "Impacto Femoroacetabular",
      indicacoes: ["Dor na virilha", "Dor ao agachar"],
      sintomas: ["Dor na flexão com adução"],
      historico: []
    },
    objetivo: "Avaliar impacto anterior do quadril.",
    execucao: "Paciente supino. Flexão, adução e rotação interna do quadril.",
    resultadoPositivo: "Dor na virilha/anterior do quadril.",
    interpretacao: "Positivo sugere impacto femoroacetabular ou lesão labral.",
    indicacoes: ["impacto femoroacetabular", "labrum"],
    tiposDor: ["virilha", "mecânica"],
    descricao: "Teste de impacto anterior do quadril."
  },
  {
    id: "thomas",
    nome: "Teste de Thomas",
    regiao: "quadril",
    tags: {
      regiao: "Quadril",
      categoria: "Encurtamento Muscular",
      indicacoes: ["Dor lombar", "Dificuldade de extensão"],
      sintomas: ["Quadril não estende"],
      historico: []
    },
    objetivo: "Avaliar encurtamento dos flexores do quadril.",
    execucao: "Paciente supino na borda da maca. Flexionar um quadril ao peito, observar o contralateral.",
    resultadoPositivo: "Quadril contralateral fleta (não mantém extensão).",
    interpretacao: "Positivo indica encurtamento de iliopsoas ou reto femoral.",
    indicacoes: ["encurtamento flexores", "psoas"],
    tiposDor: ["anterior", "rigidez"],
    descricao: "Avalia encurtamento dos flexores do quadril."
  },
  {
    id: "ober",
    nome: "Teste de Ober",
    regiao: "quadril",
    tags: {
      regiao: "Quadril",
      categoria: "Banda Iliotibial",
      indicacoes: ["Dor lateral do quadril", "Dor lateral do joelho"],
      sintomas: ["Coxa não aduz"],
      historico: []
    },
    objetivo: "Avaliar encurtamento do TFL e banda iliotibial.",
    execucao: "Decúbito lateral. Abduzir e estender o quadril superior, depois deixar aducir.",
    resultadoPositivo: "Membro não aduz abaixo da horizontal.",
    interpretacao: "Positivo indica encurtamento da banda iliotibial.",
    indicacoes: ["síndrome da banda iliotibial", "encurtamento TFL"],
    tiposDor: ["lateral", "rigidez"],
    descricao: "Avalia encurtamento do tensor da fáscia lata e banda iliotibial."
  },

  // ============================================
  // JOELHO
  // ============================================
  {
    id: "lachman",
    nome: "Teste de Lachman",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Ligamento Cruzado Anterior",
      indicacoes: ["Joelho instável", "Falseio"],
      sintomas: ["Translação anterior aumentada"],
      historico: ["Trauma", "Entorse de joelho"]
    },
    objetivo: "Avaliar integridade do LCA com alta sensibilidade.",
    execucao: "Paciente supino, joelho em 20-30° de flexão. Estabilizar fêmur e transladar tíbia anteriormente.",
    resultadoPositivo: "Translação anterior aumentada com end-feel macio.",
    interpretacao: "Teste mais sensível para lesão do LCA.",
    indicacoes: ["lesão LCA", "instabilidade anterior"],
    tiposDor: ["instabilidade", "trauma"],
    descricao: "Teste mais sensível para lesão do LCA."
  },
  {
    id: "gaveta-anterior",
    nome: "Teste de Gaveta Anterior",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Ligamento Cruzado Anterior",
      indicacoes: ["Joelho instável"],
      sintomas: ["Gaveta positiva"],
      historico: ["Trauma"]
    },
    objetivo: "Avaliar lesão do LCA.",
    execucao: "Paciente supino, joelho a 90° de flexão. Sentar sobre o pé e transladar tíbia anteriormente.",
    resultadoPositivo: "Translação anterior aumentada.",
    interpretacao: "Positivo sugere lesão do LCA, porém menos sensível que Lachman.",
    indicacoes: ["lesão LCA", "instabilidade"],
    tiposDor: ["instabilidade", "falseio"],
    descricao: "Teste clássico para lesão do LCA."
  },
  {
    id: "gaveta-posterior",
    nome: "Teste de Gaveta Posterior",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Ligamento Cruzado Posterior",
      indicacoes: ["Trauma direto no joelho"],
      sintomas: ["Gaveta posterior"],
      historico: ["Trauma", "Acidente"]
    },
    objetivo: "Avaliar integridade do LCP.",
    execucao: "Mesma posição da gaveta anterior. Transladar tíbia posteriormente.",
    resultadoPositivo: "Translação posterior aumentada.",
    interpretacao: "Positivo sugere lesão do LCP.",
    indicacoes: ["lesão LCP", "instabilidade posterior"],
    tiposDor: ["instabilidade", "trauma"],
    descricao: "Avalia integridade do LCP."
  },
  {
    id: "mcmurray",
    nome: "Teste de McMurray",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Menisco",
      indicacoes: ["Dor na interlinha articular", "Bloqueio do joelho"],
      sintomas: ["Clique ao rodar joelho"],
      historico: ["Torção do joelho"]
    },
    objetivo: "Avaliar lesão meniscal.",
    execucao: "Paciente supino. Flexão máxima do joelho, rotação da tíbia e extensão gradual com compressão.",
    resultadoPositivo: "Clique palpável ou dor na interlinha articular.",
    interpretacao: "Positivo sugere lesão meniscal (medial ou lateral conforme rotação).",
    indicacoes: ["lesão meniscal", "bloqueio articular"],
    tiposDor: ["interlinha", "bloqueio"],
    descricao: "Teste para lesão meniscal."
  },
  {
    id: "apley",
    nome: "Teste de Apley",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Menisco/Ligamentar",
      indicacoes: ["Dor no joelho", "Bloqueio"],
      sintomas: ["Dor ao comprimir e rodar"],
      historico: []
    },
    objetivo: "Diferenciar lesão meniscal de ligamentar.",
    execucao: "Paciente em prono, joelho a 90°. Compressão axial com rotação, depois distração.",
    resultadoPositivo: "Dor na compressão ou distração.",
    interpretacao: "Dor na compressão sugere menisco; dor na distração sugere ligamentos.",
    indicacoes: ["lesão meniscal", "lesão ligamentar"],
    tiposDor: ["interlinha", "compressiva"],
    descricao: "Teste de compressão e distração para diferenciar lesão meniscal de ligamentar."
  },
  {
    id: "varo-valgo",
    nome: "Teste de Estresse Varo/Valgo",
    regiao: "joelho",
    tags: {
      regiao: "Joelho",
      categoria: "Ligamentos Colaterais",
      indicacoes: ["Dor lateral ou medial do joelho", "Instabilidade"],
      sintomas: ["Abertura articular ao estresse"],
      historico: ["Trauma lateral"]
    },
    objetivo: "Avaliar integridade dos ligamentos colaterais.",
    execucao: "Joelho em leve flexão. Aplicar estresse em valgo (LCM) e varo (LCL).",
    resultadoPositivo: "Abertura articular aumentada ou dor.",
    interpretacao: "Positivo indica lesão do ligamento colateral testado.",
    indicacoes: ["lesão colateral", "instabilidade"],
    tiposDor: ["lateral/medial", "instabilidade"],
    descricao: "Avalia integridade dos ligamentos colaterais."
  },

  // ============================================
  // TORNOZELO E PÉ
  // ============================================
  {
    id: "gaveta-anterior-tornozelo",
    nome: "Teste de Gaveta Anterior (Tornozelo)",
    regiao: "tornozelo",
    tags: {
      regiao: "Tornozelo",
      categoria: "Instabilidade Anterior",
      indicacoes: ["Tornozelo instável", "Entorses de repetição"],
      sintomas: ["Translação anterior do tálus"],
      historico: ["Entorse de tornozelo"]
    },
    objetivo: "Avaliar integridade do ligamento talofibular anterior.",
    execucao: "Estabilizar tíbia e transladar o tálus anteriormente.",
    resultadoPositivo: "Translação anterior aumentada comparada ao lado contralateral.",
    interpretacao: "Positivo sugere lesão do LTFA.",
    indicacoes: ["lesão LTFA", "instabilidade anterior"],
    tiposDor: ["instabilidade", "entorse"],
    descricao: "Avalia integridade do ligamento talofibular anterior."
  },
  {
    id: "tilt-talar",
    nome: "Teste de Inclinação Talar",
    regiao: "tornozelo",
    tags: {
      regiao: "Tornozelo",
      categoria: "Instabilidade Lateral",
      indicacoes: ["Tornozelo instável"],
      sintomas: ["Inclinação excessiva do tálus"],
      historico: ["Entorse"]
    },
    objetivo: "Avaliar integridade do ligamento calcaneofibular.",
    execucao: "Tornozelo em posição neutra. Inverter o calcâneo.",
    resultadoPositivo: "Inclinação excessiva comparada ao contralateral.",
    interpretacao: "Positivo sugere lesão do ligamento calcaneofibular.",
    indicacoes: ["lesão calcaneofibular", "instabilidade lateral"],
    tiposDor: ["instabilidade", "lateral"],
    descricao: "Avalia integridade do ligamento calcaneofibular."
  },
  {
    id: "thompson",
    nome: "Teste de Thompson",
    regiao: "tornozelo",
    tags: {
      regiao: "Tornozelo",
      categoria: "Tendão de Aquiles",
      indicacoes: ["Dor no calcanhar", "Estalido no tornozelo"],
      sintomas: ["Ausência de flexão plantar"],
      historico: ["Trauma agudo", "Esporte"]
    },
    objetivo: "Avaliar ruptura do tendão de Aquiles.",
    execucao: "Paciente em prono. Apertar a panturrilha e observar flexão plantar.",
    resultadoPositivo: "Ausência de flexão plantar.",
    interpretacao: "Positivo (sem movimento) indica ruptura do tendão de Aquiles.",
    indicacoes: ["ruptura de Aquiles", "trauma"],
    tiposDor: ["posterior", "aguda"],
    descricao: "Teste para ruptura do tendão de Aquiles."
  },
  {
    id: "squeeze-test",
    nome: "Teste de Squeeze (Sindesmose)",
    regiao: "tornozelo",
    tags: {
      regiao: "Tornozelo",
      categoria: "Sindesmose",
      indicacoes: ["Dor acima do tornozelo", "Entorse alta"],
      sintomas: ["Dor ao comprimir perna"],
      historico: ["Entorse com rotação"]
    },
    objetivo: "Avaliar integridade da sindesmose tibiofibular.",
    execucao: "Comprimir tíbia e fíbula na região média da perna.",
    resultadoPositivo: "Dor na região da sindesmose distal.",
    interpretacao: "Positivo sugere lesão da sindesmose (entorse alta).",
    indicacoes: ["lesão sindesmose", "entorse alta"],
    tiposDor: ["proximal", "sindesmose"],
    descricao: "Avalia integridade da sindesmose tibiofibular."
  }
];

// Mapeamento de regiões para português
export const regioes: Record<string, string> = {
  cervical: "Coluna Cervical",
  lombar: "Coluna Lombar",
  ombro: "Ombro",
  cotovelo: "Cotovelo",
  punho: "Punho e Mão",
  quadril: "Quadril",
  joelho: "Joelho",
  tornozelo: "Tornozelo e Pé"
};

// Categorias disponíveis
export const categoriasPorRegiao: Record<string, string[]> = {
  ombro: ["Impacto Subacromial", "Impacto", "Manguito Rotador", "Instabilidade", "Tendinopatia do Bíceps"],
  cervical: ["Radiculopatia", "Instabilidade"],
  lombar: ["Radiculopatia", "Tensão Neural", "Instabilidade", "Facetário/Estenose"],
  cotovelo: ["Epicondilite Lateral", "Epicondilite Medial"],
  punho: ["Síndrome do Túnel do Carpo", "Tenossinovite de De Quervain"],
  quadril: ["Articulação/Sacroilíaca", "Impacto Femoroacetabular", "Encurtamento Muscular", "Banda Iliotibial"],
  joelho: ["Ligamento Cruzado Anterior", "Ligamento Cruzado Posterior", "Menisco", "Menisco/Ligamentar", "Ligamentos Colaterais"],
  tornozelo: ["Instabilidade Anterior", "Instabilidade Lateral", "Tendão de Aquiles", "Sindesmose"]
};

// Função auxiliar para normalizar strings (lowercase, trim, remover espaços extras)
function normalizar(str: string | null | undefined): string {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

// Função auxiliar para comparar strings normalizadas
function incluiNormalizado(texto: string | null | undefined, busca: string | null | undefined): boolean {
  return normalizar(texto).includes(normalizar(busca));
}

// Função para buscar testes com cruzamento inteligente de tags
export function buscarTestes(
  regiao?: string,
  tiposDor?: string[],
  indicacoes?: string[],
  historico?: string[]
): TesteOrtopedico[] {
  // PROTEÇÃO 1: Verificar se a base de testes existe e é um array válido
  if (!testesOrtopedicos || !Array.isArray(testesOrtopedicos) || testesOrtopedicos.length === 0) {
    console.warn("Base de testes não configurada ou vazia");
    return [];
  }

  let resultados: TesteOrtopedico[] = [];
  
  try {
    resultados = [...testesOrtopedicos];
  } catch {
    return [];
  }

  // Filtrar por região com normalização
  if (regiao) {
    const regiaoNormalizada = normalizar(regiao);
    resultados = resultados.filter(t => {
      // Verificar se teste é válido
      if (!t || typeof t.regiao !== "string") return false;
      return normalizar(t.regiao) === regiaoNormalizada;
    });
  }

  // PROTEÇÃO 2: Verificar se ainda há resultados após filtro de região
  if (!resultados || resultados.length === 0) {
    return [];
  }

  // Sistema de pontuação para relevância
  const temTiposDor = tiposDor && Array.isArray(tiposDor) && tiposDor.length > 0;
  const temIndicacoes = indicacoes && Array.isArray(indicacoes) && indicacoes.length > 0;
  const temHistorico = historico && Array.isArray(historico) && historico.length > 0;

  if (temTiposDor || temIndicacoes || temHistorico) {
    resultados = resultados.map(teste => {
      // PROTEÇÃO 3: Verificar se teste é válido
      if (!teste || !teste.tags) {
        return { ...teste, _score: 0 };
      }

      let score = 0;

      // Pontuação por sintomas/tipos de dor
      if (temTiposDor) {
        tiposDor!.forEach(tipo => {
          if (!tipo) return;
          // Verificar em tags.sintomas (com proteção)
          const sintomas = teste.tags?.sintomas;
          if (Array.isArray(sintomas)) {
            if (sintomas.some(s => incluiNormalizado(s, tipo))) {
              score += 3;
            }
          }
          // Verificar em tiposDor legado (com proteção)
          const tiposDorLegado = teste.tiposDor;
          if (Array.isArray(tiposDorLegado)) {
            if (tiposDorLegado.some(td => incluiNormalizado(td, tipo))) {
              score += 1;
            }
          }
        });
      }

      // Pontuação por indicações/queixas
      if (temIndicacoes) {
        indicacoes!.forEach(ind => {
          if (!ind) return;
          // Verificar em tags.indicacoes (com proteção)
          const indicacoesTag = teste.tags?.indicacoes;
          if (Array.isArray(indicacoesTag)) {
            if (indicacoesTag.some(i => incluiNormalizado(i, ind))) {
              score += 3;
            }
          }
          // Verificar em indicacoes legado (com proteção)
          const indicacoesLegado = teste.indicacoes;
          if (Array.isArray(indicacoesLegado)) {
            if (indicacoesLegado.some(i => incluiNormalizado(i, ind))) {
              score += 1;
            }
          }
        });
      }

      // Pontuação por histórico
      if (temHistorico) {
        historico!.forEach(hist => {
          if (!hist) return;
          const historicoTag = teste.tags?.historico;
          if (Array.isArray(historicoTag)) {
            if (historicoTag.some(h => incluiNormalizado(h, hist))) {
              score += 4; // Histórico tem peso maior
            }
          }
        });
      }

      return { ...teste, _score: score };
    })
    .filter(t => t && (t as any)._score > 0) // Só retorna testes com alguma correspondência
    .sort((a, b) => ((b as any)._score || 0) - ((a as any)._score || 0)); // Ordena por relevância
  }

  return resultados || [];
}

// Função para buscar testes por categoria específica
export function buscarTestesPorCategoria(regiao: string, categoria: string): TesteOrtopedico[] {
  return testesOrtopedicos.filter(t => 
    t.regiao === regiao && t.tags.categoria === categoria
  );
}

// Função para extrair todas as indicações únicas de uma região
export function getIndicacoesPorRegiao(regiao: string): string[] {
  const indicacoes = new Set<string>();
  testesOrtopedicos
    .filter(t => t.regiao === regiao)
    .forEach(t => {
      t.tags.indicacoes.forEach(i => indicacoes.add(i));
    });
  return Array.from(indicacoes);
}

// Função para extrair todos os sintomas únicos de uma região
export function getSintomasPorRegiao(regiao: string): string[] {
  const sintomas = new Set<string>();
  testesOrtopedicos
    .filter(t => t.regiao === regiao)
    .forEach(t => {
      t.tags.sintomas.forEach(s => sintomas.add(s));
    });
  return Array.from(sintomas);
}
