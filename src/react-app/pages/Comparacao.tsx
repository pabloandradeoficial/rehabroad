import { Link } from "react-router";
import { 
  Check, 
  X, 
  ArrowRight, 
  FileSpreadsheet, 
  Smartphone, 
  Brain,
  Shield,
  Clock,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/react-app/components/ui/motion";

interface ComparisonFeature {
  feature: string;
  rehabroad: boolean | string;
  planilhas: boolean | string;
  papel: boolean | string;
  outros: boolean | string;
}

const comparisonData: ComparisonFeature[] = [
  { feature: "Hipóteses diagnósticas automáticas", rehabroad: true, planilhas: false, papel: false, outros: false },
  { feature: "Parâmetros de eletroterapia baseados em evidências", rehabroad: true, planilhas: false, papel: false, outros: false },
  { feature: "Sugestão de exercícios por condição", rehabroad: true, planilhas: false, papel: false, outros: false },
  { feature: "Gráficos de evolução da dor", rehabroad: true, planilhas: "Manual", papel: false, outros: "Limitado" },
  { feature: "Conformidade LGPD automática", rehabroad: true, planilhas: false, papel: false, outros: "Parcial" },
  { feature: "Acesso em qualquer dispositivo", rehabroad: true, planilhas: "Limitado", papel: false, outros: true },
  { feature: "Backup automático na nuvem", rehabroad: true, planilhas: "Manual", papel: false, outros: true },
  { feature: "Exportação PDF profissional", rehabroad: true, planilhas: "Manual", papel: false, outros: "Parcial" },
  { feature: "Comunidade de fisioterapeutas", rehabroad: true, planilhas: false, papel: false, outros: false },
  { feature: "Testes ortopédicos integrados", rehabroad: true, planilhas: false, papel: false, outros: false },
  { feature: "Preço mensal", rehabroad: "R$29", planilhas: "Grátis", papel: "Grátis", outros: "R$79-199" },
  { feature: "Tempo para começar", rehabroad: "5 min", planilhas: "Horas", papel: "0 min", outros: "Horas" },
];

const FeatureCell = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <X className="w-4 h-4 text-red-400" />
        </div>
      </div>
    );
  }
  return (
    <span className="text-sm text-slate-400">{value}</span>
  );
};

export default function Comparacao() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">REHABROAD</span>
          </Link>
          <Link to="/">
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
              Testar Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Por que fisioterapeutas estão 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400"> trocando planilhas </span>
              pelo RehabRoad?
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Compare e veja a diferença entre organizar sua clínica com métodos tradicionais 
              versus ter um copiloto clínico inteligente ao seu lado.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-4 px-4 font-medium text-slate-400">Funcionalidade</th>
                    <th className="text-center py-4 px-4 min-w-[120px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-white">RehabRoad</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 min-w-[120px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                          <FileSpreadsheet className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-400">Planilhas</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 min-w-[120px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-slate-400">Papel</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 min-w-[120px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-400">Outros Apps</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors ${
                        i === comparisonData.length - 2 || i === comparisonData.length - 1 
                          ? 'bg-slate-900/30' 
                          : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-slate-300 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.rehabroad === 'string' ? (
                          <span className="text-sm font-semibold text-teal-400">{row.rehabroad}</span>
                        ) : (
                          <FeatureCell value={row.rehabroad} />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center"><FeatureCell value={row.planilhas} /></td>
                      <td className="py-4 px-4 text-center"><FeatureCell value={row.papel} /></td>
                      <td className="py-4 px-4 text-center"><FeatureCell value={row.outros} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why Others Fail */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              O problema com cada alternativa
            </h2>
          </AnimateOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-full">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mb-5">
                  <FileSpreadsheet className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Planilhas Excel/Google</h3>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Zero inteligência clínica — é só armazenamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Configuração manual complexa e demorada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Nenhuma conformidade LGPD garantida</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Difícil de usar no celular durante atendimento</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-full">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Prontuário de Papel</h3>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Risco de perda, dano ou extravio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Impossível analisar evolução estatisticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Sem backup — um incêndio perde tudo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Letra ilegível é comum e perigoso</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-full">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mb-5">
                  <Smartphone className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Outros Softwares</h3>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Preços caros: R$79 a R$199/mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Focados em gestão, não em clínica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Sem apoio diagnóstico inteligente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>Curva de aprendizado longa</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Why RehabRoad */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Por que o RehabRoad é diferente?
            </h2>
            <p className="text-lg text-slate-400 text-center max-w-2xl mx-auto mb-12">
              Não é só mais um software de gestão. É um copiloto clínico que te ajuda a pensar.
            </p>
          </AnimateOnScroll>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-2xl p-6 border border-teal-500/30 text-center h-full">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Apoio Diagnóstico</h3>
                <p className="text-sm text-slate-400">
                  Hipóteses diagnósticas geradas automaticamente com base na avaliação
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-6 border border-violet-500/30 text-center h-full">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">NeuroFlux</h3>
                <p className="text-sm text-slate-400">
                  Parâmetros de eletroterapia baseados em evidências científicas
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30 text-center h-full">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">LGPD Completo</h3>
                <p className="text-sm text-slate-400">
                  Conformidade automática com a Lei Geral de Proteção de Dados
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl p-6 border border-rose-500/30 text-center h-full">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">5 Min Setup</h3>
                <p className="text-sm text-slate-400">
                  Comece a usar imediatamente, sem configuração complexa
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-teal-600 to-emerald-600">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto para evoluir sua prática clínica?
            </h2>
            <p className="text-lg text-teal-100 mb-8">
              Teste grátis por 30 dias. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg font-semibold shadow-xl">
                Testar Grátis por 30 Dias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-teal-200 mt-4">
              +200 fisioterapeutas já estão usando
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center text-sm text-slate-500">
          <p>© 2026 RehabRoad. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link to="/termos-de-uso" className="hover:text-slate-400">Termos de Uso</Link>
            {" · "}
            <Link to="/politica-de-privacidade" className="hover:text-slate-400">Política de Privacidade</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
