import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ open, onOpenChange, saving, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto border-destructive/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl text-destructive">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground py-4">
          Tem certeza que deseja excluir este prontuário? Esta ação é permanente
          e não pode ser desfeita.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Excluir Prontuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
