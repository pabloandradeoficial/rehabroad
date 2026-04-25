import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { apiFetch } from "@/react-app/lib/api";
import { Button } from "@/react-app/components/ui/button";
import { Slider } from "@/react-app/components/ui/slider";
import { Textarea } from "@/react-app/components/ui/textarea";
import { CommentBox } from "./CommentBox";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "ok" | "hard";

interface HepPlan {
  id: number;
  title: string;
  description: string | null;
  status: string;
  diagnostico_explicado: string | null;
  orientacoes: string | null;
  metas: string | null;
}

interface CheckinDay {
  dia: string;      // YYYY-MM-DD (UTC)
  completed: boolean;
}

interface HepExercise {
  id: number;
  plan_id: number;
  exercise_name: string;
  exercise_category: string | null;
  sets: number | null;
  reps: string | null;
  frequency: string | null;
  instructions: string | null;
  order_index: number;
  feitoHoje: boolean;
  checkins7dias: CheckinDay[];
}

interface PlanData {
  plan: HepPlan | null;
  exercises: HepExercise[];
}

interface CheckinState {
  completed: boolean | null;
  painLevel: number;
  difficulty: Difficulty | null;
  notes: string;
}

const EMPTY_CHECKIN: CheckinState = {
  completed: null,
  painLevel: 0,
  difficulty: null,
  notes: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build an array of the last 7 days (oldest→newest) with feito flag. */
function buildWeekDots(checkins7dias: CheckinDay[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dia = d.toISOString().slice(0, 10);
    return { dia, feito: checkins7dias.some((c) => c.dia === dia && c.completed) };
  });
}

// ─── DifficultyButton ─────────────────────────────────────────────────────────

function DifficultyButton({
  label,
  selected,
  onClick,
}: {
  value: Difficulty;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all select-none active:scale-[0.97] ${
        selected
          ? "bg-primary text-white border-primary shadow-md"
          : "bg-card text-muted-foreground border-border hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-exercise checkin form state
  const [checkinForms, setCheckinForms] = useState<Map<number, CheckinState>>(() => new Map());
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [submitErrors, setSubmitErrors] = useState<Map<number, string>>(() => new Map());
  // Exercises marked done in this session (optimistic — avoids refetch)
  const [localDoneToday, setLocalDoneToday] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    apiFetch("/api/patient-portal/plan")
      .then((r) => r.json())
      .then((data: unknown) => setPlanData(data as PlanData))
      .catch(() => setError("Não foi possível carregar seu plano."))
      .finally(() => setLoading(false));
  }, []);

  // ── form helpers ────────────────────────────────────────────────────────────

  const getForm = (id: number): CheckinState => checkinForms.get(id) ?? EMPTY_CHECKIN;

  const patchForm = (id: number, patch: Partial<CheckinState>) =>
    setCheckinForms((prev) => new Map(prev).set(id, { ...getForm(id), ...patch }));

  const handleCheckin = async (exercise: HepExercise) => {
    if (!planData?.plan) return;
    const form = getForm(exercise.id);
    
    if (form.completed === null) {
      toast.error("Por favor, informe se você realizou o exercício hoje.");
      return;
    }

    const wasDoneBefore = localDoneToday.has(exercise.id);

    // Optimistic UI update
    setSubmittingId(exercise.id);
    setSubmitErrors((prev) => {
      const m = new Map(prev);
      m.delete(exercise.id);
      return m;
    });

    setLocalDoneToday((prev) => {
      const nextSet = new Set(prev);
      if (form.completed) {
        nextSet.add(exercise.id);
      } else {
        nextSet.delete(exercise.id);
      }
      return nextSet;
    });

    try {
      const res = await apiFetch("/api/patient-portal/checkin", {
        method: "POST",
        body: JSON.stringify({
          plan_id: planData.plan.id,
          exercise_id: exercise.id,
          completed: form.completed,
          pain_level: form.painLevel || null,
          difficulty: form.difficulty,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Progresso salvo com sucesso!");
    } catch {
      // Rollback on failure
      setLocalDoneToday((prev) => {
        const revertedSet = new Set(prev);
        if (wasDoneBefore) {
          revertedSet.add(exercise.id);
        } else {
          revertedSet.delete(exercise.id);
        }
        return revertedSet;
      });
      toast.error("Erro na comunicação. Desfazendo alteração local.");
      setSubmitErrors((prev) => new Map(prev).set(exercise.id, "Não foi possível salvar. Tente novamente."));
    } finally {
      setSubmittingId(null);
    }
  };

  // ── early returns ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (!planData?.plan) {
    return (
      <div className="text-center py-16">
        <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="font-semibold text-foreground mb-1">Nenhum plano ativo</p>
        <p className="text-sm text-muted-foreground">
          Seu fisioterapeuta ainda não criou um plano de exercícios para você.
        </p>
      </div>
    );
  }

  const { plan, exercises } = planData;
  const totalSteps = exercises.length;

  // Count exercises done today (backend flag + optimistic local set)
  const doneToday = exercises.filter(
    (ex) => ex.feitoHoje || localDoneToday.has(ex.id)
  ).length;
  const allDoneToday = totalSteps > 0 && doneToday >= totalSteps;

  return (
    <div className="space-y-4 pb-8">

      {/* ── Plan header ── */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{plan.title}</h1>
        {plan.description && (
          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        )}

        {totalSteps > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(doneToday / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {doneToday}/{totalSteps} hoje
            </span>
          </div>
        )}
      </div>

      {/* ── All-done banner (shown when every exercise is checked today) ── */}
      {allDoneToday && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-400">Exercícios concluídos!</p>
            <p className="text-xs text-emerald-500/80">
              Ótimo trabalho! Continue assim para se recuperar mais rápido.
            </p>
          </div>
        </div>
      )}

      {/* ── Exercise cards (always visible) ── */}
      {exercises.map((exercise) => {
        const isDoneToday = exercise.feitoHoje || localDoneToday.has(exercise.id);
        const form = getForm(exercise.id);
        const isSubmitting = submittingId === exercise.id;
        const submitError = submitErrors.get(exercise.id);
        const weekDots = buildWeekDots(exercise.checkins7dias);
        const doneCount = weekDots.filter((d) => d.feito).length;

        return (
          <div key={exercise.id} className="rounded-2xl border border-border bg-card overflow-hidden">

            {/* Done-today badge */}
            {isDoneToday && (
              <div className="flex items-center gap-1.5 px-5 pt-4 pb-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">Feito hoje</span>
              </div>
            )}

            {/* Exercise info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  {exercise.exercise_category && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {exercise.exercise_category}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-foreground mt-1">
                    {exercise.exercise_name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {exercise.sets && (
                  <div className="text-center bg-white/5 rounded-xl px-4 py-2">
                    <p className="text-xs text-muted-foreground">Séries</p>
                    <p className="text-base font-bold text-foreground">{exercise.sets}</p>
                  </div>
                )}
                {exercise.reps && (
                  <div className="text-center bg-white/5 rounded-xl px-4 py-2">
                    <p className="text-xs text-muted-foreground">Repetições</p>
                    <p className="text-base font-bold text-foreground">{exercise.reps}</p>
                  </div>
                )}
                {exercise.frequency && (
                  <div className="text-center bg-white/5 rounded-xl px-4 py-2">
                    <p className="text-xs text-muted-foreground">Frequência</p>
                    <p className="text-base font-bold text-foreground">{exercise.frequency}</p>
                  </div>
                )}
              </div>

              {exercise.instructions && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {exercise.instructions}
                </p>
              )}

              {/* 7-day adherence dots */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-muted-foreground shrink-0">7 dias:</span>
                <div className="flex items-center gap-1">
                  {weekDots.map((d, i) => (
                    <div
                      key={i}
                      title={d.dia}
                      className={`w-3.5 h-3.5 rounded-full transition-colors ${
                        d.feito ? "bg-primary" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">{doneCount}/7</span>
              </div>

              <CommentBox
                planId={plan.id}
                section="exercicio"
                exerciseId={exercise.id}
              />
            </div>

            {/* Check-in section */}
            <div className="border-t border-border p-5">
              {isDoneToday ? (
                // Disabled "done today" button — card stays readable
                <div className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Concluído hoje
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Completed yes/no */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Você realizou este exercício?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => patchForm(exercise.id, { completed: true })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all select-none active:scale-[0.97] ${
                          form.completed === true
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                            : "bg-card text-muted-foreground border-border hover:border-emerald-500/30"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => patchForm(exercise.id, { completed: false })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all select-none active:scale-[0.97] ${
                          form.completed === false
                            ? "bg-red-500/10 text-red-500 border-red-500/30"
                            : "bg-card text-muted-foreground border-border hover:border-red-500/20"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Não
                      </button>
                    </div>
                  </div>

                  {/* Extra fields when completed */}
                  {form.completed === true && (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Nível de dor</p>
                        <p className="text-xs text-muted-foreground mb-3">0 = sem dor · 10 = dor intensa</p>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[form.painLevel]}
                          onValueChange={([v]) => patchForm(exercise.id, { painLevel: v })}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span className="font-semibold text-foreground">{form.painLevel}</span>
                          <span>10</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3">Dificuldade</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          {(
                            [
                              { value: "easy", label: "Fácil" },
                              { value: "ok", label: "Normal" },
                              { value: "hard", label: "Difícil" },
                            ] as { value: Difficulty; label: string }[]
                          ).map((d) => (
                            <DifficultyButton
                              key={d.value}
                              value={d.value}
                              label={d.label}
                              selected={form.difficulty === d.value}
                              onClick={() => patchForm(exercise.id, { difficulty: d.value })}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Observações{" "}
                          <span className="font-normal text-muted-foreground">(opcional)</span>
                        </p>
                        <Textarea
                          placeholder="Como você se sentiu? Alguma dificuldade?"
                          value={form.notes}
                          onChange={(e) => patchForm(exercise.id, { notes: e.target.value })}
                          rows={3}
                          maxLength={1500}
                          className="resize-none"
                        />
                      </div>
                    </>
                  )}

                  {submitError && (
                    <p className="text-sm text-red-400 text-center">{submitError}</p>
                  )}

                  <Button
                    onClick={() => void handleCheckin(exercise)}
                    disabled={form.completed === null || isSubmitting}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Info sections — always visible when content exists ── */}

      {plan.diagnostico_explicado && (
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">🩺 Meu Diagnóstico</h3>
          <p className="text-sm text-blue-300 whitespace-pre-wrap leading-relaxed">
            {plan.diagnostico_explicado}
          </p>
          <CommentBox planId={plan.id} section="diagnostico" />
        </div>
      )}

      {plan.orientacoes && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">
            📋 Orientações do seu Fisioterapeuta
          </h3>
          <p className="text-sm text-emerald-300 whitespace-pre-wrap leading-relaxed">
            {plan.orientacoes}
          </p>
          <CommentBox planId={plan.id} section="orientacoes" />
        </div>
      )}

      {plan.metas && (
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
          <h3 className="text-sm font-semibold text-violet-400 mb-2">🎯 Minhas Metas</h3>
          <p className="text-sm text-violet-300 whitespace-pre-wrap leading-relaxed">
            {plan.metas}
          </p>
          <CommentBox planId={plan.id} section="metas" />
        </div>
      )}
    </div>
  );
}
