import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Waves, 
  Sun, 
  Snowflake, 
  Flame, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Target
} from "lucide-react";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { cn } from "@/react-app/lib/utils";
import { getRecommendations, type ClinicalData } from "@/data/neurofluxData";
import type { Evaluation } from "@/react-app/hooks/useEvaluations";

interface NeuroFluxQuickAccessProps {
  evaluations: Evaluation[];
}

// Map pain locations to diagnoses
const locationToDiagnosis: Record<string, string> = {
  "lombar": "lombalgia",
  "costas": "lombalgia",
  "coluna": "lombalgia",
  "cervical": "cervicalgia",
  "pescoço": "cervicalgia",
  "ombro": "ombro",
  "joelho": "joelho",
  "tornozelo": "tornozelo",
  "quadril": "quadril",
  "punho": "punho",
  "cotovelo": "cotovelo",
  "tendinite": "tendinopatia",
  "tendinopatia": "tendinopatia",
  "artrose": "artrose",
  "osteoartrite": "artrose",
  "ciático": "lombociatalgia",
  "ciatalgia": "lombociatalgia",
  "nervo": "neuropatia",
  "formigamento": "neuropatia",
};

function detectDiagnosis(text: string): string {
  if (!text) return "lombalgia"; // default
  const lower = text.toLowerCase();
  
  for (const [keyword, diagnosis] of Object.entries(locationToDiagnosis)) {
    if (lower.includes(keyword)) {
      return diagnosis;
    }
  }
  return "lombalgia";
}

function detectPhase(painLevel: number | null, chiefComplaint: string): string {
  if (!painLevel) return "subaguda";
  
  const lower = (chiefComplaint || "").toLowerCase();
  const isAcute = lower.includes("agud") || lower.includes("recente") || lower.includes("ontem") || lower.includes("hoje");
  const isChronic = lower.includes("crônic") || lower.includes("meses") || lower.includes("anos") || lower.includes("sempre");
  
  if (isAcute || painLevel >= 7) return "aguda";
  if (isChronic || painLevel <= 3) return "crônica";
  return "subaguda";
}

const icons: Record<string, React.ReactNode> = {
  TENS: <Zap className="w-4 h-4" />,
  Ultrassom: <Waves className="w-4 h-4" />,
  Laser: <Sun className="w-4 h-4" />,
  Crioterapia: <Snowflake className="w-4 h-4" />,
  Termoterapia: <Flame className="w-4 h-4" />,
};

const iconColors: Record<string, string> = {
  TENS: "text-yellow-500",
  Ultrassom: "text-blue-500",
  Laser: "text-red-500",
  Crioterapia: "text-cyan-500",
  Termoterapia: "text-orange-500",
};

export default function NeuroFluxQuickAccess({ evaluations }: NeuroFluxQuickAccessProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  // Extract clinical context from evaluations
  const clinicalContext = useMemo(() => {
    if (evaluations.length === 0) return null;
    
    // Get the most recent evaluation
    const latestEval = [...evaluations].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    const painLocation = latestEval.pain_location || "";
    const chiefComplaint = latestEval.chief_complaint || "";
    const painLevel = latestEval.pain_level;
    
    const diagnosis = detectDiagnosis(painLocation + " " + chiefComplaint);
    const phase = detectPhase(painLevel, chiefComplaint);
    
    // Determine other clinical factors
    let tissue = "músculo";
    let pathophysiology = "inflamatória";
    let objective = "analgesia";
    let irritability = "moderada";
    
    const combined = (painLocation + " " + chiefComplaint).toLowerCase();
    
    if (combined.includes("tendão") || combined.includes("tendin")) {
      tissue = "tendão";
    } else if (combined.includes("nervo") || combined.includes("neural") || combined.includes("formig")) {
      tissue = "nervo";
    } else if (combined.includes("articular") || combined.includes("artrose") || combined.includes("joelho") || combined.includes("ombro")) {
      tissue = "articulação";
    }
    
    if (combined.includes("crônic") || combined.includes("degener")) {
      pathophysiology = "degenerativa";
    } else if (combined.includes("nervo") || combined.includes("neural")) {
      pathophysiology = "neuropática";
    }
    
    if (painLevel !== null) {
      if (painLevel >= 7) irritability = "alta";
      else if (painLevel <= 3) irritability = "baixa";
    }
    
    if (combined.includes("edema") || combined.includes("inchaço")) {
      objective = "redução de edema";
    } else if (combined.includes("cicatriz") || combined.includes("pós-operatório") || combined.includes("cirurg")) {
      objective = "reparo tecidual";
    }
    
    const clinicalData: ClinicalData = {
      diagnosis,
      tissue,
      pathophysiology,
      phase,
      objective,
      irritability,
    };
    
    return {
      clinicalData,
      painLocation,
      chiefComplaint,
      painLevel,
    };
  }, [evaluations]);
  
  // Get recommendations
  const recommendations = useMemo(() => {
    if (!clinicalContext) return [];
    return getRecommendations(clinicalContext.clinicalData).slice(0, 3);
  }, [clinicalContext]);
  
  if (!clinicalContext || recommendations.length === 0) {
    return null;
  }
  
  const topRecommendation = recommendations[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5">
        <CardContent className="p-0">
          {/* Header */}
          <div 
            className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">NeuroFlux</h3>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-violet-500/50 text-violet-600">
                      <Sparkles className="w-2.5 h-2.5 mr-1" />
                      IA
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sugestão de eletroterapia baseada no quadro clínico
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10">
                  <span className={cn("flex items-center", iconColors[topRecommendation.name])}>
                    {icons[topRecommendation.name]}
                  </span>
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                    {topRecommendation.name}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[10px] px-1.5",
                      topRecommendation.evidenceLevel === "A" && "bg-emerald-500/20 text-emerald-700",
                      topRecommendation.evidenceLevel === "B" && "bg-blue-500/20 text-blue-700",
                      topRecommendation.evidenceLevel === "C" && "bg-amber-500/20 text-amber-700",
                    )}
                  >
                    Nível {topRecommendation.evidenceLevel}
                  </Badge>
                </div>
                
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Expanded Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
                  {/* Clinical Context Summary */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {clinicalContext.clinicalData.diagnosis}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Fase: {clinicalContext.clinicalData.phase}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Objetivo: {clinicalContext.clinicalData.objective}
                    </Badge>
                    {clinicalContext.painLevel !== null && (
                      <Badge variant="outline" className="text-xs">
                        EVA: {clinicalContext.painLevel}/10
                      </Badge>
                    )}
                  </div>
                  
                  {/* Top 3 Recommendations */}
                  <div className="space-y-2">
                    {recommendations.map((rec, idx) => (
                      <motion.div
                        key={rec.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          idx === 0 
                            ? "bg-violet-500/10 border border-violet-500/20" 
                            : "bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                          idx === 0 
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={iconColors[rec.name]}>
                              {icons[rec.name]}
                            </span>
                            <span className="font-medium text-sm">{rec.name}</span>
                            {rec.mode && (
                              <span className="text-xs text-muted-foreground">
                                ({rec.mode})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {rec.mainIndication}
                          </p>
                        </div>
                        
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-[10px] shrink-0",
                            rec.evidenceLevel === "A" && "border-emerald-500/50 text-emerald-600",
                            rec.evidenceLevel === "B" && "border-blue-500/50 text-blue-600",
                            rec.evidenceLevel === "C" && "border-amber-500/50 text-amber-600",
                          )}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          {rec.evidenceLevel}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Quick Parameters for Top Recommendation */}
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Parâmetros Sugeridos - {topRecommendation.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topRecommendation.parameters.slice(0, 3).map((param) => (
                        <div 
                          key={param.name}
                          className="text-xs bg-background rounded-lg px-2 py-1 border border-border/50"
                        >
                          <span className="text-muted-foreground">{param.name}:</span>{" "}
                          <span className="font-medium">{param.value}</span>
                        </div>
                      ))}
                      <div className="text-xs bg-background rounded-lg px-2 py-1 border border-border/50">
                        <span className="text-muted-foreground">Tempo:</span>{" "}
                        <span className="font-medium">{topRecommendation.applicationTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contraindications Warning if any */}
                  {topRecommendation.contraindications.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-2">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <p>
                        <span className="font-medium">Atenção:</span> Verifique contraindicações antes de aplicar
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    onClick={() => navigate("/dashboard/neuroflux")}
                  >
                    <Brain className="w-4 h-4" />
                    Abrir NeuroFlux Completo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
