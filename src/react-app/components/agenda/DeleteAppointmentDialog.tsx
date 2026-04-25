import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";

interface DeleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  onConfirm: () => void;
}

export function DeleteAppointmentDialog({ open, onOpenChange, saving, onConfirm }: DeleteAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm max-h-[90dvh] overflow-y-auto">
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
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={saving}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
