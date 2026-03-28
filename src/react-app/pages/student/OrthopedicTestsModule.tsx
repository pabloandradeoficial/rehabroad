import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Stethoscope, Search, Target, Play, CheckCircle, Brain, ChevronRight, ImageIcon } from "lucide-react";
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
        <ModulePage key="detail" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button
                onClick={() => setSelectedTest(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1 active:scale-[0.98]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
              <span className="inline-block px-2 py-0.5 sm:py-1 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                {selectedTest.region}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white">{selectedTest.name}</h1>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Test Image */}
            {selectedTest.imageUrl && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="relative bg-slate-900">
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

            {/* Objetivo */}
            <div className="bg-blue-500/5 border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-blue-400">Objetivo</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedTest.objective}</p>
            </div>

            {/* Como Executar */}
            <div className="bg-teal-500/5 border-l-4 border-teal-500 rounded-r-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Play className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-teal-400">Como Executar</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedTest.execution}</p>
            </div>

            {/* Resultado Positivo */}
            <div className="bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-amber-400">Resultado Positivo</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedTest.positiveResult}</p>
            </div>

            {/* Interpretação Clínica */}
            <div className="bg-purple-500/5 border-l-4 border-purple-500 rounded-r-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Brain className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-purple-400">Interpretação Clínica</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedTest.clinicalInterpretation}</p>
            </div>
          </div>
        </ModulePage>
      ) : (
        <ModulePage key="list" className="min-h-screen bg-slate-950 pb-24 md:pb-8">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1 active:scale-[0.98]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Testes Ortopédicos</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Execução e interpretação</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar teste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-teal-500 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Region Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm rounded-lg font-medium touch-manipulation transition-all active:scale-[0.98] ${
                  selectedRegion === 'all'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                Todos
              </button>
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`shrink-0 h-9 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm rounded-lg font-medium touch-manipulation transition-all active:scale-[0.98] ${
                    selectedRegion === region
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {region}
                </button>
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
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 sm:p-4 hover:border-teal-500/30 hover:bg-slate-800 active:scale-[0.98] transition-all text-left touch-manipulation"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium rounded-md mb-1.5 sm:mb-2">
                        {test.region}
                      </span>
                      <h3 className="font-bold text-white text-sm sm:text-base">{test.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 line-clamp-1">
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
