import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ChevronRight, Dumbbell, FileText, Heart, Lightbulb, Pencil, Plus, Sparkles, Stethoscope } from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Spinner } from "@/react-app/components/ui/microinteractions";
import ClinicalInsights from "@/react-app/components/ClinicalInsights";
import { HighlightedADM } from "@/react-app/lib/admHighlight";
import type { Evaluation } from "@/react-app/hooks/useEvaluations";

interface SuggestedExercise {
  id: string;
  name: string;
  category: string;
  sets: string;
  reps: string;
  matchReason: string;
}

interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

interface PatientEvaluationsTabProps {
  evaluations: Evaluation[];
  loading: boolean;
  onNew: () => void;
  onEdit: (evaluation: Evaluation) => void;
  suggestedExercises: SuggestedExercise[];
  getCategoryInfo: (categoryId: string) => CategoryInfo;
}

export function PatientEvaluationsTab({ evaluations, loading, onNew, onEdit, suggestedExercises, getCategoryInfo }: PatientEvaluationsTabProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Registros de Avaliação</h2>
          <p className="text-sm text-muted-foreground">Histórico completo de avaliações clínicas</p>
        </div>
        <Button onClick={onNew} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Nova Avaliação
        </Button>
      </div>

      {evaluations.length > 0 && evaluations[0]?.pain_location && (
        <ClinicalInsights
          painLocation={evaluations[0].pain_location || ""}
          chiefComplaint={evaluations[0].chief_complaint || ""}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : evaluations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Nenhuma avaliação registrada</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Registre a primeira avaliação para iniciar o prontuário clínico.
          </p>
          <Button onClick={onNew} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Avaliação
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border border-white/10 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/80 overflow-hidden group">
                <CardHeader className="pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${evaluation.type === "initial" ? "bg-primary/10" : "bg-violet-500/10"}`}>
                        <Stethoscope className={`w-5 h-5 ${evaluation.type === "initial" ? "text-primary" : "text-violet-500"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">
                          {evaluation.type === "initial" ? "Avaliação Inicial" : "Reavaliação"}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evaluation.created_at.replace(' ', 'T') + 'Z').toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {evaluation.pain_level !== null && (
                        <Badge variant="outline" className="font-bold">
                          <Heart className="w-3 h-3 mr-1 text-rose-500" />
                          {evaluation.pain_level}/10
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onEdit(evaluation)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {evaluation.chief_complaint && (
                    <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Queixa Principal</span>
                      <p className="text-sm text-foreground mt-1">{evaluation.chief_complaint}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evaluation.pain_location && (
                      <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Local da Dor</span>
                        <p className="text-sm mt-1">{evaluation.pain_location}</p>
                      </div>
                    )}
                    {evaluation.functional_status && (
                      <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Funcional</span>
                        <p className="text-sm mt-1"><HighlightedADM text={evaluation.functional_status} /></p>
                      </div>
                    )}
                  </div>
                  {evaluation.orthopedic_tests && (
                    <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Testes Ortopédicos</span>
                      <p className="text-sm mt-1">{evaluation.orthopedic_tests}</p>
                    </div>
                  )}
                  {evaluation.observations && (
                    <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Observações</span>
                      <p className="text-sm mt-1">{evaluation.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {suggestedExercises.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Exercícios Sugeridos</h3>
                <p className="text-xs text-muted-foreground">Baseados na avaliação do paciente</p>
              </div>
            </div>
            <Link to="/dashboard/exercicios">
              <Button variant="outline" size="sm" className="gap-2">
                Ver Biblioteca
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestedExercises.map((exercise, index) => {
              const categoryInfo = getCategoryInfo(exercise.category);
              return (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate("/dashboard/exercicios")}
                >
                  <Card className="h-full border border-white/10 hover:border-amber-500/30 transition-all bg-gradient-to-br from-amber-500/5 to-orange-500/5 hover:shadow-lg hover:shadow-amber-500/10 group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center text-lg flex-shrink-0`}>
                          {categoryInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-500 transition-colors">
                            {exercise.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {categoryInfo.name}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              {exercise.sets}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              {exercise.reps}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            {exercise.matchReason}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <Dumbbell className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Estas sugestões são baseadas na localização da dor e queixa principal.
                Acesse a <Link to="/dashboard/exercicios" className="font-semibold underline hover:no-underline">Biblioteca de Exercícios</Link> para ver todos os detalhes e prescrever ao paciente.
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
