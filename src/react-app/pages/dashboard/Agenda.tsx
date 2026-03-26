import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  FileText,
  Check,
  X,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  DollarSign,
  CreditCard,
  Repeat,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import {
  PageTransition,
  Spinner,
  useToast,
} from "@/react-app/components/ui/microinteractions";
import {
  useAppointments,
  Appointment,
  AppointmentInput,
} from "@/react-app/hooks/useAppointments";
import { usePatients } from "@/react-app/hooks/usePatients";
import {
  openWhatsApp,
  createReminderMessage,
} from "@/react-app/lib/whatsapp";
import { useAppAuth } from "@/react-app/contexts/AuthContext";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
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

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
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

const STATUS_CONFIG: Record<
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

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWeekRange(dateStr: string) {
  const selected = parseLocalDate(dateStr);
  const dayOfWeek = selected.getDay();
  const start = new Date(selected);
  start.setDate(start.getDate() - dayOfWeek);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function getDisplayProfessionalName(user: ReturnType<typeof useAppAuth>["user"]) {
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const fromFullName =
    typeof metadata.full_name === "string" ? metadata.full_name : "";
  const fromName = typeof metadata.name === "string" ? metadata.name : "";
  const fromEmail = user?.email?.split("@")[0] ?? "";

  return fromFullName || fromName || fromEmail || "Equipe RehabRoad";
}

export default function AgendaPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAppAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const professionalName = useMemo(
    () => getDisplayProfessionalName(user),
    [user]
  );

  const fetchRange = useMemo(() => {
    if (view === "month") {
      const monthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      return {
        start: formatDate(monthStart),
        end: formatDate(monthEnd),
      };
    }

    if (view === "week") {
      return getWeekRange(selectedDate);
    }

    return {
      start: selectedDate,
      end: selectedDate,
    };
  }, [view, currentDate, selectedDate]);

  const {
    appointments,
    loading,
    error,
    refetch,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments(fetchRange.start, fetchRange.end);

  const { patients } = usePatients();

  const [form, setForm] = useState<AppointmentInput>({
    patient_id: null,
    patient_name: "",
    appointment_date: selectedDate,
    appointment_time: "09:00",
    duration_minutes: 50,
    type: "sessao",
    notes: "",
    status: "scheduled",
    price: null,
    is_paid: false,
  });

  const [recurrence, setRecurrence] = useState<{
    enabled: boolean;
    frequency: "weekly" | "biweekly";
    count: number;
  }>({
    enabled: false,
    frequency: "weekly",
    count: 4,
  });

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const selected = parseLocalDate(selectedDate);
    const dayOfWeek = selected.getDay();
    const sunday = new Date(selected);
    sunday.setDate(sunday.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};

    appointments.forEach((apt) => {
      const dateKey = apt.appointment_date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(apt);
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) =>
        a.appointment_time.localeCompare(b.appointment_time)
      );
    });

    return grouped;
  }, [appointments]);

  const selectedDateAppointments = appointmentsByDate[selectedDate] || [];

  const navigateMonth = (direction: number) => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    );
    setCurrentDate(nextDate);
    setSelectedDate(formatDate(nextDate));
  };

  const navigateWeek = (direction: number) => {
    const next = parseLocalDate(selectedDate);
    next.setDate(next.getDate() + direction * 7);
    setSelectedDate(formatDate(next));
    setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const setSelectedDateAndSyncMonth = (dateStr: string) => {
    const parsed = parseLocalDate(dateStr);
    setSelectedDate(dateStr);
    setCurrentDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  };

  const handleChangeView = (nextView: "month" | "week" | "day") => {
    if (nextView === "month") {
      const selected = parseLocalDate(selectedDate);
      setCurrentDate(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
    setView(nextView);
  };

  const openNewAppointment = (date?: string) => {
    setEditingAppointment(null);
    setForm({
      patient_id: null,
      patient_name: "",
      appointment_date: date || selectedDate,
      appointment_time: "09:00",
      duration_minutes: 50,
      type: "sessao",
      notes: "",
      status: "scheduled",
      price: null,
      is_paid: false,
    });
    setRecurrence({ enabled: false, frequency: "weekly", count: 4 });
    setDialogOpen(true);
  };

  const openEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setForm({
      patient_id: apt.patient_id,
      patient_name: apt.patient_name || "",
      appointment_date: apt.appointment_date,
      appointment_time: apt.appointment_time,
      duration_minutes: apt.duration_minutes,
      type: apt.type,
      notes: apt.notes || "",
      status: apt.status,
      price: apt.price,
      is_paid: apt.is_paid || false,
    });
    setDialogOpen(true);
  };

  const validateForm = () => {
    const patientName = (form.patient_name || "").trim();

    if (!form.patient_id && !patientName) {
      toast.showError("Selecione um paciente ou digite o nome do paciente");
      return false;
    }

    if (!form.appointment_date) {
      toast.showError("Informe a data do agendamento");
      return false;
    }

    if (!form.appointment_time) {
      toast.showError("Informe o horário do agendamento");
      return false;
    }

    if (!form.duration_minutes || form.duration_minutes <= 0) {
      toast.showError("Informe uma duração válida");
      return false;
    }

    if (form.price != null && form.price < 0) {
      toast.showError("O valor não pode ser negativo");
      return false;
    }

    return true;
  };

  const buildPayload = (): AppointmentInput => ({
    patient_id: form.patient_id ?? null,
    patient_name: (form.patient_name || "").trim(),
    appointment_date: form.appointment_date,
    appointment_time: form.appointment_time,
    duration_minutes: form.duration_minutes ?? 50,
    type: form.type || "sessao",
    notes: (form.notes || "").trim(),
    status: form.status || "scheduled",
    price: form.price ?? null,
    is_paid: !!form.is_paid,
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload = buildPayload();

      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, payload);
        toast.showSuccess("Agendamento atualizado");
      } else {
        if (recurrence.enabled && recurrence.count > 1) {
          const daysToAdd = recurrence.frequency === "weekly" ? 7 : 14;
          const baseDate = parseLocalDate(payload.appointment_date);

          for (let i = 0; i < recurrence.count; i++) {
            const appointmentDate = new Date(baseDate);
            appointmentDate.setDate(appointmentDate.getDate() + i * daysToAdd);

            await createAppointment(
              {
                ...payload,
                appointment_date: formatDate(appointmentDate),
              },
              { skipRefetch: true }
            );
          }

          await refetch();
          toast.showSuccess(`${recurrence.count} agendamentos criados`);
        } else {
          await createAppointment(payload);
          toast.showSuccess("Agendamento criado");
        }
      }

      setDialogOpen(false);
    } catch {
      toast.showError("Erro ao salvar agendamento");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!appointmentToDelete) return;

    setIsSaving(true);

    try {
      await deleteAppointment(appointmentToDelete.id);
      toast.showSuccess("Agendamento excluído");
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    } catch {
      toast.showError("Erro ao excluir");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (apt: Appointment, newStatus: string) => {
    try {
      await updateAppointment(apt.id, {
        patient_id: apt.patient_id,
        patient_name: apt.patient_name || undefined,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        duration_minutes: apt.duration_minutes,
        type: apt.type,
        notes: apt.notes || undefined,
        status: newStatus,
        price: apt.price,
        is_paid: apt.is_paid,
      });
      toast.showSuccess("Status atualizado");
    } catch {
      toast.showError("Erro ao atualizar status");
    }
  };

  const handleMarkPaid = async (apt: Appointment) => {
    try {
      await updateAppointment(apt.id, {
        patient_id: apt.patient_id,
        patient_name: apt.patient_name || undefined,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        duration_minutes: apt.duration_minutes,
        type: apt.type,
        notes: apt.notes || undefined,
        status: apt.status,
        price: apt.price,
        is_paid: true,
      });
      toast.showSuccess("Pagamento registrado");
    } catch {
      toast.showError("Erro ao registrar pagamento");
    }
  };

  const sendWhatsAppReminder = (apt: Appointment) => {
    const phone = apt.patient_phone;
    if (!phone) {
      toast.showError("Paciente sem telefone cadastrado");
      return;
    }

    const patientName = apt.patient_full_name || apt.patient_name || "Paciente";
    const date = parseLocalDate(apt.appointment_date);
    const formattedDate = date.toLocaleDateString("pt-BR");

    const message = createReminderMessage(
      patientName,
      professionalName,
      formattedDate,
      apt.appointment_time
    );

    openWhatsApp(phone, message);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="relative rounded-2xl bg-card border border-border shadow-sm overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Agenda</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="italic">Gerencie seus atendimentos</span>
                </p>
              </div>
            </div>

          <div className="flex gap-2">
            <div className="rounded-lg bg-muted/50 p-1">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleChangeView("month")}
              >
                Mês
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleChangeView("week")}
              >
                Semana
              </Button>
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleChangeView("day")}
              >
                Dia
              </Button>
            </div>

            <Button onClick={() => openNewAppointment()} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Agendamento</span>
            </Button>
          </div>
          </div>
        </div>

        {error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-red-500">Erro ao carregar agenda</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="w-40 sm:w-48 text-center text-base sm:text-lg font-semibold">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Color Legend */}
        <div className="flex items-center justify-center flex-wrap gap-3">
          {Object.entries(TYPE_LABELS).map(([, config]) => (
            <div key={config.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {config.label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Pago
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pendente
          </div>
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="overflow-hidden lg:col-span-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-border">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                    const dateStr = formatDate(date);
                    const dayAppointments = appointmentsByDate[dateStr] || [];
                    const isSelected = dateStr === selectedDate;
                    const isTodayDate = isToday(date);

                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDateAndSyncMonth(dateStr)}
                        className={`
                          relative min-h-[56px] sm:min-h-[80px] border-b border-r border-border p-1 sm:p-2 text-left transition-colors
                          ${!isCurrentMonth ? "bg-muted/30" : "hover:bg-muted/50"}
                          ${isSelected ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""}
                        `}
                      >
                        <span
                          className={`
                            inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                            ${isTodayDate ? "bg-primary font-bold text-primary-foreground" : ""}
                            ${!isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
                          `}
                        >
                          {date.getDate()}
                        </span>

                        {dayAppointments.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div
                                key={apt.id}
                                className={`truncate rounded px-1 py-0.5 text-[10px] ${
                                  TYPE_LABELS[apt.type]?.color || "bg-muted"
                                }`}
                              >
                                {apt.appointment_time.slice(0, 5)}{" "}
                                {apt.patient_name || apt.patient_full_name}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="px-1 text-[10px] text-muted-foreground">
                                +{dayAppointments.length - 2} mais
                              </div>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold capitalize">
                      {parseLocalDate(selectedDate).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                    {selectedDateAppointments.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedDateAppointments.length} agendamento{selectedDateAppointments.length !== 1 ? "s" : ""}
                        {(() => {
                          const totalValue = selectedDateAppointments
                            .filter(a => a.price)
                            .reduce((s, a) => s + (a.price || 0), 0);
                          const paidValue = selectedDateAppointments
                            .filter(a => a.is_paid && a.price)
                            .reduce((s, a) => s + (a.price || 0), 0);
                          if (totalValue === 0) return "";
                          return ` · R$ ${paidValue.toFixed(0)} recebido${totalValue !== paidValue ? ` / R$ ${totalValue.toFixed(0)} total` : ""}`;
                        })()}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openNewAppointment(selectedDate)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status summary pills */}
                {selectedDateAppointments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Object.entries(
                      selectedDateAppointments.reduce<Record<string, number>>((acc, a) => {
                        acc[a.status] = (acc[a.status] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([status, count]) => (
                      <span key={status} className={`text-xs px-2 py-0.5 rounded-full bg-muted ${STATUS_CONFIG[status]?.color || "text-muted-foreground"}`}>
                        {count}× {STATUS_CONFIG[status]?.label || status}
                      </span>
                    ))}
                  </div>
                )}

                {selectedDateAppointments.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">Nenhum agendamento</p>
                    <p className="text-xs mt-1 opacity-60">Clique em + para adicionar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateAppointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        onEdit={() => openEditAppointment(apt)}
                        onDelete={() => {
                          setAppointmentToDelete(apt);
                          setDeleteDialogOpen(true);
                        }}
                        onStatusChange={(status) => handleStatusChange(apt, status)}
                        onMarkPaid={() => handleMarkPaid(apt)}
                        onSendReminder={() => sendWhatsAppReminder(apt)}
                        onNavigateToPatient={(id) =>
                          navigate(`/dashboard/paciente/${id}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : view === "week" ? (
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => navigateWeek(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <h3 className="whitespace-nowrap text-sm font-semibold sm:text-lg">
                    {weekDays[0].toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {weekDays[6].toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h3>

                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => navigateWeek(1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setSelectedDateAndSyncMonth(formatDate(new Date()))}
                >
                  Esta Semana
                </Button>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="grid min-w-[700px] grid-cols-7 gap-2 sm:min-w-0">
                  {weekDays.map((day, idx) => {
                    const dateStr = formatDate(day);
                    const dayAppointments = appointmentsByDate[dateStr] || [];
                    const isTodayDate = isToday(day);
                    const isSelected = dateStr === selectedDate;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDateAndSyncMonth(dateStr)}
                        className={`
                          min-h-[300px] cursor-pointer rounded-lg border transition-all
                          ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}
                          ${isTodayDate ? "bg-primary/5" : "bg-card"}
                        `}
                      >
                        <div
                          className={`
                            border-b border-border p-2 text-center
                            ${isTodayDate ? "rounded-t-lg bg-primary text-primary-foreground" : ""}
                          `}
                        >
                          <div className="text-xs text-muted-foreground">
                            {WEEKDAYS[idx]}
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              isTodayDate ? "" : "text-foreground"
                            }`}
                          >
                            {day.getDate()}
                          </div>
                        </div>

                        <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
                          {dayAppointments.length === 0 ? (
                            <div className="py-4 text-center text-xs text-muted-foreground/50">
                              —
                            </div>
                          ) : (
                            dayAppointments.map((apt) => (
                              <motion.div
                                key={apt.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditAppointment(apt);
                                }}
                                className={`cursor-pointer rounded-md p-2 text-xs ${
                                  TYPE_LABELS[apt.type]?.color || "bg-muted"
                                }`}
                              >
                                <div className="font-medium">
                                  {apt.appointment_time.slice(0, 5)}
                                </div>
                                <div className="truncate opacity-80">
                                  {apt.patient_name || apt.patient_full_name}
                                </div>
                                {apt.price && (
                                  <div
                                    className={`mt-1 flex items-center gap-1 ${
                                      apt.is_paid ? "text-emerald-600" : "text-amber-600"
                                    }`}
                                  >
                                    <DollarSign className="h-3 w-3" />
                                    R$ {apt.price.toFixed(0)}
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full rounded-t-none text-xs text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNewAppointment(dateStr);
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Adicionar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const prev = parseLocalDate(selectedDate);
                      prev.setDate(prev.getDate() - 1);
                      setSelectedDateAndSyncMonth(formatDate(prev));
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <h3 className="text-lg font-semibold">
                    {parseLocalDate(selectedDate).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const next = parseLocalDate(selectedDate);
                      next.setDate(next.getDate() + 1);
                      setSelectedDateAndSyncMonth(formatDate(next));
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDateAndSyncMonth(formatDate(new Date()))}
                >
                  Hoje
                </Button>
              </div>

              {selectedDateAppointments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>Nenhum agendamento para este dia</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => openNewAppointment(selectedDate)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar agendamento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      expanded
                      onEdit={() => openEditAppointment(apt)}
                      onDelete={() => {
                        setAppointmentToDelete(apt);
                        setDeleteDialogOpen(true);
                      }}
                      onStatusChange={(status) => handleStatusChange(apt, status)}
                      onMarkPaid={() => handleMarkPaid(apt)}
                      onSendReminder={() => sendWhatsAppReminder(apt)}
                      onNavigateToPatient={(id) =>
                        navigate(`/dashboard/paciente/${id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <Label>Paciente</Label>
                <Select
                  value={form.patient_id?.toString() || "manual"}
                  onValueChange={(val) => {
                    if (val === "manual") {
                      setForm({ ...form, patient_id: null });
                    } else {
                      const patient = patients.find((p) => p.id === parseInt(val, 10));
                      setForm({
                        ...form,
                        patient_id: parseInt(val, 10),
                        patient_name: patient?.name || "",
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Digitar nome manualmente</SelectItem>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!form.patient_id && (
                <div>
                  <Label>Nome do Paciente</Label>
                  <Input
                    value={form.patient_name || ""}
                    onChange={(e) =>
                      setForm({ ...form, patient_name: e.target.value })
                    }
                    placeholder="Nome do paciente"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={form.appointment_date}
                    onChange={(e) =>
                      setForm({ ...form, appointment_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={form.appointment_time}
                    onChange={(e) =>
                      setForm({ ...form, appointment_time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={form.type}
                    onValueChange={(val) => setForm({ ...form, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sessao">Sessão</SelectItem>
                      <SelectItem value="avaliacao">Avaliação</SelectItem>
                      <SelectItem value="retorno">Retorno</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration_minutes: parseInt(e.target.value, 10) || 50,
                      })
                    }
                  />
                </div>
              </div>

              {editingAppointment && (
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => setForm({ ...form, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="completed">Realizado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="no_show">Faltou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Observações sobre o atendimento"
                  rows={3}
                />
              </div>

              {!editingAppointment && (
                <div className="mt-2 border-t pt-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Repeat className="h-4 w-4 text-violet-500" />
                    Repetir Agendamento
                  </h4>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={recurrence.enabled}
                        onChange={(e) =>
                          setRecurrence({
                            ...recurrence,
                            enabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                      />
                      <span className="text-sm font-medium">
                        Criar sessões recorrentes
                      </span>
                    </label>

                    {recurrence.enabled && (
                      <div className="grid grid-cols-2 gap-3 pl-6">
                        <div>
                          <Label className="text-xs">Frequência</Label>
                          <Select
                            value={recurrence.frequency}
                            onValueChange={(val: "weekly" | "biweekly") =>
                              setRecurrence({ ...recurrence, frequency: val })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="biweekly">Quinzenal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Quantidade</Label>
                          <Select
                            value={recurrence.count.toString()}
                            onValueChange={(val) =>
                              setRecurrence({
                                ...recurrence,
                                count: parseInt(val, 10),
                              })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[2, 4, 6, 8, 10, 12].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                  {n} sessões
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-2 border-t pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Pagamento
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={form.price ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.is_paid || false}
                        onChange={(e) =>
                          setForm({ ...form, is_paid: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">Pago</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={isSaving}>
                  {isSaving
                    ? "Salvando..."
                    : editingAppointment
                    ? "Salvar"
                    : "Agendar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Excluir Agendamento</DialogTitle>
            </DialogHeader>

            <p className="text-muted-foreground">
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser
              desfeita.
            </p>

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isSaving}
              >
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

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

function AppointmentCard({
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