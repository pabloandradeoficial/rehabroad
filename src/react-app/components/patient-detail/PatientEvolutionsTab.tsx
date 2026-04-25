import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Activity, Calendar, Heart, Pencil, Plus } from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Spinner } from "@/react-app/components/ui/microinteractions";
import { HighlightedADM } from "@/react-app/lib/admHighlight";
import type { Evaluation } from "@/react-app/hooks/useEvaluations";
import type { Evolution } from "@/react-app/hooks/useEvolutions";

const EvolutionChart = lazy(() => import("@/react-app/components/EvolutionChart"));

interface PatientEvolutionsTabProps {
  evolutions: Evolution[];
  evaluations: Evaluation[];
  loading: boolean;
  onNew: () => void;
  onEdit: (evolution: Evolution) => void;
}

export function PatientEvolutionsTab({ evolutions, evaluations, loading, onNew, onEdit }: PatientEvolutionsTabProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Registros de Evolução</h2>
          <p className="text-sm text-muted-foreground">
            {evolutions.length > 0
              ? `${evolutions.length} ${evolutions.length === 1 ? "sessão registrada" : "sessões registradas"}`
              : "Acompanhe o progresso do tratamento"}
          </p>
        </div>
        <Button onClick={onNew} className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" />
          Nova Evolução
        </Button>
      </div>

      {!loading && evolutions.length >= 1 && (
        <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
          <EvolutionChart evolutions={evolutions} evaluations={evaluations} />
        </Suspense>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : evolutions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Nenhuma evolução registrada</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Registre as sessões de tratamento para acompanhar a evolução.
          </p>
          <Button onClick={onNew} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Primeira Sessão
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {evolutions.map((evolution, index) => (
            <motion.div
              key={evolution.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border border-white/10 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/80 overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">
                          Sessão #{evolutions.length - index}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evolution.session_date + 'T12:00:00').toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {evolution.pain_level !== null && (
                        <Badge variant="outline" className="font-bold">
                          <Heart className="w-3 h-3 mr-1 text-rose-500" />
                          {evolution.pain_level}/10
                        </Badge>
                      )}
                      {evolution.patient_response && (
                        <Badge className={
                          evolution.patient_response === "positive" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                          evolution.patient_response === "negative" ? "bg-rose-500/10 text-rose-600 border-rose-500/30" :
                          "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }>
                          {evolution.patient_response === "positive" ? "Positiva" :
                            evolution.patient_response === "negative" ? "Negativa" : "Neutra"}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(evolution)}
                        className="h-8 px-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {evolution.procedures && (
                    <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Procedimentos</span>
                      <p className="text-sm mt-1">{evolution.procedures}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evolution.functional_status && (
                      <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Funcional</span>
                        <p className="text-sm mt-1"><HighlightedADM text={evolution.functional_status} /></p>
                      </div>
                    )}
                    {evolution.observations && (
                      <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Observações</span>
                        <p className="text-sm mt-1">{evolution.observations}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
