import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Brain, Users, Stethoscope, ClipboardCheck, Info, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface ClinicalInsightsData {
  similarCases: number;
  topDiagnoses: { name: string; count: number; percentage: number }[];
  topTests: { name: string; count: number }[];
}

interface ClinicalInsightsProps {
  painLocation: string;
  chiefComplaint?: string;
}

export default function ClinicalInsights({ painLocation, chiefComplaint }: ClinicalInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<ClinicalInsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!painLocation && !chiefComplaint) {
      setData(null);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (painLocation) params.append("pain_location", painLocation);
        if (chiefComplaint) params.append("chief_complaint", chiefComplaint);
        
        const response = await fetch(`/api/clinical-insights?${params.toString()}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch {
        /* ignore error */
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [painLocation, chiefComplaint]);

  if (!painLocation && !chiefComplaint) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-violet-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              Insights Clínicos
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Beta
              </Badge>
            </h3>
            <p className="text-sm text-slate-500">
              {loading ? "Carregando..." : data ? `${data.similarCases} casos semelhantes` : "Dados coletivos anonimizados"}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-violet-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-violet-600" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-4 px-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : data ? (
                <>
                  {/* Similar Cases */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-violet-100">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-violet-700">{data.similarCases}</p>
                      <p className="text-sm text-slate-500">Casos semelhantes registrados</p>
                    </div>
                  </div>

                  {/* Top Diagnoses */}
                  {data.topDiagnoses.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Stethoscope className="w-4 h-4 text-violet-500" />
                        Diagnósticos mais frequentes
                      </div>
                      <div className="space-y-2">
                        {data.topDiagnoses.map((diagnosis, index) => (
                          <div
                            key={diagnosis.name}
                            className="flex items-center gap-3 p-2 bg-white rounded-lg border border-violet-100"
                          >
                            <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-sm font-bold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {diagnosis.name}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                              {diagnosis.percentage}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Tests */}
                  {data.topTests.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <ClipboardCheck className="w-4 h-4 text-violet-500" />
                        Testes mais utilizados
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.topTests.map((test) => (
                          <Badge
                            key={test.name}
                            variant="outline"
                            className="bg-white border-violet-200 text-slate-700"
                          >
                            {test.name}
                            <span className="ml-1 text-violet-500">({test.count})</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="flex gap-2 p-3 bg-violet-100/50 rounded-xl text-xs text-slate-600">
                    <Info className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p>
                        Esses dados são baseados em avaliações clínicas registradas no sistema por outros fisioterapeutas.
                      </p>
                      <p>
                        As informações são <strong>anonimizadas</strong> e servem apenas como apoio ao raciocínio clínico.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500">
                  Nenhum dado disponível para esta localização
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
