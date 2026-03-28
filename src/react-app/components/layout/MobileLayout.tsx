import { MobileSidebar } from "./MobileSidebar";

// ── Props ─────────────────────────────────────────────────────────────────────

interface MobileLayoutProps {
  children: React.ReactNode;
  onOpenRehabFriend: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileLayout({ children, onOpenRehabFriend }: MobileLayoutProps) {
  return (
    <div className="flex overflow-hidden bg-background" style={{ height: "100dvh", width: "100dvw" }}>
      <MobileSidebar onOpenRehabFriend={onOpenRehabFriend} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-background">
        {children}
      </main>
    </div>
  );
}
