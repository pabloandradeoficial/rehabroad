import { NavLink } from "react-router";
import {
  Activity,
  LayoutDashboard,
  Route,
  HeartPulse,
  Bell,
  LogOut,
  Crown,
  Lock,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Brain,
  Shield,
  Dumbbell,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  DollarSign,
  Gift,
  GraduationCap,
} from "lucide-react";
import { useSubscription } from "@/react-app/contexts/SubscriptionContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { cn } from "@/react-app/lib/utils";
import { Button } from "@/react-app/components/ui/button";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Prontuário", premium: false },
  { to: "/dashboard/agenda", icon: Calendar, label: "Agenda", premium: false },
  { to: "/dashboard/financeiro", icon: DollarSign, label: "Financeiro", premium: false },
  { to: "/dashboard/caminho", icon: Route, label: "Caminho", premium: true },
  { to: "/dashboard/suporte", icon: HeartPulse, label: "Apoio Clínico", premium: true },
  { to: "/dashboard/testes", icon: ClipboardCheck, label: "Testes", premium: true },
  { to: "/dashboard/alertas", icon: Bell, label: "Indicadores", premium: true },
  { to: "/dashboard/exportacao", icon: FileText, label: "Exportação", premium: true },
  { to: "/dashboard/exercicios", icon: Dumbbell, label: "Exercícios", premium: true },
];

const specialItems = [
  { to: "/dashboard/neuroflux", icon: Brain, label: "NeuroFlux", color: "violet", premium: true },
  { to: "/dashboard/forum", icon: Users, label: "Comunidade", color: "teal", premium: false },
];

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export default function Sidebar({ className, collapsed = false }: SidebarProps) {
  const { user, logout } = useAppAuth();
  const { isPremium, isAdmin } = useSubscription();

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
        "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
        "border-r border-white/5",
        className
      )}
    >
      {/* Logo Section */}
      <div className={cn("border-b border-white/5", collapsed ? "p-3" : "p-5")}>
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
              <h1 className="font-bold text-white tracking-tight text-lg">REHABROAD</h1>
              <p className="text-[11px] text-slate-400 font-medium">Copiloto Clínico</p>
            </div>
          )}
        </div>
      </div>

      {/* User Card */}
      <div className={cn(collapsed ? "p-2" : "p-4")}>
        <div
          className={cn(
            "flex items-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors",
            collapsed ? "p-2 justify-center" : "gap-3 p-3"
          )}
        >
          {userPicture ? (
            <img
              src={userPicture}
              alt={userName}
              className={cn(
                "rounded-xl ring-2 ring-white/10",
                collapsed ? "w-9 h-9" : "w-10 h-10"
              )}
            />
          ) : (
            <div
              className={cn(
                "rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0",
                collapsed ? "w-9 h-9" : "w-10 h-10"
              )}
            >
              <span className={cn("font-bold text-white", collapsed ? "text-xs" : "text-sm")}>
                {userInitials}
              </span>
            </div>
          )}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
              </div>
              {isPremium && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn("flex-1 overflow-y-auto scrollbar-thin", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <div className="mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Menu Principal
            </span>
          </div>
        )}
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-l-2 border-teal-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )
                }
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Special Features */}
        {!collapsed && (
          <div className="mt-6 mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Ferramentas IA
            </span>
          </div>
        )}
        {collapsed && <div className="mt-4" />}
        <ul className="space-y-1">
          {specialItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? item.color === "violet"
                        ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400 border-l-2 border-violet-400"
                        : "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-l-2 border-teal-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )
                }
              >
                <div
                  className={cn(
                    "rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0",
                    collapsed ? "w-6 h-6" : "w-7 h-7",
                    item.color === "violet"
                      ? "bg-gradient-to-br from-violet-500/30 to-purple-600/30"
                      : "bg-gradient-to-br from-teal-500/30 to-emerald-600/30"
                  )}
                >
                  <item.icon className={cn(collapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.premium && !isPremium && (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    {item.to === "/dashboard/neuroflux" && (
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Support & Admin */}
        {!collapsed && (
          <div className="mt-6 mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Suporte
            </span>
          </div>
        )}
        {collapsed && <div className="mt-4" />}
        <ul className="space-y-0.5">
          <li>
            <NavLink
              to="/dashboard/contato"
              title={collapsed ? "Contato" : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-l-2 border-teal-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <MessageSquare className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="flex-1">Contato</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/indicacao"
              title={collapsed ? "Indicar Colega" : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400 border-l-2 border-violet-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <Gift className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="flex-1">Indicar Colega</span>}
            </NavLink>
          </li>
          {isAdmin && (
            <>
              <li>
                <NavLink
                  to="/dashboard/admin"
                  title={collapsed ? "Admin" : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-violet-500/10 text-purple-400 border-l-2 border-purple-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  <Shield className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="flex-1">Admin</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/admin-estudante"
                  title={collapsed ? "Admin Estudante" : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                      isActive
                        ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400 border-l-2 border-violet-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  <GraduationCap className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span className="flex-1">Admin Estudante</span>}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Plan CTA */}
      <div className={cn(collapsed ? "p-2" : "p-3")}>
        <NavLink
          to="/dashboard/plano"
          title={collapsed ? (isPremium ? "Plano Ativo" : "Seja Premium") : undefined}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]",
              collapsed ? "p-2.5 flex items-center justify-center" : "p-4",
              isPremium
                ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
                : "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30"
            )}
          >
            {collapsed ? (
              <Crown className={cn("w-5 h-5", isPremium ? "text-emerald-400" : "text-amber-400")} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className={cn("w-5 h-5", isPremium ? "text-emerald-400" : "text-amber-400")} />
                    <span
                      className={cn(
                        "font-semibold text-sm",
                        isPremium ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      {isPremium ? "Plano Ativo" : "Seja Premium"}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn("w-4 h-4", isPremium ? "text-emerald-400" : "text-amber-400")}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {isPremium
                    ? "Você tem acesso a todas as funcionalidades"
                    : "Desbloqueie recursos avançados por R$29/mês"}
                </p>
                {!isPremium && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
                )}
              </>
            )}
          </div>
        </NavLink>
      </div>

      {/* Bottom Actions */}
      <div className={cn("border-t border-white/5", collapsed ? "p-2" : "p-3")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}