import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Bell, CircleDot, TrendingUp, TrendingDown, Minus, Info, RefreshCw, ChevronRight, BarChart3, Activity, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { useAlertasOverview } from "@/react-app/hooks/useAlertas";
import PremiumGate from "@/react-app/components/PremiumGate";
import { PageTransition, Spinner } from "@/react-app/components/ui/microinteractions";
import { PatientAvatar } from "@/react-app/components/PatientAvatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const statusConfig = {
  green: {
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    cardBg: "from-emerald-500/10 to-green-500/5",
    glow: "shadow-emerald-500/20",
    label: "Evolução Registrada",
    description: "Registros indicam progressão documentada",
  },
  yellow: {
    color: "bg-amber-500",
    gradient: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    cardBg: "from-amber-500/10 to-orange-500/5",
    glow: "shadow-amber-500/20",
    label: "Atenção Sugerida",
    description: "Pode indicar necessidade de reavaliação",
  },
  red: {
    color: "bg-red-500",
    gradient: "from-red-500 to-rose-600",
    bgLight: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    cardBg: "from-red-500/10 to-rose-500/5",
    glow: "shadow-red-500/20",
    label: "Verificar Prontuário",
    description: "Registros sugerem atenção do profissional",
  },
};

function AlertasContent() {
  const navigate = useNavigate();
  const { overview, loading, refetch } = useAlertasOverview();

  const stats = {
    green: overview.filter(o => o.status === "green").length,
    yellow: overview.filter(o => o.status === "yellow").length,
    red: overview.filter(o => o.status === "red").length,
    total: overview.length
  };

  const sortedOverview = [...overview].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return order[a.status] - order[b.status];
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Imperial Header */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-primary/5 to-rose-500/5 rounded-3xl blur-xl" />
          <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-primary rounded-2xl blur-lg opacity-40" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-primary flex items-center justify-center shadow-xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                    Indicadores de Acompanhamento
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitoramento estruturado do progresso clínico
                  </p>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={refetch} 
                className="gap-2 border-white/10 hover:bg-white/[0.05]"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: stats.total, label: "Total Pacientes", icon: Users, gradient: "from-primary to-primary/80", glow: "shadow-primary/20" },
            { value: stats.green, label: "Evoluindo", icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", glow: "shadow-emerald-500/20" },
            { value: stats.yellow, label: "Atenção", icon: Activity, gradient: "from-amber-500 to-amber-600", glow: "shadow-amber-500/20" },
            { value: stats.red, label: "Verificar", icon: Bell, gradient: "from-red-500 to-rose-600", glow: "shadow-red-500/20" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03]`} />
              <Card className="relative border-0 shadow-lg bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.glow}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Card */}
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/20">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Indicadores Visuais</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Os indicadores são gerados com base nas informações registradas no prontuário pelo profissional.
                  <strong className="text-foreground"> São apenas sinalizações visuais</strong> para facilitar a organização clínica. 
                  Não representam diagnóstico e não substituem a reavaliação presencial.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Legend */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
            <Card key={status} className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/95 to-card/80 group hover:shadow-xl transition-all">
              <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig[status].cardBg} opacity-50`} />
              <CardContent className="relative flex items-center gap-4 py-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConfig[status].gradient} flex items-center justify-center shadow-lg ${statusConfig[status].glow}`}>
                  <CircleDot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-bold ${statusConfig[status].text}`}>{statusConfig[status].label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{statusConfig[status].description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Alerts List */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Prontuários por Status</CardTitle>
              <CardDescription>Organizados conforme indicadores registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedOverview.map((alerta, index) => (
                  <motion.div
                    key={alerta.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    onClick={() => navigate(`/dashboard/paciente/${alerta.id}`)}
                    className={`relative p-4 rounded-2xl border ${statusConfig[alerta.status].border} bg-gradient-to-br ${statusConfig[alerta.status].cardBg} transition-all hover:shadow-lg cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Patient Avatar with Status Ring */}
                        <div className="relative shrink-0">
                          <PatientAvatar name={alerta.name} size="md" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${statusConfig[alerta.status].gradient} border-2 border-card flex items-center justify-center`}>
                            {alerta.status === "green" && <TrendingUp className="w-2.5 h-2.5 text-white" />}
                            {alerta.status === "yellow" && <Minus className="w-2.5 h-2.5 text-white" />}
                            {alerta.status === "red" && <TrendingDown className="w-2.5 h-2.5 text-white" />}
                          </div>
                        </div>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-foreground truncate">{alerta.name}</h3>
                            <Badge variant="outline" className={`${statusConfig[alerta.status].text} border-current/30 text-xs shrink-0`}>
                              {statusConfig[alerta.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{alerta.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {alerta.evolutionCount} {alerta.evolutionCount === 1 ? "evolução" : "evoluções"}
                          </p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </motion.div>
                ))}

                {sortedOverview.length === 0 && (
                  <div className="text-center py-14">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground mb-4">Nenhum paciente cadastrado</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/dashboard")}
                      className="gap-2"
                    >
                      Ir para o Painel
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.p variants={itemVariants} className="text-xs text-center text-muted-foreground px-4">
          Indicadores baseados em registros do prontuário. A interpretação é responsabilidade do profissional.
        </motion.p>
      </motion.div>
    </PageTransition>
  );
}

export default function AlertasPage() {
  return (
    <PremiumGate moduleName="Indicadores">
      <AlertasContent />
    </PremiumGate>
  );
}
