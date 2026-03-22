import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import DashboardLayout from "@/react-app/components/layout/DashboardLayout";

export default function ProtectedDashboard() {
  const { user, isPending } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      const destination = `${location.pathname}${location.search}${location.hash}`;
      const encodedDestination = encodeURIComponent(destination);

      navigate(`/login?redirect=${encodedDestination}`, {
        replace: true,
      });
    }
  }, [user, isPending, navigate, location]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando sessão...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Redirecionando para login...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}