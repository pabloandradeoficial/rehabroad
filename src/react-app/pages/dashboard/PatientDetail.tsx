import { useState, useMemo, lazy, Suspense } from "react";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Phone, Mail, FileText, Plus, Activity, CheckCircle, ClipboardList, Clock, Heart, TrendingUp, AlertCircle, MessageCircle, Bell, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { Spinner } from "@/react-app/components/ui/microinteractions";
import { RouteGuard } from "@/react-app/components/layout/RouteGuard";
import { PatientDetailSkeleton } from "@/react-app/components/DashboardSkeletons";
import { usePatient } from "@/react-app/hooks/usePatients";
import { useEvaluations, type EvaluationFormData, type Evaluation } from "@/react-app/hooks/useEvaluations";
import { useEvolutions, type EvolutionFormData, type Evolution } from "@/react-app/hooks/useEvolutions";
import { useAlertStatus } from "@/react-app/hooks/useAlertas";
import ClinicalSummary from "@/react-app/components/ClinicalSummary";
import NeuroFluxQuickAccess from "@/react-app/components/NeuroFluxQuickAccess";
import { useToast } from "@/react-app/components/ui/microinteractions";
import { PatientAvatar } from "@/react-app/components/PatientAvatar";
import { openWhatsApp, createContactMessage } from "@/react-app/lib/whatsapp";
import { getSuggestedExercises, exerciseCategories } from "@/data/exercises";
const PatientProgressDashboard = lazy(() => import("@/react-app/components/PatientProgressDashboard"));
import HepPlanManager from "@/react-app/components/HepPlanManager";
import { useFocusFirstInput } from "@/react-app/hooks/useFocusFirstInput";
import { PatientDeleteDialog } from "@/react-app/components/patient-detail/PatientDeleteDialog";
import { PatientReminderDialog } from "@/react-app/components/patient-detail/PatientReminderDialog";
import { PatientEvaluationDialog } from "@/react-app/components/patient-detail/PatientEvaluationDialog";
import { PatientEvolutionDialog } from "@/react-app/components/patient-detail/PatientEvolutionDialog";
import { PatientEvaluationsTab } from "@/react-app/components/patient-detail/PatientEvaluationsTab";
import { PatientEvolutionsTab } from "@/react-app/components/patient-detail/PatientEvolutionsTab";

const termosParaRegiao: Record<string, string> = {
  "pescoço": "cervical", "cervical": "cervical", "nuca": "cervical",
  "lombar": "lombar", "costas": "lombar", "coluna": "lombar", "ciático": "lombar", "ciática": "lombar",
  "ombro": "ombro", "cotovelo": "cotovelo",
  "punho": "punho", "mão": "punho", "carpo": "punho",
  "quadril": "quadril", "virilha": "quadril",
  "joelho": "joelho", "tornozelo": "tornozelo", "pé": "tornozelo",
};

function detectarRegiao(texto: string): string | null {
  if (!texto) return null;
  const lower = texto.toLowerCase().trim();
  for (const [keyword, regiao] of Object.entries(termosParaRegiao)) {
    if (lower.includes(keyword)) return regiao;
  }
  return null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, loading: patientLoading } = usePatient(id!);
  const { evaluations, loading: evalLoading, createEvaluation, updateEvaluation } = useEvaluations(id!);
  const { evolutions, loading: evolLoading, createEvolution, updateEvolution } = useEvolutions(id!);
  const { alertStatus } = useAlertStatus(id!);

  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [evolDialogOpen, setEvolDialogOpen] = useState(false);
  const focusEvolRef = useFocusFirstInput(evolDialogOpen);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [evalForm, setEvalForm] = useState<EvaluationFormData>({
    type: "initial", chief_complaint: "", history: "", pain_level: 5,
    pain_location: "", functional_status: "", orthopedic_tests: "", observations: "",
  });

  const [evolForm, setEvolForm] = useState<EvolutionFormData>({
    session_date: new Date().toISOString().split("T")[0],
    pain_level: 5, functional_status: "", procedures: "",
    patient_response: "", observations: "", attendance_status: "attended",
  });
  const [scribedFields, setScribedFields] = useState<string[]>([]);

  const regiaoDetectada = useMemo(() => detectarRegiao(evalForm.pain_location || ""), [evalForm.pain_location]);

  const activitySummary = useMemo(() => {
    const allDates: Date[] = [];
    evaluations.forEach(e => { if (e.created_at) allDates.push(new Date(e.created_at)); });
    evolutions.forEach(e => {
      if (e.created_at) allDates.push(new Date(e.created_at));
      if (e.session_date) allDates.push(new Date(e.session_date));
    });
    const lastUpdate = allDates.length > 0 ? new Date(Math.max(...allDates.map(d => d.getTime()))) : null;
    const daysSinceLastActivity = lastUpdate ? Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)) : null;
    const needsReminder = daysSinceLastActivity !== null && daysSinceLastActivity >= 7 && evaluations.length > 0;
    return { totalEvaluations: evaluations.length, totalEvolutions: evolutions.length, lastUpdate, daysSinceLastActivity, needsReminder };
  }, [evaluations, evolutions]);

  // Exercícios sugeridos baseados na avaliação mais recente
  const suggestedExercises = useMemo(() => {
    if (evaluations.length === 0) return [];
    const latestEval = evaluations[0]; // Assumindo que a mais recente está primeiro
    return getSuggestedExercises(latestEval.pain_location, latestEval.chief_complaint, 6);
  }, [evaluations]);

  const getCategoryInfo = (categoryId: string) => {
    return exerciseCategories.find(c => c.id === categoryId) || { name: categoryId, icon: "💪", color: "from-gray-500 to-gray-600" };
  };

  const showSuccess = (message: string) => toast.showSuccess(message);

  const handleSaveEvaluation = async () => {
    setSaving(true);
    try {
      if (editingEvaluation) {
        await updateEvaluation(editingEvaluation.id, evalForm);
        showSuccess("Avaliação atualizada com sucesso");
      } else {
        await createEvaluation(evalForm);
        showSuccess("Avaliação registrada com sucesso");
      }
      setEvalDialogOpen(false);
      setEditingEvaluation(null);
      setEvalForm({ type: "initial", chief_complaint: "", history: "", pain_level: 5, pain_location: "", functional_status: "", orthopedic_tests: "", observations: "" });
    } catch { toast.showError("Erro ao salvar avaliação. Tente novamente."); }
    finally { setSaving(false); }
  };

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setEvalForm({
      type: evaluation.type, chief_complaint: evaluation.chief_complaint || "", history: evaluation.history || "",
      pain_level: evaluation.pain_level ?? 5, pain_location: evaluation.pain_location || "",
      functional_status: evaluation.functional_status || "", orthopedic_tests: evaluation.orthopedic_tests || "",
      observations: evaluation.observations || "",
    });
    setEvalDialogOpen(true);
  };

  const handleNewEvaluation = () => {
    setEditingEvaluation(null);
    setEvalForm({ type: "initial", chief_complaint: "", history: "", pain_level: 5, pain_location: "", functional_status: "", orthopedic_tests: "", observations: "" });
    setEvalDialogOpen(true);
  };

  const handleSaveEvolution = async () => {
    if ((evolForm.procedures || "").trim().length < 10) {
      toast.showError("Procedimentos devem ter pelo menos 10 caracteres.");
      return;
    }
    setSaving(true);
    try {
      if (editingEvolution) {
        await updateEvolution(editingEvolution.id, evolForm);
        showSuccess("Evolução atualizada com sucesso");
      } else {
        await createEvolution(evolForm);
        showSuccess("Evolução registrada com sucesso");
      }
      setEvolDialogOpen(false);
      setEditingEvolution(null);
      setScribedFields([]);
      setEvolForm({ session_date: new Date().toISOString().split("T")[0], pain_level: 5, functional_status: "", procedures: "", patient_response: "", observations: "" });
    } catch { toast.showError("Erro ao salvar evolução. Tente novamente."); }
    finally { setSaving(false); }
  };

  const handleEditEvolution = (evolution: Evolution) => {
    setEditingEvolution(evolution);
    setEvolForm({
      session_date: evolution.session_date || new Date().toISOString().split("T")[0],
      pain_level: evolution.pain_level || 5,
      functional_status: evolution.functional_status || "",
      procedures: evolution.procedures || "",
      patient_response: evolution.patient_response || "",
      observations: evolution.observations || "",
      attendance_status: evolution.attendance_status || "attended",
    });
    setEvolDialogOpen(true);
  };

  const handleNewEvolution = () => {
    setEditingEvolution(null);
    setScribedFields([]);
    setEvolForm({ session_date: new Date().toISOString().split("T")[0], pain_level: 5, functional_status: "", procedures: "", patient_response: "", observations: "", attendance_status: "attended" });
    setEvolDialogOpen(true);
  };

  const isNewPatient = evaluations.length === 0 && evolutions.length === 0;
  const statusColors = {
    green: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
    yellow: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
    red: { bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" },
  };
  const currentStatus = alertStatus?.status || "yellow";
  const colors = statusColors[currentStatus];

  return (
    <RouteGuard
      isLoading={patientLoading}
      isError={false}
      skeleton={<PatientDetailSkeleton />}
    >
    <>
      <div className="md:hidden">
        <MobileHeader showBack />
      </div>
      <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        
        {/* === HEADER LIMPO === */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />

            <div className="relative p-6 md:p-8">
              {/* Back Button & Delete Button */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")} 
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDeleteDialogOpen(true)} 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-8 md:pt-4">
                {/* Avatar Section */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <PatientAvatar name={patient?.name || ""} size="xl" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${colors.bg} border-4 border-white flex items-center justify-center`}>
                      {currentStatus === "green" && <CheckCircle className="w-3 h-3 text-white" />}
                      {currentStatus === "yellow" && <Clock className="w-3 h-3 text-white" />}
                      {currentStatus === "red" && <AlertCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground truncate" title={patient?.name}>{patient?.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Prontuário Eletrônico</p>
                  </div>
                </div>

                {/* Patient Info Cards */}
                <div className="flex-1 flex flex-wrap items-center gap-3 md:justify-end">
                  {patient?.birth_date && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{calculateAge(patient.birth_date)} anos</span>
                    </div>
                  )}
                  {patient?.phone && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-foreground">{patient.phone}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openWhatsApp(patient.phone!, createContactMessage(patient.name, ""))}
                        className="h-10 px-3 gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden md:inline">WhatsApp</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReminderDialogOpen(true)}
                        className="h-10 px-3 gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-50"
                      >
                        <Bell className="w-4 h-4" />
                        <span className="hidden md:inline">Lembrete</span>
                      </Button>
                    </div>
                  )}
                  {patient?.email && (
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border">
                      <Mail className="w-4 h-4 text-violet-500" />
                      <span className="text-sm text-foreground">{patient.email}</span>
                    </div>
                  )}
                  {alertStatus && (
                    <Badge className={`px-4 py-2 text-sm font-semibold ${colors.border} ${colors.text} ${colors.bgLight}`}>
                      {alertStatus.message}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Patient Notes */}
              {patient?.notes && (
                <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-slate-300 leading-relaxed">{patient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* === QUICK STATS === */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-3 md:px-0">
            {[
              { value: activitySummary.totalEvaluations, label: "Avaliações", icon: ClipboardList, gradient: "from-primary via-emerald-500 to-teal-500", text: "text-primary" },
              { value: activitySummary.totalEvolutions, label: "Evoluções", icon: TrendingUp, gradient: "from-emerald-400 via-green-500 to-teal-500", text: "text-emerald-400" },
              { value: evaluations[0]?.pain_level ?? "—", label: "Dor Inicial", icon: Heart, gradient: "from-rose-500 via-red-500 to-orange-500", text: "text-rose-400" },
              { value: evolutions[0]?.pain_level ?? "—", label: "Dor Atual", icon: Activity, gradient: "from-violet-500 via-purple-500 to-fuchsia-500", text: "text-violet-400" },
            ].map((stat, i) => (
              <Card key={i} className="border border-border shadow-md bg-card overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className={`text-xl md:text-3xl font-black ${stat.text}`}>{stat.value}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* === CLINICAL SUMMARY === */}
        {!evalLoading && !evolLoading && !isNewPatient && (
          <motion.div variants={itemVariants}>
            <ClinicalSummary patientId={id!} patientName={patient?.name || ""} />
          </motion.div>
        )}

        {/* === NEUROFLUX QUICK ACCESS === */}
        {!evalLoading && evaluations.length > 0 && (
          <motion.div variants={itemVariants}>
            <NeuroFluxQuickAccess evaluations={evaluations} />
          </motion.div>
        )}

        {/* === REMINDER ALERT === */}
        {activitySummary.needsReminder && (
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-indigo-500/10 border border-blue-500/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Considere registrar nova evolução
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Última atividade há {activitySummary.daysSinceLastActivity} dias
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={handleNewEvolution} className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
                  <Plus className="w-4 h-4 mr-1" />
                  Registrar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* === NEW PATIENT WELCOME === */}
        {isNewPatient && !evalLoading && !evolLoading && (
          <motion.div variants={itemVariants}>
            <Card className="border border-border shadow-lg bg-card overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />
              <CardContent className="p-8 text-center relative">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground">Comece a Documentação</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Registre a primeira avaliação do paciente para iniciar o acompanhamento clínico estruturado.
                </p>
                <Button size="lg" onClick={handleNewEvaluation} className="h-12 px-8 bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeira Avaliação
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* === TABS SECTION === */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-lg bg-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />
            
            <Tabs defaultValue="evaluations" className="w-full">
              <div className="px-4 py-3 border-b border-border overflow-x-auto scrollbar-none">
                <TabsList className="w-max md:w-auto bg-muted border border-border p-1.5 rounded-xl">
                  <TabsTrigger
                    value="evaluations"
                    data-onboarding="evaluations-tab"
                    className="flex-1 md:flex-none gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all font-semibold text-muted-foreground data-[state=active]:shadow-lg"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Avaliações
                    {evaluations.length > 0 && (
                      <Badge className="h-5 px-2 text-xs bg-primary/20 text-primary border-0">{evaluations.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="evolutions"
                    className="flex-1 md:flex-none gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all font-semibold text-muted-foreground data-[state=active]:shadow-lg"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Evoluções
                    {evolutions.length > 0 && (
                      <Badge className="h-5 px-2 text-xs bg-emerald-500/20 text-emerald-600 border-0">{evolutions.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="progress"
                    className="flex-1 md:flex-none gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all font-semibold text-muted-foreground data-[state=active]:shadow-lg"
                  >
                    <Activity className="w-4 h-4" />
                    Progresso
                  </TabsTrigger>
                  <TabsTrigger
                    value="hep"
                    className="flex-1 md:flex-none gap-2 px-6 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all font-semibold text-muted-foreground data-[state=active]:shadow-lg"
                  >
                    🏠 Plano Domiciliar
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="evaluations" className="p-5 space-y-5">
                <PatientEvaluationsTab
                  evaluations={evaluations}
                  loading={evalLoading}
                  onNew={handleNewEvaluation}
                  onEdit={handleEditEvaluation}
                  suggestedExercises={suggestedExercises}
                  getCategoryInfo={getCategoryInfo}
                />
              </TabsContent>

              <TabsContent value="evolutions" className="p-5 space-y-5">
                <PatientEvolutionsTab
                  evolutions={evolutions}
                  evaluations={evaluations}
                  loading={evolLoading}
                  onNew={handleNewEvolution}
                  onEdit={handleEditEvolution}
                />
              </TabsContent>

              {/* === PROGRESS TAB === */}
              <TabsContent value="progress" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Progresso do Paciente</h2>
                    <p className="text-sm text-muted-foreground">Evolução clínica ao longo das sessões</p>
                  </div>
                </div>
                <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
                  <PatientProgressDashboard patientId={id!} />
                </Suspense>
              </TabsContent>

              {/* === HEP TAB === */}
              <TabsContent value="hep" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Plano de Exercícios Domiciliares</h2>
                    <p className="text-sm text-muted-foreground">Prescreva exercícios para o paciente realizar entre as sessões</p>
                  </div>
                </div>
                <HepPlanManager patientId={Number(patient?.id) || 0} patientPhone={patient?.phone || ""} patientEmail={patient?.email || ""} />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        <PatientEvaluationDialog
          open={evalDialogOpen}
          onOpenChange={(open) => { setEvalDialogOpen(open); if (!open) setEditingEvaluation(null); }}
          form={evalForm}
          setForm={setEvalForm}
          editing={editingEvaluation}
          saving={saving}
          regiaoDetectada={regiaoDetectada}
          onSave={handleSaveEvaluation}
        />

        <PatientEvolutionDialog
          open={evolDialogOpen}
          onOpenChange={setEvolDialogOpen}
          form={evolForm}
          setForm={setEvolForm}
          editing={editingEvolution}
          saving={saving}
          patientId={Number(patient?.id) || 0}
          scribedFields={scribedFields}
          setScribedFields={setScribedFields}
          focusRef={focusEvolRef}
          onSave={handleSaveEvolution}
        />

        <PatientReminderDialog
          open={reminderDialogOpen}
          onOpenChange={setReminderDialogOpen}
          patientName={patient?.name || ""}
          patientPhone={patient?.phone}
        />

        <PatientDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          patientId={id!}
          patientName={patient?.name || ""}
        />

      </motion.div>
      </>
    </>
    </RouteGuard>
  );
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
