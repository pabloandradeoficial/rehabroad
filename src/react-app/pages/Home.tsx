import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router";
// motion only used on desktop via AnimateOnScroll
import { 
  ArrowRight, Brain, ClipboardList, FileText, LineChart, 
  Shield, Zap, Loader2, Check, ChevronRight, Play, Activity,
  AlertTriangle, Stethoscope, Target, ListChecks,
  Clock, UserCheck, GraduationCap, Building2, ChevronDown,
  Star, Users, Lock, FileCheck, HelpCircle, X,
  Download, BookOpen, UserPlus, Award, Gift
} from "lucide-react";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import MobileLanding from "@/react-app/components/MobileLanding";

// Lazy load InteractiveDemo - it's below the fold
const InteractiveDemo = lazy(() => import("@/react-app/components/InteractiveDemo").then(m => ({ default: m.InteractiveDemo })));

// Mobile detection - show ultra-light landing on mobile
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

export default function Home() {
  const navigate = useNavigate();
  useLanguage(); // Keep context active
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const [isMobile] = useState(isMobileDevice);
  const showFloatingCTA = isMobile || scrollY > 300;

  const faqs = [
    {
      question: "O que é prontuário eletrônico para fisioterapia?",
      answer: "O prontuário eletrônico para fisioterapia é um sistema digital que substitui fichas de papel e planilhas. Permite registrar avaliações, evoluções diárias, gerar laudos em PDF e acompanhar o progresso do paciente de forma organizada e segura, em conformidade com as normas do COFFITO e LGPD."
    },
    {
      question: "Como escolher o melhor software para clínica de fisioterapia?",
      answer: "Avalie se o software oferece: prontuário eletrônico completo, geração de laudos PDF, conformidade com COFFITO/LGPD, facilidade de uso, suporte técnico e preço justo. O REHABROAD oferece tudo isso, mais apoio clínico inteligente com sugestões diagnósticas e parâmetros de eletroterapia."
    },
    {
      question: "Preciso de cartão de crédito para testar?",
      answer: "Não. Os 30 dias de teste são completamente gratuitos e não exigimos cartão de crédito. Você só adiciona forma de pagamento se decidir continuar após o período de teste."
    },
    {
      question: "Meus dados de pacientes ficam seguros?",
      answer: "Sim. Utilizamos criptografia SSL 256-bit, seguimos as normas da LGPD e todos os dados são armazenados em servidores seguros. Você é o único que tem acesso às informações dos seus pacientes."
    },
    {
      question: "Como fazer laudo fisioterapêutico em PDF?",
      answer: "No REHABROAD, após registrar a avaliação do paciente, você clica em 'Exportar PDF' e o sistema gera automaticamente um laudo profissional com cabeçalho, dados do paciente, diagnóstico cinético-funcional, objetivos e plano de tratamento — pronto para imprimir ou enviar por email."
    },
    {
      question: "Quais os parâmetros ideais do TENS para dor lombar?",
      answer: "Os parâmetros variam conforme o tipo de dor. Para dor aguda, geralmente usa-se TENS convencional (alta frequência 80-150Hz, baixa intensidade). Para dor crônica, TENS acupuntura (baixa frequência 2-10Hz, alta intensidade). O NeuroFlux do REHABROAD sugere parâmetros específicos baseados em evidências científicas."
    },
    {
      question: "O sistema funciona para todas as áreas da fisioterapia?",
      answer: "Atualmente focamos em ortopedia, traumatologia, neurologia e eletroterapia. Estamos expandindo para outras especialidades como fisioterapia respiratória, pélvica e esportiva com base no feedback dos usuários."
    },
    {
      question: "Como funciona o NeuroFlux (módulo de eletroterapia)?",
      answer: "O NeuroFlux é nosso módulo de apoio para eletroterapia. Você informa a condição clínica (ex: lombalgia, tendinite, bursite) e ele sugere parâmetros baseados em evidências para TENS, Ultrassom Terapêutico, Laser, Corrente Russa e outras modalidades, incluindo contraindicações e fundamentação científica."
    },
    {
      question: "O prontuário eletrônico é válido juridicamente?",
      answer: "Sim. O prontuário eletrônico tem validade jurídica conforme a Lei 8.856/94 e Resolução COFFITO nº 414. O REHABROAD segue todas as normas de registro, guarda e sigilo de documentos, além de estar em conformidade com a LGPD para proteção de dados dos pacientes."
    },
    {
      question: "Qual a diferença entre prontuário eletrônico e planilha Excel?",
      answer: "Planilhas não são seguras (qualquer pessoa pode editar), não geram laudos profissionais, não rastreiam alterações e não têm conformidade legal. O prontuário eletrônico oferece segurança, backup automático, geração de relatórios, histórico de alterações e conformidade com COFFITO/LGPD."
    }
  ];

  useEffect(() => {
    // Skip scroll tracking on mobile - floating CTA always shows
    if (isMobile) return;
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Track page views
  useEffect(() => {
    const trackView = async () => {
      try {
        let visitorId = localStorage.getItem("rehabroad_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("rehabroad_visitor_id", visitorId);
        }
        await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: "home", visitorId }),
        });
      } catch {
        // Silently fail - tracking shouldn't break UX
      }
    };
    trackView();
  }, []);

  const scrollToForm = () => {
    // Go directly to login - faster conversion
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "landing_page" }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // On mobile, show ultra-lightweight landing page for instant load
  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* === HEADER FIXO === */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <a href="#demo" className="hidden md:block">
              <Button variant="ghost" className="text-white font-semibold hover:text-white hover:bg-white/10">
                Demo
              </Button>
            </a>
            <a href="#pricing" className="hidden md:block">
              <Button variant="ghost" className="text-white font-semibold hover:text-white hover:bg-white/10">
                Planos
              </Button>
            </a>
            <Link to="/login">
              <Button variant="ghost" className="text-white font-semibold hover:text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white hidden sm:flex shadow-lg shadow-teal-500/25"
              >
                Testar Grátis — 30 dias
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cuc3ZnLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="fadeUp">
              <div className="space-y-8">
                {/* Social Proof Badge - Highlighted */}
                <div className="inline-flex items-center gap-2.5 bg-teal-500/15 backdrop-blur-sm border border-teal-400/40 rounded-full px-5 py-2.5 shadow-lg shadow-teal-500/10">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
                  </span>
                  <span className="text-sm font-bold text-white">+500 fisioterapeutas usam para confirmar hipóteses diagnósticas</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                  A{" "}
                  <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    IA que ajuda fisioterapeutas
                  </span>{" "}
                  a chegar ao diagnóstico certo mais rápido
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  Analisa os achados clínicos, sugere hipóteses diagnósticas e gera laudos profissionais — <strong className="text-white">com base em evidência científica.</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link to="/login">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white h-14 px-8 text-base font-semibold shadow-xl shadow-teal-500/25 border-0 w-full sm:w-auto"
                    >
                      Testar Grátis por 30 Dias
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <a href="#demo">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-12 px-5 text-sm border-slate-600 text-white hover:bg-white/10 hover:border-slate-500 bg-transparent w-full sm:w-auto"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Ver como funciona
                    </Button>
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-x-6 sm:gap-y-2 pt-4 text-sm text-slate-400">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-400" />
                    Sem cartão de crédito
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-400" />
                    LGPD e COFFITO compliant
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-400" />
                    Relatórios em PDF automático
                  </span>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Hero Image - Apoio Clínico Screenshot */}
            <AnimateOnScroll animation="fadeUp" delay={0.2}>
              <div className="relative">
                {/* Glow Effect Behind Card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-60" />
                
                <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                  {/* Mock Browser Header */}
                  <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 text-center">
                        app.rehabroad.com.br
                      </div>
                    </div>
                  </div>
                  {/* Mock Apoio Clínico Interface */}
                  <div className="p-6 space-y-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-white">Apoio Clínico</span>
                    </div>
                    
                    {/* Diagnostic Hypothesis Card */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl p-4 border border-teal-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Hipótese Diagnóstica Principal</p>
                          <p className="font-semibold text-white">Síndrome do Impacto Subacromial</p>
                        </div>
                        <div className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                          87% confiança
                        </div>
                      </div>
                      <div className="space-y-2">
                        {["Teste de Neer positivo", "Dor em elevação acima de 90°", "Arco doloroso presente"].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Tests */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2">Testes Sugeridos</p>
                      <div className="flex flex-wrap gap-2">
                        {["Teste de Hawkins", "Teste de Jobe", "Teste do Supraespinal"].map((test, i) => (
                          <span key={i} className="bg-slate-700/50 px-3 py-1.5 rounded-lg text-sm text-slate-300 border border-slate-600/50">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* === BANNER ESTUDANTE === */}
      <section className="py-4 px-4 sm:px-6 bg-gradient-to-r from-violet-600/90 to-purple-600/90 backdrop-blur-sm border-y border-violet-500/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <p className="text-sm sm:text-base font-medium text-center">
              <strong>Novo: Modo Estudante Gratuito</strong> — Treine raciocínio clínico com casos simulados
            </p>
          </div>
          <Link 
            to="/estudante"
            className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
          >
            Acessar modo estudante <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* === SOCIAL PROOF CLUSTER === */}
      <section className="py-6 px-4 sm:px-6 bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">+500</p>
              <p className="text-sm text-slate-400">fisioterapeutas cadastrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">+12.000</p>
              <p className="text-sm text-slate-400">laudos gerados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">+8.000</p>
              <p className="text-sm text-slate-400">avaliações clínicas</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">4.9/5</p>
              <p className="text-sm text-slate-400">nota de satisfação</p>
            </div>
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            Utilizado por fisioterapeutas em <strong className="text-white">clínicas</strong>, <strong className="text-white">consultórios</strong> e <strong className="text-white">universidades</strong>.
          </p>
        </div>
      </section>

      {/* === CICLO DO PRODUTO === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Do exame clínico ao relatório em segundos
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Etapa 1 */}
            <AnimateOnScroll animation="fadeUp">
              <div className="relative text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg mt-4">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Entrada de dados</h3>
                <p className="text-sm text-slate-400">
                  Avaliação clínica estruturada com anamnese, sintomas e exame físico.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Etapa 2 */}
            <AnimateOnScroll animation="fadeUp" delay={0.1}>
              <div className="relative text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg mt-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Apoio clínico inteligente</h3>
                <p className="text-sm text-slate-400">
                  O sistema organiza o raciocínio clínico e sugere hipóteses diagnósticas e testes ortopédicos.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Etapa 3 */}
            <AnimateOnScroll animation="fadeUp" delay={0.2}>
              <div className="relative text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg mt-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Conduta e documentação</h3>
                <p className="text-sm text-slate-400">
                  Defina condutas terapêuticas e gere relatórios profissionais automaticamente.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white h-14 px-8 shadow-lg shadow-teal-500/25"
                >
                  Começar avaliação clínica agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === DEMO INTERATIVA === */}
      <section id="demo" ref={demoRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-300">Demo ao vivo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Teste sem criar conta
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Insira um caso clínico e veja a IA sugerir hipóteses diagnósticas agora.
            </p>
          </div>
          
          {/* Demo Component */}
          {!isMobile && (
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <Suspense fallback={<div className="py-16 bg-slate-900" />}>
                <InteractiveDemo onCTA={scrollToForm} />
              </Suspense>
            </div>
          )}
        </div>
      </section>

      {/* === BARRA DE CREDIBILIDADE === */}
      <section className="py-6 sm:py-5 px-4 sm:px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-slate-400">
            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:px-0 sm:py-0 bg-slate-800/50 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-700 sm:border-0">
              <Lock className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-sm sm:text-sm font-medium">Conformidade <strong className="text-white">COFFITO + LGPD</strong></span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:px-0 sm:py-0 bg-slate-800/50 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-700 sm:border-0">
              <Shield className="w-5 h-5 sm:w-4 sm:h-4 text-teal-400" />
              <span className="text-sm sm:text-sm font-medium">Criptografia <strong className="text-white">SSL 256-bit</strong></span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-2.5 px-4 py-2.5 sm:px-0 sm:py-0 bg-slate-800/50 sm:bg-transparent rounded-xl sm:rounded-none border border-slate-700 sm:border-0">
              <FileCheck className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-sm sm:text-sm font-medium">Lei <strong className="text-white">8.856/94</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* === O PROBLEMA REAL === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                A maioria dos fisioterapeutas ainda enfrenta estes problemas
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-10">
            {[
              { 
                icon: Brain, 
                text: "Dificuldade em estruturar hipóteses diagnósticas" 
              },
              { 
                icon: Zap, 
                text: "Insegurança em parâmetros de eletroterapia" 
              },
              { 
                icon: Clock, 
                text: "Perda de tempo organizando dados clínicos" 
              },
              { 
                icon: AlertTriangle, 
                text: "Risco de esquecer red flags importantes" 
              },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp">
            <div className="text-center p-5 rounded-xl bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-700/50">
              <p className="text-slate-300 text-sm sm:text-base">
                <strong className="text-teal-400">O RehabRoad foi criado para organizar o raciocínio clínico</strong> — não substituir — o julgamento do fisioterapeuta.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === COMPARATIVO VS PLANILHAS === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Por que clínicas estão abandonando planilhas
              </h2>
              <p className="text-base text-slate-400">
                Veja a diferença entre improvisar e ter uma ferramenta profissional
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Planilhas - Left Side */}
            <AnimateOnScroll animation="fadeUp">
              <div className="bg-slate-950/90 rounded-2xl p-6 border-2 border-rose-500/20 h-full opacity-90">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <X className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Planilhas / Papel</h3>
                    <p className="text-sm text-rose-400">O jeito antigo</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Dados dispersos em arquivos diferentes",
                    "Sem apoio para hipóteses diagnósticas",
                    "Parâmetros de eletroterapia no achismo",
                    "Risco de perder informações",
                    "Relatórios manuais",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span className="text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>

            {/* RehabRoad - Right Side */}
            <AnimateOnScroll animation="fadeUp" delay={0.15}>
              <div className="bg-gradient-to-br from-teal-900/40 to-emerald-900/40 rounded-2xl p-6 border-2 border-teal-500/50 h-full relative overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">RehabRoad</h3>
                    <p className="text-sm text-teal-400">Sistema inteligente</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    "Tudo centralizado em um só lugar",
                    "Hipóteses diagnósticas estruturadas",
                    "Parâmetros baseados em evidência",
                    "Geração de relatórios em PDF",
                    "Evolução clínica visual",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span className="text-white font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white h-14 px-8 shadow-lg shadow-teal-500/25"
                >
                  Começar teste gratuito — 30 dias grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === POR QUE FISIOTERAPEUTAS ESCOLHEM === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Por que fisioterapeutas escolhem a Rehabroad
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Economiza tempo */}
            <AnimateOnScroll animation="fadeUp">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Economiza tempo</h3>
                <p className="text-slate-400 text-sm">
                  Laudos e evoluções prontos em minutos, não horas. Mais tempo para o que importa: seu paciente.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Reduz insegurança */}
            <AnimateOnScroll animation="fadeUp" delay={0.1}>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Reduz insegurança</h3>
                <p className="text-slate-400 text-sm">
                  Hipóteses diagnósticas baseadas em evidência. Parâmetros de eletroterapia com referências científicas.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Organiza a clínica */}
            <AnimateOnScroll animation="fadeUp" delay={0.2}>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Organiza a clínica</h3>
                <p className="text-slate-400 text-sm">
                  Histórico completo do paciente em um lugar. Agenda, evolução e alertas automatizados.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* === COMO FUNCIONA === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Como Funciona
              </h2>
              <p className="text-base text-slate-400">
                Três passos simples para organizar seu raciocínio clínico
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                icon: ClipboardList,
                title: "Cadastre o paciente",
                time: "30 segundos",
                color: "teal"
              },
              {
                step: 2,
                icon: Brain,
                title: "Receba hipóteses diagnósticas e testes sugeridos",
                time: "automático",
                color: "violet"
              },
              {
                step: 3,
                icon: Target,
                title: "Defina conduta e gere relatório profissional",
                time: "1 clique",
                color: "emerald"
              }
            ].map((item, index) => (
              <AnimateOnScroll key={index} animation="fadeUp" delay={index * 0.1}>
                <div className="relative text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 md:right-auto md:left-1/2 md:ml-6 w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">({item.time})</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ChevronRight className="w-6 h-6 text-slate-600 mx-auto" />
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <p className="text-center text-slate-400 text-sm mt-10 max-w-xl mx-auto">
              Tudo organizado para <strong className="text-white">reduzir tempo de documentação</strong> e <strong className="text-white">melhorar decisões clínicas</strong>.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === CRIADO POR FISIOTERAPEUTAS === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Criado por fisioterapeuta clínico e professor universitário
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fadeUp" delay={0.1}>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-700">
              <div className="flex-shrink-0">
                <img 
  loading="lazy"
  decoding="async"
  src="/dr-pablo-andrade.png"
  alt="Dr. Pablo Andrade - Fisioterapeuta e criador do RehabRoad"
  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-teal-500/30 shadow-xl"
/>
              </div>
              <div className="text-center sm:text-left">
                {/* Selo de Metodologia Científica */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-4">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">Metodologia Científica Aplicada</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  O RehabRoad foi desenvolvido por <strong className="text-white">Dr. Pablo Andrade</strong>, fisioterapeuta clínico e professor universitário, para resolver um problema real da prática clínica: <strong className="text-white">estruturar raciocínio diagnóstico</strong>, organizar avaliações e documentar atendimentos com segurança.
                </p>
                <p className="text-teal-400 font-medium italic mb-4">
                  "A ponte entre a evidência científica e a sua prática clínica."
                </p>
                <div>
                  <p className="text-lg font-bold text-white">Dr. Pablo Andrade</p>
                  <p className="text-sm text-slate-400">Fisioterapeuta clínico e professor universitário</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === WORKFLOW VISUAL === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 content-auto">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-400 bg-teal-500/10 rounded-full mb-4">
                WORKFLOW COMPLETO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Da avaliação ao relatório em 5 passos
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Veja como o RehabRoad organiza todo o seu atendimento
              </p>
            </div>
          </AnimateOnScroll>

          {/* Workflow Steps - Horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-teal-500 via-violet-500 to-emerald-500" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {[
                { 
                  step: 1, 
                  icon: UserPlus, 
                  title: "Cadastro", 
                  desc: "Paciente em 30 segundos",
                  color: "teal",
                  preview: "Nome, telefone, queixa principal"
                },
                { 
                  step: 2, 
                  icon: ClipboardList, 
                  title: "Avaliação", 
                  desc: "Anamnese estruturada",
                  color: "blue",
                  preview: "Dor, história, testes ortopédicos"
                },
                { 
                  step: 3, 
                  icon: Brain, 
                  title: "Diagnóstico", 
                  desc: "Hipóteses automáticas",
                  color: "violet",
                  preview: "Sugestões baseadas nos dados"
                },
                { 
                  step: 4, 
                  icon: Zap, 
                  title: "Conduta", 
                  desc: "NeuroFlux eletroterapia",
                  color: "amber",
                  preview: "Parâmetros com evidência"
                },
                { 
                  step: 5, 
                  icon: FileText, 
                  title: "Relatório", 
                  desc: "PDF profissional",
                  color: "emerald",
                  preview: "Pronto para enviar"
                }
              ].map((item, index) => (
                <AnimateOnScroll key={index} animation="fadeUp" delay={index * 0.08}>
                  <div className="relative group">
                    {/* Step number circle */}
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center shadow-lg shadow-${item.color}-500/20 relative z-10 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    
                    {/* Card */}
                    <div className="mt-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold text-${item.color}-400`}>PASSO {item.step}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                      <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg px-3 py-2">
                        {item.preview}
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          <AnimateOnScroll animation="fadeUp" delay={0.4}>
            <div className="text-center mt-10">
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                Começar teste gratuito — 30 dias grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === DEPOIMENTOS === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                O que dizem os fisioterapeutas
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonial 1 */}
            <StaggerItem>
              <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 h-full">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  "O Apoio Clínico me ajudou a estruturar o raciocínio diagnóstico sem aquela insegurança de estar esquecendo algo importante."
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" 
                    alt="Dra. Camila Torres"
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">Dra. Camila Torres</p>
                    <p className="text-xs text-slate-400">Ortopédica — São Paulo, SP</p>
                    <p className="text-xs text-teal-400 font-medium">CREFITO-3/284521-F</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Testimonial 2 */}
            <StaggerItem>
              <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 h-full">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  "O NeuroFlux organizou meus protocolos de eletroterapia. Agora defino parâmetros em segundos, não minutos."
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" 
                    alt="Dr. Rafael Mendes"
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">Dr. Rafael Mendes</p>
                    <p className="text-xs text-slate-400">Esportivo — Belo Horizonte, MG</p>
                    <p className="text-xs text-violet-400 font-medium">CREFITO-4/187342-F</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Testimonial 3 */}
            <StaggerItem>
              <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 h-full">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  "Trabalho com pacientes neurológicos e cada protocolo vem com fundamentação fisiológica clara."
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&crop=face" 
                    alt="Dra. Fernanda Leal"
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500/50"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">Dra. Fernanda Leal</p>
                    <p className="text-xs text-slate-400">Neurológica — Porto Alegre, RS</p>
                    <p className="text-xs text-amber-400 font-medium">CREFITO-5/156789-F</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* === COMUNIDADE === */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-violet-600 to-purple-700">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                <span>Novo!</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Comunidade de Fisioterapeutas Online
              </h2>
              <p className="text-lg text-violet-100 max-w-2xl mx-auto">
                Conecte-se com outros profissionais, discuta casos clínicos, 
                troque experiências e cresça junto com a comunidade.
              </p>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Casos Clínicos</h3>
                <p className="text-violet-100 text-sm">
                  Discuta casos complexos com colegas e receba perspectivas diferentes para suas condutas.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Eletroterapia</h3>
                <p className="text-violet-100 text-sm">
                  Compartilhe protocolos, tire dúvidas sobre parâmetros e aprenda novas técnicas.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dúvidas Gerais</h3>
                <p className="text-violet-100 text-sm">
                  Pergunte, responda e ajude outros fisioterapeutas da comunidade.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp" className="text-center mt-10">
            <p className="text-violet-200 text-sm mb-4">
              Incluso em todos os planos — sem custo adicional
            </p>
            <Link to="/login">
              <Button 
                className="bg-white text-violet-700 hover:bg-violet-50 font-semibold px-8 py-3"
              >
                Participar da Comunidade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === O QUE VOCÊ TEM ACESSO === */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Funcionalidades Incluídas
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: ClipboardList, title: "Prontuário estruturado", desc: "Avaliações completas com histórico e exame físico" },
              { icon: Brain, title: "Apoio clínico inteligente", desc: "Hipóteses diagnósticas com nível de confiança" },
              { icon: Stethoscope, title: "Biblioteca de testes", desc: "Testes especiais por região anatômica" },
              { icon: Zap, title: "NeuroFlux", desc: "Eletroterapia baseada em evidência" },
              { icon: LineChart, title: "Evolução visual", desc: "Gráficos de progressão clínica" },
              { icon: FileText, title: "Relatórios em PDF", desc: "Exportação profissional com um clique" },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-teal-500/50 transition-all h-full">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white h-14 px-8 shadow-lg shadow-teal-500/25"
                >
                  Começar teste gratuito
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === POSICIONAMENTO === */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border-y border-teal-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <p className="text-lg sm:text-xl text-white leading-relaxed">
              <strong className="text-teal-400">O RehabRoad não é apenas um prontuário.</strong>{" "}
              É um <strong className="text-white">copiloto clínico</strong> que organiza seu raciocínio diagnóstico, 
              sugere testes relevantes e gera documentação profissional — para que você dedique mais atenção ao paciente, não à papelada.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === DEMONSTRAÇÃO - CASO CLÍNICO === */}
      <section ref={demoRef} className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Exemplo: Avaliação de Dor Lombar com Laudo PDF
              </h2>
              <p className="text-lg text-slate-300">
                Veja o sistema funcionando antes mesmo de criar sua conta
              </p>
            </div>
          </AnimateOnScroll>

          {/* Clinical Case Flow */}
          <div className="space-y-6">
            {/* Step 1: Data Entry */}
            <AnimateOnScroll animation="fadeUp">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <span className="text-teal-400 font-medium">Entrada de Dados</span>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Queixa Principal</p>
                      <p className="text-white">"Dor lombar que irradia para perna esquerda há 3 semanas"</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Localização</p>
                      <p className="text-white">Coluna lombar baixa (L4-L5)</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Achados do Exame</p>
                    <p className="text-white">Lasègue positivo a 40°, diminuição de força em dorsiflexão, parestesia em dermátomo L5</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Arrow */}
            <div className="flex justify-center">
              <ChevronDown className="w-8 h-8 text-slate-600" />
            </div>

            {/* Step 2: Generated Hypothesis */}
            <AnimateOnScroll animation="fadeUp" delay={0.1}>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <span className="text-violet-400 font-medium">Hipótese Gerada</span>
                </div>
                <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-4 border border-violet-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Hipótese Principal</p>
                      <p className="text-xl font-semibold text-white">Radiculopatia Lombar L5</p>
                    </div>
                    <div className="bg-violet-500/20 text-violet-300 px-3 py-1.5 rounded-full text-sm font-medium border border-violet-500/30">
                      92% confiança
                    </div>
                  </div>
                  <div className="text-slate-300 text-sm">
                    <p className="mb-2"><strong className="text-white">Raciocínio:</strong> Combinação de dor irradiada, teste de Lasègue positivo e déficit neurológico em dermátomo específico sugere compressão radicular.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Arrow */}
            <div className="flex justify-center">
              <ChevronDown className="w-8 h-8 text-slate-600" />
            </div>

            {/* Step 3: Suggested Tests */}
            <AnimateOnScroll animation="fadeUp" delay={0.2}>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <span className="text-amber-400 font-medium">Testes Sugeridos</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Slump Test", "Teste de Lasègue Cruzado", "Reflexo Patelar", "Teste de Força L4-S1"].map((test, i) => (
                    <div key={i} className="bg-slate-900/50 px-4 py-2.5 rounded-lg text-white border border-slate-700 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-amber-400" />
                      {test}
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            {/* Arrow */}
            <div className="flex justify-center">
              <ChevronDown className="w-8 h-8 text-slate-600" />
            </div>

            {/* Step 4: Recommended Protocol */}
            <AnimateOnScroll animation="fadeUp" delay={0.3}>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <span className="text-emerald-400 font-medium">Protocolo Recomendado (NeuroFlux)</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-emerald-400 text-sm font-medium mb-2">TENS Analgésico</p>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-slate-300"><span className="text-slate-500">Frequência:</span> 100 Hz</p>
                      <p className="text-slate-300"><span className="text-slate-500">Largura de Pulso:</span> 100 μs</p>
                      <p className="text-slate-300"><span className="text-slate-500">Tempo:</span> 30 min</p>
                      <p className="text-slate-300"><span className="text-slate-500">Eletrodos:</span> Paravertebral L4-S1</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-emerald-400 text-sm font-medium mb-2">Pontos de Atenção</p>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Monitorar progressão neurológica
                      </p>
                      <p className="text-slate-300">Reavaliar em 3-5 sessões</p>
                      <p className="text-slate-300">Encaminhar se piora dos déficits</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* === PARA QUEM É O REHABROAD === */}
      <section className="py-20 px-4 sm:px-6 bg-slate-950 content-auto">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Para quem é o RehabRoad
              </h2>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Fisioterapeutas recém-formados",
                description: "Que buscam mais segurança clínica na estruturação do raciocínio e tomada de decisões.",
                color: "from-teal-500 to-cyan-600"
              },
              {
                icon: Building2,
                title: "Clínicas de fisioterapia",
                description: "Que desejam organizar prontuário e documentação de forma profissional e segura.",
                color: "from-emerald-500 to-teal-600"
              },
              {
                icon: Zap,
                title: "Profissionais que utilizam eletroterapia",
                description: "Que buscam parâmetros baseados em evidência científica para diferentes condições.",
                color: "from-violet-500 to-purple-600"
              },
              {
                icon: UserCheck,
                title: "Docentes e supervisores clínicos",
                description: "Que desejam estruturar o raciocínio clínico de forma didática para alunos.",
                color: "from-amber-500 to-orange-600"
              },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white h-14 px-8 shadow-lg shadow-teal-500/25"
                >
                  Começar avaliação clínica agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === SEO CONTENT BLOCK: Guia Prontuário Eletrônico === */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Guia: Prontuário Eletrônico para Fisioterapia
              </h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-3">
              {/* Accordion 1 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenGuide(openGuide === 0 ? null : 0)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-teal-400">O que é Prontuário Eletrônico do Paciente (PEP)?</h3>
                  <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${openGuide === 0 ? 'rotate-180' : ''}`} />
                </button>
                {openGuide === 0 && (
                  <div className="px-4 sm:px-5 pb-5">
                    <p className="text-slate-300 leading-relaxed">
                      O <strong className="text-white">Prontuário Eletrônico do Paciente</strong> é um sistema digital que substitui fichas de papel e planilhas Excel. 
                      Para fisioterapeutas, permite registrar avaliações, evoluções diárias, testes ortopédicos e gerar 
                      <strong className="text-white"> laudos fisioterapêuticos em PDF</strong> de forma rápida e profissional.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenGuide(openGuide === 1 ? null : 1)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-teal-400">Vantagens do Software para Clínica de Fisioterapia</h3>
                  <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${openGuide === 1 ? 'rotate-180' : ''}`} />
                </button>
                {openGuide === 1 && (
                  <div className="px-4 sm:px-5 pb-5">
                    <ul className="text-slate-300 space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Conformidade COFFITO:</strong> Atende às resoluções do Conselho Federal de Fisioterapia e Lei 8.856/94</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">LGPD:</strong> Proteção de dados dos pacientes com criptografia SSL 256-bit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Laudo PDF:</strong> Geração automática de relatórios profissionais com diagnóstico cinético-funcional</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white">Backup automático:</strong> Dados seguros na nuvem, acesso de qualquer dispositivo</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3 */}
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenGuide(openGuide === 2 ? null : 2)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-teal-400">REHABROAD: Prontuário + Apoio Clínico Inteligente</h3>
                  <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${openGuide === 2 ? 'rotate-180' : ''}`} />
                </button>
                {openGuide === 2 && (
                  <div className="px-4 sm:px-5 pb-5">
                    <p className="text-slate-300 leading-relaxed">
                      O REHABROAD vai além do prontuário eletrônico tradicional. Inclui o <strong className="text-white">NeuroFlux</strong> com 
                      <strong className="text-white"> parâmetros de TENS, Ultrassom e Laser</strong> baseados em evidências, 
                      <strong className="text-white"> sugestões diagnósticas</strong> para auxiliar no raciocínio clínico, e 
                      <strong className="text-white"> biblioteca de exercícios</strong> para prescrição via WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === PRÉVIA DE PREÇOS === */}
      <section className="py-20 px-5 sm:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <p className="text-teal-400 font-medium mb-2">Menos que o valor de uma sessão por mês</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Planos Simples e Acessíveis
              </h2>
              <p className="text-base text-slate-400">
                30 dias grátis para testar. Sem cartão de crédito.
              </p>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Mensal */}
            <StaggerItem>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 h-full hover:border-slate-600 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">Mensal</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-sm text-slate-400">R$</span>
                  <span className="text-4xl font-bold text-white">29</span>
                  <span className="text-slate-400">/mês</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">Flexibilidade total, cancele quando quiser</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Acesso completo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> NeuroFlux incluído</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Suporte prioritário</li>
                </ul>
              </div>
            </StaggerItem>

            {/* Semestral - Destaque */}
            <StaggerItem>
              <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 border-2 border-teal-400 shadow-2xl shadow-teal-500/20 relative h-full transform sm:scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" /> MAIS POPULAR
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Semestral</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-sm text-teal-200">R$</span>
                  <span className="text-4xl font-bold text-white">149</span>
                  <span className="text-teal-200">/6 meses</span>
                </div>
                <p className="text-sm text-teal-100 mb-6">Economia de R$ 25 • <strong>R$ 24,83/mês</strong></p>
                <ul className="space-y-2 text-sm text-teal-100">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Tudo do mensal</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Economia garantida</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-white" /> Prioridade em novidades</li>
                </ul>
              </div>
            </StaggerItem>

            {/* Anual */}
            <StaggerItem>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 h-full hover:border-slate-600 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">Anual</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-sm text-slate-400">R$</span>
                  <span className="text-4xl font-bold text-white">279</span>
                  <span className="text-slate-400">/ano</span>
                </div>
                <p className="text-sm text-emerald-400 font-medium mb-6">Economia de R$ 69 • R$ 23,25/mês</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Melhor custo-benefício</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Acesso vitalício às atualizações</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400" /> Suporte VIP</li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp" delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white h-14 px-8 shadow-lg shadow-teal-500/25"
                >
                  Começar teste grátis de 30 dias
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-slate-500 mt-3">Sem cartão de crédito • Cancele quando quiser</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === BANNER INDICAÇÃO === */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-r from-violet-900/50 via-purple-900/50 to-violet-900/50 border-y border-violet-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Gostou da Rehabroad? Indique um colega e ganhe benefícios.
                </h3>
                <p className="text-sm text-violet-300">
                  Programa de indicação disponível para assinantes. Compartilhe e seja recompensado.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900 content-auto">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Dúvidas Frequentes
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <AnimateOnScroll key={index} animation="fadeUp" delay={index * 0.05}>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-white pr-4">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-45 bg-teal-500' : ''}`}>
                      {openFaq === index ? (
                        <X className="w-4 h-4 text-white" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* === RECURSOS GRATUITOS (Micro-conversões) === */}
      <section className="py-20 px-4 sm:px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Downloads Gratuitos
              </h2>
              <p className="text-base text-slate-400">
                Comece a organizar seus atendimentos agora mesmo
              </p>
            </div>
          </AnimateOnScroll>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Material 1 - Modelo de Avaliação */}
            <StaggerItem>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700 hover:border-teal-500/50 transition-all group h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/25">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Modelo de Avaliação Fisioterapêutica</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  Template completo em PDF com anamnese, exame físico, testes especiais e diagnóstico cinético-funcional.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <FileText className="w-4 h-4" />
                  <span>PDF • 3 páginas</span>
                </div>
                <a 
                  href="/api/downloads/modelo-avaliacao.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium text-sm group-hover:gap-3 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar Gratuitamente
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>

            {/* Material 2 - Checklist LGPD */}
            <StaggerItem>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700 hover:border-violet-500/50 transition-all group h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/25">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Checklist LGPD para Fisioterapeutas</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  20 itens essenciais para adequar sua clínica à Lei Geral de Proteção de Dados. Evite multas.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <FileCheck className="w-4 h-4" />
                  <span>PDF • Checklist interativo</span>
                </div>
                <a 
                  href="/api/downloads/checklist-lgpd.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium text-sm group-hover:gap-3 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar Gratuitamente
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>

            {/* Material 3 - Guia de Parâmetros */}
            <StaggerItem>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all group h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/25">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Guia Rápido de Parâmetros TENS</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                  Tabela de referência com parâmetros baseados em evidências para as condições mais comuns.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <BookOpen className="w-4 h-4" />
                  <span>PDF • Tabela A4</span>
                </div>
                <a 
                  href="/api/downloads/guia-tens.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium text-sm group-hover:gap-3 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Baixar Gratuitamente
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <AnimateOnScroll animation="fadeUp" delay={0.2}>
            <div className="text-center mt-12 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-slate-300 mb-4">
                <strong className="text-white">Quer acesso a mais materiais exclusivos?</strong><br />
                Assinantes têm acesso a biblioteca completa com +20 templates e guias.
              </p>
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                >
                  Criar conta gratuita
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* === CONVITE DIRETO / FORM === */}
      <section ref={formRef} className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-teal-900/30 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-xl mx-auto relative z-10">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Comece agora — é grátis por 30 dias
              </h2>
              <p className="text-base text-slate-300">
                Crie sua conta em 30 segundos e organize seu primeiro paciente hoje.
              </p>
            </div>

            {submitted ? (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-700 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Cadastro realizado!</h3>
                <p className="text-slate-300">Redirecionando para criar sua conta...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-200 font-medium">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1.5 h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-200 font-medium">E-mail profissional</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1.5 h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !name || !email}
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-lg shadow-teal-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Começar avaliação clínica agora
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 text-center mt-4">
                  <span className="flex items-center justify-center gap-2 sm:gap-5 mb-3 flex-wrap">
                    <span className="flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-slate-900/50 rounded-full border border-slate-700">
                      <Lock className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" /> 
                      <span className="text-slate-300 text-sm sm:text-xs font-medium">SSL 256-bit</span>
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-slate-900/50 rounded-full border border-slate-700">
                      <Shield className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-teal-400" /> 
                      <span className="text-slate-300 text-sm sm:text-xs font-medium">LGPD</span>
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-slate-900/50 rounded-full border border-slate-700">
                      <FileCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-violet-400" /> 
                      <span className="text-slate-300 text-sm sm:text-xs font-medium">COFFITO</span>
                    </span>
                  </span>
                  Ao se cadastrar, você concorda com nossos{" "}
                  <Link to="/termos-de-uso" className="text-teal-400 hover:underline">Termos</Link>
                  {" "}e{" "}
                  <Link to="/politica-de-privacidade" className="text-teal-400 hover:underline">Privacidade</Link>.
                </p>
              </form>
            )}
          </AnimateOnScroll>
        </div>
      </section>

      {/* === CTA FIXO MOBILE === */}
      {showFloatingCTA && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 md:hidden z-50">
          <Link to="/login" className="block">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-teal-500/25"
            >
              Testar Grátis 30 dias
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* === RODAPÉ === */}
      <footer className="py-12 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          {/* Legal Notice */}
          <div className="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Aviso importante:</strong> O RehabRoad é uma ferramenta de apoio à decisão clínica. As sugestões apresentadas não substituem o julgamento profissional do fisioterapeuta. Toda conduta deve ser definida pelo profissional responsável, considerando as particularidades de cada caso.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">REHABROAD</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="text-slate-400">Em conformidade com as normas do COFFITO</span>
              <span className="text-slate-600">•</span>
              <Link to="/termos-de-uso" className="text-slate-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica-de-privacidade" className="text-slate-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              © 2026 REHABROAD. Plataforma de Apoio Clínico para Fisioterapeutas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
