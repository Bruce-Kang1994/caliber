"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

const MILESTONES = [1, 2, 3, 4] as const;

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth />

      {/* ═══ Hero ═══ */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]">
          {t("about.heroTitle")}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          {t("about.heroSubtitle")}
        </p>
      </section>

      {/* ═══ Origin Story ═══ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("about.storyTitle")}
          </h2>
          <div className="mt-10 space-y-5 text-base text-slate-600 leading-relaxed">
            <p>{t("about.storyP1")}</p>
            <p>{t("about.storyP2")}</p>
            <p>{t("about.storyP3")}</p>
          </div>
        </div>
      </section>

      {/* ═══ Milestones ═══ */}
      <section className="bg-[#f5f5f7]">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("about.milestonesTitle")}
          </h2>

          <div className="mt-12 relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-2 bottom-2 w-px bg-slate-200 hidden md:block" />

            <div className="space-y-8">
              {MILESTONES.map((num, i) => (
                <div key={num} className="flex gap-6 items-start">
                  {/* Timeline dot */}
                  <div className="relative shrink-0 hidden md:flex">
                    <div
                      className={`w-[47px] h-[47px] rounded-full flex items-center justify-center ${
                        i === MILESTONES.length - 1
                          ? "bg-slate-100 border-2 border-dashed border-slate-300"
                          : "bg-indigo-100 border-2 border-indigo-200"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          i === MILESTONES.length - 1 ? "text-slate-400" : "text-indigo-600"
                        }`}
                      >
                        {i === MILESTONES.length - 1 ? "..." : `0${num}`}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-sm transition-shadow">
                    <span className="text-xs font-medium text-slate-400">
                      {t(`about.milestone${num}Date`)}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {t(`about.milestone${num}Title`)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      {t(`about.milestone${num}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Contact ═══ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {t("about.contactTitle")}
          </h2>
          <p className="mt-4 text-base text-slate-500">
            {t("about.contactContent")}
          </p>
          <a
            href={`mailto:${t("about.contactEmail")}`}
            className="mt-6 inline-block text-lg font-medium text-primary hover:underline"
          >
            {t("about.contactEmail")}
          </a>
          <div className="mt-8">
            <Link href="/assess">
              <Button size="lg" className="rounded-full px-10 h-13 text-base">
                {t("common.getStarted")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
