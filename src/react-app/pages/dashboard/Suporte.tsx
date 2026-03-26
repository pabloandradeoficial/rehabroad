import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  HeartPulse,
  AlertTriangle,
  RefreshCw,
  FileText,
  Route,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Brain,
  Microscope,
  ListChecks,
  CircleDot,
  Sparkles,
  Dumbbell,
  ChevronDown,
  User,
  Zap,
  Download
} from "lucide-react";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { usePatients } from "@/react-app/hooks/usePatients";
import { useSuporte, type ClinicalInsight, type DiagnosticHypothesis } from "@/react-app/hooks/useSuporte";
import PremiumGate from "@/react-app/components/PremiumGate";
import { PageTransition, Spinner } from "@/react-app/components/ui/microinteractions";
import { getSuggestedExercises, exerciseCategories } from "@/data/exercises";
import { Link } from "react-router";

// Section Header Component
function SectionHeader({ icon: Icon, title, iconColor = "text-primary", children }: { 
  icon: React.ElementType; 
  title: string; 
  iconColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </h2>
      {children}
    </div>
  );
}

// Pain Level Display
function PainDisplay({ level, severity }: { level: number; severity: string }) {
  const config = {
    none: { color: "text-emerald-500", bg: "bg-emerald-500", label: "Sem dor" },
    low: { color: "text-emerald-400", bg: "bg-emerald-400", label: "Leve" },
    moderate: { color: "text-amber-500", bg: "bg-amber-500", label: "Moderada" },
    high: { color: "text-red-500", bg: "bg-red-500", label: "Intensa" }
  };
  
  const c = config[severity as keyof typeof config] || config.none;
  
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
          <circle 
            cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" 
            strokeDasharray={`${(level / 10) * 213.6} 213.6`}
            strokeLinecap="round"
            className={c.color}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${c.color}`}>{level}</span>
          <span className="text-[10px] text-muted-foreground">/10</span>
        </div>
      </div>
      <div>
        <p className={`font-bold ${c.color}`}>{c.label}</p>
        <p className="text-xs text-muted-foreground">Escala EVA</p>
      </div>
    </div>
  );
}

// Trend Badge
function TrendBadge({ trend, changePercent }: { trend: string | null; changePercent: number | null }) {
  if (!trend || trend === "stable") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
        <Minus className="w-3 h-3" /> Estável
      </span>
    );
  }
  const improving = trend === "improving";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      improving ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
    }`}>
      {improving ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
      {changePercent && `${improving ? "-" : "+"}${Math.abs(changePercent)}%`}
    </span>
  );
}

// Insight Item
function InsightItem({ insight }: { insight: ClinicalInsight }) {
  const config = {
    high: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    medium: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    low: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
  };
  const c = config[insight.priority];
  
  return (
    <div className={`p-4 rounded-xl ${c.bg} border ${c.border}`}>
      <div className="flex items-start gap-3">
        <c.icon className={`w-5 h-5 ${c.color} mt-0.5 shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm">{insight.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
          {insight.actions && insight.actions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {insight.actions.map((action, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background/80 text-xs text-foreground">
                  <ChevronRight className="w-3 h-3 text-primary" />{action}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Diagnostic Card
function DiagnosticCard({ hypothesis }: { hypothesis: DiagnosticHypothesis }) {
  const [expanded, setExpanded] = useState(false);
  const confidence = {
    alta: { badge: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" },
    média: { badge: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" },
    baixa: { badge: "bg-slate-500/10 text-slate-600", dot: "bg-slate-400" }
  };
  const c = confidence[hypothesis.confidence];
  
  return (
    <div className="border border-border/50 rounded-xl bg-card overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-500" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground">{hypothesis.condition}</h4>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${c.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              Confiança {hypothesis.confidence}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-emerald-500" /> Raciocínio
            </h5>
            <ul className="space-y-1">
              {hypothesis.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-amber-500" /> Diferenciais
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {hypothesis.differentials.map((d, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-primary" /> Testes Sugeridos
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {hypothesis.suggestedTests.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary">
                  <ChevronRight className="w-3 h-3" />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercise Card
function ExerciseCard({ exercise }: { exercise: ReturnType<typeof getSuggestedExercises>[0] }) {
  const category = exerciseCategories.find(c => c.id === exercise.category);
  return (
    <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 bg-gradient-to-br ${category?.color || "from-gray-500 to-gray-600"}`}>
        {category?.icon || "💪"}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground line-clamp-1">{exercise.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{exercise.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{exercise.sets}×{exercise.reps}</Badge>
          <span className="text-[10px] text-teal-600 flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" />{exercise.matchReason}
          </span>
        </div>
      </div>
    </div>
  );
}

function SuporteContent() {
  const { patients, loading: patientsLoading } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const { suporte, loading: suporteLoading, refetch } = useSuporte(selectedPatientId || null);

  const selectedPatient = patients.find(p => p.id.toString() === selectedPatientId);

  const suggestedExercises = useMemo(() => {
    if (!suporte?.evaluation) return [];
    const { pain_location, chief_complaint } = suporte.evaluation;
    return getSuggestedExercises(pain_location, chief_complaint);
  }, [suporte?.evaluation]);

  const structured = suporte?.structured;

  // Empty state
  if (!selectedPatientId) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-primary" />
            <div className="relative flex items-start gap-4">
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-primary flex items-center justify-center shadow-lg">
                  <HeartPulse className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Apoio Clínico</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="italic">Análise inteligente para apoiar suas decisões</span>
                </p>
              </div>
            </div>
          </div>

          {/* Patient Selection */}
          <Card className="border-2 border-dashed">
            <CardContent className="py-8 text-center">
              <User className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Selecione um paciente para começar</p>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-full max-w-xs mx-auto">
                  <SelectValue placeholder="Escolher paciente..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  {patientsLoading ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : patients.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhum paciente</SelectItem>
                  ) : (
                    patients.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* How it works */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "1. Dados", desc: "Analisa avaliação e evoluções", color: "from-primary to-primary/70" },
              { icon: Zap, title: "2. Análise", desc: "Identifica padrões clínicos", color: "from-violet-500 to-violet-600" },
              { icon: Target, title: "3. Sugestões", desc: "Indica próximos passos", color: "from-emerald-500 to-emerald-600" }
            ].map((step) => (
              <div key={step.title} className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-3`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (suporteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const painStatus = structured?.painStatus;
  const insights = structured?.insights || [];
  const nextSteps = structured?.nextSteps || [];
  const diagnosticHypotheses = structured?.diagnosticHypotheses || [];
  const highPriority = insights.filter(i => i.priority === "high");
  const otherInsights = insights.filter(i => i.priority !== "high");

  const handleExportPDF = () => {
    const patientName = selectedPatient?.name || "Paciente";
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

    const alertsHtml = highPriority.length > 0
      ? `<h2>Alertas Prioritários</h2>` + highPriority.map(i => `<div class="item red"><strong>${i.title}</strong>: ${i.description}</div>`).join("")
      : "";
    const insightsHtml = otherInsights.length > 0
      ? `<h2>Pontos de Atenção</h2>` + otherInsights.map(i => `<div class="item"><strong>${i.title}</strong>: ${i.description}</div>`).join("")
      : "";
    const hypothesesHtml = diagnosticHypotheses.length > 0
      ? `<h2>Hipóteses Diagnósticas</h2>` + diagnosticHypotheses.map(h => `<div class="item"><strong>${h.condition}</strong> (Confiança: ${h.confidence})</div>`).join("")
      : "";
    const exercisesHtml = suggestedExercises.length > 0
      ? `<h2>Exercícios Sugeridos</h2>` + suggestedExercises.slice(0, 6).map(e => `<div class="exercise"><strong>${e.name}</strong> — ${e.sets}×${e.reps} — ${e.frequency}</div>`).join("")
      : "";
    const stepsHtml = nextSteps.length > 0
      ? `<h2>Próximos Passos</h2>` + nextSteps.map((step, idx) => `<div class="step"><div class="step-num">${idx + 1}</div><div>${step}</div></div>`).join("")
      : "";

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Apoio Clínico – ${patientName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; max-width: 800px; margin: 0 auto; padding: 32px; }
    h1 { font-size: 24px; color: #7c3aed; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
    h2 { font-size: 16px; font-weight: bold; color: #333; margin-top: 28px; margin-bottom: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    .item { background: #f9f9f9; border-left: 4px solid #7c3aed; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; font-size: 14px; }
    .item.red { border-left-color: #dc2626; }
    .exercise { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; margin-bottom: 8px; border-radius: 6px; font-size: 14px; }
    .step { display: flex; gap: 10px; margin-bottom: 8px; font-size: 14px; align-items: flex-start; }
    .step-num { background: #7c3aed; color: white; min-width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <h1>Apoio Clínico</h1>
  <div class="subtitle">Paciente: <strong>${patientName}</strong> &nbsp;•&nbsp; Data: ${date}</div>
  ${alertsHtml}
  ${insightsHtml}
  ${hypothesesHtml}
  ${exercisesHtml}
  ${stepsHtml}
  <div class="footer">Gerado pelo RehabRoad — Ferramenta de apoio ao raciocínio clínico. A decisão terapêutica é responsabilidade do profissional.</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-primary" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-primary flex items-center justify-center shadow-lg">
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Apoio Clínico</h1>
              <p className="text-sm text-muted-foreground mt-1"><span className="italic">{selectedPatient?.name ?? "Análise clínica inteligente"}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="h-9 gap-2 text-xs"
              title="Exportar PDF do relatório clínico"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
            <Button variant="outline" size="icon" onClick={refetch} className="h-9 w-9" title="Atualizar análise">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          </div>
        </div>

        {/* Overview Grid */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Pain Status */}
          <Card className="lg:col-span-1">
            <CardContent className="py-5">
              {painStatus?.level !== null && painStatus?.level !== undefined ? (
                <div className="space-y-3">
                  <PainDisplay level={painStatus.level} severity={painStatus.severity || "none"} />
                  <TrendBadge trend={painStatus.trend} changePercent={painStatus.changePercent} />
                </div>
              ) : (
                <div className="text-center py-4">
                  <Minus className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sem dados de dor</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Avaliação</span>
                </div>
                {suporte?.evaluation ? (
                  <div>
                    {suporte.evaluation.pain_location && (
                      <Badge className="mb-1">{suporte.evaluation.pain_location}</Badge>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {suporte.evaluation.chief_complaint || "Queixa não informada"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Não preenchida</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <Route className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium">Caminho</span>
                </div>
                {suporte?.caminho ? (
                  <div className="flex flex-wrap gap-1.5">
                    {suporte.caminho.treatment_goals && (
                      <Badge variant="outline" className="text-xs">
                        {suporte.caminho.treatment_goals.split(",").length} objetivos
                      </Badge>
                    )}
                    {suporte.caminho.red_flags && suporte.caminho.red_flags !== "none" && (
                      <Badge variant="destructive" className="text-xs">Red flags</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Não preenchido</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Última Evolução</span>
                </div>
                {suporte?.latestEvolution ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      {new Date(suporte.latestEvolution.session_date + 'T12:00:00').toLocaleDateString("pt-BR")}
                    </div>
                    <Badge variant={
                      suporte.latestEvolution.patient_response === "positive" ? "default" :
                      suporte.latestEvolution.patient_response === "negative" ? "destructive" : "secondary"
                    } className="text-xs">
                      Resposta {suporte.latestEvolution.patient_response === "positive" ? "positiva" :
                       suporte.latestEvolution.patient_response === "negative" ? "negativa" : "neutra"}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sem evoluções</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts Section */}
        {highPriority.length > 0 && (
          <section>
            <SectionHeader icon={AlertCircle} title="Alertas Prioritários" iconColor="text-red-500" />
            <div className="space-y-3">
              {highPriority.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <InsightItem insight={insight} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Clinical Insights */}
        {otherInsights.length > 0 && (
          <section>
            <SectionHeader icon={Stethoscope} title="Pontos de Atenção" iconColor="text-primary" />
            <div className="grid sm:grid-cols-2 gap-3">
              {otherInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <InsightItem insight={insight} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Diagnostic Hypotheses */}
        {diagnosticHypotheses.length > 0 && (
          <section>
            <SectionHeader icon={Brain} title="Hipóteses Diagnósticas" iconColor="text-violet-500">
              <Badge variant="outline">{diagnosticHypotheses.length} hipótese{diagnosticHypotheses.length > 1 ? "s" : ""}</Badge>
            </SectionHeader>
            <div className="space-y-3">
              {diagnosticHypotheses.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DiagnosticCard hypothesis={h} />
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-2 p-3 rounded-lg bg-muted/30">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              Hipóteses baseadas nos dados informados. Confirme com avaliação física e exames quando necessário.
            </p>
          </section>
        )}

        {/* Suggested Exercises */}
        {suggestedExercises.length > 0 && (
          <section>
            <SectionHeader icon={Dumbbell} title="Exercícios Sugeridos" iconColor="text-teal-500">
              <Link to="/dashboard/exercicios">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                  Ver biblioteca <ChevronRight className="w-3 h-3 ml-1 inline" />
                </Badge>
              </Link>
            </SectionHeader>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedExercises.slice(0, 6).map((exercise, i) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ExerciseCard exercise={exercise} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <section>
            <SectionHeader icon={Target} title="Próximos Passos" iconColor="text-emerald-500" />
            <div className="space-y-2">
              {nextSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground">{step}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {insights.length === 0 && diagnosticHypotheses.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <HeartPulse className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Complete a avaliação e o módulo Caminho para ver análises</p>
            </CardContent>
          </Card>
        )}

        {/* Footer Disclaimer */}
        <p className="text-xs text-center text-muted-foreground py-4 border-t border-border/50">
          Ferramenta de apoio ao raciocínio clínico. A decisão terapêutica é responsabilidade do profissional.
        </p>
      </div>
    </PageTransition>
  );
}

export default function SuportePage() {
  return (
    <PremiumGate moduleName="Apoio Clínico">
      <SuporteContent />
    </PremiumGate>
  );
}
