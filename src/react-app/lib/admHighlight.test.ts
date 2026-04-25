import { describe, it, expect } from "vitest";
import { getADMStatus } from "./admHighlight";

describe("getADMStatus", () => {
  describe("standard joint movements", () => {
    it("returns 'normal' when value is at or above 75% of max", () => {
      // shoulder flexion max = 180, 75% = 135
      expect(getADMStatus(180, "flexão ombro")).toBe("normal");
      expect(getADMStatus(140, "flexão ombro")).toBe("normal");
    });

    it("returns 'warning' when value is between 50% and 75% of max", () => {
      // shoulder flexion max = 180, 50% = 90, 75% = 135
      expect(getADMStatus(120, "flexão ombro")).toBe("warning");
      expect(getADMStatus(100, "flexão ombro")).toBe("warning");
    });

    it("returns 'critical' when value is below 50% of max", () => {
      // shoulder flexion max = 180, 50% = 90
      expect(getADMStatus(80, "flexão ombro")).toBe("critical");
      expect(getADMStatus(40, "flexão ombro")).toBe("critical");
    });
  });

  describe("knee flexion thresholds", () => {
    it("classifies knee flexion correctly", () => {
      // knee flexion max = 140, 75% = 105, 50% = 70
      expect(getADMStatus(140, "flexão joelho")).toBe("normal");
      expect(getADMStatus(110, "flexão joelho")).toBe("normal");
      expect(getADMStatus(90, "flexão joelho")).toBe("warning");
      expect(getADMStatus(60, "flexão joelho")).toBe("critical");
    });
  });

  describe("extension movements with max <= 0", () => {
    it("flags critical when extension lag > 10°", () => {
      // knee extension expects ~0°
      expect(getADMStatus(15, "extensão joelho")).toBe("critical");
    });

    it("flags warning when extension lag is 6-10°", () => {
      expect(getADMStatus(8, "extensão joelho")).toBe("warning");
    });

    it("flags normal when extension lag is 0-5°", () => {
      expect(getADMStatus(3, "extensão joelho")).toBe("normal");
      expect(getADMStatus(0, "extensão joelho")).toBe("normal");
    });
  });

  describe("unknown context", () => {
    it("returns 'normal' when no reference matches", () => {
      expect(getADMStatus(50, "movimento inexistente")).toBe("normal");
    });
  });

  describe("partial keyword matching", () => {
    it("falls back to first matching reference when only the movement keyword is present", () => {
      // 'flexão' substring appears in 'flexão ombro' (max 180) — first match wins.
      // 75% of 180 = 135, 50% of 180 = 90.
      expect(getADMStatus(140, "flexão")).toBe("normal");
      expect(getADMStatus(120, "flexão")).toBe("warning");
      expect(getADMStatus(70, "flexão")).toBe("critical");
    });
  });
});
