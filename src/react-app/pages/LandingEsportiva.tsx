import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";
import { 
  ArrowRight, Check, Dumbbell, Zap, 
  ClipboardList, Activity, Timer, Star, Target
} from "lucide-react";

export default function LandingEsportiva() {
  const sports = [
    "Futebol",
    "Corrida",
    "CrossFit",
    "Tênis",
    "Basquete",
    "Natação",
    "Musculação",
    "Vôlei",
    "Ciclismo",
    "Artes Marciais"
  ];

  const injuries = [
    "Lesão muscular (estiramento, contusão)",
    "Entorse de tornozelo",
    "Lesão do LCA",
    "Tendinopatia patelar",
    "Síndrome do trato iliotibial",
    "Pubalgia",
    "Lesão do manguito rotador",
    "Fascite plantar"
  ];

  const features = [
    {
      icon: ClipboardList,
      title: "Avaliação Funcional Esportiva",
      description: "Testes específicos para atletas: força, flexibilidade, equilíbrio, estabilidade de core e padrões de movimento."
    },
    {
      icon: Timer,
      title: "Protocolo de Return to Play",
      description: "Acompanhe critérios objetivos para retorno ao esporte: força, amplitude, testes funcionais e confiança."
    },
    {
      icon: Zap,
      title: "Eletroterapia para Lesões",
      description: "Parâmetros de TENS, Ultrassom e Laser para fase aguda, subaguda e crônica de lesões esportivas."
    },
    {
      icon: Target,
      title: "Objetivos SMART",
      description: "Defina metas específicas e mensuráveis para cada fase da reabilitação até o retorno ao esporte."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-400" />
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link to="/#beta">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white">
                Testar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
              <Dumbbell className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Fisioterapia Esportiva</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Prontuário Eletrônico para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Fisioterapia Esportiva
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Sistema para reabilitação de atletas com avaliação funcional, protocolos de return to play, 
              parâmetros de eletroterapia e acompanhamento de lesões musculares e articulares.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#beta">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-8">
                  Testar Grátis por 30 Dias
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/blog/lesao-muscular-fisioterapia-esportiva">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Ver Artigo: Lesão Muscular
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Sports */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Para Atletas de Todas as Modalidades
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sports.map((sport, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700 justify-center">
                  <Dumbbell className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{sport}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Injuries */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Lesões Esportivas Mais Comuns
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {injuries.map((injury, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <Check className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-300">{injury}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              Funcionalidades para Fisioterapia Esportiva
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Clinical Example */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-400 bg-orange-500/10 rounded-full mb-4">
                EXEMPLO CLÍNICO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Caso: Estiramento de Isquiotibiais Grau II
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Atleta</p>
                <p className="text-white">Jogador de futebol, 24 anos, lesão durante sprint</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Avaliação Inicial</p>
                <p className="text-white">Dor à palpação, equimose, perda de força em flexão de joelho</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 rounded-xl p-4 border border-orange-700/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Protocolo de Return to Play</p>
                  <p className="text-lg font-semibold text-white">Fase 1: Controle Inflamatório (0-5 dias)</p>
                </div>
                <div className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                  Semana 1
                </div>
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">NeuroFlux sugere:</strong> Crioterapia (20min, 3x/dia) + TENS convencional para analgesia + Ultrassom pulsado (1MHz, 0.3W/cm²)
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Critérios para Fase 2</p>
              <div className="flex flex-wrap gap-2">
                {["Marcha sem dor", "ADM completa", "Força 4/5", "Sem edema"].map((criteria, i) => (
                  <span key={i} className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-300 border border-slate-700">
                    <Check className="w-3 h-3 text-orange-400 inline mr-1" />{criteria}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <blockquote className="text-xl text-white italic mb-6">
              "Trabalho com atletas de alto rendimento e o REHABROAD me ajuda a documentar 
              cada etapa da reabilitação. Os relatórios são essenciais para a comunicação 
              com treinadores e preparadores físicos."
            </blockquote>
            <div className="text-slate-400">
              <span className="font-semibold text-white">Dr. Fernando Alves</span>
              <br />
              Fisioterapeuta Esportivo — CREFITO-3/234567
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl font-bold text-white mb-4">
              Eleve sua Prática em Fisioterapia Esportiva
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              30 dias grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <Link to="/#beta">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white px-8">
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-white">REHABROAD</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/fisioterapia-ortopedica" className="hover:text-white transition-colors">Ortopedia</Link>
          </div>
          <p className="text-sm text-slate-500">© 2025 REHABROAD</p>
        </div>
      </footer>
    </div>
  );
}
