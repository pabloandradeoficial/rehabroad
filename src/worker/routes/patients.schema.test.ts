import { describe, it, expect } from "vitest";
import { patientSchema } from "./patients";

describe("patientSchema", () => {
  it("accepts minimal payload with only name", () => {
    const result = patientSchema.safeParse({ name: "Maria Silva" });
    expect(result.success).toBe(true);
  });

  it("accepts empty strings for optional fields (form leaves them blank)", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      birth_date: "",
      phone: "",
      email: "",
      notes: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid email", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed (non-empty) email", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name shorter than 2 chars", () => {
    const result = patientSchema.safeParse({ name: "X" });
    expect(result.success).toBe(false);
  });

  it("accepts null for optional fields", () => {
    const result = patientSchema.safeParse({
      name: "Maria Silva",
      birth_date: null,
      phone: null,
      email: null,
      notes: null,
    });
    expect(result.success).toBe(true);
  });
});
