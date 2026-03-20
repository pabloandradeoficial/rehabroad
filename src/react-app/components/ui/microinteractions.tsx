import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";

// ============================================
// ANIMATED BUTTON WRAPPER
// ============================================
interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  variant?: "default" | "scale" | "glow" | "ripple";
}

export function AnimatedButton({ 
  children, 
  className = "", 
  onClick, 
  disabled,
  loading,
  success,
  variant = "default"
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    default: {
      tap: { scale: 0.97 },
      hover: { scale: 1.02 }
    },
    scale: {
      tap: { scale: 0.92 },
      hover: { scale: 1.05 }
    },
    glow: {
      tap: { scale: 0.97 },
      hover: { 
        scale: 1.02,
        boxShadow: "0 0 20px rgba(var(--primary), 0.4)"
      }
    },
    ripple: {
      tap: { scale: 0.97 },
      hover: { scale: 1.02 }
    }
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileHover={disabled ? undefined : variants[variant].hover}
      whileTap={disabled ? undefined : variants[variant].tap}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      disabled={disabled || loading}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="size-4 animate-spin" />
            <span>Processando...</span>
          </motion.span>
        ) : success ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-2 text-emerald-500"
          >
            <CheckCircle2 className="size-4" />
            <span>Sucesso!</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* Ripple effect */}
      {variant === "ripple" && isPressed && (
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}

// ============================================
// ANIMATED CARD
// ============================================
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  variant?: "lift" | "glow" | "border" | "scale";
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  variant = "lift",
  delay = 0
}: AnimatedCardProps) {
  const hoverVariants = {
    lift: {
      y: -4,
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)"
    },
    glow: {
      boxShadow: "0 0 30px rgba(var(--primary), 0.2)"
    },
    border: {
      borderColor: "hsl(var(--primary))"
    },
    scale: {
      scale: 1.02
    }
  };

  return (
    <motion.div
      className={`transition-colors ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={hoverVariants[variant]}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SUCCESS / ERROR FEEDBACK
// ============================================
interface FeedbackToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

export function FeedbackToast({ type, message, onClose }: FeedbackToastProps) {
  const icons = {
    success: <CheckCircle2 className="size-5 text-emerald-500" />,
    error: <XCircle className="size-5 text-red-500" />,
    info: <Sparkles className="size-5 text-primary" />
  };

  const backgrounds = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    error: "bg-red-500/10 border-red-500/20",
    info: "bg-primary/10 border-primary/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${backgrounds[type]} backdrop-blur-sm shadow-lg`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// TOAST CONTEXT & PROVIDER
// ============================================
interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextValue {
  showToast: (type: Toast["type"], message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const showSuccess = useCallback((message: string) => showToast("success", message), [showToast]);
  const showError = useCallback((message: string) => showToast("error", message), [showToast]);
  const showInfo = useCallback((message: string) => showToast("info", message), [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            style={{ top: `${1 + index * 4.5}rem` }}
            className="fixed right-4 z-50"
          >
            <FeedbackToast
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// ============================================
// LOADING SKELETON
// ============================================
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]";
  
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-lg"
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      animate={{
        backgroundPosition: ["0% 0%", "200% 0%"]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// ============================================
// LOADING SPINNER
// ============================================
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8"
  };

  return (
    <motion.div
      className={`${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="size-full text-primary" />
    </motion.div>
  );
}

// ============================================
// PAGE TRANSITION WRAPPER
// ============================================
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// PULSE DOT (for notifications)
// ============================================
interface PulseDotProps {
  color?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}

export function PulseDot({ color = "primary", size = "md" }: PulseDotProps) {
  const colors = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500"
  };

  const sizes = {
    sm: "size-2",
    md: "size-3",
    lg: "size-4"
  };

  return (
    <span className="relative flex">
      <motion.span
        className={`absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-75`}
        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className={`relative inline-flex rounded-full ${sizes[size]} ${colors[color]}`} />
    </span>
  );
}

// ============================================
// CONFETTI EFFECT
// ============================================
export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;

  const confettiColors = [
    "bg-primary",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-violet-500",
    "bg-rose-500"
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute size-3 rounded-sm ${confettiColors[i % confettiColors.length]}`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({ 
  value, 
  duration = 1, 
  className = "",
  prefix = "",
  suffix = ""
}: CounterProps) {
  const animDuration = duration;
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
      >
        {prefix}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animDuration * 0.3 }}
        >
          {value}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// ============================================
// ANIMATED COUNTING NUMBER
// ============================================
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ 
  end, 
  duration = 2, 
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            // Easing function for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end * Math.pow(10, decimals)) / Math.pow(10, decimals));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </span>
  );
}

// ============================================
// INTERACTIVE CHECKBOX
// ============================================
interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function AnimatedCheckbox({ 
  checked, 
  onChange, 
  label,
  className = ""
}: AnimatedCheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <motion.div
        className={`relative size-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          checked 
            ? "bg-primary border-primary" 
            : "border-muted-foreground/30 group-hover:border-primary/50"
        }`}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="size-3 text-primary-foreground"
              viewBox="0 0 12 12"
              fill="none"
            >
              <motion.path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      {label && (
        <span className={`text-sm transition-colors ${checked ? "text-foreground" : "text-muted-foreground"}`}>
          {label}
        </span>
      )}
    </label>
  );
}

// ============================================
// PROGRESS BAR
// ============================================
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "gradient" | "striped";
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className = "",
  showLabel = false,
  variant = "default"
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    default: "bg-primary",
    gradient: "bg-gradient-to-r from-primary via-violet-500 to-primary",
    striped: "bg-primary bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]"
  };

  return (
    <div className={`relative ${className}`}>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${variantStyles[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
        />
      </div>
      {showLabel && (
        <motion.span
          className="absolute -top-6 text-xs font-medium text-muted-foreground"
          style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
}
