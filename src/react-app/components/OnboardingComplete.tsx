import { useEffect } from "react";
import { trackCompleteRegistration } from "@/react-app/lib/pixel";

interface OnboardingCompleteProps {
  onClose: () => void;
}

export function OnboardingComplete({ onClose }: OnboardingCompleteProps) {
  useEffect(() => {
    trackCompleteRegistration();
  }, []);

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-7 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg text-3xl">
            🎊
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tour concluído!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Você conheceu os principais recursos do Rehabroad. Agora é hora de colocar em prática.
        </p>

        {/* Tip box */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-1">💡 Dica rápida</p>
          <p className="text-xs text-teal-600 dark:text-teal-300 leading-relaxed">
            Comece cadastrando um paciente no Painel. Em menos de 2 minutos ele estará pronto para uma avaliação clínica completa.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Começar a usar
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
