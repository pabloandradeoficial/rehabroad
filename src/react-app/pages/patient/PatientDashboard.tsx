import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "@/react-app/lib/api";
import { Button } from "@/react-app/components/ui/button";
import { Slider } from "@/react-app/components/ui/slider";
import { Textarea } from "@/react-app/components/ui/textarea";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "ok" | "hard";

interface HepPlan {
  id: number;
  title: string;
  description: string | null;
  status: string;
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
}

interface HepCheckin {
  id: number;
  plan_id: number;
  exercise_id: number;
  completed: number;
  checked_at: string;
}

interface PlanData {
  plan: HepPlan | null;
  exercises: HepExercise[];
  checkins: HepCheckin[];
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

// ─── DifficultyButton ─────────────────────────────────────────────────────────

function DifficultyButton({
  value: _value,
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

  // step-by-step checkin state
  const [currentStep, setCurrentStep] = useState(0);
  const [checkinsByExercise, setCheckinsByExercise] = useState<
    Map<number, CheckinState>
  >(new Map());
  const [currentCheckin, setCurrentCheckin] =
    useState<CheckinState>(EMPTY_CHECKIN);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiFetch("/api/patient-portal/plan")
      .then((r) => r.json())
      .then((data: unknown) => setPlanData(data as PlanData))
      .catch(() => setError("Não foi possível carregar seu plano."))
      .finally(() => setLoading(false));
  }, []);

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
        <p className="font-semibold text-foreground mb-1">
          Nenhum plano ativo
        </p>
        <p className="text-sm text-muted-foreground">
          Seu fisioterapeuta ainda não criou um plano de exercícios para você.
        </p>
      </div>
    );
  }

  const { plan, exercises } = planData;
  const totalSteps = exercises.length;

  // check if today's session is already done
  const today = new Date().toISOString().slice(0, 10);
  const todayCheckins = planData.checkins.filter(
    (c) => c.checked_at.slice(0, 10) === today
  );
  const alreadyDoneToday = todayCheckins.length >= totalSteps && totalSteps > 0;

  if (done || alreadyDoneToday) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Exercícios concluídos!
        </h2>
        <p className="text-sm text-muted-foreground">
          Ótimo trabalho! Continue assim para se recuperar mais rápido.
        </p>
      </div>
    );
  }

  const exercise = exercises[currentStep];
  if (!exercise) return null;

  const handleNext = async () => {
    if (currentCheckin.completed === null) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await apiFetch("/api/patient-portal/checkin", {
        method: "POST",
        body: JSON.stringify({
          plan_id: plan.id,
          exercise_id: exercise.id,
          completed: currentCheckin.completed,
          pain_level: currentCheckin.painLevel || null,
          difficulty: currentCheckin.difficulty,
          notes: currentCheckin.notes || null,
        }),
      });

      if (!res.ok) throw new Error("Falha ao registrar check-in.");

      setCheckinsByExercise((prev) =>
        new Map(prev).set(exercise.id, currentCheckin)
      );

      if (currentStep + 1 >= totalSteps) {
        setDone(true);
      } else {
        setCurrentStep((s) => s + 1);
        setCurrentCheckin(EMPTY_CHECKIN);
      }
    } catch {
      setSubmitError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Plan header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">{plan.title}</h1>
        {plan.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {plan.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Exercise card */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-4">
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
          <span className="text-xs text-muted-foreground bg-white/5 rounded-lg px-2 py-1 shrink-0">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {exercise.sets && (
            <div className="text-center bg-white/5 rounded-xl px-4 py-2">
              <p className="text-xs text-muted-foreground">Séries</p>
              <p className="text-base font-bold text-foreground">
                {exercise.sets}
              </p>
            </div>
          )}
          {exercise.reps && (
            <div className="text-center bg-white/5 rounded-xl px-4 py-2">
              <p className="text-xs text-muted-foreground">Repetições</p>
              <p className="text-base font-bold text-foreground">
                {exercise.reps}
              </p>
            </div>
          )}
          {exercise.frequency && (
            <div className="text-center bg-white/5 rounded-xl px-4 py-2">
              <p className="text-xs text-muted-foreground">Frequência</p>
              <p className="text-base font-bold text-foreground">
                {exercise.frequency}
              </p>
            </div>
          )}
        </div>

        {exercise.instructions && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {exercise.instructions}
          </p>
        )}
      </div>

      {/* Check-in form */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        {/* Completed? */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Você realizou este exercício?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentCheckin((s) => ({ ...s, completed: true }))
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all select-none active:scale-[0.97] ${
                currentCheckin.completed === true
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "bg-card text-muted-foreground border-border hover:border-emerald-500/30"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Sim
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentCheckin((s) => ({ ...s, completed: false }))
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all select-none active:scale-[0.97] ${
                currentCheckin.completed === false
                  ? "bg-red-500/20 text-red-400 border-red-500/50"
                  : "bg-card text-muted-foreground border-border hover:border-red-500/30"
              }`}
            >
              <XCircle className="w-4 h-4" />
              Não
            </button>
          </div>
        </div>

        {currentCheckin.completed === true && (
          <>
            {/* Pain level */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Nível de dor
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                0 = sem dor · 10 = dor intensa
              </p>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[currentCheckin.painLevel]}
                onValueChange={([v]) =>
                  setCurrentCheckin((s) => ({ ...s, painLevel: v }))
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span className="font-semibold text-foreground">
                  {currentCheckin.painLevel}
                </span>
                <span>10</span>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Dificuldade
              </p>
              <div className="flex gap-2">
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
                    selected={currentCheckin.difficulty === d.value}
                    onClick={() =>
                      setCurrentCheckin((s) => ({
                        ...s,
                        difficulty: d.value,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Observações{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </p>
              <Textarea
                placeholder="Como você se sentiu? Alguma dificuldade?"
                value={currentCheckin.notes}
                onChange={(e) =>
                  setCurrentCheckin((s) => ({
                    ...s,
                    notes: e.target.value,
                  }))
                }
                rows={3}
                className="resize-none"
              />
            </div>
          </>
        )}

        {submitError && (
          <p className="text-sm text-red-400 text-center">{submitError}</p>
        )}

        <Button
          onClick={() => void handleNext()}
          disabled={currentCheckin.completed === null || submitting}
          className="w-full h-12 text-base font-semibold gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {currentStep + 1 >= totalSteps ? "Concluir" : "Próximo"}
              {currentStep + 1 < totalSteps && (
                <ChevronRight className="w-4 h-4" />
              )}
            </>
          )}
        </Button>
      </div>

      {/* Previous exercises in this session */}
      {checkinsByExercise.size > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Feito nesta sessão
          </p>
          <div className="space-y-2">
            {exercises.slice(0, currentStep).map((ex) => {
              const c = checkinsByExercise.get(ex.id);
              return (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3"
                >
                  {c?.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span className="text-sm text-foreground">
                    {ex.exercise_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
