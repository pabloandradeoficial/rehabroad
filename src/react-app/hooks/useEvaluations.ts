import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface Evaluation {
  id: number;
  patient_id: number;
  type: "initial" | "followup";
  chief_complaint: string | null;
  history: string | null;
  pain_level: number | null;
  pain_location: string | null;
  functional_status: string | null;
  orthopedic_tests: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
}

export interface EvaluationFormData {
  type?: "initial" | "followup";
  chief_complaint?: string;
  history?: string;
  pain_level?: number;
  pain_location?: string;
  functional_status?: string;
  orthopedic_tests?: string;
  observations?: string;
}

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

export function useEvaluations(patientId: number | string) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch(`/api/patients/${patientId}/evaluations`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar avaliações")
        );
      }

      const data = await res.json();
      setEvaluations(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setEvaluations([]);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createEvaluation = useCallback(
    async (data: EvaluationFormData) => {
      const res = await apiFetch(`/api/patients/${patientId}/evaluations`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao criar avaliação")
        );
      }

      const newEval = await res.json();
      setEvaluations((prev) => [newEval, ...prev]);
      setError(null);
      return newEval;
    },
    [patientId]
  );

  const updateEvaluation = useCallback(
    async (evaluationId: number, data: EvaluationFormData) => {
      const res = await apiFetch(`/api/evaluations/${evaluationId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao atualizar avaliação")
        );
      }

      const updatedEval = await res.json();
      setEvaluations((prev) =>
        prev.map((e) => (e.id === evaluationId ? updatedEval : e))
      );
      setError(null);
      return updatedEval;
    },
    []
  );

  useEffect(() => {
    if (patientId) {
      void fetchEvaluations();
    }
  }, [patientId, fetchEvaluations]);

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
  };
}