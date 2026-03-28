import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Users,
  Calendar,
  HeartPulse,
  MessageCircle,
  Menu,
  X,
  Brain,
  Dumbbell,
  Home,
  Route,
  FileText,
  BarChart3,
  Download,
  Bell,
  BookOpen,
  Gift,
  User,
  Phone,
  DollarSign,
  ClipboardCheck,
  ChevronRight,
  Plus,
} from "lucide-react";

// ── Bottom nav — 5 abas principais ───────────────────────────────────────────

interface BottomNavItem {
  icon: React.ElementType;
  label: string;
  href: string | null;
  action?: "rehab-friend" | "more-menu";
  end?: boolean;
}

const BOTTOM_NAV: BottomNavItem[] = [
  { icon: Users, label: "Prontuário", href: "/dashboard", end: true },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
  { icon: HeartPulse, label: "Apoio", href: "/dashboard/suporte" },
  { icon: MessageCircle, label: "IA", href: null, action: "rehab-friend" },
  { icon: Menu, label: "Mais", href: null, action: "more-menu" },
];

// ── More menu ─────────────────────────────────────────────────────────────────

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MORE_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Ferramentas IA",
    items: [
      { icon: Brain, label: "NeuroFlux", href: "/dashboard/neuroflux", badge: "IA" },
      { icon: Dumbbell, label: "Exercícios", href: "/dashboard/exercicios" },
      { icon: Home, label: "Plano Domiciliar", href: "/dashboard/hep", badge: "Novo" },
      { icon: Route, label: "Caminho Clínico", href: "/dashboard/caminho" },
      { icon: ClipboardCheck, label: "Testes Clínicos", href: "/dashboard/testes" },
    ],
  },
  {
    title: "Gestão",
    items: [
      { icon: DollarSign, label: "Financeiro", href: "/dashboard/financeiro" },
      { icon: BarChart3, label: "Indicadores", href: "/dashboard/alertas" },
      { icon: Download, label: "Exportação", href: "/dashboard/exportacao" },
      { icon: Bell, label: "Alertas", href: "/dashboard/alertas" },
    ],
  },
  {
    title: "Comunidade",
    items: [
      { icon: BookOpen, label: "Comunidade", href: "/dashboard/forum" },
      { icon: Gift, label: "Indicar Colega", href: "/dashboard/indicacao" },
    ],
  },
  {
    title: "Conta",
    items: [
      { icon: User, label: "Meu Perfil", href: "/dashboard/perfil" },
      { icon: Phone, label: "Suporte", href: "/dashboard/contato" },
      { icon: FileText, label: "Plano / Assinatura", href: "/dashboard/plano" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface MobileLayoutProps {
  children: React.ReactNode;
  onOpenRehabFriend: () => void;
}

export function MobileLayout({ children, onOpenRehabFriend }: MobileLayoutProps) {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isActive = (item: BottomNavItem): boolean => {
    if (!item.href) return false;
    if (item.end) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
      {/* ── Main scroll area ─────────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {children}
      </main>

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[40] bg-slate-900/95 border-t border-white/5"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center h-16">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            if (item.action === "rehab-friend") {
              return (
                <button
                  key="rehab-friend"
                  onClick={onOpenRehabFriend}
                  className="flex-1 flex flex-col items-center gap-0.5 py-2 active:opacity-70 transition-opacity"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Icon size={14} className="text-white" />
                  </div>
                  <span className="text-[10px] text-violet-400 font-medium">{item.label}</span>
                </button>
              );
            }

            if (item.action === "more-menu") {
              return (
                <button
                  key="more"
                  onClick={() => setShowMoreMenu(true)}
                  className="flex-1 flex flex-col items-center gap-0.5 py-2 active:opacity-70 transition-opacity"
                >
                  <Icon size={20} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-medium">Mais</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href!}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 active:opacity-70 transition-opacity"
              >
                <Icon
                  size={20}
                  className={active ? "text-teal-400" : "text-slate-400"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-teal-400" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── More Menu Drawer ─────────────────────────────────────────────── */}
      {showMoreMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[50] bg-black/50"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[51] bg-slate-900 rounded-t-2xl max-h-[85dvh] overflow-y-auto"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h2 className="font-semibold text-white">Menu completo</h2>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
              >
                <X size={16} className="text-slate-300" />
              </button>
            </div>

            {/* Sections */}
            <div className="px-4 py-2">
              {MORE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="mb-5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1 mb-2">
                    {section.title}
                  </p>
                  <div className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                    {section.items.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setShowMoreMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3.5 active:bg-white/5 ${
                            index < section.items.length - 1 ? "border-b border-white/5" : ""
                          }`}
                        >
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon size={16} className="text-slate-300" />
                          </div>
                          <span className="flex-1 text-sm font-medium text-slate-200">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={14} className="text-slate-600" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Novo Paciente shortcut */}
              <Link
                to="/dashboard"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm mb-2"
              >
                <Plus size={16} />
                Novo Paciente
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
