import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
  birth_date: z.string().optional().nullable(),
  phone: z.string().max(20, "Telefone deve ter no máximo 20 caracteres").optional().nullable(),
  email: z.string().email("E-mail inválido").or(z.literal("")).optional().nullable(),
  notes: z.string().max(2000, "Notas devem ter no máximo 2000 caracteres").optional().nullable(),
});
