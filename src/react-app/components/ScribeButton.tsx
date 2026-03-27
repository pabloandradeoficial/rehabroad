import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { apiFetch } from "@/react-app/lib/api";
import { useToast } from "@/react-app/components/ui/microinteractions";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ScribeState = "idle" | "recording" | "processing" | "done" | "error";

export interface ScribeResult {
  transcription: string;
  extracted: {
    pain_level: number | null;
    functional_status: string | null;
    procedures: string | null;
    patient_response: "positive" | "negative" | "neutral" | null;
    observations: string | null;
    attendance_status: string;
  } | null;
  warning?: string;
}

interface ScribeButtonProps {
  patientId: number;
  onResult: (result: ScribeResult) => void;
}

// Fixed heights for waveform bars — avoids Math.random() on each render
const WAVE_HEIGHTS = [10, 22, 16, 30, 20, 28, 14, 26, 32, 18, 24, 12];

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ScribeButton({ patientId, onResult }: ScribeButtonProps) {
  const toast = useToast();
  const { isPremium } = useSubscription();

  const [state, setState] = useState<ScribeState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<ScribeResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Premium-only feature
  if (!isPremium) return null;

  // ── Timer ──
  const startTimer = useCallback(() => {
    setSeconds(0);
    timerRef.current = setInterval(
      () => setSeconds((s) => s + 1),
      1000
    );
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-stop at 3 minutes
  useEffect(() => {
    if (seconds >= 180 && state === "recording") {
      stopRecording();
    }
  }, [seconds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      mediaRecorderRef.current?.stop();
    };
  }, [stopTimer]);

  // ── processAudio ──
  const processAudio = useCallback(
    async (blob: Blob) => {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (blob.size > MAX_SIZE) {
        toast.showError("Áudio muito longo. Máximo 5 minutos.");
        setState("idle");
        return;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            resolve(dataUrl.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const res = await apiFetch("/api/scribe/transcribe", {
          method: "POST",
          body: JSON.stringify({
            audioBase64: base64,
            audioMimeType: blob.type || "audio/webm",
            patientId,
          }),
        });

        if (!res.ok) {
          throw new Error("API error");
        }

        const data = await res.json() as ScribeResult;
        setResult(data);
        setState("done");
        onResult(data);
      } catch {
        toast.showError("Erro ao processar áudio. Tente novamente.");
        setState("error");
      }
    },
    [patientId, onResult, toast]
  );

  // ── startRecording ──
  const startRecording = useCallback(async () => {
    if (typeof MediaRecorder === "undefined") {
      toast.showError(
        "Seu navegador não suporta gravação. Use Chrome ou Firefox."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Pick best supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const finalMime = mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalMime });
        void processAudio(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setState("recording");
      startTimer();
    } catch {
      toast.showError(
        "Não foi possível acessar o microfone. Verifique as permissões."
      );
    }
  }, [processAudio, startTimer, toast]);

  // ── stopRecording ──
  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setState("processing");
    stopTimer();
  }, [stopTimer]);

  const reset = useCallback(() => {
    setState("idle");
    setResult(null);
    setSeconds(0);
  }, []);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {/* ── IDLE ── */}
      {state === "idle" && (
        <motion.div
          key="idle"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => void startRecording()}
            className="w-full gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary"
          >
            <Mic className="w-4 h-4" />
            Ditar Evolução
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-1.5">
            Sem microfone? Preencha o formulário manualmente abaixo.
          </p>
        </motion.div>
      )}

      {/* ── RECORDING ── */}
      {state === "recording" && (
        <motion.div
          key="recording"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 space-y-3"
        >
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                Gravando...
              </span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {formatTime(seconds)}
              <span className="text-xs ml-1 text-muted-foreground/60">/ 3:00</span>
            </span>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-[3px] h-10">
            {WAVE_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-red-500 rounded-full"
                animate={{ height: [h * 0.35, h, h * 0.35] }}
                transition={{
                  duration: 0.55 + i * 0.04,
                  repeat: Infinity,
                  delay: i * 0.07,
                  ease: "easeInOut",
                }}
                style={{ height: h }}
              />
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Fale o resumo da sessão — procedimentos, resposta do paciente, próximos passos
          </p>

          <Button
            type="button"
            onClick={stopRecording}
            className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Square className="w-4 h-4 fill-current" />
            Parar e processar
          </Button>
        </motion.div>
      )}

      {/* ── PROCESSING ── */}
      {state === "processing" && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-border bg-muted/50 p-4 flex items-center gap-3"
        >
          <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Transcrevendo e analisando...
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Isso leva alguns segundos
            </p>
          </div>
        </motion.div>
      )}

      {/* ── DONE ── */}
      {state === "done" && result && (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Evolução extraída!
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={reset}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Descartar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Transcription preview */}
          <div className="rounded-lg bg-background border border-border px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Transcrição
            </p>
            <p className="text-xs text-foreground leading-relaxed line-clamp-3">
              "{result.transcription}"
            </p>
          </div>

          {result.warning && (
            <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {result.warning}
            </div>
          )}

          {result.extracted && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ Campos preenchidos abaixo — revise antes de salvar
            </p>
          )}
        </motion.div>
      )}

      {/* ── ERROR ── */}
      {state === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">Falha ao processar o áudio.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="shrink-0"
          >
            Tentar novamente
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
