import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Zap, 
  Thermometer, 
  Radio, 
  Waves,
  Settings,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  ChevronRight,
  Star
} from "lucide-react";
import { electrotherapyModalities, type ElectrotherapyModality } from "@/data/educationalModules";
import { ModulePage } from "@/react-app/components/student/ModuleTransitions";

interface Props {
  onBack: () => void;
}

const categories = [
  { id: 'all', name: 'Todas', icon: Zap },
  { id: 'analgesica', name: 'Analgesia', icon: Radio },
  { id: 'correntes', name: 'Correntes', icon: Waves },
  { id: 'termica', name: 'Térmicas', icon: Thermometer },
  { id: 'laser', name: 'Laser', icon: Star }
];

const categoryColors = {
  analgesica: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600' },
  correntes: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-600' },
  termica: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-500 to-red-600' },
  laser: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-600' }
};

const evidenceColors = {
  alto: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Alta Evidência' },
  moderado: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Evidência Moderada' },
  baixo: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Baixa Evidência' }
};

export default function ElectrotherapyModule({ onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<ElectrotherapyModality | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModalities = electrotherapyModalities.filter(mod => {
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const colors = selectedModality ? categoryColors[selectedModality.category] : null;
  const evidence = selectedModality ? evidenceColors[selectedModality.evidenceLevel] : null;

  return (
    <AnimatePresence mode="wait">
      {selectedModality && colors && evidence ? (
        <ModulePage key="detail" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
          {/* Header */}
          <div className={`bg-gradient-to-br ${colors.gradient} text-white`}>
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button 
                onClick={() => setSelectedModality(null)} 
                className="flex items-center gap-2 text-white/70 hover:text-white mb-3 transition-colors touch-manipulation p-1 -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-md mb-2`}>
                    {categories.find(c => c.id === selectedModality.category)?.name}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold">{selectedModality.name}</h1>
                  <p className="text-white/80 text-sm mt-1">{selectedModality.description}</p>
                </div>
                <span className={`px-2 py-1 ${evidence.bg} ${evidence.text} text-xs font-medium rounded-lg whitespace-nowrap`}>
                  {evidence.label}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-4">
            {/* Mechanism */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Zap className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h2 className="font-bold text-slate-900">Mecanismo de Ação</h2>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg">
                {selectedModality.mechanism}
              </p>
            </div>

            {/* Parameters */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-slate-900">Parâmetros</h2>
              </div>
              <div className="space-y-3">
                {selectedModality.parameters.map((param, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{param.name}</span>
                      <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs font-bold rounded-md`}>
                        {param.values}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indications */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-slate-900">Indicações</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedModality.indications.map((indication, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-emerald-50 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-xs">{indication}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <h2 className="font-bold text-slate-900">Contraindicações</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedModality.contraindications.map((contraindication, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-rose-50 rounded-lg">
                    <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-xs">{contraindication}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Tips */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-bold text-slate-900">Dicas de Aplicação</h2>
              </div>
              <div className="space-y-2">
                {selectedModality.applicationTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* References */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="font-bold text-slate-900">Referências Científicas</h2>
              </div>
              <div className="space-y-2">
                {selectedModality.references.map((ref, i) => (
                  <p key={i} className="text-slate-600 text-xs italic bg-slate-50 p-2 rounded-lg">
                    {ref}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </ModulePage>
      ) : (
        <ModulePage key="list" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
          {/* Header */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white">
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-white/70 hover:text-white mb-3 transition-colors touch-manipulation p-1 -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar aos Módulos</span>
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Eletroterapia Básica</h1>
                  <p className="text-white/80 text-sm">Parâmetros, indicações e contraindicações</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar modalidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Modalities Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredModalities.map((modality) => {
                const modColors = categoryColors[modality.category];
                const modEvidence = evidenceColors[modality.evidenceLevel];
                return (
                  <motion.div
                    key={modality.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedModality(modality)}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${modColors.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-sm">{modality.name}</h3>
                          <span className={`px-2 py-0.5 ${modEvidence.bg} ${modEvidence.text} text-[10px] font-medium rounded-md whitespace-nowrap`}>
                            {modality.evidenceLevel === 'alto' ? '★★★' : modality.evidenceLevel === 'moderado' ? '★★' : '★'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-2">{modality.description}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 ${modColors.bg} ${modColors.text} text-[10px] font-medium rounded-md`}>
                            {categories.find(c => c.id === modality.category)?.name}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {modality.parameters.length} parâmetros
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredModalities.length === 0 && (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Nenhuma modalidade encontrada</p>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Dica de Estudo</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Sempre verifique as contraindicações antes de aplicar qualquer recurso. 
                    Na prova, questões sobre marca-passo, gestação e implantes metálicos são frequentes!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModulePage>
      )}
    </AnimatePresence>
  );
}
