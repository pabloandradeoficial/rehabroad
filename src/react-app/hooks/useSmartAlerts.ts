import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface SmartAlert {
  id: number;
  patientId: number;
  patientName: string;
  type: "high_pain" | "no_evolution" | "inactive" | "stagnant_pain";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  actionLabel: string;
  daysSince?: number;
  painLevel?: number;
}

export interface WeeklyPriority {
  id: number;
  patientId: number;
  patientName: string;
  reason: string;
  priority: 1 | 2 | 3;
}

export interface SmartAlertsData {
  alerts: SmartAlert[];
  weeklyPriorities: WeeklyPriority[];
  stats: {
    criticalCount: number;
    warningCount: number;
    totalPatientsNeedingAttention: number;
  };
}

export function useSmartAlerts() {
  const [data, setData] = useState<SmartAlertsData>({
    alerts: [],
    weeklyPriorities: [],
    stats: { criticalCount: 0, warningCount: 0, totalPatientsNeedingAttention: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSmartAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/smart-alerts");
      if (!res.ok) throw new Error("Failed to fetch smart alerts");
      const result = await res.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSmartAlerts();
  }, [fetchSmartAlerts]);

  return { ...data, loading, error, refetch: fetchSmartAlerts };
}
