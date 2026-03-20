import { useState, useEffect, useCallback } from "react";

export interface AlertStatus {
  status: "green" | "yellow" | "red";
  color: string;
  message: string;
  details: string[];
  evolutionCount: number;
  lastEvolution: any;
}

export interface AlertOverviewItem {
  id: number;
  name: string;
  status: "green" | "yellow" | "red";
  message: string;
  evolutionCount: number;
}

export function useAlertStatus(patientId: number | string | null) {
  const [alertStatus, setAlertStatus] = useState<AlertStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlertStatus = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${patientId}/alertas`);
      if (!res.ok) throw new Error("Failed to fetch alert status");
      const data = await res.json();
      setAlertStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAlertStatus();
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
      const res = await fetch("/api/alertas/overview");
      if (!res.ok) throw new Error("Failed to fetch alerts overview");
      const data = await res.json();
      setOverview(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}
