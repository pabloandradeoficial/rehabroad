import { useState } from "react";
import { NavLink } from "react-router";
import {
  Users,
  Calendar,
  HeartPulse,
  MessageCircle,
  Brain,
  Dumbbell,
  Route,
  DollarSign,
  FileText,
  ClipboardCheck,
  BookOpen,
  User,
  ChevronLeft,
  Activity,
  Sparkles,
} from "lucide-react";
import { cn } from "@/react-app/lib/utils";

// ── Nav data ──────────────────────────────────────────────────────────────────

const mainItems = [
  { to: "/dashboard", icon: Users, label: "Prontuário", end: true },
  { to: "/dashboard/agenda", icon: Calendar, label: "Agenda", end: false },
  { to: "/dashboard/suporte", icon: HeartPulse, label: "Apoio Clínico", end: false },
  { to: "/dashboard/financeiro", icon: DollarSign, label: "Financeiro", end: false },
  { to: "/dashboard/exportacao", icon: FileText, label: "Exportação", end: false },
  { to: "/dashboard/testes", icon: ClipboardCheck, label: "Testes", end: false },
];

const iaItems = [
  { to: "/dashboard/neuroflux", icon: Brain, label: "NeuroFlux", color: "violet" as const },
  { to: "/dashboard/exercicios", icon: Dumbbell, label: "Exercícios", color: "teal" as const },
  { to: "/dashboard/caminho", icon: Route, label: "Caminho", color: "teal" as const },
];

const communityItems = [
  { to: "/dashboard/forum", icon: BookOpen, label: "Comunidade", end: false },
  { to: "/dashboard/perfil", icon: User, label: "Meu Perfil", end: false },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface MobileSidebarProps {
  onOpenRehabFriend: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileSidebar({ onOpenRehabFriend }: MobileSidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  };

  const navLinkClass = (isActive: boolean) =>
    cn(
      "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
      isActive
        ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-l-2 border-teal-400"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    );

  const iaLinkClass = (isActive: boolean, color: "violet" | "teal") =>
    cn(
      "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
      isActive
        ? color === "violet"
          ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400 border-l-2 border-violet-400"
          : "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border-l-2 border-teal-400"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    );

  const rehabFriendActive = false; // action button, never "active"

  return (
    <aside
      className={cn(
        "relative flex-shrink-0 flex flex-col h-full overflow-hidden",
        "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
        "border-r border-white/5"
      )}
      style={{
        width: collapsed ? 48 : 200,
        transition: "width 0.25s ease",
      }}
    >
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className={cn("border-b border-white/5", collapsed ? "p-3" : "px-4 py-3")}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-white tracking-tight text-sm leading-tight">REHABROAD</h1>
              <p className="text-[10px] text-slate-400 font-medium">Copiloto Clínico</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className={cn("flex-1 overflow-y-auto overscroll-contain scrollbar-thin py-2", collapsed ? "px-2" : "px-3")}>

        {/* Section: Menu Principal */}
        {!collapsed && (
          <div className="mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Menu Principal
            </span>
          </div>
        )}
        <ul className="space-y-0.5">
          {mainItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Section: Ferramentas IA */}
        {!collapsed && (
          <div className="mt-5 mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Ferramentas IA
            </span>
          </div>
        )}
        {collapsed && <div className="mt-3" />}
        <ul className="space-y-1">
          {/* Rehab Friend — action button */}
          <li>
            <button
              onClick={onOpenRehabFriend}
              className={cn(
                "w-full group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                rehabFriendActive
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-400 border-l-2 border-violet-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className={cn(
                "rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0",
                collapsed ? "w-6 h-6" : "w-7 h-7",
                "bg-gradient-to-br from-violet-500/30 to-purple-600/30"
              )}>
                <MessageCircle className={cn(collapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1">Rehab Friend</span>
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                </>
              )}
            </button>
          </li>

          {/* IA route items */}
          {iaItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => iaLinkClass(isActive, item.color)}
              >
                <div className={cn(
                  "rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0",
                  collapsed ? "w-6 h-6" : "w-7 h-7",
                  item.color === "violet"
                    ? "bg-gradient-to-br from-violet-500/30 to-purple-600/30"
                    : "bg-gradient-to-br from-teal-500/30 to-emerald-600/30"
                )}>
                  <item.icon className={cn(collapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
                </div>
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Section: Comunidade & Conta */}
        {!collapsed && (
          <div className="mt-5 mb-2">
            <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Conta
            </span>
          </div>
        )}
        {collapsed && <div className="mt-3" />}
        <ul className="space-y-0.5">
          {communityItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Fade gradient (matches desktop) ───────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-10 left-0 right-0 h-8 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* ── Toggle button ─────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3.5 top-1/2 -translate-y-1/2 z-10",
          "w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500",
          "flex items-center justify-center",
          "shadow-lg shadow-teal-500/30 transition-all duration-200",
          "hover:scale-110 active:scale-95"
        )}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <ChevronLeft
          className={cn(
            "w-4 h-4 text-white transition-transform duration-200",
            collapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}
