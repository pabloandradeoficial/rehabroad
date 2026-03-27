import { useMemo } from "react";
import type { Exercise } from "@/data/exercises";
import type { ClinicalContext } from "./useClinicalContext";

// Maps free-text pain_location to exercise category IDs
function mapLocationToCategory(location: string): string | null {
  const l = location.toLowerCase();
  if (l.includes("ombro")) return "ombro";
  if (l.includes("coluna") || l.includes("lombar") || l.includes("costas") || l.includes("dorsal")) return "coluna";
  if (l.includes("cervic") || l.includes("pescoço") || l.includes("nuca")) return "cervical";
  if (l.includes("joelho")) return "joelho";
  if (l.includes("tornozelo") || l.includes("pé ") || l.includes("pé,") || l.includes("pe ") || l.includes("plantar")) return "tornozelo";
  if (l.includes("quadril") || l.includes("glúteo") || l.includes("gluteo")) return "quadril";
  if (l.includes("mão") || l.includes("mao") || l.includes("punho") || l.includes("dedo") || l.includes("carpo")) return "mao";
  if (l.includes("respir") || l.includes("pulm") || l.includes("torác")) return "respiratorio";
  return null;
}

export interface ExerciseRecommendationResult {
  recommended: Exercise[];
  reasons: string[];
  contextUsed: boolean;
  totalAvailable: number;
}

export function useExerciseRecommendations(
  context: ClinicalContext | null,
  allExercises: Exercise[]
): ExerciseRecommendationResult {
  return useMemo(() => {
    if (!context) {
      return {
        recommended: allExercises,
        reasons: [],
        contextUsed: false,
        totalAvailable: allExercises.length,
      };
    }

    const { clinicalFlags, latestEvaluation, evolutionSummary } = context;
    let filtered = [...allExercises];
    const reasons: string[] = [];

    // Rule 1: acute phase or high pain → iniciante only (low intensity)
    if (clinicalFlags.isAcute || clinicalFlags.highPain) {
      filtered = filtered.filter((e) => e.difficulty === "iniciante");
      reasons.push(
        clinicalFlags.highPain
          ? `Dor alta (${latestEvaluation?.pain_level ?? "??"}/10): exercícios de baixa intensidade`
          : "Fase aguda: exercícios de baixa intensidade"
      );
    }
    // Rule 2: chronic with moderate pain → all difficulties allowed (no filter)
    // (not filtering on isChronic alone — just note it in reasons)

    // Rule 3: filter by pain location → match exercise category
    if (latestEvaluation?.pain_location) {
      const cat = mapLocationToCategory(latestEvaluation.pain_location);
      if (cat) {
        const locationFiltered = filtered.filter((e) => e.category === cat);
        if (locationFiltered.length >= 3) {
          filtered = locationFiltered;
          reasons.push(`Região: ${latestEvaluation.pain_location}`);
        }
      }
    }

    // Rule 4: not improving — add advisory note (no filtering)
    if (clinicalFlags.notImproving && evolutionSummary.proceduresUsed.length > 0) {
      reasons.push("Sem melhora nas últimas sessões: considere variar a abordagem");
    }

    return {
      recommended: filtered.slice(0, 12),
      reasons,
      contextUsed: true,
      totalAvailable: allExercises.length,
    };
  }, [context, allExercises]);
}
