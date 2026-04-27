import { useState } from "react";
import { ChevronDown, History, Zap } from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { cn } from "@/react-app/lib/utils";
import { getRecommendations } from "@/data/neurofluxData";

type HistoryRecord = {
  id: number;
  patient_id: string | null;
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  created_at: string;
};

interface HistorySectionProps {
  records: HistoryRecord[];
  loading: boolean;
  patientName?: string;
}

export function HistorySection({ records, loading, patientName }: HistorySectionProps) {
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (records.length === 0) return null;

  const getTopModality = (r: HistoryRecord): string | null => {
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
