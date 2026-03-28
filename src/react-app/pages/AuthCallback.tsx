import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/react-app/lib/supabase";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import { apiFetch } from "@/react-app/lib/api";

export default function AuthCallbackPage() {
  const { refreshSession } = useAppAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let redirectTimeout: number | undefined;

    const wait = (ms: number) =>
      new Promise((resolve) => window.setTimeout(resolve, ms));

    const waitForSession = async (attempts = 20, interval = 400) => {
      for (let attempt = 0; attempt < attempts; attempt++) {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          return data.session;
        }

        await wait(interval);
      }

      return null;
    };

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
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        let session = null;

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          session = data.session ?? null;
        } else if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            throw error;
          }

          session = data.session ?? null;
        } else {
          // Supabase PKCE v2 may have already consumed the ?code= during
          // client initialization before this effect ran, leaving the URL as
          // /auth/callback# with no params. Wait briefly for the session that
          // was established internally before giving up.
          session = await waitForSession(10, 300);
          if (!session) {
            throw new Error("Retorno de autenticação inválido.");
          }
        }

        if (!session) {
          session = await waitForSession();
        }

        if (!session) {
          throw new Error("A sessão não foi concluída a tempo.");
        }

        await refreshSession();
        await wait(250);

        if (!isMounted) return;

        window.history.replaceState({}, document.title, window.location.pathname);

        const loginMode = localStorage.getItem("loginMode");
        if (loginMode === "student") {
          window.location.replace("/estudante");
          return;
        }

        // Check if the user is a registered patient
        try {
          const res = await apiFetch("/api/patient-portal/me");
          if (res.ok) {
            const data = await res.json() as { isPatient: boolean };
            if (data.isPatient) {
              window.location.replace("/patient");
              return;
            }
          }
        } catch {
          // fall through to dashboard on error
        }

        window.location.replace("/dashboard");
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login."
        );

        redirectTimeout = window.setTimeout(() => {
          window.location.replace("/login");
        }, 3000);
      }
    };

    void handleAuthCallback();

    return () => {
      isMounted = false;

      if (redirectTimeout) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [refreshSession]);

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
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground font-medium">
                Finalizando login...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}