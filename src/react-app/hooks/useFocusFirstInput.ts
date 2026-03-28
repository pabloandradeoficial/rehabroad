import { useEffect, useRef } from "react";

/**
 * When `open` becomes true, waits one animation frame for the dialog/modal
 * to mount, then focuses the first focusable input/textarea/select inside
 * the given container ref.
 *
 * On mobile this opens the keyboard immediately without the user having to
 * tap the field manually.
 */
export function useFocusFirstInput(open: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const first = container.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
      );
      first?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return containerRef;
}
