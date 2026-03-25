export interface EducationalContent {
  id: string;
  area: 'ortopedia' | 'esportiva' | 'geriatria' | 'neurologia';
  title: string;
  explanation: string;
  topics: string[];
  keyPoints: string[];
  clinicalApplication: string;
  difficulty: 'basico' | 'intermediario' | 'avancado';
  references?: string[];
}

export const educationalContents: EducationalContent[] = [
  // ==================== ORTOPEDIA ====================
  {
    id: 'ort-1',
    area: 'ortopedia',
    title: 'Síndrome do Impacto do Ombro',
    explanation: 'A síndrome do impacto do ombro ocorre quando há compressão das estruturas subacromiais (principalmente o tendão do supraespinhal e bursa subacromial) durante a elevação do braço. É uma das causas mais comuns de dor no ombro em adultos, especialmente em atividades que envolvem movimentos repetitivos acima da cabeça.',
    topics: [
      'Anatomia do espaço subacromial',
      'Mecanismos de compressão: primário vs secundário',
      'Fatores predisponentes: postura, fraqueza muscular, alterações anatômicas',
      'Classificação de Neer (Estágios I, II e III)',
      'Avaliação: testes de impacto (Neer, Hawkins-Kennedy)',
      'Diagnóstico diferencial: lesão de manguito, capsulite'
    ],
    keyPoints: [
      'O teste de Neer avalia a compressão do supraespinhal contra o acrômio',
      'O teste de Hawkins-Kennedy é mais sensível para tendinopatia do supraespinhal',
      'A fraqueza do manguito rotador pode ser causa ou consequência',
      'O fortalecimento excêntrico é fundamental na reabilitação',
      'A correção postural da escápula é essencial para o tratamento'
    ],
    clinicalApplication: 'Na prática clínica, inicie a avaliação identificando fatores posturais como anteriorização de ombros e discinesia escapular. O tratamento deve incluir liberação miofascial do peitoral menor, fortalecimento dos estabilizadores escapulares (trapézio inferior e serrátil anterior) e exercícios excêntricos para o manguito rotador. Evite exercícios acima de 90° nas fases iniciais.',
    difficulty: 'intermediario',
    references: [
      'Neer CS. Impingement lesions. Clin Orthop Relat Res. 1983;(173):70-77.',
      'Michener LA, et al. Anatomical and biomechanical mechanisms of subacromial impingement syndrome. Clin Biomech. 2003;18(5):369-379.',
      'Diercks R, et al. Guideline for diagnosis and treatment of subacromial pain syndrome. Acta Orthop. 2014;85(3):314-322.',
      'Steuri R, et al. Effectiveness of conservative interventions including exercise for rotator cuff disease: systematic review. BMJ Open Sport Exerc Med. 2017;3(1):e000151.'
    ]
  },
  {
    id: 'ort-2',
    area: 'ortopedia',
    title: 'Lesão do Ligamento Cruzado Anterior (LCA)',
    explanation: 'O LCA é o principal estabilizador anterior do joelho, prevenindo a translação anterior da tíbia sobre o fêmur e controlando a rotação. Lesões ocorrem principalmente em atividades esportivas com mudanças bruscas de direção, desaceleração súbita ou aterrissagem de saltos.',
    topics: [
      'Anatomia e biomecânica do LCA',
      'Mecanismos de lesão: pivô, hiperextensão, valgismo',
      'Classificação das lesões (parcial vs completa)',
      'Testes especiais: Lachman, gaveta anterior, pivot shift',
      'Tratamento conservador vs cirúrgico',
      'Fases da reabilitação pós-reconstrução'
    ],
    keyPoints: [
      'O teste de Lachman é o mais sensível para lesão aguda do LCA',
      'Lesões associadas comuns: menisco medial e ligamento colateral medial (tríade)',
      'Critérios para retorno ao esporte: força >90%, testes funcionais, tempo mínimo',
      'A prevenção foca no controle neuromuscular e propriocepção',
      'O valgo dinâmico do joelho é um fator de risco modificável'
    ],
    clinicalApplication: 'No pós-operatório, respeite as fases de cicatrização do enxerto. Nas primeiras semanas, priorize controle de edema, ganho de extensão completa e ativação do quadríceps. Progressão para cadeia cinética fechada e depois aberta. Use critérios objetivos (testes funcionais, isocinético) para liberar atividades esportivas, geralmente após 6-9 meses.',
    difficulty: 'avancado',
    references: [
      'Duthon VB, et al. Anatomy of the anterior cruciate ligament. Knee Surg Sports Traumatol Arthrosc. 2006;14(3):204-213.',
      'Grindem H, et al. Simple decision rules can reduce reinjury risk by 84% after ACL reconstruction. Br J Sports Med. 2016;50(13):804-808.',
      'van Melick N, et al. Evidence-based clinical practice update: practice guidelines for ACL rehabilitation. Br J Sports Med. 2016;50(24):1506-1515.',
      'Filbay SR, Grindem H. Evidence-based recommendations for the management of anterior cruciate ligament (ACL) rupture. Best Pract Res Clin Rheumatol. 2019;33(1):33-47.'
    ]
  },
  {
    id: 'ort-3',
    area: 'ortopedia',
    title: 'Lombalgia Mecânica',
    explanation: 'A lombalgia mecânica representa cerca de 90% dos casos de dor lombar e está relacionada a disfunções musculoesqueléticas sem comprometimento neurológico significativo. Inclui dor muscular, disfunção articular facetária e alterações discais sem herniação.',
    topics: [
      'Classificação: específica vs inespecífica',
      'Red flags: sinais de alerta para patologias graves',
      'Yellow flags: fatores psicossociais de cronificação',
      'Avaliação: padrões de movimento, testes provocativos',
      'Abordagem baseada em classificação (McKenzie, tratamento baseado em mecanismos)',
      'Exercício terapêutico: estabilização segmentar vs global'
    ],
    keyPoints: [
      'A maioria dos casos de lombalgia melhora em 6 semanas',
      'Imagem só é necessária na presença de red flags',
      'O repouso prolongado é contraindicado - movimento ativo é terapêutico',
      'A educação do paciente é uma intervenção efetiva',
      'O fortalecimento do core deve ser funcional e progressivo'
    ],
    clinicalApplication: 'Comece avaliando red e yellow flags para estratificar o risco. Use a preferência direcional (McKenzie) para guiar os exercícios iniciais. Inclua educação sobre dor, incentivo à atividade e exercícios de estabilização. Progrida de exercícios isométricos para dinâmicos e funcionais. Aborde fatores ocupacionais e ergonômicos.',
    difficulty: 'basico',
    references: [
      'Maher C, et al. Non-specific low back pain. Lancet. 2017;389(10070):736-747.',
      'Foster NE, et al. Prevention and treatment of low back pain: evidence, challenges, and promising directions. Lancet. 2018;391(10137):2368-2383.',
      'Oliveira CB, et al. Clinical practice guidelines for the management of non-specific low back pain in primary care. Eur Spine J. 2018;27(11):2791-2803.',
      'McKenzie R, May S. The Lumbar Spine: Mechanical Diagnosis and Therapy. Spinal Publications. 2003.'
    ]
  },
  {
    id: 'ort-4',
    area: 'ortopedia',
    title: 'Osteoartrite de Joelho',
    explanation: 'A osteoartrite (OA) é uma doença articular degenerativa caracterizada por degradação da cartilagem, remodelação óssea, formação de osteófitos e inflamação sinovial. No joelho, afeta principalmente o compartimento medial devido à distribuição de carga durante a marcha.',
    topics: [
      'Fisiopatologia: degradação da cartilagem e inflamação',
      'Fatores de risco: idade, obesidade, trauma prévio, alinhamento',
      'Avaliação funcional: WOMAC, Lequesne, TUG',
      'Critérios diagnósticos: clínicos e radiográficos',
      'Tratamento conservador: exercício, perda de peso, órteses',
      'Quando encaminhar para cirurgia'
    ],
    keyPoints: [
      'O exercício é a intervenção mais efetiva para OA de joelho',
      'Perda de 5% do peso corporal reduz significativamente a dor',
      'Fortalecimento do quadríceps é essencial',
      'Exercícios aquáticos são excelentes para fases dolorosas',
      'Palmilhas e órteses podem redistribuir a carga articular'
    ],
    clinicalApplication: 'Elabore um programa de exercícios combinando fortalecimento muscular (especialmente quadríceps e glúteos), exercícios aeróbicos de baixo impacto (natação, bicicleta) e alongamentos. Use crioterapia pós-exercício se houver efusão. Oriente sobre autogerenciamento, adaptação de atividades e importância da adesão a longo prazo.',
    difficulty: 'basico',
    references: [
      'Kolasinski SL, et al. 2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis. Arthritis Care Res. 2020;72(2):149-162.',
      'Bannuru RR, et al. OARSI guidelines for the non-surgical management of knee, hip, and polyarticular osteoarthritis. Osteoarthritis Cartilage. 2019;27(11):1578-1589.',
      'Fransen M, et al. Exercise for osteoarthritis of the knee: a Cochrane systematic review. Br J Sports Med. 2015;49(24):1554-1557.',
      'Messier SP, et al. Effects of intensive diet and exercise on knee joint loads and inflammation in overweight adults with knee osteoarthritis. JAMA. 2013;310(12):1263-1273.'
    ]
  },
  {
    id: 'ort-5',
    area: 'ortopedia',
    title: 'Cervicalgia e Cefaleia Cervicogênica',
    explanation: 'A cervicalgia é uma queixa comum que pode estar associada a disfunções musculares, articulares ou discais. A cefaleia cervicogênica é uma dor referida da coluna cervical alta (C1-C3) que se manifesta como dor de cabeça, frequentemente unilateral.',
    topics: [
      'Anatomia funcional da coluna cervical alta',
      'Convergência trigêmino-cervical e dor referida',
      'Avaliação: testes de mobilidade, palpação, testes neurodinâmicos',
      'Diferenciação de outras cefaleias (tensional, migrânea)',
      'Técnicas manuais: mobilização, manipulação',
      'Exercícios: flexores cervicais profundos, postura'
    ],
    keyPoints: [
      'O teste de flexão-rotação avalia a mobilidade de C1-C2',
      'A fraqueza dos flexores cervicais profundos é comum na cervicalgia crônica',
      'A postura da cabeça anteriorizada aumenta a carga cervical',
      'A mobilização da cervical alta pode aliviar a cefaleia cervicogênica',
      'Exercícios de controle motor devem preceder o fortalecimento'
    ],
    clinicalApplication: 'Avalie a postura da cabeça e ombros, mobilidade segmentar e força dos flexores profundos. Utilize mobilização articular nas restrições identificadas. Inicie exercícios de controle motor com baixa carga (chin tuck em supino) e progrida para exercícios funcionais. Oriente sobre ergonomia, especialmente em trabalho com computador.',
    difficulty: 'intermediario',
    references: [
      'Blanpied PR, et al. Neck Pain: Revision 2017. Clinical Practice Guidelines Linked to the ICF from the Orthopaedic Section of APTA. J Orthop Sports Phys Ther. 2017;47(7):A1-A83.',
      'Bogduk N, Govind J. Cervicogenic headache: an assessment of the evidence on clinical diagnosis, invasive tests, and treatment. Lancet Neurol. 2009;8(10):959-968.',
      'Jull G, et al. A randomized controlled trial of exercise and manipulative therapy for cervicogenic headache. Spine. 2002;27(17):1835-1843.',
      'Falla D, et al. Effectiveness of deep cervical flexor muscle training on muscle activity and function. Phys Ther. 2006;86(5):657-665.'
    ]
  },
  {
    id: 'ort-6',
    area: 'ortopedia',
    title: 'Artroplastia Total de Quadril (ATQ) - Reabilitação Completa',
    explanation: 'A artroplastia total de quadril (ATQ) é um procedimento cirúrgico que substitui a articulação do quadril danificada por uma prótese artificial. É uma das cirurgias ortopédicas mais realizadas no mundo, com excelentes resultados para alívio da dor e restauração da função. O objetivo principal é eliminar a dor, restaurar a mobilidade articular e permitir o retorno às atividades funcionais do paciente. A reabilitação fisioterapêutica é fundamental para o sucesso do procedimento.',
    topics: [
      'Indicações da cirurgia: osteoartrose avançada, necrose avascular da cabeça femoral, fratura do colo do fêmur, artrite reumatoide, displasia do desenvolvimento do quadril',
      'Estrutura da prótese: haste femoral (fixada no canal medular), cabeça protética (substitui a cabeça do fêmur), componente acetabular (cup que reveste o acetábulo)',
      'Materiais: titânio, cromo-cobalto, polietileno de alta densidade, cerâmica',
      'Tipos de fixação: cimentada (idosos/osteoporose), não-cimentada (jovens/boa qualidade óssea), híbrida',
      'Objetivos da fisioterapia: controle da dor e edema, recuperação da amplitude de movimento, fortalecimento muscular progressivo, prevenção de complicações (TVP, luxação), retorno funcional às AVDs e atividades',
      'Músculos-chave na recuperação: glúteo médio (estabilização pélvica e marcha), glúteo máximo (extensão e propulsão), quadríceps (controle do joelho e transferências), iliopsoas (flexão e controle da marcha)'
    ],
    keyPoints: [
      'Fase Pós-Operatória Imediata (0-2 semanas): controle de dor e edema, exercícios isométricos de quadríceps e glúteos, mobilização precoce no leito, sentar na beira da cama, primeiros passos com andador',
      'Fase de Reabilitação Inicial (2-6 semanas): progressão da marcha (andador → muletas), exercícios ativos e assistidos de amplitude, fortalecimento em cadeia cinética fechada, treino de transferências e subir/descer escadas',
      'Fase de Reabilitação Funcional (6-12 semanas): marcha sem dispositivos auxiliares, fortalecimento progressivo com resistência, treino de equilíbrio e propriocepção, retorno gradual às atividades funcionais e laborais',
      'Precauções pós-operatórias (variam conforme abordagem cirúrgica - verificar com cirurgião): evitar flexão do quadril >90°, evitar adução além da linha média, evitar rotação interna excessiva, usar elevador de assento sanitário, não cruzar as pernas',
      'A mobilização precoce (24-48h) reduz risco de TVP e melhora resultados funcionais'
    ],
    clinicalApplication: 'Comece a reabilitação nas primeiras 24-48 horas pós-cirurgia. Na fase aguda, foque em exercícios isométricos (quadríceps, glúteos), bombeamento de tornozelo para prevenção de TVP e mobilização precoce respeitando as precauções. Progrida para exercícios ativos de amplitude, fortalecimento em cadeia fechada (mini-agachamentos, ponte) e treino de marcha. Monitore sinais de complicações: dor intensa, edema excessivo, sinais de infecção (febre, vermelhidão), sintomas de TVP (dor na panturrilha, edema unilateral). Possíveis complicações incluem luxação da prótese, infecção, trombose venosa profunda e soltura asséptica. Na fase final, trabalhe propriocepção, marcha em diferentes superfícies e retorno às atividades específicas do paciente. O tempo médio para retorno às atividades normais é de 3-6 meses.',
    difficulty: 'avancado',
    references: [
      'Learmonth ID, et al. The operation of the century: total hip replacement. Lancet. 2007;370(9597):1508-1519.',
      'Di Monaco M, Castiglioni C. Which type of exercise therapy is effective after hip arthroplasty? A systematic review of randomized controlled trials. Eur J Phys Rehabil Med. 2013;49(6):893-907.',
      'Bandholm T, Kehlet H. Physiotherapy exercise after fast-track total hip and knee arthroplasty: time for reconsideration? Arch Phys Med Rehabil. 2012;93(7):1292-1294.',
      'Mikkelsen LR, et al. Early supervised progressive resistance training compared to unsupervised home-based exercise after fast-track total hip replacement. Clin Rehabil. 2014;28(5):425-434.'
    ]
  },

  // ==================== FISIOTERAPIA ESPORTIVA ====================
  {
    id: 'esp-1',
    area: 'esportiva',
    title: 'Lesões Musculares no Esporte',
    explanation: 'As lesões musculares representam cerca de 30% das lesões esportivas. Podem ser classificadas em diretas (contusão) ou indiretas (estiramento), sendo mais comuns em músculos biarticulares durante a contração excêntrica, como isquiotibiais durante a corrida.',
    topics: [
      'Classificação: grau I (leve), II (moderado), III (ruptura completa)',
      'Fatores de risco: fadiga, aquecimento inadequado, lesão prévia',
      'Fases de cicatrização: inflamatória, proliferativa, remodelação',
      'Avaliação: história, palpação, testes funcionais',
      'Tratamento: POLICE vs HARM',
      'Critérios de retorno ao esporte'
    ],
    keyPoints: [
      'O protocolo POLICE substituiu o RICE (Protection, Optimal Loading, Ice, Compression, Elevation)',
      'A carga controlada precoce favorece a cicatrização',
      'O fortalecimento excêntrico é fundamental na reabilitação',
      'Lesão prévia é o principal fator de risco para recidiva',
      'Critérios de alta: força, flexibilidade, testes funcionais, confiança'
    ],
    clinicalApplication: 'Na fase aguda, use proteção sem imobilização prolongada. Introduza exercícios isométricos indolores precocemente. Progrida para isotônicos, excêntricos e pliométricos. Use testes funcionais específicos do esporte (sprints, saltos, mudanças de direção) antes da liberação. Implemente programa preventivo com Nordic Hamstring para isquiotibiais.',
    difficulty: 'intermediario',
    references: [
      'Ekstrand J, et al. Epidemiology of muscle injuries in professional football (soccer). Am J Sports Med. 2011;39(6):1226-1232.',
      'Askling CM, et al. Acute first-time hamstring strains during high-speed running. Am J Sports Med. 2007;35(2):197-206.',
      'van der Horst N, et al. The preventive effect of the Nordic hamstring exercise on hamstring injuries in amateur soccer players. Am J Sports Med. 2015;43(6):1316-1323.',
      'Mendiguchia J, Brughelli M. A return-to-sport algorithm for acute hamstring injuries. Phys Ther Sport. 2011;12(1):2-14.'
    ]
  },
  {
    id: 'esp-2',
    area: 'esportiva',
    title: 'Entorse de Tornozelo',
    explanation: 'A entorse lateral de tornozelo é a lesão mais comum no esporte, afetando principalmente o ligamento talofibular anterior. Ocorre geralmente por inversão forçada durante a aterrissagem ou mudança de direção, especialmente em terrenos irregulares.',
    topics: [
      'Anatomia do complexo ligamentar lateral',
      'Mecanismo de lesão e classificação',
      'Avaliação: Ottawa Ankle Rules, testes de estabilidade',
      'Instabilidade crônica: mecânica vs funcional',
      'Reabilitação: mobilidade, propriocepção, fortalecimento',
      'Prevenção: uso de tornozeleiras, treino proprioceptivo'
    ],
    keyPoints: [
      'As Ottawa Ankle Rules ajudam a decidir sobre radiografia',
      'Imobilização prolongada é prejudicial - mobilização precoce é indicada',
      'O treino proprioceptivo reduz recidivas em até 50%',
      'Déficits de equilíbrio podem persistir por meses',
      'Tornozeleiras são efetivas na prevenção de recidivas'
    ],
    clinicalApplication: 'Após exclusão de fratura, inicie mobilização ativa precoce. Use exercícios de mobilidade, fortalecimento dos fibulares e treino de equilíbrio progressivo (superfície estável → instável, olhos abertos → fechados). Inclua exercícios específicos do esporte antes da alta. Recomende uso de tornozeleira por 6-12 meses.',
    difficulty: 'basico',
    references: [
      'Doherty C, et al. The incidence and prevalence of ankle sprain injury: a systematic review. Sports Med. 2014;44(1):123-140.',
      'Vuurberg G, et al. Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. Br J Sports Med. 2018;52(15):956.',
      'Kaminski TW, et al. National Athletic Trainers\' Association position statement: conservative management of ankle sprains. J Athl Train. 2013;48(4):528-545.',
      'Hupperets MDW, et al. Effect of unsupervised home based proprioceptive training on recurrences of ankle sprain. BMJ. 2009;339:b2684.'
    ]
  },
  {
    id: 'esp-3',
    area: 'esportiva',
    title: 'Tendinopatia Patelar (Joelho do Saltador)',
    explanation: 'A tendinopatia patelar é uma condição degenerativa que afeta a inserção proximal do tendão patelar, comum em atletas de salto (vôlei, basquete). Resulta de sobrecarga repetitiva que excede a capacidade de adaptação do tendão.',
    topics: [
      'Fisiopatologia: modelo contínuo de tendinopatia',
      'Fatores de risco: volume de treino, rigidez de quadríceps, biomecânica',
      'Avaliação: VISA-P, palpação, testes funcionais',
      'Estágios: reativa, degenerativa, degenerativa com ruptura',
      'Tratamento: carga progressiva, exercícios excêntricos, isométricos',
      'Gestão de carga: periodização, modificação de treino'
    ],
    keyPoints: [
      'Repouso completo não é a solução - gestão de carga é fundamental',
      'Exercícios isométricos podem ter efeito analgésico imediato',
      'O programa excêntrico em declive é bem estabelecido na literatura',
      'Heavy slow resistance (HSR) é uma alternativa efetiva ao excêntrico',
      'A progressão deve ser guiada pelos sintomas (dor ≤3/10 durante exercício)'
    ],
    clinicalApplication: 'Avalie a carga de treino atual e ajuste para níveis toleráveis (dor ≤3/10). Inicie com isométricos (45° por 45 segundos, 5x/dia) para analgesia. Progrida para excêntricos em declive ou HSR. Não pare completamente o esporte - adapte a intensidade. Monitore com VISA-P mensalmente.',
    difficulty: 'intermediario',
    references: [
      'Cook JL, Purdam CR. Is tendon pathology a continuum? A pathology model to explain the clinical presentation of load-induced tendinopathy. Br J Sports Med. 2009;43(6):409-416.',
      'Malliaras P, et al. Patellar tendinopathy: clinical diagnosis, load management, and advice for challenging case presentations. J Orthop Sports Phys Ther. 2015;45(11):887-898.',
      'Kongsgaard M, et al. Corticosteroid injections, eccentric decline squat training and heavy slow resistance training in patellar tendinopathy. Scand J Med Sci Sports. 2009;19(6):790-802.',
      'Rio E, et al. Isometric exercise induces analgesia and reduces inhibition in patellar tendinopathy. Br J Sports Med. 2015;49(19):1277-1283.'
    ]
  },
  {
    id: 'esp-4',
    area: 'esportiva',
    title: 'Síndrome do Trato Iliotibial',
    explanation: 'A síndrome do trato iliotibial (STIT) é uma causa comum de dor lateral do joelho em corredores. Ocorre por fricção repetitiva do trato iliotibial sobre o epicôndilo lateral do fêmur, especialmente durante a flexão de 30° do joelho.',
    topics: [
      'Anatomia e biomecânica do trato iliotibial',
      'Fatores de risco: aumento súbito de volume, fraqueza de abdutores',
      'Avaliação: teste de Ober, palpação, análise da corrida',
      'Diferencial: lesão meniscal, síndrome da dor patelofemoral',
      'Tratamento: gestão de carga, fortalecimento de quadril, liberação miofascial',
      'Modificações da técnica de corrida'
    ],
    keyPoints: [
      'O aumento rápido do volume de corrida é o principal fator de risco',
      'A fraqueza dos abdutores do quadril está frequentemente associada',
      'O foam roller pode aliviar sintomas, mas não trata a causa',
      'O fortalecimento de glúteo médio é fundamental',
      'Aumentar a cadência da corrida pode reduzir a carga no joelho'
    ],
    clinicalApplication: 'Reduza o volume de corrida para níveis assintomáticos. Implemente fortalecimento de abdutores e rotadores externos de quadril. Use liberação miofascial do tensor da fáscia lata e glúteo máximo. Analise e corrija padrões de corrida (cadência, crossover). Retorno gradual à corrida seguindo a regra dos 10%.',
    difficulty: 'intermediario',
    references: [
      'Fredericson M, Wolf C. Iliotibial band syndrome in runners: innovations in treatment. Sports Med. 2005;35(5):451-459.',
      'Ferber R, et al. Strengthening of the hip and core versus knee muscles for the treatment of patellofemoral pain. J Athl Train. 2015;50(4):366-377.',
      'Noehren B, et al. Proximal and distal kinematics in female runners with patellofemoral pain. Clin Biomech. 2012;27(4):366-371.',
      'Heiderscheit BC, et al. Effects of step rate manipulation on joint mechanics during running. Med Sci Sports Exerc. 2011;43(2):296-302.'
    ]
  },
  {
    id: 'esp-5',
    area: 'esportiva',
    title: 'Concussão Cerebral no Esporte',
    explanation: 'A concussão é uma lesão cerebral traumática leve causada por forças biomecânicas transmitidas ao encéfalo. No esporte, ocorre por impacto direto na cabeça ou forças de aceleração-desaceleração. Os sintomas são funcionais, não estruturais.',
    topics: [
      'Fisiopatologia: crise metabólica cerebral',
      'Sinais e sintomas: cognitivos, físicos, emocionais, sono',
      'Avaliação: SCAT5, teste de equilíbrio, avaliação cognitiva',
      'Protocolo de retorno ao esporte em 6 etapas',
      'Síndrome pós-concussional: sintomas persistentes',
      'Reabilitação: vestibular, cervical, exercício submáximo'
    ],
    keyPoints: [
      'Se suspeita de concussão, retire o atleta imediatamente - "when in doubt, sit them out"',
      'Não há retorno no mesmo dia - mínimo 24-48h assintomático',
      'Cada etapa do protocolo deve ter mínimo 24h',
      'Sintomas >10-14 dias indicam necessidade de tratamento ativo',
      'A reabilitação cervical e vestibular é efetiva em casos persistentes'
    ],
    clinicalApplication: 'Na fase aguda (24-48h), repouso relativo. Após, inicie atividade aeróbica submáxima (abaixo do limiar de sintomas). Use teste de esforço para determinar limiar. Se houver disfunção vestibular ou cervical, trate especificamente. Progrida no protocolo de retorno apenas quando assintomático em cada fase.',
    difficulty: 'avancado',
    references: [
      'McCrory P, et al. Consensus statement on concussion in sport - the 5th international conference on concussion in sport. Br J Sports Med. 2017;51(11):838-847.',
      'Leddy JJ, et al. Rehabilitation of concussion and post-concussion syndrome. Sports Health. 2012;4(2):147-154.',
      'Schneider KJ, et al. Cervicovestibular rehabilitation in sport-related concussion. Br J Sports Med. 2014;48(17):1294-1298.',
      'Harmon KG, et al. American Medical Society for Sports Medicine position statement on concussion in sport. Br J Sports Med. 2019;53(4):213-225.'
    ]
  },

  // ==================== GERIATRIA ====================
  {
    id: 'ger-1',
    area: 'geriatria',
    title: 'Síndrome da Fragilidade',
    explanation: 'A fragilidade é uma síndrome geriátrica caracterizada pela diminuição da reserva fisiológica e aumento da vulnerabilidade a estressores. Está associada a maior risco de quedas, hospitalização, institucionalização e mortalidade.',
    topics: [
      'Definição: fenótipo de Fried (5 critérios)',
      'Critérios: perda de peso, fadiga, baixa atividade, lentidão, fraqueza',
      'Pré-fragilidade: 1-2 critérios positivos',
      'Avaliação: velocidade de marcha, força de preensão, SPPB',
      'Intervenções: exercício multicomponente, nutrição, polifarmácia',
      'Reversibilidade: pré-fragilidade é mais modificável'
    ],
    keyPoints: [
      'A velocidade de marcha <0,8 m/s é um indicador de fragilidade',
      'A sarcopenia e fragilidade frequentemente coexistem',
      'O exercício multicomponente é a intervenção mais efetiva',
      'A pré-fragilidade é uma janela de oportunidade para intervenção',
      'A abordagem deve ser multidisciplinar'
    ],
    clinicalApplication: 'Avalie fragilidade em todos os idosos >70 anos. Use testes simples como velocidade de marcha e força de preensão. Prescreva exercício multicomponente: resistência, equilíbrio, flexibilidade e aeróbico. Colabore com nutricionista para garantir ingesta proteica adequada (1,0-1,2g/kg/dia). Revise medicações com a equipe.',
    difficulty: 'intermediario',
    references: [
      'Fried LP, et al. Frailty in older adults: evidence for a phenotype. J Gerontol A Biol Sci Med Sci. 2001;56(3):M146-156.',
      'Clegg A, et al. Frailty in elderly people. Lancet. 2013;381(9868):752-762.',
      'Theou O, et al. What do we know about frailty in the acute care setting? A scoping review. BMC Geriatr. 2018;18(1):139.',
      'Dent E, et al. Physical frailty: ICFSR international clinical practice guidelines for identification and management. J Nutr Health Aging. 2019;23(9):771-787.'
    ]
  },
  {
    id: 'ger-2',
    area: 'geriatria',
    title: 'Prevenção de Quedas no Idoso',
    explanation: 'Quedas são a principal causa de lesões em idosos, podendo resultar em fraturas, medo de cair e declínio funcional. A prevenção requer identificação dos fatores de risco modificáveis e intervenção multicomponente.',
    topics: [
      'Epidemiologia: 1/3 dos idosos >65 anos caem anualmente',
      'Fatores de risco: intrínsecos (força, equilíbrio, visão) e extrínsecos (ambiente)',
      'Avaliação: TUG, Berg, histórico de quedas, medicamentos',
      'Estratégias de prevenção: exercício, revisão medicamentosa, ambiente',
      'O medo de cair e suas consequências',
      'Programa Otago e outras evidências'
    ],
    keyPoints: [
      'TUG >14 segundos indica alto risco de quedas',
      'O exercício é a intervenção mais efetiva - reduz quedas em 23%',
      'O treino de equilíbrio deve ser desafiador para ser efetivo',
      'A revisão de medicamentos psicotrópicos é fundamental',
      'A vitamina D pode beneficiar idosos com deficiência'
    ],
    clinicalApplication: 'Avalie risco de quedas em todo idoso. Implemente o Programa Otago ou similar: exercícios de fortalecimento de MMII + equilíbrio progressivo, 3x/semana, por pelo menos 50 horas totais. Oriente sobre riscos ambientais (tapetes, iluminação, banheiro). Encaminhe para revisão de medicamentos e avaliação oftalmológica.',
    difficulty: 'basico',
    references: [
      'Sherrington C, et al. Exercise for preventing falls in older people living in the community. Cochrane Database Syst Rev. 2019;1(1):CD012424.',
      'Campbell AJ, Robertson MC. Rethinking individual and community fall prevention strategies: a meta-regression comparing single and multifactorial interventions. Age Ageing. 2007;36(6):656-662.',
      'Gillespie LD, et al. Interventions for preventing falls in older people living in the community. Cochrane Database Syst Rev. 2012;(9):CD007146.',
      'Panel on Prevention of Falls in Older Persons, AGS/BGS. Summary of the Updated American Geriatrics Society/British Geriatrics Society clinical practice guideline for prevention of falls in older persons. J Am Geriatr Soc. 2011;59(1):148-157.'
    ]
  },
  {
    id: 'ger-3',
    area: 'geriatria',
    title: 'Sarcopenia',
    explanation: 'A sarcopenia é a perda progressiva de massa e força muscular associada ao envelhecimento. Afeta a funcionalidade, aumenta o risco de quedas e está relacionada a pior prognóstico em diversas condições de saúde.',
    topics: [
      'Definição EWGSOP2: força + massa muscular + desempenho',
      'Diagnóstico: dinamometria, BIA/DXA, velocidade de marcha',
      'Sarcopenia primária (idade) vs secundária (doença, inatividade)',
      'Mecanismos: anabolismo reduzido, inflamação, denervação',
      'Intervenções: exercício resistido, nutrição proteica',
      'Papel da vitamina D e suplementação'
    ],
    keyPoints: [
      'A força é o melhor indicador funcional de sarcopenia',
      'Força de preensão <27kg (H) ou <16kg (M) sugere sarcopenia',
      'O exercício resistido é a intervenção mais efetiva',
      'Proteína: 1,0-1,5g/kg/dia, distribuída ao longo do dia',
      'Leucina e vitamina D podem potencializar os efeitos do exercício'
    ],
    clinicalApplication: 'Rastreie sarcopenia em idosos com declínio funcional, quedas ou doenças crônicas. Prescreva exercício resistido 2-3x/semana, progressivo, com foco em grandes grupos musculares. Colabore com nutricionista para otimizar ingesta proteica (20-30g por refeição). Considere vitamina D se deficiente.',
    difficulty: 'intermediario',
    references: [
      'Cruz-Jentoft AJ, et al. Sarcopenia: revised European consensus on definition and diagnosis (EWGSOP2). Age Ageing. 2019;48(1):16-31.',
      'Beaudart C, et al. Sarcopenia: burden and challenges for public health. Arch Public Health. 2014;72(1):45.',
      'Dent E, et al. International Clinical Practice Guidelines for Sarcopenia (ICFSR): Screening, Diagnosis and Management. J Nutr Health Aging. 2018;22(10):1148-1161.',
      'Landi F, et al. Exercise as a remedy for sarcopenia. Curr Opin Clin Nutr Metab Care. 2014;17(1):25-31.'
    ]
  },
  {
    id: 'ger-4',
    area: 'geriatria',
    title: 'Reabilitação após Fratura de Quadril',
    explanation: 'A fratura de quadril é uma emergência geriátrica com alta morbimortalidade, afetando principalmente idosos com osteoporose. O tratamento é predominantemente cirúrgico, podendo envolver osteossíntese (fixação da fratura) ou artroplastia (substituição por prótese). A reabilitação precoce e intensiva é fundamental para recuperar a funcionalidade, prevenir complicações e reduzir mortalidade no primeiro ano.',
    topics: [
      'Tipos de fratura: intracapsulares (colo do fêmur - maior risco de necrose avascular) e extracapsulares (transtrocantérica, subtrocantérica)',
      'Tratamento cirúrgico: osteossíntese com parafusos/placas (fraturas estáveis) vs artroplastia parcial ou total (fraturas desviadas do colo em idosos)',
      'Quando indicar artroplastia: fratura desviada do colo femoral, necrose avascular prévia, artrose pré-existente, paciente ativo com expectativa de vida >5 anos',
      'Reabilitação precoce: mobilização idealmente nas primeiras 24h pós-operatório',
      'Fases da reabilitação: aguda (hospitalar), subaguda (centro de reabilitação), ambulatorial (domicílio/clínica)',
      'Prevenção secundária: tratamento da osteoporose, prevenção de quedas, fortalecimento muscular'
    ],
    keyPoints: [
      'Mobilização precoce (24-48h) reduz complicações (TVP, úlceras, pneumonia) e mortalidade',
      'A descarga de peso geralmente é permitida imediatamente com artroplastia; verificar com cirurgião em osteossíntese',
      'Objetivos funcionais progressivos: controle de tronco → sentar → transferências → marcha com apoio → marcha independente',
      'Se artroplastia: aplicar precauções de luxação (ver conteúdo "Artroplastia Total de Quadril")',
      'O risco de nova fratura no primeiro ano é de 5-10% - prevenção é essencial',
      'A abordagem geriátrica integral (ortogeriatria) reduz mortalidade em 20-30%'
    ],
    clinicalApplication: 'Inicie mobilização no primeiro dia pós-operatório se clinicamente estável. Siga as orientações do cirurgião sobre descarga de peso (geralmente liberada em artroplastias, restrita em algumas osteossínteses). Progrida de sentar na beira da cama para transferências e marcha com andador. Se o paciente realizou artroplastia, aplique as precauções de luxação (evitar flexão >90°, adução e rotação interna). Trabalhe força de quadríceps e glúteos (especialmente glúteo médio para estabilidade na marcha). Inclua treino de equilíbrio após liberação. Garanta avaliação e tratamento para osteoporose. Avalie necessidade de adaptações domiciliares para prevenção de novas quedas.',
    difficulty: 'intermediario',
    references: [
      'Moja L, et al. Timing matters in hip fracture surgery: patients operated within 48 hours have better outcomes. PLoS Med. 2012;9(8):e1001221.',
      'Handoll HH, et al. Rehabilitation for hip fracture in older people. Cochrane Database Syst Rev. 2021;11(11):CD007624.',
      'Leal J, et al. Impact of hip fracture on hospital care costs: a population-based study. Osteoporos Int. 2016;27(2):549-558.',
      'Prestmo A, et al. Comprehensive geriatric care for patients with hip fractures: a prospective, randomised, controlled trial. Lancet. 2015;385(9978):1623-1633.'
    ]
  },
  {
    id: 'ger-5',
    area: 'geriatria',
    title: 'Exercício Físico no Idoso',
    explanation: 'O exercício físico regular é a intervenção mais efetiva para manter a funcionalidade, prevenir doenças crônicas e melhorar a qualidade de vida no envelhecimento. Deve incluir componentes aeróbicos, de resistência, equilíbrio e flexibilidade.',
    topics: [
      'Benefícios: cardiovascular, muscular, cognitivo, emocional',
      'Recomendações: 150min/sem aeróbico + 2x resistência + equilíbrio',
      'Princípios da prescrição: individualização, progressão, especificidade',
      'Adaptações para comorbidades (cardiopatia, diabetes, artrose)',
      'Exercício cognitivo-motor (dupla-tarefa)',
      'Barreiras e estratégias de adesão'
    ],
    keyPoints: [
      'Qualquer quantidade de exercício é melhor que nenhuma',
      'O exercício resistido é seguro e efetivo mesmo em idosos muito velhos',
      'O treino de equilíbrio deve ser desafiador e frequente',
      'Exercícios de dupla-tarefa beneficiam a cognição e equilíbrio',
      'A supervisão inicial aumenta a segurança e adesão'
    ],
    clinicalApplication: 'Prescreva exercício de forma individualizada, considerando preferências, comorbidades e nível atual. Combine treino resistido (2-3x/sem, 8-12 rep, grandes grupos) com aeróbico moderado (caminhada, natação) e equilíbrio desafiador. Utilize exercícios de dupla-tarefa (cognitivo + motor). Monitore adaptações cardiovasculares e progrida gradualmente.',
    difficulty: 'basico',
    references: [
      'Chodzko-Zajko WJ, et al. American College of Sports Medicine position stand. Exercise and physical activity for older adults. Med Sci Sports Exerc. 2009;41(7):1510-1530.',
      'Liu CJ, Latham NK. Progressive resistance strength training for improving physical function in older adults. Cochrane Database Syst Rev. 2009;(3):CD002759.',
      'Northey JM, et al. Exercise interventions for cognitive function in adults older than 50: a systematic review with meta-analysis. Br J Sports Med. 2018;52(3):154-160.',
      'Bull FC, et al. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. Br J Sports Med. 2020;54(24):1451-1462.'
    ]
  },

  // ==================== NEUROLOGIA ====================
  {
    id: 'neu-1',
    area: 'neurologia',
    title: 'Acidente Vascular Encefálico (AVE) - Fase Aguda',
    explanation: 'O AVE é a principal causa de incapacidade neurológica em adultos. A reabilitação deve iniciar precocemente, ainda na fase hospitalar, aproveitando a neuroplasticidade e prevenindo complicações da imobilidade.',
    topics: [
      'Tipos: isquêmico (85%) e hemorrágico (15%)',
      'Apresentação: hemiparesia, afasia, negligência, ataxia',
      'Avaliação: NIHSS, escala de Brunnstrom, FIM',
      'Reabilitação precoce: mobilização, posicionamento, prevenção de ombro doloroso',
      'Neuroplasticidade: janela de oportunidade',
      'Equipe interdisciplinar'
    ],
    keyPoints: [
      'A mobilização precoce (24-48h) é segura e benéfica',
      'O posicionamento correto previne contraturas e ombro doloroso',
      'A intensidade da reabilitação correlaciona-se com recuperação',
      'Os primeiros 3 meses são críticos para recuperação motora',
      'A repetição e prática orientada à tarefa são fundamentais'
    ],
    clinicalApplication: 'Inicie mobilização e posicionamento nas primeiras 24-48h. Proteja o ombro hemiplégico com posicionamento e manuseio correto. Estimule uso do lado afetado em tarefas funcionais. Inclua exercícios de controle de tronco precocemente. Trabalhe transferências e marcha assim que possível. Oriente cuidadores.',
    difficulty: 'intermediario',
    references: [
      'Langhorne P, et al. Stroke rehabilitation. Lancet. 2011;377(9778):1693-1702.',
      'AVERT Trial Collaboration Group. Efficacy and safety of very early mobilisation within 24h of stroke onset (AVERT): a randomised controlled trial. Lancet. 2015;386(9988):46-55.',
      'Veerbeek JM, et al. What is the evidence for physical therapy poststroke? A systematic review and meta-analysis. PLoS One. 2014;9(2):e87987.',
      'Winstein CJ, et al. Guidelines for Adult Stroke Rehabilitation and Recovery: AHA/ASA Guideline. Stroke. 2016;47(6):e98-e169.'
    ]
  },
  {
    id: 'neu-2',
    area: 'neurologia',
    title: 'Doença de Parkinson',
    explanation: 'A doença de Parkinson é uma condição neurodegenerativa progressiva caracterizada por bradicinesia, rigidez, tremor de repouso e instabilidade postural. A fisioterapia é fundamental para manter a funcionalidade e qualidade de vida.',
    topics: [
      'Fisiopatologia: degeneração dopaminérgica na substância negra',
      'Sintomas motores: bradicinesia, rigidez, tremor, instabilidade postural',
      'Sintomas não-motores: depressão, constipação, distúrbios do sono',
      'Avaliação: UPDRS, Hoehn & Yahr, testes de marcha e equilíbrio',
      'Intervenções: treino de marcha, amplitude, equilíbrio, dicas externas',
      'Estratégias compensatórias: LSVT BIG, dicas auditivas e visuais'
    ],
    keyPoints: [
      'O exercício de alta intensidade pode ter efeito neuroprotetor',
      'Dicas externas (visuais, auditivas) ajudam a iniciar o movimento',
      'O freezing é mais comum em espaços estreitos e durante mudanças de direção',
      'O treino de amplitude (LSVT BIG) melhora a bradicinesia',
      'A dupla-tarefa piora o desempenho motor - treinar especificamente'
    ],
    clinicalApplication: 'Prescreva exercício aeróbico de intensidade moderada-alta (60-85% FC máx). Use LSVT BIG para amplitude de movimento. Treine marcha com dicas visuais (linhas no chão) e auditivas (metrônomo). Inclua exercícios de equilíbrio desafiadores. Trabalhe estratégias para freezing. Oriente sobre segurança e prevenção de quedas.',
    difficulty: 'avancado',
    references: [
      'Tomlinson CL, et al. Physiotherapy versus placebo or no intervention in Parkinson\'s disease. Cochrane Database Syst Rev. 2013;(9):CD002817.',
      'Schenkman M, et al. Effect of High-Intensity Treadmill Exercise on Motor Symptoms in Patients With De Novo Parkinson Disease: A Phase 2 Randomized Clinical Trial. JAMA Neurol. 2018;75(2):219-226.',
      'Fox C, et al. LSVT LOUD and LSVT BIG: Behavioral Treatment Programs for Speech and Body Movement in Parkinson Disease. Parkinsons Dis. 2012;2012:391946.',
      'Keus SH, et al. European Physiotherapy Guideline for Parkinson\'s Disease. KNGF/ParkinsonNet. 2014.'
    ]
  },
  {
    id: 'neu-3',
    area: 'neurologia',
    title: 'Esclerose Múltipla',
    explanation: 'A esclerose múltipla é uma doença autoimune desmielinizante do sistema nervoso central. Apresenta-se de forma variável, com surtos e remissões ou progressão contínua. A fisioterapia adapta-se às flutuações e ao estágio da doença.',
    topics: [
      'Tipos: remitente-recorrente, progressiva primária, progressiva secundária',
      'Sintomas comuns: fadiga, espasticidade, ataxia, fraqueza, disfunção vesical',
      'Avaliação: EDSS, teste de caminhada, escalas de fadiga e espasticidade',
      'Exercício: seguro e benéfico - não provoca surtos',
      'Gestão da fadiga: conservação de energia, exercício aeróbico',
      'Neurorreabilitação: prática orientada à tarefa, tecnologia assistiva'
    ],
    keyPoints: [
      'O exercício não aumenta o risco de surtos - é seguro e recomendado',
      'A fadiga é o sintoma mais limitante - deve ser manejada ativamente',
      'A termossensibilidade (fenômeno de Uhthoff) é comum - adapte o ambiente',
      'O treino aeróbico melhora a fadiga a médio prazo',
      'A abordagem deve ser flexível, adaptando-se aos surtos e progressão'
    ],
    clinicalApplication: 'Avalie fadiga, mobilidade, equilíbrio e espasticidade. Prescreva exercício aeróbico moderado (evitando superaquecimento) e resistido. Ensine técnicas de conservação de energia. Adapte o programa durante surtos. Use cooling vests se termossensibilidade. Trabalhe equilíbrio e marcha. Considere tecnologia assistiva conforme progressão.',
    difficulty: 'avancado',
    references: [
      'Latimer-Cheung AE, et al. Effects of exercise training on fitness, mobility, fatigue, and health-related quality of life among adults with multiple sclerosis: a systematic review. Arch Phys Med Rehabil. 2013;94(9):1800-1828.',
      'Motl RW, et al. Exercise in patients with multiple sclerosis. Lancet Neurol. 2017;16(10):848-856.',
      'Dalgas U, et al. Resistance training improves muscle strength and functional capacity in multiple sclerosis. Neurology. 2009;73(18):1478-1484.',
      'Khan F, et al. Multidisciplinary rehabilitation for adults with multiple sclerosis. Cochrane Database Syst Rev. 2007;(2):CD006036.'
    ]
  },
  {
    id: 'neu-4',
    area: 'neurologia',
    title: 'Lesão Medular',
    explanation: 'A lesão medular resulta em déficits motores, sensitivos e autonômicos abaixo do nível da lesão. A reabilitação visa maximizar a independência funcional, prevenir complicações e melhorar a qualidade de vida.',
    topics: [
      'Classificação ASIA: nível e completude da lesão',
      'Complicações: úlceras de pressão, TVP, disreflexia autonômica, espasticidade',
      'Avaliação funcional por nível de lesão',
      'Objetivos funcionais: tetraplégico vs paraplégico',
      'Treino de transferências, cadeira de rodas, marcha (se aplicável)',
      'Tecnologia assistiva e adaptações'
    ],
    keyPoints: [
      'O nível e completude determinam o prognóstico funcional',
      'A prevenção de úlceras de pressão é prioritária',
      'A disreflexia autonômica (T6 e acima) é uma emergência',
      'Lesões incompletas têm potencial de recuperação',
      'A independência funcional depende do nível preservado'
    ],
    clinicalApplication: 'Avalie conforme ASIA para classificar a lesão. Elabore programa conforme nível: fortalecimento de músculos preservados, treino de transferências apropriadas, mobilidade em cadeira de rodas ou marcha (se aplicável). Previna complicações: mudanças de decúbito, inspeção da pele, manejo da espasticidade. Colabore com equipe multidisciplinar.',
    difficulty: 'avancado',
    references: [
      'Hicks AL, et al. Long-term exercise training in persons with spinal cord injury: effects on strength, arm ergometry performance and psychological well-being. Spinal Cord. 2003;41(1):34-43.',
      'Harvey LA. Physiotherapy rehabilitation for people with spinal cord injuries. J Physiother. 2016;62(1):4-11.',
      'Nas K, et al. Rehabilitation of spinal cord injuries. World J Orthop. 2015;6(1):8-16.',
      'Consortium for Spinal Cord Medicine. Outcomes following traumatic spinal cord injury: clinical practice guidelines for health-care professionals. J Spinal Cord Med. 2000;23(4):289-316.'
    ]
  },
  {
    id: 'neu-5',
    area: 'neurologia',
    title: 'Paralisia Cerebral',
    explanation: 'A paralisia cerebral é um grupo de desordens permanentes do desenvolvimento do movimento e postura, causadas por lesão cerebral não progressiva em desenvolvimento. A fisioterapia é fundamental desde os primeiros meses de vida.',
    topics: [
      'Classificação: espástica, discinética, atáxica, mista',
      'Classificação topográfica: hemiparesia, diparesia, quadriparesia',
      'GMFCS: 5 níveis de funcionalidade motora grossa',
      'Avaliação: GMFM, metas funcionais (COPM, GAS)',
      'Intervenções: prática orientada à tarefa, fortalecimento, alongamento',
      'Espasticidade: manejo conservador, toxina botulínica, cirurgia'
    ],
    keyPoints: [
      'O foco mudou de normalizar o movimento para funcionalidade',
      'A prática orientada à tarefa é mais efetiva que técnicas neurodesenvolvimentais tradicionais',
      'O fortalecimento não aumenta a espasticidade - é benéfico',
      'GMFCS prevê prognóstico motor - estabiliza por volta dos 5 anos',
      'A participação em atividades significativas é o objetivo final'
    ],
    clinicalApplication: 'Estabeleça metas funcionais significativas com a criança e família. Use prática orientada à tarefa e repetição intensiva. Inclua fortalecimento muscular - não piora a espasticidade. Colabore com equipe sobre toxina botulínica quando indicada. Adapte ambiente e equipamentos para promover participação. Trabalhe transições (sentar, ficar em pé) conforme GMFCS.',
    difficulty: 'intermediario',
    references: [
      'Novak I, et al. A systematic review of interventions for children with cerebral palsy: state of the evidence. Dev Med Child Neurol. 2013;55(10):885-910.',
      'Rosenbaum P, et al. A report: the definition and classification of cerebral palsy April 2006. Dev Med Child Neurol Suppl. 2007;109:8-14.',
      'Damiano DL. Activity, activity, activity: rethinking our physical therapy approach to cerebral palsy. Phys Ther. 2006;86(11):1534-1540.',
      'Verschuren O, et al. Exercise training program in children and adolescents with cerebral palsy: a randomized controlled trial. Arch Pediatr Adolesc Med. 2007;161(11):1075-1081.'
    ]
  }
];

export const areas = [
  { 
    id: 'ortopedia' as const, 
    name: 'Ortopedia', 
    description: 'Coluna, articulações e sistema musculoesquelético',
    gradient: 'from-blue-500 to-cyan-500',
    iconName: 'Bone' as const
  },
  { 
    id: 'esportiva' as const, 
    name: 'Fisioterapia Esportiva', 
    description: 'Lesões esportivas, reabilitação e performance',
    gradient: 'from-orange-500 to-red-500',
    iconName: 'Trophy' as const
  },
  { 
    id: 'geriatria' as const, 
    name: 'Geriatria', 
    description: 'Envelhecimento saudável e funcionalidade',
    gradient: 'from-emerald-500 to-teal-500',
    iconName: 'HeartPulse' as const
  },
  { 
    id: 'neurologia' as const, 
    name: 'Neurologia', 
    description: 'Doenças neurológicas e neurorreabilitação',
    gradient: 'from-purple-500 to-pink-500',
    iconName: 'Brain' as const
  }
];
