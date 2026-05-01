import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";

// ============================================
// SUCCESS / ERROR FEEDBACK (internal — used by ToastProvider)
// ============================================
interface FeedbackToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

function FeedbackToast({ type, message, onClose }: FeedbackToastProps) {
  const icons = {
    success: <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="size-5 text-red-500 shrink-0" />,
    info: <Sparkles className="size-5 text-primary shrink-0" />
  };

  const backgrounds = {
    success: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15",
    error: "bg-red-500/10 border-red-500/20 dark:bg-red-500/15",
    info: "bg-primary/10 border-primary/20 dark:bg-primary/15"
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${backgrounds[type]} shadow-lg w-full bg-background/95`}
    >
      {icons[type]}
      <span className="text-sm font-medium flex-1 min-w-0">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 shrink-0 text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
          aria-label="Fechar"
        >
          ×
        </button>
      )}
    </div>
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
    }, 3000);
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
      {/* Toast container: below mobile header (top-20), top-right on desktop */}
      <div className="fixed top-20 lg:top-4 right-4 left-4 lg:left-auto lg:w-80 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <FeedbackToast
                type={toast.type}
                message={toast.message}
                onClose={() => removeToast(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
