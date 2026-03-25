import { ClinicalPage } from './types';

export const avaliacaoClinica: ClinicalPage[] = [
  // OMBRO (5)
  {
    id: 'aval-ombro-geral',
    slug: 'avaliacao-ombro',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Ombro: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica do ombro incluindo inspeção, palpação, amplitude de movimento e testes especiais.',
    introduction: 'A avaliação do complexo do ombro requer análise sistemática das articulações glenoumeral, acromioclavicular, esternoclavicular e escapulotorácica, considerando a biomecânica integrada do membro superior.',
    objectives: [
      'Identificar a estrutura causadora dos sintomas',
      'Avaliar déficits de mobilidade e força',
      'Detectar instabilidades articulares',
      'Analisar padrões de movimento escapular',
      'Estabelecer diagnóstico fisioterapêutico funcional'
    ],
    procedures: [
      'Inspeção: postura, simetria, atrofia, cicatrizes',
      'Palpação: articulação AC, sulco bicipital, tuberosidades',
      'ADM ativa e passiva: flexão, abdução, rotações',
      'Força muscular: manguito rotador, deltóide, trapézio',
      'Testes especiais: Neer, Hawkins, Jobe, Speed'
    ],
    scales: [
      'DASH (Disabilities of the Arm, Shoulder and Hand)',
      'Constant-Murley Score',
      'ASES (American Shoulder and Elbow Surgeons)',
      'SPADI (Shoulder Pain and Disability Index)',
      'UCLA Shoulder Rating Scale'
    ],
    documentation: [
      'Registrar mecanismo de lesão e tempo de evolução',
      'Documentar ADM em graus com goniometria',
      'Descrever padrão de dor (localização, irradiação, fatores)',
      'Registrar resultados de testes especiais com interpretação',
      'Fotografar postura se alterações significativas'
    ],
    evidence: {
      references: [
        'Magee DJ. Orthopedic Physical Assessment. 7th ed. Elsevier, 2021.',
        'Hegedus EJ, et al. Physical examination tests for assessing a torn rotator cuff. Br J Sports Med. 2015.'
      ]
    },
    clinicalApplication: 'A combinação de múltiplos testes aumenta a acurácia diagnóstica. Clusters de testes positivos indicam maior probabilidade de patologia específica.',
    relatedTests: ['neer', 'hawkins-kennedy', 'jobe', 'speed', 'yergason'],
    keywords: ['avaliação ombro', 'exame físico ombro', 'fisioterapia ombro', 'manguito rotador avaliação']
  },
  {
    id: 'aval-ombro-instabilidade',
    slug: 'avaliacao-instabilidade-ombro',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Instabilidade Glenoumeral',
    metaDescription: 'Protocolo de avaliação para instabilidade do ombro: testes de apreensão, gaveta, sulco e classificação da hipermobilidade.',
    introduction: 'A instabilidade glenoumeral varia de subluxação a luxação completa, podendo ser traumática ou atraumática. A avaliação deve diferenciar direção, grau e mecanismo.',
    objectives: [
      'Determinar direção da instabilidade (anterior, posterior, multidirecional)',
      'Quantificar grau de frouxidão ligamentar',
      'Diferenciar instabilidade traumática vs atraumática',
      'Avaliar apreensão e controle neuromuscular',
      'Identificar lesões associadas (Bankart, Hill-Sachs)'
    ],
    procedures: [
      'Teste de apreensão anterior em abdução e rotação externa',
      'Teste de relocação (Jobe)',
      'Gaveta anterior e posterior',
      'Teste do sulco (inferior)',
      'Beighton Score para hipermobilidade generalizada'
    ],
    scales: [
      'Western Ontario Shoulder Instability Index (WOSI)',
      'Oxford Instability Score',
      'Rowe Score para instabilidade',
      'Beighton Score (hipermobilidade)'
    ],
    documentation: [
      'Classificar instabilidade: TUBS vs AMBRI',
      'Registrar grau de translação (I, II, III)',
      'Documentar posição provocadora de sintomas',
      'Descrever episódios prévios de luxação/subluxação'
    ],
    evidence: {
      sensitivity: 'Teste apreensão: 72-98%',
      specificity: 'Teste relocação: 87-92%',
      references: [
        'Luime JJ, et al. Does this patient have an instability of the shoulder? JAMA. 2004.',
        'Bak K. The practical management of swimmer\'s painful shoulder. Clin J Sport Med. 2010.'
      ]
    },
    clinicalApplication: 'TUBS (Traumatic Unidirectional Bankart Surgery) indica tratamento cirúrgico. AMBRI (Atraumatic Multidirectional Bilateral Rehabilitation Inferior) responde melhor a fisioterapia.',
    relatedTests: ['apreensao-anterior', 'teste-sulco', 'gaveta-anterior'],
    keywords: ['instabilidade ombro', 'luxação ombro', 'subluxação glenoumeral', 'teste apreensão']
  },
  {
    id: 'aval-ombro-manguito',
    slug: 'avaliacao-manguito-rotador',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Manguito Rotador',
    metaDescription: 'Protocolo específico para avaliação de lesões do manguito rotador: testes para supraespinal, infraespinal, subescapular e redondo menor.',
    introduction: 'O manguito rotador é composto por supraespinal, infraespinal, subescapular e redondo menor. Cada músculo tem função específica e pode ser avaliado individualmente.',
    objectives: [
      'Identificar músculo(s) acometido(s)',
      'Diferenciar tendinopatia de ruptura',
      'Avaliar grau de comprometimento funcional',
      'Detectar impacto subacromial associado',
      'Guiar indicação de exames complementares'
    ],
    procedures: [
      'Teste de Jobe (supraespinal)',
      'Teste do infraespinal (rotação externa resistida)',
      'Lift-off test e Belly press (subescapular)',
      'Hornblower sign (redondo menor)',
      'Drop arm test (ruptura completa)'
    ],
    scales: [
      'Constant-Murley Score',
      'Simple Shoulder Test (SST)',
      'Rotator Cuff Quality of Life (RC-QOL)'
    ],
    documentation: [
      'Mapear força por músculo em escala 0-5',
      'Registrar presença de atrofia (fossa supra/infraespinal)',
      'Documentar arco doloroso (graus específicos)',
      'Correlacionar com mecanismo de lesão'
    ],
    evidence: {
      sensitivity: 'Jobe: 77-95%',
      specificity: 'Lift-off: 84-100%',
      references: [
        'Hermans J, et al. Does this patient with shoulder pain have rotator cuff disease? JAMA. 2013.',
        'Jain NB, et al. Clinical examination of the rotator cuff. PM R. 2013.'
      ]
    },
    clinicalApplication: 'Fraqueza significativa com dor mínima sugere ruptura crônica com adaptação. Dor intensa sem fraqueza real sugere tendinopatia aguda ou impacto.',
    relatedTests: ['jobe', 'infraespinal', 'lift-off', 'belly-press', 'drop-arm'],
    keywords: ['manguito rotador', 'supraespinal', 'lesão manguito', 'tendinopatia ombro']
  },
  {
    id: 'aval-ombro-escapula',
    slug: 'avaliacao-discinesia-escapular',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Discinesia Escapular',
    metaDescription: 'Protocolo para identificação e classificação da discinesia escapular: tipos, causas e avaliação do ritmo escapuloumeral.',
    introduction: 'A discinesia escapular é alteração no posicionamento ou movimento da escápula que pode contribuir para disfunções do ombro. Presente em até 68% das lesões do manguito.',
    objectives: [
      'Identificar presença de discinesia',
      'Classificar tipo de alteração escapular',
      'Avaliar contribuição para sintomas do paciente',
      'Identificar causas musculares vs neurológicas',
      'Guiar programa de estabilização escapular'
    ],
    procedures: [
      'Observação dinâmica durante flexão/abdução',
      'Teste de retração escapular (SRT)',
      'Teste de assistência escapular (SAT)',
      'Avaliação de força: serrátil, trapézio, romboides',
      'Wall push-up para escápula alada'
    ],
    scales: [
      'Lateral Scapular Slide Test (LSST)',
      'Scapular Dyskinesis Test (Kibler)',
      'Classificação visual Kibler (Tipos I-IV)'
    ],
    documentation: [
      'Classificar tipo: I (inferior), II (medial), III (superior), IV (simétrico)',
      'Registrar assimetria em repouso e movimento',
      'Documentar resposta aos testes corretivos',
      'Avaliar força muscular periescapular'
    ],
    evidence: {
      references: [
        'Kibler WB, et al. Scapular dyskinesis and its relation to shoulder injury. J Am Acad Orthop Surg. 2012.',
        'Huang TS, et al. Effects of scapular corrective exercises on pain and movement. Phys Ther Sport. 2018.'
      ]
    },
    clinicalApplication: 'Se teste de assistência escapular (SAT) alivia dor, a discinesia é contribuinte significativo e deve ser alvo do tratamento.',
    relatedTests: ['retração-escapular', 'assistencia-escapular'],
    keywords: ['discinesia escapular', 'escápula alada', 'ritmo escapuloumeral', 'estabilidade escapular']
  },
  {
    id: 'aval-ombro-capsulite',
    slug: 'avaliacao-capsulite-adesiva',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Capsulite Adesiva (Ombro Congelado)',
    metaDescription: 'Protocolo de avaliação para capsulite adesiva: padrão capsular, estágios clínicos e diagnóstico diferencial.',
    introduction: 'A capsulite adesiva caracteriza-se por restrição progressiva da ADM ativa e passiva em padrão capsular: rotação externa > abdução > rotação interna.',
    objectives: [
      'Confirmar padrão capsular de restrição',
      'Identificar estágio clínico (freezing, frozen, thawing)',
      'Excluir causas secundárias',
      'Avaliar fatores de risco associados',
      'Estabelecer prognóstico e plano de tratamento'
    ],
    procedures: [
      'Goniometria passiva: RE, abdução, RI',
      'Comparação bilateral obrigatória',
      'Avaliação de end-feel (capsular duro)',
      'Teste de coracobrachial (dor anterior)',
      'Screening para diabetes e tireoide'
    ],
    scales: [
      'Shoulder Pain and Disability Index (SPADI)',
      'Constant-Murley Score',
      'Stages of Frozen Shoulder (Reeves)'
    ],
    documentation: [
      'Registrar ADM passiva em 3 planos',
      'Documentar tempo desde início dos sintomas',
      'Identificar fatores de risco: DM, hipotireoidismo, trauma',
      'Classificar estágio: doloroso (2-9m), congelado (4-12m), descongelando (12-24m)'
    ],
    evidence: {
      references: [
        'Kelley MJ, et al. Frozen shoulder: evidence and a proposed model. J Orthop Sports Phys Ther. 2009.',
        'Zuckerman JD, Rokito A. Frozen shoulder: a consensus definition. J Shoulder Elbow Surg. 2011.'
      ]
    },
    clinicalApplication: 'A fase dolorosa responde melhor a analgesia e mobilização suave. Na fase congelada, alongamentos sustentados e mobilização articular são mais efetivos.',
    relatedTests: [],
    keywords: ['capsulite adesiva', 'ombro congelado', 'frozen shoulder', 'padrão capsular ombro']
  },

  // COLUNA CERVICAL (5)
  {
    id: 'aval-cervical-geral',
    slug: 'avaliacao-coluna-cervical',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Coluna Cervical: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica da coluna cervical: mobilidade, neurológico, testes especiais e bandeiras vermelhas.',
    introduction: 'A avaliação cervical deve incluir screening de bandeiras vermelhas, avaliação neurológica sistemática e diferenciação entre origem cervical, torácica ou de ombro.',
    objectives: [
      'Excluir patologias graves (bandeiras vermelhas)',
      'Identificar comprometimento neurológico',
      'Avaliar mobilidade segmentar e global',
      'Diferenciar dor cervical de outras origens',
      'Estabelecer classificação para tratamento'
    ],
    procedures: [
      'Screening vascular vertebrobasilar',
      'ADM cervical ativa em 6 direções',
      'Avaliação neurológica: dermátomos, miótomos, reflexos',
      'Palpação segmentar e de tecidos moles',
      'Testes especiais: Spurling, ULTT, distração'
    ],
    scales: [
      'Neck Disability Index (NDI)',
      'Numeric Pain Rating Scale (NPRS)',
      'Patient Specific Functional Scale (PSFS)',
      'Fear-Avoidance Beliefs Questionnaire (FABQ)'
    ],
    documentation: [
      'Registrar bandeiras vermelhas pesquisadas',
      'Documentar ADM em graus e padrão de limitação',
      'Descrever achados neurológicos por nível',
      'Classificar em subgrupos: mobilidade, estabilização, cefaleia'
    ],
    evidence: {
      references: [
        'Childs JD, et al. Neck pain: clinical practice guidelines. J Orthop Sports Phys Ther. 2008.',
        'Blanpied PR, et al. Neck Pain Revision 2017. J Orthop Sports Phys Ther. 2017.'
      ]
    },
    clinicalApplication: 'A classificação em subgrupos (mobilidade, estabilização, centralização, cefaleia cervicogênica) guia a seleção de intervenções específicas.',
    relatedTests: ['spurling', 'distração-cervical', 'teste-arteria-vertebral'],
    keywords: ['avaliação cervical', 'dor cervical', 'cervicalgia avaliação', 'exame cervical']
  },
  {
    id: 'aval-cervical-radiculopatia',
    slug: 'avaliacao-radiculopatia-cervical',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Radiculopatia Cervical',
    metaDescription: 'Protocolo para diagnóstico de radiculopatia cervical: níveis neurológicos, cluster diagnóstico e diagnóstico diferencial.',
    introduction: 'A radiculopatia cervical resulta de compressão ou irritação de raiz nervosa. C6 e C7 são os níveis mais acometidos. Diagnóstico precoce previne déficits permanentes.',
    objectives: [
      'Confirmar envolvimento radicular',
      'Identificar nível neurológico acometido',
      'Avaliar gravidade do comprometimento',
      'Diferenciar de outras causas de dor irradiada',
      'Determinar necessidade de encaminhamento'
    ],
    procedures: [
      'Teste de Spurling (compressão foraminal)',
      'ULTT (Upper Limb Tension Test)',
      'Teste de distração cervical',
      'Mapa dermatomérico (C5-T1)',
      'Força muscular por miótomo'
    ],
    scales: [
      'Neck Disability Index (NDI)',
      'Cervical Radiculopathy Impact Scale',
      'Visual Analog Scale para dor irradiada'
    ],
    documentation: [
      'Mapear distribuição sensitiva alterada',
      'Registrar força por miótomo (0-5)',
      'Documentar reflexos: bicipital (C5-6), tricipital (C7), estilorradial (C6)',
      'Descrever características da dor irradiada'
    ],
    evidence: {
      sensitivity: 'Cluster (Spurling+distração+ULTT): 94%',
      specificity: 'Cluster diagnóstico: 67%',
      references: [
        'Wainner RS, et al. Reliability and diagnostic accuracy of the clinical examination for cervical radiculopathy. Spine. 2003.',
        'Thoomes EJ, et al. Value of physical tests in diagnosing cervical radiculopathy. Spine J. 2018.'
      ]
    },
    clinicalApplication: 'Cluster de 3+ testes positivos (Spurling, ULTT, distração, rotação <60°) confirma radiculopatia com alta probabilidade. Déficit motor progressivo requer encaminhamento urgente.',
    relatedTests: ['spurling', 'ultt', 'distração-cervical'],
    keywords: ['radiculopatia cervical', 'hérnia cervical', 'dor irradiada braço', 'compressão raiz cervical']
  },
  {
    id: 'aval-cervical-cefaleia',
    slug: 'avaliacao-cefaleia-cervicogenica',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Cefaleia Cervicogênica',
    metaDescription: 'Protocolo para diagnóstico diferencial de cefaleia cervicogênica: critérios diagnósticos, testes e diferenciação de migrânea.',
    introduction: 'A cefaleia cervicogênica origina-se de disfunção cervical alta (C0-C3) e representa 15-20% das cefaleias crônicas. Frequentemente confundida com migrânea.',
    objectives: [
      'Aplicar critérios diagnósticos (CHISG)',
      'Avaliar mobilidade cervical alta',
      'Identificar reprodução/alívio da cefaleia',
      'Diferenciar de migrânea e tensional',
      'Avaliar resposta a intervenções cervicais'
    ],
    procedures: [
      'Teste de flexão-rotação (FRT) para C1-C2',
      'Palpação de C0-C3 reproduzindo cefaleia',
      'Avaliação postural craniocervical',
      'Teste de resistência flexores profundos (CCFT)',
      'Análise de fatores desencadeantes'
    ],
    scales: [
      'Headache Disability Index (HDI)',
      'Cervicogenic Headache Criteria (Sjaastad)',
      'Neck Disability Index (NDI)',
      'Frequency and Intensity Headache Diary'
    ],
    documentation: [
      'Registrar características: unilateral, posterior→anterior',
      'Documentar resultado do FRT (normal >32° cada lado)',
      'Identificar movimentos/posturas provocadores',
      'Descrever resposta ao bloqueio anestésico se realizado'
    ],
    evidence: {
      sensitivity: 'Teste flexão-rotação: 91%',
      specificity: 'FRT: 90%',
      references: [
        'Ogince M, et al. The diagnostic validity of the cervical flexion-rotation test. Man Ther. 2007.',
        'International Headache Society. Cervicogenic Headache criteria. Cephalalgia. 2018.'
      ]
    },
    clinicalApplication: 'FRT positivo (<32° de rotação) com reprodução de cefaleia habitual confirma origem cervicogênica. Resposta favorável à terapia manual reforça diagnóstico.',
    relatedTests: ['flexao-rotacao', 'ccft'],
    keywords: ['cefaleia cervicogênica', 'dor de cabeça cervical', 'cefaleia tensional', 'cervical e cefaleia']
  },
  {
    id: 'aval-cervical-instabilidade',
    slug: 'avaliacao-instabilidade-cervical',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Instabilidade Cervical',
    metaDescription: 'Protocolo de screening para instabilidade cervical: testes ligamentares, bandeiras vermelhas e precauções para terapia manual.',
    introduction: 'A instabilidade cervical pode resultar de trauma, artrite reumatoide ou anomalias congênitas. Screening é obrigatório antes de técnicas de manipulação.',
    objectives: [
      'Identificar instabilidade craniocervical',
      'Avaliar integridade ligamentar',
      'Detectar insuficiência vertebrobasilar',
      'Determinar contraindicações para manipulação',
      'Encaminhar quando necessário'
    ],
    procedures: [
      'Teste do ligamento alar',
      'Teste de Sharp-Purser (transverso)',
      'Teste de estresse transverso',
      'Screening artéria vertebral (VBI)',
      'Avaliação de reflexos patológicos'
    ],
    scales: [
      'Canadian C-Spine Rule',
      'NEXUS Criteria',
      'Clinical Prediction Rule for Cervical Instability'
    ],
    documentation: [
      'Registrar história de trauma cervical',
      'Documentar presença de artrite reumatoide/Down',
      'Descrever sintomas de insuficiência VB',
      'Justificar decisão de tratar ou encaminhar'
    ],
    evidence: {
      references: [
        'Cook C, et al. Identifiers suggestive of clinical cervical spine instability. J Man Manip Ther. 2005.',
        'Kerry R, Taylor AJ. Cervical arterial dysfunction assessment. Man Ther. 2006.'
      ]
    },
    clinicalApplication: 'História de trauma + dor cervical alta + sinais neurológicos = encaminhamento obrigatório. Artrite reumatoide requer radiografia antes de terapia manual.',
    relatedTests: ['sharp-purser', 'alar-ligament', 'vbi-screen'],
    keywords: ['instabilidade cervical', 'ligamento transverso', 'artéria vertebral', 'manipulação cervical segurança']
  },
  {
    id: 'aval-cervical-torax',
    slug: 'avaliacao-cervicotoracica',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Junção Cervicotorácica',
    metaDescription: 'Protocolo de avaliação da transição cervicotorácica C7-T4: mobilidade, postura e relação com disfunções cervicais e de ombro.',
    introduction: 'A junção cervicotorácica (C7-T4) é frequentemente negligenciada. Hipomobilidade nesta região contribui para disfunções cervicais e de ombro.',
    objectives: [
      'Avaliar mobilidade da transição C7-T4',
      'Identificar contribuição para dor cervical',
      'Avaliar postura torácica alta',
      'Correlacionar com disfunção de ombro',
      'Guiar intervenções de mobilização'
    ],
    procedures: [
      'Mobilidade segmentar C7-T4',
      'Extensão torácica sobre rolo',
      'Rotação torácica sentado',
      'Avaliação postural: cifose, protrusão de cabeça',
      'Teste de comprimento peitoral menor'
    ],
    scales: [
      'Neck Disability Index',
      'Thoracic Spine Pain Questionnaire'
    ],
    documentation: [
      'Registrar hipomobilidade por segmento',
      'Documentar postura em perfil',
      'Correlacionar achados com sintomas cervicais',
      'Avaliar resposta a mobilização teste'
    ],
    evidence: {
      references: [
        'Cleland JA, et al. Examination of a clinical prediction rule to identify patients with neck pain likely to benefit from thoracic spine thrust manipulation. Phys Ther. 2010.',
        'Norlander S, et al. The relationship of neck-shoulder pain and thoracic mobility. Spine. 1998.'
      ]
    },
    clinicalApplication: 'Pacientes com dor cervical frequentemente se beneficiam de mobilização torácica, mesmo sem dor torácica referida.',
    relatedTests: [],
    keywords: ['junção cervicotorácica', 'mobilidade torácica', 'postura cervical', 'cifose e dor cervical']
  },

  // COLUNA LOMBAR (6)
  {
    id: 'aval-lombar-geral',
    slug: 'avaliacao-coluna-lombar',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Coluna Lombar: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica da coluna lombar: bandeiras vermelhas, neurológico, classificação e testes especiais.',
    introduction: 'A avaliação lombar sistemática permite classificar o paciente em subgrupos de tratamento e identificar bandeiras vermelhas que requerem encaminhamento urgente.',
    objectives: [
      'Excluir patologias graves',
      'Classificar em subgrupos de tratamento',
      'Avaliar comprometimento neurológico',
      'Identificar fatores psicossociais (bandeiras amarelas)',
      'Estabelecer prognóstico funcional'
    ],
    procedures: [
      'Screening de bandeiras vermelhas',
      'ADM lombar multiplanar',
      'Avaliação neurológica: SLR, dermátomos, miótomos',
      'Palpação segmentar e de tecidos moles',
      'Centralização/periferização (McKenzie)'
    ],
    scales: [
      'Oswestry Disability Index (ODI)',
      'Roland-Morris Disability Questionnaire',
      'STarT Back Screening Tool',
      'Fear-Avoidance Beliefs Questionnaire'
    ],
    documentation: [
      'Registrar bandeiras vermelhas/amarelas',
      'Documentar resposta a movimentos repetidos',
      'Classificar: manipulação, estabilização, direção específica, tração',
      'Estabelecer fatores contribuintes'
    ],
    evidence: {
      references: [
        'Delitto A, et al. Low Back Pain CPG Revision 2012. J Orthop Sports Phys Ther. 2012.',
        'Foster NE, et al. Stratified care for low back pain. Lancet. 2018.'
      ]
    },
    clinicalApplication: 'STarT Back Tool estratifica risco e guia intensidade de tratamento. Alto risco requer abordagem biopsicossocial intensiva.',
    relatedTests: ['slr', 'slump', 'instabilidade-lombar'],
    keywords: ['avaliação lombar', 'dor lombar avaliação', 'lombalgia exame', 'coluna lombar fisioterapia']
  },
  {
    id: 'aval-lombar-radiculopatia',
    slug: 'avaliacao-radiculopatia-lombar',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Radiculopatia Lombar',
    metaDescription: 'Protocolo para diagnóstico de ciática e radiculopatia lombar: níveis L4-S1, testes neurodinâmicos e critérios de encaminhamento.',
    introduction: 'A radiculopatia lombar afeta principalmente L4, L5 e S1. Diagnóstico preciso do nível permite tratamento direcionado e identificação de casos cirúrgicos.',
    objectives: [
      'Confirmar origem radicular dos sintomas',
      'Identificar nível neurológico',
      'Diferenciar de pseudociática',
      'Avaliar gravidade e progressão',
      'Identificar síndrome da cauda equina'
    ],
    procedures: [
      'Straight Leg Raise (SLR) e variações',
      'Slump Test',
      'Crossed SLR (confirmação)',
      'Avaliação sensitiva dermatomérica',
      'Força: dorsiflexão (L4-5), EHL (L5), plantiflexão (S1)'
    ],
    scales: [
      'Oswestry Disability Index',
      'Sciatica Bothersomeness Index',
      'Sensory and Motor Examination Scale'
    ],
    documentation: [
      'Registrar SLR em graus com localização da dor',
      'Mapear déficit sensitivo por dermátomo',
      'Documentar força por miótomo',
      'Avaliar reflexos: patelar (L4), aquileu (S1)'
    ],
    evidence: {
      sensitivity: 'SLR: 91%',
      specificity: 'Crossed SLR: 88%',
      references: [
        'Vroomen PC, et al. The clinical value of diagnostic tests in low back pain. Rheumatology. 2002.',
        'Deville WL, et al. The test of Lasègue: systematic review of accuracy. Spine. 2000.'
      ]
    },
    clinicalApplication: 'SLR + crossed SLR positivos = alta probabilidade de hérnia. Déficit motor progressivo ou síndrome cauda equina = cirurgia urgente.',
    relatedTests: ['slr', 'slump', 'crossed-slr', 'lasegue'],
    keywords: ['radiculopatia lombar', 'ciática', 'hérnia lombar', 'dor irradiada perna']
  },
  {
    id: 'aval-lombar-instabilidade',
    slug: 'avaliacao-instabilidade-lombar',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Instabilidade Lombar',
    metaDescription: 'Protocolo para identificação de instabilidade lombar segmentar: testes clínicos, CPR e indicação de estabilização.',
    introduction: 'A instabilidade lombar clínica caracteriza-se por perda do controle do movimento neutro. Clinical Prediction Rule identifica pacientes responsivos à estabilização.',
    objectives: [
      'Identificar instabilidade segmentar clínica',
      'Aplicar critérios da CPR para estabilização',
      'Avaliar controle motor local',
      'Diferenciar de hipermobilidade benigna',
      'Guiar programa de estabilização'
    ],
    procedures: [
      'Teste de instabilidade em prono (PIT)',
      'Aberrant movements durante flexão',
      'SLR ativo (ASLR)',
      'Teste de estabilização segmentar',
      'Avaliação de ativação transverso/multífido'
    ],
    scales: [
      'Oswestry Disability Index (<19 na CPR)',
      'SLR ativo positivo',
      'Fear-Avoidance Beliefs (baixo)'
    ],
    documentation: [
      'Registrar movimentos aberrantes presentes',
      'Documentar resultado do teste de instabilidade',
      'Avaliar idade (<40 anos é fator positivo)',
      'Verificar hipermobilidade generalizada'
    ],
    evidence: {
      references: [
        'Hicks GE, et al. Preliminary development of a clinical prediction rule for determining which patients with low back pain will respond to a stabilization exercise program. Arch Phys Med Rehabil. 2005.',
        'Cook C, et al. Lumbar segmental instability. J Man Manip Ther. 2006.'
      ]
    },
    clinicalApplication: '3+ critérios da CPR (idade <40, SLR >91°, movimentos aberrantes, PIT positivo) = 95% probabilidade de sucesso com estabilização.',
    relatedTests: ['instabilidade-prono', 'aslr'],
    keywords: ['instabilidade lombar', 'estabilização core', 'controle motor lombar', 'multífido']
  },
  {
    id: 'aval-lombar-estenose',
    slug: 'avaliacao-estenose-lombar',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Estenose Lombar',
    metaDescription: 'Protocolo para diagnóstico de estenose do canal lombar e claudicação neurogênica: diferenciação de claudicação vascular.',
    introduction: 'A estenose lombar causa claudicação neurogênica em pacientes acima de 50 anos. Diferenciação de claudicação vascular é fundamental.',
    objectives: [
      'Identificar claudicação neurogênica',
      'Diferenciar de claudicação vascular',
      'Avaliar capacidade de marcha',
      'Identificar posições de alívio',
      'Determinar gravidade funcional'
    ],
    procedures: [
      'História detalhada de claudicação',
      'Teste de marcha cronometrado',
      'Bicycle test (sentar vs andar)',
      'Avaliação postural: lordose',
      'Pulsos periféricos (vascular)'
    ],
    scales: [
      'Swiss Spinal Stenosis Questionnaire',
      'Walking Impairment Questionnaire',
      'Oswestry Disability Index'
    ],
    documentation: [
      'Registrar distância de claudicação',
      'Documentar tempo até alívio em flexão',
      'Diferenciar características neuro vs vascular',
      'Avaliar fatores posturais'
    ],
    evidence: {
      references: [
        'Backstrom KM, et al. Lumbar spinal stenosis-diagnosis and management. J Am Board Fam Med. 2011.',
        'Katz JN, Harris MB. Clinical practice. Lumbar spinal stenosis. N Engl J Med. 2008.'
      ]
    },
    clinicalApplication: 'Claudicação neurogênica: melhora com flexão, piora com extensão/marcha. Claudicação vascular: melhora em repouso qualquer posição, pulsos diminuídos.',
    relatedTests: ['bicycle-test', 'two-stage-treadmill'],
    keywords: ['estenose lombar', 'claudicação neurogênica', 'canal estreito', 'estenose vertebral']
  },
  {
    id: 'aval-lombar-sacroiliaca',
    slug: 'avaliacao-articulacao-sacroiliaca',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Articulação Sacroilíaca',
    metaDescription: 'Protocolo de avaliação da articulação sacroilíaca: cluster diagnóstico, testes de provocação e diferenciação de dor lombar.',
    introduction: 'A disfunção sacroilíaca é responsável por 13-30% das lombalgias. Cluster de testes de provocação apresenta melhor acurácia que testes isolados.',
    objectives: [
      'Identificar origem sacroilíaca da dor',
      'Diferenciar de dor lombar referida',
      'Avaliar mobilidade e estabilidade SI',
      'Identificar espondilite anquilosante',
      'Guiar tratamento conservador'
    ],
    procedures: [
      'Teste de distração',
      'Teste de compressão',
      'Sacral thrust',
      'Thigh thrust (FABER)',
      'Teste de Gaenslen'
    ],
    scales: [
      'Oswestry Disability Index',
      'Numeric Pain Rating Scale',
      'SIJ Pain Diagram'
    ],
    documentation: [
      'Registrar número de testes positivos',
      'Documentar localização precisa da dor',
      'Avaliar história de espondiloartropatia',
      'Correlacionar com postura pélvica'
    ],
    evidence: {
      sensitivity: '3+ testes: 94%',
      specificity: 'Cluster 3/5: 78%',
      references: [
        'Laslett M, et al. Diagnosis of sacroiliac joint pain: validity of individual provocation tests. Man Ther. 2005.',
        'van der Wurff P, et al. Multi-test regimen of pain provocation tests as an aid to reduce SI joint pain. Man Ther. 2006.'
      ]
    },
    clinicalApplication: '3+ de 5 testes de provocação positivos = origem SI provável. Resposta a bloqueio anestésico é padrão-ouro.',
    relatedTests: ['distração-si', 'compressão-si', 'thigh-thrust', 'faber', 'gaenslen'],
    keywords: ['articulação sacroilíaca', 'dor sacroilíaca', 'SI joint', 'testes sacroilíaca']
  },
  {
    id: 'aval-lombar-mckenzie',
    slug: 'avaliacao-mckenzie',
    category: 'avaliacao-clinica',
    title: 'Avaliação pelo Método McKenzie (MDT)',
    metaDescription: 'Protocolo de avaliação pelo Mechanical Diagnosis and Therapy: classificação, resposta a movimentos repetidos e fenômeno de centralização.',
    introduction: 'O método McKenzie (MDT) classifica pacientes em síndromes baseadas na resposta a movimentos repetidos. Centralização indica bom prognóstico.',
    objectives: [
      'Classificar em síndrome (derangement, dysfunction, postural)',
      'Identificar direção preferencial de movimento',
      'Avaliar fenômeno de centralização',
      'Estabelecer prognóstico baseado na resposta',
      'Definir programa de autotratamento'
    ],
    procedures: [
      'Movimentos repetidos em flexão (sentado/pé)',
      'Movimentos repetidos em extensão',
      'Movimentos repetidos laterais',
      'Avaliação de posturas sustentadas',
      'Pressão adicional (overpressure)'
    ],
    scales: [
      'Centralization Phenomenon Classification',
      'Directional Preference Assessment',
      'MDT Classification System'
    ],
    documentation: [
      'Registrar resposta a cada direção (melhor/pior/sem mudança)',
      'Documentar centralização ou periferização',
      'Classificar síndrome identificada',
      'Estabelecer direção preferencial'
    ],
    evidence: {
      references: [
        'May S, Aina A. Centralization and directional preference: a systematic review. Man Ther. 2012.',
        'McKenzie R, May S. The Lumbar Spine: Mechanical Diagnosis and Therapy. 2nd ed. 2003.'
      ]
    },
    clinicalApplication: 'Centralização presente = 83% bom resultado. Periferização = prognóstico reservado. Extensão é preferencial em 70% dos derangements.',
    relatedTests: [],
    keywords: ['método mckenzie', 'MDT', 'centralização dor', 'direção preferencial']
  },

  // QUADRIL (4)
  {
    id: 'aval-quadril-geral',
    slug: 'avaliacao-quadril',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Quadril: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica do quadril: mobilidade, força, testes especiais e diagnóstico diferencial.',
    introduction: 'A avaliação do quadril requer diferenciação entre causas articulares, musculares, bursais e referidas da coluna lombar.',
    objectives: [
      'Identificar origem dos sintomas',
      'Avaliar mobilidade articular',
      'Detectar impacto femoroacetabular',
      'Diferenciar de dor referida lombar',
      'Avaliar função e marcha'
    ],
    procedures: [
      'Inspeção de marcha (Trendelenburg)',
      'ADM: flexão, extensão, rotações, abdução',
      'FABER/Patrick test',
      'FADIR (impacto anterior)',
      'Teste de Thomas (flexor)'
    ],
    scales: [
      'Harris Hip Score',
      'Hip Outcome Score (HOS)',
      'HOOS (Hip Osteoarthritis Outcome Score)',
      'iHOT-33 (International Hip Outcome Tool)'
    ],
    documentation: [
      'Registrar padrão de limitação de ADM',
      'Documentar padrão de marcha',
      'Avaliar discrepância de membros',
      'Correlacionar com achados de imagem'
    ],
    evidence: {
      references: [
        'Reiman MP, et al. Diagnostic accuracy of clinical tests for the diagnosis of hip FAI. Br J Sports Med. 2015.',
        'Martin HD, et al. The Hip Examination. J Am Acad Orthop Surg. 2019.'
      ]
    },
    clinicalApplication: 'Padrão capsular do quadril: rotação interna mais limitada, seguida de flexão e abdução. Indica processo articular.',
    relatedTests: ['faber', 'fadir', 'thomas', 'trendelenburg'],
    keywords: ['avaliação quadril', 'exame físico quadril', 'dor quadril', 'fisioterapia quadril']
  },
  {
    id: 'aval-quadril-ifa',
    slug: 'avaliacao-impacto-femoroacetabular',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Impacto Femoroacetabular (IFA)',
    metaDescription: 'Protocolo para diagnóstico de impacto femoroacetabular: tipos CAM e Pincer, testes clínicos e correlação com imagem.',
    introduction: 'O IFA resulta de morfologia anormal femoral (CAM) ou acetabular (Pincer), causando lesão labral e condral progressiva em jovens ativos.',
    objectives: [
      'Identificar impacto femoroacetabular',
      'Diferenciar tipos CAM vs Pincer',
      'Avaliar lesão labral associada',
      'Determinar gravidade funcional',
      'Guiar decisão conservador vs cirúrgico'
    ],
    procedures: [
      'FADIR (Flexion-Adduction-Internal Rotation)',
      'FABER',
      'Anterior impingement test',
      'Posterior impingement test',
      'Resisted SLR (dor anterior)'
    ],
    scales: [
      'Non-Arthritic Hip Score (NAHS)',
      'Hip Outcome Score - Sport Specific',
      'iHOT-12'
    ],
    documentation: [
      'Registrar posição exata de reprodução de dor',
      'Documentar ADM em rotação interna (limitação típica)',
      'Correlacionar com radiografia (alpha angle, crossover)',
      'Avaliar atividade esportiva afetada'
    ],
    evidence: {
      sensitivity: 'FADIR: 94-99%',
      specificity: 'FADIR: 5-10%',
      references: [
        'Reiman MP, et al. Femoroacetabular impingement examination. Br J Sports Med. 2015.',
        'Griffin DR, et al. UK FASHIoN trial. Lancet. 2018.'
      ]
    },
    clinicalApplication: 'FADIR é sensível mas não específico. Achados clínicos devem ser correlacionados com imagem (RX e RM) para diagnóstico definitivo.',
    relatedTests: ['fadir', 'faber', 'impacto-anterior'],
    keywords: ['impacto femoroacetabular', 'IFA', 'CAM', 'Pincer', 'lesão labral']
  },
  {
    id: 'aval-quadril-bursite',
    slug: 'avaliacao-bursite-trocanterica',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Síndrome Dolorosa do Grande Trocânter',
    metaDescription: 'Protocolo para diagnóstico de bursite trocantérica e tendinopatia glútea: diferenciação clínica e abordagem tratamento.',
    introduction: 'A síndrome dolorosa do grande trocânter engloba bursite, tendinopatia glútea e tear do glúteo médio. É mais comum em mulheres 40-60 anos.',
    objectives: [
      'Diferenciar causas de dor lateral do quadril',
      'Avaliar integridade do glúteo médio',
      'Identificar fatores biomecânicos',
      'Diferenciar de dor referida lombar',
      'Guiar tratamento conservador'
    ],
    procedures: [
      'Palpação direta do grande trocânter',
      'Teste de resistência abdução lateral',
      'Single leg stance (30s)',
      'Trendelenburg dinâmico',
      'Ober test (ITB)'
    ],
    scales: [
      'VISA-G (Victorian Institute of Sport Assessment - Gluteal)',
      'Harris Hip Score',
      'Numeric Pain Rating Scale'
    ],
    documentation: [
      'Localizar ponto de dor máxima',
      'Registrar força de abdução em decúbito lateral',
      'Avaliar padrão de marcha',
      'Correlacionar com fatores posturais'
    ],
    evidence: {
      references: [
        'Grimaldi A, Fearon A. Gluteal tendinopathy: integrating pathomechanics and clinical features. J Orthop Sports Phys Ther. 2015.',
        'Mulligan EP, et al. Greater trochanteric pain syndrome. J Orthop Sports Phys Ther. 2019.'
      ]
    },
    clinicalApplication: 'Fraqueza de abdução + dor em single leg stance = tendinopatia glútea provável. Resposta a exercícios de fortalecimento confirma diagnóstico.',
    relatedTests: ['trendelenburg', 'single-leg-stance', 'ober'],
    keywords: ['bursite trocantérica', 'tendinopatia glútea', 'dor lateral quadril', 'glúteo médio']
  },
  {
    id: 'aval-quadril-artrose',
    slug: 'avaliacao-artrose-quadril',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Osteoartrose do Quadril',
    metaDescription: 'Protocolo para diagnóstico e estadiamento de artrose do quadril: critérios clínicos ACR, escalas funcionais e indicação de artroplastia.',
    introduction: 'A osteoartrose do quadril apresenta-se com dor, rigidez matinal e limitação funcional progressiva. Diagnóstico clínico é possível sem imagem.',
    objectives: [
      'Aplicar critérios diagnósticos ACR',
      'Estadiar gravidade funcional',
      'Avaliar candidatos à artroplastia',
      'Identificar fatores modificáveis',
      'Guiar tratamento conservador'
    ],
    procedures: [
      'ADM: rotação interna (<15° = artrose)',
      'Flexão do quadril (<115°)',
      'Padrão capsular clássico',
      'Crepitação articular',
      'Avaliação de marcha e função'
    ],
    scales: [
      'WOMAC (Western Ontario and McMaster)',
      'Harris Hip Score',
      'Timed Up and Go (TUG)',
      'HOOS-PS (Physical Function Short-Form)'
    ],
    documentation: [
      'Registrar critérios ACR presentes',
      'Documentar ADM em graus',
      'Avaliar impacto funcional (escadas, calçados)',
      'Estabelecer baseline para seguimento'
    ],
    evidence: {
      references: [
        'Altman R, et al. Development of criteria for the classification of hip OA. Arthritis Rheum. 1991.',
        'Zhang W, et al. OARSI recommendations for hip OA. Osteoarthritis Cartilage. 2008.'
      ]
    },
    clinicalApplication: 'Critérios ACR: dor + rotação interna <15° + idade >50 + rigidez matinal <60min = 89% probabilidade de OA radiográfica.',
    relatedTests: [],
    keywords: ['artrose quadril', 'osteoartrose coxofemoral', 'coxartrose', 'artroplastia quadril']
  },

  // JOELHO (5)
  {
    id: 'aval-joelho-geral',
    slug: 'avaliacao-joelho',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Joelho: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica do joelho: ligamentos, meniscos, patelofemoral e diagnóstico funcional.',
    introduction: 'A avaliação do joelho deve incluir testes ligamentares, meniscais e patelofemorais, considerando mecanismo de lesão e atividade funcional.',
    objectives: [
      'Identificar estrutura(s) lesionada(s)',
      'Avaliar estabilidade ligamentar',
      'Detectar lesões meniscais',
      'Avaliar biomecânica patelofemoral',
      'Estabelecer diagnóstico funcional'
    ],
    procedures: [
      'Inspeção: derrame, atrofia VMO, alinhamento',
      'ADM ativa e passiva',
      'Testes ligamentares: Lachman, gaveta, pivot shift',
      'Testes meniscais: McMurray, Apley, Thessaly',
      'Testes patelofemorais: apreensão, Clarke'
    ],
    scales: [
      'Lysholm Knee Score',
      'IKDC (International Knee Documentation Committee)',
      'KOOS (Knee Osteoarthritis Outcome Score)',
      'Tegner Activity Scale'
    ],
    documentation: [
      'Registrar mecanismo de lesão detalhado',
      'Documentar derrame (cross-over, ballotement)',
      'Classificar frouxidão ligamentar em graus',
      'Avaliar função: agachamento, escadas, salto'
    ],
    evidence: {
      references: [
        'Logerstedt DS, et al. Knee stability and movement coordination impairments. J Orthop Sports Phys Ther. 2010.',
        'Benjaminse A, et al. Clinical diagnosis of ACL tear. Br J Sports Med. 2006.'
      ]
    },
    clinicalApplication: 'Exame agudo pode ser limitado por dor e derrame. Hemartrose traumática sugere LCA em 72% dos casos.',
    relatedTests: ['lachman', 'mcmurray', 'pivot-shift', 'apley'],
    keywords: ['avaliação joelho', 'exame físico joelho', 'lesão joelho', 'fisioterapia joelho']
  },
  {
    id: 'aval-joelho-lca',
    slug: 'avaliacao-lesao-lca',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Lesão do LCA',
    metaDescription: 'Protocolo para diagnóstico de ruptura do ligamento cruzado anterior: Lachman, pivot shift, KT-1000 e critérios para reconstrução.',
    introduction: 'A lesão do LCA é comum em esportes com pivoteamento. Diagnóstico clínico acurado permite decisão precoce entre tratamento conservador e cirúrgico.',
    objectives: [
      'Confirmar lesão do LCA',
      'Diferenciar ruptura parcial vs completa',
      'Identificar lesões associadas',
      'Avaliar instabilidade funcional',
      'Guiar decisão de tratamento'
    ],
    procedures: [
      'Teste de Lachman (padrão-ouro clínico)',
      'Gaveta anterior 90°',
      'Pivot shift (instabilidade rotatória)',
      'Avaliação de lesões meniscais associadas',
      'Exame do joelho contralateral'
    ],
    scales: [
      'IKDC Subjective',
      'ACL-RSI (Return to Sport after Injury)',
      'Tampa Scale for Kinesiophobia',
      'Marx Activity Scale'
    ],
    documentation: [
      'Classificar Lachman: 1+ (<5mm), 2+ (5-10mm), 3+ (>10mm)',
      'Registrar end-point (firme vs ausente)',
      'Documentar pivot shift (presente/ausente)',
      'Avaliar atrofia quadricipital bilateral'
    ],
    evidence: {
      sensitivity: 'Lachman: 87%',
      specificity: 'Lachman: 93%',
      references: [
        'Benjaminse A, et al. Clinical diagnosis of an ACL rupture: a meta-analysis. J Orthop Sports Phys Ther. 2006.',
        'Lynch AD, et al. Consensus criteria for defining episodes of giving way. J Orthop Sports Phys Ther. 2015.'
      ]
    },
    clinicalApplication: 'Lachman positivo com end-point ausente = ruptura completa. Copers (não-cirúrgicos) apresentam boa função sem instabilidade em atividades diárias.',
    relatedTests: ['lachman', 'gaveta-anterior', 'pivot-shift'],
    keywords: ['lesão LCA', 'ruptura cruzado anterior', 'lachman teste', 'instabilidade joelho']
  },
  {
    id: 'aval-joelho-menisco',
    slug: 'avaliacao-lesao-meniscal',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Lesão Meniscal',
    metaDescription: 'Protocolo para diagnóstico de lesão meniscal: McMurray, Apley, Thessaly e correlação com mecanismo de lesão.',
    introduction: 'As lesões meniscais podem ser traumáticas ou degenerativas. Diagnóstico clínico tem limitações; combinação de testes aumenta acurácia.',
    objectives: [
      'Identificar lesão meniscal medial vs lateral',
      'Diferenciar lesão traumática vs degenerativa',
      'Avaliar sintomas mecânicos (bloqueio)',
      'Correlacionar com mecanismo de lesão',
      'Determinar necessidade de RNM'
    ],
    procedures: [
      'Teste de McMurray',
      'Teste de Apley (compressão)',
      'Teste de Thessaly (20°)',
      'Palpação de interlinha articular',
      'Avaliação de bloqueio articular'
    ],
    scales: [
      'IKDC Subjective',
      'Lysholm Knee Score',
      'WOMET (Western Ontario Meniscal Evaluation Tool)'
    ],
    documentation: [
      'Localizar interlinha dolorosa',
      'Registrar presença de estalido palpável',
      'Documentar episódios de bloqueio',
      'Correlacionar com história de trauma'
    ],
    evidence: {
      sensitivity: 'McMurray: 61%',
      specificity: 'Palpação interlinha: 77%',
      references: [
        'Hegedus EJ, et al. Physical examination tests for meniscal lesions. Br J Sports Med. 2007.',
        'Smith BE, et al. Special tests for assessing meniscal lesions. Clin Rehabil. 2015.'
      ]
    },
    clinicalApplication: 'Cluster de 3+ sinais (McMurray, palpação, história de bloqueio, derrame) aumenta probabilidade. Lesão degenerativa em >40 anos frequentemente responde a fisioterapia.',
    relatedTests: ['mcmurray', 'apley', 'thessaly'],
    keywords: ['lesão meniscal', 'menisco', 'mcmurray', 'teste menisco']
  },
  {
    id: 'aval-joelho-pfp',
    slug: 'avaliacao-dor-patelofemoral',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Síndrome da Dor Patelofemoral',
    metaDescription: 'Protocolo para diagnóstico de dor patelofemoral: biomecânica, fatores de risco e cluster diagnóstico.',
    introduction: 'A síndrome da dor patelofemoral é a causa mais comum de dor anterior do joelho, especialmente em mulheres jovens ativas.',
    objectives: [
      'Confirmar diagnóstico de SDPF',
      'Identificar fatores contribuintes',
      'Avaliar tracking patelar',
      'Analisar biomecânica de MMII',
      'Estabelecer prioridades de tratamento'
    ],
    procedures: [
      'Teste de Clarke (compressão patelar)',
      'Avaliação de mobilidade patelar',
      'Agachamento unipodal (valgo dinâmico)',
      'Step down test',
      'Força de quadríceps e glúteos'
    ],
    scales: [
      'Kujala Anterior Knee Pain Scale',
      'Anterior Knee Pain Scale',
      'AKPS - Activities of Daily Living'
    ],
    documentation: [
      'Registrar atividades provocadoras (escadas, agachar)',
      'Documentar valgo dinâmico presente',
      'Avaliar encurtamento de ITB, quadríceps, isquiotibiais',
      'Avaliar força de abdutores e rotadores externos'
    ],
    evidence: {
      references: [
        'Crossley KM, et al. 2016 Patellofemoral pain consensus statement. Br J Sports Med. 2016.',
        'Collins NJ, et al. Knee osteoarthritis and anterior cruciate ligament reconstruction. J Orthop Sports Phys Ther. 2017.'
      ]
    },
    clinicalApplication: 'Abordagem multimodal (fortalecimento quadríceps + glúteos + mobilização patelar + taping) é mais efetiva que intervenções isoladas.',
    relatedTests: ['clarke', 'step-down', 'single-leg-squat'],
    keywords: ['dor patelofemoral', 'condromalácia', 'dor anterior joelho', 'síndrome PF']
  },
  {
    id: 'aval-joelho-artrose',
    slug: 'avaliacao-artrose-joelho',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Osteoartrose do Joelho',
    metaDescription: 'Protocolo para diagnóstico e estadiamento de gonartrose: critérios ACR, escalas funcionais e decisão de tratamento.',
    introduction: 'A osteoartrose do joelho é a forma mais comum de artrite, com prevalência aumentando com idade e obesidade.',
    objectives: [
      'Aplicar critérios diagnósticos ACR',
      'Estadiar gravidade funcional',
      'Identificar fatores modificáveis',
      'Avaliar candidatos à artroplastia',
      'Estabelecer metas de tratamento'
    ],
    procedures: [
      'Crepitação durante flexão/extensão',
      'Avaliação de derrame',
      'ADM: déficit de extensão é pior prognóstico',
      'Teste de estresse varo/valgo',
      'Avaliação de marcha e função'
    ],
    scales: [
      'WOMAC',
      'KOOS',
      'Timed Up and Go (TUG)',
      '30-second Chair Stand Test',
      '6-Minute Walk Test'
    ],
    documentation: [
      'Registrar critérios ACR (6 de 10)',
      'Documentar alinhamento (varo/valgo)',
      'Avaliar IMC e impacto',
      'Estabelecer baseline funcional'
    ],
    evidence: {
      references: [
        'Altman R, et al. Development of criteria for knee osteoarthritis. Arthritis Rheum. 1986.',
        'McAlindon TE, et al. OARSI guidelines for knee OA. Osteoarthritis Cartilage. 2014.'
      ]
    },
    clinicalApplication: 'Exercício terapêutico + educação têm efeito moderado na dor. Perda de peso >5% melhora função significativamente.',
    relatedTests: [],
    keywords: ['artrose joelho', 'gonartrose', 'osteoartrite joelho', 'artroplastia joelho']
  },

  // TORNOZELO E PÉ (4)
  {
    id: 'aval-tornozelo-geral',
    slug: 'avaliacao-tornozelo-pe',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Tornozelo e Pé: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação do complexo tornozelo-pé: mobilidade, estabilidade, biomecânica e função.',
    introduction: 'A avaliação do tornozelo e pé inclui articulações talocrural, subtalar, mediotársica e metatarsofalangeanas, considerando demandas funcionais específicas.',
    objectives: [
      'Identificar estrutura(s) acometida(s)',
      'Avaliar estabilidade ligamentar',
      'Analisar biomecânica do pé',
      'Avaliar função de marcha e corrida',
      'Correlacionar com calçado'
    ],
    procedures: [
      'Inspeção: edema, equimose, deformidades',
      'Palpação sistemática de ligamentos e ossos',
      'ADM: dorsiflexão, flexão plantar, inversão, eversão',
      'Testes de estabilidade: gaveta anterior, tilt talar',
      'Avaliação da marcha e postura do pé'
    ],
    scales: [
      'FAAM (Foot and Ankle Ability Measure)',
      'CAIT (Cumberland Ankle Instability Tool)',
      'FADI (Foot and Ankle Disability Index)',
      'Foot Posture Index (FPI-6)'
    ],
    documentation: [
      'Aplicar Ottawa Ankle Rules para fratura',
      'Registrar ADM comparativa bilateral',
      'Documentar tipo de pé (plano, cavo, neutro)',
      'Avaliar calçado habitual'
    ],
    evidence: {
      references: [
        'Martin RL, et al. Ankle stability and movement coordination impairments. J Orthop Sports Phys Ther. 2013.',
        'Stiell IG, et al. Ottawa ankle rules for ankle injuries. BMJ. 1995.'
      ]
    },
    clinicalApplication: 'Ottawa Ankle Rules negativas excluem fratura com 98% de sensibilidade. Dorsiflexão <10° associada a diversas patologias.',
    relatedTests: ['gaveta-anterior-tornozelo', 'tilt-talar', 'thompson'],
    keywords: ['avaliação tornozelo', 'avaliação pé', 'entorse tornozelo', 'fisioterapia tornozelo']
  },
  {
    id: 'aval-tornozelo-entorse',
    slug: 'avaliacao-entorse-tornozelo',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Entorse de Tornozelo',
    metaDescription: 'Protocolo para avaliação aguda e crônica de entorse de tornozelo: classificação, testes e identificação de instabilidade residual.',
    introduction: 'A entorse lateral é a lesão esportiva mais comum. Avaliação sistemática previne instabilidade crônica, presente em 20-40% dos casos.',
    objectives: [
      'Classificar gravidade da entorse',
      'Excluir fratura (Ottawa Rules)',
      'Identificar ligamentos acometidos',
      'Detectar lesões associadas',
      'Prevenir instabilidade crônica'
    ],
    procedures: [
      'Ottawa Ankle Rules',
      'Palpação: LTFA, LCF, ligamento deltoide',
      'Gaveta anterior (LTFA)',
      'Tilt talar (LCF)',
      'Squeeze test (sindesmose)'
    ],
    scales: [
      'CAIT (>27 = instabilidade)',
      'FAAM',
      'Ankle Joint Functional Assessment Tool'
    ],
    documentation: [
      'Classificar grau: I (estiramento), II (parcial), III (ruptura completa)',
      'Registrar Ottawa Rules (+ ou -)',
      'Documentar frouxidão comparativa',
      'Avaliar propriocepção se crônica'
    ],
    evidence: {
      sensitivity: 'Ottawa Rules: 98%',
      specificity: 'Gaveta anterior: 84%',
      references: [
        'Doherty C, et al. Recovery from acute ankle sprains. Sports Med. 2017.',
        'Gribble PA, et al. Evidence review for the 2016 CAI consensus. Br J Sports Med. 2016.'
      ]
    },
    clinicalApplication: 'Mobilização precoce + exercícios supervisionados = melhor resultado que imobilização prolongada. CAIT >27 indica necessidade de programa de prevenção.',
    relatedTests: ['gaveta-anterior-tornozelo', 'tilt-talar', 'squeeze-sindesmose'],
    keywords: ['entorse tornozelo', 'instabilidade crônica', 'LTFA', 'ligamento lateral tornozelo']
  },
  {
    id: 'aval-pe-fasciite',
    slug: 'avaliacao-fasciite-plantar',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Fasciite Plantar',
    metaDescription: 'Protocolo para diagnóstico de fasciite plantar: características clínicas, diagnóstico diferencial e fatores de risco.',
    introduction: 'A fasciite plantar é a causa mais comum de dor plantar, afetando 10% da população. Diagnóstico clínico é suficiente na maioria dos casos.',
    objectives: [
      'Confirmar diagnóstico clínico',
      'Identificar fatores de risco modificáveis',
      'Diferenciar de outras causas de dor plantar',
      'Avaliar biomecânica do pé',
      'Estabelecer prognóstico'
    ],
    procedures: [
      'Palpação da inserção medial do calcâneo',
      'Windlass test',
      'Avaliação de dorsiflexão do tornozelo',
      'Foot Posture Index',
      'Avaliação de calçado e atividade'
    ],
    scales: [
      'FFI (Foot Function Index)',
      'FHSQ (Foot Health Status Questionnaire)',
      'NPRS para dor matinal'
    ],
    documentation: [
      'Registrar padrão de dor (matinal, primeiros passos)',
      'Documentar dorsiflexão tornozelo (<10° = fator risco)',
      'Avaliar IMC',
      'Identificar fatores ocupacionais'
    ],
    evidence: {
      references: [
        'McPoil TG, et al. Heel pain: clinical practice guidelines. J Orthop Sports Phys Ther. 2008.',
        'Martin RL, et al. Heel pain: plantar fasciitis. J Orthop Sports Phys Ther. 2014.'
      ]
    },
    clinicalApplication: 'Tríade diagnóstica: dor nos primeiros passos + palpação dolorosa + Windlass positivo. Alongamento específico da fáscia é mais efetivo que alongamento genérico.',
    relatedTests: ['windlass', 'palpação-calcâneo'],
    keywords: ['fasciite plantar', 'dor calcâneo', 'esporão calcâneo', 'dor plantar']
  },
  {
    id: 'aval-pe-halux',
    slug: 'avaliacao-halux-valgo',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Hálux Valgo',
    metaDescription: 'Protocolo para avaliação de hálux valgo: mensuração angular, classificação e impacto funcional.',
    introduction: 'O hálux valgo é a deformidade mais comum do antepé, predominante em mulheres. Avaliação inclui aspectos estruturais e funcionais.',
    objectives: [
      'Mensurar grau de deformidade',
      'Avaliar mobilidade da 1ª MTF',
      'Identificar patologias associadas',
      'Avaliar impacto funcional',
      'Guiar decisão de tratamento'
    ],
    procedures: [
      'Mensuração do ângulo HV (normal <15°)',
      'Mobilidade da 1ª MTF',
      'Avaliação de metatarsalgia de transferência',
      'Presença de dedos em garra',
      'Análise de marcha e calçado'
    ],
    scales: [
      'Manchester Scale (fotográfica)',
      'AOFAS Hallux Score',
      'FFI (Foot Function Index)'
    ],
    documentation: [
      'Registrar ângulo HV e intermetatarsal',
      'Classificar: leve (<20°), moderado (20-40°), grave (>40°)',
      'Avaliar rigidez (hallux rigidus associado)',
      'Documentar tipo de calçado tolerado'
    ],
    evidence: {
      references: [
        'Nix SE, et al. Prevalence of hallux valgus in the general population. J Foot Ankle Res. 2010.',
        'Menz HB, et al. Foot problems and falls in older people. BMC Musculoskelet Disord. 2017.'
      ]
    },
    clinicalApplication: 'Órteses e exercícios podem aliviar sintomas mas não corrigem deformidade. Cirurgia indicada em deformidade progressiva com dor limitante.',
    relatedTests: [],
    keywords: ['hálux valgo', 'joanete', 'deformidade pé', 'primeiro metatarso']
  },

  // PUNHO E MÃO (4)
  {
    id: 'aval-mao-geral',
    slug: 'avaliacao-mao-punho',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Mão e Punho: Guia Completo',
    metaDescription: 'Protocolo completo de avaliação fisioterapêutica de mão e punho: mobilidade, força, sensibilidade e função.',
    introduction: 'A avaliação da mão requer análise detalhada devido à complexidade anatômica e importância funcional para atividades de vida diária.',
    objectives: [
      'Identificar estrutura(s) acometida(s)',
      'Avaliar mobilidade articular',
      'Testar função de preensão',
      'Avaliar integridade nervosa',
      'Estabelecer impacto funcional'
    ],
    procedures: [
      'Inspeção: edema, atrofia, deformidades',
      'ADM: punho e dedos',
      'Força de preensão e pinça',
      'Avaliação sensitiva: mediano, ulnar, radial',
      'Testes especiais por patologia suspeita'
    ],
    scales: [
      'DASH',
      'QuickDASH',
      'Michigan Hand Questionnaire',
      'Patient-Rated Wrist Evaluation (PRWE)'
    ],
    documentation: [
      'Registrar ADM em graus por articulação',
      'Documentar força de preensão em kg',
      'Mapear alterações sensitivas',
      'Avaliar função: escrita, botões, chaves'
    ],
    evidence: {
      references: [
        'MacDermid JC, et al. Hand and wrist evaluation. J Hand Ther. 2015.',
        'Michlovitz SL, et al. Distal radius fractures: therapy practice patterns. J Hand Ther. 2019.'
      ]
    },
    clinicalApplication: 'Dominância manual influencia expectativas funcionais. Comparação bilateral é essencial para interpretação de força e ADM.',
    relatedTests: ['phalen', 'tinel', 'finkelstein', 'watson'],
    keywords: ['avaliação mão', 'avaliação punho', 'exame físico mão', 'fisioterapia mão']
  },
  {
    id: 'aval-mao-tunel-carpo',
    slug: 'avaliacao-sindrome-tunel-carpo',
    category: 'avaliacao-clinica',
    title: 'Avaliação da Síndrome do Túnel do Carpo',
    metaDescription: 'Protocolo para diagnóstico de síndrome do túnel do carpo: testes provocativos, cluster diagnóstico e indicação de ENMG.',
    introduction: 'A síndrome do túnel do carpo é a neuropatia compressiva mais comum. Diagnóstico clínico é possível com combinação de achados.',
    objectives: [
      'Confirmar compressão do nervo mediano',
      'Classificar gravidade',
      'Diferenciar de radiculopatia cervical',
      'Identificar fatores de risco modificáveis',
      'Determinar necessidade de ENMG'
    ],
    procedures: [
      'Teste de Phalen (1 minuto)',
      'Teste de Tinel no carpo',
      'Teste de compressão carpal',
      'Avaliação sensitiva: polegar, indicador, médio',
      'Força de oposição do polegar (atrofia tenar)'
    ],
    scales: [
      'Boston Carpal Tunnel Questionnaire',
      'Levine Severity Scale',
      'DASH/QuickDASH'
    ],
    documentation: [
      'Registrar tempo de positividade (Phalen)',
      'Documentar padrão parestesia (3,5 dedos mediano)',
      'Avaliar atrofia tenar (casos avançados)',
      'Identificar atividades provocadoras'
    ],
    evidence: {
      sensitivity: 'Phalen: 68%',
      specificity: 'Diagrama mão de Katz: 96%',
      references: [
        'Wainner RS, et al. Development of clinical prediction rule for carpal tunnel syndrome. Arch Phys Med Rehabil. 2005.',
        'Graham B, et al. The American Academy of Orthopaedic Surgeons evidence-based CPG on CTS. J Bone Joint Surg. 2016.'
      ]
    },
    clinicalApplication: 'Cluster de 5+ achados (Phalen, Tinel, diagrama Katz, força pinça diminuída, parestesia noturna) = alta probabilidade. ENMG confirma e estadeia.',
    relatedTests: ['phalen', 'tinel-carpo', 'compressão-carpal'],
    keywords: ['túnel do carpo', 'síndrome carpal', 'nervo mediano', 'parestesia mão']
  },
  {
    id: 'aval-mao-tenossinovite',
    slug: 'avaliacao-tenossinovite-quervain',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Tenossinovite de De Quervain',
    metaDescription: 'Protocolo para diagnóstico de tenossinovite de De Quervain: teste de Finkelstein, diagnóstico diferencial e fatores de risco.',
    introduction: 'A tenossinovite de De Quervain afeta os tendões do abdutor longo e extensor curto do polegar no 1º compartimento extensor.',
    objectives: [
      'Confirmar diagnóstico clínico',
      'Diferenciar de outras causas de dor radial',
      'Identificar fatores de risco ocupacionais',
      'Avaliar gravidade funcional',
      'Guiar tratamento conservador'
    ],
    procedures: [
      'Teste de Finkelstein',
      'Teste de Eichhoff (modificado)',
      'Palpação do 1º compartimento',
      'Avaliação de crepitação',
      'Análise de atividades provocadoras'
    ],
    scales: [
      'DASH',
      'Patient-Rated Wrist/Hand Evaluation',
      'NPRS para atividades específicas'
    ],
    documentation: [
      'Registrar resultado Finkelstein',
      'Documentar edema localizado',
      'Identificar atividades provocadoras',
      'Avaliar uso de imobilização prévia'
    ],
    evidence: {
      sensitivity: 'Finkelstein: 89%',
      specificity: 'Eichhoff: 14%',
      references: [
        'Huisstede BM, et al. De Quervain tenosynovitis: a systematic review. Semin Arthritis Rheum. 2014.',
        'Howell ER. Conservative care of De Quervain tenosynovitis. J Can Chiropr Assoc. 2012.'
      ]
    },
    clinicalApplication: 'Finkelstein positivo + dor localizada no 1º compartimento = diagnóstico provável. Mães de recém-nascidos são população de risco.',
    relatedTests: ['finkelstein', 'eichhoff'],
    keywords: ['De Quervain', 'tenossinovite polegar', 'dor radial punho', 'extensor polegar']
  },
  {
    id: 'aval-mao-epicondilite',
    slug: 'avaliacao-epicondilite',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Epicondilite Lateral e Medial',
    metaDescription: 'Protocolo para diagnóstico de epicondilite: testes provocativos, diagnóstico diferencial e fatores ocupacionais.',
    introduction: 'As epicondilites são tendinopatias de inserção dos músculos do antebraço. A lateral ("cotovelo de tenista") é mais comum que a medial ("cotovelo de golfista").',
    objectives: [
      'Confirmar diagnóstico clínico',
      'Diferenciar lateral vs medial',
      'Excluir síndrome do túnel radial',
      'Identificar fatores ocupacionais/esportivos',
      'Guiar tratamento conservador'
    ],
    procedures: [
      'Palpação do epicôndilo lateral/medial',
      'Teste de Cozen (extensão resistida)',
      'Teste de Mill (extensão passiva)',
      'Teste do cotovelo de golfista (flexão resistida)',
      'Teste de compressão do supinador'
    ],
    scales: [
      'PRTEE (Patient-Rated Tennis Elbow Evaluation)',
      'DASH',
      'Oxford Elbow Score'
    ],
    documentation: [
      'Localizar ponto de dor máxima',
      'Registrar força de preensão (frequentemente diminuída)',
      'Identificar movimentos provocadores',
      'Avaliar atividades ocupacionais/esportivas'
    ],
    evidence: {
      references: [
        'Coombes BK, et al. Effect of corticosteroid injection on lateral epicondylalgia. JAMA. 2013.',
        'Bisset LM, et al. Mobilisation with movement and exercise for lateral epicondylalgia. Br J Sports Med. 2006.'
      ]
    },
    clinicalApplication: 'Mobilização com movimento (Mulligan) + exercício excêntrico têm melhor resultado a longo prazo que infiltração.',
    relatedTests: ['cozen', 'mill', 'teste-supinador'],
    keywords: ['epicondilite lateral', 'cotovelo de tenista', 'epicondilite medial', 'cotovelo de golfista']
  },

  // AVALIAÇÃO NEUROLÓGICA (4)
  {
    id: 'aval-neuro-screening',
    slug: 'avaliacao-neurologica-screening',
    category: 'avaliacao-clinica',
    title: 'Screening Neurológico para Fisioterapeutas',
    metaDescription: 'Protocolo de screening neurológico essencial: dermátomos, miótomos, reflexos e sinais de alerta para encaminhamento.',
    introduction: 'O screening neurológico permite identificar comprometimentos que requerem investigação médica adicional ou modificam o tratamento fisioterapêutico.',
    objectives: [
      'Realizar avaliação neurológica sistemática',
      'Identificar nível de comprometimento',
      'Detectar sinais de neurônio motor superior',
      'Reconhecer bandeiras vermelhas neurológicas',
      'Determinar necessidade de encaminhamento'
    ],
    procedures: [
      'Dermátomos: C5-T1 (MMSS), L2-S2 (MMII)',
      'Miótomos: força por nível radicular',
      'Reflexos: bicipital, tricipital, patelar, aquileu',
      'Sinais de NMS: Babinski, clônus, hiperreflexia',
      'Coordenação: dedo-nariz, calcanhar-joelho'
    ],
    scales: [
      'ASIA Impairment Scale (lesão medular)',
      'Modified Ashworth Scale (espasticidade)',
      'Medical Research Council (força)'
    ],
    documentation: [
      'Mapear alterações sensitivas por dermátomo',
      'Registrar força por miótomo (0-5)',
      'Documentar reflexos (ausente, diminuído, normal, aumentado)',
      'Listar sinais de alerta identificados'
    ],
    evidence: {
      references: [
        'Hoppenfeld S. Physical Examination of the Spine and Extremities. 1976.',
        'Fuller G. Neurological examination made easy. 6th ed. Elsevier, 2019.'
      ]
    },
    clinicalApplication: 'Déficit motor progressivo, sintomas bilaterais simétricos ou disfunção esfincteriana = encaminhamento urgente.',
    relatedTests: [],
    keywords: ['avaliação neurológica', 'dermátomos', 'miótomos', 'reflexos', 'screening neuro']
  },
  {
    id: 'aval-neuro-equilibrio',
    slug: 'avaliacao-equilibrio',
    category: 'avaliacao-clinica',
    title: 'Avaliação do Equilíbrio e Risco de Quedas',
    metaDescription: 'Protocolo para avaliação de equilíbrio e identificação de risco de quedas em idosos e pacientes neurológicos.',
    introduction: 'A avaliação do equilíbrio identifica déficits em sistemas sensoriais (visual, vestibular, proprioceptivo) e estratégias posturais para prevenir quedas.',
    objectives: [
      'Quantificar déficit de equilíbrio',
      'Identificar sistema(s) acometido(s)',
      'Estratificar risco de quedas',
      'Avaliar impacto funcional',
      'Guiar intervenções específicas'
    ],
    procedures: [
      'Teste de Romberg (olhos abertos/fechados)',
      'Single leg stance',
      'Functional Reach Test',
      'Timed Up and Go (TUG)',
      'Berg Balance Scale'
    ],
    scales: [
      'Berg Balance Scale (56 pontos)',
      'Tinetti POMA',
      'Dynamic Gait Index',
      'Activities-Specific Balance Confidence (ABC)',
      'Falls Efficacy Scale'
    ],
    documentation: [
      'Registrar escores em testes padronizados',
      'Documentar história de quedas (último ano)',
      'Avaliar medo de cair',
      'Identificar medicações que afetam equilíbrio'
    ],
    evidence: {
      references: [
        'Shumway-Cook A, et al. Predicting the probability for falls. Phys Ther. 1997.',
        'Panel on Prevention of Falls in Older Persons. Summary of AGES/BGS guidelines. J Am Geriatr Soc. 2011.'
      ]
    },
    clinicalApplication: 'TUG >14s ou Berg <45 = alto risco de quedas. Intervenção multimodal (força + equilíbrio + revisão medicamentosa) é mais efetiva.',
    relatedTests: ['romberg', 'single-leg-stance', 'functional-reach', 'tug'],
    keywords: ['avaliação equilíbrio', 'risco quedas', 'Berg', 'idoso equilíbrio']
  },
  {
    id: 'aval-neuro-marcha',
    slug: 'avaliacao-marcha',
    category: 'avaliacao-clinica',
    title: 'Análise de Marcha Observacional',
    metaDescription: 'Protocolo para análise observacional da marcha: fases, desvios comuns e interpretação clínica.',
    introduction: 'A análise observacional da marcha é ferramenta essencial para identificar desvios e suas causas em diversas condições neuromusculoesqueléticas.',
    objectives: [
      'Identificar fases da marcha alteradas',
      'Correlacionar desvios com causas musculares',
      'Avaliar compensações adaptativas',
      'Guiar programa de reabilitação',
      'Monitorar evolução do tratamento'
    ],
    procedures: [
      'Observação nos planos sagital e frontal',
      'Análise fase de apoio (60%) e balanço (40%)',
      'Avaliação de velocidade e cadência',
      'Comprimento do passo e da passada',
      'Identificação de desvios específicos'
    ],
    scales: [
      'Functional Gait Assessment (FGA)',
      'Dynamic Gait Index',
      'Gait Abnormality Rating Scale (GARS)',
      '10-Meter Walk Test',
      '6-Minute Walk Test'
    ],
    documentation: [
      'Registrar velocidade (m/s) e cadência (passos/min)',
      'Documentar uso de dispositivos auxiliares',
      'Descrever desvios por fase da marcha',
      'Correlacionar desvios com déficits identificados'
    ],
    evidence: {
      references: [
        'Perry J, Burnfield JM. Gait Analysis: Normal and Pathological Function. 2nd ed. 2010.',
        'Toro B, et al. A review of observational gait assessment. Phys Ther Rev. 2003.'
      ]
    },
    clinicalApplication: 'Velocidade de marcha <0.8 m/s em idosos = risco aumentado de eventos adversos. 10MWT e 6MWT são responsivos a intervenção.',
    relatedTests: ['10mwt', '6mwt', 'tug'],
    keywords: ['análise marcha', 'avaliação marcha', 'desvios marcha', 'velocidade marcha']
  },
  {
    id: 'aval-neuro-espasticidade',
    slug: 'avaliacao-espasticidade',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Espasticidade',
    metaDescription: 'Protocolo para avaliação e quantificação de espasticidade: Ashworth modificado, Tardieu e impacto funcional.',
    introduction: 'A espasticidade é componente do síndrome do neurônio motor superior. Avaliação objetiva guia tratamento farmacológico e terapêutico.',
    objectives: [
      'Quantificar grau de espasticidade',
      'Diferenciar espasticidade de contraturas',
      'Avaliar impacto funcional',
      'Identificar gatilhos de exacerbação',
      'Monitorar resposta ao tratamento'
    ],
    procedures: [
      'Modified Ashworth Scale (MAS)',
      'Escala de Tardieu',
      'Avaliação de clônus',
      'Avaliação de posturas em padrão',
      'Análise de impacto em AVDs'
    ],
    scales: [
      'Modified Ashworth Scale (0-4)',
      'Tardieu Scale (velocidade-dependente)',
      'Spasm Frequency Scale',
      'Penn Spasm Frequency Scale'
    ],
    documentation: [
      'Registrar MAS por grupo muscular',
      'Documentar R1 e R2 (Tardieu)',
      'Avaliar clônus (sustentado ou não)',
      'Correlacionar com função'
    ],
    evidence: {
      references: [
        'Bohannon RW, Smith MB. Interrater reliability of a modified Ashworth scale. Phys Ther. 1987.',
        'Haugh AB, et al. A systematic review of the Tardieu Scale. Eur J Neurol. 2006.'
      ]
    },
    clinicalApplication: 'MAS avalia resistência a movimento passivo. Tardieu diferencia componente neural (velocidade-dependente) de contraturas fixas.',
    relatedTests: ['ashworth', 'tardieu', 'clonus-test'],
    keywords: ['espasticidade', 'Ashworth', 'Tardieu', 'neurônio motor superior']
  },

  // AVALIAÇÃO FUNCIONAL (4)
  {
    id: 'aval-func-capacidade',
    slug: 'avaliacao-capacidade-funcional',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Capacidade Funcional Global',
    metaDescription: 'Protocolo para avaliação da capacidade funcional: independência em AVDs, AVDIs e participação social.',
    introduction: 'A avaliação funcional determina a capacidade do indivíduo em realizar atividades cotidianas e participar socialmente, guiando metas de reabilitação.',
    objectives: [
      'Avaliar independência em AVDs básicas',
      'Avaliar independência em AVDs instrumentais',
      'Identificar barreiras ambientais',
      'Estabelecer metas funcionais',
      'Monitorar progresso da reabilitação'
    ],
    procedures: [
      'Avaliação de AVDs: banho, vestuário, alimentação',
      'Avaliação de AVDIs: compras, transporte, medicação',
      'Avaliação de mobilidade funcional',
      'Entrevista sobre participação social',
      'Avaliação do ambiente domiciliar'
    ],
    scales: [
      'Índice de Barthel',
      'FIM (Functional Independence Measure)',
      'Lawton IADL Scale',
      'WHODAS 2.0',
      'SF-36'
    ],
    documentation: [
      'Registrar pontuação em escalas padronizadas',
      'Descrever assistência necessária por atividade',
      'Identificar barreiras modificáveis',
      'Estabelecer metas SMART'
    ],
    evidence: {
      references: [
        'Wade DT. Measurement in Neurological Rehabilitation. Oxford Medical Publications, 1992.',
        'World Health Organization. ICF: International Classification of Functioning. WHO, 2001.'
      ]
    },
    clinicalApplication: 'Abordagem centrada no paciente define metas funcionais relevantes. Barthel e FIM são responsivos a mudanças clínicas.',
    relatedTests: [],
    keywords: ['avaliação funcional', 'AVD', 'independência funcional', 'Barthel', 'FIM']
  },
  {
    id: 'aval-func-retorno-esporte',
    slug: 'avaliacao-retorno-esporte',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Retorno ao Esporte',
    metaDescription: 'Protocolo de testes funcionais para retorno ao esporte: hop tests, Y-balance e critérios de liberação.',
    introduction: 'A decisão de retorno ao esporte requer avaliação objetiva de força, potência, controle neuromuscular e prontidão psicológica.',
    objectives: [
      'Avaliar simetria de membros',
      'Testar controle neuromuscular',
      'Avaliar potência e reatividade',
      'Identificar prontidão psicológica',
      'Estabelecer critérios de liberação'
    ],
    procedures: [
      'Hop tests (single, triple, crossover, timed)',
      'Y-Balance Test',
      'Drop jump / landing assessment',
      'Testes de força isocinética',
      'ACL-RSI (prontidão psicológica)'
    ],
    scales: [
      'Limb Symmetry Index (LSI >90%)',
      'ACL-RSI Scale',
      'Tampa Scale of Kinesiophobia',
      'Global Rating of Change (GROC)'
    ],
    documentation: [
      'Calcular LSI para cada teste',
      'Registrar qualidade de movimento (vídeo)',
      'Documentar histórico de treino atual',
      'Avaliar expectativas vs realidade'
    ],
    evidence: {
      references: [
        'Grindem H, et al. Rehabilitation for ACL injury. Br J Sports Med. 2020.',
        'Kotsifaki A, et al. Measuring only hop distance reduces risk assessment. Br J Sports Med. 2020.'
      ]
    },
    clinicalApplication: 'Critérios modernos: LSI >90% em força e hop tests + qualidade de movimento adequada + ACL-RSI >70. Tempo desde cirurgia isolado é insuficiente.',
    relatedTests: ['hop-tests', 'y-balance', 'drop-jump'],
    keywords: ['retorno esporte', 'RTS', 'hop test', 'critérios liberação', 'reabilitação atleta']
  },
  {
    id: 'aval-func-cardio',
    slug: 'avaliacao-capacidade-aerobica',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Capacidade Aeróbica',
    metaDescription: 'Protocolo de testes submáximos de capacidade aeróbica: TC6M, shuttle test e prescrição de exercício.',
    introduction: 'A avaliação da capacidade aeróbica é fundamental para prescrição de exercício e monitoramento de condições cardiorrespiratórias e sistêmicas.',
    objectives: [
      'Quantificar capacidade funcional aeróbica',
      'Estabelecer baseline para monitoramento',
      'Identificar respostas anormais ao exercício',
      'Guiar prescrição de intensidade',
      'Estratificar risco cardiovascular'
    ],
    procedures: [
      'Teste de Caminhada de 6 Minutos (TC6M)',
      'Incremental Shuttle Walk Test',
      'Step test de 3 minutos',
      'Monitoramento de FC, PA, SpO2, dispneia',
      'Escala de Borg para esforço percebido'
    ],
    scales: [
      'Distância no TC6M (metros)',
      'VO2 estimado',
      'Escala de Borg (6-20 ou 0-10)',
      'Escala de dispneia MRC'
    ],
    documentation: [
      'Registrar distância percorrida',
      'Documentar FC, PA inicial, pico e recuperação',
      'Avaliar SpO2 (dessaturação >4%)',
      'Calcular % do previsto por equação'
    ],
    evidence: {
      references: [
        'ATS Committee on Proficiency Standards. ATS statement: guidelines for the six-minute walk test. Am J Respir Crit Care Med. 2002.',
        'Singh SJ, et al. Development of a shuttle walking test. Thorax. 1992.'
      ]
    },
    clinicalApplication: 'TC6M <300m em DPOC = mau prognóstico. Dessaturação >4% indica limitação ventilatória. Monitorar Borg para ajuste de intensidade.',
    relatedTests: ['tc6m', 'shuttle-test', 'step-test'],
    keywords: ['capacidade aeróbica', 'TC6M', 'teste caminhada', 'condicionamento cardiorrespiratório']
  },
  {
    id: 'aval-func-qualidade-vida',
    slug: 'avaliacao-qualidade-vida',
    category: 'avaliacao-clinica',
    title: 'Avaliação de Qualidade de Vida Relacionada à Saúde',
    metaDescription: 'Instrumentos para mensuração de qualidade de vida: questionários genéricos e específicos em reabilitação.',
    introduction: 'A qualidade de vida relacionada à saúde (QVRS) avalia o impacto de condições de saúde na percepção de bem-estar físico, mental e social do indivíduo.',
    objectives: [
      'Mensurar impacto global da condição',
      'Avaliar domínios físico, mental e social',
      'Estabelecer baseline para tratamento',
      'Monitorar resposta à intervenção',
      'Comunicar desfechos centrados no paciente'
    ],
    procedures: [
      'Aplicação de questionário genérico (SF-36)',
      'Questionários específicos por condição',
      'EQ-5D para utilidade',
      'Entrevista complementar qualitativa',
      'Análise de domínios mais afetados'
    ],
    scales: [
      'SF-36 / SF-12',
      'EQ-5D-5L',
      'WHOQOL-BREF',
      'Questionários específicos (KOOS, HOOS, NDI, ODI)'
    ],
    documentation: [
      'Registrar escores por domínio',
      'Comparar com normas populacionais',
      'Identificar domínios prioritários',
      'Calcular mudança mínima clinicamente importante'
    ],
    evidence: {
      references: [
        'Ware JE, Sherbourne CD. The MOS 36-item short-form health survey (SF-36). Med Care. 1992.',
        'Herdman M, et al. Development and preliminary testing of the new five-level version of EQ-5D. Qual Life Res. 2011.'
      ]
    },
    clinicalApplication: 'Mudança clinicamente importante varia por questionário. SF-36: 3-5 pontos por domínio. EQ-5D: 0.03-0.05 no índice.',
    relatedTests: [],
    keywords: ['qualidade de vida', 'SF-36', 'EQ-5D', 'QVRS', 'desfechos reportados pelo paciente']
  }
];
