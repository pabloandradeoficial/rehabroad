import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/react-app/lib/utils";
import { MobileSidebar } from "./MobileSidebar";
import { RehabFriendFAB } from "./RehabFriendFAB";

// ── Props ─────────────────────────────────────────────────────────────────────

interface MobileLayoutProps {
  children: React.ReactNode;
  onOpenRehabFriend: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileLayout({ children, onOpenRehabFriend }: MobileLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") !== "false";
  });

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  };

  return (
    <div className="relative flex bg-background" style={{ height: "100dvh", width: "100dvw" }}>
      <MobileSidebar collapsed={sidebarCollapsed} />

      {/* ── Toggle button — direct child, never clipped ─────────────────── */}
      <button
        onClick={toggleSidebar}
        className="fixed top-1/2 -translate-y-1/2 z-[60] w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
        style={{ left: sidebarCollapsed ? "34px" : "186px", transition: "left 0.25s ease" }}
        aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        <ChevronLeft
          className={cn(
            "w-4 h-4 text-white transition-transform duration-200",
            sidebarCollapsed && "rotate-180"
          )}
        />
      </button>

      {/* ── Overlay when expanded ───────────────────────────────────────── */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={toggleSidebar}
        />
      )}

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        {children}
      </main>

      <RehabFriendFAB onOpen={onOpenRehabFriend} />
    </div>
  );
}
