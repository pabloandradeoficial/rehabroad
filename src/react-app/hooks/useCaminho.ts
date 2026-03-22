import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface Caminho {
  id: number;
  patient_id: number;
  pain_pattern: string | null;
  pain_patterns: string[] | null;
  aggravating_factors: string | null;
  relieving_factors: string | null;
  functional_limitations: string | null;
  treatment_goals: string | null;
  red_flags: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaminhoFormData {
  pain_pattern?: string;
  pain_patterns?: string[] | string;
  aggravating_factors?: string;
  relieving_factors?: string;
  functional_limitations?: string;
  treatment_goals?: string;
  red_flags?: string;
}

function isValidPatientId(value: number | string | null): value is number | string {
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

function toNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toNullableStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string");
    return items.length > 0 ? items : [];
  }

  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  return null;
}

function normalizePainFields(source: Record<string, unknown>) {
  const painPattern = toNullableString(source.pain_pattern);
  const painPatterns = toNullableStringArray(source.pain_patterns);

  const normalizedPainPattern =
    painPattern ??
    (painPatterns && painPatterns.length > 0 ? painPatterns.join(", ") : null);

  const normalizedPainPatterns =
    painPatterns ?? (painPattern !== null ? (painPattern.trim() ? [painPattern] : []) : null);

  return {
    pain_pattern: normalizedPainPattern,
    pain_patterns: normalizedPainPatterns,
  };
}

function normalizeCaminhoResponse(data: unknown): Caminho | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const source = data as Record<string, unknown>;
  const hasRelevantField = [
    "id",
    "patient_id",
    "pain_pattern",
    "pain_patterns",
    "aggravating_factors",
    "relieving_factors",
    "functional_limitations",
    "treatment_goals",
    "red_flags",
    "created_at",
    "updated_at",
  ].some((key) => key in source);

  if (!hasRelevantField) {
    return null;
  }

  const painFields = normalizePainFields(source);

  return {
    id: toSafeNumber(source.id),
    patient_id: toSafeNumber(source.patient_id),
    pain_pattern: painFields.pain_pattern,
    pain_patterns: painFields.pain_patterns,
    aggravating_factors: toNullableString(source.aggravating_factors),
    relieving_factors: toNullableString(source.relieving_factors),
    functional_limitations: toNullableString(source.functional_limitations),
    treatment_goals: toNullableString(source.treatment_goals),
    red_flags: toNullableString(source.red_flags),
    created_at: toNullableString(source.created_at) ?? "",
    updated_at: toNullableString(source.updated_at) ?? "",
  };
}

function buildCaminhoPayload(data: CaminhoFormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.pain_pattern !== undefined) {
    payload.pain_pattern = data.pain_pattern;
  }

  if (data.pain_patterns !== undefined) {
    if (Array.isArray(data.pain_patterns)) {
      payload.pain_patterns = data.pain_patterns.filter(
        (item): item is string => typeof item === "string"
      );
    } else if (typeof data.pain_patterns === "string") {
      payload.pain_patterns = data.pain_patterns.trim() ? [data.pain_patterns] : [];
    }
  } else if (data.pain_pattern !== undefined) {
    payload.pain_patterns = data.pain_pattern.trim() ? [data.pain_pattern] : [];
  }

  if (data.aggravating_factors !== undefined) {
    payload.aggravating_factors = data.aggravating_factors;
  }

  if (data.relieving_factors !== undefined) {
    payload.relieving_factors = data.relieving_factors;
  }

  if (data.functional_limitations !== undefined) {
    payload.functional_limitations = data.functional_limitations;
  }

  if (data.treatment_goals !== undefined) {
    payload.treatment_goals = data.treatment_goals;
  }

  if (data.red_flags !== undefined) {
    payload.red_flags = data.red_flags;
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

export function useCaminho(patientId: number | string | null) {
  const [caminho, setCaminho] = useState<Caminho | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCaminho = useCallback(async () => {
    if (!isValidPatientId(patientId)) {
      setCaminho(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch(`/api/patients/${patientId}/caminho`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 404) {
        setCaminho(null);
        setError(null);
        return;
      }

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Erro ao carregar caminho"));
      }

      const data: unknown = await res.json();
      const normalized = normalizeCaminhoResponse(data);

      setCaminho(normalized);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const saveCaminho = useCallback(
    async (data: CaminhoFormData) => {
      if (!isValidPatientId(patientId)) {
        throw new Error("No patient selected");
      }

      const payload = buildCaminhoPayload(data);

      const res = await apiFetch(`/api/patients/${patientId}/caminho`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, "Erro ao salvar caminho"));
      }

      const responseData: unknown = await res.json();
      const saved = normalizeCaminhoResponse(responseData);

      if (!saved) {
        throw new Error("Invalid caminho response");
      }

      setCaminho(saved);
      setError(null);

      return saved;
    },
    [patientId]
  );

  useEffect(() => {
    void fetchCaminho();
  }, [fetchCaminho]);

  return { caminho, loading, error, fetchCaminho, saveCaminho };
}