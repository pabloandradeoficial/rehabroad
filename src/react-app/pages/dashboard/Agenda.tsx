import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { MobileHeader } from "@/react-app/components/layout/MobileHeader";
import { Card, CardContent } from "@/react-app/components/ui/card";
import {
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
import { RouteGuard } from "@/react-app/components/layout/RouteGuard";
import { AgendaSkeleton } from "@/react-app/components/DashboardSkeletons";
import { WEEKDAYS, MONTHS, TYPE_LABELS, STATUS_CONFIG } from "@/react-app/components/agenda/constants";
import { formatDate, parseLocalDate, getWeekRange, getDisplayProfessionalName } from "@/react-app/components/agenda/helpers";
import { AppointmentCard } from "@/react-app/components/agenda/AppointmentCard";
import { AppointmentDialog } from "@/react-app/components/agenda/AppointmentDialog";
import { DeleteAppointmentDialog } from "@/react-app/components/agenda/DeleteAppointmentDialog";

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

    appointments.forEach((apt: typeof appointments[0]) => {
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
              }
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

  return (
    <RouteGuard
      isLoading={loading}
      isError={!!error}
      error={error}
      onRetry={refetch}
      skeleton={<AgendaSkeleton />}
    >
      <div className="md:hidden">
        <MobileHeader
          actions={
            <button
              onClick={() => setDialogOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-500 text-white active:bg-teal-600"
              aria-label="Novo agendamento"
            >
              <Plus size={18} />
            </button>
          }
        />
      </div>
      <>
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
                  Visualize e organize seus agendamentos
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

            <Button onClick={() => openNewAppointment()} className="gap-2 h-10 w-10 sm:w-auto sm:px-4">
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
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <Calendar className="w-12 h-12 text-muted-foreground/40 mb-4" />
                  <p className="text-base font-semibold text-foreground mb-1">Nenhum agendamento para este dia</p>
                  <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                    Selecione outro dia ou adicione um novo agendamento
                  </p>
                  <Button onClick={() => openNewAppointment(selectedDate)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Agendamento
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

        <AppointmentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          form={form}
          setForm={setForm}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
          editing={editingAppointment}
          saving={isSaving}
          patients={patients}
          onSubmit={handleSubmit}
        />

        <DeleteAppointmentDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          saving={isSaving}
          onConfirm={handleDelete}
        />
      </div>
      </>
    </RouteGuard>
  );
}
