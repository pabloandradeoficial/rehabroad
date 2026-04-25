import type { StoredCaseProgress } from "./types";

export const GUEST_PROGRESS_KEY = "rehabroad_student_progress_guest";
export const GUEST_STREAK_KEY = "rehabroad_student_streak_guest";

export function parseStoredCaseProgress(raw: string | null): StoredCaseProgress[] {
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(
      (item): item is StoredCaseProgress =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.caseId === "string"
    );
  } catch {
    return [];
  }
}

export function summarizeStoredCaseProgress(items: StoredCaseProgress[]) {
  return {
    casesCompleted: items.length,
    casesCorrect: items.filter((item) => item.correct).length,
  };
}

export function readStoredStreak(key: string): number {
  const value = parseInt(localStorage.getItem(key) || "0", 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function mergeStoredCaseProgress(
  existingItems: StoredCaseProgress[],
  incomingItems: StoredCaseProgress[]
): StoredCaseProgress[] {
  const merged = new Map<string, StoredCaseProgress>();

  const toTimestamp = (value?: string) => {
    const timestamp = Date.parse(value ?? "");
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  for (const item of [...existingItems, ...incomingItems]) {
    const current = merged.get(item.caseId);

    if (!current) {
      merged.set(item.caseId, item);
      continue;
    }

    const currentTime = toTimestamp(current.completedAt);
    const itemTime = toTimestamp(item.completedAt);

    if (itemTime > currentTime) {
      merged.set(item.caseId, { ...current, ...item });
      continue;
    }

    if (item.correct && !current.correct) {
      merged.set(item.caseId, { ...current, ...item, correct: true });
    }
  }

  return Array.from(merged.values()).sort(
    (a, b) => toTimestamp(a.completedAt) - toTimestamp(b.completedAt)
  );
}

export function migrateGuestProgressToUser(userId: string) {
  try {
    const guestProgress = parseStoredCaseProgress(
      localStorage.getItem(GUEST_PROGRESS_KEY)
    );
    const guestStreak = readStoredStreak(GUEST_STREAK_KEY);

    if (guestProgress.length === 0 && guestStreak === 0) {
      return;
    }

    const userProgressKey = `rehabroad_student_progress_${userId}`;
    const userStreakKey = `rehabroad_student_streak_${userId}`;

    const existingUserProgress = parseStoredCaseProgress(
      localStorage.getItem(userProgressKey)
    );

    const mergedProgress = mergeStoredCaseProgress(
      existingUserProgress,
      guestProgress
    );

    localStorage.setItem(userProgressKey, JSON.stringify(mergedProgress));
    localStorage.setItem(
      userStreakKey,
      String(Math.max(readStoredStreak(userStreakKey), guestStreak))
    );

    localStorage.removeItem(GUEST_PROGRESS_KEY);
    localStorage.removeItem(GUEST_STREAK_KEY);
  } catch {
    // migration failure is non-critical — guest data simply isn't carried over
  }
}
