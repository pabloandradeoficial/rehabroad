import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, FileText, Brain, Check, ArrowRight, X } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";

interface WelcomeWizardProps {
  userName?: string;
  onComplete: () => void;
  onCreateExample: () => Promise<void>;
}

export function WelcomeWizard({ userName, onComplete, onCreateExample }: WelcomeWizardProps) {
  const [step, setStep] = useState<"welcome" | "creating" | "done">("welcome");
  const [progress, setProgress] = useState(0);

  const handleCreate = async () => {
    setStep("creating");
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onCreateExample();
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setStep("done"), 300);
    } catch {
      clearInterval(interval);
      setProgress(0);
      setStep("welcome");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-500 p-6 text-white relative">
            <button 
              onClick={onComplete}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Bem-vindo ao</p>
                <h2 className="text-xl font-bold">RehabRoad</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "welcome" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Olá{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Quer ver como o sistema funciona na prática? Posso criar um <strong>caso clínico de exemplo</strong> em 30 segundos para você explorar.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: User, text: "Paciente fictício completo" },
                    { icon: FileText, text: "Avaliação e evolução preenchidas" },
                    { icon: Brain, text: "Hipóteses diagnósticas sugeridas" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleCreate}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Criar caso exemplo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onComplete}
                    className="flex-1"
                  >
                    Começar do zero
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "creating" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Criando caso clínico...</h3>
                <p className="text-sm text-slate-500 mb-4">Só mais alguns segundos</p>
                
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Check className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <h3 className="font-semibold text-slate-900 mb-2">Caso criado com sucesso!</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Agora você pode explorar todas as funcionalidades do sistema.
                </p>
                <Button onClick={onComplete} className="w-full">
                  Começar a explorar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
