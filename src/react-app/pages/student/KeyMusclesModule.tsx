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
        <ModulePage key="detail" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
        {/* Header - Mobile optimized */}
        <div className="bg-slate-900 text-white">
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
            <h1 className="text-lg sm:text-xl font-bold">{selectedMuscle.name}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Where to Palpate */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Onde Palpar</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedMuscle.whereToPalpate}</p>
          </div>

          {/* Why to Palpate */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Por que Palpar</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedMuscle.whyToPalpate}</p>
          </div>

          {/* Referred Pain */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Dor Referida Comum</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedMuscle.referredPain}</p>
          </div>

          {/* Related Pathologies */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Patologias Associadas</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {selectedMuscle.relatedPathologies.map((pathology, i) => (
                <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-violet-50 text-violet-700 text-xs sm:text-sm font-medium rounded-lg border border-violet-200">
                  {pathology}
                </span>
              ))}
            </div>
          </div>
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Músculos-Chave</h1>
              <p className="text-xs sm:text-sm text-slate-400">Anatomia palpatória</p>
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
            placeholder="Buscar músculo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
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

        {/* Muscle Cards */}
        <div className="space-y-2">
          {filteredMuscles.map((muscle, index) => (
            <motion.button
              key={muscle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedMuscle(muscle)}
              className="w-full bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all text-left touch-manipulation"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                    {muscle.region}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{muscle.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">
                    {muscle.relatedPathologies.slice(0, 2).join(' • ')}
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
