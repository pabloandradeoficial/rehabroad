import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/react-app/lib/api";

export interface ClinicalAlert {
  severity: "danger" | "warning" | "info" | "success";
  title: string;
  description: string;
  conduta: string;
  baseadoEm: string;
  confidence: number;
}

export interface ClinicalContext {
  patient: {
    id: number;
    name: string;
    age: number | null;
  };
  latestEvaluation: {
    chief_complaint: string | null;
    pain_level: number | null;
    pain_location: string | null;
    functional_status: string | null;
    orthopedic_tests: string | null;
    history: string | null;
    created_at: string;
  } | null;
  evolutionSummary: {
    totalSessions: number;
    lastSessionDate: string | null;
    initialPainLevel: number | null;
    currentPainLevel: number | null;
    painTrend: "improving" | "worsening" | "stable";
    proceduresUsed: string[];
    lastPatientResponse: string | null;
    averagePainLast3Sessions: number | null;
  };
  clinicalFlags: {
    isAcute: boolean;
    isSubacute: boolean;
    isChronic: boolean;
    highPain: boolean;
    notImproving: boolean;
    fewSessions: boolean;
  };
  alerts: ClinicalAlert[];
}

export function buildClinicalSummary(context: ClinicalContext): string {
  const e = context.latestEvaluation;
  const s = context.evolutionSummary;
  const f = context.clinicalFlags;

  const phase = f.isAcute ? "Aguda" : f.isSubacute ? "Subaguda" : "Crônica";

  return [
    "DADOS DO PACIENTE:",
    `- Queixa principal: ${e?.chief_complaint ?? "Não informada"}`,
    `- Localização da dor: ${e?.pain_location ?? "Não informada"}`,
    `- Nível de dor atual: ${e?.pain_level != null ? `${e.pain_level}/10` : "Não informado"}`,
    `- Status funcional: ${e?.functional_status ?? "Não informado"}`,
    `- Testes ortopédicos: ${e?.orthopedic_tests ?? "Não informado"}`,
    `- Histórico: ${e?.history ?? "Não informado"}`,
    "",
    "EVOLUÇÃO CLÍNICA:",
    `- Total de sessões: ${s.totalSessions}`,
    `- Dor inicial: ${s.initialPainLevel != null ? `${s.initialPainLevel}/10` : "Não informada"}`,
    `- Dor atual: ${s.currentPainLevel != null ? `${s.currentPainLevel}/10` : "Não informada"}`,
    `- Tendência: ${s.painTrend === "improving" ? "Melhorando" : s.painTrend === "worsening" ? "Piorando" : "Estável"}`,
    `- Procedimentos já utilizados: ${s.proceduresUsed.length > 0 ? s.proceduresUsed.join(", ") : "Nenhum registrado"}`,
    `- Última resposta do paciente: ${s.lastPatientResponse ?? "Não registrada"}`,
    "",
    "FLAGS CLÍNICOS:",
    `- Fase: ${phase}`,
    `- Dor alta: ${f.highPain ? "Sim" : "Não"}`,
    `- Sem melhora: ${f.notImproving ? "Sim (atenção!)" : "Não"}`,
    `- Poucas sessões: ${f.fewSessions ? "Sim (< 3 sessões)" : "Não"}`,
  ].join("\n");
}

export function useClinicalContext(patientId: string | number | null) {
  const [context, setContext] = useState<ClinicalContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(async () => {
    if (!patientId) {
      setContext(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/clinical-context/${patientId}`);
      if (res.ok) {
        setContext((await res.json()) as ClinicalContext);
      } else {
        setError("Erro ao carregar contexto clínico");
      }
    } catch {
      setError("Erro ao carregar contexto clínico");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchContext();
  }, [fetchContext]);

  return { context, loading, error, refetch: fetchContext };
}
