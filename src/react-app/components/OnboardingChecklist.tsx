import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  X,
  UserPlus,
  ClipboardCheck,
  Target,
  TrendingUp,
  FileText,
  PartyPopper
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Progress } from "@/react-app/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/react-app/components/ui/dialog";
import type { OnboardingProgress } from "@/react-app/hooks/useOnboarding";

interface OnboardingChecklistProps {
  progress: OnboardingProgress;
  onDismiss: () => void;
  showReportPrompt: boolean;
  onDismissReportPrompt: () => void;
  firstEvaluationPatientId: number | null;
}

const stepIcons = {
  patient: UserPlus,
  evaluation: ClipboardCheck,
  objectives: Target,
  evolution: TrendingUp,
  report: FileText,
};

export function OnboardingChecklist({
  progress,
  onDismiss,
  showReportPrompt,
  onDismissReportPrompt,
  firstEvaluationPatientId,
}: OnboardingChecklistProps) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const steps = [
    {
      id: "patient",
      label: "Criar primeiro paciente",
      completed: progress.hasPatient,
      action: () => {/* handled by dialog on dashboard */},
    },
    {
      id: "evaluation",
      label: "Realizar primeira avaliação",
      completed: progress.hasEvaluation,
      action: () => {/* navigate to patient detail */},
    },
    {
      id: "objectives",
      label: "Definir objetivos terapêuticos",
      completed: progress.hasObjectives,
      action: () => {/* navigate to caminho */},
    },
    {
      id: "evolution",
      label: "Registrar primeira evolução",
      completed: progress.hasEvolution,
      action: () => {/* navigate to patient detail */},
    },
    {
      id: "report",
      label: "Gerar primeiro relatório",
      completed: progress.hasReport,
      action: () => navigate("/dashboard/exportacao"),
    },
  ];

  return (
    <>
      {/* Onboarding Checklist Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary" />
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Primeiros Passos
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  {progress.completedCount}/{progress.totalSteps} concluídos
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={onDismiss}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-2">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress 
                      value={progress.percentComplete} 
                      className="h-2 bg-muted"
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    {steps.map((step, index) => {
                      const Icon = stepIcons[step.id as keyof typeof stepIcons];
                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                            step.completed 
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {step.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            </motion.div>
                          ) : (
                            <Circle className="w-5 h-5 flex-shrink-0 opacity-40" />
                          )}
                          <Icon className={`w-4 h-4 flex-shrink-0 ${step.completed ? "text-emerald-600" : "opacity-60"}`} />
                          <span className={`text-sm flex-1 ${step.completed ? "line-through opacity-70" : "font-medium"}`}>
                            {step.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Completion Message */}
                  {progress.percentComplete === 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20 text-center"
                    >
                      <PartyPopper className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Parabéns! Você completou todos os primeiros passos.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sua prática clínica está organizada e pronta para crescer.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={onDismiss}
                      >
                        Fechar guia
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Report Prompt Dialog */}
      <Dialog open={showReportPrompt} onOpenChange={onDismissReportPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Primeira Avaliação Concluída!
            </DialogTitle>
            <DialogDescription>
              Você completou sua primeira avaliação. Deseja gerar seu primeiro relatório profissional agora?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-foreground">Relatório Profissional</p>
                <p className="text-sm text-muted-foreground">
                  Gere um PDF completo com avaliação, objetivos e evoluções do paciente.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onDismissReportPrompt}>
              Depois
            </Button>
            <Button 
              onClick={() => {
                onDismissReportPrompt();
                if (firstEvaluationPatientId) {
                  navigate(`/dashboard/exportacao?paciente=${firstEvaluationPatientId}`);
                } else {
                  navigate("/dashboard/exportacao");
                }
              }}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Gerar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
