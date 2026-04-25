import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/react-app/components/ui/dialog";
import { useToast } from "@/react-app/components/ui/microinteractions";

interface PatientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
}

export function PatientDeleteDialog({ open, onOpenChange, patientId, patientName }: PatientDeleteDialogProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients/${patientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete patient");
      toast.showSuccess("Paciente excluído com sucesso");
      navigate("/dashboard");
    } catch {
      toast.showError("Erro ao excluir paciente");
    } finally {
      setDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-500 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Excluir Paciente
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>{patientName}</strong>? Esta ação não pode ser desfeita e todos os dados do paciente (avaliações, evoluções, etc.) serão perdidos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? "Excluindo..." : "Excluir Paciente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
