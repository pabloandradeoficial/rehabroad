import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface Step {
  id: string;
  label: string;
  isCompleted: boolean;
}

interface StepProgressProps {
  steps: Step[];
  className?: string;
}

export default function StepProgress({ steps, className }: StepProgressProps) {
  const completedCount = steps.filter(s => s.isCompleted).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={cn("bg-card rounded-xl shadow-md p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Progresso do Questionário</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} de {steps.length} seções preenchidas
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step Indicators - Horizontal on desktop, compact on mobile */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: step.isCompleted ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground/50" />
                )}
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1 max-w-[80px] text-center truncate">
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 h-0.5 bg-muted min-w-[20px]">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: step.isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Compact grid */}
      <div className="sm:hidden grid grid-cols-6 gap-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: step.isCompleted ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {step.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/50" />
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
