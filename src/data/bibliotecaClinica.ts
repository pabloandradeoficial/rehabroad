export interface BibliotecaArtigo {
  id: string;
  slug: string;
  title: string;
  category: "testes-ortopedicos" | "eletroterapia" | "escalas-clinicas" | "red-flags";
  categoryLabel: string;
  keywords: string[];
  metaDescription: string;
  resumo: string;
  oQueE: string;
  comoRealizar: string[];
  interpretacao: string;
  evidencia: string;
  aplicacao: string;
  dicasPraticas?: string[];
  cuidados?: string[];
  imagemAlt?: string;
}

export const categorias = [
  { id: "testes-ortopedicos", label: "Testes Ortopédicos", icon: "Stethoscope", description: "Manobras clínicas para avaliação musculoesquelética" },
  { id: "eletroterapia", label: "Eletroterapia", icon: "Zap", description: "Parâmetros e protocolos de recursos eletroterapêuticos" },
  { id: "escalas-clinicas", label: "Escalas Clínicas", icon: "ClipboardList", description: "Instrumentos de avaliação padronizados" },
  { id: "red-flags", label: "Red Flags", icon: "AlertTriangle", description: "Sinais de alerta para encaminhamento médico" },
];

export const artigos: BibliotecaArtigo[] = [
  // ============ TESTES ORTOPÉDICOS ============
  {
    id: "1",
    slug: "teste-de-lasegue",
    title: "Teste de Lasègue (Elevação da Perna Reta)",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste de lasegue", "lasegue positivo", "elevação perna reta", "ciática", "hérnia de disco", "radiculopatia lombar", "fisioterapia coluna"],
    metaDescription: "Aprenda a realizar o Teste de Lasègue (SLR) na fisioterapia. Técnica, interpretação clínica e evidência científica para avaliação de radiculopatia lombar e hérnia de disco.",
    resumo: "O Teste de Lasègue é fundamental para avaliar irritação radicular lombar e suspeita de hérnia de disco. Sensibilidade de 91% para radiculopatia L5-S1.",
    oQueE: "O Teste de Lasègue, também conhecido como Straight Leg Raise (SLR), é uma manobra de provocação neural utilizada para identificar irritação das raízes nervosas lombares, especialmente L5 e S1. É considerado um dos testes mais importantes na avaliação de pacientes com lombalgia e suspeita de hérnia discal.",
    comoRealizar: [
      "Posicione o paciente em decúbito dorsal (deitado de costas) com os membros inferiores estendidos",
      "Estabilize a pelve do paciente com uma mão",
      "Com a outra mão, eleve passivamente o membro inferior testado, mantendo o joelho em extensão completa",
      "Observe a amplitude de movimento e o surgimento de sintomas",
      "Continue a elevação até o paciente relatar dor ou desconforto, ou até atingir 70-90°",
      "Registre o ângulo em que os sintomas aparecem e sua localização"
    ],
    interpretacao: "O teste é considerado POSITIVO quando a elevação da perna reproduz dor radicular (irradiada para a perna seguindo dermátomo) entre 30° e 70° de flexão do quadril. Dor apenas na região lombar ou na face posterior da coxa (tensão de isquiotibiais) NÃO constitui teste positivo. A dor deve irradiar abaixo do joelho para maior especificidade. O Lasègue cruzado (dor na perna afetada ao elevar a perna contralateral) é altamente específico para hérnia discal.",
    evidencia: "Meta-análise de Deville et al. (2000) demonstrou sensibilidade de 91% e especificidade de 26% para radiculopatia confirmada por cirurgia. O teste cruzado apresenta especificidade de 88%, sendo altamente sugestivo de hérnia discal quando positivo. Estudos mais recentes confirmam seu valor como teste de triagem inicial.",
    aplicacao: "Indicado na avaliação inicial de pacientes com lombalgia e suspeita de comprometimento radicular. Deve ser combinado com outros testes neurológicos (reflexos, força, sensibilidade) para aumentar acurácia diagnóstica. Em casos positivos, considerar exames de imagem e encaminhamento médico se sintomas neurológicos progressivos.",
    dicasPraticas: [
      "Realize o teste bilateralmente para comparação",
      "Documente o ângulo exato de positividade",
      "Teste de sensibilização: dorsiflexão do tornozelo aumenta tensão neural",
      "Diferencie dor radicular de tensão muscular"
    ],
    cuidados: [
      "Contraindicado em suspeita de síndrome da cauda equina",
      "Evitar força excessiva na elevação",
      "Atenção a sinais de mielopatia"
    ],
    imagemAlt: "Fisioterapeuta realizando teste de Lasègue em paciente deitado"
  },
  {
    id: "2",
    slug: "teste-slump-fisioterapia",
    title: "Teste Slump: Avaliação da Mobilidade Neural",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste slump fisioterapia", "slump test", "mobilidade neural", "tensão neural", "dor lombar", "ciática", "neurodinâmica"],
    metaDescription: "Guia completo do Teste Slump para fisioterapeutas. Como realizar, interpretar e aplicar clinicamente na avaliação de mobilidade neural e dor lombar irradiada.",
    resumo: "O Teste Slump avalia a mobilidade do sistema nervoso e é mais sensível que o Lasègue para detectar irritação neural em posições funcionais.",
    oQueE: "O Teste Slump é uma avaliação neurodinâmica que tensiona progressivamente todo o sistema nervoso, desde o neuroeixo até os nervos periféricos. Desenvolvido por Maitland, permite identificar comprometimento da mobilidade neural que pode não ser detectado pelo teste de Lasègue isolado.",
    comoRealizar: [
      "Paciente sentado na borda da maca com coxas apoiadas e pés fora do chão",
      "Instrua o paciente a 'desabar' o tronco (flexão torácica e lombar) mantendo a cervical neutra",
      "Adicione flexão cervical (queixo no peito)",
      "Mantenha a posição e estenda o joelho do lado testado",
      "Adicione dorsiflexão do tornozelo",
      "Para diferenciação estrutural: libere a flexão cervical e observe mudança nos sintomas"
    ],
    interpretacao: "POSITIVO quando reproduz os sintomas do paciente (dor, parestesia) e esses sintomas DIMINUEM com a liberação da flexão cervical (diferenciação estrutural). A comparação bilateral é essencial. Assimetria significativa (>10° de extensão do joelho) sugere restrição neural. Sintomas puramente locais sem componente neural devem ser diferenciados.",
    evidencia: "Estudos de Philip et al. demonstraram sensibilidade de 84% e especificidade de 83% para radiculopatia lombar. Walsh & Hall (2009) encontraram boa confiabilidade inter-examinador (kappa 0.83). O teste é considerado complementar ao Lasègue, aumentando a acurácia diagnóstica quando combinados.",
    aplicacao: "Ideal para pacientes com sintomas posturais ou em atividades sentadas. Útil na diferenciação entre dor de origem neural versus muscular/articular. Pode ser adaptado para avaliar diferentes trajetos nervosos (ciático, femoral). Fundamental no planejamento de técnicas de mobilização neural.",
    dicasPraticas: [
      "Padronize a sequência de componentes",
      "Use a diferenciação estrutural para confirmar origem neural",
      "Compare sempre bilateralmente",
      "Documente qual componente reproduz os sintomas"
    ],
    cuidados: [
      "Progredir lentamente em pacientes irritáveis",
      "Evitar em suspeita de instabilidade cervical",
      "Monitorar sinais de irritação dural excessiva"
    ],
    imagemAlt: "Paciente em posição de teste Slump com fisioterapeuta"
  },
  {
    id: "3",
    slug: "teste-neer-ombro",
    title: "Teste de Neer: Impacto Subacromial do Ombro",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste de neer", "impacto subacromial", "síndrome do impacto", "dor no ombro", "manguito rotador", "fisioterapia ombro"],
    metaDescription: "Aprenda o Teste de Neer para avaliação de síndrome do impacto subacromial. Técnica correta, interpretação e aplicação clínica na fisioterapia do ombro.",
    resumo: "O Teste de Neer identifica impacto subacromial comprimindo estruturas entre úmero e acrômio. Sensibilidade de 79% para lesões do manguito rotador.",
    oQueE: "O Teste de Neer é uma manobra de provocação que comprime as estruturas subacromiais (tendão do supraespinhal, bursa subacromial) contra o arco coracoacromial. É um dos testes mais utilizados na avaliação de dor no ombro e suspeita de síndrome do impacto.",
    comoRealizar: [
      "Paciente sentado ou em pé",
      "Posicione-se ao lado ou atrás do paciente",
      "Estabilize a escápula com uma mão para evitar elevação compensatória",
      "Com a outra mão, eleve passivamente o braço do paciente em flexão no plano escapular",
      "O braço deve estar em rotação interna (polegar apontando para baixo)",
      "Continue a elevação até o final da amplitude ou reprodução dos sintomas"
    ],
    interpretacao: "POSITIVO quando reproduz dor anterior ou lateral do ombro, tipicamente no arco entre 70° e 120° de elevação (arco doloroso). A dor no final da amplitude (>160°) pode indicar patologia acromioclavicular. Comparar com lado contralateral. Um teste positivo isolado tem valor preditivo limitado — combinar com outros testes (Hawkins, Jobe).",
    evidencia: "Meta-análise de Hegedus et al. (2012) mostrou sensibilidade de 79% e especificidade de 53% para síndrome do impacto. Park et al. (2005) demonstraram que a combinação de 3+ testes positivos (Neer, Hawkins, arco doloroso) aumenta significativamente a probabilidade de impacto. Útil como teste de triagem inicial.",
    aplicacao: "Utilizado como parte do exame clínico do ombro doloroso. Positivo em impacto subacromial, tendinopatia do manguito rotador e bursite. Deve ser interpretado no contexto clínico completo. Resultados auxiliam no direcionamento do tratamento conservador e necessidade de exames complementares.",
    dicasPraticas: [
      "Estabilize bem a escápula para evitar falsos positivos",
      "Observe compensações do paciente",
      "Combine com teste de Hawkins para maior acurácia",
      "Teste de alívio com infiltração subacromial confirma diagnóstico"
    ],
    cuidados: [
      "Cuidado em ombros muito irritáveis",
      "Não forçar amplitude se dor intensa",
      "Considerar outras causas de dor (cervical, cardíaca)"
    ],
    imagemAlt: "Demonstração do teste de Neer para síndrome do impacto"
  },
  {
    id: "4",
    slug: "teste-gaveta-anterior-joelho",
    title: "Teste da Gaveta Anterior do Joelho (LCA)",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste gaveta anterior", "lesão LCA", "ligamento cruzado anterior", "instabilidade joelho", "fisioterapia joelho", "avaliação joelho"],
    metaDescription: "Guia do Teste da Gaveta Anterior para avaliação do LCA. Técnica, interpretação e evidência científica para fisioterapeutas avaliando instabilidade do joelho.",
    resumo: "O Teste da Gaveta Anterior avalia a integridade do ligamento cruzado anterior (LCA). Especificidade de 91% quando positivo com translação >6mm.",
    oQueE: "O Teste da Gaveta Anterior é uma manobra de translação tibial que avalia a integridade do ligamento cruzado anterior (LCA). É um dos testes fundamentais na avaliação de instabilidade do joelho após trauma ou em casos crônicos.",
    comoRealizar: [
      "Paciente em decúbito dorsal com joelho flexionado a 90°",
      "O pé do paciente deve estar apoiado na maca (pode sentar levemente sobre o pé para estabilizar)",
      "Certifique-se que os isquiotibiais estão relaxados",
      "Posicione as mãos ao redor da tíbia proximal, polegares na linha articular",
      "Aplique força de translação anterior (puxando a tíbia anteriormente)",
      "Avalie a quantidade de translação e qualidade do ponto final"
    ],
    interpretacao: "POSITIVO quando há translação anterior excessiva da tíbia em relação ao fêmur, comparada ao lado contralateral. Graduação: Grau I (3-5mm), Grau II (6-10mm), Grau III (>10mm). Um 'ponto final' suave ou ausente é mais significativo que a quantidade de translação. Falsos negativos são comuns em lesões agudas devido ao espasmo muscular protetor.",
    evidencia: "Estudos de Benjaminse et al. (2006) mostraram sensibilidade de 62% e especificidade de 88% em lesões agudas, aumentando para 91% de especificidade em lesões crônicas. O teste de Lachman é mais sensível em lesões agudas. A combinação Lachman + Gaveta + Pivot Shift oferece melhor acurácia diagnóstica.",
    aplicacao: "Indicado na avaliação pós-traumática do joelho e em casos de instabilidade crônica. Melhor sensibilidade em lesões crônicas quando o edema e espasmo diminuíram. Resultado positivo indica necessidade de avaliação médica especializada para definir conduta (conservadora vs cirúrgica).",
    dicasPraticas: [
      "Garanta relaxamento muscular completo",
      "Compare sempre bilateralmente",
      "Em lesões agudas, prefira o teste de Lachman",
      "Avalie também rotação associada (gaveta rotatória)"
    ],
    cuidados: [
      "Evitar em fraturas suspeitas",
      "Cuidado em lesões agudas muito dolorosas",
      "Considerar outras estruturas (meniscos, LCP)"
    ],
    imagemAlt: "Fisioterapeuta realizando teste de gaveta anterior no joelho"
  },
  {
    id: "5",
    slug: "teste-thomas-flexores-quadril",
    title: "Teste de Thomas: Encurtamento dos Flexores do Quadril",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste de thomas", "encurtamento iliopsoas", "flexores quadril", "dor lombar", "hiperlordose", "fisioterapia quadril"],
    metaDescription: "Aprenda o Teste de Thomas para avaliar encurtamento dos flexores do quadril. Técnica modificada, interpretação e aplicação na dor lombar e postural.",
    resumo: "O Teste de Thomas avalia encurtamento do iliopsoas e reto femoral, comuns em pacientes com dor lombar e alterações posturais.",
    oQueE: "O Teste de Thomas (modificado) é utilizado para avaliar a flexibilidade dos músculos flexores do quadril, especificamente o iliopsoas e o reto femoral. Encurtamento desses músculos está associado a hiperlordose lombar, dor lombar e disfunções da marcha.",
    comoRealizar: [
      "Paciente em decúbito dorsal na borda da maca",
      "Paciente abraça um joelho trazendo-o ao peito (flexão máxima do quadril)",
      "A pelve deve manter-se em retroversão (lombar apoiada na maca)",
      "Observe a posição da coxa e joelho do membro testado (que está livre)",
      "Avalie: (1) posição da coxa em relação à horizontal, (2) ângulo do joelho",
      "Repita do outro lado para comparação"
    ],
    interpretacao: "NORMAL: coxa repousa na horizontal (ou levemente abaixo) com joelho flexionado 80-90°. ILIOPSOAS ENCURTADO: coxa eleva-se acima da horizontal (flexão do quadril mantida). RETO FEMORAL ENCURTADO: joelho estende (não mantém 80-90° de flexão). TENSOR DA FÁSCIA LATA: coxa abduz durante o teste. A combinação de achados é comum.",
    evidencia: "Estudos de Harvey (1998) demonstraram boa confiabilidade inter-examinador para a versão modificada. Correlação estabelecida entre encurtamento de flexores e dor lombar em trabalhadores sedentários (Janda). O teste tem limitações em pacientes obesos ou com restrição articular do quadril.",
    aplicacao: "Fundamental na avaliação de pacientes com dor lombar, alterações posturais e disfunções de membros inferiores. Resultados direcionam programa de alongamento específico. Útil no acompanhamento da evolução do tratamento. Considerar causas de restrição articular versus muscular.",
    dicasPraticas: [
      "Garanta que a pelve mantenha contato com a maca",
      "Use goniômetro para medidas precisas",
      "Teste com e sem flexão do joelho para diferenciar músculos",
      "Documente ângulos para reavaliações"
    ],
    cuidados: [
      "Cuidado em pacientes com artrose de quadril",
      "Adaptar posicionamento em obesos",
      "Evitar hiperextensão lombar compensatória"
    ],
    imagemAlt: "Demonstração do teste de Thomas modificado"
  },

  // ============ ELETROTERAPIA ============
  {
    id: "6",
    slug: "parametros-tens-fisioterapia",
    title: "Parâmetros TENS: Guia Completo de Configuração",
    category: "eletroterapia",
    categoryLabel: "Eletroterapia",
    keywords: ["parâmetros tens fisioterapia", "tens eletroterapia", "configuração tens", "tens dor", "eletroestimulação", "tens convencional", "tens acupuntura"],
    metaDescription: "Guia completo de parâmetros TENS para fisioterapeutas. Frequência, largura de pulso, intensidade e protocolos para diferentes tipos de dor. Baseado em evidência.",
    resumo: "A TENS (Estimulação Elétrica Nervosa Transcutânea) é um recurso não-invasivo para modulação da dor. Parâmetros corretos determinam eficácia clínica.",
    oQueE: "A TENS (Transcutaneous Electrical Nerve Stimulation) é uma modalidade de eletroterapia que utiliza corrente elétrica de baixa intensidade para modular a percepção da dor. Atua através de mecanismos de comporta medular (TENS convencional) e liberação de opioides endógenos (TENS acupuntura). É um dos recursos mais utilizados e estudados na fisioterapia.",
    comoRealizar: [
      "TENS CONVENCIONAL (analgesia rápida): Frequência 80-150Hz, Largura de pulso 50-100μs, Intensidade: formigamento forte sem contração, Tempo: 20-60min",
      "TENS ACUPUNTURA (analgesia prolongada): Frequência 2-10Hz, Largura de pulso 200-400μs, Intensidade: contração muscular visível não-dolorosa, Tempo: 20-45min",
      "TENS BURST (combinado): Trens de pulso a 2Hz com pulsos internos de 100Hz, combina mecanismos de ambas modalidades",
      "TENS BREVE-INTENSA (procedimentos): Frequência 100-150Hz, intensidade máxima tolerável, tempo: durante procedimento doloroso"
    ],
    interpretacao: "TENS Convencional: alívio imediato que dura enquanto aplicada (mecanismo de comporta). Ideal para dor aguda. TENS Acupuntura: alívio mais lento, porém mais duradouro (liberação de endorfinas). Melhor para dor crônica. A escolha do modo deve considerar: tipo de dor, preferência do paciente, e resposta individual.",
    evidencia: "Cochrane Reviews demonstram evidência moderada para dor musculoesquelética crônica. Sluka & Walsh (2003) estabeleceram bases neurofisiológicas. Meta-análise de Johnson et al. (2015) suporta uso em osteoartrite de joelho. Evidência forte para dor pós-operatória quando usada corretamente. Dose adequada (intensidade suficiente) é determinante para eficácia.",
    aplicacao: "Indicada em: lombalgia, cervicalgia, osteoartrite, dor pós-operatória, fibromialgia, neuropatia diabética. A posição dos eletrodos deve seguir: sobre área dolorosa, ao longo do trajeto nervoso, ou em pontos de acupuntura. Pode ser combinada com outros recursos terapêuticos. Pacientes podem usar em domicílio após orientação.",
    dicasPraticas: [
      "Ajuste intensidade durante sessão (acomodação sensorial)",
      "Eletrodos em boa condição garantem distribuição uniforme",
      "Educação do paciente aumenta adesão ao tratamento",
      "Reavalie resposta: se não funciona em 3-5 sessões, reconsidere parâmetros"
    ],
    cuidados: [
      "Contraindicada em portadores de marcapasso",
      "Evitar região anterior do pescoço e olhos",
      "Não aplicar sobre pele lesionada ou anestesiada"
    ],
    imagemAlt: "Aplicação de TENS com eletrodos posicionados"
  },
  {
    id: "7",
    slug: "ultrassom-terapeutico-fisioterapia",
    title: "Ultrassom Terapêutico: Parâmetros e Aplicação",
    category: "eletroterapia",
    categoryLabel: "Eletroterapia",
    keywords: ["ultrassom terapêutico", "ultrassom fisioterapia", "fonoforese", "parâmetros ultrassom", "efeitos térmicos", "efeitos não térmicos"],
    metaDescription: "Guia de ultrassom terapêutico para fisioterapeutas. Parâmetros, indicações, efeitos térmicos e não térmicos. Baseado em evidência científica atualizada.",
    resumo: "O ultrassom terapêutico produz efeitos térmicos e não-térmicos nos tecidos. A dosimetria adequada é fundamental para resultados clínicos.",
    oQueE: "O ultrassom terapêutico é uma modalidade que utiliza ondas sonoras de alta frequência (1-3MHz) para produzir efeitos biológicos nos tecidos. Pode operar em modo contínuo (efeitos térmicos predominantes) ou pulsado (efeitos não-térmicos). É amplamente utilizado para lesões de tecidos moles, inflamação e reparo tecidual.",
    comoRealizar: [
      "MODO CONTÍNUO (efeitos térmicos): 100% ciclo de trabalho, intensidade 1.0-2.0 W/cm², indicado para tecidos crônicos, aquecimento profundo",
      "MODO PULSADO (efeitos não-térmicos): 20-50% ciclo de trabalho, intensidade 0.1-0.5 W/cm², indicado para lesões agudas e subagudas",
      "FREQUÊNCIA: 1MHz penetra 3-5cm (músculos profundos), 3MHz penetra 1-2cm (tendões superficiais)",
      "ÁREA: ERA (Effective Radiating Area) deve cobrir lesão em 5-10 minutos",
      "TÉCNICA: movimentos circulares ou longitudinais, velocidade 4cm/s, gel acoplante abundante"
    ],
    interpretacao: "EFEITOS TÉRMICOS: aumento do fluxo sanguíneo, extensibilidade do colágeno, diminuição da rigidez articular. Requerem aumento de 1-4°C nos tecidos. EFEITOS NÃO-TÉRMICOS: cavitação estável, microfluxo acústico — estimulam reparo tecidual, redução de edema, modulação inflamatória. A escolha do modo depende da fase da lesão.",
    evidencia: "Revisões sistemáticas mostram evidência mista. Robertson & Baker (2001) destacaram problemas de dosimetria nos estudos. Watson (2008) enfatiza que doses adequadas são críticas. Evidência mais forte para: epicondilite lateral (fonoforese), síndrome do túnel do carpo, reparo de fraturas. Evidência fraca para lombalgia inespecífica.",
    aplicacao: "Indicações: tendinopatias, bursites, entorses subagudas, contraturas, cicatrização tecidual. A fonoforese (combinação com fármacos tópicos) pode aumentar penetração de anti-inflamatórios. Deve ser parte de programa de tratamento completo, não modalidade isolada.",
    dicasPraticas: [
      "Calcule tempo: área/ERA x tempo base (2-3min por ERA)",
      "Gel suficiente elimina bolhas de ar",
      "Mantenha cabeçote em movimento constante",
      "Teste sensibilidade térmica antes em pacientes com alterações neurológicas"
    ],
    cuidados: [
      "Evitar sobre: tumores, implantes metálicos, olhos, útero gravídico, áreas isquêmicas",
      "Não aplicar sobre epífises em crescimento",
      "Contraindicado em trombose venosa profunda"
    ],
    imagemAlt: "Aplicação de ultrassom terapêutico em tendão"
  },
  {
    id: "8",
    slug: "laser-terapeutico-fisioterapia",
    title: "Laser Terapêutico (Fotobiomodulação): Guia Prático",
    category: "eletroterapia",
    categoryLabel: "Eletroterapia",
    keywords: ["laser terapêutico", "fotobiomodulação", "laser fisioterapia", "LLLT", "laser cicatrização", "laser dor"],
    metaDescription: "Guia de laser terapêutico (LLLT/fotobiomodulação) para fisioterapeutas. Parâmetros, dosimetria e aplicações clínicas baseadas em evidência.",
    resumo: "O laser terapêutico de baixa potência promove efeitos fotobiomoduladores nos tecidos. Dosimetria adequada (J/cm²) é o fator mais crítico para eficácia.",
    oQueE: "O laser terapêutico de baixa potência (LLLT) ou fotobiomodulação utiliza luz coerente em comprimentos de onda específicos (630-1000nm) para estimular processos celulares. A luz é absorvida por cromóforos nas mitocôndrias (citocromo c oxidase), aumentando a produção de ATP e modulando estresse oxidativo.",
    comoRealizar: [
      "COMPRIMENTO DE ONDA: 630-670nm (vermelho) — superficial (pele, mucosas); 780-860nm (infravermelho) — profundo (músculos, articulações)",
      "DOSE: expressa em J/cm² (energia/área) — típico 1-4 J/cm² para bioestimulação, 4-10 J/cm² para analgesia/anti-inflamatório",
      "POTÊNCIA: equipamentos comuns 30-100mW. Potências maiores = menor tempo por ponto",
      "TÉCNICA PONTUAL: contato direto perpendicular ao tecido, pontos a cada 1-2cm",
      "TÉCNICA VARREDURA: movimento contínuo sobre área maior",
      "Calcular tempo: Tempo(s) = Dose(J/cm²) x Área(cm²) / Potência(W)"
    ],
    interpretacao: "Doses baixas (1-4 J/cm²): bioestimulação, reparo tecidual, regeneração. Doses médias (4-10 J/cm²): analgesia, anti-inflamatório. Doses altas podem ter efeito inibitório (Lei de Arndt-Schulz). A resposta é tecido-específica: tecidos superficiais respondem com vermelho, profundos com infravermelho. Janela terapêutica: abaixo não funciona, acima pode inibir.",
    evidencia: "Meta-análises demonstram eficácia em: cervicalgia (Chow et al., 2009), osteoartrite (Huang et al., 2015), dor miofascial, cicatrização de úlceras. World Association for Laser Therapy (WALT) publica diretrizes de dosimetria. Evidência emergente para tendinopatias quando doses adequadas são utilizadas. Problemas metodológicos em estudos antigos comprometem conclusões.",
    aplicacao: "Indicações principais: cicatrização de feridas, dor musculoesquelética, tendinopatias, dor neuropática, mucosites. Pode ser combinado com exercícios terapêuticos para potencializar resultados. Sessões típicas: 2-3x/semana. Resposta esperada em 4-6 sessões para dor, mais tempo para reparo tecidual.",
    dicasPraticas: [
      "Documente sempre: comprimento de onda, potência, dose, área, pontos",
      "Limpe a caneta e pele — sujidade diminui transmissão",
      "Contato direto perpendicular maximiza absorção",
      "Teste sensibilidade em pacientes com alterações neurológicas"
    ],
    cuidados: [
      "Proteção ocular obrigatória (paciente e terapeuta)",
      "Evitar sobre: tumores malignos, tireóide, útero gravídico",
      "Cuidado em fotossensíveis e medicamentos fotossensibilizantes"
    ],
    imagemAlt: "Aplicação de laser terapêutico em ponto trigger"
  },

  // ============ ESCALAS CLÍNICAS ============
  {
    id: "9",
    slug: "escala-eva-dor",
    title: "Escala EVA de Dor: Avaliação Visual Analógica",
    category: "escalas-clinicas",
    categoryLabel: "Escalas Clínicas",
    keywords: ["escala eva dor", "escala visual analógica", "avaliação dor", "mensuração dor", "fisioterapia dor", "VAS pain"],
    metaDescription: "Aprenda a utilizar a Escala Visual Analógica (EVA) na avaliação da dor. Aplicação, interpretação e limitações na prática fisioterapêutica.",
    resumo: "A EVA é uma escala unidimensional de 10cm para mensuração da intensidade da dor. Simples, rápida e com boa sensibilidade para mudanças.",
    oQueE: "A Escala Visual Analógica (EVA) é um instrumento unidimensional para mensuração da intensidade de dor. Consiste em uma linha de 10cm com âncoras nas extremidades: 'Sem dor' (0) e 'Pior dor imaginável' (10). O paciente marca o ponto que representa sua dor atual. É uma das escalas mais utilizadas em pesquisa e prática clínica.",
    comoRealizar: [
      "Apresente ao paciente uma linha de 10cm (horizontal ou vertical)",
      "Explique os extremos: esquerda = sem dor (0), direita = pior dor imaginável (10)",
      "Instrua: 'Marque na linha o ponto que representa sua dor AGORA'",
      "Meça com régua a distância do 0 até a marca (em mm ou cm)",
      "Registre o valor numérico (0-10 ou 0-100mm)",
      "Pode pedir dor atual, média, melhor e pior das últimas 24h"
    ],
    interpretacao: "0 = Sem dor. 1-3 = Dor leve (não interfere em atividades). 4-6 = Dor moderada (interfere parcialmente). 7-10 = Dor intensa (incapacitante). DIFERENÇA MÍNIMA CLINICAMENTE IMPORTANTE (DMCI): 13-20mm ou ~2 pontos indica mudança real percebida pelo paciente. Valores absolutos têm significado individual — acompanhe a evolução.",
    evidencia: "Estudos de Bijur et al. (2001) demonstraram excelente confiabilidade teste-reteste (ICC 0.97). Jensen (2003) confirmou sensibilidade para detectar mudanças. A EVA é mais sensível que escalas numéricas verbais para detectar pequenas mudanças. Limitações: requer capacidade de abstração, não aplicável em crianças pequenas ou déficit cognitivo.",
    aplicacao: "Utilizada para: triagem inicial, monitoramento da evolução, avaliação de intervenções, pesquisa clínica. Deve ser combinada com avaliação multidimensional da dor (localização, qualidade, fatores de piora/melhora, impacto funcional). Educar o paciente sobre a escala aumenta confiabilidade. Documentar sistematicamente permite análise de tendências.",
    dicasPraticas: [
      "Use sempre a mesma escala visual com o paciente",
      "Avalie no mesmo momento do dia quando possível",
      "Pergunte dor atual + média + pior para visão completa",
      "Combine com escalas funcionais para avaliação completa"
    ],
    cuidados: [
      "Não aplicável em crianças <5 anos (usar faces)",
      "Limitações em idosos com déficit cognitivo",
      "Cultura e linguagem influenciam respostas"
    ],
    imagemAlt: "Escala visual analógica de dor de 0 a 10"
  },
  {
    id: "10",
    slug: "escala-berg-equilibrio",
    title: "Escala de Berg: Avaliação de Equilíbrio Funcional",
    category: "escalas-clinicas",
    categoryLabel: "Escalas Clínicas",
    keywords: ["escala de berg", "avaliação equilíbrio", "risco de queda", "berg balance scale", "fisioterapia idoso", "neurologia"],
    metaDescription: "Guia da Escala de Equilíbrio de Berg para fisioterapeutas. 14 tarefas, pontuação, interpretação e aplicação em idosos e pacientes neurológicos.",
    resumo: "A Escala de Berg avalia equilíbrio funcional através de 14 tarefas. Pontuação <45 indica risco aumentado de quedas.",
    oQueE: "A Escala de Equilíbrio de Berg (EEB) é um instrumento validado que avalia o equilíbrio funcional através de 14 tarefas progressivamente mais desafiadoras. Cada tarefa é pontuada de 0 (incapaz) a 4 (independente), totalizando 56 pontos. É amplamente utilizada em idosos, pacientes neurológicos e programas de prevenção de quedas.",
    comoRealizar: [
      "Equipamento necessário: cadeira com apoio de braço, cadeira sem apoio, cronômetro, régua, step/banqueta, objeto para pegar do chão",
      "14 TAREFAS: (1) Sentado para de pé, (2) Ficar de pé sem apoio 2min, (3) Sentado sem apoio, (4) De pé para sentado, (5) Transferências, (6) De pé com olhos fechados, (7) De pé com pés juntos",
      "(8) Alcançar à frente com braço estendido, (9) Pegar objeto do chão, (10) Virar para olhar para trás, (11) Girar 360°, (12) Pé alternado em step, (13) De pé com um pé à frente, (14) De pé sobre uma perna",
      "Pontue cada tarefa 0-4 conforme critérios padronizados",
      "Some os 14 itens para pontuação total (máximo 56)"
    ],
    interpretacao: "56 pontos = Equilíbrio funcional excelente. 41-55 pontos = Independência, risco de queda baixo/moderado. <41 pontos = Risco de queda AUMENTADO (requer intervenção). <36 pontos = Risco de queda quase 100%. DIFERENÇA MÍNIMA CLINICAMENTE IMPORTANTE: 4-7 pontos. Analisar também quais tarefas são mais difíceis para direcionar tratamento.",
    evidencia: "Berg et al. (1995) estabeleceram ponto de corte <45 para risco de quedas. Revisão de Blum & Korner-Bitensky (2008) confirmou excelente validade e confiabilidade em AVE. A escala possui efeito teto em idosos ativos — considerar escalas mais desafiadoras. Correlação moderada-forte com outras medidas de mobilidade.",
    aplicacao: "Indicações: avaliação de idosos, pós-AVE, Parkinson, esclerose múltipla, lesão medular, vestibulopatias. Utilizar para: triagem de risco de quedas, planejamento de intervenção, monitoramento de evolução. Reavaliações periódicas (4-8 semanas) documentam eficácia do tratamento. Itens com pontuação baixa direcionam exercícios específicos.",
    dicasPraticas: [
      "Ambiente seguro (supervisão, equipamentos próximos)",
      "Tempo aproximado: 15-20 minutos",
      "Siga ordem padronizada das tarefas",
      "Registre observações qualitativas além da pontuação"
    ],
    cuidados: [
      "Garantir segurança — supervisione tarefas de risco",
      "Pacientes com risco alto podem precisar auxílio em algumas tarefas",
      "Não aplicável em pacientes acamados"
    ],
    imagemAlt: "Idoso realizando teste de equilíbrio com fisioterapeuta"
  },
  {
    id: "11",
    slug: "questionario-oswestry-lombalgia",
    title: "Questionário de Oswestry: Incapacidade por Lombalgia",
    category: "escalas-clinicas",
    categoryLabel: "Escalas Clínicas",
    keywords: ["questionário oswestry", "oswestry lombalgia", "incapacidade funcional", "ODI", "dor lombar", "escala funcional"],
    metaDescription: "Como aplicar e interpretar o Índice de Incapacidade Oswestry (ODI) para lombalgia. Pontuação, MCID e aplicação clínica na fisioterapia.",
    resumo: "O Índice de Oswestry (ODI) avalia incapacidade funcional em pacientes com lombalgia através de 10 seções. É o padrão-ouro para essa população.",
    oQueE: "O Oswestry Disability Index (ODI) é um questionário autoaplicável que avalia o impacto da lombalgia nas atividades de vida diária. Composto por 10 seções (intensidade da dor, cuidados pessoais, levantar peso, andar, sentar, ficar de pé, sono, vida sexual, vida social, viagens), cada uma com 6 alternativas pontuadas de 0-5.",
    comoRealizar: [
      "Forneça o questionário traduzido e validado para português",
      "O paciente preenche sozinho (autoaplicável), escolhendo UMA opção por seção",
      "Tempo: 5-10 minutos",
      "CÁLCULO: Some os pontos de todas as seções respondidas",
      "FÓRMULA: ODI% = (Soma dos pontos / 5 x nº seções respondidas) x 100",
      "Se uma seção não se aplica (ex: vida sexual), exclua do cálculo"
    ],
    interpretacao: "0-20% = Incapacidade MÍNIMA (consegue realizar maioria das atividades). 21-40% = Incapacidade MODERADA (dificuldade em algumas atividades, pode trabalhar). 41-60% = Incapacidade GRAVE (dor significativa, limitações importantes). 61-80% = Incapacidade MUITO GRAVE (necessita intervenção). 81-100% = Acamado ou exagero de sintomas. MCID: redução de 10-12 pontos ou 30% indica melhora clinicamente relevante.",
    evidencia: "Fairbank & Pynsent (2000) publicaram revisão completa estabelecendo propriedades psicométricas. Validação brasileira por Vigatto et al. (2007). Altíssima responsividade para detectar mudanças. Correlação forte com outras medidas de dor e função. Recomendado por diretrizes internacionais para pesquisa e prática clínica em lombalgia.",
    aplicacao: "Utilizado para: avaliação inicial e reavaliações, prognóstico, elegibilidade para programas de reabilitação, pesquisa clínica, comunicação com equipe multidisciplinar. Aplicar na primeira consulta e a cada 4-8 semanas. Comparar evolução ao longo do tempo. Útil para mostrar ao paciente sua melhora objetiva.",
    dicasPraticas: [
      "Use versão brasileira validada",
      "Paciente responde sem interferência",
      "Esclareça dúvidas sem induzir resposta",
      "Gráficos de evolução facilitam visualização"
    ],
    cuidados: [
      "Não aplicável em analfabetos (usar entrevista)",
      "Fatores psicossociais influenciam respostas",
      "Considerar contexto (trabalho, compensação)"
    ],
    imagemAlt: "Questionário de Oswestry sendo preenchido pelo paciente"
  },

  // ============ RED FLAGS ============
  {
    id: "12",
    slug: "red-flags-lombalgia",
    title: "Red Flags na Lombalgia: Sinais de Alerta",
    category: "red-flags",
    categoryLabel: "Red Flags",
    keywords: ["red flags lombalgia", "sinais de alerta dor lombar", "bandeiras vermelhas", "fratura vertebral", "síndrome cauda equina", "tumor coluna"],
    metaDescription: "Red flags na lombalgia: sinais de alerta que indicam necessidade de encaminhamento médico urgente. Quando a dor lombar pode indicar doença grave.",
    resumo: "Red flags são sinais de alerta que indicam possível patologia grave subjacente à lombalgia. Identificação precoce previne complicações sérias.",
    oQueE: "Red flags (bandeiras vermelhas) são sinais, sintomas ou características da história clínica que indicam possível patologia grave subjacente à dor lombar, como: fratura vertebral, infecção, tumor, síndrome da cauda equina ou doença sistêmica. Embora raros (<1% dos casos), sua identificação é fundamental para encaminhamento apropriado.",
    comoRealizar: [
      "HISTÓRIA: perguntar sobre trauma, idade, uso de corticóides, osteoporose, câncer prévio, perda de peso inexplicada, febre, imunossupressão, uso de drogas IV, dor noturna que acorda",
      "NEUROLÓGICO: fraqueza progressiva em membros inferiores, alteração de esfíncteres (urina/fezes), anestesia em sela (períneo)",
      "SISTÊMICO: febre, calafrios, sudorese noturna, mal-estar geral",
      "COMPORTAMENTO DA DOR: dor constante progressiva que não alivia com repouso, dor noturna intensa",
      "Se QUALQUER red flag presente → encaminhamento médico imediato"
    ],
    interpretacao: "FRATURA: trauma significativo + idade >50 ou osteoporose ou uso de corticóides. TUMOR: história de câncer + perda de peso + idade >50 + dor que não alivia. INFECÇÃO: febre + imunossupressão ou procedimento recente ou uso de drogas IV. SÍNDROME DA CAUDA EQUINA (EMERGÊNCIA): anestesia em sela + disfunção vesical/intestinal + fraqueza bilateral = ENCAMINHAMENTO URGENTE.",
    evidencia: "Diretrizes NICE (2016) e Chou et al. (2007) estabelecem red flags baseadas em estudos de acurácia. Sensibilidade individual de cada red flag é limitada, mas combinação aumenta valor preditivo. Síndrome da cauda equina requer cirurgia em <48h para prevenir sequelas permanentes. Maioria dos tumores vertebrais são metástases de outros sítios.",
    aplicacao: "Rastreio obrigatório em TODA avaliação inicial de lombalgia. Documentar presença ou ausência de cada red flag. Se presente: não iniciar tratamento fisioterapêutico — encaminhar ao médico. Se negativo: prosseguir com avaliação e tratamento conservador. Reavalie red flags se evolução atípica.",
    dicasPraticas: [
      "Use checklist padronizado na avaliação",
      "Questione diretamente — pacientes podem não relatar espontaneamente",
      "Desconfie se dor não se comporta mecanicamente",
      "Na dúvida, encaminhe"
    ],
    cuidados: [
      "Síndrome da cauda equina é EMERGÊNCIA — encaminhar imediatamente",
      "Não atrase encaminhamento para 'ver se melhora'",
      "Comunique claramente ao paciente a necessidade de avaliação médica"
    ],
    imagemAlt: "Diagrama de sinais de alerta na dor lombar"
  },
  {
    id: "13",
    slug: "red-flags-cervicalgia",
    title: "Red Flags na Cervicalgia: Quando Encaminhar",
    category: "red-flags",
    categoryLabel: "Red Flags",
    keywords: ["red flags cervicalgia", "sinais alerta dor cervical", "mielopatia cervical", "instabilidade cervical", "insuficiência vertebrobasilar"],
    metaDescription: "Red flags na dor cervical: identificação de sinais de alerta para mielopatia, instabilidade, insuficiência vertebrobasilar e outras condições graves.",
    resumo: "Red flags cervicais incluem sinais de mielopatia, instabilidade ligamentar e insuficiência vertebrobasilar. Exigem encaminhamento antes de manipulação.",
    oQueE: "Red flags na cervicalgia são sinais que indicam condições potencialmente graves que requerem avaliação médica antes de tratamento fisioterapêutico, especialmente antes de técnicas de manipulação. Incluem: mielopatia cervical, instabilidade ligamentar, insuficiência vertebrobasilar (IVB), fratura, infecção e tumor.",
    comoRealizar: [
      "MIELOPATIA: perguntar sobre alteração na marcha, quedas frequentes, dificuldade motora fina (abotoar, escrever), incontinência urinária",
      "INSTABILIDADE: história de trauma, artrite reumatoide, síndrome de Down, sensação de 'cabeça pesada'",
      "IVB (insuficiência vertebrobasilar): tontura/vertigem com movimentos cervicais, diplopia, disartria, disfagia, náusea",
      "SISTÊMICO: febre, perda de peso, história de câncer, imunossupressão",
      "EXAME: teste dos ligamentos (alar, transverso), reflexos patológicos (Babinski, Hoffmann), clônus"
    ],
    interpretacao: "MIELOPATIA CERVICAL: compressão medular — sinais de neurônio motor superior (hiper-reflexia, espasticidade, Babinski+), alteração da marcha, disfunção vesical. INSTABILIDADE: frouxidão ligamentar — sensação de 'dar', cliques, após trauma ou em AR. IVB: 5 'D's e 3 'N's (Dizziness, Diplopia, Dysarthria, Dysphagia, Drop attacks + Nausea, Nystagmus, Numbness). CONTRAINDICAM manipulação cervical.",
    evidencia: "Diretrizes da IFOMPT (2012) estabelecem framework para avaliação cervical pré-manipulativa. Kerry et al. (2008) descrevem abordagem para rastreio de IVB. Estudos de Cook et al. (2009) validaram cluster de sinais para mielopatia. Dissecção arterial cervical é rara mas potencialmente fatal — considerar em cefaleia severa de início súbito.",
    aplicacao: "Rastreio OBRIGATÓRIO antes de qualquer técnica de manipulação cervical. Na presença de red flags: não manipular — encaminhar ao médico. Em casos duvidosos de IVB: realizar teste de posição sustentada + movimentos combinados. Documentar avaliação pré-manipulativa. Consentimento informado deve incluir riscos.",
    dicasPraticas: [
      "Use questionário de rastreio padronizado",
      "Teste funcional de artéria vertebral tem valor limitado",
      "Considere história completa + exame neurológico",
      "Na dúvida, não manipule — use outras técnicas"
    ],
    cuidados: [
      "Nunca manipule com red flags presentes",
      "Cefaleia súbita severa pode indicar dissecção arterial",
      "Artrite reumatoide requer avaliação radiológica antes de manipulação"
    ],
    imagemAlt: "Avaliação neurológica cervical"
  },
  {
    id: "14",
    slug: "red-flags-cefaleia",
    title: "Red Flags na Cefaleia: Sinais de Alerta para o Fisioterapeuta",
    category: "red-flags",
    categoryLabel: "Red Flags",
    keywords: ["red flags cefaleia", "sinais alerta dor de cabeça", "cefaleia secundária", "hemorragia subaracnoidea", "tumor cerebral"],
    metaDescription: "Red flags em cefaleias: como identificar dores de cabeça que indicam condições graves. Guia para fisioterapeutas no rastreio de causas secundárias.",
    resumo: "Cefaleias secundárias podem indicar condições graves como hemorragia, tumor ou infecção. O acrônimo SNOOP ajuda na identificação de red flags.",
    oQueE: "Embora a maioria das cefaleias seja primária (tensional, migrânea, cervicogênica), algumas são secundárias a condições potencialmente graves. O fisioterapeuta frequentemente atende pacientes com cefaleia e deve identificar red flags que indicam necessidade de avaliação médica urgente antes de iniciar tratamento.",
    comoRealizar: [
      "Use o acrônimo SNOOP para rastreio:",
      "S - Systemic (sintomas sistêmicos: febre, perda de peso, rigidez de nuca, HIV, câncer)",
      "N - Neurologic (sintomas neurológicos: confusão, alteração de consciência, convulsão, déficits focais)",
      "O - Onset (início súbito: 'pior dor de cabeça da vida' em segundos)",
      "O - Older (primeiro episódio após 50 anos de idade)",
      "P - Pattern (mudança de padrão: frequência aumentando, não responde a tratamento usual, progressiva)"
    ],
    interpretacao: "CEFALEIA EM TROVOADA (início <1min, máxima intensidade): hemorragia subaracnoidea até prova contrária — EMERGÊNCIA. CEFALEIA + FEBRE + RIGIDEZ DE NUCA: meningite. CEFALEIA + DÉFICIT NEUROLÓGICO FOCAL: tumor, AVC. CEFALEIA NOVA >50 ANOS + CLAUDICAÇÃO DE MANDÍBULA: arterite temporal. CEFALEIA PROGRESSIVA + PAPILEDEMA: hipertensão intracraniana. Qualquer SNOOP positivo = encaminhar.",
    evidencia: "Diretrizes da International Headache Society (IHS) estabelecem critérios diagnósticos. Estudos de Dodick (2003) validaram o uso de SNOOP na prática. Locker et al. (2006) demonstraram que cefaleias secundárias representam ~5% dos atendimentos de emergência. Hemorragia subaracnoidea tem mortalidade de 50% se não tratada rapidamente.",
    aplicacao: "Todo paciente com cefaleia deve ser rastreado para red flags na avaliação inicial. Se SNOOP negativo: prosseguir com avaliação de cefaleia cervicogênica/tensional. Se SNOOP positivo: encaminhar ao médico antes de qualquer intervenção. Reavaliar se mudança de padrão durante tratamento.",
    dicasPraticas: [
      "Pergunte: 'Esta é a pior dor de cabeça da sua vida?'",
      "Novo padrão em paciente com história prévia também é red flag",
      "Cefaleia que acorda o paciente à noite é suspeita",
      "Documente avaliação de SNOOP"
    ],
    cuidados: [
      "Cefaleia em trovoada = emergência médica imediata",
      "Não atrase encaminhamento para 'tentar tratamento'",
      "Idosos com cefaleia nova: alto índice de suspeição"
    ],
    imagemAlt: "Fisioterapeuta avaliando paciente com cefaleia"
  },
  {
    id: "15",
    slug: "teste-jobe-ombro",
    title: "Teste de Jobe (Empty Can): Supraespinhal",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste de jobe", "empty can test", "supraespinhal", "lesão manguito rotador", "fisioterapia ombro", "tendinopatia ombro"],
    metaDescription: "Aprenda o Teste de Jobe (Empty Can) para avaliação do supraespinhal. Técnica correta, interpretação e aplicação na fisioterapia do ombro.",
    resumo: "O Teste de Jobe avalia a integridade do tendão do supraespinhal. Positivo indica tendinopatia ou ruptura do manguito rotador.",
    oQueE: "O Teste de Jobe, também conhecido como Empty Can Test, é uma manobra específica para avaliar a integridade e força do músculo supraespinhal, componente crucial do manguito rotador. É um dos testes mais utilizados na avaliação do ombro doloroso.",
    comoRealizar: [
      "Paciente sentado ou em pé",
      "Posicione o braço em 90° de abdução no plano escapular (30° anterior ao plano frontal)",
      "Rotação interna máxima (polegar apontando para o chão — posição 'empty can')",
      "Aplique resistência para baixo (força de adução) enquanto paciente tenta manter a posição",
      "Avalie: (1) presença de dor, (2) capacidade de resistir à força aplicada",
      "Compare bilateralmente"
    ],
    interpretacao: "POSITIVO PARA DOR: reproduz dor no ombro, sugestivo de tendinopatia do supraespinhal. POSITIVO PARA FRAQUEZA: incapacidade de resistir à pressão ou 'desabamento' do braço, sugestivo de ruptura significativa. Dor + fraqueza: maior probabilidade de lesão estrutural. Comparação bilateral importante para detectar fraqueza sutil.",
    evidencia: "Meta-análise de Hegedus et al. (2012): sensibilidade 53%, especificidade 82% para ruptura do supraespinhal. Combinar com outros testes (Neer, Hawkins, drop arm) aumenta acurácia. Estudos de Itoi et al. sugeriram que posição de rotação externa (Full Can Test) pode ser igualmente útil com menos desconforto.",
    aplicacao: "Indicado na avaliação de dor no ombro, suspeita de lesão do manguito rotador, e diferenciação entre tendinopatia e ruptura. Resultado positivo para fraqueza sugere necessidade de exame de imagem (US ou RM). Auxilia no planejamento de tratamento conservador ou encaminhamento cirúrgico.",
    dicasPraticas: [
      "Teste também em Full Can (polegar para cima) para comparação",
      "Fraqueza isolada sem dor pode indicar lesão neural",
      "Combine com teste de Hawkins para avaliação completa",
      "Avalie força em escala 0-5 para documentação"
    ],
    cuidados: [
      "Cuidado em ombros muito dolorosos",
      "Fraqueza pode ser por inibição dolorosa",
      "Lesões parciais podem ter testes negativos"
    ],
    imagemAlt: "Demonstração do teste de Jobe para supraespinhal"
  },
  {
    id: "16",
    slug: "teste-phalen-tunel-carpo",
    title: "Teste de Phalen: Síndrome do Túnel do Carpo",
    category: "testes-ortopedicos",
    categoryLabel: "Testes Ortopédicos",
    keywords: ["teste de phalen", "síndrome túnel do carpo", "compressão nervo mediano", "formigamento mãos", "fisioterapia punho", "LER DORT"],
    metaDescription: "Guia do Teste de Phalen para síndrome do túnel do carpo. Técnica, interpretação e aplicação clínica na fisioterapia de membros superiores.",
    resumo: "O Teste de Phalen provoca compressão do nervo mediano no túnel do carpo. Positivo em <60 segundos sugere síndrome do túnel do carpo.",
    oQueE: "O Teste de Phalen é uma manobra provocativa para síndrome do túnel do carpo (STC). A flexão máxima do punho aumenta a pressão dentro do túnel do carpo, comprimindo o nervo mediano e reproduzindo os sintomas em pacientes afetados. É um dos testes clínicos mais utilizados para essa condição comum.",
    comoRealizar: [
      "Paciente sentado com cotovelos apoiados",
      "Instrua o paciente a posicionar os punhos em flexão máxima, dorso das mãos em contato",
      "Mantenha a posição por 60 segundos (alguns autores sugerem até 120s)",
      "Pergunte sobre surgimento de sintomas: formigamento, dormência, dor",
      "Observe a distribuição dos sintomas (território do mediano)",
      "Compare bilateralmente"
    ],
    interpretacao: "POSITIVO: reprodução de parestesia/dormência no território do nervo mediano (1º, 2º, 3º dedos e metade radial do 4º) em até 60 segundos. Quanto mais rápido surgem os sintomas, maior a probabilidade de STC significativa. Sintomas em outros territórios podem indicar outras patologias (radiculopatia cervical, neuropatia ulnar).",
    evidencia: "Meta-análise de MacDermid & Wessel (2004): sensibilidade 68%, especificidade 73%. Teste de Durkan (compressão direta) pode ter acurácia similar ou superior. Combinação de testes (Phalen + Tinel + Durkan) aumenta valor diagnóstico. A eletroneuromiografia permanece como padrão-ouro, mas testes clínicos são úteis para triagem.",
    aplicacao: "Indicado na avaliação de parestesias em mãos, suspeita de STC, e acompanhamento de tratamento. Resultado positivo + história clínica consistente pode dispensar ENMG em casos claros. Auxilia na decisão entre tratamento conservador e encaminhamento para avaliação cirúrgica.",
    dicasPraticas: [
      "Combine com Tinel e Durkan para maior acurácia",
      "Pergunte sobre sintomas noturnos (característico)",
      "Avalie força de pinça e oponência do polegar",
      "Phalen reverso (extensão) também pode ser útil"
    ],
    cuidados: [
      "Diferencie de radiculopatia C6-C7",
      "Diabetes pode causar neuropatia sem STC",
      "Gestantes: STC comum e geralmente reversível"
    ],
    imagemAlt: "Demonstração do teste de Phalen bilateral"
  }
];

export function getArtigosByCategory(category: string): BibliotecaArtigo[] {
  return artigos.filter(a => a.category === category);
}

export function getArtigoBySlug(slug: string): BibliotecaArtigo | undefined {
  return artigos.find(a => a.slug === slug);
}
