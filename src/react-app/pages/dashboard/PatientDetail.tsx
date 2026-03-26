import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Phone, Mail, FileText, Plus, Loader2, Activity, CheckCircle, ClipboardList, Clock, Lightbulb, ExternalLink, Pencil, Heart, TrendingUp, Stethoscope, AlertCircle, MessageCircle, Bell, Send, Trash2, Dumbbell, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/react-app/components/ui/dialog";
import { Label } from "@/react-app/components/ui/label";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Slider } from "@/react-app/components/ui/slider";
import { usePatient } from "@/react-app/hooks/usePatients";
import { useEvaluations, type EvaluationFormData, type Evaluation } from "@/react-app/hooks/useEvaluations";
import { useEvolutions, type EvolutionFormData, type Evolution } from "@/react-app/hooks/useEvolutions";
import { useAlertStatus } from "@/react-app/hooks/useAlertas";
import { regioes } from "@/react-app/data/testesOrtopedicos";
import ClinicalSummary from "@/react-app/components/ClinicalSummary";
import EvolutionChart from "@/react-app/components/EvolutionChart";
import NeuroFluxQuickAccess from "@/react-app/components/NeuroFluxQuickAccess";
import { PageTransition, Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { PatientAvatar } from "@/react-app/components/PatientAvatar";
import { openWhatsApp, createContactMessage, createReminderMessage } from "@/react-app/lib/whatsapp";
import { getSuggestedExercises, exerciseCategories } from "@/data/exercises";
import ClinicalInsights from "@/react-app/components/ClinicalInsights";
import { HighlightedADM } from "@/react-app/lib/admHighlight";

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
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [editingEvolution, setEditingEvolution] = useState<Evolution | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Reminder form state
  const [reminderForm, setReminderForm] = useState({
    type: "appointment" as "appointment" | "followup" | "custom",
    date: "",
    time: "",
    customMessage: "",
  });

  const [evalForm, setEvalForm] = useState<EvaluationFormData>({
    type: "initial", chief_complaint: "", history: "", pain_level: 5,
    pain_location: "", functional_status: "", orthopedic_tests: "", observations: "",
  });

  const [evolForm, setEvolForm] = useState<EvolutionFormData>({
    session_date: new Date().toISOString().split("T")[0],
    pain_level: 5, functional_status: "", procedures: "",
    patient_response: "", observations: "", attendance_status: "attended",
  });

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
    } catch (err) { console.error(err); }
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
      setEvolForm({ session_date: new Date().toISOString().split("T")[0], pain_level: 5, functional_status: "", procedures: "", patient_response: "", observations: "" });
    } catch (err) { console.error(err); }
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
    setEvolForm({ session_date: new Date().toISOString().split("T")[0], pain_level: 5, functional_status: "", procedures: "", patient_response: "", observations: "", attendance_status: "attended" });
    setEvolDialogOpen(true);
  };

  const handleDeletePatient = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete patient");
      toast.showSuccess("Paciente excluído com sucesso");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.showError("Erro ao excluir paciente");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSendReminder = () => {
    if (!patient?.phone) {
      toast.showError("Paciente não possui telefone cadastrado");
      return;
    }

    // Get professional name from localStorage
    const savedProfile = localStorage.getItem("rehabroad_professional_profile");
    const professionalName = savedProfile ? JSON.parse(savedProfile).name || "Seu Fisioterapeuta" : "Seu Fisioterapeuta";

    let message = "";
    
    if (reminderForm.type === "appointment" && reminderForm.date) {
      const dateFormatted = new Date(reminderForm.date + "T12:00:00").toLocaleDateString("pt-BR");
      message = createReminderMessage(patient.name, professionalName, dateFormatted, reminderForm.time || undefined);
    } else if (reminderForm.type === "followup") {
      message = createReminderMessage(patient.name, professionalName);
    } else if (reminderForm.type === "custom" && reminderForm.customMessage) {
      message = createReminderMessage(patient.name, professionalName, undefined, undefined, reminderForm.customMessage);
    }

    if (message) {
      openWhatsApp(patient.phone, message);
      setReminderDialogOpen(false);
      setReminderForm({ type: "appointment", date: "", time: "", customMessage: "" });
      toast.showSuccess("WhatsApp aberto com a mensagem");
    }
  };

  if (patientLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Paciente não encontrado</p>
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="mt-4">Voltar ao Painel</Button>
      </div>
    );
  }

  const isNewPatient = evaluations.length === 0 && evolutions.length === 0;
  const statusColors = {
    green: { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/40", bgLight: "bg-emerald-500/10" },
    yellow: { bg: "bg-amber-500", text: "text-amber-500", border: "border-amber-500/40", bgLight: "bg-amber-500/10" },
    red: { bg: "bg-rose-500", text: "text-rose-500", border: "border-rose-500/40", bgLight: "bg-rose-500/10" },
  };
  const currentStatus = alertStatus?.status || "yellow";
  const colors = statusColors[currentStatus];

  return (
    <PageTransition>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        
        {/* === HEADER LIMPO === */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-white border border-border shadow-sm">
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
                    <PatientAvatar name={patient.name} size="xl" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${colors.bg} border-4 border-white flex items-center justify-center`}>
                      {currentStatus === "green" && <CheckCircle className="w-3 h-3 text-white" />}
                      {currentStatus === "yellow" && <Clock className="w-3 h-3 text-white" />}
                      {currentStatus === "red" && <AlertCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{patient.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Prontuário Eletrônico</p>
                  </div>
                </div>

                {/* Patient Info Cards */}
                <div className="flex-1 flex flex-wrap items-center gap-3 md:justify-end">
                  {patient.birth_date && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-border">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{calculateAge(patient.birth_date)} anos</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-border">
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
                  {patient.email && (
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-border">
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
              {patient.notes && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-border">
                  <p className="text-sm text-slate-300 leading-relaxed">{patient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* === QUICK STATS === */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: activitySummary.totalEvaluations, label: "Avaliações", icon: ClipboardList, gradient: "from-primary via-emerald-500 to-teal-500", text: "text-primary" },
              { value: activitySummary.totalEvolutions, label: "Evoluções", icon: TrendingUp, gradient: "from-emerald-400 via-green-500 to-teal-500", text: "text-emerald-400" },
              { value: evaluations[0]?.pain_level ?? "—", label: "Dor Inicial", icon: Heart, gradient: "from-rose-500 via-red-500 to-orange-500", text: "text-rose-400" },
              { value: evolutions[0]?.pain_level ?? "—", label: "Dor Atual", icon: Activity, gradient: "from-violet-500 via-purple-500 to-fuchsia-500", text: "text-violet-400" },
            ].map((stat, i) => (
              <Card key={i} className="border border-border shadow-md bg-white overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl md:text-3xl font-black ${stat.text}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <stat.icon className="w-5 h-5 text-white" />
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
            <ClinicalSummary patientId={id!} patientName={patient.name} />
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
            <Card className="border border-border shadow-lg bg-white overflow-hidden relative">
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
          <Card className="border border-border shadow-lg bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-emerald-500" />
            
            <Tabs defaultValue="evaluations" className="w-full">
              <div className="p-4 border-b border-border">
                <TabsList className="w-full md:w-auto bg-slate-100 border border-border p-1.5 rounded-xl">
                  <TabsTrigger 
                    value="evaluations" 
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
                </TabsList>
              </div>

              {/* === EVALUATIONS TAB === */}
              <TabsContent value="evaluations" className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Registros de Avaliação</h2>
                    <p className="text-sm text-muted-foreground">Histórico completo de avaliações clínicas</p>
                  </div>
                  <Button onClick={handleNewEvaluation} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Nova Avaliação
                  </Button>
                </div>

                {/* Clinical Insights Panel */}
                {evaluations.length > 0 && evaluations[0]?.pain_location && (
                  <ClinicalInsights 
                    painLocation={evaluations[0].pain_location || ""} 
                    chiefComplaint={evaluations[0].chief_complaint || ""} 
                  />
                )}

                {evalLoading ? (
                  <div className="flex justify-center py-12"><Spinner size="lg" /></div>
                ) : evaluations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Nenhuma avaliação registrada</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                      Registre a primeira avaliação para iniciar o prontuário clínico.
                    </p>
                    <Button onClick={handleNewEvaluation} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Avaliação
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {evaluations.map((evaluation, index) => (
                      <motion.div
                        key={evaluation.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-white/10 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/80 overflow-hidden group">
                          <CardHeader className="pb-3 border-b border-white/5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${evaluation.type === "initial" ? "bg-primary/10" : "bg-violet-500/10"}`}>
                                  <Stethoscope className={`w-5 h-5 ${evaluation.type === "initial" ? "text-primary" : "text-violet-500"}`} />
                                </div>
                                <div>
                                  <CardTitle className="text-base font-bold">
                                    {evaluation.type === "initial" ? "Avaliação Inicial" : "Reavaliação"}
                                  </CardTitle>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(evaluation.created_at.replace(' ', 'T') + 'Z').toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {evaluation.pain_level !== null && (
                                  <Badge variant="outline" className="font-bold">
                                    <Heart className="w-3 h-3 mr-1 text-rose-500" />
                                    {evaluation.pain_level}/10
                                  </Badge>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleEditEvaluation(evaluation)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            {evaluation.chief_complaint && (
                              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Queixa Principal</span>
                                <p className="text-sm text-foreground mt-1">{evaluation.chief_complaint}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {evaluation.pain_location && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Local da Dor</span>
                                  <p className="text-sm mt-1">{evaluation.pain_location}</p>
                                </div>
                              )}
                              {evaluation.functional_status && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Funcional</span>
                                  <p className="text-sm mt-1"><HighlightedADM text={evaluation.functional_status} /></p>
                                </div>
                              )}
                            </div>
                            {evaluation.orthopedic_tests && (
                              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Testes Ortopédicos</span>
                                <p className="text-sm mt-1">{evaluation.orthopedic_tests}</p>
                              </div>
                            )}
                            {evaluation.observations && (
                              <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Observações</span>
                                <p className="text-sm mt-1">{evaluation.observations}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* === EXERCÍCIOS SUGERIDOS === */}
                {suggestedExercises.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Exercícios Sugeridos</h3>
                          <p className="text-xs text-muted-foreground">Baseados na avaliação do paciente</p>
                        </div>
                      </div>
                      <Link to="/dashboard/exercicios">
                        <Button variant="outline" size="sm" className="gap-2">
                          Ver Biblioteca
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {suggestedExercises.map((exercise, index) => {
                        const categoryInfo = getCategoryInfo(exercise.category);
                        return (
                          <motion.div
                            key={exercise.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="h-full border border-white/10 hover:border-amber-500/30 transition-all bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:shadow-lg hover:shadow-amber-500/10 group cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center text-lg flex-shrink-0`}>
                                    {categoryInfo.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-500 transition-colors">
                                      {exercise.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {categoryInfo.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                        {exercise.sets}
                                      </Badge>
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                        {exercise.reps}
                                      </Badge>
                                    </div>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                                      <Lightbulb className="w-3 h-3" />
                                      {exercise.matchReason}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                        <Dumbbell className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          Estas sugestões são baseadas na localização da dor e queixa principal. 
                          Acesse a <Link to="/dashboard/exercicios" className="font-semibold underline hover:no-underline">Biblioteca de Exercícios</Link> para ver todos os detalhes e prescrever ao paciente.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* === EVOLUTIONS TAB === */}
              <TabsContent value="evolutions" className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Registros de Evolução</h2>
                    <p className="text-sm text-muted-foreground">
                      {evolutions.length > 0 
                        ? `${evolutions.length} ${evolutions.length === 1 ? "sessão registrada" : "sessões registradas"}`
                        : "Acompanhe o progresso do tratamento"}
                    </p>
                  </div>
                  <Button onClick={handleNewEvolution} className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4" />
                    Nova Evolução
                  </Button>
                </div>

                {/* Evolution Chart */}
                {!evolLoading && evolutions.length >= 1 && (
                  <EvolutionChart evolutions={evolutions} evaluations={evaluations} />
                )}

                {evolLoading ? (
                  <div className="flex justify-center py-12"><Spinner size="lg" /></div>
                ) : evolutions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Activity className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Nenhuma evolução registrada</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                      Registre as sessões de tratamento para acompanhar a evolução.
                    </p>
                    <Button onClick={handleNewEvolution} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Primeira Sessão
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {evolutions.map((evolution, index) => (
                      <motion.div
                        key={evolution.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-white/10 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/80 overflow-hidden">
                          <CardHeader className="pb-3 border-b border-white/5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                  <CardTitle className="text-base font-bold">
                                    Sessão #{evolutions.length - index}
                                  </CardTitle>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(evolution.session_date + 'T12:00:00').toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {evolution.pain_level !== null && (
                                  <Badge variant="outline" className="font-bold">
                                    <Heart className="w-3 h-3 mr-1 text-rose-500" />
                                    {evolution.pain_level}/10
                                  </Badge>
                                )}
                                {evolution.patient_response && (
                                  <Badge className={
                                    evolution.patient_response === "positive" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                                    evolution.patient_response === "negative" ? "bg-rose-500/10 text-rose-600 border-rose-500/30" : 
                                    "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                  }>
                                    {evolution.patient_response === "positive" ? "Positiva" :
                                     evolution.patient_response === "negative" ? "Negativa" : "Neutra"}
                                  </Badge>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEvolution(evolution)}
                                  className="h-8 px-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-1" />
                                  Editar
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            {evolution.procedures && (
                              <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10">
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Procedimentos</span>
                                <p className="text-sm mt-1">{evolution.procedures}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {evolution.functional_status && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Funcional</span>
                                  <p className="text-sm mt-1"><HighlightedADM text={evolution.functional_status} /></p>
                                </div>
                              )}
                              {evolution.observations && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Observações</span>
                                  <p className="text-sm mt-1">{evolution.observations}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* === EVALUATION DIALOG === */}
        <Dialog open={evalDialogOpen} onOpenChange={(open) => { setEvalDialogOpen(open); if (!open) setEditingEvaluation(null); }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  {editingEvaluation ? <Pencil className="w-5 h-5 text-white" /> : <Stethoscope className="w-5 h-5 text-white" />}
                </div>
                {editingEvaluation ? "Editar Avaliação" : "Nova Avaliação"}
              </DialogTitle>
              <DialogDescription>
                {editingEvaluation ? "Atualize os dados da avaliação conforme necessário." : "Preencha os campos para registrar a avaliação clínica."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="font-semibold">Tipo de Avaliação</Label>
                <Select value={evalForm.type} onValueChange={(v) => setEvalForm({ ...evalForm, type: v as "initial" | "followup" })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="initial">Avaliação Inicial</SelectItem>
                    <SelectItem value="followup">Reavaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Queixa Principal *</Label>
                <Textarea value={evalForm.chief_complaint || ""} onChange={(e) => setEvalForm({ ...evalForm, chief_complaint: e.target.value })} placeholder="Descreva a queixa principal do paciente..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">História Clínica</Label>
                <Textarea value={evalForm.history || ""} onChange={(e) => setEvalForm({ ...evalForm, history: e.target.value })} placeholder="Histórico relevante..." rows={2} />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Nível de Dor: {evalForm.pain_level}/10</Label>
                <Slider value={[evalForm.pain_level || 0]} onValueChange={([v]) => setEvalForm({ ...evalForm, pain_level: v })} min={0} max={10} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Localização da Dor</Label>
                <Input value={evalForm.pain_location || ""} onChange={(e) => setEvalForm({ ...evalForm, pain_location: e.target.value })} placeholder="Ex: Região lombar, joelho direito..." className="h-11" />
                {regiaoDetectada && (
                  <div className="flex items-start gap-2 p-3 mt-2 rounded-xl bg-primary/5 border border-primary/10">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Consulte testes para <strong className="text-foreground">{regioes[regiaoDetectada]}</strong>
                      </p>
                      <Link to="/dashboard/testes" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                        Ver Testes <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Status Funcional</Label>
                <Textarea value={evalForm.functional_status || ""} onChange={(e) => setEvalForm({ ...evalForm, functional_status: e.target.value })} placeholder="Limitações funcionais, ADMs, força..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold flex items-center gap-2">
                  Testes Ortopédicos
                  <Link to="/dashboard/testes" className="text-xs text-primary hover:underline font-normal flex items-center gap-1">
                    <ClipboardList className="w-3 h-3" /> Consultar
                  </Link>
                </Label>
                <Textarea value={evalForm.orthopedic_tests || ""} onChange={(e) => setEvalForm({ ...evalForm, orthopedic_tests: e.target.value })} placeholder="Testes realizados e resultados..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Observações</Label>
                <Textarea value={evalForm.observations || ""} onChange={(e) => setEvalForm({ ...evalForm, observations: e.target.value })} placeholder="Observações adicionais..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEvalDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEvaluation} disabled={saving} className="bg-gradient-to-r from-primary to-primary/80">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* === EVOLUTION DIALOG === */}
        <Dialog open={evolDialogOpen} onOpenChange={setEvolDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-emerald-500/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                {editingEvolution ? "Editar Evolução" : "Nova Evolução"}
              </DialogTitle>
              <DialogDescription>{editingEvolution ? "Atualize os dados da sessão de tratamento." : "Registre a sessão de tratamento do paciente."}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Data da Sessão</Label>
                  <Input type="date" value={evolForm.session_date || ""} onChange={(e) => setEvolForm({ ...evolForm, session_date: e.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Presença</Label>
                  <Select value={evolForm.attendance_status || "attended"} onValueChange={(v) => setEvolForm({ ...evolForm, attendance_status: v as "attended" | "justified_absence" | "unjustified_absence" })}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="attended">Compareceu</SelectItem>
                      <SelectItem value="justified_absence">Falta Justificada</SelectItem>
                      <SelectItem value="unjustified_absence">Falta Não Justificada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="font-semibold">Nível de Dor: {evolForm.pain_level}/10</Label>
                <Slider value={[evolForm.pain_level || 0]} onValueChange={([v]) => setEvolForm({ ...evolForm, pain_level: v })} min={0} max={10} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Procedimentos Realizados</Label>
                <Textarea value={evolForm.procedures || ""} onChange={(e) => setEvolForm({ ...evolForm, procedures: e.target.value })} placeholder="Técnicas e exercícios aplicados..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Resposta do Paciente</Label>
                <Select value={evolForm.patient_response || ""} onValueChange={(v) => setEvolForm({ ...evolForm, patient_response: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="positive">Positiva</SelectItem>
                    <SelectItem value="neutral">Neutra</SelectItem>
                    <SelectItem value="negative">Negativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Status Funcional</Label>
                <Textarea value={evolForm.functional_status || ""} onChange={(e) => setEvolForm({ ...evolForm, functional_status: e.target.value })} placeholder="Evolução das capacidades funcionais..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Observações</Label>
                <Textarea value={evolForm.observations || ""} onChange={(e) => setEvolForm({ ...evolForm, observations: e.target.value })} placeholder="Observações da sessão..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEvolDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEvolution} disabled={saving} className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* === REMINDER DIALOG === */}
        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Lembrete via WhatsApp
              </DialogTitle>
              <DialogDescription>
                Envie um lembrete de consulta para {patient.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Reminder Type Selection */}
              <div className="space-y-3">
                <Label className="font-semibold">Tipo de Mensagem</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "appointment", label: "Agendar Consulta", desc: "Com data e hora específica" },
                    { value: "followup", label: "Retorno", desc: "Lembrete de acompanhamento" },
                    { value: "custom", label: "Personalizada", desc: "Escreva sua própria mensagem" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setReminderForm({ ...reminderForm, type: type.value as "appointment" | "followup" | "custom" })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        reminderForm.type === type.value
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border hover:border-amber-500/50"
                      }`}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointment Fields */}
              {reminderForm.type === "appointment" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="font-semibold">Data</Label>
                    <Input
                      type="date"
                      value={reminderForm.date}
                      onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Horário</Label>
                    <Input
                      type="time"
                      value={reminderForm.time}
                      onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
              )}

              {/* Custom Message Field */}
              {reminderForm.type === "custom" && (
                <div className="space-y-2">
                  <Label className="font-semibold">Mensagem</Label>
                  <Textarea
                    value={reminderForm.customMessage}
                    onChange={(e) => setReminderForm({ ...reminderForm, customMessage: e.target.value })}
                    placeholder="Digite sua mensagem personalizada..."
                    rows={4}
                  />
                </div>
              )}

              {/* Preview */}
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-2">Prévia da mensagem:</p>
                <p className="text-sm">
                  {reminderForm.type === "appointment" && reminderForm.date
                    ? `📅 Lembrete de consulta para ${new Date(reminderForm.date + "T12:00:00").toLocaleDateString("pt-BR")}${reminderForm.time ? ` às ${reminderForm.time}` : ""}`
                    : reminderForm.type === "followup"
                    ? "📞 Mensagem de retorno/acompanhamento"
                    : reminderForm.type === "custom" && reminderForm.customMessage
                    ? `✏️ ${reminderForm.customMessage.substring(0, 50)}...`
                    : "Selecione as opções acima"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSendReminder}
                disabled={
                  (reminderForm.type === "appointment" && !reminderForm.date) ||
                  (reminderForm.type === "custom" && !reminderForm.customMessage)
                }
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar WhatsApp
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Excluir Paciente
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir <strong>{patient?.name}</strong>? Esta ação não pode ser desfeita e todos os dados do paciente (avaliações, evoluções, etc.) serão perdidos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePatient}
                disabled={deleting}
                className="gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Excluindo..." : "Excluir Paciente"}
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
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
