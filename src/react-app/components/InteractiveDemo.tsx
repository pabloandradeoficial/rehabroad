import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  Brain, 
  Zap,
  FileText,
  RotateCcw
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";

type Step = "intro" | "q1" | "q2" | "q3" | "result";

interface Answer {
  location?: string;
  test?: string;
  symptom?: string;
}

export function InteractiveDemo({ onCTA }: { onCTA: () => void }) {
  const [step, setStep] = useState<Step>("intro");

  const reset = () => {
    setStep("intro");
  };

  const selectAnswer = (key: keyof Answer) => {
    if (key === "location") setStep("q2");
    else if (key === "test") setStep("q3");
    else if (key === "symptom") setStep("result");
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium mb-4">
            <Stethoscope className="w-4 h-4" />
            Demo Interativa
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Experimente um caso clínico agora
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Teste o raciocínio clínico do RehabRoad sem criar conta
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 sm:p-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="bg-slate-900/80 rounded-xl p-4 sm:p-5 border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Caso Clínico</p>
                  <p className="text-white text-base sm:text-lg">
                    Paciente com <strong className="text-teal-400">dor lombar irradiada para perna esquerda</strong> há 3 semanas.
                  </p>
                </div>
                <div className="relative inline-block">
                  {/* Pulse animation ring */}
                  <span className="absolute inset-0 rounded-md bg-violet-500 animate-ping opacity-30" />
                  <Button 
                    onClick={() => setStep("q1")}
                    className="relative w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 shadow-lg shadow-violet-500/30"
                  >
                    Iniciar Avaliação
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-3 animate-pulse">👆 Clique para começar</p>
              </motion.div>
            )}

            {step === "q1" && (
              <motion.div
                key="q1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepIndicator current={1} total={3} />
                <h3 className="text-white font-semibold text-lg">Localização da dor:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "lombar", label: "Lombar" },
                    { value: "lombar_irradiacao", label: "Lombar com irradiação" },
                    { value: "cervical", label: "Cervical" },
                    { value: "ombro", label: "Ombro" }
                  ].map(opt => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      onClick={() => selectAnswer("location")}
                      highlight={opt.value === "lombar_irradiacao"}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "q2" && (
              <motion.div
                key="q2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepIndicator current={2} total={3} />
                <h3 className="text-white font-semibold text-lg">Teste positivo:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "lasegue", label: "Lasègue" },
                    { value: "slump", label: "Slump" },
                    { value: "reflexo", label: "Reflexo alterado" }
                  ].map(opt => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      onClick={() => selectAnswer("test")}
                      highlight={opt.value === "lasegue" || opt.value === "slump"}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "q3" && (
              <motion.div
                key="q3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <StepIndicator current={3} total={3} />
                <h3 className="text-white font-semibold text-lg">Sintoma associado:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "parestesia", label: "Parestesia" },
                    { value: "forca", label: "Perda de força" },
                    { value: "mecanica", label: "Dor mecânica" }
                  ].map(opt => (
                    <OptionButton
                      key={opt.value}
                      label={opt.label}
                      onClick={() => selectAnswer("symptom")}
                      highlight={opt.value === "parestesia"}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Hypothesis */}
                <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl p-4 border border-violet-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-300 uppercase tracking-wide mb-1">Hipótese Clínica Sugerida</p>
                      <h4 className="text-xl font-bold text-white">Radiculopatia Lombar L5</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-[92%] bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
                        </div>
                        <span className="text-sm text-teal-400 font-medium">92% confiança</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tests */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Testes Sugeridos</p>
                  <ul className="space-y-1">
                    {["Slump Test", "Lasègue cruzado", "Reflexo patelar"].map(test => (
                      <li key={test} className="flex items-center gap-2 text-white text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* NeuroFlux */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Conduta Inicial (NeuroFlux)</p>
                  <div className="flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">TENS analgésico • 100Hz • 20min</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    onClick={onCTA}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Testar o sistema completo gratuitamente
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={reset}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recomeçar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < current ? "bg-violet-500" : "bg-slate-700"
          }`}
        />
      ))}
      <span className="text-xs text-slate-500 ml-2">{current}/{total}</span>
    </div>
  );
}

function OptionButton({ 
  label, 
  onClick, 
  highlight 
}: { 
  label: string; 
  onClick: () => void; 
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-left transition-all border ${
        highlight 
          ? "bg-violet-600/20 border-violet-500/50 hover:bg-violet-600/30" 
          : "bg-slate-900/60 border-slate-700 hover:bg-slate-800"
      }`}
    >
      <span className="text-white font-medium">{label}</span>
    </button>
  );
}
