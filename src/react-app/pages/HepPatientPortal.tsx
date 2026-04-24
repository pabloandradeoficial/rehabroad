/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertCircle,
  Loader2,
  Heart,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Slider } from "@/react-app/components/ui/slider";
import { Textarea } from "@/react-app/components/ui/textarea";
import { useHepPatient } from "@/react-app/hooks/useHep";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Difficulty = "easy" | "ok" | "hard";

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

// ─────────────────────────────────────────────
// DifficultyButton
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function HepPatientPortal() {
  const { token } = useParams<{ token: string }>();
  const { plan, exercises, loading, error, expired, submitCheckin } = useHepPatient(token);

  const [currentStep, setCurrentStep] = useState(0);
  const [_checkins, setCheckins] = useState<CheckinState[]>([]);
  const [currentCheckin, setCurrentCheckin] = useState<CheckinState>(EMPTY_CHECKIN);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando seu plano...</p>
        </div>
      </div>
    );
  }

  // ─── Expired ───
  if (expired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Link Expirado</h1>
          <p className="text-sm text-muted-foreground">
            Este link expirou. Peça ao seu fisioterapeuta um novo link de acesso.
          </p>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Link Inválido</h1>
          <p className="text-sm text-muted-foreground">
            {error ?? "Não foi possível carregar seu plano. Verifique o link com seu fisioterapeuta."}
          </p>
        </div>
      </div>
    );
  }

  // ─── Done ───
  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center space-y-5"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ótimo trabalho!</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Seus registros foram salvos. Seu fisioterapeuta vai acompanhar sua evolução.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => {
                setCurrentStep(0);
                setCheckins([]);
                setCurrentCheckin(EMPTY_CHECKIN);
                setDone(false);
              }}
            >
              Registrar novamente
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentExercise = exercises[currentStep];
  const totalSteps = exercises.length;
  const isLastStep = currentStep === totalSteps - 1;

  // ─── Save current step and advance ───
  const handleNext = async () => {
    if (currentCheckin.completed === null) return;
    setSubmitError(null);
    setSubmitting(true);

    try {
      await submitCheckin({
        exercise_id: currentExercise.id,
        completed: currentCheckin.completed,
        pain_level: currentCheckin.completed ? currentCheckin.painLevel : undefined,
        difficulty: currentCheckin.difficulty ?? undefined,
        notes: currentCheckin.notes || undefined,
      });

      setCheckins((prev) => [...prev, currentCheckin]);

      if (isLastStep) {
        setDone(true);
      } else {
        setCurrentStep((s) => s + 1);
        setCurrentCheckin(EMPTY_CHECKIN);
      }
    } catch {
      setSubmitError("Não foi possível salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4" style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))", paddingBottom: "1rem" }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">RehabRoad</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">{plan.title}</h1>
          <p className="text-xs text-muted-foreground">Prescrição do seu fisioterapeuta</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">
              Exercício {currentStep + 1} de {totalSteps}
            </span>
          </div>
          <div className="flex gap-1.5">
            {exercises.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < currentStep
                    ? "bg-emerald-500"
                    : i === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exercise card */}
      <div className="max-w-lg mx-auto px-4 py-6" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Exercise info */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-foreground">{currentExercise.exercise_name}</h2>
                {currentExercise.exercise_category && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                    {currentExercise.exercise_category}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {currentExercise.sets && (
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-foreground font-medium">
                    {currentExercise.sets} séries
                  </span>
                )}
                {currentExercise.reps && (
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-foreground font-medium">
                    {currentExercise.reps}
                  </span>
                )}
                {currentExercise.frequency && (
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-foreground font-medium">
                    {currentExercise.frequency}
                  </span>
                )}
              </div>

              {currentExercise.instructions && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Como fazer:
                  </p>
                  <p className="text-base text-foreground whitespace-pre-line leading-relaxed">
                    {currentExercise.instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Did you do it? */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Você fez hoje?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentCheckin((c) => ({ ...c, completed: true }))
                  }
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 text-sm font-semibold transition-all select-none active:scale-[0.97] active:opacity-80 ${
                    currentCheckin.completed === true
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Sim, fiz!
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentCheckin((c) => ({ ...c, completed: false }))
                  }
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 text-sm font-semibold transition-all select-none active:scale-[0.97] active:opacity-80 ${
                    currentCheckin.completed === false
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "border-border bg-card text-muted-foreground hover:border-red-300"
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Não consegui
                </button>
              </div>
            </div>

            {/* Pain + difficulty — only if completed */}
            {currentCheckin.completed === true && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Pain level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Nível de dor</p>
                    <span className="text-lg font-bold text-primary">{currentCheckin.painLevel}</span>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[currentCheckin.painLevel]}
                    onValueChange={([v]) =>
                      setCurrentCheckin((c) => ({ ...c, painLevel: v }))
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sem dor</span>
                    <span>Dor intensa</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Dificuldade</p>
                  <div className="flex gap-2">
                    <DifficultyButton
                      value="easy"
                      label="Fácil"
                      selected={currentCheckin.difficulty === "easy"}
                      onClick={() => setCurrentCheckin((c) => ({ ...c, difficulty: "easy" }))}
                    />
                    <DifficultyButton
                      value="ok"
                      label="Ok"
                      selected={currentCheckin.difficulty === "ok"}
                      onClick={() => setCurrentCheckin((c) => ({ ...c, difficulty: "ok" }))}
                    />
                    <DifficultyButton
                      value="hard"
                      label="Difícil"
                      selected={currentCheckin.difficulty === "hard"}
                      onClick={() => setCurrentCheckin((c) => ({ ...c, difficulty: "hard" }))}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Observações (opcional)</p>
                  <Textarea
                    placeholder="Ex: Senti um leve desconforto no início..."
                    rows={2}
                    value={currentCheckin.notes}
                    onChange={(e) =>
                      setCurrentCheckin((c) => ({ ...c, notes: e.target.value }))
                    }
                    className="text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Error */}
            {submitError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* Next button */}
            <Button
              className="w-full gap-2 h-12 text-base"
              onClick={() => void handleNext()}
              disabled={currentCheckin.completed === null || submitting}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              {submitting
                ? "Salvando..."
                : isLastStep
                ? "Concluir"
                : "Salvar e continuar"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
