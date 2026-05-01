// Casos Clínicos Simulados para Modo Estudante

export interface ClinicalCase {
  id: string;
  title: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  category: string;
  specialty: 'Ortopédica' | 'Neurológica' | 'Esportiva' | 'Geriátrica' | 'Respiratória' | 'Reumatológica' | 'Pediátrica';
  estimatedTime: string; // e.g., "2-3 min"
  patientProfile: {
    age: number;
    gender: 'M' | 'F';
    occupation: string;
    lifestyle?: string;
  };
  history: string;
  symptoms: string[];
  clinicalFindings: string[];
  diagnosticOptions: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
  correctDiagnosis: string;
  clinicalExplanation: string;
  recommendedTests: string[];
  initialTreatment: string[];
  tips?: string;
}

export const clinicalCases: ClinicalCase[] = [
  // ========== OMBRO (1-5) ==========
  {
    id: 'caso-001',
    title: 'Dor no Ombro com Limitação de Movimento',
    difficulty: 'facil',
    category: 'Ombro',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 52,
      gender: 'F',
      occupation: 'Professora',
      lifestyle: 'Sedentária, diabética tipo 2'
    },
    history: 'Paciente refere dor no ombro direito há 4 meses, com piora progressiva. Dificuldade para pentear o cabelo e colocar o sutiã. Não relata trauma. Dor noturna ao deitar sobre o lado afetado.',
    symptoms: ['Dor difusa no ombro direito', 'Rigidez progressiva', 'Dor noturna', 'Dificuldade em movimentos acima da cabeça'],
    clinicalFindings: ['Limitação ativa e passiva em todas as direções', 'Rotação externa: 15° (normal 90°)', 'Abdução: 80° (normal 180°)', 'Flexão: 100° (normal 180°)', 'Padrão capsular presente', 'Dor à palpação difusa'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Impacto', isCorrect: false },
      { id: 'b', label: 'Capsulite Adesiva (Ombro Congelado)', isCorrect: true },
      { id: 'c', label: 'Lesão do Manguito Rotador', isCorrect: false },
      { id: 'd', label: 'Artrose Glenoumeral', isCorrect: false }
    ],
    correctDiagnosis: 'Capsulite Adesiva (Ombro Congelado)',
    clinicalExplanation: 'A capsulite adesiva é caracterizada pela limitação progressiva de movimento ativo E passivo com padrão capsular (rotação externa > abdução > rotação interna). Fatores de risco incluem diabetes mellitus, sexo feminino e idade entre 40-60 anos.',
    recommendedTests: ['Teste de Apley modificado', 'Avaliação do padrão capsular', 'Radiografia para descartar artrose', 'Ultrassonografia se dúvida diagnóstica'],
    initialTreatment: ['Mobilização articular graus I e II', 'Alongamentos suaves dentro do limite da dor', 'Termoterapia antes da mobilização', 'Exercícios pendulares de Codman', 'Orientação sobre prognóstico (12-24 meses)'],
    tips: 'Lembre-se: na capsulite, a limitação é tanto ativa quanto passiva. Na síndrome do impacto, geralmente há mais movimento passivo que ativo.'
  },
  {
    id: 'caso-002',
    title: 'Dor no Ombro em Atleta de Vôlei',
    difficulty: 'medio',
    category: 'Ombro',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 24,
      gender: 'M',
      occupation: 'Atleta de vôlei',
      lifestyle: 'Treina 5x/semana, competição de alto nível'
    },
    history: 'Jogador de vôlei apresenta dor no ombro dominante há 2 meses. Dor durante e após ataques e saques. Sensação de fraqueza ao atacar. Nega trauma específico.',
    symptoms: ['Dor anterior e lateral do ombro', 'Fraqueza ao atacar', 'Dor em movimentos acima da cabeça', 'Piora com atividade, melhora com repouso'],
    clinicalFindings: ['Teste de Neer positivo', 'Teste de Hawkins-Kennedy positivo', 'Arco doloroso entre 70-120°', 'Força de rotadores externos 4/5', 'GIRD (déficit de rotação interna glenoumeral) de 25°', 'Discinesia escapular presente'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Impacto Subacromial', isCorrect: true },
      { id: 'b', label: 'Lesão SLAP', isCorrect: false },
      { id: 'c', label: 'Instabilidade Glenoumeral', isCorrect: false },
      { id: 'd', label: 'Tendinite Calcárea', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome do Impacto Subacromial',
    clinicalExplanation: 'A síndrome do impacto é comum em atletas overhead. Os testes de Neer e Hawkins positivos, associados ao arco doloroso, são achados clássicos. O GIRD é comum em atletas de arremesso e contribui para o impacto.',
    recommendedTests: ['Teste de Jobe (supraespinhal)', 'Teste de Gerber (subescapular)', 'Avaliação da cinemática escapular', 'Ultrassonografia do manguito rotador'],
    initialTreatment: ['Correção da discinesia escapular', 'Fortalecimento do manguito rotador (ênfase em RE)', 'Alongamento da cápsula posterior', 'Estabilizadores escapulares', 'Modificação temporária do volume de treino']
  },
  {
    id: 'caso-003',
    title: 'Lesão do Manguito Rotador em Idoso',
    difficulty: 'medio',
    category: 'Ombro',
    specialty: 'Geriátrica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 67,
      gender: 'M',
      occupation: 'Aposentado',
      lifestyle: 'Faz trabalhos manuais em casa'
    },
    history: 'Paciente refere dor no ombro esquerdo há 6 semanas após carregar peso. Dificuldade para elevar o braço. Dor noturna importante. Fraqueza progressiva.',
    symptoms: ['Dor lateral do ombro', 'Fraqueza para elevação', 'Dor noturna', 'Dificuldade para vestir-se'],
    clinicalFindings: ['Teste de Jobe positivo', 'Drop arm test positivo', 'Força de abdução 3/5', 'Arco doloroso presente', 'Rotação externa com fraqueza'],
    diagnosticOptions: [
      { id: 'a', label: 'Capsulite Adesiva', isCorrect: false },
      { id: 'b', label: 'Lesão do Manguito Rotador', isCorrect: true },
      { id: 'c', label: 'Artrose Acromioclavicular', isCorrect: false },
      { id: 'd', label: 'Bursite Subacromial Isolada', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão do Manguito Rotador',
    clinicalExplanation: 'O drop arm test positivo e fraqueza significativa sugerem lesão do supraespinhal. Em idosos, lesões degenerativas do manguito são comuns. A história de trauma (carregar peso) pode ter agudizado uma lesão prévia.',
    recommendedTests: ['Teste de Jobe', 'Drop arm test', 'Teste de rotação externa resistida', 'Ultrassonografia ou RM'],
    initialTreatment: ['Fortalecimento progressivo do manguito', 'Estabilização escapular', 'Crioterapia pós-exercício', 'Avaliação para tratamento cirúrgico se não melhorar']
  },
  {
    id: 'caso-004',
    title: 'Instabilidade de Ombro Pós-Luxação',
    difficulty: 'dificil',
    category: 'Ombro',
    specialty: 'Esportiva',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 19,
      gender: 'M',
      occupation: 'Estudante/Jogador de rugby',
      lifestyle: 'Treina 4x/semana'
    },
    history: 'Paciente com história de 3 luxações anteriores de ombro direito nos últimos 2 anos. Última há 3 meses. Sente insegurança ao fazer movimentos de arremesso. Evita certos gestos no esporte.',
    symptoms: ['Sensação de instabilidade', 'Medo de luxar', 'Evita abdução com rotação externa', 'Dor ocasional'],
    clinicalFindings: ['Teste de apreensão positivo', 'Teste de relocação positivo', 'Sulcus sign leve', 'Hiperfrouxidão ligamentar', 'Gaveta anterior aumentada'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Impacto', isCorrect: false },
      { id: 'b', label: 'Lesão SLAP', isCorrect: false },
      { id: 'c', label: 'Instabilidade Glenoumeral Anterior Recorrente', isCorrect: true },
      { id: 'd', label: 'Tendinopatia do Bíceps', isCorrect: false }
    ],
    correctDiagnosis: 'Instabilidade Glenoumeral Anterior Recorrente',
    clinicalExplanation: 'O histórico de luxações recorrentes, testes de apreensão e relocação positivos confirmam instabilidade anterior. Em jovens atletas com mais de 2 luxações, o risco de recidiva é alto e deve-se considerar avaliação cirúrgica.',
    recommendedTests: ['Teste de apreensão', 'Teste de relocação', 'Sulcus sign', 'Load and shift test', 'RM com contraste para lesão labral'],
    initialTreatment: ['Fortalecimento de rotadores externos', 'Propriocepção intensiva', 'Estabilização dinâmica', 'Discussão sobre cirurgia de Bankart'],
    tips: 'Em atletas jovens com instabilidade recorrente, a cirurgia geralmente tem melhores resultados do que tratamento conservador prolongado.'
  },
  {
    id: 'caso-005',
    title: 'Tendinopatia Calcárea de Ombro',
    difficulty: 'medio',
    category: 'Ombro',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 45,
      gender: 'F',
      occupation: 'Dentista',
      lifestyle: 'Trabalha com braços elevados frequentemente'
    },
    history: 'Dor intensa no ombro direito há 1 semana, início súbito. Dor constante, piora à noite. Dificuldade extrema para movimentar o braço. Nega trauma.',
    symptoms: ['Dor intensa aguda', 'Rigidez funcional', 'Dor noturna severa', 'Limitação importante'],
    clinicalFindings: ['Dor intensa à palpação do tendão supraespinhal', 'Limitação ativa por dor', 'Movimento passivo possível mas doloroso', 'Sinais inflamatórios locais'],
    diagnosticOptions: [
      { id: 'a', label: 'Capsulite Adesiva Aguda', isCorrect: false },
      { id: 'b', label: 'Tendinopatia Calcárea em Fase de Reabsorção', isCorrect: true },
      { id: 'c', label: 'Artrite Séptica', isCorrect: false },
      { id: 'd', label: 'Fratura de Estresse', isCorrect: false }
    ],
    correctDiagnosis: 'Tendinopatia Calcárea em Fase de Reabsorção',
    clinicalExplanation: 'A dor intensa de início súbito sem trauma sugere fase de reabsorção da calcificação, quando o depósito de cálcio está sendo eliminado, causando inflamação intensa. Radiografia confirma o diagnóstico.',
    recommendedTests: ['Radiografia de ombro AP e perfil', 'Ultrassonografia', 'Avaliação de amplitude de movimento'],
    initialTreatment: ['Repouso relativo', 'AINE se não contraindicado', 'Crioterapia', 'Mobilização suave quando dor diminuir', 'Considerar infiltração se refratário']
  },

  // ========== COLUNA LOMBAR (6-12) ==========
  {
    id: 'caso-006',
    title: 'Lombalgia com Irradiação para Membro Inferior',
    difficulty: 'medio',
    category: 'Coluna Lombar',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 45,
      gender: 'M',
      occupation: 'Caminhoneiro',
      lifestyle: 'Sedentário, sobrepeso (IMC 29)'
    },
    history: 'Paciente refere dor lombar há 3 semanas após carregar caixas pesadas. Dor irradia para nádega e face posterior da coxa e perna direita até o pé. Piora ao sentar e ao tossir. Formigamento no pé direito.',
    symptoms: ['Dor lombar intensa', 'Irradiação para membro inferior direito', 'Parestesia em pé direito', 'Piora ao sentar, tossir e espirrar', 'Melhora em pé ou deitado'],
    clinicalFindings: ['Lasègue positivo a 35° à direita', 'Slump test positivo', 'Dermátomo L5-S1 com hipoestesia', 'Reflexo aquileu diminuído à direita', 'Força de flexão plantar 4/5', 'Postura antálgica com inclinação lateral'],
    diagnosticOptions: [
      { id: 'a', label: 'Lombalgia Mecânica Simples', isCorrect: false },
      { id: 'b', label: 'Radiculopatia L5-S1 (Hérnia de Disco)', isCorrect: true },
      { id: 'c', label: 'Síndrome do Piriforme', isCorrect: false },
      { id: 'd', label: 'Estenose de Canal Lombar', isCorrect: false }
    ],
    correctDiagnosis: 'Radiculopatia L5-S1 (Hérnia de Disco)',
    clinicalExplanation: 'O quadro clássico de radiculopatia inclui: dor irradiada seguindo dermátomo, testes de tensão neural positivos (Lasègue, Slump), alterações sensitivas, alterações de reflexo (aquileu = S1) e possível fraqueza muscular.',
    recommendedTests: ['Teste de Lasègue cruzado', 'Avaliação de reflexos profundos', 'Teste de força segmentar', 'Dermátomos e miótomos L4-S1', 'Red flags para síndrome da cauda equina'],
    initialTreatment: ['Educação sobre prognóstico favorável', 'Posições de alívio (McKenzie se centraliza)', 'Evitar flexão lombar prolongada', 'Mobilização neural suave se tolerado', 'Manter atividade dentro do tolerável', 'Encaminhar se déficit motor progressivo'],
    tips: 'Red flags: perda de controle vesical/intestinal, anestesia em sela, fraqueza bilateral progressiva = EMERGÊNCIA (síndrome da cauda equina).'
  },
  {
    id: 'caso-007',
    title: 'Dor Lombar em Idoso com Claudicação',
    difficulty: 'dificil',
    category: 'Coluna Lombar',
    specialty: 'Geriátrica',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 68,
      gender: 'M',
      occupation: 'Aposentado',
      lifestyle: 'Ativo, caminha diariamente'
    },
    history: 'Paciente refere dor lombar bilateral há 1 ano. Dor irradia para ambas as coxas e pernas ao caminhar. Consegue andar cerca de 200 metros antes de precisar parar. Alívio ao sentar ou inclinar o tronco para frente. Consegue andar mais com carrinho de supermercado.',
    symptoms: ['Dor lombar bilateral', 'Dor em ambos os membros inferiores ao caminhar', 'Claudicação neurogênica', 'Alívio ao sentar ou flexionar o tronco', 'Fraqueza nas pernas após caminhar'],
    clinicalFindings: ['Postura em flexão preferencial', 'Extensão lombar limitada e dolorosa', 'Lasègue negativo bilateral', 'Reflexos presentes e simétricos em repouso', 'Teste de marcha: sintomas após 3 minutos', 'Pulsos periféricos presentes'],
    diagnosticOptions: [
      { id: 'a', label: 'Claudicação Vascular', isCorrect: false },
      { id: 'b', label: 'Hérnia de Disco Bilateral', isCorrect: false },
      { id: 'c', label: 'Estenose de Canal Lombar', isCorrect: true },
      { id: 'd', label: 'Artrose de Quadril Bilateral', isCorrect: false }
    ],
    correctDiagnosis: 'Estenose de Canal Lombar',
    clinicalExplanation: 'A estenose de canal lombar apresenta claudicação neurogênica: dor em membros inferiores que surge com deambulação e alivia com flexão do tronco (carrinho de supermercado, bicicleta, sentar). Pulsos presentes diferencia de claudicação vascular.',
    recommendedTests: ['Teste de esteira (Bicycle test)', 'Avaliação de pulsos periféricos', 'Teste de extensão lombar sustentada', 'Two-stage treadmill test', 'Questionário de Oswestry'],
    initialTreatment: ['Exercícios em flexão (Williams)', 'Fortalecimento de core em posições neutras', 'Exercício aeróbico em bicicleta', 'Alongamento de flexores do quadril', 'Orientação postural', 'Considerar referência para avaliação cirúrgica se grave']
  },
  {
    id: 'caso-008',
    title: 'Lombalgia Mecânica em Gestante',
    difficulty: 'medio',
    category: 'Coluna Lombar',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 32,
      gender: 'F',
      occupation: 'Advogada',
      lifestyle: 'Gestante 28 semanas, sedentária'
    },
    history: 'Dor lombar baixa há 2 meses, progressiva. Piora ao ficar em pé por tempo prolongado e ao caminhar. Melhora ao deitar. Sem irradiação para membros inferiores.',
    symptoms: ['Dor lombar baixa bilateral', 'Piora em pé', 'Melhora em repouso', 'Dificuldade para virar na cama'],
    clinicalFindings: ['Hiperlordose lombar', 'Dor à palpação de facetas L4-S1', 'Teste de Patrick negativo', 'Sem sinais neurológicos', 'Fraqueza de glúteos'],
    diagnosticOptions: [
      { id: 'a', label: 'Hérnia Discal Lombar', isCorrect: false },
      { id: 'b', label: 'Lombalgia Mecânica Gestacional', isCorrect: true },
      { id: 'c', label: 'Disfunção Sacroilíaca', isCorrect: false },
      { id: 'd', label: 'Espondilite Anquilosante', isCorrect: false }
    ],
    correctDiagnosis: 'Lombalgia Mecânica Gestacional',
    clinicalExplanation: 'A lombalgia na gestação é comum devido às alterações posturais (hiperlordose), frouxidão ligamentar pela relaxina e aumento do peso abdominal. A ausência de sinais neurológicos e irradiação afasta radiculopatia.',
    recommendedTests: ['Avaliação postural', 'Teste de flexibilidade', 'Força de glúteos e core', 'Descartar sinais de alerta'],
    initialTreatment: ['Exercícios de estabilização em neutro', 'Fortalecimento de glúteos', 'Alongamento de flexores do quadril', 'Cinta de suporte se indicado', 'Posicionamento para dormir com travesseiro']
  },
  {
    id: 'caso-009',
    title: 'Dor Lombar em Adolescente Atleta',
    difficulty: 'medio',
    category: 'Coluna Lombar',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 16,
      gender: 'F',
      occupation: 'Estudante/Ginasta',
      lifestyle: 'Treina ginástica 6x/semana'
    },
    history: 'Dor lombar há 3 meses, pior durante treinos que envolvem hiperextensão. Dor unilateral à direita. Piora em movimentos de ponte e mortal para trás.',
    symptoms: ['Dor lombar unilateral', 'Piora com extensão', 'Dor durante saltos', 'Melhora com repouso'],
    clinicalFindings: ['Dor à extensão unilateral', 'Teste de Stork positivo à direita', 'Hiperextensão lombar excessiva', 'Encurtamento de flexores do quadril'],
    diagnosticOptions: [
      { id: 'a', label: 'Lombalgia Muscular', isCorrect: false },
      { id: 'b', label: 'Espondilólise', isCorrect: true },
      { id: 'c', label: 'Hérnia Discal', isCorrect: false },
      { id: 'd', label: 'Doença de Scheuermann', isCorrect: false }
    ],
    correctDiagnosis: 'Espondilólise',
    clinicalExplanation: 'A espondilólise (fratura de estresse do pars interarticularis) é comum em atletas jovens com hiperextensão repetitiva. O teste de Stork positivo unilateral é característico. Requer investigação por imagem.',
    recommendedTests: ['Teste de Stork (Single leg hyperextension)', 'Radiografia oblíqua', 'SPECT-CT se radiografia negativa', 'Avaliação de flexibilidade'],
    initialTreatment: ['Repouso de atividades com extensão', 'Órtese lombossacra por 6-12 semanas', 'Fortalecimento de core em flexão', 'Alongamento de flexores do quadril', 'Retorno gradual ao esporte'],
    tips: 'A espondilólise pode evoluir para espondilolistese se não tratada adequadamente. O retorno ao esporte deve ser gradual.'
  },
  {
    id: 'caso-010',
    title: 'Red Flags - Lombalgia Atípica',
    difficulty: 'dificil',
    category: 'Coluna Lombar',
    specialty: 'Ortopédica',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 62,
      gender: 'M',
      occupation: 'Aposentado',
      lifestyle: 'Ex-fumante, histórico de câncer de próstata tratado há 3 anos'
    },
    history: 'Paciente refere dor lombar há 6 semanas, de início insidioso. Dor constante, sem posição de alívio. Piora à noite, acordando o paciente. Perda de 5kg não intencional nos últimos 2 meses. Fadiga importante.',
    symptoms: ['Dor lombar constante', 'Dor noturna que acorda', 'Sem posição de alívio', 'Perda de peso não intencional', 'Fadiga sistêmica'],
    clinicalFindings: ['Dor à percussão de processos espinhosos L2-L4', 'Sem padrão mecânico claro', 'Neurológico de membros inferiores normal', 'Mobilidade lombar limitada em todas direções', 'Paciente com aparência emagrecida'],
    diagnosticOptions: [
      { id: 'a', label: 'Lombalgia Mecânica Inespecífica', isCorrect: false },
      { id: 'b', label: 'Estenose de Canal Lombar', isCorrect: false },
      { id: 'c', label: 'Red Flags: Suspeita de Metástase Óssea', isCorrect: true },
      { id: 'd', label: 'Espondilolistese Degenerativa', isCorrect: false }
    ],
    correctDiagnosis: 'Red Flags: Suspeita de Metástase Óssea',
    clinicalExplanation: 'Este caso apresenta múltiplas RED FLAGS: história de câncer (próstata = alta afinidade óssea), idade >50 anos, dor noturna que acorda, dor constante sem padrão mecânico, perda de peso. Este paciente NÃO deve ser tratado sem investigação médica prévia.',
    recommendedTests: ['ENCAMINHAR PARA AVALIAÇÃO MÉDICA URGENTE', 'Screening de red flags completo', 'Avaliação sistêmica', 'NÃO iniciar tratamento fisioterapêutico'],
    initialTreatment: ['NÃO TRATAR - ENCAMINHAR IMEDIATAMENTE', 'Documentar red flags identificadas', 'Comunicar urgência ao paciente', 'Contato direto com médico se possível'],
    tips: 'RED FLAGS para câncer: >50 anos, história de câncer, perda de peso, dor noturna, dor constante sem alívio mecânico. Na dúvida, ENCAMINHAR.'
  },
  {
    id: 'caso-011',
    title: 'Dor Lombar Crônica Inespecífica',
    difficulty: 'facil',
    category: 'Coluna Lombar',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 38,
      gender: 'F',
      occupation: 'Secretária',
      lifestyle: 'Sedentária, trabalha 8h sentada'
    },
    history: 'Dor lombar há mais de 6 meses, sem causa aparente. Piora ao final do dia. Já fez vários tratamentos sem melhora duradoura. Muito preocupada com a dor.',
    symptoms: ['Dor lombar difusa', 'Piora ao final do dia', 'Rigidez matinal', 'Ansiedade em relação à dor'],
    clinicalFindings: ['Postura em flexão', 'Mobilidade lombar reduzida', 'Sem sinais neurológicos', 'Medo do movimento (kinesiofobia)', 'Testes específicos negativos'],
    diagnosticOptions: [
      { id: 'a', label: 'Hérnia Discal', isCorrect: false },
      { id: 'b', label: 'Lombalgia Crônica Inespecífica', isCorrect: true },
      { id: 'c', label: 'Artrose Facetária', isCorrect: false },
      { id: 'd', label: 'Fibromialgia', isCorrect: false }
    ],
    correctDiagnosis: 'Lombalgia Crônica Inespecífica',
    clinicalExplanation: 'A lombalgia crônica inespecífica é a mais comum. Caracteriza-se por dor >3 meses sem patologia estrutural identificável. Fatores psicossociais como kinesiofobia, catastrofização e depressão são importantes.',
    recommendedTests: ['Questionário de incapacidade (ODI)', 'Tampa Scale (kinesiofobia)', 'Avaliação de red flags', 'Avaliação biopsicossocial'],
    initialTreatment: ['Educação em dor (neurociência)', 'Exercício terapêutico gradual', 'Terapia cognitivo-comportamental', 'Evitar repouso prolongado', 'Estabelecer metas funcionais']
  },
  {
    id: 'caso-012',
    title: 'Síndrome do Piriforme',
    difficulty: 'medio',
    category: 'Coluna Lombar',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 35,
      gender: 'M',
      occupation: 'Corredor amador',
      lifestyle: 'Corre 50km/semana'
    },
    history: 'Dor glútea profunda há 2 meses que irradia para face posterior da coxa. Piora ao correr e ao sentar por tempo prolongado. Sem dor lombar. Sem parestesias.',
    symptoms: ['Dor glútea profunda', 'Irradiação para posterior da coxa', 'Piora ao sentar', 'Sem formigamento'],
    clinicalFindings: ['Lasègue negativo', 'FAIR test positivo', 'Dor à palpação do piriforme', 'Pace test positivo', 'Neurológico normal'],
    diagnosticOptions: [
      { id: 'a', label: 'Radiculopatia S1', isCorrect: false },
      { id: 'b', label: 'Síndrome do Piriforme', isCorrect: true },
      { id: 'c', label: 'Bursite Isquiática', isCorrect: false },
      { id: 'd', label: 'Tendinopatia de Isquiotibiais', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome do Piriforme',
    clinicalExplanation: 'A síndrome do piriforme causa compressão do nervo ciático pelo músculo piriforme. O Lasègue negativo diferencia de hérnia discal. FAIR test e Pace test positivos sugerem o diagnóstico. Comum em corredores.',
    recommendedTests: ['FAIR test', 'Pace test', 'Teste de Freiberg', 'Palpação do piriforme', 'Avaliação de rotadores externos'],
    initialTreatment: ['Alongamento do piriforme', 'Liberação miofascial', 'Fortalecimento de glúteos', 'Correção de biomecânica da corrida', 'Mobilização neural']
  },

  // ========== JOELHO (13-20) ==========
  {
    id: 'caso-013',
    title: 'Dor Anterior no Joelho em Adolescente',
    difficulty: 'facil',
    category: 'Joelho',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 16,
      gender: 'F',
      occupation: 'Estudante',
      lifestyle: 'Pratica vôlei escolar, sedentária fora do esporte'
    },
    history: 'Adolescente refere dor anterior no joelho direito há 2 meses. Dor ao subir e descer escadas, agachar e após ficar muito tempo sentada. Sente o joelho "ranger". Nega trauma ou entorse.',
    symptoms: ['Dor anterior/retropatelar', 'Piora ao subir/descer escadas', 'Dor ao agachar', '"Sinal do cinema" - dor após sentar muito tempo', 'Crepitação'],
    clinicalFindings: ['Teste de compressão patelar positivo', 'Crepitação à flexo-extensão', 'Ângulo Q aumentado (18°)', 'VMO hipotrofiado comparado ao VL', 'Encurtamento de isquiotibiais e TIT', 'Teste de Ober positivo', 'Gavetas e estresse em varo/valgo negativos'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome da Dor Patelofemoral', isCorrect: true },
      { id: 'b', label: 'Condromalácia Patelar Grau IV', isCorrect: false },
      { id: 'c', label: 'Lesão Meniscal', isCorrect: false },
      { id: 'd', label: 'Tendinopatia Patelar', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome da Dor Patelofemoral',
    clinicalExplanation: 'A síndrome da dor patelofemoral é a causa mais comum de dor anterior do joelho em adolescentes. Caracteriza-se por dor retropatelar, piora com atividades que aumentam a compressão patelofemoral. O desequilíbrio VMO/VL e encurtamentos são fatores contribuintes.',
    recommendedTests: ['Teste de Clarke', 'Teste de compressão patelar', 'Avaliação do tracking patelar', 'Teste de flexibilidade (Thomas, Ober, isquiotibiais)', 'Avaliação do controle motor de quadril'],
    initialTreatment: ['Fortalecimento de VMO (arco final de extensão)', 'Fortalecimento de glúteo médio', 'Alongamento de TIT, isquiotibiais e quadríceps', 'Taping patelar McConnell', 'Educação sobre atividades de alto impacto']
  },
  {
    id: 'caso-014',
    title: 'Trauma em Joelho durante Futebol',
    difficulty: 'medio',
    category: 'Joelho',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 28,
      gender: 'M',
      occupation: 'Contador',
      lifestyle: 'Futebol recreativo aos finais de semana'
    },
    history: 'Paciente sofreu entorse em joelho esquerdo há 10 dias durante partida de futebol. Refere que o pé ficou fixo no gramado enquanto o corpo rodou. Sentiu estalo no momento. Edema importante no dia seguinte. Sensação de falseio ao tentar voltar a caminhar.',
    symptoms: ['Dor difusa no joelho', 'Edema moderado residual', 'Sensação de instabilidade/falseio', 'Insegurança ao pisar', 'Dificuldade para descer escadas'],
    clinicalFindings: ['Derrame articular moderado', 'Gaveta anterior positiva (fim mole)', 'Teste de Lachman positivo', 'Pivot shift positivo', 'Gaveta posterior negativa', 'Estresse em varo/valgo estáveis', 'Amplitude de movimento reduzida por dor'],
    diagnosticOptions: [
      { id: 'a', label: 'Lesão de Ligamento Colateral Medial', isCorrect: false },
      { id: 'b', label: 'Lesão de Menisco Medial', isCorrect: false },
      { id: 'c', label: 'Lesão de Ligamento Cruzado Anterior', isCorrect: true },
      { id: 'd', label: 'Lesão de Ligamento Cruzado Posterior', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão de Ligamento Cruzado Anterior (LCA)',
    clinicalExplanation: 'O mecanismo de rotação com pé fixo é clássico para lesão de LCA. O estalo no momento da lesão, derrame rápido (hemartrose), sensação de falseio e testes específicos positivos (Lachman é o mais sensível, pivot shift o mais específico) confirmam o diagnóstico.',
    recommendedTests: ['Teste de Lachman (mais sensível)', 'Pivot shift (mais específico)', 'Gaveta anterior a 90°', 'Dial test para posterolateral', 'McMurray para meniscos associados'],
    initialTreatment: ['PRICE nas primeiras 72h', 'Recuperação de ADM', 'Controle do derrame', 'Fortalecimento isométrico inicial', 'Treino proprioceptivo precoce', 'Discutir opção cirúrgica vs conservadora'],
    tips: 'Até 50% das lesões de LCA têm lesão meniscal associada. Sempre avaliar meniscos mesmo com diagnóstico de LCA confirmado.'
  },
  {
    id: 'caso-015',
    title: 'Lesão Meniscal em Adulto',
    difficulty: 'medio',
    category: 'Joelho',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 42,
      gender: 'M',
      occupation: 'Engenheiro',
      lifestyle: 'Faz academia 3x/semana'
    },
    history: 'Dor no joelho direito há 4 semanas após agachar para pegar objeto. Sentiu dor aguda e dificuldade para estender o joelho completamente. Episódios de bloqueio articular.',
    symptoms: ['Dor em interlinha articular medial', 'Bloqueio articular', 'Dificuldade para extensão completa', 'Edema intermitente'],
    clinicalFindings: ['Dor à palpação da interlinha medial', 'McMurray positivo medial', 'Apley positivo', 'Extensão incompleta (-10°)', 'Lachman negativo'],
    diagnosticOptions: [
      { id: 'a', label: 'Lesão de LCA', isCorrect: false },
      { id: 'b', label: 'Lesão de Menisco Medial', isCorrect: true },
      { id: 'c', label: 'Artrose de Joelho', isCorrect: false },
      { id: 'd', label: 'Plica Sinovial', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão de Menisco Medial',
    clinicalExplanation: 'O mecanismo de torção em carga, dor em interlinha, bloqueio articular e McMurray positivo são característicos de lesão meniscal. A falta de extensão completa pode indicar fragmento instável.',
    recommendedTests: ['Teste de McMurray', 'Teste de Apley', 'Teste de Thessaly', 'Palpação de interlinhas', 'RM se cirurgia considerada'],
    initialTreatment: ['Crioterapia', 'Recuperação de ADM', 'Fortalecimento de quadríceps', 'Evitar agachamento profundo', 'Avaliação para artroscopia se bloqueio persistente']
  },
  {
    id: 'caso-016',
    title: 'Tendinopatia Patelar em Atleta',
    difficulty: 'medio',
    category: 'Joelho',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 25,
      gender: 'M',
      occupation: 'Jogador de basquete',
      lifestyle: 'Treina 5x/semana, muitos saltos'
    },
    history: 'Dor no polo inferior da patela há 3 meses. Piora ao saltar e agachar. Dor ao início do treino que melhora durante e retorna após. Aumentou volume de treino recentemente.',
    symptoms: ['Dor no polo inferior da patela', 'Piora ao saltar', 'Dor ao agachar', 'Rigidez matinal'],
    clinicalFindings: ['Dor focal no polo inferior da patela', 'Dor ao single leg decline squat', 'Força de quadríceps reduzida', 'Tendão espessado à palpação'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome Patelofemoral', isCorrect: false },
      { id: 'b', label: 'Tendinopatia Patelar (Jumpers Knee)', isCorrect: true },
      { id: 'c', label: 'Síndrome de Osgood-Schlatter', isCorrect: false },
      { id: 'd', label: 'Bursite Pré-patelar', isCorrect: false }
    ],
    correctDiagnosis: 'Tendinopatia Patelar (Jumpers Knee)',
    clinicalExplanation: 'A tendinopatia patelar é comum em atletas de salto. Dor localizada no polo inferior da patela, pior ao saltar e com decline squat positivo são patognomônicos. O aumento de carga precipita os sintomas.',
    recommendedTests: ['Palpação do tendão patelar', 'Single leg decline squat', 'Avaliação de força excêntrica', 'Ultrassonografia se necessário'],
    initialTreatment: ['Exercícios excêntricos (decline squat)', 'Isométricos para manejo da dor', 'Modificação do treino', 'Progressão gradual de carga', 'Evitar alongamento agressivo']
  },
  {
    id: 'caso-017',
    title: 'Artrose de Joelho em Idoso',
    difficulty: 'facil',
    category: 'Joelho',
    specialty: 'Geriátrica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 72,
      gender: 'F',
      occupation: 'Aposentada',
      lifestyle: 'Sedentária, sobrepeso'
    },
    history: 'Dor bilateral nos joelhos há 2 anos, progressiva. Piora ao caminhar e subir escadas. Rigidez matinal de 20 minutos. Crepitação audível.',
    symptoms: ['Dor bilateral', 'Rigidez matinal < 30min', 'Piora com atividade', 'Crepitação'],
    clinicalFindings: ['Crepitação fina à movimentação', 'Deformidade em varo bilateral', 'Flexão reduzida (110°)', 'Edema leve', 'Força preservada'],
    diagnosticOptions: [
      { id: 'a', label: 'Artrite Reumatoide', isCorrect: false },
      { id: 'b', label: 'Osteoartrose de Joelhos', isCorrect: true },
      { id: 'c', label: 'Artrite Gotosa', isCorrect: false },
      { id: 'd', label: 'Bursite Anserina', isCorrect: false }
    ],
    correctDiagnosis: 'Osteoartrose de Joelhos',
    clinicalExplanation: 'Osteoartrose é caracterizada por dor mecânica (piora com atividade), rigidez matinal curta (<30 min), crepitação, e frequentemente deformidade em varo. Diferente da artrite reumatoide que tem rigidez matinal prolongada.',
    recommendedTests: ['Radiografia AP em carga', 'Avaliação funcional', 'Questionário WOMAC', 'Avaliação de força'],
    initialTreatment: ['Exercício aeróbico de baixo impacto', 'Fortalecimento de quadríceps', 'Controle de peso', 'Hidroterapia', 'Termoterapia', 'Educação sobre proteção articular']
  },
  {
    id: 'caso-018',
    title: 'Síndrome da Banda Iliotibial',
    difficulty: 'medio',
    category: 'Joelho',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 30,
      gender: 'F',
      occupation: 'Corredora',
      lifestyle: 'Maratonista, 70km/semana'
    },
    history: 'Dor lateral no joelho direito há 6 semanas. Inicia após 5km de corrida, piora progressivamente. Alivia com repouso. Aumentou volume de treino para maratona.',
    symptoms: ['Dor lateral do joelho', 'Piora ao correr', 'Dor ao descer escadas', 'Início após certa distância'],
    clinicalFindings: ['Dor à palpação do epicôndilo lateral', 'Teste de Noble positivo', 'Teste de Ober positivo', 'Trendelenburg positivo', 'Dor a 30° de flexão'],
    diagnosticOptions: [
      { id: 'a', label: 'Lesão de LCL', isCorrect: false },
      { id: 'b', label: 'Síndrome da Banda Iliotibial', isCorrect: true },
      { id: 'c', label: 'Lesão de Menisco Lateral', isCorrect: false },
      { id: 'd', label: 'Tendinopatia do Bíceps Femoral', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome da Banda Iliotibial',
    clinicalExplanation: 'A SBIT é comum em corredores, especialmente com aumento de carga. A dor surge em distância específica, no epicôndilo lateral (zona de fricção a 30°). Teste de Noble e Ober positivos confirmam. Fraqueza de glúteo médio é fator contribuinte.',
    recommendedTests: ['Teste de Noble', 'Teste de Ober', 'Trendelenburg', 'Avaliação da biomecânica de corrida'],
    initialTreatment: ['Liberação miofascial da BIT', 'Fortalecimento de glúteo médio', 'Correção da biomecânica', 'Redução temporária do volume', 'Foam rolling']
  },
  {
    id: 'caso-019',
    title: 'Lesão do LCM em Futebol',
    difficulty: 'medio',
    category: 'Joelho',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 24,
      gender: 'M',
      occupation: 'Estudante universitário',
      lifestyle: 'Joga futebol 3x/semana'
    },
    history: 'Sofreu tackle lateral no joelho direito há 3 dias. Dor medial imediata. Edema moderado. Consegue caminhar com claudicação.',
    symptoms: ['Dor medial', 'Edema medial', 'Dificuldade para girar', 'Claudicação'],
    clinicalFindings: ['Dor à palpação do LCM', 'Estresse em valgo com abertura a 30°', 'Estresse em valgo estável em extensão', 'Lachman negativo', 'McMurray negativo'],
    diagnosticOptions: [
      { id: 'a', label: 'Lesão de LCA', isCorrect: false },
      { id: 'b', label: 'Lesão de LCM Grau II', isCorrect: true },
      { id: 'c', label: 'Lesão de Menisco Medial', isCorrect: false },
      { id: 'd', label: 'Fratura do Platô Tibial', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão de LCM Grau II',
    clinicalExplanation: 'O mecanismo de valgo forçado (tackle lateral) é clássico para LCM. Abertura com estresse em valgo a 30° mas estável em extensão indica Grau II (ruptura parcial). Grau III teria instabilidade também em extensão.',
    recommendedTests: ['Estresse em valgo a 0° e 30°', 'Lachman (descartar LCA)', 'McMurray (descartar menisco)', 'Radiografia se suspeita de fratura'],
    initialTreatment: ['Proteção com brace articulado', 'Crioterapia', 'ADM precoce protegida', 'Fortalecimento isométrico', 'Retorno gradual em 4-6 semanas']
  },
  {
    id: 'caso-020',
    title: 'Osgood-Schlatter em Adolescente',
    difficulty: 'facil',
    category: 'Joelho',
    specialty: 'Pediátrica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 13,
      gender: 'M',
      occupation: 'Estudante',
      lifestyle: 'Joga futebol na escolinha'
    },
    history: 'Dor na tuberosidade da tíbia há 2 meses. Piora ao chutar e saltar. Passou por estirão de crescimento recente.',
    symptoms: ['Dor na tuberosidade tibial', 'Piora ao chutar', 'Edema local', 'Dor ao ajoelhar'],
    clinicalFindings: ['Dor à palpação da tuberosidade tibial', 'Tuberosidade proeminente', 'Dor à extensão resistida', 'Sem instabilidade'],
    diagnosticOptions: [
      { id: 'a', label: 'Tendinopatia Patelar', isCorrect: false },
      { id: 'b', label: 'Doença de Osgood-Schlatter', isCorrect: true },
      { id: 'c', label: 'Síndrome Patelofemoral', isCorrect: false },
      { id: 'd', label: 'Fratura de Avulsão', isCorrect: false }
    ],
    correctDiagnosis: 'Doença de Osgood-Schlatter',
    clinicalExplanation: 'Apofisitite de tração comum em adolescentes em fase de crescimento. O estirão recente e demanda esportiva causam tração excessiva na inserção do tendão patelar. Condição autolimitada.',
    recommendedTests: ['Palpação da tuberosidade', 'Extensão resistida', 'Radiografia se dúvida'],
    initialTreatment: ['Modificação de atividade', 'Alongamento de quadríceps', 'Fortalecimento gradual', 'Gelo após atividade', 'Orientação sobre prognóstico favorável']
  },

  // ========== CERVICAL (21-25) ==========
  {
    id: 'caso-021',
    title: 'Cervicalgia com Cefaleia em Trabalhador de Escritório',
    difficulty: 'facil',
    category: 'Cervical',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 35,
      gender: 'F',
      occupation: 'Analista de sistemas',
      lifestyle: '8-10h/dia no computador, estresse alto'
    },
    history: 'Paciente refere dor na região posterior do pescoço e ombros há 6 semanas. Cefaleia frequente iniciando na nuca e irradiando para a região temporal. Piora ao final do dia de trabalho. Dificuldade para manter concentração.',
    symptoms: ['Dor cervical posterior bilateral', 'Dor em trapézio superior', 'Cefaleia cervicogênica', 'Piora ao final do dia', 'Rigidez matinal'],
    clinicalFindings: ['Postura anteriorizada de cabeça', 'Pontos-gatilho em trapézio superior e elevador da escápula', 'Limitação de rotação cervical bilateral', 'Teste de flexão-rotação positivo', 'Hipomobilidade em C1-C2', 'Fraqueza de flexores profundos do pescoço'],
    diagnosticOptions: [
      { id: 'a', label: 'Hérnia Discal Cervical', isCorrect: false },
      { id: 'b', label: 'Cefaleia Tensional Primária', isCorrect: false },
      { id: 'c', label: 'Cefaleia Cervicogênica com Disfunção Cervical', isCorrect: true },
      { id: 'd', label: 'Síndrome do Desfiladeiro Torácico', isCorrect: false }
    ],
    correctDiagnosis: 'Cefaleia Cervicogênica com Disfunção Cervical',
    clinicalExplanation: 'A cefaleia cervicogênica origina-se de estruturas da coluna cervical superior (C1-C3). Caracteriza-se por cefaleia iniciando na nuca, associada a disfunção cervical. A disfunção articular em C1-C2, postura anteriorizada e fraqueza de flexores profundos são achados típicos.',
    recommendedTests: ['Teste de flexão-rotação', 'Teste de flexão craniocervical', 'Palpação segmentar C0-C3', 'Avaliação postural', 'Screening de red flags cervicais'],
    initialTreatment: ['Mobilização articular cervical alta', 'Liberação de pontos-gatilho', 'Treino de flexores profundos (DCF)', 'Correção postural ergonômica', 'Exercícios de retração cervical', 'Pausas ativas durante trabalho']
  },
  {
    id: 'caso-022',
    title: 'Radiculopatia Cervical C6',
    difficulty: 'dificil',
    category: 'Cervical',
    specialty: 'Ortopédica',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 48,
      gender: 'M',
      occupation: 'Motorista',
      lifestyle: 'Sedentário, fumante'
    },
    history: 'Dor cervical há 3 semanas com irradiação para braço direito até polegar. Formigamento no polegar. Fraqueza para flexionar o cotovelo.',
    symptoms: ['Dor cervical com irradiação', 'Parestesia em polegar', 'Fraqueza de bíceps', 'Piora ao olhar para cima'],
    clinicalFindings: ['Spurling positivo à direita', 'Reflexo bicipital diminuído', 'Dermátomo C6 com hipoestesia', 'Força de bíceps 4/5', 'Teste de tração cervical alivia'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Túnel do Carpo', isCorrect: false },
      { id: 'b', label: 'Radiculopatia C6', isCorrect: true },
      { id: 'c', label: 'Tendinopatia do Bíceps', isCorrect: false },
      { id: 'd', label: 'Síndrome do Desfiladeiro', isCorrect: false }
    ],
    correctDiagnosis: 'Radiculopatia C6',
    clinicalExplanation: 'O padrão C6 inclui: dor irradiada para polegar, reflexo bicipital diminuído, dermátomo do polegar com alteração sensitiva, fraqueza de bíceps. Spurling positivo confirma compressão radicular.',
    recommendedTests: ['Teste de Spurling', 'Reflexo bicipital', 'Dermátomos C5-T1', 'Teste de tração cervical', 'Avaliação de força segmentar'],
    initialTreatment: ['Tração cervical manual', 'Mobilização neural', 'Posições de alívio', 'Fortalecimento isométrico', 'Encaminhar se déficit motor progressivo'],
    tips: 'Diferenciar de síndrome do túnel do carpo: STC afeta 3,5 dedos radiais, não apenas polegar, e reflexos estão normais.'
  },
  {
    id: 'caso-023',
    title: 'Whiplash (Chicotada)',
    difficulty: 'medio',
    category: 'Cervical',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 32,
      gender: 'F',
      occupation: 'Professora',
      lifestyle: 'Ativa'
    },
    history: 'Dor cervical há 1 semana após acidente de carro (colisão traseira). Dor difusa, rigidez importante. Cefaleia occipital. Tontura ocasional.',
    symptoms: ['Dor cervical difusa', 'Rigidez severa', 'Cefaleia occipital', 'Tontura', 'Dificuldade de concentração'],
    clinicalFindings: ['Espasmo de paravertebrais', 'ADM muito reduzida', 'Dor em todos os movimentos', 'Sem sinais neurológicos', 'Teste de artéria vertebral negativo'],
    diagnosticOptions: [
      { id: 'a', label: 'Fratura Cervical', isCorrect: false },
      { id: 'b', label: 'Lesão por Chicotada (WAD II)', isCorrect: true },
      { id: 'c', label: 'Hérnia Discal Cervical', isCorrect: false },
      { id: 'd', label: 'Lesão Medular', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão por Chicotada (WAD II)',
    clinicalExplanation: 'WAD (Whiplash Associated Disorders) Grau II: dor cervical com sinais musculoesqueléticos (limitação de ADM) mas sem sinais neurológicos. A tontura pode ser de origem cervical ou vestibular.',
    recommendedTests: ['Canadian C-Spine Rules (estabilidade)', 'Teste de artéria vertebral', 'Avaliação neurológica', 'Avaliação de prognostic factors'],
    initialTreatment: ['Educação sobre prognóstico favorável', 'Mobilização ativa precoce', 'Evitar colar cervical prolongado', 'Exercícios de amplitude', 'Manejo de fatores psicossociais']
  },
  {
    id: 'caso-024',
    title: 'Torcicolo Agudo',
    difficulty: 'facil',
    category: 'Cervical',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 28,
      gender: 'M',
      occupation: 'Designer',
      lifestyle: 'Usa computador extensivamente'
    },
    history: 'Acordou com dor cervical intensa e pescoço travado há 2 dias. Não consegue girar a cabeça para a direita. Dormiu com ar condicionado ligado.',
    symptoms: ['Dor cervical unilateral', 'Incapacidade de girar cabeça', 'Posição antálgica', 'Espasmo muscular'],
    clinicalFindings: ['Inclinação e rotação para esquerda', 'Espasmo palpável de ECM e escalenos', 'Dor intensa à rotação direita', 'Sem sinais neurológicos'],
    diagnosticOptions: [
      { id: 'a', label: 'Torcicolo Agudo (Bloqueio Facetário)', isCorrect: true },
      { id: 'b', label: 'Meningite', isCorrect: false },
      { id: 'c', label: 'Hérnia Discal', isCorrect: false },
      { id: 'd', label: 'Dissecção de Artéria Vertebral', isCorrect: false }
    ],
    correctDiagnosis: 'Torcicolo Agudo (Bloqueio Facetário)',
    clinicalExplanation: 'O torcicolo agudo é geralmente um bloqueio facetário ou espasmo muscular protetor. Posição antálgica típica, sem trauma significativo ou sinais neurológicos. Prognóstico excelente.',
    recommendedTests: ['Avaliação neurológica', 'Palpação segmentar', 'Red flags cervicais'],
    initialTreatment: ['Calor local', 'Mobilização suave', 'Técnicas de energia muscular', 'Medicação se necessário', 'Orientação de autocuidado']
  },
  {
    id: 'caso-025',
    title: 'Síndrome do Desfiladeiro Torácico',
    difficulty: 'dificil',
    category: 'Cervical',
    specialty: 'Ortopédica',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 26,
      gender: 'F',
      occupation: 'Violinista',
      lifestyle: 'Pratica 6h/dia, ombros caídos'
    },
    history: 'Parestesias difusas em mão esquerda há 4 meses. Piora ao tocar violino com braço elevado. Sensação de peso no braço. Mão fria ocasionalmente.',
    symptoms: ['Parestesias difusas na mão', 'Piora com elevação do braço', 'Fadiga do membro', 'Alterações vasomotoras'],
    clinicalFindings: ['Teste de Roos positivo', 'Teste de Adson positivo', 'Ombros anteriorizados', 'Tensão de escalenos', 'Phalen negativo'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Túnel do Carpo', isCorrect: false },
      { id: 'b', label: 'Radiculopatia C8-T1', isCorrect: false },
      { id: 'c', label: 'Síndrome do Desfiladeiro Torácico', isCorrect: true },
      { id: 'd', label: 'Neuropatia Cubital', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome do Desfiladeiro Torácico',
    clinicalExplanation: 'A SDT causa compressão neurovascular na região do desfiladeiro (entre escalenos ou sob peitoral menor). Sintomas difusos (não dermatomais), piora com elevação do braço e teste de Roos positivo são característicos.',
    recommendedTests: ['Teste de Roos (3 min)', 'Teste de Adson', 'Teste costoclavicular', 'Avaliação postural', 'Phalen (diferenciar STC)'],
    initialTreatment: ['Alongamento de escalenos', 'Correção postural', 'Fortalecimento de estabilizadores escapulares', 'Mobilização neural', 'Modificação da postura ao tocar']
  },

  // ========== TORNOZELO (26-30) ==========
  {
    id: 'caso-026',
    title: 'Entorse de Tornozelo em Inversão',
    difficulty: 'facil',
    category: 'Tornozelo',
    specialty: 'Esportiva',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 22,
      gender: 'M',
      occupation: 'Estudante universitário',
      lifestyle: 'Joga basquete 3x/semana'
    },
    history: 'Paciente sofreu entorse de tornozelo direito há 5 dias durante jogo de basquete. Pisou no pé de outro jogador ao aterrissar de um salto. Tornozelo virou "para dentro". Edema e equimose na região lateral.',
    symptoms: ['Dor lateral no tornozelo', 'Edema moderado lateral', 'Equimose inferior ao maléolo lateral', 'Dificuldade para apoiar peso'],
    clinicalFindings: ['Edema e equimose anterolateral', 'Dor à palpação do LTFA', 'Gaveta anterior positiva leve', 'Tilt talar levemente aumentado', 'Maléolos e base do 5º meta sem dor', 'Squeeze test negativo'],
    diagnosticOptions: [
      { id: 'a', label: 'Fratura do Maléolo Lateral', isCorrect: false },
      { id: 'b', label: 'Entorse Lateral Grau II', isCorrect: true },
      { id: 'c', label: 'Lesão da Sindesmose', isCorrect: false },
      { id: 'd', label: 'Fratura da Base do 5º Metatarso', isCorrect: false }
    ],
    correctDiagnosis: 'Entorse Lateral Grau II (Ruptura Parcial do LTFA)',
    clinicalExplanation: 'O mecanismo de inversão forçada causa lesão do complexo lateral, especialmente o LTFA. Grau II indica ruptura parcial. As Regras de Ottawa foram aplicadas: sem dor óssea em maléolos ou base do 5º metatarso.',
    recommendedTests: ['Regras de Ottawa', 'Teste de gaveta anterior', 'Teste de tilt talar', 'Squeeze test (sindesmose)', 'Palpação da base do 5º metatarso'],
    initialTreatment: ['PRICE primeiros 3-5 dias', 'Proteção com órtese funcional', 'Mobilização precoce ativa', 'Carga progressiva conforme tolerância', 'Propriocepção desde fase inicial', 'Fortalecimento de eversores']
  },
  {
    id: 'caso-027',
    title: 'Instabilidade Crônica de Tornozelo',
    difficulty: 'medio',
    category: 'Tornozelo',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 28,
      gender: 'F',
      occupation: 'Jogadora de vôlei',
      lifestyle: 'Atleta profissional'
    },
    history: 'História de 5 entorses de tornozelo direito nos últimos 3 anos. Sensação constante de instabilidade. Medo de aterrissar de saltos. Última entorse há 2 meses.',
    symptoms: ['Sensação de instabilidade', 'Entorses recorrentes', 'Medo de movimento', 'Fraqueza'],
    clinicalFindings: ['Gaveta anterior aumentada bilateral', 'Tilt talar positivo', 'Déficit de propriocepção', 'Fraqueza de fibulares', 'Atrofia de fibulares'],
    diagnosticOptions: [
      { id: 'a', label: 'Entorse Aguda Grau III', isCorrect: false },
      { id: 'b', label: 'Instabilidade Crônica de Tornozelo', isCorrect: true },
      { id: 'c', label: 'Lesão Osteocondral de Tálus', isCorrect: false },
      { id: 'd', label: 'Tendinopatia Fibular', isCorrect: false }
    ],
    correctDiagnosis: 'Instabilidade Crônica de Tornozelo',
    clinicalExplanation: 'Após múltiplas entorses, há déficit mecânico (frouxidão ligamentar) e funcional (propriocepção e força). Ambos contribuem para recidivas. Programa de reabilitação intensivo pode evitar cirurgia.',
    recommendedTests: ['Gaveta anterior bilateral', 'Tilt talar', 'SEBT (Star Excursion)', 'Força de eversores', 'Questionário CAIT'],
    initialTreatment: ['Treino proprioceptivo intensivo', 'Fortalecimento de fibulares', 'Treino de equilíbrio', 'Pliometria progressiva', 'Uso de órtese em esporte', 'Avaliação para cirurgia se falha conservadora']
  },
  {
    id: 'caso-028',
    title: 'Tendinopatia de Aquiles',
    difficulty: 'medio',
    category: 'Tornozelo',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 45,
      gender: 'M',
      occupation: 'Corredor recreativo',
      lifestyle: 'Corre 30km/semana, aumentou treino'
    },
    history: 'Dor no tendão de Aquiles há 2 meses. Dor e rigidez matinal. Piora ao iniciar corrida, melhora durante, retorna após. Nódulo palpável.',
    symptoms: ['Dor no tendão de Aquiles', 'Rigidez matinal', 'Dor ao iniciar atividade', 'Espessamento do tendão'],
    clinicalFindings: ['Espessamento palpável 2-6cm da inserção', 'Teste de Arc sign positivo', 'Teste de Royal London Hospital positivo', 'Dorsiflexão reduzida'],
    diagnosticOptions: [
      { id: 'a', label: 'Bursite Retrocalcânea', isCorrect: false },
      { id: 'b', label: 'Tendinopatia de Aquiles de Porção Média', isCorrect: true },
      { id: 'c', label: 'Ruptura Parcial do Aquiles', isCorrect: false },
      { id: 'd', label: 'Fasceíte Plantar', isCorrect: false }
    ],
    correctDiagnosis: 'Tendinopatia de Aquiles de Porção Média',
    clinicalExplanation: 'A localização 2-6cm da inserção indica porção média (mais comum). O padrão warm-up (melhora durante atividade) e espessamento são típicos. Aumento de carga é fator precipitante comum.',
    recommendedTests: ['Palpação do tendão', 'Teste de Arc sign', 'Royal London Hospital test', 'Avaliação de força excêntrica'],
    initialTreatment: ['Exercícios excêntricos (protocolo Alfredson)', 'Isométricos para manejo da dor', 'Redução temporária da carga', 'Evitar alongamento agressivo', 'Progressão gradual']
  },
  {
    id: 'caso-029',
    title: 'Fasceíte Plantar',
    difficulty: 'facil',
    category: 'Tornozelo',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 52,
      gender: 'F',
      occupation: 'Enfermeira',
      lifestyle: 'Trabalha em pé 12h, sobrepeso'
    },
    history: 'Dor na planta do pé, região do calcanhar, há 3 meses. Piora ao dar os primeiros passos de manhã. Melhora após caminhar um pouco. Retorna ao final do dia.',
    symptoms: ['Dor no calcanhar', 'Piora matinal', 'Melhora com movimento', 'Piora após ficar muito em pé'],
    clinicalFindings: ['Dor à palpação da tuberosidade medial do calcâneo', 'Windlass test positivo', 'Encurtamento de gastrocnêmios', 'Pé plano flexível'],
    diagnosticOptions: [
      { id: 'a', label: 'Síndrome do Túnel do Tarso', isCorrect: false },
      { id: 'b', label: 'Fasceíte Plantar', isCorrect: true },
      { id: 'c', label: 'Fratura de Estresse do Calcâneo', isCorrect: false },
      { id: 'd', label: 'Esporão de Calcâneo Sintomático', isCorrect: false }
    ],
    correctDiagnosis: 'Fasceíte Plantar',
    clinicalExplanation: 'A dor matinal que melhora com movimento e retorna após períodos em pé é clássica. O windlass test confirma envolvimento da fáscia. Sobrepeso e tempo prolongado em pé são fatores de risco.',
    recommendedTests: ['Palpação da inserção da fáscia', 'Windlass test', 'Avaliação da dorsiflexão', 'Análise do pé'],
    initialTreatment: ['Alongamento de fáscia e gastrocnêmios', 'Fortalecimento intrínseco', 'Palmilhas se indicado', 'Calçado adequado', 'Night splint se sintomas matinais severos']
  },
  {
    id: 'caso-030',
    title: 'Lesão de Sindesmose',
    difficulty: 'dificil',
    category: 'Tornozelo',
    specialty: 'Esportiva',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 26,
      gender: 'M',
      occupation: 'Jogador de futebol',
      lifestyle: 'Atleta profissional'
    },
    history: 'Sofreu entorse há 10 dias em rotação externa forçada. Dor persistente acima do tornozelo. Não consegue correr. Pouco edema visível.',
    symptoms: ['Dor anterolateral acima do tornozelo', 'Dificuldade para correr', 'Dor ao subir escadas', 'Pouco edema'],
    clinicalFindings: ['Squeeze test positivo', 'Teste de rotação externa positivo', 'Dor à palpação da sindesmose', 'Gaveta anterior negativa', 'Dor na perna ao caminhar'],
    diagnosticOptions: [
      { id: 'a', label: 'Entorse Lateral Grau I', isCorrect: false },
      { id: 'b', label: 'Lesão de Sindesmose (High Ankle Sprain)', isCorrect: true },
      { id: 'c', label: 'Fratura do Maléolo Posterior', isCorrect: false },
      { id: 'd', label: 'Tendinopatia Fibular', isCorrect: false }
    ],
    correctDiagnosis: 'Lesão de Sindesmose (High Ankle Sprain)',
    clinicalExplanation: 'O mecanismo de rotação externa forçada, squeeze test positivo e dor acima da interlinha são característicos. A sindesmose une tíbia e fíbula. Recuperação é mais longa que entorse lateral comum.',
    recommendedTests: ['Squeeze test', 'Teste de rotação externa', 'Teste de Cotton', 'Radiografia com estresse', 'RM se dúvida'],
    initialTreatment: ['Proteção prolongada', 'Descarga de peso inicial', 'Progressão lenta', 'Tempo de recuperação: 6-12 semanas', 'Avaliar necessidade de cirurgia se instável']
  },

  // ========== QUADRIL (31-35) ==========
  {
    id: 'caso-031',
    title: 'Dor no Quadril em Corredor',
    difficulty: 'medio',
    category: 'Quadril',
    specialty: 'Esportiva',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 42,
      gender: 'F',
      occupation: 'Advogada',
      lifestyle: 'Corrida 4x/semana, 40km/semana, preparando meia maratona'
    },
    history: 'Corredora refere dor lateral no quadril direito há 3 semanas. Iniciou quando aumentou volume de treino. Dor ao correr, subir escadas e ao deitar do lado afetado à noite.',
    symptoms: ['Dor lateral no quadril/trocânter', 'Piora ao correr e subir escadas', 'Dor ao deitar do lado afetado', 'Dor ao levantar após sentar'],
    clinicalFindings: ['Dor à palpação do trocânter maior', 'FABER test com dor lateral', 'Teste de Ober positivo', 'Single leg stance com Trendelenburg positivo', 'Fraqueza de glúteo médio 4/5', 'ADM preservada'],
    diagnosticOptions: [
      { id: 'a', label: 'Artrose de Quadril', isCorrect: false },
      { id: 'b', label: 'Lesão Labral do Quadril', isCorrect: false },
      { id: 'c', label: 'Síndrome da Dor Trocantérica (Tendinopatia Glútea)', isCorrect: true },
      { id: 'd', label: 'Radiculopatia L2-L3', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome da Dor Trocantérica (Tendinopatia Glútea)',
    clinicalExplanation: 'A dor trocantérica em corredores geralmente indica tendinopatia dos glúteos médio/mínimo. Fatores: aumento de carga, fraqueza de glúteo médio, encurtamento de TIT. ADM preservada afasta patologias intra-articulares.',
    recommendedTests: ['Palpação do trocânter maior', 'Single leg stance/Trendelenburg', 'FADER test', 'Teste de Ober', 'Força de abdutores'],
    initialTreatment: ['Redução temporária do volume de corrida', 'Fortalecimento isométrico de glúteo médio', 'Progressão para excêntricos', 'Evitar posições de compressão', 'Avaliar biomecânica da corrida']
  },
  {
    id: 'caso-032',
    title: 'Impacto Femoroacetabular',
    difficulty: 'dificil',
    category: 'Quadril',
    specialty: 'Esportiva',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 28,
      gender: 'M',
      occupation: 'Praticante de jiu-jitsu',
      lifestyle: 'Treina 5x/semana'
    },
    history: 'Dor na virilha há 4 meses. Piora ao agachar profundo e em posições de guarda. Sensação de travamento ocasional. Rigidez após treino.',
    symptoms: ['Dor na virilha', 'Piora ao agachar', 'Travamento', 'Rigidez', 'Dor em flexão + rotação'],
    clinicalFindings: ['FADIR positivo', 'FABER limitado', 'Dor em flexão > 90° + RI', 'ADM de rotação interna reduzida', 'Força preservada'],
    diagnosticOptions: [
      { id: 'a', label: 'Pubalgia Atlética', isCorrect: false },
      { id: 'b', label: 'Impacto Femoroacetabular (FAI)', isCorrect: true },
      { id: 'c', label: 'Artrose de Quadril Inicial', isCorrect: false },
      { id: 'd', label: 'Lesão de Adutor', isCorrect: false }
    ],
    correctDiagnosis: 'Impacto Femoroacetabular (FAI)',
    clinicalExplanation: 'O FAI causa conflito entre fêmur e acetábulo, especialmente em flexão + rotação interna. FADIR positivo é característico. Comum em atletas de esportes com agachamento profundo. Pode haver lesão labral associada.',
    recommendedTests: ['FADIR test', 'FABER test', 'Avaliação de ADM', 'Radiografia AP de pelve', 'RM com artro se suspeita de lesão labral'],
    initialTreatment: ['Modificação de atividade', 'Evitar amplitudes extremas', 'Fortalecimento de estabilizadores', 'Mobilização articular', 'Avaliação para artroscopia se refratário']
  },
  {
    id: 'caso-033',
    title: 'Artrose de Quadril',
    difficulty: 'facil',
    category: 'Quadril',
    specialty: 'Geriátrica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 65,
      gender: 'M',
      occupation: 'Aposentado',
      lifestyle: 'Sedentário, ex-trabalhador braçal'
    },
    history: 'Dor no quadril direito há 2 anos, progressiva. Dor na virilha e coxa. Rigidez matinal. Claudicação. Dificuldade para calçar meias.',
    symptoms: ['Dor na virilha irradiando para coxa', 'Rigidez matinal <30min', 'Claudicação', 'Limitação funcional progressiva'],
    clinicalFindings: ['Padrão capsular (RI > extensão > abdução)', 'Trendelenburg positivo', 'Flexão 90°, RI 5°, RE 25°', 'Dor ao final da ADM', 'Encurtamento funcional'],
    diagnosticOptions: [
      { id: 'a', label: 'Bursite Trocantérica', isCorrect: false },
      { id: 'b', label: 'Coxartrose (Artrose de Quadril)', isCorrect: true },
      { id: 'c', label: 'Necrose Avascular', isCorrect: false },
      { id: 'd', label: 'Síndrome do Piriforme', isCorrect: false }
    ],
    correctDiagnosis: 'Coxartrose (Artrose de Quadril)',
    clinicalExplanation: 'O padrão capsular (maior limitação de RI), rigidez matinal curta, progressão lenta e achados radiológicos confirmam OA de quadril. Diferente da bursite que tem dor lateral, não virilha.',
    recommendedTests: ['Avaliação de ADM', 'Radiografia AP de pelve', 'Questionário HOOS', 'Força muscular'],
    initialTreatment: ['Exercício aeróbico de baixo impacto', 'Fortalecimento de abdutores e extensores', 'Alongamento de flexores', 'Hidroterapia', 'Perda de peso se indicado', 'Avaliar artroplastia se conservador falhar']
  },
  {
    id: 'caso-034',
    title: 'Pubalgia Atlética',
    difficulty: 'dificil',
    category: 'Quadril',
    specialty: 'Esportiva',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 24,
      gender: 'M',
      occupation: 'Jogador de futebol',
      lifestyle: 'Atleta profissional'
    },
    history: 'Dor na região do púbis e virilha bilateral há 3 meses. Piora ao chutar e mudar de direção. Dor ao tossir e espirrar. Já fez repouso sem melhora completa.',
    symptoms: ['Dor púbica bilateral', 'Piora ao chutar', 'Dor ao tossir/espirrar', 'Dor ao levantar da cama'],
    clinicalFindings: ['Dor à palpação da sínfise púbica', 'Dor à adução resistida', 'Squeeze test positivo', 'Assimetria de força adutores/abdominais', 'Sem sinais de FAI'],
    diagnosticOptions: [
      { id: 'a', label: 'Lesão de Adutor', isCorrect: false },
      { id: 'b', label: 'Pubalgia Atlética (Osteíte Púbica)', isCorrect: true },
      { id: 'c', label: 'Hérnia Inguinal', isCorrect: false },
      { id: 'd', label: 'Impacto Femoroacetabular', isCorrect: false }
    ],
    correctDiagnosis: 'Pubalgia Atlética (Osteíte Púbica)',
    clinicalExplanation: 'A pubalgia é um complexo de disfunção na região púbica envolvendo adutores, reto abdominal e sínfise púbica. O desequilíbrio de força e sobrecarga são fatores chave. Tratamento conservador é prolongado.',
    recommendedTests: ['Palpação da sínfise', 'Squeeze test', 'Força de adutores', 'Força abdominal', 'Radiografia/RM da sínfise'],
    initialTreatment: ['Repouso relativo de atividades provocativas', 'Reeequilíbrio muscular (protocolo Copenhagen)', 'Fortalecimento de core', 'Progressão gradual de carga', 'Retorno ao esporte: 3-6 meses']
  },
  {
    id: 'caso-035',
    title: 'Fratura de Estresse do Colo Femoral',
    difficulty: 'dificil',
    category: 'Quadril',
    specialty: 'Esportiva',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 22,
      gender: 'F',
      occupation: 'Corredora de elite',
      lifestyle: 'Corre 100km/semana, baixo peso, amenorreia'
    },
    history: 'Dor progressiva na virilha há 3 semanas. Inicialmente só ao correr, agora também ao caminhar. Aumento abrupto do treino há 2 meses. Restrição alimentar.',
    symptoms: ['Dor na virilha progressiva', 'Dor ao apoiar peso', 'Piora com atividade', 'Dor noturna'],
    clinicalFindings: ['Dor à palpação inguinal', 'Dor ao hop test', 'Dor em rotação do quadril', 'Marcha antálgica', 'IMC baixo'],
    diagnosticOptions: [
      { id: 'a', label: 'Tendinopatia de Psoas', isCorrect: false },
      { id: 'b', label: 'Fratura de Estresse do Colo Femoral', isCorrect: true },
      { id: 'c', label: 'Pubalgia', isCorrect: false },
      { id: 'd', label: 'Bursite Iliopectínea', isCorrect: false }
    ],
    correctDiagnosis: 'Fratura de Estresse do Colo Femoral',
    clinicalExplanation: 'RED FLAGS: atleta feminina, baixo peso, amenorreia (Tríade da Atleta), aumento de carga, dor progressiva. Fratura de estresse do colo femoral é emergência ortopédica - risco de fratura completa.',
    recommendedTests: ['ENCAMINHAR IMEDIATAMENTE', 'RM urgente', 'Avaliação de densidade óssea', 'Avaliação nutricional'],
    initialTreatment: ['NÃO CAMINHAR - MULETAS', 'Encaminhamento ortopédico urgente', 'Descarga completa até diagnóstico', 'Abordar fatores de risco (nutrição, menstruação)'],
    tips: 'Fratura de estresse do colo femoral é EMERGÊNCIA. Se deslocar, pode comprometer irrigação da cabeça femoral e causar necrose avascular.'
  },

  // ========== PUNHO E MÃO (36-40) ==========
  {
    id: 'caso-036',
    title: 'Formigamento nas Mãos com Piora Noturna',
    difficulty: 'medio',
    category: 'Punho e Mão',
    specialty: 'Ortopédica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 48,
      gender: 'F',
      occupation: 'Caixa de supermercado',
      lifestyle: 'Trabalha 8h/dia com movimentos repetitivos'
    },
    history: 'Paciente refere formigamento e dormência em ambas as mãos há 4 meses, pior à direita. Acorda à noite com os sintomas e precisa sacudir as mãos para melhorar. Dificuldade para abotoar roupas.',
    symptoms: ['Parestesia em polegar, indicador, médio e metade do anelar', 'Piora noturna', 'Necessidade de sacudir as mãos (Flick sign)', 'Fraqueza de preensão'],
    clinicalFindings: ['Teste de Phalen positivo bilateral', 'Teste de Tinel positivo no túnel do carpo', 'Hipoestesia em território do mediano', 'Atrofia leve de tenar à direita', 'Fraqueza de oponência do polegar'],
    diagnosticOptions: [
      { id: 'a', label: 'Radiculopatia Cervical C6-C7', isCorrect: false },
      { id: 'b', label: 'Síndrome do Túnel do Carpo', isCorrect: true },
      { id: 'c', label: 'Síndrome do Desfiladeiro Torácico', isCorrect: false },
      { id: 'd', label: 'Neuropatia Periférica Diabética', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome do Túnel do Carpo',
    clinicalExplanation: 'A STC é a neuropatia compressiva mais comum. Parestesia no território do mediano, piora noturna, Flick sign e testes de Phalen e Tinel positivos são característicos. Bilateral é comum.',
    recommendedTests: ['Teste de Phalen', 'Teste de Tinel no carpo', 'Teste de compressão do carpo', 'Avaliação de sensibilidade', 'Screening cervical'],
    initialTreatment: ['Órtese noturna em posição neutra', 'Deslizamento neural do mediano', 'Modificação ergonômica', 'Alongamentos de flexores do punho', 'Encaminhar para ENMG se grave']
  },
  {
    id: 'caso-037',
    title: 'Tendinite de De Quervain',
    difficulty: 'facil',
    category: 'Punho e Mão',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 35,
      gender: 'F',
      occupation: 'Mãe recente',
      lifestyle: 'Carrega bebê frequentemente'
    },
    history: 'Dor no lado radial do punho há 6 semanas. Piora ao pegar o bebê e ao fazer movimento de pinça. Edema sobre a estilóide radial.',
    symptoms: ['Dor radial do punho', 'Piora ao segurar objetos', 'Edema local', 'Dor ao movimentar polegar'],
    clinicalFindings: ['Teste de Finkelstein positivo', 'Dor à palpação do 1º compartimento', 'Crepitação palpável', 'Dor à abdução do polegar resistida'],
    diagnosticOptions: [
      { id: 'a', label: 'Artrose Trapéziometacárpica', isCorrect: false },
      { id: 'b', label: 'Tendinite de De Quervain', isCorrect: true },
      { id: 'c', label: 'Síndrome de Intersecção', isCorrect: false },
      { id: 'd', label: 'Fratura do Escafoide', isCorrect: false }
    ],
    correctDiagnosis: 'Tendinite de De Quervain',
    clinicalExplanation: 'Tenossinovite estenosante do 1º compartimento extensor (APL e EPB). Muito comum em mães recentes pelo movimento repetitivo de pegar bebê. Finkelstein positivo é patognomônico.',
    recommendedTests: ['Teste de Finkelstein', 'Palpação do 1º compartimento', 'Avaliação de força de pinça'],
    initialTreatment: ['Órtese que inclua polegar', 'Crioterapia', 'Modificação de atividade', 'Deslizamento tendinoso', 'Considerar infiltração se refratário']
  },
  {
    id: 'caso-038',
    title: 'Síndrome de Dor Complexa Regional',
    difficulty: 'dificil',
    category: 'Punho e Mão',
    specialty: 'Ortopédica',
    estimatedTime: '4-5 min',
    patientProfile: {
      age: 38,
      gender: 'F',
      occupation: 'Professora',
      lifestyle: 'Ansiosa, perfeccionista'
    },
    history: 'Paciente fraturou rádio distal há 4 meses, imobilizada por 6 semanas. Após retirada do gesso, a dor não melhorou e tem piorado progressivamente. Mão inchada, quente, dolorida ao menor toque.',
    symptoms: ['Dor desproporcional', 'Alodinia', 'Edema persistente', 'Alterações de cor', 'Hipersudorese'],
    clinicalFindings: ['Edema difuso do dorso da mão', 'Pele brilhante e eritematosa', 'Hiperalgesia e alodinia', 'Temperatura assimétrica', 'Rigidez articular', 'Fraqueza por desuso'],
    diagnosticOptions: [
      { id: 'a', label: 'Rigidez pós-imobilização', isCorrect: false },
      { id: 'b', label: 'Síndrome de Dor Complexa Regional (SDCR)', isCorrect: true },
      { id: 'c', label: 'Infecção de partes moles', isCorrect: false },
      { id: 'd', label: 'Trombose venosa profunda', isCorrect: false }
    ],
    correctDiagnosis: 'Síndrome de Dor Complexa Regional (SDCR) Tipo I',
    clinicalExplanation: 'A SDCR é caracterizada por dor desproporcional, alterações sensoriais (alodinia, hiperalgesia), vasomotoras, sudomotoras e motoras/tróficas. Frequentemente ocorre após trauma. Tratamento precoce é crucial.',
    recommendedTests: ['Critérios de Budapeste', 'Avaliação de temperatura bilateral', 'Escala de dor e funcionalidade', 'Avaliação psicológica'],
    initialTreatment: ['Abordagem multidisciplinar', 'Dessensibilização gradual', 'Imageria motora gradual (GMI)', 'Terapia de espelho', 'Mobilização suave', 'Educação em dor', 'Encaminhar para equipe de dor']
  },
  {
    id: 'caso-039',
    title: 'Dedo em Gatilho',
    difficulty: 'facil',
    category: 'Punho e Mão',
    specialty: 'Ortopédica',
    estimatedTime: '2-3 min',
    patientProfile: {
      age: 55,
      gender: 'F',
      occupation: 'Costureira',
      lifestyle: 'Trabalho manual intenso'
    },
    history: 'Dificuldade para estender o dedo anelar direito há 2 meses. Dedo trava em flexão e precisa forçar para estender. Piora pela manhã.',
    symptoms: ['Dedo travando em flexão', 'Clique ao estender', 'Dor na palma', 'Rigidez matinal'],
    clinicalFindings: ['Nódulo palpável na polia A1', 'Gatilhamento ao estender', 'Dor à palpação da polia A1', 'Limitação de flexão da IFD'],
    diagnosticOptions: [
      { id: 'a', label: 'Contratura de Dupuytren', isCorrect: false },
      { id: 'b', label: 'Tenossinovite Estenosante (Dedo em Gatilho)', isCorrect: true },
      { id: 'c', label: 'Artrose da IFP', isCorrect: false },
      { id: 'd', label: 'Ruptura de Tendão Flexor', isCorrect: false }
    ],
    correctDiagnosis: 'Tenossinovite Estenosante (Dedo em Gatilho)',
    clinicalExplanation: 'O dedo em gatilho ocorre quando o tendão flexor engrossa e não passa suavemente pela polia A1. O nódulo palpável e gatilhamento são patognomônicos. Comum em trabalho manual repetitivo.',
    recommendedTests: ['Palpação da polia A1', 'Flexão e extensão ativa', 'Avaliação de nódulo'],
    initialTreatment: ['Órtese em extensão', 'Deslizamento tendinoso', 'Modificação de atividade', 'Infiltração de corticoide', 'Cirurgia se falha conservadora']
  },
  {
    id: 'caso-040',
    title: 'Rizartrose',
    difficulty: 'medio',
    category: 'Punho e Mão',
    specialty: 'Geriátrica',
    estimatedTime: '3-4 min',
    patientProfile: {
      age: 62,
      gender: 'F',
      occupation: 'Aposentada',
      lifestyle: 'Faz artesanato'
    },
    history: 'Dor na base do polegar há 1 ano, progressiva. Dificuldade para abrir potes e segurar objetos pequenos. Deformidade visível.',
    symptoms: ['Dor na base do polegar', 'Fraqueza de pinça', 'Deformidade', 'Rigidez'],
    clinicalFindings: ['Deformidade em Z do polegar', 'Teste de Grind positivo', 'Crepitação à movimentação', 'Subluxação da TMC', 'Dor à pinça'],
    diagnosticOptions: [
      { id: 'a', label: 'Tendinite de De Quervain', isCorrect: false },
      { id: 'b', label: 'Rizartrose (Artrose Trapéziometacárpica)', isCorrect: true },
      { id: 'c', label: 'Síndrome do Túnel do Carpo', isCorrect: false },
      { id: 'd', label: 'Tenossinovite do FLP', isCorrect: false }
    ],
    correctDiagnosis: 'Rizartrose (Artrose Trapéziometacárpica)',
    clinicalExplanation: 'A rizartrose é a artrose mais comum da mão. Afeta a articulação trapéziometacárpica, essencial para a função de pinça. Teste de Grind e deformidade em Z são característicos.',
    recommendedTests: ['Teste de Grind', 'Palpação da TMC', 'Força de pinça', 'Radiografia'],
    initialTreatment: ['Órtese para TMC', 'Proteção articular', 'Fortalecimento de oponente', 'Termoterapia', 'Adaptações para AVD', 'Considerar cirurgia se grave']
  }
];

export const caseCategories = [
  'Ombro',
  'Coluna Lombar',
  'Joelho',
  'Cervical',
  'Tornozelo',
  'Quadril',
  'Punho e Mão'
];

export const getRandomCase = () =>
  clinicalCases[Math.floor(Math.random() * clinicalCases.length)];
