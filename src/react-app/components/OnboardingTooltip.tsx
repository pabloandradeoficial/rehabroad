import { useEffect, useState, useCallback } from "react";
import { ProductTourStep } from "@/react-app/hooks/useProductTour";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface OnboardingTooltipProps {
  step: ProductTourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

const PADDING = 8;

export function OnboardingTooltip({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
}: OnboardingTooltipProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const measureTarget = useCallback(() => {
    const el = document.querySelector(step.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    });
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [step.target]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    measureTarget();
    const timer = setTimeout(measureTarget, 300);
    return () => clearTimeout(timer);
  }, [measureTarget]);

  const tooltipContent = (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-5 w-72 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
          {step.title}
        </h3>
        <button
          onClick={onSkip}
          className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        {step.description}
      </p>

      {/* Progress dots */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-4 h-2 bg-teal-500"
                  : i < currentStep
                  ? "w-2 h-2 bg-teal-300"
                  : "w-2 h-2 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {currentStep > 0 && (
            <button
              onClick={onPrevious}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            {currentStep === totalSteps - 1 ? "Concluir" : step.action ?? "Próximo"}
            {currentStep < totalSteps - 1 && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Skip link */}
      <div className="mt-3 text-center">
        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
        >
          Pular tour
        </button>
      </div>
    </div>
  );

  // Mobile: fixed bottom bar
  if (isMobile) {
    return (
      <div
        style={{ pointerEvents: "none" }}
        className="fixed inset-0 z-[9999]"
      >
        {/* Dark overlay */}
        <div
          style={{ pointerEvents: "all" }}
          className="absolute inset-0 bg-black/50"
          onClick={onSkip}
        />
        {/* Bottom sheet */}
        <div
          style={{ pointerEvents: "all" }}
          className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-gray-900 p-5 shadow-2xl border-t border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
              {step.title}
            </h3>
            <button onClick={onSkip} className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {step.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-4 h-2 bg-teal-500"
                      : i < currentStep
                      ? "w-2 h-2 bg-teal-300"
                      : "w-2 h-2 bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {currentStep > 0 && (
                <button onClick={onPrevious} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {currentStep === totalSteps - 1 ? "Concluir" : step.action ?? "Próximo"}
                {currentStep < totalSteps - 1 && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="mt-3 text-center">
            <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors">
              Pular tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: spotlight overlay with positioned tooltip
  if (!targetRect) {
    return (
      <div
        style={{ pointerEvents: "none" }}
        className="fixed inset-0 z-[9999]"
      >
        <div
          style={{ pointerEvents: "all" }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          onClick={onSkip}
        >
          <div style={{ pointerEvents: "all" }} onClick={(e) => e.stopPropagation()}>
            {tooltipContent}
          </div>
        </div>
      </div>
    );
  }

  const spotTop = targetRect.top - PADDING;
  const spotLeft = targetRect.left - PADDING;
  const spotWidth = targetRect.width + PADDING * 2;
  const spotHeight = targetRect.height + PADDING * 2;
  const spotBottom = spotTop + spotHeight;
  const spotRight = spotLeft + spotWidth;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Calculate tooltip position
  const TOOLTIP_W = 288; // w-72
  const TOOLTIP_H = 220; // approx
  let tooltipStyle: React.CSSProperties = {};

  switch (step.position) {
    case "bottom":
      tooltipStyle = {
        position: "fixed",
        top: spotBottom + 12,
        left: Math.min(Math.max(spotLeft, 12), vw - TOOLTIP_W - 12),
      };
      break;
    case "top":
      tooltipStyle = {
        position: "fixed",
        top: Math.max(spotTop - TOOLTIP_H - 12, 12),
        left: Math.min(Math.max(spotLeft, 12), vw - TOOLTIP_W - 12),
      };
      break;
    case "right":
      tooltipStyle = {
        position: "fixed",
        top: Math.min(Math.max(spotTop, 12), vh - TOOLTIP_H - 12),
        left: Math.min(spotRight + 12, vw - TOOLTIP_W - 12),
      };
      break;
    case "left":
      tooltipStyle = {
        position: "fixed",
        top: Math.min(Math.max(spotTop, 12), vh - TOOLTIP_H - 12),
        left: Math.max(spotLeft - TOOLTIP_W - 12, 12),
      };
      break;
  }

  return (
    <div
      style={{ pointerEvents: "none" }}
      className="fixed inset-0 z-[9999]"
    >
      {/* 4-rectangle overlay */}
      {/* Top */}
      <div
        style={{ pointerEvents: "all", top: 0, left: 0, right: 0, height: spotTop, position: "fixed", backgroundColor: "rgba(0,0,0,0.55)" }}
        onClick={onSkip}
      />
      {/* Bottom */}
      <div
        style={{ pointerEvents: "all", top: spotBottom, left: 0, right: 0, bottom: 0, position: "fixed", backgroundColor: "rgba(0,0,0,0.55)" }}
        onClick={onSkip}
      />
      {/* Left */}
      <div
        style={{ pointerEvents: "all", top: spotTop, left: 0, width: spotLeft, height: spotHeight, position: "fixed", backgroundColor: "rgba(0,0,0,0.55)" }}
        onClick={onSkip}
      />
      {/* Right */}
      <div
        style={{ pointerEvents: "all", top: spotTop, left: spotRight, right: 0, height: spotHeight, position: "fixed", backgroundColor: "rgba(0,0,0,0.55)" }}
        onClick={onSkip}
      />

      {/* Highlight border around target */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: spotTop,
          left: spotLeft,
          width: spotWidth,
          height: spotHeight,
          borderRadius: 8,
          boxShadow: "0 0 0 2px #2dd4bf, 0 0 20px rgba(45,212,191,0.4)",
        }}
      />

      {/* Tooltip */}
      <div style={{ ...tooltipStyle, pointerEvents: "all" }}>
        {tooltipContent}
      </div>
    </div>
  );
}
