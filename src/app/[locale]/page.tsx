"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

// ─── Scroll-triggered reveal (Apple-style fade up) ───
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView(0.12);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Hero Radar — large animated pentagon ───
function HeroRadar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(1), 400);
    return () => clearTimeout(t);
  }, []);

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = 130;
  const data = [
    { score: 4.2, color: "#6366f1" },
    { score: 3.6, color: "#6366f1" },
    { score: 4.5, color: "#6366f1" },
    { score: 3.8, color: "#6366f1" },
    { score: 4.0, color: "#6366f1" },
  ];

  const getPoint = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const polygon = data
    .map((d, i) => {
      const p = getPoint(i, (d.score / 5) * progress);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 40} fill="url(#hero-glow)" />
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map((level) => {
        const pts = data
          .map((_, i) => {
            const p = getPoint(i, level / 5);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={level === 5 ? 0.8 : 0.4}
            opacity={0.5}
          />
        );
      })}
      {/* Axes */}
      {data.map((_, i) => {
        const p = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#cbd5e1"
            strokeWidth={0.4}
            opacity={0.5}
          />
        );
      })}
      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="url(#radar-fill)"
        stroke="#6366f1"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ transition: "all 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      {/* Data points */}
      {data.map((_, i) => {
        const p = getPoint(i, (data[i].score / 5) * progress);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#6366f1"
            style={{ transition: "all 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        );
      })}
    </svg>
  );
}

// ─── Animated dimension bars for Section 2 ───
function DimensionBars() {
  const t = useTranslations();
  const { ref, inView } = useInView(0.2);
  const dims: { key: string; score: number }[] = [
    { key: "requirement-analysis", score: 4.2 },
    { key: "product-design", score: 3.8 },
    { key: "zero-to-one", score: 4.5 },
    { key: "user-research", score: 3.5 },
    { key: "data-experimentation", score: 4.0 },
    { key: "business-decomposition", score: 3.3 },
    { key: "product-vision", score: 4.3 },
    { key: "ai-product-design", score: 3.6 },
  ];

  return (
    <div ref={ref} className="space-y-3 w-full max-w-xl mx-auto">
      {dims.map((d, i) => (
        <div key={d.key} className="flex items-center gap-3">
          <span className="w-24 text-xs text-slate-500 text-right truncate shrink-0">
            {t(`dimensions.${d.key}`)}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-slate-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-1000 ease-out"
              style={{
                width: inView ? `${(d.score / 5) * 100}%` : "0%",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
          <span className="w-7 text-xs text-slate-400 tabular-nums">
            {d.score}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Report mockup cards for dark Section 3 ───
function ReportPreview() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-lg mx-auto text-left">
      <div className="bg-white/[0.06] rounded-2xl p-5 border border-white/[0.08]">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">
          Caliber Score
        </p>
        <div className="text-4xl font-bold text-white">82</div>
        <p className="text-xs text-slate-500 mt-1">Advanced</p>
      </div>
      <div className="bg-white/[0.06] rounded-2xl p-5 border border-white/[0.08]">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">
          Archetype
        </p>
        <div className="text-lg font-bold text-white leading-tight">
          The Strategist
        </div>
        <p className="text-xs text-slate-500 mt-1">35% / 28%</p>
      </div>
      <div className="bg-emerald-500/[0.08] rounded-2xl p-5 border border-emerald-500/[0.12]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-[10px] text-emerald-400 uppercase tracking-widest">
            Strength
          </p>
        </div>
        <div className="text-sm font-semibold text-white">Zero to One</div>
        <p className="text-xs text-slate-500 mt-0.5">4.5 / 5.0</p>
      </div>
      <div className="bg-amber-500/[0.08] rounded-2xl p-5 border border-amber-500/[0.12]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <p className="text-[10px] text-amber-400 uppercase tracking-widest">
            Growth
          </p>
        </div>
        <div className="text-sm font-semibold text-white">Data & Experiment</div>
        <p className="text-xs text-slate-500 mt-0.5">2.8 → Action Plan</p>
      </div>
    </div>
  );
}

// ─── Grid card component ───
function GridCard({
  title,
  subtitle,
  dark = false,
  accent = false,
}: {
  title: string;
  subtitle: string;
  dark?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl min-h-[380px] flex flex-col items-center justify-center text-center px-8 py-16 transition-all duration-300 ${
        dark
          ? "bg-slate-900 text-white"
          : accent
            ? "bg-gradient-to-br from-indigo-50 to-violet-50 text-slate-900"
            : "bg-white text-slate-900"
      }`}
    >
      <h3
        className={`text-2xl md:text-3xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 text-base leading-relaxed max-w-xs ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ─── Main Page ───
export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AppHeader showNav showAuth showCta />

      {/* ═══ Hero ═══ */}
      <section className="min-h-[88vh] flex flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <HeroRadar />
        </Reveal>
        <Reveal delay={200}>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-slate-900 whitespace-pre-line leading-[1.08]">
            {t("landing.heroTitle")}
          </h1>
        </Reveal>
        <Reveal delay={350}>
          <p className="mt-5 text-xl md:text-2xl text-slate-500 font-normal">
            {t("landing.heroSubtitle")}
          </p>
        </Reveal>
        <Reveal delay={500}>
          <Link href="/assess" className="mt-8 inline-block">
            <Button
              size="lg"
              className="text-base px-8 h-12 rounded-full shadow-lg shadow-primary/20"
            >
              {t("common.getStarted")}
            </Button>
          </Link>
        </Reveal>
        <Reveal delay={600}>
          <p className="mt-4 text-sm text-slate-400">{t("landing.heroTrust")}</p>
        </Reveal>
      </section>

      {/* ═══ Section 2: 16 Dimensions (white) ═══ */}
      <section className="bg-white">
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 whitespace-pre-line leading-[1.1]">
              {t("landing.sectionAssessTitle")}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 text-lg md:text-xl text-slate-500 max-w-xl">
              {t("landing.sectionAssessSub")}
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-7 flex items-center gap-3">
              <Link href="/assess">
                <Button size="lg" className="rounded-full px-8">
                  {t("common.getStarted")}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  {t("common.pricing")}
                </Button>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-16 w-full">
              <DimensionBars />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Section 3: AI Analysis (dark) ═══ */}
      <section className="bg-[#1d1d1f] text-white">
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight whitespace-pre-line leading-[1.1]">
              {t("landing.sectionAiTitle")}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 text-lg md:text-xl text-slate-400 max-w-xl">
              {t("landing.sectionAiSub")}
            </p>
          </Reveal>
          <Reveal delay={250}>
            <Link href="/assess" className="mt-7 inline-block">
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100"
              >
                {t("common.getStarted")}
              </Button>
            </Link>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-16 w-full">
              <ReportPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Section 4: 2×2 Feature Grid ═══ */}
      <section className="px-3 py-3">
        <div className="grid md:grid-cols-2 gap-3 max-w-[1200px] mx-auto">
          <GridCard
            title={t("landing.gridTitle1")}
            subtitle={t("landing.gridSub1")}
          />
          <GridCard
            title={t("landing.gridTitle2")}
            subtitle={t("landing.gridSub2")}
            dark
          />
          <GridCard
            title={t("landing.gridTitle3")}
            subtitle={t("landing.gridSub3")}
            accent
          />
          <GridCard
            title={t("landing.gridTitle4")}
            subtitle={t("landing.gridSub4")}
            dark
          />
        </div>
      </section>

      {/* ═══ Section 5: Final CTA ═══ */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            {t("landing.ctaTitle")}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-4 text-lg text-slate-500">
            {t("landing.ctaSubtitle")}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <Link href="/assess" className="mt-8 inline-block">
            <Button size="lg" className="rounded-full px-10 h-13 text-base">
              {t("common.getStarted")}
            </Button>
          </Link>
        </Reveal>
      </section>

      <AppFooter />
    </div>
  );
}
