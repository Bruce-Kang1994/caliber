"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function OnboardingPage() {
  const t = useTranslations();
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: t("onboarding.screen1Title"),
      description: t("onboarding.screen1Desc"),
      visual: (
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "B2B PM", color: "bg-blue-100 text-blue-700" },
            { label: "AI PM", color: "bg-purple-100 text-purple-700" },
            { label: "Growth PM", color: "bg-green-100 text-green-700" },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg py-3 px-4 text-center text-sm font-medium ${item.color}`}>
              {item.label}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: (
        <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      title: t("onboarding.screen2Title"),
      description: t("onboarding.screen2Desc"),
      visual: (
        <div className="mt-6 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">resume.pdf</p>
        </div>
      ),
    },
    {
      icon: (
        <svg className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
      title: t("onboarding.screen3Title"),
      description: t("onboarding.screen3Desc"),
      visual: (
        <div className="mt-6 space-y-3">
          {[
            { label: t("onboarding.reportItem1"), score: "4.0", color: "bg-green-100 text-green-700" },
            { label: t("onboarding.reportItem2"), score: "2.0", color: "bg-amber-100 text-amber-700" },
            { label: t("onboarding.reportItem3"), score: "—", color: "bg-blue-100 text-blue-700" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className={`text-sm font-semibold rounded-full px-3 py-1 ${item.color}`}>{item.score}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const current = screens[step];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600">
          {t("common.appName")}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        <Card className="overflow-hidden">
          <CardContent className="pt-10 pb-8 px-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">{current.icon}</div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">
              {current.title}
            </h2>
            <p className="text-center text-slate-600 leading-relaxed">
              {current.description}
            </p>

            {/* Visual */}
            {current.visual}

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {screens.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === step ? "bg-blue-600 w-6" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  {t("common.back")}
                </Button>
              )}
              {step < screens.length - 1 ? (
                <Button className="flex-1" onClick={() => setStep(step + 1)}>
                  {t("common.next")}
                </Button>
              ) : (
                <Link href="/assess" className="flex-1">
                  <Button className="w-full">
                    {t("onboarding.startButton")}
                  </Button>
                </Link>
              )}
            </div>

            {/* Skip */}
            {step < screens.length - 1 && (
              <div className="text-center mt-4">
                <Link
                  href="/assess"
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  {t("onboarding.skip")}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time estimate */}
        <p className="text-center text-sm text-slate-400 mt-6">
          {t("onboarding.timeEstimate")}
        </p>
      </main>
    </div>
  );
}
