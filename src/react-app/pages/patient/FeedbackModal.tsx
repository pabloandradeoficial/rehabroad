import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/react-app/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BorgLevel =
  | "muito_leve"
  | "leve"
  | "moderado"
  | "intenso"
  | "maximo";

export interface FeedbackData {
  painLevel: number;
  borgLevel: BorgLevel | null;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => Promise<void>;
  isSubmitting: boolean;
  exerciseName: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAIN_SCALE = [
  { value: 0, emoji: "😌", label: "Sem dor" },
  { value: 1, emoji: "🙂", label: "" },
  { value: 2, emoji: "😊", label: "" },
  { value: 3, emoji: "😐", label: "" },
  { value: 4, emoji: "😕", label: "" },
  { value: 5, emoji: "😟", label: "Moderada" },
  { value: 6, emoji: "😣", label: "" },
  { value: 7, emoji: "😖", label: "" },
  { value: 8, emoji: "😫", label: "" },
  { value: 9, emoji: "😩", label: "" },
  { value: 10, emoji: "😭", label: "Insuportável" },
] as const;

const BORG_OPTIONS: {
  value: BorgLevel;
  emoji: string;
  label: string;
  description: string;
}[] = [
  { value: "muito_leve", emoji: "🌬️", label: "Muito Leve", description: "Quase sem esforço" },
  { value: "leve", emoji: "😌", label: "Leve", description: "Esforço mínimo" },
  { value: "moderado", emoji: "😤", label: "Moderado", description: "Perceptível" },
  { value: "intenso", emoji: "💪", label: "Intenso", description: "Desafiador" },
  { value: "maximo", emoji: "🔥", label: "Máximo", description: "Limite total" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function painColor(level: number): string {
  if (level <= 2) return "border-emerald-500 bg-emerald-500/20 text-emerald-300";
  if (level <= 4) return "border-yellow-500 bg-yellow-500/20 text-yellow-300";
  if (level <= 6) return "border-orange-500 bg-orange-500/20 text-orange-300";
  return "border-red-500 bg-red-500/20 text-red-300";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeedbackModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  exerciseName,
}: Props) {
  const [painLevel, setPainLevel] = useState<number>(0);
  const [borgLevel, setBorgLevel] = useState<BorgLevel | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    await onSubmit({ painLevel, borgLevel, notes });
    // Reset on success (parent closes modal)
    setPainLevel(0);
    setBorgLevel(null);
    setNotes("");
  };

  const selectedPain = PAIN_SCALE[painLevel];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            Como foi o exercício?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {exerciseName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ── VAS Pain Scale ──────────────────────────────────────────── */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Qual seu nível de dor agora?
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Toque no número que melhor descreve sua dor
            </p>

            {/* Selected pain display */}
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-3 transition-colors ${painColor(painLevel)}`}
            >
              <span className="text-2xl">{selectedPain.emoji}</span>
              <div>
                <p className="text-lg font-black leading-none">{painLevel}</p>
                <p className="text-xs mt-0.5 opacity-80">
                  {selectedPain.label || `Nível ${painLevel}`}
                </p>
              </div>
            </div>

            {/* Emoji grid 0–10 */}
            <div className="grid grid-cols-11 gap-1">
              {PAIN_SCALE.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPainLevel(value)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-semibold border transition-all select-none active:scale-95 ${
                    painLevel === value
                      ? `${painColor(value)} shadow-sm`
                      : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span>{value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Borg Effort Scale ───────────────────────────────────────── */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Quão difícil foi realizar este exercício?
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Escala de esforço percebido (Borg)
            </p>

            <div className="grid grid-cols-5 gap-1.5">
              {BORG_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBorgLevel(opt.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-1 rounded-xl border text-center transition-all select-none active:scale-95 ${
                    borgLevel === opt.value
                      ? "bg-primary/20 border-primary text-primary shadow-sm"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  <span className="text-xl leading-none">{opt.emoji}</span>
                  <span className="text-[10px] font-semibold leading-tight">
                    {opt.label}
                  </span>
                  <span className="text-[9px] leading-tight opacity-60 hidden sm:block">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Notes ───────────────────────────────────────────────────── */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Observações{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </p>
            <Textarea
              placeholder="Como você se sentiu? Alguma dificuldade ou dúvida?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          {/* ── Submit ──────────────────────────────────────────────────── */}
          <Button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirmar conclusão"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
