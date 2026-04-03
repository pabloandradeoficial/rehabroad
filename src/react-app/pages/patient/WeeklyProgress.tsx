import { Flame, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckinDay = { dia: string; completed: boolean };

interface Props {
  exercises: Array<{ checkins7dias: CheckinDay[] }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCompletedDaysSet(exercises: Props["exercises"]): Set<string> {
  const set = new Set<string>();
  for (const ex of exercises) {
    for (const c of ex.checkins7dias) {
      if (c.completed) set.add(c.dia);
    }
  }
  return set;
}

function computeStreak(completedDays: Set<string>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dia = d.toISOString().slice(0, 10);
    if (completedDays.has(dia)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WeeklyProgress({ exercises }: Props) {
  const completedDays = buildCompletedDaysSet(exercises);
  const streak = computeStreak(completedDays);
  const weeklyProgress = Math.round((completedDays.size / 7) * 100);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dia = d.toISOString().slice(0, 10);
    const dayName = d
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "");
    return { dia, dayName, done: completedDays.has(dia) };
  });

  const barColor =
    weeklyProgress >= 67
      ? "from-emerald-500 to-teal-500"
      : weeklyProgress >= 34
        ? "from-yellow-500 to-amber-500"
        : weeklyProgress > 0
          ? "from-red-500 to-orange-500"
          : "from-white/10 to-white/10";

  return (
    <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 overflow-hidden p-5">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #34d399 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">
              Minha Evolução
            </span>
          </div>

          {/* Streak badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              streak > 0
                ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                : "bg-white/5 text-muted-foreground border-white/10"
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`}
            />
            {streak > 0
              ? `${streak} dia${streak > 1 ? "s" : ""} seguido${streak > 1 ? "s" : ""}!`
              : "Comece hoje!"}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Progresso semanal</span>
            <span className="font-bold text-foreground">{weeklyProgress}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>

        {/* 7-day check circles */}
        <div className="flex justify-between">
          {last7Days.map((day) => (
            <div key={day.dia} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  day.done
                    ? "bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)]"
                    : "bg-white/5 border border-white/10 text-transparent"
                }`}
              >
                ✓
              </div>
              <span className="text-[10px] text-muted-foreground capitalize leading-none">
                {day.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
