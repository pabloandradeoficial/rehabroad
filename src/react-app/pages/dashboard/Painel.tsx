import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  User,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  Activity,
  ClipboardList,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Clock,
  TrendingUp,
  Crown,
  Stethoscope,
  Users,
  ChevronRight,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Badge } from "@/react-app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/react-app/components/ui/dialog";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { usePatients, type PatientFormData } from "@/react-app/hooks/usePatients";
import { useAlertasOverview, type AlertOverviewItem } from "@/react-app/hooks/useAlertas";
import { useDashboardStats, getMotivationalMessage } from "@/react-app/hooks/useDashboardStats";
import { useOnboarding } from "@/react-app/hooks/useOnboarding";
import { OnboardingChecklist } from "@/react-app/components/OnboardingChecklist";
import { useSmartAlerts } from "@/react-app/hooks/useSmartAlerts";
import { SmartAlerts } from "@/react-app/components/SmartAlerts";
import { PageTransition, useToast } from "@/react-app/components/ui/microinteractions";
import { PatientAvatar } from "@/react-app/components/PatientAvatar";
import { WelcomeWizard } from "@/react-app/components/WelcomeWizard";
import { PainelSkeleton } from "@/react-app/components/DashboardSkeletons";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PainelPage() {
  const navigate = useNavigate();
  const { user } = useAppAuth();
  const { patients, loading, createPatient, updatePatient, deletePatient } = usePatients();
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("rehabroad_welcomed");
  });
  const { overview } = useAlertasOverview();
  const { stats: dashboardStats, recentActivities } = useDashboardStats();
  const {
    progress: onboardingProgress,
    shouldShowOnboarding,
    dismissOnboarding,
    showReportPrompt,
    dismissReportPrompt,
    firstEvaluationPatientId,
    refetch: refetchOnboarding,
  } = useOnboarding();
  const {
    alerts: smartAlerts,
    weeklyPriorities,
    stats: alertStats,
    loading: alertsLoading,
  } = useSmartAlerts();

  const toast = useToast();

  useEffect(() => {
    if (patients.length > 0) {
      refetchOnboarding();
    }
  }, [patients.length, refetchOnboarding]);

  const motivationalMessage = useMemo(() => getMotivationalMessage(), []);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<number | null>(null);
  const [formData, setFormData] = useState<PatientFormData>({ name: "" });
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [onboardingCollapsed, setOnboardingCollapsed] = useState(false);

  useEffect(() => {
    if (onboardingProgress.completedCount >= 4) {
      setOnboardingCollapsed(true);
    }
  }, [onboardingProgress.completedCount]);

  const pacientesFiltrados = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(busca.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(busca.toLowerCase()))
  );

  const getAlertInfo = (patientId: number): AlertOverviewItem | undefined => {
    return overview.find((o) => o.id === patientId);
  };

  const openNewPatientDialog = () => {
    setEditingPatient(null);
    setFormData({ name: "", birth_date: "", phone: "", email: "", notes: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (patient: (typeof patients)[0]) => {
    setEditingPatient(patient.id);
    setFormData({
      name: patient.name,
      birth_date: patient.birth_date || "",
      phone: patient.phone || "",
      email: patient.email || "",
      notes: patient.notes || "",
    });
    setDialogOpen(true);
  };

  const showSuccess = (message: string) => {
    toast.showSuccess(message);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      if (editingPatient) {
        await updatePatient(editingPatient, formData);
        setDialogOpen(false);
        showSuccess("Paciente atualizado com sucesso");
      } else {
        const newPatient = await createPatient(formData);
        setDialogOpen(false);
        showSuccess("Paciente cadastrado com sucesso");
        if (patients.length === 0) {
          navigate(`/dashboard/paciente/${newPatient.id}`);
        }
      }
    } catch {
      toast.showError("Erro ao salvar paciente. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await deletePatient(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
      showSuccess("Paciente removido");
    } catch {
      toast.showError("Erro ao remover paciente. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleCreateExample = async () => {
    const examplePatient = await createPatient({
      name: "Maria Silva (Exemplo)",
      birth_date: "1985-03-15",
      phone: "(11) 99999-0000",
      email: "exemplo@rehabroad.com.br",
      notes:
        "Paciente exemplo para demonstração do sistema. Você pode editá-lo ou removê-lo a qualquer momento.",
    });

    await fetch(`/api/patients/${examplePatient.id}/evaluations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chief_complaint:
          "Dor lombar crônica com irradiação para membro inferior esquerdo há 6 meses",
        history:
          "Paciente relata início insidioso de dor lombar há 6 meses, com piora progressiva. Trabalha em escritório, passa 8h sentada. Nega trauma. Refere formigamento em face posterior da coxa esquerda.",
        pain_level: 7,
        pain_location: "Lombar com irradiação para MIE",
        functional_status:
          "Dificuldade para sentar por tempo prolongado, subir escadas e carregar objetos",
        orthopedic_tests: "Lasègue positivo 45° à esquerda, Slump positivo, SLR positivo",
        observations:
          "Hipótese: Radiculopatia L5-S1 à esquerda. Sugere-se eletroterapia analgésica e exercícios de estabilização lombar.",
      }),
    });

    await fetch(`/api/patients/${examplePatient.id}/evolutions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pain_level: 5,
        procedures:
          "TENS modo convencional 20min região lombar, Mobilização neural MIE, Exercícios de estabilização segmentar",
        observations:
          "Paciente relata melhora de 30% da dor após 3ª sessão. Formigamento menos intenso. Mantido protocolo.",
        next_session_plan: "Progredir exercícios de core, iniciar treino funcional",
      }),
    });

    localStorage.setItem("rehabroad_welcomed", "true");
    navigate(`/dashboard/paciente/${examplePatient.id}`);
  };

  const handleDismissWelcome = () => {
    localStorage.setItem("rehabroad_welcomed", "true");
    setShowWelcome(false);
  };

  const stats = {
    total: patients.length,
    green: overview.filter((o) => o.status === "green").length,
    yellow: overview.filter((o) => o.status === "yellow").length,
    red: overview.filter((o) => o.status === "red").length,
  };

  if (loading) {
    return <PainelSkeleton />;
  }

  if (showWelcome && patients.length === 0) {
    return (
      <WelcomeWizard
        userName={user?.email?.split("@")[0]}
        onComplete={handleDismissWelcome}
        onCreateExample={handleCreateExample}
      />
    );
  }

  if (patients.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-amber-500/20 to-emerald-500/30 rounded-[2rem] blur-3xl opacity-40" />

            <Card className="relative border-0 shadow-2xl bg-gradient-to-b from-card via-card to-card/95 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-emerald-500" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

              <CardContent className="p-10 md:p-14 relative">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-50" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
                    Bem-vindo ao{" "}
                    <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      REHABROAD
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Sua plataforma de apoio clínico para fisioterapia de excelência
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-3 gap-4 mb-10"
                >
                  {[
                    {
                      icon: Stethoscope,
                      label: "Prontuário Digital",
                      color: "text-primary",
                    },
                    { icon: Zap, label: "NeuroFlux IA", color: "text-amber-500" },
                    {
                      icon: FileText,
                      label: "Laudos em PDF",
                      color: "text-emerald-500",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-xl bg-card/[0.03] border border-white/5"
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                      <p className="text-xs text-muted-foreground">{feature.label}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Button
                    size="lg"
                    onClick={openNewPatientDialog}
                    className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-primary via-primary to-emerald-600 hover:opacity-90 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02] font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Cadastrar Primeiro Paciente
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>

                <p className="text-center text-xs text-muted-foreground mt-8">
                  Todas as informações podem ser editadas posteriormente
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Seu Primeiro Paciente
              </DialogTitle>
              <DialogDescription>
                Preencha os campos principais para iniciar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do paciente"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Queixa Principal</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações iniciais..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="bg-gradient-to-r from-primary to-emerald-600"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Cadastrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="relative">
          <div className="relative p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Activity className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Central de Prontuários
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{motivationalMessage}</span>
                  </p>
                </div>
              </div>

              <Button
                data-onboarding="new-patient-btn"
                onClick={openNewPatientDialog}
                className="gap-2 h-10 bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 shadow-sm font-semibold text-white border-0"
              >
                <Plus className="w-4 h-4" />
                Novo Paciente
              </Button>
            </div>
          </div>
        </motion.div>

        {stats.red > 0 && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={() => navigate("/dashboard/alertas")}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-left hover:bg-rose-500/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  {stats.red} paciente{stats.red !== 1 ? "s" : ""} precisam de atenção imediata
                </p>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-0.5">
                  Clique para ver os alertas críticos
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-500 shrink-0" />
            </button>
          </motion.div>
        )}

        {shouldShowOnboarding && (
          <motion.div variants={itemVariants}>
            {onboardingCollapsed ? (
              <button
                type="button"
                onClick={() => setOnboardingCollapsed(false)}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left hover:bg-emerald-500/15 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Configuração quase completa — {onboardingProgress.completedCount}/{onboardingProgress.totalSteps} passos concluídos
                </p>
                <ChevronRight className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              </button>
            ) : (
              <OnboardingChecklist
                progress={onboardingProgress}
                onDismiss={dismissOnboarding}
                showReportPrompt={showReportPrompt}
                onDismissReportPrompt={dismissReportPrompt}
                firstEvaluationPatientId={firstEvaluationPatientId}
              />
            )}
          </motion.div>
        )}

        {!alertsLoading && (smartAlerts.length > 0 || weeklyPriorities.length > 0) && (
          <motion.div variants={itemVariants}>
            <SmartAlerts
              alerts={smartAlerts}
              weeklyPriorities={weeklyPriorities}
              stats={alertStats}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              {
                value: stats.red,
                label: "Alertas Ativos",
                icon: AlertTriangle,
                gradient: stats.red > 0 ? "from-rose-500 to-red-600" : "from-slate-400 to-slate-500",
                accent: stats.red > 0 ? "border-t-rose-500" : "border-t-slate-400",
                text: stats.red > 0 ? "text-rose-600 dark:text-rose-400 font-black" : "text-muted-foreground",
                onClick: stats.red > 0 ? () => navigate("/dashboard/alertas") : undefined,
              },
              {
                value: dashboardStats.totalPatients,
                label: "Total Pacientes",
                icon: Users,
                gradient: "from-primary to-emerald-500",
                accent: "border-t-primary",
                text: "text-primary",
                onClick: undefined,
              },
              {
                value: dashboardStats.totalEvaluations,
                label: "Avaliações",
                icon: ClipboardList,
                gradient: "from-violet-500 to-purple-500",
                accent: "border-t-violet-500",
                text: "text-violet-600",
                onClick: undefined,
              },
              {
                value: dashboardStats.totalEvolutions,
                label: "Evoluções",
                icon: TrendingUp,
                gradient: "from-emerald-400 to-teal-500",
                accent: "border-t-emerald-500",
                text: "text-emerald-600",
                onClick: undefined,
              },
            ].map((kpi, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={kpi.onClick}
                style={kpi.onClick ? { cursor: "pointer" } : undefined}
              >
                <Card className={`relative overflow-hidden border border-border border-t-2 ${kpi.accent} shadow-sm bg-card`}>
                  <CardContent className="p-3 sm:p-5 relative">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${kpi.text}`}>
                          {kpi.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium truncate">
                          {kpi.label}
                        </p>
                      </div>
                      <div
                        className={`shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md`}
                      >
                        <kpi.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-base font-semibold flex items-center gap-3 text-foreground">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                Visão Geral dos Prontuários
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    value: stats.green,
                    label: "Evolução Adequada",
                    gradient: "from-emerald-500 to-teal-500",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                  },
                  {
                    value: stats.yellow,
                    label: "Atenção Necessária",
                    gradient: "from-amber-500 to-orange-500",
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                  },
                  {
                    value: stats.red,
                    label: "Alerta Crítico",
                    gradient: "from-rose-500 to-red-500",
                    bg: "bg-rose-50",
                    border: "border-rose-200",
                  },
                ].map((status, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 rounded-xl ${status.bg} border ${status.border} text-center cursor-default`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${status.gradient} mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md`}
                    >
                      {status.value}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {status.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="font-bold text-lg text-foreground">
                    Resumo da Sua Prática
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {dashboardStats.totalPatients === 0 ? (
                      "Você ainda não cadastrou nenhum paciente. Comece cadastrando seu primeiro paciente para acompanhar sua prática clínica."
                    ) : (
                      <>
                        Você tem{" "}
                        <span className="text-foreground font-semibold">
                          {dashboardStats.totalPatients} paciente
                          {dashboardStats.totalPatients !== 1 ? "s" : ""}
                        </span>{" "}
                        cadastrado
                        {dashboardStats.totalPatients !== 1 ? "s" : ""}, com{" "}
                        <span className="text-foreground font-semibold">
                          {dashboardStats.totalEvaluations} avaliação
                          {dashboardStats.totalEvaluations !== 1 ? "ões" : ""}
                        </span>{" "}
                        e{" "}
                        <span className="text-foreground font-semibold">
                          {dashboardStats.totalEvolutions} evolução
                          {dashboardStats.totalEvolutions !== 1 ? "ões" : ""}
                        </span>{" "}
                        registrada
                        {dashboardStats.totalEvolutions !== 1 ? "s" : ""}.
                        {stats.red > 0 && (
                          <>
                            {" "}
                            <span className="text-rose-600 font-semibold">
                              {stats.red} paciente{stats.red !== 1 ? "s" : ""}
                            </span>{" "}
                            precisa{stats.red !== 1 ? "m" : ""} de atenção.
                          </>
                        )}
                        {stats.green > 0 && stats.red === 0 && (
                          <>
                            {" "}
                            <span className="text-emerald-600 font-semibold">
                              {stats.green} paciente{stats.green !== 1 ? "s" : ""}
                            </span>{" "}
                            está{stats.green !== 1 ? "ão" : ""} evoluindo bem.
                          </>
                        )}
                      </>
                    )}
                  </p>

                  {dashboardStats.totalPatients > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-700">
                          {stats.green} evoluindo bem
                        </span>
                      </div>
                      {stats.yellow > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-amber-700">
                            {stats.yellow} em acompanhamento
                          </span>
                        </div>
                      )}
                      {stats.red > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-medium text-rose-700">
                            {stats.red} precisa{stats.red !== 1 ? "m" : ""} de atenção
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3 border border-border shadow-sm bg-card overflow-hidden">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-violet-600" />
                  </div>
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nenhuma atividade recente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <motion.div
                        key={`${activity.type}-${activity.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              {activity.description}
                            </span>
                            <span className="font-semibold text-foreground">
                              {" "}
                              — {activity.patientName}
                            </span>
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(activity.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border border-border shadow-sm bg-card overflow-hidden">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  Acesso Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {[
                  {
                    label: "NeuroFlux IA",
                    desc: "Suporte à decisão clínica",
                    href: "/dashboard/neuroflux",
                    icon: Zap,
                    gradient: "from-amber-500 to-orange-500",
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                  },
                  {
                    label: "Exportar Laudo",
                    desc: "Gerar relatório PDF",
                    href: "/dashboard/exportacao",
                    icon: FileText,
                    gradient: "from-violet-500 to-purple-500",
                    bg: "bg-violet-50",
                    border: "border-violet-200",
                  },
                  {
                    label: "Biblioteca",
                    desc: "Exercícios terapêuticos",
                    href: "/dashboard/exercicios",
                    icon: ClipboardList,
                    gradient: "from-emerald-500 to-teal-500",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                  },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(action.href)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl ${action.bg} border ${action.border} hover:shadow-sm transition-all text-left group`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />

            <CardHeader className="pb-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-foreground">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span>Prontuários Ativos</span>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">
                      {pacientesFiltrados.length} paciente(s) cadastrado(s)
                    </p>
                  </div>
                </CardTitle>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="space-y-3">
                {pacientesFiltrados.map((paciente, index) => {
                  const alertInfo = getAlertInfo(paciente.id);
                  const status = alertInfo?.status || "yellow";
                  const statusLabel = alertInfo?.message || "Aguardando avaliação";
                  const statusColors = {
                    green: {
                      bg: "bg-emerald-500",
                      ring: "ring-emerald-500/30",
                      badge: "border-emerald-200 text-emerald-700 bg-emerald-50",
                    },
                    yellow: {
                      bg: "bg-amber-500",
                      ring: "ring-amber-500/30",
                      badge: "border-amber-200 text-amber-700 bg-amber-50",
                    },
                    red: {
                      bg: "bg-rose-500",
                      ring: "ring-rose-500/30",
                      badge: "border-rose-200 text-rose-700 bg-rose-50",
                    },
                  };
                  const colors = statusColors[status];

                  return (
                    <motion.div
                      key={paciente.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/dashboard/paciente/${paciente.id}`)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="relative">
                        <PatientAvatar name={paciente.name} size="md" />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${colors.bg} border-2 border-white ring-2 ${colors.ring}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">
                            {paciente.name}
                          </h3>
                          {paciente.birth_date && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {calculateAge(paciente.birth_date)} anos
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {paciente.notes || "Sem observações registradas"}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(
                          paciente.created_at.replace(" ", "T") + "Z"
                        ).toLocaleDateString("pt-BR")}
                      </div>

                      <Badge variant="outline" className={`shrink-0 ${colors.badge} ${status === "red" ? "font-semibold" : ""}`}>
                        {statusLabel}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(paciente);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(paciente.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  );
                })}

                {pacientesFiltrados.length === 0 && patients.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <Search className="w-12 h-12 text-muted-foreground/40 mb-4" />
                    <p className="text-base font-semibold text-foreground mb-1">Nenhum paciente encontrado</p>
                    <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                      Nenhum resultado para "{busca}". Verifique a grafia ou limpe a busca.
                    </p>
                    <Button onClick={() => setBusca("")} variant="outline" className="gap-2">
                      Limpar busca
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  {editingPatient ? (
                    <Pencil className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                {editingPatient ? "Editar Paciente" : "Novo Paciente"}
              </DialogTitle>
              <DialogDescription>
                {editingPatient
                  ? "Atualize as informações do prontuário."
                  : "Preencha os dados principais do paciente."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do paciente"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Queixa Principal / Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações relevantes sobre o caso..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="bg-gradient-to-r from-primary to-emerald-600"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingPatient ? "Salvar Alterações" : "Cadastrar Paciente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-destructive/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl text-destructive">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground py-4">
              Tem certeza que deseja excluir este prontuário? Esta ação é permanente
              e não pode ser desfeita.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Excluir Prontuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </PageTransition>
  );
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}