import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";
import type { ClinicalData } from "@/react-app/data/neurofluxData";

export interface ConsultationRecord {
  id: number;
  diagnosis: string;
  tissue: string | null;
  pathophysiology: string | null;
  phase: string | null;
  objective: string | null;
  irritability: string | null;
  created_at: string;
}

export function useNeuroflux() {
  const [data, setData] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/api/neuroflux", { cache: "no-store" });
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
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const saveProgress = useCallback(async (formData: ClinicalData) => {
    try {
      await apiFetch("/api/neuroflux", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // Prepend optimistically so history is up-to-date without a refetch
      setData((prev) => [
        {
          id: Date.now(), // temp id until next real fetch
          diagnosis: formData.diagnosis,
          tissue: formData.tissue,
          pathophysiology: formData.pathophysiology,
          phase: formData.phase,
          objective: formData.objective,
          irritability: formData.irritability,
          created_at: new Date().toISOString(),
        },
        ...prev.slice(0, 9), // keep last 10 total
      ]);
    } catch {
      // Non-blocking — consultation history is auxiliary, not critical
    }
  }, []);

  return { data, loading, error, saveProgress };
}
