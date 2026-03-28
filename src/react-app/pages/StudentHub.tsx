import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import {
  GraduationCap,
  MapPin,
  Dumbbell,
  Stethoscope,
  FileText,
  BookOpen,
  ArrowLeft,
  LogIn,
  LogOut,
  Flame,
  MessageCircle,
  Target,
  TrendingUp,
  Home,
  Grid3X3,
  Activity,
  Check,
  Zap,
  ClipboardList,
  Play,
  ChevronRight,
  Users,
  Trophy,
  Share2,
  Copy,
  X,
  Globe,
  Brain,
  Lock,
  Award,
  Briefcase,
} from "lucide-react";
import {
  WeeklyProgressChart,
  StreakCalendar,
  StudentAvatar,
  CircularStatCard,
} from "@/react-app/components/StudentProgressWidgets";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import PainMapModule from "./student/PainMapModule";
import KeyMusclesModule from "./student/KeyMusclesModule";
import OrthopedicTestsModule from "./student/OrthopedicTestsModule";
import InitialTreatmentsModule from "./student/InitialTreatmentsModule";
import StudentDashboard from "./StudentDashboard";
import DailyTrainingModule from "./student/DailyTrainingModule";
import StudentCommunity from "./student/StudentCommunity";
import ContentLibrary from "./student/ContentLibrary";
import StudentReferral from "./student/StudentReferral";
import ElectrotherapyModule from "./student/ElectrotherapyModule";
import BiomechanicsModule from "./student/BiomechanicsModule";
import AnamneseModule from "./student/AnamneseModule";
import FlashcardsModule from "./student/FlashcardsModule";
import AnamneseSimulator from "./student/AnamneseSimulator";
import { useLanguage } from "@/react-app/contexts/LanguageContext";

type ModuleType =
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

interface ModuleCard {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

interface StudentProgress {
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

interface RegionProgress {
  regiao: string;
  casos_resolvidos: number;
  casos_total: number;
  acertos: number;
  dominio_percent: number;
  status: "locked" | "in_progress" | "dominated";
}

interface StoredCaseProgress {
  caseId: string;
  correct?: boolean;
  selectedOption?: string;
  completedAt?: string;
}

const GUEST_PROGRESS_KEY = "rehabroad_student_progress_guest";
const GUEST_STREAK_KEY = "rehabroad_student_streak_guest";

function parseStoredCaseProgress(raw: string | null): StoredCaseProgress[] {
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

function summarizeStoredCaseProgress(items: StoredCaseProgress[]) {
  return {
    casesCompleted: items.length,
    casesCorrect: items.filter((item) => item.correct).length,
  };
}

function readStoredStreak(key: string): number {
  const value = parseInt(localStorage.getItem(key) || "0", 10);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function mergeStoredCaseProgress(
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

function migrateGuestProgressToUser(userId: string) {
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

// LEVEL 2: Main clinical modules
const mainModules: ModuleCard[] = [
  {
    id: "pain-map",
    title: "Mapa da Dor",
    description: "Relacione regiões do corpo com hipóteses clínicas",
    icon: <MapPin className="w-5 h-5" />,
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
  {
    id: "tests",
    title: "Testes Ortopédicos",
    description: "Execução e interpretação dos testes essenciais",
    icon: <Stethoscope className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    id: "muscles",
    title: "Músculos-Chave",
    description: "Anatomia palpatória e relação clínica",
    icon: <Dumbbell className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-500",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
  },
  {
    id: "treatments",
    title: "Condutas Iniciais",
    description: "Objetivos e condutas para as principais condições",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
  {
    id: "cases",
    title: "Casos Clínicos",
    description: "Pratique raciocínio diagnóstico com casos simulados",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-cyan-500 to-blue-500",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-500",
  },
];

// LEVEL 3: Support & library modules
const supportModules: ModuleCard[] = [
  {
    id: "library",
    title: "Biblioteca",
    description: "Conteúdos de aula organizados por área clínica",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-indigo-500 to-violet-500",
    iconBg: "bg-gradient-to-br from-indigo-500 to-violet-500",
  },
  {
    id: "community",
    title: "Discussão Clínica",
    description: "Tire dúvidas e discuta casos com outros estudantes",
    icon: <MessageCircle className="w-5 h-5" />,
    gradient: "from-pink-500 to-rose-500",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    id: "biomechanics",
    title: "Biomecânica Articular",
    description: "Movimentos, ADM, planos e eixos das articulações",
    icon: <Activity className="w-5 h-5" />,
    gradient: "from-indigo-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600",
  },
  {
    id: "electrotherapy",
    title: "Eletroterapia",
    description: "Parâmetros de TENS, ultrassom, laser e mais",
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    id: "anamnese",
    title: "Anamnese e Avaliação",
    description: "Entrevista clínica, exame físico e documentação",
    icon: <ClipboardList className="w-5 h-5" />,
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "referral",
    title: "Convide um Colega",
    description: "Estude com colegas e evoluam juntos",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-pink-500 to-purple-500",
    iconBg: "bg-gradient-to-br from-pink-500 to-purple-500",
  },
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Revise testes ortopédicos com cartões de estudo",
    icon: <Brain className="w-5 h-5" />,
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500",
  },
  {
    id: "anamnese-simulator",
    title: "Simulador de Anamnese",
    description: "Pratique entrevista clínica com paciente simulado por IA",
    icon: <MessageCircle className="w-5 h-5" />,
    gradient: "from-violet-500 to-indigo-500",
    iconBg: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
];

export default function StudentHub() {
  const { user, isPending, loginWithGoogle, logout } = useAppAuth();
  const { language, setLanguage } = useLanguage();
  const [activeModule, setActiveModule] = useState<ModuleType>("hub");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [regionProgress, setRegionProgress] = useState<RegionProgress[]>([]);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showProBridge, setShowProBridge] = useState(false);

  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "Estudante";

  // Module progress tracking from localStorage
  const moduleProgress = useMemo(() => {
    const userId = user?.id || "guest";
    const getModuleProgress = (moduleId: string, totalItems: number): number => {
      const key = `rehabroad_${moduleId}_progress_${userId}`;
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          const completed = Array.isArray(data)
            ? data.length
            : data.completed || 0;
          return Math.min(100, Math.round((completed / totalItems) * 100));
        }
      } catch {
        // ignore
      }
      return progress?.modules_visited?.includes(moduleId) ? 100 : 0;
    };

    return {
      "pain-map": getModuleProgress("painmap", 7),
      muscles: getModuleProgress("muscles", 16),
      tests: getModuleProgress("tests", 18),
      treatments: getModuleProgress("treatments", 12),
      library: getModuleProgress("library", 21),
      electrotherapy: getModuleProgress("electrotherapy", 10),
      biomechanics: getModuleProgress("biomechanics", 10),
      anamnese: getModuleProgress("anamnese", 15),
      cases: Math.min(100, ((progress?.cases_completed || 0) / 12) * 100),
      "daily-training":
        progress?.daily_challenge_date === new Date().toISOString().split("T")[0]
          ? 100
          : 0,
      community: progress?.modules_visited?.includes("community") ? 100 : 0,
      referral: progress?.modules_visited?.includes("referral") ? 100 : 0,
    };
  }, [user?.id, progress]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalModules = 12;
    const partialProgress =
      Object.values(moduleProgress).reduce((sum, p) => sum + p, 0) /
      totalModules;
    return Math.round(partialProgress);
  }, [moduleProgress]);

  // Show celebration when 100% reached
  useEffect(() => {
    if (overallProgress >= 100 && !celebrationDismissed) {
      const hasSeenCelebration = localStorage.getItem(
        "rehabroad_100_celebration_seen"
      );
      if (!hasSeenCelebration) {
        setShowCelebration(true);
        localStorage.setItem("rehabroad_100_celebration_seen", "true");
      }
    }
  }, [overallProgress, celebrationDismissed]);

  // Show internship modal once for users with 5+ cases
  useEffect(() => {
    if (!user || !progress) return;
    if ((progress.cases_completed || 0) >= 5 && !progress.estagio_atual) {
      const seen = localStorage.getItem(`rehabroad_internship_modal_${user.id}`);
      if (!seen) {
        setShowInternshipModal(true);
        localStorage.setItem(`rehabroad_internship_modal_${user.id}`, "true");
      }
    }
  }, [user, progress]);

  // Show pro bridge after 10+ cases or after dominating a region
  useEffect(() => {
    if (!user || !progress) return;
    if (progress.ponte_pro_shown) return;
    const dominated = regionProgress.some((r) => r.status === "dominated");
    if ((progress.cases_completed || 0) >= 10 || dominated) {
      setShowProBridge(true);
    }
  }, [user, progress, regionProgress]);

  const handleInternshipSelect = async (estagio: string) => {
    setShowInternshipModal(false);
    if (!user) return;
    try {
      await fetch("/api/student/progress/estagio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ estagio_atual: estagio }),
      });
      if (progress) setProgress({ ...progress, estagio_atual: estagio });
    } catch {
      // non-critical
    }
  };

  const handleDismissProBridge = async () => {
    setShowProBridge(false);
    if (!user) return;
    try {
      await fetch("/api/student/progress/ponte-pro", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      if (progress) setProgress({ ...progress, ponte_pro_shown: 1 });
    } catch {
      // non-critical
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🏆 Completei 100% do treinamento clínico no REHABROAD Estudante!\n\nTreinei raciocínio clínico com casos reais, testes ortopédicos e muito mais. Recomendo para todo estudante de fisio!\n\n👉 https://rehabroad.com.br/estudante`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://rehabroad.com.br/estudante");
  };

  const fetchProgress = useCallback(async () => {
    setLoadingProgress(true);

    const userId = user?.id;
    const localProgressKey = userId
      ? `rehabroad_student_progress_${userId}`
      : GUEST_PROGRESS_KEY;
    const localStreakKey = userId
      ? `rehabroad_student_streak_${userId}`
      : GUEST_STREAK_KEY;

    const readLocalProgress = (progressKey: string, streakKey: string) => {
      let localCases = 0;
      let localCorrect = 0;
      let localStreak = readStoredStreak(streakKey);

      try {
        const caseProgress = parseStoredCaseProgress(
          localStorage.getItem(progressKey)
        );

        if (caseProgress.length > 0) {
          const summary = summarizeStoredCaseProgress(caseProgress);
          localCases = summary.casesCompleted;
          localCorrect = summary.casesCorrect;
        } else {
          const raw = localStorage.getItem(progressKey);

          if (raw) {
            const data = JSON.parse(raw);

            if (!Array.isArray(data) && typeof data === "object" && data) {
              localCases = Number(data.cases_completed || 0);
              localCorrect = Number(data.cases_correct || 0);
              localStreak = Math.max(localStreak, Number(data.streak || 0));
            }
          }
        }
      } catch {
        // ignore
      }

      return { localCases, localCorrect, localStreak };
    };

    if (userId) {
      migrateGuestProgressToUser(userId);
    }

    if (userId) {
      try {
        const res = await fetch("/api/student/progress", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const serverData = data.progress || {};
          const { localCases, localCorrect, localStreak } = readLocalProgress(
            localProgressKey,
            localStreakKey
          );

          const serverCases = serverData.cases_completed || 0;
          const serverCorrect = serverData.cases_correct || 0;
          const serverStreak = serverData.streak || 0;

          const finalCases = Math.max(serverCases, localCases);
          const finalCorrect = Math.max(serverCorrect, localCorrect);
          const finalStreak = Math.max(serverStreak, localStreak);

          const deltaCases = Math.max(0, localCases - serverCases);
          const deltaCorrect = Math.max(0, localCorrect - serverCorrect);

          if (deltaCases > 0 || deltaCorrect > 0) {
            void fetch("/api/student/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                cases_completed: deltaCases,
                cases_correct: deltaCorrect,
              }),
            }).catch(() => { /* non-critical progress sync */ });
          }

          setProgress({
            ...serverData,
            cases_completed: finalCases,
            cases_correct: finalCorrect,
            streak: finalStreak,
            modules_visited: serverData.modules_visited || [],
            last_module: serverData.last_module || null,
            total_time_minutes: serverData.total_time_minutes || 0,
            last_streak_date: serverData.last_streak_date || null,
            daily_challenge_date: serverData.daily_challenge_date || null,
            daily_challenge_case_id: serverData.daily_challenge_case_id || null,
            avatar_url: serverData.avatar_url || null,
          });
        } else {
          const { localCases, localCorrect, localStreak } = readLocalProgress(
            localProgressKey,
            localStreakKey
          );
          setProgress({
            cases_completed: localCases,
            cases_correct: localCorrect,
            streak: localStreak,
            modules_visited: [],
            last_module: null,
            total_time_minutes: 0,
            last_streak_date: null,
            daily_challenge_date: null,
            daily_challenge_case_id: null,
            avatar_url: null,
          });
        }
      } catch (e) {
        void e; // background fetch — fall back to local progress
        const { localCases, localCorrect, localStreak } = readLocalProgress(
          localProgressKey,
          localStreakKey
        );
        setProgress({
          cases_completed: localCases,
          cases_correct: localCorrect,
          streak: localStreak,
          modules_visited: [],
          last_module: null,
          total_time_minutes: 0,
          last_streak_date: null,
          daily_challenge_date: null,
          daily_challenge_case_id: null,
          avatar_url: null,
        });
      }
    } else {
      const { localCases, localCorrect, localStreak } = readLocalProgress(
        localProgressKey,
        localStreakKey
      );
      setProgress({
        cases_completed: localCases,
        cases_correct: localCorrect,
        streak: localStreak,
        modules_visited: [],
        last_module: null,
        total_time_minutes: 0,
        last_streak_date: null,
        daily_challenge_date: null,
        daily_challenge_case_id: null,
        avatar_url: null,
      });
    }

    setLoadingProgress(false);

    // Fetch region progress (authenticated only, non-critical)
    if (userId) {
      try {
        const res = await fetch("/api/student/region-progress", { credentials: "include" });
        if (res.ok) {
          const data = await res.json() as { regions: RegionProgress[] };
          setRegionProgress(data.regions || []);
        }
      } catch {
        // non-critical
      }
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchProgress();
  }, [fetchProgress]);

  const trackModule = async (moduleId: string) => {
    if (!user) return;
    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ module_visited: moduleId }),
      });
    } catch {
      // non-critical module tracking
    }
  };

  const handleSelectModule = (moduleId: ModuleType) => {
    setActiveModule(moduleId);
    void trackModule(moduleId);
  };

  const handleBack = () => {
    setActiveModule("hub");
    if (user) void fetchProgress();
  };

  const handleLogout = async () => {
    localStorage.setItem("loginMode", "student");
    await logout();
    setProgress(null);
    window.location.href = "/login";
  };

  const handleStudentLogin = async () => {
    try {
      localStorage.setItem("loginMode", "student");
      await loginWithGoogle();
    } catch {
      // login failure surfaced by Google OAuth
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const dailyChallengeCompleted = progress?.daily_challenge_date === today;
  const currentStreak = progress?.streak || 0;

  const weeklyData = useMemo(() => {
    const days = ["D", "S", "T", "Q", "Q", "S", "S"];
    const todayIndex = new Date().getDay();
    return days.map((day, i) => ({
      day,
      xp: 0,
      cases:
        i <= todayIndex
          ? Math.floor(((progress?.cases_completed || 0) / 7) * (i + 1))
          : 0,
    }));
  }, [progress?.cases_completed]);

  const activityData = useMemo(() => {
    const data = [];
    const todayDate = new Date();
    for (let i = 0; i < 35; i++) {
      const date = new Date(todayDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const hasActivity =
        i < (progress?.streak || 0) || (progress?.cases_completed || 0) > i;
      data.push({
        date: dateStr,
        count: hasActivity ? Math.floor(Math.random() * 10) + 1 : 0,
      });
    }
    return data;
  }, [progress?.streak, progress?.cases_completed]);

  const handleDailyComplete = async (isCorrect: boolean) => {
    if (!user) return;
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          daily_completed: true,
          is_correct: isCorrect,
          cases_completed: 1,
          cases_correct: isCorrect ? 1 : 0,
        }),
      });
      if (res.ok) {
        await fetchProgress();
      }
    } catch {
      // progress update failure — local state already reflects result
    }
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Render modules
  if (activeModule !== "hub") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="min-h-screen"
        >
          {activeModule === "daily-training" && (
            <DailyTrainingModule
              onBack={handleBack}
              userId={user?.id}
              onComplete={handleDailyComplete}
              currentStreak={currentStreak}
              dailyChallengeCompleted={dailyChallengeCompleted}
            />
          )}
          {activeModule === "pain-map" && <PainMapModule onBack={handleBack} />}
          {activeModule === "muscles" && (
            <KeyMusclesModule onBack={handleBack} />
          )}
          {activeModule === "tests" && (
            <OrthopedicTestsModule onBack={handleBack} />
          )}
          {activeModule === "treatments" && (
            <InitialTreatmentsModule onBack={handleBack} />
          )}
          {activeModule === "community" && (
            <StudentCommunity onBack={handleBack} />
          )}
          {activeModule === "library" && (
            <ContentLibrary
              onBack={handleBack}
              onTestCase={() => setActiveModule("cases")}
            />
          )}
          {activeModule === "referral" && (
            <StudentReferral onBack={handleBack} />
          )}
          {activeModule === "electrotherapy" && (
            <ElectrotherapyModule onBack={handleBack} />
          )}
          {activeModule === "biomechanics" && (
            <BiomechanicsModule onBack={handleBack} />
          )}
          {activeModule === "anamnese" && (
            <AnamneseModule onBack={handleBack} />
          )}
          {activeModule === "flashcards" && (
            <FlashcardsModule onBack={handleBack} />
          )}
          {activeModule === "anamnese-simulator" && (
            <AnamneseSimulator onBack={handleBack} />
          )}
          {activeModule === "cases" && (
            <div className="min-h-screen bg-slate-50">
              <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-5xl mx-auto px-4 py-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-slate-300 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </div>
              </header>
              <StudentDashboard onProgressUpdate={fetchProgress} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  const accuracy =
    progress && progress.cases_completed > 0
      ? Math.round((progress.cases_correct / progress.cases_completed) * 100)
      : 0;

  // Module Card Component
  const ModuleCardComponent = ({
    module,
    size = "normal",
  }: {
    module: ModuleCard;
    size?: "normal" | "small";
  }) => {
    const progressValue =
      moduleProgress[module.id as keyof typeof moduleProgress] || 0;
    const isComplete = progressValue >= 100;
    const isSmall = size === "small";

    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => handleSelectModule(module.id)}
        className={`
          relative bg-white rounded-xl cursor-pointer shadow-sm
          active:shadow-md transition-all duration-200
          border border-slate-100 active:border-slate-200
          touch-manipulation group
          ${isSmall ? "p-3 min-h-[100px]" : "p-4 min-h-[130px]"}
        `}
      >
        {progressValue > 0 && (
          <div className="absolute top-2 right-2">
            {isComplete ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span className="text-[9px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                {Math.round(progressValue)}%
              </span>
            )}
          </div>
        )}

        <div
          className={`
          ${isSmall ? "w-8 h-8 rounded-lg mb-2" : "w-10 h-10 rounded-xl mb-3"}
          ${module.iconBg} flex items-center justify-center text-white
          shadow-md group-active:scale-95 transition-transform duration-200
        `}
        >
          {module.icon}
        </div>

        <h3
          className={`font-bold text-slate-900 leading-tight ${
            isSmall ? "text-xs" : "text-sm"
          }`}
        >
          {module.title}
        </h3>

        <p
          className={`text-slate-500 leading-snug mt-0.5 line-clamp-2 ${
            isSmall ? "text-[10px]" : "text-xs"
          }`}
        >
          {module.description}
        </p>

        {progressValue > 0 && progressValue < 100 && (
          <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* 100% Completion Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => {
              setShowCelebration(false);
              setCelebrationDismissed(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Confetti background */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: [
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ef4444",
                        "#3b82f6",
                      ][i % 5],
                    }}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: [0, 1, 0.5],
                      rotate: 360,
                      y: [0, -20, 100],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => {
                  setShowCelebration(false);
                  setCelebrationDismissed(true);
                }}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {/* Trophy seal */}
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full animate-pulse" />
                <div className="absolute inset-1 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-amber-800" />
                </div>
                <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                🎉 Parabéns!
              </h2>
              <p className="text-lg font-semibold text-emerald-600 mb-1">
                100% Concluído!
              </p>
              <p className="text-sm text-slate-600 mb-6">
                Você completou todo o treinamento clínico do REHABROAD. Seu
                raciocínio clínico está afiado!
              </p>

              {/* Achievement badge preview */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-100">
                <p className="text-xs text-slate-500 mb-2">
                  Seu selo de conquista:
                </p>
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-emerald-200">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-900">
                    Fisioterapeuta Clínico Completo
                  </span>
                </div>
              </div>

              {/* Share buttons */}
              <p className="text-xs text-slate-500 mb-3">
                Compartilhe sua conquista:
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internship Mode Modal */}
      <AnimatePresence>
        {showInternshipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Modo Estágio</h3>
                  <p className="text-xs text-slate-500">Personaliza os casos para seu nível</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Em qual fase do estágio você está? Vamos priorizar casos relevantes para você.
              </p>
              <div className="space-y-2">
                {["Pré-estágio", "Estágio básico (1º período)", "Estágio intermediário (2º período)", "Estágio avançado / internato"].map((estagio) => (
                  <button
                    key={estagio}
                    onClick={() => void handleInternshipSelect(estagio)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-colors text-sm font-medium text-slate-700"
                  >
                    {estagio}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowInternshipModal(false)}
                className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Pular por enquanto
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              REHABROAD
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
              title={
                language === "pt" ? "Switch to English" : "Mudar para Português"
              }
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
            </button>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-[10px] px-2 py-0.5">
              <GraduationCap className="w-3 h-3 mr-1" />
              Estudante
            </Badge>
            <Link
              to="/login"
              onClick={() => localStorage.setItem("loginMode", "professional")}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 text-xs px-3 h-8"
              >
                Área Pro
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <p className="text-center text-xs text-slate-500">
          Plataforma gratuita para estudantes de fisioterapia treinarem
          raciocínio clínico.
        </p>

        <div className="text-center pt-2 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
            Treine seu Raciocínio Clínico como um Fisioterapeuta Especialista
          </h1>
          <p className="text-sm text-slate-600">
            Resolva casos clínicos, pratique testes ortopédicos e conecte teoria
            com prática.
          </p>
        </div>

        {!isPending && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900">
                  Seu progresso clínico
                </span>
                <div className="flex items-center gap-2">
                  {overallProgress >= 100 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Trophy className="w-3 h-3" />
                      100%
                    </span>
                  )}
                  <span className="text-sm font-bold text-teal-600">
                    {overallProgress}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    overallProgress >= 100
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                      : "bg-gradient-to-r from-teal-500 to-emerald-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              {overallProgress >= 100 ? (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-emerald-600 font-medium">
                    🎉 Parabéns! Treinamento completo!
                  </p>
                  <button
                    onClick={() => setShowCelebration(true)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    Compartilhar
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  Continue resolvendo casos para evoluir.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {!dailyChallengeCompleted && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-orange-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-slate-900">
                      Caso Clínico do Dia
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Resolva o desafio clínico de hoje e mantenha sua sequência
                    de estudos.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSelectModule("daily-training")}
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-1 text-xs h-8"
                >
                  <Play className="w-3 h-3" />
                  Resolver
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isPending && progress && !loadingProgress && (
          <div className="grid grid-cols-3 gap-2">
            <CircularStatCard
              icon={<Target className="w-4 h-4" />}
              value={progress.cases_completed || 0}
              maxValue={50}
              label="Casos resolvidos"
              color="violet"
            />
            <CircularStatCard
              icon={<TrendingUp className="w-4 h-4" />}
              value={accuracy}
              maxValue={100}
              label="Taxa de acerto"
              suffix="%"
              color="amber"
            />
            <CircularStatCard
              icon={<Flame className="w-4 h-4" />}
              value={progress.streak || 0}
              maxValue={30}
              label="Sequência"
              color="rose"
            />
          </div>
        )}

        {/* Region Journey — shown when user has any region progress */}
        {user && regionProgress.length > 0 && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-bold text-slate-900">Sua Jornada Clínica</span>
              </div>
              <div className="space-y-2">
                {regionProgress.map((r) => (
                  <div key={r.regiao} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      r.status === "dominated" ? "bg-emerald-500" :
                      r.status === "in_progress" ? "bg-teal-500" : "bg-slate-200"
                    }`}>
                      {r.status === "dominated"
                        ? <Trophy className="w-3 h-3 text-white" />
                        : r.status === "in_progress"
                        ? <TrendingUp className="w-3 h-3 text-white" />
                        : <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-slate-700 capitalize truncate">
                          {r.regiao.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-500 ml-2 flex-shrink-0">{r.dominio_percent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            r.status === "dominated"
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                              : "bg-gradient-to-r from-teal-400 to-teal-500"
                          }`}
                          style={{ width: `${r.dominio_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pro Bridge Banner */}
        {showProBridge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-4 shadow-lg overflow-hidden"
          >
            <button
              onClick={() => void handleDismissProBridge()}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-bold text-sm">Você está evoluindo rápido!</span>
              </div>
              <p className="text-white/80 text-xs mb-3">
                Fisioterapeutas Pro usam o Rehabroad para prontuário, IA diagnóstica e muito mais.
              </p>
              <a
                href="/login"
                onClick={() => localStorage.setItem("loginMode", "professional")}
                className="inline-flex items-center gap-1.5 bg-white text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
              >
                Conhecer o Plano Pro
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}

        {currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-900">
              {currentStreak} {currentStreak === 1 ? "dia" : "dias"} seguidos
              estudando
            </span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
        )}

        {!isPending && progress && !loadingProgress && (
          <div className="space-y-1">
            <WeeklyProgressChart data={weeklyData} />
            <p className="text-[10px] text-slate-400 text-center px-2">
              Cada barra representa um dia de estudo. Quanto mais escura, maior
              a atividade.
            </p>
          </div>
        )}

        {!isPending && progress && !loadingProgress && (
          <div className="hidden sm:block">
            <StreakCalendar
              activityData={activityData}
              streak={progress.streak || 0}
            />
          </div>
        )}

        {!isPending && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StudentAvatar
                      name={displayName}
                      imageUrl={progress?.avatar_url}
                      size="sm"
                      editable
                      userId={user.id}
                      onAvatarChange={(url) => {
                        if (progress) {
                          setProgress({ ...progress, avatar_url: url });
                        }
                      }}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-500 h-8"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StudentAvatar name="?" size="sm" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        Salve seu progresso
                      </p>
                      <p className="text-xs text-slate-500">
                        Entre com Google
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => void handleStudentLogin()}
                    className="gap-1 bg-slate-900 hover:bg-slate-800 h-8 text-xs"
                  >
                    <LogIn className="w-3 h-3" />
                    Entrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <section>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectModule("daily-training")}
            className="relative bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 cursor-pointer shadow-lg shadow-orange-500/20 touch-manipulation overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1">
                    Treino Diário <span>🔥</span>
                  </h3>
                  {dailyChallengeCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Completo hoje
                    </span>
                  )}
                </div>
              </div>

              <p className="text-white/90 text-sm mb-4">
                Resolva 5 casos clínicos por dia e desenvolva seu raciocínio
                clínico.
              </p>

              <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold gap-2">
                <Play className="w-4 h-4" />
                Iniciar treino
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Módulos Clínicos Principais
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mainModules.map((module) => (
              <ModuleCardComponent key={module.id} module={module} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Biblioteca e Apoio
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {supportModules.map((module) => (
              <ModuleCardComponent
                key={module.id}
                module={module}
                size="small"
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 px-4 mt-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-slate-500 mb-3">
            Conteúdo educacional para apoio ao estudo. Não substitui supervisão
            clínica.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-900">
              Voltar ao Site
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/login"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Área Profissional →
            </Link>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-1.5 px-1 md:hidden z-50 safe-area-inset-bottom shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveModule("hub")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 bg-teal-50 text-teal-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Início</span>
          </button>
          <button
            onClick={() => handleSelectModule("daily-training")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-slate-500"
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-medium">Treino</span>
          </button>
          <button
            onClick={() => handleSelectModule("cases")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-slate-500"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium">Casos</span>
          </button>
          <button
            onClick={() => handleSelectModule("library")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-slate-500"
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Módulos</span>
          </button>
          <button
            onClick={() => handleSelectModule("community")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-slate-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Social</span>
          </button>
        </div>
      </nav>
    </div>
  );
}