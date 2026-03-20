import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/react-app/lib/supabase";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { refreshSession } = useAppAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, "")
        );

        const providerError =
          searchParams.get("error_description") ||
          hashParams.get("error_description") ||
          searchParams.get("error") ||
          hashParams.get("error");

        if (providerError) {
          throw new Error(decodeURIComponent(providerError));
        }

        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        await refreshSession();

        const loginMode = localStorage.getItem("loginMode");
        const destination =
          loginMode === "student" ? "/estudante" : "/dashboard";

        navigate(destination, { replace: true });
      } catch (error) {
        console.error("[auth-callback] Falha ao concluir login:", error);

        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login."
        );

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, refreshSession]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative text-center">
        <div className="absolute inset-0 w-32 h-32 mx-auto bg-primary/30 rounded-full blur-2xl animate-pulse" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-teal-500 to-emerald-500 rounded-3xl shadow-2xl mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>

          {errorMessage ? (
            <>
              <p className="text-lg font-semibold text-foreground mb-2">
                Falha ao concluir o login
              </p>
              <p className="text-sm text-red-400 max-w-md">{errorMessage}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Redirecionando para a tela de login...
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-muted-foreground font-medium">
                  Finalizando login...
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}