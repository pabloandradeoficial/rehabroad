import { motion } from "framer-motion";
import { ChevronRight, X, Zap } from "lucide-react";

interface ProBridgeBannerProps {
  onDismiss: () => void;
}

export function ProBridgeBanner({ onDismiss }: ProBridgeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-4 shadow-lg overflow-hidden"
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4 text-white/70" />
      </button>
      <div className="pr-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span className="text-white font-bold text-sm">Você está evoluindo rápido!</span>
        </div>
        <p className="text-white/80 text-xs mb-3">
          Fisioterapeutas Pro usam o Rehabroad para prontuário, IA diagnóstica e muito mais.
        </p>
        <a
          href="/login"
          onClick={() => localStorage.setItem("loginMode", "professional")}
          className="inline-flex items-center gap-1.5 bg-white text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
        >
          Conhecer o Plano Pro
          <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}
