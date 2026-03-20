import { useState, useEffect, useCallback } from "react";

export interface WeeklyActivity {
  week: string;
  evolutions: number;
  evaluations: number;
}

export interface PainTrend {
  date: string;
  avgPain: number;
  sessions: number;
}

export interface StatusDistribution {
  green: number;
  yellow: number;
  red: number;
}

export interface MonthlyGrowth {
  month: string;
  patients: number;
  evolutions: number;
}

export interface DashboardChartData {
  weeklyActivity: WeeklyActivity[];
  painTrend: PainTrend[];
  statusDistribution: StatusDistribution;
  monthlyGrowth: MonthlyGrowth[];
}

export function useDashboardCharts() {
  const [data, setData] = useState<DashboardChartData>({
    weeklyActivity: [],
    painTrend: [],
    statusDistribution: { green: 0, yellow: 0, red: 0 },
    monthlyGrowth: []
  });
  const [loading, setLoading] = useState(true);

  const fetchCharts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/charts");
      if (!res.ok) throw new Error("Failed to fetch chart data");
      const chartData = await res.json();
      setData(chartData);
    } catch (err) {
      console.error("Error fetching dashboard charts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return { data, loading, refetch: fetchCharts };
}
