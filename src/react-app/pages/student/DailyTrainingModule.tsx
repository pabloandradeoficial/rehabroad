import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Flame, 
  Trophy,
  Clock,
  CheckCircle2,
  ChevronRight,
  Target,
  RefreshCw,
  XCircle,
  Brain,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { clinicalCases } from "@/data/clinicalCases";

interface DailyTrainingModuleProps {
  onBack: () => void;
  userId?: string;
  onComplete: (isCorrect: boolean) => void;
  currentStreak: number;
  dailyChallengeCompleted: boolean;
}

const QUESTIONS_PER_DAY = 5;

const MOTIVATIONAL_MESSAGES = [
  "Excelente raciocínio clínico!",
  "Bom trabalho! Continue assim.",
  "Você está evoluindo!",
  "Ótima análise!",
];

const ENCOURAGEMENT_MESSAGES = [
  "Não desanime! Faz parte do aprendizado.",
  "Cada erro é uma oportunidade.",
  "Continue praticando!",
];

function getDailyCaseIds(): string[] {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const selectedIds: string[] = [];
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < QUESTIONS_PER_DAY; i++) {
    const seedString = `${dateString}-question-${i}`;
    let hash = 0;
    for (let j = 0; j < seedString.length; j++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(j);
      hash = hash & hash;
    }
    let index = Math.abs(hash) % clinicalCases.length;
    let attempts = 0;
    while (usedIndices.has(index) && attempts < clinicalCases.length) {
      index = (index + 1) % clinicalCases.length;
      attempts++;
    }
    usedIndices.add(index);
    selectedIds.push(clinicalCases[index].id);
  }
  return selectedIds;
}

function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

interface DailyProgress {
  date: string;
  currentQuestion: number;
  answers: { questionIndex: number; correct: boolean; answerId: string }[];
  completed: boolean;
}

type ViewState = 'intro' | 'challenge' | 'question_result' | 'final_result';

export default function DailyTrainingModule({ 
  onBack, 
  onComplete,
  currentStreak,
  userId
}: DailyTrainingModuleProps) {
  const todayKey = getTodayKey();
  const storageKey = userId ? `daily_training_${userId}_${todayKey}` : `daily_training_guest_${todayKey}`;
  
  const loadProgress = (): DailyProgress => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayKey) return parsed;
      }
    } catch { /* ignore */ }
    return { date: todayKey, currentQuestion: 0, answers: [], completed: false };
  };

  const [progress, setProgress] = useState<DailyProgress>(loadProgress);
  const [view, setView] = useState<ViewState>(progress.completed ? 'final_result' : 'intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [resetTimer, setResetTimer] = useState(getTimeUntilReset());
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const dailyCaseIds = useMemo(() => getDailyCaseIds(), []);
  const dailyCases = useMemo(() => 
    dailyCaseIds.map(id => clinicalCases.find(c => c.id === id)!).filter(Boolean),
    [dailyCaseIds]
  );
  
  const currentCase = dailyCases[progress.currentQuestion];

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  useEffect(() => {
    const interval = setInterval(() => setResetTimer(getTimeUntilReset()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setTimerActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatResetTime = () => {
    const { hours, minutes, seconds } = resetTimer;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartChallenge = () => {
    setView('challenge');
    setTimerActive(true);
    setTimeLeft(180);
    setSelectedAnswer(null);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentCase) return;
    setTimerActive(false);
    
    // Fix: Check if the selected option has isCorrect = true
    const selectedOption = currentCase.diagnosticOptions.find(o => o.id === selectedAnswer);
    const correct = selectedOption?.isCorrect === true;
    
    setLastAnswerCorrect(correct);
    
    const newAnswers = [...progress.answers, {
      questionIndex: progress.currentQuestion,
      correct,
      answerId: selectedAnswer
    }];
    
    const isLastQuestion = progress.currentQuestion >= QUESTIONS_PER_DAY - 1;
    setProgress(prev => ({
      ...prev,
      answers: newAnswers,
      currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1,
      completed: isLastQuestion
    }));
    
    onComplete(correct);
    setView('question_result');
  };

  const handleNextQuestion = () => {
    if (progress.completed) {
      setView('final_result');
    } else {
      setView('challenge');
      setTimerActive(true);
      setTimeLeft(180);
      setSelectedAnswer(null);
    }
  };

  const correctCount = progress.answers.filter(a => a.correct).length;
  const totalAnswered = progress.answers.length;

  // Progress Dots Component
  const ProgressDots = () => (
    <div className="flex justify-center gap-2">
      {Array.from({ length: QUESTIONS_PER_DAY }).map((_, i) => {
        const answer = progress.answers[i];
        const isActive = i === progress.currentQuestion && !progress.completed;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: isActive ? 1.2 : 1 }}
            className={`w-3 h-3 rounded-full transition-colors ${
              answer?.correct ? 'bg-emerald-500' : 
              answer ? 'bg-red-400' : 
              isActive ? 'bg-teal-500' : 'bg-slate-200'
            }`}
          />
        );
      })}
    </div>
  );

  // INTRO VIEW
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-6">
        {/* Header - Optimized */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors touch-manipulation p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Treino Diário</h1>
                <p className="text-xs sm:text-sm text-slate-400">5 casos clínicos por dia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Reset Timer */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Novos casos em</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900">{formatResetTime()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-slate-500">Progresso</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">{totalAnswered}/{QUESTIONS_PER_DAY}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Better mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 text-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2 text-orange-500" />
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{currentStreak}</p>
              <p className="text-[10px] sm:text-xs text-slate-500">Dias Seguidos</p>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 text-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 sm:mb-2 text-teal-500" />
              <p className="text-base sm:text-lg font-bold text-slate-900">{progress.answers.filter(a => a.correct).length}/{QUESTIONS_PER_DAY}</p>
              <p className="text-[10px] sm:text-xs text-slate-500">Acertos Hoje</p>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="py-1 sm:py-2">
            <ProgressDots />
          </div>

          {/* Challenge Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5" />
                <span className="font-semibold">
                  {progress.completed ? "Treino Completo!" : `Caso ${progress.currentQuestion + 1} de ${QUESTIONS_PER_DAY}`}
                </span>
              </div>
              <p className="text-sm text-teal-100">
                {progress.completed 
                  ? `Você acertou ${correctCount} de ${QUESTIONS_PER_DAY} casos!`
                  : "Analise o caso e escolha o diagnóstico"}
              </p>
            </div>
            <div className="p-5">
              {progress.completed ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-slate-900 mb-1">Parabéns!</p>
                  <p className="text-sm text-slate-600 mb-4">Volte amanhã para novos casos</p>
                  <Button onClick={() => setView('final_result')} className="w-full bg-teal-600 hover:bg-teal-700">
                    Ver Resultados
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>3 minutos por questão</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4 text-teal-500" />
                      <span>Acompanhe sua taxa de acerto</span>
                    </div>
                    {currentCase && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Target className="w-4 h-4 text-teal-500" />
                        <span>Área: {currentCase.category}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleStartChallenge}
                    className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {totalAnswered > 0 ? "Continuar Treino" : "Começar Treino"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHALLENGE VIEW
  if (view === 'challenge' && currentCase) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 sm:pb-6">
        {/* Header - Sticky & Optimized */}
        <div className="bg-slate-900 text-white sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors touch-manipulation p-1.5 -ml-1.5">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm text-slate-400">
                  {progress.currentQuestion + 1}/{QUESTIONS_PER_DAY}
                </span>
                <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold ${
                  timeLeft <= 30 ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-400'
                }`}>
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <div className="mt-2.5 sm:mt-3">
              <ProgressDots />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {/* Case Card - Optimized readability */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <span className="inline-block px-2 py-0.5 sm:py-1 bg-teal-50 text-teal-700 text-[10px] sm:text-xs font-medium rounded-md mb-2 sm:mb-3">
              {currentCase.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">{currentCase.title}</h2>
            
            <div className="space-y-3 sm:space-y-4 text-sm">
              <div>
                <p className="font-medium text-slate-700 mb-0.5 sm:mb-1 text-xs sm:text-sm">Perfil</p>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {currentCase.patientProfile.age} anos, {currentCase.patientProfile.gender === 'M' ? 'Masculino' : 'Feminino'}, {currentCase.patientProfile.occupation}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-700 mb-0.5 sm:mb-1 text-xs sm:text-sm">História</p>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{currentCase.history}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700 mb-0.5 sm:mb-1 text-xs sm:text-sm">Sintomas</p>
                <ul className="text-slate-600 space-y-0.5 sm:space-y-1">
                  {currentCase.symptoms.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-700 mb-0.5 sm:mb-1 text-xs sm:text-sm">Achados Clínicos</p>
                <ul className="text-slate-600 space-y-0.5 sm:space-y-1">
                  {currentCase.clinicalFindings.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Answer Options - Touch optimized */}
          <div>
            <p className="font-semibold text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">Qual é o diagnóstico mais provável?</p>
            <div className="space-y-2">
              {currentCase.diagnosticOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all touch-manipulation ${
                    selectedAnswer === option.id
                      ? 'border-teal-500 bg-teal-50 text-teal-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
          >
            Confirmar Resposta
          </Button>
        </div>
      </div>
    );
  }

  // QUESTION RESULT VIEW
  if (view === 'question_result' && currentCase) {
    const answeredCase = dailyCases[progress.answers.length - 1 < 0 ? 0 : progress.answers.length - 1];
    const message = lastAnswerCorrect 
      ? MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
      : ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
    
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-slate-900 text-white">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="mt-3">
              <ProgressDots />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                lastAnswerCorrect ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {lastAnswerCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h2 className={`text-xl font-bold mb-1 ${lastAnswerCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                {lastAnswerCorrect ? 'Correto!' : 'Incorreto'}
              </h2>
              <p className="text-slate-600 text-sm">{message}</p>
            </motion.div>
          </AnimatePresence>

          {/* Correct Answer */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Diagnóstico Correto</h3>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 mb-4">
              <p className="font-medium text-emerald-800">{answeredCase?.correctDiagnosis}</p>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Explicação</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{answeredCase?.clinicalExplanation}</p>
          </div>

          {/* Next Button */}
          <Button 
            onClick={handleNextQuestion} 
            className="w-full h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700"
          >
            {progress.completed ? (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Ver Resultado Final
              </>
            ) : (
              <>
                <ChevronRight className="w-5 h-5 mr-2" />
                Próxima Questão
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // FINAL RESULT VIEW
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-6">
      <div className="bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Treino Completo!</h1>
            <p className="text-slate-400 text-sm mt-1">5 casos concluídos hoje</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Reset Timer */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <RefreshCw className="w-5 h-5 mx-auto mb-2 text-slate-400" />
          <p className="text-xs text-slate-500 mb-1">Novos casos em</p>
          <p className="text-2xl font-mono font-bold text-slate-900">{formatResetTime()}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-5 text-white text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
            <p className="text-3xl font-bold">{correctCount}/{QUESTIONS_PER_DAY}</p>
            <p className="text-sm text-emerald-100">Acertos</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white text-center">
            <Flame className="w-6 h-6 mx-auto mb-2" />
            <p className="text-3xl font-bold">{currentStreak} dias</p>
            <p className="text-sm text-amber-100">Sequência atual</p>
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-5 text-white text-center">
          <Target className="w-6 h-6 mx-auto mb-2" />
          <p className="text-3xl font-bold">{correctCount > 0 ? Math.round((correctCount / QUESTIONS_PER_DAY) * 100) : 0}%</p>
          <p className="text-sm text-violet-100">Taxa de Acerto</p>
        </div>

        {/* Back Button */}
        <Button onClick={onBack} variant="outline" className="w-full h-12">
          Voltar aos Módulos
        </Button>
      </div>
    </div>
  );
}
