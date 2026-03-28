import { Hono } from "hono";
import { optionalAuthMiddleware } from "../lib/helpers";

export const studentAnamneseRouter = new Hono<{ Bindings: Env }>();

// ── POST /api/student/anamnese/start ──────────────────────────────────────────
// Initialize a new anamnese session. Returns the patient profile.

studentAnamneseRouter.post("/anamnese/start", optionalAuthMiddleware, async (c) => {
  const { area, dificuldade } = await c.req.json<{
    area?: string;
    dificuldade?: string;
  }>();

  const selectedArea = area || "ortopedia";
  const selectedDificuldade = dificuldade || "intermediario";

  const systemPrompt = `Você é um gerador de perfis de pacientes para simulação de anamnese em fisioterapia. Responda SOMENTE com JSON válido.`;

  const userPrompt = `Crie um perfil de paciente para uma sessão de anamnese simulada.
Área: ${selectedArea}, Dificuldade: ${selectedDificuldade}.

JSON exato:
{
  "paciente": {
    "nome": "nome fictício",
    "idade": número,
    "sexo": "masculino" ou "feminino",
    "profissao": "profissão relevante"
  },
  "queixa_principal": "queixa principal em 1 frase do ponto de vista do paciente",
  "diagnostico_oculto": "diagnóstico que o estudante deve descobrir",
  "historia_oculta": "história completa do caso (NÃO revelar ao estudante diretamente)",
  "achados_para_revelar": {
    "inspecao": "achados visíveis",
    "palpacao": "achados à palpação",
    "amplitude": "limitações de ADM",
    "testes_positivos": ["teste1", "teste2"]
  },
  "dica_final": "dica clínica após revelação"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${c.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 600,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return c.json({ error: "Falha ao iniciar simulação" }, 500);
  }

  const aiData = await response.json() as {
    choices: { message: { content: string } }[];
  };

  try {
    const profile = JSON.parse(aiData.choices[0].message.content);
    return c.json({ profile }, 200);
  } catch {
    return c.json({ error: "Resposta inválida da IA" }, 500);
  }
});

// ── POST /api/student/anamnese/chat ───────────────────────────────────────────
// Continue a chat turn. The AI responds as the patient.
// After 5 exchanges, can_reveal becomes true.

studentAnamneseRouter.post("/anamnese/chat", optionalAuthMiddleware, async (c) => {
  const { profile, messages } = await c.req.json<{
    profile: {
      paciente: { nome: string; idade: number; sexo: string; profissao: string };
      queixa_principal: string;
      diagnostico_oculto: string;
      historia_oculta: string;
      achados_para_revelar: Record<string, unknown>;
      dica_final: string;
    };
    messages: { role: "student" | "patient"; content: string }[];
  }>();

  if (!profile || !messages) {
    return c.json({ error: "profile e messages são obrigatórios" }, 400);
  }

  const exchangeCount = messages.filter((m) => m.role === "student").length;
  const can_reveal = exchangeCount >= 5;

  const systemPrompt = `Você é ${profile.paciente.nome}, ${profile.paciente.idade} anos, ${profile.paciente.sexo}, ${profile.paciente.profissao}.
Você está sendo avaliado por um estudante de fisioterapia.
Sua queixa principal: "${profile.queixa_principal}"
Historia real (NÃO revelar diretamente): ${profile.historia_oculta}

REGRAS:
- Responda como paciente, na primeira pessoa, de forma natural e coloquial
- Revele informações gradualmente conforme perguntado
- NÃO mencione diagnóstico nem termos técnicos que o paciente não saberia
- Respostas curtas (2-4 frases máximo)
- Se perguntado algo não relevante, responda vagamente
- Demonstre emoções naturais (preocupação, alívio etc.)`;

  const openaiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "student" ? "user" as const : "assistant" as const,
      content: m.content,
    })),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${c.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    return c.json({ error: "Falha na resposta do paciente" }, 500);
  }

  const aiData = await response.json() as {
    choices: { message: { content: string } }[];
  };

  const patientResponse = aiData.choices[0].message.content;

  return c.json({
    response: patientResponse,
    exchange_count: exchangeCount + 1,
    can_reveal,
  }, 200);
});
