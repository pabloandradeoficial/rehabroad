import { Hono } from "hono";
import { authMiddleware } from "../lib/helpers";

export const scribeRouter = new Hono<{ Bindings: Env }>();

scribeRouter.post("/transcribe", authMiddleware, async (c) => {
  const user = c.get("user" as never) as { id: string };
  const userId = user.id;
  const db = c.env.DB;

  const body = await c.req.json<{
    audioBase64: string;
    audioMimeType?: string;
    patientId?: number;
  }>();

  if (!body.audioBase64) {
    return c.json({ error: "Áudio obrigatório" }, 400);
  }

  // ── 1. Transcribe with Whisper ──
  const audioBuffer = Uint8Array.from(atob(body.audioBase64), (ch) =>
    ch.charCodeAt(0)
  );
  const mimeType = body.audioMimeType ?? "audio/webm";
  const ext = mimeType.split("/")[1]?.split(";")[0]?.trim() ?? "webm";
  const audioBlob = new Blob([audioBuffer], { type: mimeType });

  const formData = new FormData();
  formData.append("file", audioBlob, `audio.${ext}`);
  formData.append("model", "whisper-1");
  formData.append("language", "pt");
  formData.append("response_format", "text");

  const whisperRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${c.env.OPENAI_API_KEY}` },
      body: formData,
    }
  );

  if (!whisperRes.ok) {
    const errText = await whisperRes.text();
    console.error("Whisper error:", errText);
    return c.json(
      { error: "Erro ao transcrever áudio. Tente novamente." },
      500
    );
  }

  const transcription = await whisperRes.text();

  // ── 2. Patient clinical context ──
  let patientContext = "";
  if (body.patientId) {
    const patient = await db
      .prepare(
        `SELECT p.name, e.chief_complaint, e.pain_location
         FROM patients p
         LEFT JOIN evaluations e ON e.patient_id = p.id
         WHERE p.id = ? AND p.user_id = ?
         ORDER BY e.created_at DESC LIMIT 1`
      )
      .bind(body.patientId, userId)
      .first<{
        name: string;
        chief_complaint: string | null;
        pain_location: string | null;
      }>();

    if (patient) {
      patientContext = [
        `Paciente: ${patient.name}`,
        patient.chief_complaint ? `Queixa: ${patient.chief_complaint}` : null,
        patient.pain_location ? `Região: ${patient.pain_location}` : null,
      ]
        .filter(Boolean)
        .join(" | ");
    }
  }

  // ── 3. Extract fields with GPT-4o-mini ──
  const extractRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Você é um assistente clínico especializado em fisioterapia.
Extraia informações de um relato verbal de sessão fisioterapêutica e retorne APENAS um JSON válido com estes campos:

{
  "pain_level": número de 0 a 10 (null se não mencionado),
  "functional_status": string descrevendo status funcional (null se não mencionado),
  "procedures": string descrevendo procedimentos realizados na sessão (null se não mencionado),
  "patient_response": "positive" | "negative" | "neutral" (baseado na resposta descrita, null se não mencionado),
  "observations": string com observações gerais e plano para próxima sessão (null se não mencionado),
  "attendance_status": "attended"
}
${patientContext ? `\nContexto do paciente: ${patientContext}` : ""}`,
        },
        {
          role: "user",
          content: `Relato da sessão: "${transcription}"`,
        },
      ],
    }),
  });

  if (!extractRes.ok) {
    return c.json({
      transcription,
      extracted: null,
      warning:
        "Transcrição feita mas não foi possível extrair campos automaticamente.",
    });
  }

  const extractData = await extractRes.json<{
    choices: { message: { content: string } }[];
  }>();

  type Extracted = {
    pain_level: number | null;
    functional_status: string | null;
    procedures: string | null;
    patient_response: "positive" | "negative" | "neutral" | null;
    observations: string | null;
    attendance_status: string;
  };

  let extracted: Extracted | null = null;
  try {
    const content = extractData.choices[0]?.message?.content ?? "";
    extracted = JSON.parse(
      content.replace(/```json\n?|\n?```/g, "").trim()
    ) as Extracted;
  } catch {
    // Return transcription even if extraction fails
  }

  return c.json({ transcription, extracted });
});
