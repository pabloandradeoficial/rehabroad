import { Outlet, useLocation, NavLink } from "react-router";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  AlertTriangle,
  CreditCard,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Route,
  Users,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";
import { BetaCountdownBanner } from "@/react-app/components/BetaCountdownBanner";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

const BOTTOM_NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Prontuário", end: true },
  { to: "/dashboard/agenda", icon: Calendar, label: "Agenda", end: false },
  { to: "/dashboard/financeiro", icon: DollarSign, label: "Financeiro", end: false },
  { to: "/dashboard/caminho", icon: Route, label: "Caminho", end: false },
  { to: "/dashboard/forum", icon: Users, label: "Comunidade", end: false },
];

// Pages that expired users can still access
const ALLOWED_PAGES_FOR_EXPIRED = [
  "/dashboard/plano",
  "/dashboard/contato",
  "/dashboard/admin",
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false;
  });

  const { logout } = useAppAuth();
  const { language, setLanguage } = useLanguage();
  const {
    isFreeLimited,
    loading: subscriptionLoading,
    isAdmin,
    subscription,
  } = useSubscription();
  const location = useLocation();

  // Check if current page is allowed for expired users
  const isAllowedPage = ALLOWED_PAGES_FOR_EXPIRED.some((page) =>
    location.pathname.startsWith(page)
  );

  // Determine if user should be blocked
  const shouldBlockAccess =
    !subscriptionLoading &&
    isFreeLimited &&
    !isAllowedPage &&
    !isAdmin &&
    subscription?.effective_status !== 'active_paid' &&
    subscription?.status !== 'active_paid';

  // Persist sidebar collapsed state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Auto-close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("loginMode");
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[40] h-16 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">REHABROAD</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title={
              language === "pt" ? "Switch to English" : "Mudar para Português"
            }
          >
            <Globe className="w-4 h-4" />
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
          className="lg:hidden fixed inset-0 z-[38] bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        className={cn(
          "fixed top-0 left-0 z-[40] h-screen transition-all duration-300 ease-out lg:translate-x-0",
          sidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        collapsed={sidebarCollapsed}
      />

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          "hidden lg:flex fixed z-[40] top-1/2 -translate-y-1/2 items-center justify-center",
          "w-6 h-12 bg-slate-800 hover:bg-slate-700 rounded-r-lg border border-l-0 border-white/10",
          "text-slate-400 hover:text-white transition-all duration-300 shadow-lg",
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
          "min-h-screen pt-16 lg:pt-0 pb-16 lg:pb-0 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {/* Beta Retention Banner */}
        <BetaCountdownBanner />

        {/* Content Area with subtle pattern */}
        <div className="flex-1 relative">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative p-4 sm:p-6 lg:p-8">
            {shouldBlockAccess ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="max-w-lg w-full text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Seu período de teste expirou
                  </h1>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Seu trial de 30 dias chegou ao fim. Para continuar usando
                    todas as funcionalidades do REHABROAD, escolha um plano que
                    se adapta às suas necessidades.
                  </p>

                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                          Seus dados estão seguros
                        </p>
                        <p>
                          Todas as suas avaliações, evoluções e pacientes
                          continuam salvos. Ao assinar, você terá acesso imediato
                          a tudo novamente.
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
            ) : (
              <Outlet />
            )}
          </div>
        </div>

        <Footer />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[40] bg-slate-900/95 backdrop-blur-xl border-t border-white/5 flex items-stretch safe-area-inset-bottom">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-h-[56px]",
                isActive
                  ? "text-teal-400"
                  : "text-slate-400 hover:text-slate-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive && "text-teal-400")} />
                <span className="leading-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}