import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  Bot,
  User,
  Zap,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Textarea } from "@/react-app/components/ui/textarea";
import { apiFetch } from "@/react-app/lib/api";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
}

interface RehabFriendChatProps {
  open: boolean;
  onClose: () => void;
  patientId?: number;
  patientName?: string;
}

// ─────────────────────────────────────────────
// Quick action prompts
// ─────────────────────────────────────────────

const QUICK_PROMPTS = [
  "Sugira um protocolo de reabilitação baseado em evidências",
  "Quais testes funcionais devo aplicar?",
  "Como progredir os exercícios desta semana?",
  "Quais sinais de alerta devo observar?",
];

const QUICK_PROMPTS_WITH_PATIENT = (name: string) => [
  `Analise o quadro clínico de ${name} e sugira hipóteses diagnósticas`,
  `Quais técnicas terapêuticas são indicadas para ${name}?`,
  `Como progressar o tratamento de ${name} na próxima sessão?`,
  `Quais exercícios domiciliares prescrever para ${name}?`,
];

// ─────────────────────────────────────────────
// Markdown renderer (minimal)
// ─────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<p class="font-bold text-sm mt-3 mb-1">$1</p>')
    .replace(/^## (.+)$/gm, '<p class="font-bold text-sm mt-3 mb-1">$1</p>')
    .replace(/^# (.+)$/gm, '<p class="font-bold text-base mt-3 mb-1">$1</p>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, "<br />");
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function RehabFriendChat({
  open,
  onClose,
  patientId,
  patientName,
}: RehabFriendChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = patientName
    ? QUICK_PROMPTS_WITH_PATIENT(patientName)
    : QUICK_PROMPTS;

  const loadUsage = useCallback(async () => {
    try {
      const res = await apiFetch("/api/rehab-friend/usage");
      if (res.ok) {
        const data = await res.json() as UsageInfo;
        setUsage(data);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadUsage();
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open, loadUsage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      setError(null);
      setInput("");
      setSending(true);

      const userMsg: Message = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await apiFetch("/api/rehab-friend/chat", {
          method: "POST",
          body: JSON.stringify({
            message: trimmed,
            patientId,
            history: messages.slice(-8),
          }),
        });

        if (res.status === 429) {
          setError("Limite diário de 15 mensagens atingido. Volte amanhã.");
          setMessages((prev) => prev.slice(0, -1));
          return;
        }

        if (!res.ok) {
          setError("Erro ao enviar mensagem. Tente novamente.");
          setMessages((prev) => prev.slice(0, -1));
          return;
        }

        const data = await res.json() as {
          content: string;
          used: number;
          remaining: number;
        };

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
        setUsage((prev) =>
          prev ? { ...prev, used: data.used, remaining: data.remaining } : prev
        );
      } catch {
        setError("Erro de conexão. Verifique sua internet.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setSending(false);
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    },
    [sending, messages, patientId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Rehab Friend</p>
                  {patientName ? (
                    <p className="text-xs text-primary">Contexto: {patientName}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Assistente clínico IA</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {usage && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {usage.remaining}/{usage.limit} mensagens
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  {/* Welcome */}
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">Olá! Sou o Rehab Friend</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assistente clínico IA para apoiar seu raciocínio fisioterapêutico.
                    </p>
                    {patientName && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">
                        <Zap className="w-3 h-3" />
                        Contexto de {patientName} carregado
                      </div>
                    )}
                  </div>

                  {/* Quick prompts */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Sugestões
                    </p>
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-foreground"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.content),
                        }}
                        className="prose-sm"
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Pensando...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll indicator when messages exist */}
            {messages.length > 3 && (
              <button
                type="button"
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/50">
              {usage?.remaining === 0 ? (
                <div className="text-center py-3 text-sm text-muted-foreground">
                  Limite diário atingido. Volte amanhã.
                </div>
              ) : (
                <div className="flex gap-2 items-end">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte sobre o caso clínico..."
                    rows={1}
                    className="resize-none text-sm min-h-[40px] max-h-[120px]"
                    disabled={sending}
                  />
                  <Button
                    size="icon"
                    onClick={() => void sendMessage(input)}
                    disabled={!input.trim() || sending}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">
                Sugestões de apoio clínico — não substituem julgamento profissional
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
