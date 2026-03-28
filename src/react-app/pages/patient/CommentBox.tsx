import { useState } from "react";
import { Send } from "lucide-react";
import { apiFetch } from "@/react-app/lib/api";

interface CommentBoxProps {
  planId: number;
  section: string;
  exerciseId?: number;
}

export function CommentBox({ planId, section, exerciseId }: CommentBoxProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await apiFetch("/api/patient-portal/comment", {
        method: "POST",
        body: JSON.stringify({
          hep_plan_id: planId,
          hep_exercise_id: exerciseId ?? null,
          section,
          comment: text.trim(),
        }),
      });
      setText("");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch {
      // silently fail — user can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-current/10">
      {sent ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          ✓ Dúvida enviada! Seu fisioterapeuta vai responder em breve.
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Tem alguma dúvida sobre isso?"
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-current/20 bg-white/10 placeholder:text-current/40 text-current focus:outline-none focus:ring-1 focus:ring-current/30"
            disabled={sending}
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!text.trim() || sending}
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-current/20 bg-white/10 font-medium disabled:opacity-40 hover:bg-white/20 transition-colors"
          >
            <Send className="w-3 h-3" />
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
