import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Dumbbell, ChevronRight, Clock, Repeat, Calendar, AlertTriangle, Lightbulb, CheckCircle2, X, User, Send, Sparkles, BookOpen, Target, MessageCircle, Grid3X3, List, Brain } from "lucide-react";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/react-app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { PageTransition, useToast } from "@/react-app/components/ui/microinteractions";
import { exercises, exerciseCategories, getExercisesByCategory, searchExercises, type Exercise } from "@/data/exercises";
import { usePatients } from "@/react-app/hooks/usePatients";
import { useClinicalContext } from "@/react-app/hooks/useClinicalContext";
import { useExerciseRecommendations } from "@/react-app/hooks/useExerciseRecommendations";
import { cn } from "@/react-app/lib/utils";
import { openWhatsApp, createExercisePrescriptionMessage } from "@/react-app/lib/whatsapp";
import PremiumGate from "@/react-app/components/PremiumGate";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";

const difficultyConfig = {
  iniciante: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30", gradient: "from-emerald-500 to-emerald-600" },
  intermediário: { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30", gradient: "from-amber-500 to-amber-600" },
  avançado: { bg: "bg-rose-500/15", text: "text-rose-500", border: "border-rose-500/30", gradient: "from-rose-500 to-rose-600" },
};

function ExerciciosContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseDetailOpen, setExerciseDetailOpen] = useState(false);
  const [prescribeDialogOpen, setPrescribeDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [contextPatientId, setContextPatientId] = useState<string>("");
  const { patients } = usePatients();
  const toast = useToast();

  const { context: clinicalContext } = useClinicalContext(contextPatientId || null);
  const recommendations = useExerciseRecommendations(clinicalContext, exercises);

  const filteredExercises = useMemo(() => {
    if (searchQuery.trim()) return searchExercises(searchQuery);
    if (selectedCategory) return getExercisesByCategory(selectedCategory);
    if (contextPatientId && recommendations.contextUsed) return recommendations.recommended;
    return exercises;
  }, [searchQuery, selectedCategory, contextPatientId, recommendations]);

  const openExerciseDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseDetailOpen(true);
  };

  const closeExerciseDetail = () => {
    setExerciseDetailOpen(false);
    setSelectedExercise(null);
  };

  const handlePrescribe = async () => {
    if (!selectedExercise || !selectedPatientId) return;
    const patient = patients.find(p => p.id.toString() === selectedPatientId);
    toast.showSuccess(`Exercício prescrito para ${patient?.name || "paciente"}`);
    setPrescribeDialogOpen(false);
    setSelectedExercise(null);
    setSelectedPatientId("");
    setPrescriptionNotes("");
  };

  const openPrescribeDialog = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseDetailOpen(false);
    setPrescribeDialogOpen(true);
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-6">
        {/* Hero Header */}
        <motion.div
          className="relative overflow-hidden rounded-2xl mx-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-500 to-emerald-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.3),transparent_50%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                    <Dumbbell className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Recurso Premium</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Biblioteca de Exercícios</h1>
                  <p className="text-teal-100 mt-1">Exercícios terapêuticos com instruções detalhadas</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-white" />
                    <span className="text-2xl font-black text-white">{exercises.length}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">exercícios</p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-white" />
                    <span className="text-2xl font-black text-white">{exerciseCategories.length}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">categorias</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg shadow-primary/20">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <Input
                    placeholder="Buscar exercícios por nome ou região..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
                    className="pl-16 h-14 text-base bg-white/[0.02] border-white/10 focus:border-primary/50 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-white/10 p-1 bg-white/[0.02]">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2.5 rounded-lg transition-all",
                        viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2.5 rounded-lg transition-all",
                        viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  {(searchQuery || selectedCategory) && (
                    <Button
                      variant="outline"
                      onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                      className="gap-2 h-12 border-white/10 hover:bg-white/[0.05]"
                    >
                      <X className="w-4 h-4" />
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Context Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Filtrar por paciente</p>
                    <p className="text-xs text-muted-foreground">Exercícios adaptados ao quadro clínico</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={contextPatientId}
                    onValueChange={(val) => {
                      setContextPatientId(val);
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[220px] h-10 text-sm border-white/10 bg-white/[0.02]">
                      <SelectValue placeholder="Selecionar paciente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {contextPatientId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setContextPatientId("")}
                      className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {exerciseCategories.map((category, index) => {
              const count = getExercisesByCategory(category.id).length;
              const isSelected = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden group",
                    isSelected ? "shadow-2xl" : "shadow-lg hover:shadow-xl"
                  )}
                >
                  {/* Background */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                  </div>
                  <div className={cn(
                    "absolute inset-0 bg-card border border-white/10 rounded-2xl transition-opacity duration-300",
                    isSelected ? "opacity-0" : "opacity-100 group-hover:border-primary/30"
                  )} />
                  
                  <div className="relative">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-all shadow-lg",
                      isSelected ? "bg-white/20" : `bg-gradient-to-br ${category.color}`
                    )}>
                      {category.icon}
                    </div>
                    <div className={cn("font-bold text-lg transition-colors", isSelected ? "text-white" : "text-foreground")}>
                      {category.name}
                    </div>
                    <div className={cn("text-sm mt-1 transition-colors", isSelected ? "text-white/80" : "text-muted-foreground")}>
                      {count} exercícios
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Context Banner */}
        <AnimatePresence>
          {contextPatientId && clinicalContext && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/20">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      Filtrado para {clinicalContext.patient.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {clinicalContext.clinicalFlags.isChronic
                        ? "Fase crônica"
                        : clinicalContext.clinicalFlags.isSubacute
                        ? "Fase subaguda"
                        : "Fase aguda"}
                      {clinicalContext.evolutionSummary.currentPainLevel != null &&
                        ` · Dor ${clinicalContext.evolutionSummary.currentPainLevel}/10`}
                      {" · "}
                      {clinicalContext.evolutionSummary.painTrend === "improving"
                        ? "↓ Melhorando"
                        : clinicalContext.evolutionSummary.painTrend === "worsening"
                        ? "↑ Piorando"
                        : "→ Estável"}
                    </p>
                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 truncate">
                      Mostrando {recommendations.recommended.length} de{" "}
                      {recommendations.totalAvailable} exercícios adequados ao quadro
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContextPatientId("")}
                  className="shrink-0 gap-1.5 border-violet-500/25 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 text-xs h-8"
                >
                  <X className="w-3 h-3" />
                  Ver todos os exercícios
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filteredExercises.length}</span> exercício{filteredExercises.length !== 1 ? "s" : ""}
            {selectedCategory && (
              <span> em <strong className="text-primary">{exerciseCategories.find(c => c.id === selectedCategory)?.name}</strong></span>
            )}
          </p>
        </div>

        {/* Exercise List */}
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise, index) => {
                const category = exerciseCategories.find(c => c.id === exercise.category);
                const difficulty = difficultyConfig[exercise.difficulty];
                
                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => openExerciseDetail(exercise)}
                    className="cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                  >
                    <Card className="h-full relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category?.color || "from-gray-500 to-gray-600"}`} />
                      <CardContent className="p-5">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl transition-transform group-hover:scale-110",
                          `bg-gradient-to-br ${category?.color || "from-gray-500 to-gray-600"}`
                        )}>
                          <span className="text-3xl">{category?.icon || "💪"}</span>
                        </div>
                        
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {exercise.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn(difficulty.bg, difficulty.text, difficulty.border, "font-semibold border")}>
                            {exercise.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="gap-1 bg-white/[0.05] border-white/10">
                            <Repeat className="w-3 h-3" />
                            {exercise.sets}×{exercise.reps}
                          </Badge>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/20">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full gap-2 h-8 text-xs text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPrescribeDialog(exercise);
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            Enviar para Paciente
                          </Button>
                        </div>

                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExercises.map((exercise, index) => {
                const category = exerciseCategories.find(c => c.id === exercise.category);
                const difficulty = difficultyConfig[exercise.difficulty];
                
                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => openExerciseDetail(exercise)}
                    className="cursor-pointer hover:translate-x-1 transition-transform duration-200"
                  >
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${category?.color || "from-gray-500 to-gray-600"}`} />
                      <CardContent className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
                            `bg-gradient-to-br ${category?.color || "from-gray-500 to-gray-600"}`
                          )}>
                            <span className="text-2xl">{category?.icon || "💪"}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {exercise.name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {exercise.description}
                            </p>
                          </div>
                          
                          <div className="hidden sm:flex items-center gap-2">
                            <Badge className={cn(difficulty.bg, difficulty.text, difficulty.border, "font-semibold border")}>
                              {exercise.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="gap-1 bg-white/[0.05]">
                              <Repeat className="w-3 h-3" />{exercise.sets}×{exercise.reps}
                            </Badge>
                            <Badge variant="secondary" className="gap-1 bg-white/[0.05]">
                              <Calendar className="w-3 h-3" />{exercise.frequency}
                            </Badge>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="hidden sm:flex gap-1.5 h-8 text-xs text-primary hover:bg-primary/10 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPrescribeDialog(exercise);
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            Enviar
                          </Button>

                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {filteredExercises.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="border-2 border-dashed border-white/10">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <p className="text-lg font-semibold text-muted-foreground">Nenhum exercício encontrado</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Tente ajustar sua busca ou filtros</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Exercise Detail Dialog */}
        <Dialog open={exerciseDetailOpen} onOpenChange={(open) => { if (!open) closeExerciseDetail(); }}>
          <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
            {selectedExercise && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                      `bg-gradient-to-br ${exerciseCategories.find(c => c.id === selectedExercise.category)?.color || "from-gray-500 to-gray-600"}`
                    )}>
                      <span className="text-3xl">
                        {exerciseCategories.find(c => c.id === selectedExercise.category)?.icon || "💪"}
                      </span>
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black">{selectedExercise.name}</DialogTitle>
                      <DialogDescription className="mt-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {exerciseCategories.find(c => c.id === selectedExercise.category)?.name}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn(
                      difficultyConfig[selectedExercise.difficulty].bg,
                      difficultyConfig[selectedExercise.difficulty].text,
                      difficultyConfig[selectedExercise.difficulty].border,
                      "font-semibold border"
                    )}>
                      {selectedExercise.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Repeat className="w-3 h-3" />{selectedExercise.sets} × {selectedExercise.reps}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <Calendar className="w-3 h-3" />{selectedExercise.frequency}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-teal-500/5 border border-primary/10">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Descrição
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedExercise.description}</p>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Passo a Passo
                    </h4>
                    <ol className="space-y-3">
                      {selectedExercise.instructions.map((instruction, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-teal-500 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-lg">
                            {i + 1}
                          </span>
                          <span className="text-sm text-muted-foreground pt-1.5 leading-relaxed">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Equipment */}
                  {selectedExercise.equipment.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                      <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Equipamentos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.equipment.map((item, i) => (
                          <Badge key={i} className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contraindications */}
                  {selectedExercise.contraindications.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/20">
                      <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Contraindicações
                      </h4>
                      <ul className="space-y-2">
                        {selectedExercise.contraindications.map((item, i) => (
                          <li key={i} className="text-sm text-rose-600/90 dark:text-rose-400/90 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips */}
                  {selectedExercise.tips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                      <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Dicas Importantes
                      </h4>
                      <ul className="space-y-2">
                        {selectedExercise.tips.map((item, i) => (
                          <li key={i} className="text-sm text-emerald-600/90 dark:text-emerald-400/90 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => openPrescribeDialog(selectedExercise)}
                      className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-teal-500 shadow-xl shadow-primary/20 font-bold"
                    >
                      <Send className="w-4 h-4" />
                      Prescrever para Paciente
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedExercise(null)} className="h-12 border-white/10">
                      Fechar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Prescribe Dialog */}
        <Dialog open={prescribeDialogOpen} onOpenChange={(open) => { setPrescribeDialogOpen(open); if (!open) setSelectedExercise(null); }}>
          <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                Prescrever Exercício
              </DialogTitle>
              <DialogDescription>{selectedExercise?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">Selecione o Paciente</label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="h-12 bg-white/[0.02] border-white/10">
                    <SelectValue placeholder="Escolha um paciente..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {patients.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum paciente cadastrado</SelectItem>
                    ) : (
                      patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          <span className="flex items-center gap-2"><User className="w-4 h-4" />{patient.name}</span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">Observações (opcional)</label>
                <Input
                  placeholder="Ex: Realizar com cautela, aumentar repetições gradualmente..."
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  className="h-12 bg-white/[0.02] border-white/10"
                />
              </div>

              {selectedExercise && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-teal-500/5 border border-primary/10">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Repeat className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{selectedExercise.sets} × {selectedExercise.reps}</span>
                    <span className="text-muted-foreground/30">•</span>
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span className="font-semibold">{selectedExercise.frequency}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                {selectedPatientId && selectedExercise && (() => {
                  const patient = patients.find(p => p.id.toString() === selectedPatientId);
                  return patient?.phone ? (
                    <Button
                      onClick={() => {
                        const message = createExercisePrescriptionMessage(
                          patient.name, "Seu Fisioterapeuta",
                          [{ name: selectedExercise.name, sets: selectedExercise.sets, reps: selectedExercise.reps, frequency: selectedExercise.frequency, instructions: selectedExercise.instructions }],
                          prescriptionNotes || undefined
                        );
                        openWhatsApp(patient.phone!, message);
                        toast.showSuccess(`Prescrição enviada via WhatsApp para ${patient.name}`);
                        setPrescribeDialogOpen(false);
                        setSelectedPatientId("");
                        setPrescriptionNotes("");
                      }}
                      className="w-full h-12 gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-xl shadow-green-500/20 font-bold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar via WhatsApp
                    </Button>
                  ) : (
                    <div className="text-xs text-center text-muted-foreground py-3 px-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      📱 Paciente sem telefone cadastrado
                    </div>
                  );
                })()}
                
                <div className="flex gap-3">
                  <Button
                    onClick={handlePrescribe}
                    disabled={!selectedPatientId}
                    className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-teal-500 shadow-lg shadow-primary/20 font-bold"
                  >
                    <Send className="w-4 h-4" />Registrar
                  </Button>
                  <Button variant="outline" onClick={() => { setPrescribeDialogOpen(false); setSelectedExercise(null); }} className="h-12 border-white/10">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

export default function ExerciciosPage() {
  return (
    <>
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <PremiumGate moduleName="Exercícios">
        <ExerciciosContent />
      </PremiumGate>
    </>
  );
}
