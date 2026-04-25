import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";

export function AutoFillBadge({ onClear }: { onClear: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1 ml-2"
    >
      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] py-0 px-1.5 h-5 gap-0.5">
        <FileText className="w-2.5 h-2.5" />
        Do prontuário
      </Badge>
      <button
        type="button"
        onClick={onClear}
        title="Limpar campo"
        className="w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  );
}
