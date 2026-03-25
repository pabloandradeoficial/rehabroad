import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface Evolution {
  id: number;
  patient_id: number;
  session_date: string;
  pain_level: number | null;
  functional_status: string | null;
  procedures: string | null;
  patient_response: string | null;
  observations: string | null;
  attendance_status:
    | "attended"
    | "justified_absence"
    | "unjustified_absence"
    | null;
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

export function useEvolutions(patientId: number | string) {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvolutions = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch(`/api/patients/${patientId}/evolutions`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar evoluções")
        );
      }

      const data = await res.json();
      setEvolutions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setEvolutions([]);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const createEvolution = useCallback(
    async (data: EvolutionFormData) => {
      const res = await apiFetch(`/api/patients/${patientId}/evolutions`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao criar evolução")
        );
      }

      const newEvol = await res.json();
      setEvolutions((prev) => [newEvol, ...prev]);
      setError(null);
      return newEvol;
    },
    [patientId]
  );

  const updateEvolution = useCallback(
    async (evolutionId: number, data: EvolutionFormData) => {
      const res = await apiFetch(`/api/evolutions/${evolutionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao atualizar evolução")
        );
      }

      const updated = await res.json();
      setEvolutions((prev) =>
        prev.map((e) => (e.id === evolutionId ? updated : e))
      );
      setError(null);
      return updated;
    },
    []
  );

  useEffect(() => {
    if (patientId) {
      void fetchEvolutions();
    }
  }, [patientId, fetchEvolutions]);

  return {
    evolutions,
    loading,
    error,
    fetchEvolutions,
    createEvolution,
    updateEvolution,
  };
}