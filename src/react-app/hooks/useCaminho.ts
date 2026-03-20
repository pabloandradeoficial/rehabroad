import { useState, useEffect, useCallback } from "react";

export interface Caminho {
  id: number;
  patient_id: number;
  pain_pattern: string | null;
  aggravating_factors: string | null;
  relieving_factors: string | null;
  functional_limitations: string | null;
  treatment_goals: string | null;
  red_flags: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaminhoFormData {
  pain_pattern?: string;
  aggravating_factors?: string;
  relieving_factors?: string;
  functional_limitations?: string;
  treatment_goals?: string;
  red_flags?: string;
}

export function useCaminho(patientId: number | string | null) {
  const [caminho, setCaminho] = useState<Caminho | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaminho = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${patientId}/caminho`);
      if (!res.ok) throw new Error("Failed to fetch caminho");
      const data = await res.json();
      setCaminho(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const saveCaminho = useCallback(async (data: CaminhoFormData) => {
    if (!patientId) throw new Error("No patient selected");
    const res = await fetch(`/api/patients/${patientId}/caminho`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save caminho");
    const saved = await res.json();
    setCaminho(saved);
    return saved;
  }, [patientId]);

  useEffect(() => {
    fetchCaminho();
  }, [fetchCaminho]);

  return { caminho, loading, error, fetchCaminho, saveCaminho };
}
