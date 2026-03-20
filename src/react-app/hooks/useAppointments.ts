import { useState, useEffect, useCallback } from "react";

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

export function useAppointments(startDate?: string, endDate?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.set("start", startDate);
      if (endDate) params.set("end", endDate);
      
      const response = await fetch(`/api/appointments?${params.toString()}`);
      if (!response.ok) throw new Error("Erro ao carregar agenda");
      
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (input: AppointmentInput) => {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Erro ao criar agendamento");
    await fetchAppointments();
    return response.json();
  };

  const updateAppointment = async (id: number, input: AppointmentInput) => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Erro ao atualizar agendamento");
    await fetchAppointments();
  };

  const deleteAppointment = async (id: number) => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir agendamento");
    await fetchAppointments();
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
