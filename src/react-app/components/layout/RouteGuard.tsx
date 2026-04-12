import { ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface RouteGuardProps {
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
  onRetry?: () => void;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}

export function RouteGuard({
  isLoading,
  isError,
  error,
  onRetry,
  skeleton,
  children,
  className = "",
}: RouteGuardProps) {
  if (isLoading) {
    return <div className={`w-full ${className}`}>{skeleton}</div>;
  }

  if (isError) {
    return (
      <div className="flex-1 w-full min-h-[50vh] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Falha ao carregar dados
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
            {error || "Não foi possível carregar as informações desta página. Verifique sua conexão e tente novamente."}
          </p>
          <button
            onClick={() => {
              if (onRetry) onRetry();
              else window.location.reload();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors w-full"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
