import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Activity, Dumbbell, Stethoscope, Zap, ChevronRight } from "lucide-react";
import { painMapRegions, type PainMapRegion } from "@/data/educationalModules";
import { ModulePage } from "@/react-app/components/student/ModulePage";

interface Props {
  onBack: () => void;
}

export default function PainMapModule({ onBack }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [selectedRegion, setSelectedRegion] = useState<PainMapRegion | null>(null);

  return (
    <AnimatePresence mode="wait">
      {selectedRegion ? (
        <ModulePage key="detail" className="min-h-screen bg-gray-50 pb-24 md:pb-8">
        {/* Header - Mobile optimized */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
            <button
              onClick={() => setSelectedRegion(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">{selectedRegion.icon}</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{selectedRegion.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500">Mapa clínico completo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Clinical Hypotheses */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Hipóteses Clínicas</h2>
            </div>
            <div className="space-y-2">
              {selectedRegion.clinicalHypotheses.map((hypothesis, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 text-xs sm:text-sm">{hypothesis}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Involved Muscles */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Músculos Envolvidos</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {selectedRegion.involvedMuscles.map((muscle, i) => (
                <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-50 text-orange-700 text-xs sm:text-sm font-medium rounded-lg border border-orange-200">
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Tests */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Testes Clínicos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedRegion.clinicalTests.map((test, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 sm:p-3 bg-emerald-50 rounded-lg">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                  <span className="text-slate-700 text-xs sm:text-sm">{test}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Initial Treatments */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Condutas Iniciais</h2>
            </div>
            <div className="space-y-2">
              {selectedRegion.initialTreatments.map((treatment, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-teal-50 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-xs sm:text-sm">{treatment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModulePage>
      ) : (
      <ModulePage key="list" className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mapa da Dor</h1>
              <p className="text-xs sm:text-sm text-gray-500">Selecione uma região</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {painMapRegions.map((region, index) => (
            <motion.button
              key={region.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelectedRegion(region)}
              className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-5 text-center shadow-sm hover:border-teal-300 hover:shadow-md active:scale-[0.97] transition-all group touch-manipulation"
            >
              <span className="text-3xl sm:text-4xl block mb-2 sm:mb-3">{region.icon}</span>
              <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors text-sm sm:text-base">
                {region.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                {region.clinicalHypotheses.length} hipóteses
              </p>
            </motion.button>
          ))}
        </div>
      </div>
      </ModulePage>
      )}
    </AnimatePresence>
  );
}
