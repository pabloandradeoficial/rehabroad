import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ModuleCard, ModuleType } from "./types";

interface StudentModuleCardProps {
  module: ModuleCard;
  size?: "normal" | "small";
  progressValue: number;
  onSelect: (id: ModuleType) => void;
}

export function StudentModuleCard({ module, size = "normal", progressValue, onSelect }: StudentModuleCardProps) {
  const isComplete = progressValue >= 100;
  const isSmall = size === "small";

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(module.id)}
      className={`
        relative bg-white rounded-xl cursor-pointer
        active:bg-gray-50 transition-all duration-200
        border border-gray-200 active:border-gray-300
        touch-manipulation group shadow-sm hover:shadow-md hover:border-gray-300
        ${isSmall ? "p-3 min-h-[100px]" : "p-4 min-h-[130px]"}
      `}
    >
      {progressValue > 0 && (
        <div className="absolute top-2 right-2">
          {isComplete ? (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              <Check className="w-2.5 h-2.5" />
            </span>
          ) : (
            <span className="text-[9px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full">
              {Math.round(progressValue)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`
        ${isSmall ? "w-8 h-8 rounded-lg mb-2" : "w-10 h-10 rounded-xl mb-3"}
        ${module.iconBg} flex items-center justify-center text-white
        shadow-md group-active:scale-95 transition-transform duration-200
      `}
      >
        {module.icon}
      </div>

      <h3
        className={`font-bold text-gray-900 leading-tight ${
          isSmall ? "text-xs" : "text-sm"
        }`}
      >
        {module.title}
      </h3>

      <p
        className={`text-gray-500 leading-snug mt-0.5 line-clamp-2 ${
          isSmall ? "text-[10px]" : "text-xs"
        }`}
      >
        {module.description}
      </p>

      {progressValue > 0 && progressValue < 100 && (
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}
