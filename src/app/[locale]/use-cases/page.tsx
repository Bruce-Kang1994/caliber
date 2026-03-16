"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

const SCENARIOS = [
  {
    num: 1,
    color: "indigo",
    bgClass: "bg-indigo-50 border-indigo-100",
    iconBg: "bg-indigo-100",
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
  },
  {
    num: 2,
    color: "violet",
    bgClass: "bg-violet-50 border-violet-100",
    iconBg: "bg-violet-100",
    icon: (
      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    num: 3,
    color: "cyan",
    bgClass: "bg-cyan-50 border-cyan-100",
    iconBg: "bg-cyan-100",
    icon: (
      <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    num: 4,
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    num: 5,
    color: "amber",
    bgClass: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
    icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
];

export default function UseCasesPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth />

      {/* ═══ Hero ═══ */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]">
          {t("useCases.heroTitle")}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          {t("useCases.heroSubtitle")}
        </p>
      </section>

      {/* ═══ Scenario Cards ═══ */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-5">
          {SCENARIOS.map((s) => (
            <div
              key={s.num}
              className={`rounded-2xl border p-7 md:p-8 ${s.bgClass} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900">
                    {t(`useCases.scenario${s.num}Title`)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {t(`useCases.scenario${s.num}Role`)}
                  </p>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    {/* Pain */}
                    <div className="bg-white/60 rounded-xl p-4 border border-white/80">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pain</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t(`useCases.scenario${s.num}Pain`)}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-white/80 rounded-xl p-4 border border-white/80">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Solution</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t(`useCases.scenario${s.num}Solution`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Bottom CTA ═══ */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            {t("useCases.ctaTitle")}
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            {t("useCases.ctaSubtitle")}
          </p>
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
