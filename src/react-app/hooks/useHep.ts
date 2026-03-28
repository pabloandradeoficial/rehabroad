import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface HepPlan {
  id: number;
  patient_id: number;
  user_id: string;
  title: string;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface HepExercise {
  id: number;
  plan_id: number;
  exercise_name: string;
  exercise_category: string | null;
  sets: number | null;
  reps: string | null;
  frequency: string | null;
  instructions: string | null;
  order_index: number;
  created_at: string;
}

export interface HepCheckin {
  id: number;
  plan_id: number;
  exercise_id: number;
  completed: number;
  pain_level: number | null;
  difficulty: string | null;
  notes: string | null;
  checked_at: string;
}

export interface HepAdherence {
  totalCheckins: number;
  completedCheckins: number;
  adherenceRate: number;
  averagePain: number;
  lastCheckin: string | null;
  status: "green" | "yellow" | "red";
  exerciseBreakdown: {
    exerciseId: number;
    name: string;
    completionRate: number;
    averagePain: number;
  }[];
}

export interface HepExerciseInput {
  exercise_name: string;
  exercise_category?: string;
  sets?: number;
  reps?: string;
  frequency?: string;
  instructions?: string;
  order_index?: number;
}

// ─────────────────────────────────────────────
// useHepPlan — for physio dashboard
// ─────────────────────────────────────────────

export function useHepPlan(patientId: number | undefined) {
  const [plan, setPlan] = useState<HepPlan | null>(null);
  const [exercises, setExercises] = useState<HepExercise[]>([]);
  const [adherence, setAdherence] = useState<HepAdherence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/hep/plans?patient_id=${patientId}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erro ao carregar plano");

      const data = await res.json() as { plans: HepPlan[] };
      const activePlan = data.plans.find((p) => p.status === "active") ?? data.plans[0] ?? null;
      setPlan(activePlan);

      if (activePlan) {
        await fetchExercises(activePlan.id);
        await fetchAdherence(activePlan.id);
      } else {
        setExercises([]);
        setAdherence(null);
      }
    } catch {
      setError("Erro ao carregar plano domiciliar.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const fetchExercises = useCallback(async (planId: number) => {
    const res = await apiFetch(`/api/hep/plans/${planId}`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json() as { exercises: HepExercise[] };
      setExercises(data.exercises ?? []);
    }
  }, []);

  const fetchAdherence = useCallback(async (planId: number) => {
    const res = await apiFetch(`/api/hep/plans/${planId}/adherence`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json() as HepAdherence;
      setAdherence(data);
    }
  }, []);

  useEffect(() => {
    void fetchPlan();
  }, [fetchPlan]);

  // Poll adherence every 30 seconds while a plan is active
  useEffect(() => {
    if (!plan?.id) return;
    const interval = setInterval(() => {
      void fetchAdherence(plan.id);
    }, 30_000);
    return () => clearInterval(interval);
  }, [plan?.id, fetchAdherence]);

  const createPlan = useCallback(
    async (title: string, description?: string): Promise<HepPlan | null> => {
      if (!patientId) return null;
      const res = await apiFetch("/api/hep/plans", {
        method: "POST",
        body: JSON.stringify({ patient_id: patientId, title, description }),
      });
      if (!res.ok) throw new Error("Erro ao criar plano");
      const data = await res.json() as { plan: HepPlan };
      await fetchPlan();
      return data.plan;
    },
    [patientId, fetchPlan]
  );

  const updatePlan = useCallback(
    async (planId: number, updates: Partial<Pick<HepPlan, "title" | "description" | "status">>): Promise<void> => {
      const res = await apiFetch(`/api/hep/plans/${planId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Erro ao atualizar plano");
      await fetchPlan();
    },
    [fetchPlan]
  );

  const addExercise = useCallback(
    async (planId: number, exercise: HepExerciseInput): Promise<void> => {
      const res = await apiFetch(`/api/hep/plans/${planId}/exercises`, {
        method: "POST",
        body: JSON.stringify(exercise),
      });
      if (!res.ok) throw new Error("Erro ao adicionar exercício");
      await fetchExercises(planId);
    },
    [fetchExercises]
  );

  const updateExercise = useCallback(
    async (exerciseId: number, updates: Partial<HepExerciseInput>): Promise<void> => {
      const res = await apiFetch(`/api/hep/exercises/${exerciseId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Erro ao atualizar exercício");
      if (plan) await fetchExercises(plan.id);
    },
    [plan, fetchExercises]
  );

  const removeExercise = useCallback(
    async (exerciseId: number): Promise<void> => {
      const res = await apiFetch(`/api/hep/exercises/${exerciseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao remover exercício");
      if (plan) await fetchExercises(plan.id);
    },
    [plan, fetchExercises]
  );

  const generateToken = useCallback(
    async (planId: number): Promise<{ token: string; accessUrl: string; expiresAt: string } | null> => {
      const res = await apiFetch(`/api/hep/plans/${planId}/token`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erro ao gerar link");
      const data = await res.json() as { token: string; accessUrl: string; expiresAt: string };
      return data;
    },
    []
  );

  const refreshAdherence = useCallback(async () => {
    if (plan) await fetchAdherence(plan.id);
  }, [plan, fetchAdherence]);

  return {
    plan,
    exercises,
    adherence,
    loading,
    error,
    createPlan,
    updatePlan,
    addExercise,
    updateExercise,
    removeExercise,
    generateToken,
    refreshAdherence,
    refetch: fetchPlan,
  };
}

// ─────────────────────────────────────────────
// useHepOverview — for dashboard adherence panel
// ─────────────────────────────────────────────

export interface HepOverviewEntry {
  patientId: number;
  planId: number;
  planTitle: string;
  adherenceRate: number;
  totalCheckins: number;
  lastCheckin: string | null;
  status: "green" | "yellow" | "red";
}

export function useHepOverview() {
  const [overview, setOverview] = useState<HepOverviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/hep/overview", { method: "GET", cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json() as { overview: HepOverviewEntry[] };
      setOverview(data.overview ?? []);
    } catch {
      setError("Erro ao carregar visão geral de adesão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { overview, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// useHepPatient — for public patient portal
// ─────────────────────────────────────────────

export function useHepPatient(token: string | undefined) {
  const [plan, setPlan] = useState<HepPlan | null>(null);
  const [exercises, setExercises] = useState<HepExercise[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<HepCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hep/patient/${token}`);
        if (res.status === 410) {
          setExpired(true);
          return;
        }
        if (!res.ok) {
          setError("Link inválido ou expirado.");
          return;
        }
        const data = await res.json() as {
          plan: HepPlan;
          exercises: HepExercise[];
          recentCheckins: HepCheckin[];
        };
        setPlan(data.plan);
        setExercises(data.exercises ?? []);
        setRecentCheckins(data.recentCheckins ?? []);
      } catch {
        setError("Não foi possível carregar o plano. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  const submitCheckin = useCallback(
    async (checkin: {
      exercise_id: number;
      completed: boolean;
      pain_level?: number;
      difficulty?: string;
      notes?: string;
    }): Promise<void> => {
      if (!token) throw new Error("Token ausente");
      const res = await fetch(`/api/hep/patient/${token}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkin),
      });
      if (!res.ok) throw new Error("Erro ao registrar check-in");
      const data = await res.json() as { checkin: HepCheckin };
      setRecentCheckins((prev) => [data.checkin, ...prev]);
    },
    [token]
  );

  return { plan, exercises, recentCheckins, loading, error, expired, submitCheckin };
}
