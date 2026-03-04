"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { useInView } from "@/hooks/useInView";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  FileText,
  ArrowRight,
} from "lucide-react";

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Static sample data for the report preview card
const SAMPLE_RADAR = [
  { label: "Product", score: 4.2 },
  { label: "Business", score: 3.5 },
  { label: "AI", score: 4.0 },
  { label: "Soft Skills", score: 3.8 },
  { label: "Global", score: 3.2 },
];

function MiniRadar() {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 42;
  const levels = 5;

  const points = SAMPLE_RADAR.map((d, i) => {
    const angle = (Math.PI * 2 * i) / SAMPLE_RADAR.length - Math.PI / 2;
    const ratio = d.score / 5;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {Array.from({ length: levels }, (_, l) => {
        const lr = (r * (l + 1)) / levels;
        const gridPoints = SAMPLE_RADAR.map((_, i) => {
          const angle = (Math.PI * 2 * i) / SAMPLE_RADAR.length - Math.PI / 2;
          return `${cx + lr * Math.cos(angle)},${cy + lr * Math.sin(angle)}`;
        }).join(" ");
        return <polygon key={l} points={gridPoints} fill="none" stroke="#e2e8f0" strokeWidth={0.5} />;
      })}
      {/* Data */}
      <polygon points={polygon} fill="#2563eb" fillOpacity={0.15} stroke="#2563eb" strokeWidth={1.5} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2} fill="#2563eb" />
      ))}
    </svg>
  );
}

function MiniBarChart() {
  const bars = [
    { label: "Req", value: 4.2, color: "#2563eb" },
    { label: "Design", value: 3.8, color: "#2563eb" },
    { label: "Arch", value: 3.5, color: "#2563eb" },
    { label: "0→1", value: 4.5, color: "#10b981" },
    { label: "Data", value: 3.2, color: "#f59e0b" },
  ];
  return (
    <div className="flex items-end gap-1.5 h-16 justify-center">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-5 rounded-t-sm transition-all"
            style={{ height: `${(b.value / 5) * 48}px`, backgroundColor: b.color }}
          />
          <span className="text-[9px] text-slate-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const t = useTranslations();

  const stats = [
    { number: t("landing.stat1Number"), label: t("landing.stat1Label") },
    { number: t("landing.stat2Number"), label: t("landing.stat2Label") },
    { number: t("landing.stat3Number"), label: t("landing.stat3Label") },
    { number: t("landing.stat4Number"), label: t("landing.stat4Label") },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader showNav showAuth showCta />

      {/* Hero Section — light gradient (deployed version) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            {t("landing.heroTrust")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 whitespace-pre-line leading-[1.15] animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both [animation-delay:150ms]">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both [animation-delay:300ms]">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both [animation-delay:450ms]">
            <Link href="/assess">
              <Button size="lg" className="text-base px-8 h-12 rounded-xl shadow-lg shadow-blue-600/20">
                {t("common.getStarted")}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl">
                {t("common.pricing")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Report Preview Card — below Hero (deployed version) */}
      <Reveal>
        <section className="max-w-4xl mx-auto px-6 -mt-4 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <CardContent className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Score */}
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Caliber Score</p>
                  <div className="text-5xl font-bold">82</div>
                  <div className="text-slate-400 text-sm">/100</div>
                  <Badge className="mt-2 bg-blue-500/20 text-blue-300 border-0 text-xs">Advanced</Badge>
                </div>
                {/* Mini Radar */}
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Capability Radar</p>
                  <MiniRadar />
                </div>
                {/* Archetype */}
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">PM Archetype</p>
                  <div className="text-lg font-bold text-white">The Strategist</div>
                  <MiniBarChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* Stats Bar (deployed version) */}
      <Reveal>
        <section className="border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════════ FEATURES — Bento Grid (from V3) ════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-5 gap-4">
          {/* Feature 1 — large (spans 3 cols) */}
          <Reveal className="md:col-span-3">
            <div className="group relative h-full bg-slate-50 rounded-2xl p-7 border border-slate-100 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-200 cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                    {t("landing.feature1Title")}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {t("landing.feature1Desc")}
                  </p>
                  {/* Weight sliders preview */}
                  <div className="space-y-2.5">
                    {[
                      { name: "Product Sense", pct: 35, w: "70%" },
                      { name: "Business Acumen", pct: 25, w: "50%" },
                      { name: "AI Expertise", pct: 20, w: "40%" },
                      { name: "Soft Skills", pct: 12, w: "24%" },
                      { name: "Global Readiness", pct: 8, w: "16%" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3 text-xs">
                        <span className="w-28 text-slate-600 shrink-0 truncate">{item.name}</span>
                        <div className="h-1.5 rounded-full bg-slate-200 flex-1">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-700"
                            style={{ width: item.w }}
                          />
                        </div>
                        <span className="w-8 text-right text-slate-400 tabular-nums">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Feature 2 — small (spans 2 cols) */}
          <Reveal delay={100} className="md:col-span-2">
            <div className="group relative h-full bg-slate-50 rounded-2xl p-7 border border-slate-100 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-200 cursor-default">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {t("landing.feature2Title")}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {t("landing.feature2Desc")}
              </p>
              {/* Evidence preview */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-lg leading-none">&ldquo;</span>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    Led migration to microservices, reducing deploy time by 60%...
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 h-4 border border-emerald-200/60">
                    4.5/5
                  </Badge>
                  <span className="text-[10px] text-slate-400">System Architecture</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Feature 3 — small (spans 2 cols) */}
          <Reveal delay={150} className="md:col-span-2">
            <div className="group relative h-full bg-slate-50 rounded-2xl p-7 border border-slate-100 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-200 cursor-default">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {t("landing.feature3Title")}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {t("landing.feature3Desc")}
              </p>
              {/* Upgrade path preview */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-100">
                <div className="flex items-center gap-2.5 text-xs">
                  <Badge className="bg-amber-50 text-amber-700 text-[10px] px-1.5 h-4 border border-amber-200/60">
                    2.5
                  </Badge>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-emerald-200" />
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 h-4 border border-emerald-200/60">
                    4.0
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Your data skills can accelerate growth experiments...
                </p>
              </div>
            </div>
          </Reveal>

          {/* Feature 4 — large (spans 3 cols) — How report looks */}
          <Reveal delay={200} className="md:col-span-3">
            <div className="group relative h-full bg-gradient-to-br from-indigo-50/80 to-slate-50 rounded-2xl p-7 border border-indigo-100/60 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-50 hover:border-indigo-200/60 cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                    Complete Caliber Report
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    15-dimension radar chart, top strengths, hidden gems, growth areas, and your personalized upgrade plan — all in one actionable report.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Radar Chart", "Strengths", "Hidden Gems", "Growth Plan", "PDF Export"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200/80 text-slate-600"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social Proof Bar (deployed version) */}
      <Reveal>
        <section className="border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                {t("landing.proofFramework")}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                {t("landing.proofEvidence")}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                {t("landing.proofUpgrade")}
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* How It Works (deployed version) */}
      <Reveal>
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-16">
            {t("landing.howItWorks")}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative text-center">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mx-auto mb-5">
                  {step}
                </div>
                {step < 3 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-slate-200" />
                )}
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t(`landing.step${step}Title`)}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t(`landing.step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ════════════ FINAL CTA — clean white (from V3) ════════════ */}
      <Reveal>
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              {t("landing.ctaSubtitle")}
            </p>
            <Link href="/assess">
              <Button
                size="lg"
                className="cursor-pointer text-base px-10 h-13 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                {t("common.getStarted")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              {t("landing.heroTrust")}
            </p>
          </div>
        </section>
      </Reveal>

      <AppFooter />
    </div>
  );
}
