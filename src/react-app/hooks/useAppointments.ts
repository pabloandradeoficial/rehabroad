import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface Appointment {
  id: number;
  user_id: string;
  patient_id: number | null;
  patient_name: string | null;
  patient_full_name?: string;
  patient_phone?: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  type: "sessao" | "avaliacao" | "retorno" | "outro";
  notes: string | null;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  price: number | null;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppointmentInput {
  patient_id?: number | null;
  patient_name?: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  type?: string;
  notes?: string;
  status?: string;
  price?: number | null;
  is_paid?: boolean;
}

type MutationOptions = {
  skipRefetch?: boolean;
};

async function parseErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();

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

export function useAppointments(startDate?: string, endDate?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startDate) params.set("start", startDate);
      if (endDate) params.set("end", endDate);

      const query = params.toString();
      const url = query ? `/api/appointments?${query}` : "/api/appointments";

      const response = await apiFetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Erro ao carregar agenda"));
      }

      const data = await response.json();
      setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
    } catch (err) {
      setAppointments([]);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (
    input: AppointmentInput,
    options?: MutationOptions
  ) => {
    setError(null);

    const response = await apiFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(
        await parseErrorMessage(response, "Erro ao criar agendamento")
      );
    }

    const data = await response.json();

    if (!options?.skipRefetch) {
      await fetchAppointments();
    }

    return data;
  };

  const updateAppointment = async (
    id: number,
    input: AppointmentInput,
    options?: MutationOptions
  ) => {
    setError(null);

    const response = await apiFetch(`/api/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(
        await parseErrorMessage(response, "Erro ao atualizar agendamento")
      );
    }

    if (!options?.skipRefetch) {
      await fetchAppointments();
    }
  };

  const deleteAppointment = async (id: number, options?: MutationOptions) => {
    setError(null);

    const response = await apiFetch(`/api/appointments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        await parseErrorMessage(response, "Erro ao excluir agendamento")
      );
    }

    if (!options?.skipRefetch) {
      await fetchAppointments();
    }
  };

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}