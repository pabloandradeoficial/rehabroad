import { useState } from "react";
import {
  Home,
  Plus,
  Pencil,
  Trash2,
  Link,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
  Dumbbell,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/react-app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { useToast } from "@/react-app/components/ui/microinteractions";
import { useHepPlan, type HepExercise, type HepExerciseInput } from "@/react-app/hooks/useHep";
import { exercises as exerciseLibrary, exerciseCategories } from "@/data/exercises";
import { DS } from "@/react-app/lib/design-system";

// ─────────────────────────────────────────────
// AdherenceBadge
// ─────────────────────────────────────────────

export function AdherenceBadge({ rate, status }: { rate: number; status?: "green" | "yellow" | "red" }) {
  const s = status ?? (rate >= 80 ? "green" : rate >= 50 ? "yellow" : "red");

  if (s === "green") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
        🟢 Boa adesão ({rate}%)
      </Badge>
    );
  }
  if (s === "yellow") {
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
        🟡 Adesão parcial ({rate}%)
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
      🔴 Baixa adesão ({rate}%)
    </Badge>
  );
}

// ─────────────────────────────────────────────
// ExerciseForm — shared between add & edit
// ─────────────────────────────────────────────

interface ExerciseFormState {
  exercise_name: string;
  exercise_category: string;
  sets: string;
  reps: string;
  frequency: string;
  instructions: string;
}

const EMPTY_EXERCISE_FORM: ExerciseFormState = {
  exercise_name: "",
  exercise_category: "",
  sets: "",
  reps: "",
  frequency: "",
  instructions: "",
};

interface ExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: HepExerciseInput) => Promise<void>;
  initial?: Partial<ExerciseFormState>;
  title: string;
}

function ExerciseDialog({ open, onClose, onSave, initial, title }: ExerciseDialogProps) {
  const [form, setForm] = useState<ExerciseFormState>({ ...EMPTY_EXERCISE_FORM, ...initial });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = (field: keyof ExerciseFormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const filtered = search.trim()
    ? exerciseLibrary.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const selectLibraryExercise = (ex: (typeof exerciseLibrary)[number]) => {
    setForm({
      exercise_name: ex.name,
      exercise_category: ex.category,
      sets: ex.sets,
      reps: ex.reps,
      frequency: ex.frequency,
      instructions: ex.instructions.join("\n"),
    });
    setSearch("");
  };

  const handleSave = async () => {
    if (!form.exercise_name.trim()) {
      toast.showError("Nome do exercício é obrigatório.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        exercise_name: form.exercise_name.trim(),
        exercise_category: form.exercise_category || undefined,
        sets: form.sets ? parseInt(form.sets, 10) : undefined,
        reps: form.reps || undefined,
        frequency: form.frequency || undefined,
        instructions: form.instructions || undefined,
      });
      onClose();
    } catch {
      toast.showError("Erro ao salvar exercício. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Library search */}
          <div className="space-y-1.5">
            <Label className={DS.text.label}>Buscar na biblioteca</Label>
            <Input
              placeholder="Ex: retração cervical, pêndulo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filtered.length > 0 && (
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {filtered.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => selectLibraryExercise(ex)}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{ex.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{ex.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Fields */}
          <div className="space-y-1.5">
            <Label className={DS.text.label}>Nome do exercício *</Label>
            <Input
              placeholder="Ex: Retração Cervical"
              value={form.exercise_name}
              onChange={(e) => set("exercise_name", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={DS.text.label}>Categoria</Label>
            <Select
              value={form.exercise_category}
              onValueChange={(v) => set("exercise_category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {exerciseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className={DS.text.label}>Séries</Label>
              <Input
                type="number"
                min={1}
                placeholder="3"
                value={form.sets}
                onChange={(e) => set("sets", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={DS.text.label}>Repetições</Label>
              <Input
                placeholder="10 reps"
                value={form.reps}
                onChange={(e) => set("reps", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={DS.text.label}>Frequência</Label>
              <Input
                placeholder="2x ao dia"
                value={form.frequency}
                onChange={(e) => set("frequency", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className={DS.text.label}>Instruções específicas</Label>
            <Textarea
              placeholder="Oriente o paciente como realizar corretamente..."
              rows={3}
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {saving ? "Salvando..." : "Adicionar ao Plano"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

interface HepPlanManagerProps {
  patientId: number;
  patientPhone?: string | null;
}

export default function HepPlanManager({ patientId, patientPhone }: HepPlanManagerProps) {
  const toast = useToast();
  const { plan, exercises, adherence, loading, error, createPlan, addExercise, updateExercise, removeExercise, generateToken, refreshAdherence, refetch } =
    useHepPlan(patientId);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<HepExercise | null>(null);
  const [createForm, setCreateForm] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [accessUrl, setAccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);

  // ── Create plan ──
  const handleCreate = async () => {
    if (!createForm.title.trim()) {
      toast.showError("Título é obrigatório.");
      return;
    }
    setCreating(true);
    try {
      await createPlan(createForm.title.trim(), createForm.description || undefined);
      setShowCreateDialog(false);
      setCreateForm({ title: "", description: "" });
      toast.showSuccess("Plano criado com sucesso!");
    } catch {
      toast.showError("Erro ao criar plano. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  // ── Add exercise ──
  const handleAddExercise = async (data: HepExerciseInput) => {
    if (!plan) return;
    await addExercise(plan.id, data);
    toast.showSuccess("Exercício adicionado!");
  };

  // ── Edit exercise ──
  const handleEditExercise = async (data: HepExerciseInput) => {
    if (!editingExercise) return;
    await updateExercise(editingExercise.id, data);
    setEditingExercise(null);
    toast.showSuccess("Exercício atualizado!");
  };

  // ── Remove exercise ──
  const handleRemoveExercise = async (id: number) => {
    if (!confirm("Remover este exercício do plano?")) return;
    try {
      await removeExercise(id);
      toast.showSuccess("Exercício removido.");
    } catch {
      toast.showError("Erro ao remover exercício.");
    }
  };

  // ── Generate access link ──
  const handleGenerateLink = async () => {
    if (!plan) return;
    setGeneratingLink(true);
    try {
      const result = await generateToken(plan.id);
      if (result) setAccessUrl(result.accessUrl);
    } catch {
      toast.showError("Erro ao gerar link de acesso.");
    } finally {
      setGeneratingLink(false);
    }
  };

  // ── Copy link ──
  const handleCopyLink = () => {
    if (!accessUrl) return;
    navigator.clipboard.writeText(accessUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.showSuccess("Link copiado!");
  };

  // ─────────────────────────────────────────────
  // Render: loading
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <div className={`${DS.states.skeleton} h-24 w-full`} />
        <div className={`${DS.states.skeleton} h-16 w-full`} />
        <div className={`${DS.states.skeleton} h-16 w-full`} />
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render: error
  // ─────────────────────────────────────────────
  if (error) {
    return (
      <div className={DS.states.errorBox}>
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error}</span>
        <Button variant="ghost" size="sm" onClick={() => void refetch()} className="ml-auto">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render: empty state
  // ─────────────────────────────────────────────
  if (!plan) {
    return (
      <>
        <div className={DS.states.empty}>
          <Home className={DS.states.emptyIcon} />
          <p className={DS.states.emptyTitle}>Sem plano domiciliar</p>
          <p className={DS.states.emptySubtitle}>
            Prescreva exercícios para o paciente realizar entre as sessões.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Plano Domiciliar
          </Button>
        </div>

        {/* Create dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Novo Plano Domiciliar
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className={DS.text.label}>Título do plano *</Label>
                <Input
                  placeholder="Ex: Reabilitação Cervical"
                  value={createForm.title}
                  onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className={DS.text.label}>Descrição</Label>
                <Textarea
                  placeholder="Objetivo do plano, orientações gerais..."
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
              <Button onClick={() => void handleCreate()} disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {creating ? "Criando..." : "Criar Plano"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Render: plan with exercises
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Plan header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-foreground">{plan.title}</h3>
            <Badge
              className={
                plan.status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                  : "bg-muted text-muted-foreground border-0"
              }
            >
              {plan.status === "active" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Criado em{" "}
            {new Date(plan.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          {plan.description && (
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
          )}
        </div>

        {adherence && adherence.totalCheckins > 0 && (
          <AdherenceBadge rate={adherence.adherenceRate} status={adherence.status} />
        )}
      </div>

      {/* Exercises list */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <span className="text-sm font-semibold text-foreground">
            EXERCÍCIOS ({exercises.length})
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddExercise(true)}
            className="gap-1.5 h-8"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Dumbbell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum exercício adicionado.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddExercise(true)}
              className="mt-2 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar primeiro exercício
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{ex.exercise_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {[
                      ex.sets ? `${ex.sets} séries` : null,
                      ex.reps,
                      ex.frequency,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {ex.instructions && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {ex.instructions}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setEditingExercise(ex)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => void handleRemoveExercise(ex.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adherence breakdown */}
      {adherence && adherence.totalCheckins > 0 && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Adesão ao Plano</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void refreshAdherence()}
                className="text-xs text-muted-foreground hover:text-teal-600 flex items-center gap-1 transition-colors"
                title="Atualizar adesão"
              >
                <RefreshCw className="w-3 h-3" />
                Atualizar
              </button>
              <AdherenceBadge rate={adherence.adherenceRate} status={adherence.status} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{adherence.adherenceRate}%</p>
              <p className="text-xs text-muted-foreground">Taxa de adesão</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{adherence.averagePain.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Dor média</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{adherence.completedCheckins}</p>
              <p className="text-xs text-muted-foreground">Sessões feitas</p>
            </div>
          </div>
          {adherence.lastCheckin && (
            <p className="text-xs text-muted-foreground">
              Último check-in:{" "}
              {new Date(adherence.lastCheckin).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      {/* Share section */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Compartilhar com o Paciente</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Gere um link que o paciente usa para registrar os exercícios sem precisar de conta.
          Válido por 30 dias.
        </p>

        {accessUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted rounded-lg px-3 py-2 text-muted-foreground truncate">
                {accessUrl}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="gap-1.5 flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            {patientPhone && plan && (
              <a
                href={`https://wa.me/${patientPhone.replace(/\D/g, "").replace(/^0/, "").replace(/^(?!55)(\d{10,11})$/, "55$1")}?text=${encodeURIComponent(
                  `Olá! 👋\n\nSeu plano de exercícios domiciliares está pronto no Rehabroad.\n\n📋 *Plano:* ${plan.title}\n🔗 *Acesse aqui:* ${accessUrl}\n\nRegistre seus exercícios diariamente pelo link acima. Acompanho sua evolução em tempo real! 💪`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors w-full"
              >
                <span>📱</span> Enviar via WhatsApp
              </a>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleGenerateLink()}
            disabled={generatingLink}
            className="gap-2"
          >
            {generatingLink ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {generatingLink ? "Gerando..." : "Gerar Link de Acesso"}
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <ExerciseDialog
        open={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onSave={handleAddExercise}
        title="Adicionar Exercício"
      />

      {editingExercise && (
        <ExerciseDialog
          open={true}
          onClose={() => setEditingExercise(null)}
          onSave={handleEditExercise}
          initial={{
            exercise_name: editingExercise.exercise_name,
            exercise_category: editingExercise.exercise_category ?? "",
            sets: editingExercise.sets?.toString() ?? "",
            reps: editingExercise.reps ?? "",
            frequency: editingExercise.frequency ?? "",
            instructions: editingExercise.instructions ?? "",
          }}
          title="Editar Exercício"
        />
      )}
    </div>
  );
}
