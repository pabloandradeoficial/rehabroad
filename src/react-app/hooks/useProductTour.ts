import { useState, useEffect } from "react";

export interface ProductTourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  route?: string;
  action?: string;
}

const PRODUCT_TOUR_STEPS: ProductTourStep[] = [
  {
    id: "profile",
    title: "👤 Configure seu perfil",
    description: "Adicione seu nome, especialidade e CREFITO. Isso aparece nos laudos exportados.",
    target: '[data-onboarding="user-profile"]',
    position: "bottom",
    action: "Configurar agora",
  },
  {
    id: "new-patient",
    title: "➕ Cadastre seu primeiro paciente",
    description: "Clique aqui para adicionar um paciente. Em 30 segundos ele já estará no sistema.",
    target: '[data-onboarding="new-patient-btn"]',
    position: "bottom",
    route: "/dashboard",
    action: "Cadastrar paciente",
  },
  {
    id: "evaluation",
    title: "📋 Crie uma avaliação",
    description: "Com o paciente cadastrado, crie uma avaliação clínica estruturada. O sistema usa esses dados para personalizar todas as sugestões.",
    target: '[data-onboarding="evaluations-tab"]',
    position: "right",
    action: "Criar avaliação",
  },
  {
    id: "apoio-clinico",
    title: "🧠 Conheça o Apoio Clínico",
    description: "O Apoio Clínico cruza os dados do paciente e sugere hipóteses diagnósticas, exercícios e condutas baseadas em evidência.",
    target: '[data-onboarding="apoio-clinico-link"]',
    position: "right",
    route: "/dashboard/suporte",
    action: "Explorar Apoio Clínico",
  },
  {
    id: "rehab-friend",
    title: "🤖 Conheça o Rehab Friend",
    description: "Seu assistente clínico com IA. Selecione um paciente e ele analisa o quadro completo antes de responder.",
    target: '[data-onboarding="rehab-friend-btn"]',
    position: "top",
    action: "Abrir Rehab Friend",
  },
  {
    id: "scribe",
    title: "🎙️ Experimente o Scribe Clínico",
    description: "Após uma sessão, clique aqui para ditar a evolução. Em 1 minuto todos os campos são preenchidos automaticamente.",
    target: '[data-onboarding="scribe-btn"]',
    position: "top",
    action: "Testar Scribe",
  },
];

const COMPLETED_KEY = "product-tour-completed";
const SKIPPED_KEY = "product-tour-skipped";

export function useProductTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(COMPLETED_KEY);
    const skipped = localStorage.getItem(SKIPPED_KEY);
    if (!done && !skipped) {
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const next = () => {
    if (currentStep < PRODUCT_TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      complete();
    }
  };

  const previous = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const skip = () => {
    localStorage.setItem(SKIPPED_KEY, "true");
    setIsActive(false);
  };

  const complete = () => {
    localStorage.setItem(COMPLETED_KEY, "true");
    setIsActive(false);
    setCompleted(true);
  };

  const restart = () => {
    localStorage.removeItem(COMPLETED_KEY);
    localStorage.removeItem(SKIPPED_KEY);
    setCurrentStep(0);
    setCompleted(false);
    setIsActive(true);
  };

  return {
    isActive,
    currentStep,
    currentStepData: PRODUCT_TOUR_STEPS[currentStep],
    totalSteps: PRODUCT_TOUR_STEPS.length,
    completed,
    next,
    previous,
    skip,
    complete,
    restart,
    steps: PRODUCT_TOUR_STEPS,
  };
}
