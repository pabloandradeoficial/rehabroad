import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Activity } from "lucide-react";

// ── Page title map ────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Prontuário",
  "/dashboard/agenda": "Agenda",
  "/dashboard/suporte": "Apoio Clínico",
  "/dashboard/caminho": "Caminho Clínico",
  "/dashboard/hep": "Plano Domiciliar",
  "/dashboard/neuroflux": "NeuroFlux",
  "/dashboard/exercicios": "Exercícios",
  "/dashboard/financeiro": "Financeiro",
  "/dashboard/testes": "Testes Clínicos",
  "/dashboard/exportacao": "Exportação",
  "/dashboard/alertas": "Indicadores",
  "/dashboard/forum": "Comunidade",
  "/dashboard/indicacao": "Indicar Colega",
  "/dashboard/perfil": "Meu Perfil",
  "/dashboard/contato": "Suporte",
  "/dashboard/plano": "Plano / Assinatura",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface MobileHeaderProps {
  /** Override the auto-detected title */
  title?: string;
  /** Show a back arrow instead of the app logo */
  showBack?: boolean;
  /** Optional action buttons rendered on the right side */
  actions?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileHeader({ title, showBack, actions }: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const resolvedTitle =
    title ?? PAGE_TITLES[location.pathname] ?? "REHABROAD";

  return (
    <header
      className="sticky top-0 z-[40] flex items-center justify-between px-4 bg-background border-b border-border"
      style={{
        paddingTop: `calc(0.75rem + env(safe-area-inset-top, 0px))`,
        paddingBottom: "0.75rem",
        minHeight: "calc(3.25rem + env(safe-area-inset-top, 0px))",
      }}
    >
      {/* Left — back button or logo */}
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="-ml-1 w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Activity size={14} className="text-white" />
          </div>
        )}

        <h1 className="text-base font-semibold text-foreground truncate leading-tight">
          {resolvedTitle}
        </h1>
      </div>

      {/* Right — actions slot */}
      {actions && (
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
