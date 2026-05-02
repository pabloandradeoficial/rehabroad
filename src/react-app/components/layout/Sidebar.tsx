import { NavLink } from "react-router";
import {
  Activity,
  LayoutDashboard,
  Route,
  HeartPulse,
  Bell,
  LogOut,
  Lock,
  FileText,
  ClipboardCheck,
  Brain,
  Dumbbell,
  Calendar,
  Users,
  Sparkles,
  DollarSign,
  Home,
  MessageSquare,
  Gift,
  Shield,
  GraduationCap,
  Library,
} from "lucide-react";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { cn } from "@/react-app/lib/utils";
import { Button } from "@/react-app/components/ui/button";

const OWNER_EMAIL = "pabloandradeoficial@gmail.com";

const menuPrincipalItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Prontuário", premium: false, dataOnboarding: undefined },
  { to: "/dashboard/agenda", icon: Calendar, label: "Agenda", premium: false, dataOnboarding: undefined, badge: 3 },
  { to: "/dashboard/financeiro", icon: DollarSign, label: "Financeiro", premium: false, dataOnboarding: undefined },
  { to: "/dashboard/caminho", icon: Route, label: "Caminho", premium: true, dataOnboarding: undefined },
  { to: "/dashboard/suporte", icon: HeartPulse, label: "Apoio Clínico", premium: true, dataOnboarding: "apoio-clinico-link" },
  { to: "/dashboard/testes", icon: ClipboardCheck, label: "Testes Ortopédicos", premium: true, dataOnboarding: undefined },
  { to: "/dashboard/exercicios", icon: Dumbbell, label: "Exercícios", premium: true, dataOnboarding: undefined },
  { to: "/dashboard/alertas", icon: Bell, label: "Indicadores", premium: true, dataOnboarding: undefined, badge: 1 },
  { to: "/dashboard/exportacao", icon: FileText, label: "Exportação", premium: true, dataOnboarding: undefined },
];

const ferramentasIaItems = [
  { to: "/dashboard/neuroflux", icon: Brain, label: "NeuroFlux", color: "violet", premium: true },
  { to: "/dashboard/comite", icon: Users, label: "Comitê Executivo", color: "teal", premium: false },
  { to: "/dashboard/biblioteca", icon: Library, label: "Minha Biblioteca", color: "teal", premium: false },
];

const complementoItems = [
  { to: "/dashboard/forum", icon: Users, label: "Comunidade", color: "teal", premium: false },
  { to: "/dashboard/hep", icon: Home, label: "Plano Domiciliar", color: "teal", premium: true },
];

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export default function Sidebar({ className, collapsed = false }: SidebarProps) {
  const { user, logout } = useAppAuth();
  // const { isPremium } = useSubscription();
  const isPremium = true; // Forced true to unblock UI testing

  const normalizedUserEmail = (user?.email || "").trim().toLowerCase();
  const canAccessAdmin = normalizedUserEmail === OWNER_EMAIL;

  const handleLogout = async () => {
    localStorage.removeItem("loginMode");
    await logout();
    window.location.href = "/login";
  };

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Fisioterapeuta";
  const userEmail = user?.email || "";
  const userPicture =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={cn(
        "flex flex-col h-full",
        "bg-white dark:bg-slate-950",
        "border-r border-slate-200 dark:border-white/5",
        className
      )}
    >
      <div className={cn("border-b border-slate-100 dark:border-white/5", collapsed ? "p-3" : "p-5")}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25",
                collapsed ? "w-10 h-10" : "w-11 h-11"
              )}
            >
              <Activity className={cn(collapsed ? "w-5 h-5" : "w-6 h-6", "text-white")} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">REHABROAD</h1>
              <p className="text-[11px] text-slate-500 font-medium">Copiloto Clínico</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden mt-4">
      <nav className={cn("h-full overflow-y-auto overscroll-contain scrollbar-thin", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <div className="mb-3 px-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Menu Principal
            </span>
          </div>
        )}
        <ul className="space-y-0.5">
          {menuPrincipalItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
                title={collapsed ? item.label : undefined}
                {...(item.dataOnboarding ? { "data-onboarding": item.dataOnboarding } : {})}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {item.badge && (
                      <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {!collapsed && (
          <div className="mt-8 mb-3 px-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Ferramentas IA
            </span>
          </div>
        )}
        {collapsed && <div className="mt-6" />}
        <ul className="space-y-0.5">
          {ferramentasIaItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )
                }
              >
                <div
                  className={cn(
                    "rounded-lg flex items-center justify-center flex-shrink-0",
                    collapsed ? "w-6 h-6" : "w-7 h-7",
                    item.color === "violet"
                      ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                      : "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400"
                  )}
                >
                  <item.icon className={cn(collapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {item.to === "/dashboard/neuroflux" && (
                      <Sparkles className="w-4 h-4 text-violet-500" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {!collapsed && (
          <div className="mt-8 mb-3 px-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Complemento
            </span>
          </div>
        )}
        {collapsed && <div className="mt-6" />}
        <ul className="space-y-0.5">
          {complementoItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {!collapsed && (
          <div className="mt-8 mb-3 px-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Suporte
            </span>
          </div>
        )}
        {collapsed && <div className="mt-6" />}
        <ul className="space-y-0.5">
          <li>
            <NavLink
              to="/dashboard/contato"
              title={collapsed ? "Contato" : undefined}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )
              }
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1">Contato</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/indicacao"
              title={collapsed ? "Indicar Colega" : undefined}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )
              }
            >
              <Gift className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1">Indicar Colega</span>}
            </NavLink>
          </li>

          {canAccessAdmin && (
            <>
              <li>
                <NavLink
                  to="/dashboard/admin"
                  title={collapsed ? "Admin" : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )
                  }
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Admin</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/admin-estudante"
                  title={collapsed ? "Admin Estudante" : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center rounded-xl text-[13px] font-semibold transition-all duration-200 min-h-[44px]",
                      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )
                  }
                >
                  <GraduationCap className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">Admin Estudante</span>}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>

      <div className={cn(collapsed ? "px-2 py-4" : "p-4")}>
        <NavLink
          to="/dashboard/perfil"
          data-onboarding="user-profile"
          className={cn(
            "flex items-center rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          {userPicture ? (
            <img
              src={userPicture}
              alt={userName}
              className={cn(
                "rounded-full object-cover",
                collapsed ? "w-10 h-10" : "w-10 h-10"
              )}
            />
          ) : (
            <div
              className={cn(
                "rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300",
                collapsed ? "w-10 h-10" : "w-10 h-10"
              )}
            >
              <span className="font-bold text-sm">
                {userInitials}
              </span>
            </div>
          )}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}