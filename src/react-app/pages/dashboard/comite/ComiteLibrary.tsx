import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Library, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight,
  MessageSquare,
  Loader2,
  AlertTriangle,
  Lightbulb,
  LibraryBig, ClipboardCheck, Activity, Zap, HandMetal, Stethoscope, HeartPulse, Wind, Baby, Users, Syringe, Dumbbell, ShieldCheck, Sparkles, GraduationCap, FileText, BarChart, Star, Scale, ShoppingBag, Lock, Briefcase, Building, PiggyBank, Calculator, TrendingUp, FileX, Percent, Brain, BookOpen, Trophy, Gavel
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { apiFetch } from "@/react-app/lib/api";
import type { ComiteMessage } from "@/shared/api";

const ICON_MAP: Record<string, LucideIcon> = {
  LibraryBig, ClipboardCheck, Activity, Zap, HandMetal, Stethoscope, HeartPulse, Wind, Baby, Users, Syringe, Dumbbell, ShieldCheck, Sparkles, GraduationCap, FileText, BarChart, Star, Scale, ShoppingBag, Lock, Briefcase, Building, PiggyBank, Calculator, TrendingUp, FileX, Percent, Brain, BookOpen, Trophy, Gavel
};

type SavedCase = {
  id: string;
  title: string;
  agent_id: string;
  agent_name: string;
  agent_icon: string;
  created_at: string;
  history_json: string; // Contains stringified messages
};

export default function ComiteLibrary() {
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/comite/library");

        if (!res.ok) throw new Error("Falha ao carregar a biblioteca de casos.");
        const data = await res.json();
        setCases(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao consultar casos.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.agent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="pt-8 px-6 pb-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Library className="w-6 h-6 text-teal-500" />
              Minha Biblioteca
            </h1>
            <p className="text-slate-500 mt-1">
              Guarde suas melhores discussões e raciocínios clínicos para consultar sempre que precisar.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título ou mentor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 transition-shadow outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors w-full md:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredCases.map(item => {
                const date = new Date(item.created_at);
                const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                
                // Parse history safely to get message count
                let messageCount = 0;
                try {
                  const history = JSON.parse(item.history_json || "[]");
                  messageCount = history.filter((m: ComiteMessage) => m.role === "assistant").length;
                } catch {
                  // history may not parse — leave count at 0
                }

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                          {(() => {
                            const IconComp = ICON_MAP[item.agent_icon] || Brain;
                            return <IconComp className="w-5 h-5" />;
                          })()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"> Mentor </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{item.agent_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatter.format(date)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {messageCount} interações
                      </div>
                      
                      <Link 
                        to={`/dashboard/comite/agente/${item.agent_id}?case=${item.id}`}
                        className="flex items-center justify-center bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 p-2 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5 border-dashed">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sua biblioteca está vazia</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Converse com os mentores no Comitê e salve casos para tê-los aqui e ganhar +5 XP.
            </p>
            <Link to="/dashboard/comite">
              <button className="bg-teal-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-teal-500/20 hover:bg-teal-600 transition-colors">
                Ir para o Comitê
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
