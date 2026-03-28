import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Check, X, Minus, Trophy, Brain } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { testesOrtopedicos } from "@/react-app/data/testesOrtopedicos";
import { apiFetch } from "@/react-app/lib/api";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

interface Props {
  onBack: () => void;
}

type Resultado = "sabia" | "nao_sabia" | "quase";

interface CardProgress {
  cardId: string;
  resultado: Resultado;
}

const CARDS_PER_SESSION = 10;

export default function FlashcardsModule({ onBack }: Props) {
  const { user } = useAppAuth();

  // Pick 10 cards per session — prioritize unknown cards (shuffle with bias)
  const sessionCards = useMemo(() => {
    const shuffled = [...testesOrtopedicos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, CARDS_PER_SESSION);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionProgress, setSessionProgress] = useState<CardProgress[]>([]);
  const [finished, setFinished] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const currentCard = sessionCards[currentIndex];
  const remaining = sessionCards.length - currentIndex;

  const saveProgress = useCallback(async (cardId: string, resultado: Resultado) => {
    if (!user) return;
    setSavingResult(true);
    try {
      await apiFetch("/api/student/flashcards/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId, resultado }),
      });
    } catch {
      // non-critical
    } finally {
      setSavingResult(false);
    }
  }, [user]);

  const handleResult = async (resultado: Resultado) => {
    const newProgress = [...sessionProgress, { cardId: currentCard.id, resultado }];
    setSessionProgress(newProgress);

    await saveProgress(currentCard.id, resultado);

    if (currentIndex + 1 >= sessionCards.length) {
      setFinished(true);
    } else {
      setFlipped(false);
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionProgress([]);
    setFinished(false);
  };

  const stats = useMemo(() => ({
    sabia: sessionProgress.filter((p) => p.resultado === "sabia").length,
    quase: sessionProgress.filter((p) => p.resultado === "quase").length,
    nao_sabia: sessionProgress.filter((p) => p.resultado === "nao_sabia").length,
  }), [sessionProgress]);

  if (finished) {
    const total = sessionProgress.length;
    const score = Math.round(((stats.sabia + stats.quase * 0.5) / total) * 100);

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="border-b border-slate-800 px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <span className="text-white font-semibold">Flashcards Clínicos</span>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sessão completa!</h2>
            <p className="text-4xl font-bold text-teal-600 mb-2">{score}%</p>
            <p className="text-sm text-slate-500 mb-6">de domínio nesta sessão</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-emerald-600">{stats.sabia}</p>
                <p className="text-xs text-emerald-700">Sabia</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-amber-600">{stats.quase}</p>
                <p className="text-xs text-amber-700">Quase</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-red-600">{stats.nao_sabia}</p>
                <p className="text-xs text-red-700">Não sabia</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleRestart} className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                <RotateCcw className="w-4 h-4" />
                Nova sessão
              </Button>
              <Button variant="outline" onClick={onBack} className="flex-1">
                Voltar
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="border-b border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <span className="text-white font-semibold">Flashcards Clínicos</span>
        </div>
        <Badge className="bg-slate-700 text-slate-300 border-0">
          {currentIndex + 1}/{sessionCards.length}
        </Badge>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
          animate={{ width: `${((currentIndex) / sessionCards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Mini progress dots */}
          <div className="flex justify-center gap-1 mb-6">
            {sessionCards.map((_, i) => {
              const prog = sessionProgress[i];
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentIndex
                      ? prog?.resultado === "sabia" ? "bg-emerald-500"
                        : prog?.resultado === "quase" ? "bg-amber-500"
                        : "bg-red-500"
                      : i === currentIndex ? "bg-white" : "bg-slate-700"
                  }`}
                />
              );
            })}
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id + (flipped ? "-back" : "-front")}
              initial={{ opacity: 0, rotateY: flipped ? -90 : 90, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: flipped ? 90 : -90, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => !flipped && setFlipped(true)}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className={`
                relative rounded-2xl shadow-2xl cursor-pointer select-none
                min-h-[280px] flex flex-col justify-between p-6
                ${flipped
                  ? "bg-gradient-to-br from-teal-800 to-emerald-900 shadow-teal-900/40"
                  : "bg-white"}
              `}
            >
              {/* Region badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={`text-xs border-0 ${flipped ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700"}`}>
                  {currentCard.regiao.charAt(0).toUpperCase() + currentCard.regiao.slice(1)}
                </Badge>
                <Brain className={`w-4 h-4 ${flipped ? "text-white/50" : "text-slate-300"}`} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                {!flipped ? (
                  <>
                    <p className={`text-xs font-medium mb-2 text-slate-400`}>TESTE ORTOPÉDICO</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{currentCard.nome}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{currentCard.objetivo}</p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-slate-400">
                      <span className="text-xs">Toque para ver a execução</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium mb-3 text-white/60">EXECUÇÃO E RESULTADO</p>
                    <p className="text-sm text-white/90 leading-relaxed mb-3">{currentCard.execucao}</p>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs text-white/60 mb-1">Resultado positivo:</p>
                      <p className="text-sm text-emerald-300 font-medium">{currentCard.resultadoPositivo}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-6">
            {!flipped ? (
              <Button
                onClick={() => setFlipped(true)}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold h-12"
              >
                Revelar execução
              </Button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("nao_sabia")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-red-400" />
                  <span className="text-xs text-red-400 font-medium">Não sabia</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("quase")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <Minus className="w-5 h-5 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">Quase</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("sabia")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Sabia</span>
                </motion.button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            {remaining} {remaining === 1 ? "card restante" : "cards restantes"}
          </p>
        </div>
      </div>
    </div>
  );
}
