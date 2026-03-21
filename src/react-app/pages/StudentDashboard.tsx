import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import {
  BookOpen,
  Trophy,
  Target,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Brain,
  Stethoscope,
  Activity,
  AlertTriangle,
  Flame,
  Clock,
  Share2,
  Copy,
  MessageCircle,
  Crown,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import {
  clinicalCases,
  caseCategories,
  getRandomCase,
  type ClinicalCase,
} from "@/data/clinicalCases";
import { SuccessAnimation } from "@/react-app/components/StudentProgressWidgets";

type ViewMode = "dashboard" | "case" | "result" | "ranking";

interface RankingUser {
  user_name: string;
  cases_completed: number;
  cases_correct: number;
  streak: number;
  accuracy: number;
}

interface CaseProgress {
  caseId: string;
  correct: boolean;
  selectedOption: string;
  completedAt: string;
}

interface StudentDashboardProps {
  onProgressUpdate?: () => void;
}

function parseStoredProgress(raw: string | null): CaseProgress[] {
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(
      (item): item is CaseProgress =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.caseId === "string" &&
        typeof item.correct === "boolean" &&
        typeof item.selectedOption === "string" &&
        typeof item.completedAt === "string"
    );
  } catch {
    return [];
  }
}

export default function StudentDashboard({
  onProgressUpdate,
}: StudentDashboardProps = {}) {
  const { user } = useAppAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showClinicalReasoning, setShowClinicalReasoning] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [progress, setProgress] = useState<CaseProgress[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const progressKey = user?.id
      ? `rehabroad_student_progress_${user.id}`
      : "rehabroad_student_progress_guest";

    const parsed = parseStoredProgress(localStorage.getItem(progressKey));
    setProgress(parsed);
  }, [user?.id]);

  useEffect(() => {
    if (viewMode !== "ranking" || ranking.length > 0) {
      return;
    }

    let isMounted = true;

    const loadRanking = async () => {
      setLoadingRanking(true);

      try {
        const res = await fetch("/api/student/ranking", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Ranking request failed: ${res.status}`);
        }

        const data = await res.json();

        if (!isMounted) return;

        setRanking(Array.isArray(data?.ranking) ? data.ranking : []);
      } catch (error) {
        console.error("Error loading student ranking:", error);

        if (!isMounted) return;
        setRanking([]);
      } finally {
        if (isMounted) {
          setLoadingRanking(false);
        }
      }
    };

    void loadRanking();

    return () => {
      isMounted = false;
    };
  }, [viewMode, ranking.length]);

  const stats = useMemo(() => {
    const completed = progress.length;
    const correct = progress.filter((p) => p.correct).length;
    const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;
    return { completed, correct, accuracy, total: clinicalCases.length };
  }, [progress]);

  const filteredCases = useMemo(() => {
    return clinicalCases.filter((c) => {
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [categoryFilter, difficultyFilter]);

  const getCaseStatus = (caseId: string) => {
    const p = progress.find((p) => p.caseId === caseId);
    if (!p) return "pending";
    return p.correct ? "correct" : "incorrect";
  };

  const handleStartCase = (clinicalCase: ClinicalCase, isDaily = false) => {
    setSelectedCase(clinicalCase);
    setSelectedAnswer(null);
    setShowClinicalReasoning(false);
    setIsDailyChallenge(isDaily);
    setViewMode("case");
  };

  const handleDailyChallenge = () => {
    const randomCase = getRandomCase();
    handleStartCase(randomCase, true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !selectedCase) return;

    const option = selectedCase.diagnosticOptions.find((o) => o.id === selectedAnswer);
    const isCorrect = option?.isCorrect || false;
    const alreadyAnswered = progress.find((p) => p.caseId === selectedCase.id);

    const newProgress: CaseProgress = {
      caseId: selectedCase.id,
      correct: isCorrect,
      selectedOption: selectedAnswer,
      completedAt: new Date().toISOString(),
    };

    if (!alreadyAnswered) {
      const updated = [...progress, newProgress];
      setProgress(updated);

      const progressKey = user?.id
        ? `rehabroad_student_progress_${user.id}`
        : "rehabroad_student_progress_guest";
      localStorage.setItem(progressKey, JSON.stringify(updated));

      if (isCorrect) {
        setShowSuccessAnimation(true);
      }

      if (user?.id) {
        // POST to server - retry once on failure
        const postProgress = async (retries = 1) => {
          try {
            const res = await fetch("/api/student/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                cases_completed: 1,
                cases_correct: isCorrect ? 1 : 0,
              }),
            });
            if (!res.ok && retries > 0) {
              setTimeout(() => postProgress(retries - 1), 1000);
            } else if (res.ok && onProgressUpdate) {
              onProgressUpdate();
            }
          } catch (e) {
            console.error("Error saving progress:", e);
            if (retries > 0) setTimeout(() => postProgress(retries - 1), 1000);
          }
        };
        void postProgress();
      }
    }

    setViewMode("result");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setSelectedCase(null);
    setSelectedAnswer(null);
    setShowClinicalReasoning(false);
    setIsDailyChallenge(false);
  };

  const handleShare = async (method: "whatsapp" | "copy") => {
    const message = `🎓 Resolvi um caso clínico no RehabRoad!\n\n📊 ${stats.completed} casos | ${stats.accuracy}% de acerto\n\nTreine também: rehabroad.com.br/estudante`;

    if (method === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      await navigator.clipboard.writeText(message);
      alert("Copiado!");
    }
    setShowShareDialog(false);
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          label: "Fácil",
        };
      case "medio":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          label: "Médio",
        };
      case "dificil":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          label: "Difícil",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          label: difficulty,
        };
    }
  };

  // Dashboard View
  if (viewMode === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-4 pb-28 md:pb-8">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
              Casos Clínicos
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Pratique raciocínio diagnóstico
            </p>
          </div>

          {/* Daily Challenge */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <button
                onClick={handleDailyChallenge}
                className="w-full flex items-center justify-between gap-3 touch-manipulation active:opacity-90 min-h-[56px]"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-base sm:text-lg">Desafio Aleatório</p>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Caso surpresa para testar você
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              </button>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {stats.completed}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">Resolvidos</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {stats.accuracy}%
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">Acertos</p>
              </CardContent>
            </Card>

            <Card
              className="border-0 shadow-sm active:shadow-md transition-shadow bg-gradient-to-br from-amber-50 to-orange-50 touch-manipulation"
              onClick={() => setViewMode("ranking")}
            >
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-700">
                  Ranking
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">Top 10</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Progresso Geral
                  </span>
                </div>
                <span className="text-sm font-semibold text-teal-600">
                  {stats.completed}/{stats.total} casos
                </span>
              </div>
              <Progress
                value={(stats.completed / stats.total) * 100}
                className="h-2.5"
              />
              <p className="text-xs text-slate-500 mt-2">
                {stats.correct} acertos de {stats.completed} tentativas
              </p>
            </CardContent>
          </Card>

          {/* Filters - Mobile optimized */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-2.5 sm:px-3 py-2.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent touch-manipulation"
            >
              <option value="all">Todas Regiões</option>
              {caseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="flex-1 px-2.5 sm:px-3 py-2.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent touch-manipulation"
            >
              <option value="all">Dificuldade</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredCases.map((clinicalCase, index) => {
              const status = getCaseStatus(clinicalCase.id);
              const difficulty = getDifficultyStyle(clinicalCase.difficulty);

              return (
                <motion.div
                  key={clinicalCase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card
                    className={`border-0 shadow-sm active:shadow-md sm:hover:shadow-md transition-all cursor-pointer group h-full touch-manipulation ${
                      status === "correct"
                        ? "ring-2 ring-emerald-200"
                        : status === "incorrect"
                          ? "ring-2 ring-red-200"
                          : ""
                    }`}
                    onClick={() => handleStartCase(clinicalCase)}
                  >
                    <CardContent className="p-3.5 sm:p-4">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <Badge
                          className={`${difficulty.bg} ${difficulty.text} border ${difficulty.border} text-[10px] sm:text-xs`}
                        >
                          {difficulty.label}
                        </Badge>
                        {status === "correct" && (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        )}
                        {status === "incorrect" && (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2 group-active:text-teal-600 sm:group-hover:text-teal-600 transition-colors line-clamp-2">
                        {clinicalCase.title}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded-full">
                          {clinicalCase.specialty}
                        </span>
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded-full">
                          {clinicalCase.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-500">
                        <p className="text-xs sm:text-sm">
                          {clinicalCase.patientProfile.gender === "M" ? "♂" : "♀"}{" "}
                          {clinicalCase.patientProfile.age}a
                        </p>
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {clinicalCase.estimatedTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Case View
  if (viewMode === "case" && selectedCase) {
    const difficulty = getDifficultyStyle(selectedCase.difficulty);

    return (
      <div className="min-h-screen bg-slate-50 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar aos casos
          </button>

          {isDailyChallenge && (
            <div className="mb-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-4 text-center">
              <p className="font-bold flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" />
                Desafio Aleatório
              </p>
            </div>
          )}

          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  className={`${difficulty.bg} ${difficulty.text} border ${difficulty.border}`}
                >
                  {difficulty.label}
                </Badge>
                <Badge variant="outline">{selectedCase.category}</Badge>
                <Badge variant="outline">{selectedCase.specialty}</Badge>
              </div>

              <h1 className="text-xl font-bold text-slate-900 mb-4">
                {selectedCase.title}
              </h1>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-500" />
                  Paciente
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Idade:</span>{" "}
                    <span className="font-medium">
                      {selectedCase.patientProfile.age} anos
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Sexo:</span>{" "}
                    <span className="font-medium">
                      {selectedCase.patientProfile.gender === "M"
                        ? "Masculino"
                        : "Feminino"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Ocupação:</span>{" "}
                    <span className="font-medium">
                      {selectedCase.patientProfile.occupation}
                    </span>
                  </div>
                  {selectedCase.patientProfile.lifestyle && (
                    <div>
                      <span className="text-slate-500">Estilo:</span>{" "}
                      <span className="font-medium">
                        {selectedCase.patientProfile.lifestyle}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  História
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {selectedCase.history}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Sintomas
                </h3>
                <ul className="space-y-1">
                  {selectedCase.symptoms.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-slate-700 text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-500" />
                  Achados Clínicos
                </h3>
                <ul className="space-y-1">
                  {selectedCase.clinicalFindings.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-slate-700 text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-violet-600" />
                Qual é a sua hipótese diagnóstica?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="space-y-3 mb-6">
                {selectedCase.diagnosticOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === option.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option.id
                            ? "border-teal-500 bg-teal-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedAnswer === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium text-sm ${
                          selectedAnswer === option.id
                            ? "text-teal-700"
                            : "text-slate-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700"
              >
                Confirmar Resposta
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Result View
  if (viewMode === "result" && selectedCase) {
    const selectedOption = selectedCase.diagnosticOptions.find(
      (o) => o.id === selectedAnswer
    );
    const isCorrect = selectedOption?.isCorrect || false;

    return (
      <div className="min-h-screen bg-slate-50 py-6 px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <SuccessAnimation
            show={showSuccessAnimation}
            onComplete={() => setShowSuccessAnimation(false)}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center p-8 rounded-2xl mb-6 ${
              isCorrect
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
            </h2>
            <p className="text-white/80">
              {isCorrect
                ? "Excelente raciocínio clínico!"
                : "Use esta oportunidade para aprender."}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Target className="w-5 h-5 text-white" />
              <span className="text-white font-bold">
                {stats.accuracy}% de acerto
              </span>
            </div>
          </motion.div>

          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                Diagnóstico Correto
              </h3>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-bold text-teal-700">
                  {selectedCase.correctDiagnosis}
                </p>
              </div>

              {!isCorrect && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-600">
                    <strong>Sua resposta:</strong> {selectedOption?.label}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setShowClinicalReasoning(!showClinicalReasoning)}
                className="w-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                {showClinicalReasoning ? "Ocultar" : "Ver"} Raciocínio Clínico
              </Button>
            </CardContent>
          </Card>

          {showClinicalReasoning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Explicação
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedCase.clinicalExplanation}
                  </p>

                  {selectedCase.tips && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <strong>💡 Dica:</strong> {selectedCase.tips}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-indigo-500" />
                    Testes Recomendados
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.recommendedTests.map((test, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-700 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Conduta Inicial
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.initialTreatment.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-700 text-sm"
                      >
                        <ArrowRight className="w-4 h-4 text-emerald-500 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleBackToDashboard}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700"
            >
              Próximo Caso
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(true)}
              className="w-full h-12"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {showShareDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-md p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Compartilhar
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => void handleShare("whatsapp")}
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void handleShare("copy")}
                    className="w-full h-12"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowShareDialog(false)}
                    className="w-full h-12"
                  >
                    Cancelar
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Ranking View
  if (viewMode === "ranking") {
    return (
      <div className="min-h-screen bg-slate-50 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setViewMode("dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              Ranking
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Top Estudantes
            </h1>
          </div>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-teal-500 to-emerald-500 text-white mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-white/80 text-sm">Casos</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-white/80 text-sm">Acertos</p>
                  <p className="text-3xl font-bold">{stats.correct}</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-white/80 text-sm">Taxa</p>
                  <p className="text-3xl font-bold">{stats.accuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Classificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRanking ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-slate-600">Carregando...</p>
                </div>
              ) : ranking.length === 0 ? (
                <div className="text-center py-12">
                  <Crown className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Nenhum estudante ainda.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {ranking.map((u, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        i === 0
                          ? "bg-amber-50 border-2 border-amber-200"
                          : i === 1
                            ? "bg-slate-50 border border-slate-200"
                            : i === 2
                              ? "bg-orange-50 border border-orange-200"
                              : "bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          i === 0
                            ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white"
                            : i === 1
                              ? "bg-gradient-to-br from-slate-300 to-gray-400 text-white"
                              : i === 2
                                ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white"
                                : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {u.user_name || "Anônimo"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {u.cases_completed} casos • {u.accuracy}% acerto
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-teal-600 font-bold">
                          <Target className="w-4 h-4" />
                          {u.accuracy}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}