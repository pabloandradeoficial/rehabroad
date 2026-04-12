import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import { 
  ArrowLeft, 
  Send, 
  Save, 
  CheckCircle2, 
  Trophy, 
  BookOpen, 
  Lightbulb, 
  Loader2,
  Users, 
  Brain, 
  Briefcase, 
  Gavel, 
  Sparkles,
  LibraryBig, 
  ClipboardCheck, 
  Activity, 
  Zap, 
  HandMetal, 
  Stethoscope, 
  HeartPulse, 
  Wind, 
  Baby, 
  Syringe, 
  Dumbbell, 
  ShieldCheck,
  GraduationCap, 
  FileText, 
  BarChart, 
  Star, 
  Scale, 
  ShoppingBag, 
  Lock, 
  Building, 
  PiggyBank, 
  Calculator, 
  TrendingUp, 
  FileX, 
  Percent
} from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/react-app/lib/api";
import ReactMarkdown from "react-markdown";

// Icon mapper helper
const ICON_MAP: Record<string, any> = {
  LibraryBig, ClipboardCheck, Activity, Zap, HandMetal, Stethoscope, HeartPulse, Wind, Baby, Users, Syringe, Dumbbell, ShieldCheck, Sparkles, GraduationCap, FileText, BarChart, Star, Scale, ShoppingBag, Lock, Briefcase, Building, PiggyBank, Calculator, TrendingUp, FileX, Percent, Brain, BookOpen, Trophy, Gavel
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Agent = {
  id: string;
  name: string;
  category: string;
  descricao_curta: string;
  icone: string;
  color_theme?: string;
};

type XpInfo = {
  total_xp: number;
  level: string;
  next_level_xp: number;
};

function processReferencialTeorico(text: string) {
  // Extract parts formatted as [REFERENCIAL TEÓRICO: ...]
  const regex = /\[REFERENCIAL TEÓRICO:(.*?)\]/gs;
  
  // Replace the matched references with a special markdown component structure
  // that we can render differently. We'll use a custom HTML block or Blockquote.
  return text.replace(regex, (_match, content) => {
    return `\n\n> **📚 REFERENCIAL TEÓRICO**\n> ${content.trim()}\n\n`;
  });
}

export default function ComiteAgent() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [xpInfo, setXpInfo] = useState<XpInfo | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou seu mentor. Qual caso clínico ou dúvida gostaria de discutir hoje? Lembre-se, meu papel é guiá-lo no raciocínio, não apenas dar a resposta."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, xpRes] = await Promise.all([
          apiFetch("/api/comite/agents"),
          apiFetch("/api/comite/xp")
        ]);

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          // The API from current comite endpoint returns an array or an object with agents.
          // ComitePanel assumed agentsData.agents, but the endpoint in comiteRouter just returns \`results\` as JSON array.
          // Let's handle both.
          const agentsList = Array.isArray(agentsData) ? agentsData : agentsData.agents || [];
          const foundAgent = agentsList.find((a: any) => a.id === agentId);
          if (foundAgent) {
            setAgent({
              id: foundAgent.id,
              name: foundAgent.nome, // DB has nome
              category: foundAgent.categoria, // DB has categoria
              descricao_curta: foundAgent.descricao_curta,
              icone: foundAgent.icone,
            });
          }
        }

        if (xpRes.ok) {
          const xpData = await xpRes.json();
          setXpInfo({
            total_xp: xpData.xp || 0,
            level: xpData.level || 'Iniciante',
            next_level_xp: xpData.xp < 50 ? 50 : xpData.xp < 100 ? 100 : xpData.xp < 250 ? 250 : xpData.xp < 500 ? 500 : 1000
          });
        }
        
        // Load history if 'case' query param is present
        const caseId = searchParams.get("case");
        if (caseId) {
          const libRes = await apiFetch("/api/comite/library");
          if (libRes.ok) {
            const library = await libRes.json();
            const existingCase = library.find((c: any) => c.id === caseId);
            if (existingCase && existingCase.history_json) {
              setMessages(JSON.parse(existingCase.history_json));
              setSavedCaseId(caseId);
            }
          }
        }
      } catch (err) {
        console.error("Falha ao carregar dados", err);
      }
    };
    if (agentId) fetchData();
  }, [agentId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !agentId) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await apiFetch("/api/comite/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentId,
          message: userMessage,
          // Exclude the first welcome message if we want, or send everything. We exclude system prompt.
          history: updatedMessages.filter(m => m.content).slice(-8)
        })
      });

      if (!res.ok) throw new Error("Erro ao enviar mensagem");

      const data = await res.json();
      
      setMessages([...updatedMessages, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: "assistant", content: "Desculpe, ocorreu um erro ao processar sua resposta. Tente novamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!agentId || isSaving) return;
    try {
      setIsSaving(true);
      const userMsg = messages.find(m => m.role === "user");
      const title = userMsg 
        ? userMsg.content.slice(0, 40) + "..." 
        : "Discussão Aberta";

      const res = await apiFetch("/api/comite/library/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: savedCaseId, // pass existing id if updating
          agentId,
          title,
          history: messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSavedCaseId(data.caseId);
        if (data.xpAdded > 0 && xpInfo) {
          setXpInfo({
            ...xpInfo,
            total_xp: xpInfo.total_xp + data.xpAdded
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteCase = async () => {
    if (isCompleting) return;
    try {
      setIsCompleting(true);
      const res = await apiFetch("/api/comite/complete-case", {
        method: "POST"
      });

      if (res.ok) {
        // Automatically save the case before redirecting
        await handleSaveToLibrary();
        navigate("/dashboard/comite");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[100dvh] overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar: Mentor Profile & XP Info */}
      <div className="hidden lg:flex flex-col w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 p-6">
        <Link to="/dashboard/comite" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 w-fit font-medium">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Comitê
        </Link>

        {/* Agent Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm text-center">
          <div className="text-4xl mb-4 bg-slate-100 dark:bg-slate-700 w-20 h-20 mx-auto rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400">
            {(() => {
               const IconComp = ICON_MAP[agent.icone] || Brain;
               return <IconComp className="w-10 h-10" />;
            })()}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400 px-2 py-1 bg-teal-50 dark:bg-teal-500/10 rounded-lg mb-2 inline-block">
            {(agent.category || "geral").replace('_', ' ')}
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {agent.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {agent.descricao_curta}
          </p>
        </div>

        {/* XP Integration Card */}
        {xpInfo && (
          <div className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">{xpInfo.level}</h3>
                <p className="text-indigo-100 text-sm font-medium">{xpInfo.total_xp} XP</p>
              </div>
            </div>
            
            <div className="w-full bg-black/20 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(100, (xpInfo.total_xp / Math.max(xpInfo.next_level_xp, 1)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-indigo-100 text-right">
              Faltam {Math.max(0, xpInfo.next_level_xp - xpInfo.total_xp)} XP para o próximo nível
            </p>
          </div>
        )}

        {/* Info Tips */}
        <div className="mt-auto space-y-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>Os mentores utilizam o <strong>método socrático</strong> para desenvolver seu raciocínio clínico.</p>
          </div>
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p>Preste atenção aos marcadores de <span className="font-semibold text-slate-700 dark:text-white text-xs px-1 rounded bg-slate-200 dark:bg-slate-700 block mt-1 w-fit">REFERENCIAL TEÓRICO</span> para embasamento científico.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 z-10">
          <Link to="/dashboard/comite" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{agent.icone}</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{agent.name}</span>
          </div>
          {xpInfo && (
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              {xpInfo.total_xp}
            </div>
          )}
        </div>

        {/* Header Actions (Desktop only) */}
        <div className="hidden lg:flex absolute top-0 left-0 right-0 p-6 items-center justify-end gap-3 pointer-events-none z-10">
          <div className="pointer-events-auto flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200 dark:border-white/5 shadow-sm">
            <button 
              onClick={handleSaveToLibrary}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-teal-500" />}
              {savedCaseId ? "Atualizar" : "Salvar Biblioteca"}
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
            <button 
              onClick={handleCompleteCase}
              disabled={isCompleting || messages.length < 3}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Concluir Caso
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 pb-32">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-3xl ${message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <div className={`flex items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-slate-200 dark:bg-slate-800" 
                    : "bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-lg shadow-sm"
                }`}>
                  {message.role === "user" ? <UserIcon /> : agent.icone}
                </div>

                {/* Message Bubble */}
                <div className={`px-5 py-4 rounded-2xl shadow-sm ${
                  message.role === "user"
                    ? "bg-teal-500 text-white rounded-br-none"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none"
                }`}>
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none 
                      prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                      prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                      prose-blockquote:text-blue-800 dark:prose-blockquote:text-blue-200
                      prose-blockquote:font-medium prose-blockquote:my-4 prose-blockquote:not-italic"
                    >
                      <ReactMarkdown>
                        {processReferencialTeorico(message.content)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-lg shadow-sm opacity-50">
                {agent.icone}
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Complete Actions */}
        <div className="lg:hidden absolute bottom-20 left-0 right-0 px-4 pb-2 z-10 flex gap-2">
            <button 
              onClick={handleSaveToLibrary}
              disabled={isSaving}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-lg rounded-xl py-2 flex justify-center items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4 text-teal-500" />
              Salvar
            </button>
            <button 
              onClick={handleCompleteCase}
              disabled={isCompleting || messages.length < 3}
              className="flex-1 bg-teal-500 text-white shadow-lg rounded-xl py-2 flex justify-center items-center gap-2 font-bold disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Concluir
            </button>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5 z-20">
          <form 
            className="max-w-4xl mx-auto relative flex items-center"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Descreva seu raciocínio ou tire uma dúvida..."
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-full py-4 pl-6 pr-14 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
