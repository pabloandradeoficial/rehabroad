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
import { PageTransition, Spinner, useToast } from "@/react-app/components/ui/microinteractions";
import { useAppointments, Appointment, AppointmentInput } from "@/react-app/hooks/useAppointments";
import { usePatients } from "@/react-app/hooks/usePatients";
import { openWhatsApp, createReminderMessage } from "@/react-app/lib/whatsapp";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  sessao: { label: "Sessão", color: "bg-primary/20 text-primary border-primary/30" },
  avaliacao: { label: "Avaliação", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  retorno: { label: "Retorno", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  outro: { label: "Outro", color: "bg-muted text-muted-foreground border-border" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: "Agendado", color: "text-blue-400", icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: "Confirmado", color: "text-emerald-400", icon: <Check className="w-3.5 h-3.5" /> },
  completed: { label: "Realizado", color: "text-primary", icon: <Check className="w-3.5 h-3.5" /> },
  cancelled: { label: "Cancelado", color: "text-red-400", icon: <X className="w-3.5 h-3.5" /> },
  no_show: { label: "Faltou", color: "text-amber-400", icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function AgendaPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // Get first and last day of month for fetching
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { appointments, loading, createAppointment, updateAppointment, deleteAppointment } = useAppointments(
    formatDate(monthStart),
    formatDate(monthEnd)
  );
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

  // Calendar grid data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }
    
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  // Week view data
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

  const navigateWeek = (direction: number) => {
    const current = parseLocalDate(selectedDate);
    current.setDate(current.getDate() + direction * 7);
    setSelectedDate(formatDate(current));
  };

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      const dateKey = apt.appointment_date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(apt);
    });
    // Sort by time
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
    });
    return grouped;
  }, [appointments]);

  const selectedDateAppointments = appointmentsByDate[selectedDate] || [];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
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

  const handleSubmit = async () => {
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, form);
        toast.showSuccess("Agendamento atualizado");
      } else {
        // Handle recurring appointments
        if (recurrence.enabled && recurrence.count > 1) {
          const daysToAdd = recurrence.frequency === "weekly" ? 7 : 14;
          const baseDate = parseLocalDate(form.appointment_date);
          
          for (let i = 0; i < recurrence.count; i++) {
            const appointmentDate = new Date(baseDate);
            appointmentDate.setDate(appointmentDate.getDate() + (i * daysToAdd));
            
            await createAppointment({
              ...form,
              appointment_date: formatDate(appointmentDate),
            });
          }
          toast.showSuccess(`${recurrence.count} agendamentos criados`);
        } else {
          await createAppointment(form);
          toast.showSuccess("Agendamento criado");
        }
      }
      setDialogOpen(false);
    } catch {
      toast.showError("Erro ao salvar agendamento");
    }
  };

  const handleDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete.id);
      toast.showSuccess("Agendamento excluído");
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    } catch {
      toast.showError("Erro ao excluir");
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
    const message = createReminderMessage(patientName, formattedDate, apt.appointment_time, "appointment");
    openWhatsApp(phone, message);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus atendimentos</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-muted/50 rounded-lg p-1">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
              >
                Mês
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
              >
                Semana
              </Button>
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
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

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <Card className="lg:col-span-2 overflow-hidden">
              <CardContent className="p-0">
                {/* Weekday headers */}
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
                {/* Calendar days */}
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
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          relative min-h-[80px] p-2 border-b border-r border-border
                          transition-colors text-left
                          ${!isCurrentMonth ? "bg-muted/30" : "hover:bg-muted/50"}
                          ${isSelected ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""}
                        `}
                      >
                        <span
                          className={`
                            inline-flex items-center justify-center w-6 h-6 text-sm rounded-full
                            ${isTodayDate ? "bg-primary text-primary-foreground font-bold" : ""}
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
                                className={`
                                  text-[10px] px-1 py-0.5 rounded truncate
                                  ${TYPE_LABELS[apt.type]?.color || "bg-muted"}
                                `}
                              >
                                {apt.appointment_time.slice(0, 5)} {apt.patient_name || apt.patient_full_name}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-[10px] text-muted-foreground px-1">
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

            {/* Selected Day Sidebar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {parseLocalDate(selectedDate).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                  <Button size="sm" variant="outline" onClick={() => openNewAppointment(selectedDate)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedDateAppointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum agendamento</p>
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
                        onNavigateToPatient={(id) => navigate(`/dashboard/paciente/${id}`)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : view === "week" ? (
          /* Week View */
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigateWeek(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-sm sm:text-lg whitespace-nowrap">
                    {weekDays[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} - {weekDays[6].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                  </h3>
                  <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigateWeek(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedDate(formatDate(new Date()))}>
                  Esta Semana
                </Button>
              </div>

              {/* Week grid - horizontal scroll on mobile */}
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="grid grid-cols-7 gap-2 min-w-[700px] sm:min-w-0">
                {weekDays.map((day, idx) => {
                  const dateStr = formatDate(day);
                  const dayAppointments = appointmentsByDate[dateStr] || [];
                  const isTodayDate = isToday(day);
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        min-h-[300px] rounded-lg border cursor-pointer transition-all
                        ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}
                        ${isTodayDate ? "bg-primary/5" : "bg-card"}
                      `}
                    >
                      <div className={`
                        p-2 text-center border-b border-border
                        ${isTodayDate ? "bg-primary text-primary-foreground rounded-t-lg" : ""}
                      `}>
                        <div className="text-xs text-muted-foreground">
                          {WEEKDAYS[idx]}
                        </div>
                        <div className={`text-lg font-semibold ${isTodayDate ? "" : "text-foreground"}`}>
                          {day.getDate()}
                        </div>
                      </div>
                      <div className="p-2 space-y-1 max-h-[250px] overflow-y-auto">
                        {dayAppointments.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground/50 text-xs">
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
                              className={`
                                text-xs p-2 rounded-md cursor-pointer
                                ${TYPE_LABELS[apt.type]?.color || "bg-muted"}
                              `}
                            >
                              <div className="font-medium">{apt.appointment_time.slice(0, 5)}</div>
                              <div className="truncate opacity-80">{apt.patient_name || apt.patient_full_name}</div>
                              {apt.price && (
                                <div className={`mt-1 flex items-center gap-1 ${apt.is_paid ? "text-emerald-600" : "text-amber-600"}`}>
                                  <DollarSign className="w-3 h-3" />
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
                        <Plus className="w-3 h-3 mr-1" />
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
          /* Day View */
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const prev = parseLocalDate(selectedDate);
                      prev.setDate(prev.getDate() - 1);
                      setSelectedDate(formatDate(prev));
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-lg">
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
                      setSelectedDate(formatDate(next));
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(formatDate(new Date()))}
                >
                  Hoje
                </Button>
              </div>

              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum agendamento para este dia</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => openNewAppointment(selectedDate)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
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
                      onNavigateToPatient={(id) => navigate(`/dashboard/paciente/${id}`)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* New/Edit Appointment Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Paciente</Label>
                <Select
                  value={form.patient_id?.toString() || "manual"}
                  onValueChange={(val) => {
                    if (val === "manual") {
                      setForm({ ...form, patient_id: null });
                    } else {
                      const patient = patients.find((p) => p.id === parseInt(val));
                      setForm({
                        ...form,
                        patient_id: parseInt(val),
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
                    onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={form.appointment_time}
                    onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 50 })}
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

              {/* Recurrence Section - Only for new appointments */}
              {!editingAppointment && (
                <div className="border-t pt-4 mt-2">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-violet-500" />
                    Repetir Agendamento
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recurrence.enabled}
                        onChange={(e) => setRecurrence({ ...recurrence, enabled: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                      />
                      <span className="text-sm font-medium">Criar sessões recorrentes</span>
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
                              setRecurrence({ ...recurrence, count: parseInt(val) })
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

              {/* Payment Section */}
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Pagamento
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: e.target.value ? parseFloat(e.target.value) : null })}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_paid || false}
                        onChange={(e) => setForm({ ...form, is_paid: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">Pago</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingAppointment ? "Salvar" : "Agendar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Excluir Agendamento</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

// Appointment Card Component
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
        p-3 rounded-lg border bg-card
        ${apt.status === "cancelled" ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {apt.appointment_time.slice(0, 5)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            <span className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
              {statusConfig.icon}
              {expanded && statusConfig.label}
            </span>
            {apt.price && apt.price > 0 && (
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                apt.is_paid 
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" 
                  : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
              }`}>
                <DollarSign className="w-3 h-3" />
                R${apt.price.toFixed(0)}
                {apt.is_paid && <Check className="w-3 h-3" />}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">
              {apt.patient_full_name || apt.patient_name || "Paciente não informado"}
            </p>
            {apt.patient_phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSendReminder();
                }}
                className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                title="Enviar WhatsApp"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
          {expanded && apt.notes && (
            <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1">
              <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {apt.notes}
            </p>
          )}
          {expanded && apt.patient_phone && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {apt.patient_phone}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {apt.patient_id && (
              <DropdownMenuItem onClick={() => onNavigateToPatient(apt.patient_id!)}>
                <User className="w-4 h-4 mr-2" />
                Ver Paciente
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            {apt.patient_phone && (
              <DropdownMenuItem onClick={onSendReminder}>
                <Phone className="w-4 h-4 mr-2" />
                Enviar Lembrete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onStatusChange("confirmed")}
              disabled={apt.status === "confirmed"}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange("completed")}
              disabled={apt.status === "completed"}
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar Realizado
            </DropdownMenuItem>
            {apt.price && apt.price > 0 && !apt.is_paid && (
              <DropdownMenuItem onClick={() => onMarkPaid()}>
                <CreditCard className="w-4 h-4 mr-2" />
                Marcar como Pago
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onStatusChange("no_show")}
              disabled={apt.status === "no_show"}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Marcar Falta
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
