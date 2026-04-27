import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";
import type { ClinicalData } from "@/data/neurofluxData";

export interface ConsultationRecord {
  id: number;
  patient_id: string | null;
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  created_at: string;
}

export function useNeuroflux(patientId?: string) {
  const [data, setData] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = patientId
        ? `/api/neuroflux?patient_id=${encodeURIComponent(patientId)}`
        : "/api/neuroflux";
      const res = await apiFetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as ConsultationRecord[];
        setData(Array.isArray(json) ? json : []);
      } else {
        setError("Erro ao carregar histórico");
      }
    } catch {
      setError("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const saveProgress = useCallback(
    async (formData: ClinicalData, patientIdOverride?: string | null) => {
      const resolvedPatientId =
        patientIdOverride !== undefined ? patientIdOverride : (patientId ?? null);
      try {
        await apiFetch("/api/neuroflux", {
          method: "POST",
          body: JSON.stringify({ ...formData, patient_id: resolvedPatientId }),
        });
        // Optimistic prepend
        setData((prev) => [
          {
            id: Date.now(),
            patient_id: resolvedPatientId ?? null,
            diagnosis: formData.diagnosis,
            tissue: formData.tissue,
            pathophysiology: formData.pathophysiology,
            phase: formData.phase,
            objective: formData.objective,
            irritability: formData.irritability,
            created_at: new Date().toISOString(),
          },
          ...prev.slice(0, 9),
        ]);
      } catch {
        // Non-blocking — consultation history is auxiliary, not critical
      }
    },
    [patientId]
  );

  return { data, loading, error, saveProgress, refetch: fetchHistory };
}
