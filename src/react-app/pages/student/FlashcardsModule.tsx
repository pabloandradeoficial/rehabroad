import { useState, useMemo, useCallback, useEffect } from "react";
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

  useEffect(() => { window.scrollTo(0, 0) }, []);

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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Button>
          <span className="text-sm font-semibold text-gray-900">Flashcards Clínicos</span>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center shadow-md"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sessão completa!</h2>
            <p className="text-4xl font-bold text-teal-600 mb-2">{score}%</p>
            <p className="text-sm text-gray-500 mb-6">de domínio nesta sessão</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                <p className="text-2xl font-bold text-green-600">{stats.sabia}</p>
                <p className="text-xs text-green-700">Sabia</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-2xl font-bold text-amber-600">{stats.quase}</p>
                <p className="text-xs text-amber-700">Quase</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-2xl font-bold text-red-600">{stats.nao_sabia}</p>
                <p className="text-xs text-red-700">Não sabia</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRestart} className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700 text-white"><RotateCcw className="w-4 h-4" />Nova sessão</Button>
              <Button variant="outline" onClick={onBack} className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50">Voltar</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <span className="text-sm font-semibold text-gray-900">Flashcards Clínicos</span>
        <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">{currentIndex + 1}/{sessionCards.length}</Badge>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <motion.div
          className="h-full bg-teal-500"
          animate={{ width: `${(currentIndex / sessionCards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {sessionCards.map((_, i) => {
              const prog = sessionProgress[i];
              return (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentIndex
                    ? prog?.resultado === "sabia" ? "bg-green-500"
                      : prog?.resultado === "quase" ? "bg-amber-400"
                      : "bg-red-400"
                    : i === currentIndex ? "bg-teal-500" : "bg-gray-200"
                }`} />
              );
            })}
          </div>

          {/* Card itself */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id + (flipped ? "-back" : "-front")}
              initial={{ opacity: 0, rotateY: flipped ? -90 : 90, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: flipped ? 90 : -90, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => !flipped && setFlipped(true)}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className={`relative rounded-2xl shadow-md border cursor-pointer select-none min-h-[280px] flex flex-col justify-between p-6 transition-colors ${
                flipped ? "bg-teal-50 border-teal-200" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {/* Region badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${flipped ? "bg-teal-100 text-teal-700 border-teal-200" : "bg-teal-50 text-teal-700 border-teal-100"}`}>
                  {currentCard.regiao.charAt(0).toUpperCase() + currentCard.regiao.slice(1)}
                </span>
                <Brain className={`w-4 h-4 ${flipped ? "text-teal-400" : "text-gray-300"}`} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                {!flipped ? (
                  <>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">TESTE ORTOPÉDICO</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{currentCard.nome}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{currentCard.objetivo}</p>
                    <p className="text-xs text-teal-500 mt-4 text-center">Toque para ver a execução</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium text-teal-600 uppercase tracking-wider mb-3">EXECUÇÃO E RESULTADO</p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{currentCard.execucao}</p>
                    <div className="bg-white border border-teal-200 rounded-xl p-3">
                      <p className="text-xs text-teal-600 mb-1 font-medium">Resultado positivo:</p>
                      <p className="text-sm text-gray-800 font-medium">{currentCard.resultadoPositivo}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-5">
            {!flipped ? (
              <Button onClick={() => setFlipped(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold h-12 rounded-xl">
                Revelar execução
              </Button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("nao_sabia")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1.5 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">Não sabia</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("quase")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1.5 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <Minus className="w-5 h-5 text-amber-500" />
                  <span className="text-xs text-amber-500 font-medium">Quase</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !savingResult && handleResult("sabia")}
                  disabled={savingResult}
                  className="flex-1 flex flex-col items-center gap-1.5 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl py-4 transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">Sabia</span>
                </motion.button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            {remaining} {remaining === 1 ? "card restante" : "cards restantes"}
          </p>
        </div>
      </div>
    </div>
  );
}
