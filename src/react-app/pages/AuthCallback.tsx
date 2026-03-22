import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/react-app/lib/supabase";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

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

        if (error) throw error;

        if (data.session) {
          console.log("[auth-callback] sessão encontrada no getSession()", {
            attempt,
            email: data.session.user?.email,
          });
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

        console.log("[auth-callback] retorno recebido", {
          hasCode: Boolean(code),
          hasAccessToken: Boolean(accessToken),
          hasRefreshToken: Boolean(refreshToken),
          pathname: window.location.pathname,
          hashLength: window.location.hash.length,
        });

        let session = null;

        if (accessToken && refreshToken) {
          console.log("[auth-callback] tentando setSession() com hash tokens");

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("[auth-callback] erro no setSession()", error);
            throw error;
          }

          session = data.session ?? null;

          console.log("[auth-callback] retorno do setSession()", {
            hasSession: Boolean(session),
            email: session?.user?.email ?? null,
          });
        } else if (code) {
          console.log("[auth-callback] tentando exchangeCodeForSession()");

          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error(
              "[auth-callback] erro no exchangeCodeForSession()",
              error
            );
            throw error;
          }

          session = data.session ?? null;

          console.log("[auth-callback] retorno do exchangeCodeForSession()", {
            hasSession: Boolean(session),
            email: session?.user?.email ?? null,
          });
        } else {
          throw new Error("Retorno de autenticação inválido.");
        }

        if (!session) {
          console.log(
            "[auth-callback] sessão ainda nula, aguardando getSession()"
          );
          session = await waitForSession();
        }

        if (!session) {
          throw new Error("A sessão não foi concluída a tempo.");
        }

        await refreshSession();
        await wait(250);

        if (!isMounted) return;

        const loginMode = localStorage.getItem("loginMode");
        const destination =
          loginMode === "student" ? "/estudante" : "/dashboard";

        console.log("[auth-callback] redirecionando para", destination);

        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.replace(destination);
      } catch (error) {
        console.error("[auth-callback] Falha ao concluir login:", error);

        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login."
        );

        redirectTimeout = window.setTimeout(() => {
          window.location.replace("/login");
        }, 2500);
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