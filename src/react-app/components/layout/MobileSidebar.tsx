import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Users2,
  Calendar,
  HeartPulse,
  MessageCircle,
  Zap,
  Dumbbell,
  Route,
  BarChart2,
  FileDown,
  ClipboardList,
  Users,
  UserCircle,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/react-app/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  action?: "rehab-friend";
  badge?: string;
  end?: boolean;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

// ── Nav data ──────────────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    items: [
      { icon: Users2, label: "Prontuário", href: "/dashboard", end: true },
      { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
      { icon: HeartPulse, label: "Apoio Clínico", href: "/dashboard/suporte" },
    ],
  },
  {
    title: "Ferramentas IA",
    items: [
      { icon: MessageCircle, label: "Rehab Friend", action: "rehab-friend", badge: "IA" },
      { icon: Zap, label: "NeuroFlux", href: "/dashboard/neuroflux" },
      { icon: Dumbbell, label: "Exercícios", href: "/dashboard/exercicios" },
      { icon: Route, label: "Caminho Clínico", href: "/dashboard/caminho" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { icon: BarChart2, label: "Financeiro", href: "/dashboard/financeiro" },
      { icon: FileDown, label: "Exportar PDF", href: "/dashboard/exportacao" },
      { icon: ClipboardList, label: "Testes Clínicos", href: "/dashboard/testes" },
    ],
  },
  {
    title: "Comunidade",
    items: [
      { icon: Users, label: "Fórum", href: "/dashboard/forum" },
    ],
  },
  {
    title: "Conta",
    items: [
      { icon: UserCircle, label: "Perfil", href: "/dashboard/perfil" },
    ],
  },
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
  const location = useLocation();

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  };

  const isActive = (item: SidebarItem): boolean => {
    if (!item.href) return false;
    if (item.end) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <aside
      className="relative flex-shrink-0 bg-[#0d1117] border-r border-white/[0.06] flex flex-col overflow-hidden"
      style={{
        width: collapsed ? 48 : 200,
        transition: "width 0.25s ease",
      }}
    >
      {/* ── Brand ────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center h-12 border-b border-white/[0.06] flex-shrink-0",
          collapsed ? "px-3 justify-center" : "px-3 gap-2"
        )}
      >
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <Activity className="w-3.5 h-3.5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-[11px] font-bold text-white/80 tracking-wider uppercase whitespace-nowrap">
            Rehabroad
          </span>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
        {SIDEBAR_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {/* Divider between sections */}
            {sIdx > 0 && (
              <div className="h-px bg-white/[0.06] my-1.5 mx-3" />
            )}

            {/* Section label */}
            {!collapsed && section.title && (
              <div className="px-3 pt-2 pb-1 text-[10px] text-white/30 uppercase tracking-widest font-semibold select-none">
                {section.title}
              </div>
            )}

            {/* Items */}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              // Rehab Friend — action button
              if (item.action === "rehab-friend") {
                return (
                  <button
                    key="rehab-friend"
                    onClick={onOpenRehabFriend}
                    className={cn(
                      "w-full flex items-center transition-colors duration-100",
                      "hover:bg-white/5 active:bg-white/10",
                      collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5 gap-3"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 text-violet-400" />
                    {!collapsed && (
                      <>
                        <span className="text-sm whitespace-nowrap text-white/60">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              }

              // Regular nav link
              return (
                <NavLink
                  key={item.href}
                  to={item.href!}
                  end={item.end}
                  className={cn(
                    "flex items-center transition-colors duration-100",
                    "hover:bg-white/5 active:bg-white/10",
                    collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5 gap-3",
                    active && "bg-primary/10 border-r-2 border-primary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      active ? "text-primary" : "text-white/50"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span
                        className={cn(
                          "text-sm whitespace-nowrap",
                          active ? "text-white font-medium" : "text-white/60"
                        )}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Toggle button ─────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3.5 top-1/2 -translate-y-1/2 z-10",
          "w-7 h-7 rounded-full bg-primary flex items-center justify-center",
          "shadow-lg shadow-primary/30 transition-all duration-200",
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
