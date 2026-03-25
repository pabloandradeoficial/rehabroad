import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface ClinicalInsight {
  category: "pain" | "progression" | "region" | "caminho" | "evolution" | "alert";
  priority: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  actions?: string[];
}

export interface PainStatus {
  level: number | null;
  severity: "none" | "low" | "moderate" | "high";
  trend: "improving" | "stable" | "worsening" | null;
  changePercent: number | null;
}

export interface DiagnosticHypothesis {
  condition: string;
  confidence: "alta" | "média" | "baixa";
  reasoning: string[];
  differentials: string[];
  suggestedTests: string[];
}

export interface StructuredSuporte {
  painStatus: PainStatus;
  insights: ClinicalInsight[];
  nextSteps: string[];
  diagnosticHypotheses: DiagnosticHypothesis[];
}

export interface SuporteData {
  evaluation: any;
  caminho: any;
  latestEvolution: any;
  suggestions: string[];
  structured?: StructuredSuporte | null;
}

const EMPTY_SUPORTE: SuporteData = {
  evaluation: null,
  caminho: null,
  latestEvolution: null,
  suggestions: [],
  structured: {
    painStatus: {
      level: null,
      severity: "none",
      trend: null,
      changePercent: null,
    },
    insights: [],
    nextSteps: [],
    diagnosticHypotheses: [],
  },
};

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

export function useSuporte(patientId: number | string | null) {
  const [suporte, setSuporte] = useState<SuporteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuporte = useCallback(async () => {
    if (!patientId || patientId === "" || patientId === "0") {
      setSuporte(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await apiFetch(`/api/patients/${patientId}/suporte`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) {
          setSuporte(EMPTY_SUPORTE);
          return;
        }

        throw new Error(
          await parseErrorMessage(res, "Erro ao carregar dados do paciente")
        );
      }

      const data = await res.json();

      setSuporte({
        evaluation: data?.evaluation || null,
        caminho: data?.caminho || null,
        latestEvolution: data?.latestEvolution || null,
        suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
        structured: data?.structured || EMPTY_SUPORTE.structured,
      });
    } catch (err) {
      console.error("Erro useSuporte:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setSuporte(EMPTY_SUPORTE);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchSuporte();
  }, [fetchSuporte]);

  return { suporte, loading, error, refetch: fetchSuporte };
}