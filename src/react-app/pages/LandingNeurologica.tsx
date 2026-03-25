import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";
import { 
  ArrowRight, Check, Brain, FileText, Zap, 
  ClipboardList, Activity, HeartPulse, Star, Users
} from "lucide-react";

export default function LandingNeurologica() {
  const conditions = [
    "AVC (Acidente Vascular Cerebral)",
    "Doença de Parkinson",
    "Esclerose Múltipla",
    "Traumatismo Cranioencefálico",
    "Lesão Medular",
    "Paralisia Cerebral",
    "Neuropatias Periféricas",
    "Guillain-Barré",
    "ELA",
    "Ataxias"
  ];

  const features = [
    {
      icon: ClipboardList,
      title: "Avaliação Neurológica Completa",
      description: "Escalas validadas (Ashworth, Berg, Barthel, NIHSS), avaliação de tônus, força, coordenação e marcha."
    },
    {
      icon: HeartPulse,
      title: "Evolução Funcional",
      description: "Acompanhe ganhos em AVDs, transferências, equilíbrio e deambulação com registros estruturados."
    },
    {
      icon: Zap,
      title: "Eletroestimulação Neuromuscular",
      description: "Parâmetros de FES, TENS e correntes para espasticidade, fortalecimento e modulação de dor."
    },
    {
      icon: FileText,
      title: "Laudos para Equipe Multidisciplinar",
      description: "Relatórios profissionais para médicos, terapeutas ocupacionais e fonoaudiólogos da equipe."
    }
  ];

  const team = [
    { role: "Neurologista", icon: Brain },
    { role: "Terapeuta Ocupacional", icon: Users },
    { role: "Fonoaudiólogo", icon: Users },
    { role: "Enfermagem", icon: HeartPulse }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
              <Brain className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">Fisioterapia Neurológica</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Prontuário Eletrônico para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                Fisioterapia Neurológica
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Sistema para reabilitação neurológica com escalas funcionais validadas, 
              acompanhamento de evolução e comunicação com equipe multidisciplinar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#beta">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white px-8">
                  Testar Grátis por 30 Dias
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/blog/fisioterapia-avc-reabilitacao">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Ver Artigo: Reabilitação AVC
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
              Condições Neurológicas Suportadas
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {conditions.map((condition, index) => (
              <StaggerItem key={index}>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
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
              Funcionalidades para Fisioterapia Neurológica
            </h2>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
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

      {/* Team Communication */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
              Comunicação com Equipe Multidisciplinar
            </h2>
            <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
              Gere laudos profissionais para compartilhar com toda a equipe de reabilitação
            </p>
          </AnimateOnScroll>
          
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map((member, index) => (
              <StaggerItem key={index}>
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <member.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <span className="text-sm text-slate-300 text-center">{member.role}</span>
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
              <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 rounded-full mb-4">
                EXEMPLO CLÍNICO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Caso: Paciente Pós-AVC com Hemiparesia
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Paciente</p>
                <p className="text-white">68 anos, AVC isquêmico há 3 meses, hemiparesia direita</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Escalas Iniciais</p>
                <p className="text-white">Berg: 32/56 | Barthel: 65/100 | Ashworth: 2 (flexores cotovelo)</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-4 border border-violet-700/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Objetivos da Sessão</p>
                  <p className="text-lg font-semibold text-white">Treino de Transferência Sentado-Em Pé</p>
                </div>
                <div className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                  Fase 2
                </div>
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Condutas:</strong> FES em quadríceps (35Hz, 300μs, 10s on/10s off) + treino funcional com barra paralela + exercícios de equilíbrio em Bobath
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Evolução Registrada</p>
              <div className="flex flex-wrap gap-2">
                {["Berg: 32 → 38 (+6)", "Barthel: 65 → 75", "Marcha com andador", "Transferência independente"].map((evo, i) => (
                  <span key={i} className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-300 border border-slate-700">
                    <Check className="w-3 h-3 text-violet-400 inline mr-1" />{evo}
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
              "Atendo pacientes com sequelas de AVC e Parkinson. O REHABROAD me ajuda a 
              estruturar avaliações com escalas funcionais e acompanhar a evolução. 
              Os relatórios facilitam muito a comunicação com neurologistas."
            </blockquote>
            <div className="text-slate-400">
              <span className="font-semibold text-white">Dra. Ana Paula Ribeiro</span>
              <br />
              Fisioterapeuta Neurofuncional — CREFITO-2/345678
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl font-bold text-white mb-4">
              Experimente o Prontuário para Neurologia
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              30 dias grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <Link to="/#beta">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white px-8">
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
            <Link to="/fisioterapia-esportiva" className="hover:text-white transition-colors">Esportiva</Link>
          </div>
          <p className="text-sm text-slate-500">© 2025 REHABROAD</p>
        </div>
      </footer>
    </div>
  );
}
