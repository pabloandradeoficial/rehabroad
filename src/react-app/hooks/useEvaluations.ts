import { useState, useEffect, useCallback } from "react";

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

export function useEvaluations(patientId: number | string) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${patientId}/evaluations`);
      if (!res.ok) throw new Error("Failed to fetch evaluations");
      const data = await res.json();
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createEvaluation = useCallback(async (data: EvaluationFormData) => {
    const res = await fetch(`/api/patients/${patientId}/evaluations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create evaluation");
    const newEval = await res.json();
    setEvaluations((prev) => [newEval, ...prev]);
    return newEval;
  }, [patientId]);

  const updateEvaluation = useCallback(async (evaluationId: number, data: EvaluationFormData) => {
    const res = await fetch(`/api/evaluations/${evaluationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update evaluation");
    const updatedEval = await res.json();
    setEvaluations((prev) => prev.map(e => e.id === evaluationId ? updatedEval : e));
    return updatedEval;
  }, []);

  useEffect(() => {
    if (patientId) fetchEvaluations();
  }, [patientId, fetchEvaluations]);

  return { evaluations, loading, error, fetchEvaluations, createEvaluation, updateEvaluation };
}
