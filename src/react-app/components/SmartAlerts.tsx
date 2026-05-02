import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight,
  Flame,
  Clock,
  UserX,
  TrendingDown,
  Star,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { PatientAvatar } from "@/react-app/components/PatientAvatar";
import type { SmartAlert, WeeklyPriority } from "@/react-app/hooks/useSmartAlerts";

interface SmartAlertsProps {
  alerts: SmartAlert[];
  weeklyPriorities: WeeklyPriority[];
  stats: {
    criticalCount: number;
    warningCount: number;
    totalPatientsNeedingAttention: number;
  };
}

const alertTypeIcons = {
  high_pain: Flame,
  no_evolution: Clock,
  inactive: UserX,
  stagnant_pain: TrendingDown,
};

const severityStyles = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-500",
    badge: "bg-red-500/20 text-red-600 border-red-500/30",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "text-amber-500",
    badge: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-500",
    badge: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  },
};

export function SmartAlerts({ alerts, weeklyPriorities, stats }: SmartAlertsProps) {
  const navigate = useNavigate();

  if (alerts.length === 0 && weeklyPriorities.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Smart Alerts Card */}
      {alerts.length > 0 && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-red-500/5 to-amber-500/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertas Inteligentes
              </CardTitle>
              <div className="flex items-center gap-2">
                {stats.criticalCount > 0 && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-xs">
                    {stats.criticalCount} crítico{stats.criticalCount > 1 ? "s" : ""}
                  </Badge>
                )}
                {stats.warningCount > 0 && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                    {stats.warningCount} atenção
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {alerts.slice(0, 4).map((alert, index) => {
                  const Icon = alertTypeIcons[alert.type as keyof typeof alertTypeIcons] || AlertCircle;
                  const styles = severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.info;
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-start gap-3 p-3 rounded-xl ${styles.bg} border ${styles.border} cursor-pointer hover:scale-[1.01] transition-transform`}
                      onClick={() => navigate(`/dashboard/paciente/${alert.patientId}`)}
                    >
                      <div className="relative flex-shrink-0">
                        <PatientAvatar name={alert.patientName} size="sm" />
                        <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full ${styles.bg}`}>
                          <Icon className={`w-2.5 h-2.5 ${styles.icon}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm text-foreground truncate">
                            {alert.patientName}
                          </span>
                          {alert.severity === "critical" && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-600 uppercase tracking-wide">
                              <AlertCircle className="w-3 h-3" />
                              Urgente
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {alert.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {alerts.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground mt-2"
                  onClick={() => navigate("/dashboard/alertas")}
                >
                  Ver todos os {alerts.length} alertas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Priorities Card */}
      {weeklyPriorities.length > 0 && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-emerald-500/5">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Prioridades da Semana
              <Badge variant="secondary" className="text-xs ml-auto">
                {weeklyPriorities.length} paciente{weeklyPriorities.length > 1 ? "s" : ""}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {weeklyPriorities.map((priority, index) => {
                  const priorityColors = {
                    1: "bg-red-500",
                    2: "bg-amber-500",
                    3: "bg-blue-500",
                  };
                  
                  return (
                    <motion.div
                      key={priority.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate(`/dashboard/paciente/${priority.patientId}`)}
                    >
                      <div className="relative flex-shrink-0">
                        <PatientAvatar name={priority.patientName} size="sm" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${priorityColors[priority.priority as keyof typeof priorityColors]} border-2 border-card flex items-center justify-center`}>
                          <span className="text-[9px] font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {priority.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {priority.reason}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            {stats.totalPatientsNeedingAttention > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-center text-muted-foreground">
                  <span className="font-medium text-foreground">{stats.totalPatientsNeedingAttention}</span> paciente{stats.totalPatientsNeedingAttention > 1 ? "s" : ""} precisa{stats.totalPatientsNeedingAttention > 1 ? "m" : ""} de atenção esta semana
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State for Weekly Priorities when only alerts exist */}
      {alerts.length > 0 && weeklyPriorities.length === 0 && (
        <Card className="border-0 shadow-lg border-dashed bg-gradient-to-br from-emerald-500/5 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Tudo em Dia!</h3>
            <p className="text-sm text-muted-foreground">
              Nenhum paciente requer prioridade especial esta semana.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
