import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Waves, Sun, Snowflake, Flame, ChevronRight, Clock, Target, AlertTriangle, Lightbulb, BookOpen, CheckCircle2, Settings2, Sparkles, Activity, Shield } from "lucide-react";
import PremiumGate from "@/react-app/components/PremiumGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Badge } from "@/react-app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/react-app/components/ui/dialog";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";
import { getRecommendations, type ClinicalData, type Recommendation } from "@/react-app/data/neurofluxData";
import { PageTransition } from "@/react-app/components/ui/microinteractions";

type SelectionButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  description?: string;
  className?: string;
};

function SelectionButton({ selected, onClick, children, description, className }: SelectionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-5 py-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-300 overflow-hidden",
        selected
          ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-500 shadow-xl shadow-violet-500/25"
          : "bg-white/[0.02] text-foreground border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5",
        description && "text-left",
        className
      )}
    >
      {selected && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
      )}
      <span className="relative">{children}</span>
      {description && (
        <p className={cn(
          "text-xs mt-1.5 font-normal relative",
          selected ? "text-violet-100" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </motion.button>
  );
}

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-0 shadow-xl backdrop-blur-xl transition-all duration-500",
        rank === 1 ? `ring-2 ${config.ring} ${config.glow} shadow-2xl` : "bg-card/80"
      )}>
        {rank === 1 && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5" />
        )}
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-xl",
                config.gradient, config.glow
              )}>
                {rank === 1 && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />
                )}
                <span className="relative font-black text-2xl">{rank}</span>
              </div>
              <div>
                <p className={cn(
                  "text-xs font-bold tracking-wider uppercase",
                  rank === 1 ? "text-amber-500" : "text-muted-foreground"
                )}>
                  {config.label}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-violet-500">{icons[rec.name]}</div>
                  <CardTitle className="text-2xl font-black">{rec.name}</CardTitle>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {rec.mode && (
                <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
                  <Settings2 className="w-3 h-3 mr-1" />
                  {rec.mode}
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
          {/* Parameters */}
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

          {/* Application Time */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Tempo de Aplicação</p>
              <p className="text-xl font-black text-foreground">{rec.applicationTime}</p>
            </div>
          </div>

          {/* Expandable Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-3 text-violet-500 hover:bg-violet-500/5 rounded-xl transition-all font-semibold"
          >
            <span>{expanded ? "Ocultar detalhes" : "Ver detalhes completos"}</span>
            <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", expanded && "rotate-90")} />
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-5"
            >
              {/* How to Apply */}
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

              {/* Practical Tips */}
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

              {/* Contraindications */}
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

              {/* Scientific Rationale */}
              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/5">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-purple-700 dark:text-purple-300">Fundamentação</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.scientificRationale}</p>
                </div>
              </div>

              {/* Evidence */}
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

const scientificReferences = [
  { category: "TENS", refs: ["Sluka KA, Walsh D. J Pain. 2003;4(3):109-21.", "Johnson MI et al. Eur J Pain. 2022;26(1):29-44.", "Vance CG et al. Pain Manag. 2014;4(3):197-209."] },
  { category: "Ultrassom Terapêutico", refs: ["Watson T. Ultrasonics. 2008;48(4):321-9.", "Miller DL et al. J Ultrasound Med. 2012;31(4):623-34.", "Robertson VJ, Baker KG. Phys Ther. 2001;81(7):1339-50."] },
  { category: "Laserterapia", refs: ["Chung H et al. Ann Biomed Eng. 2012;40(2):516-33.", "Huang YY et al. Dose Response. 2009;7(4):358-83.", "Bjordal JM et al. Clin Rehabil. 2008;22(10-11):952-65."] },
  { category: "Crioterapia", refs: ["Bleakley C et al. Am J Sports Med. 2004;32(1):251-61.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65.", "Kwiecien SY, McHugh MP. Eur J Appl Physiol. 2021;121(8):2125-42."] },
  { category: "Termoterapia", refs: ["Nadler SF et al. Pain Physician. 2004;7(3):395-9.", "Petrofsky J et al. J Med Eng Technol. 2009;33(5):361-9.", "Malanga GA et al. Postgrad Med. 2015;127(1):57-65."] }
];

function NeuroFluxContent() {
  const [formData, setFormData] = useState<ClinicalData>({
    diagnosis: "", tissue: null, pathophysiology: null, phase: null, objective: null, irritability: null,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const isFormComplete = formData.diagnosis.trim() !== "" && formData.tissue !== null && formData.pathophysiology !== null && formData.phase !== null && formData.objective !== null && formData.irritability !== null;

  const handleGenerateRecommendation = () => {
    if (isFormComplete) setRecommendations(getRecommendations(formData));
  };

  const handleReset = () => {
    setFormData({ diagnosis: "", tissue: null, pathophysiology: null, phase: null, objective: null, irritability: null });
    setRecommendations(null);
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-8">
        {/* Hero Header */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.3),transparent_50%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Suporte à Decisão Clínica</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">NeuroFlux</h1>
                  <p className="text-violet-200 mt-1">Recomendações baseadas em evidência para eletroterapia</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl gap-2 shadow-xl">
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

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Zap, title: "Ranking Inteligente", desc: "Recursos priorizados por indicação" },
                { icon: Settings2, title: "Parâmetros Completos", desc: "Protocolos detalhados de aplicação" },
                { icon: BookOpen, title: "Baseado em Evidência", desc: "Fundamentação científica sólida" },
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <feat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{feat.title}</p>
                      <p className="text-xs text-white/60">{feat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        {!recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-900 via-violet-900/50 to-slate-900 text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dados Clínicos</CardTitle>
                    <p className="text-sm text-white/60">Preencha para gerar recomendações personalizadas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-8">
                {/* Diagnosis */}
                <div className="space-y-3">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Nome do Problema / Diagnóstico
                  </Label>
                  <Input
                    placeholder="Ex: Tendinopatia do supraespinhal, Lombalgia mecânica..."
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="h-14 text-base bg-white/[0.02] border-white/10 focus:border-violet-500/50 rounded-xl"
                  />
                </div>

                {/* Tissue */}
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Tecido Predominante
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {["Músculo", "Tendão", "Ligamento", "Cápsula Articular", "Múltiplo / Misto"].map((t) => (
                      <SelectionButton key={t} selected={formData.tissue === t} onClick={() => setFormData({ ...formData, tissue: t })}>
                        {t}
                      </SelectionButton>
                    ))}
                  </div>
                </div>

                {/* Pathophysiology */}
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Estado Fisiopatológico
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { value: "Inflamatório Agudo", desc: "Lesão recente com sinais flogísticos" },
                      { value: "Sobrecarga / Irritado", desc: "Uso excessivo sem inflamação clássica" },
                      { value: "Desgaste / Crônico", desc: "Alterações estruturais ao longo do tempo" },
                      { value: "Pós-operatório", desc: "Após procedimento cirúrgico" },
                    ].map((p) => (
                      <SelectionButton key={p.value} selected={formData.pathophysiology === p.value} onClick={() => setFormData({ ...formData, pathophysiology: p.value })} description={p.desc}>
                        {p.value}
                      </SelectionButton>
                    ))}
                  </div>
                </div>

                {/* Phase */}
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">4</span>
                    Fase da Lesão
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "Aguda", desc: "0-7 dias" },
                      { value: "Subaguda", desc: "7-21 dias" },
                      { value: "Crônica", desc: ">21 dias" },
                    ].map((p) => (
                      <SelectionButton key={p.value} selected={formData.phase === p.value} onClick={() => setFormData({ ...formData, phase: p.value })} description={p.desc}>
                        {p.value}
                      </SelectionButton>
                    ))}
                  </div>
                </div>

                {/* Objective */}
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                    Objetivo Terapêutico Principal
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {["Analgesia", "Redução de Edema", "Bioestimulação", "Ganho de Mobilidade", "Relaxamento Muscular"].map((o) => (
                      <SelectionButton key={o} selected={formData.objective === o} onClick={() => setFormData({ ...formData, objective: o })}>
                        {o}
                      </SelectionButton>
                    ))}
                  </div>
                </div>

                {/* Irritability */}
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-500 text-white text-xs flex items-center justify-center font-bold">6</span>
                    Irritabilidade Tecidual
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "Alta", desc: "Dor fácil, limita AVDs" },
                      { value: "Média", desc: "Dor moderada" },
                      { value: "Baixa", desc: "Dor somente no final da amplitude" },
                    ].map((i) => (
                      <SelectionButton key={i.value} selected={formData.irritability === i.value} onClick={() => setFormData({ ...formData, irritability: i.value })} description={i.desc}>
                        {i.value}
                      </SelectionButton>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-white/10">
                  {!isFormComplete && (
                    <div className="flex items-center gap-2 text-amber-500 text-sm mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Preencha todos os campos para continuar</span>
                    </div>
                  )}
                  <Button
                    onClick={handleGenerateRecommendation}
                    disabled={!isFormComplete}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-violet-500/25 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Recomendação
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {recommendations && (
          <div className="space-y-6">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Análise Concluída</span>
                      </div>
                      <h2 className="text-2xl font-black">Recomendação para: {formData.diagnosis}</h2>
                    </div>
                    <Button onClick={handleReset} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg">
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

            {/* Recommendations */}
            <div className="space-y-6">
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={rec.name} rec={rec} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default function NeuroFlux() {
  return (
    <PremiumGate moduleName="NeuroFlux">
      <NeuroFluxContent />
    </PremiumGate>
  );
}
