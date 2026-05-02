import { describe, it, expect } from "vitest";
import { parsePatientsResponse } from "./usePatients";

const samplePatient = {
  id: 1,
  user_id: "u1",
  name: "Pablo Miranda",
  birth_date: "1990-01-01",
  phone: null,
  email: null,
  notes: null,
  created_at: "2026-05-02T00:00:00Z",
  updated_at: "2026-05-02T00:00:00Z",
};

describe("parsePatientsResponse", () => {
  it("parses a bare array (legacy shape)", () => {
    const result = parsePatientsResponse([samplePatient]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pablo Miranda");
  });

  it("parses { patients: [...] } envelope (older shape)", () => {
    const result = parsePatientsResponse({ patients: [samplePatient] });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pablo Miranda");
  });

  it("REGRESSION: parses { data: [...], total, page } paginated envelope", () => {
    // Backend was migrated to paginated form when N+1 perf fix landed
    // (commit 5e75a9f). Old parser silently fell through to [], causing
    // patients to vanish from the UI after refresh — they were saved in
    // D1 but never rendered. This test guards against that drift.
    const result = parsePatientsResponse({
      data: [samplePatient],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Pablo Miranda");
  });

  it("returns [] for null/undefined", () => {
    expect(parsePatientsResponse(null)).toEqual([]);
    expect(parsePatientsResponse(undefined)).toEqual([]);
  });

  it("returns [] for unknown shape", () => {
    expect(parsePatientsResponse({ foo: "bar" })).toEqual([]);
  });

  it("filters out malformed items inside an envelope", () => {
    const result = parsePatientsResponse({
      data: [samplePatient, null, "garbage", { id: 2, name: "Maria", user_id: "u1" }],
    });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["Pablo Miranda", "Maria"]);
  });
});
