import { useState, useEffect, useCallback } from "react";

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
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data.stats);
      setRecentActivities(data.recentActivities || []);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
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
  // Rotate based on day of week for consistency within a day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  return motivationalMessages[dayOfYear % motivationalMessages.length];
}
