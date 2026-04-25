export type ModuleType =
  | "hub"
  | "daily-training"
  | "pain-map"
  | "muscles"
  | "tests"
  | "treatments"
  | "cases"
  | "community"
  | "library"
  | "referral"
  | "electrotherapy"
  | "biomechanics"
  | "anamnese"
  | "flashcards"
  | "anamnese-simulator";

export interface ModuleCard {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

export interface StudentProgress {
  cases_completed: number;
  cases_correct: number;
  modules_visited: string[];
  last_module: string | null;
  total_time_minutes: number;
  streak: number;
  last_streak_date: string | null;
  daily_challenge_date: string | null;
  daily_challenge_case_id: string | null;
  avatar_url: string | null;
  estagio_atual?: string | null;
  ponte_pro_shown?: number;
}

export interface RegionProgress {
  regiao: string;
  casos_resolvidos: number;
  casos_total: number;
  acertos: number;
  dominio_percent: number;
  status: "locked" | "in_progress" | "dominated";
}

export interface StoredCaseProgress {
  caseId: string;
  correct?: boolean;
  selectedOption?: string;
  completedAt?: string;
}
