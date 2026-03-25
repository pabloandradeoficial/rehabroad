import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, Search, Target, Zap, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { initialTreatments, type InitialTreatment } from "@/data/educationalModules";
import { ModulePage } from "@/react-app/components/student/ModuleTransitions";

interface Props {
  onBack: () => void;
}

const regions = ['Cervical', 'Ombro', 'Lombar', 'Quadril', 'Joelho', 'Tornozelo', 'Punho e Mão'];

export default function InitialTreatmentsModule({ onBack }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTreatment, setSelectedTreatment] = useState<InitialTreatment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTreatments = initialTreatments.filter(treatment => {
    const matchesRegion = selectedRegion === 'all' || treatment.region === selectedRegion;
    const matchesSearch = treatment.condition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <AnimatePresence mode="wait">
      {selectedTreatment ? (
        <ModulePage key="detail" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
        {/* Header - Mobile optimized */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
            <button 
              onClick={() => setSelectedTreatment(null)} 
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
            <span className="inline-block px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
              {selectedTreatment.region}
            </span>
            <h1 className="text-lg sm:text-xl font-bold">{selectedTreatment.condition}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Objectives */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Objetivos</h2>
            </div>
            <div className="space-y-2">
              {selectedTreatment.objectives.map((objective, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 text-xs sm:text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Initial Conducts */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Condutas Iniciais</h2>
            </div>
            <div className="space-y-2">
              {selectedTreatment.initialConducts.map((conduct, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-xs sm:text-sm">{conduct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          {selectedTreatment.redFlags && selectedTreatment.redFlags.length > 0 && (
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100 border-l-4 border-l-red-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">Red Flags</h2>
              </div>
              <div className="p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="space-y-1.5 sm:space-y-2">
                  {selectedTreatment.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      <span className="text-red-800 text-xs sm:text-sm font-medium">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progression Criteria */}
          {selectedTreatment.progressionCriteria && (
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">Critérios de Progressão</h2>
              </div>
              <div className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-200">
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{selectedTreatment.progressionCriteria}</p>
              </div>
            </div>
          )}
        </div>
      </ModulePage>
      ) : (
      <ModulePage key="list" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Condutas Iniciais</h1>
              <p className="text-xs sm:text-sm text-slate-400">Objetivos e tratamento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {/* Search - Touch optimized */}
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar condição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
          />
        </div>

        {/* Region Filters - Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
          <Button
            variant={selectedRegion === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRegion('all')}
            className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm touch-manipulation ${selectedRegion === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
          >
            Todos
          </Button>
          {regions.map(region => (
            <Button
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm touch-manipulation ${selectedRegion === region ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
            >
              {region}
            </Button>
          ))}
        </div>

        {/* Treatment Cards */}
        <div className="space-y-2">
          {filteredTreatments.map((treatment, index) => (
            <motion.button
              key={treatment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedTreatment(treatment)}
              className="w-full bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all text-left touch-manipulation"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium rounded-md">
                      {treatment.region}
                    </span>
                    {treatment.redFlags && treatment.redFlags.length > 0 && (
                      <span className="inline-block px-2 py-0.5 bg-red-50 text-red-700 text-[10px] sm:text-xs font-medium rounded-md">
                        Red Flags
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{treatment.condition}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                    {treatment.objectives.length} obj • {treatment.initialConducts.length} condutas
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-slate-500 text-sm">
            Nenhuma condição encontrada
          </div>
        )}
      </div>
    </ModulePage>
      )}
    </AnimatePresence>
  );
}
