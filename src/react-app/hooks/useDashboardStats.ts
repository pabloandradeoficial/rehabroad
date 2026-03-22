import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface DashboardStats {
  totalPatients: number;
  totalEvaluations: number;
  totalEvolutions: number;
  lastActivityDate: string | null;
}

export interface RecentActivity {
  id: number;
  type: "evaluation" | "evolution" | "patient";
  patientName: string;
  patientId: number;
  date: string;
  description: string;
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

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalEvaluations: 0,
    totalEvolutions: 0,
    lastActivityDate: null,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/api/dashboard/stats", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar estatísticas do painel")
        );
      }

      const data = await res.json();

      setStats(
        data?.stats ?? {
          totalPatients: 0,
          totalEvaluations: 0,
          totalEvolutions: 0,
          lastActivityDate: null,
        }
      );

      setRecentActivities(Array.isArray(data?.recentActivities) ? data.recentActivities : []);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setStats({
        totalPatients: 0,
        totalEvaluations: 0,
        totalEvolutions: 0,
        lastActivityDate: null,
      });
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return { stats, recentActivities, loading, refetch: fetchStats };
}

// Motivational messages for rotating display
export const motivationalMessages = [
  "Organização clínica fortalece sua prática.",
  "Documentação estruturada transmite segurança.",
  "Acompanhar evolução é parte do cuidado.",
  "Registros claros facilitam decisões clínicas.",
  "Cada evolução conta a história do tratamento.",
];

export function getMotivationalMessage(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return motivationalMessages[dayOfYear % motivationalMessages.length];
}