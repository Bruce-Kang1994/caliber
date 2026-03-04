"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { useInView } from "@/hooks/useInView";
import { Badge } from "@/components/ui/badge";

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
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

      {/* Hero Section */}
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

      {/* Sample Report Preview Card — below Hero */}
      <FadeInSection>
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
      </FadeInSection>

      {/* Stats Bar */}
      <FadeInSection>
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
      </FadeInSection>

      {/* Features */}
      <FadeInSection>
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-xl p-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t("landing.feature1Title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("landing.feature1Desc")}
              </p>
              {/* Mini preview: weight sliders */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50/50 border border-blue-100 transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="space-y-1.5">
                  {["Product 35%", "Business 25%", "AI 20%"].map((w) => (
                    <div key={w} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="h-1.5 rounded-full bg-blue-200 flex-1">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: w.includes("35") ? "70%" : w.includes("25") ? "50%" : "40%" }}
                        />
                      </div>
                      <span className="w-20 text-right">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-xl p-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t("landing.feature2Title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("landing.feature2Desc")}
              </p>
              {/* Mini preview: evidence quote */}
              <div className="mt-4 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 text-sm mt-0.5">&ldquo;</span>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    Led migration to microservices, reducing deploy time by 60%...
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0 h-4">4.5/5</Badge>
                  <span className="text-[10px] text-slate-400">System Architecture</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-xl p-1">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t("landing.feature3Title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("landing.feature3Desc")}
              </p>
              {/* Mini preview: upgrade path */}
              <div className="mt-4 p-3 rounded-lg bg-violet-50/50 border border-violet-100 transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center gap-2 text-xs">
                  <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4">2.5</Badge>
                  <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0 h-4">4.0</Badge>
                  <span className="text-slate-400">Growth</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  Your data skills can accelerate growth experiments...
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Report Preview */}
      <FadeInSection>
        <section className="bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-4">
              {t("landing.reportPreviewTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {/* Score Preview */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                    <span className="text-white text-xl font-bold">82</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t("landing.reportPreviewScore")}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("landing.reportPreviewScoreDesc")}
                  </p>
                </CardContent>
              </Card>

              {/* Radar Preview */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t("landing.reportPreviewRadar")}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("landing.reportPreviewRadarDesc")}
                  </p>
                </CardContent>
              </Card>

              {/* Insights Preview */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t("landing.reportPreviewInsights")}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t("landing.reportPreviewInsightsDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* How It Works */}
      <FadeInSection>
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
      </FadeInSection>

      {/* Why Caliber */}
      <FadeInSection>
        <section className="bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
              {t("landing.whyCaliberTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="text-center">
                  <div className={`w-12 h-12 rounded-2xl ${n === 1 ? "bg-blue-100" : n === 2 ? "bg-emerald-100" : "bg-violet-100"} flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-lg font-bold ${n === 1 ? "text-blue-600" : n === 2 ? "text-emerald-600" : "text-violet-600"}`}>
                      {n}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t(`landing.whyCaliber${n}Title`)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(`landing.whyCaliber${n}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Final CTA */}
      <FadeInSection>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600" />
          <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              {t("landing.ctaSubtitle")}
            </p>
            <Link href="/assess">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-base px-10 h-12 rounded-xl shadow-lg"
              >
                {t("common.getStarted")}
              </Button>
            </Link>
          </div>
        </section>
      </FadeInSection>

      <AppFooter />
    </div>
  );
}
