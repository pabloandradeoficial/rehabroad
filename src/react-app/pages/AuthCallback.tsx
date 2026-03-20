import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Activity, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { exchangeCodeForSessionToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        
        // Check login mode and redirect accordingly
        const loginMode = localStorage.getItem("loginMode");
        localStorage.removeItem("loginMode"); // Clean up
        
        if (loginMode === "student") {
          navigate("/estudante");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
          <Activity className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Autenticando...</span>
        </div>
      </div>
    </div>
  );
}
