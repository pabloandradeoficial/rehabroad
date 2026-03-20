import { ClinicalPage } from './types';

export const testesOrtopedicos: ClinicalPage[] = [
  // OMBRO
  {
    id: 'teste-neer',
    slug: 'teste-de-neer',
    category: 'testes-ortopedicos',
    title: 'Teste de Neer',
    metaDescription: 'Como realizar e interpretar o Teste de Neer para síndrome do impacto subacromial. Guia completo com evidência científica.',
    introduction: 'O Teste de Neer é um teste provocativo utilizado para avaliar a síndrome do impacto subacromial. Descrito por Charles Neer em 1972, provoca compressão das estruturas subacromiais contra o arco coracoacromial.',
    indications: [
      'Suspeita de síndrome do impacto subacromial',
      'Dor anterior ou lateral do ombro',
      'Dor ao elevar o braço acima da cabeça',
      'Diagnóstico diferencial de dor no ombro'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Estabilize a escápula do paciente com uma mão',
      'Com a outra mão, segure o antebraço do paciente',
      'Mantenha o cotovelo estendido e o ombro em rotação interna',
      'Eleve passivamente o braço no plano escapular até flexão máxima',
      'Observe a resposta do paciente'
    ],
    interpretation: {
      positive: 'Dor na região anterior ou lateral do ombro durante a elevação, especialmente entre 70° e 120°',
      negative: 'Ausência de dor durante toda a amplitude de movimento',
      notes: 'A dor pode ser reduzida após injeção subacromial de anestésico (Teste de Neer modificado)'
    },
    evidence: {
      sensitivity: '72-89%',
      specificity: '25-60%',
      references: [
        'Neer CS. Anterior acromioplasty for chronic impingement syndrome. J Bone Joint Surg Am. 1972',
        'Hegedus EJ et al. Physical examination tests of the shoulder: a systematic review. Br J Sports Med. 2008'
      ]
    },
    clinicalApplication: 'O Teste de Neer deve ser combinado com outros testes de impacto (Hawkins-Kennedy, Jobe) para aumentar a acurácia diagnóstica. Um resultado positivo isolado não confirma o diagnóstico devido à baixa especificidade.',
    relatedTests: ['teste-de-hawkins', 'teste-de-jobe', 'teste-de-yergason'],
    keywords: ['teste de neer', 'impacto subacromial', 'ombro', 'manguito rotador', 'avaliação ombro']
  },
  {
    id: 'teste-hawkins',
    slug: 'teste-de-hawkins-kennedy',
    category: 'testes-ortopedicos',
    title: 'Teste de Hawkins-Kennedy',
    metaDescription: 'Guia completo do Teste de Hawkins-Kennedy para síndrome do impacto. Técnica, interpretação e evidência científica.',
    introduction: 'O Teste de Hawkins-Kennedy avalia a síndrome do impacto subacromial através da compressão do tendão supraespinal contra o ligamento coracoacromial. É um dos testes mais utilizados na avaliação do ombro doloroso.',
    indications: [
      'Suspeita de impacto subacromial',
      'Tendinopatia do manguito rotador',
      'Dor ao realizar movimentos acima da cabeça',
      'Avaliação complementar ao Teste de Neer'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Flexione o ombro do paciente a 90°',
      'Flexione o cotovelo a 90°',
      'Estabilize o ombro com uma mão',
      'Com a outra mão, realize rotação interna passiva do ombro',
      'A rotação interna força o tubérculo maior sob o arco coracoacromial'
    ],
    interpretation: {
      positive: 'Dor na região anterior ou lateral do ombro durante a rotação interna',
      negative: 'Movimento indolor em toda amplitude',
      notes: 'Pode ser realizado em diferentes graus de flexão para sensibilizar o teste'
    },
    evidence: {
      sensitivity: '79-92%',
      specificity: '25-66%',
      references: [
        'Hawkins RJ, Kennedy JC. Impingement syndrome in athletes. Am J Sports Med. 1980',
        'Michener LA et al. Reliability and diagnostic accuracy of 5 physical examination tests. J Athl Train. 2009'
      ]
    },
    clinicalApplication: 'Alta sensibilidade torna o Hawkins-Kennedy útil como teste de triagem. Combinado com Neer e Jobe, forma um cluster diagnóstico que aumenta significativamente a probabilidade pós-teste para síndrome do impacto.',
    relatedTests: ['teste-de-neer', 'teste-de-jobe', 'teste-do-arco-doloroso'],
    keywords: ['hawkins kennedy', 'impacto', 'ombro', 'supraespinal', 'manguito rotador']
  },
  {
    id: 'teste-jobe',
    slug: 'teste-de-jobe',
    category: 'testes-ortopedicos',
    title: 'Teste de Jobe (Empty Can)',
    metaDescription: 'Teste de Jobe ou Empty Can para avaliação do músculo supraespinal. Técnica correta, interpretação e aplicação clínica.',
    introduction: 'O Teste de Jobe, também conhecido como Empty Can Test, avalia a integridade e força do músculo supraespinal. É fundamental na avaliação de lesões do manguito rotador.',
    indications: [
      'Suspeita de lesão do supraespinal',
      'Fraqueza na elevação do braço',
      'Avaliação de lesões do manguito rotador',
      'Dor lateral do ombro'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Posicione os braços em 90° de abdução no plano escapular',
      'Realize rotação interna máxima (polegares apontando para baixo)',
      'Solicite que o paciente resista à pressão para baixo',
      'Compare a força bilateralmente',
      'Observe dor e/ou fraqueza'
    ],
    interpretation: {
      positive: 'Dor e/ou fraqueza durante a resistência, especialmente quando comparado ao lado contralateral',
      negative: 'Força simétrica e ausência de dor',
      notes: 'Fraqueza isolada pode indicar lesão completa; dor com força preservada sugere tendinopatia'
    },
    evidence: {
      sensitivity: '44-89%',
      specificity: '50-90%',
      references: [
        'Jobe FW, Moynes DR. Delineation of diagnostic criteria and a rehabilitation program for rotator cuff injuries. Am J Sports Med. 1982',
        'Park HB et al. Diagnostic accuracy of clinical tests for different degrees of subacromial impingement. J Bone Joint Surg Am. 2005'
      ]
    },
    clinicalApplication: 'O Teste de Jobe é essencial na bateria de testes do manguito rotador. A combinação de dor e fraqueza aumenta a probabilidade de lesão significativa. Deve ser correlacionado com exames de imagem quando indicado.',
    relatedTests: ['teste-de-neer', 'teste-de-hawkins', 'teste-do-infraespinal'],
    keywords: ['teste de jobe', 'empty can', 'supraespinal', 'manguito rotador', 'ombro']
  },
  {
    id: 'teste-yergason',
    slug: 'teste-de-yergason',
    category: 'testes-ortopedicos',
    title: 'Teste de Yergason',
    metaDescription: 'Teste de Yergason para avaliação do tendão do bíceps braquial. Aprenda a técnica, interpretação e evidência científica.',
    introduction: 'O Teste de Yergason avalia a estabilidade do tendão da cabeça longa do bíceps no sulco intertubercular e a integridade do ligamento transverso do úmero.',
    indications: [
      'Suspeita de tendinopatia bicipital',
      'Instabilidade do tendão do bíceps',
      'Dor anterior do ombro',
      'Estalidos no ombro durante movimentos'
    ],
    howTo: [
      'Paciente sentado com cotovelo flexionado a 90°',
      'Antebraço em pronação',
      'Estabilize o cotovelo junto ao tronco',
      'Solicite supinação ativa contra resistência',
      'Simultaneamente, solicite flexão do cotovelo contra resistência',
      'Palpe o sulco bicipital durante o teste'
    ],
    interpretation: {
      positive: 'Dor no sulco bicipital ou sensação de subluxação do tendão',
      negative: 'Movimento indolor sem instabilidade',
      notes: 'Estalido palpável pode indicar subluxação do tendão bicipital'
    },
    evidence: {
      sensitivity: '37-43%',
      specificity: '79-86%',
      references: [
        'Yergason RM. Supination sign. J Bone Joint Surg Am. 1931',
        'Holtby R, Razmjou H. Accuracy of the Speed test in detecting biceps pathology. Arthroscopy. 2004'
      ]
    },
    clinicalApplication: 'A baixa sensibilidade limita o uso isolado do Yergason. Deve ser combinado com Speed Test e palpação do sulco bicipital para avaliação completa da cabeça longa do bíceps.',
    relatedTests: ['teste-de-speed', 'teste-de-neer', 'teste-de-hawkins'],
    keywords: ['yergason', 'bíceps', 'sulco bicipital', 'ombro', 'tendão']
  },
  {
    id: 'teste-speed',
    slug: 'teste-de-speed',
    category: 'testes-ortopedicos',
    title: 'Teste de Speed',
    metaDescription: 'Teste de Speed para tendinopatia bicipital. Guia completo com técnica, interpretação e quando utilizar na prática clínica.',
    introduction: 'O Teste de Speed avalia a integridade do tendão da cabeça longa do bíceps braquial. É amplamente utilizado na prática clínica para diagnóstico de tendinopatias bicipitais.',
    indications: [
      'Dor anterior do ombro',
      'Suspeita de tendinopatia bicipital',
      'Dor que irradia para o braço',
      'Complemento ao Teste de Yergason'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Ombro em flexão de 60-90°',
      'Cotovelo em extensão completa',
      'Antebraço em supinação',
      'Aplique resistência à flexão do ombro',
      'Palpe simultaneamente o sulco bicipital'
    ],
    interpretation: {
      positive: 'Dor no sulco bicipital durante a flexão resistida',
      negative: 'Ausência de dor durante o movimento',
      notes: 'Teste inespecífico - pode ser positivo em outras patologias do ombro'
    },
    evidence: {
      sensitivity: '32-75%',
      specificity: '67-81%',
      references: [
        'Bennett WF. Specificity of the Speed test. Arthroscopy. 1998',
        'Kibler WB et al. Clinical examination of the shoulder. J Am Acad Orthop Surg. 2006'
      ]
    },
    clinicalApplication: 'O Teste de Speed tem utilidade limitada isoladamente devido à moderada acurácia. Combine com Yergason, palpação do sulco e avaliação funcional para decisão clínica.',
    relatedTests: ['teste-de-yergason', 'teste-de-neer', 'teste-de-hawkins'],
    keywords: ['teste de speed', 'bíceps braquial', 'ombro', 'tendinopatia', 'sulco bicipital']
  },
  {
    id: 'teste-apprehension-ombro',
    slug: 'teste-de-apreensao-do-ombro',
    category: 'testes-ortopedicos',
    title: 'Teste de Apreensão do Ombro',
    metaDescription: 'Teste de Apreensão para instabilidade anterior do ombro. Técnica, interpretação clínica e manejo do paciente.',
    introduction: 'O Teste de Apreensão avalia a instabilidade glenoumeral anterior. É considerado o teste mais sensível para detectar instabilidade anterior do ombro.',
    indications: [
      'História de luxação ou subluxação do ombro',
      'Sensação de instabilidade durante movimentos',
      'Dor em posição de arremesso',
      'Avaliação pós-traumática do ombro'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Ombro em 90° de abdução',
      'Cotovelo fletido a 90°',
      'Realize rotação externa passiva lenta',
      'Observe a expressão facial e resposta do paciente',
      'Interrompa se houver apreensão significativa'
    ],
    interpretation: {
      positive: 'Sensação de apreensão, medo de luxação ou resistência muscular reflexa',
      negative: 'Paciente confortável em toda amplitude de rotação externa',
      notes: 'Dor isolada não caracteriza teste positivo - deve haver apreensão'
    },
    evidence: {
      sensitivity: '72-98%',
      specificity: '87-96%',
      references: [
        'Rowe CR, Zarins B. Recurrent transient subluxation of the shoulder. J Bone Joint Surg Am. 1981',
        'Farber AJ et al. Clinical assessment of shoulder instability. Sports Med Arthrosc Rev. 2006'
      ]
    },
    clinicalApplication: 'O Teste de Apreensão é fundamental na avaliação de instabilidade. Combine com Teste de Recolocação (Relocation Test) que alivia a apreensão quando positivo, aumentando a especificidade.',
    relatedTests: ['teste-de-recolocacao', 'teste-do-sulco', 'teste-de-carga-e-deslocamento'],
    keywords: ['apreensão', 'instabilidade', 'ombro', 'luxação', 'subluxação']
  },
  // JOELHO
  {
    id: 'teste-lachman',
    slug: 'teste-de-lachman',
    category: 'testes-ortopedicos',
    title: 'Teste de Lachman',
    metaDescription: 'Teste de Lachman para lesão do LCA. Técnica correta, interpretação dos graus de frouxidão e aplicação clínica.',
    introduction: 'O Teste de Lachman é considerado o teste clínico mais sensível e específico para avaliação da integridade do ligamento cruzado anterior (LCA). É superior à gaveta anterior por reduzir a influência dos isquiotibiais.',
    indications: [
      'Suspeita de lesão do LCA',
      'Trauma em valgo/rotação do joelho',
      'Instabilidade anterior do joelho',
      'Avaliação pós-trauma agudo'
    ],
    howTo: [
      'Paciente em decúbito dorsal, relaxado',
      'Joelho em 20-30° de flexão',
      'Estabilize o fêmur distal com uma mão',
      'Com a outra mão, segure a tíbia proximal',
      'Aplique força anterior na tíbia',
      'Avalie a translação e o end-point'
    ],
    interpretation: {
      positive: 'Translação anterior aumentada e/ou end-point macio (soft end-point)',
      negative: 'Translação normal com end-point firme',
      notes: 'Grau I: 3-5mm; Grau II: 5-10mm; Grau III: >10mm de translação'
    },
    evidence: {
      sensitivity: '85-98%',
      specificity: '94-99%',
      references: [
        'Torg JS et al. Clinical diagnosis of anterior cruciate ligament instability. Am J Sports Med. 1976',
        'Benjaminse A et al. Clinical diagnosis of an anterior cruciate ligament rupture. BMC Musculoskelet Disord. 2006'
      ]
    },
    clinicalApplication: 'O Lachman é o teste de escolha para LCA, especialmente na fase aguda quando derrame e dor limitam outros testes. A qualidade do end-point é tão importante quanto a quantidade de translação.',
    relatedTests: ['teste-da-gaveta-anterior', 'pivot-shift', 'teste-de-mcmurray'],
    keywords: ['lachman', 'LCA', 'ligamento cruzado anterior', 'joelho', 'instabilidade']
  },
  {
    id: 'teste-mcmurray',
    slug: 'teste-de-mcmurray',
    category: 'testes-ortopedicos',
    title: 'Teste de McMurray',
    metaDescription: 'Teste de McMurray para lesão meniscal. Aprenda a técnica correta para menisco medial e lateral, interpretação e evidências.',
    introduction: 'O Teste de McMurray avalia lesões meniscais através de estresse rotacional combinado com extensão do joelho. É um dos testes mais utilizados na prática clínica para patologia meniscal.',
    indications: [
      'Suspeita de lesão meniscal',
      'Dor na interlinha articular',
      'Bloqueio articular',
      'Estalidos durante movimento do joelho'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Flexione completamente o joelho',
      'Para menisco medial: rotação externa + estresse em valgo',
      'Para menisco lateral: rotação interna + estresse em varo',
      'Mantenha a rotação e estenda lentamente o joelho',
      'Palpe a interlinha articular durante o movimento'
    ],
    interpretation: {
      positive: 'Estalido palpável ou audível na interlinha articular com reprodução da dor',
      negative: 'Movimento suave sem estalidos ou dor',
      notes: 'Mais sensível para lesões do corno posterior; pode ser negativo em lesões do corno anterior'
    },
    evidence: {
      sensitivity: '53-97%',
      specificity: '59-97%',
      references: [
        'McMurray TP. The semilunar cartilages. Br J Surg. 1942',
        'Hegedus EJ et al. Physical examination tests for meniscal lesions. J Athl Train. 2007'
      ]
    },
    clinicalApplication: 'A variabilidade diagnóstica do McMurray reflete a técnica do examinador. Combine com Thessaly, Apley e palpação da interlinha para aumentar a acurácia. Correlacione sempre com história clínica.',
    relatedTests: ['teste-de-apley', 'teste-de-thessaly', 'teste-de-steinmann'],
    keywords: ['mcmurray', 'menisco', 'lesão meniscal', 'joelho', 'interlinha']
  },
  {
    id: 'teste-gaveta-anterior',
    slug: 'teste-da-gaveta-anterior',
    category: 'testes-ortopedicos',
    title: 'Teste da Gaveta Anterior',
    metaDescription: 'Teste da Gaveta Anterior para avaliação do LCA. Técnica, posicionamento correto e comparação com Lachman.',
    introduction: 'O Teste da Gaveta Anterior avalia a integridade do ligamento cruzado anterior (LCA) através da translação tibial anterior com o joelho em 90° de flexão.',
    indications: [
      'Suspeita de lesão do LCA',
      'Instabilidade anterior do joelho',
      'Complemento ao Teste de Lachman',
      'Avaliação de frouxidão ligamentar'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Quadril em 45° de flexão, joelho em 90°',
      'Sente-se sobre o pé do paciente para estabilizar',
      'Posicione as mãos na tíbia proximal',
      'Verifique relaxamento dos isquiotibiais',
      'Aplique força anterior na tíbia'
    ],
    interpretation: {
      positive: 'Translação anterior excessiva comparada ao lado contralateral',
      negative: 'Translação simétrica e limitada',
      notes: 'A contração dos isquiotibiais pode mascarar frouxidão - garanta relaxamento muscular'
    },
    evidence: {
      sensitivity: '55-92%',
      specificity: '88-98%',
      references: [
        'Mitsou A, Vallianatos P. Clinical diagnosis of ruptures of the anterior cruciate ligament. Acta Orthop Belg. 1988',
        'Ostrowski JA. Accuracy of 3 diagnostic tests for anterior cruciate ligament tears. J Athl Train. 2006'
      ]
    },
    clinicalApplication: 'A Gaveta Anterior é menos sensível que o Lachman na fase aguda devido à posição de 90° que tensiona os isquiotibiais. Útil como teste complementar e para avaliar instabilidade rotacional.',
    relatedTests: ['teste-de-lachman', 'pivot-shift', 'teste-da-gaveta-posterior'],
    keywords: ['gaveta anterior', 'LCA', 'joelho', 'ligamento cruzado', 'instabilidade']
  },
  {
    id: 'pivot-shift',
    slug: 'teste-pivot-shift',
    category: 'testes-ortopedicos',
    title: 'Teste Pivot Shift',
    metaDescription: 'Pivot Shift Test para instabilidade rotatória do joelho. Técnica avançada, interpretação e significado clínico.',
    introduction: 'O Pivot Shift avalia a instabilidade rotatória anterolateral do joelho, reproduzindo o mecanismo de falseio relatado pelo paciente. É considerado o teste mais específico para lesão do LCA.',
    indications: [
      'Suspeita de lesão do LCA',
      'Queixa de falseio ou giving way',
      'Instabilidade funcional do joelho',
      'Avaliação pré-cirúrgica'
    ],
    howTo: [
      'Paciente em decúbito dorsal, relaxado',
      'Segure o pé/tornozelo com uma mão',
      'Aplique rotação interna da tíbia',
      'Com a outra mão, aplique estresse em valgo no joelho',
      'Mantenha as forças e flexione progressivamente o joelho',
      'Observe subluxação e redução entre 20-40° de flexão'
    ],
    interpretation: {
      positive: 'Subluxação da tíbia em extensão com redução súbita (clunk) durante a flexão',
      negative: 'Movimento suave sem subluxação ou redução',
      notes: 'Graduação: Grau I (deslizamento), Grau II (clunk), Grau III (bloqueio transitório)'
    },
    evidence: {
      sensitivity: '24-98%',
      specificity: '98-100%',
      references: [
        'Galway HR, MacIntosh DL. The lateral pivot shift: a symptom and sign of anterior cruciate ligament insufficiency. Clin Orthop. 1980',
        'Lelli A et al. The pivot shift test. Knee Surg Sports Traumatol Arthrosc. 2016'
      ]
    },
    clinicalApplication: 'A alta especificidade torna o Pivot Shift valioso quando positivo. A baixa sensibilidade em pacientes acordados é compensada pela avaliação sob anestesia. Correlaciona-se com instabilidade funcional.',
    relatedTests: ['teste-de-lachman', 'teste-da-gaveta-anterior', 'teste-de-mcmurray'],
    keywords: ['pivot shift', 'LCA', 'instabilidade rotatória', 'joelho', 'falseio']
  },
  // COLUNA
  {
    id: 'teste-lasegue',
    slug: 'teste-de-lasegue',
    category: 'testes-ortopedicos',
    title: 'Teste de Lasègue (Elevação da Perna Reta)',
    metaDescription: 'Teste de Lasègue ou SLR para radiculopatia lombar. Técnica, variações, interpretação e evidência científica.',
    introduction: 'O Teste de Lasègue, também conhecido como Straight Leg Raise (SLR), avalia a tensão neural da raiz lombar, principalmente L5 e S1. É fundamental no diagnóstico de radiculopatia por hérnia discal.',
    indications: [
      'Suspeita de hérnia discal lombar',
      'Dor lombar com irradiação para membro inferior',
      'Parestesias no dermátomo L5-S1',
      'Diagnóstico diferencial de ciatalgia'
    ],
    howTo: [
      'Paciente em decúbito dorsal, relaxado',
      'Mantenha o joelho em extensão completa',
      'Eleve passivamente a perna pelo calcanhar',
      'Observe a angulação em que a dor inicia',
      'Note a distribuição da dor (lombar vs. radicular)',
      'Sensibilize com dorsiflexão do tornozelo se necessário'
    ],
    interpretation: {
      positive: 'Dor radicular reproduzida entre 30° e 70° de elevação, com distribuição no trajeto do nervo ciático',
      negative: 'Ausência de dor radicular ou dor apenas na região posterior da coxa (tensão muscular)',
      notes: 'Dor abaixo de 30° sugere irritabilidade extrema ou componente não orgânico; acima de 70° indica tensão muscular'
    },
    evidence: {
      sensitivity: '91%',
      specificity: '26%',
      references: [
        'Lasègue C. Considérations sur la sciatique. Arch Gen Med. 1864',
        'Devillé WL et al. The test of Lasègue: systematic review of the accuracy in diagnosing herniated discs. Spine. 2000'
      ]
    },
    clinicalApplication: 'Alta sensibilidade torna o Lasègue excelente para triagem. A baixa especificidade exige combinação com outros achados (déficit neurológico, reflexos, dermátomos). O Lasègue cruzado é mais específico.',
    relatedTests: ['teste-de-lasegue-cruzado', 'teste-de-slump', 'teste-de-spurling'],
    keywords: ['lasègue', 'elevação perna reta', 'SLR', 'hérnia disco', 'ciática', 'radiculopatia']
  },
  {
    id: 'teste-lasegue-cruzado',
    slug: 'teste-de-lasegue-cruzado',
    category: 'testes-ortopedicos',
    title: 'Teste de Lasègue Cruzado',
    metaDescription: 'Teste de Lasègue Cruzado (Well Leg Raise) para hérnia discal. Alta especificidade para compressão radicular.',
    introduction: 'O Teste de Lasègue Cruzado ou Well Leg Raise avalia tensão radicular através da elevação da perna assintomática. É altamente específico para hérnia discal com compressão radicular significativa.',
    indications: [
      'Confirmação de hérnia discal',
      'Lasègue positivo ipsilateral',
      'Suspeita de hérnia extrusada ou sequestrada',
      'Avaliação de gravidade da compressão'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Eleve a perna ASSINTOMÁTICA (contralateral)',
      'Mantenha joelho em extensão',
      'Observe se há reprodução da dor na perna sintomática',
      'Note a angulação de início dos sintomas'
    ],
    interpretation: {
      positive: 'Dor radicular reproduzida na perna SINTOMÁTICA quando a perna assintomática é elevada',
      negative: 'Sem reprodução de sintomas na perna oposta',
      notes: 'Sugere hérnia medial ou grande o suficiente para tracionar a raiz contralateral'
    },
    evidence: {
      sensitivity: '29%',
      specificity: '88%',
      references: [
        'Woodhall B, Hayes GJ. The well-leg-raising test of Fajersztajn in the diagnosis of ruptured lumbar intervertebral disc. J Bone Joint Surg Am. 1950',
        'Rabin A et al. The sensitivity of the crossed straight leg raise test. J Orthop Sports Phys Ther. 2007'
      ]
    },
    clinicalApplication: 'A alta especificidade do Lasègue cruzado indica provável necessidade de intervenção. Quando positivo junto com Lasègue ipsilateral e déficit neurológico, fortalece indicação de avaliação cirúrgica.',
    relatedTests: ['teste-de-lasegue', 'teste-de-slump', 'teste-neurologico'],
    keywords: ['lasègue cruzado', 'well leg raise', 'hérnia disco', 'radiculopatia', 'ciática']
  },
  {
    id: 'teste-spurling',
    slug: 'teste-de-spurling',
    category: 'testes-ortopedicos',
    title: 'Teste de Spurling',
    metaDescription: 'Teste de Spurling para radiculopatia cervical. Técnica segura, variações e interpretação clínica.',
    introduction: 'O Teste de Spurling avalia compressão radicular cervical através de carga axial com extensão e rotação lateral da coluna cervical. Estreita o forame intervertebral, reproduzindo sintomas radiculares.',
    indications: [
      'Dor cervical com irradiação para membro superior',
      'Suspeita de radiculopatia cervical',
      'Parestesias em dermátomo cervical',
      'Diagnóstico diferencial de cervicobraquialgia'
    ],
    howTo: [
      'Paciente sentado',
      'Realize extensão cervical passiva',
      'Adicione rotação lateral para o lado sintomático',
      'Aplique compressão axial suave sobre a cabeça',
      'Mantenha por alguns segundos',
      'NUNCA force em caso de dor intensa ou sinais de alerta'
    ],
    interpretation: {
      positive: 'Reprodução ou exacerbação da dor radicular no membro superior ipsilateral',
      negative: 'Apenas dor local ou sem reprodução de sintomas',
      notes: 'A compressão axial pode ser omitida inicialmente (Teste de Spurling A vs. B)'
    },
    evidence: {
      sensitivity: '50%',
      specificity: '86-100%',
      references: [
        'Spurling RG, Scoville WB. Lateral rupture of the cervical intervertebral discs. Surg Gynecol Obstet. 1944',
        'Wainner RS et al. Reliability and diagnostic accuracy of the clinical examination for cervical radiculopathy. Spine. 2003'
      ]
    },
    clinicalApplication: 'A alta especificidade torna o Spurling útil para confirmar radiculopatia. Combine com Teste de Distração (que alivia sintomas) e avaliação neurológica completa. Atenção a red flags cervicais.',
    relatedTests: ['teste-de-distracao-cervical', 'teste-de-tensao-ulnar', 'teste-de-roos'],
    keywords: ['spurling', 'radiculopatia cervical', 'compressão foraminal', 'cervical', 'cervicobraquialgia']
  },
  {
    id: 'teste-slump',
    slug: 'teste-de-slump',
    category: 'testes-ortopedicos',
    title: 'Teste de Slump',
    metaDescription: 'Teste de Slump para tensão neural. Técnica completa, sequência de manobras e interpretação clínica.',
    introduction: 'O Teste de Slump avalia a mecanossensibilidade do sistema nervoso através de uma série de manobras que tensionam progressivamente o neuroeixo. É mais sensível que o Lasègue isolado.',
    indications: [
      'Dor lombar com componente radicular',
      'Suspeita de tensão neural adversa',
      'Lasègue negativo com suspeita clínica',
      'Avaliação de sensibilização central'
    ],
    howTo: [
      'Paciente sentado na beira da maca',
      'Solicite flexão torácica e lombar (slump)',
      'Adicione flexão cervical (queixo no peito)',
      'Mantenha a posição e estenda o joelho',
      'Adicione dorsiflexão do tornozelo',
      'Libere a flexão cervical e observe mudança nos sintomas'
    ],
    interpretation: {
      positive: 'Reprodução dos sintomas com sensibilização que DIMINUI ao liberar a flexão cervical',
      negative: 'Sintomas que não mudam com liberação cervical ou ausência de reprodução',
      notes: 'A diferenciação estrutural (liberação cervical) é essencial para interpretação válida'
    },
    evidence: {
      sensitivity: '84%',
      specificity: '83%',
      references: [
        'Maitland GD. The slump test. Aust J Physiother. 1985',
        'Majlesi J et al. The sensitivity and specificity of the Slump test. Spine. 2008'
      ]
    },
    clinicalApplication: 'O Slump é preferível ao Lasègue em pacientes sentados ou quando há dúvida diagnóstica. A resposta à diferenciação estrutural confirma origem neural. Útil para guiar tratamento com mobilização neural.',
    relatedTests: ['teste-de-lasegue', 'teste-de-lasegue-cruzado', 'teste-de-tensao-ulnar'],
    keywords: ['slump test', 'tensão neural', 'radiculopatia', 'dor lombar', 'neurodinâmica']
  },
  // MÃO E PUNHO
  {
    id: 'teste-phalen',
    slug: 'teste-de-phalen',
    category: 'testes-ortopedicos',
    title: 'Teste de Phalen',
    metaDescription: 'Teste de Phalen para síndrome do túnel do carpo. Técnica, tempo de positividade e interpretação clínica.',
    introduction: 'O Teste de Phalen avalia a síndrome do túnel do carpo através da flexão máxima do punho, que aumenta a pressão no canal carpiano e comprime o nervo mediano.',
    indications: [
      'Parestesias noturnas na mão',
      'Dormência nos dedos polegar, indicador e médio',
      'Suspeita de síndrome do túnel do carpo',
      'Dor ou fraqueza na mão'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Posicione os punhos em flexão máxima',
      'Dorsos das mãos em contato (posição de oração invertida)',
      'Mantenha a posição por 60 segundos',
      'Observe o tempo de início dos sintomas',
      'Compare bilateralmente'
    ],
    interpretation: {
      positive: 'Parestesias ou dormência no território do nervo mediano dentro de 60 segundos',
      negative: 'Ausência de sintomas durante o período do teste',
      notes: 'Quanto mais rápido o início dos sintomas, mais severa a compressão'
    },
    evidence: {
      sensitivity: '68-73%',
      specificity: '73-83%',
      references: [
        'Phalen GS. The carpal-tunnel syndrome. J Bone Joint Surg Am. 1966',
        'MacDermid JC, Wessel J. Clinical diagnosis of carpal tunnel syndrome: a systematic review. J Hand Ther. 2004'
      ]
    },
    clinicalApplication: 'Combine Phalen com Tinel, Durkan e avaliação de sensibilidade para cluster diagnóstico. A eletroneuromiografia continua sendo padrão-ouro, mas estes testes orientam a investigação inicial.',
    relatedTests: ['teste-de-tinel', 'teste-de-durkan', 'teste-de-discriminacao-dois-pontos'],
    keywords: ['phalen', 'túnel do carpo', 'síndrome compressiva', 'nervo mediano', 'punho']
  },
  {
    id: 'teste-tinel',
    slug: 'teste-de-tinel',
    category: 'testes-ortopedicos',
    title: 'Teste de Tinel',
    metaDescription: 'Teste de Tinel para neuropatias compressivas. Aplicação no túnel do carpo, cotovelo e outras regiões.',
    introduction: 'O Sinal de Tinel avalia irritabilidade neural através de percussão sobre o trajeto de um nervo periférico. Originalmente descrito para regeneração nervosa, é amplamente usado em neuropatias compressivas.',
    indications: [
      'Suspeita de síndrome do túnel do carpo',
      'Neuropatia ulnar no cotovelo',
      'Avaliação de regeneração nervosa pós-lesão',
      'Síndromes compressivas periféricas'
    ],
    howTo: [
      'Identifique o trajeto do nervo a ser avaliado',
      'Para túnel do carpo: percuta sobre o retináculo flexor',
      'Para nervo ulnar: percuta sobre o sulco ulnar',
      'Use a ponta do dedo ou martelo de reflexo',
      'Aplique percussões suaves e repetidas',
      'Observe parestesias distais ao ponto de percussão'
    ],
    interpretation: {
      positive: 'Parestesias ou choque elétrico irradiando distalmente no território do nervo',
      negative: 'Desconforto local sem irradiação distal',
      notes: 'Falso positivo pode ocorrer em indivíduos normais - correlacione com clínica'
    },
    evidence: {
      sensitivity: '50-70%',
      specificity: '77-94%',
      references: [
        'Tinel J. Le signe du fourmillement dans les lésions des nerfs périphériques. Presse Med. 1915',
        'Massy-Westropp N et al. A systematic review of the clinical diagnostic tests for carpal tunnel syndrome. J Hand Surg Am. 2000'
      ]
    },
    clinicalApplication: 'O Tinel isolado tem utilidade limitada. Seu valor aumenta quando combinado com Phalen e Durkan em cluster. Útil também para mapear progressão de regeneração após reparo nervoso.',
    relatedTests: ['teste-de-phalen', 'teste-de-durkan', 'teste-de-froment'],
    keywords: ['tinel', 'neuropatia compressiva', 'nervo mediano', 'túnel carpo', 'nervo ulnar']
  },
  // COLUNA LOMBAR
  {
    id: 'teste-extensao-sustentada',
    slug: 'teste-de-extensao-sustentada',
    category: 'testes-ortopedicos',
    title: 'Teste de Extensão Sustentada',
    metaDescription: 'Teste de Extensão Sustentada para estenose espinal e síndrome facetária. Técnica e interpretação clínica.',
    introduction: 'O Teste de Extensão Sustentada avalia a tolerância à extensão lombar, sendo positivo em estenose espinal (que piora) e preferência de extensão em discopatias (que melhora).',
    indications: [
      'Claudicação neurogênica',
      'Suspeita de estenose do canal vertebral',
      'Dor lombar com irradiação bilateral',
      'Diagnóstico diferencial de dor lombar'
    ],
    howTo: [
      'Paciente em pé',
      'Solicite extensão lombar ativa',
      'Mantenha a posição por 30 segundos',
      'Observe início e localização dos sintomas',
      'Compare com teste em flexão',
      'Avalie também a marcha em extensão'
    ],
    interpretation: {
      positive: 'Dor lombar ou radicular que inicia ou piora com extensão sustentada',
      negative: 'Tolerância à posição sem exacerbação de sintomas',
      notes: 'Em estenose, os sintomas tipicamente aliviam com flexão do tronco'
    },
    evidence: {
      sensitivity: '65%',
      specificity: '70%',
      references: [
        'Fritz JM et al. Lumbar spinal stenosis: a review of current concepts in evaluation. Arch Phys Med Rehabil. 1998',
        'Cook C et al. The clinical value of a cluster of patient history and observational findings. Physiother Res Int. 2011'
      ]
    },
    clinicalApplication: 'Combine com história de claudicação neurogênica e teste de inclinação do carrinho de compras (shopping cart sign). A preferência por flexão é característica da estenose espinal.',
    relatedTests: ['teste-da-marcha', 'teste-de-lasegue', 'teste-de-schober'],
    keywords: ['extensão sustentada', 'estenose espinal', 'claudicação neurogênica', 'lombar', 'facetas']
  },
  // QUADRIL
  {
    id: 'teste-faber',
    slug: 'teste-de-faber-patrick',
    category: 'testes-ortopedicos',
    title: 'Teste de FABER (Patrick)',
    metaDescription: 'Teste de FABER ou Patrick para patologia do quadril e articulação sacroilíaca. Técnica e diagnóstico diferencial.',
    introduction: 'O Teste de FABER (Flexão, Abdução, Rotação Externa) ou Teste de Patrick avalia patologia do quadril e articulação sacroilíaca através de posicionamento que estressa ambas as estruturas.',
    indications: [
      'Dor no quadril ou virilha',
      'Suspeita de artrose do quadril',
      'Disfunção sacroilíaca',
      'Diagnóstico diferencial de dor lombopélvica'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Flexione o quadril e joelho do lado testado',
      'Posicione o tornozelo sobre o joelho contralateral',
      'Estabilize a EIAS contralateral',
      'Aplique pressão suave para baixo no joelho fletido',
      'Compare amplitude e reprodução de dor bilateralmente'
    ],
    interpretation: {
      positive: 'Dor na virilha sugere patologia do quadril; dor posterior sugere disfunção sacroilíaca',
      negative: 'Amplitude simétrica sem reprodução de dor',
      notes: 'A localização da dor ajuda a diferenciar origem: anterior=quadril, posterior=sacroilíaca'
    },
    evidence: {
      sensitivity: '57-77%',
      specificity: '71-100%',
      references: [
        'Patrick HT. Brachial neuritis and sciatica. JAMA. 1917',
        'Martin RL et al. Diagnostic accuracy of clinical tests for hip disorders. Phys Ther Sport. 2008'
      ]
    },
    clinicalApplication: 'O FABER é útil como teste de triagem para região do quadril. Combine com FADIR para impacto femoroacetabular e testes sacroilíacos específicos quando a dor é posterior.',
    relatedTests: ['teste-de-fadir', 'teste-de-gaenslen', 'teste-de-compressao-sacroiliaca'],
    keywords: ['faber', 'patrick', 'quadril', 'sacroilíaca', 'virilha', 'coxofemoral']
  },
  {
    id: 'teste-fadir',
    slug: 'teste-de-fadir',
    category: 'testes-ortopedicos',
    title: 'Teste de FADIR',
    metaDescription: 'Teste de FADIR para impacto femoroacetabular. Técnica, interpretação e correlação com lesão labral.',
    introduction: 'O Teste de FADIR (Flexão, Adução, Rotação Interna) é o principal teste clínico para impacto femoroacetabular (IFA) e lesões do labrum acetabular.',
    indications: [
      'Dor anterior do quadril ou virilha',
      'Suspeita de impacto femoroacetabular',
      'Lesão labral do quadril',
      'Dor com atividades de flexão profunda'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Flexione o quadril a 90°',
      'Adicione adução cruzando a linha média',
      'Realize rotação interna passiva',
      'Combine os movimentos progressivamente',
      'Observe reprodução de dor na virilha'
    ],
    interpretation: {
      positive: 'Dor na região inguinal/anterior do quadril durante a manobra',
      negative: 'Manobra indolor com amplitude normal',
      notes: 'Alta sensibilidade mas baixa especificidade - não diferencia tipo de patologia intra-articular'
    },
    evidence: {
      sensitivity: '94-99%',
      specificity: '5-17%',
      references: [
        'Clohisy JC et al. Clinical presentation of patients with symptomatic anterior hip impingement. Clin Orthop Relat Res. 2009',
        'Reiman MP et al. Diagnostic accuracy of clinical tests for the diagnosis of hip FAI. Br J Sports Med. 2015'
      ]
    },
    clinicalApplication: 'A alta sensibilidade torna o FADIR excelente para triagem - um teste negativo praticamente exclui IFA. A baixa especificidade exige correlação com imagem (artro-RM) para diagnóstico definitivo.',
    relatedTests: ['teste-de-faber', 'teste-de-log-roll', 'teste-de-stinchfield'],
    keywords: ['fadir', 'impacto femoroacetabular', 'quadril', 'labrum', 'virilha']
  },
  // TORNOZELO
  {
    id: 'teste-gaveta-anterior-tornozelo',
    slug: 'teste-da-gaveta-anterior-do-tornozelo',
    category: 'testes-ortopedicos',
    title: 'Teste da Gaveta Anterior do Tornozelo',
    metaDescription: 'Gaveta Anterior do tornozelo para instabilidade ligamentar. Avaliação do LTFA e estabilidade talocrural.',
    introduction: 'O Teste da Gaveta Anterior do Tornozelo avalia a integridade do ligamento talofibular anterior (LTFA), o ligamento mais frequentemente lesado em entorses de tornozelo.',
    indications: [
      'Entorse de tornozelo em inversão',
      'Instabilidade crônica do tornozelo',
      'Sensação de falseio no tornozelo',
      'Avaliação pré-retorno ao esporte'
    ],
    howTo: [
      'Paciente sentado com joelho fletido a 90°',
      'Tornozelo em posição neutra ou leve flexão plantar',
      'Estabilize a tíbia distal com uma mão',
      'Com a outra mão, segure o calcâneo',
      'Aplique força anterior no calcâneo',
      'Compare translação e end-point bilateralmente'
    ],
    interpretation: {
      positive: 'Translação anterior excessiva e/ou end-point macio comparado ao lado contralateral',
      negative: 'Translação simétrica com end-point firme',
      notes: 'Teste em flexão plantar isola mais o LTFA; em dorsiflexão recruta o ligamento calcaneofibular'
    },
    evidence: {
      sensitivity: '73-96%',
      specificity: '33-84%',
      references: [
        'Phisitkul P et al. Accuracy of physical examination tests for chronic ankle instability. Foot Ankle Int. 2009',
        'Van Dijk CN et al. Diagnosis of ligament rupture of the ankle joint. Acta Orthop Scand. 1996'
      ]
    },
    clinicalApplication: 'Avalie sempre ambos os tornozelos para comparação. Em lesões agudas, dor e edema podem limitar a avaliação. Combine com Tilt Test para avaliação completa da estabilidade lateral.',
    relatedTests: ['teste-de-inclinacao-talar', 'teste-de-compressao-fibular', 'teste-de-thompson'],
    keywords: ['gaveta anterior', 'tornozelo', 'LTFA', 'entorse', 'instabilidade']
  },
  {
    id: 'teste-thompson',
    slug: 'teste-de-thompson',
    category: 'testes-ortopedicos',
    title: 'Teste de Thompson (Simmonds)',
    metaDescription: 'Teste de Thompson para ruptura do tendão de Aquiles. Diagnóstico clínico rápido e confiável.',
    introduction: 'O Teste de Thompson ou Simmonds avalia a continuidade do tendão de Aquiles. É o teste clínico mais confiável para diagnóstico de ruptura aguda do tendão calcâneo.',
    indications: [
      'Suspeita de ruptura do tendão de Aquiles',
      'Trauma ou dor súbita na panturrilha',
      'Sensação de "pedrada" na região posterior da perna',
      'Incapacidade de realizar flexão plantar resistida'
    ],
    howTo: [
      'Paciente em decúbito ventral',
      'Pés fora da maca',
      'Comprima firmemente a panturrilha (ventre muscular)',
      'Observe o movimento do pé',
      'Compare bilateralmente',
      'Realize também inspeção e palpação do tendão'
    ],
    interpretation: {
      positive: 'Ausência de flexão plantar do pé quando a panturrilha é comprimida',
      negative: 'Flexão plantar presente, indicando continuidade do tendão',
      notes: 'Pode haver falso negativo se plantares acessórios estiverem intactos'
    },
    evidence: {
      sensitivity: '96-100%',
      specificity: '93-100%',
      references: [
        'Thompson TC, Doherty JH. Spontaneous rupture of tendon of Achilles. J Trauma. 1962',
        'Maffulli N. The clinical diagnosis of subcutaneous tear of the Achilles tendon. Am J Sports Med. 1998'
      ]
    },
    clinicalApplication: 'O Thompson é decisivo: positivo indica ruptura com alta probabilidade. Combine com palpação de gap, teste de Matles (assimetria em decúbito ventral) e avaliação funcional para decisão terapêutica.',
    relatedTests: ['teste-de-matles', 'teste-de-compressao-panturrilha', 'avaliacao-funcional-tornozelo'],
    keywords: ['thompson', 'simmonds', 'tendão de aquiles', 'ruptura', 'panturrilha']
  },
  // ADICIONAIS OMBRO
  {
    id: 'teste-drop-arm',
    slug: 'teste-do-braco-caido',
    category: 'testes-ortopedicos',
    title: 'Teste do Braço Caído (Drop Arm)',
    metaDescription: 'Teste do Braço Caído para lesão do manguito rotador. Avaliação de rupturas completas do supraespinal.',
    introduction: 'O Teste do Braço Caído avalia a integridade do manguito rotador, especialmente lesões extensas. A incapacidade de controlar a descida do braço indica comprometimento significativo.',
    indications: [
      'Suspeita de ruptura extensa do manguito',
      'Fraqueza significativa na abdução',
      'Perda da função do ombro',
      'Diagnóstico diferencial de pseudoparalisia'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Eleve passivamente o braço a 90° de abdução',
      'Solicite que o paciente mantenha a posição',
      'Peça para descer o braço lentamente',
      'Observe controle do movimento',
      'Aplique leve resistência para baixo se necessário'
    ],
    interpretation: {
      positive: 'Incapacidade de manter a abdução ou queda súbita do braço',
      negative: 'Controle adequado durante toda a descida',
      notes: 'Dor intensa pode causar falso positivo - diferencie de fraqueza verdadeira'
    },
    evidence: {
      sensitivity: '27-73%',
      specificity: '77-98%',
      references: [
        'Codman EA. The Shoulder. Thomas Todd Company. 1934',
        'Park HB et al. Diagnostic accuracy of clinical tests for rotator cuff tears. Am J Sports Med. 2005'
      ]
    },
    clinicalApplication: 'O Drop Arm positivo sugere lesão grande ou maciça do manguito. Útil para triagem de candidatos à cirurgia. Combine com outros testes do manguito e avaliação de força segmentar.',
    relatedTests: ['teste-de-jobe', 'teste-do-infraespinal', 'teste-de-gerber'],
    keywords: ['drop arm', 'braço caído', 'manguito rotador', 'supraespinal', 'ruptura']
  },
  {
    id: 'teste-gerber',
    slug: 'teste-de-gerber-lift-off',
    category: 'testes-ortopedicos',
    title: 'Teste de Gerber (Lift-off)',
    metaDescription: 'Teste de Gerber ou Lift-off para avaliação do músculo subescapular. Técnica, variações e interpretação.',
    introduction: 'O Teste de Gerber ou Lift-off Test avalia a integridade e força do músculo subescapular, o principal rotador interno do ombro e componente anterior do manguito rotador.',
    indications: [
      'Suspeita de lesão do subescapular',
      'Dor anterior do ombro',
      'Fraqueza em rotação interna',
      'Avaliação completa do manguito rotador'
    ],
    howTo: [
      'Paciente em pé',
      'Posicione a mão nas costas (região lombar)',
      'Dorso da mão em contato com as costas',
      'Solicite que afaste a mão das costas',
      'Aplique resistência ao movimento',
      'Compare força e dor bilateralmente'
    ],
    interpretation: {
      positive: 'Incapacidade de afastar a mão das costas ou fraqueza significativa',
      negative: 'Força normal para afastar a mão das costas',
      notes: 'O Belly Press Test é alternativa quando há limitação de rotação interna'
    },
    evidence: {
      sensitivity: '18-92%',
      specificity: '61-100%',
      references: [
        'Gerber C, Krushell RJ. Isolated rupture of the tendon of the subscapularis muscle. J Bone Joint Surg Br. 1991',
        'Bartsch M et al. Diagnostic values of clinical tests for subscapularis lesions. Knee Surg Sports Traumatol Arthrosc. 2010'
      ]
    },
    clinicalApplication: 'O Lift-off pode ser limitado por dor ou rigidez. Nesses casos, use o Belly Press Test ou Bear Hug Test. A lesão do subescapular frequentemente acompanha instabilidade anterior.',
    relatedTests: ['teste-belly-press', 'teste-bear-hug', 'teste-de-jobe'],
    keywords: ['gerber', 'lift-off', 'subescapular', 'manguito rotador', 'rotação interna']
  },
  {
    id: 'teste-infraespinal',
    slug: 'teste-do-infraespinal',
    category: 'testes-ortopedicos',
    title: 'Teste do Infraespinal (Rotação Externa)',
    metaDescription: 'Teste do Infraespinal para avaliação da rotação externa do ombro. Força e integridade do manguito posterior.',
    introduction: 'O Teste do Infraespinal avalia a força e integridade do músculo infraespinal, principal rotador externo do ombro e componente posterior do manguito rotador.',
    indications: [
      'Suspeita de lesão do infraespinal',
      'Fraqueza em rotação externa',
      'Dor posterolateral do ombro',
      'Avaliação completa do manguito rotador'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Cotovelo fletido a 90° junto ao corpo',
      'Braço em posição neutra de rotação',
      'Solicite rotação externa ativa contra resistência',
      'Observe lag sign (queda do antebraço)',
      'Compare força bilateralmente'
    ],
    interpretation: {
      positive: 'Fraqueza em rotação externa ou lag sign (incapacidade de manter posição)',
      negative: 'Força de rotação externa normal e simétrica',
      notes: 'O External Rotation Lag Sign é mais específico para rupturas completas'
    },
    evidence: {
      sensitivity: '42-91%',
      specificity: '54-93%',
      references: [
        'Hertel R et al. Lag signs in the diagnosis of rotator cuff rupture. J Shoulder Elbow Surg. 1996',
        'Miller CA et al. Diagnostic accuracy of physical examination tests for infraspinatus tendon tears. J Shoulder Elbow Surg. 2008'
      ]
    },
    clinicalApplication: 'Combine com Hornblower Sign e avaliação do redondo menor para manguito posterior. Fraqueza importante em rotação externa compromete função do ombro e pode indicar tratamento cirúrgico.',
    relatedTests: ['teste-de-jobe', 'teste-de-gerber', 'teste-hornblower'],
    keywords: ['infraespinal', 'rotação externa', 'manguito rotador', 'ombro', 'lag sign']
  },
  {
    id: 'teste-obrien',
    slug: 'teste-de-obrien',
    category: 'testes-ortopedicos',
    title: 'Teste de O\'Brien (Active Compression)',
    metaDescription: 'Teste de O\'Brien para lesão SLAP e articulação acromioclavicular. Técnica e diferenciação diagnóstica.',
    introduction: 'O Teste de O\'Brien ou Active Compression Test avalia lesões do labrum superior (SLAP) e patologia da articulação acromioclavicular através de compressão ativa em duas posições.',
    indications: [
      'Dor profunda no ombro',
      'Suspeita de lesão SLAP',
      'Dor na articulação acromioclavicular',
      'Estalidos ou sensação de instabilidade'
    ],
    howTo: [
      'Paciente em pé ou sentado',
      'Ombro em 90° de flexão e 10-15° de adução',
      'Cotovelo em extensão',
      'Primeiro: pronação máxima (polegar para baixo)',
      'Aplique força para baixo - observe dor',
      'Repita em supinação (polegar para cima) - observe mudança'
    ],
    interpretation: {
      positive: 'Dor profunda em pronação que MELHORA com supinação = SLAP. Dor superficial/AC que NÃO muda = AC',
      negative: 'Ausência de dor em ambas as posições',
      notes: 'A localização e modificação da dor diferenciam SLAP de patologia AC'
    },
    evidence: {
      sensitivity: '47-100%',
      specificity: '11-99%',
      references: [
        'O\'Brien SJ et al. The active compression test. Am J Sports Med. 1998',
        'Hegedus EJ et al. Which physical examination tests provide clinicians with the most value? Br J Sports Med. 2012'
      ]
    },
    clinicalApplication: 'A grande variabilidade diagnóstica reflete técnica e população estudada. Use como parte de bateria para SLAP (Crank, Biceps Load II). Importante diferenciar fonte de dor: profunda vs. superficial.',
    relatedTests: ['teste-de-crank', 'teste-de-yergason', 'teste-da-articulacao-ac'],
    keywords: ['obrien', 'active compression', 'SLAP', 'labrum', 'acromioclavicular']
  },
  // JOELHO ADICIONAIS
  {
    id: 'teste-apley',
    slug: 'teste-de-apley',
    category: 'testes-ortopedicos',
    title: 'Teste de Apley (Grinding Test)',
    metaDescription: 'Teste de Apley para lesão meniscal. Compressão e distração para diferenciação de patologia meniscal e ligamentar.',
    introduction: 'O Teste de Apley avalia lesões meniscais através de compressão rotacional (grinding) e lesões capsulo-ligamentares através de distração. A comparação entre as manobras auxilia o diagnóstico diferencial.',
    indications: [
      'Suspeita de lesão meniscal',
      'Dor na interlinha articular',
      'Diagnóstico diferencial menisco vs. ligamento',
      'Complemento ao McMurray'
    ],
    howTo: [
      'Paciente em decúbito ventral',
      'Joelho fletido a 90°',
      'GRINDING: aplique compressão axial + rotação',
      'Observe dor durante rotação interna/externa',
      'DISTRAÇÃO: tracione a perna + rotação',
      'Compare os achados de compressão vs. distração'
    ],
    interpretation: {
      positive: 'Dor durante grinding (compressão + rotação) sugere lesão meniscal',
      negative: 'Ausência de dor em ambas as manobras',
      notes: 'Dor apenas na distração sugere lesão capsular/ligamentar, não meniscal'
    },
    evidence: {
      sensitivity: '38-61%',
      specificity: '80-92%',
      references: [
        'Apley AG. The diagnosis of meniscus injuries. J Bone Joint Surg Br. 1947',
        'Karachalios T et al. Diagnostic accuracy of clinical tests for meniscal lesions. J Bone Joint Surg Am. 2005'
      ]
    },
    clinicalApplication: 'O Apley é útil pela capacidade de diferenciar origem dos sintomas. A posição em decúbito ventral pode ser limitante em alguns pacientes. Combine sempre com McMurray e palpação.',
    relatedTests: ['teste-de-mcmurray', 'teste-de-thessaly', 'teste-de-steinmann'],
    keywords: ['apley', 'grinding test', 'menisco', 'joelho', 'compressão rotacional']
  },
  {
    id: 'teste-estresse-varo',
    slug: 'teste-de-estresse-em-varo',
    category: 'testes-ortopedicos',
    title: 'Teste de Estresse em Varo',
    metaDescription: 'Teste de Estresse em Varo para ligamento colateral lateral do joelho. Avaliação de instabilidade lateral.',
    introduction: 'O Teste de Estresse em Varo avalia a integridade do ligamento colateral lateral (LCL) e complexo posterolateral do joelho através de estresse em varo em diferentes graus de flexão.',
    indications: [
      'Trauma em varo do joelho',
      'Suspeita de lesão do LCL',
      'Instabilidade lateral do joelho',
      'Avaliação de lesão multiligamentar'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Teste em extensão completa e em 30° de flexão',
      'Estabilize o fêmur medialmente',
      'Aplique força em varo (abrindo lateral)',
      'Avalie abertura da interlinha lateral',
      'Compare bilateralmente'
    ],
    interpretation: {
      positive: 'Abertura excessiva da interlinha lateral com end-point macio',
      negative: 'Abertura mínima ou simétrica com end-point firme',
      notes: 'Abertura em extensão sugere lesão combinada (cápsula posterior, LCP, canto posterolateral)'
    },
    evidence: {
      sensitivity: '25%',
      specificity: '99%',
      references: [
        'Veltri DM, Warren RF. Anatomy and biomechanics of the lateral collateral ligament. J Am Acad Orthop Surg. 1994',
        'LaPrade RF et al. The posterolateral knee: evaluation and classification of injuries. Am J Sports Med. 2007'
      ]
    },
    clinicalApplication: 'O estresse em varo é altamente específico mas pouco sensível para lesões isoladas do LCL. A frouxidão em extensão completa é indicativa de lesão grave multiligamentar e requer avaliação urgente.',
    relatedTests: ['teste-de-estresse-valgo', 'teste-de-dial', 'teste-de-gaveta-posterolateral'],
    keywords: ['estresse varo', 'LCL', 'colateral lateral', 'joelho', 'instabilidade']
  },
  {
    id: 'teste-estresse-valgo',
    slug: 'teste-de-estresse-em-valgo',
    category: 'testes-ortopedicos',
    title: 'Teste de Estresse em Valgo',
    metaDescription: 'Teste de Estresse em Valgo para ligamento colateral medial. Avaliação de lesões do compartimento medial do joelho.',
    introduction: 'O Teste de Estresse em Valgo avalia a integridade do ligamento colateral medial (LCM), a estrutura mais frequentemente lesada no joelho.',
    indications: [
      'Trauma em valgo do joelho',
      'Dor na face medial do joelho',
      'Suspeita de lesão do LCM',
      'Avaliação de instabilidade medial'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Teste em extensão completa e em 30° de flexão',
      'Estabilize o fêmur lateralmente',
      'Aplique força em valgo (abrindo medial)',
      'Avalie abertura da interlinha medial',
      'Compare bilateralmente'
    ],
    interpretation: {
      positive: 'Abertura excessiva da interlinha medial com ou sem end-point',
      negative: 'Abertura mínima e simétrica com end-point firme',
      notes: 'Grau I: dor sem frouxidão; Grau II: frouxidão em 30°; Grau III: frouxidão em extensão'
    },
    evidence: {
      sensitivity: '78-91%',
      specificity: '92-96%',
      references: [
        'Phisitkul P et al. MCL injuries of the knee: current concepts review. Iowa Orthop J. 2006',
        'Bollen SR, Scott BW. Rupture of the MCL: acute repair and prognosis. Injury. 1996'
      ]
    },
    clinicalApplication: 'Abertura em 30° isola o LCM; abertura em extensão completa indica lesão associada (cápsula posteromedial, LCA). A maioria das lesões do LCM é tratada conservadoramente com sucesso.',
    relatedTests: ['teste-de-estresse-varo', 'teste-de-lachman', 'teste-de-mcmurray'],
    keywords: ['estresse valgo', 'LCM', 'colateral medial', 'joelho', 'instabilidade']
  },
  {
    id: 'teste-gaveta-posterior',
    slug: 'teste-da-gaveta-posterior',
    category: 'testes-ortopedicos',
    title: 'Teste da Gaveta Posterior',
    metaDescription: 'Gaveta Posterior para lesão do LCP. Técnica, sinal do degrau e diagnóstico de instabilidade posterior.',
    introduction: 'O Teste da Gaveta Posterior avalia a integridade do ligamento cruzado posterior (LCP) através da translação tibial posterior com o joelho em 90° de flexão.',
    indications: [
      'Trauma em hiperflexão do joelho',
      'Golpe direto na tíbia anterior',
      'Suspeita de lesão do LCP',
      'Instabilidade posterior do joelho'
    ],
    howTo: [
      'Paciente em decúbito dorsal',
      'Quadril em 45° e joelho em 90° de flexão',
      'Observe perfil da tíbia comparativamente (sinal do degrau)',
      'Sente sobre o pé para estabilizar',
      'Aplique força posterior na tíbia proximal',
      'Avalie translação e end-point'
    ],
    interpretation: {
      positive: 'Translação posterior excessiva ou perda do degrau tibial normal',
      negative: 'Translação posterior mínima e simétrica',
      notes: 'O "sag sign" (queda posterior da tíbia em repouso) indica lesão do LCP'
    },
    evidence: {
      sensitivity: '51-99%',
      specificity: '93-100%',
      references: [
        'Rubinstein RA et al. The accuracy of the clinical examination in the diagnosis of PCL injuries. Am J Sports Med. 1994',
        'Kopkow C et al. Physical examination tests for posterior cruciate ligament rupture. Cochrane Database Syst Rev. 2013'
      ]
    },
    clinicalApplication: 'Avalie sempre o "sag sign" em repouso antes de aplicar força - a tíbia pode já estar posteriorizada. A lesão do LCP frequentemente acompanha lesões do canto posterolateral.',
    relatedTests: ['teste-de-sag-sign', 'teste-de-dial', 'teste-de-quadriceps-ativo'],
    keywords: ['gaveta posterior', 'LCP', 'ligamento cruzado posterior', 'joelho', 'instabilidade']
  },
  // COLUNA ADICIONAIS
  {
    id: 'teste-kemp',
    slug: 'teste-de-kemp',
    category: 'testes-ortopedicos',
    title: 'Teste de Kemp (Quadrante)',
    metaDescription: 'Teste de Kemp ou Quadrante para dor facetária lombar. Extensão com rotação para estresse articular.',
    introduction: 'O Teste de Kemp ou Teste do Quadrante avalia dor de origem facetária através de extensão combinada com rotação lateral da coluna lombar, estressando as articulações zigapofisárias.',
    indications: [
      'Dor lombar de origem mecânica',
      'Suspeita de síndrome facetária',
      'Dor que piora com extensão',
      'Diagnóstico diferencial de lombalgia'
    ],
    howTo: [
      'Paciente em pé',
      'Terapeuta atrás, estabilizando a pelve',
      'Solicite extensão lombar ativa',
      'Adicione rotação lateral e inclinação para o lado testado',
      'Aplique compressão axial leve',
      'Observe reprodução de dor lombar localizada'
    ],
    interpretation: {
      positive: 'Dor lombar localizada no lado testado durante a manobra',
      negative: 'Ausência de dor durante a manobra composta',
      notes: 'Dor radicular durante o teste pode indicar estenose foraminal'
    },
    evidence: {
      sensitivity: '40-77%',
      specificity: '55-89%',
      references: [
        'Laslett M et al. Centralization as a predictor of provocation discography results. Spine. 2005',
        'Schneider MJ et al. Biomechanical examination of the lumbar spine. J Manipulative Physiol Ther. 2010'
      ]
    },
    clinicalApplication: 'O Kemp sugere origem facetária, mas não é patognomônico. Combine com resposta a bloqueio anestésico facetário para confirmação. Útil para guiar tratamento conservador.',
    relatedTests: ['teste-de-extensao-sustentada', 'teste-de-schober', 'teste-de-lasegue'],
    keywords: ['kemp', 'quadrante', 'facetário', 'lombar', 'extensão rotação']
  },
  // CERVICAL ADICIONAIS
  {
    id: 'teste-distracao-cervical',
    slug: 'teste-de-distracao-cervical',
    category: 'testes-ortopedicos',
    title: 'Teste de Distração Cervical',
    metaDescription: 'Teste de Distração Cervical para radiculopatia. Alívio dos sintomas com tração axial.',
    introduction: 'O Teste de Distração Cervical avalia radiculopatia cervical através da redução da compressão foraminal com tração axial. É frequentemente positivo quando Spurling também é positivo.',
    indications: [
      'Confirmação de radiculopatia cervical',
      'Spurling positivo',
      'Dor cervical com irradiação',
      'Avaliação de resposta à tração'
    ],
    howTo: [
      'Paciente sentado',
      'Posicione as mãos sob o queixo e occiput',
      'Aplique tração axial progressiva',
      'Mantenha por alguns segundos',
      'Observe modificação dos sintomas',
      'Compare com posição neutra'
    ],
    interpretation: {
      positive: 'Alívio ou redução significativa dos sintomas radiculares com tração',
      negative: 'Sem modificação dos sintomas',
      notes: 'Alívio com distração seguido de piora com compressão (Spurling) confirma origem foraminal'
    },
    evidence: {
      sensitivity: '40-50%',
      specificity: '80-90%',
      references: [
        'Wainner RS et al. Reliability and diagnostic accuracy of the cervical radiculopathy clinical examination. Spine. 2003',
        'Rubinstein SM et al. A systematic review of the diagnostic accuracy of provocative tests of the neck. Eur Spine J. 2007'
      ]
    },
    clinicalApplication: 'A distração que alivia sintomas é útil como indicador prognóstico para tração cervical terapêutica. Combine com Spurling para cluster diagnóstico de radiculopatia cervical.',
    relatedTests: ['teste-de-spurling', 'teste-de-tensao-ulnar', 'teste-neurologico-cervical'],
    keywords: ['distração cervical', 'tração', 'radiculopatia', 'cervical', 'descompressão']
  },
  // SACROILÍACA
  {
    id: 'teste-gaenslen',
    slug: 'teste-de-gaenslen',
    category: 'testes-ortopedicos',
    title: 'Teste de Gaenslen',
    metaDescription: 'Teste de Gaenslen para disfunção sacroilíaca. Estresse torsional da articulação SI.',
    introduction: 'O Teste de Gaenslen avalia a articulação sacroilíaca através de estresse torsional, hiperextendendo um quadril enquanto flexiona o contralateral.',
    indications: [
      'Dor na região sacroilíaca',
      'Suspeita de disfunção SI',
      'Dor lombopélvica posterior',
      'Diagnóstico diferencial de dor lombar baixa'
    ],
    howTo: [
      'Paciente em decúbito dorsal na beira da maca',
      'Flexione o quadril e joelho do lado testado em direção ao tórax',
      'Deixe a outra perna cair em hiperextensão fora da maca',
      'Aplique pressão para baixo na perna hiperextendida',
      'Observe reprodução de dor na região sacroilíaca',
      'Compare bilateralmente'
    ],
    interpretation: {
      positive: 'Reprodução de dor na região sacroilíaca durante o estresse torsional',
      negative: 'Ausência de dor durante a manobra',
      notes: 'A posição também estressa o quadril - diferencie origem dos sintomas'
    },
    evidence: {
      sensitivity: '50-77%',
      specificity: '26-77%',
      references: [
        'Gaenslen FJ. Sacro-iliac arthrodesis. JAMA. 1927',
        'Laslett M et al. Diagnosing painful sacroiliac joints: a validity study. Aust J Physiother. 2003'
      ]
    },
    clinicalApplication: 'Nenhum teste isolado é suficiente para diagnóstico de disfunção SI. Use o cluster de Laslett: 3 ou mais testes positivos (Gaenslen, FABER, compressão, distração, thrust sacral) indicam origem SI.',
    relatedTests: ['teste-de-faber', 'teste-de-compressao-si', 'teste-de-distracao-si'],
    keywords: ['gaenslen', 'sacroilíaca', 'SI', 'disfunção pélvica', 'estresse torsional']
  },
  {
    id: 'teste-compressao-si',
    slug: 'teste-de-compressao-sacroiliaca',
    category: 'testes-ortopedicos',
    title: 'Teste de Compressão Sacroilíaca',
    metaDescription: 'Teste de Compressão para articulação sacroilíaca. Avaliação de dor e disfunção SI.',
    introduction: 'O Teste de Compressão Sacroilíaca estressa a articulação SI através de compressão medial das cristas ilíacas, aproximando as faces anteriores da articulação.',
    indications: [
      'Dor na região sacroilíaca',
      'Suspeita de inflamação da articulação SI',
      'Parte do cluster diagnóstico para SI',
      'Dor lombopélvica posterior'
    ],
    howTo: [
      'Paciente em decúbito lateral',
      'Lado sintomático para cima',
      'Quadris e joelhos levemente fletidos',
      'Aplique pressão vertical sobre a crista ilíaca',
      'Compressão em direção à maca',
      'Observe reprodução de dor na região SI'
    ],
    interpretation: {
      positive: 'Reprodução de dor familiar na região sacroilíaca',
      negative: 'Ausência de dor ou dor apenas local',
      notes: 'A dor deve ser na articulação SI, não no quadril ou coluna'
    },
    evidence: {
      sensitivity: '69%',
      specificity: '69%',
      references: [
        'Laslett M et al. Diagnosis of sacroiliac joint pain: validity of individual provocation tests. Man Ther. 2005',
        'Van der Wurff P et al. Clinical tests of the sacroiliac joint: a systematic review. Man Ther. 2000'
      ]
    },
    clinicalApplication: 'Como teste isolado, a compressão tem valor limitado. Integre ao cluster de provocação SI. A ausência de todos os testes de provocação negativos praticamente exclui origem sacroilíaca.',
    relatedTests: ['teste-de-gaenslen', 'teste-de-faber', 'teste-de-distracao-si'],
    keywords: ['compressão', 'sacroilíaca', 'SI', 'cluster diagnóstico', 'provocação']
  },
  // TORNOZELO ADICIONAIS
  {
    id: 'teste-inclinacao-talar',
    slug: 'teste-de-inclinacao-talar',
    category: 'testes-ortopedicos',
    title: 'Teste de Inclinação Talar (Talar Tilt)',
    metaDescription: 'Teste de Inclinação Talar para instabilidade lateral do tornozelo. Avaliação do ligamento calcaneofibular.',
    introduction: 'O Teste de Inclinação Talar avalia a integridade do ligamento calcaneofibular (LCF) e estabilidade lateral do tornozelo através de estresse em inversão.',
    indications: [
      'Entorse de tornozelo em inversão',
      'Instabilidade lateral crônica',
      'Avaliação de lesão ligamentar',
      'Complemento à gaveta anterior'
    ],
    howTo: [
      'Paciente sentado com joelho fletido',
      'Tornozelo em posição neutra de flexão',
      'Estabilize a tíbia com uma mão',
      'Com a outra, segure o calcâneo',
      'Aplique força em inversão (inclinação medial do tálus)',
      'Compare abertura lateral bilateralmente'
    ],
    interpretation: {
      positive: 'Inclinação excessiva do tálus comparada ao lado contralateral',
      negative: 'Inclinação simétrica e limitada',
      notes: 'Diferença >5-10° ou end-point macio sugere lesão ligamentar'
    },
    evidence: {
      sensitivity: '50-70%',
      specificity: '75-90%',
      references: [
        'Hertel J. Functional anatomy, pathomechanics, and pathophysiology of lateral ankle instability. J Athl Train. 2002',
        'Croy T et al. Diagnostic accuracy of tests for ankle instability. J Orthop Sports Phys Ther. 2013'
      ]
    },
    clinicalApplication: 'A inclinação talar avalia principalmente o LCF, lesado em entorses mais graves (grau II-III). Combine com gaveta anterior para avaliação completa do complexo ligamentar lateral.',
    relatedTests: ['teste-da-gaveta-anterior-tornozelo', 'teste-de-thompson', 'teste-de-squeeze'],
    keywords: ['inclinação talar', 'talar tilt', 'LCF', 'tornozelo', 'inversão']
  },
  // COTOVELO
  {
    id: 'teste-cozen',
    slug: 'teste-de-cozen',
    category: 'testes-ortopedicos',
    title: 'Teste de Cozen (Epicondilite Lateral)',
    metaDescription: 'Teste de Cozen para epicondilite lateral ou cotovelo de tenista. Avaliação resistida dos extensores do punho.',
    introduction: 'O Teste de Cozen avalia epicondilite lateral (cotovelo de tenista) através de extensão resistida do punho com o cotovelo estendido, estressando a origem dos extensores no epicôndilo lateral.',
    indications: [
      'Dor lateral do cotovelo',
      'Suspeita de epicondilite lateral',
      'Dor ao segurar objetos',
      'Sintomas relacionados a movimentos repetitivos'
    ],
    howTo: [
      'Paciente sentado com cotovelo em extensão',
      'Antebraço em pronação',
      'Punho em posição neutra',
      'Solicite extensão do punho contra resistência',
      'Aplique resistência no dorso da mão',
      'Observe reprodução de dor no epicôndilo lateral'
    ],
    interpretation: {
      positive: 'Reprodução de dor no epicôndilo lateral durante extensão resistida',
      negative: 'Extensão resistida indolor',
      notes: 'Pode ser sensibilizado testando com cotovelo em diferentes graus de flexão'
    },
    evidence: {
      sensitivity: '84%',
      specificity: '63%',
      references: [
        'Cozen L. The painful elbow. Ind Med Surg. 1962',
        'Dorf ER et al. Diagnostic accuracy of provocative tests for lateral epicondylitis. Am J Sports Med. 2007'
      ]
    },
    clinicalApplication: 'Combine com teste de Mill, palpação do epicôndilo e teste de preensão. A reprodução dos sintomas funcionais confirma o diagnóstico clínico de epicondilite lateral.',
    relatedTests: ['teste-de-mill', 'teste-de-maudsley', 'teste-de-epicondilite-medial'],
    keywords: ['cozen', 'epicondilite lateral', 'cotovelo tenista', 'extensores punho', 'epicôndilo']
  },
  {
    id: 'teste-epicondilite-medial',
    slug: 'teste-de-epicondilite-medial',
    category: 'testes-ortopedicos',
    title: 'Teste de Epicondilite Medial (Cotovelo de Golfista)',
    metaDescription: 'Teste para epicondilite medial ou cotovelo de golfista. Avaliação dos flexores-pronadores do antebraço.',
    introduction: 'O Teste de Epicondilite Medial avalia a tendinopatia dos flexores-pronadores na origem do epicôndilo medial, comum em golfistas e trabalhadores que realizam preensão repetitiva.',
    indications: [
      'Dor medial do cotovelo',
      'Suspeita de epicondilite medial',
      'Dor ao apertar objetos com flexão do punho',
      'Sintomas em atividades de preensão'
    ],
    howTo: [
      'Paciente sentado',
      'Cotovelo em leve flexão, antebraço supinado',
      'Palpe o epicôndilo medial',
      'Solicite flexão do punho e pronação contra resistência',
      'Observe reprodução de dor no epicôndilo medial',
      'Compare com extensão passiva do punho'
    ],
    interpretation: {
      positive: 'Reprodução de dor no epicôndilo medial durante flexão/pronação resistida',
      negative: 'Movimentos resistidos indolores',
      notes: 'Atenção: o nervo ulnar passa próximo - diferecie de neuropatia ulnar'
    },
    evidence: {
      sensitivity: '75-96%',
      specificity: '53-87%',
      references: [
        'Descatha A et al. Medial epicondylitis: clinical and diagnostic aspects. Joint Bone Spine. 2003',
        'Shiri R et al. Prevalence and determinants of lateral and medial epicondylitis. Am J Epidemiol. 2006'
      ]
    },
    clinicalApplication: 'A proximidade do nervo ulnar exige avaliação neurológica diferencial. Palpe o sulco ulnar e realize Tinel. A epicondilite medial é menos comum que a lateral mas frequentemente mais resistente ao tratamento.',
    relatedTests: ['teste-de-cozen', 'teste-de-tinel-ulnar', 'teste-de-estresse-valgo-cotovelo'],
    keywords: ['epicondilite medial', 'cotovelo golfista', 'flexores punho', 'epicôndilo medial']
  },
  // MAIS JOELHO
  {
    id: 'teste-thessaly',
    slug: 'teste-de-thessaly',
    category: 'testes-ortopedicos',
    title: 'Teste de Thessaly',
    metaDescription: 'Teste de Thessaly para lesão meniscal. Avaliação dinâmica com carga axial e rotação.',
    introduction: 'O Teste de Thessaly avalia lesões meniscais através de carga axial em apoio unipodal com rotação, reproduzindo forças funcionais sobre os meniscos.',
    indications: [
      'Suspeita de lesão meniscal',
      'Alternativa ao McMurray',
      'Avaliação funcional do joelho',
      'Dor na interlinha articular'
    ],
    howTo: [
      'Paciente em apoio unipodal sobre a perna testada',
      'Segure as mãos do paciente para equilíbrio',
      'Joelho fletido a 5° (sensibiliza para corno posterior)',
      'Solicite rotações internas e externas do corpo',
      'Repita com joelho em 20° de flexão',
      'Observe dor ou sensação de bloqueio'
    ],
    interpretation: {
      positive: 'Dor na interlinha articular, estalido ou sensação de bloqueio durante rotação',
      negative: 'Rotações confortáveis sem sintomas',
      notes: 'Teste em 5° é mais sensível para corno posterior; 20° para corpo do menisco'
    },
    evidence: {
      sensitivity: '62-92%',
      specificity: '91-97%',
      references: [
        'Karachalios T et al. Diagnostic accuracy of a new clinical test (Thessaly test) for meniscal tears. J Bone Joint Surg Am. 2005',
        'Konan S et al. Evaluation of the clinical tests for meniscal tears. Knee. 2009'
      ]
    },
    clinicalApplication: 'O Thessaly pode ser mais específico que McMurray e mais funcional. Contrarelativo em lesões agudas, instabilidade significativa ou incapacidade de apoio unipodal.',
    relatedTests: ['teste-de-mcmurray', 'teste-de-apley', 'teste-de-steinmann'],
    keywords: ['thessaly', 'menisco', 'lesão meniscal', 'rotação', 'carga axial']
  },
  // MAIS OMBRO
  {
    id: 'teste-arco-doloroso',
    slug: 'teste-do-arco-doloroso',
    category: 'testes-ortopedicos',
    title: 'Teste do Arco Doloroso (Painful Arc)',
    metaDescription: 'Teste do Arco Doloroso para síndrome do impacto. Avaliação da dor durante abdução ativa.',
    introduction: 'O Teste do Arco Doloroso avalia a síndrome do impacto subacromial através da observação de dor durante a abdução ativa do ombro, tipicamente entre 60° e 120°.',
    indications: [
      'Dor no ombro durante elevação',
      'Suspeita de impacto subacromial',
      'Avaliação funcional do ombro',
      'Triagem de dor no ombro'
    ],
    howTo: [
      'Paciente sentado ou em pé',
      'Solicite abdução ativa lenta do ombro',
      'Observe a angulação de início e fim da dor',
      'Note qualquer alteração do ritmo escapuloumeral',
      'Compare com o lado contralateral',
      'Repita no plano escapular se necessário'
    ],
    interpretation: {
      positive: 'Dor entre 60° e 120° de abdução (arco subacromial)',
      negative: 'Abdução indolor em toda amplitude',
      notes: 'Dor acima de 120° pode indicar patologia acromioclavicular'
    },
    evidence: {
      sensitivity: '33-98%',
      specificity: '10-72%',
      references: [
        'Cyriax J. Textbook of Orthopaedic Medicine. Vol 1. 8th ed. London: Baillière Tindall. 1982',
        'Hegedus EJ et al. Physical examination tests of the shoulder. Br J Sports Med. 2008'
      ]
    },
    clinicalApplication: 'O arco doloroso é um achado funcional básico na avaliação do ombro. A combinação com Neer, Hawkins e Jobe forma um cluster eficiente para síndrome do impacto.',
    relatedTests: ['teste-de-neer', 'teste-de-hawkins', 'teste-de-jobe'],
    keywords: ['arco doloroso', 'painful arc', 'impacto', 'ombro', 'abdução']
  },
  // LOMBAR ADICIONAL
  {
    id: 'teste-schober',
    slug: 'teste-de-schober',
    category: 'testes-ortopedicos',
    title: 'Teste de Schober',
    metaDescription: 'Teste de Schober para mobilidade lombar. Avaliação objetiva da flexão da coluna lombar.',
    introduction: 'O Teste de Schober é uma medida objetiva da mobilidade lombar em flexão, útil no monitoramento de condições inflamatórias como espondilite anquilosante.',
    indications: [
      'Avaliação de mobilidade lombar',
      'Suspeita de espondilite anquilosante',
      'Monitoramento de rigidez espinal',
      'Documentação objetiva de amplitude'
    ],
    howTo: [
      'Paciente em pé, posição neutra',
      'Marque a linha das EIPS (aproximadamente S2)',
      'Marque 10 cm acima deste ponto',
      'Solicite flexão anterior máxima do tronco',
      'Meça a distância entre as marcas em flexão',
      'A diferença indica expansão lombar'
    ],
    interpretation: {
      positive: 'Expansão menor que 5 cm sugere restrição de mobilidade lombar',
      negative: 'Expansão de 5 cm ou mais indica mobilidade lombar normal',
      notes: 'O Schober Modificado usa marca 5 cm abaixo e 10 cm acima para maior sensibilidade'
    },
    evidence: {
      sensitivity: '36-95%',
      specificity: '45-100%',
      references: [
        'Schober P. The lumbar vertebral column and backache. Munch Med Wochenschr. 1937',
        'Sieper J et al. The Assessment of SpondyloArthritis Society (ASAS) handbook. Ann Rheum Dis. 2009'
      ]
    },
    clinicalApplication: 'O Schober é critério no diagnóstico de espondilite anquilosante. Útil para monitorar progressão da doença e resposta ao tratamento. Combine com medidas de expansão torácica.',
    relatedTests: ['teste-de-extensao-sustentada', 'teste-de-inclinacao-lateral', 'teste-de-lasegue'],
    keywords: ['schober', 'mobilidade lombar', 'flexão', 'espondilite', 'rigidez']
  }
];
