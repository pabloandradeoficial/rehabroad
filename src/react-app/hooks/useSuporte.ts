import { useState, useEffect, useCallback } from "react";

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
  structured?: StructuredSuporte;
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
      const res = await fetch(`/api/patients/${patientId}/suporte`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setSuporte({
            evaluation: null,
            caminho: null,
            latestEvolution: null,
            suggestions: [],
            structured: {
              painStatus: { level: null, severity: "none", trend: null, changePercent: null },
              insights: [],
              nextSteps: [],
              diagnosticHypotheses: []
            }
          });
          return;
        }
        throw new Error("Erro ao carregar dados do paciente");
      }
      
      const data = await res.json();
      
      setSuporte({
        evaluation: data.evaluation || null,
        caminho: data.caminho || null,
        latestEvolution: data.latestEvolution || null,
        suggestions: data.suggestions || [],
        structured: data.structured || null
      });
    } catch (err) {
      console.error("Erro useSuporte:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setSuporte({
        evaluation: null,
        caminho: null,
        latestEvolution: null,
        suggestions: [],
        structured: undefined
      });
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSuporte();
  }, [fetchSuporte]);

  return { suporte, loading, error, refetch: fetchSuporte };
}
