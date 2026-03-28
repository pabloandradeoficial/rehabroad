import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Eye, User, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { apiFetch } from "@/react-app/lib/api";

interface Props {
  onBack: () => void;
}

interface PatientProfile {
  paciente: { nome: string; idade: number; sexo: string; profissao: string };
  queixa_principal: string;
  diagnostico_oculto: string;
  historia_oculta: string;
  achados_para_revelar: {
    inspecao?: string;
    palpacao?: string;
    amplitude?: string;
    testes_positivos?: string[];
  };
  dica_final: string;
}

interface Message {
  role: "student" | "patient";
  content: string;
}

type Phase = "loading" | "chat" | "revealed" | "error";

export default function AnamneseSimulator({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [canReveal, setCanReveal] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = async () => {
    setPhase("loading");
    setMessages([]);
    setExchangeCount(0);
    setCanReveal(false);
    setProfile(null);

    try {
      const res = await apiFetch("/api/student/anamnese/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: "ortopedia", dificuldade: "intermediario" }),
      });

      if (!res.ok) throw new Error("Falha ao iniciar sessão");

      const data = await res.json() as { profile: PatientProfile };
      setProfile(data.profile);
      setMessages([{
        role: "patient",
        content: `Olá! ${data.profile.queixa_principal} Pode me ajudar?`,
      }]);
      setPhase("chat");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setErrorMsg("Não foi possível iniciar a simulação. Tente novamente.");
      setPhase("error");
    }
  };

  useEffect(() => {
    void startSession();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || sending || !profile) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    const newMessages: Message[] = [...messages, { role: "student", content: userMessage }];
    setMessages(newMessages);

    try {
      const res = await apiFetch("/api/student/anamnese/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, messages: newMessages }),
      });

      if (!res.ok) throw new Error("Falha na resposta");

      const data = await res.json() as {
        response: string;
        exchange_count: number;
        can_reveal: boolean;
      };

      setMessages([...newMessages, { role: "patient", content: data.response }]);
      setExchangeCount(data.exchange_count);
      setCanReveal(data.can_reveal);
    } catch {
      setMessages([
        ...newMessages,
        { role: "patient", content: "Desculpe, não entendi. Pode repetir?" },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReveal = () => {
    setPhase("revealed");
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Preparando paciente simulado...</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={startSession} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"><RefreshCw className="w-4 h-4" />Tentar novamente</Button>
            <Button variant="outline" onClick={onBack} className="border-gray-200 text-gray-600">Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "revealed" && profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Button>
          <span className="text-gray-900 font-semibold text-sm">Achados Clínicos Revelados</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Diagnosis */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
              <p className="text-xs text-teal-600 font-medium mb-1 uppercase tracking-wider">DIAGNÓSTICO</p>
              <h2 className="text-xl font-bold text-gray-900">{profile.diagnostico_oculto}</h2>
            </div>
            {/* Clinical findings */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">ACHADOS CLÍNICOS</p>
              <div className="space-y-3">
                {profile.achados_para_revelar.inspecao && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">Inspeção</p>
                    <p className="text-sm text-gray-700">{profile.achados_para_revelar.inspecao}</p>
                  </div>
                )}
                {profile.achados_para_revelar.palpacao && (
                  <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-3">
                    <p className="text-xs text-teal-600 font-medium mb-1">Palpação</p>
                    <p className="text-sm text-gray-700">{profile.achados_para_revelar.palpacao}</p>
                  </div>
                )}
                {profile.achados_para_revelar.amplitude && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-3">
                    <p className="text-xs text-purple-600 font-medium mb-1">Amplitude de Movimento</p>
                    <p className="text-sm text-gray-700">{profile.achados_para_revelar.amplitude}</p>
                  </div>
                )}
                {profile.achados_para_revelar.testes_positivos && profile.achados_para_revelar.testes_positivos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-2">Testes Positivos</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.achados_para_revelar.testes_positivos.map((t, i) => (
                        <Badge key={i} className="bg-teal-50 text-teal-700 border border-teal-200 text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Clinical tip */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
              <p className="text-xs text-amber-700 font-medium mb-1 uppercase tracking-wider">DICA CLÍNICA</p>
              <p className="text-sm text-gray-700">{profile.dica_final}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={startSession} className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700 text-white"><RefreshCw className="w-4 h-4" />Novo paciente</Button>
              <Button variant="outline" onClick={onBack} className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50">Sair</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Button>
          {profile && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-teal-700">{profile.paciente.nome.charAt(0)}</span>
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm leading-none">{profile.paciente.nome}</p>
                <p className="text-gray-500 text-xs mt-0.5">{profile.paciente.idade} anos · {profile.paciente.profissao}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{exchangeCount}/5</span>
          {canReveal && (
            <Button size="sm" onClick={handleReveal} className="gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs h-8">
              <Eye className="w-3 h-3" />Revelar achados
            </Button>
          )}
        </div>
      </header>

      {/* Progress strip */}
      {!canReveal && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-500">Investigação da queixa</p>
              <p className="text-xs text-gray-400">{exchangeCount}/5 perguntas</p>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-teal-500 rounded-full" animate={{ width: `${Math.min((exchangeCount / 5) * 100, 100)}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>
        </div>
      )}
      {canReveal && (
        <div className="bg-teal-50 border-b border-teal-200 px-4 py-2">
          <p className="text-xs text-teal-700 text-center font-medium">✓ Você já pode revelar os achados clínicos e o diagnóstico!</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 ${msg.role === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "patient" && (
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-teal-700" />
                </div>
              )}
              <div
                className={`max-w-[80%] text-sm leading-relaxed ${
                  msg.role === "patient"
                    ? "bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-800"
                    : "bg-teal-600 rounded-2xl rounded-tr-sm px-4 py-3 text-white"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-300 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 max-w-2xl mx-auto w-full">
        {/* Quick suggestion pills */}
        {!canReveal && exchangeCount < 3 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["Onde é a dor?", "Quando começou?", "O que piora?", "Irradia para algum lugar?", "Quanto é a dor (0–10)?"].map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                disabled={sending}
                className="text-xs px-2.5 py-1 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 text-gray-500 hover:text-teal-700 rounded-full transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
            placeholder="Faça uma pergunta ao paciente..."
            disabled={sending}
            className="flex-1 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-teal-400 transition-colors disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white h-12 w-12 p-0 flex-shrink-0 rounded-xl disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
