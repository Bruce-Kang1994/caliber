"use client";

import { useTranslations } from "next-intl";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const t = useTranslations();

  // Compact mode for header: just show text
  return (
    <span className="text-sm text-slate-500">
      {t("common.step", { current, total })}
    </span>
  );
}

interface StepIndicatorBarProps {
  current: number;
  total?: number;
}

const STEP_KEYS = ["steps.role", "steps.input", "steps.analyze", "steps.report"] as const;

export function StepIndicatorBar({ current, total = 4 }: StepIndicatorBarProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < current;
        const isCurrent = step === current;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs ${
                  isCurrent ? "text-blue-600 font-medium" : "text-slate-400"
                }`}
              >
                {t(STEP_KEYS[i])}
              </span>
            </div>
            {/* Connector line */}
            {step < total && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-18px] ${
                  isCompleted ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
