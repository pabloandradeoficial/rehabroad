import { describe, it, expect } from "vitest";
import {
  computePhase,
  computeTrend,
  computeSeverity,
  computeTreatmentStatus,
  type EvolutionPoint,
  type InitialEvalPoint,
} from "./clinical-engine";

const days = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

describe("computePhase", () => {
  it("classifies as agudo when latest eval is within 7 days", () => {
    const p = computePhase({ pain_level: 5, created_at: days(3) }, []);
    expect(p.isAcute).toBe(true);
    expect(p.label).toBe("agudo");
  });

  it("classifies as subagudo at 14 days", () => {
    const p = computePhase({ pain_level: 5, created_at: days(14) }, []);
    expect(p.isSubacute).toBe(true);
    expect(p.label).toBe("subagudo");
  });

  it("classifies as crônico past 21 days", () => {
    const p = computePhase({ pain_level: 5, created_at: days(45) }, []);
    expect(p.isChronic).toBe(true);
    expect(p.label).toBe("crônico");
  });

  it("falls back to first evolution date when no evaluation", () => {
    const evos: EvolutionPoint[] = [{ pain_level: 5, session_date: days(30) }];
    const p = computePhase(null, evos);
    expect(p.isChronic).toBe(true);
  });

  it("returns days=0 (acute) when no reference at all", () => {
    const p = computePhase(null, []);
    expect(p.daysSince).toBe(0);
    expect(p.isAcute).toBe(true);
  });
});

describe("computeTrend", () => {
  const eval0 = (pain: number): InitialEvalPoint => ({ pain_level: pain });

  it("uses last3-vs-first3 when 3+ evolutions exist", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 8 }, { pain_level: 7 }, { pain_level: 7 },
      { pain_level: 5 }, { pain_level: 4 }, { pain_level: 3 },
    ];
    const t = computeTrend(eval0(8), evos);
    expect(t.direction).toBe("improving");
    expect(t.basis).toBe("last3-vs-first3");
    expect(t.initial).toBe(7.3);
    expect(t.current).toBe(4);
  });

  it("declares stable when delta < 1.5 EVA", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 6 }, { pain_level: 6 }, { pain_level: 5 },
      { pain_level: 5 }, { pain_level: 6 }, { pain_level: 5 },
    ];
    const t = computeTrend(eval0(6), evos);
    expect(t.direction).toBe("stable");
  });

  it("declares worsening when last3 avg > first3 avg by 1.5+", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 4 }, { pain_level: 4 }, { pain_level: 4 },
      { pain_level: 6 }, { pain_level: 7 }, { pain_level: 7 },
    ];
    const t = computeTrend(eval0(4), evos);
    expect(t.direction).toBe("worsening");
  });

  it("falls back to current-vs-initial when fewer than 3 evolutions", () => {
    const evos: EvolutionPoint[] = [{ pain_level: 5 }, { pain_level: 4 }];
    const t = computeTrend(eval0(8), evos);
    expect(t.basis).toBe("current-vs-initial");
    expect(t.direction).toBe("improving");
    expect(t.changePercent).toBe(50);
  });

  it("returns unknown direction with single point", () => {
    const t = computeTrend(eval0(7), []);
    expect(t.direction).toBe("unknown");
    expect(t.basis).toBe("single-point");
  });

  it("returns no-data when no evaluation and no evolutions", () => {
    const t = computeTrend(null, []);
    expect(t.direction).toBe("unknown");
    expect(t.basis).toBe("no-data");
  });
});

describe("computeSeverity", () => {
  const acutePhase = computePhase({ pain_level: 0, created_at: days(2) }, []);
  const chronicPhase = computePhase({ pain_level: 0, created_at: days(45) }, []);
  const stableTrend = computeTrend({ pain_level: 5 }, [{ pain_level: 5 }]);
  const improvingTrend = computeTrend({ pain_level: 8 }, [
    { pain_level: 8 }, { pain_level: 7 }, { pain_level: 6 },
    { pain_level: 5 }, { pain_level: 4 }, { pain_level: 3 },
  ]);
  const worseningTrend = computeTrend({ pain_level: 4 }, [
    { pain_level: 4 }, { pain_level: 4 }, { pain_level: 4 },
    { pain_level: 7 }, { pain_level: 7 }, { pain_level: 8 },
  ]);

  it("buckets EVA correctly", () => {
    expect(computeSeverity(0, stableTrend, acutePhase, null).level).toBe("none");
    expect(computeSeverity(2, stableTrend, acutePhase, null).level).toBe("low");
    expect(computeSeverity(5, stableTrend, acutePhase, null).level).toBe("moderate");
    expect(computeSeverity(8, stableTrend, acutePhase, null).level).toBe("high");
  });

  it("escalates to urgent when high pain + acute + worsening", () => {
    const s = computeSeverity(8, worseningTrend, acutePhase, null);
    expect(s.urgency).toBe("urgent");
    expect(s.modifiers).toContain("agudo + piora");
  });

  it("escalates to urgent when high pain + chronic + not improving", () => {
    const s = computeSeverity(8, stableTrend, chronicPhase, null);
    expect(s.urgency).toBe("urgent");
    expect(s.modifiers).toContain("crônico sem melhora");
  });

  it("de-escalates concern→watch on rapid improvement (≥30%)", () => {
    const s = computeSeverity(7, improvingTrend, chronicPhase, null);
    // Without improvement, concern. With ≥30% improvement, watch.
    expect(s.urgency).toBe("watch");
    expect(s.modifiers.some((m) => m.startsWith("melhora"))).toBe(true);
  });

  it("bumps urgency when functional limitation reported", () => {
    const s = computeSeverity(2, stableTrend, chronicPhase, "limitado para AVDs");
    // EVA 2 → low → info; functional bump → watch
    expect(s.urgency).toBe("watch");
    expect(s.modifiers).toContain("limitação funcional");
  });

  it("accepts the new structured context object (backwards compat with bare string)", () => {
    const sStr = computeSeverity(2, stableTrend, chronicPhase, "limitado");
    const sObj = computeSeverity(2, stableTrend, chronicPhase, { functionalStatus: "limitado" });
    expect(sStr.urgency).toBe(sObj.urgency);
    expect(sStr.modifiers).toEqual(sObj.modifiers);
  });

  it("AGE: bumps urgency for elderly (>=65) with moderate pain in acute phase", () => {
    // Use acute phase so the second elderly rule (chronic+stable→urgent)
    // doesn't fire — we want to test only the first bump (watch→concern).
    const s = computeSeverity(5, stableTrend, acutePhase, { age: 72 });
    expect(s.urgency).toBe("concern");
    expect(s.modifiers.some((m) => m.includes("idoso"))).toBe(true);
  });

  it("AGE: ignores elderly bump when pain is low (no escalation)", () => {
    const s = computeSeverity(2, stableTrend, chronicPhase, { age: 80 });
    // EVA 2 → low → info; no idoso bump (only triggers for moderate+).
    expect(s.urgency).toBe("info");
  });

  it("AGE: elderly + chronic + not improving → urgent (functional decline risk)", () => {
    const s = computeSeverity(7, stableTrend, chronicPhase, { age: 75 });
    expect(s.urgency).toBe("urgent");
  });

  it("AGE: young patient with same EVA does NOT get the elderly bump", () => {
    const s = computeSeverity(5, stableTrend, chronicPhase, { age: 28 });
    // EVA 5 → moderate → watch. Young → no bump → stays watch.
    expect(s.urgency).toBe("watch");
    expect(s.modifiers.some((m) => m.includes("idoso"))).toBe(false);
  });
});

describe("computeTreatmentStatus", () => {
  const eval0 = (p: number): InitialEvalPoint => ({ pain_level: p });

  it("returns pending when no evaluation", () => {
    const trend = computeTrend(null, []);
    const phase = computePhase(null, []);
    const sev = computeSeverity(null, trend, phase, null);
    const s = computeTreatmentStatus(trend, sev, 0, false);
    expect(s.status).toBe("pending");
  });

  it("returns green for clear improvement", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 8 }, { pain_level: 7 }, { pain_level: 6 },
      { pain_level: 4 }, { pain_level: 3 }, { pain_level: 2 },
    ];
    const trend = computeTrend(eval0(8), evos);
    const phase = computePhase(eval0(8), evos);
    const sev = computeSeverity(2, trend, phase, null);
    const s = computeTreatmentStatus(trend, sev, evos.length, true);
    expect(s.status).toBe("green");
  });

  it("returns yellow for slow improvement (<30% reduction)", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 7 }, { pain_level: 7 }, { pain_level: 7 },
      { pain_level: 6 }, { pain_level: 6 }, { pain_level: 5 },
    ];
    const trend = computeTrend(eval0(7), evos);
    const phase = computePhase(eval0(7), evos);
    const sev = computeSeverity(5, trend, phase, null);
    const s = computeTreatmentStatus(trend, sev, evos.length, true);
    // 7→5.7 ≈ 19% reduction, current=5.7 (>3) → yellow
    expect(s.status).toBe("yellow");
  });

  it("returns red when worsening AND high pain", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 5 }, { pain_level: 5 }, { pain_level: 6 },
      { pain_level: 7 }, { pain_level: 8 }, { pain_level: 8 },
    ];
    const trend = computeTrend(eval0(5), evos);
    const phase = computePhase(eval0(5), evos);
    const sev = computeSeverity(8, trend, phase, null);
    const s = computeTreatmentStatus(trend, sev, evos.length, true);
    expect(s.status).toBe("red");
  });

  it("returns red when stable but high pain (estagnação intensa)", () => {
    const evos: EvolutionPoint[] = [
      { pain_level: 8 }, { pain_level: 8 }, { pain_level: 8 },
      { pain_level: 8 }, { pain_level: 7 }, { pain_level: 8 },
    ];
    const trend = computeTrend(eval0(8), evos);
    const phase = computePhase(eval0(8), evos);
    const sev = computeSeverity(8, trend, phase, null);
    const s = computeTreatmentStatus(trend, sev, evos.length, true);
    expect(s.status).toBe("red");
  });

  it("CONTRADICTION REGRESSION: same patient yields one verdict, not three", () => {
    // The bug we fixed: patient 8→5 in 4 sessions used to be "Evolução Positiva"
    // in suporte, "Atenção evolução lenta" in alertas, and silent in clinical-context.
    // Now: single source of truth.
    const evos: EvolutionPoint[] = [
      { pain_level: 8 }, { pain_level: 7 }, { pain_level: 6 }, { pain_level: 5 },
    ];
    const trend = computeTrend(eval0(8), evos);
    const phase = computePhase(eval0(8), evos);
    const sev = computeSeverity(5, trend, phase, null);
    const status = computeTreatmentStatus(trend, sev, evos.length, true);

    // Sanity: all three views derive from the same trend object.
    expect(trend.direction).toBe("improving");
    expect(trend.changePercent).toBeGreaterThanOrEqual(30);
    expect(status.status).toBe("green");
    // No way for another surface to disagree — they all read this same `trend`.
  });
});
