import { Dispatch, RefObject, SetStateAction } from "react";
import { Loader2, Pencil, Sparkles, User } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { DateInput } from "@/react-app/components/ui/DateInput";
import type { PatientFormData } from "@/react-app/hooks/usePatients";

type Mode = "first" | "create" | "edit";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: PatientFormData;
  setForm: Dispatch<SetStateAction<PatientFormData>>;
  saving: boolean;
  focusRef: RefObject<HTMLDivElement | null>;
  mode: Mode;
  onSave: () => void;
}

export function PatientFormDialog({ open, onOpenChange, form, setForm, saving, focusRef, mode, onSave }: PatientFormDialogProps) {
  const isFirst = mode === "first";
  const isEdit = mode === "edit";

  const title = isFirst ? "Seu Primeiro Paciente" : isEdit ? "Editar Paciente" : "Novo Paciente";
  const description = isFirst
    ? "Preencha os campos principais para iniciar."
    : isEdit
    ? "Atualize as informações do prontuário."
    : "Preencha os dados principais do paciente.";
  const cta = isFirst ? "Cadastrar" : isEdit ? "Salvar Alterações" : "Cadastrar Paciente";
  const notesLabel = isFirst ? "Queixa Principal" : "Queixa Principal / Observações";
  const notesPlaceholder = isFirst ? "Observações iniciais..." : "Informações relevantes sobre o caso...";
  const Icon = isFirst ? Sparkles : isEdit ? Pencil : User;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isFirst ? "sm:max-w-md max-h-[90dvh] flex flex-col p-0 overflow-hidden border-primary/20" : "sm:max-w-lg max-h-[90dvh] overflow-y-auto border-primary/20"}>
        <DialogHeader className={isFirst ? "px-6 pt-6 pb-2" : undefined}>
          <DialogTitle className={`flex items-center gap-${isFirst ? "2" : "3"} text-xl`}>
            <div className={`${isFirst ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"} bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center`}>
              <Icon className={`${isFirst ? "w-4 h-4" : "w-5 h-5"} text-white`} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div ref={focusRef} className={isFirst ? "space-y-4 py-4 px-6 overflow-y-auto flex-1" : "space-y-4 py-4"}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome do paciente"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <DateInput
              id="birth_date"
              value={form.birth_date || ""}
              onChange={(val) => setForm({ ...form, birth_date: val })}
              className="h-11"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                inputMode="tel"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{notesLabel}</Label>
            <Textarea
              id="notes"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={notesPlaceholder}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className={isFirst ? "px-6 py-4 bg-card border-t sticky bottom-0 z-10 w-full mt-auto" : undefined}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className={isFirst ? "h-11" : undefined}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !form.name.trim()}
            className={`${isFirst ? "h-11 " : ""}bg-gradient-to-r from-primary to-emerald-600`}
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {cta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
