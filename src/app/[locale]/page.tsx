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
  Target,
  FileText,
  Upload,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/* ───────── Scroll reveal ───────── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView(0.08);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ───────── Radar chart (hero card) ───────── */
const RADAR_DATA = [
  { label: "Product", score: 4.2 },
  { label: "Business", score: 3.5 },
  { label: "AI", score: 4.0 },
  { label: "Soft", score: 3.8 },
  { label: "Global", score: 3.2 },
];

function MiniRadar({ size = 130 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const pts = RADAR_DATA.map((d, i) => {
    const a = (Math.PI * 2 * i) / RADAR_DATA.length - Math.PI / 2;
    const ratio = d.score / 5;
    return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a) };
  });

  return (
    <svg width={size} height={size} className="mx-auto" role="img" aria-label="Capability radar chart">
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map((l) => {
        const lr = (r * l) / 5;
        const g = RADAR_DATA.map((_, i) => {
          const a = (Math.PI * 2 * i) / RADAR_DATA.length - Math.PI / 2;
          return `${cx + lr * Math.cos(a)},${cy + lr * Math.sin(a)}`;
        }).join(" ");
        return <polygon key={l} points={g} fill="none" stroke="#e2e8f0" strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="#6366f1"
        fillOpacity={0.12}
        stroke="#6366f1"
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#6366f1" />
      ))}
    </svg>
  );
}

function MiniBarChart() {
  const bars = [
    { label: "Req", v: 4.2 },
    { label: "Design", v: 3.8 },
    { label: "Arch", v: 3.5 },
    { label: "0→1", v: 4.5 },
    { label: "Data", v: 3.2 },
  ];
  return (
    <div className="flex items-end gap-1.5 h-14 justify-center">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-[18px] rounded-t transition-all"
            style={{
              height: `${(b.v / 5) * 44}px`,
              background: b.v >= 4.5 ? "#10b981" : b.v >= 3.5 ? "#6366f1" : "#94a3b8",
            }}
          />
          <span className="text-[9px] text-slate-400 leading-none">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ───────── Main page ───────── */
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

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden bg-[#131228]">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[-20%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.10)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.10] text-[13px] text-indigo-300 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  {t("landing.heroTrust")}
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="text-[2.5rem] md:text-5xl lg:text-[3.25rem] font-bold tracking-[-0.04em] text-white leading-[1.12] whitespace-pre-line">
                  {t("landing.heroTitle")}
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-6 text-lg text-slate-400 max-w-lg leading-relaxed">
                  {t("landing.heroSubtitle")}
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                  <Link href="/assess">
                    <Button
                      size="lg"
                      className="cursor-pointer text-[15px] px-7 h-12 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131228]"
                    >
                      {t("common.getStarted")}
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="cursor-pointer text-[15px] px-7 h-12 rounded-xl border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      {t("common.pricing")}
                    </Button>
                  </Link>
                </div>
              </Reveal>

              {/* Inline social proof */}
              <Reveal delay={320}>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-slate-500">
                  {[
                    t("landing.proofFramework"),
                    t("landing.proofEvidence"),
                    t("landing.proofUpgrade"),
                  ].map((txt) => (
                    <span key={txt} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {txt}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — Product preview card */}
            <Reveal delay={200} className="hidden lg:block">
              <div className="relative">
                {/* Floating badge — top right */}
                <div className="absolute -top-3 -right-2 z-10 bg-white rounded-xl px-3.5 py-2 shadow-lg shadow-black/10 border border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-800">AI-Powered</span>
                </div>

                <Card className="border-0 shadow-2xl shadow-black/30 bg-[#1a1940] text-white overflow-hidden ring-1 ring-white/[0.08]">
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                  <CardContent className="py-7 px-6">
                    <div className="grid grid-cols-3 gap-6 items-center">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1.5">
                          Caliber Score
                        </p>
                        <div className="text-4xl font-bold tracking-tight text-white">82</div>
                        <div className="text-slate-500 text-xs mt-0.5">/100</div>
                        <Badge className="mt-2 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] px-2">
                          Advanced
                        </Badge>
                      </div>
                      {/* Radar */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">
                          Capability Radar
                        </p>
                        <MiniRadar size={110} />
                      </div>
                      {/* Archetype */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1.5">
                          PM Archetype
                        </p>
                        <div className="text-sm font-bold text-white mb-1">The Strategist</div>
                        <MiniBarChart />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-3 -left-2 z-10 bg-white rounded-xl px-3.5 py-2 shadow-lg shadow-black/10 border border-slate-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-[10px] text-slate-500">Dimensions</div>
                    <div className="text-xs font-bold text-slate-800">15 analyzed</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mobile-only report card (shown below hero on mobile) */}
      <div className="lg:hidden px-6 -mt-4 mb-8">
        <Reveal>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
            <CardContent className="py-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Score</p>
                  <div className="text-3xl font-bold">82</div>
                  <div className="text-slate-400 text-xs">/100</div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Radar</p>
                  <MiniRadar size={90} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                  <div className="text-xs font-bold">Strategist</div>
                  <MiniBarChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* ════════════════════ STATS ════════════════════ */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    {stat.number}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500 leading-snug">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FEATURES — Bento Grid ════════════════════ */}
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

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 tracking-tight mb-4">
              {t("landing.howItWorks")}
            </h2>
            <p className="text-center text-slate-500 mb-16 max-w-md mx-auto">
              From input to full report in under 5 minutes
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200" />

            {[
              { step: 1, icon: Target, color: "bg-indigo-500" },
              { step: 2, icon: Upload, color: "bg-indigo-500" },
              { step: 3, icon: FileText, color: "bg-emerald-500" },
            ].map(({ step, icon: Icon, color }, idx) => (
              <Reveal key={step} delay={idx * 120}>
                <div className="relative text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/10 relative z-10 transition-transform duration-200 hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">
                    Step {step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t(`landing.step${step}Title`)}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                    {t(`landing.step${step}Desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FINAL CTA ════════════════════ */}
      <section className="py-24 px-6">
        <Reveal>
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
        </Reveal>
      </section>

      <AppFooter />
    </div>
  );
}
