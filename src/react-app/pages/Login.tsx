import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  Loader2,
  Shield,
  Zap,
  Award,
  GraduationCap,
  Briefcase,
  Globe,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useAppAuth();
  const { language, setLanguage } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const loginMode = localStorage.getItem("loginMode");
      if (loginMode === "student") {
        navigate("/estudante");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (mode: "professional" | "student") => {
    try {
      setLoginError(null);
      localStorage.setItem("loginMode", mode);
      setIsSubmitting(true);

      const res = await fetch("/api/oauth/google/redirect_url", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Não foi possível obter a URL de login.");
      }

      const data: unknown = await res.json();

      const redirectUrl =
        data &&
        typeof data === "object" &&
        typeof (data as { redirectUrl?: unknown }).redirectUrl === "string"
          ? (data as { redirectUrl: string }).redirectUrl
          : null;

      if (!redirectUrl) {
        throw new Error("URL de login inválida.");
      }

      window.location.assign(redirectUrl);
    } catch (error) {
      console.error("[login] Falha ao iniciar login com Google:", error);

      setLoginError(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o login com Google. Tente novamente."
      );

      setIsSubmitting(false);
    }
  };

  if (isPending || isSubmitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-teal-500 to-emerald-500 rounded-3xl shadow-2xl mb-6">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground font-medium">
                {isSubmitting ? "Redirecionando..." : "Carregando..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-violet-500/15 to-purple-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-full blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <button
        onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white/80 hover:text-white transition-all"
        title={language === "pt" ? "Switch to English" : "Mudar para Português"}
        type="button"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 w-24 h-24 bg-primary/40 rounded-3xl blur-xl" />
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-teal-500 to-emerald-500 rounded-3xl shadow-2xl shadow-primary/30">
              <Activity className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
            REHABROAD
          </h1>
          <p className="text-muted-foreground text-lg">
            Plataforma de Apoio Clínico
          </p>
        </div>

        <div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/20 rounded-[2rem] blur-xl opacity-70" />

            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />

              <div className="relative p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Como você quer acessar?
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha o modo que melhor se adapta às suas necessidades
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => void handleLogin("professional")}
                    disabled={isSubmitting}
                    className="group p-4 rounded-xl border-2 border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all duration-300 text-left disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Profissional
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Gerencie pacientes e clínica
                    </p>
                  </button>

                  <button
                    onClick={() => void handleLogin("student")}
                    disabled={isSubmitting}
                    className="group p-4 rounded-xl border-2 border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500 transition-all duration-300 text-left disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5 text-violet-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Estudante
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Pratique casos clínicos
                    </p>
                  </button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-xs uppercase tracking-wider text-muted-foreground bg-card/80">
                      ou faça login direto
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => void handleLogin("professional")}
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-semibold gap-3 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-gray-800 shadow-lg hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                </Button>

                {loginError ? (
                  <p className="mt-3 text-center text-sm text-red-400">
                    {loginError}
                  </p>
                ) : null}

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-xs uppercase tracking-wider text-muted-foreground bg-card/80">
                      Acesso seguro
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Shield, label: "LGPD" },
                    { icon: Zap, label: "Rápido" },
                    { icon: Award, label: "Seguro" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Ao continuar, você concorda com nossos{" "}
                  <a
                    href="/termos-de-uso"
                    className="text-primary hover:underline"
                  >
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a
                    href="/politica-de-privacidade"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidade
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          © 2026 REHABROAD • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}