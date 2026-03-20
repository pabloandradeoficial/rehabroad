import { ClinicalPage } from './types';

export const patologias: ClinicalPage[] = [
  // COLUNA CERVICAL
  {
    id: 'cervicalgia',
    slug: 'cervicalgia',
    category: 'patologias',
    title: 'Cervicalgia: Diagnóstico e Tratamento Fisioterapêutico',
    metaDescription: 'Cervicalgia: causas, diagnóstico diferencial e tratamento fisioterapêutico baseado em evidência. Guia completo para fisioterapeutas.',
    introduction: 'A cervicalgia é uma das queixas musculoesqueléticas mais comuns, afetando até 70% da população em algum momento da vida. Caracteriza-se por dor na região cervical, podendo ou não irradiar para membros superiores.',
    epidemiology: 'Prevalência pontual de 10-20% na população adulta. Mais comum em mulheres (1.5:1). Pico de incidência entre 35-49 anos. Fatores de risco: trabalho sedentário, uso de computador, estresse psicológico.',
    etiology: [
      'Disfunção mecânica/postural (mais comum)',
      'Degeneração discal e facetária',
      'Radiculopatia cervical',
      'Síndrome miofascial',
      'Whiplash (chicote cervical)',
      'Estenose cervical'
    ],
    clinicalPresentation: [
      'Dor localizada na região cervical posterior',
      'Rigidez e limitação de amplitude de movimento',
      'Cefaleia cervicogênica associada',
      'Possível irradiação para ombros e escápulas',
      'Parestesias em membros superiores (se radiculopatia)',
      'Pontos-gatilho em trapézio, elevador da escápula, escalenos'
    ],
    diagnosis: [
      'História clínica detalhada (início, fatores de piora/melhora)',
      'Avaliação postural e de amplitude de movimento',
      'Testes neurodinâmicos (Spurling, distração cervical)',
      'Avaliação de força e sensibilidade segmentar',
      'Palpação de estruturas cervicais e musculatura'
    ],
    treatment: {
      conservative: [
        'Educação do paciente sobre prognóstico favorável',
        'Terapia manual (mobilização articular, manipulação)',
        'Exercícios de estabilização cervical profunda',
        'Alongamento de musculatura encurtada',
        'Correção postural e ergonômica',
        'Agulhamento seco para pontos-gatilho',
        'Exercícios aeróbicos de baixo impacto'
      ],
      prognosis: 'Bom prognóstico na maioria dos casos. 50-85% melhoram em 1-3 meses. Cronicidade em 10-15% dos casos.'
    },
    redFlags: [
      'Trauma recente significativo',
      'Déficit neurológico progressivo',
      'Disfagia ou rouquidão',
      'Febre e perda de peso inexplicada',
      'História de câncer',
      'Uso prolongado de corticoides'
    ],
    evidence: {
      references: [
        'Blanpied PR et al. Neck Pain: Revision 2017. Clinical Practice Guidelines. J Orthop Sports Phys Ther. 2017',
        'Gross A et al. Manipulation and mobilisation for neck pain. Cochrane Database Syst Rev. 2015',
        'Jull G et al. Whiplash, Headache, and Neck Pain. Churchill Livingstone. 2008'
      ]
    },
    clinicalApplication: 'A abordagem multimodal (terapia manual + exercícios + educação) apresenta melhores resultados que intervenções isoladas. Priorize exercícios ativos após fase aguda. A classificação em subgrupos (mobilidade, estabilidade, cefaleia) orienta o tratamento.',
    relatedTests: ['teste-de-spurling', 'teste-de-distracao-cervical'],
    keywords: ['cervicalgia', 'dor cervical', 'pescoço', 'coluna cervical', 'fisioterapia']
  },
  {
    id: 'hernia-cervical',
    slug: 'hernia-discal-cervical',
    category: 'patologias',
    title: 'Hérnia Discal Cervical: Avaliação e Reabilitação',
    metaDescription: 'Hérnia discal cervical: fisiopatologia, diagnóstico clínico e protocolo de reabilitação fisioterapêutica baseado em evidência.',
    introduction: 'A hérnia discal cervical resulta do deslocamento do núcleo pulposo através do ânulo fibroso, podendo comprimir raízes nervosas ou medula espinal. Os níveis C5-C6 e C6-C7 são mais frequentemente afetados.',
    epidemiology: 'Incidência anual de 5.5/100.000. Pico entre 30-50 anos. Mais comum em homens. C5-C6 (20%) e C6-C7 (70%) são os níveis mais afetados.',
    etiology: [
      'Degeneração discal progressiva',
      'Trauma agudo ou microtraumas repetitivos',
      'Fatores genéticos (colágeno tipo IX)',
      'Sobrecarga mecânica ocupacional',
      'Tabagismo (redução da nutrição discal)'
    ],
    clinicalPresentation: [
      'Dor cervical com irradiação radicular para membro superior',
      'Parestesias no dermátomo correspondente',
      'Fraqueza muscular no miótomo específico',
      'Hiporreflexia do reflexo correspondente',
      'C5: dor no ombro, fraqueza deltoide, reflexo bicipital',
      'C6: dor em polegar, fraqueza bíceps/extensores punho, reflexo braquiorradial',
      'C7: dor em dedo médio, fraqueza tríceps, reflexo tricipital'
    ],
    diagnosis: [
      'Teste de Spurling positivo',
      'Teste de distração cervical alivia sintomas',
      'Déficit neurológico segmentar',
      'ULTT (Upper Limb Tension Test) positivo',
      'Ressonância magnética confirma diagnóstico'
    ],
    treatment: {
      conservative: [
        'Repouso relativo inicial (evitar atividades que pioram)',
        'Tração cervical manual ou mecânica',
        'Mobilização neural (neurodinâmica)',
        'Exercícios de estabilização cervical',
        'Retração cervical (técnica McKenzie)',
        'TENS para controle de dor',
        'Progressão gradual para exercícios funcionais'
      ],
      surgical: 'Indicada em: déficit neurológico progressivo, mielopatia, dor intratável após 6-12 semanas de tratamento conservador.',
      prognosis: '80-90% melhoram com tratamento conservador em 2-3 meses. A maioria das hérnias regride espontaneamente.'
    },
    redFlags: [
      'Mielopatia cervical (marcha atáxica, Hoffmann positivo)',
      'Déficit motor progressivo',
      'Disfunção esfincteriana',
      'Síndrome de Brown-Séquard'
    ],
    evidence: {
      references: [
        'Bono CM et al. An evidence-based clinical guideline for the diagnosis and treatment of cervical radiculopathy. Spine J. 2011',
        'Thoomes EJ et al. The effectiveness of conservative treatment for patients with cervical radiculopathy. Clin J Pain. 2013',
        'Kuijper B et al. Cervical collar or physiotherapy versus wait and see policy for recent onset cervical radiculopathy. BMJ. 2009'
      ]
    },
    clinicalApplication: 'A tração cervical e mobilização neural são especialmente úteis na radiculopatia. Identifique preferência direcional (McKenzie). A maioria responde bem ao tratamento conservador - evite indicação cirúrgica precoce.',
    relatedTests: ['teste-de-spurling', 'teste-de-distracao-cervical', 'teste-de-tensao-ulnar'],
    keywords: ['hérnia cervical', 'disco cervical', 'radiculopatia cervical', 'cervicobraquialgia', 'fisioterapia']
  },
  // COLUNA LOMBAR
  {
    id: 'lombalgia',
    slug: 'lombalgia-mecanica',
    category: 'patologias',
    title: 'Lombalgia Mecânica: Classificação e Tratamento',
    metaDescription: 'Lombalgia mecânica: classificação em subgrupos, diagnóstico diferencial e abordagem fisioterapêutica baseada em evidência.',
    introduction: 'A lombalgia mecânica ou inespecífica representa 85-90% dos casos de dor lombar. Caracteriza-se pela ausência de patologia estrutural específica identificável e responde bem ao tratamento conservador.',
    epidemiology: 'Prevalência ao longo da vida de 70-85%. Segunda causa mais comum de consulta médica. Pico entre 35-55 anos. Custo socioeconômico elevado por afastamento do trabalho.',
    etiology: [
      'Disfunção articular segmentar',
      'Síndrome miofascial lombar',
      'Instabilidade funcional',
      'Descondicionamento físico',
      'Fatores psicossociais (yellow flags)',
      'Sobrecarga ocupacional ou esportiva'
    ],
    clinicalPresentation: [
      'Dor lombar localizada ou difusa',
      'Sem irradiação abaixo do joelho',
      'Rigidez matinal que melhora com movimento',
      'Dor que piora com posições sustentadas',
      'Limitação funcional variável',
      'Ausência de sinais neurológicos'
    ],
    diagnosis: [
      'Exclusão de causas específicas (red flags)',
      'Avaliação de movimentos repetidos (McKenzie)',
      'Testes de instabilidade segmentar',
      'Avaliação de controle motor lombopélvico',
      'Identificação de yellow flags (fatores psicossociais)'
    ],
    treatment: {
      conservative: [
        'Educação: prognóstico favorável, manter atividade',
        'Exercícios de controle motor (estabilização)',
        'Terapia manual (mobilização, manipulação)',
        'Exercício aeróbico regular',
        'Abordagem cognitivo-comportamental se indicado',
        'Retorno gradual às atividades normais',
        'Tratamento de subgrupo específico (McKenzie, estabilização)'
      ],
      prognosis: '90% melhoram em 6-12 semanas. 10-15% desenvolvem dor crônica. Yellow flags aumentam risco de cronicidade.'
    },
    redFlags: [
      'Trauma significativo',
      'Idade <20 ou >55 anos com primeiro episódio',
      'Dor noturna que não melhora em repouso',
      'Febre, perda de peso',
      'História de câncer',
      'Síndrome da cauda equina'
    ],
    evidence: {
      references: [
        'Delitto A et al. Low Back Pain. Clinical Practice Guidelines. J Orthop Sports Phys Ther. 2012',
        'Foster NE et al. Prevention and treatment of low back pain. Lancet. 2018',
        'Oliveira CB et al. Clinical practice guidelines for the management of non-specific low back pain. Eur Spine J. 2018'
      ]
    },
    clinicalApplication: 'A classificação em subgrupos (manipulação, estabilização, exercício específico, tração) melhora resultados. Evite repouso prolongado. Aborde fatores psicossociais precocemente. Exercício é a intervenção mais suportada por evidência.',
    relatedTests: ['teste-de-lasegue', 'teste-de-kemp', 'teste-de-schober'],
    keywords: ['lombalgia', 'dor lombar', 'coluna lombar', 'lombalgia mecânica', 'fisioterapia']
  },
  {
    id: 'hernia-lombar',
    slug: 'hernia-discal-lombar',
    category: 'patologias',
    title: 'Hérnia Discal Lombar: Diagnóstico e Reabilitação',
    metaDescription: 'Hérnia discal lombar: classificação, diagnóstico clínico, quando operar e protocolo de reabilitação fisioterapêutica.',
    introduction: 'A hérnia discal lombar é o deslocamento do material discal além dos limites do espaço intervertebral, podendo causar compressão radicular. L4-L5 e L5-S1 são os níveis mais afetados.',
    epidemiology: 'Prevalência de hérnia em RM: 30% em assintomáticos >30 anos. Incidência sintomática: 1-2% da população. Pico entre 30-50 anos. Resolução espontânea em muitos casos.',
    etiology: [
      'Degeneração discal (principal)',
      'Carga axial + flexão + rotação',
      'Microtraumas repetitivos',
      'Fatores genéticos',
      'Ocupações com vibração e carga'
    ],
    clinicalPresentation: [
      'Dor lombar com irradiação para membro inferior',
      'Dor que piora com flexão, tosse, Valsalva',
      'Parestesias no dermátomo correspondente',
      'L4: face anterior da coxa, fraqueza quadríceps',
      'L5: face lateral da perna, dorso do pé, fraqueza dorsiflexores',
      'S1: face posterior da perna, planta do pé, fraqueza flexores plantares'
    ],
    diagnosis: [
      'Lasègue positivo (30-70°)',
      'Lasègue cruzado (alta especificidade)',
      'Déficit neurológico segmentar',
      'Teste de Slump positivo',
      'RM apenas se: red flags, falha tratamento conservador, candidato cirúrgico'
    ],
    treatment: {
      conservative: [
        'Educação sobre história natural favorável',
        'Medicação para controle de dor aguda',
        'Extensão repetida se preferência direcional (McKenzie)',
        'Mobilização neural progressiva',
        'Exercícios de estabilização lombopélvica',
        'Retorno gradual às atividades',
        'Evitar flexão lombar sob carga na fase aguda'
      ],
      surgical: 'Indicação: síndrome da cauda equina, déficit motor progressivo, dor intratável após 6-12 semanas. Microdiscectomia é o padrão.',
      prognosis: '80-90% melhoram sem cirurgia em 6-12 semanas. Hérnias extrusas têm maior taxa de reabsorção espontânea.'
    },
    redFlags: [
      'Síndrome da cauda equina (urgência)',
      'Déficit motor progressivo',
      'Retenção urinária ou incontinência',
      'Anestesia em sela'
    ],
    evidence: {
      references: [
        'Kreiner DS et al. An evidence-based clinical guideline for lumbar disc herniation. Spine J. 2014',
        'Chiu CC et al. The probability of spontaneous regression of lumbar herniated disc. Clin Rehabil. 2015',
        'Albert HB et al. The prognosis of disc herniation-related sciatica. Spine. 2013'
      ]
    },
    clinicalApplication: 'A maioria das hérnias regride espontaneamente - eduque o paciente sobre isso. Hérnias extrusas e sequestradas têm MELHOR prognóstico conservador. Evite RM precoce em casos sem red flags.',
    relatedTests: ['teste-de-lasegue', 'teste-de-lasegue-cruzado', 'teste-de-slump'],
    keywords: ['hérnia lombar', 'disco lombar', 'ciática', 'radiculopatia lombar', 'fisioterapia']
  },
  {
    id: 'estenose-lombar',
    slug: 'estenose-do-canal-lombar',
    category: 'patologias',
    title: 'Estenose do Canal Lombar: Avaliação e Manejo',
    metaDescription: 'Estenose do canal lombar: fisiopatologia, diagnóstico diferencial com claudicação vascular e tratamento fisioterapêutico.',
    introduction: 'A estenose do canal lombar é o estreitamento do canal vertebral ou forames, causando compressão de estruturas neurais. É a principal indicação de cirurgia de coluna em maiores de 65 anos.',
    epidemiology: 'Prevalência aumenta com idade: 20% em >60 anos. Principal causa de cirurgia lombar em idosos. Mais comum em mulheres. Associada à osteoartrose facetária.',
    etiology: [
      'Degeneração discal e facetária (mais comum)',
      'Hipertrofia do ligamento amarelo',
      'Espondilolistese degenerativa',
      'Estenose congênita',
      'Osteófitos posteriores'
    ],
    clinicalPresentation: [
      'Claudicação neurogênica: dor em MMII ao caminhar',
      'Alívio com flexão do tronco (sinal do carrinho de compras)',
      'Dor bilateral, difusa, em queimação',
      'Parestesias em MMII',
      'Fraqueza ao caminhar distâncias',
      'Lombalgia associada frequente'
    ],
    diagnosis: [
      'História de claudicação neurogênica',
      'Melhora com flexão, piora com extensão',
      'Two-Stage Treadmill Test',
      'Diferenciação de claudicação vascular',
      'RM ou TC para confirmação'
    ],
    treatment: {
      conservative: [
        'Exercícios em flexão (Williams)',
        'Fortalecimento de core em posições neutras',
        'Treino de marcha modificado',
        'Bicicleta estacionária (posição de flexão)',
        'Terapia manual para mobilidade segmentar',
        'Educação sobre manejo de sintomas',
        'Perda de peso se indicado'
      ],
      surgical: 'Laminectomia descompressiva se falha do tratamento conservador após 3-6 meses e impacto funcional significativo.',
      prognosis: '15-43% melhoram com tratamento conservador. Cirurgia tem bons resultados em 60-80% dos casos.'
    },
    redFlags: [
      'Déficit neurológico progressivo',
      'Síndrome da cauda equina',
      'Incontinência urinária/fecal',
      'Claudicação com distância muito curta (<50m)'
    ],
    evidence: {
      references: [
        'Kreiner DS et al. An evidence-based clinical guideline for lumbar spinal stenosis. Spine J. 2013',
        'Ammendolia C et al. Nonoperative treatment of lumbar spinal stenosis. Cochrane Database Syst Rev. 2013',
        'Weinstein JN et al. Surgical versus nonsurgical therapy for lumbar spinal stenosis. NEJM. 2008'
      ]
    },
    clinicalApplication: 'A preferência por flexão é característica - use isso no programa de exercícios. Diferencie de claudicação vascular (pulsos, coloração). Bicicleta é melhor tolerada que caminhada.',
    relatedTests: ['teste-de-extensao-sustentada', 'teste-da-marcha'],
    keywords: ['estenose lombar', 'claudicação neurogênica', 'canal estreito', 'coluna lombar', 'fisioterapia']
  },
  // OMBRO
  {
    id: 'sindrome-impacto',
    slug: 'sindrome-do-impacto-subacromial',
    category: 'patologias',
    title: 'Síndrome do Impacto Subacromial: Diagnóstico e Tratamento',
    metaDescription: 'Síndrome do impacto subacromial: fisiopatologia, diagnóstico clínico e protocolo de reabilitação do ombro baseado em evidência.',
    introduction: 'A síndrome do impacto subacromial é um continuum de patologias que inclui bursite, tendinopatia e lesões do manguito rotador, resultantes de compressão de estruturas no espaço subacromial.',
    epidemiology: 'Causa mais comum de dor no ombro (44-65%). Prevalência aumenta com idade. Mais comum em trabalhadores que usam MMSS acima da cabeça e atletas de arremesso.',
    etiology: [
      'Compressão extrínseca (morfologia acromial)',
      'Disfunção do manguito rotador',
      'Discinesia escapular',
      'Rigidez da cápsula posterior',
      'Instabilidade glenoumeral sutil',
      'Sobrecarga repetitiva'
    ],
    clinicalPresentation: [
      'Dor anterolateral do ombro',
      'Arco doloroso entre 60-120° de abdução',
      'Dor noturna ao deitar sobre o lado afetado',
      'Dor ao elevar o braço acima da cabeça',
      'Fraqueza variável do manguito',
      'Possível crepitação subacromial'
    ],
    diagnosis: [
      'Testes de Neer e Hawkins-Kennedy positivos',
      'Teste de Jobe (empty can) para supraespinal',
      'Avaliação do arco doloroso',
      'Testes de discinesia escapular',
      'Avaliação de rotação interna glenoumeral (GIRD)'
    ],
    treatment: {
      conservative: [
        'Modificação de atividades provocativas',
        'Fortalecimento excêntrico do manguito rotador',
        'Exercícios escapulares (protração, retração)',
        'Alongamento da cápsula posterior',
        'Mobilização torácica',
        'Correção postural',
        'Progressão funcional gradual'
      ],
      surgical: 'Acromioplastia se falha após 3-6 meses de reabilitação adequada. Resultados semelhantes a tratamento conservador bem conduzido.',
      prognosis: '60-90% melhoram com tratamento conservador. Exercício é tão efetivo quanto cirurgia na maioria dos casos.'
    },
    redFlags: [
      'Fraqueza severa e súbita (ruptura aguda)',
      'História de luxação prévia',
      'Massa palpável na região do ombro',
      'Dor em repouso sem melhora'
    ],
    evidence: {
      references: [
        'Diercks R et al. Guideline for diagnosis and treatment of subacromial pain syndrome. Acta Orthop. 2014',
        'Kuhn JE et al. Effectiveness of physical therapy for subacromial impingement. J Bone Joint Surg Am. 2009',
        'Steuri R et al. Effectiveness of conservative interventions for subacromial shoulder pain. Br J Sports Med. 2017'
      ]
    },
    clinicalApplication: 'Evidência forte para exercício terapêutico como primeira linha. Foque em estabilizadores escapulares e fortalecimento excêntrico do manguito. A cirurgia não é superior ao exercício bem conduzido.',
    relatedTests: ['teste-de-neer', 'teste-de-hawkins', 'teste-de-jobe'],
    keywords: ['impacto subacromial', 'ombro', 'manguito rotador', 'bursite', 'tendinopatia']
  },
  {
    id: 'capsulite-adesiva',
    slug: 'capsulite-adesiva-ombro-congelado',
    category: 'patologias',
    title: 'Capsulite Adesiva (Ombro Congelado): Diagnóstico e Manejo',
    metaDescription: 'Capsulite adesiva ou ombro congelado: fases clínicas, diagnóstico diferencial e protocolo de tratamento fisioterapêutico.',
    introduction: 'A capsulite adesiva é uma condição caracterizada por rigidez progressiva e dor no ombro, com perda de amplitude de movimento ativa e passiva. Evolui em três fases distintas ao longo de 1-3 anos.',
    epidemiology: 'Incidência de 2-5% na população geral. Pico entre 40-60 anos. Mais comum em mulheres (1.4:1). Forte associação com diabetes (10-20% dos diabéticos).',
    etiology: [
      'Primária/idiopática (mais comum)',
      'Secundária a trauma ou imobilização',
      'Associada a diabetes mellitus',
      'Pós-cirurgia de ombro ou mama',
      'Doenças tireoidianas',
      'Doença de Dupuytren'
    ],
    clinicalPresentation: [
      'Fase 1 (Dolorosa): 2-9 meses - dor intensa, início da rigidez',
      'Fase 2 (Congelamento): 4-12 meses - rigidez progressiva, dor diminui',
      'Fase 3 (Descongelamento): 12-42 meses - recuperação gradual da amplitude',
      'Perda de rotação externa > flexão > rotação interna',
      'Padrão capsular característico'
    ],
    diagnosis: [
      'Perda de amplitude ativa E passiva',
      'Padrão capsular: RE > abdução > RI',
      'Exclusão de artrose glenoumeral',
      'História natural característica',
      'Radiografias normais ou com osteopenia'
    ],
    treatment: {
      conservative: [
        'Educação sobre história natural favorável',
        'Analgesia para controle de dor',
        'Mobilização articular progressiva',
        'Alongamento suave respeitando a dor',
        'Exercícios pendulares de Codman',
        'Calor antes de exercícios',
        'Evitar alongamento agressivo na fase dolorosa'
      ],
      surgical: 'Manipulação sob anestesia ou liberação artroscópica se falha após 6-12 meses de tratamento conservador.',
      prognosis: 'Resolução espontânea em 90% dos casos em 1-3 anos. 10-15% podem ter déficit residual. Diabetes tem pior prognóstico.'
    },
    redFlags: [
      'Fraqueza muscular significativa',
      'Sintomas neurológicos',
      'Massa palpável',
      'Perda de peso inexplicada'
    ],
    evidence: {
      references: [
        'Kelley MJ et al. Shoulder Pain and Mobility Deficits: Adhesive Capsulitis. J Orthop Sports Phys Ther. 2013',
        'Page MJ et al. Manual therapy and exercise for adhesive capsulitis. Cochrane Database Syst Rev. 2014',
        'Wong CK et al. Natural history of frozen shoulder: fact or fiction? Physiotherapy. 2017'
      ]
    },
    clinicalApplication: 'Adapte a intensidade à fase: na fase dolorosa, priorize analgesia e mobilização suave. Na fase de rigidez, progrida para ganho de amplitude. Eduque sobre tempo de recuperação (meses, não semanas).',
    relatedTests: ['teste-de-apreensao-ombro'],
    keywords: ['capsulite adesiva', 'ombro congelado', 'frozen shoulder', 'rigidez ombro', 'fisioterapia']
  },
  {
    id: 'lesao-manguito',
    slug: 'lesao-do-manguito-rotador',
    category: 'patologias',
    title: 'Lesão do Manguito Rotador: Avaliação e Reabilitação',
    metaDescription: 'Lesão do manguito rotador: classificação, diagnóstico clínico, indicações cirúrgicas e protocolo de reabilitação conservadora.',
    introduction: 'As lesões do manguito rotador variam de tendinopatia a rupturas completas. O supraespinal é o tendão mais frequentemente afetado. Lesões degenerativas são mais comuns que traumáticas.',
    epidemiology: 'Prevalência de lesões parciais/completas: 25% em >50 anos, 50% em >70 anos. Muitas lesões são assintomáticas. Ruptura traumática é mais comum em jovens.',
    etiology: [
      'Degeneração tendinosa (hipovascularidade)',
      'Trauma agudo (queda sobre o braço)',
      'Sobrecarga repetitiva',
      'Impacto subacromial crônico',
      'Fatores sistêmicos (diabetes, tabagismo)'
    ],
    clinicalPresentation: [
      'Dor lateral do ombro, irradiação para deltoide',
      'Fraqueza em abdução e rotações',
      'Dor noturna ao deitar sobre o lado',
      'Arco doloroso presente',
      'Atrofia muscular em lesões crônicas',
      'Drop arm sign em lesões extensas'
    ],
    diagnosis: [
      'Teste de Jobe (supraespinal)',
      'Teste do infraespinal (rotação externa)',
      'Teste de Gerber (subescapular)',
      'Drop arm test (ruptura extensa)',
      'Lag signs (rupturas completas)',
      'Ultrassom ou RM para confirmação'
    ],
    treatment: {
      conservative: [
        'Controle de dor e inflamação inicial',
        'Restauração de amplitude de movimento',
        'Fortalecimento isométrico → concêntrico → excêntrico',
        'Estabilização escapular',
        'Progressão funcional específica',
        'Exercícios em cadeia cinética fechada',
        'Educação sobre prognóstico'
      ],
      surgical: 'Indicações: ruptura traumática aguda em jovem, falha de tratamento conservador após 3-6 meses, fraqueza funcional significativa.',
      prognosis: 'Lesões parciais e rupturas pequenas respondem bem a tratamento conservador. Rupturas grandes em pacientes ativos podem requerer cirurgia.'
    },
    redFlags: [
      'Fraqueza severa e súbita (ruptura aguda)',
      'Pseudoparalisia (incapacidade de elevar o braço)',
      'Atrofia muscular progressiva',
      'Falha em responder ao tratamento conservador'
    ],
    evidence: {
      references: [
        'Ainsworth R et al. Exercise therapy for the conservative management of rotator cuff tendinopathy. Br J Sports Med. 2007',
        'Kukkonen J et al. Treatment of nontraumatic rotator cuff tears: a randomized trial. J Bone Joint Surg Am. 2015',
        'Ryosa A et al. Surgery or conservative treatment for rotator cuff tear. BMJ. 2017'
      ]
    },
    clinicalApplication: 'Muitas rupturas são assintomáticas ou respondem a tratamento conservador. O exercício é primeira linha em lesões degenerativas. Rupturas traumáticas agudas em pacientes jovens e ativos podem ter melhor prognóstico com reparo cirúrgico.',
    relatedTests: ['teste-de-jobe', 'teste-de-gerber-lift-off', 'teste-do-infraespinal', 'teste-do-braco-caido'],
    keywords: ['manguito rotador', 'supraespinal', 'ombro', 'ruptura tendínea', 'tendinopatia']
  },
  // JOELHO
  {
    id: 'lesao-lca',
    slug: 'lesao-do-ligamento-cruzado-anterior',
    category: 'patologias',
    title: 'Lesão do LCA: Diagnóstico e Reabilitação',
    metaDescription: 'Lesão do ligamento cruzado anterior: mecanismo de lesão, diagnóstico clínico, tratamento conservador versus cirúrgico.',
    introduction: 'A lesão do ligamento cruzado anterior (LCA) é uma das lesões ligamentares mais comuns do joelho, especialmente em atletas. O mecanismo típico envolve desaceleração, pivô ou aterrissagem.',
    epidemiology: 'Incidência anual: 68.6/100.000. Maior em mulheres atletas (2-8x). Pico em 15-25 anos. 70% ocorrem sem contato direto. Associada a lesão meniscal em 50% dos casos.',
    etiology: [
      'Mecanismo de não-contato (80%): pivô, desaceleração, aterrissagem',
      'Trauma em valgo com rotação',
      'Hiperextensão forçada',
      'Fatores de risco: valgo dinâmico, déficit neuromuscular',
      'Fatores hormonais em mulheres'
    ],
    clinicalPresentation: [
      'Pop audível no momento da lesão',
      'Derrame articular rápido (hemartrose)',
      'Incapacidade de continuar atividade',
      'Instabilidade, sensação de "giving way"',
      'Dor variável (pode ser mínima inicialmente)'
    ],
    diagnosis: [
      'Teste de Lachman positivo (mais sensível)',
      'Pivot shift positivo (mais específico)',
      'Gaveta anterior positiva (menos sensível)',
      'Hemartrose nas primeiras 12 horas',
      'RM para confirmação e lesões associadas'
    ],
    treatment: {
      conservative: [
        'Indicado em: pacientes de baixa demanda, instabilidade funcional mínima',
        'Controle de dor e derrame inicial',
        'Recuperação de amplitude de movimento',
        'Fortalecimento intensivo (quadríceps, isquiotibiais)',
        'Treino neuromuscular e proprioceptivo',
        'Modificação de atividade esportiva'
      ],
      surgical: 'Reconstrução indicada em: atletas competitivos, instabilidade funcional, lesões associadas (menisco), atividades pivô.',
      prognosis: 'Tratamento conservador: 30-40% retornam ao esporte pivô. Reconstrução: 80-90% retornam ao esporte, mas 20% sofrem nova lesão.'
    },
    redFlags: [
      'Lesão multiligamentar',
      'Lesão vascular (pulsos)',
      'Bloqueio articular (lesão meniscal)',
      'Déficit de extensão persistente'
    ],
    evidence: {
      references: [
        'Frobell RB et al. A randomized trial of treatment for acute ACL tears. NEJM. 2010',
        'Grindem H et al. Quadriceps strength and function as predictors of re-injury. Br J Sports Med. 2016',
        'Ardern CL et al. Return to sport following ACL reconstruction. Br J Sports Med. 2014'
      ]
    },
    clinicalApplication: 'A decisão conservador vs. cirúrgico depende de demanda funcional, não apenas da lesão. Reabilitação pré-operatória (prehab) melhora resultados. Critérios baseados em função, não tempo, para retorno ao esporte.',
    relatedTests: ['teste-de-lachman', 'pivot-shift', 'teste-da-gaveta-anterior'],
    keywords: ['LCA', 'ligamento cruzado anterior', 'joelho', 'instabilidade', 'reconstrução']
  },
  {
    id: 'lesao-meniscal',
    slug: 'lesao-meniscal',
    category: 'patologias',
    title: 'Lesão Meniscal: Diagnóstico e Tratamento Conservador',
    metaDescription: 'Lesão meniscal: tipos de lesão, diagnóstico clínico, quando operar e protocolo de tratamento conservador.',
    introduction: 'Os meniscos são estruturas fibrocartilaginosas que distribuem carga, absorvem impacto e contribuem para estabilidade do joelho. Lesões podem ser traumáticas (jovens) ou degenerativas (idosos).',
    epidemiology: 'Incidência anual: 60-70/100.000. Lesões traumáticas mais comuns em homens jovens. Lesões degenerativas aumentam após 40 anos. Menisco medial é 3x mais afetado.',
    etiology: [
      'Trauma rotacional com joelho fletido (jovens)',
      'Degeneração meniscal (>40 anos)',
      'Associação com lesão de LCA (50%)',
      'Carga repetitiva (ocupacional, esportiva)',
      'Lesões discoides congênitas'
    ],
    clinicalPresentation: [
      'Dor na interlinha articular',
      'Derrame articular intermitente',
      'Bloqueio mecânico (lesão em alça de balde)',
      'Estalidos durante movimento',
      'Dor ao agachar ou subir escadas',
      'Sensação de instabilidade'
    ],
    diagnosis: [
      'Teste de McMurray positivo',
      'Teste de Apley positivo',
      'Teste de Thessaly positivo',
      'Palpação dolorosa da interlinha',
      'RM para confirmação e caracterização'
    ],
    treatment: {
      conservative: [
        'Lesões degenerativas: tratamento conservador é primeira linha',
        'Controle de dor e derrame',
        'Exercícios de fortalecimento',
        'Treino neuromuscular',
        'Modificação de atividade',
        'Perda de peso se indicado'
      ],
      surgical: 'Artroscopia indicada em: bloqueio mecânico, lesões traumáticas em jovens, falha do tratamento conservador após 3 meses.',
      prognosis: 'Lesões degenerativas: cirurgia não é superior a exercício. Lesões traumáticas em zona vascular podem cicatrizar.'
    },
    redFlags: [
      'Bloqueio mecânico verdadeiro',
      'Lesão de LCA associada',
      'Derrame recorrente significativo',
      'Falha de melhora após 3 meses de tratamento'
    ],
    evidence: {
      references: [
        'Sihvonen R et al. Arthroscopic partial meniscectomy versus sham surgery for degenerative tears. NEJM. 2013',
        'Katz JN et al. Surgery versus physical therapy for meniscal tear and osteoarthritis. NEJM. 2013',
        'Beaufils P et al. Clinical practice guidelines for meniscal lesions. Orthop Traumatol Surg Res. 2017'
      ]
    },
    clinicalApplication: 'Evidência forte contra artroscopia em lesões degenerativas - exercício é igualmente efetivo. Reserve cirurgia para bloqueio mecânico e lesões traumáticas em jovens. Lesões na zona vascular podem cicatrizar.',
    relatedTests: ['teste-de-mcmurray', 'teste-de-apley', 'teste-de-thessaly'],
    keywords: ['menisco', 'lesão meniscal', 'joelho', 'artroscopia', 'McMurray']
  },
  {
    id: 'condromalacia',
    slug: 'sindrome-da-dor-femoropatelar',
    category: 'patologias',
    title: 'Síndrome da Dor Femoropatelar: Diagnóstico e Reabilitação',
    metaDescription: 'Síndrome da dor femoropatelar ou condromalacia: fisiopatologia, avaliação biomecânica e protocolo de exercícios.',
    introduction: 'A síndrome da dor femoropatelar (SDFP) é uma das causas mais comuns de dor anterior do joelho, caracterizada por dor peripatelar relacionada a atividades de carga axial.',
    epidemiology: 'Prevalência de 23% em adolescentes. Mais comum em mulheres (2:1). Pico em adolescentes e adultos jovens. 70-90% respondem a tratamento conservador.',
    etiology: [
      'Desequilíbrio entre vasto medial e lateral',
      'Mau alinhamento patelar',
      'Fraqueza de quadríceps e glúteos',
      'Rigidez de isquiotibiais, banda iliotibial, gastrocnêmios',
      'Aumento rápido de carga de treinamento',
      'Valgo dinâmico do joelho'
    ],
    clinicalPresentation: [
      'Dor anterior ou retropatelar difusa',
      'Piora ao subir/descer escadas, agachar, sentar prolongado',
      'Sinal do cinema (dor após sentar com joelho fletido)',
      'Crepitação femoropatelar',
      'Dor à compressão da patela'
    ],
    diagnosis: [
      'Teste de compressão patelar positivo',
      'Teste de inclinação patelar',
      'Avaliação do tracking patelar',
      'Single leg squat (valgo dinâmico)',
      'Teste de Ober (banda iliotibial)',
      'Radiografia: excluir outras patologias'
    ],
    treatment: {
      conservative: [
        'Fortalecimento de quadríceps (ênfase em VMO)',
        'Fortalecimento de abdutores e rotadores externos do quadril',
        'Alongamento de estruturas laterais (ITB, retináculo)',
        'Alongamento de isquiotibiais e gastrocnêmios',
        'Taping patelar (McConnell)',
        'Treino de controle do valgo dinâmico',
        'Modificação de atividades provocativas'
      ],
      prognosis: '70-90% melhoram com tratamento conservador. Exercícios de quadril e joelho combinados são mais efetivos que isolados.'
    },
    redFlags: [
      'Derrame significativo',
      'Bloqueio mecânico',
      'História de luxação patelar',
      'Instabilidade patelar'
    ],
    evidence: {
      references: [
        'Crossley KM et al. 2016 Patellofemoral Pain Consensus Statement. Br J Sports Med. 2016',
        'Collins NJ et al. Proximal versus distal muscle rehabilitation for patellofemoral pain. J Orthop Sports Phys Ther. 2012',
        'Van der Heijden RA et al. Exercise for patellofemoral pain syndrome. Cochrane Database Syst Rev. 2015'
      ]
    },
    clinicalApplication: 'Combine exercícios de quadril e joelho - evidência forte. Controle de valgo dinâmico é fundamental. O taping pode reduzir dor durante exercícios. Educação sobre manejo de carga é essencial.',
    relatedTests: ['teste-da-compressao-patelar', 'teste-de-inclinacao-patelar'],
    keywords: ['femoropatelar', 'condromalacia', 'patela', 'joelho', 'dor anterior']
  },
  // TORNOZELO
  {
    id: 'entorse-tornozelo',
    slug: 'entorse-de-tornozelo',
    category: 'patologias',
    title: 'Entorse de Tornozelo: Classificação e Reabilitação',
    metaDescription: 'Entorse de tornozelo: classificação por gravidade, protocolo de reabilitação e prevenção de instabilidade crônica.',
    introduction: 'A entorse de tornozelo é uma das lesões musculoesqueléticas mais comuns, representando 25% de todas as lesões esportivas. O complexo ligamentar lateral é mais frequentemente afetado.',
    epidemiology: 'Incidência diária: 1/10.000 pessoas. 85% são entorses laterais. Pico em 15-35 anos. Taxa de recorrência: 30-70%. 20-40% desenvolvem instabilidade crônica.',
    etiology: [
      'Inversão forçada do tornozelo',
      'Aterrissagem em superfície irregular',
      'Contato com outro atleta',
      'Déficit proprioceptivo prévio',
      'História de entorse anterior'
    ],
    clinicalPresentation: [
      'Grau I: dor leve, sem frouxidão, marcha normal',
      'Grau II: dor moderada, frouxidão parcial, claudicação',
      'Grau III: dor intensa, frouxidão completa, incapacidade de marcha',
      'Edema e equimose variáveis',
      'Dor à palpação ligamentar'
    ],
    diagnosis: [
      'Palpação de LTFA, LCF e maléolo lateral',
      'Teste de gaveta anterior do tornozelo',
      'Teste de inclinação talar',
      'Teste de squeeze (sindesmose)',
      'Regras de Ottawa para radiografia'
    ],
    treatment: {
      conservative: [
        'PEACE & LOVE (não mais RICE)',
        'Proteção inicial com órtese ou taping',
        'Mobilização precoce conforme tolerância',
        'Exercícios de amplitude de movimento',
        'Fortalecimento progressivo',
        'Treino proprioceptivo intensivo',
        'Retorno ao esporte baseado em critérios'
      ],
      prognosis: 'Grau I: 1-2 semanas. Grau II: 3-6 semanas. Grau III: 6-12 semanas. Reabilitação inadequada aumenta risco de recorrência.'
    },
    redFlags: [
      'Incapacidade de dar 4 passos',
      'Dor à palpação óssea (maléolo, base do 5º meta)',
      'Deformidade visível',
      'Suspeita de lesão sindesmótica'
    ],
    evidence: {
      references: [
        'Doherty C et al. Treatment and prevention of acute lateral ankle sprains. Br J Sports Med. 2017',
        'Vuurberg G et al. Diagnosis, treatment and prevention of ankle sprains. Br J Sports Med. 2018',
        'Delahunt E et al. International Ankle Consortium consensus statement. Br J Sports Med. 2018'
      ]
    },
    clinicalApplication: 'Priorize treino proprioceptivo - é o mais importante para prevenção de recorrência. Imobilização rígida prolongada é prejudicial. Retorno ao esporte baseado em critérios funcionais, não tempo.',
    relatedTests: ['teste-da-gaveta-anterior-tornozelo', 'teste-de-inclinacao-talar'],
    keywords: ['entorse tornozelo', 'LTFA', 'inversão', 'instabilidade', 'propriocepção']
  },
  {
    id: 'tendinopatia-aquiles',
    slug: 'tendinopatia-do-tendao-de-aquiles',
    category: 'patologias',
    title: 'Tendinopatia do Tendão de Aquiles: Diagnóstico e Tratamento',
    metaDescription: 'Tendinopatia do tendão de Aquiles: fisiopatologia, diagnóstico diferencial e protocolo de exercícios excêntricos.',
    introduction: 'A tendinopatia do tendão de Aquiles é uma condição por sobrecarga caracterizada por dor, rigidez e diminuição da função. Pode ser insercional ou da porção média (2-6 cm da inserção).',
    epidemiology: 'Incidência em corredores: 11%. Prevalência ao longo da vida: 6%. Pico entre 30-55 anos. Mais comum em homens. Associada a aumento rápido de carga.',
    etiology: [
      'Sobrecarga repetitiva (principal)',
      'Aumento rápido de volume/intensidade de treino',
      'Biomecânica alterada (pronação excessiva)',
      'Fraqueza de panturrilha',
      'Rigidez de tornozelo',
      'Uso de fluoroquinolonas'
    ],
    clinicalPresentation: [
      'Dor localizada no tendão',
      'Rigidez matinal característica',
      'Dor que melhora com aquecimento (warming up phenomenon)',
      'Espessamento palpável do tendão',
      'Dor à palpação e teste de pinça',
      'Fraqueza em flexão plantar'
    ],
    diagnosis: [
      'Palpação do tendão (espessamento, dor)',
      'Royal London Hospital Test',
      'Arc sign (arco durante movimento)',
      'Single heel raise test',
      'Ultrassom para confirmação'
    ],
    treatment: {
      conservative: [
        'Manejo de carga (redução relativa, não repouso)',
        'Protocolo de exercício excêntrico (Alfredson)',
        'Heavy slow resistance training',
        'Fortalecimento de cadeia posterior',
        'Correção de fatores biomecânicos',
        'Isométricos para alívio de dor',
        'Progressão gradual para atividades funcionais'
      ],
      surgical: 'Raramente necessária. Indicada após 6-12 meses de tratamento conservador adequado sem resposta.',
      prognosis: '70-90% melhoram com tratamento conservador adequado. Recuperação pode levar 3-6 meses.'
    },
    redFlags: [
      'Dor súbita intensa (ruptura)',
      'Gap palpável no tendão',
      'Thompson negativo (ruptura)',
      'Incapacidade de realizar flexão plantar unipodal'
    ],
    evidence: {
      references: [
        'Alfredson H et al. Heavy-load eccentric calf muscle training for Achilles tendinosis. Am J Sports Med. 1998',
        'Beyer R et al. Heavy slow resistance versus eccentric training for Achilles tendinopathy. Am J Sports Med. 2015',
        'Martin RL et al. Achilles Pain, Stiffness, and Muscle Power Deficits. J Orthop Sports Phys Ther. 2018'
      ]
    },
    clinicalApplication: 'Exercício excêntrico ou heavy slow resistance são tratamentos de primeira linha. A dor durante exercício é aceitável se não piora 24h após. Manejo de carga é fundamental - evite repouso completo.',
    relatedTests: ['teste-de-thompson'],
    keywords: ['tendão de Aquiles', 'tendinopatia', 'excêntrico', 'panturrilha', 'corrida']
  },
  {
    id: 'fascite-plantar',
    slug: 'fascite-plantar',
    category: 'patologias',
    title: 'Fascite Plantar: Diagnóstico e Tratamento Baseado em Evidência',
    metaDescription: 'Fascite plantar: fisiopatologia, diagnóstico diferencial e protocolo de tratamento fisioterapêutico completo.',
    introduction: 'A fascite plantar é a causa mais comum de dor no calcanhar, resultante de sobrecarga degenerativa da fáscia plantar em sua inserção no calcâneo. Termo mais adequado: fasciose plantar.',
    epidemiology: 'Prevalência: 10% da população. 1 milhão de consultas/ano nos EUA. Pico entre 40-60 anos. Mais comum em mulheres. 90% resolvem em 1 ano.',
    etiology: [
      'Sobrecarga repetitiva (principal)',
      'Biomecânica alterada (pé plano ou cavo)',
      'Obesidade (IMC >30)',
      'Atividades de impacto',
      'Rigidez de gastrocnêmios',
      'Ocupações com ortostatismo prolongado'
    ],
    clinicalPresentation: [
      'Dor no calcanhar medial plantar',
      'Dor aos primeiros passos da manhã (patognomônico)',
      'Melhora com atividade, piora após repouso',
      'Dor à palpação da tuberosidade medial do calcâneo',
      'Windlass test positivo',
      'Possível limitação de dorsiflexão'
    ],
    diagnosis: [
      'Dor à palpação da inserção da fáscia',
      'Windlass test positivo',
      'Dor aos primeiros passos da manhã',
      'Avaliação de dorsiflexão do tornozelo',
      'Ultrassom: espessamento >4mm'
    ],
    treatment: {
      conservative: [
        'Alongamento específico da fáscia plantar',
        'Alongamento de gastrocnêmios e sóleo',
        'Fortalecimento intrínseco do pé',
        'Taping plantar',
        'Órteses ou palmilhas de suporte',
        'Night splint (manter dorsiflexão)',
        'Calçados adequados com suporte de arco'
      ],
      surgical: 'Fasciotomia raramente indicada (<5%). Considerar após 6-12 meses de tratamento conservador adequado.',
      prognosis: '90% melhoram em 12 meses com tratamento conservador. Exercício de alta carga tem bons resultados.'
    },
    redFlags: [
      'Dor em repouso ou noturna',
      'Parestesias (síndrome do túnel do tarso)',
      'Edema ou calor local',
      'Perda de peso inexplicada'
    ],
    evidence: {
      references: [
        'Martin RL et al. Heel Pain-Plantar Fasciitis. Clinical Practice Guidelines. J Orthop Sports Phys Ther. 2014',
        'Rathleff MS et al. High-load strength training improves plantar fasciitis. Scand J Med Sci Sports. 2015',
        'Digiovanni BF et al. Tissue-specific plantar fascia-stretching exercise. J Bone Joint Surg Am. 2003'
      ]
    },
    clinicalApplication: 'O alongamento específico da fáscia (dorsiflexão dos dedos) é superior ao alongamento de gastrocnêmios isolado. Exercício de carga alta mostra bons resultados. Combine modalidades para melhor efeito.',
    relatedTests: ['teste-de-windlass'],
    keywords: ['fascite plantar', 'calcanhar', 'fáscia plantar', 'dor no pé', 'fisioterapia']
  },
  // QUADRIL
  {
    id: 'impacto-femoroacetabular',
    slug: 'impacto-femoroacetabular',
    category: 'patologias',
    title: 'Impacto Femoroacetabular: Diagnóstico e Reabilitação',
    metaDescription: 'Impacto femoroacetabular (IFA): tipos CAM e Pincer, diagnóstico clínico e protocolo de reabilitação conservadora.',
    introduction: 'O impacto femoroacetabular (IFA) resulta de contato anormal entre a cabeça femoral e o acetábulo durante o movimento, podendo causar lesão do labrum e cartilagem. É fator de risco para osteoartrose.',
    epidemiology: 'Prevalência radiográfica: 10-15% em adultos jovens. Mais comum em atletas. CAM mais comum em homens jovens. Pincer mais comum em mulheres de meia-idade.',
    etiology: [
      'Morfologia CAM: proeminência na junção cabeça-colo femoral',
      'Morfologia Pincer: cobertura acetabular excessiva',
      'Misto (mais comum): combinação de CAM e Pincer',
      'Desenvolvimento durante adolescência',
      'Associação com atividade esportiva intensa na juventude'
    ],
    clinicalPresentation: [
      'Dor anterior na virilha ou quadril',
      'Dor em flexão profunda (agachar, sentar baixo)',
      'Travamento ou estalido ocasional',
      'Rigidez matinal',
      'C-sign: paciente aponta a dor com a mão em "C" sobre o quadril',
      'Dor em atividades com rotação do quadril'
    ],
    diagnosis: [
      'FADIR positivo (muito sensível)',
      'FABER positivo',
      'Log roll test',
      'Avaliação de amplitude em flexão e rotação',
      'Radiografia: ângulo alfa >55° (CAM), cross-over sign (Pincer)'
    ],
    treatment: {
      conservative: [
        'Educação e modificação de atividades',
        'Fortalecimento de estabilizadores do quadril',
        'Exercícios de controle motor lombopélvico',
        'Evitar amplitudes de impacto (flexão + adução + RI)',
        'Mobilização articular em direções não provocativas',
        'Progressão funcional gradual'
      ],
      surgical: 'Artroscopia indicada se: falha do tratamento conservador após 3-6 meses, lesão labral sintomática, limitação funcional significativa.',
      prognosis: 'Tratamento conservador efetivo em 50-70% dos casos. Cirurgia com bons resultados em 70-90% dos casos selecionados.'
    },
    redFlags: [
      'Dor em repouso ou noturna',
      'Perda rápida de amplitude',
      'Bloqueio verdadeiro',
      'Sintomas neurológicos'
    ],
    evidence: {
      references: [
        'Griffin DR et al. The Warwick Agreement on femoroacetabular impingement syndrome. Br J Sports Med. 2016',
        'Wall PDH et al. Clinical US consensus statement on FAI syndrome. Br J Sports Med. 2016',
        'Kemp JL et al. Hip arthroscopy versus conservative management for FAI. Br J Sports Med. 2020'
      ]
    },
    clinicalApplication: 'O FADIR é muito sensível mas pouco específico - um teste negativo praticamente exclui IFA. Evite exercícios em amplitudes de impacto. A cirurgia não é claramente superior ao tratamento conservador bem conduzido.',
    relatedTests: ['teste-de-fadir', 'teste-de-faber'],
    keywords: ['impacto femoroacetabular', 'IFA', 'CAM', 'Pincer', 'quadril', 'labrum']
  },
  {
    id: 'sindrome-piriforme',
    slug: 'sindrome-do-piriforme',
    category: 'patologias',
    title: 'Síndrome do Piriforme: Diagnóstico Diferencial e Tratamento',
    metaDescription: 'Síndrome do piriforme: diagnóstico diferencial de ciatalgia, testes clínicos específicos e protocolo de tratamento.',
    introduction: 'A síndrome do piriforme é uma causa de dor glútea profunda e ciatalgia por compressão ou irritação do nervo ciático pelo músculo piriforme. Diagnóstico de exclusão após descartar causas espinais.',
    epidemiology: 'Prevalência incerta: 6-8% das causas de ciatalgia. Mais comum em mulheres (6:1). Relação anatômica variável do nervo ciático com o piriforme em 10-15% da população.',
    etiology: [
      'Hipertrofia ou espasmo do piriforme',
      'Trauma direto na região glútea',
      'Variação anatômica do nervo ciático',
      'Sobrecarga por atividades repetitivas',
      'Compressão por sentar prolongado'
    ],
    clinicalPresentation: [
      'Dor glútea profunda',
      'Irradiação para face posterior da coxa',
      'Piora ao sentar por tempo prolongado',
      'Dor ao cruzar as pernas',
      'Sensibilidade sobre o músculo piriforme',
      'Sem sinais radiculares verdadeiros'
    ],
    diagnosis: [
      'FAIR test positivo (flexão, adução, rotação interna)',
      'Teste de Pace positivo (abdução resistida)',
      'Teste de Freiberg positivo (rotação interna passiva)',
      'Palpação dolorosa do piriforme',
      'Exclusão de patologia lombar (Lasègue, força, reflexos normais)'
    ],
    treatment: {
      conservative: [
        'Alongamento específico do piriforme',
        'Liberação miofascial e trigger points',
        'Mobilização neural do ciático',
        'Fortalecimento de estabilizadores do quadril',
        'Correção de assimetrias biomecânicas',
        'Agulhamento seco ou injeção guiada',
        'Modificação ergonômica (almofada ao sentar)'
      ],
      prognosis: 'Maioria responde bem ao tratamento conservador em 4-8 semanas. Casos refratários podem requerer injeção ou cirurgia.'
    },
    redFlags: [
      'Déficit motor progressivo',
      'Sintomas bilaterais',
      'Síndrome da cauda equina',
      'Red flags para patologia espinal'
    ],
    evidence: {
      references: [
        'Hopayian K et al. The clinical features of piriformis syndrome: a systematic review. Eur Spine J. 2010',
        'Fishman LM et al. Piriformis syndrome: diagnosis and treatment. Muscle Nerve. 2002',
        'Cass SP. Piriformis syndrome: a cause of nondiscogenic sciatica. Curr Sports Med Rep. 2015'
      ]
    },
    clinicalApplication: 'É um diagnóstico de exclusão - sempre descarte patologia espinal primeiro. A combinação de FAIR, Pace e Freiberg aumenta a probabilidade diagnóstica. O alongamento é a base do tratamento.',
    relatedTests: ['teste-de-lasegue', 'teste-de-faber'],
    keywords: ['síndrome do piriforme', 'ciática', 'glúteo', 'dor posterior coxa', 'fisioterapia']
  },
  // COTOVELO
  {
    id: 'epicondilite-lateral',
    slug: 'epicondilite-lateral-cotovelo-tenista',
    category: 'patologias',
    title: 'Epicondilite Lateral (Cotovelo de Tenista): Tratamento Completo',
    metaDescription: 'Epicondilite lateral ou cotovelo de tenista: fisiopatologia, diagnóstico diferencial e protocolo de exercícios excêntricos.',
    introduction: 'A epicondilite lateral é uma tendinopatia dos extensores do punho em sua origem no epicôndilo lateral. Termo mais adequado: tendinopatia lateral do cotovelo. Processo degenerativo, não inflamatório.',
    epidemiology: 'Prevalência: 1-3% da população. Pico entre 35-55 anos. Igual entre homens e mulheres. Associada a atividades repetitivas com o punho. 80% em braço dominante.',
    etiology: [
      'Sobrecarga repetitiva dos extensores',
      'Degeneração do tendão extensor radial curto do carpo',
      'Atividades com preensão e rotação',
      'Uso de computador (mouse)',
      'Ergonomia inadequada'
    ],
    clinicalPresentation: [
      'Dor no epicôndilo lateral',
      'Dor ao segurar objetos',
      'Piora com extensão resistida do punho',
      'Sensibilidade à palpação do epicôndilo',
      'Fraqueza de preensão',
      'Dor ao apertar a mão'
    ],
    diagnosis: [
      'Teste de Cozen positivo',
      'Teste de Mill positivo',
      'Palpação dolorosa do epicôndilo lateral',
      'Dor à extensão resistida do 3º dedo',
      'Avaliação de coluna cervical (diagnóstico diferencial)'
    ],
    treatment: {
      conservative: [
        'Educação e modificação de atividades',
        'Exercício excêntrico de extensores',
        'Fortalecimento progressivo',
        'Liberação miofascial de extensores',
        'Cinta de contrapressão (tennis elbow strap)',
        'Mobilização articular radioumeral',
        'Correção ergonômica'
      ],
      surgical: 'Raramente necessária. Considerar após 6-12 meses de tratamento conservador adequado.',
      prognosis: '80-90% melhoram em 1 ano com tratamento conservador. Recorrência comum sem mudanças ergonômicas.'
    },
    redFlags: [
      'Instabilidade do cotovelo',
      'Sintomas neurológicos',
      'Massa palpável',
      'Dor em repouso severa'
    ],
    evidence: {
      references: [
        'Coombes BK et al. Management of lateral elbow tendinopathy. BMJ. 2015',
        'Bisset L et al. A systematic review and meta-analysis of clinical trials on physical interventions. Br J Sports Med. 2005',
        'Pattanittum P et al. Therapeutic ultrasound for lateral epicondylitis. Cochrane Database Syst Rev. 2013'
      ]
    },
    clinicalApplication: 'Wait-and-see tem resultados semelhantes a intervenções ativas em longo prazo. Exercício excêntrico é efetivo. Infiltração de corticoide pode piorar prognóstico em longo prazo. Foque em modificação de fatores causais.',
    relatedTests: ['teste-de-cozen'],
    keywords: ['epicondilite lateral', 'cotovelo de tenista', 'tendinopatia', 'cotovelo', 'extensor']
  },
  // PUNHO E MÃO
  {
    id: 'tunel-carpo',
    slug: 'sindrome-do-tunel-do-carpo',
    category: 'patologias',
    title: 'Síndrome do Túnel do Carpo: Diagnóstico e Tratamento Conservador',
    metaDescription: 'Síndrome do túnel do carpo: diagnóstico clínico, quando encaminhar para cirurgia e protocolo de tratamento fisioterapêutico.',
    introduction: 'A síndrome do túnel do carpo (STC) é a neuropatia compressiva mais comum, resultante da compressão do nervo mediano no canal do carpo. Causa significativa de incapacidade funcional.',
    epidemiology: 'Prevalência: 3-5% da população. Mais comum em mulheres (3:1). Pico entre 40-60 anos. Bilateral em 50% dos casos. Associada a trabalho manual repetitivo.',
    etiology: [
      'Idiopática (mais comum)',
      'Movimentos repetitivos de flexão/extensão do punho',
      'Diabetes mellitus',
      'Gestação',
      'Hipotireoidismo',
      'Artrite reumatoide'
    ],
    clinicalPresentation: [
      'Parestesias em polegar, indicador e médio',
      'Dormência noturna (acorda o paciente)',
      'Flicking sign (sacudir a mão alivia)',
      'Fraqueza de pinça em casos avançados',
      'Atrofia tenar (casos severos)',
      'Dor que pode irradiar para antebraço'
    ],
    diagnosis: [
      'Teste de Phalen positivo',
      'Teste de Tinel positivo',
      'Teste de Durkan (compressão carpal)',
      'Avaliação de sensibilidade',
      'Eletroneuromiografia para confirmação'
    ],
    treatment: {
      conservative: [
        'Splint noturno em posição neutra (mais efetivo)',
        'Modificação de atividades provocativas',
        'Deslizamento neural (nerve gliding)',
        'Deslizamento tendíneo (tendon gliding)',
        'Alongamento de flexores do punho',
        'Educação ergonômica'
      ],
      surgical: 'Liberação do retináculo flexor indicada se: atrofia tenar, déficit sensitivo persistente, falha do tratamento conservador após 3-6 meses.',
      prognosis: 'Casos leves a moderados: 70% respondem a tratamento conservador. Casos severos: melhor prognóstico com cirurgia precoce.'
    },
    redFlags: [
      'Atrofia tenar',
      'Perda sensitiva objetiva',
      'Fraqueza progressiva',
      'Sintomas refratários a splint'
    ],
    evidence: {
      references: [
        'Page MJ et al. Splinting for carpal tunnel syndrome. Cochrane Database Syst Rev. 2012',
        'Huisstede BM et al. Carpal tunnel syndrome: effectiveness of nonsurgical treatments. Arch Phys Med Rehabil. 2010',
        'Shi Q et al. Surgical treatment for carpal tunnel syndrome. Cochrane Database Syst Rev. 2018'
      ]
    },
    clinicalApplication: 'O splint noturno é a intervenção conservadora mais efetiva. Casos severos com atrofia se beneficiam de cirurgia precoce. Exercícios de deslizamento podem ser adjuvantes úteis.',
    relatedTests: ['teste-de-phalen', 'teste-de-tinel'],
    keywords: ['túnel do carpo', 'nervo mediano', 'parestesia mão', 'splint', 'fisioterapia']
  },
  // COLUNA TORÁCICA
  {
    id: 'dor-toracica',
    slug: 'dor-toracica-mecanica',
    category: 'patologias',
    title: 'Dor Torácica Mecânica: Avaliação e Tratamento',
    metaDescription: 'Dor torácica de origem musculoesquelética: diagnóstico diferencial, exclusão de causas cardíacas e tratamento fisioterapêutico.',
    introduction: 'A dor torácica de origem musculoesquelética representa até 50% das dores torácicas em atenção primária. O diagnóstico requer exclusão de causas cardíacas, pulmonares e viscerais.',
    epidemiology: 'Prevalência pontual: 13% da população. Responsável por 25-50% das dores torácicas em atenção primária. Mais comum em mulheres. Frequentemente subdiagnosticada.',
    etiology: [
      'Disfunção costovertebral ou costotransversa',
      'Síndrome de Tietze (inflamação costocondral)',
      'Tensão muscular intercostal',
      'Disfunção torácica segmentar',
      'Síndrome miofascial torácica',
      'Postura cifótica prolongada'
    ],
    clinicalPresentation: [
      'Dor torácica localizada ou referida',
      'Reprodutibilidade à palpação ou movimento',
      'Dor que piora com respiração profunda',
      'Rigidez torácica',
      'Dor que não correlaciona com esforço físico',
      'Sem sintomas de alarme cardíaco'
    ],
    diagnosis: [
      'Exclusão de causas cardíacas (ECG, enzimas)',
      'Reprodução da dor à palpação ou movimento',
      'Avaliação de mobilidade torácica',
      'Testes de provocação costal',
      'Avaliação respiratória'
    ],
    treatment: {
      conservative: [
        'Mobilização articular torácica',
        'Manipulação torácica',
        'Mobilização costal',
        'Exercícios de mobilidade torácica',
        'Correção postural',
        'Técnicas de respiração',
        'Alongamento de musculatura acessória'
      ],
      prognosis: 'Excelente prognóstico com tratamento conservador. Maioria resolve em 2-6 semanas.'
    },
    redFlags: [
      'Dor irradiada para braço esquerdo ou mandíbula',
      'Sudorese, náusea, dispneia',
      'Dor em faixa bilateral',
      'Sintomas neurológicos',
      'Febre, perda de peso'
    ],
    evidence: {
      references: [
        'Fruth SJ. Differential diagnosis and treatment in a patient with thoracic pain. JOSPT. 2006',
        'Cleland J et al. Development of a clinical prediction rule for thoracic manipulation. JOSPT. 2007',
        'Stochkendahl MJ et al. Manual examination of the spine: a systematic review. Chiropr Osteopat. 2006'
      ]
    },
    clinicalApplication: 'SEMPRE exclua causas cardíacas em dor torácica. A reprodutibilidade mecânica da dor é chave para o diagnóstico. Manipulação torácica tem boa evidência em dor de origem articular.',
    relatedTests: ['teste-de-compressao-toraxica'],
    keywords: ['dor torácica', 'coluna torácica', 'costocondral', 'Tietze', 'fisioterapia']
  }
];
