import { ClinicalPage } from './types';

export const patologiasAdicionais: ClinicalPage[] = [
  // NEUROLÓGICAS
  {
    id: 'avc-isquemico',
    slug: 'avc-isquemico-reabilitacao',
    category: 'patologias',
    title: 'AVC Isquêmico: Reabilitação Fisioterapêutica',
    metaDescription: 'Reabilitação após AVC isquêmico: fases, protocolos, escalas e abordagem baseada em evidência para fisioterapeutas.',
    introduction: 'O AVC isquêmico representa 85% dos casos de acidente vascular cerebral. A reabilitação precoce e intensiva é fundamental para maximizar recuperação funcional.',
    epidemiology: 'Principal causa de incapacidade adquirida em adultos. Incidência de 100-200/100.000 habitantes/ano. 30% desenvolvem incapacidade permanente.',
    etiology: [
      'Aterotrombose de grandes artérias',
      'Cardioembolia (fibrilação atrial)',
      'Oclusão de pequenos vasos (lacunar)',
      'Dissecção arterial',
      'Estados de hipercoagulabilidade'
    ],
    clinicalPresentation: [
      'Hemiparesia/hemiplegia contralateral',
      'Alterações sensitivas hemisensoriais',
      'Afasia (hemisfério dominante)',
      'Negligência espacial (hemisfério não-dominante)',
      'Disartria e disfagia',
      'Alterações de equilíbrio e marcha'
    ],
    diagnosis: [
      'TC ou RM de crânio para confirmação',
      'NIHSS para gravidade neurológica',
      'Avaliação funcional (Barthel, FIM)',
      'Avaliação de espasticidade (Ashworth)',
      'Testes de equilíbrio e marcha'
    ],
    treatment: {
      conservative: [
        'Mobilização precoce (<24-48h se estável)',
        'Posicionamento para prevenção de contraturas',
        'Treino de transferências e AVDs',
        'Reabilitação de marcha com ou sem dispositivos',
        'Terapia de movimento induzido por restrição (CIMT)',
        'Estimulação elétrica funcional (FES)',
        'Treino de equilíbrio e propriocepção'
      ],
      prognosis: '70% recuperam independência para marcha. Maior recuperação nos primeiros 3-6 meses. Plasticidade neural permite ganhos tardios.'
    },
    redFlags: [
      'Deterioração neurológica aguda',
      'Cefaleia intensa súbita',
      'Sinais de transformação hemorrágica'
    ],
    evidence: {
      references: [
        'Winstein CJ, et al. Guidelines for Adult Stroke Rehabilitation. Stroke. 2016.',
        'Bernhardt J, et al. Efficacy of early rehabilitation after stroke. Lancet. 2017.'
      ]
    },
    clinicalApplication: 'Mobilização muito precoce (<24h) pode ser prejudicial. Início ideal: 24-48h após estabilização. Intensidade de terapia correlaciona com resultados.',
    keywords: ['AVC', 'acidente vascular cerebral', 'hemiplegia', 'reabilitação neurológica', 'stroke']
  },
  {
    id: 'parkinson',
    slug: 'doenca-parkinson-fisioterapia',
    category: 'patologias',
    title: 'Doença de Parkinson: Fisioterapia e Exercício',
    metaDescription: 'Doença de Parkinson: manifestações motoras, escalas de avaliação e intervenções fisioterapêuticas baseadas em evidência.',
    introduction: 'A doença de Parkinson é neurodegenerativa progressiva caracterizada por bradicinesia, tremor de repouso, rigidez e instabilidade postural.',
    epidemiology: 'Prevalência de 1-2% acima de 65 anos. Segunda doença neurodegenerativa mais comum. Mais frequente em homens (1.5:1).',
    etiology: [
      'Degeneração de neurônios dopaminérgicos da substância negra',
      'Fatores genéticos (5-10%)',
      'Fatores ambientais (pesticidas, toxinas)',
      'Estresse oxidativo e disfunção mitocondrial'
    ],
    clinicalPresentation: [
      'Tremor de repouso assimétrico (4-6 Hz)',
      'Bradicinesia (lentidão de movimentos)',
      'Rigidez em roda denteada',
      'Instabilidade postural (fases avançadas)',
      'Marcha festinante com redução de passos',
      'Hipomimia e micrografia'
    ],
    diagnosis: [
      'Critérios MDS-PD (bradicinesia + rigidez ou tremor)',
      'UPDRS / MDS-UPDRS para estadiamento',
      'Hoehn & Yahr para gravidade',
      'Avaliação de marcha e equilíbrio (TUG, BBS)',
      'Avaliação de freezing (FOG-Q)'
    ],
    treatment: {
      conservative: [
        'Treino de marcha com pistas externas (visuais, auditivas)',
        'LSVT-BIG (amplitude de movimento)',
        'Exercícios de dupla-tarefa',
        'Treino de equilíbrio e prevenção de quedas',
        'Nordic walking e dança',
        'Exercícios aeróbicos (neuroproteção)',
        'Boxe sem contato / terapia aquática'
      ],
      prognosis: 'Progressão variável. Exercício regular pode retardar progressão motora. Qualidade de vida mantida com abordagem multidisciplinar.'
    },
    redFlags: [
      'Quedas frequentes precoces',
      'Demência precoce',
      'Ausência de resposta a levodopa'
    ],
    evidence: {
      references: [
        'Keus SHJ, et al. European Physiotherapy Guideline for Parkinson\'s. 2014.',
        'Schenkman M, et al. Effect of high-intensity treadmill exercise on motor symptoms in Parkinson. JAMA Neurol. 2018.'
      ]
    },
    clinicalApplication: 'Exercício de alta intensidade pode modificar progressão da doença. Pistas externas contornam déficit de geração interna de movimento.',
    keywords: ['Parkinson', 'tremor', 'bradicinesia', 'rigidez', 'freezing', 'marcha parkinsoniana']
  },
  {
    id: 'esclerose-multipla',
    slug: 'esclerose-multipla-reabilitacao',
    category: 'patologias',
    title: 'Esclerose Múltipla: Reabilitação e Exercício',
    metaDescription: 'Esclerose múltipla: manifestações, fadiga, espasticidade e abordagem fisioterapêutica baseada em evidência.',
    introduction: 'A esclerose múltipla é doença autoimune desmielinizante do SNC. Exercício é seguro e benéfico, contrariando recomendações anteriores de repouso.',
    epidemiology: 'Prevalência de 30-80/100.000 no Brasil. Mais comum em mulheres (2-3:1). Pico de incidência 20-40 anos.',
    etiology: [
      'Autoimunidade contra mielina do SNC',
      'Predisposição genética (HLA-DR2)',
      'Fatores ambientais (vitamina D, EBV)',
      'Gradiente latitudinal (mais comum longe do equador)'
    ],
    clinicalPresentation: [
      'Neurite óptica (visão borrada, dor ocular)',
      'Fadiga (70-90% dos pacientes)',
      'Espasticidade de membros inferiores',
      'Ataxia e alterações de equilíbrio',
      'Parestesias e hipoestesia',
      'Disfunção vesical e sexual'
    ],
    diagnosis: [
      'Critérios McDonald (disseminação tempo/espaço)',
      'EDSS para incapacidade',
      'Avaliação de fadiga (MFIS)',
      'Testes de marcha (T25FW, 6MWT)',
      'Avaliação de equilíbrio e coordenação'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico moderado (sem superaquecimento)',
        'Treino de força (seguro e eficaz)',
        'Treino de equilíbrio e coordenação',
        'Manejo da fadiga (conservação de energia)',
        'Alongamento para espasticidade',
        'Resfriamento pré-exercício se sensibilidade ao calor',
        'Exercícios aquáticos (temperatura controlada)'
      ],
      prognosis: 'Curso variável (RR, SP, PP). 50% precisam de auxílio para marcha após 15 anos. Exercício melhora qualidade de vida em todos os subtipos.'
    },
    redFlags: [
      'Surto agudo (suspender exercício intenso)',
      'Fenômeno de Uhthoff (piora com calor)',
      'Deterioração rápida inexplicada'
    ],
    evidence: {
      references: [
        'Latimer-Cheung AE, et al. Exercise guidelines for people with MS. Arch Phys Med Rehabil. 2013.',
        'Motl RW, Sandroff BM. Benefits of exercise training in MS. Nat Rev Neurol. 2015.'
      ]
    },
    clinicalApplication: 'Exercício NÃO desencadeia surtos. Fenômeno de Uhthoff é temporário e não causa dano. Resfriamento permite maior tolerância.',
    keywords: ['esclerose múltipla', 'EM', 'fadiga', 'espasticidade', 'desmielinização']
  },
  {
    id: 'lesao-medular',
    slug: 'lesao-medular-reabilitacao',
    category: 'patologias',
    title: 'Lesão Medular: Reabilitação Fisioterapêutica',
    metaDescription: 'Lesão medular: classificação ASIA, complicações e reabilitação funcional baseada no nível neurológico.',
    introduction: 'A lesão medular traumática ou não-traumática resulta em déficits motores, sensitivos e autonômicos abaixo do nível lesional.',
    epidemiology: 'Incidência de 15-40/milhão/ano. Causas: acidentes de trânsito (50%), quedas (20%), violência (15%). Predominância masculina 4:1.',
    etiology: [
      'Trauma (contusão, compressão, secção)',
      'Causas não-traumáticas: tumor, infecção, vascular',
      'Lesões cervicais: tetraplegia',
      'Lesões torácicas/lombares: paraplegia'
    ],
    clinicalPresentation: [
      'Paralisia abaixo do nível (completa ou incompleta)',
      'Alteração sensitiva',
      'Disfunção vesical e intestinal',
      'Disfunção autonômica (disreflexia, hipotensão)',
      'Espasticidade (lesões de NMS)',
      'Flacidez (lesões de NMI)'
    ],
    diagnosis: [
      'ASIA Impairment Scale (AIS A-E)',
      'Nível neurológico sensitivo e motor',
      'SCIM (Spinal Cord Independence Measure)',
      'Avaliação de espasticidade',
      'Avaliação respiratória (lesões altas)'
    ],
    treatment: {
      conservative: [
        'Prevenção de complicações respiratórias',
        'Posicionamento e mudanças de decúbito',
        'Fortalecimento de musculatura preservada',
        'Treino de transferências por nível',
        'Mobilidade em cadeira de rodas',
        'Ortostatismo (mesa ortostática, stand-frame)',
        'Treino de marcha (se potencial - WISCI)'
      ],
      prognosis: 'Definido pelo nível e completude. AIS D tem melhor prognóstico para marcha. Maior recuperação nos primeiros 6-12 meses.'
    },
    redFlags: [
      'Disreflexia autonômica (emergência)',
      'Lesões de pressão',
      'Trombose venosa profunda',
      'Deterioração neurológica'
    ],
    evidence: {
      references: [
        'Harvey LA, et al. Physiotherapy for spinal cord injury. Cochrane Database. 2016.',
        'Kirshblum SC, et al. International standards for neurological classification. Spinal Cord. 2011.'
      ]
    },
    clinicalApplication: 'Potencial de marcha: C8-T1 com marcha terapêutica, T9-T12 marcha comunitária limitada, L3+ marcha comunitária funcional.',
    keywords: ['lesão medular', 'paraplegia', 'tetraplegia', 'ASIA', 'cadeira de rodas']
  },
  {
    id: 'paralisia-cerebral',
    slug: 'paralisia-cerebral-fisioterapia',
    category: 'patologias',
    title: 'Paralisia Cerebral: Abordagem Fisioterapêutica',
    metaDescription: 'Paralisia cerebral: classificação topográfica e funcional, espasticidade e intervenções fisioterapêuticas contemporâneas.',
    introduction: 'A paralisia cerebral é grupo de desordens permanentes do movimento e postura causadas por lesão não-progressiva no cérebro em desenvolvimento.',
    epidemiology: 'Prevalência de 2-3/1000 nascidos vivos. Principal causa de deficiência motora na infância. Prematuridade é principal fator de risco.',
    etiology: [
      'Pré-natal: infecções, malformações, AVC fetal',
      'Perinatal: asfixia, prematuridade, baixo peso',
      'Pós-natal: infecções SNC, trauma, AVC',
      'Leucomalácia periventricular (prematuros)'
    ],
    clinicalPresentation: [
      'Espástica (70-80%): hemiplegia, diplegia, tetraplegia',
      'Discinética (10-15%): movimentos involuntários',
      'Atáxica (5-10%): incoordenação e tremor',
      'Atraso motor e postural',
      'Deformidades musculoesqueléticas secundárias'
    ],
    diagnosis: [
      'GMFCS (Gross Motor Function Classification)',
      'MACS (Manual Ability Classification)',
      'GMFM-66/88 para função motora grossa',
      'Avaliação de espasticidade (Tardieu)',
      'Análise de marcha (se deambulador)'
    ],
    treatment: {
      conservative: [
        'Abordagem orientada a tarefas e contexto',
        'Fortalecimento funcional',
        'Treino de marcha e mobilidade',
        'Manejo de espasticidade (alongamento, órteses)',
        'CIMT pediátrico (hemiplegia)',
        'Hidroterapia',
        'Participação em atividades físicas adaptadas'
      ],
      surgical: 'Rizotomia dorsal seletiva, alongamentos tendíneos, osteotomias.',
      prognosis: 'GMFCS é estável após 2-4 anos. GMFCS I-II: marcha independente. GMFCS IV-V: dependência de cadeira de rodas.'
    },
    redFlags: [
      'Regressão neurológica (não é PC)',
      'Subluxação de quadril',
      'Escoliose progressiva'
    ],
    evidence: {
      references: [
        'Novak I, et al. State of the evidence for CP treatment. Dev Med Child Neurol. 2020.',
        'Rosenbaum P, et al. GMFCS - Expanded and Revised. Dev Med Child Neurol. 2007.'
      ]
    },
    clinicalApplication: 'Abordagens passivas tradicionais têm pouca evidência. Treino ativo, intensivo e orientado a tarefas é mais efetivo.',
    keywords: ['paralisia cerebral', 'PC', 'GMFCS', 'espasticidade infantil', 'diplegia']
  },

  // REUMATOLÓGICAS
  {
    id: 'artrite-reumatoide',
    slug: 'artrite-reumatoide-fisioterapia',
    category: 'patologias',
    title: 'Artrite Reumatoide: Fisioterapia e Exercício',
    metaDescription: 'Artrite reumatoide: manifestações articulares, proteção articular e exercício terapêutico baseado em evidência.',
    introduction: 'A artrite reumatoide é doença autoimune sistêmica caracterizada por sinovite crônica erosiva, predominantemente em pequenas articulações.',
    epidemiology: 'Prevalência de 0.5-1% da população. Mais comum em mulheres (3:1). Pico de incidência 40-60 anos.',
    etiology: [
      'Autoimunidade contra membrana sinovial',
      'Predisposição genética (HLA-DR4)',
      'Fatores ambientais (tabagismo)',
      'Disbiose intestinal'
    ],
    clinicalPresentation: [
      'Poliartrite simétrica de pequenas articulações',
      'Rigidez matinal >60 minutos',
      'Sinovite com calor, edema, dor',
      'Deformidades: desvio ulnar, pescoço de cisne, botoeira',
      'Nódulos reumatoides subcutâneos',
      'Fadiga e sintomas sistêmicos'
    ],
    diagnosis: [
      'Critérios ACR/EULAR 2010',
      'HAQ (Health Assessment Questionnaire)',
      'DAS-28 para atividade de doença',
      'Avaliação de força de preensão',
      'Avaliação funcional de mãos (DASH)'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico moderado',
        'Fortalecimento muscular (isométrico inicial)',
        'Proteção articular e economia articular',
        'Órteses de repouso para punhos e mãos',
        'Hidroterapia (reduz carga articular)',
        'Mobilização gentil em fase não-aguda',
        'Educação sobre doença e autogerenciamento'
      ],
      prognosis: 'Com tratamento adequado (DMARD precoce), remissão em 40-50%. Exercício é seguro e não aumenta atividade de doença.'
    },
    redFlags: [
      'Instabilidade cervical (C1-C2)',
      'Vasculite sistêmica',
      'Síndrome de Felty'
    ],
    evidence: {
      references: [
        'Hurkmans E, et al. Dynamic exercise programs for RA. Cochrane Database. 2009.',
        'Katz P. Exercise for rheumatic diseases. Curr Opin Rheumatol. 2020.'
      ]
    },
    clinicalApplication: 'Evitar exercício em articulação inflamada agudamente. Exercício regular não piora atividade de doença em pacientes estáveis.',
    keywords: ['artrite reumatoide', 'AR', 'sinovite', 'proteção articular', 'DMARD']
  },
  {
    id: 'fibromialgia',
    slug: 'fibromialgia-tratamento',
    category: 'patologias',
    title: 'Fibromialgia: Abordagem Fisioterapêutica',
    metaDescription: 'Fibromialgia: critérios diagnósticos, dor crônica difusa e exercício como intervenção de primeira linha.',
    introduction: 'A fibromialgia é síndrome de dor crônica difusa associada a fadiga, distúrbios do sono e alterações cognitivas, com sensibilização central.',
    epidemiology: 'Prevalência de 2-4% da população. Predominância feminina (9:1). Pico entre 30-50 anos.',
    etiology: [
      'Sensibilização central do sistema nervoso',
      'Disfunção do eixo HPA',
      'Alterações de neurotransmissores (serotonina, norepinefrina)',
      'Predisposição genética',
      'Trauma físico ou emocional como gatilho'
    ],
    clinicalPresentation: [
      'Dor difusa bilateral acima/abaixo da cintura',
      'Fadiga persistente não restauradora',
      'Sono não-reparador',
      'Disfunção cognitiva ("fibro fog")',
      'Rigidez matinal',
      'Comorbidades: depressão, ansiedade, síndrome intestino irritável'
    ],
    diagnosis: [
      'Critérios ACR 2010/2016 (WPI + SS)',
      'Questionário de Impacto da Fibromialgia (FIQ)',
      'Avaliação de pontos dolorosos (histórico)',
      'Escala de fadiga',
      'Avaliação de sono e humor'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico gradual (primeira linha)',
        'Fortalecimento de baixa intensidade',
        'Alongamento e flexibilidade',
        'Educação sobre dor e neurociência',
        'Hidroterapia (bem tolerada)',
        'Técnicas de relaxamento',
        'Tai chi e yoga'
      ],
      prognosis: 'Condição crônica com flutuações. Exercício regular reduz dor e melhora função. Abordagem multimodal mais efetiva.'
    },
    redFlags: [
      'Sintomas sistêmicos (febre, perda de peso)',
      'Sinais inflamatórios objetivos',
      'Fraqueza muscular verdadeira'
    ],
    evidence: {
      references: [
        'Macfarlane GJ, et al. EULAR guidelines for FM. Ann Rheum Dis. 2017.',
        'Busch AJ, et al. Exercise for fibromyalgia. Cochrane Database. 2017.'
      ]
    },
    clinicalApplication: 'Iniciar exercício em intensidade muito baixa e progredir lentamente. "Start low, go slow". Exercício regular é mais importante que tipo específico.',
    keywords: ['fibromialgia', 'dor crônica', 'sensibilização central', 'fadiga', 'exercício aeróbico']
  },
  {
    id: 'espondilite-anquilosante',
    slug: 'espondilite-anquilosante-exercicio',
    category: 'patologias',
    title: 'Espondilite Anquilosante: Exercício e Mobilidade',
    metaDescription: 'Espondilite anquilosante: manifestações axiais, manutenção de mobilidade e exercícios específicos baseados em evidência.',
    introduction: 'A espondilite anquilosante é espondiloartrite axial caracterizada por sacroileíte e inflamação da coluna, com tendência à anquilose.',
    epidemiology: 'Prevalência de 0.1-0.5% da população. Predominância masculina (3:1). Início tipicamente antes dos 40 anos. 90% HLA-B27+.',
    etiology: [
      'Autoimunidade contra enteses',
      'Forte associação com HLA-B27',
      'Disbiose intestinal',
      'Resposta inflamatória IL-17/IL-23'
    ],
    clinicalPresentation: [
      'Dor lombar inflamatória (noturna, melhora com exercício)',
      'Rigidez matinal prolongada (>30 min)',
      'Limitação progressiva de mobilidade axial',
      'Sacroileíte bilateral',
      'Entesite (calcâneo, tuberosidade isquiática)',
      'Uveíte anterior (25-40%)'
    ],
    diagnosis: [
      'Critérios ASAS para espondiloartrite axial',
      'BASDAI para atividade de doença',
      'BASFI para função',
      'BASMI para mobilidade',
      'Schober modificado, expansibilidade torácica'
    ],
    treatment: {
      conservative: [
        'Exercícios de mobilidade axial diários (essencial)',
        'Exercícios respiratórios e expansão torácica',
        'Fortalecimento de extensores',
        'Natação e hidroterapia',
        'Exercício aeróbico',
        'Postura e correção cifótica',
        'Educação sobre doença e autoexercício'
      ],
      prognosis: 'Progressão variável. Exercício regular retarda anquilose. Manutenção de função com programa consistente.'
    },
    redFlags: [
      'Fratura vertebral (coluna anquilosada)',
      'Síndrome da cauda equina',
      'Uveíte aguda'
    ],
    evidence: {
      references: [
        'Regel A, et al. Efficacy of physiotherapy in AS. Ann Rheum Dis. 2017.',
        'van der Heijde D, et al. ASAS/EULAR recommendations for AS. Ann Rheum Dis. 2017.'
      ]
    },
    clinicalApplication: 'Exercício é tão importante quanto medicação. Programa domiciliar supervisionado periodicamente é efetivo a longo prazo.',
    keywords: ['espondilite anquilosante', 'espondiloartrite', 'HLA-B27', 'rigidez matinal', 'mobilidade']
  },
  {
    id: 'lupus',
    slug: 'lupus-eritematoso-sistemico-exercicio',
    category: 'patologias',
    title: 'Lúpus Eritematoso Sistêmico: Exercício Seguro',
    metaDescription: 'Lúpus eritematoso sistêmico: manifestações, fadiga e exercício terapêutico seguro para pacientes com LES.',
    introduction: 'O LES é doença autoimune sistêmica com manifestações multissistêmicas. Exercício é seguro e benéfico para fadiga e qualidade de vida.',
    epidemiology: 'Prevalência de 20-150/100.000. Predominância feminina acentuada (9:1). Mais comum em afrodescendentes. Pico 15-40 anos.',
    etiology: [
      'Autoimunidade com autoanticorpos patogênicos',
      'Predisposição genética múltipla',
      'Fatores ambientais (UV, infecções)',
      'Fatores hormonais (estrogênio)'
    ],
    clinicalPresentation: [
      'Fadiga (80-100% dos pacientes)',
      'Artralgia e artrite não-erosiva',
      'Rash malar e fotossensibilidade',
      'Nefrite lúpica',
      'Serosites (pleurite, pericardite)',
      'Manifestações neuropsiquiátricas'
    ],
    diagnosis: [
      'Critérios ACR/EULAR 2019',
      'SLEDAI para atividade de doença',
      'Avaliação de fadiga (FSS, FACIT-F)',
      'Capacidade aeróbica (TC6M)',
      'Qualidade de vida (SF-36)'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico moderado (seguro)',
        'Fortalecimento muscular',
        'Exercícios aquáticos',
        'Proteção solar durante exercício ao ar livre',
        'Progressão gradual respeitando fadiga',
        'Yoga e tai chi para relaxamento',
        'Educação sobre doença e autogerenciamento'
      ],
      prognosis: 'Sobrevida >90% em 10 anos com tratamento. Exercício melhora fadiga sem aumentar atividade de doença.'
    },
    redFlags: [
      'Atividade de doença alta (SLEDAI >12)',
      'Nefrite ativa',
      'Manifestações cardiopulmonares'
    ],
    evidence: {
      references: [
        'Margiotta DPE, et al. Physical activity and sedentary behavior in SLE. Lupus. 2018.',
        'Fangtham M, et al. Exercise in SLE. Curr Opin Rheumatol. 2019.'
      ]
    },
    clinicalApplication: 'Exercício NÃO aumenta risco de flares. Evitar exposição solar prolongada. Hidroterapia é excelente opção.',
    keywords: ['lúpus', 'LES', 'fadiga', 'artrite não-erosiva', 'fotossensibilidade']
  },

  // RESPIRATÓRIAS
  {
    id: 'dpoc',
    slug: 'dpoc-reabilitacao-pulmonar',
    category: 'patologias',
    title: 'DPOC: Reabilitação Pulmonar',
    metaDescription: 'DPOC: fisiopatologia, dispneia e reabilitação pulmonar como intervenção de alta efetividade baseada em evidência.',
    introduction: 'A DPOC caracteriza-se por limitação persistente do fluxo aéreo. Reabilitação pulmonar é intervenção com maior evidência após cessação tabágica.',
    epidemiology: 'Prevalência de 10% acima de 40 anos. 3ª causa de morte no mundo. 90% relacionada ao tabagismo.',
    etiology: [
      'Tabagismo (principal)',
      'Exposição ocupacional',
      'Poluição ambiental',
      'Deficiência de alfa-1 antitripsina',
      'Infecções respiratórias na infância'
    ],
    clinicalPresentation: [
      'Dispneia progressiva',
      'Tosse crônica produtiva',
      'Limitação às atividades físicas',
      'Exacerbações agudas',
      'Descondicionamento muscular periférico',
      'Caquexia em estágios avançados'
    ],
    diagnosis: [
      'Espirometria (VEF1/CVF <0.7)',
      'Classificação GOLD (A-D)',
      'mMRC ou CAT para sintomas',
      'TC6M para capacidade funcional',
      'BODE Index para prognóstico'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico (bicicleta, caminhada)',
        'Treino de força periférica',
        'Treino de musculatura inspiratória (TMI)',
        'Técnicas de higiene brônquica',
        'Manejo da dispneia (posicionamento, respiração)',
        'Educação sobre doença e uso de inaladores',
        'Suporte nutricional'
      ],
      prognosis: 'Reabilitação pulmonar reduz dispneia e hospitalizações. NNT de 6 para reduzir 1 hospitalização por exacerbação.'
    },
    redFlags: [
      'Exacerbação aguda',
      'Hipoxemia severa (SpO2 <88%)',
      'Cor pulmonale descompensado'
    ],
    evidence: {
      references: [
        'Spruit MA, et al. ATS/ERS Statement on Pulmonary Rehabilitation. Am J Respir Crit Care Med. 2013.',
        'McCarthy B, et al. Pulmonary rehabilitation for COPD. Cochrane Database. 2015.'
      ]
    },
    clinicalApplication: 'Mínimo de 8-12 semanas, 2-3x/semana. Exercício supervisionado em intensidade suficiente para induzir dispneia moderada (Borg 4-6).',
    keywords: ['DPOC', 'reabilitação pulmonar', 'dispneia', 'tabagismo', 'exercício aeróbico']
  },
  {
    id: 'asma',
    slug: 'asma-exercicio-fisioterapia',
    category: 'patologias',
    title: 'Asma: Exercício e Fisioterapia Respiratória',
    metaDescription: 'Asma: broncoespasmo induzido por exercício, condicionamento físico e técnicas respiratórias para asmáticos.',
    introduction: 'A asma é doença inflamatória crônica das vias aéreas. Exercício é seguro e benéfico, melhorando controle da doença.',
    epidemiology: 'Prevalência de 5-10% da população. Uma das doenças crônicas mais comuns na infância. Broncoespasmo induzido por exercício em 40-90% dos asmáticos.',
    etiology: [
      'Inflamação eosinofílica das vias aéreas',
      'Hiperresponsividade brônquica',
      'Predisposição genética (atopia)',
      'Fatores ambientais (alérgenos, poluição)',
      'Remodelamento brônquico'
    ],
    clinicalPresentation: [
      'Dispneia episódica',
      'Sibilância',
      'Tosse seca (especialmente noturna)',
      'Aperto torácico',
      'Broncoespasmo induzido por exercício',
      'Piora com alérgenos, infecções, exercício intenso'
    ],
    diagnosis: [
      'Espirometria com prova broncodilatadora',
      'Teste de broncoprovocação (metacolina)',
      'ACT (Asthma Control Test)',
      'Peak flow para monitoramento',
      'Teste de exercício para BIE'
    ],
    treatment: {
      conservative: [
        'Exercício aeróbico regular (melhora controle)',
        'Aquecimento adequado antes de exercício',
        'Natação (ambiente úmido e quente)',
        'Treino de força',
        'Técnicas de controle respiratório',
        'Educação sobre uso de broncodilatador pré-exercício',
        'Evitar gatilhos durante exercício'
      ],
      prognosis: 'Exercício regular reduz inflamação e melhora controle. Asmáticos podem praticar qualquer esporte com manejo adequado.'
    },
    redFlags: [
      'Asma não-controlada',
      'Exacerbação aguda',
      'Uso frequente de broncodilatador de resgate'
    ],
    evidence: {
      references: [
        'Eichenberger PA, et al. Effects of exercise training on airway hyperreactivity in asthma. Am J Respir Crit Care Med. 2013.',
        'Carson KV, et al. Physical training for asthma. Cochrane Database. 2013.'
      ]
    },
    clinicalApplication: 'Aquecimento de 10-15 min em intensidade submáxima reduz BIE. Broncodilatador 15-30 min antes se BIE frequente.',
    keywords: ['asma', 'broncoespasmo induzido por exercício', 'BIE', 'sibilância', 'condicionamento']
  },

  // ORTOPÉDICAS ADICIONAIS
  {
    id: 'tendinopatia-patelar',
    slug: 'tendinopatia-patelar-jumpers-knee',
    category: 'patologias',
    title: 'Tendinopatia Patelar (Jumper\'s Knee)',
    metaDescription: 'Tendinopatia patelar: fisiopatologia, estadiamento e protocolo de carga progressiva baseado em evidência.',
    introduction: 'A tendinopatia patelar é condição de sobrecarga do polo inferior da patela, comum em esportes com salto.',
    epidemiology: 'Prevalência de 45% em voleibolistas e 32% em basquetebolistas de elite. Mais comum em homens jovens.',
    etiology: [
      'Sobrecarga repetitiva por salto/aterrissagem',
      'Aumento abrupto de volume de treino',
      'Déficit de força de quadríceps e glúteos',
      'Rigidez de cadeia posterior',
      'Fatores biomecânicos (valgo dinâmico)'
    ],
    clinicalPresentation: [
      'Dor no polo inferior da patela',
      'Dor durante salto, agachamento, escadas',
      'Dor ao início do exercício, pode aliviar com aquecimento',
      'Rigidez matinal',
      'Espessamento do tendão palpável'
    ],
    diagnosis: [
      'Palpação dolorosa do polo inferior',
      'VISA-P (Victorian Institute of Sport Assessment)',
      'Single leg decline squat test',
      'Avaliação de força excêntrica',
      'Ultrassom (espessamento, neovascularização)'
    ],
    treatment: {
      conservative: [
        'Exercício excêntrico (protocolo Alfredson adaptado)',
        'Heavy slow resistance (HSR)',
        'Isométricos para alívio de dor',
        'Progressão gradual de carga',
        'Fortalecimento de cadeia posterior',
        'Correção biomecânica (valgo dinâmico)',
        'Retorno gradual ao esporte'
      ],
      prognosis: '70-80% melhora com programa de exercícios 12-24 semanas. Prognóstico pior em casos crônicos.'
    },
    redFlags: [
      'Ruptura parcial ou completa',
      'Dor em repouso constante'
    ],
    evidence: {
      references: [
        'Malliaras P, et al. Patellar tendinopathy: clinical diagnosis and load management. Br J Sports Med. 2015.',
        'Kongsgaard M, et al. Corticosteroid injections, eccentric training, or heavy slow resistance training for patellar tendinopathy. Scand J Med Sci Sports. 2009.'
      ]
    },
    clinicalApplication: 'HSR (4x6-8 RM, 3x/semana) tem resultados comparáveis a excêntrico com melhor adesão. Progressão baseada em dor (<3 VAS).',
    keywords: ['tendinopatia patelar', 'jumper\'s knee', 'tendão patelar', 'exercício excêntrico', 'voleibol']
  },
  {
    id: 'sindrome-tibial-medial',
    slug: 'sindrome-do-estresse-tibial-medial',
    category: 'patologias',
    title: 'Síndrome do Estresse Tibial Medial (Canelite)',
    metaDescription: 'Síndrome do estresse tibial medial: fatores de risco, diagnóstico diferencial e progressão de carga para corredores.',
    introduction: 'A SETM é dor na borda posteromedial da tíbia relacionada a sobrecarga em corredores e atletas de impacto.',
    epidemiology: 'Incidência de 10-20% em corredores. Mais comum em iniciantes. Mulheres mais afetadas.',
    etiology: [
      'Aumento abrupto de volume/intensidade de corrida',
      'Calçado inadequado ou desgastado',
      'Hiperpronação',
      'Fraqueza de musculatura intrínseca do pé',
      'Superfície de treino inadequada'
    ],
    clinicalPresentation: [
      'Dor difusa na borda medial da tíbia (>5cm)',
      'Dor durante exercício de impacto',
      'Alívio com repouso',
      'Dor à palpação do terço médio-distal',
      'Sem dor noturna ou em repouso (diferente de fratura)'
    ],
    diagnosis: [
      'Palpação da borda tibial medial',
      'História de carga recente',
      'Diferenciação de fratura por estresse',
      'Avaliação biomecânica de corrida',
      'RM se suspeita de fratura (edema ósseo focal)'
    ],
    treatment: {
      conservative: [
        'Redução relativa de carga (não repouso absoluto)',
        'Fortalecimento de panturrilha e intrínsecos',
        'Exercícios de impacto progressivo',
        'Correção de técnica de corrida',
        'Avaliação de calçado',
        'Exercícios de equilíbrio e propriocepção',
        'Cross-training de baixo impacto'
      ],
      prognosis: 'Maioria resolve em 6-12 semanas com manejo adequado. Retorno à corrida gradual baseado em sintomas.'
    },
    redFlags: [
      'Dor noturna persistente (fratura?)',
      'Dor focal <5cm (fratura?)',
      'Ausência de melhora com repouso relativo'
    ],
    evidence: {
      references: [
        'Winters M, et al. Treatment of medial tibial stress syndrome. Br J Sports Med. 2018.',
        'Moen MH, et al. Medial tibial stress syndrome: a critical review. Sports Med. 2009.'
      ]
    },
    clinicalApplication: 'Repouso absoluto não é necessário. Manter atividade abaixo do limiar de dor. Fortalecimento excêntrico de panturrilha é efetivo.',
    keywords: ['canelite', 'SETM', 'estresse tibial', 'corrida', 'dor na canela']
  },
  {
    id: 'lesao-isquiotibiais',
    slug: 'lesao-muscular-isquiotibiais',
    category: 'patologias',
    title: 'Lesão Muscular de Isquiotibiais',
    metaDescription: 'Lesão de isquiotibiais: classificação, fatores de risco, protocolo de reabilitação e prevenção de recidiva.',
    introduction: 'A lesão de isquiotibiais é a lesão muscular mais comum em esportes de corrida e aceleração, com alta taxa de recidiva.',
    epidemiology: 'Representa 12-16% de lesões no futebol. Taxa de recidiva de 12-33%. Bíceps femoral (cabeça longa) mais acometido.',
    etiology: [
      'Sprint e aceleração súbita',
      'Lesão prévia (principal fator de risco)',
      'Déficit de força excêntrica',
      'Fadiga muscular',
      'Aquecimento inadequado',
      'Idade avançada no esporte'
    ],
    clinicalPresentation: [
      'Dor súbita posterior de coxa durante sprint',
      'Sensação de "fisgada" ou "estalo"',
      'Dor à contração resistida e alongamento',
      'Equimose (lesões graves)',
      'Déficit de força de flexão de joelho'
    ],
    diagnosis: [
      'História de mecanismo de lesão',
      'Palpação localizada',
      'Teste de força excêntrica',
      'Active knee extension test',
      'RM para confirmação e classificação'
    ],
    treatment: {
      conservative: [
        'Fase aguda: proteção, carga gradual',
        'Alongamento suave precoce',
        'Fortalecimento isométrico indolor',
        'Progressão para excêntrico (Nordic hamstring)',
        'Treino de corrida progressivo',
        'Exercícios de alta velocidade antes do retorno',
        'Critérios objetivos de retorno'
      ],
      prognosis: 'Tempo médio de retorno: 2-4 semanas (grau I), 4-8 semanas (grau II), 8-12+ semanas (grau III).'
    },
    redFlags: [
      'Avulsão da tuberosidade isquiática',
      'Lesão completa com retração',
      'Fraqueza severa persistente'
    ],
    evidence: {
      references: [
        'Askling CM, et al. Acute hamstring injuries in Swedish elite football. Br J Sports Med. 2013.',
        'Timmins RG, et al. Short biceps femoris fascicles and eccentric knee flexor weakness increase risk of hamstring injury. Br J Sports Med. 2016.'
      ]
    },
    clinicalApplication: 'Nordic hamstring exercise reduz risco de lesão em 51%. Critérios de retorno: força >90% do contralateral + sprint máximo sem dor.',
    keywords: ['isquiotibiais', 'lesão muscular', 'posterior de coxa', 'nordic hamstring', 'recidiva']
  },
  {
    id: 'ruptura-tendao-aquiles',
    slug: 'ruptura-tendao-aquiles',
    category: 'patologias',
    title: 'Ruptura do Tendão de Aquiles',
    metaDescription: 'Ruptura do tendão de Aquiles: diagnóstico clínico, tratamento funcional vs cirúrgico e reabilitação progressiva.',
    introduction: 'A ruptura do tendão de Aquiles ocorre tipicamente em homens 30-50 anos durante esporte recreacional, com debate entre tratamento conservador vs cirúrgico.',
    epidemiology: 'Incidência de 5-10/100.000/ano, aumentando. Pico em homens 30-50 anos. 75% durante esporte (futebol, tênis, basquete).',
    etiology: [
      'Degeneração tendinosa prévia',
      'Uso de fluoroquinolonas',
      'Uso de corticoides',
      'Sobrecarga excêntrica súbita',
      'Início tardio em esportes de impacto'
    ],
    clinicalPresentation: [
      'Dor súbita "como um chute" na panturrilha',
      'Estalido audível',
      'Dificuldade de marcha (calcanhar plano)',
      'Gap palpável no tendão',
      'Thompson test positivo'
    ],
    diagnosis: [
      'Thompson test (squeeze test)',
      'Gap palpável',
      'Matles test (em prono)',
      'Ultrassom para confirmar e medir gap',
      'RM raramente necessária'
    ],
    treatment: {
      conservative: [
        'Protocolo funcional com imobilização em equino',
        'Carga precoce com bota (2-4 semanas)',
        'Redução progressiva do equino',
        'Fortalecimento gradual após 6-8 semanas',
        'Propriocepção e equilíbrio',
        'Treino de marcha normal',
        'Exercício excêntrico a partir de 12 semanas'
      ],
      surgical: 'Reparo aberto ou minimamente invasivo. Indicação: atletas de alto nível, gap grande, falha conservadora.',
      prognosis: 'Taxas de re-ruptura similares entre tratamento conservador funcional e cirúrgico (5-10%). Retorno ao esporte: 6-12 meses.'
    },
    redFlags: [
      'Gap >10mm',
      'Falha em progredir na reabilitação',
      'Re-ruptura'
    ],
    evidence: {
      references: [
        'Ochen Y, et al. Operative versus nonoperative treatment of Achilles tendon ruptures: meta-analysis. BMJ. 2019.',
        'Silbernagel KG, et al. Current clinical concepts: achilles tendon rupture. J Athl Train. 2012.'
      ]
    },
    clinicalApplication: 'Tratamento conservador FUNCIONAL (carga precoce) é tão efetivo quanto cirurgia. Imobilização rígida prolongada é contraindicada.',
    keywords: ['ruptura Aquiles', 'tendão Aquiles', 'Thompson test', 'tratamento conservador', 'panturrilha']
  },
  {
    id: 'fratura-radio-distal',
    slug: 'fratura-radio-distal-reabilitacao',
    category: 'patologias',
    title: 'Fratura de Rádio Distal: Reabilitação',
    metaDescription: 'Fratura de rádio distal (Colles): imobilização, mobilização precoce e protocolo de reabilitação funcional.',
    introduction: 'A fratura de rádio distal é a fratura mais comum do membro superior, especialmente em idosos após queda sobre mão estendida.',
    epidemiology: 'Incidência de 30-50/10.000/ano. Distribuição bimodal: jovens (trauma alta energia) e idosos (osteoporose). Mulheres >50 anos mais afetadas.',
    etiology: [
      'Queda sobre mão estendida (FOOSH)',
      'Osteoporose (idosos)',
      'Trauma de alta energia (jovens)',
      'Fragilidade óssea'
    ],
    clinicalPresentation: [
      'Dor e edema no punho',
      'Deformidade "em garfo" (Colles)',
      'Limitação de movimento',
      'Possível parestesia mediano (síndrome compartimental/STC)',
      'Equimose dorsal do punho'
    ],
    diagnosis: [
      'Radiografia em 2 incidências',
      'TC se articular complexa',
      'Avaliação neurovascular',
      'Classificação: AO, Fernandez'
    ],
    treatment: {
      conservative: [
        'Mobilização de dedos e ombro durante imobilização',
        'Controle de edema (elevação, compressão)',
        'Após retirada de imobilização: ADM ativa',
        'Mobilização articular',
        'Fortalecimento progressivo',
        'Treino de preensão e função',
        'Retorno às AVDs e trabalho'
      ],
      surgical: 'Placa volar bloqueada, fixação externa, ou fios de Kirschner conforme tipo de fratura.',
      prognosis: 'Maioria recupera boa função. Complicações: CRPS (5%), rigidez, STC, artrose pós-traumática.'
    },
    redFlags: [
      'Síndrome compartimental',
      'Lesão neurovascular',
      'CRPS (dor desproporcional, alterações tróficas)'
    ],
    evidence: {
      references: [
        'Bruder AM, et al. Rehabilitation following wrist fracture. Cochrane Database. 2021.',
        'Quadlbauer S, et al. Distal radius fracture treatment: current concepts. EFORT Open Rev. 2020.'
      ]
    },
    clinicalApplication: 'Mobilização precoce de dedos e ombro previne rigidez. Após consolidação, ADM antes de fortalecimento. CRPS requer abordagem específica.',
    keywords: ['fratura rádio', 'Colles', 'fratura punho', 'reabilitação punho', 'FOOSH']
  },
  {
    id: 'fratura-quadril',
    slug: 'fratura-quadril-idoso',
    category: 'patologias',
    title: 'Fratura de Quadril no Idoso',
    metaDescription: 'Fratura de quadril no idoso: reabilitação pós-operatória, prevenção de complicações e retorno à função.',
    introduction: 'A fratura de quadril em idosos é emergência ortogeriátrica com alta morbimortalidade. Reabilitação precoce e intensiva é essencial.',
    epidemiology: 'Incidência de 100-300/100.000 acima de 65 anos. Mortalidade de 20-30% no primeiro ano. 50% não recuperam nível funcional prévio.',
    etiology: [
      'Queda de própria altura',
      'Osteoporose',
      'Sarcopenia e fragilidade',
      'Déficit visual e de equilíbrio',
      'Medicamentos (sedativos, anti-hipertensivos)'
    ],
    clinicalPresentation: [
      'Dor no quadril após queda',
      'Incapacidade de sustentar peso',
      'Membro encurtado e em rotação externa',
      'Dor à mobilização passiva',
      'Possível fratura impactada (marcha dolorosa)'
    ],
    diagnosis: [
      'Radiografia de bacia e quadril',
      'RM ou TC se radiografia inconclusiva',
      'Classificação: Garden (colo), AO',
      'Avaliação geriátrica pré-operatória'
    ],
    treatment: {
      conservative: [
        'Sentar na beira do leito D1',
        'Ortostatismo D1-2 se permitido',
        'Marcha com andador conforme carga permitida',
        'Fortalecimento de quadríceps e glúteos',
        'Prevenção de TVP e úlceras de pressão',
        'Exercícios respiratórios',
        'Treino de transferências e AVDs'
      ],
      surgical: 'Osteossíntese (fraturas estáveis) ou artroplastia (colo femoral desviado em idosos).',
      prognosis: 'Mobilização precoce reduz mortalidade. 40-60% recuperam capacidade de marcha prévia. Abordagem multidisciplinar melhora desfechos.'
    },
    redFlags: [
      'Delirium (comum em idosos)',
      'TVP/TEP',
      'Infecção de sítio cirúrgico',
      'Luxação de prótese'
    ],
    evidence: {
      references: [
        'Rapp K, et al. Hip fracture rehabilitation and outcomes. Arch Gerontol Geriatr. 2020.',
        'British Orthopaedic Association. The care of patients with fragility fracture. BOA, 2007.'
      ]
    },
    clinicalApplication: 'Cirurgia idealmente em 24-48h. Mobilização D1 reduz complicações. Reabilitação intensiva (>1h/dia) melhora resultados.',
    keywords: ['fratura quadril', 'fratura colo fêmur', 'idoso', 'artroplastia', 'reabilitação geriátrica']
  },
  {
    id: 'artroplastia-joelho',
    slug: 'artroplastia-total-joelho-reabilitacao',
    category: 'patologias',
    title: 'Artroplastia Total de Joelho: Reabilitação',
    metaDescription: 'Reabilitação após artroplastia total de joelho: fases, metas de ADM, fortalecimento e retorno às atividades.',
    introduction: 'A ATJ é indicada para osteoartrose avançada com falha de tratamento conservador. Reabilitação estruturada otimiza resultados funcionais.',
    epidemiology: 'Mais de 600.000/ano nos EUA. Idade média 65-70 anos. Satisfação de 80-90%. Sobrevida do implante >95% em 15 anos.',
    etiology: [
      'Osteoartrose primária (90%)',
      'Artrite reumatoide',
      'Osteonecrose',
      'Artrite pós-traumática'
    ],
    clinicalPresentation: [
      'Dor e rigidez pré-operatórias',
      'Dor pós-operatória esperada (pico D2-3)',
      'Edema e equimose',
      'Rigidez se reabilitação inadequada',
      'Melhora progressiva em 3-12 meses'
    ],
    diagnosis: [
      'Avaliação de ADM (meta: 0-120°)',
      'KOOS ou WOMAC pré e pós',
      'Força de quadríceps',
      'Testes funcionais (TUG, escadas)'
    ],
    treatment: {
      conservative: [
        'Mobilização precoce (D0-1)',
        'Exercícios de ADM ativa e passiva',
        'Fortalecimento de quadríceps (isométrico inicial)',
        'Marcha com andador/muletas',
        'Crioterapia para controle de edema',
        'Progressão para exercícios funcionais',
        'Retorno a atividades de baixo impacto'
      ],
      prognosis: 'Maioria atinge ADM funcional em 6-12 semanas. Força de quadríceps recupera em 6-12 meses. Atividades de baixo impacto recomendadas.'
    },
    redFlags: [
      'Infecção (calor, drenagem, febre)',
      'TVP/TEP',
      'Rigidez artrofibrótica (<90° em 6 semanas)',
      'Instabilidade ou falha do implante'
    ],
    evidence: {
      references: [
        'Artz N, et al. Physiotherapy after TKA. Cochrane Database. 2015.',
        'Bade MJ, et al. Outcomes after TKA. J Orthop Sports Phys Ther. 2010.'
      ]
    },
    clinicalApplication: 'Meta de ADM: 0° extensão, 110-120° flexão. Flexão <90° em 6 semanas pode indicar manipulação sob anestesia.',
    keywords: ['artroplastia joelho', 'ATJ', 'prótese joelho', 'reabilitação pós-operatória', 'osteoartrose']
  },
  {
    id: 'artroplastia-quadril',
    slug: 'artroplastia-total-quadril-reabilitacao',
    category: 'patologias',
    title: 'Artroplastia Total de Quadril: Reabilitação',
    metaDescription: 'Reabilitação após artroplastia total de quadril: precauções, fases de tratamento e retorno às atividades.',
    introduction: 'A ATQ é procedimento de alta efetividade para coxartrose. Precauções variam com abordagem cirúrgica (anterior vs posterior).',
    epidemiology: 'Mais de 400.000/ano nos EUA. Idade média 65 anos. Satisfação >95%. Sobrevida do implante >90% em 15 anos.',
    etiology: [
      'Osteoartrose primária (85%)',
      'Osteonecrose da cabeça femoral',
      'Displasia do quadril',
      'Artrite inflamatória',
      'Fratura do colo femoral'
    ],
    clinicalPresentation: [
      'Dor inguinal e limitação pré-operatórias',
      'Claudicação de Trendelenburg',
      'Melhora rápida da dor pós-operatória',
      'Risco de luxação nas primeiras semanas'
    ],
    diagnosis: [
      'Avaliação de ADM (respeitar precauções)',
      'Harris Hip Score ou HOOS',
      'Força de abdutores (Trendelenburg)',
      'Testes de marcha e equilíbrio'
    ],
    treatment: {
      conservative: [
        'Mobilização precoce (D0-1)',
        'Precauções de luxação conforme abordagem',
        'Posterior: evitar flexão >90°, adução, RI',
        'Anterior: menos restrições, evitar extensão + RE',
        'Fortalecimento de glúteo médio (Trendelenburg)',
        'Progressão de marcha (andador → bengala → sem auxílio)',
        'Retorno a atividades de baixo impacto'
      ],
      prognosis: 'Risco de luxação maior nas primeiras 6-12 semanas. Maioria caminha sem auxílio em 6-8 semanas. Atividades de baixo impacto indefinidamente.'
    },
    redFlags: [
      'Luxação (dor súbita, encurtamento, rotação)',
      'Infecção',
      'TVP/TEP',
      'Fratura periprotética'
    ],
    evidence: {
      references: [
        'Mikkelsen LR, et al. Fast-track hip arthroplasty. Acta Orthop. 2014.',
        'Di Monaco M, et al. Rehabilitation after total hip arthroplasty. J Rehabil Med. 2014.'
      ]
    },
    clinicalApplication: 'Abordagem anterior permite precauções menos restritivas. Fortalecimento de glúteo médio é prioridade para marcha sem claudicação.',
    keywords: ['artroplastia quadril', 'ATQ', 'prótese quadril', 'precauções luxação', 'coxartrose']
  },
  {
    id: 'reconstrucao-lca',
    slug: 'reconstrucao-lca-reabilitacao',
    category: 'patologias',
    title: 'Reconstrução do LCA: Reabilitação',
    metaDescription: 'Reabilitação pós-reconstrução do LCA: fases, marcos funcionais e critérios de retorno ao esporte baseados em evidência.',
    introduction: 'A reconstrução do LCA visa restaurar estabilidade do joelho. Reabilitação moderna é baseada em critérios funcionais, não apenas tempo.',
    epidemiology: 'Incidência de lesão: 30-80/100.000/ano. 50-70% optam por cirurgia. Retorno ao esporte: 65% em alto nível. Re-ruptura: 6-25%.',
    etiology: [
      'Mecanismo sem contato (80%): pivô, aterrissagem',
      'Contato direto',
      'Esportes de pivoteamento: futebol, basquete, vôlei',
      'Fatores de risco: mulheres, valgo dinâmico'
    ],
    clinicalPresentation: [
      'Joelho estável pós-reconstrução',
      'Derrame pós-operatório',
      'Déficit de extensão se não tratado precocemente',
      'Fraqueza de quadríceps persistente',
      'Kinesiofobia e medo de relesão'
    ],
    diagnosis: [
      'Lachman negativo pós-reconstrução',
      'Avaliação de ADM (0° extensão prioritário)',
      'LSI de força quadríceps e isquiotibiais',
      'Hop tests (single, triple, crossover)',
      'ACL-RSI (prontidão psicológica)'
    ],
    treatment: {
      conservative: [
        'Fase 1 (0-2 sem): extensão completa, controle edema',
        'Fase 2 (2-6 sem): ADM, marcha, fortalecimento básico',
        'Fase 3 (6-12 sem): fortalecimento progressivo',
        'Fase 4 (3-6 meses): exercícios funcionais',
        'Fase 5 (6-9+ meses): treino esportivo específico',
        'Critérios de retorno: LSI >90%, qualidade de movimento',
        'Programas de prevenção de relesão'
      ],
      prognosis: 'Retorno ao esporte: 6-12 meses (baseado em critérios). Risco de relesão maior em <12 meses e jovens <25 anos.'
    },
    redFlags: [
      'Perda de extensão (artrofibrose)',
      'Derrame persistente',
      'Dor anterior significativa (síndrome PF)',
      'Re-ruptura'
    ],
    evidence: {
      references: [
        'Grindem H, et al. Return to sport after ACL reconstruction. Br J Sports Med. 2020.',
        'Van Melick N, et al. Evidence-based clinical practice update: ACL rehabilitation. Br J Sports Med. 2016.'
      ]
    },
    clinicalApplication: 'Cada mês de atraso no retorno (até 9 meses) reduz risco de relesão em 51%. Critérios > tempo.',
    keywords: ['reconstrução LCA', 'ligamento cruzado anterior', 'retorno ao esporte', 'hop test', 'pós-operatório joelho']
  },
  {
    id: 'instabilidade-cronica-tornozelo',
    slug: 'instabilidade-cronica-tornozelo',
    category: 'patologias',
    title: 'Instabilidade Crônica de Tornozelo',
    metaDescription: 'Instabilidade crônica de tornozelo: fisiopatologia, avaliação funcional e protocolo de reabilitação neuromuscular.',
    introduction: 'A instabilidade crônica desenvolve-se em 20-40% das entorses laterais, caracterizada por entorses recorrentes e sensação de instabilidade.',
    epidemiology: 'Desenvolve-se em 20-40% das entorses. Mais comum em atletas. Associada a lesões intra-articulares e artrose precoce.',
    etiology: [
      'Entorse lateral mal reabilitada',
      'Frouxidão ligamentar residual',
      'Déficit proprioceptivo',
      'Fraqueza de eversores e fibulares',
      'Alterações de controle postural'
    ],
    clinicalPresentation: [
      'Entorses recorrentes',
      'Sensação de "dar no vácuo"',
      'Insegurança em terreno irregular',
      'Dor crônica lateral',
      'Possível impacto anterolateral'
    ],
    diagnosis: [
      'CAIT (Cumberland Ankle Instability Tool)',
      'Teste de gaveta anterior',
      'Tilt talar',
      'SEBT/Y-Balance Test',
      'Single leg stance test'
    ],
    treatment: {
      conservative: [
        'Treino de equilíbrio e propriocepção',
        'Fortalecimento de fibulares e eversores',
        'Treino em superfícies instáveis',
        'Exercícios pliométricos progressivos',
        'Treino esporte-específico',
        'Taping ou órtese durante atividades',
        'Educação sobre prevenção'
      ],
      surgical: 'Reconstrução ligamentar (Broström-Gould) se falha conservadora após 3-6 meses.',
      prognosis: '70-90% respondem bem a programa de exercícios. Cirurgia reservada para casos refratários.'
    },
    redFlags: [
      'Lesão osteocondral (bloqueio, crepitação)',
      'Impacto anterolateral persistente',
      'Falha de múltiplos programas conservadores'
    ],
    evidence: {
      references: [
        'Gribble PA, et al. 2016 consensus statement on CAI. Br J Sports Med. 2016.',
        'Doherty C, et al. Treatment and prevention of CAI: systematic review. J Athl Train. 2017.'
      ]
    },
    clinicalApplication: 'CAIT >27 indica instabilidade significativa. Programa de exercícios 6-12 semanas antes de considerar cirurgia.',
    keywords: ['instabilidade tornozelo', 'entorse recorrente', 'propriocepção', 'CAI', 'CAIT']
  },

  // CONDIÇÕES ESPECIAIS
  {
    id: 'sindrome-dor-regional-complexa',
    slug: 'sindrome-dor-regional-complexa-crps',
    category: 'patologias',
    title: 'Síndrome de Dor Regional Complexa (CRPS)',
    metaDescription: 'CRPS: critérios de Budapeste, fisiopatologia e abordagem fisioterapêutica baseada em exposição gradual.',
    introduction: 'A CRPS é condição de dor crônica desproporcional ao evento inicial, com alterações sensoriais, vasomotoras, sudomotoras e motoras.',
    epidemiology: 'Incidência de 5-26/100.000/ano. Mais comum após fratura de rádio distal. Mulheres 3-4x mais afetadas. Pico 40-60 anos.',
    etiology: [
      'Fratura (mais comum)',
      'Cirurgia',
      'Imobilização prolongada',
      'Entorse ou contusão',
      'Mecanismo: inflamação neurogênica + sensibilização central'
    ],
    clinicalPresentation: [
      'Dor desproporcional ao estímulo',
      'Alodinia e hiperalgesia',
      'Edema e alterações vasomotoras',
      'Alterações sudomotoras (hiper ou hipo)',
      'Alterações tróficas (unhas, pelos, pele)',
      'Déficit motor e tremor'
    ],
    diagnosis: [
      'Critérios de Budapeste (clínicos)',
      'Dor contínua desproporcional',
      'Pelo menos 1 sintoma em 3 categorias',
      'Pelo menos 1 sinal em 2 categorias',
      'Exclusão de outros diagnósticos'
    ],
    treatment: {
      conservative: [
        'Educação sobre dor e neurociência',
        'Exposição gradual e dessensibilização',
        'Imaginação motora graduada (GMI)',
        'Mirror therapy (terapia do espelho)',
        'TENS',
        'Hidroterapia',
        'Exercício aeróbico'
      ],
      prognosis: 'Tratamento precoce é crítico. 50-70% melhoram significativamente com abordagem multimodal. Cronicidade em 15-20%.'
    },
    redFlags: [
      'Deterioração rápida',
      'Sintomas bilaterais extensos',
      'Não resposta a tratamento multimodal'
    ],
    evidence: {
      references: [
        'Harden RN, et al. Validation of proposed diagnostic criteria (Budapest Criteria) for CRPS. Pain. 2010.',
        'Smart KM, et al. Physiotherapy for CRPS. Cochrane Database. 2022.'
      ]
    },
    clinicalApplication: 'Abordagem gradual é essencial. Evitar imobilização prolongada. GMI: reconhecimento lateralidade → imaginação → mirror therapy.',
    keywords: ['CRPS', 'distrofia simpático reflexa', 'dor complexa regional', 'alodinia', 'terapia espelho']
  },
  {
    id: 'dor-lombar-cronica',
    slug: 'dor-lombar-cronica-nao-especifica',
    category: 'patologias',
    title: 'Dor Lombar Crônica Não-Específica',
    metaDescription: 'Dor lombar crônica: fatores psicossociais, abordagem biopsicossocial e exercício como primeira linha de tratamento.',
    introduction: 'A dor lombar crônica não-específica (>12 semanas sem causa identificável) representa 85-90% das lombalgias crônicas. Fatores psicossociais são determinantes.',
    epidemiology: 'Prevalência pontual de 20-25%. Principal causa de incapacidade no mundo. 10-15% das lombalgias agudas cronificam.',
    etiology: [
      'Sensibilização central',
      'Fatores psicossociais (catastrofização, depressão)',
      'Crenças de medo-evitação',
      'Descondicionamento físico',
      'Fatores ocupacionais e sociais'
    ],
    clinicalPresentation: [
      'Dor lombar >12 semanas',
      'Sem causa específica identificável',
      'Impacto funcional variável',
      'Frequentemente com bandeiras amarelas',
      'Possível hipervigilância e comportamentos de evitação'
    ],
    diagnosis: [
      'Exclusão de bandeiras vermelhas',
      'STarT Back Tool para estratificação',
      'Örebro Musculoskeletal Pain Questionnaire',
      'Oswestry ou Roland-Morris',
      'FABQ (crenças de medo-evitação)',
      'PHQ-9 (depressão)'
    ],
    treatment: {
      conservative: [
        'Educação sobre dor e neurociência',
        'Exercício supervisionado (qualquer tipo)',
        'Terapia cognitivo-comportamental',
        'Exposição gradual a atividades temidas',
        'Abordagem biopsicossocial',
        'Retorno gradual ao trabalho',
        'Evitar repouso e medicação passiva'
      ],
      prognosis: 'Prognóstico variável. Fatores psicossociais são melhores preditores que achados físicos. Abordagem multimodal é mais efetiva.'
    },
    redFlags: [
      'Síndrome da cauda equina',
      'Déficit neurológico progressivo',
      'Sinais sistêmicos (febre, perda de peso)'
    ],
    evidence: {
      references: [
        'Foster NE, et al. Prevention and treatment of low back pain: evidence, challenges. Lancet. 2018.',
        'O\'Sullivan PB, et al. Cognitive functional therapy for chronic low back pain. Phys Ther. 2018.'
      ]
    },
    clinicalApplication: 'STarT Back direciona intensidade: baixo risco = exercício simples; alto risco = abordagem psicológica integrada.',
    keywords: ['lombalgia crônica', 'dor lombar crônica', 'sensibilização central', 'biopsicossocial', 'bandeiras amarelas']
  },
  {
    id: 'cefaleia-tensional',
    slug: 'cefaleia-tensional-cronica',
    category: 'patologias',
    title: 'Cefaleia Tensional: Fisioterapia',
    metaDescription: 'Cefaleia tensional: fisiopatologia, pontos-gatilho miofasciais e abordagem fisioterapêutica baseada em evidência.',
    introduction: 'A cefaleia tensional é a cefaleia primária mais comum, caracterizada por dor bilateral em pressão/aperto, sem características de migrânea.',
    epidemiology: 'Prevalência de 30-78% da população. Mais comum em mulheres. Forma crônica em 3% da população.',
    etiology: [
      'Sensibilização periférica miofascial',
      'Sensibilização central (formas crônicas)',
      'Estresse e tensão muscular',
      'Fatores posturais',
      'Disfunção temporomandibular'
    ],
    clinicalPresentation: [
      'Dor bilateral em "faixa" ou "pressão"',
      'Intensidade leve a moderada',
      'Não agrava com atividade física rotineira',
      'Sem náusea significativa ou vômitos',
      'Fotofobia OU fonofobia (não ambos)',
      'Pontos-gatilho em musculatura cervical'
    ],
    diagnosis: [
      'Critérios ICHD-3',
      'Diferenciação de migrânea e cefaleia cervicogênica',
      'Palpação de pontos-gatilho',
      'Avaliação postural cervical',
      'Avaliação de ATM'
    ],
    treatment: {
      conservative: [
        'Liberação de pontos-gatilho',
        'Agulhamento seco',
        'Mobilização cervical',
        'Exercícios de estabilização cervical profunda',
        'Correção postural',
        'Técnicas de relaxamento',
        'Educação e manejo de estresse'
      ],
      prognosis: 'Formas episódicas respondem bem. Formas crônicas requerem abordagem multimodal incluindo manejo de fatores psicossociais.'
    },
    redFlags: [
      'Cefaleia thunderclap (súbita intensa)',
      'Alterações neurológicas',
      'Mudança de padrão',
      'Sinais sistêmicos'
    ],
    evidence: {
      references: [
        'Fernández-de-Las-Peñas C, et al. Manual therapies for tension-type headache. Cephalalgia. 2006.',
        'Castien RF, et al. Effectiveness of manual therapy for chronic tension-type headache. Cephalalgia. 2011.'
      ]
    },
    clinicalApplication: 'Terapia manual combinada com exercícios é mais efetiva que isolada. Tratar musculatura cervical e mastigatória.',
    keywords: ['cefaleia tensional', 'dor de cabeça', 'pontos-gatilho', 'cervicalgia', 'stress']
  },
  {
    id: 'disfuncao-temporomandibular',
    slug: 'disfuncao-temporomandibular-dtm',
    category: 'patologias',
    title: 'Disfunção Temporomandibular (DTM)',
    metaDescription: 'DTM: classificação, avaliação fisioterapêutica e tratamento conservador das disfunções da ATM e musculatura mastigatória.',
    introduction: 'A DTM engloba condições que afetam a ATM, músculos da mastigação e estruturas associadas, causando dor e disfunção mandibular.',
    epidemiology: 'Sinais em 40-75% da população, sintomas em 20-25%. Mulheres 2-3x mais afetadas. Pico 20-40 anos.',
    etiology: [
      'Disfunção muscular (mais comum)',
      'Deslocamento de disco articular',
      'Artralgia e artrose da ATM',
      'Parafunções (bruxismo, apertamento)',
      'Fatores psicossociais (estresse, ansiedade)'
    ],
    clinicalPresentation: [
      'Dor na região pré-auricular e mastigatória',
      'Limitação de abertura (<40mm)',
      'Estalidos ou crepitação articular',
      'Desvio mandibular na abertura',
      'Cefaleia e dor cervical associadas',
      'Travamento articular (bloqueio)'
    ],
    diagnosis: [
      'DC/TMD (Diagnostic Criteria for TMD)',
      'Palpação muscular e articular',
      'Medida de abertura bucal',
      'Avaliação de ruídos articulares',
      'Questionários: JFLS, GCPS'
    ],
    treatment: {
      conservative: [
        'Educação e autogerenciamento',
        'Exercícios mandibulares (coordenação, mobilidade)',
        'Terapia manual intra e extraoral',
        'Liberação de pontos-gatilho masseter e temporal',
        'Mobilização cervical (relação cervical-ATM)',
        'Técnicas de relaxamento',
        'Placa oclusal (encaminhamento odontológico)'
      ],
      prognosis: 'Maioria responde ao tratamento conservador. 75% melhoram em 3 meses. Casos articulares estruturais podem requerer intervenção odontológica/cirúrgica.'
    },
    redFlags: [
      'Travamento prolongado irredutível',
      'Alterações ósseas progressivas',
      'Sinais de artrite sistêmica'
    ],
    evidence: {
      references: [
        'List T, Jensen RH. TMD: old ideas and new concepts. Cephalalgia. 2017.',
        'Armijo-Olivo S, et al. Effectiveness of manual therapy for TMD. Phys Ther. 2016.'
      ]
    },
    clinicalApplication: 'Tratar coluna cervical junto com ATM. Exercícios de coordenação mandibular reduzem estalidos e melhoram abertura.',
    keywords: ['DTM', 'ATM', 'disfunção temporomandibular', 'bruxismo', 'dor orofacial']
  },
  {
    id: 'vertigem-posicional',
    slug: 'vertigem-posicional-paroxistica-benigna',
    category: 'patologias',
    title: 'VPPB: Diagnóstico e Manobras de Reposicionamento',
    metaDescription: 'Vertigem posicional paroxística benigna: fisiopatologia, teste de Dix-Hallpike e manobras de Epley para tratamento.',
    introduction: 'A VPPB é a causa mais comum de vertigem periférica, causada por otólitos deslocados nos canais semicirculares, mais comumente o posterior.',
    epidemiology: 'Incidência de 10-60/100.000/ano. Prevalência ao longo da vida de 2.4%. Mais comum em mulheres e idosos.',
    etiology: [
      'Deslocamento de otólitos para canais semicirculares',
      'Idiopática (50-70%)',
      'Trauma craniano',
      'Neurite vestibular prévia',
      'Doença de Ménière'
    ],
    clinicalPresentation: [
      'Vertigem rotatória intensa e breve (<1 min)',
      'Desencadeada por mudança de posição da cabeça',
      'Posições típicas: deitar, virar na cama, olhar para cima',
      'Náusea associada',
      'Nistagmo característico'
    ],
    diagnosis: [
      'Teste de Dix-Hallpike (canal posterior)',
      'Roll test (canal horizontal)',
      'Observação de nistagmo',
      'Canal posterior: nistagmo torcional geotrópico',
      'Diferenciação de vertigem central'
    ],
    treatment: {
      conservative: [
        'Manobra de Epley (canal posterior)',
        'Manobra de Semont (alternativa)',
        'Manobra de Lempert/BBQ (canal horizontal)',
        'Exercícios de Brandt-Daroff (adjuvante)',
        'Reabilitação vestibular se sintomas residuais',
        'Educação sobre recorrências'
      ],
      prognosis: 'Sucesso de 70-90% com uma manobra. Taxa de recorrência de 15-50% em 1 ano. Maioria resolve completamente.'
    },
    redFlags: [
      'Nistagmo central (vertical, sem latência)',
      'Déficits neurológicos associados',
      'Vertigem prolongada (>1 min)',
      'Ausência de fatigabilidade'
    ],
    evidence: {
      references: [
        'Bhattacharyya N, et al. Clinical Practice Guideline: Benign Paroxysmal Positional Vertigo. Otolaryngol Head Neck Surg. 2017.',
        'Hilton MP, et al. The Epley manoeuvre for BPPV. Cochrane Database. 2014.'
      ]
    },
    clinicalApplication: 'Epley resolve 70% na primeira sessão. Manter posição vertical por 10 min após, mas restrições prolongadas não são necessárias.',
    keywords: ['VPPB', 'vertigem posicional', 'Dix-Hallpike', 'manobra de Epley', 'otólitos']
  },
  {
    id: 'neuropatia-periferica',
    slug: 'neuropatia-periferica-diabetica',
    category: 'patologias',
    title: 'Neuropatia Periférica Diabética',
    metaDescription: 'Neuropatia diabética: rastreamento, avaliação do pé de risco e exercício para prevenção e tratamento.',
    introduction: 'A neuropatia diabética é complicação crônica do diabetes, afetando 50% dos diabéticos. Principal causa de amputação não-traumática.',
    epidemiology: '50% dos diabéticos após 10 anos. Prevalência aumenta com tempo de doença e controle glicêmico inadequado.',
    etiology: [
      'Hiperglicemia crônica',
      'Estresse oxidativo',
      'Disfunção microvascular',
      'Deficiência de fatores neurotróficos',
      'Fatores de risco: tempo de DM, HbA1c, dislipidemia'
    ],
    clinicalPresentation: [
      'Parestesias distais em "meia e luva"',
      'Dor neuropática (queimação, pontadas)',
      'Perda de sensibilidade protetora',
      'Fraqueza distal',
      'Deformidades do pé (Charcot)',
      'Úlceras plantares'
    ],
    diagnosis: [
      'Monofilamento 10g (sensibilidade protetora)',
      'Diapasão 128Hz (vibração)',
      'Teste de reflexo aquileu',
      'Michigan Neuropathy Screening Instrument',
      'Avaliação de risco de ulceração'
    ],
    treatment: {
      conservative: [
        'Controle glicêmico rigoroso (prevenção)',
        'Exercício aeróbico supervisionado',
        'Treino de equilíbrio e propriocepção',
        'Fortalecimento de intrínsecos do pé',
        'Educação sobre cuidados com o pé',
        'Calçados adequados e palmilhas',
        'Avaliação regular por podólogo'
      ],
      prognosis: 'Progressiva se mal controlada. Exercício pode melhorar função nervosa em estágios iniciais. Prevenção de úlceras é fundamental.'
    },
    redFlags: [
      'Úlcera plantar',
      'Pé de Charcot (edema, calor)',
      'Infecção de pé',
      'Progressão rápida assimétrica'
    ],
    evidence: {
      references: [
        'Pop-Busui R, et al. Diabetic neuropathy: a position statement by the ADA. Diabetes Care. 2017.',
        'Kluding PM, et al. The effect of exercise on neuropathic symptoms. Diabetes Care. 2012.'
      ]
    },
    clinicalApplication: 'Monofilamento negativo = perda de sensibilidade protetora = alto risco. Exercício de baixo impacto é seguro e benéfico.',
    keywords: ['neuropatia diabética', 'pé diabético', 'monofilamento', 'sensibilidade protetora', 'úlcera plantar']
  },
  {
    id: 'sindrome-fadiga-cronica',
    slug: 'sindrome-fadiga-cronica-encefalomielite-mialgica',
    category: 'patologias',
    title: 'Síndrome de Fadiga Crônica (EM/SFC)',
    metaDescription: 'Encefalomielite miálgica/síndrome de fadiga crônica: critérios diagnósticos, pacing e abordagem atualizada.',
    introduction: 'A EM/SFC é condição crônica debilitante caracterizada por fadiga severa não aliviada por repouso e mal-estar pós-esforço (PEM).',
    epidemiology: 'Prevalência de 0.2-0.4% da população. Predominância feminina (3:1). Frequentemente subdiagnosticada.',
    etiology: [
      'Desconhecida - provavelmente multifatorial',
      'Gatilho infeccioso em 70% (EBV, COVID-19)',
      'Disfunção imunológica',
      'Alterações metabólicas',
      'Disfunção autonômica'
    ],
    clinicalPresentation: [
      'Fadiga severa >6 meses',
      'Mal-estar pós-esforço (PEM) - cardinal',
      'Sono não-reparador',
      'Disfunção cognitiva ("brain fog")',
      'Intolerância ortostática',
      'Dor muscular e articular'
    ],
    diagnosis: [
      'Critérios IOM 2015 / NICE 2021',
      'Exclusão de outras causas',
      'História detalhada de PEM',
      'Avaliação de capacidade funcional basal',
      'SF-36, FSS, DePaul Symptom Questionnaire'
    ],
    treatment: {
      conservative: [
        'Pacing (gerenciamento de energia) - primeira linha',
        'Atividade dentro do "envelope de energia"',
        'Evitar boom-bust (excessos seguidos de crash)',
        'NÃO usar terapia de exercício graduado tradicional',
        'Otimização do sono',
        'Manejo de comorbidades',
        'Suporte para adaptação funcional'
      ],
      prognosis: 'Condição crônica com flutuações. Recuperação completa incomum (~5%). Pacing melhora qualidade de vida e previne deterioração.'
    },
    redFlags: [
      'Sintomas sugestivos de outra condição',
      'Deterioração significativa inexplicada',
      'Sintomas neurológicos focais'
    ],
    evidence: {
      references: [
        'NICE. Myalgic encephalomyelitis (chronic fatigue syndrome): diagnosis and management. NG206. 2021.',
        'Institute of Medicine. Beyond myalgic encephalomyelitis/chronic fatigue syndrome. NAP, 2015.'
      ]
    },
    clinicalApplication: 'NÃO prescrever exercício graduado tradicional (pode piorar). Pacing e respeito ao PEM são fundamentais.',
    keywords: ['fadiga crônica', 'EM/SFC', 'mal-estar pós-esforço', 'pacing', 'encefalomielite miálgica']
  },
  {
    id: 'covid-longa',
    slug: 'sindrome-pos-covid-covid-longa',
    category: 'patologias',
    title: 'Síndrome Pós-COVID (COVID Longa)',
    metaDescription: 'Síndrome pós-COVID: manifestações multiorgânicas, avaliação de capacidade funcional e reabilitação gradual.',
    introduction: 'A síndrome pós-COVID caracteriza-se por sintomas persistentes ou novos após infecção por SARS-CoV-2, afetando múltiplos sistemas.',
    epidemiology: '10-30% dos infectados desenvolvem sintomas prolongados. Mais comum em mulheres, hospitalizados e com comorbidades.',
    etiology: [
      'Persistência viral ou fragmentos',
      'Autoimunidade',
      'Disfunção autonômica',
      'Microtrombos e disfunção endotelial',
      'Reativação de vírus latentes (EBV)'
    ],
    clinicalPresentation: [
      'Fadiga severa',
      'Mal-estar pós-esforço (similar EM/SFC)',
      'Dispneia e intolerância ao exercício',
      'Disfunção cognitiva ("brain fog")',
      'Palpitações e disautonomia (POTS)',
      'Dor musculoesquelética difusa'
    ],
    diagnosis: [
      'Sintomas >12 semanas após infecção',
      'Exclusão de complicações específicas',
      'Avaliação cardiopulmonar se dispneia',
      'TC6M ou CPET conforme tolerância',
      'Post-COVID Functional Status Scale'
    ],
    treatment: {
      conservative: [
        'Pacing se mal-estar pós-esforço presente',
        'Reabilitação respiratória se indicada',
        'Progressão muito gradual de exercício',
        'Monitoramento de sintomas pós-exercício',
        'Manejo de disautonomia',
        'Abordagem multidisciplinar',
        'Suporte psicológico'
      ],
      prognosis: 'Maioria melhora gradualmente em 6-12 meses. Subgrupo com curso crônico similar a EM/SFC.'
    },
    redFlags: [
      'Dor torácica ou dispneia severa (descartar cardíaco)',
      'Déficits neurológicos novos',
      'Trombose',
      'Deterioração funcional significativa'
    ],
    evidence: {
      references: [
        'Greenhalgh T, et al. Management of post-acute covid-19 in primary care. BMJ. 2020.',
        'World Physiotherapy. Physiotherapy for COVID-19. 2021.'
      ]
    },
    clinicalApplication: 'Se PEM presente, tratar como EM/SFC (pacing, não exercício graduado). Se PEM ausente, reabilitação gradual é apropriada.',
    keywords: ['COVID longa', 'pós-COVID', 'fadiga pós-COVID', 'reabilitação COVID', 'POTS']
  },
  {
    id: 'sarcopenia',
    slug: 'sarcopenia-idoso',
    category: 'patologias',
    title: 'Sarcopenia: Diagnóstico e Exercício',
    metaDescription: 'Sarcopenia: critérios EWGSOP2, avaliação de força e massa muscular, e exercício de resistência como intervenção primária.',
    introduction: 'A sarcopenia é perda progressiva de massa e função muscular associada ao envelhecimento, com impacto em independência e mortalidade.',
    epidemiology: 'Prevalência de 10-27% em idosos comunitários, 30-50% em institucionalizados. Associada a 3-5x maior risco de quedas.',
    etiology: [
      'Envelhecimento (perda de neurônios motores)',
      'Inatividade física',
      'Desnutrição proteica',
      'Inflamação crônica',
      'Doenças crônicas',
      'Alterações hormonais'
    ],
    clinicalPresentation: [
      'Fraqueza muscular',
      'Lentidão de marcha',
      'Dificuldade em levantar de cadeira',
      'Fadiga',
      'Quedas frequentes',
      'Perda de independência'
    ],
    diagnosis: [
      'EWGSOP2: força + massa muscular',
      'Força: dinamometria de preensão (<27kg H, <16kg M)',
      'Performance: velocidade de marcha (<0.8m/s), SPPB, TUG',
      'Massa: DEXA, BIA, TC',
      'SARC-F para rastreamento'
    ],
    treatment: {
      conservative: [
        'Exercício de resistência (principal intervenção)',
        'Treino de força progressivo 2-3x/semana',
        'Proteína adequada (1.0-1.2g/kg/dia)',
        'Suplementação proteica se necessário',
        'Vitamina D se deficiente',
        'Exercício aeróbico complementar',
        'Treino de equilíbrio e potência'
      ],
      prognosis: 'Exercício de resistência pode reverter sarcopenia em estágios iniciais. Ganhos de força possíveis em qualquer idade.'
    },
    redFlags: [
      'Perda de peso inexplicada >5%',
      'Sarcopenia secundária a câncer',
      'Deterioração funcional rápida'
    ],
    evidence: {
      references: [
        'Cruz-Jentoft AJ, et al. Sarcopenia: EWGSOP2 consensus. Age Ageing. 2019.',
        'Landi F, et al. Exercise as a remedy for sarcopenia. Curr Opin Clin Nutr Metab Care. 2014.'
      ]
    },
    clinicalApplication: 'Exercício de resistência é efetivo mesmo em nonagenários. Proteína deve ser distribuída ao longo do dia (25-30g/refeição).',
    keywords: ['sarcopenia', 'perda muscular', 'idoso', 'exercício resistido', 'fraqueza muscular']
  },
  {
    id: 'osteoporose',
    slug: 'osteoporose-exercicio-prevencao-fraturas',
    category: 'patologias',
    title: 'Osteoporose: Exercício e Prevenção de Fraturas',
    metaDescription: 'Osteoporose: exercício para saúde óssea, prevenção de quedas e fraturas, e contraindicações de exercício.',
    introduction: 'A osteoporose é doença óssea metabólica com redução de massa e deterioração microarquitetural, aumentando risco de fraturas.',
    epidemiology: 'Afeta 1 em 3 mulheres e 1 em 5 homens após 50 anos. Fraturas de quadril com mortalidade de 20% em 1 ano.',
    etiology: [
      'Deficiência estrogênica pós-menopausa',
      'Envelhecimento',
      'Inatividade física',
      'Deficiência de cálcio e vitamina D',
      'Medicamentos (corticoides)',
      'Doenças crônicas'
    ],
    clinicalPresentation: [
      'Silenciosa até fratura',
      'Fraturas por fragilidade (baixo impacto)',
      'Sítios: vértebra, quadril, rádio distal',
      'Cifose dorsal (fraturas vertebrais)',
      'Perda de altura',
      'Dor crônica se fraturas múltiplas'
    ],
    diagnosis: [
      'DEXA: T-score ≤-2.5',
      'FRAX para risco de fratura',
      'Avaliação de fraturas vertebrais',
      'Testes de equilíbrio e risco de quedas'
    ],
    treatment: {
      conservative: [
        'Exercício de impacto (se tolerado)',
        'Treino de resistência para quadril e coluna',
        'Exercícios de equilíbrio e prevenção de quedas',
        'Exercícios posturais (extensão)',
        'Evitar flexão de tronco com carga',
        'Cálcio e vitamina D adequados',
        'Avaliação de risco ambiental de quedas'
      ],
      prognosis: 'Exercício pode aumentar ou manter DMO. Principal impacto: redução de quedas e fraturas.'
    },
    redFlags: [
      'Fratura recente (aguardar consolidação)',
      'Dor vertebral nova (fratura?)',
      'Osteoporose severa (T-score <-3.5)'
    ],
    evidence: {
      references: [
        'Beck BR, et al. Exercise and Sports Science Australia position statement on exercise for osteoporosis. J Sci Med Sport. 2017.',
        'Giangregorio LM, et al. Too Fit To Fracture exercise recommendations. Osteoporos Int. 2015.'
      ]
    },
    clinicalApplication: 'Impacto e resistência para osso. Equilíbrio para quedas. Evitar flexão com carga (aumenta risco de fratura vertebral).',
    keywords: ['osteoporose', 'densidade óssea', 'fratura', 'exercício de impacto', 'prevenção quedas']
  }
];
