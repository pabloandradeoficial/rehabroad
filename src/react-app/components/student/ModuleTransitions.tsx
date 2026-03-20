import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// Skeleton loading component for module transitions
export function ModuleSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-slate-900 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-4 w-20 bg-slate-700 rounded mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-xl" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-700 rounded" />
              <div className="h-3 w-24 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            <div className="h-5 w-32 bg-slate-100 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-12 bg-slate-50 rounded-lg" />
            <div className="h-12 bg-slate-50 rounded-lg" />
            <div className="h-12 bg-slate-50 rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            <div className="h-5 w-28 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-slate-50 rounded-lg" />
            <div className="h-20 bg-slate-50 rounded-lg" />
            <div className="h-20 bg-slate-50 rounded-lg" />
            <div className="h-20 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Page transition wrapper for smooth module navigation
interface ModulePageProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export function ModulePage({ children, className = "" }: ModulePageProps) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated content wrapper with AnimatePresence
interface AnimatedContentProps {
  children: ReactNode;
  contentKey: string;
  direction?: "left" | "right" | "up" | "down";
}

export function AnimatedContent({ children, contentKey, direction = "right" }: AnimatedContentProps) {
  const directionMap = {
    left: { initial: { x: -30 }, exit: { x: 30 } },
    right: { initial: { x: 30 }, exit: { x: -30 } },
    up: { initial: { y: -30 }, exit: { y: 30 } },
    down: { initial: { y: 30 }, exit: { y: -30 } }
  };

  const dir = directionMap[direction];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={contentKey}
        initial={{ opacity: 0, ...dir.initial }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, ...dir.exit }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Flip card for quiz/learning feedback
interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
}

export function FlipCard({ front, back, isFlipped, onFlip, className = "" }: FlipCardProps) {
  return (
    <div 
      className={`relative perspective-1000 ${className}`}
      onClick={onFlip}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// Answer feedback animation
interface AnswerFeedbackProps {
  isCorrect: boolean | null;
  children: ReactNode;
}

export function AnswerFeedback({ isCorrect, children }: AnswerFeedbackProps) {
  return (
    <motion.div
      animate={
        isCorrect === true
          ? { scale: [1, 1.02, 1], backgroundColor: ["transparent", "rgba(16, 185, 129, 0.1)", "transparent"] }
          : isCorrect === false
          ? { x: [0, -5, 5, -5, 5, 0], backgroundColor: ["transparent", "rgba(239, 68, 68, 0.1)", "transparent"] }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Staggered list animation
interface StaggerListProps {
  children: ReactNode[];
  staggerDelay?: number;
}

export function StaggerList({ children, staggerDelay = 0.05 }: StaggerListProps) {
  return (
    <>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * staggerDelay,
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}

// Progress reveal animation
interface ProgressRevealProps {
  children: ReactNode;
  delay?: number;
}

export function ProgressReveal({ children, delay = 0 }: ProgressRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Success celebration effect
interface SuccessCelebrationProps {
  show: boolean;
}

export function SuccessCelebration({ show }: SuccessCelebrationProps) {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1.2] }}
      transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="text-6xl">🎉</div>
    </motion.div>
  );
}
