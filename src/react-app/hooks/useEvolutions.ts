import { useState, useEffect, useCallback } from "react";

export interface Evolution {
  id: number;
  patient_id: number;
  session_date: string;
  pain_level: number | null;
  functional_status: string | null;
  procedures: string | null;
  patient_response: string | null;
  observations: string | null;
  attendance_status: "attended" | "justified_absence" | "unjustified_absence" | null;
  created_at: string;
  updated_at: string;
}

export interface EvolutionFormData {
  session_date?: string;
  pain_level?: number;
  functional_status?: string;
  procedures?: string;
  patient_response?: string;
  observations?: string;
  attendance_status?: "attended" | "justified_absence" | "unjustified_absence";
}

export function useEvolutions(patientId: number | string) {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvolutions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${patientId}/evolutions`);
      if (!res.ok) throw new Error("Failed to fetch evolutions");
      const data = await res.json();
      setEvolutions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createEvolution = useCallback(async (data: EvolutionFormData) => {
    const res = await fetch(`/api/patients/${patientId}/evolutions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create evolution");
    const newEvol = await res.json();
    setEvolutions((prev) => [newEvol, ...prev]);
    return newEvol;
  }, [patientId]);

  const updateEvolution = useCallback(async (evolutionId: number, data: EvolutionFormData) => {
    const res = await fetch(`/api/evolutions/${evolutionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update evolution");
    const updated = await res.json();
    setEvolutions((prev) => prev.map((e) => (e.id === evolutionId ? updated : e)));
    return updated;
  }, []);

  useEffect(() => {
    if (patientId) fetchEvolutions();
  }, [patientId, fetchEvolutions]);

  return { evolutions, loading, error, fetchEvolutions, createEvolution, updateEvolution };
}
