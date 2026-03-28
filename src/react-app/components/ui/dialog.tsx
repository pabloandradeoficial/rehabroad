import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/react-app/lib/utils"
import { Button } from "@/react-app/components/ui/button"
import { X } from "lucide-react"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[45] bg-black/60",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "duration-200",
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  preventAutoFocus = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  preventAutoFocus?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        onOpenAutoFocus={preventAutoFocus ? (e) => e.preventDefault() : undefined}
        className={cn(
          // Structure
          "fixed z-[46] flex flex-col",

          // ── Mobile (default): bottom sheet ──────────────────────────────
          "left-0 right-0 bottom-0 top-auto",
          "w-full max-h-[90dvh]",
          "rounded-t-2xl rounded-b-none",

          // ── Desktop (md+): centered modal ────────────────────────────────
          "md:bottom-auto md:right-auto",
          "md:left-[50%] md:top-[50%]",
          "md:translate-x-[-50%] md:translate-y-[-50%]",
          "md:w-[calc(100%-2rem)] md:max-w-lg",
          "md:rounded-xl",
          "md:max-h-[90vh]",

          // Visual
          "bg-background ring-1 ring-foreground/5 shadow-2xl",

          // Animation base
          "duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",

          // Mobile animation: slide from bottom
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",

          // Desktop animation: zoom (overrides slide at md+)
          "md:data-[state=open]:zoom-in-95 md:data-[state=closed]:zoom-out-95",
          "md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0",

          className,
        )}
        {...props}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto flex-1 p-6 text-sm"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {children}
        </div>

        {/* Close button — floats above content */}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button variant="ghost" className="absolute top-3 right-3 z-10" size="icon-sm">
              <X />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("gap-2 flex flex-col mb-4", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "gap-2 flex flex-col-reverse md:flex-row md:justify-end mt-4",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Fechar</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground [&_a]:hover:text-foreground text-sm [&_a]:underline [&_a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
