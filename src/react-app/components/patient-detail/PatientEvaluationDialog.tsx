import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router";
import { ClipboardList, ExternalLink, Lightbulb, Loader2, Pencil, Stethoscope } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Slider } from "@/react-app/components/ui/slider";
import type { EvaluationFormData, Evaluation } from "@/react-app/hooks/useEvaluations";
import { regioes } from "@/data/testesOrtopedicos";

interface PatientEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: EvaluationFormData;
  setForm: Dispatch<SetStateAction<EvaluationFormData>>;
  editing: Evaluation | null;
  saving: boolean;
  regiaoDetectada: string | null;
  onSave: () => void;
}

export function PatientEvaluationDialog({ open, onOpenChange, form, setForm, editing, saving, regiaoDetectada, onSave }: PatientEvaluationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              {editing ? <Pencil className="w-5 h-5 text-white" /> : <Stethoscope className="w-5 h-5 text-white" />}
            </div>
            {editing ? "Editar Avaliação" : "Nova Avaliação"}
          </DialogTitle>
          <DialogDescription>
            {editing ? "Atualize os dados da avaliação conforme necessário." : "Preencha os campos para registrar a avaliação clínica."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="font-semibold">Tipo de Avaliação</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "initial" | "followup" })}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="initial">Avaliação Inicial</SelectItem>
                <SelectItem value="followup">Reavaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Queixa Principal *</Label>
            <Textarea value={form.chief_complaint || ""} onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })} placeholder="Descreva a queixa principal do paciente..." rows={2} />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">História Clínica</Label>
            <Textarea value={form.history || ""} onChange={(e) => setForm({ ...form, history: e.target.value })} placeholder="Histórico relevante..." rows={2} />
          </div>
          <div className="space-y-3">
            <Label className="font-semibold">Nível de Dor: {form.pain_level}/10</Label>
            <Slider value={[form.pain_level || 0]} onValueChange={([v]) => setForm({ ...form, pain_level: v })} min={0} max={10} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localização da Dor</Label>
            <Input value={form.pain_location || ""} onChange={(e) => setForm({ ...form, pain_location: e.target.value })} placeholder="Ex: Região lombar, joelho direito..." className="h-11" />
            {regiaoDetectada && (
              <div className="flex items-start gap-2 p-3 mt-2 rounded-xl bg-primary/5 border border-primary/10">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Consulte testes para <strong className="text-foreground">{regioes[regiaoDetectada]}</strong>
                  </p>
                  <Link to="/dashboard/testes" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    Ver Testes <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Status Funcional</Label>
            <Textarea value={form.functional_status || ""} onChange={(e) => setForm({ ...form, functional_status: e.target.value })} placeholder="Limitações funcionais, ADMs, força..." rows={2} />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2">
              Testes Ortopédicos
              <Link to="/dashboard/testes" className="text-xs text-primary hover:underline font-normal flex items-center gap-1">
                <ClipboardList className="w-3 h-3" /> Consultar
              </Link>
            </Label>
            <Textarea value={form.orthopedic_tests || ""} onChange={(e) => setForm({ ...form, orthopedic_tests: e.target.value })} placeholder="Testes realizados e resultados..." rows={2} />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Observações</Label>
            <Textarea value={form.observations || ""} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Observações adicionais..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave} disabled={saving} className="bg-gradient-to-r from-primary to-primary/80">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
