import { useState, useEffect } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface PainPoint {
  session: number;
  date: string;
  pain: number;
}

export interface FunctionalPoint {
  session: number;
  date: string;
  score: number;
}

export interface ProgressMilestone {
  label: string;
  date: string;
  type: "start" | "improvement" | "goal" | "warning";
}

export interface PatientProgress {
  patientId: number;
  patientName: string;
  painTimeline: PainPoint[];
  functionalTimeline: FunctionalPoint[];
  summary: {
    totalSessions: number;
    initialPain: number | null;
    currentPain: number | null;
    painChange: number | null;
    avgPain: number | null;
    positiveRate: number | null;
  };
  milestones: ProgressMilestone[];
}

export function usePatientProgress(patientId: string | undefined) {
  const [progress, setProgress] = useState<PatientProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    apiFetch(`/api/patients/${patientId}/progress`)
      .then((data) => setProgress(data as PatientProgress))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar progresso"))
      .finally(() => setLoading(false));
  }, [patientId]);

  return { progress, loading, error };
}
