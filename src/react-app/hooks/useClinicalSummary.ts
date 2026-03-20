import { useState, useEffect, useCallback } from "react";

export interface ClinicalSummaryData {
  patientId: number;
  patientName: string;
  summaryText: string;
  highlights: {
    type: "positive" | "neutral" | "warning" | "critical";
    text: string;
  }[];
  metrics: {
    currentPain: number | null;
    initialPain: number | null;
    painChange: number | null;
    sessionsCount: number;
    daysSinceStart: number;
    lastSessionDate: string | null;
    responsePattern: "positive" | "neutral" | "negative" | "mixed" | null;
  };
  recommendations: string[];
}

export function useClinicalSummary(patientId: string | number | null) {
  const [summary, setSummary] = useState<ClinicalSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${patientId}/clinical-summary`);
      if (!res.ok) throw new Error("Failed to fetch clinical summary");
      const data = await res.json();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}
