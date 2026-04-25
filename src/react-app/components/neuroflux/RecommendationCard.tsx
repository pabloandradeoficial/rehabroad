import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Lightbulb,
  Settings2,
  Shield,
  Snowflake,
  Sun,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { cn } from "@/react-app/lib/utils";
import type { Recommendation } from "@/react-app/data/neurofluxData";

export function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
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
