import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Sparkles } from 'lucide-react';

// XP Levels with unique icons and colors
export const XP_LEVELS = [
  { level: 1, name: 'Calouro', minXp: 0, icon: '🌱', color: 'from-slate-400 to-slate-500', textColor: 'text-slate-600' },
  { level: 2, name: 'Estudante', minXp: 50, icon: '📚', color: 'from-blue-400 to-blue-500', textColor: 'text-blue-600' },
  { level: 3, name: 'Dedicado', minXp: 150, icon: '💪', color: 'from-emerald-400 to-emerald-500', textColor: 'text-emerald-600' },
  { level: 4, name: 'Aplicado', minXp: 300, icon: '🎯', color: 'from-amber-400 to-amber-500', textColor: 'text-amber-600' },
  { level: 5, name: 'Veterano', minXp: 500, icon: '⭐', color: 'from-violet-400 to-violet-500', textColor: 'text-violet-600' },
  { level: 6, name: 'Expert', minXp: 800, icon: '🏆', color: 'from-orange-400 to-orange-500', textColor: 'text-orange-600' },
  { level: 7, name: 'Mestre', minXp: 1200, icon: '👑', color: 'from-rose-400 to-rose-500', textColor: 'text-rose-600' },
  { level: 8, name: 'Lenda', minXp: 2000, icon: '🔥', color: 'from-red-500 to-orange-500', textColor: 'text-red-600' },
];

export const getXpLevel = (xp: number) => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXp) {
      const currentLevel = XP_LEVELS[i];
      const nextLevel = XP_LEVELS[i + 1];
      const progressToNext = nextLevel 
        ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
        : 100;
      return { ...currentLevel, progressToNext, nextLevel };
    }
  }
  return { ...XP_LEVELS[0], progressToNext: 0, nextLevel: XP_LEVELS[1] };
};

// Animated XP Bar Component
interface XpBarProps {
  xp: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedXpBar({ xp, showDetails = true, size = 'md' }: XpBarProps) {
  const level = getXpLevel(xp);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = xp / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= xp) {
        setDisplayXp(xp);
        clearInterval(timer);
      } else {
        setDisplayXp(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [xp]);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{level.icon}</span>
            <span className={`font-semibold ${level.textColor}`}>{level.name}</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Nv.{level.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <motion.span 
              key={displayXp}
              initial={{ scale: 1.2, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#334155' }}
              className="font-bold text-slate-700"
            >
              {displayXp}
            </motion.span>
            <span className="text-slate-400 text-sm">XP</span>
          </div>
        </div>
      )}
      
      <div className={`w-full bg-slate-200 rounded-full ${heightClasses[size]} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level.progressToNext}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${level.color} rounded-full relative`}
        >
          {size === 'lg' && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
          )}
        </motion.div>
      </div>
      
      {showDetails && level.nextLevel && (
        <p className="text-xs text-slate-400 mt-1 text-right">
          {level.nextLevel.minXp - xp} XP para {level.nextLevel.name}
        </p>
      )}
    </div>
  );
}

// Level Badge Component
interface LevelBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function LevelBadge({ xp, size = 'md', showName = true }: LevelBadgeProps) {
  const level = getXpLevel(xp);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`${sizeClasses[size]} bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center shadow-lg`}
      >
        <span>{level.icon}</span>
      </motion.div>
      {showName && (
        <div className="flex flex-col">
          <span className={`font-bold ${level.textColor}`}>{level.name}</span>
          <span className="text-xs text-slate-400">Nível {level.level}</span>
        </div>
      )}
    </div>
  );
}

// Streak Fire Animation
interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold shadow-lg shadow-orange-500/30 ${sizeClasses[size]}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 0.5, 
          repeat: Infinity, 
          repeatDelay: 2 
        }}
      >
        <Flame className={iconSizes[size]} />
      </motion.div>
      <span>{streak} dias</span>
    </motion.div>
  );
}

// XP Earned Animation (shows when XP is earned)
interface XpEarnedProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
}

export function XpEarnedAnimation({ amount, show, onComplete }: XpEarnedProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 0.5 }}
          animate={{ y: -50, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={onComplete}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-xl shadow-amber-500/50">
            <Zap className="w-6 h-6" />
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level Up Celebration
interface LevelUpProps {
  show: boolean;
  newLevel: typeof XP_LEVELS[0];
  onClose: () => void;
}

export function LevelUpCelebration({ show, newLevel, onClose }: LevelUpProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50 }}
            className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Confetti particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * 300 - 150,
                    rotate: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    y: 400, 
                    rotate: Math.random() * 360,
                    opacity: 0 
                  }}
                  transition={{ 
                    duration: 2 + Math.random(), 
                    delay: Math.random() * 0.5 
                  }}
                  className={`absolute w-3 h-3 rounded-sm ${
                    ['bg-amber-400', 'bg-rose-400', 'bg-violet-400', 'bg-emerald-400', 'bg-blue-400'][i % 5]
                  }`}
                  style={{ left: '50%' }}
                />
              ))}
            </div>

            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl mb-4"
            >
              {newLevel.icon}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-amber-500 font-bold text-sm mb-2 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                SUBIU DE NÍVEL!
              </p>
              <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${newLevel.color} bg-clip-text text-transparent`}>
                {newLevel.name}
              </h2>
              <p className="text-slate-500">Nível {newLevel.level}</p>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={onClose}
              className={`mt-6 px-8 py-3 bg-gradient-to-r ${newLevel.color} text-white rounded-full font-bold shadow-lg`}
            >
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stats Card with Animation
interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  gradient: string;
  delay?: number;
}

export function AnimatedStatCard({ icon, value, label, gradient, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
    >
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white mb-3 shadow-lg`}>
        {icon}
      </div>
      <motion.p 
        key={displayValue}
        className="text-2xl font-bold text-slate-900"
      >
        {displayValue}{label.includes('%') ? '%' : ''}
      </motion.p>
      <p className="text-xs text-slate-500">{label.replace('%', '')}</p>
    </motion.div>
  );
}

// Achievement Badge
interface AchievementProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  color: string;
}

export function AchievementBadge({ title, description, icon, unlocked, color }: AchievementProps) {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      className={`relative p-4 rounded-xl border-2 ${
        unlocked 
          ? `bg-gradient-to-br ${color} border-transparent shadow-lg` 
          : 'bg-slate-100 border-slate-200 opacity-50'
      }`}
    >
      {!unlocked && (
        <div className="absolute inset-0 bg-slate-200/50 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
      <div className={`w-12 h-12 rounded-full ${unlocked ? 'bg-white/20' : 'bg-slate-200'} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h4 className={`font-bold ${unlocked ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
      <p className={`text-xs ${unlocked ? 'text-white/80' : 'text-slate-400'}`}>{description}</p>
    </motion.div>
  );
}

// Daily Progress Ring
interface ProgressRingProps {
  progress: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ progress, total, size = 80, strokeWidth = 8 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-900">{progress}</span>
        <span className="text-xs text-slate-400">/{total}</span>
      </div>
    </div>
  );
}
