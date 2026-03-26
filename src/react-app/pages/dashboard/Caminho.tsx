import { useState, useEffect, useMemo } from "react";
import { Route, CheckCircle2, AlertCircle, Save, Sparkles, Target, Zap, Shield, ChevronRight, Check, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import { Input } from "@/react-app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { usePatients } from "@/react-app/hooks/usePatients";
import { useCaminho, type CaminhoFormData } from "@/react-app/hooks/useCaminho";
import { useSuporte } from "@/react-app/hooks/useSuporte";
import PremiumGate from "@/react-app/components/PremiumGate";
import ClinicalSummary from "@/react-app/components/ClinicalSummary";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner, useToast, PageTransition } from "@/react-app/components/ui/microinteractions";

// Mapping from diagnostic conditions to suggested Caminho values
const diagnosticMappings: Record<string, {
  painPatterns?: string[];
  aggravatingFactors?: string[];
  relievingFactors?: string[];
  functionalLimitations?: string[];
  treatmentGoals?: string[];
}> = {
  // Shoulder conditions
  "Síndrome do Impacto do Ombro": {
    painPatterns: ["activity", "intermittent"],
    aggravatingFactors: ["movement", "load"],
    relievingFactors: ["rest", "position_change"],
    functionalLimitations: ["dressing", "work"],
    treatmentGoals: ["pain_reduction", "mobility", "strength"]
  },
  "Capsulite Adesiva": {
    painPatterns: ["constant", "evening"],
    aggravatingFactors: ["movement", "cold"],
    relievingFactors: ["heat", "stretching"],
    functionalLimitations: ["dressing", "bathing", "sleeping"],
    treatmentGoals: ["mobility", "pain_reduction", "function"]
  },
  "Omalgia Mecânica": {
    painPatterns: ["activity", "intermittent"],
    aggravatingFactors: ["movement", "load"],
    relievingFactors: ["rest", "heat"],
    functionalLimitations: ["work", "leisure"],
    treatmentGoals: ["pain_reduction", "strength", "prevention"]
  },
  // Spine conditions
  "Hérnia Discal Lombar": {
    painPatterns: ["constant", "activity"],
    aggravatingFactors: ["sitting", "load", "movement"],
    relievingFactors: ["position_change", "stretching"],
    functionalLimitations: ["sitting", "walking", "work", "driving"],
    treatmentGoals: ["pain_reduction", "mobility", "education"]
  },
  "Lombalgia Mecânica": {
    painPatterns: ["activity", "morning"],
    aggravatingFactors: ["prolonged_rest", "sitting", "load"],
    relievingFactors: ["movement", "stretching", "heat"],
    functionalLimitations: ["sitting", "housework", "work"],
    treatmentGoals: ["pain_reduction", "strength", "prevention", "education"]
  },
  // Cervical conditions
  "Cervicalgia": {
    painPatterns: ["constant", "activity"],
    aggravatingFactors: ["stress", "sitting", "cold"],
    relievingFactors: ["heat", "massage", "stretching"],
    functionalLimitations: ["work", "driving", "sleeping"],
    treatmentGoals: ["pain_reduction", "mobility", "education"]
  },
  "Cefaleia Cervicogênica": {
    painPatterns: ["intermittent", "morning"],
    aggravatingFactors: ["sitting", "stress"],
    relievingFactors: ["massage", "rest", "stretching"],
    functionalLimitations: ["work", "sleeping"],
    treatmentGoals: ["pain_reduction", "prevention", "education"]
  },
  // Knee conditions
  "Síndrome Patelofemoral": {
    painPatterns: ["activity", "intermittent"],
    aggravatingFactors: ["stairs", "sitting", "walking"],
    relievingFactors: ["rest", "stretching"],
    functionalLimitations: ["stairs", "leisure", "walking"],
    treatmentGoals: ["pain_reduction", "strength", "sport_return"]
  },
  "Lesão Meniscal": {
    painPatterns: ["activity", "intermittent"],
    aggravatingFactors: ["movement", "stairs", "walking"],
    relievingFactors: ["rest", "cold"],
    functionalLimitations: ["walking", "leisure", "work"],
    treatmentGoals: ["pain_reduction", "strength", "function"]
  },
  "Gonalgia Mecânica": {
    painPatterns: ["activity"],
    aggravatingFactors: ["walking", "stairs", "standing"],
    relievingFactors: ["rest", "heat"],
    functionalLimitations: ["walking", "stairs"],
    treatmentGoals: ["pain_reduction", "strength", "prevention"]
  },
  "Osteoartrose de Joelho": {
    painPatterns: ["morning", "activity"],
    aggravatingFactors: ["prolonged_rest", "walking", "stairs", "cold"],
    relievingFactors: ["movement", "heat"],
    functionalLimitations: ["walking", "stairs", "housework"],
    treatmentGoals: ["pain_reduction", "mobility", "function", "education"]
  },
  // Ankle conditions
  "Entorse de Tornozelo": {
    painPatterns: ["constant", "activity"],
    aggravatingFactors: ["walking", "standing"],
    relievingFactors: ["rest", "cold"],
    functionalLimitations: ["walking", "leisure", "work"],
    treatmentGoals: ["pain_reduction", "strength", "prevention"]
  },
  "Tendinopatia de Aquiles": {
    painPatterns: ["morning", "activity"],
    aggravatingFactors: ["walking", "stairs"],
    relievingFactors: ["rest", "stretching"],
    functionalLimitations: ["walking", "leisure"],
    treatmentGoals: ["pain_reduction", "strength", "sport_return"]
  },
  // Generic fallbacks
  "Dor Crônica": {
    painPatterns: ["constant"],
    aggravatingFactors: ["stress", "cold"],
    relievingFactors: ["heat", "rest", "medication"],
    treatmentGoals: ["pain_reduction", "education", "prevention"]
  }
};

const painPatterns = [
  { id: "constant", label: "Constante" },
  { id: "intermittent", label: "Intermitente" },
  { id: "morning", label: "Matinal (piora pela manhã)" },
  { id: "evening", label: "Vespertina (piora à noite)" },
  { id: "activity", label: "Relacionada à atividade" },
  { id: "rest", label: "Relacionada ao repouso" },
  { id: "outro", label: "Outro" },
];

const aggravatingFactors = [
  { id: "movement", label: "Movimento" },
  { id: "prolonged_rest", label: "Repouso prolongado" },
  { id: "sitting", label: "Posição sentada" },
  { id: "standing", label: "Posição em pé" },
  { id: "walking", label: "Caminhada" },
  { id: "stairs", label: "Subir/descer escadas" },
  { id: "cold", label: "Frio" },
  { id: "stress", label: "Estresse emocional" },
  { id: "load", label: "Carga/peso" },
  { id: "outro", label: "Outro" },
];

const relievingFactors = [
  { id: "rest", label: "Repouso" },
  { id: "movement", label: "Movimento leve" },
  { id: "heat", label: "Calor" },
  { id: "cold", label: "Frio/gelo" },
  { id: "medication", label: "Medicação" },
  { id: "stretching", label: "Alongamento" },
  { id: "massage", label: "Massagem" },
  { id: "position_change", label: "Mudança de posição" },
  { id: "outro", label: "Outro" },
];

const functionalLimitations = [
  { id: "dressing", label: "Vestir-se" },
  { id: "bathing", label: "Banho/higiene" },
  { id: "walking", label: "Caminhar" },
  { id: "sitting", label: "Sentar/levantar" },
  { id: "sleeping", label: "Dormir" },
  { id: "work", label: "Trabalho" },
  { id: "leisure", label: "Lazer/esporte" },
  { id: "driving", label: "Dirigir" },
  { id: "housework", label: "Tarefas domésticas" },
  { id: "outro", label: "Outro" },
];

const treatmentGoals = [
  { id: "pain_reduction", label: "Redução da dor" },
  { id: "mobility", label: "Melhorar mobilidade" },
  { id: "strength", label: "Ganho de força" },
  { id: "function", label: "Retorno funcional" },
  { id: "work_return", label: "Retorno ao trabalho" },
  { id: "sport_return", label: "Retorno ao esporte" },
  { id: "prevention", label: "Prevenção de recidivas" },
  { id: "education", label: "Educação em saúde" },
  { id: "outro", label: "Outro" },
];

const redFlags = [
  { id: "weight_loss", label: "Perda de peso inexplicada" },
  { id: "fever", label: "Febre" },
  { id: "night_pain", label: "Dor noturna intensa" },
  { id: "neurological", label: "Déficits neurológicos progressivos" },
  { id: "bladder", label: "Alteração vesical/intestinal" },
  { id: "trauma", label: "Trauma recente significativo" },
  { id: "cancer_history", label: "Histórico de câncer" },
  { id: "immunosuppression", label: "Imunossupressão" },
  { id: "outro", label: "Outro" },
  { id: "none", label: "Nenhuma das opções" },
];

// Helpers to serialize/deserialize "outro:custom text" in stored comma-separated strings
function parseField(raw: string): { ids: string[]; otherText: string } {
  if (!raw) return { ids: [], otherText: "" };
  let otherText = "";
  const ids = raw.split(",").map(p => {
    if (p.startsWith("outro:")) { otherText = decodeURIComponent(p.slice(6)); return "outro"; }
    return p;
  }).filter(Boolean);
  return { ids, otherText };
}

function serializeField(ids: string[], otherText: string): string {
  return ids.map(id => (id === "outro" && otherText.trim()) ? `outro:${encodeURIComponent(otherText.trim())}` : id).join(",");
}

const stepConfig = [
  { key: "painPatterns", icon: Zap, label: "Padrão da Dor", color: "primary", items: painPatterns },
  { key: "aggravatingFactors", icon: AlertCircle, label: "Fatores de Piora", color: "rose", items: aggravatingFactors },
  { key: "relievingFactors", icon: CheckCircle2, label: "Fatores de Alívio", color: "emerald", items: relievingFactors },
  { key: "functionalLimitations", icon: Target, label: "Limitações Funcionais", color: "amber", items: functionalLimitations },
  { key: "treatmentGoals", icon: Sparkles, label: "Objetivos", color: "violet", items: treatmentGoals },
  { key: "redFlags", icon: Shield, label: "Red Flags", color: "red", items: redFlags },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface PremiumStepProps {
  step: typeof stepConfig[0];
  stepNumber: number;
  selected: string[];
  onChange: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isWarning?: boolean;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

function PremiumStep({ step, stepNumber, selected, onChange, isOpen, onToggle, isWarning, otherText, onOtherTextChange }: PremiumStepProps) {
  const Icon = step.icon;
  const isCompleted = selected.length > 0;
  
  const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    primary: { bg: "from-primary/10 to-primary/5", border: "border-primary/20", text: "text-primary", glow: "shadow-primary/20" },
    rose: { bg: "from-rose-500/10 to-rose-500/5", border: "border-rose-500/20", text: "text-rose-500", glow: "shadow-rose-500/20" },
    emerald: { bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-500", glow: "shadow-emerald-500/20" },
    amber: { bg: "from-amber-500/10 to-amber-500/5", border: "border-amber-500/20", text: "text-amber-500", glow: "shadow-amber-500/20" },
    violet: { bg: "from-violet-500/10 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-500", glow: "shadow-violet-500/20" },
    red: { bg: "from-red-500/10 to-red-500/5", border: "border-red-500/20", text: "text-red-500", glow: "shadow-red-500/20" },
  };
  
  const colors = colorClasses[step.color] || colorClasses.primary;

  return (
    <motion.div
      variants={itemVariants}
      className="relative"
    >
      <div className={`relative overflow-hidden rounded-2xl border ${isOpen ? colors.border : 'border-white/10'} bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl shadow-lg ${isOpen ? colors.glow : ''} transition-all duration-300`}>
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          {/* Step Number */}
          <div className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? `bg-gradient-to-br ${colors.bg}` : 'bg-muted/50'} transition-colors`}>
            {isCompleted ? (
              <Check className={`w-5 h-5 ${colors.text}`} />
            ) : (
              <span className="text-sm font-bold text-muted-foreground">{stepNumber}</span>
            )}
          </div>
          
          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${isCompleted ? colors.text : 'text-muted-foreground'}`} />
              <h3 className="font-semibold text-foreground">{step.label}</h3>
              {isCompleted && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-medium`}>
                  {selected.length} selecionado{selected.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          {/* Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>
        
        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-white/5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {step.items.map(item => (
                    <motion.label
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selected.includes(item.id)
                          ? `bg-gradient-to-br ${colors.bg} ${colors.border} border shadow-sm`
                          : isWarning
                          ? "bg-red-500/5 hover:bg-red-500/10 border border-transparent"
                          : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() => onChange(item.id)}
                        className={selected.includes(item.id) ? colors.border : ''}
                      />
                      <span className={`text-sm ${selected.includes(item.id) ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                      </span>
                    </motion.label>
                  ))}
                </div>

                {/* "Outro" inline text input */}
                <AnimatePresence>
                  {selected.includes("outro") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3"
                    >
                      <Input
                        placeholder="Descreva o item personalizado..."
                        value={otherText || ""}
                        onChange={(e) => onOtherTextChange?.(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-sm bg-muted/50 ${colors.border} focus-visible:ring-0 focus-visible:border-current`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Red Flags Warning */}
                {isWarning && selected.length > 0 && !selected.includes("none") && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Atenção Clínica</p>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                          Sinais de alerta registrados. Considere avaliação médica complementar ou encaminhamento.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CaminhoContent() {
  const { patients, loading: patientsLoading } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const { caminho, loading: caminhoLoading, saveCaminho } = useCaminho(selectedPatientId || null);
  const { suporte, loading: suporteLoading } = useSuporte(selectedPatientId || null);
  const [saving, setSaving] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const toast = useToast();

  // Check if we have diagnostic hypotheses to suggest
  const diagnosticHypotheses = suporte?.structured?.diagnosticHypotheses || [];
  const hasDiagnostics = diagnosticHypotheses.length > 0;

  const [formData, setFormData] = useState<{
    painPatterns: string[];
    aggravatingFactors: string[];
    relievingFactors: string[];
    functionalLimitations: string[];
    treatmentGoals: string[];
    redFlags: string[];
  }>({
    painPatterns: [],
    aggravatingFactors: [],
    relievingFactors: [],
    functionalLimitations: [],
    treatmentGoals: [],
    redFlags: [],
  });

  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({
    painPatterns: "",
    aggravatingFactors: "",
    relievingFactors: "",
    functionalLimitations: "",
    treatmentGoals: "",
    redFlags: "",
  });

  // Progress calculation
  const progress = useMemo(() => {
    const completed = [
      formData.painPatterns.length > 0,
      formData.aggravatingFactors.length > 0,
      formData.relievingFactors.length > 0,
      formData.functionalLimitations.length > 0,
      formData.treatmentGoals.length > 0,
      formData.redFlags.length > 0,
    ].filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  }, [formData]);

  // Load existing data when patient changes
  useEffect(() => {
    if (caminho) {
      const pp = parseField(caminho.pain_pattern || "");
      const af = parseField(caminho.aggravating_factors || "");
      const rf = parseField(caminho.relieving_factors || "");
      const fl = parseField(caminho.functional_limitations || "");
      const tg = parseField(caminho.treatment_goals || "");
      const rfl = parseField(caminho.red_flags || "");
      setFormData({
        painPatterns: pp.ids,
        aggravatingFactors: af.ids,
        relievingFactors: rf.ids,
        functionalLimitations: fl.ids,
        treatmentGoals: tg.ids,
        redFlags: rfl.ids,
      });
      setOtherTexts({
        painPatterns: pp.otherText,
        aggravatingFactors: af.otherText,
        relievingFactors: rf.otherText,
        functionalLimitations: fl.otherText,
        treatmentGoals: tg.otherText,
        redFlags: rfl.otherText,
      });
      // Open first incomplete step
      const steps = ["painPatterns", "aggravatingFactors", "relievingFactors", "functionalLimitations", "treatmentGoals", "redFlags"];
      const firstIncomplete = steps.findIndex(key => {
        const value = caminho[key === "painPatterns" ? "pain_pattern" : 
                            key === "aggravatingFactors" ? "aggravating_factors" :
                            key === "relievingFactors" ? "relieving_factors" :
                            key === "functionalLimitations" ? "functional_limitations" :
                            key === "treatmentGoals" ? "treatment_goals" : "red_flags"];
        return !value || value === "";
      });
      setOpenStep(firstIncomplete >= 0 ? firstIncomplete : null);
    } else {
      setFormData({
        painPatterns: [],
        aggravatingFactors: [],
        relievingFactors: [],
        functionalLimitations: [],
        treatmentGoals: [],
        redFlags: [],
      });
      setOtherTexts({
        painPatterns: "",
        aggravatingFactors: "",
        relievingFactors: "",
        functionalLimitations: "",
        treatmentGoals: "",
        redFlags: "",
      });
      setOpenStep(0);
    }
  }, [caminho, selectedPatientId]);

  const toggleItem = (category: keyof typeof formData, itemId: string) => {
    setFormData(prev => {
      if (category === "redFlags") {
        if (itemId === "none") {
          return { ...prev, redFlags: prev.redFlags.includes("none") ? [] : ["none"] };
        } else {
          const withoutNone = prev.redFlags.filter(id => id !== "none");
          return {
            ...prev,
            redFlags: withoutNone.includes(itemId)
              ? withoutNone.filter(id => id !== itemId)
              : [...withoutNone, itemId]
          };
        }
      }
      return {
        ...prev,
        [category]: prev[category].includes(itemId)
          ? prev[category].filter(id => id !== itemId)
          : [...prev[category], itemId]
      };
    });
  };

  const handleSave = async () => {
    if (!selectedPatientId) return;
    setSaving(true);
    try {
      const data: CaminhoFormData = {
        pain_pattern: serializeField(formData.painPatterns, otherTexts.painPatterns),
        aggravating_factors: serializeField(formData.aggravatingFactors, otherTexts.aggravatingFactors),
        relieving_factors: serializeField(formData.relievingFactors, otherTexts.relievingFactors),
        functional_limitations: serializeField(formData.functionalLimitations, otherTexts.functionalLimitations),
        treatment_goals: serializeField(formData.treatmentGoals, otherTexts.treatmentGoals),
        red_flags: serializeField(formData.redFlags, otherTexts.redFlags),
      };
      await saveCaminho(data);
      toast.showSuccess("Caminho clínico salvo com sucesso!");
    } catch (err) {
      console.error(err);
      toast.showError("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // Auto-fill from diagnostic hypotheses
  const handleAutoFill = () => {
    if (!hasDiagnostics) return;
    
    const newData = { ...formData };
    let filledCount = 0;
    
    // Try to match each diagnostic to our mappings
    for (const hypothesis of diagnosticHypotheses) {
      const mapping = diagnosticMappings[hypothesis.condition];
      if (mapping) {
        // Merge suggestions (don't overwrite existing selections)
        if (mapping.painPatterns) {
          const toAdd = mapping.painPatterns.filter(id => !newData.painPatterns.includes(id));
          newData.painPatterns = [...newData.painPatterns, ...toAdd];
          filledCount += toAdd.length;
        }
        if (mapping.aggravatingFactors) {
          const toAdd = mapping.aggravatingFactors.filter(id => !newData.aggravatingFactors.includes(id));
          newData.aggravatingFactors = [...newData.aggravatingFactors, ...toAdd];
          filledCount += toAdd.length;
        }
        if (mapping.relievingFactors) {
          const toAdd = mapping.relievingFactors.filter(id => !newData.relievingFactors.includes(id));
          newData.relievingFactors = [...newData.relievingFactors, ...toAdd];
          filledCount += toAdd.length;
        }
        if (mapping.functionalLimitations) {
          const toAdd = mapping.functionalLimitations.filter(id => !newData.functionalLimitations.includes(id));
          newData.functionalLimitations = [...newData.functionalLimitations, ...toAdd];
          filledCount += toAdd.length;
        }
        if (mapping.treatmentGoals) {
          const toAdd = mapping.treatmentGoals.filter(id => !newData.treatmentGoals.includes(id));
          newData.treatmentGoals = [...newData.treatmentGoals, ...toAdd];
          filledCount += toAdd.length;
        }
      }
    }
    
    if (filledCount > 0) {
      setFormData(newData);
      toast.showSuccess(`${filledCount} sugestões adicionadas com base nos diagnósticos`);
    } else {
      toast.showInfo("Nenhuma sugestão adicional disponível para este diagnóstico");
    }
  };

  const selectedPatient = patients.find(p => p.id.toString() === selectedPatientId);

  if (!selectedPatientId) {
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-violet-500/5 rounded-3xl blur-xl" />
            <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl blur-lg opacity-40" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-500 flex items-center justify-center shadow-xl">
                    <Route className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                    Caminho Clínico
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Documentação estruturada para apoio ao raciocínio clínico
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Patient Selection Card */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.03] to-primary/[0.03]" />
              <CardHeader className="relative pb-4">
                <CardTitle className="text-lg font-semibold">Selecione um Paciente</CardTitle>
                <CardDescription>Escolha o prontuário para documentação clínica</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="w-full max-w-md h-12 bg-white/[0.03] border-white/10 focus:border-primary/50">
                    <SelectValue placeholder="Selecione um paciente..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {patientsLoading ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : patients.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum paciente cadastrado</SelectItem>
                    ) : (
                      patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
            <Card className="relative overflow-hidden border border-emerald-500/20 shadow-lg bg-gradient-to-br from-emerald-500/[0.05] to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-3 font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  Sobre esta Ferramenta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Organização do raciocínio clínico
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Documentação complementar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Registros estruturados
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-amber-500/20 shadow-lg bg-gradient-to-br from-amber-500/[0.05] to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-3 font-semibold">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  Responsabilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Não substitui avaliação presencial
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Decisão clínica é do fisioterapeuta
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Red flags requerem avaliação criteriosa
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </PageTransition>
    );
  }

  if (caminhoLoading) {
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
        className="space-y-5"
      >
        {/* Header with Progress */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-violet-500/5 rounded-3xl blur-xl" />
          <div className="relative p-5 md:p-6 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-500 rounded-xl blur-lg opacity-40" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-500 flex items-center justify-center shadow-xl">
                    <Route className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    Caminho Clínico
                  </h1>
                  <p className="text-sm text-muted-foreground">{selectedPatient?.name}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Progress Ring */}
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" className="fill-none stroke-muted/30 stroke-[4]" />
                      <circle
                        cx="50%" cy="50%" r="40%"
                        className={`fill-none stroke-[4] ${progress === 100 ? "stroke-emerald-500" : "stroke-primary"}`}
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 1.005} 100`}
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progress === 100 ? "text-emerald-500" : "text-primary"}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-foreground">{Math.round(progress / 100 * 6)}/6 seções</p>
                    <p className="text-xs text-muted-foreground">{progress === 100 ? "Completo!" : "Preenchidas"}</p>
                  </div>
                </div>

                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="w-28 sm:w-40 bg-white/[0.03] border-white/10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Auto-fill from diagnostics button */}
                {hasDiagnostics && (
                  <Button 
                    onClick={handleAutoFill}
                    variant="outline"
                    size="sm"
                    className="gap-1 sm:gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-500/10 px-2 sm:px-3"
                    disabled={suporteLoading}
                  >
                    <Wand2 className="w-4 h-4" />
                    <span className="hidden md:inline">Auto-preencher</span>
                  </Button>
                )}

                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  size="sm"
                  className="gap-1 sm:gap-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-emerald-600 px-2 sm:px-3"
                >
                  {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                  <span className="hidden sm:inline">Salvar</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clinical Summary */}
        <motion.div variants={itemVariants}>
          <ClinicalSummary 
            patientId={selectedPatientId} 
            patientName={selectedPatient?.name} 
          />
        </motion.div>

        {/* Steps */}
        {stepConfig.map((step, index) => (
          <PremiumStep
            key={step.key}
            step={step}
            stepNumber={index + 1}
            selected={formData[step.key as keyof typeof formData]}
            onChange={(id) => toggleItem(step.key as keyof typeof formData, id)}
            isOpen={openStep === index}
            onToggle={() => setOpenStep(openStep === index ? null : index)}
            isWarning={step.key === "redFlags"}
            otherText={otherTexts[step.key]}
            onOtherTextChange={(text) => setOtherTexts(prev => ({ ...prev, [step.key]: text }))}
          />
        ))}

        {/* Bottom Save Button */}
        <motion.div variants={itemVariants} className="sticky bottom-0 pt-4 pb-2 bg-background/95 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:backdrop-filter-none border-t border-border sm:border-0 mt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="gap-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-emerald-600 w-full sm:w-auto"
          >
            {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
            Salvar Registro Completo
          </Button>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}

export default function CaminhoPage() {
  return (
    <PremiumGate moduleName="Caminho">
      <CaminhoContent />
    </PremiumGate>
  );
}
