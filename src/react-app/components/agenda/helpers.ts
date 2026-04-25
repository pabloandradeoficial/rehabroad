import type { useAppAuth } from "@/react-app/contexts/AuthContext";

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getWeekRange(dateStr: string) {
  const selected = parseLocalDate(dateStr);
  const dayOfWeek = selected.getDay();
  const start = new Date(selected);
  start.setDate(start.getDate() - dayOfWeek);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export function getDisplayProfessionalName(user: ReturnType<typeof useAppAuth>["user"]) {
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const fromFullName =
    typeof metadata.full_name === "string" ? metadata.full_name : "";
  const fromName = typeof metadata.name === "string" ? metadata.name : "";
  const fromEmail = user?.email?.split("@")[0] ?? "";

  return fromFullName || fromName || fromEmail || "Equipe RehabRoad";
}
