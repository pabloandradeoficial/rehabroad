import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface CollapsibleStepProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isWarning?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleStep({
  stepNumber,
  title,
  description,
  isCompleted,
  isWarning = false,
  children,
  defaultOpen = false,
}: CollapsibleStepProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      className={cn(
        "rounded-xl border-0 shadow-md overflow-hidden transition-all duration-300",
        isOpen ? "ring-2 ring-primary/20" : "",
        isWarning && isCompleted ? "ring-2 ring-red-500/30" : ""
      )}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-4 p-4 text-left transition-colors",
          isOpen ? "bg-primary/5" : "bg-card hover:bg-muted/50"
        )}
      >
        {/* Step Number / Status */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
            isCompleted && !isWarning
              ? "bg-emerald-500 text-white"
              : isCompleted && isWarning
              ? "bg-red-500 text-white"
              : isOpen
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isCompleted ? (
            isWarning ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )
          ) : (
            <span className="text-sm font-semibold">{stepNumber}</span>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {isCompleted && !isWarning && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                Preenchido
              </span>
            )}
            {isCompleted && isWarning && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-medium">
                Atenção
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-2 bg-card border-t border-border/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
