import { CheckCircle2, PlayCircle } from "lucide-react";
import { CommentBox } from "./CommentBox";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckinDay {
  dia: string;
  completed: boolean;
}

export interface ExerciseCardExercise {
  id: number;
  exercise_name: string;
  exercise_category: string | null;
  sets: number | null;
  reps: string | null;
  frequency: string | null;
  instructions: string | null;
  checkins7dias: CheckinDay[];
}

interface Props {
  exercise: ExerciseCardExercise;
  isDoneToday: boolean;
  onMarkDone: () => void;
  planId: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWeekDots(checkins7dias: CheckinDay[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dia = d.toISOString().slice(0, 10);
    return { dia, feito: checkins7dias.some((c) => c.dia === dia && c.completed) };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExerciseCard({ exercise, isDoneToday, onMarkDone, planId }: Props) {
  const weekDots = buildWeekDots(exercise.checkins7dias);
  const doneCount = weekDots.filter((d) => d.feito).length;

  return (
    <div
      className={`rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
        isDoneToday
          ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          : "border-border"
      }`}
    >
      {/* ── Video placeholder ──────────────────────────────────────────── */}
      <div className="relative w-full bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 overflow-hidden"
           style={{ paddingBottom: "40%" }}>
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #34d399 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Category gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-emerald-400/50">
          <PlayCircle className="w-10 h-10" strokeWidth={1.5} />
          <span className="text-[11px] font-medium tracking-wide">
            Vídeo do exercício
          </span>
        </div>

        {/* Done-today overlay badge */}
        {isDoneToday && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3 h-3" />
            Feito hoje
          </div>
        )}

        {/* Category badge */}
        {exercise.exercise_category && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/15 border border-primary/20 px-2 py-0.5 rounded-full">
              {exercise.exercise_category}
            </span>
          </div>
        )}
      </div>

      {/* ── Exercise info ──────────────────────────────────────────────── */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-foreground mb-4 leading-tight">
          {exercise.exercise_name}
        </h2>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.sets != null && (
            <StatPill label="Séries" value={String(exercise.sets)} />
          )}
          {exercise.reps && (
            <StatPill label="Repetições" value={exercise.reps} />
          )}
          {exercise.frequency && (
            <StatPill label="Frequência" value={exercise.frequency} />
          )}
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {exercise.instructions}
          </p>
        )}

        {/* 7-day adherence dots */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground shrink-0">7 dias</span>
          <div className="flex items-center gap-1">
            {weekDots.map((d, i) => (
              <div
                key={i}
                title={d.dia}
                className={`w-3.5 h-3.5 rounded-full transition-colors ${
                  d.feito ? "bg-primary shadow-[0_0_6px_rgba(20,184,166,0.5)]" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{doneCount}/7</span>
        </div>

        <CommentBox planId={planId} section="exercicio" exerciseId={exercise.id} />
      </div>

      {/* ── Action footer ──────────────────────────────────────────────── */}
      <div className="border-t border-border px-5 pb-5 pt-4">
        {isDoneToday ? (
          <div className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Concluído hoje — ótimo trabalho!
          </div>
        ) : (
          <button
            type="button"
            onClick={onMarkDone}
            className="w-full h-14 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] transition-all select-none shadow-lg shadow-emerald-900/30"
          >
            Marcar como Concluído
          </button>
        )}
      </div>
    </div>
  );
}

// ─── StatPill ─────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-white/5 border border-white/8 rounded-xl px-4 py-2 min-w-[4rem]">
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
