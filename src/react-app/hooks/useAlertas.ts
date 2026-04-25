import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";
import type { Evolution } from "./useEvolutions";

export interface AlertStatus {
  status: "green" | "yellow" | "red";
  color: string;
  message: string;
  details: string[];
  evolutionCount: number;
  lastEvolution: Evolution | null;
}

export interface AlertOverviewItem {
  id: number;
  name: string;
  status: "green" | "yellow" | "red";
  message: string;
  evolutionCount: number;
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

export function useAlertStatus(patientId: number | string | null) {
  const [alertStatus, setAlertStatus] = useState<AlertStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlertStatus = useCallback(async () => {
    if (!patientId) {
      setAlertStatus(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch(`/api/patients/${patientId}/alertas`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar alertas do paciente")
        );
      }

      const data = await res.json();
      setAlertStatus(data);
      setError(null);
    } catch (err) {
      setAlertStatus(null);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchAlertStatus();
  }, [fetchAlertStatus]);

  return { alertStatus, loading, error, refetch: fetchAlertStatus };
}

export function useAlertasOverview() {
  const [overview, setOverview] = useState<AlertOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/api/alertas/overview", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar visão geral dos alertas")
        );
      }

      const data = await res.json();
      setOverview(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setOverview([]);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}