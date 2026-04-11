import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface OnboardingProgress {
  hasPatient: boolean;
  hasEvaluation: boolean;
  hasObjectives: boolean;
  hasEvolution: boolean;
  hasReport: boolean;
  completedCount: number;
  totalSteps: number;
  percentComplete: number;
  isComplete: boolean;
  loading: boolean;
}

export interface OnboardingStep {
  id: string;
  label: string;
  completed: boolean;
  action?: () => void;
}

const ONBOARDING_DISMISSED_KEY = "rehabroad_onboarding_dismissed";
const REPORT_PROMPT_SHOWN_KEY = "rehabroad_report_prompt_shown";

async function parseErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.reason === "string" && data.reason.trim()) {
      return data.reason;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function useOnboarding() {
  const [progress, setProgress] = useState<OnboardingProgress>({
    hasPatient: false,
    hasEvaluation: false,
    hasObjectives: false,
    hasEvolution: false,
    hasReport: false,
    completedCount: 0,
    totalSteps: 5,
    percentComplete: 0,
    isComplete: false,
    loading: true,
  });

  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true";
  });

  const [showReportPrompt, setShowReportPrompt] = useState(false);
  const [firstEvaluationPatientId, setFirstEvaluationPatientId] = useState<number | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await apiFetch("/api/onboarding/progress", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar progresso inicial")
        );
      }

      const data = await res.json();

      const completed = [
        data?.hasPatient,
        data?.hasEvaluation,
        data?.hasObjectives,
        data?.hasEvolution,
        data?.hasReport,
      ].filter(Boolean).length;

      setProgress({
        hasPatient: Boolean(data?.hasPatient),
        hasEvaluation: Boolean(data?.hasEvaluation),
        hasObjectives: Boolean(data?.hasObjectives),
        hasEvolution: Boolean(data?.hasEvolution),
        hasReport: Boolean(data?.hasReport),
        completedCount: completed,
        totalSteps: 5,
        percentComplete: Math.round((completed / 5) * 100),
        isComplete: completed === 5,
        loading: false,
      });

      const promptShown = localStorage.getItem(REPORT_PROMPT_SHOWN_KEY) === "true";

      if (
        data?.hasEvaluation &&
        !data?.hasReport &&
        !promptShown &&
        data?.firstEvaluationPatientId
      ) {
        setShowReportPrompt(true);
        setFirstEvaluationPatientId(data.firstEvaluationPatientId);
        localStorage.setItem(REPORT_PROMPT_SHOWN_KEY, "true");
      }
    } catch {
      setProgress((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    void fetchProgress();
  }, [fetchProgress]);

  const dismissOnboarding = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
  }, []);

  const dismissReportPrompt = useCallback(() => {
    setShowReportPrompt(false);
  }, []);

  const shouldShowOnboarding =
    !isDismissed && !progress.isComplete && !progress.loading;

  return {
    progress,
    isDismissed,
    shouldShowOnboarding,
    dismissOnboarding,
    showReportPrompt,
    dismissReportPrompt,
    firstEvaluationPatientId,
    refetch: fetchProgress,
  };
}