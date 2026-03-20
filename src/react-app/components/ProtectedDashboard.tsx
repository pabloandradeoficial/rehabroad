import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Activity, Loader2 } from "lucide-react";
import DashboardLayout from "./layout/DashboardLayout";

export default function ProtectedDashboard() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/login");
    }
  }, [user, isPending, navigate]);

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Show dashboard directly
  return <DashboardLayout />;
}
