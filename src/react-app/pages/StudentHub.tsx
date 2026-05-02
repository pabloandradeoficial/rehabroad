import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useAppAuth } from "@/react-app/contexts/AuthContext";
import {
  GraduationCap,
  BookOpen,
  LogIn,
  LogOut,
  Flame,
  MessageCircle,
  TrendingUp,
  Home,
  Grid3X3,
  Activity,
  Check,
  Play,
  ChevronRight,
  Trophy,
  Share2,
  Globe,
  Lock,
  Award,
} from "lucide-react";
import {
  WeeklyProgressChart,
  StreakCalendar,
  StudentAvatar,
} from "@/react-app/components/StudentProgressWidgets";
import { Card, CardContent } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { StudentModuleRouter } from "./student/student-hub/StudentModuleRouter";
import { useLanguage } from "@/react-app/contexts/LanguageContext";
import type { ModuleType, RegionProgress, StudentProgress } from "./student/student-hub/types";
import {
  GUEST_PROGRESS_KEY,
  GUEST_STREAK_KEY,
  migrateGuestProgressToUser,
  parseStoredCaseProgress,
  readStoredStreak,
  summarizeStoredCaseProgress,
} from "./student/student-hub/progress-helpers";
import { mainModules, supportModules } from "./student/student-hub/modules-config";
import { CelebrationModal } from "./student/student-hub/CelebrationModal";
import { InternshipModal } from "./student/student-hub/InternshipModal";
import { ProBridgeBanner } from "./student/student-hub/ProBridgeBanner";
import { StudentModuleCard } from "./student/student-hub/StudentModuleCard";

export default function StudentHub() {
  const { user, isPending, loginWithGoogle, logout } = useAppAuth();
  const { language, setLanguage } = useLanguage();

  useEffect(() => { window.scrollTo(0, 0) }, []);
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

  // Render modules
  if (activeModule !== "hub") {
    return (
      <StudentModuleRouter
        activeModule={activeModule}
        onBack={handleBack}
        onSelectModule={setActiveModule}
        onDailyComplete={handleDailyComplete}
        fetchProgress={fetchProgress}
        userId={user?.id}
        currentStreak={currentStreak}
        dailyChallengeCompleted={dailyChallengeCompleted}
      />
    );
  }

  const accuracy =
    progress && progress.cases_completed > 0
      ? Math.round((progress.cases_correct / progress.cases_completed) * 100)
      : 0;

  // Module Card Component
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <CelebrationModal
        open={showCelebration}
        onClose={() => { setShowCelebration(false); setCelebrationDismissed(true); }}
        onShareWhatsApp={handleShareWhatsApp}
        onCopyLink={handleCopyLink}
      />

      <InternshipModal
        open={showInternshipModal}
        onSelect={(estagio) => void handleInternshipSelect(estagio)}
        onSkip={() => setShowInternshipModal(false)}
      />


      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              REHABROAD
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              title={
                language === "pt" ? "Switch to English" : "Mudar para Português"
              }
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
            </button>
            <Badge className="hidden sm:inline-flex bg-violet-50 text-violet-700 border-violet-200 text-[10px] px-2 py-0.5">
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
        <p className="text-center text-xs text-gray-500">
          Plataforma gratuita para estudantes de fisioterapia treinarem
          raciocínio clínico.
        </p>

        <div className="text-center pt-2 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
            Treine seu Raciocínio Clínico como um Fisioterapeuta Especialista
          </h1>
          <p className="text-sm text-gray-600">
            Resolva casos clínicos, pratique testes ortopédicos e conecte teoria
            com prática.
          </p>
        </div>

        {!isPending && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Seu Progresso Clínico</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                  {overallProgress >= 100 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Trophy className="w-3 h-3" />100%
                    </span>
                  )}
                </div>
              </div>
              {overallProgress >= 100 && (
                <button onClick={() => setShowCelebration(true)} className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  <Share2 className="w-3 h-3" />Compartilhar
                </button>
              )}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full rounded-full ${overallProgress >= 100 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gradient-to-r from-teal-500 to-emerald-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallProgress, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {overallProgress >= 100 ? "🎉 Treinamento completo!" : "Continue resolvendo casos para evoluir."}
            </p>
          </div>
        )}

        {!dailyChallengeCompleted && (
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-gray-900">
                      Caso Clínico do Dia
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Casos", value: progress.cases_completed || 0, icon: "🧠" },
              { label: "Acertos", value: `${accuracy}%`, icon: "🎯" },
              { label: "Sequência", value: progress.streak || 0, icon: "🔥" },
              { label: "Tempo", value: `${Math.round((progress.total_time_minutes || 0) / 60)}h`, icon: "⏱️" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Region Journey — shown when user has any region progress */}
        {user && regionProgress.length > 0 && (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-bold text-gray-900">Sua Jornada Clínica</span>
              </div>
              <div className="space-y-2">
                {regionProgress.map((r) => (
                  <div key={r.regiao} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      r.status === "dominated" ? "bg-emerald-500" :
                      r.status === "in_progress" ? "bg-teal-500" : "bg-gray-200"
                    }`}>
                      {r.status === "dominated"
                        ? <Trophy className="w-3 h-3 text-white" />
                        : r.status === "in_progress"
                        ? <TrendingUp className="w-3 h-3 text-white" />
                        : <Lock className="w-3 h-3 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-gray-700 capitalize truncate">
                          {r.regiao.replace("_", " ")}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{r.dominio_percent}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

        {showProBridge && (
          <ProBridgeBanner onDismiss={() => void handleDismissProBridge()} />
        )}

        {currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-900">
              {currentStreak} {currentStreak === 1 ? "dia" : "dias"} seguidos
              estudando
            </span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
        )}

        {!isPending && progress && !loadingProgress && (
          <div className="space-y-1">
            <WeeklyProgressChart data={weeklyData} />
            <p className="text-[10px] text-gray-500 text-center px-2">
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
          <Card className="border-gray-200 bg-white shadow-sm">
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
                      <p className="font-semibold text-gray-900 text-sm">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-900 h-8"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StudentAvatar name="?" size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Salve seu progresso
                      </p>
                      <p className="text-xs text-gray-500">
                        Entre com Google
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => void handleStudentLogin()}
                    className="gap-1 bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs"
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
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-teal-500 rounded-full" />
            Módulos Clínicos Principais
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mainModules.map((module) => (
              <StudentModuleCard
                key={module.id}
                module={module}
                progressValue={moduleProgress[module.id as keyof typeof moduleProgress] || 0}
                onSelect={handleSelectModule}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-violet-500 rounded-full" />
            Biblioteca e Apoio
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {supportModules.map((module) => (
              <StudentModuleCard
                key={module.id}
                module={module}
                size="small"
                progressValue={moduleProgress[module.id as keyof typeof moduleProgress] || 0}
                onSelect={handleSelectModule}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 px-4 mt-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-gray-500 mb-3">
            Conteúdo educacional para apoio ao estudo. Não substitui supervisão
            clínica.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-900">
              Voltar ao Site
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to="/login"
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Área Profissional →
            </Link>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 py-1.5 px-1 md:hidden z-50 safe-area-inset-bottom shadow-lg">
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
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-medium">Treino</span>
          </button>
          <button
            onClick={() => handleSelectModule("cases")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium">Casos</span>
          </button>
          <button
            onClick={() => handleSelectModule("library")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Módulos</span>
          </button>
          <button
            onClick={() => handleSelectModule("community")}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl min-h-[52px] transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Social</span>
          </button>
        </div>
      </nav>
    </div>
  );
}