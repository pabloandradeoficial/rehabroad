import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  FileText,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/react-app/components/ui/card";
import { useClinicalSummary } from "@/react-app/hooks/useClinicalSummary";

interface ClinicalSummaryProps {
  patientId: string | number;
  patientName?: string;
  compact?: boolean;
}

function StatusIndicator({ 
  type, 
  value, 
  label 
}: { 
  type: "pain" | "sessions" | "days" | "change"; 
  value: string | number; 
  label: string 
}) {
  const configs = {
    pain: { icon: Activity, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
    sessions: { icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
    days: { icon: Clock, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/50" },
    change: { icon: Target, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  };

  const { icon: Icon, color, bg } = configs[type];

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}

function ProgressBar({ current, initial }: { current: number; initial: number }) {
  const percentage = initial > 0 ? Math.max(0, Math.min(100, ((initial - current) / initial) * 100)) : 0;
  const isImproving = current < initial;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Evolução da Dor</span>
        <span className={`font-medium ${isImproving ? "text-emerald-600" : "text-amber-600"}`}>
          {initial}/10 → {current}/10
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${isImproving ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-amber-500 to-amber-400"}`}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        {percentage > 0 ? `${Math.round(percentage)}% de melhora` : "Aguardando evolução"}
      </p>
    </div>
  );
}

function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  variant = "default" 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  variant?: "default" | "warning" | "success";
}) {
  const variants = {
    default: { 
      border: "border-border", 
      iconBg: "bg-primary/10", 
      iconColor: "text-primary" 
    },
    warning: { 
      border: "border-amber-200 dark:border-amber-800", 
      iconBg: "bg-amber-100 dark:bg-amber-900/30", 
      iconColor: "text-amber-600 dark:text-amber-400" 
    },
    success: { 
      border: "border-emerald-200 dark:border-emerald-800", 
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30", 
      iconColor: "text-emerald-600 dark:text-emerald-400" 
    },
  };

  const { border, iconBg, iconColor } = variants[variant];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${border} bg-card/50`}>
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function ClinicalSummary({ patientId, patientName, compact = false }: ClinicalSummaryProps) {
  const { summary, loading, error } = useClinicalSummary(patientId);

  const painTrend = useMemo(() => {
    if (!summary?.metrics.painChange) return "stable";
    return summary.metrics.painChange > 0 ? "improving" : summary.metrics.painChange < 0 ? "worsening" : "stable";
  }, [summary?.metrics.painChange]);

  // Transform recommendations into structured actions
  const structuredActions = useMemo(() => {
    if (!summary) return [];
    
    const actions: { icon: React.ElementType; title: string; description: string; variant: "default" | "warning" | "success" }[] = [];
    
    // Based on pain level
    if (summary.metrics.currentPain !== null && summary.metrics.currentPain >= 7) {
      actions.push({
        icon: AlertTriangle,
        title: "Priorizar Analgesia",
        description: "Dor intensa — considerar TENS ou crioterapia",
        variant: "warning"
      });
    }
    
    // Based on pain change
    if (summary.metrics.painChange !== null) {
      if (summary.metrics.painChange >= 3) {
        actions.push({
          icon: CheckCircle,
          title: "Excelente Progresso",
          description: `Redução de ${summary.metrics.painChange} pontos na EVA`,
          variant: "success"
        });
      } else if (summary.metrics.painChange < 0) {
        actions.push({
          icon: AlertTriangle,
          title: "Revisar Conduta",
          description: "Piora sintomática — reavaliar plano",
          variant: "warning"
        });
      }
    }
    
    // Based on sessions
    if (summary.metrics.sessionsCount === 0) {
      actions.push({
        icon: FileText,
        title: "Registrar Evolução",
        description: "Primeira sessão pendente",
        variant: "default"
      });
    } else if (summary.metrics.sessionsCount >= 5 && summary.metrics.painChange !== null && summary.metrics.painChange >= 3) {
      actions.push({
        icon: Target,
        title: "Avaliar Alta",
        description: "Critérios de melhora atingidos",
        variant: "success"
      });
    }
    
    // Based on response pattern
    if (summary.metrics.responsePattern === "positive") {
      actions.push({
        icon: TrendingUp,
        title: "Manter Conduta",
        description: "Boa resposta ao tratamento",
        variant: "success"
      });
    } else if (summary.metrics.responsePattern === "negative") {
      actions.push({
        icon: Stethoscope,
        title: "Reavaliação Necessária",
        description: "Resposta negativa às sessões",
        variant: "warning"
      });
    }
    
    return actions.slice(0, 3); // Max 3 actions
  }, [summary]);

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Stethoscope className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Carregando resumo...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return null;
  }

  if (summary.highlights.length === 0 && !summary.summaryText) {
    return null;
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg border bg-card"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-1">Apoio Clínico</p>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {summary.summaryText}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Apoio Clínico</h3>
                <p className="text-xs text-muted-foreground">
                  {patientName || summary.patientName}
                </p>
              </div>
            </div>
            {summary.metrics.lastSessionDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {new Date(summary.metrics.lastSessionDate).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Status Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatusIndicator 
              type="pain" 
              value={summary.metrics.currentPain !== null ? `${summary.metrics.currentPain}/10` : "—"} 
              label="Dor Atual" 
            />
            <StatusIndicator 
              type="sessions" 
              value={summary.metrics.sessionsCount} 
              label="Sessões" 
            />
            <StatusIndicator 
              type="days" 
              value={summary.metrics.daysSinceStart} 
              label="Dias" 
            />
            <StatusIndicator 
              type="change" 
              value={summary.metrics.painChange !== null ? `${summary.metrics.painChange > 0 ? "-" : "+"}${Math.abs(summary.metrics.painChange)}` : "—"} 
              label="Variação" 
            />
          </div>

          {/* Progress Bar - Only show if we have initial and current pain */}
          {summary.metrics.initialPain !== null && summary.metrics.currentPain !== null && (
            <ProgressBar 
              current={summary.metrics.currentPain} 
              initial={summary.metrics.initialPain} 
            />
          )}

          {/* Trend Indicator */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            painTrend === "improving" 
              ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800" 
              : painTrend === "worsening"
              ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
              : "bg-muted/50 border border-border"
          }`}>
            {painTrend === "improving" ? (
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : painTrend === "worsening" ? (
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground" />
            )}
            <p className={`text-sm font-medium ${
              painTrend === "improving" 
                ? "text-emerald-700 dark:text-emerald-300" 
                : painTrend === "worsening"
                ? "text-amber-700 dark:text-amber-300"
                : "text-muted-foreground"
            }`}>
              {painTrend === "improving" 
                ? "Paciente apresentando melhora" 
                : painTrend === "worsening"
                ? "Atenção: piora sintomática"
                : "Quadro estável"}
            </p>
          </div>

          {/* Action Cards */}
          {structuredActions.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                Pontos de Atenção
              </p>
              <div className="space-y-2">
                {structuredActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ActionCard {...action} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
