import { Dispatch, SetStateAction } from "react";
import { DollarSign, Repeat } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { DateInput } from "@/react-app/components/ui/DateInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import type { Appointment, AppointmentInput } from "@/react-app/hooks/useAppointments";

export interface RecurrenceState {
  enabled: boolean;
  frequency: "weekly" | "biweekly";
  count: number;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: AppointmentInput;
  setForm: Dispatch<SetStateAction<AppointmentInput>>;
  recurrence: RecurrenceState;
  setRecurrence: Dispatch<SetStateAction<RecurrenceState>>;
  editing: Appointment | null;
  saving: boolean;
  patients: { id: number; name: string }[];
  onSubmit: () => void;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  form,
  setForm,
  recurrence,
  setRecurrence,
  editing,
  saving,
  patients,
  onSubmit,
}: AppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar Agendamento" : "Novo Agendamento"}
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
                onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                placeholder="Nome do paciente"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data</Label>
              <DateInput
                value={form.appointment_date}
                onChange={(val) => setForm({ ...form, appointment_date: val })}
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
              <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
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

          {editing && (
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
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

          {!editing && (
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
                    onChange={(e) => setRecurrence({ ...recurrence, enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-500"
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
                          setRecurrence({ ...recurrence, count: parseInt(val, 10) })
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
                      price: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_paid || false}
                    onChange={(e) => setForm({ ...form, is_paid: e.target.checked })}
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
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button className="flex-1" onClick={onSubmit} disabled={saving}>
              {saving ? "Salvando..." : editing ? "Salvar" : "Agendar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
