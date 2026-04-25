import { Dispatch, RefObject, SetStateAction } from "react";
import { Activity, Loader2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Slider } from "@/react-app/components/ui/slider";
import { DateInput } from "@/react-app/components/ui/DateInput";
import ScribeButton, { type ScribeResult } from "@/react-app/components/ScribeButton";
import type { EvolutionFormData, Evolution } from "@/react-app/hooks/useEvolutions";

interface PatientEvolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: EvolutionFormData;
  setForm: Dispatch<SetStateAction<EvolutionFormData>>;
  editing: Evolution | null;
  saving: boolean;
  patientId: number;
  scribedFields: string[];
  setScribedFields: Dispatch<SetStateAction<string[]>>;
  focusRef: RefObject<HTMLDivElement | null>;
  onSave: () => void;
}

export function PatientEvolutionDialog({ open, onOpenChange, form, setForm, editing, saving, patientId, scribedFields, setScribedFields, focusRef, onSave }: PatientEvolutionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {editing ? "Editar Evolução" : "Nova Evolução"}
          </DialogTitle>
          <DialogDescription>{editing ? "Atualize os dados da sessão de tratamento." : "Registre a sessão de tratamento do paciente."}</DialogDescription>
        </DialogHeader>
        {!editing && (
          <div className="pb-2" data-onboarding="scribe-btn">
            <ScribeButton
              patientId={patientId}
              onResult={(result: ScribeResult) => {
                if (!result.extracted) return;
                const filled: string[] = [];
                const e = result.extracted;
                const updates: Partial<EvolutionFormData> = {};
                if (e.pain_level !== null) { updates.pain_level = e.pain_level; filled.push("pain_level"); }
                if (e.functional_status) { updates.functional_status = e.functional_status; filled.push("functional_status"); }
                if (e.procedures) { updates.procedures = e.procedures; filled.push("procedures"); }
                if (e.patient_response) { updates.patient_response = e.patient_response; filled.push("patient_response"); }
                if (e.observations) { updates.observations = e.observations; filled.push("observations"); }
                setForm((prev) => ({ ...prev, ...updates }));
                setScribedFields(filled);
              }}
            />
          </div>
        )}
        <div ref={focusRef} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Data da Sessão</Label>
              <DateInput value={form.session_date || ""} onChange={(val) => setForm({ ...form, session_date: val })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Presença</Label>
              <Select value={form.attendance_status || "attended"} onValueChange={(v) => setForm({ ...form, attendance_status: v as "attended" | "justified_absence" | "unjustified_absence" })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="attended">Compareceu</SelectItem>
                  <SelectItem value="justified_absence">Falta Justificada</SelectItem>
                  <SelectItem value="unjustified_absence">Falta Não Justificada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Nível de Dor: {form.pain_level}/10</Label>
              {scribedFields.includes("pain_level") && <span className="text-xs text-purple-600 dark:text-purple-400">🎙️ Scribe</span>}
            </div>
            <Slider value={[form.pain_level || 0]} onValueChange={([v]) => setForm({ ...form, pain_level: v })} min={0} max={10} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Procedimentos Realizados</Label>
              {scribedFields.includes("procedures") && <span className="text-xs text-purple-600 dark:text-purple-400">🎙️ Scribe</span>}
            </div>
            <Textarea value={form.procedures || ""} onChange={(e) => setForm({ ...form, procedures: e.target.value })} placeholder="Técnicas e exercícios aplicados..." rows={3} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Resposta do Paciente</Label>
              {scribedFields.includes("patient_response") && <span className="text-xs text-purple-600 dark:text-purple-400">🎙️ Scribe</span>}
            </div>
            <Select value={form.patient_response || ""} onValueChange={(v) => setForm({ ...form, patient_response: v })}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="positive">Positiva</SelectItem>
                <SelectItem value="neutral">Neutra</SelectItem>
                <SelectItem value="negative">Negativa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Status Funcional</Label>
              {scribedFields.includes("functional_status") && <span className="text-xs text-purple-600 dark:text-purple-400">🎙️ Scribe</span>}
            </div>
            <Textarea value={form.functional_status || ""} onChange={(e) => setForm({ ...form, functional_status: e.target.value })} placeholder="Evolução das capacidades funcionais..." rows={2} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Observações</Label>
              {scribedFields.includes("observations") && <span className="text-xs text-purple-600 dark:text-purple-400">🎙️ Scribe</span>}
            </div>
            <Textarea value={form.observations || ""} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Observações da sessão..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave} disabled={saving} className="bg-gradient-to-r from-emerald-500 to-emerald-600">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
