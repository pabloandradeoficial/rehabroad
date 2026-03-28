import { Activity, LogOut } from "lucide-react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function PatientLayout({ children }: Props) {
  const { user, logout } = useAppAuth();

  const displayName =
    (user?.user_metadata as { full_name?: string; name?: string } | undefined)
      ?.full_name ??
    (user?.user_metadata as { full_name?: string; name?: string } | undefined)
      ?.name ??
    user?.email ??
    "Paciente";

  const handleLogout = async () => {
    localStorage.removeItem("loginMode");
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">
              REHABROAD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {displayName}
            </span>
            <button
              onClick={() => void handleLogout()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
              type="button"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
