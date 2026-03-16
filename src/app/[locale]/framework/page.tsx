"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { DIMENSIONS, DIMENSION_CATEGORIES, ROLE_WEIGHTS } from "@/lib/constants";
import type { DimensionCategory } from "@/lib/constants";
import type { DimensionKey, PMRole } from "@/lib/types";

const CATEGORY_META: Record<
  DimensionCategory,
  { color: string; bgClass: string; dotClass: string; textClass: string }
> = {
  "product-execution": {
    color: "#6366f1",
    bgClass: "bg-indigo-50 border-indigo-100",
    dotClass: "bg-indigo-400",
    textClass: "text-indigo-600",
  },
  "customer-insight": {
    color: "#06b6d4",
    bgClass: "bg-cyan-50 border-cyan-100",
    dotClass: "bg-cyan-400",
    textClass: "text-cyan-600",
  },
  "product-strategy": {
    color: "#8b5cf6",
    bgClass: "bg-violet-50 border-violet-100",
    dotClass: "bg-violet-400",
    textClass: "text-violet-600",
  },
  "influencing-people": {
    color: "#f59e0b",
    bgClass: "bg-amber-50 border-amber-100",
    dotClass: "bg-amber-400",
    textClass: "text-amber-600",
  },
  "ai-emerging": {
    color: "#10b981",
    bgClass: "bg-emerald-50 border-emerald-100",
    dotClass: "bg-emerald-400",
    textClass: "text-emerald-600",
  },
};

const ARCHETYPE_META = [
  { key: "craftsperson", color: "indigo", icon: "🔧" },
  { key: "strategist", color: "violet", icon: "🧭" },
  { key: "growth-hacker", color: "cyan", icon: "📈" },
  { key: "visionary", color: "emerald", icon: "🔮" },
  { key: "operator", color: "amber", icon: "⚙️" },
];

const ROLE_LABELS: Record<PMRole, string> = {
  "b2b-pm": "B2B",
  "c2c-pm": "C2C",
  "ai-pm": "AI",
  "growth-pm": "Growth",
  "data-pm": "Data",
};

const SOURCE_CARDS = [
  { titleKey: "sourceReforgeTitle", descKey: "sourceReforgeDesc", accent: "indigo" },
  { titleKey: "sourceSvpgTitle", descKey: "sourceSvpgDesc", accent: "violet" },
  { titleKey: "sourceGoogleTitle", descKey: "sourceGoogleDesc", accent: "cyan" },
  { titleKey: "sourceMetaTitle", descKey: "sourceMetaDesc", accent: "emerald" },
] as const;

function getWeightColor(w: number): string {
  if (w >= 5) return "bg-indigo-600 text-white";
  if (w >= 4) return "bg-indigo-400 text-white";
  if (w >= 3) return "bg-indigo-200 text-indigo-800";
  if (w >= 2) return "bg-indigo-100 text-indigo-600";
  return "bg-slate-100 text-slate-400";
}

export default function FrameworkPage() {
  const t = useTranslations();
  const categories = Object.entries(DIMENSION_CATEGORIES) as [DimensionCategory, DimensionKey[]][];
  const roles: PMRole[] = ["b2b-pm", "c2c-pm", "ai-pm", "growth-pm", "data-pm"];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth />

      {/* ═══ Hero ═══ */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]">
          {t("framework.heroTitle")}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          {t("framework.heroSubtitle")}
        </p>
        <div className="mt-8">
          <Link href="/assess">
            <Button size="lg" className="rounded-full px-8">
              {t("common.getStarted")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ Framework Sources ═══ */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("framework.sourceTitle")}
          </h2>
          <p className="mt-3 text-base text-slate-500 text-center max-w-xl mx-auto">
            {t("framework.sourceSubtitle")}
          </p>
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {SOURCE_CARDS.map((card) => (
              <div
                key={card.titleKey}
                className="rounded-2xl border border-slate-200/60 bg-white p-7 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {t(`framework.${card.titleKey}`)}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {t(`framework.${card.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5 Categories + 16 Dimensions ═══ */}
      <section className="bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("framework.categoriesTitle")}
          </h2>
          <p className="mt-3 text-base text-slate-500 text-center max-w-xl mx-auto">
            {t("framework.categoriesSubtitle")}
          </p>

          <div className="mt-12 space-y-6">
            {categories.map(([catKey, dimKeys]) => {
              const meta = CATEGORY_META[catKey];
              return (
                <div key={catKey} className={`rounded-2xl border p-6 ${meta.bgClass}`}>
                  <h3 className={`text-lg font-bold ${meta.textClass} mb-4`}>
                    {t(`dimensionCategories.${catKey}`)}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {dimKeys.map((dimKey) => {
                      const dim = DIMENSIONS.find((d) => d.key === dimKey);
                      return (
                        <div
                          key={dimKey}
                          className="bg-white/80 rounded-xl p-4 border border-white/60"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`w-2 h-2 rounded-full ${meta.dotClass} mt-1.5 shrink-0`} />
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900">
                                {t(`dimensions.${dimKey}`)}
                              </h4>
                              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                {t(`framework.dimensionDescriptions.${dimKey}`)}
                              </p>
                              {dim?.source && (
                                <p className="mt-1.5 text-[10px] text-slate-400">
                                  {dim.source}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 5 Archetypes ═══ */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("framework.archetypesTitle")}
          </h2>
          <p className="mt-3 text-base text-slate-500 text-center max-w-xl mx-auto">
            {t("framework.archetypesSubtitle")}
          </p>

          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {ARCHETYPE_META.map((arch) => (
              <div
                key={arch.key}
                className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{arch.icon}</div>
                <h3 className="text-base font-bold text-slate-900">
                  {t(`report.archetype_${arch.key}`)}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {t(`report.archetype_${arch.key}_desc`)}
                </p>
                <p className="mt-3 text-[11px] text-slate-400">
                  {t(`framework.archetypeStrengths.${arch.key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Dynamic Weight Matrix ═══ */}
      <section className="bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center">
            {t("framework.weightMatrixTitle")}
          </h2>
          <p className="mt-3 text-base text-slate-500 text-center max-w-xl mx-auto">
            {t("framework.weightMatrixSubtitle")}
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-[#f5f5f7] min-w-[180px]">
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center min-w-[70px]"
                    >
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(([catKey, dimKeys]) => (
                  <>
                    <tr key={`cat-${catKey}`}>
                      <td
                        colSpan={roles.length + 1}
                        className={`px-3 pt-5 pb-2 text-xs font-bold uppercase tracking-widest ${CATEGORY_META[catKey].textClass}`}
                      >
                        {t(`dimensionCategories.${catKey}`)}
                      </td>
                    </tr>
                    {dimKeys.map((dimKey) => (
                      <tr key={dimKey} className="border-b border-slate-100">
                        <td className="p-3 text-slate-700 font-medium sticky left-0 bg-[#f5f5f7]">
                          {t(`dimensions.${dimKey}`)}
                        </td>
                        {roles.map((role) => {
                          const w = ROLE_WEIGHTS[role][dimKey];
                          return (
                            <td key={role} className="p-2 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${getWeightColor(w)}`}
                              >
                                {w}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ Bottom CTA ═══ */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            {t("framework.ctaTitle")}
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            {t("framework.ctaSubtitle")}
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
