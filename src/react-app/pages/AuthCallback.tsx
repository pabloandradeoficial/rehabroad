import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { supabase } from "@/react-app/lib/supabase";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

export default function AuthCallbackPage() {
  const { refreshSession } = useAppAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLines, setDebugLines] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    let redirectTimeout: number | undefined;

    const pushDebug = (line: string) => {
      console.log("[auth-callback]", line);
      if (!isMounted) return;
      setDebugLines((prev) => [...prev, line]);
    };

    const wait = (ms: number) =>
      new Promise((resolve) => window.setTimeout(resolve, ms));

    const waitForSession = async (attempts = 20, interval = 400) => {
      for (let attempt = 0; attempt < attempts; attempt++) {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          pushDebug(`getSession erro: ${error.message}`);
          throw error;
        }

        if (data.session) {
          pushDebug(
            `getSession ok na tentativa ${attempt + 1} | user=${data.session.user?.email ?? "null"}`
          );
          return data.session;
        }

        pushDebug(`getSession sem sessão na tentativa ${attempt + 1}`);
        await wait(interval);
      }

      return null;
    };

    const handleAuthCallback = async () => {
      try {
        pushDebug(`pathname=${window.location.pathname}`);
        pushDebug(`search=${window.location.search || "(vazio)"}`);
        pushDebug(`hash presente=${window.location.hash ? "sim" : "não"}`);

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
          pushDebug(`providerError=${providerError}`);
          throw new Error(decodeURIComponent(providerError));
        }

        const code = searchParams.get("code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        pushDebug(`hasCode=${Boolean(code)}`);
        pushDebug(`hasAccessToken=${Boolean(accessToken)}`);
        pushDebug(`hasRefreshToken=${Boolean(refreshToken)}`);

        let session = null;

        if (accessToken && refreshToken) {
          pushDebug("iniciando setSession com tokens da hash");

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            pushDebug(`setSession erro: ${error.message}`);
            throw error;
          }

          session = data.session ?? null;

          pushDebug(
            `setSession retorno | hasSession=${Boolean(session)} | user=${session?.user?.email ?? "null"}`
          );
        } else if (code) {
          pushDebug("iniciando exchangeCodeForSession");

          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            pushDebug(`exchangeCodeForSession erro: ${error.message}`);
            throw error;
          }

          session = data.session ?? null;

          pushDebug(
            `exchangeCodeForSession retorno | hasSession=${Boolean(session)} | user=${session?.user?.email ?? "null"}`
          );
        } else {
          throw new Error("Retorno de autenticação inválido.");
        }

        if (!session) {
          pushDebug("sessão ainda nula após setSession/exchange, aguardando getSession");
          session = await waitForSession();
        }

        if (!session) {
          throw new Error("A sessão não foi concluída a tempo.");
        }

        pushDebug(`sessão final ok | user=${session.user?.email ?? "null"}`);

        await refreshSession();
        pushDebug("refreshSession concluído");

        await wait(300);

        if (!isMounted) return;

        const loginMode = localStorage.getItem("loginMode");
        const destination =
          loginMode === "student" ? "/estudante" : "/dashboard";

        pushDebug(`redirecionando para ${destination}`);

        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.replace(destination);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login.";

        pushDebug(`FALHA FINAL: ${message}`);

        if (!isMounted) return;

        setErrorMessage(message);

        redirectTimeout = window.setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
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
      <div className="relative text-center max-w-2xl w-full">
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
              <p className="text-sm text-red-400 max-w-md mx-auto">
                {errorMessage}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Redirecionando para a tela de login...
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground font-medium">
                Finalizando login...
              </span>
            </div>
          )}

          <div className="mt-8 text-left rounded-2xl border border-white/10 bg-black/20 p-4 max-h-80 overflow-auto">
            <p className="text-xs font-semibold text-foreground mb-3">
              Debug do callback
            </p>
            <div className="space-y-2">
              {debugLines.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem logs ainda...</p>
              ) : (
                debugLines.map((line, index) => (
                  <p
                    key={index}
                    className="text-xs text-muted-foreground break-all"
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}