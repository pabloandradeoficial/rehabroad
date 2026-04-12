import { useHepOverview } from "@/react-app/hooks/useHep";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { useNavigate } from "react-router";
import { Home, TrendingUp, Clock, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";

const STATUS_CONFIG = {
  green: {
    label: "Em dia",
    icon: CheckCircle,
    bg: "bg-card shadow-sm border-border border-l-4 border-l-emerald-500",
    text: "text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  yellow: {
    label: "Atenção",
    icon: AlertTriangle,
    bg: "bg-card shadow-sm border-border border-l-4 border-l-amber-500",
    text: "text-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  red: {
    label: "Baixa adesão",
    icon: AlertTriangle,
    bg: "bg-card shadow-sm border-border border-l-4 border-l-red-500",
    text: "text-red-500",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
};

function formatLastCheckin(dateStr: string | null): string {
  if (!dateStr) return "Nenhum";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function HepOverview() {
  const { overview, loading, error, refetch } = useHepOverview();
  const navigate = useNavigate();

  const greenCount = overview.filter((e) => e.status === "green").length;
  const yellowCount = overview.filter((e) => e.status === "yellow").length;
  const redCount = overview.filter((e) => e.status === "red").length;

  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/20 flex items-center justify-center">
            <Home className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Plano Domiciliar</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Adesão dos pacientes aos exercícios em casa
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => void refetch()} title="Atualizar">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary cards */}
      {overview.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-card border border-border border-l-4 border-l-emerald-500 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-emerald-500">{greenCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Em dia</p>
          </div>
          <div className="rounded-xl bg-card border border-border border-l-4 border-l-amber-500 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{yellowCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Atenção</p>
          </div>
          <div className="rounded-xl bg-card border border-border border-l-4 border-l-red-500 shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{redCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Baixa adesão</p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => void refetch()} className="mt-3">
            Tentar novamente
          </Button>
        </div>
      ) : overview.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6 text-teal-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            Nenhum plano domiciliar ativo
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Abra o prontuário de um paciente para criar e enviar um plano de exercícios em casa.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {overview
            .sort((a, b) => {
              const order = { red: 0, yellow: 1, green: 2 };
              return order[a.status] - order[b.status];
            })
            .map((entry) => {
              const cfg = STATUS_CONFIG[entry.status];
              const StatusIcon = cfg.icon;
              return (
                <button
                  key={entry.planId}
                  onClick={() => void navigate(`/dashboard/paciente/${entry.patientId}`)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]",
                    cfg.bg
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {entry.planTitle}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Paciente #{entry.patientId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cfg.badge)}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className={cn("font-semibold", cfg.text)}>
                        {entry.adherenceRate}%
                      </span>
                      <span>adesão</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatLastCheckin(entry.lastCheckin)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{entry.totalCheckins} check-ins</span>
                    </div>
                  </div>

                  {/* Adherence bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", {
                        "bg-emerald-400": entry.status === "green",
                        "bg-amber-400": entry.status === "yellow",
                        "bg-red-400": entry.status === "red",
                      })}
                      style={{ width: `${entry.adherenceRate}%` }}
                    />
                  </div>
                </button>
              );
            })}
        </div>
      )}
    </div>
    </>
  );
}
