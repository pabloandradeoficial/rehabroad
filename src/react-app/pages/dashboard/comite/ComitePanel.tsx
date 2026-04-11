import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Users, 
  Brain, 
  BookOpen, 
  Briefcase, 
  Gavel, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Loader2,
  AlertTriangle,
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

// Icon mapper helper
const ICON_MAP: Record<string, any> = {
  LibraryBig, ClipboardCheck, Activity, Zap, HandMetal, Stethoscope, HeartPulse, Wind, Baby, Users, Syringe, Dumbbell, ShieldCheck, Sparkles, GraduationCap, FileText, BarChart, Star, Scale, ShoppingBag, Lock, Briefcase, Building, PiggyBank, Calculator, TrendingUp, FileX, Percent
};
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/react-app/lib/api";

type Agent = {
  id: string;
  name: string;
  category: string;
  short_description: string;
  icon: string;
  color_theme: string;
};

type XpInfo = {
  total_xp: number;
  level: string;
  next_level_xp: number;
};

const CATEGORIES = [
  { id: "all", label: "Todos", icon: Users },
  { id: "clínico", label: "Clínico", icon: Brain },
  { id: "pesquisa", label: "Pesquisa", icon: BookOpen },
  { id: "mentoria", label: "Mentoria", icon: Trophy },
  { id: "carreira", label: "Carreira", icon: Briefcase },
  { id: "jurídico_contábil", label: "Jurídico/Contábil", icon: Gavel },
];

export default function ComitePanel() {
  const [activeTab, setActiveTab] = useState("all");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [xpInfo, setXpInfo] = useState<XpInfo | null>(null);
  const [weeklyCase, setWeeklyCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agentsRes, xpRes] = await Promise.all([
          apiFetch("/api/comite/agents"),
          apiFetch("/api/comite/xp")
        ]);

        if (!agentsRes.ok) throw new Error("Falha ao carregar agentes");
        
        
        const agentsData = await agentsRes.json();
        const rawAgents = Array.isArray(agentsData) ? agentsData : (agentsData.agents || []);
        
        const mappedAgents: Agent[] = rawAgents.map((a: any) => {
          let cat = (a.categoria || "").toLowerCase();
          if (cat === "prática clínica") cat = "clínico";
          else if (cat === "jurídico" || cat === "contábil") cat = "jurídico_contábil";

          return {
            id: a.id,
            name: a.nome || a.name || "Agente",
            category: cat || a.category || "geral",
            short_description: a.descricao_curta || a.short_description || "",
            icon: a.icone || a.icon,
            color_theme: "teal" 
          };
        });
        
        setAgents(mappedAgents);
        

        if (xpRes.ok) {
          const xpData = await xpRes.json();
          setXpInfo(xpData);
        }

        // Mock for weekly case - could come from another endpoint later
        setWeeklyCase({
          title: "Caso Desafio da Semana: Síndrome Patelofemoral Complexa",
          description: "Paciente de 25 anos, corredor, com dor anterior no joelho há 6 meses que não melhora com fisioterapia convencional. Participe da discussão com nosso Comitê Clínico.",
          agent_id: agentsData.agents?.find((a: any) => a.category === "clínico")?.id
        });

      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAgents = activeTab === "all" 
    ? agents 
    : agents.filter(a => a.category === activeTab);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header Profile Section */}
      <div className="pt-8 px-6 pb-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-500" />
              Comitê Executivo e Clínico
            </h1>
            <p className="text-slate-500 mt-1">
              Mentores especialistas com IA treinados para discutir, revisar e aperfeiçoar suas condutas.
            </p>
          </div>
          
          {xpInfo && (
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800 dark:text-white">{xpInfo.level}</span>
                  <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                    {xpInfo.total_xp} XP
                  </span>
                </div>
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${(xpInfo.total_xp / Math.max(xpInfo.next_level_xp, 1)) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 text-right">
                  Próximo Nível: {xpInfo.next_level_xp} XP
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-8">
        
        {/* Weekly Challenge Banner */}
        {weeklyCase && weeklyCase.agent_id && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-400 text-xs font-semibold rounded-full mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  Caso Desafio da Semana
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                  {weeklyCase.title}
                </h2>
                <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  {weeklyCase.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 font-medium">
                  <Trophy className="w-4 h-4" />
                  Vale até +20 XP pela resolução guiada
                </div>
              </div>
              
              <Link to={`/dashboard/comite/agente/${weeklyCase.agent_id}`}>
                <button className="flex-shrink-0 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 group w-full md:w-auto justify-center">
                  Discutir Caso
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-teal-500 text-white shadow-md shadow-teal-500/25" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map(agent => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/dashboard/comite/agente/${agent.id}`}>
                  <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-white/5 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 group flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
                        agent.color_theme === 'teal' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' :
                        agent.color_theme === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                        agent.color_theme === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                        agent.color_theme === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {(() => {
                           const IconComp = ICON_MAP[agent.icon] || Users;
                           return <IconComp className="w-6 h-6" />;
                        })()}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        {agent.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-500 transition-colors">
                      {agent.name}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 leading-relaxed">
                      {agent.short_description}
                    </p>
                    
                    <div className="mt-5 flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400">
                      Entrar no Comitê
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredAgents.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum conselheiro encontrado para esta categoria.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
