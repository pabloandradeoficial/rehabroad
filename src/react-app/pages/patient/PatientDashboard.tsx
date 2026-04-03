import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { apiFetch } from "@/react-app/lib/api";
import { WeeklyProgress } from "./WeeklyProgress";
import { ExerciseCard, type ExerciseCardExercise } from "./ExerciseCard";
import { FeedbackModal, type FeedbackData } from "./FeedbackModal";
import { CommentBox } from "./CommentBox";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HepPlan {
  id: number;
  title: string;
  description: string | null;
  status: string;
  diagnostico_explicado: string | null;
  orientacoes: string | null;
  metas: string | null;
}

interface HepExercise extends ExerciseCardExercise {
  plan_id: number;
  order_index: number;
  feitoHoje: boolean;
}

interface PlanData {
  plan: HepPlan | null;
  exercises: HepExercise[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Which exercise's feedback modal is open (null = closed)
  const [modalExerciseId, setModalExerciseId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Optimistic done-today set — avoids full refetch after checkin
  const [localDoneToday, setLocalDoneToday] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    apiFetch("/api/patient-portal/plan")
      .then((r) => r.json())
      .then((data: unknown) => setPlanData(data as PlanData))
      .catch(() => setError("Não foi possível carregar seu plano."))
      .finally(() => setLoading(false));
  }, []);

  // ── Checkin handler ─────────────────────────────────────────────────────────

  const handleCheckin = async (exerciseId: number, feedback: FeedbackData) => {
    if (!planData?.plan) return;

    setSubmittingId(exerciseId);
    setSubmitError(null);

    try {
      const res = await apiFetch("/api/patient-portal/checkin", {
        method: "POST",
        body: JSON.stringify({
          plan_id: planData.plan.id,
          exercise_id: exerciseId,
          completed: true,
          pain_level: feedback.painLevel,
          difficulty: feedback.borgLevel,
          notes: feedback.notes || null,
        }),
      });
      if (!res.ok) throw new Error();

      setLocalDoneToday((prev) => new Set(prev).add(exerciseId));
      setModalExerciseId(null);
    } catch {
      setSubmitError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmittingId(null);
    }
  };

  // ── Early returns ────────────────────────────────────────────────────────────

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
  const doneToday = exercises.filter(
    (ex) => ex.feitoHoje || localDoneToday.has(ex.id)
  ).length;
  const allDoneToday = totalSteps > 0 && doneToday >= totalSteps;

  const activeModalExercise =
    modalExerciseId !== null
      ? exercises.find((ex) => ex.id === modalExerciseId) ?? null
      : null;

  return (
    <div className="space-y-4 pb-8">

      {/* ── Minha Evolução ──────────────────────────────────────────────── */}
      {exercises.length > 0 && (
        <WeeklyProgress exercises={exercises} />
      )}

      {/* ── Plan header ─────────────────────────────────────────────────── */}
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

      {/* ── All-done celebration banner ──────────────────────────────────── */}
      {allDoneToday && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-400">
              Todos os exercícios concluídos!
            </p>
            <p className="text-xs text-emerald-500/80">
              Ótimo trabalho! Continue assim para se recuperar mais rápido.
            </p>
          </div>
        </div>
      )}

      {/* ── Exercise cards ───────────────────────────────────────────────── */}
      {exercises.map((exercise) => {
        const isDoneToday = exercise.feitoHoje || localDoneToday.has(exercise.id);
        return (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isDoneToday={isDoneToday}
            onMarkDone={() => {
              setSubmitError(null);
              setModalExerciseId(exercise.id);
            }}
            planId={plan.id}
          />
        );
      })}

      {/* ── API error below cards ────────────────────────────────────────── */}
      {submitError && (
        <p className="text-sm text-red-400 text-center">{submitError}</p>
      )}

      {/* ── Info sections ────────────────────────────────────────────────── */}
      {plan.diagnostico_explicado && (
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">
            🩺 Meu Diagnóstico
          </h3>
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
          <h3 className="text-sm font-semibold text-violet-400 mb-2">
            🎯 Minhas Metas
          </h3>
          <p className="text-sm text-violet-300 whitespace-pre-wrap leading-relaxed">
            {plan.metas}
          </p>
          <CommentBox planId={plan.id} section="metas" />
        </div>
      )}

      {/* ── Feedback Modal (rendered once, controlled by modalExerciseId) ── */}
      <FeedbackModal
        open={modalExerciseId !== null}
        onClose={() => setModalExerciseId(null)}
        onSubmit={(feedback) =>
          activeModalExercise
            ? handleCheckin(activeModalExercise.id, feedback)
            : Promise.resolve()
        }
        isSubmitting={submittingId !== null}
        exerciseName={activeModalExercise?.exercise_name ?? ""}
      />
    </div>
  );
}
