import { useCallback, useState, useEffect } from "react";
import { apiFetch } from "@/react-app/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Patient {
  id: number;
  user_id: string;
  name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  name: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

function isValidPatientId(
  value: number | string | null | undefined
): value is number | string {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function toSafeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toSafeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizePatient(data: unknown): Patient | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const source = data as Record<string, unknown>;

  if (!("id" in source) && !("name" in source)) {
    return null;
  }

  return {
    id: toSafeNumber(source.id),
    user_id: toSafeString(source.user_id),
    name: toSafeString(source.name),
    birth_date: toNullableString(source.birth_date),
    phone: toNullableString(source.phone),
    email: toNullableString(source.email),
    notes: toNullableString(source.notes),
    created_at: toSafeString(source.created_at),
    updated_at: toSafeString(source.updated_at),
  };
}

function parsePatientsResponse(data: unknown): Patient[] {
  const source = Array.isArray(data)
    ? data
    : data &&
        typeof data === "object" &&
        Array.isArray((data as { patients?: unknown }).patients)
      ? (data as { patients: unknown[] }).patients
      : [];

  return source
    .map((item) => normalizePatient(item))
    .filter((item): item is Patient => item !== null);
}

function parseSinglePatientResponse(data: unknown): Patient | null {
  if (
    data &&
    typeof data === "object" &&
    "patient" in (data as Record<string, unknown>)
  ) {
    return normalizePatient((data as { patient?: unknown }).patient);
  }

  return normalizePatient(data);
}

function buildPatientPayload(data: PatientFormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
  };

  if (data.birth_date !== undefined) {
    payload.birth_date = data.birth_date;
  }

  if (data.phone !== undefined) {
    payload.phone = data.phone;
  }

  if (data.email !== undefined) {
    payload.email = data.email;
  }

  if (data.notes !== undefined) {
    payload.notes = data.notes;
  }

  return payload;
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

export const PATIENTS_QUERY_KEY = ["patients"];

export async function fetchPatientsQueryFn() {
  const res = await apiFetch("/api/patients", {
    method: "GET",
    // Removemos cache="no-store" pois o react-query agora cuida do cache
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Erro ao carregar pacientes"));
  }

  const data: unknown = await res.json();
  return parsePatientsResponse(data);
}

export function usePatients() {
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: PATIENTS_QUERY_KEY,
    queryFn: fetchPatientsQueryFn,
  });
  const createMutation = useMutation({
    mutationFn: async (data: PatientFormData) => {
      const payload = buildPatientPayload(data);
      const res = await apiFetch("/api/patients", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao criar paciente"));
      const responseData: unknown = await res.json();
      const newPatient = parseSinglePatientResponse(responseData);
      if (!newPatient) throw new Error("Resposta inválida do paciente");
      return newPatient;
    },
    onSuccess: (newPatient) => {
      queryClient.setQueryData(PATIENTS_QUERY_KEY, (old: Patient[] = []) => [newPatient, ...old]);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PatientFormData }) => {
      const payload = buildPatientPayload(data);
      const res = await apiFetch(`/api/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao atualizar paciente"));
      const responseData: unknown = await res.json();
      const updated = parseSinglePatientResponse(responseData);
      if (!updated) throw new Error("Resposta inválida do paciente");
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(PATIENTS_QUERY_KEY, (old: Patient[] = []) => 
        old.map((patient) => (patient.id === updated.id ? updated : patient))
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/patients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao excluir paciente"));
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(PATIENTS_QUERY_KEY, (old: Patient[] = []) => 
        old.filter((patient) => patient.id !== deletedId)
      );
    }
  });

  return {
    patients,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    fetchPatients: async () => { await queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY }); },
    createPatient: createMutation.mutateAsync,
    updatePatient: (id: number, data: PatientFormData) => updateMutation.mutateAsync({ id, data }),
    deletePatient: deleteMutation.mutateAsync,
  };
}

export function usePatient(id: number | string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!isValidPatientId(id)) {
      setPatient(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch(`/api/patients/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 404) {
        setPatient(null);
        setError("Paciente não encontrado");
        return;
      }

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Erro ao carregar paciente"));
      }

      const data: unknown = await res.json();
      const normalizedPatient = parseSinglePatientResponse(data);

      if (!normalizedPatient) {
        throw new Error("Resposta inválida do paciente");
      }

      setPatient(normalizedPatient);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchPatient();
  }, [fetchPatient]);

  return { patient, loading, error, refetch: fetchPatient };
}