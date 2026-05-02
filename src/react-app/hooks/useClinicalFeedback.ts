import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "@/react-app/lib/api";

export type SuggestionType = "insight" | "hypothesis" | "alert" | "hep_signal";
export type FeedbackValue = "useful" | "not_applicable" | "disagree" | "confirmed";

export interface ClinicalFeedbackRow {
  suggestion_type: SuggestionType;
  suggestion_key: string;
  feedback: FeedbackValue;
  notes: string | null;
  updated_at: string;
}

export function useClinicalFeedback(patientId: number | null) {
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackValue>>({});
  const [loading, setLoading] = useState(false);

  const fetchFeedback = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/api/clinical-feedback/${patientId}`);
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, FeedbackValue> = {};
        data.feedback.forEach((row: ClinicalFeedbackRow) => {
          // Usando uma chave composta "tipo:chave" para identificar univocamente
          map[`${row.suggestion_type}:${row.suggestion_key}`] = row.feedback;
        });
        setFeedbacks(map);
      }
    } catch (err) {
      console.error("Failed to load clinical feedback", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchFeedback();
  }, [fetchFeedback]);

  const submitFeedback = async (
    suggestion_type: SuggestionType,
    suggestion_key: string,
    feedback: FeedbackValue,
    notes?: string,
    context_snapshot?: unknown
  ) => {
    if (!patientId) return false;
    
    // Optimistic UI update
    const mapKey = `${suggestion_type}:${suggestion_key}`;
    setFeedbacks((prev) => ({ ...prev, [mapKey]: feedback }));

    try {
      const res = await apiFetch(`/api/clinical-feedback`, {
        method: "POST",
        body: JSON.stringify({
          patient_id: patientId,
          suggestion_type,
          suggestion_key,
          feedback,
          notes,
          context_snapshot,
        }),
      });

      if (!res.ok) {
        // Revert se falhar
        fetchFeedback();
        return false;
      }
      return true;
    } catch (err) {
      console.error("Failed to submit feedback", err);
      fetchFeedback();
      return false;
    }
  };

  return { feedbacks, loading, submitFeedback, refetch: fetchFeedback };
}
