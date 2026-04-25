import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import PainMapModule from "../PainMapModule";
import KeyMusclesModule from "../KeyMusclesModule";
import OrthopedicTestsModule from "../OrthopedicTestsModule";
import InitialTreatmentsModule from "../InitialTreatmentsModule";
import StudentDashboard from "../../StudentDashboard";
import DailyTrainingModule from "../DailyTrainingModule";
import StudentCommunity from "../StudentCommunity";
import ContentLibrary from "../ContentLibrary";
import StudentReferral from "../StudentReferral";
import ElectrotherapyModule from "../ElectrotherapyModule";
import BiomechanicsModule from "../BiomechanicsModule";
import AnamneseModule from "../AnamneseModule";
import FlashcardsModule from "../FlashcardsModule";
import AnamneseSimulator from "../AnamneseSimulator";
import type { ModuleType } from "./types";

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

interface StudentModuleRouterProps {
  activeModule: ModuleType;
  onBack: () => void;
  onSelectModule: (module: ModuleType) => void;
  onDailyComplete: (isCorrect: boolean) => void;
  fetchProgress: () => void;
  userId: string | undefined;
  currentStreak: number;
  dailyChallengeCompleted: boolean;
}

export function StudentModuleRouter({
  activeModule,
  onBack,
  onSelectModule,
  onDailyComplete,
  fetchProgress,
  userId,
  currentStreak,
  dailyChallengeCompleted,
}: StudentModuleRouterProps) {
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
            onBack={onBack}
            userId={userId}
            onComplete={onDailyComplete}
            currentStreak={currentStreak}
            dailyChallengeCompleted={dailyChallengeCompleted}
          />
        )}
        {activeModule === "pain-map" && <PainMapModule onBack={onBack} />}
        {activeModule === "muscles" && <KeyMusclesModule onBack={onBack} />}
        {activeModule === "tests" && <OrthopedicTestsModule onBack={onBack} />}
        {activeModule === "treatments" && <InitialTreatmentsModule onBack={onBack} />}
        {activeModule === "community" && <StudentCommunity onBack={onBack} />}
        {activeModule === "library" && (
          <ContentLibrary onBack={onBack} onTestCase={() => onSelectModule("cases")} />
        )}
        {activeModule === "referral" && <StudentReferral onBack={onBack} />}
        {activeModule === "electrotherapy" && <ElectrotherapyModule onBack={onBack} />}
        {activeModule === "biomechanics" && <BiomechanicsModule onBack={onBack} />}
        {activeModule === "anamnese" && <AnamneseModule onBack={onBack} />}
        {activeModule === "flashcards" && <FlashcardsModule onBack={onBack} />}
        {activeModule === "anamnese-simulator" && <AnamneseSimulator onBack={onBack} />}
        {activeModule === "cases" && (
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-5xl mx-auto px-4 py-4">
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
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
