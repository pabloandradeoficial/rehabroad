import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Dumbbell, Search, MapPin, AlertCircle, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { keyMuscles, type KeyMuscle } from "@/data/educationalModules";
import { ModulePage } from "@/react-app/components/student/ModuleTransitions";

interface Props {
  onBack: () => void;
}

const regions = ['Cervical', 'Ombro', 'Lombar', 'Quadril', 'Joelho', 'Tornozelo'];

export default function KeyMusclesModule({ onBack }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<KeyMuscle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMuscles = keyMuscles.filter(muscle => {
    const matchesRegion = selectedRegion === 'all' || muscle.region === selectedRegion;
    const matchesSearch = muscle.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <AnimatePresence mode="wait">
      {selectedMuscle ? (
        <ModulePage key="detail" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
          {/* Detail Header */}
          <div className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button
                onClick={() => setSelectedMuscle(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
              <span className="inline-block px-2 py-0.5 sm:py-1 bg-orange-500/20 text-orange-300 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                {selectedMuscle.region}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white">{selectedMuscle.name}</h1>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Onde Palpar */}
            <div className="bg-orange-500/5 border-l-4 border-orange-500 rounded-r-xl p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                <h2 className="font-bold text-orange-400 text-sm sm:text-base">Onde Palpar</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedMuscle.whereToPalpate}</p>
            </div>

            {/* Por que Palpar */}
            <div className="bg-teal-500/5 border-l-4 border-teal-500 rounded-r-xl p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0" />
                <h2 className="font-bold text-teal-400 text-sm sm:text-base">Por que Palpar</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedMuscle.whyToPalpate}</p>
            </div>

            {/* Dor Referida */}
            <div className="bg-rose-500/5 border-l-4 border-rose-500 rounded-r-xl p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0" />
                <h2 className="font-bold text-rose-400 text-sm sm:text-base">Dor Referida Comum</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedMuscle.referredPain}</p>
            </div>

            {/* Patologias Associadas */}
            <div className="bg-purple-500/5 border-l-4 border-purple-500 rounded-r-xl p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <h2 className="font-bold text-purple-400 text-sm sm:text-base">Patologias Associadas</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedMuscle.relatedPathologies.map((pathology, i) => (
                  <span
                    key={i}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium rounded-lg border border-purple-500/30"
                  >
                    {pathology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ModulePage>
      ) : (
        <ModulePage key="list" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
          {/* List Header */}
          <div className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Músculos-Chave</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Anatomia palpatória</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar músculo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-teal-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Region Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-lg touch-manipulation transition-colors ${
                  selectedRegion === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-lg touch-manipulation transition-colors ${
                    selectedRegion === region
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Muscle Cards */}
            <div className="space-y-2">
              {filteredMuscles.map((muscle, index) => (
                <motion.button
                  key={muscle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedMuscle(muscle)}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 sm:p-4 hover:border-teal-500/30 active:scale-[0.98] transition-all text-left touch-manipulation cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                        {muscle.region}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base">{muscle.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">
                        {muscle.relatedPathologies.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredMuscles.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-slate-500 text-sm">
                Nenhum músculo encontrado
              </div>
            )}
          </div>
        </ModulePage>
      )}
    </AnimatePresence>
  );
}
