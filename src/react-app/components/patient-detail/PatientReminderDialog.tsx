import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { DateInput } from "@/react-app/components/ui/DateInput";
import { useToast } from "@/react-app/components/ui/microinteractions";
import { openWhatsApp, createReminderMessage } from "@/react-app/lib/whatsapp";

interface PatientReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  patientPhone: string | null | undefined;
}

type ReminderType = "appointment" | "followup" | "custom";

export function PatientReminderDialog({ open, onOpenChange, patientName, patientPhone }: PatientReminderDialogProps) {
  const toast = useToast();
  const [form, setForm] = useState({
    type: "appointment" as ReminderType,
    date: "",
    time: "",
    customMessage: "",
  });

  const handleSend = () => {
    if (!patientPhone) {
      toast.showError("Paciente não possui telefone cadastrado");
      return;
    }

    const savedProfile = localStorage.getItem("rehabroad_professional_profile");
    const professionalName = savedProfile ? JSON.parse(savedProfile).name || "Seu Fisioterapeuta" : "Seu Fisioterapeuta";

    let message = "";
    if (form.type === "appointment" && form.date) {
      const dateFormatted = new Date(form.date + "T12:00:00").toLocaleDateString("pt-BR");
      message = createReminderMessage(patientName, professionalName, dateFormatted, form.time || undefined);
    } else if (form.type === "followup") {
      message = createReminderMessage(patientName, professionalName);
    } else if (form.type === "custom" && form.customMessage) {
      message = createReminderMessage(patientName, professionalName, undefined, undefined, form.customMessage);
    }

    if (message) {
      openWhatsApp(patientPhone, message);
      onOpenChange(false);
      setForm({ type: "appointment", date: "", time: "", customMessage: "" });
      toast.showSuccess("WhatsApp aberto com a mensagem");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Lembrete via WhatsApp
          </DialogTitle>
          <DialogDescription>
            Envie um lembrete de consulta para {patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="font-semibold">Tipo de Mensagem</Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "appointment", label: "Agendar Consulta", desc: "Com data e hora específica" },
                { value: "followup", label: "Retorno", desc: "Lembrete de acompanhamento" },
                { value: "custom", label: "Personalizada", desc: "Escreva sua própria mensagem" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: type.value as ReminderType })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    form.type === type.value
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border hover:border-amber-500/50"
                  }`}
                >
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {form.type === "appointment" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-semibold">Data</Label>
                <DateInput
                  value={form.date}
                  onChange={(val) => setForm({ ...form, date: val })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Horário</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          )}

          {form.type === "custom" && (
            <div className="space-y-2">
              <Label className="font-semibold">Mensagem</Label>
              <Textarea
                value={form.customMessage}
                onChange={(e) => setForm({ ...form, customMessage: e.target.value })}
                placeholder="Digite sua mensagem personalizada..."
                rows={4}
              />
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-2">Prévia da mensagem:</p>
            <p className="text-sm">
              {form.type === "appointment" && form.date
                ? `📅 Lembrete de consulta para ${new Date(form.date + "T12:00:00").toLocaleDateString("pt-BR")}${form.time ? ` às ${form.time}` : ""}`
                : form.type === "followup"
                ? "📞 Mensagem de retorno/acompanhamento"
                : form.type === "custom" && form.customMessage
                ? `✏️ ${form.customMessage.substring(0, 50)}...`
                : "Selecione as opções acima"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              (form.type === "appointment" && !form.date) ||
              (form.type === "custom" && !form.customMessage)
            }
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
