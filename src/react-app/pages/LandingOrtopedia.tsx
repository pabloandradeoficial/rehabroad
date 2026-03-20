import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";
import { 
  ArrowRight, Check, Bone, FileText, Zap, 
  ClipboardList, Activity, Brain, Star
} from "lucide-react";

export default function LandingOrtopedia() {
  const conditions = [
    "Tendinite e Tendinopatias",
    "Lesões ligamentares (LCA, LCM)",
    "Fraturas e pós-operatório",
    "Lombalgia e cervicalgia",
    "Hérnia de disco",
    "Artrose e artrite",
    "Síndrome do impacto",
    "Bursite e capsulite",
    "Lesões meniscais",
    "Dor miofascial"
  ];

  const features = [
    {
      icon: ClipboardList,
      title: "Avaliação Ortopédica Completa",
      description: "Campos específicos para testes ortopédicos, amplitude de movimento, força muscular e testes especiais por região anatômica."
    },
    {
      icon: Zap,
      title: "NeuroFlux para Eletroterapia",
      description: "Parâmetros de TENS, Ultrassom e Laser baseados em evidências para cada condição ortopédica. Lombalgia, tendinite, pós-operatório."
    },
    {
      icon: Brain,
      title: "Sugestão Diagnóstica",
      description: "Hipóteses diagnósticas baseadas na queixa principal, local da dor e testes positivos. Auxilia no raciocínio clínico."
    },
    {
      icon: FileText,
      title: "Laudo PDF Profissional",
      description: "Relatórios com diagnóstico cinético-funcional, objetivos SMART e plano de tratamento. Pronto para convênios e pacientes."
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Bone className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Fisioterapia Ortopédica</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Prontuário Eletrônico para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Fisioterapia Ortopédica
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Sistema completo para avaliação de lesões musculoesqueléticas, testes ortopédicos, 
              parâmetros de eletroterapia e laudos profissionais. Desenvolvido para ortopedia e traumatologia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#beta">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-white px-8">
                  Testar Grátis por 30 Dias
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/blog/tendinite-tratamento-fisioterapia">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Ver Artigo: Tendinite
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Condições Ortopédicas Suportadas
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {conditions.map((condition, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{condition}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              Funcionalidades para Fisioterapia Ortopédica
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mb-4">
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
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full mb-4">
                EXEMPLO CLÍNICO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Caso: Tendinite do Supraespinal
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Queixa Principal</p>
                <p className="text-white">"Dor no ombro direito ao levantar o braço, pior à noite"</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Testes Positivos</p>
                <p className="text-white">Neer, Hawkins-Kennedy, Jobe</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-teal-900/30 rounded-xl p-4 border border-blue-700/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Hipótese do Sistema</p>
                  <p className="text-lg font-semibold text-white">Síndrome do Impacto Subacromial</p>
                </div>
                <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  89% confiança
                </div>
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">NeuroFlux sugere:</strong> TENS convencional (100Hz, 100μs, 20min) + Ultrassom pulsado (1MHz, 0.5W/cm², 5min)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <blockquote className="text-xl text-white italic mb-6">
              "Atendo muito pós-operatório de joelho e ombro. O REHABROAD me ajuda a estruturar 
              a evolução de cada sessão e os parâmetros de eletroterapia. Meus laudos ficaram 
              muito mais profissionais."
            </blockquote>
            <div className="text-slate-400">
              <span className="font-semibold text-white">Dr. Marcos Vieira</span>
              <br />
              Fisioterapeuta Ortopédico — CREFITO-4/123456
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl font-bold text-white mb-4">
              Experimente o Prontuário para Ortopedia
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              30 dias grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <Link to="/#beta">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-white px-8">
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
            <Link to="/comparacao" className="hover:text-white transition-colors">Comparação</Link>
          </div>
          <p className="text-sm text-slate-500">© 2025 REHABROAD</p>
        </div>
      </footer>
    </div>
  );
}
