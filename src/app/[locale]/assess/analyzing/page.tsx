"use client";

import { useEffect, useState, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Progress } from "@/components/ui/progress";
import type { PMRole } from "@/lib/types";

function AnalyzingContent() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") || "ai-pm") as PMRole;

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const steps = [
    t("analyzing.step1"),
    t("analyzing.step2"),
    t("analyzing.step3"),
    t("analyzing.step4"),
  ];

  useEffect(() => {
    const input = sessionStorage.getItem("assessmentInput");
    if (!input) {
      router.push("/assess");
      return;
    }

    const parsed = JSON.parse(input);

    // Animate progress: accelerate at first, then slow down approaching 90%
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      // Logarithmic curve: fast start, slows as it approaches 90
      const target = Math.min(90, 20 * Math.log(elapsed + 1));
      setProgress((prev) => Math.max(prev, Math.round(target)));
      // Sync steps with progress
      if (elapsed > 2) setCurrentStep((s) => Math.max(s, 1));
      if (elapsed > 6) setCurrentStep((s) => Math.max(s, 2));
      if (elapsed > 12) setCurrentStep((s) => Math.max(s, 3));
    }, 300);

    // Call AI assessment API
    async function analyze() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roleType: parsed.roleType,
            experiences: parsed.experiences,
            inputMethod: parsed.inputMethod || "manual",
            locale,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Analysis failed");
        }

        const data = await res.json();

        // Store result and navigate
        setProgress(100);
        setCurrentStep(steps.length - 1);
        const resultData = { ...data.result, _locale: locale };
        if (data.assessmentId) {
          resultData._assessmentId = data.assessmentId;
        }
        if (data.shareToken) {
          resultData._shareToken = data.shareToken;
        }
        sessionStorage.setItem("assessmentResult", JSON.stringify(resultData));

        setTimeout(() => {
          router.push(`/assess/report?role=${role}`);
        }, 500);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Analysis failed"
        );
      }
    }

    analyze();

    return () => {
      clearInterval(progressInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {t("common.error")}
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        {/* Animated icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {t("analyzing.title")}
        </h1>
        <p className="text-slate-600 mb-8">{t("analyzing.subtitle")}</p>

        {/* Progress bar */}
        <Progress value={progress} className="h-2 mb-8" />

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 text-sm transition-all ${
                idx <= currentStep
                  ? "text-slate-900"
                  : "text-slate-400"
              }`}
            >
              {idx < currentStep ? (
                <svg
                  className="w-5 h-5 text-blue-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ) : idx === currentStep ? (
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                </div>
              ) : (
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense>
      <AnalyzingContent />
    </Suspense>
  );
}
