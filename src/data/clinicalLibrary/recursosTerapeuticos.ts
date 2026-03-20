import { ClinicalPage } from './types';

export const recursosTerapeuticos: ClinicalPage[] = [
  // TENS
  {
    id: 'tens-convencional',
    slug: 'tens-convencional',
    category: 'recursos-terapeuticos',
    title: 'TENS Convencional: Parâmetros e Aplicação Clínica',
    metaDescription: 'TENS convencional: parâmetros ideais, mecanismo de ação (teoria das comportas), indicações e protocolo de aplicação para dor aguda.',
    introduction: 'O TENS (Transcutaneous Electrical Nerve Stimulation) convencional é a modalidade mais utilizada para analgesia. Atua pela teoria das comportas de Melzack e Wall, ativando fibras Aβ de baixo limiar que inibem a transmissão de dor na medula espinal.',
    mechanism: 'Estimulação de fibras Aβ de grande diâmetro e baixo limiar → ativação de interneurônios inibitórios no corno dorsal da medula → bloqueio da transmissão de impulsos nociceptivos (fibras Aδ e C) → analgesia de início rápido mas curta duração.',
    parameters: [
      'Frequência: 80-150 Hz (alta frequência)',
      'Largura de pulso: 50-100 µs (curta)',
      'Intensidade: sensitiva (formigamento confortável, sem contração)',
      'Tempo de aplicação: 20-60 minutos',
      'Eletrodos: sobre ou ao redor da área dolorosa',
      'Modulação: pode usar para evitar acomodação'
    ],
    indications: [
      'Dor aguda pós-operatória',
      'Dor musculoesquelética aguda',
      'Dor neuropática periférica',
      'Cervicalgia e lombalgia',
      'Dor articular (osteoartrose)',
      'Dismenorreia primária',
      'Cefaleia tensional'
    ],
    contraindications: [
      'Marca-passo cardíaco (relativa)',
      'Sobre seio carotídeo',
      'Sobre útero gravídico',
      'Áreas com perda de sensibilidade',
      'Sobre lesões de pele ou feridas abertas',
      'Epilepsia não controlada',
      'Trombose venosa profunda ativa'
    ],
    applicationProtocol: [
      'Limpar a pele com álcool e secar',
      'Posicionar eletrodos (técnica cruzada ou paralela)',
      'Iniciar com intensidade zero',
      'Aumentar gradualmente até sensação de formigamento',
      'Manter intensidade abaixo do limiar motor',
      'Ajustar se houver acomodação',
      'Duração: 20-60 minutos, 1-3x/dia'
    ],
    evidence: {
      references: [
        'Sluka KA, Walsh D. Transcutaneous electrical nerve stimulation. Clin J Pain. 2003',
        'Johnson MI et al. Efficacy of TENS for pain relief. Pain. 2015',
        'Vance CG et al. Effects of TENS on pain. J Pain. 2014'
      ]
    },
    clinicalApplication: 'O TENS convencional é ideal para dor aguda por seu efeito rápido. Posicione os eletrodos sobre ou ao redor da dor. A intensidade deve causar formigamento sem contração muscular. Efeito dura enquanto aplicado + 30 min após.',
    relatedTests: [],
    keywords: ['TENS', 'eletroterapia', 'analgesia', 'teoria das comportas', 'dor aguda']
  },
  {
    id: 'tens-acupuntura',
    slug: 'tens-acupuntura-burst',
    category: 'recursos-terapeuticos',
    title: 'TENS Acupuntura (Burst): Parâmetros para Dor Crônica',
    metaDescription: 'TENS acupuntura ou burst: parâmetros de baixa frequência, liberação de endorfinas, indicações para dor crônica e fibromialgia.',
    introduction: 'O TENS modo acupuntura ou burst utiliza baixa frequência para estimular a liberação de opioides endógenos (endorfinas e encefalinas). Produz analgesia de início mais lento, mas com efeito mais duradouro que o TENS convencional.',
    mechanism: 'Estimulação de fibras Aδ e C → ativação do sistema descendente inibitório da dor → liberação de β-endorfina (hipófise), encefalina e dinorfina (medula espinal) → analgesia de início lento (20-30 min) mas prolongada (horas).',
    parameters: [
      'Frequência: 1-10 Hz (baixa frequência) ou trens (burst)',
      'Largura de pulso: 150-250 µs (longa)',
      'Intensidade: motora (contração muscular visível)',
      'Tempo de aplicação: 30-45 minutos',
      'Eletrodos: sobre pontos motores ou acupontos',
      'Burst: trens de 7-10 pulsos a 100 Hz, repetidos a 2-4 Hz'
    ],
    indications: [
      'Dor crônica musculoesquelética',
      'Fibromialgia',
      'Lombalgia crônica',
      'Osteoartrose',
      'Dor miofascial',
      'Dor neuropática crônica',
      'Pacientes que não respondem ao TENS convencional'
    ],
    contraindications: [
      'Marca-passo cardíaco',
      'Sobre seio carotídeo',
      'Gravidez (região abdominal/lombar)',
      'Áreas com perda de sensibilidade',
      'Epilepsia não controlada',
      'Trombose venosa profunda'
    ],
    applicationProtocol: [
      'Identificar pontos motores ou acupontos',
      'Posicionar eletrodos sobre estes pontos',
      'Aumentar intensidade até contração muscular rítmica',
      'Manter contração visível mas confortável',
      'Aplicar por 30-45 minutos',
      'Frequência: 3-5x/semana para dor crônica',
      'Efeito acumulativo ao longo de sessões'
    ],
    evidence: {
      references: [
        'Han JS. Acupuncture and endorphins. Neurosci Lett. 2004',
        'Sluka KA et al. TENS mechanisms and clinical application. J Pain. 2013',
        'Dailey DL et al. TENS reduces pain in fibromyalgia. Pain. 2013'
      ]
    },
    clinicalApplication: 'Ideal para dor crônica onde o TENS convencional falhou. Requer contrações musculares visíveis. Efeito demora 20-30 min para iniciar mas dura horas. Combine com exercícios para potencializar resultados.',
    relatedTests: [],
    keywords: ['TENS acupuntura', 'burst', 'endorfinas', 'dor crônica', 'fibromialgia']
  },
  {
    id: 'fes',
    slug: 'fes-estimulacao-eletrica-funcional',
    category: 'recursos-terapeuticos',
    title: 'FES (Estimulação Elétrica Funcional): Aplicação Clínica',
    metaDescription: 'FES - Estimulação Elétrica Funcional: parâmetros, indicações neurológicas (AVE, lesão medular) e protocolo de aplicação.',
    introduction: 'A Estimulação Elétrica Funcional (FES) produz contrações musculares funcionais em músculos paralisados ou enfraquecidos. É fundamental na reabilitação neurológica para facilitar movimentos funcionais e prevenir atrofia.',
    mechanism: 'Corrente elétrica → despolarização de nervos motores periféricos → contração muscular → movimento funcional. Também promove neuroplasticidade por feedback sensorial repetitivo ao SNC durante o movimento.',
    parameters: [
      'Frequência: 20-50 Hz (gera contração tetânica suave)',
      'Largura de pulso: 200-400 µs',
      'Intensidade: contração funcional adequada',
      'Tempo ON: 5-10 segundos',
      'Tempo OFF: 10-20 segundos (razão 1:2 ou 1:3)',
      'Rampa de subida: 1-2 segundos',
      'Duração: 15-30 minutos'
    ],
    indications: [
      'AVE (pé caído, flexão de cotovelo)',
      'Lesão medular incompleta',
      'Paralisia cerebral',
      'Esclerose múltipla',
      'Lesão de nervo periférico',
      'Prevenção de atrofia por desuso',
      'Fraqueza pós-cirúrgica (joelho)'
    ],
    contraindications: [
      'Marca-passo cardíaco',
      'Gravidez',
      'Neoplasias na região',
      'Tromboflebite ativa',
      'Sobre seio carotídeo',
      'Espasticidade severa (pode piorar)'
    ],
    applicationProtocol: [
      'Posicionar paciente para movimento desejado',
      'Colocar eletrodos sobre pontos motores',
      'Eletrodo ativo no ponto motor, dispersivo proximal',
      'Ajustar rampa para contração suave',
      'Aumentar intensidade até movimento funcional',
      'Coordenar com tarefa funcional (marcha, alcance)',
      'Progressão: aumentar tempo ON, reduzir tempo OFF'
    ],
    evidence: {
      references: [
        'Knutson JS et al. FES for upper extremity motor recovery after stroke. Stroke. 2015',
        'Howlett OA et al. FES improves walking after stroke. Cochrane Database. 2015',
        'Martin R et al. FES for foot drop in neurological conditions. J Rehabil Med. 2016'
      ]
    },
    clinicalApplication: 'A FES deve ser aplicada durante tarefas funcionais para maximizar neuroplasticidade. Combine com prática de tarefa repetitiva. Em AVE, inicie precocemente. Ajuste tempo ON/OFF conforme fadiga.',
    relatedTests: [],
    keywords: ['FES', 'estimulação funcional', 'AVE', 'neurológico', 'pé caído']
  },
  {
    id: 'corrente-russa',
    slug: 'corrente-russa-eletroestimulacao',
    category: 'recursos-terapeuticos',
    title: 'Corrente Russa: Fortalecimento Muscular por Eletroestimulação',
    metaDescription: 'Corrente Russa: parâmetros para fortalecimento muscular, indicações ortopédicas e esportivas, protocolo de aplicação.',
    introduction: 'A Corrente Russa (corrente de Kots) é uma corrente de média frequência (2500 Hz) modulada em baixa frequência (50 Hz), projetada para produzir contrações musculares potentes com maior conforto que correntes de baixa frequência.',
    mechanism: 'Frequência portadora de 2500 Hz → menor impedância da pele → maior conforto. Modulação a 50 Hz → contração tetânica. Recruta mais unidades motoras que contração voluntária, incluindo fibras tipo II.',
    parameters: [
      'Frequência portadora: 2500 Hz',
      'Frequência de modulação: 50 Hz',
      'Ciclo de trabalho (duty cycle): 50%',
      'Tempo ON: 10 segundos',
      'Tempo OFF: 50 segundos (razão 1:5 inicial)',
      'Intensidade: máxima tolerada',
      'Duração: 10-20 contrações por sessão'
    ],
    indications: [
      'Fortalecimento de quadríceps pós-LCA',
      'Inibição artrogênica do quadríceps',
      'Atrofia por imobilização',
      'Fortalecimento pré-operatório',
      'Complemento ao treino de força',
      'Reabilitação de atletas',
      'Fortalecimento em pacientes com dor'
    ],
    contraindications: [
      'Marca-passo cardíaco',
      'Sobre abdômen em gestantes',
      'Neoplasias',
      'Infecção local',
      'Trombose venosa profunda',
      'Fratura não consolidada'
    ],
    applicationProtocol: [
      'Posicionar articulação em posição funcional',
      'Eletrodos grandes sobre ventre muscular',
      'Iniciar com razão ON:OFF de 1:5',
      'Aumentar intensidade até contração máxima tolerada',
      'Progredir para razão 1:3, depois 1:1',
      'Combinar com contração voluntária (superimposição)',
      '3x/semana, 10-20 contrações/sessão'
    ],
    evidence: {
      references: [
        'Maffiuletti NA et al. Neuromuscular electrical stimulation for muscle strength. Eur J Appl Physiol. 2010',
        'Kim KM et al. Neuromuscular electrical stimulation after ACL reconstruction. J Athl Train. 2010',
        'Walls RJ et al. Electrical stimulation for quadriceps strength. Br J Sports Med. 2010'
      ]
    },
    clinicalApplication: 'Essencial na reabilitação pós-LCA para vencer inibição artrogênica. A intensidade máxima tolerada é fundamental para recrutamento de fibras tipo II. Combine com exercício voluntário (superimposição) para melhores resultados.',
    relatedTests: [],
    keywords: ['corrente russa', 'Kots', 'fortalecimento', 'quadríceps', 'eletroestimulação']
  },
  // ULTRASSOM
  {
    id: 'ultrassom-terapeutico',
    slug: 'ultrassom-terapeutico',
    category: 'recursos-terapeuticos',
    title: 'Ultrassom Terapêutico: Parâmetros e Indicações',
    metaDescription: 'Ultrassom terapêutico: efeitos térmicos e não-térmicos, parâmetros por patologia, técnicas de aplicação e evidência científica.',
    introduction: 'O ultrassom terapêutico utiliza ondas sonoras de alta frequência (1-3 MHz) para produzir efeitos térmicos e não-térmicos nos tecidos. É uma das modalidades mais utilizadas em fisioterapia, embora sua evidência seja controversa para algumas indicações.',
    mechanism: 'Efeitos térmicos (modo contínuo): aumento de temperatura tecidual → aumento do fluxo sanguíneo, extensibilidade de colágeno, redução de espasmo. Efeitos não-térmicos (modo pulsado): cavitação estável, microfluxo → aceleração de reparo tecidual, redução de edema.',
    parameters: [
      'Frequência: 1 MHz (tecidos profundos 3-5 cm), 3 MHz (tecidos superficiais 1-2 cm)',
      'Modo contínuo: efeitos térmicos (inflamação crônica)',
      'Modo pulsado: efeitos não-térmicos (fase aguda)',
      'Intensidade: 0.5-2.0 W/cm² (contínuo), 0.1-0.5 W/cm² (pulsado)',
      'Duty cycle pulsado: 20-50%',
      'Tempo: 5-10 minutos por área (ERA x 2)',
      'Gel de acoplamento: camada uniforme'
    ],
    indications: [
      'Tendinopatias (evidência limitada)',
      'Cicatrização de feridas',
      'Contraturas articulares',
      'Pontos-gatilho miofasciais',
      'Calcificações tendinosas (fonoforese)',
      'Edema subagudo',
      'Antes de alongamento (pré-aquecimento)'
    ],
    contraindications: [
      'Sobre áreas de neoplasia',
      'Sobre útero gravídico',
      'Sobre medula espinal exposta',
      'Infecção ativa',
      'Trombose venosa profunda',
      'Sobre olhos, testículos, coração',
      'Sobre placas epifisárias em crianças',
      'Sobre implantes metálicos (relativa)'
    ],
    applicationProtocol: [
      'Selecionar frequência conforme profundidade do tecido',
      'Escolher modo (contínuo vs pulsado) conforme fase',
      'Aplicar gel de acoplamento generosamente',
      'Manter cabeçote em movimento circular lento',
      'Velocidade: 4 cm/segundo',
      'Manter contato perpendicular com a pele',
      'Tempo = área (cm²) / ERA x 2'
    ],
    evidence: {
      references: [
        'Miller DL et al. Overview of therapeutic ultrasound applications. J Ultrasound Med. 2012',
        'Robertson VJ et al. Electrotherapy Explained. 4th ed. Butterworth-Heinemann. 2006',
        'Ebadi S et al. Therapeutic ultrasound for chronic low back pain. Cochrane Database. 2014'
      ]
    },
    clinicalApplication: 'A evidência para ultrassom é fraca para muitas indicações. Pode ser útil como pré-aquecimento antes de alongamento ou mobilização. Modo pulsado em fases agudas/subagudas. Mantenha o cabeçote sempre em movimento.',
    relatedTests: [],
    keywords: ['ultrassom', 'US terapêutico', 'ondas sonoras', 'térmico', 'fisioterapia']
  },
  {
    id: 'fonoforese',
    slug: 'fonoforese',
    category: 'recursos-terapeuticos',
    title: 'Fonoforese: Ultrassom com Medicamentos Tópicos',
    metaDescription: 'Fonoforese: técnica de aplicação de medicamentos via ultrassom, substâncias utilizadas, indicações e evidência científica.',
    introduction: 'A fonoforese utiliza o ultrassom para facilitar a penetração de medicamentos tópicos através da pele. O mecanismo envolve alterações na permeabilidade do estrato córneo pela cavitação e efeitos térmicos do ultrassom.',
    mechanism: 'Ultrassom → cavitação estável e aumento de temperatura → aumento da permeabilidade do estrato córneo → facilitação da penetração transdérmica de medicamentos. Profundidade de penetração: 3-5 cm.',
    parameters: [
      'Frequência: 1 MHz ou 3 MHz conforme profundidade',
      'Modo: contínuo ou pulsado',
      'Intensidade: 0.5-1.5 W/cm²',
      'Tempo: 5-10 minutos',
      'Medicamento: gel ou creme com boa transmissão ultrassônica',
      'Verificar transmissividade do produto'
    ],
    indications: [
      'Tendinopatias com inflamação',
      'Bursite',
      'Tenossinovite',
      'Epicondilite',
      'Síndrome do túnel do carpo',
      'Calcificações tendinosas',
      'Condições inflamatórias superficiais'
    ],
    contraindications: [
      'Alergia ao medicamento utilizado',
      'Contraindicações do ultrassom',
      'Pele lesionada',
      'Infecção local',
      'Gestação (medicamentos absorvidos sistemicamente)'
    ],
    applicationProtocol: [
      'Verificar transmissividade do gel/creme medicamentoso',
      'Aplicar camada uniforme do medicamento sobre a área',
      'Selecionar parâmetros de ultrassom adequados',
      'Aplicar ultrassom sobre o medicamento',
      'Manter cabeçote em movimento constante',
      'Não limpar o medicamento após a aplicação',
      'Orientar paciente a não lavar área por 1-2 horas'
    ],
    evidence: {
      references: [
        'Bare AC et al. Phonophoresis versus topical application. Am J Phys Med Rehabil. 1996',
        'Byl NN. The use of ultrasound as an enhancer for transcutaneous drug delivery. Phys Ther. 1995',
        'Saliba S et al. Phonophoresis and the absorption of dexamethasone. Med Sci Sports Exerc. 2007'
      ]
    },
    clinicalApplication: 'A evidência para fonoforese é mista. Verifique sempre a transmissividade do produto - muitos cremes e géis bloqueiam o ultrassom. Diclofenaco gel e dexametasona têm boa transmissão.',
    relatedTests: [],
    keywords: ['fonoforese', 'ultrassom', 'medicamento tópico', 'transdérmico', 'anti-inflamatório']
  },
  // LASER
  {
    id: 'laser-terapeutico',
    slug: 'laser-terapeutico-fotobiomodulacao',
    category: 'recursos-terapeuticos',
    title: 'Laser Terapêutico (Fotobiomodulação): Guia Completo',
    metaDescription: 'Laser terapêutico ou fotobiomodulação: mecanismo de ação, dosimetria, indicações para dor e cicatrização, protocolos clínicos.',
    introduction: 'A fotobiomodulação (FBM), anteriormente conhecida como laser de baixa intensidade (LLLT), utiliza luz vermelha ou infravermelha próxima para modular processos celulares. Promove analgesia, redução de inflamação e aceleração do reparo tecidual.',
    mechanism: 'Absorção de fótons por cromóforos mitocondriais (citocromo c oxidase) → aumento de ATP → modulação de espécies reativas de oxigênio → ativação de fatores de transcrição → síntese de proteínas, proliferação celular, angiogênese, modulação inflamatória.',
    parameters: [
      'Comprimento de onda: 630-680 nm (vermelho), 780-860 nm (infravermelho)',
      'Vermelho: tecidos superficiais, cicatrização',
      'Infravermelho: tecidos profundos, dor, nervos',
      'Potência: 10-500 mW (classe 3B)',
      'Dose: 1-4 J/cm² (feridas), 4-8 J/cm² (dor)',
      'Tempo = Energia desejada (J) / Potência (W)',
      'Técnica: pontual ou varredura'
    ],
    indications: [
      'Tendinopatias e lesões musculares',
      'Osteoartrose de joelho',
      'Lombalgia crônica',
      'Cicatrização de feridas e úlceras',
      'Dor neuropática',
      'Síndrome miofascial',
      'Linfedema (em combinação)',
      'Mucosite oral (pós-quimioterapia)'
    ],
    contraindications: [
      'Diretamente sobre tumor maligno',
      'Sobre os olhos (sem proteção)',
      'Sobre útero gravídico',
      'Hemorragia ativa',
      'Fotossensibilidade (medicamentosa)',
      'Epilepsia (luzes pulsadas)'
    ],
    applicationProtocol: [
      'Calcular dose adequada para condição',
      'Selecionar comprimento de onda',
      'Usar óculos de proteção (paciente e terapeuta)',
      'Limpar área de aplicação',
      'Aplicar perpendicularmente à pele',
      'Técnica pontual: 0.5-1 cm entre pontos',
      'Frequência: 2-3x/semana, 10-15 sessões'
    ],
    evidence: {
      references: [
        'Bjordal JM et al. Low-level laser therapy for tendinopathy. Phys Ther Sport. 2006',
        'Chow RT et al. LLLT for neck pain. Lancet. 2009',
        'Huang YY et al. Biphasic dose response in LLLT. Dose Response. 2009'
      ]
    },
    clinicalApplication: 'A dose é crítica - dose muito alta ou muito baixa reduz eficácia (resposta bifásica). Para dor, use infravermelho com doses de 4-8 J/ponto. Para cicatrização, vermelho com 1-4 J/cm². Consistência nas sessões é importante.',
    relatedTests: [],
    keywords: ['laser', 'fotobiomodulação', 'LLLT', 'luz terapêutica', 'ATP']
  },
  // ONDAS CURTAS
  {
    id: 'ondas-curtas',
    slug: 'ondas-curtas-diatermia',
    category: 'recursos-terapeuticos',
    title: 'Ondas Curtas (Diatermia): Aquecimento Profundo',
    metaDescription: 'Ondas curtas ou diatermia: mecanismo de aquecimento profundo, parâmetros, indicações e contraindicações para fisioterapia.',
    introduction: 'As ondas curtas (diatermia por ondas curtas - DOC) utilizam energia eletromagnética de alta frequência (27.12 MHz) para produzir aquecimento profundo dos tecidos. É a modalidade de aquecimento mais profundo disponível em fisioterapia.',
    mechanism: 'Campo eletromagnético de alta frequência → oscilação de moléculas polares e íons → fricção molecular → produção de calor endógeno. Aquecimento ocorre em tecidos ricos em água e íons (músculos > gordura).',
    parameters: [
      'Frequência: 27.12 MHz (comprimento de onda: 11 metros)',
      'Modo contínuo: efeitos térmicos',
      'Modo pulsado: efeitos atérmicos (redução de inflamação)',
      'Potência contínua: ajustada por sensação térmica',
      'Potência pulsada: 200-1000W pico, duty cycle 10-20%',
      'Tempo: 15-30 minutos',
      'Eletrodos: capacitivos ou indutivos'
    ],
    indications: [
      'Espasmo muscular profundo',
      'Contraturas articulares',
      'Osteoartrose profunda (quadril)',
      'Pré-alongamento de tecidos profundos',
      'Dor lombar crônica',
      'Tendinopatias profundas',
      'Bursite crônica'
    ],
    contraindications: [
      'Implantes metálicos na área',
      'Marca-passo cardíaco',
      'Gestação',
      'Tumores malignos',
      'Tuberculose ativa',
      'Tromboflebite',
      'Áreas isquêmicas',
      'Febre sistêmica',
      'Edema por insuficiência cardíaca',
      'Sobre testículos, olhos'
    ],
    applicationProtocol: [
      'Verificar contraindicações rigorosamente',
      'Remover todos os metais do paciente',
      'Posicionar eletrodos com espaçamento adequado',
      'Colocar toalhas entre eletrodos e pele',
      'Iniciar com potência baixa',
      'Ajustar até sensação de calor moderado (não forte)',
      'Paciente deve relatar qualquer desconforto imediatamente'
    ],
    evidence: {
      references: [
        'Shah SGS et al. Pulsed short-wave diathermy: systematic review. Phys Ther Rev. 2007',
        'Murray CC et al. Short-wave diathermy for soft tissue injuries. Cochrane Database. 2001',
        'Hill J et al. Pulsed short-wave diathermy effects. Arch Phys Med Rehabil. 2002'
      ]
    },
    clinicalApplication: 'A verificação de metais é CRUCIAL - pode causar queimaduras graves. O modo pulsado é preferido para condições subagudas. Sempre pergunte sobre implantes, mesmo os antigos. Ideal antes de alongamento de estruturas profundas.',
    relatedTests: [],
    keywords: ['ondas curtas', 'diatermia', 'aquecimento profundo', 'radiofrequência', 'calor']
  },
  // CRIOTERAPIA
  {
    id: 'crioterapia',
    slug: 'crioterapia-aplicacao-gelo',
    category: 'recursos-terapeuticos',
    title: 'Crioterapia: Técnicas e Aplicação do Frio Terapêutico',
    metaDescription: 'Crioterapia: efeitos fisiológicos do frio, técnicas de aplicação, duração ideal, indicações e contraindicações na fisioterapia.',
    introduction: 'A crioterapia utiliza a aplicação de frio para reduzir temperatura tecidual, produzindo analgesia, redução do metabolismo, vasoconstrição e diminuição do espasmo muscular. É uma das modalidades mais acessíveis e efetivas na fase aguda de lesões.',
    mechanism: 'Redução da temperatura tecidual → diminuição da velocidade de condução nervosa (analgesia) → redução do metabolismo celular → diminuição de demanda de O2 → redução de lesão secundária → vasoconstrição inicial → redução de edema.',
    parameters: [
      'Temperatura: 0-4°C (gelo)',
      'Duração: 15-20 minutos (máximo)',
      'Intervalo: mínimo 1-2 horas entre aplicações',
      'Profundidade: 2-4 cm (depende da técnica)',
      'Métodos: bolsa de gelo, cryo-cuff, imersão, spray',
      'Proteção: toalha fina entre gelo e pele'
    ],
    indications: [
      'Lesões agudas (0-72 horas)',
      'Pós-operatório imediato',
      'Entorses e contusões',
      'Controle de edema',
      'Espasmo muscular agudo',
      'Pré-exercício em lesões crônicas',
      'Bursite aguda',
      'Pós-exercício em reabilitação'
    ],
    contraindications: [
      'Doença de Raynaud',
      'Crioglobulinemia',
      'Hemoglobinúria paroxística ao frio',
      'Hipersensibilidade ao frio',
      'Áreas com comprometimento circulatório',
      'Áreas anestesiadas',
      'Feridas abertas (diretamente)',
      'Sobre nervos superficiais (risco de neuropraxia)'
    ],
    applicationProtocol: [
      'Verificar contraindicações',
      'Explicar sensações esperadas (frio, queimação, dor, dormência)',
      'Aplicar barreira fina (toalha) se necessário',
      'Posicionar bolsa de gelo moldando à área',
      'Manter por 15-20 minutos',
      'Verificar a cada 5 minutos',
      'Interromper se: dor intensa, manchas brancas, dormência excessiva'
    ],
    evidence: {
      references: [
        'Bleakley CM et al. The use of ice in the treatment of acute soft-tissue injury. Am J Sports Med. 2004',
        'Collins NC. Is ice right? Does cryotherapy improve outcomes? Emerg Med J. 2008',
        'Malanga GA et al. Mechanisms and efficacy of heat and cold therapies. Postgrad Med. 2015'
      ]
    },
    clinicalApplication: 'Mais efetiva nas primeiras 24-48h pós-lesão. Duração de 15-20 min é ideal - mais tempo aumenta risco de queimadura de frio. Observe o PRICE/PEACE & LOVE. Em lesões crônicas, pode ser usada pré-exercício.',
    relatedTests: [],
    keywords: ['crioterapia', 'gelo', 'frio', 'RICE', 'lesão aguda']
  },
  // TERMOTERAPIA
  {
    id: 'termoterapia',
    slug: 'termoterapia-calor-superficial',
    category: 'recursos-terapeuticos',
    title: 'Termoterapia: Aplicação de Calor Superficial',
    metaDescription: 'Termoterapia superficial: bolsa térmica, infravermelho, parafina - efeitos fisiológicos, indicações e técnicas de aplicação.',
    introduction: 'A termoterapia superficial utiliza diferentes fontes de calor (condução, convecção, radiação) para elevar a temperatura dos tecidos superficiais (até 1-2 cm). Promove vasodilatação, relaxamento muscular e redução da dor.',
    mechanism: 'Aumento de temperatura tecidual → vasodilatação → aumento do fluxo sanguíneo → aumento da extensibilidade de colágeno → redução da rigidez articular → diminuição do espasmo muscular → modulação da dor (teoria das comportas).',
    parameters: [
      'Temperatura: 40-45°C (tolerância individual)',
      'Duração: 15-30 minutos',
      'Bolsa térmica: condução, aquecimento moderado',
      'Infravermelho: radiação, 50-75 cm de distância',
      'Parafina: imersão ou pincelamento, 52-54°C',
      'Turbilhão: convecção, 37-40°C'
    ],
    indications: [
      'Espasmo muscular crônico',
      'Rigidez articular (antes de mobilização)',
      'Osteoartrose (fase crônica)',
      'Dor miofascial',
      'Antes de exercícios de alongamento',
      'Contraturas de tecidos moles',
      'Artrite (fase crônica)',
      'Alívio sintomático de dor crônica'
    ],
    contraindications: [
      'Inflamação aguda',
      'Hemorragia ou edema agudo',
      'Tromboflebite',
      'Áreas com comprometimento circulatório',
      'Áreas anestesiadas',
      'Tumores malignos',
      'Infecção ativa',
      'Dermatite ou lesões de pele'
    ],
    applicationProtocol: [
      'Verificar sensibilidade térmica do paciente',
      'Proteger área com toalha fina se necessário',
      'Aplicar fonte de calor',
      'Manter temperatura confortável (calor moderado)',
      'Duração: 15-30 minutos',
      'Verificar pele periodicamente',
      'Combinar com alongamento ou mobilização após'
    ],
    evidence: {
      references: [
        'Malanga GA et al. Mechanisms and efficacy of heat and cold therapies. Postgrad Med. 2015',
        'French SD et al. Superficial heat or cold for low back pain. Cochrane Database. 2006',
        'Nadler SF et al. The physiologic basis of thermotherapy. Am J Phys Med Rehabil. 2004'
      ]
    },
    clinicalApplication: 'O calor superficial é ideal como preparação para alongamento ou mobilização articular. Evite em inflamação aguda. Combine com exercícios para maximizar ganho de amplitude. Profundidade limitada a 1-2 cm.',
    relatedTests: [],
    keywords: ['termoterapia', 'calor', 'bolsa térmica', 'infravermelho', 'parafina']
  },
  // TERAPIA COMBINADA
  {
    id: 'terapia-combinada',
    slug: 'terapia-combinada-us-corrente',
    category: 'recursos-terapeuticos',
    title: 'Terapia Combinada: Ultrassom + Corrente Elétrica',
    metaDescription: 'Terapia combinada: aplicação simultânea de ultrassom e corrente elétrica, sinergismo dos efeitos, indicações e protocolo.',
    introduction: 'A terapia combinada aplica simultaneamente ultrassom terapêutico e corrente elétrica (geralmente interferencial ou TENS) através do mesmo cabeçote. Os efeitos são potencializados pelo sinergismo das duas modalidades.',
    mechanism: 'Ultrassom: cavitação, efeitos térmicos/não-térmicos. Corrente elétrica: analgesia, estimulação muscular. Sinergismo: ultrassom aumenta a permeabilidade tecidual, facilitando a penetração da corrente. Efeito analgésico potencializado.',
    parameters: [
      'Ultrassom: 1 ou 3 MHz conforme profundidade',
      'Intensidade US: 0.5-1.5 W/cm²',
      'Corrente: TENS (50-100 Hz) ou Interferencial',
      'Intensidade corrente: sensitiva ou motora',
      'Modo: pulsado ou contínuo',
      'Tempo: 5-10 minutos por área'
    ],
    indications: [
      'Pontos-gatilho miofasciais',
      'Tendinopatias crônicas',
      'Calcificações tendinosas',
      'Aderências e fibroses',
      'Cicatrizes dolorosas',
      'Dor musculoesquelética crônica',
      'Quando se deseja potencializar efeitos'
    ],
    contraindications: [
      'Contraindicações do ultrassom',
      'Contraindicações da corrente elétrica',
      'Marca-passo (relativa)',
      'Gestação',
      'Implantes metálicos superficiais'
    ],
    applicationProtocol: [
      'Selecionar parâmetros de ultrassom',
      'Configurar corrente elétrica no aparelho',
      'Aplicar gel de acoplamento condutor',
      'Posicionar eletrodo dispersivo (se necessário)',
      'Aumentar intensidade da corrente até nível desejado',
      'Aplicar ultrassom em movimento sobre a área',
      'Manter contato constante do cabeçote'
    ],
    evidence: {
      references: [
        'Ward AR et al. Electrical stimulation and therapeutic ultrasound in physical therapy. Elsevier. 2010',
        'Low J et al. Electrotherapy Explained. Butterworth-Heinemann. 2006',
        'Kitchen S et al. Electrotherapy: Evidence-based Practice. Churchill Livingstone. 2002'
      ]
    },
    clinicalApplication: 'A terapia combinada é útil quando se deseja potencializar analgesia e efeitos de reparo. Particularmente indicada para pontos-gatilho e fibroses. A evidência específica é limitada, mas baseia-se na combinação de evidências individuais.',
    relatedTests: [],
    keywords: ['terapia combinada', 'ultrassom', 'corrente', 'sinergismo', 'fisioterapia']
  },
  // TÉCNICAS MANUAIS
  {
    id: 'liberacao-miofascial',
    slug: 'liberacao-miofascial',
    category: 'recursos-terapeuticos',
    title: 'Liberação Miofascial: Técnicas e Aplicação',
    metaDescription: 'Liberação miofascial: técnicas de tratamento do sistema fascial, indicações, contraindicações e evidência científica.',
    introduction: 'A liberação miofascial engloba técnicas manuais que visam restaurar a mobilidade e função do sistema fascial. Inclui técnicas diretas (pressão sustentada) e indiretas (acompanhamento da restrição) para tratar restrições fasciais e pontos-gatilho.',
    mechanism: 'Pressão mecânica sustentada → deformação viscoelástica da fáscia → liberação de aderências → restauração do deslizamento fascial → ativação de mecanorreceptores → modulação da dor → normalização do tônus muscular.',
    parameters: [
      'Pressão: moderada a profunda (tolerância do paciente)',
      'Duração: 90-120 segundos por ponto (liberação sustentada)',
      'Direção: perpendicular às fibras ou seguindo restrição',
      'Técnicas: compressão isquêmica, deslizamento profundo',
      'Ferramentas: mãos, cotovelo, instrumentos (IASTM)',
      'Frequência: 1-2x/semana'
    ],
    indications: [
      'Síndrome miofascial',
      'Pontos-gatilho ativos',
      'Restrições de mobilidade',
      'Aderências pós-cirúrgicas',
      'Tensão muscular crônica',
      'Fibromialgia (cuidado)',
      'Lombalgias e cervicalgias'
    ],
    contraindications: [
      'Infecção local',
      'Celulite',
      'Fraturas não consolidadas',
      'Trombose venosa profunda',
      'Lesões cutâneas',
      'Tumores malignos',
      'Uso de anticoagulantes (cuidado)'
    ],
    applicationProtocol: [
      'Identificar área de restrição por palpação',
      'Posicionar paciente confortavelmente',
      'Aplicar pressão gradual até barreira tecidual',
      'Manter pressão por 90-120 segundos',
      'Aguardar liberação (sensação de "derretimento")',
      'Progredir para próxima barreira',
      'Finalizar com movimento ativo'
    ],
    evidence: {
      references: [
        'Ajimsha MS et al. Effectiveness of myofascial release. J Bodyw Mov Ther. 2015',
        'McKenney K et al. Myofascial release as treatment for orthopedic conditions. J Man Manip Ther. 2013',
        'Laimi K et al. Effectiveness of myofascial release in treatment of chronic musculoskeletal pain. J Bodyw Mov Ther. 2017'
      ]
    },
    clinicalApplication: 'A pressão deve ser sustentada por tempo suficiente para permitir mudanças viscoelásticas (90-120s). Combine com exercícios ativos após para consolidar ganhos. A comunicação com o paciente sobre dor é essencial.',
    relatedTests: [],
    keywords: ['liberação miofascial', 'fáscia', 'pontos-gatilho', 'terapia manual', 'miofascial']
  },
  {
    id: 'mobilizacao-articular',
    slug: 'mobilizacao-articular-maitland',
    category: 'recursos-terapeuticos',
    title: 'Mobilização Articular: Conceito Maitland',
    metaDescription: 'Mobilização articular segundo Maitland: graus de movimento, técnicas oscilatórias, indicações para dor e rigidez.',
    introduction: 'A mobilização articular segundo Maitland utiliza movimentos oscilatórios passivos de baixa velocidade aplicados às articulações para restaurar amplitude de movimento e reduzir dor. Os graus são selecionados conforme o objetivo (dor vs. rigidez).',
    mechanism: 'Oscilações rítmicas → estimulação de mecanorreceptores → inibição de nociceptores → modulação da dor (graus I-II). Movimento até o fim da amplitude → deformação plástica de tecidos → ganho de amplitude (graus III-IV).',
    parameters: [
      'Grau I: pequena amplitude, início da ADM (dor severa)',
      'Grau II: grande amplitude, sem atingir resistência (dor)',
      'Grau III: grande amplitude, até resistência (rigidez com dor)',
      'Grau IV: pequena amplitude, no fim da ADM (rigidez)',
      'Grau V: thrust de alta velocidade (manipulação)',
      'Frequência: 1-3 oscilações/segundo',
      'Duração: 30-60 segundos por série'
    ],
    indications: [
      'Hipomobilidade articular',
      'Dor articular',
      'Rigidez pós-imobilização',
      'Osteoartrose',
      'Cervicalgias e lombalgias',
      'Restrições capsulares',
      'Disfunções segmentares vertebrais'
    ],
    contraindications: [
      'Instabilidade articular',
      'Fratura não consolidada',
      'Neoplasia',
      'Infecção articular',
      'Artrite inflamatória aguda',
      'Osteoporose severa',
      'Síndrome da cauda equina (coluna)'
    ],
    applicationProtocol: [
      'Avaliar comportamento da dor e amplitude',
      'Selecionar grau baseado em dor vs. rigidez',
      'Posicionar paciente e estabilizar segmento',
      'Localizar mão no segmento a ser mobilizado',
      'Aplicar movimento oscilatório rítmico',
      'Manter por 30-60 segundos',
      'Reavaliar dor e amplitude',
      'Progredir grau conforme resposta'
    ],
    evidence: {
      references: [
        'Maitland GD et al. Maitland\'s Vertebral Manipulation. Elsevier. 2013',
        'Gross A et al. Manipulation and mobilisation for neck pain. Cochrane Database. 2015',
        'Hidalgo B et al. The efficacy of manual therapy and exercise for spinal disorders. Spine. 2014'
      ]
    },
    clinicalApplication: 'Selecione graus I-II quando a dor é o fator limitante. Use graus III-IV quando a rigidez limita a amplitude. Reavalie após cada série para ajustar o grau. Combine com exercícios ativos para manutenção dos ganhos.',
    relatedTests: [],
    keywords: ['mobilização articular', 'Maitland', 'terapia manual', 'graus de movimento', 'oscilação']
  },
  {
    id: 'manipulacao-vertebral',
    slug: 'manipulacao-vertebral-thrust',
    category: 'recursos-terapeuticos',
    title: 'Manipulação Vertebral (Thrust): Indicações e Técnica',
    metaDescription: 'Manipulação vertebral de alta velocidade: mecanismo do thrust, indicações, contraindicações e regras de predição clínica.',
    introduction: 'A manipulação vertebral utiliza um thrust de alta velocidade e baixa amplitude (HVLA) no fim da amplitude articular. Produz a cavitação articular (estalo) e efeitos neurofisiológicos de alívio rápido da dor e aumento da mobilidade.',
    mechanism: 'Thrust HVLA → separação rápida das superfícies articulares → cavitação (estalo) → liberação de gás sinovial. Efeitos neurofisiológicos: inibição de neurônios motores → relaxamento muscular reflexo → modulação da dor via descendente.',
    parameters: [
      'Velocidade: alta (rápido)',
      'Amplitude: baixa (pequena)',
      'Direção: específica à disfunção',
      'Pré-carga: posicionamento até barreira',
      'Thrust: impulso único, rápido, controlado',
      'Força: mínima necessária para cavitação'
    ],
    indications: [
      'Lombalgia mecânica aguda (regra de predição)',
      'Cervicalgia mecânica',
      'Dor torácica de origem articular',
      'Cefaleia cervicogênica',
      'Hipomobilidade segmentar',
      'Quando mobilização não produz resultado'
    ],
    contraindications: [
      'Instabilidade ligamentar',
      'Fratura ou risco de fratura',
      'Neoplasia vertebral',
      'Infecção vertebral',
      'Síndrome da cauda equina',
      'Mielopatia cervical',
      'Artéria vertebral comprometida (cervical)',
      'Osteoporose severa',
      'Uso de anticoagulantes',
      'Artrite inflamatória ativa'
    ],
    applicationProtocol: [
      'Screening rigoroso de contraindicações',
      'Testes de artéria vertebral se cervical',
      'Posicionar paciente e localizar segmento',
      'Aplicar slack (pré-carga) até barreira',
      'Aplicar thrust rápido e controlado',
      'Amplitude mínima para cavitação',
      'Reavaliar imediatamente após',
      'Educar sobre reações pós-manipulação'
    ],
    evidence: {
      references: [
        'Flynn T et al. A clinical prediction rule for classifying patients with LBP who respond to manipulation. Spine. 2002',
        'Cleland JA et al. Development of clinical prediction rule for cervical manipulation. Spine. 2007',
        'Rubinstein SM et al. Spinal manipulative therapy for low back pain. Cochrane Database. 2019'
      ]
    },
    clinicalApplication: 'Use regras de predição clínica para identificar pacientes com maior probabilidade de resposta. Lombalgia: duração <16 dias, sem sintomas abaixo do joelho, hipomobilidade lombar, rotação interna de quadril >35°. Screening rigoroso antes de manipulação cervical.',
    relatedTests: [],
    keywords: ['manipulação', 'thrust', 'HVLA', 'coluna', 'terapia manual']
  },
  // EXERCÍCIOS TERAPÊUTICOS
  {
    id: 'exercicio-excentrico',
    slug: 'exercicio-excentrico-tendinopatia',
    category: 'recursos-terapeuticos',
    title: 'Exercício Excêntrico para Tendinopatias: Protocolo Completo',
    metaDescription: 'Exercício excêntrico para tendinopatia: mecanismo de ação, protocolos Alfredson e Stanish, progressão e evidência científica.',
    introduction: 'O exercício excêntrico (alongamento ativo do músculo sob carga) é o tratamento de primeira linha para tendinopatias crônicas. Promove remodelamento do tendão, síntese de colágeno tipo I e realinhamento das fibras tendinosas.',
    mechanism: 'Carga excêntrica → estímulo mecânico aos tenócitos → síntese de colágeno tipo I → remodelamento da matriz extracelular → realinhamento das fibras → normalização da estrutura tendinosa. Também modula neovascularização e inervação patológica.',
    parameters: [
      'Protocolo Alfredson (Aquiles): 3x15 repetições, 2x/dia, 12 semanas',
      'Velocidade: lenta na fase excêntrica (3-5 segundos)',
      'Fase concêntrica: usar lado não afetado ou auxílio',
      'Progressão de carga: mochila com peso, máquina',
      'Dor moderada aceitável durante exercício (3-5/10)',
      'Sem aquecimento prévio necessário'
    ],
    indications: [
      'Tendinopatia do tendão de Aquiles',
      'Tendinopatia patelar',
      'Epicondilite lateral (cotovelo de tenista)',
      'Tendinopatia do manguito rotador',
      'Tendinopatias crônicas (>3 meses)',
      'Falha de outros tratamentos conservadores'
    ],
    contraindications: [
      'Ruptura tendínea parcial significativa',
      'Fase aguda da lesão (<2 semanas)',
      'Infecção local',
      'Artrite inflamatória ativa',
      'Dor severa que impede execução'
    ],
    applicationProtocol: [
      'Avaliar e confirmar diagnóstico de tendinopatia',
      'Educar sobre dor aceitável durante exercício',
      'Demonstrar técnica correta',
      'Iniciar sem carga adicional',
      'Progressão quando dor <3/10 durante exercício',
      'Manter mesmo com dor moderada (3-5/10)',
      'Duração: mínimo 12 semanas',
      'Reavaliar a cada 4 semanas'
    ],
    evidence: {
      references: [
        'Alfredson H et al. Heavy-load eccentric calf muscle training for Achilles tendinosis. Am J Sports Med. 1998',
        'Malliaras P et al. Patellar tendinopathy: clinical diagnosis, load management, and advice. J Orthop Sports Phys Ther. 2015',
        'Beyer R et al. Heavy slow resistance versus eccentric training for Achilles tendinopathy. Am J Sports Med. 2015'
      ]
    },
    clinicalApplication: 'A dor durante o exercício é aceitável e esperada - eduque o paciente sobre isso. A adesão por 12 semanas é crucial. Heavy Slow Resistance (HSR) é alternativa com resultados semelhantes e melhor satisfação do paciente.',
    relatedTests: [],
    keywords: ['excêntrico', 'tendinopatia', 'Alfredson', 'tendão', 'fortalecimento']
  },
  {
    id: 'estabilizacao-lombar',
    slug: 'estabilizacao-lombopelvica',
    category: 'recursos-terapeuticos',
    title: 'Estabilização Lombopélvica: Exercícios de Core',
    metaDescription: 'Estabilização lombopélvica: ativação de transverso e multífidos, progressão de exercícios, indicações para lombalgia.',
    introduction: 'Os exercícios de estabilização lombopélvica visam restaurar o controle motor dos músculos estabilizadores locais (transverso do abdome, multífidos) e globais, que frequentemente apresentam disfunção em pacientes com lombalgia.',
    mechanism: 'Ativação dos estabilizadores locais → co-contração transverso + multífidos → aumento da rigidez segmentar → proteção de estruturas passivas → controle do movimento neutro → redistribuição de cargas → redução do estresse em estruturas dolorosas.',
    parameters: [
      'Fase 1: consciência e ativação (abdominal drawing-in)',
      'Fase 2: controle estático (posições básicas)',
      'Fase 3: controle dinâmico (movimentos de extremidades)',
      'Fase 4: integração funcional (tarefas específicas)',
      'Contração: 30-40% da máxima, manter respiração',
      'Repetições: 10x, manter 10 segundos, evoluir'
    ],
    indications: [
      'Lombalgia mecânica crônica',
      'Instabilidade lombar funcional',
      'Pós-cirurgia de coluna',
      'Hérnia discal (após fase aguda)',
      'Espondilolistese',
      'Disfunção sacroilíaca',
      'Prevenção de recorrência de lombalgia'
    ],
    contraindications: [
      'Dor aguda severa',
      'Síndrome da cauda equina',
      'Instabilidade vertebral verdadeira',
      'Fratura vertebral recente',
      'Infecção vertebral'
    ],
    applicationProtocol: [
      'Avaliar padrão de recrutamento muscular',
      'Ensinar posição neutra da coluna',
      'Treinar abdominal drawing-in (isolado)',
      'Usar biofeedback (pressão) se disponível',
      'Progredir para posições antigravitacionais',
      'Adicionar movimentos de extremidades mantendo neutro',
      'Integrar em atividades funcionais',
      'Manutenção: exercícios regulares a longo prazo'
    ],
    evidence: {
      references: [
        'Hodges PW et al. Inefficient muscular stabilization of the lumbar spine with low back pain. Spine. 1996',
        'Macedo LG et al. Motor control exercise for chronic low back pain. Cochrane Database. 2016',
        'Saragiotto BT et al. Motor control exercise for chronic nonspecific low back pain. Cochrane Database. 2016'
      ]
    },
    clinicalApplication: 'Evidência moderada para lombalgia crônica, similar a outros exercícios. A individualização baseada em avaliação de controle motor pode melhorar resultados. Combine com exercício aeróbico e educação para efeito máximo.',
    relatedTests: [],
    keywords: ['estabilização', 'core', 'transverso', 'multífidos', 'lombalgia']
  },
  {
    id: 'exercicio-aerobico',
    slug: 'exercicio-aerobico-dor-cronica',
    category: 'recursos-terapeuticos',
    title: 'Exercício Aeróbico para Dor Crônica: Prescrição',
    metaDescription: 'Exercício aeróbico para dor crônica: efeitos analgésicos, prescrição FITT, tipos de exercício e evidência científica.',
    introduction: 'O exercício aeróbico regular produz efeitos analgésicos sistêmicos através da ativação do sistema opioide endógeno e modulação do sistema nervoso central. É uma intervenção de primeira linha para condições de dor crônica como fibromialgia e lombalgia.',
    mechanism: 'Exercício aeróbico → liberação de β-endorfina → modulação de vias descendentes inibitórias → analgesia endógena. Também reduz inflamação sistêmica, melhora sono, humor e autoeficácia, todos fatores que modulam a dor crônica.',
    parameters: [
      'Frequência: 3-5x/semana',
      'Intensidade: moderada (60-70% FCmáx ou Borg 12-14)',
      'Tempo: 20-60 minutos por sessão',
      'Tipo: caminhada, bicicleta, natação, hidroginástica',
      'Progressão: aumentar 10% por semana',
      'Pacing: respeitar limites, evitar boom-bust'
    ],
    indications: [
      'Fibromialgia',
      'Lombalgia crônica',
      'Osteoartrose',
      'Dor musculoesquelética crônica',
      'Síndrome da fadiga crônica',
      'Artrite reumatoide (estável)',
      'Condições de dor generalizada'
    ],
    contraindications: [
      'Doença cardiovascular não controlada',
      'Hipertensão não controlada',
      'Diabetes descompensado',
      'Infecção aguda',
      'Exacerbação aguda de artrite inflamatória',
      'Fratura não consolidada'
    ],
    applicationProtocol: [
      'Avaliação de capacidade funcional inicial',
      'Identificar atividade preferida do paciente',
      'Iniciar abaixo da capacidade atual',
      'Progressão gradual (10%/semana)',
      'Educar sobre pacing e boom-bust',
      'Monitorar sintomas nas primeiras semanas',
      'Ajustar conforme resposta',
      'Meta: atingir recomendações de saúde pública'
    ],
    evidence: {
      references: [
        'Geneen LJ et al. Physical activity and exercise for chronic pain. Cochrane Database. 2017',
        'Busch AJ et al. Exercise for fibromyalgia. Cochrane Database. 2007',
        'Hayden JA et al. Exercise therapy for chronic low back pain. Cochrane Database. 2005'
      ]
    },
    clinicalApplication: 'A atividade deve ser do interesse do paciente para garantir adesão. Inicie abaixo da capacidade para evitar exacerbação. O conceito de pacing é crucial - evite dias de alta atividade seguidos de dias de repouso total.',
    relatedTests: [],
    keywords: ['exercício aeróbico', 'dor crônica', 'endorfinas', 'fibromialgia', 'atividade física']
  },
  // HIDROTERAPIA
  {
    id: 'hidroterapia',
    slug: 'hidroterapia-fisioterapia-aquatica',
    category: 'recursos-terapeuticos',
    title: 'Hidroterapia: Princípios e Aplicação Clínica',
    metaDescription: 'Hidroterapia ou fisioterapia aquática: princípios físicos da água, efeitos terapêuticos, indicações e programas de exercícios.',
    introduction: 'A hidroterapia utiliza as propriedades físicas da água (empuxo, pressão hidrostática, resistência, temperatura) para facilitar exercícios terapêuticos. É especialmente útil para pacientes com dificuldade de exercício em solo.',
    mechanism: 'Empuxo: redução do peso corporal aparente (descarga articular). Pressão hidrostática: suporte para edema, estímulo proprioceptivo. Resistência: fortalecimento em todas as direções. Temperatura: efeitos térmicos (relaxamento, analgesia).',
    parameters: [
      'Temperatura: 33-36°C (terapêutica), 28-32°C (exercício)',
      'Profundidade: até xifóide (70-80% de redução de peso)',
      'Duração: 30-60 minutos por sessão',
      'Frequência: 2-3x/semana',
      'Equipamentos: flutuadores, resistência, plataformas',
      'Métodos: Bad Ragaz, Halliwick, Watsu'
    ],
    indications: [
      'Osteoartrose (especialmente quadril e joelho)',
      'Artrite reumatoide (fase crônica)',
      'Lombalgia crônica',
      'Fibromialgia',
      'Pós-operatório ortopédico',
      'Condições neurológicas (AVE, EM, Parkinson)',
      'Obesidade (início de programa de exercícios)',
      'Gestantes (dor lombar, edema)'
    ],
    contraindications: [
      'Incontinência urinária/fecal não controlada',
      'Infecções de pele ou feridas abertas',
      'Trombose venosa profunda',
      'Insuficiência cardíaca descompensada',
      'Epilepsia não controlada',
      'Medo intenso de água',
      'Pressão arterial muito elevada'
    ],
    applicationProtocol: [
      'Avaliação de contraindicações e precauções',
      'Orientação sobre ambiente e segurança',
      'Aquecimento gradual na água',
      'Exercícios de mobilidade em descarga',
      'Exercícios de fortalecimento com resistência da água',
      'Marcha e exercícios funcionais',
      'Relaxamento ao final',
      'Progressão: reduzir profundidade, aumentar velocidade'
    ],
    evidence: {
      references: [
        'Batterham SI et al. Aquatic exercise for osteoarthritis. Phys Ther. 2011',
        'Bartels EM et al. Aquatic exercise for osteoarthritis of hip and knee. Cochrane Database. 2016',
        'Bidonde J et al. Aquatic exercise for fibromyalgia. Cochrane Database. 2014'
      ]
    },
    clinicalApplication: 'Ideal para pacientes que não toleram exercício em solo (obesidade, artrose severa). A descarga articular permite exercícios que seriam dolorosos ou impossíveis fora da água. Progressão: aumentar velocidade, reduzir profundidade.',
    relatedTests: [],
    keywords: ['hidroterapia', 'piscina', 'aquático', 'empuxo', 'fisioterapia']
  },
  // BANDAGEM
  {
    id: 'kinesio-taping',
    slug: 'kinesio-taping-bandagem-elastica',
    category: 'recursos-terapeuticos',
    title: 'Kinesio Taping: Técnicas e Aplicações Clínicas',
    metaDescription: 'Kinesio Taping ou bandagem elástica: técnicas de aplicação, tensões, indicações clínicas e evidência científica.',
    introduction: 'O Kinesio Taping utiliza uma bandagem elástica aplicada sobre a pele para produzir efeitos sobre a função muscular, circulação, dor e propriocepção. Os mecanismos propostos incluem estimulação de mecanorreceptores e efeito de elevação da pele (convoluções).',
    mechanism: 'Elevação da pele (convoluções) → redução de pressão sobre mecanorreceptores → modulação da dor. Estímulo cutâneo → facilitação ou inibição muscular. Melhora da circulação linfática através das convoluções. Estímulo proprioceptivo.',
    parameters: [
      'Tensão muscular: papel-off (0%), 15-25% (facilitação), 15-35% (inibição)',
      'Tensão ligamentar/correção: 50-100%',
      'Tensão linfática: 0-15%',
      'Técnica I: faixa única',
      'Técnica Y: bifurcação para músculos',
      'Técnica X: cruzamento sobre articulação',
      'Duração: 3-5 dias por aplicação'
    ],
    indications: [
      'Dor musculoesquelética',
      'Edema e linfedema',
      'Facilitação muscular',
      'Inibição muscular',
      'Correção postural',
      'Suporte articular',
      'Cicatrizes',
      'Complemento à reabilitação'
    ],
    contraindications: [
      'Alergia ao adesivo',
      'Pele fragilizada ou lesionada',
      'Trombose venosa profunda',
      'Neoplasia (sobre a área)',
      'Diabetes com neuropatia periférica',
      'Infecção de pele'
    ],
    applicationProtocol: [
      'Preparar pele (limpa, seca, sem pelos)',
      'Cortar bandagem no formato desejado',
      'Arredondar cantos para evitar descolamento',
      'Aplicar âncoras SEM tensão',
      'Aplicar parte terapêutica COM tensão desejada',
      'Friccionar para ativar adesivo',
      'Orientar: evitar molhar nas primeiras 30 min',
      'Remover se coceira ou reação'
    ],
    evidence: {
      references: [
        'Parreira PC et al. Kinesio taping for musculoskeletal conditions. J Physiother. 2014',
        'Morris D et al. Effects of Kinesio Taping on pain. Physiother Theory Pract. 2013',
        'Mostafavifar M et al. A systematic review of Kinesio Taping. Phys Sportsmed. 2012'
      ]
    },
    clinicalApplication: 'A evidência para Kinesio Taping é geralmente fraca a moderada. Pode ter efeitos de curto prazo sobre dor. Use como adjuvante, não como tratamento principal. A técnica correta de aplicação é importante para resultados.',
    relatedTests: [],
    keywords: ['Kinesio Taping', 'bandagem', 'tape', 'elástica', 'fisioterapia']
  },
  {
    id: 'taping-rigido',
    slug: 'taping-rigido-estabilizacao',
    category: 'recursos-terapeuticos',
    title: 'Taping Rígido: Técnicas de Estabilização Articular',
    metaDescription: 'Taping rígido ou bandagem funcional: técnicas para estabilização de tornozelo, joelho, ombro, punho e aplicação preventiva.',
    introduction: 'O taping rígido (athletic tape) é uma bandagem não elástica utilizada para estabilização articular mecânica. Limita movimentos em amplitudes de risco e fornece suporte durante atividades esportivas ou reabilitação.',
    mechanism: 'Restrição mecânica de movimento → limitação de amplitudes extremas → proteção de estruturas lesionadas. Estímulo proprioceptivo → feedback sensorial aumentado → melhora do controle motor. Suporte psicológico e confiança.',
    parameters: [
      'Material: fita rígida (athletic tape) 3.8 cm ou 5 cm',
      'Pré-tape: proteção de pele (underwrap)',
      'Âncoras: fitas circulares de fixação',
      'Estribos e figuras de 8: estabilização',
      'Lock strips: fechamento',
      'Tensão: firme, sem comprometer circulação',
      'Duração: apenas durante atividade'
    ],
    indications: [
      'Instabilidade de tornozelo (retorno ao esporte)',
      'Entorse de tornozelo (proteção)',
      'Instabilidade patelar',
      'Lesão de LCM do joelho',
      'Instabilidade de ombro',
      'Lesões de punho e polegar',
      'Proteção preventiva em atletas'
    ],
    contraindications: [
      'Alergia ao adesivo',
      'Comprometimento circulatório',
      'Lesões de pele',
      'Fratura não consolidada',
      'Edema agudo significativo'
    ],
    applicationProtocol: [
      'Posicionar articulação na posição desejada',
      'Aplicar spray adesivo ou pré-tape',
      'Colocar âncoras proximais e distais',
      'Aplicar estribos e reforços conforme técnica',
      'Verificar circulação e sensibilidade',
      'Testar função e estabilidade',
      'Remover imediatamente após atividade',
      'Cuidados com pele entre aplicações'
    ],
    evidence: {
      references: [
        'Hubbard TJ et al. Ankle sprain: pathophysiology, predisposing factors, and management. Open Access J Sports Med. 2010',
        'Mickel TJ et al. Prophylactic bracing versus taping. Am J Sports Med. 2006',
        'Verhagen EA et al. Ankle sprains incidence with tape. Sports Med. 2000'
      ]
    },
    clinicalApplication: 'O taping rígido fornece restrição mecânica real, diferente do Kinesio Tape. Efetivo para prevenção de entorse de tornozelo em atletas com história prévia. Órteses funcionais podem ser alternativa mais prática a longo prazo.',
    relatedTests: [],
    keywords: ['taping rígido', 'bandagem funcional', 'tornozelo', 'estabilização', 'esporte']
  }
];
