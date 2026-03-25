export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  metaDescription: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "lachman-1",
    slug: "teste-de-lachman",
    title: "Teste de Lachman: Como Realizar, Interpretar e Documentar — Guia Completo para Fisioterapeutas",
    excerpt: "Aprenda a realizar o Teste de Lachman corretamente, interpretar os resultados e documentar no prontuário eletrônico. Guia completo baseado em evidência científica.",
    content: `
## Introdução

O Teste de Lachman é considerado o exame clínico mais sensível para avaliação de lesões do ligamento cruzado anterior (LCA). Descrito por John Lachman em 1976, este teste se tornou o padrão-ouro na avaliação inicial de instabilidade anterior do joelho.

Com uma sensibilidade de aproximadamente 85% e especificidade de 94%, o Teste de Lachman supera outros testes como a Gaveta Anterior em precisão diagnóstica. Para fisioterapeutas, dominar sua execução e interpretação é fundamental para o raciocínio clínico em lesões de joelho.

Neste guia completo, você aprenderá a técnica correta de execução, como interpretar os resultados com segurança, os erros mais comuns que invalidam o teste, e como documentar adequadamente no prontuário eletrônico.

## O que é o Teste de Lachman

O Teste de Lachman é um exame ortopédico específico para avaliar a integridade do **ligamento cruzado anterior (LCA)**. Ele avalia a translação anterior da tíbia em relação ao fêmur com o joelho em leve flexão (20-30°).

### Por que é o mais sensível?

Diferente da Gaveta Anterior (realizada a 90° de flexão), o Teste de Lachman é feito com o joelho quase estendido. Nesta posição:

- A musculatura isquiotibial está relaxada (não "protege" o LCA)
- O corno posterior do menisco não bloqueia a translação
- A cápsula posterior está em tensão mínima

### Valores de acurácia diagnóstica

Estudos de meta-análise demonstram:

- **Sensibilidade**: 81-87% (média ~85%)
- **Especificidade**: 91-94%
- **Valor preditivo positivo**: 85%
- **Valor preditivo negativo**: 94%

**Referência**: Benjaminse et al. (2006), Clinical Orthopaedics and Related Research; Solomon et al. (2001), JAMA.

## Indicações Clínicas

O Teste de Lachman deve ser realizado quando houver:

### Suspeita de lesão do LCA
- Trauma em valgo com rotação externa (mecanismo típico)
- Entorse de joelho em atletas
- Sensação de "estalo" referida pelo paciente
- Edema articular agudo (hemartrose)

### Instabilidade anterior referida
- Paciente relata "joelho falha" ou "cede"
- Insegurança ao descer escadas ou mudar de direção
- Episódios recorrentes de entorse

### Avaliação pós-operatória
- Seguimento após reconstrução do LCA
- Comparação com lado contralateral
- Avaliação de re-lesão

### Atletas após entorse de joelho
- Mesmo sem queixa de instabilidade
- Especialmente em esportes de pivô (futebol, basquete, vôlei)
- Trauma sem contato durante mudança de direção

## Como Realizar o Teste de Lachman — Passo a Passo

### Posição do paciente

1. Paciente em decúbito dorsal, relaxado
2. Joelho em **20-30° de flexão** (posição neutra de rotação)
3. Coxa apoiada na maca (não elevada)
4. Músculo quadríceps completamente relaxado

### Posição do fisioterapeuta

1. Posicione-se ao lado do joelho a ser testado
2. Mão proximal (cranial): estabilize o fêmur distal, envolvendo a face lateral com o polegar anterior
3. Mão distal (caudal): segure a tíbia proximal, com o polegar sobre a tuberosidade tibial

### Técnica de execução

1. **Estabilize firmemente o fêmur** com a mão proximal
2. Com a mão distal, aplique uma **força anterior** na tíbia (puxando para frente)
3. A força deve ser **suave e progressiva**, não abrupta
4. Observe e sinta a quantidade de translação e o **endpoint** (ponto final)
5. **Compare sempre com o lado contralateral** (controle interno)

### Variação para pacientes com coxas volumosas

Em pacientes com coxas grandes, pode ser difícil estabilizar o fêmur adequadamente. Alternativas:

- **Técnica com apoio**: Coloque sua coxa sob a coxa do paciente para apoio
- **Teste de Lachman em prono**: Paciente em decúbito ventral, joelho fletido a 30°, tração anterior da tíbia
- **Teste de Lachman modificado**: Use um rolo sob a coxa distal para manter a flexão

## Como Interpretar o Resultado

### Teste Positivo vs Negativo

**Teste POSITIVO**: Translação anterior aumentada comparada ao lado oposto, com endpoint mole ou ausente.

**Teste NEGATIVO**: Translação mínima ou igual ao lado contralateral, com endpoint firme.

### Graduação da frouxidão ligamentar

A translação é graduada em milímetros de diferença em relação ao lado sadio:

- **Grau 1+ (leve)**: 3-5mm de translação aumentada
- **Grau 2+ (moderado)**: 5-10mm de translação aumentada
- **Grau 3+ (grave)**: >10mm de translação aumentada

### Endpoint (ponto final)

O **endpoint** é a sensação ao final do movimento de translação:

- **Endpoint firme**: sensação de "batida" sólida → LCA íntegro ou lesão parcial
- **Endpoint mole/ausente**: sensação de "esponja" ou sem resistência → lesão completa do LCA

### Diagnóstico diferencial

- **Frouxidão ligamentar constitucional**: translação aumentada bilateral, mas simétrica e com endpoint firme
- **Lesão parcial do LCA**: translação levemente aumentada, endpoint firme
- **Lesão do LCP**: afastar gaveta posterior antes de interpretar Lachman

## Erros Mais Comuns na Execução

### 1. Joelho muito fletido

Realizar o teste com mais de 30° de flexão ativa a proteção dos isquiotibiais, gerando falso-negativo.

**Solução**: Mantenha 20-30° de flexão.

### 2. Paciente não relaxado

Contração reflexa do quadríceps ou isquiotibiais impede a translação real.

**Solução**: Converse com o paciente, peça para "soltar" a perna, e aguarde o relaxamento completo.

### 3. Estabilização inadequada do fêmur

Se o fêmur se move junto com a tíbia, você está testando movimento global, não translação isolada.

**Solução**: Estabilize firmemente o fêmur distal antes de aplicar a força anterior.

### 4. Não comparar bilateralmente

A frouxidão varia entre indivíduos. Sem comparação, você pode interpretar uma frouxidão constitucional como patológica.

**Solução**: Sempre teste o lado oposto primeiro para estabelecer o "normal" do paciente.

## Como Documentar no Prontuário Eletrônico

A documentação correta do Teste de Lachman deve incluir:

### Elementos essenciais do registro

1. **Nome do teste** realizado
2. **Graduação** da translação (1+, 2+, 3+)
3. **Qualidade do endpoint** (firme ou mole)
4. **Comparação** com lado contralateral
5. **Observações** relevantes (dor, apreensão, limitações)

### Exemplo de registro clínico adequado

*"Teste de Lachman positivo 2+, endpoint mole, translação anterior aumentada em comparação ao lado contralateral. Paciente refere dor leve durante o teste. Compatível com lesão completa do LCA."*

### Exemplo de registro para teste negativo

*"Teste de Lachman negativo bilateral, endpoint firme simétrico, sem translação anterior aumentada. LCA clinicamente íntegro."*

### Documentação digital no RehabRoad

No **RehabRoad**, o resultado do Teste de Lachman é registrado automaticamente na seção de testes ortopédicos da avaliação. O sistema:

- Integra o resultado às **hipóteses diagnósticas** geradas pela IA clínica
- Permite **comparação evolutiva** em reavaliações
- Gera **relatórios profissionais** em PDF com todos os testes documentados
- Facilita a comunicação com médicos ortopedistas

## Testes Complementares ao Lachman

O Teste de Lachman não deve ser usado isoladamente. Combine com outros testes para aumentar a acurácia diagnóstica:

### Teste do Pivot Shift

- **O que avalia**: instabilidade rotacional anterolateral
- **Quando usar**: após Lachman positivo, para confirmar instabilidade funcional
- **Interpretação**: ressalto positivo indica lesão completa do LCA com componente rotacional

### Teste da Gaveta Anterior

- **O que avalia**: translação anterior a 90° de flexão
- **Limitação**: menor sensibilidade que Lachman (70%)
- **Utilidade**: confirmação adicional, especialmente em lesões crônicas

### Teste de McMurray

- **O que avalia**: lesão meniscal
- **Por que combinar**: 50% das lesões do LCA têm lesão meniscal associada
- **Atenção**: dor ou estalido sugerem lesão meniscal concomitante

### Teste de Estresse em Valgo/Varo

- **O que avalia**: ligamentos colaterais
- **Por que combinar**: mecanismo de lesão do LCA frequentemente envolve estresse em valgo

## Perguntas Frequentes (FAQ)

### O Teste de Lachman pode ser realizado em fase aguda?

**Sim**, o Teste de Lachman pode e deve ser realizado na fase aguda. Na verdade, é mais fidedigno nas primeiras horas após o trauma, antes do edema e espasmo muscular se instalarem. Em casos de hemartrose importante, a aspiração do líquido pode facilitar o exame. Estudos mostram que a sensibilidade do teste diminui após 48-72h devido à resposta inflamatória.

### Qual a diferença entre Lachman e Gaveta Anterior?

A principal diferença está na **posição do joelho**:

- **Lachman**: 20-30° de flexão → isquiotibiais relaxados → mais sensível
- **Gaveta Anterior**: 90° de flexão → isquiotibiais podem proteger → menos sensível

O Lachman tem sensibilidade de ~85%, enquanto a Gaveta Anterior tem ~70%. Por isso, o Lachman é preferido como teste de screening. A Gaveta pode ser útil como teste confirmatório.

### O teste é válido sem exame de imagem?

**Sim**, o Teste de Lachman tem alta acurácia e é válido clinicamente mesmo sem ressonância magnética. Em muitos contextos (pronto-atendimento, consultório, beira de campo), o teste clínico é suficiente para diagnóstico presuntivo e tomada de decisão inicial. A ressonância é indicada para confirmar a lesão, avaliar estruturas associadas (meniscos, outros ligamentos) e planejamento cirúrgico.

## Conclusão

O Teste de Lachman é uma ferramenta indispensável na avaliação de lesões do joelho. Com sensibilidade superior a 85% e especificidade de 94%, dominar sua técnica é essencial para fisioterapeutas que atuam em ortopedia e traumato-desportiva.

Lembre-se dos pontos-chave: mantenha o joelho em 20-30° de flexão, estabilize bem o fêmur, avalie o endpoint, e sempre compare bilateralmente. Uma documentação clara e objetiva no prontuário é fundamental para o acompanhamento clínico e comunicação interprofissional.

---

**Quer aprofundar seus conhecimentos em avaliação ortopédica?** Explore a [Biblioteca Clínica do RehabRoad](/biblioteca) com dezenas de testes ortopédicos explicados passo a passo, ou conheça nossos conteúdos sobre [Fisioterapia Esportiva](/fisioterapia-esportiva).
    `,
    author: "Equipe Rehabroad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-20",
    readTime: 12,
    category: "Avaliação Clínica",
    tags: ["teste de lachman", "lca", "ligamento cruzado anterior", "joelho", "testes ortopédicos", "avaliação", "fisioterapia esportiva"],
    metaDescription: "Aprenda a realizar o Teste de Lachman corretamente, interpretar os resultados e documentar no prontuário eletrônico. Guia completo baseado em evidência científica."
  },
  {
    id: "1",
    slug: "prontuario-eletronico-fisioterapia-guia-completo",
    title: "Prontuário Eletrônico para Fisioterapia: Guia Completo 2025",
    excerpt: "Entenda como o prontuário eletrônico pode transformar sua prática clínica, garantir conformidade legal e otimizar seu tempo de atendimento.",
    content: `
## O que é um Prontuário Eletrônico para Fisioterapia?

O prontuário eletrônico do paciente (PEP) é um sistema digital que substitui as fichas de papel tradicionais, permitindo registrar, armazenar e acessar todas as informações clínicas de forma segura e organizada.

Para fisioterapeutas, um bom prontuário eletrônico vai além de simplesmente digitalizar anotações — ele deve ser uma ferramenta de **apoio à decisão clínica**.

## Por que migrar para o prontuário eletrônico?

### 1. Conformidade Legal

A **Lei 8.856/94** e as normas do **COFFITO** exigem documentação adequada de todos os atendimentos. O prontuário eletrônico facilita essa conformidade ao:

- Garantir registro de data e hora automáticos
- Manter histórico de alterações (auditoria)
- Permitir assinatura digital
- Gerar relatórios padronizados

### 2. Proteção de Dados (LGPD)

Com a **Lei Geral de Proteção de Dados**, clínicas de fisioterapia precisam garantir:

- Armazenamento seguro dos dados dos pacientes
- Controle de acesso por usuário
- Possibilidade de exclusão de dados mediante solicitação
- Backup automático das informações

### 3. Eficiência no Atendimento

Um sistema bem projetado permite:

- **Redução de 60%** no tempo de documentação
- Acesso rápido ao histórico completo do paciente
- Templates personalizáveis para diferentes condições
- Geração automática de relatórios e laudos

## O que um bom prontuário eletrônico deve ter?

### Funcionalidades Essenciais

1. **Avaliação estruturada**: campos específicos para fisioterapia (EVA, goniometria, testes ortopédicos)
2. **Evolução clínica**: registro de cada sessão com indicadores de progresso
3. **Geração de PDF**: laudos e relatórios profissionais
4. **Acesso em qualquer dispositivo**: web e mobile
5. **Backup na nuvem**: segurança dos dados

### Diferenciais que fazem a diferença

- **Apoio à decisão clínica**: sugestões de hipóteses diagnósticas
- **Parâmetros de eletroterapia**: baseados em evidência científica
- **Alertas de red flags**: não esqueça pontos críticos
- **Testes ortopédicos guiados**: execução e interpretação

## Como escolher o melhor sistema?

Ao avaliar opções de prontuário eletrônico, considere:

1. **Especialização em fisioterapia**: sistemas genéricos não atendem às necessidades específicas
2. **Facilidade de uso**: interface intuitiva que não atrapalhe o fluxo de atendimento
3. **Suporte técnico**: atendimento em português, conhecimento da área
4. **Custo-benefício**: mensalidades acessíveis, sem surpresas
5. **Conformidade**: LGPD, COFFITO, Lei 8.856/94

## Conclusão

O prontuário eletrônico não é mais um luxo — é uma necessidade para fisioterapeutas que querem oferecer atendimento de qualidade, estar em conformidade com a legislação e otimizar seu tempo.

A transição pode parecer desafiadora, mas sistemas modernos como o RehabRoad foram projetados para tornar essa migração simples e sem dor de cabeça.

---

**Quer experimentar um prontuário eletrônico pensado por fisioterapeutas, para fisioterapeutas?** Teste o RehabRoad gratuitamente por 30 dias.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-15",
    readTime: 8,
    category: "Gestão Clínica",
    tags: ["prontuário eletrônico", "gestão", "LGPD", "COFFITO"],
    metaDescription: "Guia completo sobre prontuário eletrônico para fisioterapia. Entenda requisitos legais (LGPD, COFFITO), funcionalidades essenciais e como escolher o melhor sistema."
  },
  {
    id: "2",
    slug: "lgpd-fisioterapia-como-se-adequar",
    title: "LGPD na Fisioterapia: Como Adequar sua Clínica em 2025",
    excerpt: "Saiba como a Lei Geral de Proteção de Dados impacta clínicas de fisioterapia e quais medidas tomar para estar em conformidade.",
    content: `
## O que é a LGPD e por que importa para fisioterapeutas?

A **Lei Geral de Proteção de Dados (Lei 13.709/2018)** estabelece regras sobre coleta, armazenamento e uso de dados pessoais no Brasil. Para profissionais de saúde, incluindo fisioterapeutas, o impacto é significativo.

Dados de saúde são considerados **dados sensíveis** — categoria que exige proteção reforçada.

## Quais dados você coleta?

Na prática clínica, você provavelmente coleta:

- Nome, CPF, telefone, endereço
- Histórico médico e condições de saúde
- Resultados de avaliações e testes
- Fotografias e vídeos (análise postural, evolução)
- Informações de pagamento

**Todos esses dados estão sujeitos à LGPD.**

## Obrigações do Fisioterapeuta

### 1. Consentimento Informado

Antes de coletar dados, o paciente deve:
- Ser informado sobre quais dados serão coletados
- Entender a finalidade do uso
- Consentir de forma livre e clara

**Dica prática**: inclua um termo de consentimento no primeiro atendimento.

### 2. Segurança dos Dados

Você deve implementar medidas para proteger os dados:

- **Senhas fortes** em todos os sistemas
- **Backup regular** das informações
- **Controle de acesso** (quem pode ver o quê)
- **Criptografia** quando possível

### 3. Direitos do Paciente

O paciente pode solicitar:
- Acesso aos seus dados
- Correção de informações incorretas
- Exclusão dos dados (com algumas exceções legais)
- Portabilidade para outro profissional

### 4. Retenção de Dados

A legislação de saúde exige manter prontuários por **20 anos**. Isso não conflita com a LGPD — é uma base legal válida para retenção.

## Penalidades por Descumprimento

A ANPD (Autoridade Nacional de Proteção de Dados) pode aplicar:

- Advertência
- Multa de até **2% do faturamento** (máximo R$ 50 milhões)
- Bloqueio dos dados
- Eliminação dos dados

## Como se adequar na prática

### Passo 1: Mapeie seus dados
Liste todos os dados que você coleta, onde armazena e quem tem acesso.

### Passo 2: Revise seus processos
- Tem termo de consentimento atualizado?
- Seus dados estão seguros?
- Você pode atender solicitações dos pacientes?

### Passo 3: Use ferramentas adequadas
Sistemas como o RehabRoad já são projetados com LGPD em mente:
- Armazenamento seguro na nuvem
- Controle de acesso por usuário
- Logs de auditoria
- Facilidade para exportar/excluir dados

### Passo 4: Documente tudo
Mantenha registro das medidas adotadas — isso demonstra boa-fé em caso de fiscalização.

## Conclusão

A adequação à LGPD não precisa ser complicada. Com processos claros e ferramentas adequadas, você protege seus pacientes e sua clínica.

---

**Precisa de ajuda para adequar sua clínica?** O RehabRoad foi desenvolvido com conformidade LGPD desde o início. Teste grátis por 30 dias.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-10",
    readTime: 7,
    category: "Legislação",
    tags: ["LGPD", "proteção de dados", "conformidade", "legislação"],
    metaDescription: "Como adequar sua clínica de fisioterapia à LGPD. Entenda obrigações, direitos dos pacientes, penalidades e passos práticos para conformidade."
  },
  {
    id: "3",
    slug: "tens-parametros-evidencia-cientifica",
    title: "Parâmetros de TENS: O que a Evidência Científica Recomenda",
    excerpt: "Revisão dos parâmetros de TENS baseados em evidência para diferentes condições. Frequência, intensidade, duração e posicionamento dos eletrodos.",
    content: `
## Introdução à Eletroestimulação Nervosa Transcutânea

A **TENS (Transcutaneous Electrical Nerve Stimulation)** é uma das modalidades de eletroterapia mais utilizadas na fisioterapia. Apesar de sua popularidade, muitos profissionais ainda têm dúvidas sobre os parâmetros ideais.

Este artigo apresenta uma revisão baseada em evidência científica para orientar sua prática clínica.

## Mecanismos de Ação

### Teoria das Comportas (Gate Control)

TENS de alta frequência ativa fibras Aβ de grande diâmetro, inibindo a transmissão de dor no corno dorsal da medula.

### Liberação de Opioides Endógenos

TENS de baixa frequência estimula liberação de endorfinas e encefalinas, promovendo analgesia mais duradoura.

## Parâmetros por Condição Clínica

### Dor Lombar Crônica

**Parâmetros recomendados:**
- Frequência: 80-100 Hz (TENS convencional)
- Largura de pulso: 100-200 µs
- Intensidade: sensação forte, mas confortável
- Duração: 30-60 minutos
- Posicionamento: paravertebral L4-S1

**Evidência:** Nível B (moderada) - Cochrane Review 2019

### Osteoartrite de Joelho

**Parâmetros recomendados:**
- Frequência: 80 Hz ou 4 Hz (burst)
- Largura de pulso: 200 µs
- Intensidade: limiar motor
- Duração: 20-40 minutos
- Posicionamento: acupuntos ou periarticular

**Evidência:** Nível B - OARSI Guidelines 2019

### Dor Cervical

**Parâmetros recomendados:**
- Frequência: 100 Hz
- Largura de pulso: 100 µs
- Intensidade: sensorial forte
- Duração: 20-30 minutos
- Posicionamento: paravertebral C4-C7

**Evidência:** Nível C (limitada)

### Dor Pós-operatória

**Parâmetros recomendados:**
- Frequência: 85-100 Hz
- Largura de pulso: 75-100 µs
- Intensidade: máxima tolerável
- Duração: 30 minutos, 3-4x/dia
- Posicionamento: perilesional

**Evidência:** Nível A (forte) - Bjordal et al. 2003

## Modos de TENS

### TENS Convencional (Alta Frequência)
- 80-150 Hz
- Intensidade sensorial
- Ação rápida, alívio durante aplicação
- Ideal para dor aguda

### TENS Acupuntura (Baixa Frequência)
- 2-10 Hz
- Intensidade motora (contrações visíveis)
- Ação mais lenta, efeito prolongado
- Ideal para dor crônica

### TENS Burst
- Rajadas de alta frequência em envelope de baixa frequência
- Combina vantagens dos dois modos
- Boa opção quando paciente não tolera contrações

## Contraindicações

**Absolutas:**
- Marcapasso cardíaco
- Gestação (região abdominal)
- Região do seio carotídeo
- Sobre tumores malignos

**Relativas:**
- Epilepsia
- Alterações de sensibilidade
- Feridas abertas
- Trombose venosa profunda

## Dicas Práticas

1. **Sempre ajuste a intensidade** com feedback do paciente
2. **Reavalie os parâmetros** a cada sessão
3. **Documente os resultados** para ajustar conduta
4. **Combine com exercícios** para melhores resultados

## Conclusão

A TENS é uma ferramenta eficaz quando utilizada com parâmetros adequados. A escolha entre alta e baixa frequência deve considerar a condição clínica e resposta individual do paciente.

---

**Quer ter esses parâmetros sempre à mão?** O módulo NeuroFlux do RehabRoad fornece recomendações de eletroterapia baseadas em evidência para cada condição. Teste grátis.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-05",
    readTime: 10,
    category: "Eletroterapia",
    tags: ["TENS", "eletroterapia", "parâmetros", "evidência científica"],
    metaDescription: "Parâmetros de TENS baseados em evidência científica para dor lombar, osteoartrite, dor cervical e pós-operatório. Frequência, intensidade e posicionamento."
  },
  {
    id: "4",
    slug: "avaliacao-fisioterapeutica-estruturada",
    title: "Como Fazer uma Avaliação Fisioterapêutica Completa e Estruturada",
    excerpt: "Guia passo a passo para realizar avaliações fisioterapêuticas completas, identificar red flags e estruturar seu raciocínio clínico.",
    content: `
## A Importância da Avaliação Estruturada

Uma avaliação bem feita é a base de todo tratamento eficaz. Ela permite:

- Identificar a causa raiz do problema
- Descartar condições graves (red flags)
- Estabelecer metas mensuráveis
- Documentar para fins legais e de seguimento

## Estrutura Recomendada

### 1. Anamnese

**Dados pessoais:**
- Nome, idade, profissão
- Atividades físicas e hobbies
- Comorbidades e medicações

**Queixa principal:**
- O que trouxe o paciente?
- Quando começou?
- Como evoluiu?

**Caracterização da dor (PQRST):**
- **P**rovoca/alivia: o que piora ou melhora?
- **Q**ualidade: queimação, pontada, pressão?
- **R**adiação: irradia para algum lugar?
- **S**everidade: escala 0-10 (EVA)
- **T**empo: constante, intermitente, quando piora?

### 2. Red Flags - Sinais de Alerta

**Sempre investigue:**
- Perda de peso inexplicada
- Febre associada
- Dor noturna que acorda
- Histórico de câncer
- Trauma recente
- Alterações esfincterianas
- Fraqueza progressiva bilateral

**Se presente: encaminhar para investigação médica**

### 3. Exame Físico

**Inspeção:**
- Postura estática
- Marcha
- Trofismo muscular
- Sinais inflamatórios

**Palpação:**
- Pontos dolorosos
- Tensão muscular
- Temperatura
- Edema

**Amplitude de Movimento:**
- Ativo vs passivo
- Goniometria quando necessário
- Padrão capsular vs não-capsular

**Força Muscular:**
- Escala de Oxford (0-5)
- Grupos funcionais

**Testes Especiais:**
- Específicos para a região
- Sensibilidade e especificidade conhecidas
- Interpretação clínica

### 4. Diagnóstico Fisioterapêutico

Baseado nos achados, formule:

- **Hipótese diagnóstica principal**
- **Diagnósticos diferenciais**
- **Fatores contribuintes**

### 5. Plano de Tratamento

- Objetivos de curto prazo (2-4 semanas)
- Objetivos de longo prazo
- Frequência de atendimento
- Modalidades a utilizar
- Orientações para casa

## Documentação

### O que documentar?

- Todos os achados positivos E negativos relevantes
- Medidas objetivas (EVA, ADM, força)
- Raciocínio clínico
- Plano proposto
- Consentimento do paciente

### Por que documentar bem?

1. **Proteção legal**: prova do que foi feito
2. **Continuidade**: outro profissional pode assumir
3. **Evolução**: comparação ao longo do tempo
4. **Auditoria**: planos de saúde exigem

## Conclusão

Uma avaliação estruturada não é burocracia — é ferramenta clínica. Com prática, você desenvolve um fluxo eficiente que melhora seus resultados e protege sua prática.

---

**Quer ter uma avaliação estruturada digital?** O RehabRoad oferece templates específicos para fisioterapia com campos para EVA, testes ortopédicos e geração automática de relatórios. Teste grátis.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-28",
    readTime: 9,
    category: "Avaliação Clínica",
    tags: ["avaliação", "anamnese", "red flags", "diagnóstico"],
    metaDescription: "Guia completo para avaliação fisioterapêutica estruturada. Anamnese, red flags, exame físico, testes especiais e documentação adequada."
  },
  {
    id: "5",
    slug: "testes-ortopedicos-ombro-guia-pratico",
    title: "Testes Ortopédicos de Ombro: Guia Prático com Interpretação",
    excerpt: "Aprenda a executar e interpretar os principais testes ortopédicos de ombro: Neer, Hawkins, Jobe, Speed e mais.",
    content: `
## Introdução

O ombro é uma das articulações mais complexas do corpo humano. Os testes ortopédicos são ferramentas essenciais para direcionar o diagnóstico, mas precisam ser interpretados em conjunto com a clínica.

## Síndrome do Impacto

### Teste de Neer

**Execução:**
1. Paciente sentado ou em pé
2. Estabilize a escápula com uma mão
3. Com a outra, eleve passivamente o braço em flexão e rotação interna
4. Positivo: dor entre 70-120° de elevação

**Interpretação:**
- Sensibilidade: 79%
- Especificidade: 53%
- Sugere impacto subacromial

### Teste de Hawkins-Kennedy

**Execução:**
1. Paciente com braço a 90° de flexão
2. Cotovelo a 90°
3. Realize rotação interna passiva forçada
4. Positivo: dor na região anterolateral

**Interpretação:**
- Sensibilidade: 92%
- Especificidade: 44%
- Alta sensibilidade = bom para screening

## Manguito Rotador

### Teste de Jobe (Empty Can)

**Execução:**
1. Braços a 90° de abdução no plano da escápula
2. Rotação interna máxima (polegares para baixo)
3. Aplique resistência para baixo
4. Positivo: dor ou fraqueza

**Interpretação:**
- Avalia supraespinhal
- Fraqueza sugere lesão
- Dor isolada pode ser tendinopatia

### Teste de Gerber (Lift-off)

**Execução:**
1. Mão do paciente nas costas, dorso da mão na região lombar
2. Peça para afastar a mão das costas
3. Positivo: incapacidade de manter posição

**Interpretação:**
- Avalia subescapular
- Positivo sugere lesão significativa

### Rotação Externa Resistida

**Execução:**
1. Cotovelo a 90°, junto ao corpo
2. Resistência à rotação externa
3. Positivo: fraqueza comparada ao lado oposto

**Interpretação:**
- Avalia infraespinhal e redondo menor
- Compare sempre bilateralmente

## Instabilidade

### Teste de Apreensão

**Execução:**
1. Paciente em decúbito dorsal
2. Braço a 90° de abdução, cotovelo a 90°
3. Realize rotação externa máxima com leve pressão anterior
4. Positivo: apreensão ou sensação de instabilidade

**Interpretação:**
- Alta especificidade para instabilidade anterior
- Apreensão mais relevante que dor

### Teste de Realocação (Jobe)

**Execução:**
1. Mesma posição do teste de apreensão
2. Aplique força posterior no úmero proximal
3. Positivo: alívio da apreensão

**Interpretação:**
- Confirma origem mecânica
- Diferencia de dor por outras causas

## Bíceps e SLAP

### Teste de Speed

**Execução:**
1. Braço estendido, supinado
2. Resistência à flexão do ombro
3. Positivo: dor no sulco bicipital

**Interpretação:**
- Sensibilidade: 32%
- Especificidade: 75%
- Deve ser combinado com outros testes

### Teste de O'Brien

**Execução:**
1. Braço a 90° de flexão, 10-15° de adução
2. Cotovelo estendido, polegar para baixo
3. Resistência para baixo
4. Repita com supinação
5. Positivo: dor na pronação, alívio na supinação

**Interpretação:**
- Sugere lesão de labrum (SLAP)
- Especificidade razoável quando bem executado

## Dicas Práticas

1. **Nunca use um teste isolado** - combine vários
2. **Compare bilateralmente** - o outro lado é seu controle
3. **Considere a clínica** - testes são complementares
4. **Documente os achados** - positivo, negativo ou duvidoso
5. **Atualize seus conhecimentos** - literatura evolui

## Conclusão

Dominar os testes ortopédicos de ombro permite avaliações mais precisas e tratamentos mais direcionados. A prática repetida e a correlação clínica são fundamentais.

---

**Quer ter guias de testes ortopédicos no seu sistema?** O RehabRoad inclui biblioteca de testes com execução passo a passo e interpretação clínica. Teste grátis.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-20",
    readTime: 11,
    category: "Avaliação Clínica",
    tags: ["testes ortopédicos", "ombro", "manguito rotador", "avaliação"],
    metaDescription: "Guia prático de testes ortopédicos de ombro para fisioterapeutas. Neer, Hawkins, Jobe, Speed, O'Brien - execução e interpretação clínica."
  },
  {
    id: "6",
    slug: "evolucao-clinica-fisioterapia-como-documentar",
    title: "Evolução Clínica em Fisioterapia: Como Documentar Corretamente",
    excerpt: "Aprenda a fazer evoluções clínicas que demonstram resultados, protegem legalmente e facilitam a comunicação com outros profissionais.",
    content: `
## Por que a Evolução é Importante?

A evolução clínica é o registro de cada atendimento. Ela serve para:

1. **Acompanhar progresso** - comparar ao longo do tempo
2. **Comunicar com outros profissionais** - médicos, outros fisios
3. **Proteção legal** - prova do que foi realizado
4. **Auditoria** - planos de saúde exigem
5. **Reflexão clínica** - ajustar conduta quando necessário

## Estrutura Recomendada: SOAP

O método SOAP é amplamente aceito e organiza a evolução de forma lógica:

### S - Subjetivo

O que o paciente relata:
- Como se sentiu desde a última sessão?
- Houve melhora, piora ou manteve?
- Conseguiu fazer os exercícios em casa?
- Algum evento relevante?

**Exemplo:**
*"Paciente refere melhora de 30% da dor desde última sessão. Conseguiu realizar exercícios domiciliares 4x na semana. Relata que subir escadas ainda provoca desconforto."*

### O - Objetivo

O que você observou e mediu:
- EVA atual
- ADM se relevante
- Testes reavaliados
- Observações clínicas

**Exemplo:**
*"EVA repouso: 2/10 (era 5/10). EVA movimento: 4/10 (era 7/10). ADM flexão joelho: 120° (era 100°). Marcha sem claudicação."*

### A - Avaliação

Sua interpretação clínica:
- Evolução compatível com esperado?
- Hipótese se mantém?
- Necessidade de ajuste?

**Exemplo:**
*"Evolução favorável, compatível com tendinopatia patelar em fase de remodelamento. Paciente respondendo bem ao protocolo excêntrico."*

### P - Plano

O que foi feito e próximos passos:
- Condutas realizadas nesta sessão
- Ajustes para próximas sessões
- Orientações dadas
- Frequência de atendimento

**Exemplo:**
*"Realizados: ultrassom terapêutico 1MHz 1,0W/cm² 5min; exercícios excêntricos 3x15; alongamentos. Próxima sessão: progredir carga excêntrica se EVA < 3. Orientado aumentar exercícios para 2x/dia."*

## Indicadores Objetivos

### Sempre que possível, use números:

- **EVA**: 0-10, em repouso e movimento
- **ADM**: graus, goniometria
- **Força**: escala Oxford 0-5
- **Funcionalidade**: escalas validadas (LEFS, DASH, etc.)
- **Distância/tempo**: teste de caminhada, tempo para tarefa

### Por que números importam?

1. Comparação objetiva entre sessões
2. Demonstração clara de resultados
3. Menos subjetivo = menos contestável
4. Facilita comunicação com outros profissionais

## Erros Comuns

### ❌ Evolução genérica
*"Paciente evoluindo bem. Realizadas condutas de rotina."*

### ✅ Evolução específica
*"EVA reduziu de 6 para 3. ADM flexão aumentou 15°. Realizados: mobilização grau III, exercícios de estabilização, gelo 15min."*

### ❌ Falta de mensuração
*"Paciente consegue caminhar mais."*

### ✅ Mensuração adequada
*"Paciente consegue caminhar 500m sem parar (era 200m há 2 semanas)."*

### ❌ Condutas vagas
*"Fisioterapia convencional."*

### ✅ Condutas detalhadas
*"US 1MHz contínuo 1,5W/cm² 7min região anterior joelho. Alongamento quadríceps 3x30s. Fortalecimento excêntrico sentadeira 3x12 70% 1RM."*

## Frequência de Evolução

- **Cada sessão**: evolução básica SOAP
- **Reavaliação formal**: a cada 5-10 sessões ou mensalmente
- **Alta**: relatório final com comparativo inicial x final

## Ferramentas Digitais

Sistemas de prontuário eletrônico facilitam:
- Templates padronizados
- Comparativo automático de indicadores
- Gráficos de evolução
- Geração de relatórios para convênios

## Conclusão

Uma boa evolução clínica não precisa ser longa — precisa ser **específica, mensurável e relevante**. Com prática, você desenvolve um padrão eficiente que protege sua prática e demonstra seus resultados.

---

**Quer ter evoluções estruturadas com indicadores automáticos?** O RehabRoad gera gráficos de evolução e relatórios profissionais. Teste grátis por 30 dias.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-15",
    readTime: 8,
    category: "Gestão Clínica",
    tags: ["evolução clínica", "documentação", "SOAP", "prontuário"],
    metaDescription: "Como documentar evolução clínica em fisioterapia usando método SOAP. Indicadores objetivos, erros comuns e melhores práticas de documentação."
  },
  {
    id: "7",
    slug: "dor-lombar-tratamento-fisioterapia",
    title: "Dor Lombar: Tratamento Fisioterapêutico Baseado em Evidência",
    excerpt: "Protocolo completo para tratamento de lombalgia aguda e crônica com técnicas de fisioterapia comprovadas cientificamente.",
    content: `
## Epidemiologia da Dor Lombar

A dor lombar é a principal causa de incapacidade no mundo, afetando **80% da população** em algum momento da vida. No Brasil, representa uma das maiores causas de afastamento do trabalho.

## Classificação da Lombalgia

### Por tempo de evolução
- **Aguda**: menos de 6 semanas
- **Subaguda**: 6-12 semanas
- **Crônica**: mais de 12 semanas

### Por etiologia
- **Específica**: com causa identificável (hérnia, fratura, tumor)
- **Inespecífica**: sem causa estrutural definida (85-90% dos casos)

## Red Flags na Lombalgia

Sinais de alerta que indicam investigação imediata:
- Trauma significativo
- Perda de peso inexplicada
- Febre
- Déficit neurológico progressivo
- Síndrome da cauda equina
- História de câncer

## Avaliação Fisioterapêutica

### Testes específicos
- **Lasègue/SLR**: irritação radicular
- **Slump Test**: tensão neural
- **Centralização/periferização**: McKenzie
- **Instabilidade segmentar**: prone instability test

### Questionários validados
- Oswestry Disability Index (ODI)
- Roland-Morris
- Escala Visual Analógica (EVA)

## Tratamento Baseado em Evidência

### Fase aguda (0-6 semanas)
1. **Educação do paciente**: tranquilizar, explicar prognóstico favorável
2. **Manter-se ativo**: evitar repouso prolongado
3. **Terapia manual**: mobilização grau baixo
4. **Exercícios suaves**: dentro do tolerável

### Fase crônica
1. **Exercícios terapêuticos**: principal intervenção (Nível A de evidência)
2. **Abordagem cognitivo-comportamental**
3. **Educação em neurociência da dor**
4. **Pilates/controle motor**

## Protocolos de Exercícios

### McKenzie
- Extensão repetida em prono
- Progressão baseada na resposta

### Estabilização segmentar
- Ativação transverso abdominal
- Multífidos
- Progressão funcional

### Exercícios gerais
- Fortalecimento global
- Condicionamento aeróbico
- Flexibilidade

## Eletroterapia na Lombalgia

- **TENS**: evidência moderada para dor aguda
- **Ultrassom**: evidência fraca
- **Corrente interferencial**: pode auxiliar no controle álgico

## Prognóstico

- 90% melhoram em 6 semanas
- 7-10% desenvolvem dor crônica
- Fatores psicossociais (yellow flags) predizem cronificação

---

**Documente seus casos de lombalgia com o RehabRoad** — avaliação estruturada e acompanhamento da evolução da dor. Teste grátis.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-20",
    readTime: 10,
    category: "Tratamento",
    tags: ["dor lombar", "lombalgia", "coluna", "McKenzie", "exercícios"],
    metaDescription: "Tratamento fisioterapêutico da dor lombar baseado em evidência. Avaliação, classificação, red flags e protocolos de exercícios para lombalgia."
  },
  {
    id: "8",
    slug: "hernia-de-disco-fisioterapia-tratamento",
    title: "Hérnia de Disco: Tratamento Conservador com Fisioterapia",
    excerpt: "Como tratar hérnia de disco lombar e cervical com fisioterapia. Quando operar e quando o tratamento conservador é eficaz.",
    content: `
## O que é Hérnia de Disco?

A hérnia de disco ocorre quando o núcleo pulposo do disco intervertebral extravasa através do anel fibroso, podendo comprimir raízes nervosas e causar dor irradiada.

## Tipos de Hérnia

### Por localização
- **Hérnia lombar**: L4-L5 e L5-S1 mais comuns
- **Hérnia cervical**: C5-C6 e C6-C7 mais frequentes
- **Hérnia torácica**: rara

### Por grau de protrusão
- **Abaulamento**: deformação do contorno
- **Protrusão**: núcleo empurra anel
- **Extrusão**: núcleo atravessa anel
- **Sequestro**: fragmento livre no canal

## Sintomas por Nível

### Hérnia L4-L5
- Dor face lateral da coxa e perna
- Fraqueza extensão hálux
- Reflexo: pode haver diminuição

### Hérnia L5-S1
- Dor face posterior coxa e panturrilha
- Fraqueza flexão plantar
- Reflexo aquileu diminuído

### Hérnia cervical C5-C6
- Dor ombro e face lateral braço
- Fraqueza bíceps
- Reflexo bicipital diminuído

## Quando o Tratamento Conservador Funciona?

Evidências mostram que **80-90% dos casos** melhoram com tratamento conservador em 6-12 semanas.

### Indicações para tratamento conservador
- Déficit neurológico leve ou ausente
- Dor controlável
- Ausência de síndrome da cauda equina
- Primeira linha de tratamento

### Indicações cirúrgicas
- Déficit motor progressivo
- Síndrome da cauda equina
- Dor intratável após 6-12 semanas
- Perda de controle esfincteriano

## Tratamento Fisioterapêutico

### Fase aguda (0-4 semanas)
1. **Educação**: prognóstico favorável, evitar catastrofização
2. **Posicionamento antálgico**: posição de alívio
3. **Tração manual suave**: se houver centralização
4. **TENS**: controle da dor
5. **Exercícios isométricos leves**

### Fase subaguda (4-8 semanas)
1. **McKenzie**: extensão se centralizar
2. **Mobilização neural**: técnica de slump, SLR
3. **Estabilização segmentar**: ativação core
4. **Hidroterapia**: descarga axial reduzida

### Fase crônica/reabilitação
1. **Fortalecimento progressivo**
2. **Condicionamento aeróbico**
3. **Educação postural**
4. **Retorno às atividades

## Técnicas Específicas

### Mobilização neural
- Tensionadores vs deslizantes
- Progressão gradual
- Respeitar irritabilidade do tecido

### McKenzie
- Avaliação mecânica
- Centralização = bom prognóstico
- Periferização = contraindicação temporária

## Prognóstico

- Reabsorção da hérnia pode ocorrer em 6-12 meses
- Hérnias maiores têm maior taxa de reabsorção
- Fatores psicossociais influenciam resultado

---

**Acompanhe a evolução de pacientes com hérnia de disco** no RehabRoad. Gráficos de dor e funcionalidade ao longo do tratamento.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-18",
    readTime: 11,
    category: "Tratamento",
    tags: ["hérnia de disco", "coluna lombar", "coluna cervical", "ciática", "McKenzie"],
    metaDescription: "Tratamento fisioterapêutico da hérnia de disco. Quando operar vs tratamento conservador, técnicas de mobilização neural e exercícios."
  },
  {
    id: "9",
    slug: "dor-no-joelho-causas-tratamento-fisioterapia",
    title: "Dor no Joelho: Causas Comuns e Tratamento Fisioterapêutico",
    excerpt: "Guia completo sobre dor no joelho: diagnóstico diferencial, testes ortopédicos e protocolos de reabilitação para cada condição.",
    content: `
## Anatomia Funcional do Joelho

O joelho é a maior articulação do corpo, formada por:
- Articulação tibiofemoral
- Articulação patelofemoral
- Meniscos medial e lateral
- Ligamentos cruzados e colaterais

## Causas Comuns de Dor no Joelho

### Por região

**Dor anterior**
- Síndrome patelofemoral
- Tendinopatia patelar
- Doença de Osgood-Schlatter
- Bursite pré-patelar

**Dor medial**
- Lesão menisco medial
- Lesão LCM
- Artrose medial
- Bursite anserina

**Dor lateral**
- Síndrome da banda iliotibial
- Lesão menisco lateral
- Lesão LCL

**Dor posterior**
- Cisto de Baker
- Tendinopatia isquiotibiais

## Testes Ortopédicos Essenciais

### Ligamentos
- **Lachman**: LCA (mais sensível)
- **Gaveta anterior**: LCA
- **Gaveta posterior**: LCP
- **Estresse valgo/varo**: LCM/LCL

### Meniscos
- **McMurray**: rotação + extensão
- **Apley**: compressão + rotação
- **Thessaly**: rotação em carga

### Patelofemoral
- **Clarke/Zohlen**: compressão patelar
- **Apreensão**: luxação patelar
- **J-sign**: tracking patelar

## Síndrome Patelofemoral

### Fisiopatologia
- Desequilíbrio vasto medial/lateral
- Fraqueza glútea (valgo dinâmico)
- Encurtamento TIT/isquiotibiais
- Hipermobilidade patelar

### Tratamento
1. **Fortalecimento VMO**: extensão terminal
2. **Fortalecimento glúteo**: foco em rotadores externos
3. **Alongamento**: TIT, isquiotibiais, quadríceps
4. **Taping patelar**: McConnell
5. **Educação**: controle de carga

## Lesões Ligamentares

### Pós LCA - Protocolo
- **0-2 sem**: controle edema, ADM, marcha
- **2-6 sem**: ADM completa, força isométrica
- **6-12 sem**: força isotônica, propriocepção
- **3-6 meses**: corrida, agilidade
- **6-9 meses**: retorno ao esporte

### Critérios de alta
- Força >90% contralateral
- Hop tests simétricos
- Confiança psicológica

## Lesões Meniscais

### Conservador vs cirúrgico
- Lesões degenerativas: tratamento conservador
- Lesões traumáticas em jovens: considerar reparo
- Sintomas mecânicos persistentes: artroscopia

### Reabilitação conservadora
- Controle de carga
- Fortalecimento muscular
- Propriocepção
- Modificação de atividades

## Artrose de Joelho

### Tratamento de primeira linha
1. **Exercícios**: evidência nível A
2. **Perda de peso**: se sobrepeso
3. **Educação**: autogerenciamento

### Exercícios recomendados
- Fortalecimento quadríceps
- Exercícios aeróbicos de baixo impacto
- Hidroterapia
- Tai chi

---

**Organize avaliações de joelho com templates prontos** no RehabRoad. Todos os testes ortopédicos em um só lugar.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-22",
    readTime: 12,
    category: "Tratamento",
    tags: ["dor no joelho", "joelho", "menisco", "LCA", "patelofemoral", "artrose"],
    metaDescription: "Causas de dor no joelho e tratamento fisioterapêutico. Testes ortopédicos, síndrome patelofemoral, lesões ligamentares e protocolos de reabilitação."
  },
  {
    id: "10",
    slug: "tendinite-tendinopatia-tratamento",
    title: "Tendinite e Tendinopatia: Tratamento Atualizado em Fisioterapia",
    excerpt: "Diferença entre tendinite e tendinopatia, por que anti-inflamatórios nem sempre ajudam, e como tratar com exercícios excêntricos.",
    content: `
## Tendinite vs Tendinopatia

### Conceito antigo: tendinite
- Inflamação do tendão
- Tratamento: repouso + anti-inflamatório

### Conceito atual: tendinopatia
- Processo degenerativo (não inflamatório)
- Desorganização das fibras de colágeno
- Neovascularização
- Tratamento: **carga progressiva**

## Por que repouso não funciona?

O tendão precisa de **carga mecânica** para:
- Estimular síntese de colágeno
- Reorganizar fibras
- Melhorar propriedades mecânicas

Repouso prolongado leva a:
- Atrofia tendínea
- Perda de resistência
- Recidiva ao retorno das atividades

## Tendinopatias Comuns

### Tendão de Aquiles
- Porção média: mais comum
- Inserção: entesopatia

### Tendão patelar
- "Joelho de saltador"
- Comum em esportes de salto

### Manguito rotador
- Supraespinhal mais afetado
- Relacionado a impacto subacromial

### Epicondilites
- Lateral: extensores do punho
- Medial: flexores do punho

### Fasciíte plantar
- Atualmente considerada fasci-opatia

## Avaliação

### Testes de carga progressiva
1. Dor à palpação
2. Dor ao alongamento
3. Dor à contração isométrica
4. Dor ao teste funcional

### Questionários
- VISA-A (Aquiles)
- VISA-P (patelar)
- DASH (membro superior)

## Tratamento Baseado em Evidência

### Exercícios excêntricos
- **Protocolo Alfredson** (Aquiles): 3x15, 2x/dia, 12 semanas
- **Progressão**: aumentar carga quando dor <5/10
- **Evidência**: nível A

### Heavy Slow Resistance (HSR)
- 3-4x/semana
- 3-4 séries de 6-15 repetições
- Tempo lento (3-4 segundos cada fase)
- Resultados similares ao excêntrico

### Isométricos
- Úteis na fase mais dolorosa
- 45 segundos sustentados
- Efeito analgésico imediato

## Ondas de Choque (ESWT)

- Evidência crescente
- Indicado quando exercícios falham
- 3-5 sessões, intervalo semanal
- Maior evidência: calcificações

## O que NÃO funciona

- Repouso prolongado
- Anti-inflamatórios a longo prazo
- Gelo isoladamente
- Infiltração de corticoide (efeito deletério)
- US e laser (evidência fraca)

## Progressão e Retorno

### Critérios de progressão
1. Dor durante/após <3/10
2. Sem edema reacional
3. Tolerância à carga anterior

### Retorno ao esporte
- Gradual e progressivo
- Monitorar sintomas 24-48h após
- Expectativa: 3-6 meses

---

**Monitore a evolução das tendinopatias** com o RehabRoad — acompanhe dor e função ao longo do tratamento.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-17",
    readTime: 10,
    category: "Tratamento",
    tags: ["tendinite", "tendinopatia", "excêntrico", "tendão de Aquiles", "tendão patelar"],
    metaDescription: "Diferença entre tendinite e tendinopatia. Tratamento com exercícios excêntricos, Heavy Slow Resistance e por que repouso não funciona."
  },
  {
    id: "11",
    slug: "dor-no-ombro-causas-diagnostico-tratamento",
    title: "Dor no Ombro: Diagnóstico Diferencial e Tratamento",
    excerpt: "Principais causas de dor no ombro, testes ortopédicos essenciais e protocolos de tratamento para cada condição.",
    content: `
## Anatomia do Complexo do Ombro

O ombro é composto por 4 articulações:
- Glenoumeral (principal)
- Acromioclavicular
- Esternoclavicular
- Escapulotorácica

## Causas Comuns de Dor no Ombro

### Tendinopatia do manguito rotador
- Mais comum (60-70% das dores)
- Supraespinhal mais afetado
- Relacionada a sobrecarga

### Síndrome do impacto subacromial
- Compressão no espaço subacromial
- Dor ao elevar braço (arco doloroso)
- Fatores biomecânicos

### Capsulite adesiva (ombro congelado)
- Restrição ativa e passiva
- Fases: congelamento, congelado, descongelamento
- Dura 12-24 meses se não tratado

### Instabilidade glenoumeral
- Luxação/subluxação
- TUBS vs AMBRI
- Comum em jovens atletas

### Artrose acromioclavicular
- Dor no topo do ombro
- Positivo em testes AC específicos

## Testes Ortopédicos Essenciais

### Manguito rotador
- **Jobe (empty can)**: supraespinhal
- **Lift-off/Belly press**: subescapular
- **Hornblower**: redondo menor
- **Rotação externa resistida**: infraespinhal

### Impacto
- **Neer**: flexão passiva máxima
- **Hawkins-Kennedy**: rotação interna forçada
- **Jobe relocation**: diferencia impacto de instabilidade

### Instabilidade
- **Apreensão**: luxação anterior
- **Sulco**: instabilidade inferior
- **Load and shift**: frouxidão

### Capsulite
- Restrição rotação externa passiva
- Padrão capsular

## Tratamento por Condição

### Tendinopatia do manguito
1. **Fase dolorosa**: isométricos, educação
2. **Reforço**: excêntricos/HSR
3. **Funcional**: gestos específicos

### Capsulite adesiva
1. **Fase 1** (congelamento): analgesia, gentil
2. **Fase 2** (congelado): mobilização gradual
3. **Fase 3** (descongelamento): intensificar ADM
- Considerar hidrodilatação se refratário

### Síndrome do impacto
1. Correção postural escapular
2. Fortalecimento manguito
3. Alongamento posterior
4. Reeducação de movimento

### Instabilidade
- Estabilização dinâmica
- Propriocepção
- Fortalecimento rotadores
- Cirurgia se instabilidade recorrente

## Exercícios Fundamentais

### Fortalecimento manguito
- Rotação externa em decúbito lateral
- Rotação interna com faixa
- Elevação escapular (Y, T, W)

### Estabilização escapular
- Push-up plus
- Row horizontal
- Serrátil anterior

### Alongamentos
- Sleeper stretch
- Alongamento posterior
- Cross-body stretch

---

**Avalie e documente casos de ombro** com templates completos no RehabRoad. Testes ortopédicos organizados por estrutura.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-19",
    readTime: 11,
    category: "Tratamento",
    tags: ["dor no ombro", "manguito rotador", "capsulite adesiva", "impacto", "ombro congelado"],
    metaDescription: "Causas de dor no ombro: tendinopatia do manguito, capsulite adesiva, impacto. Testes ortopédicos e protocolos de tratamento."
  },
  {
    id: "12",
    slug: "dor-ciatica-nervo-ciatico-tratamento",
    title: "Dor Ciática: Causas, Diagnóstico e Tratamento Fisioterapêutico",
    excerpt: "Entenda a dor ciática verdadeira vs referida, como diagnosticar e tratar com mobilização neural e exercícios.",
    content: `
## O que é Dor Ciática?

A ciática (ou ciatalgia) é uma dor que irradia pelo trajeto do nervo ciático — da região lombar/glútea até o pé. É um **sintoma**, não um diagnóstico.

## Ciática Verdadeira vs Dor Referida

### Ciática verdadeira (radiculopatia)
- Compressão da raiz nervosa
- Segue dermátomo específico
- Pode ter déficit motor/sensitivo
- Reflexos alterados

### Dor referida
- Origem em outras estruturas (faceta, disco, músculo)
- Não segue dermátomo exato
- Sem déficit neurológico
- Exame neurológico normal

## Causas de Ciática

### Compressão radicular
- Hérnia de disco (mais comum)
- Estenose de canal
- Espondilolistese
- Síndrome do piriforme

### Níveis mais afetados
- **L5**: dor lateral da perna, dorso do pé
- **S1**: dor posterior da perna, planta do pé

## Avaliação

### Testes de tensão neural
- **Lasègue/SLR**: elevação perna estendida
- **Slump test**: flexão cervical + SLR
- **Prone knee bend**: raízes lombares altas (L2-L4)

### Exame neurológico
- Dermátomos: sensibilidade
- Miótomos: força
- Reflexos: patelar (L4), aquileu (S1)

### Red flags
- Síndrome da cauda equina
- Déficit motor progressivo
- Retenção urinária

## Tratamento Conservador

### Fase aguda
1. **Educação**: prognóstico favorável
2. **Posição de alívio**: flexão quadril
3. **Medicação**: se necessário (não só fisio)
4. **Movimento ativo**: dentro do tolerado
5. **Evitar**: posições de aumento dos sintomas

### Mobilização neural

**Técnica de deslizamento**
- Estende joelho + flexiona cervical simultaneamente
- Desliza nervo sem tensioná-lo
- Indicado em irritabilidade alta

**Técnica de tensionamento**
- Aumenta tensão no sistema nervoso
- Indicado após fase aguda
- Progressão gradual

### Exercícios McKenzie
- Se houver centralização com extensão
- Extensão repetida em prono
- Progressão para extensão em pé

### Estabilização lombar
- Após fase aguda
- Core/estabilização segmentar
- Prevenção de recidivas

## Prognóstico

- **80-90%** melhoram em 6-12 semanas
- Fatores psicossociais influenciam
- Centralização = bom prognóstico
- Periferização persistente = considerar outras opções

## Quando Encaminhar

- Síndrome da cauda equina (emergência)
- Déficit motor progressivo
- Falha tratamento conservador 6-12 semanas
- Dor incontrolável

---

**Acompanhe a evolução da dor ciática** com gráficos de irradiação e intensidade no RehabRoad.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-21",
    readTime: 10,
    category: "Tratamento",
    tags: ["ciática", "nervo ciático", "dor irradiada", "mobilização neural", "radiculopatia"],
    metaDescription: "Dor ciática: diferença entre radiculopatia e dor referida, testes diagnósticos, mobilização neural e tratamento fisioterapêutico."
  },
  {
    id: "13",
    slug: "artrose-osteoartrite-tratamento-fisioterapia",
    title: "Artrose (Osteoartrite): Tratamento com Fisioterapia e Exercícios",
    excerpt: "Evidências atualizadas sobre tratamento conservador da artrose. Por que exercício é a principal intervenção.",
    content: `
## O que é Artrose?

A osteoartrite (OA), popularmente chamada de artrose, é uma doença articular caracterizada por:
- Degradação da cartilagem
- Remodelação óssea
- Inflamação sinovial
- Alterações em todo o "órgão articular"

## Articulações Mais Afetadas

1. **Joelho**: mais comum, maior impacto funcional
2. **Quadril**: incapacitante
3. **Mãos**: frequente, especialmente em mulheres
4. **Coluna**: espondiloartrose

## Fatores de Risco

### Modificáveis
- Obesidade (principal)
- Fraqueza muscular
- Lesões articulares prévias
- Sobrecarga ocupacional

### Não modificáveis
- Idade
- Sexo feminino
- Genética
- Alterações anatômicas

## Diagnóstico

### Critérios clínicos (ACR)
- Dor articular
- Rigidez matinal <30 minutos
- Crepitação
- Deformidade óssea
- Idade >50 anos

### Radiografia
- Diminuição do espaço articular
- Osteófitos
- Esclerose subcondral
- Cistos subcondrais

## Tratamento de Primeira Linha

### Exercício terapêutico (Evidência A)
- **Principal intervenção**
- Efeito: redução de dor e melhora funcional
- Comparável a anti-inflamatórios
- Sem efeitos colaterais

### Educação do paciente
- Natureza da doença
- Autogerenciamento
- Importância do exercício
- Controle de peso

### Perda de peso (se sobrepeso)
- 5-10% de redução já traz benefícios
- Reduz carga articular
- Melhora inflamação sistêmica

## Prescrição de Exercícios

### Fortalecimento muscular
- Quadríceps (joelho)
- Glúteos (quadril)
- 2-3x/semana
- Carga progressiva

### Exercício aeróbico
- Baixo impacto preferível
- Caminhada, bicicleta, natação
- 150 min/semana

### Exercícios aquáticos
- Reduz carga articular
- Boa opção para dor intensa
- Evidência positiva

### Tai chi
- Benefícios comprovados para OA joelho
- Equilíbrio + força + flexibilidade

## O que NÃO Funciona

- Suplementos de glucosamina/condroitina: evidência fraca
- Laser: inconsistente
- Ultrassom: sem benefício
- Repouso: prejudicial
- Evitar carga: piora a longo prazo

## TENS na Artrose

- Pode auxiliar no controle da dor
- Permite exercício com menos dor
- Não é tratamento principal
- Usar como coadjuvante

## Indicação Cirúrgica

### Artroplastia (prótese)
- Falha do tratamento conservador
- Dor incapacitante
- Impacto significativo na qualidade de vida

### Fisioterapia pré-operatória
- Melhora resultados pós-operatórios
- Otimiza força e amplitude

---

**Acompanhe pacientes com artrose** no RehabRoad — monitore função e dor ao longo do tratamento conservador.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-16",
    readTime: 10,
    category: "Tratamento",
    tags: ["artrose", "osteoartrite", "joelho", "quadril", "exercícios"],
    metaDescription: "Tratamento da artrose com fisioterapia. Evidências sobre exercícios, perda de peso e por que movimento é o melhor remédio para osteoartrite."
  },
  {
    id: "14",
    slug: "fascite-plantar-tratamento-fisioterapia",
    title: "Fascite Plantar: Causas, Diagnóstico e Tratamento Completo",
    excerpt: "Protocolo de tratamento para fascite plantar (fasci-opatia). Exercícios, alongamentos e ondas de choque.",
    content: `
## O que é Fascite Plantar?

A fascite plantar é a causa mais comum de dor no calcanhar, afetando a inserção da fáscia plantar no calcâneo. Atualmente, o termo **fasci-opatia plantar** é preferido, pois há mais degeneração do que inflamação.

## Fatores de Risco

- Sobrepeso/obesidade
- Ficar muito tempo em pé
- Pé plano ou cavo
- Encurtamento gastrocnêmio/solear
- Aumento súbito de atividade
- Calçados inadequados

## Diagnóstico Clínico

### Sinais característicos
- Dor no calcanhar medial
- **Dor nos primeiros passos da manhã** (patognomônico)
- Melhora com aquecimento
- Piora após longos períodos em pé

### Teste windlass
- Extensão passiva do hálux
- Reproduz a dor
- Aumenta tensão na fáscia

### Exames complementares
- Geralmente desnecessários
- USG: espessamento >4mm
- RX: esporão (presente em 50% assintomáticos)

## Tratamento Baseado em Evidência

### 1. Alongamentos (Evidência A)

**Alongamento específico da fáscia**
- Extensão dos dedos + alongamento fáscia
- 3x ao dia, especialmente antes dos primeiros passos

**Alongamento gastrocnêmio/solear**
- Fundamental
- Manter 30-60 segundos
- 3x cada músculo

### 2. Fortalecimento (Evidência A)

**Protocolo de carga progressiva**
- Similar ao tratamento de tendinopatias
- Elevação de calcâneo com toalha sob dedos
- 3x12 repetições, progressão lenta
- 12 semanas

### 3. Órteses e palmilhas

**Palmilhas pré-fabricadas**
- Suporte de arco
- Evidência moderada
- Mais custo-efetivas que personalizadas

**Tala noturna**
- Mantém tornozelo em neutro
- Útil em casos crônicos

### 4. Ondas de choque (ESWT)

- Indicado após 6 meses de tratamento sem sucesso
- 3-5 sessões
- Boa evidência em casos crônicos

## O que Evitar

- Repouso absoluto
- Gelo isoladamente (não resolve causa)
- Infiltração de corticoide repetida (pode causar ruptura)
- Cirurgia precoce

## Prognóstico

- 80% melhoram em 12 meses
- Pode ser crônico se não tratado adequadamente
- Recidivas comuns se fatores não corrigidos

## Programa Domiciliar

### Manhã (antes de levantar)
1. Alongamento fáscia com toalha
2. Massagem com bolinha
3. Alongamento gastrocnêmio

### Noite
1. Alongamentos completos
2. Fortalecimento
3. Tala noturna (se prescrita)

---

**Prescreva exercícios para fascite plantar** com o RehabRoad e envie via WhatsApp para seus pacientes.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-14",
    readTime: 9,
    category: "Tratamento",
    tags: ["fascite plantar", "dor no calcanhar", "pé", "alongamento", "ondas de choque"],
    metaDescription: "Tratamento da fascite plantar com fisioterapia. Alongamentos específicos, fortalecimento, palmilhas e quando indicar ondas de choque."
  },
  {
    id: "15",
    slug: "fibromialgia-fisioterapia-exercicios",
    title: "Fibromialgia: Como a Fisioterapia e o Exercício Podem Ajudar",
    excerpt: "Entenda a fibromialgia e descubra como exercícios aeróbicos e aquáticos são mais eficazes que medicamentos.",
    content: `
## O que é Fibromialgia?

A fibromialgia é uma síndrome de dor crônica generalizada caracterizada por:
- Dor difusa por mais de 3 meses
- Fadiga
- Distúrbios do sono
- Disfunção cognitiva ("fibro fog")
- Sensibilidade à palpação

## Fisiopatologia Simplificada

- Alteração no processamento central da dor
- Sensibilização central
- Desregulação de neurotransmissores
- **NÃO é doença articular ou muscular**

## Diagnóstico

### Critérios ACR 2016
- Índice de Dor Generalizada (WPI) ≥7 e Escala de Gravidade dos Sintomas (SSS) ≥5
- OU WPI 4-6 e SSS ≥9
- Dor em pelo menos 4 de 5 regiões
- Sintomas por pelo menos 3 meses

### O que afastar
- Doenças reumáticas inflamatórias
- Hipotireoidismo
- Deficiência de vitamina D

## Por que Exercício é o Tratamento Principal

### Evidência científica
- **Exercício aeróbico**: Evidência nível A
- Mais eficaz que medicamentos em alguns desfechos
- Melhora dor, fadiga, função e qualidade de vida

### Mecanismos
- Modula processamento da dor
- Melhora qualidade do sono
- Reduz estresse e ansiedade
- Aumenta endorfinas

## Prescrição de Exercício

### Exercício aeróbico
- **Iniciar muito leve**: 5-10 min
- Progressão **muito gradual**
- Meta: 30 min, 3-5x/semana
- Intensidade: leve a moderada (40-60% FCmax)
- Opções: caminhada, bicicleta, natação

### Exercício aquático
- Excelente para iniciar
- Água morna (32-34°C)
- Reduz impacto e dor
- Alta adesão

### Fortalecimento
- Iniciar após adaptação ao aeróbico
- Cargas leves
- Progressão muito lenta
- 2-3x/semana

### Alongamento
- Suave
- Pode ajudar na rigidez
- Não exagerar (hiperalgesia)

## Armadilhas Comuns

### Erro 1: Exagerar no início
- Paciente está bem → faz muito → piora → abandona
- Solução: progredir MUITO devagar

### Erro 2: Parar quando há dor
- Dor no exercício ≠ lesão
- Educação em neurociência da dor é fundamental

### Erro 3: Esperar resultados rápidos
- Mínimo 8-12 semanas para benefícios
- Tratamento contínuo, não curso limitado

## Educação do Paciente

### Pontos-chave
- Fibromialgia não causa dano tecidual
- Dor não significa lesão
- Exercício não vai machucar
- Sono e estresse influenciam sintomas

### Higiene do sono
- Horário regular
- Evitar telas
- Ambiente adequado

## Outras Abordagens

### Terapia cognitivo-comportamental
- Evidência forte
- Complementa exercício

### Tai chi / Yoga
- Evidência positiva
- Boa alternativa

### TENS
- Pode ajudar como coadjuvante
- Não é tratamento principal

---

**Acompanhe pacientes com fibromialgia** no RehabRoad — monitore múltiplos sintomas e funcionalidade.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-12",
    readTime: 11,
    category: "Tratamento",
    tags: ["fibromialgia", "dor crônica", "exercício aeróbico", "exercício aquático"],
    metaDescription: "Tratamento da fibromialgia com fisioterapia. Por que exercício aeróbico é mais eficaz que medicamentos e como prescrever corretamente."
  },
  {
    id: "16",
    slug: "bursite-tipos-tratamento-fisioterapia",
    title: "Bursite: Tipos, Causas e Tratamento Fisioterapêutico",
    excerpt: "Tudo sobre bursites mais comuns: subacromial, trocantérica, anserina e pré-patelar. Quando tratar conservador.",
    content: `
## O que é Bursite?

A bursa é uma estrutura que reduz atrito entre tendões/músculos e ossos. A bursite é a inflamação dessa estrutura, causando dor e limitação funcional.

## Bursites Mais Comuns

### Bursite subacromial (ombro)
- Mais frequente
- Relacionada à síndrome do impacto
- Dor lateral do ombro
- Arco doloroso 60-120°

### Bursite trocantérica (quadril)
- Dor lateral do quadril
- Piora ao deitar sobre o lado
- Comum em mulheres 40-60 anos
- Termo atual: "síndrome da dor trocantérica maior"

### Bursite anserina (joelho)
- Face medial do joelho
- Comum em artrose de joelho
- Dor ao subir/descer escadas
- Sensibilidade à palpação 2-3cm abaixo interlinha

### Bursite pré-patelar
- Frente do joelho
- "Joelho de faxineira"
- Trauma/pressão repetida
- Pode estar infectada (séptica)

### Bursite olecraniana (cotovelo)
- Edema posterior do cotovelo
- Trauma ou pressão repetida
- Atenção para sinais de infecção

## Diagnóstico

### Clínico
- Dor localizada sobre a bursa
- Edema (quando superficial)
- Dor à compressão
- Função relativamente preservada

### Diferencial
- Tendinopatia (mais comum)
- Artrite
- Fratura de estresse
- Infecção

### Imagem
- USG: espessamento, líquido
- RX: afastar outras causas
- RNM: casos duvidosos

## Tratamento Fisioterapêutico

### Fase aguda
1. **Identificar e remover causa**
2. Repouso relativo (não absoluto)
3. Gelo local: 15-20min, 3-4x/dia
4. Proteção (joelheira, cotoveleira)

### Fase subaguda/crônica
1. **Exercícios** (fundamental)
2. Correção biomecânica
3. Fortalecimento muscular
4. Alongamentos

## Tratamento por Região

### Bursite subacromial
- Tratar como síndrome do impacto
- Fortalecimento manguito
- Correção escapular
- Alongamento cápsula posterior

### Bursite trocantérica
- Fortalecimento glúteo médio (abdutores)
- Alongamento TIT
- Correção de adução excessiva na marcha
- Exercícios em cadeia fechada

### Bursite anserina
- Tratar artrose associada
- Fortalecimento quadríceps
- Alongamento isquiotibiais
- Perda de peso se indicado

## Infiltração

### Quando considerar
- Falha tratamento conservador 4-6 semanas
- Dor intensa limitando reabilitação
- Não como primeira opção

### Corticoide
- Alívio temporário
- Não resolve causa
- Efeitos deletérios se repetido
- SEMPRE associar reabilitação

## Prevenção de Recidiva

- Modificação de atividade
- Ergonomia
- Equipamentos de proteção
- Manutenção de força/flexibilidade
- Aquecimento adequado

---

**Documente casos de bursite** no RehabRoad com localização precisa e acompanhamento da evolução.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-10",
    readTime: 9,
    category: "Tratamento",
    tags: ["bursite", "ombro", "quadril", "joelho", "tratamento"],
    metaDescription: "Tipos de bursite e tratamento fisioterapêutico. Bursite subacromial, trocantérica, anserina e pré-patelar: causas, diagnóstico e reabilitação."
  },
  {
    id: "17",
    slug: "escoliose-avaliacao-tratamento-fisioterapia",
    title: "Escoliose: Avaliação, Classificação e Tratamento Conservador",
    excerpt: "Como avaliar e tratar escoliose na fisioterapia. Método Schroth, exercícios específicos e indicações de colete.",
    content: `
## O que é Escoliose?

A escoliose é uma deformidade tridimensional da coluna vertebral caracterizada por:
- Curvatura lateral >10° (Cobb)
- Rotação vertebral
- Alteração do plano sagital

## Classificação

### Por etiologia
- **Idiopática** (80-85%): causa desconhecida
- **Congênita**: malformação vertebral
- **Neuromuscular**: paralisia cerebral, distrofias
- **Degenerativa**: adultos, artrose

### Por idade (escoliose idiopática)
- **Infantil**: 0-3 anos
- **Juvenil**: 4-10 anos
- **Adolescente**: 10-18 anos (mais comum)
- **Adulto**: >18 anos

### Por gravidade (ângulo de Cobb)
- Leve: 10-25°
- Moderada: 25-40°
- Grave: >40°

## Avaliação Fisioterapêutica

### Inspeção
- Assimetria de ombros
- Escápula alada unilateral
- Desnivelamento de pelve
- Gibosidade (teste de Adams)

### Teste de Adams
- Paciente flexiona tronco
- Observar gibosidade torácica/lombar
- Medir com escoliômetro
- >5°: encaminhar para RX

### Exame radiológico
- Medida do ângulo de Cobb
- Maturidade óssea (Risser)
- Risco de progressão

## Risco de Progressão

### Fatores que aumentam risco
- Imaturidade esquelética (Risser 0-1)
- Curvas maiores
- Potencial de crescimento
- Sexo feminino

### Risser
- 0: sem ossificação ilíaca
- 5: maturidade completa
- Quanto menor, maior risco de progressão

## Tratamento Conservador

### Observação
- Curvas <25°
- Acompanhamento a cada 4-6 meses
- Exercícios gerais

### Colete (brace)
- Curvas 25-40° com crescimento
- Uso 18-23h/dia
- Objetivo: prevenir progressão
- Não corrige, estabiliza

### Fisioterapia específica

**Método Schroth**
- Exercícios 3D específicos
- Autocorreção ativa
- Alongamento lado côncavo
- Fortalecimento lado convexo
- Reeducação respiratória
- Evidência crescente

**SEAS (Scientific Exercise Approach to Scoliosis)**
- Exercícios funcionais
- Autocorreção em atividades diárias

## Exercícios Específicos

### Princípios gerais
- Alongar lado côncavo
- Fortalecer lado convexo
- Rotação desrotatória
- Padrão respiratório específico

### Exercícios posturais
- Postura corrigida sustentada
- Progressão para atividades funcionais
- Integração na vida diária

## Indicação Cirúrgica

- Curvas >40-50° em imaturos
- Progressão apesar de colete
- Dor ou comprometimento funcional significativo
- Escoliose neuromuscular severa

## Escoliose no Adulto

### Diferenças
- Não há risco de progressão por crescimento
- Objetivo: controlar dor e função
- Pode haver progressão lenta (degenerativa)

### Tratamento
- Exercícios gerais e específicos
- Controle postural
- Fortalecimento core
- Manejo da dor

---

**Documente avaliações de escoliose** no RehabRoad com medidas objetivas e fotos de acompanhamento.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-08",
    readTime: 11,
    category: "Tratamento",
    tags: ["escoliose", "coluna", "Schroth", "postura", "adolescentes"],
    metaDescription: "Avaliação e tratamento da escoliose na fisioterapia. Classificação, método Schroth, indicações de colete e exercícios específicos."
  },
  {
    id: "18",
    slug: "reabilitacao-pos-operatoria-ortopedia",
    title: "Reabilitação Pós-Operatória: Protocolos em Ortopedia",
    excerpt: "Protocolos de reabilitação após cirurgias ortopédicas comuns: LCA, manguito rotador, artroplastia e artroscopia.",
    content: `
## Princípios Gerais da Reabilitação Pós-Operatória

### Fases da cicatrização
1. **Inflamatória** (0-7 dias): proteção, controle de edema
2. **Proliferativa** (7-21 dias): início de mobilização
3. **Remodelamento** (21 dias-1 ano): carga progressiva

### Objetivos por fase
- **Fase 1**: controle álgico e edema, proteção tecidual
- **Fase 2**: restaurar ADM, iniciar fortalecimento
- **Fase 3**: força funcional, propriocepção
- **Fase 4**: retorno às atividades/esporte

## Reconstrução de LCA

### Fase 1 (0-2 semanas)
- Controle de edema (gelo, elevação)
- ADM: 0-90° progressivo
- Descarga parcial com muletas
- Isométricos quadríceps

### Fase 2 (2-6 semanas)
- ADM completa
- Descarga total progressiva
- Cadeia cinética fechada
- Propriocepção básica

### Fase 3 (6-12 semanas)
- Fortalecimento isotônico
- Agachamento, leg press
- Propriocepção avançada
- Início de marcha sem muletas

### Fase 4 (3-6 meses)
- Corrida (após 12 semanas)
- Agilidade
- Saltos
- Exercícios específicos do esporte

### Critérios de alta
- Força >90% contralateral
- Hop tests simétricos (>90%)
- Questionários funcionais
- Confiança psicológica

## Reparo do Manguito Rotador

### Fase 1 (0-6 semanas)
- **Imobilização** com tipoia
- Exercícios de cotovelo, punho e mão
- Movimentos pendulares (se liberado)
- Isométricos leves após 4-6 semanas

### Fase 2 (6-12 semanas)
- ADM passiva e ativo-assistida
- Rotação externa gradual
- Fortalecimento isométrico progressivo

### Fase 3 (12-16 semanas)
- ADM ativa completa
- Fortalecimento isotônico
- Exercícios de estabilização

### Fase 4 (4-6 meses)
- Fortalecimento funcional
- Retorno gradual às atividades
- Exercícios específicos do esporte/trabalho

### Cuidados
- Não forçar rotação externa precoce
- Respeitar cicatrização do tendão
- Protocolo varia conforme tamanho da lesão

## Artroplastia Total de Joelho

### Dia 1-3 (hospitalar)
- Mobilização precoce
- Exercícios de bomba de tornozelo
- Isométricos quadríceps
- Transferências e marcha com andador

### Semanas 1-6
- ADM: meta 90-100° flexão
- Extensão completa (fundamental)
- Fortalecimento progressivo
- Marcha com muletas

### Semanas 6-12
- ADM: meta >110°
- Fortalecimento funcional
- Equilíbrio
- Independência na marcha

### 3-6 meses
- Atividades funcionais normais
- Exercícios de manutenção
- Alta da fisioterapia

## Artroplastia Total de Quadril

### Precauções (abordagem posterior)
- Não flexionar >90°
- Não aduzir além neutro
- Não rotação interna
- **Válidas por 6-12 semanas**

### Fase 1 (0-6 semanas)
- Mobilização precoce com precauções
- Marcha com andador/muletas
- Fortalecimento glúteo isométrico
- Evitar movimentos proibidos

### Fase 2 (6-12 semanas)
- Liberação gradual das precauções
- Fortalecimento progressivo
- Equilíbrio
- Marcha sem auxílio

### Fase 3 (3-6 meses)
- Atividades funcionais
- Fortalecimento avançado
- Retorno às atividades normais

---

**Organize protocolos pós-operatórios** no RehabRoad com cronograma de fases e objetivos claros.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-06",
    readTime: 12,
    category: "Tratamento",
    tags: ["pós-operatório", "LCA", "manguito rotador", "artroplastia", "reabilitação"],
    metaDescription: "Protocolos de reabilitação pós-operatória em ortopedia. LCA, manguito rotador, artroplastia de joelho e quadril: fases e exercícios."
  },
  {
    id: "19",
    slug: "ultrassom-terapeutico-parametros-indicacoes",
    title: "Ultrassom Terapêutico: Parâmetros, Indicações e Evidências",
    excerpt: "Tudo sobre ultrassom em fisioterapia: frequência, intensidade, modo contínuo vs pulsado e o que a ciência diz.",
    content: `
## Fundamentos do Ultrassom Terapêutico

O ultrassom terapêutico utiliza ondas sonoras de alta frequência para produzir efeitos térmicos e não térmicos nos tecidos.

## Parâmetros do Ultrassom

### Frequência
- **1 MHz**: tecidos profundos (3-5cm)
- **3 MHz**: tecidos superficiais (1-2cm)

### Modo de emissão
- **Contínuo**: efeito térmico
- **Pulsado**: efeito não térmico

### Intensidade
- **0,5-1,0 W/cm²**: efeito não térmico
- **1,0-2,0 W/cm²**: efeito térmico leve
- **>2,0 W/cm²**: efeito térmico intenso (pouco usado)

### Duty cycle (modo pulsado)
- 50%: metade do tempo ligado
- 20%: 20% do tempo ligado
- Quanto menor, menos aquecimento

## Efeitos Terapêuticos

### Efeitos térmicos
- Aumento da extensibilidade do colágeno
- Redução de rigidez articular
- Aumento do fluxo sanguíneo
- Redução de espasmo muscular

### Efeitos não térmicos
- Cavitação estável
- Streaming acústico
- Efeitos celulares (discutível)
- Cicatrização (evidência fraca)

## O que a Evidência Diz?

### Condições com pouca evidência
- Dor lombar: NÃO recomendado
- Tendinopatias: evidência fraca
- Artrose: resultados inconsistentes
- Lesões musculares: não superior a exercício

### Possíveis indicações
- Aumento de extensibilidade antes de alongamento
- Calcificações (combinado com exercício)
- Cicatrização de feridas (evidência limitada)

### Importante
- US sozinho **não é tratamento**
- Sempre combinar com exercícios
- Evidência geral é **fraca**

## Como Aplicar Corretamente

### Técnica de aplicação
1. Gel de acoplamento abundante
2. Movimento circular lento e constante
3. Nunca deixar transdutor parado
4. Manter perpendicular à pele

### Área de tratamento
- Área efetiva de radiação (ERA)
- Tratar áreas pequenas por vez
- 1-2 min por área do tamanho do transdutor

### Tempo de aplicação
- 5-10 minutos total
- Dividir por áreas

## Contraindicações

### Absolutas
- Sobre tumor maligno
- Sobre gestação
- Sobre placa epifisária em crescimento
- Sobre marca-passo
- Sobre infecção aguda

### Relativas
- Implantes metálicos (cuidado)
- Hemofilia
- Trombose venosa
- Sobre artérias principais

## Combinação com Outras Técnicas

### Fonoforese
- Aplicar medicamento tópico + US
- Gel próprio ou fármaco gel
- Evidência de penetração: controversa

### US + exercício
- Aquecimento + alongamento imediato
- Aproveitamento do efeito térmico
- Esta combinação faz mais sentido

## Na Prática

### Quando usar
- Como adjuvante, nunca como tratamento principal
- Antes de técnicas manuais/alongamento
- Quando há restrição de mobilidade

### Quando não usar
- Como tratamento único
- Substituindo exercício ativo
- Em todas as sessões "por protocolo"

---

**Registre parâmetros de eletroterapia** no RehabRoad com o módulo NeuroFlux — dosimetria padronizada.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-04",
    readTime: 9,
    category: "Eletroterapia",
    tags: ["ultrassom", "eletroterapia", "parâmetros", "evidência"],
    metaDescription: "Ultrassom terapêutico em fisioterapia: frequência, intensidade, modo pulsado vs contínuo. O que a evidência científica realmente diz."
  },
  {
    id: "20",
    slug: "liberacao-miofascial-tecnicas-evidencias",
    title: "Liberação Miofascial: Técnicas, Indicações e Evidências",
    excerpt: "O que funciona na liberação miofascial? Foam roller, técnicas manuais, IASTM e o que a ciência diz sobre fáscia.",
    content: `
## O que é a Fáscia?

A fáscia é um tecido conjuntivo que:
- Envolve músculos, nervos e vasos
- Forma uma rede contínua pelo corpo
- Contém mecanorreceptores
- Pode transmitir tensão

## Liberação Miofascial: Conceito

A liberação miofascial (LMF) engloba técnicas que visam:
- Reduzir tensão no tecido fascial
- Melhorar mobilidade
- Aliviar dor

## Técnicas de Liberação Miofascial

### Técnicas manuais
- Pressão sustentada
- Deslizamento profundo
- Técnicas de "unwinding"

### Instrumentos (IASTM)
- Graston Technique
- Técnica de Crochetagem
- ASTYM

### Autoliberação
- Foam roller
- Bolas de lacrosse/tênis
- Rolos de massagem

## O que a Ciência Diz?

### Mecanismos propostos (não comprovados)
- "Quebra de aderências": improvável
- "Reorganização do colágeno": não ocorre em minutos
- Mudança de viscosidade: mínima

### Mecanismos mais prováveis
- **Efeitos neurais**: modulação da dor
- **Aumento da tolerância**: habituação
- **Efeitos autonômicos**: relaxamento
- **Efeitos placebo/contextuais**

### Evidência atual
- Aumenta ADM **temporariamente**
- Pode reduzir dor a curto prazo
- **Não afeta performance negativamente**
- Não há mudança estrutural demonstrada

## Foam Roller: O que Funciona

### Benefícios comprovados
- Aumento temporário de ADM (10-15min)
- Redução de DOMS (dor pós-exercício)
- Sensação de relaxamento

### Como usar
- Pressão moderada
- 30-60 segundos por grupo muscular
- Pode ser diário

### O que não faz
- Não "solta" fáscia
- Não quebra aderências
- Não substitui alongamento

## IASTM (Técnicas Instrumentais)

### Graston, Crochetagem, etc.
- Petéquias/hematomas: não são objetivo
- Evidência: similar à massagem manual
- Custo-benefício questionável

### Indicações possíveis
- Cicatrizes/restrições
- Tendinopatias crônicas
- Complemento (não tratamento único)

## Integração Clínica

### Quando usar
- Aquecimento antes de exercícios
- Técnica complementar
- Paciente que responde bem subjetivamente

### Quando não usar
- Como tratamento isolado
- Substituindo exercício ativo
- Em todas as sessões "por protocolo"

### Combinações efetivas
1. Foam roller + alongamento + exercício
2. IASTM + exercício excêntrico (tendinopatias)
3. Técnica manual + mobilização articular

## Pontos-Chave

1. **Efeito é principalmente neural**, não mecânico
2. **Benefícios são temporários** (minutos a horas)
3. **Não há "técnica milagrosa"** — todas similares
4. **Sempre combine com exercício ativo**
5. **Respeite preferência do paciente**

## Contraindicações

- Anticoagulantes (IASTM)
- Câncer/metástases
- Trombose venosa
- Feridas abertas
- Infecção local

---

**Documente técnicas utilizadas** no RehabRoad e acompanhe a evolução objetiva do paciente.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-02",
    readTime: 10,
    category: "Técnicas Manuais",
    tags: ["liberação miofascial", "foam roller", "IASTM", "fáscia", "massagem"],
    metaDescription: "Liberação miofascial em fisioterapia: foam roller, IASTM, técnicas manuais. O que a ciência diz sobre a fáscia e técnicas de liberação."
  },
  {
    id: "21",
    slug: "dry-needling-agulhamento-seco-fisioterapia",
    title: "Dry Needling: Agulhamento Seco na Fisioterapia",
    excerpt: "Técnica de dry needling: pontos gatilho, indicações, contraindicações e evidências científicas atualizadas.",
    content: `
## O que é Dry Needling?

O dry needling (agulhamento seco) é uma técnica que utiliza agulhas de acupuntura para tratar pontos gatilho miofasciais, sem injeção de substâncias.

## Diferença de Acupuntura

### Dry needling
- Baseado em anatomia ocidental
- Foco em pontos gatilho miofasciais
- Objetivo: desativar PG e reduzir dor
- Respostas de twitch local

### Acupuntura
- Baseado em medicina tradicional chinesa
- Meridianos e fluxo de energia
- Objetivo mais amplo
- Diferentes filosofias

## Pontos Gatilho Miofasciais

### Características
- Banda tensa palpável
- Nódulo hipersensível
- Dor referida característica
- Resposta de twitch local

### Mecanismos (hipóteses)
- Placa motora disfuncional
- Hipóxia local
- Liberação de substâncias nociceptivas
- Sensibilização periférica

## Técnica de Aplicação

### Agulhamento superficial
- Apenas subcutâneo
- Menos risco
- Pode ser suficiente

### Agulhamento profundo
- Até o ponto gatilho
- Busca resposta de twitch
- Maior efeito analgésico (teoricamente)

### Técnica de pistoneamento
- Inserção/retirada repetida
- Múltiplos twitches
- Maior dor pós-procedimento

## Evidências Científicas

### O que mostra benefício
- Redução de dor a curto prazo
- Melhora de ADM
- Pode auxiliar em cervicalgia
- Possível benefício em lombalgia

### Limitações
- Efeito comparável a agulhamento sham
- Não superior a outras técnicas
- Estudos de baixa qualidade
- Efeito placebo significativo

### Consenso atual
- Ferramenta complementar
- Não deve ser tratamento único
- Sempre combinar com exercícios
- Resposta individual variável

## Indicações

### Condições com alguma evidência
- Cervicalgia miofascial
- Síndrome dolorosa miofascial
- Cefaleia tensional
- Dor lombar (evidência mista)

### Músculos comumente tratados
- Trapézio superior
- Esternocleidomastóideo
- Suboccipitais
- Infraespinhal
- Quadrado lombar

## Contraindicações

### Absolutas
- Área de linfedema
- Paciente com medo intenso de agulhas
- Infecção local
- Tumor na área

### Relativas
- Anticoagulantes (técnica superficial)
- Gestação (alguns pontos)
- Imunossupressão
- Área próxima a vasos/nervos

## Efeitos Adversos

### Comuns (esperados)
- Dor no local (24-48h)
- Hematoma pequeno
- Fadiga

### Raros (graves)
- Pneumotórax (agulhamento torácico)
- Infecção
- Lesão nervosa
- Sangramento significativo

## Integração Clínica

### Quando usar
- Como complemento ao exercício
- Quando há PG ativo identificável
- Paciente refratário a outras técnicas

### Como combinar
1. Dry needling para reduzir dor
2. Alongamento pós-agulhamento
3. Exercícios de fortalecimento
4. Educação e autogerenciamento

### Frequência
- 1-2x/semana inicialmente
- Espaçar conforme melhora
- Não tratar indefinidamente

---

**Documente procedimentos de dry needling** no RehabRoad com localização dos pontos tratados.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-30",
    readTime: 10,
    category: "Técnicas Manuais",
    tags: ["dry needling", "agulhamento seco", "ponto gatilho", "dor miofascial"],
    metaDescription: "Dry needling em fisioterapia: técnica de agulhamento seco para pontos gatilho. Indicações, contraindicações e evidências científicas."
  },
  {
    id: "22",
    slug: "fisioterapia-esportiva-lesoes-prevencao",
    title: "Fisioterapia Esportiva: Principais Lesões e Prevenção",
    excerpt: "Lesões esportivas mais comuns, fatores de risco, estratégias de prevenção e retorno ao esporte seguro.",
    content: `
## Fisioterapia Esportiva

A fisioterapia esportiva atua em:
- Prevenção de lesões
- Tratamento de lesões esportivas
- Reabilitação e retorno ao esporte
- Otimização de performance

## Lesões Esportivas Mais Comuns

### Por mecanismo
- **Agudas**: trauma direto, entorse, luxação
- **Overuse**: sobrecarga repetitiva

### Por estrutura
- Musculares (30-50%)
- Ligamentares (20-30%)
- Tendinosas (15-25%)
- Ósseas (5-10%)

## Lesões Musculares

### Classificação
- **Grau I**: distensão leve, <10% fibras
- **Grau II**: ruptura parcial
- **Grau III**: ruptura completa

### Músculos mais afetados
- Isquiotibiais
- Quadríceps (reto femoral)
- Adutores
- Gastrocnêmios

### Tratamento
- **PEACE & LOVE** (novo conceito)
- Proteção, Elevação, Avoid anti-inflammatories, Compression, Education
- Load, Optimism, Vascularization, Exercise

## Entorses de Tornozelo

### Classificação
- **Grau I**: estiramento ligamentar
- **Grau II**: ruptura parcial
- **Grau III**: ruptura completa

### Tratamento conservador
- Imobilização funcional (não gesso)
- Propriocepção precoce
- Fortalecimento fibulares
- Retorno gradual

### Prevenção de recidiva
- Treino proprioceptivo
- Fortalecimento
- Tornozeleiraem alguns casos

## Lesões de LCA

### Fatores de risco
- Sexo feminino (2-8x)
- Valgo dinâmico
- Déficit de controle neuromuscular
- Fadiga

### Prevenção
- Programas neuromusculares (FIFA 11+)
- Treino de aterrisagem
- Fortalecimento de quadril
- Educação do movimento

### Reabilitação
- Ver protocolo específico
- Critérios objetivos para retorno
- 9-12 meses mínimo

## Tendinopatias no Esporte

### Mais comuns
- Tendinopatia patelar ("joelho do saltador")
- Tendinopatia de Aquiles
- Epicondilite (tênis, golfe)
- Manguito rotador (overhead athletes)

### Gestão de carga
- Reduzir volume, não parar
- Modificar treinamento
- Exercícios de carga progressiva
- Monitorar sintomas 24h após

## Síndrome da Dor Femoropatelar

### Fatores associados
- Fraqueza de quadril
- Déficit de VMO
- Hipomobilidade
- Overuse

### Tratamento
- Fortalecimento quadril + joelho
- Educação sobre carga
- Taping se necessário
- Exercícios funcionais

## Retorno ao Esporte (Return to Sport)

### Critérios objetivos
- Força >90% contralateral
- Hop tests simétricos
- Questionários funcionais
- Testes específicos do esporte

### Critérios subjetivos
- Confiança psicológica
- Prontidão mental
- Ausência de medo de relesão

### Progressão
1. Return to Activity (atividade física geral)
2. Return to Sport (treino do esporte)
3. Return to Performance (competição plena)

## Programas de Prevenção

### FIFA 11+
- Aquecimento estruturado
- 20 minutos
- Reduz lesões em 30-50%
- Todos os jogadores devem fazer

### Componentes essenciais
- Corrida com mudança de direção
- Pliometria
- Equilíbrio
- Fortalecimento (core, quadril)
- Técnica de aterrisagem

---

**Acompanhe atletas em reabilitação** no RehabRoad com métricas de força e prontidão para retorno.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-28",
    readTime: 11,
    category: "Tratamento",
    tags: ["fisioterapia esportiva", "lesões esportivas", "prevenção", "retorno ao esporte"],
    metaDescription: "Fisioterapia esportiva: lesões mais comuns, prevenção com FIFA 11+ e critérios de retorno ao esporte seguro."
  },
  {
    id: "23",
    slug: "fisioterapia-respiratoria-tecnicas-indicacoes",
    title: "Fisioterapia Respiratória: Técnicas e Indicações",
    excerpt: "Principais técnicas de fisioterapia respiratória: higiene brônquica, reexpansão pulmonar e reabilitação.",
    content: `
## Fisioterapia Respiratória

A fisioterapia respiratória atua em:
- Higiene brônquica
- Reexpansão pulmonar
- Reabilitação pulmonar
- Fortalecimento muscular respiratório

## Avaliação Respiratória

### Inspeção
- Padrão respiratório
- Uso de musculatura acessória
- Cianose
- Baqueteamento digital

### Ausculta
- MV (murmúrio vesicular)
- Ruídos adventícios
- Estertores, roncos, sibilos

### Medidas objetivas
- Frequência respiratória
- SpO2
- Pico de fluxo expiratório
- Capacidade vital

## Técnicas de Higiene Brônquica

### Drenagem postural
- Posicionamento para drenagem por gravidade
- Cada lobo tem posição específica
- 10-20 minutos por posição

### Percussão e vibração
- Técnicas clássicas
- Evidência mista
- Preferir técnicas ativas

### Técnicas de fluxo expiratório
- **ELTGOL**: Expiração Lenta Total Glote Aberta em Decúbito Lateral
- **TEF**: Técnica de Expiração Forçada (huffing)
- **Drenagem autógena**: controle do fluxo pelo paciente

### Dispositivos
- Flutter/Shaker: oscilação de alta frequência
- EPAP: pressão expiratória positiva
- Incentivadores (inspiratórios)

## Reexpansão Pulmonar

### Indicações
- Atelectasia
- Pós-operatório
- Hipoventilação
- Derrame pleural (após drenagem)

### Técnicas
- Exercícios de inspiração profunda
- Padrões ventilatórios (diafragmático, costal)
- Incentivador inspiratório
- RPPI (Respiração com Pressão Positiva Intermitente)

### Incentivador inspiratório
- Volume vs fluxo
- 10 repetições, 4-6x/dia
- Inspiração lenta e sustentada
- Posição semi-sentada

## Reabilitação Pulmonar

### Indicações principais
- DPOC
- Fibrose pulmonar
- Bronquiectasias
- Pré/pós transplante

### Componentes
1. Exercício aeróbico (caminhada, bicicleta)
2. Fortalecimento muscular
3. Treino muscular inspiratório (TMI)
4. Educação
5. Suporte nutricional/psicológico

### Evidência em DPOC
- Melhora qualidade de vida (Evidência A)
- Melhora dispneia
- Melhora capacidade funcional
- Reduz hospitalizações

## Treino Muscular Inspiratório (TMI)

### Indicações
- Fraqueza muscular inspiratória
- DPOC
- ICC
- Pós-UTI

### Como prescrever
- PImáx: força muscular inspiratória
- Intensidade: 30-80% da PImáx
- 15-30 minutos, 5-7x/semana
- Dispositivos: Threshold, POWERbreathe

## Pós-Operatório

### Cirurgias abdominais e torácicas
- Alto risco de complicações pulmonares
- Fisioterapia precoce reduz complicações

### Protocolo básico
- Mobilização precoce
- Exercícios respiratórios
- Tosse assistida
- Incentivador inspiratório

## Contraindicações

### Gerais
- Instabilidade hemodinâmica
- Arritmias graves
- Hemoptise ativa
- Pneumotórax não drenado

### Específicas por técnica
- Drenagem postural: RGE grave, PIC elevada
- Percussão: fraturas de costela, coagulopatia

---

**Documente avaliações respiratórias** no RehabRoad com medidas objetivas e evolução do quadro.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-26",
    readTime: 10,
    category: "Especialidades",
    tags: ["fisioterapia respiratória", "reabilitação pulmonar", "DPOC", "pós-operatório"],
    metaDescription: "Fisioterapia respiratória: técnicas de higiene brônquica, reexpansão pulmonar e reabilitação. Indicações e protocolos baseados em evidência."
  },
  {
    id: "24",
    slug: "corrente-interferencial-parametros-indicacoes",
    title: "Corrente Interferencial: Parâmetros, Indicações e Aplicação",
    excerpt: "Guia completo sobre corrente interferencial em fisioterapia: mecanismos, parâmetros e aplicação prática.",
    content: `
## O que é Corrente Interferencial?

A corrente interferencial (IFC) é uma forma de eletroestimulação que utiliza duas correntes de média frequência que se cruzam e "interferem", produzindo uma frequência de batimento na área de interseção.

## Fundamentos

### Frequência portadora
- 2.000-4.000 Hz (média frequência)
- Maior penetração que baixa frequência
- Menos sensação desconfortável

### Frequência de batimento (AMF)
- Diferença entre as duas portadoras
- Ex: 4.000 Hz e 4.100 Hz = 100 Hz de AMF
- Esta é a frequência "terapêutica"

## Parâmetros Clínicos

### Frequência de batimento (AMF)
- **1-10 Hz**: estimulação motora, "efeito acupuntura"
- **10-50 Hz**: relaxamento muscular
- **80-150 Hz**: analgesia (portão da dor)

### Varredura (Sweep)
- Variação automática da AMF
- Ex: 80-150 Hz
- Evita acomodação

### Tempo
- 15-30 minutos
- Ajustar conforme resposta

### Intensidade
- Sensorial: formigamento confortável (analgesia)
- Motor: contração visível (fortalecimento)

## Técnicas de Aplicação

### Quadripolar (verdadeira interferencial)
- 4 eletrodos, 2 canais
- Interferência no tecido
- Área de tratamento: entre eletrodos

### Bipolar (pré-modulada)
- 2 eletrodos, 1 canal
- Interferência no aparelho
- Mais simples

### Vetorial
- Rotação automática do campo
- Maior área de cobertura

## Indicações

### Com alguma evidência
- Dor musculoesquelética aguda
- Osteoartrite de joelho
- Cervicalgia
- Lombalgia (adjuvante)

### Mecanismos propostos
- Teoria do portão da dor
- Liberação de opioides endógenos
- Vasodilatação local
- Redução de edema

## O que a Evidência Diz

### Analgesia
- Pode reduzir dor a curto prazo
- Efeito modesto
- Não superior a TENS em estudos

### Limitações
- Qualidade dos estudos baixa
- Efeito placebo significativo
- Não deve ser tratamento único

## Protocolo de Aplicação

### Posicionamento
1. Pele limpa e seca
2. Eletrodos sobre área dolorosa
3. Quadripolar: formar X sobre a área
4. Fixar bem os eletrodos

### Ajuste
1. Aumentar intensidade gradualmente
2. Sensação forte mas confortável
3. Ajustar se acomodação

### Monitoramento
- Verificar sensação do paciente
- Observar pele após
- Documentar resposta

## Contraindicações

### Absolutas
- Marca-passo
- Gestação (abdômen)
- Área cardíaca
- Trombose venosa ativa

### Relativas
- Sobre implantes metálicos
- Pele lesionada
- Diminuição de sensibilidade
- Epilepsia (perto da cabeça)

## Combinação com Outras Técnicas

### IFC + exercício
- IFC antes: reduzir dor para permitir exercício
- IFC durante: contração assistida

### IFC + terapia manual
- Preparação do tecido
- Relaxamento muscular

## Na Prática Clínica

### Quando usar
- Como coadjuvante para dor
- Facilitar exercício terapêutico
- Quando paciente responde bem

### Quando não usar
- Como tratamento único
- Em todas as sessões por rotina
- Substituindo exercício ativo

---

**Registre parâmetros de corrente interferencial** no RehabRoad com dosimetria padronizada.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-24",
    readTime: 9,
    category: "Eletroterapia",
    tags: ["corrente interferencial", "eletroterapia", "analgesia", "dor"],
    metaDescription: "Corrente interferencial em fisioterapia: parâmetros de frequência, técnicas de aplicação e indicações baseadas em evidência."
  },
  {
    id: "25",
    slug: "sindrome-tunel-carpo-tratamento-fisioterapia",
    title: "Síndrome do Túnel do Carpo: Diagnóstico e Tratamento",
    excerpt: "Avaliação, testes diagnósticos e tratamento conservador da síndrome do túnel do carpo na fisioterapia.",
    content: `
## O que é Síndrome do Túnel do Carpo?

A síndrome do túnel do carpo (STC) é a neuropatia compressiva mais comum, causada pela compressão do nervo mediano ao nível do punho.

## Anatomia

### Túnel do carpo
- Assoalho: ossos do carpo
- Teto: retináculo dos flexores
- Conteúdo: nervo mediano + 9 tendões flexores

### Nervo mediano
- Sensitivo: 1º ao 4º dedos (face palmar)
- Motor: músculos tenares

## Fatores de Risco

### Intrínsecos
- Sexo feminino
- Gestação
- Diabetes
- Hipotireoidismo
- Artrite reumatoide

### Extrínsecos
- Movimentos repetitivos
- Vibração
- Posições extremas de punho

## Quadro Clínico

### Sintomas sensitivos
- Parestesia nos 3 primeiros dedos
- Dor que pode irradiar para antebraço
- Piora noturna (típico)
- "Sacudir as mãos" alivia

### Sintomas motores (avançado)
- Fraqueza de pinça
- Atrofia tenar
- Dificuldade com objetos pequenos

## Testes Diagnósticos

### Tinel
- Percussão sobre túnel do carpo
- Positivo: parestesia nos dedos
- Sensibilidade: 50-60%

### Phalen
- Flexão máxima de punho por 60 segundos
- Positivo: reproduz sintomas
- Sensibilidade: 70-80%

### Teste de compressão do carpo
- Pressão direta sobre túnel
- 30 segundos
- Mais específico que Phalen

### Flick sign
- Paciente "sacode" mãos para aliviar
- Alta especificidade quando presente

### Eletroneuromiografia
- Padrão-ouro para diagnóstico
- Avalia gravidade
- Não necessário em casos típicos

## Classificação de Gravidade

### Leve
- Sintomas intermitentes
- Sem déficit motor
- ENMG: alterações leves

### Moderada
- Sintomas frequentes
- Força reduzida
- ENMG: alterações moderadas

### Grave
- Sintomas constantes
- Atrofia tenar
- ENMG: alterações graves

## Tratamento Conservador

### Indicações
- STC leve a moderada
- Duração <12 meses
- Sem atrofia severa

### Órtese de punho
- Posição neutra
- Uso noturno (principal)
- Diurno se atividades agravam
- Evidência: nível A

### Mobilização neural
- Técnicas de deslizamento do mediano
- Progressão gradual
- Não agravar sintomas

### Exercícios de deslizamento tendíneo
- "Tendon gliding exercises"
- Reduzir edema intraneural
- Melhorar mobilidade no túnel

### Modificação de atividades
- Ergonomia no trabalho
- Pausas frequentes
- Evitar posições extremas

## O que NÃO funciona

- Ultrassom: evidência insuficiente
- TENS: não recomendado isoladamente
- Laser: inconsistente

## Infiltração de Corticoide

- Pode ser útil a curto prazo
- Não resolve causa
- Considerar em gestantes (sintomas transitórios)
- Máximo 2-3 infiltrações

## Indicação Cirúrgica

### Quando operar
- STC grave
- Atrofia tenar
- Falha tratamento conservador 3-6 meses
- Déficit motor progressivo

### Reabilitação pós-operatória
- Mobilização precoce
- Controle de edema
- Exercícios de deslizamento
- Dessensibilização da cicatriz

---

**Documente casos de STC** no RehabRoad com testes e acompanhamento da evolução sensitiva/motora.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-22",
    readTime: 10,
    category: "Tratamento",
    tags: ["túnel do carpo", "nervo mediano", "punho", "neuropatia", "mão"],
    metaDescription: "Síndrome do túnel do carpo: testes diagnósticos (Phalen, Tinel), tratamento conservador com órtese, mobilização neural e indicações cirúrgicas."
  },
  {
    id: "26",
    slug: "cervicalgia-dor-cervical-tratamento",
    title: "Cervicalgia: Avaliação e Tratamento Fisioterapêutico",
    excerpt: "Diagnóstico diferencial da dor cervical, red flags, e protocolos de tratamento baseados em evidência.",
    content: `
## Epidemiologia da Cervicalgia

A dor cervical é extremamente comum:
- 70% das pessoas terão em algum momento
- 2ª causa musculoesquelética mais comum (após lombalgia)
- Alta associação com trabalho em computador

## Classificação

### Por duração
- **Aguda**: <6 semanas
- **Subaguda**: 6-12 semanas
- **Crônica**: >12 semanas

### Por etiologia
- **Mecânica/inespecífica**: maioria (>90%)
- **Específica**: radiculopatia, mielopatia, trauma, infecção, tumor

## Red Flags

### Sinais de alerta
- Trauma significativo
- Mielopatia (marcha alterada, hiperreflexia)
- Febre, perda de peso
- Dor noturna intensa
- História de câncer
- Déficit neurológico progressivo

### Mielopatia cervical
- Mãos desajeitadas
- Alteração da marcha
- Sinal de Hoffmann positivo
- Hiperreflexia
- **Encaminhar urgente**

## Avaliação Fisioterapêutica

### ADM cervical
- Flexão/extensão
- Rotações
- Inclinações laterais
- Padrão de limitação

### Testes especiais

**Radiculopatia**
- Spurling: compressão + inclinação
- Distração cervical: alívio = positivo
- ULTT: tensão do plexo braquial

**Instabilidade**
- Sharp-Purser: instabilidade AA
- Teste de estresse ligamentar

**Artéria vertebral**
- Extensão + rotação sustentada
- Observar sintomas (tontura, nistagmo)

### Questionários
- NDI (Neck Disability Index)
- NPRS (dor)

## Causas Comuns

### Cervicalgia mecânica
- Postura sustentada
- Disfunção articular
- Tensão muscular
- Prognóstico favorável

### Radiculopatia cervical
- Dor irradiada para membro superior
- Segue dermátomo
- Fraqueza específica
- Alteração de reflexos

### Cefaleia cervicogênica
- Dor referida para cabeça
- Origem em estruturas cervicais
- Geralmente unilateral
- Reprodutível por movimentos cervicais

## Tratamento Baseado em Evidência

### Cervicalgia aguda
1. **Tranquilizar** o paciente
2. **Manter-se ativo** (evitar colar cervical)
3. Exercícios suaves
4. Calor local se conforto

### Cervicalgia crônica

**Exercícios (Evidência A)**
- Fortalecimento cervical profundo
- Mobilidade
- Exercícios escapulares
- Aeróbico

**Terapia manual (Evidência B)**
- Mobilização cervical
- Manipulação (se treinado)
- Complemento ao exercício

### Radiculopatia
- Similar a hérnia lombar
- Mobilização neural (sensitizing vs deslizamento)
- Tração (pode ajudar alguns)
- Fortalecimento após fase aguda

## Exercícios Específicos

### Flexores profundos (craniocervical flexion)
- Retração do queixo deitado
- Progressão de carga
- Fundamental na cervicalgia crônica

### Estabilização
- Co-contração cervical
- Progressão para funcional

### Alongamentos
- Escalenos
- Trapézio superior
- Elevador da escápula
- ECOM

### Postura/ergonomia
- Ajuste de estação de trabalho
- Pausas regulares
- Autogerenciamento

## O que NÃO Funciona

- Colar cervical prolongado
- Repouso absoluto
- Eletroterapia isolada
- Tração prolongada sem exercício

## Prognóstico

- Maioria melhora em 6-12 semanas
- 50-85% terão recorrência
- Exercícios reduzem recidiva

---

**Avalie cervicalgias** com templates completos no RehabRoad. ADM, testes e questionários em um só lugar.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-20",
    readTime: 11,
    category: "Tratamento",
    tags: ["cervicalgia", "dor cervical", "pescoço", "postura", "radiculopatia"],
    metaDescription: "Cervicalgia: avaliação com testes específicos, red flags, e tratamento fisioterapêutico baseado em evidência para dor cervical."
  },
  {
    id: "27",
    slug: "exercicios-para-dor-lombar-alivio-imediato",
    title: "10 Exercícios para Dor Lombar: Alívio Imediato em Casa",
    excerpt: "Exercícios simples e seguros para aliviar dor lombar que você pode fazer em casa hoje mesmo.",
    content: `
## Exercícios que Realmente Funcionam para Dor Lombar

A dor lombar afeta milhões de brasileiros. A boa notícia é que **exercícios específicos** podem aliviar a dor de forma segura e eficaz.

## Antes de Começar

### Quando NÃO fazer exercícios
- Dor irradiando para a perna com formigamento
- Perda de força nas pernas
- Dificuldade para urinar
- Febre associada

**Se tiver esses sintomas, procure um profissional.**

## Os 10 Melhores Exercícios

### 1. Respiração Diafragmática
- Deite de costas, joelhos dobrados
- Mão no abdômen
- Inspire inflando a barriga (4 segundos)
- Expire lentamente (6 segundos)
- **10 repetições**

### 2. Inclinação Pélvica (Pelvic Tilt)
- Deitado de costas
- Achate a lombar no chão contraindo abdômen
- Mantenha 5 segundos
- **15 repetições**

### 3. Joelhos ao Peito
- Deitado de costas
- Puxe um joelho ao peito
- Mantenha 30 segundos
- Troque de lado
- **3x cada lado**

### 4. Rotação de Tronco
- Deitado, joelhos dobrados
- Deixe os joelhos caírem para um lado
- Mantenha 30 segundos
- Troque de lado
- **3x cada lado**

### 5. Gato-Camelo
- Quatro apoios
- Arqueie as costas para cima (gato)
- Afunde o abdômen (camelo)
- Movimentos lentos
- **15 repetições**

### 6. Alongamento do Piriforme
- Deitado, cruze uma perna sobre a outra
- Puxe o joelho de baixo em direção ao peito
- Mantenha 30 segundos
- **3x cada lado**

### 7. Ponte
- Deitado, joelhos dobrados, pés no chão
- Levante o quadril
- Mantenha 5 segundos
- Desça controlado
- **15 repetições**

### 8. Bird Dog
- Quatro apoios
- Estenda braço direito e perna esquerda
- Mantenha 5 segundos
- Alterne
- **10x cada lado**

### 9. Alongamento do Psoas
- Ajoelhado, uma perna à frente (90°)
- Avance o quadril para frente
- Mantenha 30 segundos
- **3x cada lado**

### 10. Extensão em Prono (McKenzie)
- Deitado de bruços
- Apoie nos cotovelos
- Mantenha 30 segundos
- Se a dor centralizar, é bom sinal
- **5-10 repetições**

## Frequência Recomendada

- **Fase aguda**: 2-3x ao dia, suavemente
- **Manutenção**: 1x ao dia
- **Prevenção**: 3-4x por semana

## Dicas Importantes

1. Nunca force até a dor
2. Movimentos lentos e controlados
3. Respire normalmente
4. Pare se a dor piorar ou irradiar

---

**Quer um programa personalizado?** Consulte um fisioterapeuta para avaliação completa. O RehabRoad ajuda profissionais a prescrever exercícios específicos para cada paciente.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-20",
    readTime: 7,
    category: "Tratamento",
    tags: ["dor lombar", "exercícios", "alongamento", "lombalgia", "exercícios em casa"],
    metaDescription: "10 exercícios para dor lombar que você pode fazer em casa. Alívio imediato com técnicas seguras de alongamento e fortalecimento."
  },
  {
    id: "28",
    slug: "fisioterapia-respiratoria-quando-indicar",
    title: "Fisioterapia Respiratória: Indicações, Técnicas e Benefícios",
    excerpt: "Entenda quando a fisioterapia respiratória é indicada e como ela ajuda pacientes com doenças pulmonares.",
    content: `
## O que é Fisioterapia Respiratória?

A fisioterapia respiratória é a especialidade que trata disfunções do sistema respiratório, melhorando a ventilação, oxigenação e qualidade de vida.

## Principais Indicações

### Doenças Obstrutivas
- **DPOC** (Doença Pulmonar Obstrutiva Crônica)
- **Asma**
- Bronquiectasias
- Fibrose cística

### Doenças Restritivas
- Fibrose pulmonar
- Doenças neuromusculares
- Deformidades torácicas

### Pós-operatório
- Cirurgias torácicas
- Cirurgias abdominais altas
- Cirurgias cardíacas

### UTI e Hospitalização
- Ventilação mecânica
- Desmame de ventilador
- Pneumonia

## Técnicas de Fisioterapia Respiratória

### Higiene Brônquica

**Drenagem postural**
- Posicionamento para drenar secreções
- Usa gravidade a favor

**Huffing**
- Expiração forçada com glote aberta
- Mobiliza secreções

**Tosse assistida**
- Auxílio manual durante tosse
- Pacientes com fraqueza

### Reexpansão Pulmonar

**Exercícios respiratórios**
- Respiração diafragmática
- Respiração profunda sustentada
- Incentivador respiratório (Respiron)

**EPAP/CPAP**
- Pressão positiva na expiração
- Previne colapso alveolar

### Fortalecimento Muscular

**Treino de músculos inspiratórios (TMI)**
- PowerBreathe, Threshold
- Melhora força e endurance
- Evidência forte em DPOC

### Reabilitação Pulmonar

**Programa completo**
- Exercício aeróbico
- Fortalecimento muscular
- Educação
- 8-12 semanas

## Benefícios Comprovados

### Na DPOC (Evidência A)
- Melhora dispneia
- Aumenta capacidade de exercício
- Melhora qualidade de vida
- Reduz hospitalizações

### Pós-operatório
- Reduz complicações pulmonares
- Acelera recuperação
- Diminui tempo de internação

## Avaliação do Paciente

### Medidas objetivas
- Espirometria
- Pico de fluxo
- Oximetria
- Teste de caminhada de 6 minutos
- Escala de dispneia (Borg, mMRC)

### Questionários
- CAT (DPOC)
- SGRQ (qualidade de vida)

## Fisioterapia na COVID-19

### Fase aguda
- Posicionamento (prona se indicado)
- Desmame de O2
- Mobilização precoce

### Pós-COVID
- Síndrome pós-COVID com dispneia
- Reabilitação pulmonar
- Exercícios graduais

---

**Documente avaliações respiratórias** no RehabRoad com escalas validadas e acompanhamento da evolução.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-18",
    readTime: 9,
    category: "Especialidades",
    tags: ["fisioterapia respiratória", "DPOC", "reabilitação pulmonar", "pós-operatório"],
    metaDescription: "Fisioterapia respiratória: indicações, técnicas e benefícios. Tratamento de DPOC, asma, pós-operatório e reabilitação pulmonar."
  },
  {
    id: "29",
    slug: "avc-reabilitacao-fisioterapia-neurologica",
    title: "AVC: Reabilitação Fisioterapêutica e Recuperação Funcional",
    excerpt: "Como a fisioterapia ajuda na recuperação após AVC. Técnicas, exercícios e o que esperar da reabilitação.",
    content: `
## O AVC no Brasil

O Acidente Vascular Cerebral (AVC) é a principal causa de incapacidade em adultos no Brasil. A fisioterapia é **fundamental** para recuperação.

## Tipos de AVC

### AVC Isquêmico (85%)
- Obstrução de artéria cerebral
- Área sem oxigênio
- Tratamento agudo: trombólise

### AVC Hemorrágico (15%)
- Ruptura de vaso
- Sangramento no cérebro
- Mais grave inicialmente

## Sequelas Comuns

### Motoras
- **Hemiparesia/hemiplegia**: fraqueza ou paralisia de um lado
- Espasticidade
- Alteração de equilíbrio
- Dificuldade de marcha

### Sensoriais
- Alteração de sensibilidade
- Negligência espacial
- Alterações visuais

### Outras
- Afasia (linguagem)
- Disfagia (deglutição)
- Alterações cognitivas

## Fases da Recuperação

### Fase Aguda (0-7 dias)
- Estabilização clínica
- Posicionamento no leito
- Prevenção de complicações
- Mobilização precoce

### Fase Subaguda (1-6 meses)
- **Janela de neuroplasticidade**
- Reabilitação intensiva
- Maior potencial de recuperação

### Fase Crônica (>6 meses)
- Manutenção de ganhos
- Adaptação funcional
- Prevenção de complicações

## Abordagens de Reabilitação

### Bobath/NDT
- Facilitação de movimento normal
- Inibição de padrões patológicos
- Muito utilizado no Brasil

### Treino Orientado à Tarefa
- Prática de atividades funcionais
- Repetição intensiva
- Evidência crescente

### Terapia de Contensão Induzida
- Restringe lado bom
- Força uso do lado afetado
- Evidência forte para MS

### Marcha em Esteira com Suporte
- Suspensão de peso corporal
- Treino precoce de marcha
- Pode usar robótica

## Exercícios Específicos

### Membros Superiores
- Alcançar objetos
- Movimentos repetitivos
- Tarefas funcionais

### Membros Inferiores
- Transferências (sentar-levantar)
- Equilíbrio em pé
- Treino de marcha

### Equilíbrio
- Sentado sem apoio
- Em pé com apoio progressivo
- Perturbações controladas

## Espasticidade

### Manejo fisioterapêutico
- Alongamentos sustentados
- Posicionamento adequado
- Gelo antes de exercícios
- Movimento ativo

### Outros tratamentos
- Toxina botulínica
- Órteses
- Medicação oral

## Prognóstico

### Fatores favoráveis
- Início precoce de reabilitação
- AVC de menor extensão
- Boa função cognitiva
- Suporte familiar

### Expectativa realista
- Maior recuperação nos primeiros 3-6 meses
- Melhoras possíveis por anos
- Adaptação e compensação

---

**Acompanhe a evolução de pacientes neurológicos** no RehabRoad com escalas funcionais e registro de progressos.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-16",
    readTime: 11,
    category: "Especialidades",
    tags: ["AVC", "fisioterapia neurológica", "reabilitação", "hemiparesia", "neuroplasticidade"],
    metaDescription: "Reabilitação após AVC: técnicas de fisioterapia neurológica, fases da recuperação, exercícios e prognóstico funcional."
  },
  {
    id: "30",
    slug: "fisioterapia-esportiva-lesoes-atletas",
    title: "Fisioterapia Esportiva: Prevenção e Tratamento de Lesões em Atletas",
    excerpt: "Como a fisioterapia esportiva atua na prevenção, tratamento e reabilitação de lesões em atletas de todos os níveis.",
    content: `
## O que é Fisioterapia Esportiva?

A fisioterapia esportiva é a área que cuida da prevenção, tratamento e reabilitação de lesões relacionadas à prática esportiva, do atleta amador ao profissional.

## Atuação do Fisioterapeuta Esportivo

### Prevenção
- Avaliação de risco de lesões
- Programas preventivos
- Aquecimento e alongamento
- Correção biomecânica

### Tratamento
- Lesões agudas em campo
- Reabilitação pós-lesão
- Retorno ao esporte

### Performance
- Otimização de movimento
- Recuperação pós-treino
- Preparação para competição

## Lesões Mais Comuns por Esporte

### Futebol
- Lesão de LCA
- Entorses de tornozelo
- Lesões musculares (coxa)
- Pubalgia

### Corrida
- Síndrome do trato iliotibial
- Fascite plantar
- Canelite
- Fraturas de estresse

### Musculação
- Tendinopatias (ombro, cotovelo)
- Lesões lombares
- Lesões de manguito rotador

### Vôlei/Basquete
- Tendinopatia patelar
- Entorses de tornozelo
- Lesões de ombro

## Princípios de Reabilitação Esportiva

### 1. Controle de Dor e Edema
- PRICE → POLICE → PEACE & LOVE
- Crioterapia
- Compressão
- Mobilização precoce

### 2. Restaurar Mobilidade
- ADM progressiva
- Flexibilidade
- Mobilização articular

### 3. Reforço Muscular
- Isométrico → isotônico → funcional
- Cadeia cinética aberta e fechada
- Força, potência, resistência

### 4. Controle Neuromuscular
- Propriocepção
- Equilíbrio
- Estabilização dinâmica

### 5. Treino Específico do Esporte
- Gestos específicos
- Simulação de situações de jogo
- Progressão de intensidade

## Critérios de Retorno ao Esporte

### Objetivos
- Força >90% do lado sadio
- Hop tests simétricos
- Testes funcionais específicos

### Subjetivos
- Confiança psicológica
- Sem dor em atividades
- Motivação para retorno

### Tempo mínimo
- Depende da lesão
- LCA: 9-12 meses
- Muscular grau 2: 4-6 semanas

## Programas de Prevenção

### FIFA 11+
- Programa para futebol
- Reduz lesões em 30-50%
- 20 minutos, 2x/semana

### Nordic Hamstrings
- Previne lesões de isquiotibiais
- Exercício excêntrico
- Evidência forte

---

**Gerencie atletas e suas lesões** no RehabRoad com acompanhamento de retorno ao esporte.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-14",
    readTime: 10,
    category: "Especialidades",
    tags: ["fisioterapia esportiva", "lesão esportiva", "atleta", "prevenção", "retorno ao esporte"],
    metaDescription: "Fisioterapia esportiva: prevenção e tratamento de lesões em atletas. Reabilitação, critérios de retorno ao esporte e programas preventivos."
  },
  {
    id: "31",
    slug: "entorse-de-tornozelo-tratamento-completo",
    title: "Entorse de Tornozelo: Graus, Tratamento e Reabilitação",
    excerpt: "Guia completo sobre entorse de tornozelo: classificação, tratamento e exercícios para prevenir recidivas.",
    content: `
## O que é Entorse de Tornozelo?

A entorse de tornozelo é uma das lesões mais comuns, ocorrendo quando os ligamentos são estirados ou rompidos. **85% são entorses laterais** (inversão).

## Anatomia dos Ligamentos

### Complexo lateral
- **LTFA** (talofibular anterior) - mais lesionado
- LCF (calcaneofibular)
- LTFP (talofibular posterior)

### Complexo medial (deltóide)
- Mais forte e resistente
- Lesão menos comum

## Classificação por Graus

### Grau I (Leve)
- Estiramento ligamentar
- Edema mínimo
- Pode caminhar
- Recuperação: 1-2 semanas

### Grau II (Moderado)
- Ruptura parcial
- Edema e hematoma moderados
- Dificuldade para caminhar
- Recuperação: 3-6 semanas

### Grau III (Grave)
- Ruptura completa
- Edema e hematoma importantes
- Instabilidade
- Recuperação: 8-12 semanas

## Avaliação

### Testes de estabilidade
- **Gaveta anterior**: LTFA
- **Tilt talar**: LCF
- **Squeeze test**: afastar lesão sindesmose

### Regras de Ottawa
Indicam radiografia se:
- Dor óssea em maléolos
- Incapacidade de dar 4 passos
- Dor em base do 5º metatarso

## Tratamento Agudo

### PEACE & LOVE (novo protocolo)

**PEACE (primeiros dias)**
- **P**rotection: evitar sobrecarregar
- **E**levation: acima do coração
- **A**void anti-inflammatories
- **C**ompression: bandagem
- **E**ducation: evitar tratamentos passivos

**LOVE (após fase aguda)**
- **L**oad: carga progressiva
- **O**ptimism: expectativas positivas
- **V**ascularisation: exercício aeróbico
- **E**xercise: restaurar função

## Reabilitação por Fases

### Fase 1 (Proteção)
- Controle de edema
- ADM suave
- Apoio parcial com muletas se necessário
- Exercícios de dorsiflexão/plantiflexão

### Fase 2 (Restauração)
- Apoio total progressivo
- Fortalecimento: inversores, eversores, tríceps sural
- Propriocepção em superfície estável
- Alongamentos

### Fase 3 (Funcional)
- Propriocepção em superfície instável
- Exercícios pliométricos
- Mudanças de direção
- Corrida progressiva

### Fase 4 (Retorno ao Esporte)
- Gestos específicos
- Agilidade
- Confiança psicológica

## Prevenção de Recidivas

- **Propriocepção**: exercícios de equilíbrio
- **Fortalecimento**: fibulares
- **Tornozeleira**: situações de risco
- **Aquecimento adequado**

## Taxa de Recidiva

- 30-40% terão nova entorse
- Instabilidade crônica em 20%
- Programa de prevenção reduz risco

---

**Acompanhe a reabilitação de entorses** no RehabRoad com marcos de progressão claros.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-12",
    readTime: 9,
    category: "Tratamento",
    tags: ["entorse de tornozelo", "tornozelo", "ligamento", "propriocepção", "reabilitação"],
    metaDescription: "Entorse de tornozelo: classificação por graus, tratamento PEACE & LOVE, reabilitação e exercícios para prevenir recidivas."
  },
  {
    id: "32",
    slug: "lesao-muscular-distensao-tratamento",
    title: "Lesão Muscular (Distensão): Classificação e Tratamento",
    excerpt: "Entenda as lesões musculares: graus de distensão, tempo de recuperação e como reabilitar corretamente.",
    content: `
## O que é Lesão Muscular?

A lesão muscular (ou distensão) ocorre quando fibras musculares são danificadas, geralmente durante contração excêntrica forçada ou estiramento excessivo.

## Músculos Mais Afetados

### Membros inferiores
- **Isquiotibiais** (mais comum em corrida/futebol)
- Quadríceps (reto femoral)
- Adutores
- Gastrocnêmio (panturrilha)

### Membros superiores
- Bíceps braquial
- Peitoral maior

## Classificação

### Grau I (Leve)
- <5% das fibras
- Dor leve, mínimo edema
- Função preservada
- Retorno: 1-2 semanas

### Grau II (Moderado)
- 5-50% das fibras
- Dor moderada, hematoma
- Perda parcial de função
- Retorno: 3-6 semanas

### Grau III (Grave)
- >50% ou ruptura completa
- Dor intensa, hematoma extenso
- Defeito palpável
- Pode precisar cirurgia
- Retorno: 2-4 meses

## Mecanismo de Lesão

### Fatores de risco
- Aquecimento inadequado
- Lesão prévia (principal!)
- Fadiga
- Desequilíbrio muscular
- Idade

### Momento da lesão
- Contração excêntrica
- Sprint, chute, salto
- Mudança de direção

## Tratamento por Fases

### Fase Aguda (0-72h)
- Proteção (evitar estiramento)
- Gelo: 15-20min a cada 2-3h
- Compressão
- Elevação
- Evitar anti-inflamatórios nos primeiros dias

### Fase de Regeneração (3-21 dias)
- Mobilização ativa suave
- Isométricos sem dor
- Carga progressiva leve
- Evitar alongamento intenso

### Fase de Remodelação (>21 dias)
- Exercícios excêntricos
- Alongamento progressivo
- Fortalecimento funcional
- Treino específico

## Protocolo de Reabilitação

### Isquiotibiais (exemplo)
1. **Semana 1**: isométricos, bicicleta sem carga
2. **Semana 2**: isotônicos leves, marcha normal
3. **Semana 3-4**: excêntricos progressivos, trote
4. **Semana 5-6**: corrida progressiva, gestos esportivos

## Critérios de Retorno

### Objetivos
- Força >90% comparado ao lado sadio
- ADM completa sem dor
- Testes funcionais específicos

### Subjetivos
- Sem dor em atividades
- Confiança para competir

## Prevenção de Recidiva

- **Nordic hamstrings**: evidência forte
- Aquecimento adequado
- Fortalecimento excêntrico
- Correção de desequilíbrios

---

**Documente lesões musculares** no RehabRoad com fotos de evolução e marcos de recuperação.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-10",
    readTime: 9,
    category: "Tratamento",
    tags: ["lesão muscular", "distensão", "isquiotibiais", "estiramento", "reabilitação"],
    metaDescription: "Lesão muscular: classificação por graus, tratamento e reabilitação. Tempo de recuperação e exercícios para prevenir recidivas."
  },
  {
    id: "33",
    slug: "sindrome-tunel-carpo-tratamento-fisioterapia",
    title: "Síndrome do Túnel do Carpo: Diagnóstico e Tratamento Conservador",
    excerpt: "Tudo sobre síndrome do túnel do carpo: sintomas, testes diagnósticos e quando a fisioterapia pode ajudar.",
    content: `
## O que é Síndrome do Túnel do Carpo?

A síndrome do túnel do carpo (STC) é a neuropatia compressiva mais comum, causada pela compressão do **nervo mediano** no punho.

## Anatomia

O túnel do carpo é um canal rígido formado por:
- Base: ossos do carpo
- Teto: retináculo dos flexores
- Conteúdo: nervo mediano + 9 tendões flexores

## Fatores de Risco

### Ocupacionais
- Movimentos repetitivos do punho
- Vibração
- Uso de ferramentas manuais
- Digitação prolongada

### Condições associadas
- Diabetes
- Hipotireoidismo
- Artrite reumatoide
- Gravidez
- Obesidade

## Sintomas

### Típicos
- Formigamento em polegar, indicador, médio
- Piora à noite
- Acorda sacudindo a mão ("flicking")
- Dor irradiada para antebraço

### Avançados
- Fraqueza de pinça
- Atrofia tenar
- Alteração de sensibilidade

## Diagnóstico

### Testes clínicos

**Phalen**
- Flexão máxima do punho por 60 segundos
- Positivo: reproduz sintomas
- Sensibilidade: 68%

**Tinel**
- Percussão sobre o túnel
- Positivo: formigamento nos dedos
- Sensibilidade: 50%

**Teste de compressão do carpo**
- Pressão sobre o túnel por 30 segundos
- Mais sensível que Phalen

### Eletroneuromiografia
- Padrão ouro
- Confirma e quantifica
- Nem sempre necessário

## Tratamento Conservador

### Indicação
- Sintomas leves a moderados
- Sem atrofia muscular
- Início recente

### Órtese noturna
- Mantém punho neutro
- Reduz pressão no nervo
- 3-6 semanas de uso contínuo
- Evidência forte

### Modificação de atividade
- Pausas regulares
- Ergonomia
- Evitar posições extremas

### Mobilização neural
- Deslizamento do nervo mediano
- Técnicas de tensionamento suave
- Pode reduzir sintomas

### Exercícios
- Deslizamento tendíneo
- Alongamento de flexores
- Fortalecimento progressivo

## Quando Operar

### Indicações cirúrgicas
- Falha do tratamento conservador (3-6 meses)
- Atrofia tenar
- Déficit sensitivo persistente
- Sintomas graves

### Cirurgia
- Liberação do retináculo
- Ambulatorial
- Boa taxa de sucesso

## Prognóstico Conservador

- 50-80% melhoram com órtese
- Melhores resultados se sintomas recentes
- Casos leves respondem melhor

---

**Acompanhe pacientes com STC** no RehabRoad com testes de acompanhamento e evolução dos sintomas.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-08",
    readTime: 9,
    category: "Tratamento",
    tags: ["túnel do carpo", "nervo mediano", "formigamento", "punho", "LER"],
    metaDescription: "Síndrome do túnel do carpo: sintomas, testes diagnósticos, tratamento conservador com órtese e fisioterapia, e quando operar."
  },
  {
    id: "34",
    slug: "ler-dort-prevencao-tratamento",
    title: "LER/DORT: Prevenção, Diagnóstico e Tratamento no Trabalho",
    excerpt: "Entenda as Lesões por Esforço Repetitivo e como prevenir e tratar problemas relacionados ao trabalho.",
    content: `
## O que é LER/DORT?

**LER** (Lesões por Esforços Repetitivos) e **DORT** (Distúrbios Osteomusculares Relacionados ao Trabalho) são termos que englobam diversas condições causadas ou agravadas pelo trabalho.

## Condições Mais Comuns

### Membros superiores
- Síndrome do túnel do carpo
- Tendinite de extensores/flexores
- Epicondilite lateral/medial
- Tendinite do manguito rotador
- Síndrome do desfiladeiro torácico

### Coluna
- Lombalgia ocupacional
- Cervicalgia por postura

## Fatores de Risco

### Biomecânicos
- Movimentos repetitivos
- Postura inadequada
- Força excessiva
- Vibração
- Compressão mecânica

### Organizacionais
- Ritmo de trabalho intenso
- Pausas insuficientes
- Pressão por produtividade
- Falta de autonomia

### Psicossociais
- Estresse
- Insatisfação
- Falta de suporte

## Diagnóstico

### Critérios
- Relação temporal com atividade laboral
- Sintomas que melhoram no afastamento
- Achados clínicos compatíveis

### Anamnese ocupacional
- Descrição detalhada da atividade
- Tempo de exposição
- Movimentos realizados
- Postura de trabalho

## Tratamento

### Fase aguda
- Afastamento temporário se necessário
- Controle de dor
- Repouso relativo (não absoluto)

### Reabilitação
- Exercícios específicos
- Alongamentos
- Fortalecimento progressivo
- Educação ergonômica

### Retorno ao trabalho
- Gradual e planejado
- Modificações no posto de trabalho
- Acompanhamento

## Prevenção no Trabalho

### Ergonomia
- Altura adequada de mesa/cadeira
- Monitor na altura dos olhos
- Teclado e mouse bem posicionados
- Apoio para punhos se necessário

### Pausas ativas
- A cada 50-60 minutos
- Movimentação e alongamentos
- 5-10 minutos

### Exercícios preventivos

**Alongamentos recomendados**
- Flexores e extensores de punho
- Cervical (rotação, inclinação)
- Ombros e peitorais

**Movimentação**
- Rotação de ombros
- Abertura de mãos
- Movimento cervical

## Aspectos Legais

### CAT (Comunicação de Acidente de Trabalho)
- Obrigatória quando há nexo
- Garante direitos trabalhistas
- Emitida pela empresa ou sindicato

### Afastamento
- Até 15 dias: empresa
- Mais de 15 dias: INSS (B91)

---

**Documente casos ocupacionais** no RehabRoad com histórico completo para laudos e perícias.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-06",
    readTime: 10,
    category: "Tratamento",
    tags: ["LER", "DORT", "trabalho", "ergonomia", "prevenção"],
    metaDescription: "LER/DORT: lesões ocupacionais, fatores de risco, prevenção com ergonomia e pausas, tratamento e aspectos legais."
  },
  {
    id: "35",
    slug: "fisioterapia-idosos-exercicios-terceira-idade",
    title: "Fisioterapia para Idosos: Exercícios e Prevenção de Quedas",
    excerpt: "Como a fisioterapia ajuda idosos a manter independência, prevenir quedas e melhorar qualidade de vida.",
    content: `
## Envelhecimento e Função Física

Com o envelhecimento, ocorrem mudanças naturais:
- Perda de massa muscular (sarcopenia)
- Redução de equilíbrio
- Diminuição de flexibilidade
- Alterações de marcha

A fisioterapia ajuda a **minimizar essas perdas** e manter a independência.

## Principais Problemas em Idosos

### Quedas
- 30% dos idosos >65 anos caem por ano
- Principal causa de lesão grave
- Medo de cair → restrição → mais fraqueza

### Sarcopenia
- Perda de 3-8% de massa muscular/década após 30 anos
- Acelera após 60 anos
- Reversível com exercício

### Alterações de equilíbrio
- Visão, propriocepção e vestibular
- Tempo de reação mais lento
- Maior risco de quedas

## Avaliação do Idoso

### Testes funcionais
- **TUG (Timed Up and Go)**: <10s normal, >14s risco de queda
- **Sentar-levantar 5x**: força de MMII
- **Alcance funcional**: equilíbrio
- **Escala de Berg**: equilíbrio completo

### Avaliação de risco de quedas
- Histórico de quedas
- Medicamentos
- Visão
- Ambiente domiciliar

## Exercícios Recomendados

### Fortalecimento
- Sentar e levantar da cadeira
- Subir degraus
- Agachamento com apoio
- Extensão de joelho
- **2-3x/semana, 8-12 repetições**

### Equilíbrio
- Apoio unipodal
- Tandem (pé na frente do outro)
- Caminhar em linha
- Exercícios com olhos fechados
- **Diariamente, 10-15 minutos**

### Flexibilidade
- Alongamentos suaves
- Ênfase em isquiotibiais, quadríceps, panturrilha
- **Diariamente, após exercícios**

### Aeróbico
- Caminhada
- Bicicleta ergométrica
- Hidroginástica
- **150 min/semana, moderado**

## Programas de Prevenção de Quedas

### Otago Exercise Programme
- Desenvolvido na Nova Zelândia
- Reduz quedas em 35%
- Fortalecimento + equilíbrio
- Pode ser feito em casa

### Tai Chi
- Reduz quedas em 40-50%
- Melhora equilíbrio e confiança
- Social e prazeroso

## Modificação Ambiental

### Dentro de casa
- Remover tapetes soltos
- Iluminação adequada
- Barras no banheiro
- Sapatos adequados

### Fora de casa
- Cuidado com pisos molhados
- Usar corrimão em escadas
- Atenção a desníveis

## Importância da Continuidade

- Benefícios mantidos apenas com exercício contínuo
- Grupos de exercício aumentam adesão
- Fisioterapeuta orienta e motiva

---

**Avalie e acompanhe idosos** no RehabRoad com escalas funcionais específicas para terceira idade.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-04",
    readTime: 10,
    category: "Especialidades",
    tags: ["idosos", "terceira idade", "quedas", "equilíbrio", "sarcopenia"],
    metaDescription: "Fisioterapia para idosos: exercícios de fortalecimento, equilíbrio e prevenção de quedas. Programas Otago e Tai Chi."
  },
  {
    id: "36",
    slug: "parkinson-fisioterapia-exercicios",
    title: "Doença de Parkinson: Fisioterapia e Exercícios Essenciais",
    excerpt: "Como a fisioterapia ajuda pacientes com Parkinson a manter mobilidade, equilíbrio e independência funcional.",
    content: `
## O que é Doença de Parkinson?

A doença de Parkinson é um distúrbio neurodegenerativo progressivo caracterizado pela perda de neurônios dopaminérgicos, causando alterações motoras e não-motoras.

## Sintomas Motores

### Cardinais
- **Bradicinesia**: lentidão dos movimentos
- **Tremor de repouso**: "contar moedas"
- **Rigidez**: tipo "roda denteada"
- **Instabilidade postural**: fases avançadas

### Outros
- Freezing (congelamento da marcha)
- Festinação (passos curtos e rápidos)
- Hipomimia (face sem expressão)
- Micrografia

## Papel da Fisioterapia

### Objetivos
- Manter mobilidade e função
- Melhorar equilíbrio
- Prevenir quedas
- Manter independência nas AVDs

### Evidência
- Exercício é **fundamental** no manejo
- Pode modificar progressão da doença
- Melhora qualidade de vida

## Tipos de Exercício Recomendados

### Amplitude de movimento
- Exercícios amplos e exagerados
- Combate a bradicinesia
- Foco em extensão (coluna, quadril)

### LSVT BIG
- Programa específico para Parkinson
- Movimentos amplos e exagerados
- 4x/semana por 4 semanas
- Evidência forte

### Treino de marcha
- Passos grandes
- Elevação dos pés
- Pistas visuais (faixas no chão)
- Pistas auditivas (metrônomo)

### Equilíbrio
- Deslocamentos de peso
- Reações de proteção
- Exercícios em superfícies variadas

### Exercício aeróbico
- Bicicleta, esteira, dança
- 30-60 min, 3x/semana
- Pode ser neuroprotetor

### Dança
- Tango argentino: evidência
- Forró, samba: opções brasileiras
- Social e motivador

## Estratégias para Freezing

### Pistas externas
- Linhas no chão
- Laser no sapato
- Metrônomo
- Contagem em voz alta

### Estratégias mentais
- "Pense grande"
- Dividir movimento em etapas
- Focar atenção no movimento

## Exercícios Específicos

### Para rigidez
- Rotação de tronco
- Alongamentos ativos
- Movimentos pendulares

### Para postura
- Extensão de coluna
- Fortalecimento extensores
- Consciência postural

### Para equilíbrio
- Apoio unipodal
- Perturbações posturais
- Dual-task (duas tarefas)

## Recomendações Gerais

- Exercício regular é essencial
- Melhor horário: pico do medicamento (ON)
- Grupos de exercício aumentam adesão
- Manter atividade a longo prazo

---

**Acompanhe pacientes com Parkinson** no RehabRoad com escalas específicas e registro de flutuações.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2025-01-02",
    readTime: 10,
    category: "Especialidades",
    tags: ["Parkinson", "fisioterapia neurológica", "equilíbrio", "marcha", "LSVT BIG"],
    metaDescription: "Fisioterapia para Parkinson: exercícios LSVT BIG, treino de marcha, equilíbrio e estratégias para freezing."
  },
  {
    id: "37",
    slug: "dor-de-cabeca-cervicogenica-tratamento",
    title: "Dor de Cabeça Cervicogênica: Quando a Cervical Causa Cefaleia",
    excerpt: "Entenda a cefaleia cervicogênica, como diferenciá-la de enxaqueca e o tratamento fisioterapêutico eficaz.",
    content: `
## O que é Cefaleia Cervicogênica?

A cefaleia cervicogênica é uma dor de cabeça secundária, originada em estruturas da coluna cervical (articulações, discos, músculos, ligamentos).

## Diferencial: Cervicogênica vs Enxaqueca

### Cefaleia cervicogênica
- Unilateral, sempre mesmo lado
- Começa na nuca e irradia para frente
- Piora com movimento cervical
- Sem aura
- Rigidez cervical associada

### Enxaqueca
- Pode alternar lados
- Pulsátil
- Náusea, fotofobia, fonofobia
- Pode ter aura
- Não relacionada ao movimento

## Critérios Diagnósticos

### Obrigatórios (ICHD-3)
1. Dor de cabeça unilateral sem mudança de lado
2. Dor precipitada por movimento cervical
3. Redução de ADM cervical
4. Melhora com bloqueio anestésico

### Estruturas envolvidas
- Articulações C1-C2, C2-C3 (principais)
- Disco C2-C3
- Músculos suboccipitais
- Nervo occipital maior

## Avaliação

### Exame cervical
- ADM (especialmente rotação)
- Palpação de estruturas
- Teste de flexão-rotação (C1-C2)
- Reprodução dos sintomas

### Teste de flexão-rotação
- Positivo se assimetria >10°
- Alta sensibilidade para C1-C2
- Reproduz cefaleia

## Tratamento Fisioterapêutico

### Técnicas manuais

**Mobilização cervical alta**
- Articulações C1-C2, C2-C3
- Técnicas de Maitland ou Mulligan
- Evidência forte

**Liberação suboccipital**
- Musculatura profunda
- Técnica de inibição
- Complementa mobilização

### Exercícios

**Flexão craniocervical**
- Retração do queixo
- Fortalece flexores profundos
- Progressão com pressão

**Estabilização cervical**
- Co-contração
- Integração funcional

**Alongamentos**
- Escalenos
- Trapézio superior
- ECOM

### Correção postural
- Postura da cabeça anteriorizada
- Ergonomia no trabalho
- Educação

## Resultados Esperados

- 50-80% de melhora com fisioterapia
- Melhores resultados: terapia manual + exercício
- Manutenção requer exercícios em casa

## Sinais de Alerta

Encaminhar se:
- Cefaleia nova e intensa após 50 anos
- Cefaleia progressiva
- Déficit neurológico
- Febre associada

---

**Documente casos de cefaleia** no RehabRoad com diário de dor e gatilhos identificados.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-30",
    readTime: 9,
    category: "Tratamento",
    tags: ["dor de cabeça", "cefaleia cervicogênica", "cervical", "enxaqueca", "mobilização"],
    metaDescription: "Cefaleia cervicogênica: como diferenciar de enxaqueca e tratamento fisioterapêutico com mobilização cervical e exercícios."
  },
  {
    id: "38",
    slug: "ultrassom-terapeutico-parametros-indicacoes",
    title: "Ultrassom Terapêutico: Parâmetros e Indicações Baseadas em Evidência",
    excerpt: "Guia completo sobre ultrassom terapêutico: quando usar, parâmetros corretos e o que a ciência diz.",
    content: `
## O que é Ultrassom Terapêutico?

O ultrassom terapêutico (UST) é uma modalidade de eletroterapia que utiliza ondas sonoras de alta frequência para produzir efeitos térmicos e não-térmicos nos tecidos.

## Parâmetros Técnicos

### Frequência
- **1 MHz**: tecidos profundos (3-5cm)
- **3 MHz**: tecidos superficiais (1-2cm)

### Intensidade
- 0,1 a 2,0 W/cm²
- Baixa: 0,1-0,5 W/cm² (agudo)
- Média: 0,5-1,0 W/cm²
- Alta: 1,0-2,0 W/cm² (crônico)

### Modo
- **Contínuo**: efeito térmico
- **Pulsado**: efeito não-térmico

### Ciclo de trabalho (pulsado)
- 10%, 20%, 50%
- Menor ciclo = menos calor

## Efeitos Fisiológicos

### Térmicos (contínuo)
- Aumento do fluxo sanguíneo
- Aumento da extensibilidade do colágeno
- Redução de dor
- Aumento do metabolismo

### Não-térmicos (pulsado)
- Cavitação estável
- Streaming acústico
- Estímulo à cicatrização
- Redução de edema

## Indicações

### Com evidência favorável
- Cicatrização de feridas (pulsado, baixa intensidade)
- Fraturas de estresse (LIPUS)
- Calcificações (antes de exercícios)

### Evidência limitada
- Tendinopatias
- Bursite
- Capsulite adesiva
- Dor lombar

### Evidência desfavorável
- Artrose (pouco benefício isolado)
- Dor crônica inespecífica

## Contraindicações

### Absolutas
- Sobre tumores malignos
- Gestação (abdômen)
- Olhos
- Área cardíaca
- Sobre marca-passo

### Relativas
- Infecção aguda
- Tromboflebite
- Alteração de sensibilidade
- Epífises de crescimento

## Técnica de Aplicação

### Preparação
- Gel condutor abundante
- Pele limpa e seca
- Área bem delimitada

### Aplicação
- Cabeçote em movimento contínuo
- Velocidade: 4 cm/segundo
- Área: 2x o tamanho do cabeçote por região
- Tempo: 1-2 min por área de 2x cabeçote

## O que a Evidência Diz

### Cochrane Reviews
- Pouca evidência para a maioria das condições musculoesqueléticas
- Efeitos modestos quando presentes
- Provavelmente não deve ser usado isoladamente

### Uso racional
- Combinar com exercícios
- Não usar como tratamento principal
- Considerar custo-benefício

---

**Documente aplicações de eletroterapia** no RehabRoad com parâmetros utilizados e resultados.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-28",
    readTime: 8,
    category: "Eletroterapia",
    tags: ["ultrassom", "eletroterapia", "US terapêutico", "parâmetros"],
    metaDescription: "Ultrassom terapêutico: parâmetros (frequência, intensidade, modo), indicações com evidência e técnica de aplicação."
  },
  {
    id: "39",
    slug: "corrente-russa-eletroestimulacao-muscular",
    title: "Corrente Russa: Eletroestimulação para Fortalecimento Muscular",
    excerpt: "Entenda a corrente russa: como funciona, parâmetros corretos e quando usar para ganho de força.",
    content: `
## O que é Corrente Russa?

A corrente russa é uma forma de eletroestimulação neuromuscular (EENM) que utiliza corrente alternada de média frequência (2.500 Hz) modulada em bursts para produzir contração muscular.

## História

Desenvolvida na Rússia nos anos 1970 para treino de atletas olímpicos. O pesquisador Yakov Kots alegou ganhos de força de 40% em atletas de elite.

## Como Funciona

### Parâmetros típicos
- **Frequência portadora**: 2.500 Hz
- **Modulação**: 50 bursts/segundo
- **Ciclo ON/OFF**: 10s/50s (exemplo)
- **Intensidade**: máxima tolerável

### Mecanismo
- Despolariza neurônios motores
- Recruta fibras musculares
- Produz contração tetânica

## Corrente Russa vs Outras Correntes

### Vs FES (corrente pulsada)
- Russa: menos desconforto em altas intensidades
- FES: mais versátil, mais estudada
- Na prática: resultados similares

### Vs corrente interferencial
- Interferencial: analgesia
- Russa: contração muscular

## Indicações

### Com evidência
- Recuperação de força pós-cirúrgica (LCA, ATJ)
- Atrofia por desuso
- Complemento ao exercício

### Evidência limitada
- Ganho de força em saudáveis
- Hipertrofia isolada
- Performance esportiva

## Aplicação Prática

### Posicionamento de eletrodos
- Sobre o ventre muscular
- Seguir ponto motor se possível
- Evitar tendões

### Protocolo típico
- 10-15 contrações
- Ciclo 10s ON / 50s OFF
- Intensidade: contração visível e forte
- 3x/semana

### Progressão
- Aumentar intensidade conforme tolerância
- Combinar com contração voluntária
- Associar a exercícios funcionais

## Contraindicações

- Marca-passo cardíaco
- Gestação (abdômen)
- Epilepsia não controlada
- Sobre tumores
- Trombose venosa

## Limitações

### O que a evidência mostra
- Ganhos de força são modestos
- Não substitui exercício voluntário
- Melhor como adjuvante
- Alegações originais (40%) não replicadas

### Uso racional
- Pacientes que não conseguem exercício voluntário
- Pós-operatório imediato
- Complemento, nunca substituto

---

**Registre parâmetros de EENM** no RehabRoad e acompanhe a evolução de força dos pacientes.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-25",
    readTime: 8,
    category: "Eletroterapia",
    tags: ["corrente russa", "eletroestimulação", "EENM", "fortalecimento"],
    metaDescription: "Corrente russa: parâmetros, indicações e evidência científica para eletroestimulação muscular em fisioterapia."
  },
  {
    id: "40",
    slug: "laserterapia-fisioterapia-indicacoes",
    title: "Laserterapia na Fisioterapia: Indicações e Parâmetros",
    excerpt: "Guia sobre laser de baixa potência: como funciona, quando usar e o que a evidência científica recomenda.",
    content: `
## O que é Laserterapia?

A laserterapia de baixa potência (LLLT ou fotobiomodulação) utiliza luz monocromática para estimular processos celulares de cicatrização e redução de inflamação.

## Tipos de Laser

### Por comprimento de onda
- **Vermelho (630-700nm)**: tecidos superficiais
- **Infravermelho (780-1000nm)**: tecidos profundos

### Lasers comuns
- HeNe (632nm): vermelho
- GaAs (904nm): infravermelho
- GaAlAs (780-860nm): infravermelho

## Mecanismos de Ação

### Celular
- Absorção por citocromos
- Aumento de ATP
- Modulação de espécies reativas de oxigênio
- Estímulo à síntese proteica

### Clínico
- Aceleração de cicatrização
- Redução de inflamação
- Analgesia
- Redução de edema

## Parâmetros Importantes

### Dose (J/cm²)
- O mais importante
- Janela terapêutica: 1-10 J/cm²
- Muito pouco ou muito pode não funcionar

### Potência (mW)
- Determina tempo de aplicação
- Lasers de fisioterapia: 10-500mW

### Tempo
- Tempo (s) = Dose (J) / Potência (W)
- Exemplo: 4J com laser 40mW = 100 segundos

## Indicações por Condição

### Cicatrização de feridas
- Evidência: moderada positiva
- Úlceras diabéticas, úlceras de pressão
- Dose: 2-4 J/cm²

### Tendinopatias
- Evidência: variável
- Tendão de Aquiles: pode ajudar
- Epicondilite: evidência fraca

### Artrose
- Evidência: conflitante
- Joelho: alguns estudos positivos
- Não deve ser tratamento único

### Dor lombar
- Evidência: limitada
- Pode ajudar a curto prazo
- Combinar com exercícios

### Mucosite oral
- Evidência: boa
- Pós-quimioterapia
- Prevenção e tratamento

## Contraindicações

### Absolutas
- Diretamente sobre olhos
- Sobre tumores malignos
- Gestação (abdômen/lombar)

### Relativas
- Fotossensibilidade
- Sobre tireoide
- Epilepsia

## Aplicação Prática

### Técnica
- Pontual (para pontos específicos)
- Varredura (para áreas maiores)
- Contato ou sem contato

### Frequência
- Geralmente 2-3x/semana
- 6-12 sessões típico

## Limitações

### O que a evidência mostra
- Resultados inconsistentes em muitas condições
- Parâmetros variam muito entre estudos
- Provavelmente efeitos modestos
- Não deve ser tratamento principal isolado

---

**Documente protocolos de laser** no RehabRoad com parâmetros e evolução da condição tratada.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-22",
    readTime: 9,
    category: "Eletroterapia",
    tags: ["laser", "laserterapia", "fotobiomodulação", "LLLT", "cicatrização"],
    metaDescription: "Laserterapia em fisioterapia: indicações, parâmetros (dose, potência, comprimento de onda) e evidência científica."
  },
  {
    id: "41",
    slug: "pilates-clinico-fisioterapia-beneficios",
    title: "Pilates Clínico: Como Usar na Reabilitação Fisioterapêutica",
    excerpt: "Entenda o Pilates clínico na fisioterapia: princípios, evidências e como aplicar na reabilitação.",
    content: `
## O que é Pilates Clínico?

O Pilates clínico é a aplicação dos princípios do método Pilates no contexto terapêutico, supervisionado por fisioterapeuta, com foco em reabilitação de condições específicas.

## Diferença: Pilates Clínico vs Studio

### Pilates clínico
- Conduzido por fisioterapeuta
- Foco em reabilitação
- Avaliação fisioterapêutica prévia
- Adaptado à condição do paciente

### Pilates de studio
- Instrutor de Pilates
- Foco em condicionamento
- Para pessoas saudáveis
- Exercícios padronizados

## Princípios do Pilates

1. **Concentração**: atenção ao movimento
2. **Controle**: qualidade sobre quantidade
3. **Centro (Powerhouse)**: estabilização do core
4. **Fluidez**: movimentos suaves
5. **Precisão**: execução correta
6. **Respiração**: coordenação com movimento

## Evidências Científicas

### Dor lombar
- **Evidência moderada** para redução de dor
- Comparável a outros exercícios
- Melhor que controle/mínima intervenção

### Outras condições
- Cervicalgia: evidência limitada positiva
- Escoliose: pode ajudar como complemento
- Pós-parto: benefícios para core

## Indicações

### Condições ortopédicas
- Dor lombar crônica
- Pós-operatório de coluna (fase tardia)
- Disfunção de controle motor
- Instabilidade lombar

### Condições específicas
- Fortalecimento de assoalho pélvico
- Reabilitação pós-parto
- Condicionamento pré-cirúrgico

## Equipamentos

### Solo (Mat)
- Exercícios no colchonete
- Acessórios: bola, faixa, anel
- Mais acessível

### Aparelhos
- Reformer: molas, resistência variável
- Cadillac: versatilidade
- Ladder Barrel: flexibilidade

## Exercícios Básicos

### Respiração diafragmática
- Base de tudo
- Ativação coordenada do core

### Pelvic clock
- Mobilidade lombar
- Consciência de movimento

### Bridge (ponte)
- Fortalecimento glúteos e core
- Progressão com variações

### Dead bug
- Estabilização com movimento de membros
- Dissociação

### Swimming
- Extensão de coluna
- Fortalecimento extensores

## Precauções

### Contraindicações relativas
- Dor aguda intensa
- Osteoporose grave (cuidado com flexão)
- Hérnia de disco aguda
- Instabilidade articular grave

### Adaptações necessárias
- Gestantes: evitar decúbito dorsal prolongado
- Idosos: reduzir complexidade
- Pós-operatório: respeitar restrições

## Integração com Reabilitação

- Não substitui fisioterapia convencional
- Complementa o tratamento
- Fase de manutenção/prevenção
- Educação do paciente sobre movimento

---

**Prescreva exercícios de Pilates** integrados ao plano de tratamento no RehabRoad.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-18",
    readTime: 9,
    category: "Técnicas Manuais",
    tags: ["Pilates", "Pilates clínico", "core", "estabilização", "dor lombar"],
    metaDescription: "Pilates clínico na fisioterapia: evidências, princípios e exercícios para reabilitação de dor lombar e outras condições."
  },
  {
    id: "42",
    slug: "terapia-manual-mobilizacao-manipulacao",
    title: "Terapia Manual: Mobilização vs Manipulação Articular",
    excerpt: "Entenda as diferenças entre mobilização e manipulação, indicações, contraindicações e evidências.",
    content: `
## O que é Terapia Manual?

Terapia manual engloba técnicas de tratamento realizadas com as mãos, incluindo mobilização articular, manipulação, liberação miofascial e técnicas de tecidos moles.

## Mobilização vs Manipulação

### Mobilização articular
- Movimento passivo de baixa velocidade
- Oscilações rítmicas
- Dentro da amplitude fisiológica
- Paciente pode parar a qualquer momento

### Manipulação (thrust)
- Movimento de alta velocidade e baixa amplitude
- "Estalo" articular (cavitação)
- Ultrapassa limite fisiológico momentaneamente
- Requer treinamento específico

## Graus de Maitland

### Mobilização
- **Grau I**: pequena amplitude no início do arco
- **Grau II**: grande amplitude no meio do arco
- **Grau III**: grande amplitude até a resistência
- **Grau IV**: pequena amplitude no final do arco

### Manipulação
- **Grau V**: thrust de alta velocidade

## Indicações

### Mobilização
- Dor articular
- Restrição de ADM
- Rigidez articular
- Condições agudas a crônicas

### Manipulação
- Dor e rigidez subagudas/crônicas
- Restrição de mobilidade segmentar
- Cefaleia cervicogênica
- Dor lombar mecânica

## Contraindicações

### Manipulação cervical
- Insuficiência vertebrobasilar
- Artrite reumatoide (instabilidade C1-C2)
- Osteoporose grave
- Malignidade
- Déficit neurológico progressivo

### Manipulação geral
- Fratura recente
- Luxação
- Infecção
- Tumor ósseo
- Anticoagulação severa

## Evidências Científicas

### Coluna lombar
- **Manipulação**: benefício a curto prazo para dor lombar aguda
- **Mobilização**: pode ser igualmente eficaz
- Combinar com exercício = melhores resultados

### Coluna cervical
- Evidência moderada para cervicalgia
- Mobilização mais segura que thrust cervical alto
- Sempre avaliar artéria vertebral

### Extremidades
- Evidência para epicondilite, capsulite adesiva
- Mobilização com movimento (Mulligan)

## Técnicas Comuns

### Mulligan (mobilização com movimento)
- Deslizamento sustentado + movimento ativo
- SNAG, NAG, MWM
- Indolor durante aplicação

### Maitland
- Oscilações passivas
- Graus baseados na amplitude e resistência
- Avaliação contínua

### Kaltenborn
- Tração e deslizamento
- Baseado em artrocinética
- Regras convexo-côncavo

## Segurança

### Manipulação cervical
- Avaliar artéria vertebral (teste insuficiente)
- História de TIA/AVC
- Consentimento informado
- Considerar mobilização como alternativa

### Registro
- Documentar técnica utilizada
- Resposta do paciente
- Consentimento

---

**Documente técnicas manuais** no RehabRoad com descrição e resposta do paciente.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-15",
    readTime: 10,
    category: "Técnicas Manuais",
    tags: ["terapia manual", "mobilização", "manipulação", "Maitland", "Mulligan"],
    metaDescription: "Terapia manual em fisioterapia: diferenças entre mobilização e manipulação, graus de Maitland, indicações e contraindicações."
  },
  {
    id: "43",
    slug: "liberacao-miofascial-trigger-points",
    title: "Liberação Miofascial e Trigger Points: Técnicas e Evidências",
    excerpt: "Guia sobre liberação miofascial e tratamento de pontos-gatilho: como fazer e o que a ciência diz.",
    content: `
## O que é Fáscia?

A fáscia é um tecido conectivo que envolve músculos, órgãos e estruturas do corpo, formando uma rede contínua. Alterações na fáscia podem contribuir para dor e restrição de movimento.

## Liberação Miofascial

### O que é?
Técnicas manuais que visam restaurar a mobilidade e elasticidade do tecido fascial.

### Tipos de técnicas
- **Direta**: pressão no tecido restrito
- **Indireta**: posiciona no sentido da facilidade
- **Instrumental**: uso de ferramentas (IASTM)

## Trigger Points (Pontos-Gatilho)

### Definição
Nódulos hipersensíveis em bandas tensas musculares que podem causar dor local e referida.

### Características
- Banda tensa palpável
- Ponto sensível na banda
- Dor referida característica
- Resposta de contração local

## Técnicas de Tratamento

### Compressão isquêmica
- Pressão sustentada (30-90s)
- Esperar liberação/diminuição da dor
- Progredir para tecidos mais profundos

### Liberação por pressão
- Similar à compressão isquêmica
- Pode incluir movimento ativo do paciente

### Técnica de energia muscular
- Contração isométrica contra resistência
- Relaxamento pós-isométrico
- Alongamento após relaxamento

### Dry needling
- Agulhamento do trigger point
- Resposta de contração local
- Requer formação específica

### IASTM (Instrument Assisted Soft Tissue Mobilization)
- Ferramentas de metal
- Graston, ERGON, etc.
- Teoria: microtraumas controlados

## Evidências Científicas

### Trigger points
- **Dry needling**: evidência moderada para dor
- **Compressão manual**: pode ser eficaz
- **Spray and stretch**: uso limitado

### Liberação miofascial
- Efeitos provavelmente mais neurológicos que mecânicos
- Resultados mistos em estudos
- Pode ajudar como parte do tratamento

### Rolo de espuma (foam roller)
- Pode melhorar ADM temporariamente
- Não prejudica performance
- Útil para aquecimento

## Limitações

### Questões controversas
- Trigger points são realmente identificáveis?
- Baixa concordância entre examinadores
- Mecanismos ainda não totalmente compreendidos
- Efeito placebo significativo

### Uso racional
- Não deve ser tratamento único
- Combinar com exercícios
- Educação do paciente
- Considerar fatores biopsicossociais

## Quando Usar

### Indicações razoáveis
- Dor miofascial localizada
- Restrição de movimento
- Complemento a exercícios
- Preferência do paciente

### Precauções
- Anticoagulação (IASTM, dry needling)
- Pele com lesões
- Infecção local
- Gravidez (áreas específicas)

---

**Registre técnicas de liberação miofascial** no RehabRoad com localização e resposta ao tratamento.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-12",
    readTime: 9,
    category: "Técnicas Manuais",
    tags: ["liberação miofascial", "trigger points", "pontos-gatilho", "dry needling", "fáscia"],
    metaDescription: "Liberação miofascial e trigger points: técnicas de tratamento, dry needling, IASTM e evidências científicas."
  },
  {
    id: "44",
    slug: "alongamento-estatico-dinamico-diferenca",
    title: "Alongamento: Estático vs Dinâmico - Quando Usar Cada Um",
    excerpt: "Entenda as diferenças entre alongamento estático e dinâmico e quando usar cada tipo na prática clínica.",
    content: `
## Tipos de Alongamento

### Alongamento estático
- Posição mantida por tempo (15-60s)
- Sem movimento
- Mais comum na prática clínica
- Foco em aumentar flexibilidade

### Alongamento dinâmico
- Movimentos ativos controlados
- Progressão de amplitude
- Usado em aquecimento
- Prepara para atividade

### Alongamento balístico
- Movimentos rápidos e "jogados"
- Risco de lesão
- Pouco usado atualmente

### FNP (Facilitação Neuromuscular Proprioceptiva)
- Contrai-relaxa
- Contrai-relaxa com contração do agonista
- Mais eficaz para ganho de ADM

## Quando Usar Cada Tipo

### Alongamento estático
**Indicações:**
- Ganho de flexibilidade
- Pós-exercício (controverso)
- Reabilitação de encurtamentos
- Relaxamento

**Evitar:**
- Antes de atividades explosivas
- Pode reduzir força/potência temporariamente

### Alongamento dinâmico
**Indicações:**
- Aquecimento pré-exercício
- Antes de esportes
- Ativação muscular
- Preparo funcional

### FNP
**Indicações:**
- Ganho de ADM mais rápido
- Encurtamentos importantes
- Pós-operatório (fase adequada)

## Parâmetros do Alongamento Estático

### Tempo de sustentação
- Mínimo: 15-30 segundos
- Ideal: 30-60 segundos
- Idosos: podem precisar de mais tempo

### Repetições
- 2-4 repetições por grupo muscular
- Total: 60 segundos ou mais por músculo

### Frequência
- Para ganho: diariamente ou 5-7x/semana
- Manutenção: 2-3x/semana

### Intensidade
- Até ponto de desconforto leve
- Não deve causar dor
- Não forçar em instabilidade

## O que a Evidência Diz

### Alongamento antes do exercício
- Estático NÃO previne lesões (metanálises)
- Pode REDUZIR força/potência por 15-30min
- Dinâmico é preferível para aquecimento

### Alongamento para flexibilidade
- Estático é eficaz para ganho de ADM
- Precisa ser feito regularmente
- Efeitos são específicos ao músculo alongado

### Prevenção de lesões
- Alongamento isolado não previne lesões
- Aquecimento geral + específico é mais importante
- Fortalecimento excêntrico previne lesões musculares

## Mitos Comuns

### "Alongar sempre antes do treino"
- Depende do tipo de atividade
- Dinâmico para aquecimento
- Estático pode prejudicar performance

### "Alongar previne DOMS"
- Não previne dor muscular tardia
- Exercício submáximo é melhor prevenção

### "Quanto mais, melhor"
- Existe dose ideal
- Muito alongamento pode ser prejudicial
- Respeitar limites

## Recomendações Práticas

### Aquecimento
1. Exercício aeróbico leve (5-10min)
2. Alongamento dinâmico
3. Movimentos específicos da atividade

### Reabilitação
1. Aquecimento local
2. Alongamento estático ou FNP
3. Exercícios de fortalecimento
4. Funcional

---

**Prescreva alongamentos específicos** no RehabRoad e envie para seus pacientes via WhatsApp.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-08",
    readTime: 9,
    category: "Tratamento",
    tags: ["alongamento", "flexibilidade", "aquecimento", "FNP", "mobilidade"],
    metaDescription: "Alongamento estático vs dinâmico: diferenças, quando usar cada um, parâmetros e o que a evidência científica recomenda."
  },
  {
    id: "45",
    slug: "crioterapia-fisioterapia-quando-usar-gelo",
    title: "Crioterapia: Quando Usar Gelo e Quando Evitar",
    excerpt: "Guia sobre uso de gelo na fisioterapia: indicações, contraindicações e o que mudou nas recomendações.",
    content: `
## O que é Crioterapia?

Crioterapia é a aplicação de frio para fins terapêuticos. É uma das modalidades mais antigas e acessíveis da fisioterapia.

## Efeitos Fisiológicos

### Imediatos
- Vasoconstrição
- Redução do metabolismo celular
- Diminuição da velocidade de condução nervosa
- Redução do espasmo muscular

### Secundários
- Redução de edema (controverso)
- Analgesia
- Diminuição da inflamação

## Formas de Aplicação

### Bolsa de gelo
- Mais comum
- 15-20 minutos
- Com proteção (toalha)

### Imersão em água gelada
- Membros distais
- Tempo menor (10-15min)
- Temperatura: 10-15°C

### Crioterapia de corpo inteiro
- Câmaras criogênicas
- -110°C a -140°C
- 2-3 minutos
- Uso em esportes (recuperação)

### Spray de resfriamento
- Efeito rápido e superficial
- Spray and stretch
- Não substitui gelo

## Indicações Clássicas

### Lesões agudas
- Entorses
- Contusões
- Distensões musculares
- Pós-operatório imediato

### Inflamação
- Artrite em fase aguda
- Bursite aguda
- Tendinite aguda

### Espasmo muscular
- Redução para permitir mobilização
- Antes de exercícios

## A Controvérsia: RICE vs PEACE & LOVE

### Protocolo RICE (antigo)
- Rest, Ice, Compression, Elevation
- Padrão por décadas
- Questionado atualmente

### Novo paradigma: PEACE & LOVE
- Evitar anti-inflamatórios e gelo excessivo
- Inflamação é necessária para cicatrização
- Gelo pode atrasar recuperação

## O que a Evidência Diz

### Para dor
- Gelo reduz dor a curto prazo
- Efeito analgésico comprovado

### Para edema
- Evidência fraca
- Compressão é mais eficaz

### Para recuperação
- Pode atrasar cicatrização tecidual
- Uso excessivo não recomendado
- Não deve ser primeira linha

## Quando Usar (Recomendações Atuais)

### Indicado
- Alívio de dor intensa
- Preparar para exercício/mobilização
- Pós-exercício para atletas (preferência individual)
- Espasmo muscular

### Evitar
- Fases prolongadas de lesão
- Como tratamento principal
- Uso excessivo (horas)

## Contraindicações

### Absolutas
- Doença de Raynaud
- Crioglobulinemia
- Urticária ao frio

### Relativas
- Alteração de sensibilidade
- Feridas abertas
- Circulação comprometida

## Aplicação Segura

- Proteção entre gelo e pele
- Não exceder 20 minutos
- Verificar pele a cada 5 minutos
- Evitar em áreas com pouca cobertura muscular

---

**Documente uso de crioterapia** no RehabRoad com duração, local e resposta do paciente.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-05",
    readTime: 8,
    category: "Eletroterapia",
    tags: ["crioterapia", "gelo", "PRICE", "PEACE LOVE", "lesão aguda"],
    metaDescription: "Crioterapia em fisioterapia: quando usar gelo, protocolo PEACE & LOVE, contraindicações e o que a evidência atual recomenda."
  },
  {
    id: "46",
    slug: "fisioterapia-pos-operatorio-lca-protocolo",
    title: "Fisioterapia Pós-Operatório de LCA: Protocolo de Reabilitação",
    excerpt: "Protocolo completo de reabilitação após cirurgia de LCA: fases, exercícios e critérios de progressão.",
    content: `
## Cirurgia de LCA

A reconstrução do ligamento cruzado anterior (LCA) é um dos procedimentos ortopédicos mais comuns. A fisioterapia é **fundamental** para o sucesso da cirurgia.

## Enxertos Comuns

### Tendão patelar (BTB)
- "Padrão ouro" histórico
- Dor anterior pode persistir
- Retorno ligeiramente mais rápido

### Isquiotibiais (STG)
- Menos dor anterior
- Pode ter mais frouxidão
- Proteger flexores

### Quadríceps
- Opção crescente
- Menos comum no Brasil

## Protocolo por Fases

### Fase 1: Proteção (0-2 semanas)

**Objetivos:**
- Proteger enxerto
- Controlar dor e edema
- Restaurar extensão completa
- Ativar quadríceps

**Exercícios:**
- Isométricos de quadríceps
- Elevação da perna estendida
- Mobilização patelar
- Dorsiflexão ativa

**Metas:**
- Extensão 0° (fundamental!)
- Flexão 90°
- Controle de edema

### Fase 2: Mobilidade (2-6 semanas)

**Objetivos:**
- ADM completa
- Marcha normal
- Força muscular

**Exercícios:**
- Bicicleta estacionária
- Agachamento parcial
- Step lateral
- Ponte

**Metas:**
- Flexão 120°
- Marcha sem muletas
- Extensão ativa completa

### Fase 3: Fortalecimento (6-12 semanas)

**Objetivos:**
- Força de MMII
- Controle neuromuscular
- Propriocepção básica

**Exercícios:**
- Leg press
- Agachamento progressivo
- Equilíbrio unipodal
- Ponte unipodal

**Metas:**
- Força >70% do lado sadio
- Agachamento 90° sem dor
- Equilíbrio adequado

### Fase 4: Funcional (3-6 meses)

**Objetivos:**
- Força quase simétrica
- Controle dinâmico
- Início de corrida

**Exercícios:**
- Fortalecimento intenso
- Exercícios pliométricos leves
- Corrida em linha reta
- Agilidade básica

**Metas:**
- Força >85%
- Corrida sem dor
- Hop test >85%

### Fase 5: Retorno ao Esporte (6-9+ meses)

**Objetivos:**
- Retorno seguro
- Prevenção de re-lesão

**Exercícios:**
- Gestos específicos do esporte
- Agilidade avançada
- Contato progressivo

**Critérios de alta:**
- Força >90%
- Hop tests >90%
- Confiança psicológica
- Tempo mínimo respeitado

## Critérios de Progressão

### Para próxima fase
- Metas da fase atual atingidas
- Sem dor ou derrame significativo
- Força e ADM adequadas

### Red flags
- Aumento de derrame
- Dor persistente
- Instabilidade subjetiva

## Prevenção de Re-lesão

- Completar reabilitação
- Força simétrica
- Programa de prevenção (FIFA 11+)
- Retorno gradual

## Erros Comuns

- Retorno precoce ao esporte
- Negligenciar extensão completa
- Pular fases
- Não trabalhar propriocepção

---

**Acompanhe pós-operatórios de LCA** no RehabRoad com marcos de progressão e critérios objetivos.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-12-01",
    readTime: 11,
    category: "Tratamento",
    tags: ["LCA", "pós-operatório", "joelho", "reabilitação", "retorno ao esporte"],
    metaDescription: "Protocolo de fisioterapia pós-operatório de LCA: fases de reabilitação, exercícios, critérios de progressão e retorno ao esporte."
  },
  {
    id: "47",
    slug: "fisioterapia-pelvica-incontinencia-urinaria",
    title: "Fisioterapia Pélvica: Tratamento da Incontinência Urinária",
    excerpt: "Como a fisioterapia pélvica trata incontinência urinária. Exercícios de Kegel, biofeedback e resultados.",
    content: `
## O que é Fisioterapia Pélvica?

A fisioterapia pélvica é a especialidade que trata disfunções do assoalho pélvico, incluindo incontinência urinária, fecal, prolapsos e disfunções sexuais.

## Incontinência Urinária

### Tipos
- **De esforço**: perda ao tossir, espirrar, pular
- **De urgência**: perda associada à urgência (bexiga hiperativa)
- **Mista**: combinação das duas

### Prevalência
- Afeta 25-45% das mulheres
- Aumenta com idade
- Subdiagnosticada (vergonha)

## Anatomia do Assoalho Pélvico

### Músculos principais
- Levantador do ânus
- Coccígeo
- Esfíncteres

### Funções
- Suporte dos órgãos pélvicos
- Continência urinária e fecal
- Função sexual

## Avaliação

### Anamnese
- Tipo de perda
- Frequência
- Uso de absorventes
- Impacto na qualidade de vida

### Exame físico
- Inspeção (prolapsos)
- Palpação (força, coordenação)
- Avaliação funcional (AFA/Oxford)

### Questionários
- ICIQ-SF
- King's Health Questionnaire

## Tratamento: Exercícios de Kegel

### O que são?
Contrações voluntárias dos músculos do assoalho pélvico.

### Como fazer corretamente
1. Identificar os músculos corretos
2. Contrair sem usar glúteos ou abdômen
3. Manter 5-10 segundos
4. Relaxar completamente
5. Repetir 10-15 vezes
6. 3 séries ao dia

### Erros comuns
- Contrair glúteos ou abdômen
- Prender respiração
- Fazer força para baixo

## Outras Técnicas

### Biofeedback
- Eletromiografia do assoalho pélvico
- Visualização da contração
- Melhora a conscientização

### Eletroestimulação
- Quando paciente não consegue contrair
- Frequência baixa para fortalecimento
- Alta para inibir urgência

### Cones vaginais
- Progressão de peso
- Reforço muscular
- Pode melhorar consciência

### Treinamento vesical
- Para bexiga hiperativa
- Espaçar idas ao banheiro
- Técnicas de supressão

## Evidências

### Incontinência de esforço
- Exercícios são tratamento de **primeira linha**
- Taxa de cura: 50-70%
- Melhora em quase 100%

### Bexiga hiperativa
- Treinamento vesical + exercícios
- Evidência forte
- Alternativa a medicamentos

## Resultados Esperados

- Mínimo 3 meses de tratamento
- Supervisão melhora resultados
- Manutenção necessária

## Quando Encaminhar para Cirurgia

- Falha do tratamento conservador (6-12 meses)
- Prolapsos significativos
- Preferência da paciente

---

**Acompanhe pacientes de fisioterapia pélvica** no RehabRoad com escalas específicas e diário miccional.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-28",
    readTime: 10,
    category: "Especialidades",
    tags: ["fisioterapia pélvica", "incontinência urinária", "Kegel", "assoalho pélvico"],
    metaDescription: "Fisioterapia pélvica para incontinência urinária: exercícios de Kegel, biofeedback, treinamento vesical e resultados esperados."
  },
  {
    id: "48",
    slug: "hidroterapia-beneficios-indicacoes",
    title: "Hidroterapia: Benefícios, Indicações e Exercícios na Água",
    excerpt: "Entenda os benefícios da fisioterapia aquática e quando indicar tratamento na piscina terapêutica.",
    content: `
## O que é Hidroterapia?

A hidroterapia (ou fisioterapia aquática) utiliza as propriedades físicas da água para reabilitação. A imersão em água aquecida proporciona um ambiente único para tratamento.

## Propriedades Físicas da Água

### Flutuação (empuxo)
- Reduz peso corporal aparente
- Imersão até cintura: 50% do peso
- Imersão até peito: 25-30% do peso
- Permite exercícios sem sobrecarga

### Pressão hidrostática
- Aumenta com profundidade
- Reduz edema
- Melhora retorno venoso
- Auxilia função respiratória

### Viscosidade
- Resistência ao movimento
- Resistência proporcional à velocidade
- Fortalecimento funcional

### Temperatura
- Piscina terapêutica: 33-36°C
- Relaxamento muscular
- Aumento do fluxo sanguíneo
- Redução de dor

## Indicações

### Ortopédicas
- Pós-operatório de MMII (LCA, ATJ, ATQ)
- Artrose
- Dor lombar
- Fraturas (fase adequada)

### Neurológicas
- AVC
- Parkinson
- Esclerose múltipla
- Lesão medular

### Reumatológicas
- Artrite reumatoide
- Fibromialgia
- Espondilite anquilosante

### Outras
- Gestantes
- Idosos com risco de queda
- Obesidade (exercício sem impacto)

## Contraindicações

### Absolutas
- Feridas abertas
- Incontinência fecal/urinária não controlada
- Infecções de pele
- Insuficiência cardíaca descompensada
- Pressão arterial não controlada

### Relativas
- Medo de água
- Epilepsia não controlada
- Doenças infecciosas ativas

## Métodos de Hidroterapia

### Bad Ragaz Ring Method
- Anéis de flutuação
- Padrões de movimento
- Resistência do terapeuta

### Halliwick
- Desenvolvido para pacientes com deficiência
- 10 pontos de aprendizado
- Controle rotacional, equilíbrio

### Watsu
- Relaxamento passivo
- Movimentos fluidos
- Alongamento aquático

### Ai Chi
- Tai chi adaptado para água
- Movimentos lentos
- Equilíbrio e relaxamento

## Exercícios Comuns

### Marcha
- Em diferentes profundidades
- Para frente, lateral, trás
- Com resistência de drag

### Fortalecimento
- Contra resistência da água
- Flutuadores para aumentar resistência
- Exercícios funcionais

### Equilíbrio
- Turbulência controlada
- Superfícies instáveis
- Perturbações

### Alongamento
- Amplitude facilitada pela flutuação
- Relaxamento muscular pelo calor

## Vantagens

- Descarga de peso
- Menos dor durante exercício
- Ambiente seguro (quedas)
- Motivador e prazeroso
- Início precoce de reabilitação

## Desvantagens

- Custo (piscina terapêutica)
- Disponibilidade limitada
- Risco de infecção (controle adequado)
- Transferência para solo necessária

---

**Inclua hidroterapia no plano de tratamento** registrado no RehabRoad com exercícios específicos.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-25",
    readTime: 10,
    category: "Especialidades",
    tags: ["hidroterapia", "fisioterapia aquática", "piscina", "reabilitação"],
    metaDescription: "Hidroterapia: propriedades da água, indicações, contraindicações e métodos de fisioterapia aquática para reabilitação."
  },
  {
    id: "49",
    slug: "espondilolistese-tratamento-conservador",
    title: "Espondilolistese: Diagnóstico e Tratamento Conservador",
    excerpt: "Entenda a espondilolistese: tipos, graus, quando operar e como tratar com fisioterapia.",
    content: `
## O que é Espondilolistese?

Espondilolistese é o deslizamento de uma vértebra sobre outra. Mais comum em L5-S1 e L4-L5.

## Tipos

### Ístmica (mais comum)
- Defeito na pars interarticularis
- Comum em adolescentes atletas
- Esportes com hiperextensão (ginástica, futebol americano)

### Degenerativa
- Associada à artrose facetária
- Mais comum em mulheres >50 anos
- Geralmente L4-L5

### Congênita
- Malformação vertebral
- Detectada na infância

### Traumática
- Fratura aguda
- Pós-trauma significativo

### Patológica
- Tumor, infecção
- Enfraquecimento ósseo

## Classificação de Meyerding

| Grau | Deslizamento |
|------|--------------|
| I | 0-25% |
| II | 25-50% |
| III | 50-75% |
| IV | 75-100% |
| V | >100% (espondiloptose) |

## Sintomas

### Típicos
- Dor lombar
- Dor que piora com extensão
- Pode irradiar para glúteos
- Rigidez lombar

### Com comprometimento neurológico
- Ciatalgia
- Claudicação neurogênica
- Fraqueza em MMII
- Alteração sensitiva

## Diagnóstico

### Exame físico
- Hiperlordose lombar
- "Degrau" palpável (graus maiores)
- Encurtamento de isquiotibiais (comum)
- Testes neurológicos

### Imagem
- RX: perfil lombar (diagnóstico)
- RX dinâmico: instabilidade
- RNM: se sintomas neurológicos

## Tratamento Conservador

### Indicações
- Graus I e II assintomáticos ou leves
- Sem déficit neurológico progressivo
- Maioria dos casos!

### Fisioterapia

**Objetivos:**
- Estabilização lombar
- Fortalecimento do core
- Flexibilidade (isquiotibiais, flexores de quadril)
- Educação postural

**Exercícios:**
- Estabilização em neutro
- Ponte
- Bird dog
- Dead bug
- Fortalecimento abdominal

**Evitar:**
- Hiperextensão lombar
- Exercícios de impacto
- Carga axial excessiva

### Modificação de atividade
- Evitar esportes de impacto
- Pausas em atividades prolongadas
- Ergonomia

### Órtese (colete)
- Casos sintomáticos agudos
- Espondilólise em cicatrização
- Uso temporário

## Quando Operar

### Indicações cirúrgicas
- Falha do tratamento conservador (6+ meses)
- Déficit neurológico progressivo
- Deslizamento progressivo em crescimento
- Graus III-IV sintomáticos

### Tipos de cirurgia
- Descompressão
- Fusão (artrodese)
- Com ou sem instrumentação

## Prognóstico Conservador

- Maioria melhora com tratamento
- Graus I-II: excelente prognóstico
- Manutenção de exercícios é fundamental
- Progressão é rara em adultos

---

**Acompanhe casos de espondilolistese** no RehabRoad com registro de grau e evolução dos sintomas.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-22",
    readTime: 10,
    category: "Tratamento",
    tags: ["espondilolistese", "coluna lombar", "estabilização", "dor lombar"],
    metaDescription: "Espondilolistese: tipos, classificação de Meyerding, tratamento conservador com fisioterapia e quando indicar cirurgia."
  },
  {
    id: "50",
    slug: "ondas-de-choque-fisioterapia-indicacoes",
    title: "Ondas de Choque na Fisioterapia: Indicações e Evidências",
    excerpt: "Guia completo sobre terapia por ondas de choque: como funciona, indicações e resultados esperados.",
    content: `
## O que são Ondas de Choque?

A terapia por ondas de choque extracorpóreas (ESWT) utiliza ondas acústicas de alta energia para tratar condições musculoesqueléticas crônicas.

## Tipos de Ondas de Choque

### Focais
- Energia concentrada em ponto específico
- Penetração mais profunda
- Mais precisas
- Equipamento mais caro

### Radiais
- Energia dispersa
- Penetração mais superficial
- Área maior de tratamento
- Mais comum em clínicas

## Mecanismos de Ação

### Propostos
- Neovascularização
- Liberação de fatores de crescimento
- Modulação da dor
- Destruição de calcificações
- Estimulação da cicatrização

### Efeito mecânico
- Cavitação
- Microtrauma controlado
- Resposta inflamatória reparadora

## Indicações com Evidência

### Forte evidência
- **Fasciíte plantar crônica**: após falha de tratamento conservador
- **Tendinopatia calcificante do ombro**: para reabsorção
- **Epicondilite lateral crônica**: >6 meses de sintomas

### Evidência moderada
- Tendinopatia patelar
- Tendinopatia de Aquiles (porção média)
- Síndrome do trocânter maior

### Evidência limitada
- Pseudoartrose
- Dor miofascial
- Espasticidade (em estudo)

## Protocolo de Aplicação

### Parâmetros típicos
- 2000-3000 impulsos por sessão
- Intensidade: conforme tolerância
- 3-5 sessões
- Intervalo: 1 semana

### Técnica
- Localização precisa da lesão
- Gel condutor
- Aumento gradual de intensidade
- Feedback do paciente

## Contraindicações

### Absolutas
- Gravidez
- Tumores na área
- Infecção local
- Sobre tecido pulmonar
- Anticoagulação importante

### Relativas
- Próximo a estruturas nervosas
- Crianças (cartilagem de crescimento)
- Corticoides recentes (aguardar 6 semanas)

## O que Esperar

### Durante o tratamento
- Desconforto/dor durante aplicação
- Tolerável na maioria
- Anestesia não recomendada

### Após o tratamento
- Dor pode aumentar 24-48h
- Melhora gradual em semanas
- Resultado final: 12 semanas

### Taxa de sucesso
- Fasciíte plantar: 70-80%
- Calcificação ombro: 60-80%
- Epicondilite: 60-70%

## Vantagens

- Não invasivo
- Ambulatorial
- Alternativa à cirurgia
- Sem tempo de recuperação

## Limitações

- Custo elevado
- Não resolve todos os casos
- Requer equipamento específico
- Resultados variáveis

## Combinação com Reabilitação

- Ondas de choque NÃO substituem exercícios
- Melhor resultado: ESWT + reabilitação
- Continuar exercícios após tratamento
- Tratar causa, não só sintoma

---

**Registre tratamentos com ondas de choque** no RehabRoad com parâmetros e evolução.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-18",
    readTime: 9,
    category: "Eletroterapia",
    tags: ["ondas de choque", "ESWT", "tendinopatia", "fasciíte plantar", "calcificação"],
    metaDescription: "Terapia por ondas de choque: indicações baseadas em evidência, parâmetros, contraindicações e resultados esperados."
  },
  {
    id: "51",
    slug: "como-abrir-consultorio-fisioterapia",
    title: "Como Abrir um Consultório de Fisioterapia: Guia Completo",
    excerpt: "Passo a passo para abrir seu consultório de fisioterapia: documentação, equipamentos, custos e dicas de sucesso.",
    content: `
## Planejamento Inicial

### Defina seu nicho
- Ortopedia/traumatologia
- Neurologia
- Esportiva
- Pélvica
- Geral

### Estudo de mercado
- Concorrência na região
- Público-alvo
- Demanda existente
- Diferenciais possíveis

## Documentação Necessária

### Registro profissional
- CREFITO ativo
- Certidão de regularidade

### Empresa
- CNPJ (MEI ou ME)
- Inscrição municipal
- Alvará de funcionamento
- Alvará sanitário (Vigilância Sanitária)

### Para emissão de nota fiscal
- Inscrição no ISS municipal
- Certificado digital (opcional, mas útil)

## Estrutura Física

### Espaço mínimo
- Sala de atendimento: 9-12m² (individual)
- Banheiro acessível
- Recepção/espera

### Requisitos sanitários
- Piso lavável
- Ventilação adequada
- Pia para higienização
- Acessibilidade

### Equipamentos básicos
- Maca/divã
- Escada de 2 degraus
- Espelho
- Equipamentos de avaliação
- Acessórios para exercícios

## Custos Iniciais

### Estimativa básica
- Aluguel: R$ 1.000-3.000/mês
- Reforma/adequação: R$ 5.000-20.000
- Equipamentos básicos: R$ 5.000-15.000
- Documentação: R$ 1.000-3.000
- Capital de giro: 3-6 meses de despesas

### Custos mensais
- Aluguel
- Água, luz, internet
- Contador
- Marketing
- Materiais de consumo

## Precificação

### Como calcular
- Custos fixos + variáveis
- Margem de lucro desejada
- Preço de mercado
- Valor percebido

### Formas de cobrança
- Por sessão
- Pacotes mensais
- Convênios (atenção aos valores)

## Marketing e Captação

### Presença digital
- Google Meu Negócio (essencial!)
- Instagram profissional
- Site/landing page
- Avaliações de pacientes

### Networking
- Médicos da região
- Outros profissionais de saúde
- Academias, clubes

### Diferenciação
- Especialização
- Atendimento humanizado
- Tecnologia/equipamentos
- Resultados documentados

## Gestão do Consultório

### Prontuário eletrônico
- Obrigatório documentar atendimentos
- Sistemas especializados para fisioterapia
- LGPD compliance

### Agenda
- Sistema de agendamento
- Confirmação de consultas
- Gestão de faltas

### Financeiro
- Controle de receitas e despesas
- Fluxo de caixa
- Impostos em dia

## Dicas de Sucesso

1. **Comece enxuto**: cresça conforme demanda
2. **Invista em você**: cursos, especializações
3. **Atendimento excepcional**: o boca a boca é poderoso
4. **Documente resultados**: prova do seu trabalho
5. **Mantenha-se atualizado**: evidência científica

## Erros Comuns

- Subestimar custos iniciais
- Não planejar capital de giro
- Ignorar marketing
- Preços muito baixos
- Não documentar atendimentos

---

**Gerencie seu consultório** com o RehabRoad: prontuário eletrônico, agendamento e relatórios profissionais em um só lugar.
    `,
    author: "Equipe RehabRoad",
    authorRole: "Conteúdo Clínico",
    publishedAt: "2024-11-15",
    readTime: 12,
    category: "Gestão Clínica",
    tags: ["consultório", "empreendedorismo", "gestão", "abrir clínica"],
    metaDescription: "Como abrir um consultório de fisioterapia: documentação necessária, custos, equipamentos, marketing e dicas para ter sucesso."
  }
];

export const blogCategories = [
  "Todos",
  "Gestão Clínica",
  "Legislação",
  "Eletroterapia",
  "Avaliação Clínica",
  "Tratamento",
  "Técnicas Manuais",
  "Especialidades"
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "Todos") return blogPosts;
  return blogPosts.filter(post => post.category === category);
}
