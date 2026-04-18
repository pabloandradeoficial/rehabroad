import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, Waves, Sun, Snowflake, Flame, ChevronRight, Clock, Target,
  AlertTriangle, Lightbulb, BookOpen, CheckCircle2, Settings2, Sparkles,
  Activity, Shield, Search, User, X, FileText, Stethoscope, FlaskConical,
  Layers, RotateCcw, History, ChevronDown,
} from "lucide-react";
import PremiumGate from "@/react-app/components/PremiumGate";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Badge } from "@/react-app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/react-app/components/ui/dialog";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";
import { getRecommendations, type ClinicalData, type Recommendation } from "@/react-app/data/neurofluxData";
import { useNeuroflux } from "@/react-app/hooks/useNeuroflux";
import { apiFetch } from "@/react-app/lib/api";
import type { ClinicalContext } from "@/react-app/hooks/useClinicalContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Patient = {
  id: number;
  name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Evaluation = {
  id: number;
  patient_id: number;
  type: string;
  chief_complaint: string | null;
  history: string | null;
  pain_level: number | null;
  pain_location: string | null;
  functional_status: string | null;
  orthopedic_tests: string | null;
  observations: string | null;
  created_at: string;
};

type Mode = "free" | "patient";

// ─────────────────────────────────────────────
// Inference helpers
// ─────────────────────────────────────────────

function inferTissue(text: string): string | null {
  const t = text.toLowerCase();
  if (/tend[aã]o|tendino|tendinite|tendinopatia|tendinop/.test(t)) return "Tendão";
  if (/ligamento|entorse|lca|lcp|lcl|lcm|lcfl/.test(t)) return "Ligamento";
  if (/m[uú]sculo|mialgia|contratura|distens[aã]o|ruptura muscular|strain/.test(t)) return "Músculo";
  if (/c[aá]psula|capsulite/.test(t)) return "Cápsula Articular";
  return null;
}

function inferPathophysiology(diagnosis: string, history?: string | null): string | null {
  const text = `${diagnosis} ${history ?? ""}`.toLowerCase();
  if (/cirurg|p[oó]s.?op|operatório|p[oó]s.?cirúrg/.test(text)) return "Pós-operatório";
  if (/crôni|desgaste|artrose|degener|osteoartrite|artrit/.test(text)) return "Desgaste / Crônico";
  if (/sobrecarga|overuse|uso excessivo|repetitivo|esportivo/.test(text)) return "Sobrecarga / Irritado";
  if (/agudo|inflamat|inflama[cç][aã]|trauma|queda/.test(text)) return "Inflamatório Agudo";
  return null;
}

function inferIrritability(painLevel: number | null): string | null {
  if (painLevel === null || painLevel === undefined) return null;
  if (painLevel > 7) return "Alta";
  if (painLevel > 4) return "Média";
  return "Baixa";
}

function mapPatientToNeuroflux(
  patient: Patient,
  latestEval?: Evaluation | null
): { data: Partial<ClinicalData>; autoFilled: Set<keyof ClinicalData> } {
  const filled: Partial<ClinicalData> = {};
  const autoFilled = new Set<keyof ClinicalData>();

  // Diagnóstico — chief_complaint from evaluation is the best source
  const rawDiagnosis = latestEval?.chief_complaint?.trim() || patient.notes?.trim() || "";
  if (rawDiagnosis) {
    filled.diagnosis = rawDiagnosis;
    autoFilled.add("diagnosis");
  }

  const diagText = rawDiagnosis;

  // Tecido
  const tissue = inferTissue(diagText);
  if (tissue) {
    filled.tissue = tissue;
    autoFilled.add("tissue");
  }

  // Estado fisiopatológico
  const pathophysiology = inferPathophysiology(diagText, latestEval?.history);
  if (pathophysiology) {
    filled.pathophysiology = pathophysiology;
    autoFilled.add("pathophysiology");
  }

  // Irritabilidade — from pain_level
  const irritability = inferIrritability(latestEval?.pain_level ?? null);
  if (irritability) {
    filled.irritability = irritability;
    autoFilled.add("irritability");
  }

  return { data: filled, autoFilled };
}

// ─────────────────────────────────────────────
// AutoFill badge
// ─────────────────────────────────────────────

function AutoFillBadge({ onClear }: { onClear: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1 ml-2"
    >
      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] py-0 px-1.5 h-5 gap-0.5">
        <FileText className="w-2.5 h-2.5" />
        Do prontuário
      </Badge>
      <button
        type="button"
        onClick={onClear}
        title="Limpar campo"
        className="w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// SelectionButton — extended with autoFilled badge
// ─────────────────────────────────────────────

type SelectionButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  description?: string;
  isAutoFilled?: boolean;
  className?: string;
};

function SelectionButton({ selected, onClick, children, description, isAutoFilled, className }: SelectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 overflow-hidden text-left",
        selected
          ? "bg-violet-50 dark:bg-violet-500/10 text-violet-900 dark:text-violet-200 border-violet-500 shadow-sm"
          : "bg-white dark:bg-white/[0.03] text-foreground border-gray-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-violet-50/60 dark:hover:bg-violet-500/5",
        description && "flex flex-col gap-1",
        className
      )}
    >
      <span className="relative flex items-center gap-1.5">
        {children}
        {selected && (
          <span className="ml-auto pl-1 flex items-center gap-1 shrink-0">
            {isAutoFilled && <FileText className="w-3 h-3 text-amber-500" />}
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </span>
        )}
      </span>
      {description && (
        <p className={cn(
          "text-xs font-normal relative",
          selected ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// RecommendationCard (unchanged)
// ─────────────────────────────────────────────

function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const [expanded, setExpanded] = useState(rank === 1);

  const icons: Record<string, React.ReactNode> = {
    TENS: <Zap className="w-6 h-6" />,
    Ultrassom: <Waves className="w-6 h-6" />,
    Laser: <Sun className="w-6 h-6" />,
    Crioterapia: <Snowflake className="w-6 h-6" />,
    Termoterapia: <Flame className="w-6 h-6" />,
  };

  const rankConfig = [
    { label: "PRIMEIRA ESCOLHA", gradient: "from-amber-400 via-yellow-400 to-amber-500", glow: "shadow-amber-500/30", ring: "ring-amber-500/50" },
    { label: "SEGUNDA OPÇÃO", gradient: "from-slate-300 via-gray-300 to-slate-400", glow: "shadow-slate-400/20", ring: "ring-slate-400/30" },
    { label: "TERCEIRA OPÇÃO", gradient: "from-orange-400 via-amber-500 to-orange-500", glow: "shadow-orange-500/20", ring: "ring-orange-500/30" },
    { label: "QUARTA OPÇÃO", gradient: "from-violet-400 via-purple-400 to-violet-500", glow: "shadow-violet-500/20", ring: "ring-violet-500/30" },
    { label: "QUINTA OPÇÃO", gradient: "from-teal-400 via-cyan-400 to-teal-500", glow: "shadow-teal-500/20", ring: "ring-teal-500/30" },
  ];

  const config = rankConfig[rank - 1];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.08 }}>
      <Card className={cn(
        "relative overflow-hidden border-0 shadow-xl backdrop-blur-xl transition-all duration-300",
        rank === 1 ? `ring-2 ${config.ring} ${config.glow} shadow-2xl` : "bg-card/80"
      )}>
        {rank === 1 && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5" />}

        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={cn("relative w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-xl", config.gradient, config.glow)}>
                {rank === 1 && <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />}
                <span className="relative font-black text-2xl">{rank}</span>
              </div>
              <div>
                <p className={cn("text-xs font-bold tracking-wider uppercase", rank === 1 ? "text-amber-500" : "text-muted-foreground")}>{config.label}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-violet-500">{icons[rec.name]}</div>
                  <CardTitle className="text-2xl font-black">{rec.name}</CardTitle>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {rec.mode && (
                <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
                  <Settings2 className="w-3 h-3 mr-1" />{rec.mode}
                </Badge>
              )}
              <Badge className={cn(
                "font-bold shadow-md",
                rec.evidenceLevel === "A" && "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0",
                rec.evidenceLevel === "B" && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0",
                rec.evidenceLevel === "C" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
              )}>
                Evidência {rec.evidenceLevel}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/10">
            <Target className="w-5 h-5 text-violet-500 shrink-0" />
            <span className="text-sm"><strong className="text-foreground">Indicação:</strong> <span className="text-muted-foreground">{rec.mainIndication}</span></span>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-5 pb-6">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Settings2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-foreground">Parâmetros Sugeridos</span>
            </div>
            <div className="p-4 bg-card/50 space-y-2">
              {rec.parameters.map((param, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                  <span className="text-muted-foreground text-sm">{param.name}</span>
                  <span className="font-bold text-foreground">{param.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Tempo de Aplicação</p>
              <p className="text-xl font-black text-foreground">{rec.applicationTime}</p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-3 text-violet-500 hover:bg-violet-500/5 rounded-xl transition-all font-semibold"
          >
            <span>{expanded ? "Ocultar detalhes" : "Ver detalhes completos"}</span>
            <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", expanded && "rotate-90")} />
          </button>

          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-teal-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/5">
                  <Target className="w-5 h-5 text-teal-500" />
                  <span className="font-bold text-teal-700 dark:text-teal-300">Como Aplicar no Corpo</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.howToApply.description}</p>
                  {rec.howToApply.techniques && (
                    <div className="mt-3">
                      <p className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400 mb-2">Técnicas:</p>
                      <ul className="space-y-1.5">
                        {rec.howToApply.techniques.map((t, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/5">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-amber-700 dark:text-amber-300">Dicas Práticas</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {rec.practicalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-rose-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-500/10 to-red-500/5">
                  <Shield className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-rose-700 dark:text-rose-300">Contraindicações</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {rec.contraindications.map((c, idx) => (
                      <li key={idx} className="text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/5">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-purple-700 dark:text-purple-300">Fundamentação</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.scientificRationale}</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-emerald-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/5">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Nível de Evidência {rec.evidenceLevel}</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.evidenceDescription}</p>
                  {rec.references && (
                    <div className="text-xs text-muted-foreground/70 pt-2 border-t border-white/5">
                      <p className="font-semibold mb-1.5">Referências:</p>
                      {rec.references.map((ref, idx) => (
                        <p key={idx} className="leading-relaxed">• {ref}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {rec.clinicalObservation && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span><strong>Observação:</strong> {rec.clinicalObservation}</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// HistorySection
// ─────────────────────────────────────────────

function HistorySection({
  records,
  loading,
  patientName,
}: {
  records: { id: number; patient_id: string | null; diagnosis: string; tissue: string | null; pathophysiology: string | null; phase: string | null; objective: string | null; irritability: string | null; created_at: string }[];
  loading: boolean;
  patientName?: string;
}) {
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (records.length === 0) return null;

  const getTopModality = (r: typeof records[0]): string | null => {
    if (!r.diagnosis || !r.tissue || !r.pathophysiology || !r.phase || !r.objective || !r.irritability) return null;
    try {
      const recs = getRecommendations({
        diagnosis: r.diagnosis,
        tissue: r.tissue,
        pathophysiology: r.pathophysiology,
        phase: r.phase,
        objective: r.objective,
        irritability: r.irritability,
      });
      return recs[0]?.name ?? null;
    } catch {
      return null;
    }
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 via-violet-900/30 to-slate-900 text-white hover:via-violet-900/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <History className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Histórico NeuroFlux</p>
            <p className="text-xs text-white/60">
              {patientName ? `${patientName} — ` : ""}{records.length} consulta{records.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-white/60 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <CardContent className="p-0 divide-y divide-white/5">
          {records.map((r) => {
            const topModality = getTopModality(r);
            const date = new Date(r.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit", month: "short", year: "numeric",
            });
            return (
              <div key={r.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{r.diagnosis}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {r.tissue && <Badge variant="outline" className="text-[10px] py-0 h-4 border-white/10 text-muted-foreground">{r.tissue}</Badge>}
                      {r.phase && <Badge variant="outline" className="text-[10px] py-0 h-4 border-white/10 text-muted-foreground">Fase {r.phase}</Badge>}
                      {topModality && (
                        <Badge className="text-[10px] py-0 h-4 bg-violet-500/10 text-violet-500 border-violet-500/20">
                          <Zap className="w-2.5 h-2.5 mr-0.5" />{topModality}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{date}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────
// Scientific references (unchanged data)
// ─────────────────────────────────────────────

const scientificReferences = [
  { category: "TENS", refs: ["Sluka KA, Walsh D. J Pain. 2003;4(3):109-21.", "Johnson MI et al. Eur J Pain. 2022;26(1):29-44.", "Vance CG et al. Pain Manag. 2014;4(3):197-209."] },
  { category: "Ultrassom Terapêutico", refs: ["Watson T. Ultrasonics. 2008;48(4):321-9.", "Miller DL et al. J Ultrasound Med. 2012;31(4):623-34.", "Robertson VJ, Baker KG. Phys Ther. 2001;81(7):1339-50."] },
  { category: "Laserterapia", refs: ["Chung H et al. Ann Biomed Eng. 2012;40(2):516-33.", "Huang YY et al. Dose Response. 2009;7(4):358-83.", "Bjordal JM et al. Clin Rehabil. 2008;22(10-11):952-65."] },
  { category: "Crioterapia", refs: ["Bleakley C et al. Am J Sports Med. 2004;32(1):251-61.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65.", "Kwiecien SY, McHugh MP. Eur J Appl Physiol. 2021;121(8):2125-42."] },
  { category: "Termoterapia", refs: ["Nadler SF et al. Pain Physician. 2004;7(3):395-9.", "Petrofsky J et al. J Med Eng Technol. 2009;33(5):361-9.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65."] },
];

// ─────────────────────────────────────────────
// EMPTY FORM state
// ─────────────────────────────────────────────

const EMPTY_FORM: ClinicalData = {
  diagnosis: "",
  tissue: null,
  pathophysiology: null,
  phase: null,
  objective: null,
  irritability: null,
};

// ─────────────────────────────────────────────
// Main content component
// ─────────────────────────────────────────────

function NeuroFluxContent() {
  // Mode
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem("neuroflux-mode") as Mode | null) ?? "free"
  );

  // Patient search
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patientsLoaded, setPatientsLoaded] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientLatestEval, setPatientLatestEval] = useState<Evaluation | null>(null);
  const [patientClinicalContext, setPatientClinicalContext] = useState<ClinicalContext | null>(null);
  const [contextAlerts, setContextAlerts] = useState<string[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Form
  const [formData, setFormData] = useState<ClinicalData>(EMPTY_FORM);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<keyof ClinicalData>>(new Set());
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [generating, setGenerating] = useState(false);

  // History — patient-specific or general
  const patientIdStr = selectedPatient ? String(selectedPatient.id) : undefined;
  const { data: historyData, loading: historyLoading, saveProgress } = useNeuroflux(
    mode === "patient" ? patientIdStr : undefined
  );

  // ── Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Load patients when entering patient mode
  useEffect(() => {
    if (mode === "patient" && !patientsLoaded) {
      setPatientsLoading(true);
      apiFetch("/api/patients")
        .then((r) => r.json())
        .then((d: unknown) => {
          setAllPatients(Array.isArray(d) ? (d as Patient[]) : []);
          setPatientsLoaded(true);
        })
        .catch(() => {})
        .finally(() => setPatientsLoading(false));
    }
  }, [mode, patientsLoaded]);

  // ── Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Filtered patients for dropdown
  const filteredPatients = useMemo(() => {
    if (!debouncedSearch.trim()) return allPatients.slice(0, 6);
    const lower = debouncedSearch.toLowerCase();
    return allPatients.filter((p) => p.name.toLowerCase().includes(lower)).slice(0, 8);
  }, [allPatients, debouncedSearch]);

  // ── Select patient and auto-fill form
  const handleSelectPatient = useCallback(async (patient: Patient) => {
    setSelectedPatient(patient);
    localStorage.setItem("apoio-clinico-patient-id", String(patient.id));
    setSearch(patient.name);
    setShowDropdown(false);
    setDetailLoading(true);
    setRecommendations(null);

    try {
      // Fetch evaluations + clinical context in parallel
      const [evalsRes, ctxRes] = await Promise.all([
        apiFetch(`/api/patients/${patient.id}/evaluations`),
        apiFetch(`/api/clinical-context/${patient.id}`),
      ]);

      const evals: Evaluation[] = evalsRes.ok ? ((await evalsRes.json()) as Evaluation[]) : [];
      const latestEvalData = evals[0] ?? null;
      setPatientLatestEval(latestEvalData);

      const ctx: ClinicalContext | null = ctxRes.ok ? ((await ctxRes.json()) as ClinicalContext) : null;
      setPatientClinicalContext(ctx);

      // Base auto-fill from evaluation
      const { data: mapped, autoFilled } = mapPatientToNeuroflux(patient, latestEvalData);

      // Smart overrides from clinical context
      const overrides: Partial<ClinicalData> = {};
      const overriddenFields = new Set<keyof ClinicalData>();
      const alerts: string[] = [];

      if (ctx) {
        const { clinicalFlags, evolutionSummary } = ctx;

        // High pain + acute → force irritability Alta + phase Aguda
        if (clinicalFlags.highPain && clinicalFlags.isAcute) {
          overrides.irritability = "Alta";
          overrides.phase = "Aguda";
          overriddenFields.add("irritability");
          overriddenFields.add("phase");
          alerts.push("Parâmetros ajustados para dor aguda intensa");
        } else if (clinicalFlags.isSubacute && !mapped.phase) {
          overrides.phase = "Subaguda";
          overriddenFields.add("phase");
        } else if (clinicalFlags.isChronic && !mapped.phase) {
          overrides.phase = "Crônica";
          overriddenFields.add("phase");
          // Chronic + low pain + many sessions → suggest bioestimulação
          if (!clinicalFlags.highPain && evolutionSummary.totalSessions > 10) {
            overrides.objective = "Bioestimulação";
            overriddenFields.add("objective");
            alerts.push("Fase crônica avançada: foco em reparação tecidual");
          }
        }

        // Not improving for 5+ sessions
        if (clinicalFlags.notImproving && evolutionSummary.totalSessions >= 5) {
          alerts.push("Sem melhora significativa após 5+ sessões. Considere alternar modalidade.");
        }
      }

      setContextAlerts(alerts);
      setFormData({ ...EMPTY_FORM, ...mapped, ...overrides });
      setAutoFilledFields(new Set([...autoFilled, ...overriddenFields]));
    } catch {
      // non-blocking
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ── Restore persisted patient on mount (after patients load)
  const restoredPatientRef = useRef(false);
  useEffect(() => {
    if (allPatients.length > 0 && !restoredPatientRef.current && !selectedPatient) {
      const savedId = localStorage.getItem("apoio-clinico-patient-id");
      if (savedId) {
        const found = allPatients.find((p) => String(p.id) === savedId);
        if (found) {
          restoredPatientRef.current = true;
          void handleSelectPatient(found);
        }
      }
    }
  }, [allPatients.length, selectedPatient, handleSelectPatient]);

  // ── Clear patient (full reset — used on mode switch to free)
  const handleClearPatient = useCallback(() => {
    setSelectedPatient(null);
    localStorage.removeItem("apoio-clinico-patient-id");
    setPatientLatestEval(null);
    setPatientClinicalContext(null);
    setContextAlerts([]);
    setSearch("");
    setFormData(EMPTY_FORM);
    setAutoFilledFields(new Set());
    setRecommendations(null);
  }, []);

  // ── Trocar patient — reopens search without wiping form yet
  const handleTrocarPatient = useCallback(() => {
    setSelectedPatient(null);
    localStorage.removeItem("apoio-clinico-patient-id");
    setPatientLatestEval(null);
    setPatientClinicalContext(null);
    setContextAlerts([]);
    setSearch("");
    setRecommendations(null);
  }, []);

  // ── Clear one auto-filled field
  const clearAutoFilledField = useCallback((field: keyof ClinicalData) => {
    setAutoFilledFields((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    if (field === "diagnosis") {
      setFormData((prev) => ({ ...prev, diagnosis: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: null }));
    }
  }, []);

  // ── Mode switch
  const handleModeSwitch = useCallback((newMode: Mode) => {
    if (newMode === "free" && (autoFilledFields.size > 0 || formData.diagnosis.trim() !== "")) {
      if (!window.confirm("Limpar dados do paciente?")) return;
    }
    setMode(newMode);
    localStorage.setItem("neuroflux-mode", newMode);
    if (newMode === "free") {
      handleClearPatient();
    }
  }, [handleClearPatient, autoFilledFields.size, formData.diagnosis]);

  // ── Field update helper
  const setField = useCallback(<K extends keyof ClinicalData>(key: K, value: ClinicalData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // If user manually changes a pre-filled field, clear its badge
    setAutoFilledFields((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isFormComplete =
    formData.diagnosis.trim() !== "" &&
    formData.tissue !== null &&
    formData.pathophysiology !== null &&
    formData.phase !== null &&
    formData.objective !== null &&
    formData.irritability !== null;

  const handleGenerateRecommendation = useCallback(() => {
    if (!isFormComplete) return;
    setGenerating(true);
    // slight visual delay for feedback
    setTimeout(() => {
      setRecommendations(getRecommendations(formData));
      void saveProgress(formData, selectedPatient ? String(selectedPatient.id) : null);
      setGenerating(false);
    }, 600);
  }, [isFormComplete, formData, saveProgress, selectedPatient]);

  const handleReset = useCallback(() => {
    setFormData(selectedPatient ? formData : EMPTY_FORM);
    setRecommendations(null);
  }, [selectedPatient, formData]);

  // ── Helper: is a field auto-filled?
  const isAF = (f: keyof ClinicalData) => autoFilledFields.has(f);

  // ─────────────────────────────────────────────
  // Generate button (shared between desktop and mobile sticky)
  // ─────────────────────────────────────────────
  const generateButton = (
    <Button
      onClick={handleGenerateRecommendation}
      disabled={!isFormComplete || generating}
      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-violet-500/25 disabled:opacity-50 disabled:shadow-none transition-all duration-150"
    >
      {generating ? (
        <>
          <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Analisando dados clínicos...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          Gerar Recomendação
          <ChevronRight className="w-5 h-5 ml-2" />
        </>
      )}
    </Button>
  );

  return (
    <>
      <div className="space-y-6 pb-6">

        {/* ── SEÇÃO A: Hero Header ──────────────────── */}
        <motion.div
          className="relative overflow-hidden rounded-2xl mx-3"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_50%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative p-6 md:p-10">
            {/* Top row: title + science button */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Suporte à Decisão Clínica</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">NeuroFlux</h1>
                  <p className="text-violet-200 mt-1 text-sm md:text-base">Recomendações baseadas em evidência para eletroterapia</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl gap-2 shadow-xl self-start">
                    <BookOpen className="w-4 h-4" />
                    Base Científica
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <BookOpen className="w-5 h-5 text-violet-500" />
                      Base Científica do NeuroFlux
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <p className="text-sm text-muted-foreground">Referências científicas utilizadas para cada modalidade terapêutica.</p>
                    {scientificReferences.map((section, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="font-bold text-violet-600 dark:text-violet-400">{section.category}</h3>
                        <ul className="space-y-1.5">
                          {section.refs.map((ref, i) => (
                            <li key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-violet-500/30">{ref}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mode toggle */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Modo de uso</p>
              <div className="inline-flex bg-white/10 rounded-2xl p-1 gap-1 backdrop-blur-xl border border-white/10">
                <button
                  onClick={() => handleModeSwitch("free")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    mode === "free"
                      ? "bg-white text-violet-700 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <FlaskConical className="w-4 h-4" />
                  Estudo livre
                </button>
                <button
                  onClick={() => handleModeSwitch("patient")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    mode === "patient"
                      ? "bg-white text-violet-700 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Stethoscope className="w-4 h-4" />
                  Por paciente
                </button>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: Zap, text: "Ranking inteligente" },
                { icon: Settings2, text: "Parâmetros completos" },
                { icon: BookOpen, text: "Baseado em evidência" },
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10"
                >
                  <feat.icon className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-semibold text-white/80">{feat.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SEÇÃO B: Patient selector (só modo "Por paciente") ── */}
        <AnimatePresence>
          {mode === "patient" && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: undefined }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "visible" }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-900 via-violet-900/40 to-slate-900 text-white p-5 rounded-t-lg overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">Selecionar Paciente</CardTitle>
                      <p className="text-xs text-white/60 mt-0.5">Dados serão pré-preenchidos automaticamente</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Search input */}
                  {!selectedPatient ? (
                    <div ref={searchRef} className="relative w-full">
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar paciente pelo nome..."
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="pl-10 h-12 w-full bg-white/[0.02] border-white/10 focus:border-violet-500/50 rounded-xl"
                          disabled={patientsLoading}
                        />
                        {patientsLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                        )}
                      </div>

                      {/* Dropdown */}
                      <AnimatePresence>
                        {showDropdown && filteredPatients.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-white/10 bg-card shadow-2xl overflow-hidden"
                          >
                            {filteredPatients.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onMouseDown={() => handleSelectPatient(p)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-500/10 transition-colors border-b border-white/5 last:border-0"
                              >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-violet-500">
                                    {p.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                                  {p.notes && (
                                    <p className="text-xs text-muted-foreground truncate">{p.notes}</p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                        {showDropdown && !patientsLoading && debouncedSearch.length > 1 && filteredPatients.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-white/10 bg-card shadow-2xl p-4 text-center"
                          >
                            <p className="text-sm text-muted-foreground">Nenhum paciente encontrado</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    /* Selected patient card */
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-violet-500/10 border border-violet-500/25 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                            <span className="text-sm font-black text-violet-500">
                              {selectedPatient.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground flex items-center gap-2">
                              {selectedPatient.name}
                              {detailLoading && (
                                <span className="w-3.5 h-3.5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin inline-block" />
                              )}
                            </p>
                            {!detailLoading && (
                              <>
                                {(patientLatestEval?.chief_complaint || selectedPatient.notes) && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[240px] mt-0.5">
                                    {patientLatestEval?.chief_complaint ?? selectedPatient.notes}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {formData.phase && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                      {formData.phase}
                                    </span>
                                  )}
                                  {patientClinicalContext?.evolutionSummary.currentPainLevel != null && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                      <span className="font-semibold text-foreground">{patientClinicalContext.evolutionSummary.currentPainLevel}/10</span>
                                      {" "}dor
                                    </span>
                                  )}
                                  {patientClinicalContext?.evolutionSummary.painTrend && (
                                    <span className={cn(
                                      "text-[10px] font-semibold",
                                      patientClinicalContext.evolutionSummary.painTrend === "improving" ? "text-emerald-500"
                                      : patientClinicalContext.evolutionSummary.painTrend === "worsening" ? "text-rose-500"
                                      : "text-amber-500"
                                    )}>
                                      {patientClinicalContext.evolutionSummary.painTrend === "improving" ? "↓" : patientClinicalContext.evolutionSummary.painTrend === "worsening" ? "↑" : "→"}
                                    </span>
                                  )}
                                  {patientClinicalContext?.evolutionSummary.totalSessions != null && (
                                    <span className="text-[10px] text-muted-foreground">
                                      {patientClinicalContext.evolutionSummary.totalSessions} sessão{patientClinicalContext.evolutionSummary.totalSessions !== 1 ? "ões" : ""}
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleTrocarPatient}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-colors border border-violet-500/25 shrink-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Trocar
                        </button>
                      </div>
                      {autoFilledFields.size > 0 && !detailLoading && (
                        <div className="flex items-center gap-1.5 pt-1 border-t border-violet-500/15">
                          <FileText className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            {autoFilledFields.size} campo{autoFilledFields.size !== 1 ? "s" : ""} pré-preenchido{autoFilledFields.size !== 1 ? "s" : ""} do prontuário
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SEÇÃO B2: Clinical context card ────────── */}
        <AnimatePresence>
          {mode === "patient" && selectedPatient && patientClinicalContext && !detailLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-900/40 to-slate-900 text-white p-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">Contexto clínico</CardTitle>
                      <p className="text-xs text-white/60 mt-0.5">Dados clínicos que orientaram os campos abaixo</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                      <p className="text-lg font-black text-foreground">
                        {patientClinicalContext.evolutionSummary.totalSessions}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sessões</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                      <p className="text-lg font-black text-foreground">
                        {patientClinicalContext.evolutionSummary.initialPainLevel != null
                          ? `${patientClinicalContext.evolutionSummary.initialPainLevel}/10`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dor inicial</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                      <p className="text-lg font-black text-foreground">
                        {patientClinicalContext.evolutionSummary.currentPainLevel != null
                          ? `${patientClinicalContext.evolutionSummary.currentPainLevel}/10`
                          : "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dor atual</p>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className="text-sm text-muted-foreground">Tendência:</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      patientClinicalContext.evolutionSummary.painTrend === "improving"
                        ? "text-emerald-500"
                        : patientClinicalContext.evolutionSummary.painTrend === "worsening"
                        ? "text-rose-500"
                        : "text-amber-500"
                    )}>
                      {patientClinicalContext.evolutionSummary.painTrend === "improving"
                        ? "↓ Melhorando"
                        : patientClinicalContext.evolutionSummary.painTrend === "worsening"
                        ? "↑ Piorando"
                        : "→ Estável"}
                    </span>
                    {patientClinicalContext.clinicalFlags.fewSessions && (
                      <span className="text-xs text-muted-foreground ml-auto">(poucas sessões)</span>
                    )}
                  </div>

                  {/* Procedures */}
                  {patientClinicalContext.evolutionSummary.proceduresUsed.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1.5">Procedimentos recentes:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {patientClinicalContext.evolutionSummary.proceduresUsed.slice(0, 6).map((proc, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] h-5 border-white/10 text-muted-foreground">
                            {proc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No evaluation notice */}
                  {!patientClinicalContext.latestEvaluation && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Cadastre uma avaliação para ativar sugestões personalizadas
                      </p>
                    </div>
                  )}

                  {/* No evolutions notice */}
                  {patientClinicalContext.clinicalFlags.fewSessions && patientClinicalContext.latestEvaluation && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Sem histórico de sessões — sugestões baseadas apenas na avaliação inicial
                      </p>
                    </div>
                  )}

                  {/* Smart adjustment alerts */}
                  {contextAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-violet-600 dark:text-violet-400">{alert}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SEÇÃO C: Clinical fields ──────────────── */}
        {!recommendations && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-violet-900/50 to-slate-900 text-white p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Dados Clínicos</CardTitle>
                    <p className="text-xs text-white/60 mt-0.5">
                      {mode === "patient" && selectedPatient
                        ? `Revise e ajuste os dados de ${selectedPatient.name}`
                        : "Preencha para gerar recomendações personalizadas"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                  {/* ── Coluna esquerda ── */}
                  <div className="space-y-8">
                    {/* 1. Diagnóstico */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center flex-wrap gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-violet-500" />
                          Nome do Problema / Diagnóstico
                        </span>
                        <AnimatePresence>
                          {isAF("diagnosis") && (
                            <AutoFillBadge onClear={() => clearAutoFilledField("diagnosis")} />
                          )}
                        </AnimatePresence>
                      </Label>
                      <Input
                        placeholder="Ex: Tendinopatia do supraespinhal, Lombalgia mecânica..."
                        value={formData.diagnosis}
                        onChange={(e) => setField("diagnosis", e.target.value)}
                        className={cn(
                          "h-12 text-sm bg-white/[0.02] border-white/10 focus:border-violet-500/50 rounded-xl transition-colors",
                          isAF("diagnosis") && "border-amber-500/30 bg-amber-500/5"
                        )}
                      />
                    </div>

                    {/* 3. Estado Fisiopatológico */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center flex-wrap gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">3</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-violet-500" />
                          Estado Fisiopatológico
                        </span>
                        <AnimatePresence>
                          {isAF("pathophysiology") && (
                            <AutoFillBadge onClear={() => clearAutoFilledField("pathophysiology")} />
                          )}
                        </AnimatePresence>
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { value: "Inflamatório Agudo", desc: "Lesão recente com sinais flogísticos" },
                          { value: "Sobrecarga / Irritado", desc: "Uso excessivo sem inflamação clássica" },
                          { value: "Desgaste / Crônico", desc: "Alterações estruturais ao longo do tempo" },
                          { value: "Pós-operatório", desc: "Após procedimento cirúrgico" },
                        ].map((p) => (
                          <SelectionButton
                            key={p.value}
                            selected={formData.pathophysiology === p.value}
                            onClick={() => setField("pathophysiology", p.value)}
                            description={p.desc}
                            isAutoFilled={isAF("pathophysiology") && formData.pathophysiology === p.value}
                          >
                            {p.value}
                          </SelectionButton>
                        ))}
                      </div>
                    </div>

                    {/* 5. Objetivo Terapêutico */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">5</span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-violet-500" />
                          Objetivo Terapêutico Principal
                        </span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["Analgesia", "Redução de Edema", "Bioestimulação", "Ganho de Mobilidade", "Relaxamento Muscular"].map((o) => (
                          <SelectionButton
                            key={o}
                            selected={formData.objective === o}
                            onClick={() => setField("objective", o)}
                          >
                            {o}
                          </SelectionButton>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Coluna direita ── */}
                  <div className="space-y-8">
                    {/* 2. Tecido Predominante */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center flex-wrap gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-violet-500" />
                          Tecido Predominante
                        </span>
                        <AnimatePresence>
                          {isAF("tissue") && (
                            <AutoFillBadge onClear={() => clearAutoFilledField("tissue")} />
                          )}
                        </AnimatePresence>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["Músculo", "Tendão", "Ligamento", "Cápsula Articular", "Múltiplo / Misto"].map((t) => (
                          <SelectionButton
                            key={t}
                            selected={formData.tissue === t}
                            onClick={() => setField("tissue", t)}
                            isAutoFilled={isAF("tissue") && formData.tissue === t}
                          >
                            {t}
                          </SelectionButton>
                        ))}
                      </div>
                    </div>

                    {/* 4. Fase da Lesão */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">4</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-violet-500" />
                          Fase da Lesão
                        </span>
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "Aguda", desc: "0–7 dias" },
                          { value: "Subaguda", desc: "7–21 dias" },
                          { value: "Crônica", desc: ">21 dias" },
                        ].map((p) => (
                          <SelectionButton
                            key={p.value}
                            selected={formData.phase === p.value}
                            onClick={() => setField("phase", p.value)}
                            description={p.desc}
                          >
                            {p.value}
                          </SelectionButton>
                        ))}
                      </div>
                    </div>

                    {/* 6. Irritabilidade */}
                    <div className="bg-white dark:bg-white/[0.02] border border-violet-500/20 rounded-xl p-5 shadow-sm space-y-3">
                      <Label className="text-sm font-bold flex items-center flex-wrap gap-1">
                        <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">6</span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-violet-500" />
                          Irritabilidade Tecidual
                        </span>
                        <AnimatePresence>
                          {isAF("irritability") && (
                            <AutoFillBadge onClear={() => clearAutoFilledField("irritability")} />
                          )}
                        </AnimatePresence>
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "Alta", desc: "Dor fácil, limita AVDs" },
                          { value: "Média", desc: "Dor moderada" },
                          { value: "Baixa", desc: "Dor só no fim da amplitude" },
                        ].map((i) => (
                          <SelectionButton
                            key={i.value}
                            selected={formData.irritability === i.value}
                            onClick={() => setField("irritability", i.value)}
                            description={i.desc}
                            isAutoFilled={isAF("irritability") && formData.irritability === i.value}
                          >
                            {i.value}
                          </SelectionButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SEÇÃO D: Botão desktop ── */}
                <div className="hidden md:block mt-8 pt-6 border-t border-white/10">
                  {!isFormComplete && (
                    <div className="flex items-center gap-2 text-amber-500 text-sm mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Preencha todos os 6 campos para gerar a recomendação</span>
                    </div>
                  )}
                  {generateButton}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── SEÇÃO D: Botão mobile (sticky) ── */}
        {!recommendations && (
          <div className="md:hidden sticky bottom-0 z-30 px-4 pb-4 pt-2 bg-background/95 backdrop-blur-xl border-t border-white/10">
            {generateButton}
          </div>
        )}

        {/* ── Results ── */}
        {recommendations && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Análise Concluída</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black">Recomendação para: {formData.diagnosis}</h2>
                      {selectedPatient && (
                        <p className="text-sm text-violet-200 mt-1 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {selectedPatient.name}
                        </p>
                      )}
                    </div>
                    <Button onClick={handleReset} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg shrink-0">
                      Nova Análise
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-white/20 text-white border-0"><Clock className="w-3 h-3 mr-1" />Fase {formData.phase}</Badge>
                    <Badge className="bg-white/20 text-white border-0"><Target className="w-3 h-3 mr-1" />{formData.objective}</Badge>
                    <Badge className="bg-white/20 text-white border-0"><Zap className="w-3 h-3 mr-1" />Irritabilidade {formData.irritability}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-6">
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={rec.name} rec={rec} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* ── SEÇÃO E: Histórico ── */}
        <HistorySection
          records={historyData}
          loading={historyLoading}
          patientName={selectedPatient?.name}
        />
      </div>
    </>
  );
}

export default function NeuroFlux() {
  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <PremiumGate moduleName="NeuroFlux">
        <NeuroFluxContent />
      </PremiumGate>
    </>
  );
}
