import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight, Check, ChevronDown, Star,
  Mic, MessageSquare, Home as HomeIcon, BarChart3, Zap, Map,
  Clock, Building2, GraduationCap, UserCheck, AlertTriangle, Database, X,
} from "lucide-react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  { icon: Clock, title: "Documentação manual consome horas por semana", desc: "Fichas de papel, planilhas e anotações dispersas drenam tempo que deveria ser dedicado aos pacientes." },
  { icon: AlertTriangle, title: "Insegurança nos parâmetros de eletroterapia", desc: "Frequência, intensidade, tempo de aplicação — decisões críticas tomadas de memória ou em apostilas desatualizadas." },
  { icon: HomeIcon, title: "Tratamento só acontece na clínica", desc: "Sem acompanhamento entre sessões, o progresso depende de que o paciente lembre o que fazer em casa." },
  { icon: Database, title: "Decisões clínicas sem dados organizados", desc: "Avaliações antigas, evoluções soltas e sem contexto cruzado tornam o raciocínio clínico mais difícil." },
];

const FEATURES_TOP = [
  {
    emoji: "🤖", title: "Rehab Friend",
    gradient: "bg-gradient-to-br from-violet-600 to-purple-700",
    textMuted: "text-violet-100",
    desc: "Chat com IA que acessa o prontuário completo do seu paciente antes de responder. Não é um chatbot genérico.",
    bullets: ["Analisa quadro clínico completo", "Interpreta laudos por foto", "15 mensagens/dia incluídas"],
    preview: null,
  },
  {
    emoji: "🎙️", title: "Scribe Clínico",
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-600",
    textMuted: "text-teal-100",
    desc: "Termine a sessão, fale 1 minuto. Evolução completa gerada automaticamente.",
    bullets: [],
    preview: { label: "Evolução gerada em 47s:", value: "Dor: 4/10 · TENS cervical · Resposta positiva" },
  },
  {
    emoji: "🏠", title: "Plano Domiciliar",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    textMuted: "text-orange-100",
    desc: "Prescreva exercícios para casa. Paciente registra via link. Você vê adesão em tempo real.",
    bullets: [],
    tags: ["🟢 87% adesão", "3 exercícios ativos"],
  },
];

const FEATURES_BOTTOM = [
  { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50", title: "Dashboard de Progresso", desc: "Gráfico de evolução da dor sessão a sessão. Métricas objetivas de melhora do paciente." },
  { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", title: "NeuroFlux IA", desc: "Parâmetros de eletroterapia sugeridos automaticamente com base no quadro clínico do paciente." },
  { icon: Map, color: "text-rose-600", bg: "bg-rose-50", title: "Caminho Clínico", desc: "Organize o raciocínio clínico em etapas estruturadas. Hipóteses, condutas e objetivos em um fluxo único." },
];

const STEPS = [
  { n: "01", title: "Cadastro", desc: "Paciente em 30 segundos" },
  { n: "02", title: "Avaliação", desc: "Anamnese + testes estruturados" },
  { n: "03", title: "Apoio Clínico", desc: "Hipóteses + condutas via IA" },
  { n: "04", title: "Scribe", desc: "Dite a evolução, sistema preenche" },
  { n: "05", title: "HEP", desc: "Prescreve em casa, acompanha adesão" },
];

const COMPARE = [
  { label: "Hipótese diagnóstica", rehab: "Automática" },
  { label: "Parâmetros eletroterapia", rehab: "Baseados em evidência" },
  { label: "Evolução automática", rehab: "Scribe clínico" },
  { label: "Acompanhamento domiciliar", rehab: "Portal HEP" },
  { label: "Assistente IA", rehab: "Rehab Friend" },
  { label: "Progresso visual", rehab: "Dashboard por sessão" },
  { label: "Exportação PDF", rehab: "1 clique" },
];

const TESTIMONIALS = [
  {
    color: "border-teal-500", initials: "CT", bg: "bg-teal-100", text_c: "text-teal-600",
    quote: "O Apoio Clínico me ajudou a estruturar o raciocínio diagnóstico sem aquela insegurança de estar esquecendo algo importante.",
    name: "Dra. Camila Torres", role: "Ortopédica · São Paulo, SP", crefito: "CREFITO-3/284521-F",
  },
  {
    color: "border-violet-500", initials: "RM", bg: "bg-violet-100", text_c: "text-violet-600",
    quote: "O NeuroFlux organizou meus protocolos de eletroterapia. Agora defino parâmetros em segundos, não minutos.",
    name: "Dr. Rafael Mendes", role: "Esportivo · Belo Horizonte, MG", crefito: "CREFITO-4/187342-F",
  },
  {
    color: "border-orange-500", initials: "FL", bg: "bg-orange-100", text_c: "text-orange-600",
    quote: "Trabalho com pacientes neurológicos e cada protocolo vem com fundamentação fisiológica clara.",
    name: "Dra. Fernanda Leal", role: "Neurológica · Porto Alegre, RS", crefito: "CREFITO-5/156789-F",
  },
];

const FOR_WHOM = [
  { icon: GraduationCap, title: "Recém-formados", desc: "Mais segurança clínica desde o primeiro atendimento com apoio estruturado." },
  { icon: Building2, title: "Clínicas", desc: "Organização, documentação e time trabalhando em total sincronia." },
  { icon: Zap, title: "Eletroterapeutas", desc: "Parâmetros baseados em evidência para cada quadro clínico do paciente." },
  { icon: UserCheck, title: "Docentes e supervisores", desc: "Raciocínio clínico estruturado para ensino e supervisão acadêmica." },
];

const PLANS = [
  {
    name: "Mensal", price: "R$ 97", period: "/mês", popular: false,
    detail: "Flexibilidade total", sub: null,
    perks: ["Acesso completo", "Rehab Friend incluído", "Scribe Clínico incluído", "Suporte prioritário"],
  },
  {
    name: "Semestral", price: "R$ 77", period: "/mês", popular: true,
    detail: "R$ 462 cobrado a cada 6 meses", sub: "Equivale a 2 meses grátis",
    perks: ["Tudo do mensal", "Economia garantida", "Prioridade em novidades"],
  },
  {
    name: "Anual", price: "R$ 67", period: "/mês", popular: false,
    detail: "R$ 804 cobrado anualmente", sub: "Equivale a 4 meses grátis",
    perks: ["Melhor custo-benefício", "Acesso vitalício às atualizações", "Suporte VIP"],
  },
];

const FAQS = [
  { q: "O que é prontuário eletrônico para fisioterapia?", a: "O prontuário eletrônico para fisioterapia é um sistema digital que substitui fichas de papel e planilhas. Permite registrar avaliações, evoluções diárias, gerar laudos em PDF e acompanhar o progresso do paciente de forma organizada e segura, em conformidade com as normas do COFFITO e LGPD." },
  { q: "Preciso de cartão de crédito para testar?", a: "Não. Os 30 dias de teste são completamente gratuitos e não exigimos cartão de crédito. Você só adiciona forma de pagamento se decidir continuar após o período de teste." },
  { q: "O que é o Rehab Friend?", a: "O Rehab Friend é um assistente clínico com IA que acessa o prontuário, avaliações e histórico de evoluções do seu paciente antes de responder. Diferente de um chatbot genérico, ele conhece o quadro clínico específico e pode também interpretar laudos e imagens enviados por foto." },
  { q: "O Scribe funciona em qual idioma?", a: "O Scribe Clínico usa o modelo Whisper AI e funciona nativamente em português brasileiro. Basta falar o resumo da sessão — procedimentos, resposta do paciente e observações — e o sistema preenche automaticamente os campos da evolução." },
  { q: "Como funciona o plano domiciliar (HEP)?", a: "Você prescreve os exercícios para casa dentro do prontuário do paciente. O sistema gera um link exclusivo sem necessidade de login. O paciente acessa, registra a realização dos exercícios e você acompanha a adesão em tempo real no dashboard." },
  { q: "Quantas mensagens tenho no Rehab Friend por dia?", a: "O plano inclui 15 mensagens por dia no Rehab Friend, suficientes para análises clínicas, interpretação de laudos e dúvidas do seu dia a dia. O contador reinicia à meia-noite." },
  { q: "Meus dados de pacientes ficam seguros?", a: "Sim. Utilizamos criptografia SSL 256-bit, seguimos as normas da LGPD e todos os dados são armazenados em servidores seguros. Você é o único que tem acesso às informações dos seus pacientes." },
  { q: "Como funciona o NeuroFlux (módulo de eletroterapia)?", a: "Você informa a condição clínica (ex: lombalgia, tendinite, bursite) e o NeuroFlux sugere parâmetros baseados em evidências para TENS, Ultrassom, Laser e outras modalidades, incluindo contraindicações e fundamentação científica." },
  { q: "O prontuário eletrônico é válido juridicamente?", a: "Sim. O prontuário eletrônico tem validade jurídica conforme a Lei 8.856/94 e Resolução COFFITO nº 414. O REHABROAD segue todas as normas de registro, guarda e sigilo, além de estar em conformidade com a LGPD." },
  { q: "Qual a diferença entre o Rehabroad e uma planilha Excel?", a: "Planilhas não são seguras, não geram laudos profissionais, não têm apoio clínico com IA, não rastreiam alterações e não têm conformidade legal. O Rehabroad entrega tudo isso mais Rehab Friend, Scribe, HEP, NeuroFlux e Dashboard de Progresso — em um único sistema." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">

      {/* ── SEÇÃO 1: NAV ─────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">REHABROAD</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#demo" className="hover:text-gray-900 transition-colors">Demo</a>
            <a href="#planos" className="hover:text-gray-900 transition-colors">Planos</a>
            <Link to="/login" className="hover:text-gray-900 transition-colors">Entrar</Link>
          </nav>

          <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors">
            Testar 30 dias grátis →
          </Link>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-medium">
            <a href="#demo" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600">Demo</a>
            <a href="#planos" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600">Planos</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600">Entrar</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-5 py-3 rounded-xl bg-teal-500 text-white font-semibold">
              Testar 30 dias grátis →
            </Link>
          </div>
        )}
      </header>

      {/* ── SEÇÃO 2: HERO ────────────────────────────────────────── */}
      <section id="demo" className="pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna esquerda */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Novo: Rehab Friend + Scribe Clínico — IA que conhece seus pacientes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              O copiloto clínico completo
              <br />
              <span className="text-teal-500">da fisioterapia</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed">
              Do prontuário ao acompanhamento domiciliar —
              com IA que conhece cada paciente de verdade.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg shadow-teal-500/30 transition-all hover:scale-105">
                Testar 30 dias grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#planos" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 rounded-xl px-8 py-4 text-lg font-medium hover:border-gray-300 transition-colors">
                Ver demonstração
              </a>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> LGPD e COFFITO compliant</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> Cancele quando quiser</span>
            </div>
          </div>

          {/* Coluna direita — browser mockup */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-3 flex-1 bg-white rounded-md h-5 max-w-xs text-xs text-gray-400 flex items-center px-2">app.rehabroad.com.br</div>
              </div>
              <img src="/imagem1.png" alt="Dashboard Rehabroad" className="w-full" />
            </div>

            {/* Badge inferior esquerdo */}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-lg">✓</div>
              <div>
                <p className="text-xs text-gray-500">Evolução gerada</p>
                <p className="text-sm font-semibold text-gray-900">em 47 segundos</p>
              </div>
            </div>

            {/* Badge superior direito */}
            <div className="absolute top-14 right-4 bg-white rounded-xl shadow-lg px-4 py-3">
              <p className="text-xs text-gray-500">Dor do paciente</p>
              <p className="text-2xl font-bold text-green-600">-60%</p>
              <p className="text-xs text-gray-400">nas últimas 8 sessões</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: NÚMEROS ─────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-teal-600">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white mb-4">
            {[
              { value: "+500", label: "fisioterapeutas" },
              { value: "+12.000", label: "laudos gerados" },
              { value: "+8.000", label: "avaliações clínicas" },
              { value: "4.9/5", label: "satisfação" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-black">{s.value}</p>
                <p className="text-teal-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-teal-200 text-sm">Utilizado por fisioterapeutas em clínicas, consultórios e universidades</p>
        </div>
      </section>

      {/* ── SEÇÃO 4: PROBLEMA ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12 leading-tight">
            A maioria dos fisioterapeutas ainda perde tempo
            <br className="hidden sm:block" /> com o que não deveria
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {PROBLEMS.map(p => (
              <div key={p.title} className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500 mb-4">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="inline-block text-teal-700 font-medium bg-teal-50 border border-teal-200 rounded-xl p-4 max-w-2xl text-sm leading-relaxed">
              O Rehabroad foi criado para resolver exatamente esses problemas —
              sem substituir o julgamento clínico do fisioterapeuta.
            </p>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 5: FEATURES ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12 leading-tight">
            Tudo que você precisa, em um sistema
            <br className="hidden sm:block" /> que pensa junto com você
          </h2>

          {/* Linha 1 — 3 cards gradiente */}
          <div className="grid sm:grid-cols-3 gap-5 mb-5">
            {FEATURES_TOP.map(f => (
              <div key={f.title} className={`${f.gradient} rounded-2xl p-8 text-white`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">{f.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className={`${f.textMuted} text-sm mb-4 leading-relaxed`}>{f.desc}</p>
                {f.bullets.length > 0 && (
                  <div className="space-y-2">
                    {f.bullets.map(b => (
                      <div key={b} className={`flex items-center gap-2 text-sm ${f.textMuted}`}>
                        <span className="text-white font-bold">✓</span> {b}
                      </div>
                    ))}
                  </div>
                )}
                {f.preview && (
                  <div className="bg-white/10 rounded-xl p-3 text-sm">
                    <p className="text-white/70 text-xs mb-1">{f.preview.label}</p>
                    <p className="text-white">{f.preview.value}</p>
                  </div>
                )}
                {"tags" in f && f.tags && (
                  <div className="flex gap-2 flex-wrap">
                    {f.tags.map((tag: string) => (
                      <div key={tag} className="bg-white/20 rounded-lg px-3 py-1 text-xs">{tag}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Linha 2 — 3 cards cinza */}
          <div className="grid sm:grid-cols-3 gap-5">
            {FEATURES_BOTTOM.map(f => (
              <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4 text-sm">
              + Prontuário completo · Agenda · Financeiro · Testes clínicos · Exportação PDF · Comunidade
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg shadow-teal-500/30 transition-all hover:scale-105">
              Ver tudo na prática — 30 dias grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 6: COMO FUNCIONA ───────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12 leading-tight">
            Do primeiro atendimento ao acompanhamento
            <br className="hidden sm:block" /> — tudo conectado
          </h2>

          <div className="grid sm:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-teal-500 text-white text-sm font-black flex items-center justify-center mx-auto mb-3">{s.n}</div>
                  <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/login" className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-8 py-4 font-semibold hover:bg-gray-800 transition-colors">
              Começar agora — é grátis por 30 dias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 7: REHAB FRIEND ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-violet-50 to-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wide">
              Exclusivo Rehabroad
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Conheça o Rehab Friend
            </h2>
            <h3 className="text-xl font-semibold text-violet-600 leading-snug">
              O primeiro assistente clínico que conhece seus pacientes
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Diferente de um chatbot genérico, o Rehab Friend acessa
              o prontuário, avaliações e histórico de evoluções do seu
              paciente antes de responder.
            </p>
            <ul className="space-y-3">
              {["Analisa o quadro clínico completo antes de responder", "Interpreta laudos e imagens por foto", "15 mensagens por dia incluídas no plano"].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
              Experimentar agora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Chat mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-sm mx-auto w-full">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Rehab Friend</p>
                <p className="text-xs text-gray-400">Paciente: Maria Silva</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
            </div>

            <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
              Analisando o prontuário de Maria Silva... lombalgia crônica, dor atual 4/10, 8 sessões registradas,{" "}
              <strong className="text-gray-900">tendência de melhora ↓60%</strong>.
            </div>

            <div className="mt-2 bg-violet-600 text-white rounded-xl p-3 text-sm ml-8 leading-relaxed">
              Qual conduta para progressão desta semana?
            </div>

            <div className="mt-2 bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
              Com base na evolução positiva, recomendo progredir para{" "}
              <strong className="text-gray-900">exercícios de estabilização ativa</strong>. Considere introduzir...
            </div>

            <div className="mt-3 flex items-center gap-2 border border-gray-200 rounded-xl p-2">
              <input
                readOnly
                placeholder="Pergunte sobre o caso..."
                className="flex-1 text-sm outline-none bg-transparent text-gray-400 placeholder:text-gray-300"
              />
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 8: SCRIBE ──────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup Scribe */}
          <div className="order-last lg:order-first bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <p className="text-red-500 font-medium text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Gravando... 01:23 / 3:00
              </p>
              <svg className="w-48 h-8" viewBox="0 0 192 32">
                {[4,8,16,12,20,24,16,8,12,20,16,24,12,8,16,20,8,12,16,24].map((h, i) => (
                  <rect key={i} x={i * 10} y={(32 - h) / 2} width="6" height={h} fill="#10B981" rx="3" opacity="0.7" />
                ))}
              </svg>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Evolução preenchida automaticamente
              </p>
              {[
                { label: "Dor", value: "5/10", icon: "❤️" },
                { label: "Procedimentos", value: "TENS + mobilização", icon: "⚡" },
                { label: "Resposta", value: "Positiva", icon: "✓" },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">{f.label}</span>
                  <span className="text-sm font-medium text-gray-900">{f.icon} {f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Termine a sessão.
              <br />
              <span className="text-teal-500">Fale 1 minuto.</span>
              <br />
              Evolução pronta.
            </h2>
            <p className="text-gray-500 leading-relaxed">
              O Scribe transcreve seu relato verbal e preenche automaticamente
              todos os campos da evolução clínica.
            </p>
            <ul className="space-y-3">
              {["Transcrição em português com Whisper AI", "Extrai dor, procedimentos, resposta do paciente e observações", "Você revisa e salva em 1 clique"].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
              Experimentar grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 9: APOIO CLÍNICO ───────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wide">
              Motor Clínico Inteligente
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              IA que cruza todos os dados
              <br className="hidden sm:block" /> do seu paciente
            </h2>
            <p className="text-gray-500 leading-relaxed">
              O Apoio Clínico analisa avaliação, histórico de evoluções e resposta ao
              tratamento antes de sugerir qualquer conduta.
            </p>
            <ul className="space-y-3">
              {[
                "Hipóteses diagnósticas com nível de confiança",
                "Exercícios filtrados pelo quadro clínico",
                "Parâmetros de eletroterapia baseados em evidência",
                "Próximos passos priorizados por urgência",
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
              Ver na prática <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="/imagem2.png" alt="Apoio Clínico Rehabroad" className="w-full" />
            <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
              ✓ Baseado em evidência científica
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 10: COMPARATIVO ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12 leading-tight">
            Por que clínicas estão abandonando planilhas
          </h2>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Recurso</span>
              <span className="text-center">Planilha / Papel</span>
              <span className="text-center text-teal-600">Rehabroad</span>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 px-6 py-4 text-sm items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"} border-t border-gray-100`}>
                <span className="text-gray-700 font-medium">{row.label}</span>
                <div className="flex justify-center">
                  <X className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-teal-700 font-medium text-xs">{row.rehab}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/login" className="inline-flex items-center gap-2 bg-teal-500 text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all hover:scale-105">
              Quero sair das planilhas agora <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-400 mt-3">30 dias grátis · Sem cartão de crédito</p>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 11: DEPOIMENTOS ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-2 leading-tight">
            O que dizem os fisioterapeutas
          </h2>
          <p className="text-center text-gray-500 mb-10">+500 profissionais já usam o Rehabroad</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={`border-l-4 ${t.color} bg-gray-50 rounded-r-2xl p-6 space-y-4`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <div className={`w-10 h-10 ${t.bg} rounded-full flex items-center justify-center ${t.text_c} font-bold text-sm shrink-0`}>{t.initials}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                    <p className={`text-xs ${t.text_c}`}>{t.crefito}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/login" className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-8 py-4 font-semibold hover:bg-gray-800 transition-colors">
              Juntar-me a +500 fisioterapeutas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 12: PARA QUEM É ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12">
            Para quem é o Rehabroad
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FOR_WHOM.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:border-teal-300 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 13: PLANOS ─────────────────────────────────────── */}
      <section id="planos" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-2">
            Planos simples e transparentes
          </h2>
          <p className="text-center text-gray-500 mb-10">30 dias grátis para testar. Sem cartão de crédito.</p>

          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-7 flex flex-col gap-5 transition-all ${
                  plan.popular
                    ? "bg-teal-500 text-white border-teal-500 shadow-xl shadow-teal-500/30 scale-105"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-black uppercase tracking-wide">
                      Mais popular
                    </span>
                  </div>
                )}

                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${plan.popular ? "text-teal-100" : "text-gray-500"}`}>{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                    <span className={`text-sm mb-1 ${plan.popular ? "text-teal-100" : "text-gray-400"}`}>{plan.period}</span>
                  </div>
                  <p className={`text-xs mt-1 ${plan.popular ? "text-teal-100" : "text-gray-400"}`}>{plan.detail}</p>
                  {plan.sub && <p className={`text-xs font-semibold mt-0.5 ${plan.popular ? "text-white" : "text-teal-600"}`}>{plan.sub}</p>}
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.perks.map(perk => (
                    <li key={perk} className={`flex items-start gap-2 text-sm ${plan.popular ? "text-teal-50" : "text-gray-600"}`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? "text-white" : "text-teal-500"}`} />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`block text-center px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.popular
                      ? "bg-white text-teal-600 hover:bg-teal-50"
                      : "border border-gray-200 text-gray-700 hover:border-teal-400 hover:text-teal-600"
                  }`}
                >
                  Começar grátis
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            💳 Sem cartão de crédito nos primeiros 30 dias · 🔒 Cancele quando quiser · 📞 Suporte em português
          </p>
        </div>
      </section>

      {/* ── SEÇÃO 14: FAQ ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-10">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 15: CTA FINAL ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Comece hoje.
            <br />
            Seu primeiro paciente em 5 minutos.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Junte-se a +500 fisioterapeutas que já organizam
            <br className="hidden sm:block" /> seu raciocínio clínico com o Rehabroad.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl px-10 py-5 text-xl font-bold shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all"
          >
            Criar conta grátis — 30 dias sem cartão <ArrowRight className="w-6 h-6" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Setup em 2 minutos</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Suporte em português</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 16: FOOTER ─────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-sm font-black text-white">REHABROAD</span>
            <span className="text-xs text-gray-600 ml-2 hidden sm:block">O copiloto clínico da fisioterapia</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
            <Link to="/termos-de-uso" className="hover:text-gray-300 transition-colors">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="hover:text-gray-300 transition-colors">Privacidade</Link>
            <Link to="/politica-de-cancelamento" className="hover:text-gray-300 transition-colors">Cancelamento</Link>
          </div>
          <p className="text-xs text-gray-600">© 2026 Rehabroad. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
