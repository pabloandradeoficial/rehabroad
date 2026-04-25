import { AlertCircle, Check, Clock, X } from "lucide-react";

export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  sessao: {
    label: "Sessão",
    color: "bg-primary/20 text-primary border-primary/30",
  },
  avaliacao: {
    label: "Avaliação",
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
  retorno: {
    label: "Retorno",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  outro: {
    label: "Outro",
    color: "bg-muted text-muted-foreground border-border",
  },
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  scheduled: {
    label: "Agendado",
    color: "text-blue-400",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  confirmed: {
    label: "Confirmado",
    color: "text-emerald-400",
    icon: <Check className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Realizado",
    color: "text-primary",
    icon: <Check className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-400",
    icon: <X className="w-3.5 h-3.5" />,
  },
  no_show: {
    label: "Faltou",
    color: "text-amber-400",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};
