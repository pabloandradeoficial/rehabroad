import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Share2, Trophy, X } from "lucide-react";

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
  onShareWhatsApp: () => void;
  onCopyLink: () => void;
}

export function CelebrationModal({ open, onClose, onShareWhatsApp, onCopyLink }: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: [
                      "#10b981",
                      "#f59e0b",
                      "#8b5cf6",
                      "#ef4444",
                      "#3b82f6",
                    ][i % 5],
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1, 0.5],
                    rotate: 360,
                    y: [0, -20, 100],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full animate-pulse" />
              <div className="absolute inset-1 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-800" />
              </div>
              <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Parabéns!
            </h2>
            <p className="text-lg font-semibold text-emerald-600 mb-1">
              100% Concluído!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Você completou todo o treinamento clínico do REHABROAD. Seu
              raciocínio clínico está afiado!
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-emerald-100">
              <p className="text-xs text-gray-500 mb-2">
                Seu selo de conquista:
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm border border-emerald-200">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-gray-900">
                  Fisioterapeuta Clínico Completo
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Compartilhe sua conquista:
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={onShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={onCopyLink}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
