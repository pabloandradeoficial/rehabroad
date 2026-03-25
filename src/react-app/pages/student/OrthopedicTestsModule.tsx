import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Stethoscope, Search, Target, Play, CheckCircle, Brain, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { orthopedicTests, type OrthopedicTest } from "@/data/educationalModules";
import { ModulePage } from "@/react-app/components/student/ModuleTransitions";

interface Props {
  onBack: () => void;
}

const regions = ['Ombro', 'Cervical', 'Lombar', 'Joelho', 'Tornozelo'];

export default function OrthopedicTestsModule({ onBack }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<OrthopedicTest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = orthopedicTests.filter(test => {
    const matchesRegion = selectedRegion === 'all' || test.region === selectedRegion;
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <AnimatePresence mode="wait">
      {selectedTest ? (
        <ModulePage key="detail" className="min-h-screen bg-slate-50 pb-24 md:pb-8">
        {/* Header - Mobile optimized */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
            <button 
              onClick={() => setSelectedTest(null)} 
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
            <span className="inline-block px-2 py-0.5 sm:py-1 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
              {selectedTest.region}
            </span>
            <h1 className="text-lg sm:text-xl font-bold">{selectedTest.name}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Test Image */}
          {selectedTest.imageUrl && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <div className="relative bg-slate-50">
                <img 
                  src={selectedTest.imageUrl} 
                  alt={`Demonstração do ${selectedTest.name}`}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Ilustração
                </div>
              </div>
            </div>
          )}

          {/* Objective */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Objetivo</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedTest.objective}</p>
          </div>

          {/* Execution */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Como Executar</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedTest.execution}</p>
          </div>

          {/* Positive Result */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Resultado Positivo</h2>
            </div>
            <div className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{selectedTest.positiveResult}</p>
            </div>
          </div>

          {/* Clinical Interpretation */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Interpretação Clínica</h2>
            </div>
            <div className="p-3 sm:p-4 bg-violet-50 rounded-xl border border-violet-200">
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{selectedTest.clinicalInterpretation}</p>
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Testes Ortopédicos</h1>
              <p className="text-xs sm:text-sm text-slate-400">Execução e interpretação</p>
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
            placeholder="Buscar teste..."
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

        {/* Test Cards */}
        <div className="space-y-2">
          {filteredTests.map((test, index) => (
            <motion.button
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedTest(test)}
              className="w-full bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-[0.98] transition-all text-left touch-manipulation"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                    {test.region}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{test.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 line-clamp-1">
                    {test.objective}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-slate-500 text-sm">
            Nenhum teste encontrado
          </div>
        )}
      </div>
    </ModulePage>
      )}
    </AnimatePresence>
  );
}
