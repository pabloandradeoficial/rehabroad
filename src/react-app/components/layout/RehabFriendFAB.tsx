import { useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";

interface RehabFriendFABProps {
  onOpen: () => void;
}

export function RehabFriendFAB({ onOpen }: RehabFriendFABProps) {
  const [minimized, setMinimized] = useState(() => {
    return localStorage.getItem("rehab_fab_minimized") === "true";
  });

  const minimize = () => {
    setMinimized(true);
    localStorage.setItem("rehab_fab_minimized", "true");
  };

  const expand = () => {
    setMinimized(false);
    localStorage.setItem("rehab_fab_minimized", "false");
  };

  if (minimized) {
    return (
      <div className="fixed bottom-6 left-2 z-50">
        <button
          onClick={expand}
          className="w-10 h-10 rounded-xl bg-purple-600/80 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          aria-label="Expandir Rehab Friend"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-2 z-50 flex flex-col items-center gap-2">
      {/* Minimizar */}
      <button
        onClick={minimize}
        className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center"
        aria-label="Minimizar"
      >
        <ChevronDown className="w-3 h-3 text-white" />
      </button>

      {/* FAB principal */}
      <button
        onClick={onOpen}
        className="w-14 h-14 rounded-2xl bg-purple-600 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-purple-500/40 active:scale-95 transition-transform"
        aria-label="Abrir Rehab Friend"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-[9px] text-white/80 font-medium">Rehab IA</span>
      </button>
    </div>
  );
}
