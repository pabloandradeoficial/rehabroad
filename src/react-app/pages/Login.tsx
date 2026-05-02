import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  GraduationCap,
  Briefcase,
  Globe,
  User,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

type Mode = "professional" | "student" | "patient";

const MODES: {
  id: Mode;
  label: string;
  tagline: string;
  Icon: typeof Briefcase;
}[] = [
  { id: "professional", label: "Profissional", tagline: "Pacientes, evoluções e laudos.", Icon: Briefcase },
  { id: "student", label: "Estudante", tagline: "Casos clínicos e treino diário.", Icon: GraduationCap },
  { id: "patient", label: "Paciente", tagline: "Acompanhe seu plano de exercícios.", Icon: User },
];

// Animated EKG curve — pulse pattern that loops smoothly.
function EkgLine() {
  return (
    <svg
      viewBox="0 0 800 200"
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-48 opacity-90"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ekg-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
          <stop offset="40%" stopColor="#14b8a6" stopOpacity="1" />
          <stop offset="60%" stopColor="#5eead4" stopOpacity="1" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
        <filter id="ekg-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* Glow layer */}
      <motion.path
        d="M 0 100 L 120 100 L 140 100 L 160 80 L 180 120 L 200 60 L 220 140 L 240 100 L 360 100 L 380 100 L 400 70 L 420 130 L 440 50 L 460 150 L 480 100 L 600 100 L 620 100 L 640 90 L 660 110 L 680 80 L 700 120 L 720 100 L 800 100"
        stroke="#0d9488"
        strokeWidth="6"
        filter="url(#ekg-glow)"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.6, 0.4] }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
          opacity: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
        }}
      />
      {/* Sharp line on top */}
      <motion.path
        d="M 0 100 L 120 100 L 140 100 L 160 80 L 180 120 L 200 60 L 220 140 L 240 100 L 360 100 L 380 100 L 400 70 L 420 130 L 440 50 L 460 150 L 480 100 L 600 100 L 620 100 L 640 90 L 660 110 L 680 80 L 700 120 L 720 100 L 800 100"
        stroke="url(#ekg-fade)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending, loginWithGoogle } = useAppAuth();
  const { language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<Mode>("professional");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem("loginMode");
      if (stored === "student") navigate("/estudante");
      else if (stored === "patient") navigate("/patient");
      else navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      localStorage.setItem("loginMode", mode);
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o login com Google. Tente novamente."
      );
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-sm">Carregando...</p>
      </div>
    );
  }

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden relative selection:bg-teal-500/30 selection:text-white">
      {/* Aurora background — slow, ambient, never distracts */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 65%)" }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 60%)" }}
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-base">REHABROAD</span>
        </div>

        <button
          onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          type="button"
          title={language === "pt" ? "Switch to English" : "Mudar para Português"}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">{language}</span>
        </button>
      </header>

      {/* Main split */}
      <main className="relative z-10 grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-80px)] px-6 lg:px-12 pb-12">
        {/* LEFT: form */}
        <div className="flex items-center justify-center lg:justify-start py-8 lg:py-0 lg:pr-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Acesse sua conta
            </p>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-3">
              Bem-vindo de volta.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Continue sua jornada clínica de onde parou.
            </p>

            {/* Segmented control: 3 modes */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Modo de acesso
              </p>
              <div className="relative grid grid-cols-3 p-1 bg-white/5 border border-white/10 rounded-xl">
                {MODES.map((m) => {
                  const isActive = m.id === mode;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className="relative z-10 flex flex-col items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mode-pill"
                          className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <m.Icon
                        className={`relative w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-400"}`}
                        strokeWidth={2}
                      />
                      <span className={`relative transition-colors ${isActive ? "text-white" : "text-slate-400"}`}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-slate-400 mt-3 text-center sm:text-left"
                >
                  {activeMode.tagline}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Google CTA */}
            <button
              onClick={() => void handleLogin()}
              disabled={isSubmitting}
              type="button"
              className="group relative w-full h-14 rounded-xl bg-white text-slate-900 font-semibold text-base flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-black/40"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isSubmitting ? "Conectando..." : `Entrar como ${activeMode.label}`}
            </button>

            {loginError && (
              <p className="mt-3 text-center text-sm text-rose-300">{loginError}</p>
            )}

            {/* Inline trust strip */}
            <div className="flex items-center gap-2.5 mt-8 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" strokeWidth={2.2} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Criptografia AES-256 ponta-a-ponta. Conforme <span className="text-slate-200 font-medium">LGPD</span> e <span className="text-slate-200 font-medium">COFFITO</span>.
              </p>
            </div>

            <p className="mt-6 text-xs text-slate-500 text-center sm:text-left">
              Ao continuar, você concorda com os{" "}
              <a href="/termos-de-uso" className="text-teal-400 hover:text-teal-300 underline-offset-4 hover:underline">
                Termos
              </a>{" "}
              e{" "}
              <a href="/politica-de-privacidade" className="text-teal-400 hover:text-teal-300 underline-offset-4 hover:underline">
                Privacidade
              </a>
              .
            </p>
          </motion.div>
        </div>

        {/* RIGHT: cinematic visual (desktop only) */}
        <div className="hidden lg:flex relative items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative w-full h-full max-h-[700px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent"
          >
            {/* Layered EKG visual */}
            <div className="absolute inset-0">
              <EkgLine />
            </div>

            {/* Top-left small label */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                Sistema ativo
              </span>
            </div>

            {/* Bottom content: poetic line + stats */}
            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col gap-8">
              <p className="text-2xl font-bold leading-tight tracking-tight max-w-md">
                Onde fisioterapeutas chegam ao{" "}
                <span className="text-teal-400">diagnóstico certo</span> mais rápido.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "+500", label: "fisioterapeutas" },
                  { value: "AES-256", label: "criptografia" },
                  { value: "100%", label: "conforme LGPD" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    className="border-t border-white/10 pt-3"
                  >
                    <p className="text-xl font-extrabold text-white tabular-nums tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <p className="relative z-10 text-center text-xs text-slate-600 pb-6">
        © 2026 REHABROAD
      </p>
    </div>
  );
}
