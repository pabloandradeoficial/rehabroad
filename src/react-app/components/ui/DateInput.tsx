import { useRef } from "react";
import { cn } from "@/react-app/lib/utils";

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void; // YYYY-MM-DD
  className?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Cross-platform date input that uses a masked text field (DD/MM/AAAA)
 * instead of the native type="date" picker, which renders inconsistently
 * on iOS and shows an American MM/DD/YYYY format in some Android browsers.
 *
 * Internal value is always YYYY-MM-DD (compatible with native date inputs).
 * The user types in DD/MM/AAAA format and sees the slash separators auto-inserted.
 */
export function DateInput({
  value,
  onChange,
  className,
  placeholder = "DD/MM/AAAA",
  id,
  name,
  required,
  disabled,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert internal YYYY-MM-DD → display DD/MM/AAAA
  function toDisplay(iso: string): string {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }

  // Convert display DD/MM/AAAA → internal YYYY-MM-DD
  function toIso(display: string): string {
    const digits = display.replace(/\D/g, "");
    if (digits.length < 8) return "";
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    // Basic sanity check
    const day = parseInt(d, 10);
    const month = parseInt(m, 10);
    const year = parseInt(y, 10);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return "";
    return `${y}-${m}-${d}`;
  }

  // Apply DD/MM/AAAA mask to raw keystroke input
  function applyMask(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const masked = applyMask(raw);
    const iso = toIso(masked);
    onChange(iso); // propagate ISO to parent (empty string if incomplete)
    // Manually set display value so cursor stays correct
    e.target.value = masked;
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      id={id}
      name={name}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={toDisplay(value)}
      key={value} // re-mount when value changes externally (e.g. dialog reset)
      onChange={handleChange}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}
