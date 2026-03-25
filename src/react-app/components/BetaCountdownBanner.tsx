import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles, X, Zap, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";

// Beta end date - set to end of Q1 2026
const BETA_END_DATE = new Date("2026-03-31T23:59:59");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = BETA_END_DATE.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[2.5rem] text-center"
      >
        <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </motion.div>
      <span className="text-[10px] sm:text-xs text-white/80 mt-0.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function BetaCountdownBanner() {
  const { subscription } = useSubscription();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check localStorage for dismissed state
  useEffect(() => {
    const dismissed = localStorage.getItem("beta_banner_dismissed");
    const dismissedDate = localStorage.getItem("beta_banner_dismissed_date");
    
    // Reset dismissed state after 24 hours
    if (dismissed && dismissedDate) {
      const dismissedTime = new Date(dismissedDate).getTime();
      const now = new Date().getTime();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
      
      if (hoursSinceDismissed < 24) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem("beta_banner_dismissed");
        localStorage.removeItem("beta_banner_dismissed_date");
      }
    }
  }, []);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("beta_banner_dismissed", "true");
    localStorage.setItem("beta_banner_dismissed_date", new Date().toISOString());
  };

  // Don't show if user is already subscribed
  if (subscription?.is_active) {
    return null;
  }

  // Don't show if dismissed
  if (isDismissed) {
    return null;
  }

  // Don't show if beta ended
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
          <motion.div
            animate={{
              x: isHovered ? [0, 100, 0] : 0,
              opacity: isHovered ? [0.3, 0.6, 0.3] : 0.3,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
            />
          ))}
        </div>

        <div className="relative px-4 py-3 sm:py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Left side - Message */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden sm:flex"
              >
                <Gift className="w-5 h-5 text-yellow-300" />
              </motion.div>
              
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-yellow-300 sm:hidden" />
                <span className="text-sm sm:text-base font-medium">
                  <span className="hidden sm:inline">🎉 </span>
                  <span className="font-bold">BETA EXCLUSIVO</span>
                  <span className="hidden md:inline"> — Preços promocionais por tempo limitado!</span>
                  <span className="md:hidden"> — Últimos dias!</span>
                </span>
              </div>
            </div>

            {/* Center - Countdown */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-4 h-4 text-white/80 hidden sm:block" />
              <div className="flex items-center gap-1 sm:gap-1.5">
                <TimeUnit value={timeLeft.days} label="dias" />
                <span className="text-white/60 text-lg font-light">:</span>
                <TimeUnit value={timeLeft.hours} label="hrs" />
                <span className="text-white/60 text-lg font-light">:</span>
                <TimeUnit value={timeLeft.minutes} label="min" />
                <span className="text-white/60 text-lg font-light hidden sm:block">:</span>
                <div className="hidden sm:block">
                  <TimeUnit value={timeLeft.seconds} label="seg" />
                </div>
              </div>
            </div>

            {/* Right side - CTA */}
            <div className="flex items-center gap-2">
              <Link to="/dashboard/plano">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="bg-white text-purple-700 hover:bg-white/90 font-semibold shadow-lg shadow-purple-900/20 group"
                  >
                    <Zap className="w-4 h-4 mr-1.5 group-hover:text-yellow-500 transition-colors" />
                    <span className="hidden sm:inline">Garantir Desconto</span>
                    <span className="sm:hidden">Ver Planos</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors group"
                aria-label="Fechar banner"
              >
                <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom highlight line */}
        <motion.div
          animate={{
            scaleX: [0, 1, 0],
            x: ["-100%", "0%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      </motion.div>
    </AnimatePresence>
  );
}
