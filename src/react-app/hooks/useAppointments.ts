import { apiFetch } from "@/react-app/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const APPOINTMENTS_QUERY_KEY = (start?: string, end?: string) => 
  ["appointments", { start, end }].filter(Boolean);

export async function fetchAppointmentsQueryFn({ queryKey }: any) {
  const [_key, paramsObj] = queryKey;
  const params = new URLSearchParams();
  if (paramsObj?.start) params.set("start", paramsObj.start);
  if (paramsObj?.end) params.set("end", paramsObj.end);

  const query = params.toString();
  const url = query ? `/api/appointments?${query}` : "/api/appointments";

  const response = await apiFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Erro ao carregar agenda"));
  }

  const data = await response.json();
  return Array.isArray(data.appointments) ? data.appointments : [];
}

export function useAppointments(startDate?: string, endDate?: string) {
  const queryClient = useQueryClient();
  const queryKey = APPOINTMENTS_QUERY_KEY(startDate, endDate);

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchAppointmentsQueryFn,
  });

  const createMutation = useMutation({
    mutationFn: async (input: AppointmentInput) => {
      const response = await apiFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Erro ao criar agendamento"));
      }
      return response.json();
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: number; input: AppointmentInput }) => {
      const response = await apiFetch(`/api/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Erro ao atualizar agendamento"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiFetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Erro ao excluir agendamento"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  return {
    appointments,
    loading: isLoading,
    error: error instanceof Error ? error.message : error?.toString() || null,
    refetch: async () => { await queryClient.invalidateQueries({ queryKey }); },
    createAppointment: createMutation.mutateAsync,
    updateAppointment: (id: number, input: AppointmentInput, options?: MutationOptions) => 
      updateMutation.mutateAsync({ id, input }),
    deleteAppointment: (id: number, options?: MutationOptions) => 
      deleteMutation.mutateAsync(id),
  };
}