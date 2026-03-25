import { motion } from "framer-motion";

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showPercentage?: boolean;
  label?: string;
  animate?: boolean;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#14b8a6", // teal-500
  bgColor = "#e2e8f0", // slate-200
  showPercentage = true,
  label,
  animate = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            initial={animate ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-2xl font-bold text-slate-900"
          >
            {Math.round(progress)}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-slate-500 mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
      >
        {/* Success circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
        >
          {/* Checkmark */}
          <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          </svg>
        </motion.div>
        
        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * Math.PI) / 4) * 80,
              y: Math.sin((i * Math.PI) / 4) * 80,
            }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
          >
            <div className="w-full h-full bg-amber-400 rounded-full" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface XPGainAnimationProps {
  show: boolean;
  amount: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ show, amount, onComplete }: XPGainAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      onAnimationComplete={onComplete}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 0.3, repeat: 2 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-xl"
        >
          ⚡
        </motion.span>
        <span className="font-bold text-lg">+{amount} XP</span>
      </motion.div>
    </motion.div>
  );
}

interface StreakAnimationProps {
  show: boolean;
  streak: number;
}

export function StreakAnimation({ show, streak }: StreakAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed top-36 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2"
      >
        <span className="text-lg">🔥</span>
        <span className="font-bold">{streak} dias seguidos!</span>
      </motion.div>
    </motion.div>
  );
}

interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
  children?: React.ReactNode;
}

export function ProgressRing({ current, total, size = 80, children }: ProgressRingProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const strokeWidth = size < 60 ? 4 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Color based on progress
  const getColor = () => {
    if (progress >= 100) return "#10b981"; // emerald-500
    if (progress >= 75) return "#14b8a6"; // teal-500
    if (progress >= 50) return "#f59e0b"; // amber-500
    return "#6366f1"; // indigo-500
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className="text-sm font-bold text-slate-700">
            {current}/{total}
          </span>
        )}
      </div>
    </div>
  );
}

interface LevelUpAnimationProps {
  show: boolean;
  level: number;
  levelName: string;
  onComplete?: () => void;
}

export function LevelUpAnimation({ show, level, levelName, onComplete }: LevelUpAnimationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 text-center text-white shadow-2xl max-w-sm mx-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          Nível {level}!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-purple-200 mb-6"
        >
          {levelName}
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onComplete}
          className="bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-full hover:bg-purple-50 transition-colors"
        >
          Continuar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
