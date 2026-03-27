import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight, Check, ChevronDown, Star,
  Mic, MessageSquare, Home as HomeIcon, BarChart3, Zap, Map,
  Clock, Building2, GraduationCap,
  UserCheck, AlertTriangle, ClipboardList, Smartphone, X,
} from "lucide-react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "+500", label: "fisioterapeutas" },
  { value: "+12.000", label: "laudos gerados" },
  { value: "+8.000", label: "avaliações" },
  { value: "4.9/5", label: "satisfação" },
];

const PROBLEMS = [
  {
    icon: Clock,
    title: "Documentação manual consome horas por semana",
    desc: "Fichas de papel, planilhas e anotações dispersas drenam tempo que deveria ser dedicado aos pacientes.",
  },
  {
    icon: AlertTriangle,
    title: "Insegurança nos parâmetros de eletroterapia",
    desc: "Frequência, intensidade, tempo de aplicação — decisões críticas tomadas de memória ou em apostilas desatualizadas.",
  },
  {
    icon: Smartphone,
    title: "Tratamento só acontece na clínica",
    desc: "Sem acompanhamento entre sessões, o progresso depende de que o paciente lembre o que fazer em casa.",
  },
  {
    icon: ClipboardList,
    title: "Decisões clínicas sem dados organizados",
    desc: "Avaliações antigas, evoluções soltas e sem contexto cruzado tornam o raciocínio clínico mais difícil.",
  },
];

const FEATURES = [
  {
    icon: MessageSquare,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Rehab Friend",
    desc: "Chat com IA que conhece o quadro clínico do seu paciente. Analisa dados, responde dúvidas e interpreta laudos.",
  },
  {
    icon: Mic,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    title: "Scribe Clínico",
    desc: "Dite o resumo da sessão em 1 minuto. O sistema gera a evolução completa automaticamente.",
  },
  {
    icon: HomeIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Plano Domiciliar (HEP)",
    desc: "Prescreva exercícios para casa. O paciente registra via link. Você acompanha a adesão em tempo real.",
  },
  {
    icon: BarChart3,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Dashboard de Progresso",
    desc: "Gráfico de evolução da dor sessão a sessão. Métricas objetivas de melhora do paciente.",
  },
  {
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "NeuroFlux IA",
    desc: "Parâmetros de eletroterapia sugeridos automaticamente com base no quadro clínico do paciente.",
  },
  {
    icon: Map,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    title: "Caminho Clínico",
    desc: "Organize o raciocínio clínico em etapas estruturadas. Hipóteses, condutas e objetivos em um fluxo único.",
  },
];

const STEPS = [
  { n: "01", title: "Cadastro", desc: "Paciente em 30 segundos" },
  { n: "02", title: "Avaliação", desc: "Anamnese + testes estruturados" },
  { n: "03", title: "Apoio Clínico", desc: "Hipóteses + condutas via IA" },
  { n: "04", title: "Scribe", desc: "Dite a evolução, sistema preenche" },
  { n: "05", title: "HEP", desc: "Prescreve em casa, acompanha adesão" },
];

const COMPARE_ROWS = [
  { label: "Hipótese diagnóstica", paper: false, rehab: "Automática" },
  { label: "Parâmetros eletroterapia", paper: false, rehab: "Baseados em evidência" },
  { label: "Evolução automática", paper: false, rehab: "Scribe clínico" },
  { label: "Acompanhamento domiciliar", paper: false, rehab: "Portal HEP" },
  { label: "Assistente IA", paper: false, rehab: "Rehab Friend" },
  { label: "Progresso visual", paper: false, rehab: "Dashboard por sessão" },
  { label: "Exportação PDF", paper: false, rehab: "1 clique" },
];

const TESTIMONIALS = [
  {
    name: "Dra. Camila Torres",
    role: "Ortopédica — São Paulo, SP",
    crefito: "CREFITO-3/284521-F",
    text: "O Apoio Clínico me ajudou a estruturar o raciocínio diagnóstico sem aquela insegurança de estar esquecendo algo importante.",
  },
  {
    name: "Dr. Rafael Mendes",
    role: "Esportivo — Belo Horizonte, MG",
    crefito: "CREFITO-4/187342-F",
    text: "O NeuroFlux organizou meus protocolos de eletroterapia. Agora defino parâmetros em segundos, não minutos.",
  },
  {
    name: "Dra. Fernanda Leal",
    role: "Neurológica — Porto Alegre, RS",
    crefito: "CREFITO-5/156789-F",
    text: "Trabalho com pacientes neurológicos e cada protocolo vem com fundamentação fisiológica clara.",
  },
];

const FOR_WHOM = [
  {
    icon: GraduationCap,
    title: "Recém-formados",
    desc: "Mais segurança clínica desde o primeiro atendimento.",
  },
  {
    icon: Building2,
    title: "Clínicas",
    desc: "Organização, documentação e time trabalhando em sincronia.",
  },
  {
    icon: Zap,
    title: "Eletroterapeutas",
    desc: "Parâmetros baseados em evidência para cada quadro clínico.",
  },
  {
    icon: UserCheck,
    title: "Docentes e supervisores",
    desc: "Raciocínio clínico estruturado para ensino e supervisão.",
  },
];

const PLANS = [
  {
    name: "Mensal",
    price: "R$ 97",
    period: "/mês",
    detail: "Flexibilidade total",
    sub: null,
    popular: false,
    perks: [
      "Acesso completo",
      "Rehab Friend incluído",
      "Scribe Clínico incluído",
      "Suporte prioritário",
    ],
  },
  {
    name: "Semestral",
    price: "R$ 77",
    period: "/mês",
    detail: "R$ 462 cobrado a cada 6 meses",
    sub: "Equivale a 2 meses grátis",
    popular: true,
    perks: [
      "Tudo do mensal",
      "Economia garantida",
      "Prioridade em novidades",
    ],
  },
  {
    name: "Anual",
    price: "R$ 67",
    period: "/mês",
    detail: "R$ 804 cobrado anualmente",
    sub: "Equivale a 4 meses grátis",
    popular: false,
    perks: [
      "Melhor custo-benefício",
      "Acesso vitalício às atualizações",
      "Suporte VIP",
    ],
  },
];

const FAQS = [
  {
    q: "O que é prontuário eletrônico para fisioterapia?",
    a: "O prontuário eletrônico para fisioterapia é um sistema digital que substitui fichas de papel e planilhas. Permite registrar avaliações, evoluções diárias, gerar laudos em PDF e acompanhar o progresso do paciente de forma organizada e segura, em conformidade com as normas do COFFITO e LGPD.",
  },
  {
    q: "Preciso de cartão de crédito para testar?",
    a: "Não. Os 7 dias de teste são completamente gratuitos e não exigimos cartão de crédito. Você só adiciona forma de pagamento se decidir continuar após o período de teste.",
  },
  {
    q: "Meus dados de pacientes ficam seguros?",
    a: "Sim. Utilizamos criptografia SSL 256-bit, seguimos as normas da LGPD e todos os dados são armazenados em servidores seguros. Você é o único que tem acesso às informações dos seus pacientes.",
  },
  {
    q: "O que é o Rehab Friend?",
    a: "O Rehab Friend é um assistente clínico com IA que acessa o prontuário, avaliações e histórico de evoluções do seu paciente antes de responder. Diferente de um chatbot genérico, ele conhece o quadro clínico específico e pode também interpretar laudos e imagens enviados por foto.",
  },
  {
    q: "O Scribe funciona em qual idioma?",
    a: "O Scribe Clínico usa o modelo Whisper AI e funciona nativamente em português brasileiro. Basta falar o resumo da sessão — procedimentos, resposta do paciente e observações — e o sistema preenche automaticamente os campos da evolução.",
  },
  {
    q: "Como funciona o plano domiciliar (HEP)?",
    a: "Você prescreve os exercícios para casa dentro do prontuário do paciente. O sistema gera um link exclusivo sem necessidade de login. O paciente acessa, registra a realização dos exercícios e você acompanha a adesão em tempo real no dashboard.",
  },
  {
    q: "Quantas mensagens tenho no Rehab Friend por dia?",
    a: "O plano inclui 15 mensagens por dia no Rehab Friend, suficientes para análises clínicas, interpretação de laudos e dúvidas do seu dia a dia. O contador reinicia à meia-noite.",
  },
  {
    q: "Como funciona o NeuroFlux (módulo de eletroterapia)?",
    a: "Você informa a condição clínica (ex: lombalgia, tendinite, bursite) e o NeuroFlux sugere parâmetros baseados em evidências para TENS, Ultrassom Terapêutico, Laser, Corrente Russa e outras modalidades, incluindo contraindicações e fundamentação científica.",
  },
  {
    q: "O prontuário eletrônico é válido juridicamente?",
    a: "Sim. O prontuário eletrônico tem validade jurídica conforme a Lei 8.856/94 e Resolução COFFITO nº 414. O REHABROAD segue todas as normas de registro, guarda e sigilo de documentos, além de estar em conformidade com a LGPD.",
  },
  {
    q: "Qual a diferença entre o Rehabroad e uma planilha Excel?",
    a: "Planilhas não são seguras, não geram laudos profissionais, não têm apoio clínico com IA, não rastreiam alterações e não têm conformidade legal. O Rehabroad oferece tudo isso mais Rehab Friend, Scribe, HEP, NeuroFlux e Dashboard de Progresso — em um único sistema.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">

      {/* ── SEÇÃO 1: NAV ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-sm border-b border-gray-100" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900">REHABROAD</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#demo" className="hover:text-gray-900 transition-colors">Demo</a>
            <a href="#planos" className="hover:text-gray-900 transition-colors">Planos</a>
            <Link to="/login" className="hover:text-gray-900 transition-colors">Entrar</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
            >
              Testar 7 dias grátis →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-medium text-gray-700">
            <a href="#demo" onClick={() => setMenuOpen(false)} className="block py-2">Demo</a>
            <a href="#planos" onClick={() => setMenuOpen(false)} className="block py-2">Planos</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2">Entrar</Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-5 py-3 rounded-xl bg-teal-500 text-white font-semibold"
            >
              Testar 7 dias grátis →
            </Link>
          </div>
        )}
      </header>

      {/* ── SEÇÃO 2: HERO ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Novo: Rehab Friend + Scribe Clínico
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            O copiloto clínico completo
            <br />
            <span className="text-teal-500">da fisioterapia</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Do prontuário ao acompanhamento domiciliar —
            com IA que conhece cada paciente de verdade.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              Testar 7 dias grátis <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 font-semibold text-base transition-colors text-center"
            >
              Ver demonstração
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> Sem cartão de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> LGPD e COFFITO compliant</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-500" /> Cancele quando quiser</span>
          </div>

          {/* Dashboard mockup placeholder */}
          <div id="demo" className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 bg-white">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded-md bg-gray-100 h-5 max-w-xs" />
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Pacientes", "Avaliações", "Evoluções", "Alertas"].map((label) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 mb-2" />
                  <div className="h-6 w-12 bg-gray-100 rounded mb-1" />
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Rehab Friend", "Scribe Clínico", "NeuroFlux"].map((f) => (
                <div key={f} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-50 rounded mb-1" />
                  <div className="h-3 w-3/4 bg-gray-50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: NÚMEROS ── */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-black text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: PROBLEMA ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              A maioria dos fisioterapeutas ainda perde tempo
              <br className="hidden sm:block" /> com o que não deveria
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 5: SOLUÇÃO / FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
              Tudo que você precisa, em um sistema
              <br className="hidden sm:block" /> que pensa junto com você
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className={`bg-white rounded-2xl border ${f.border} shadow-sm p-6 hover:shadow-md transition-shadow duration-200`}>
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 6: COMO FUNCIONA ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Do primeiro atendimento ao acompanhamento
              <br className="hidden sm:block" /> — tudo conectado
            </h2>
          </div>
          <div className="grid sm:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-teal-500 text-white text-sm font-black flex items-center justify-center mx-auto mb-3">
                    {s.n}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 7: REHAB FRIEND ── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-violet-50 via-white to-violet-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wide">
                Exclusivo Rehabroad
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Conheça o Rehab Friend
                <br />
                <span className="text-violet-600">O primeiro assistente clínico
                <br />que conhece seus pacientes</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Diferente de um chatbot genérico, o Rehab Friend acessa
                o prontuário, avaliações e histórico de evoluções do seu
                paciente antes de responder.
              </p>
              <ul className="space-y-3">
                {[
                  "Analisa o quadro clínico completo antes de responder",
                  "Interpreta laudos e imagens por foto",
                  "15 mensagens por dia incluídas no plano",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors"
              >
                Experimentar agora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Chat mockup */}
            <div className="bg-white rounded-2xl border border-violet-100 shadow-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-violet-600">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rehab Friend</p>
                  <p className="text-xs text-violet-200">Paciente: Maria Silva</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-gray-50 rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Analisando o prontuário de Maria Silva... Avaliação de 12/03, lombalgia crônica com irradiação L5-S1 esquerda, dor atual 4/10, 8 sessões registradas.
                  </p>
                </div>
                <div className="bg-violet-600 rounded-xl rounded-tr-sm p-3 max-w-[85%] ml-auto">
                  <p className="text-xs text-white leading-relaxed">
                    Qual sua conduta para a progressão desta semana?
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Com base na evolução positiva (dor reduziu de 7 para 4), recomendo progredir para exercícios de estabilização ativa. Considere introduzir...
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-lg h-8 border border-gray-100" />
                  <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 8: SCRIBE CLÍNICO ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Scribe mockup */}
            <div className="order-last lg:order-first bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-5 space-y-4">
                {/* Record button */}
                <div className="flex flex-col items-center py-6 gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-sm font-semibold text-red-600">Gravando... 01:23 / 3:00</p>
                  </div>
                  <div className="flex items-center gap-1 h-8">
                    {[10, 20, 14, 28, 18, 24, 12, 22, 16, 26, 20, 8].map((h, i) => (
                      <div key={i} className="w-1.5 bg-red-400 rounded-full opacity-80" style={{ height: h }} />
                    ))}
                  </div>
                </div>
                {/* Auto-filled form */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Evolução preenchida automaticamente
                  </p>
                  {[
                    { label: "Dor", value: "5/10 🎙️" },
                    { label: "Procedimentos", value: "TENS + mobilização 🎙️" },
                    { label: "Resposta", value: "Positiva 🎙️" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between bg-teal-50 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-500">{f.label}</span>
                      <span className="text-xs font-semibold text-teal-700">{f.value}</span>
                    </div>
                  ))}
                </div>
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
                O Scribe transcreve seu relato verbal e preenche
                automaticamente todos os campos da evolução clínica.
              </p>
              <ul className="space-y-3">
                {[
                  "Transcrição em português com Whisper AI",
                  "Extrai dor, procedimentos, resposta do paciente e observações",
                  "Você revisa e salva em 1 clique",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors"
              >
                Experimentar grátis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 9: COMPARATIVO ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Por que clínicas estão
              <br className="hidden sm:block" /> abandonando planilhas
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wide text-gray-500 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <span>Recurso</span>
              <span className="text-center">Planilha / Papel</span>
              <span className="text-center text-teal-600">Rehabroad</span>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 px-6 py-3.5 text-sm items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
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
        </div>
      </section>

      {/* ── SEÇÃO 10: DEPOIMENTOS ── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              O que dizem os fisioterapeutas
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
                  <p className="text-xs text-gray-400">{t.crefito}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 11: PARA QUEM É ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Para quem é o Rehabroad
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FOR_WHOM.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 text-center">
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

      {/* ── SEÇÃO 12: PLANOS ── */}
      <section id="planos" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Planos simples e transparentes
            </h2>
          </div>
          <p className="text-center text-gray-500 mb-10">
            7 dias grátis para testar. Sem cartão de crédito.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border shadow-sm p-7 relative flex flex-col gap-5 ${
                  plan.popular
                    ? "border-teal-400 shadow-teal-100 shadow-md ring-1 ring-teal-400"
                    : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-white text-xs font-bold uppercase tracking-wide">
                      Mais popular
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{plan.detail}</p>
                  {plan.sub && <p className="text-xs text-teal-600 font-medium mt-0.5">{plan.sub}</p>}
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.popular
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Começar grátis
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 13: FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
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

      {/* ── SEÇÃO 14: CTA FINAL ── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-gray-900 to-teal-900">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Comece hoje.
            <br />
            Seu primeiro paciente em 5 minutos.
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-base transition-colors"
          >
            Criar conta grátis — 7 dias sem cartão <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Setup em 2 minutos</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Suporte em português</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-400" /> Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 15: FOOTER ── */}
      <footer className="bg-gray-900 border-t border-white/5 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-white">REHABROAD</span>
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
