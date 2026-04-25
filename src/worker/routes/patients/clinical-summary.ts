/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hono } from "hono";
import { authMiddleware } from "../../lib/helpers";

// ============================================
// CLINICAL SUMMARY API
// ============================================

export function registerClinicalSummaryRoutes(router: Hono<{ Bindings: Env }>) {
  router.get("/patients/:patientId/clinical-summary", authMiddleware, async (c) => {
    const user = c.get("user");
    const patientId = c.req.param("patientId");

    const patient = await c.env.DB.prepare(
      `SELECT * FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user!.id).first() as any;

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const { results: evaluations } = await c.env.DB.prepare(
      `SELECT * FROM evaluations WHERE patient_id = ? ORDER BY created_at ASC`
    ).bind(patientId).all<{
      type: string;
      pain_level: number | null;
      pain_location: string | null;
      chief_complaint: string | null;
      created_at: string;
    }>();

    const { results: evolutions } = await c.env.DB.prepare(
      `SELECT * FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
    ).bind(patientId).all<{
      pain_level: number | null;
      patient_response: string | null;
      session_date: string;
    }>();

    const caminho = await c.env.DB.prepare(
      `SELECT * FROM caminho WHERE patient_id = ?`
    ).bind(patientId).first<{
      pain_pattern: string | null;
      red_flags: string | null;
      treatment_goals: string | null;
    }>();

    const initialEval = evaluations.find((e: any) => e.type === "initial") as any;
    const lastEvolution = evolutions.length > 0 ? evolutions[evolutions.length - 1] as any : null;

    const initialPain = initialEval?.pain_level ?? null;
    const currentPain = lastEvolution?.pain_level ?? initialPain;
    const painChange = initialPain !== null && currentPain !== null ? initialPain - currentPain : null;

    const firstDate = initialEval?.created_at || patient.created_at;
    const daysSinceStart = Math.floor(
      (Date.now() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    let responsePattern: "positive" | "neutral" | "negative" | "mixed" | null = null;
    if (evolutions.length > 0) {
      const responses = evolutions.map((e: any) => e.patient_response).filter(Boolean);
      const positiveCount = responses.filter((r: string) => r === "positive").length;
      const negativeCount = responses.filter((r: string) => r === "negative").length;
      const neutralCount = responses.filter((r: string) => r === "neutral").length;

      if (responses.length > 0) {
        if (positiveCount > negativeCount && positiveCount > neutralCount) {
          responsePattern = "positive";
        } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
          responsePattern = "negative";
        } else if (positiveCount > 0 && negativeCount > 0) {
          responsePattern = "mixed";
        } else {
          responsePattern = "neutral";
        }
      }
    }

    const highlights: { type: "positive" | "neutral" | "warning" | "critical"; text: string }[] = [];

    if (painChange !== null) {
      if (painChange >= 3) {
        highlights.push({ type: "positive", text: `Redução significativa de dor: ${painChange} pontos` });
      } else if (painChange > 0) {
        highlights.push({ type: "positive", text: `Melhora na dor: ${painChange} ponto${painChange > 1 ? "s" : ""}` });
      } else if (painChange < 0) {
        highlights.push({ type: "warning", text: `Aumento de dor: ${Math.abs(painChange)} ponto${Math.abs(painChange) > 1 ? "s" : ""}` });
      }
    }

    if (currentPain !== null) {
      if (currentPain >= 7) {
        highlights.push({ type: "critical", text: `Dor intensa atual: ${currentPain}/10` });
      } else if (currentPain <= 3 && currentPain > 0) {
        highlights.push({ type: "positive", text: `Dor controlada: ${currentPain}/10` });
      } else if (currentPain === 0) {
        highlights.push({ type: "positive", text: "Paciente sem dor" });
      }
    }

    if (responsePattern === "positive") {
      highlights.push({ type: "positive", text: "Resposta predominantemente positiva às sessões" });
    } else if (responsePattern === "negative") {
      highlights.push({ type: "warning", text: "Resposta negativa frequente - considerar ajuste" });
    }

    if (caminho?.red_flags) {
      highlights.push({ type: "critical", text: "Red flags identificados no Caminho Clínico" });
    }

    if (evolutions.length === 0 && evaluations.length > 0 && daysSinceStart > 7) {
      highlights.push({ type: "warning", text: `${daysSinceStart} dias sem registro de evolução` });
    }

    let summaryText = "";
    if (!initialEval) {
      summaryText = "Paciente cadastrado, aguardando avaliação inicial para início do acompanhamento clínico estruturado.";
    } else if (evolutions.length === 0) {
      summaryText = `Avaliação inicial registrada com queixa de "${initialEval.chief_complaint || "não especificada"}". Dor inicial: ${initialPain ?? "não informada"}/10. Aguardando registro de sessões de evolução para análise de progressão.`;
    } else {
      const sessions = evolutions.length;
      const painStatus = currentPain !== null
        ? currentPain <= 3 ? "controlada" : currentPain >= 7 ? "intensa" : "moderada"
        : "não avaliada";

      summaryText = `Paciente com ${sessions} ${sessions === 1 ? "sessão" : "sessões"} de tratamento em ${daysSinceStart} dias. `;

      if (painChange !== null && painChange > 0) {
        summaryText += `Apresenta evolução positiva com redução de ${painChange} pontos na escala de dor. `;
      } else if (painChange !== null && painChange < 0) {
        summaryText += `Atenção: aumento de ${Math.abs(painChange)} pontos na dor desde avaliação inicial. `;
      }

      summaryText += `Dor atual ${painStatus}${currentPain !== null ? ` (${currentPain}/10)` : ""}. `;

      if (responsePattern === "positive") {
        summaryText += "Boa resposta ao tratamento nas últimas sessões.";
      } else if (responsePattern === "mixed") {
        summaryText += "Resposta variável - monitorar padrão nas próximas sessões.";
      } else if (responsePattern === "negative") {
        summaryText += "Considerar reavaliação do plano terapêutico.";
      }
    }

    const recommendations: string[] = [];

    if (!initialEval) {
      recommendations.push("Realizar avaliação inicial completa");
    }

    if (evolutions.length === 0 && initialEval) {
      recommendations.push("Registrar primeira sessão de evolução");
    }

    if (currentPain !== null && currentPain >= 7) {
      recommendations.push("Priorizar manejo da dor com TENS ou crioterapia");
      recommendations.push("Considerar ajuste de carga nos exercícios");
    }

    if (painChange !== null && painChange < 0) {
      recommendations.push("Reavaliar abordagem terapêutica");
      recommendations.push("Investigar possíveis fatores de piora");
    }

    if (caminho?.treatment_goals) {
      recommendations.push("Revisar progresso em relação aos objetivos definidos");
    }

    if (!caminho && initialEval) {
      recommendations.push("Completar documentação no módulo Caminho Clínico");
    }

    if (evolutions.length >= 5 && painChange !== null && painChange >= 3) {
      recommendations.push("Considerar critérios para alta ou manutenção");
    }

    return c.json({
      patientId: patient.id,
      patientName: patient.name,
      summaryText,
      highlights,
      metrics: {
        currentPain,
        initialPain,
        painChange,
        sessionsCount: evolutions.length,
        daysSinceStart,
        lastSessionDate: lastEvolution?.session_date || null,
        responsePattern
      },
      recommendations
    });
  });

  // GET /api/patients/:id/progress
  router.get("/patients/:id/progress", authMiddleware, async (c) => {
    const user = c.get("user" as never) as { id: string };
    const patientId = c.req.param("id");

    const patient = await c.env.DB.prepare(
      `SELECT id, name FROM patients WHERE id = ? AND user_id = ?`
    ).bind(patientId, user.id).first<{ id: number; name: string }>();

    if (!patient) return c.json({ error: "Patient not found" }, 404);

    const { results: evolutions } = await c.env.DB.prepare(
      `SELECT pain_level, patient_response, session_date, functional_status, procedures
       FROM evolutions WHERE patient_id = ? ORDER BY session_date ASC`
    ).bind(patientId).all<{
      pain_level: number | null;
      patient_response: string | null;
      session_date: string;
      functional_status: string | null;
      procedures: string | null;
    }>();

    const responseToScore = (r: string | null): number | null => {
      if (!r) return null;
      const map: Record<string, number> = {
        positive: 8, improving: 8,
        neutral: 5, stable: 5,
        negative: 2, worsening: 2,
      };
      return map[r] ?? null;
    };

    const painTimeline = evolutions
      .filter((e) => e.pain_level !== null)
      .map((e, i) => ({
        session: i + 1,
        date: e.session_date,
        pain: e.pain_level as number,
      }));

    const functionalTimeline = evolutions
      .map((e, i) => {
        const score = responseToScore(e.patient_response);
        if (score === null) return null;
        return { session: i + 1, date: e.session_date, score };
      })
      .filter(Boolean) as { session: number; date: string; score: number }[];

    const painLevels = evolutions.filter((e) => e.pain_level !== null).map((e) => e.pain_level as number);
    const initialPain = painLevels[0] ?? null;
    const currentPain = painLevels[painLevels.length - 1] ?? null;
    const painChange = initialPain !== null && currentPain !== null ? initialPain - currentPain : null;

    const avgPain = painLevels.length > 0
      ? Math.round((painLevels.reduce((a, b) => a + b, 0) / painLevels.length) * 10) / 10
      : null;

    const positiveCount = evolutions.filter((e) => e.patient_response === "positive" || e.patient_response === "improving").length;
    const positiveRate = evolutions.length > 0 ? Math.round((positiveCount / evolutions.length) * 100) : null;

    const milestones: { label: string; date: string; type: "start" | "improvement" | "goal" | "warning" }[] = [];

    if (evolutions.length > 0) {
      milestones.push({ label: "Início do tratamento", date: evolutions[0].session_date, type: "start" });
    }

    if (painChange !== null && painChange >= 3 && evolutions.length >= 3) {
      const idx = painLevels.findIndex((p, i) => i > 0 && (painLevels[0] - p) >= 3);
      if (idx >= 0) {
        milestones.push({ label: `Redução significativa da dor (-${painChange} pts)`, date: evolutions[idx].session_date, type: "improvement" });
      }
    }

    if (evolutions.length >= 5) {
      milestones.push({ label: "5ª sessão concluída", date: evolutions[4].session_date, type: "goal" });
    }
    if (evolutions.length >= 10) {
      milestones.push({ label: "10ª sessão concluída", date: evolutions[9].session_date, type: "goal" });
    }

    const last3 = evolutions.slice(-3);
    const allNegative = last3.length >= 3 && last3.every((e) => e.patient_response === "negative" || e.patient_response === "worsening");
    if (allNegative) {
      milestones.push({ label: "3 sessões consecutivas negativas", date: last3[last3.length - 1].session_date, type: "warning" });
    }

    if (currentPain !== null && currentPain <= 2 && evolutions.length >= 3) {
      milestones.push({ label: "Dor controlada (≤2/10)", date: evolutions[evolutions.length - 1].session_date, type: "goal" });
    }

    return c.json({
      patientId: patient.id,
      patientName: patient.name,
      painTimeline,
      functionalTimeline,
      summary: {
        totalSessions: evolutions.length,
        initialPain,
        currentPain,
        painChange,
        avgPain,
        positiveRate,
      },
      milestones,
    });
  });
}
