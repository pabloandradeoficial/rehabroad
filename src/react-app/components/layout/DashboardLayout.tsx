import { Outlet, useLocation } from "react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import {
  Menu,
  X,
  Loader2,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  Globe,
  Bot,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { queryClient } from "@/react-app/App";
import { PATIENTS_QUERY_KEY, fetchPatientsQueryFn } from "@/react-app/hooks/usePatients";
import { APPOINTMENTS_QUERY_KEY, fetchAppointmentsQueryFn } from "@/react-app/hooks/useAppointments";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";
import { BetaCountdownBanner } from "@/react-app/components/BetaCountdownBanner";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { useProductTour } from "@/react-app/hooks/useProductTour";
import { OnboardingTooltip } from "@/react-app/components/OnboardingTooltip";
import { OnboardingWelcome } from "@/react-app/components/OnboardingWelcome";
import { OnboardingComplete } from "@/react-app/components/OnboardingComplete";

const RehabFriendChat = lazy(() => import("@/react-app/components/RehabFriendChat"));



// Pages that expired users can still access
const ALLOWED_PAGES_FOR_EXPIRED = [
  "/dashboard/plano",
  "/dashboard/contato",
  "/dashboard/admin",
];

// ── Shared expired-subscription wall ─────────────────────────────────────────

function SubscriptionExpiredWall() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg w-full text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Seu período de teste expirou
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Seu trial de 30 dias chegou ao fim. Para continuar usando todas as
          funcionalidades do REHABROAD, escolha um plano que se adapta às suas
          necessidades.
        </p>

        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="font-medium text-slate-900 dark:text-white mb-1">
                Seus dados estão seguros
              </p>
              <p>
                Todas as suas avaliações, evoluções e pacientes continuam
                salvos. Ao assinar, você terá acesso imediato a tudo novamente.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => (window.location.href = "/dashboard/plano")}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-teal-500/20"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Ver Planos e Assinar
        </Button>

        <p className="text-xs text-slate-500 mt-4">
          A partir de R$ 29/mês • Cancele quando quiser
        </p>
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rehabFriendOpen, setRehabFriendOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) return saved === "true";
      return window.innerWidth < 1024;
    }
    return false;
  });

  const { logout, user } = useAppAuth();
  const tour = useProductTour();
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setSidebarOpen(true);
    window.addEventListener("rehabroad-open-sidebar", handler);
    return () => window.removeEventListener("rehabroad-open-sidebar", handler);
  }, []);

  const [tourRunning, setTourRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (tour.isActive && !tourRunning && !showComplete) {
      setShowWelcome(true);
    }
  }, [tour.isActive, tourRunning, showComplete]);

  const handleStartTour = () => {
    setShowWelcome(false);
    setTourRunning(true);
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    tour.skip();
  };

  const handleTourNext = () => {
    if (tour.currentStep === tour.totalSteps - 1) {
      tour.complete();
      setTourRunning(false);
      setShowComplete(true);
    } else {
      tour.next();
    }
  };

  const handleSkipTour = () => {
    tour.skip();
    setTourRunning(false);
  };

  const { language, setLanguage } = useLanguage();
  const {
    isFreeLimited,
    loading: subscriptionLoading,
    isAdmin,
    isPremium,
  } = useSubscription();

  const isAllowedPage = ALLOWED_PAGES_FOR_EXPIRED.some((page) =>
    location.pathname.startsWith(page)
  );

  const shouldBlockAccess =
    !subscriptionLoading && isFreeLimited && !isAllowedPage && !isAdmin;

  // Adjust sidebar default when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (localStorage.getItem("sidebarCollapsed") === null) {
        setSidebarCollapsed(window.innerWidth < 1024);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prefetch base data for fast navigation
  useEffect(() => {
    if (user && !shouldBlockAccess) {
      queryClient.prefetchQuery({
        queryKey: PATIENTS_QUERY_KEY,
        queryFn: fetchPatientsQueryFn,
      });
      // Prefetch agenda sem datas para garantir cache warm (ou ajeitar caso a caso depois)
      queryClient.prefetchQuery({
        queryKey: APPOINTMENTS_QUERY_KEY(),
        queryFn: fetchAppointmentsQueryFn,
      });
    }
  }, [user, shouldBlockAccess]);

  // Auto-close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("loginMode");
    await logout();
    window.location.href = "/login";
  };

  // Shared overlays rendered in both branches
  const sharedOverlays = (
    <>
      <Suspense fallback={null}>
        <RehabFriendChat
          open={rehabFriendOpen}
          onClose={() => setRehabFriendOpen(false)}
        />
      </Suspense>

      {showWelcome && (
        <OnboardingWelcome
          userName={user?.user_metadata?.name || user?.email?.split("@")[0]}
          onStart={handleStartTour}
          onSkip={handleSkipWelcome}
        />
      )}
      {tourRunning && tour.currentStepData && (
        <OnboardingTooltip
          step={tour.currentStepData}
          currentStep={tour.currentStep}
          totalSteps={tour.totalSteps}
          onNext={handleTourNext}
          onPrevious={tour.previous}
          onSkip={handleSkipTour}
        />
      )}
      {showComplete && (
        <OnboardingComplete onClose={() => setShowComplete(false)} />
      )}
    </>
  );

  // ── Unified Responsive Layout ───────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[40] h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <Activity className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">REHABROAD</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-wider text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title={
              language === "pt" ? "Switch to English" : "Mudar para Português"
            }
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{language}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[38] bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        className={cn(
          "fixed top-0 left-0 z-[40] h-dvh transition-all duration-200 ease-out lg:translate-x-0",
          sidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        collapsed={sidebarCollapsed}
      />

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => {
          const next = !sidebarCollapsed;
          setSidebarCollapsed(next);
          localStorage.setItem("sidebarCollapsed", String(next));
        }}
        className={cn(
          "hidden lg:flex fixed z-[40] top-1/2 -translate-y-1/2 items-center justify-center",
          "w-6 h-12 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r-lg border border-l-0 border-slate-200 dark:border-white/10",
          "text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-sm",
          sidebarCollapsed ? "left-20" : "left-64"
        )}
        title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-dvh pt-16 lg:pt-0 lg:pb-0 flex flex-col transition-all duration-300 pb-safe",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <BetaCountdownBanner />

        <div className="flex-1 relative">
          <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full"
              >
                <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}>
                  {shouldBlockAccess ? <SubscriptionExpiredWall /> : <Outlet />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Footer />
      </main>

      {/* Rehab Friend floating button — premium only */}
      {isPremium && (
        <button
          type="button"
          data-onboarding="rehab-friend-btn"
          onClick={() => setRehabFriendOpen(true)}
          className={cn(
            "fixed z-[39] flex items-center justify-center gap-2 shadow-xl",
            "bg-gradient-to-br from-primary to-primary/80 text-white",
            "bottom-[env(safe-area-inset-bottom,1.5rem)] right-6 rounded-full px-4 py-3 hover:scale-105 transition-all",
            "mb-6 lg:mb-0" // Add margin on mobile to stay above gesture bar
          )}
          title="Rehab Friend — Assistente IA"
        >
          <Bot className="w-5 h-5" />
          <span className="text-sm font-semibold">Rehab Friend</span>
        </button>
      )}

      {sharedOverlays}
    </div>
  );
}
