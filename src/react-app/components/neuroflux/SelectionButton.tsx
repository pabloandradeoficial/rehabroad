import { CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

type SelectionButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  description?: string;
  isAutoFilled?: boolean;
  className?: string;
};

export function SelectionButton({ selected, onClick, children, description, isAutoFilled, className }: SelectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 overflow-hidden text-left",
        selected
          ? "bg-violet-50 dark:bg-violet-500/10 text-violet-900 dark:text-violet-200 border-violet-500 shadow-sm"
          : "bg-white dark:bg-white/[0.03] text-foreground border-gray-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-violet-50/60 dark:hover:bg-violet-500/5",
        description && "flex flex-col gap-1",
        className
      )}
    >
      <span className="relative flex items-center gap-1.5">
        {children}
        {selected && (
          <span className="ml-auto pl-1 flex items-center gap-1 shrink-0">
            {isAutoFilled && <FileText className="w-3 h-3 text-amber-500" />}
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          </span>
        )}
      </span>
      {description && (
        <p className={cn(
          "text-xs font-normal relative",
          selected ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </button>
  );
}
