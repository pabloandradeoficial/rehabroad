import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  MoreVertical,
  Pencil,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import type { Appointment } from "@/react-app/hooks/useAppointments";
import { STATUS_CONFIG, TYPE_LABELS } from "./constants";

interface AppointmentCardProps {
  appointment: Appointment;
  expanded?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  onMarkPaid: () => void;
  onSendReminder: () => void;
  onNavigateToPatient: (id: number) => void;
}

export function AppointmentCard({
  appointment: apt,
  expanded,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkPaid,
  onSendReminder,
  onNavigateToPatient,
}: AppointmentCardProps) {
  const typeConfig = TYPE_LABELS[apt.type] || TYPE_LABELS.outro;
  const statusConfig = STATUS_CONFIG[apt.status] || STATUS_CONFIG.scheduled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-lg border bg-card p-3
        ${apt.status === "cancelled" ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium">
              {apt.appointment_time.slice(0, 5)}
            </span>

            <span
              className={`rounded-full border px-2 py-0.5 text-xs ${typeConfig.color}`}
            >
              {typeConfig.label}
            </span>

            <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
              {statusConfig.icon}
              {expanded && statusConfig.label}
            </span>

            {apt.price && apt.price > 0 && (
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                  apt.is_paid
                    ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-500"
                    : "border border-amber-500/30 bg-amber-500/20 text-amber-500"
                }`}
              >
                <DollarSign className="h-3 w-3" />
                R${apt.price.toFixed(0)}
                {apt.is_paid && <Check className="h-3 w-3" />}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="truncate font-medium">
              {apt.patient_full_name || apt.patient_name || "Paciente não informado"}
            </p>

            {apt.patient_phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendReminder();
                }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 transition-colors hover:bg-emerald-600"
                title="Enviar WhatsApp"
              >
                <Phone className="h-3.5 w-3.5 text-white" />
              </button>
            )}
          </div>

          {expanded && apt.notes && (
            <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {apt.notes}
            </p>
          )}

          {expanded && apt.patient_phone && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {apt.patient_phone}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {apt.patient_id && (
              <DropdownMenuItem onClick={() => onNavigateToPatient(apt.patient_id!)}>
                <User className="mr-2 h-4 w-4" />
                Ver Paciente
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>

            {apt.patient_phone && (
              <DropdownMenuItem onClick={onSendReminder}>
                <Phone className="mr-2 h-4 w-4" />
                Enviar Lembrete
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => onStatusChange("confirmed")}
              disabled={apt.status === "confirmed"}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange("completed")}
              disabled={apt.status === "completed"}
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar Realizado
            </DropdownMenuItem>

            {apt.price && apt.price > 0 && !apt.is_paid && (
              <DropdownMenuItem onClick={() => onMarkPaid()}>
                <CreditCard className="mr-2 h-4 w-4" />
                Marcar como Pago
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => onStatusChange("no_show")}
              disabled={apt.status === "no_show"}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Marcar Falta
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
