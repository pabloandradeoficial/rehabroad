import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      const destination = `${location.pathname}${location.search}${location.hash}`;
      const encodedDestination = encodeURIComponent(destination);

      navigate(`/login?redirect=${encodedDestination}`, {
        replace: true,
      });
    }
  }, [user, isPending, navigate, location]);

  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <motion.div
          key="auth-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">
              Validando sessão...
            </p>
          </div>
        </motion.div>
      ) : user ? (
        <div key="auth-content" className="w-full h-full">
          {children}
        </div>
      ) : null}
    </AnimatePresence>
  );
}
