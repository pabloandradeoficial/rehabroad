import { motion, AnimatePresence } from "framer-motion";
import { Briefcase } from "lucide-react";

interface InternshipModalProps {
  open: boolean;
  onSelect: (estagio: string) => void;
  onSkip: () => void;
}

const ESTAGIOS = [
  "Pré-estágio",
  "Estágio básico (1º período)",
  "Estágio intermediário (2º período)",
  "Estágio avançado / internato",
];

export function InternshipModal({ open, onSelect, onSkip }: InternshipModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Modo Estágio</h3>
                <p className="text-xs text-gray-500">Personaliza os casos para seu nível</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Em qual fase do estágio você está? Vamos priorizar casos relevantes para você.
            </p>
            <div className="space-y-2">
              {ESTAGIOS.map((estagio) => (
                <button
                  key={estagio}
                  onClick={() => onSelect(estagio)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-colors text-sm font-medium text-gray-700"
                >
                  {estagio}
                </button>
              ))}
            </div>
            <button
              onClick={onSkip}
              className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              Pular por enquanto
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
