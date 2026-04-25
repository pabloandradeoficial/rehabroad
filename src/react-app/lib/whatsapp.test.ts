import { describe, it, expect } from "vitest";
import {
  formatPhoneForWhatsApp,
  createWhatsAppLink,
  createReminderMessage,
  createContactMessage,
  createExercisePrescriptionMessage,
} from "./whatsapp";

describe("formatPhoneForWhatsApp", () => {
  it("strips parentheses, dashes, and spaces", () => {
    expect(formatPhoneForWhatsApp("(11) 98765-4321")).toBe("5511987654321");
  });

  it("drops a leading 0", () => {
    expect(formatPhoneForWhatsApp("011 98765-4321")).toBe("5511987654321");
  });

  it("adds country code 55 when length <= 11", () => {
    expect(formatPhoneForWhatsApp("11987654321")).toBe("5511987654321");
  });

  it("does not double-prepend 55 when number already starts with it", () => {
    // 55 + 11 + 9-digit = 13 chars, exceeds 11, so leaves as-is
    expect(formatPhoneForWhatsApp("5511987654321")).toBe("5511987654321");
  });

  it("returns digits only when input has letters or symbols", () => {
    expect(formatPhoneForWhatsApp("+55 (11) abc 9-8765-4321")).toBe("5511987654321");
  });
});

describe("createWhatsAppLink", () => {
  it("URL-encodes the message", () => {
    const link = createWhatsAppLink("11987654321", "Olá, tudo bem?");
    expect(link).toBe("https://wa.me/5511987654321?text=Ol%C3%A1%2C%20tudo%20bem%3F");
  });

  it("encodes line breaks", () => {
    const link = createWhatsAppLink("11987654321", "linha 1\nlinha 2");
    expect(link).toContain("linha%201%0Alinha%202");
  });
});

describe("createReminderMessage", () => {
  it("greets the patient by name", () => {
    const msg = createReminderMessage("Maria", "Dr. João");
    expect(msg).toContain("Olá, Maria!");
  });

  it("includes the professional name in the signature", () => {
    const msg = createReminderMessage("Maria", "Dr. João");
    expect(msg).toContain("Att,\nDr. João");
  });

  it("falls back to followup wording when no date or custom message", () => {
    const msg = createReminderMessage("Maria", "Dr. João");
    expect(msg).toContain("faz um tempo");
  });

  it("includes appointment date and time when provided", () => {
    const msg = createReminderMessage("Maria", "Dr. João", "20/04/2026", "14:30");
    expect(msg).toContain("📅 *Data:* 20/04/2026");
    expect(msg).toContain("🕐 *Horário:* 14:30");
  });

  it("uses custom message when provided, ignoring date/time", () => {
    const msg = createReminderMessage("Maria", "Dr. João", undefined, undefined, "Mensagem personalizada");
    expect(msg).toContain("Mensagem personalizada");
    expect(msg).not.toContain("📅 *Data:*");
  });

  it("detects and handles the legacy call signature (date as 2nd arg)", () => {
    // Old signature: createReminderMessage(patientName, appointmentDate, appointmentTime, "appointment")
    const msg = createReminderMessage("Maria", "20/04/2026", "14:30", "appointment");
    expect(msg).toContain("📅 *Data:* 20/04/2026");
    expect(msg).toContain("🕐 *Horário:* 14:30");
    expect(msg).toContain("Att,\nEquipe RehabRoad");
  });
});

describe("createContactMessage", () => {
  it("greets the patient by name and identifies the professional", () => {
    const msg = createContactMessage("Maria", "Dr. João");
    expect(msg).toContain("Olá, Maria!");
    expect(msg).toContain("Aqui é Dr. João");
  });

  it("uses custom message when provided", () => {
    const msg = createContactMessage("Maria", "Dr. João", "Conteúdo customizado");
    expect(msg).toContain("Conteúdo customizado");
    expect(msg).not.toContain("Aqui é Dr. João");
  });
});

describe("createExercisePrescriptionMessage", () => {
  it("includes patient and professional names in header", () => {
    const msg = createExercisePrescriptionMessage("Maria", "Dr. João", []);
    expect(msg).toContain("👤 *Paciente:* Maria");
    expect(msg).toContain("👨‍⚕️ *Profissional:* Dr. João");
  });

  it("formats sets x reps when both provided", () => {
    const msg = createExercisePrescriptionMessage("Maria", "Dr. João", [
      { name: "Agachamento", sets: 3, reps: "12" },
    ]);
    expect(msg).toContain("*1. Agachamento*");
    expect(msg).toContain("📊 3x de 12");
  });

  it("includes notes section when provided", () => {
    const msg = createExercisePrescriptionMessage("Maria", "Dr. João", [], "Manter respiração");
    expect(msg).toContain("📌 *Observações:*");
    expect(msg).toContain("Manter respiração");
  });

  it("omits sets/reps line when only one of them is set", () => {
    const msg = createExercisePrescriptionMessage("Maria", "Dr. João", [
      { name: "Alongamento", sets: 3 },
    ]);
    expect(msg).not.toContain("📊");
  });
});
