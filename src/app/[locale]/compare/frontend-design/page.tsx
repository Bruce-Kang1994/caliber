"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { useInView } from "@/hooks/useInView";
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

/* ─────────────────────────────────────────────
   Design tokens — warm coral / amber / teal
   ───────────────────────────────────────────── */
const CORAL = "#FF6B6B";
const CORAL_DARK = "#E85D5D";
const AMBER = "#F59E0B";
const TEAL = "#0D9488";
const CREAM = "#FFFBF5";
const WARM_GRAY = "#78716C";

/* ─────────────────────────────────────────────
   Scroll-reveal wrapper with stagger support
   ───────────────────────────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, inView } = useInView(0.08);

  const transforms: Record<string, string> = {
    up: "translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    scale: "scale-95",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out ${
        inView
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : `opacity-0 ${transforms[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MiniRadar — warm coral palette
   ───────────────────────────────────────────── */
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
    return {
      x: cx + r * ratio * Math.cos(a),
      y: cy + r * ratio * Math.sin(a),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      className="mx-auto"
      role="img"
      aria-label="Capability radar chart"
    >
      {[1, 2, 3, 4, 5].map((l) => {
        const lr = (r * l) / 5;
        const g = RADAR_DATA.map((_, i) => {
          const a = (Math.PI * 2 * i) / RADAR_DATA.length - Math.PI / 2;
          return `${cx + lr * Math.cos(a)},${cy + lr * Math.sin(a)}`;
        }).join(" ");
        return (
          <polygon
            key={l}
            points={g}
            fill="none"
            stroke="#F5D0C5"
            strokeWidth={0.6}
          />
        );
      })}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={CORAL}
        fillOpacity={0.15}
        stroke={CORAL}
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={CORAL} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MiniBarChart — warm palette
   ───────────────────────────────────────────── */
function MiniBarChart() {
  const bars = [
    { label: "Req", v: 4.2 },
    { label: "Design", v: 3.8 },
    { label: "Arch", v: 3.5 },
    { label: "0\u21921", v: 4.5 },
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
              background:
                b.v >= 4.5 ? TEAL : b.v >= 3.5 ? CORAL : WARM_GRAY,
            }}
          />
          <span className="text-[9px] text-stone-400 leading-none">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Decorative background shapes
   ───────────────────────────────────────────── */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large coral circle — top right, partially clipped */}
      <div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: CORAL }}
      />
      {/* Amber ring — mid left */}
      <div
        className="absolute top-[35%] -left-16 w-[200px] h-[200px] rounded-full border-[3px] opacity-[0.08]"
        style={{ borderColor: AMBER }}
      />
      {/* Teal dot cluster — bottom right */}
      <div
        className="absolute bottom-[15%] right-[10%] w-3 h-3 rounded-full opacity-[0.12]"
        style={{ background: TEAL }}
      />
      <div
        className="absolute bottom-[18%] right-[12%] w-2 h-2 rounded-full opacity-[0.08]"
        style={{ background: TEAL }}
      />
      <div
        className="absolute bottom-[13%] right-[8%] w-1.5 h-1.5 rounded-full opacity-[0.10]"
        style={{ background: TEAL }}
      />
      {/* Diagonal line — decorative */}
      <div
        className="absolute top-[20%] left-[5%] w-[120px] h-[1px] rotate-[35deg] opacity-[0.08]"
        style={{ background: CORAL }}
      />
      <div
        className="absolute top-[22%] left-[6%] w-[80px] h-[1px] rotate-[35deg] opacity-[0.06]"
        style={{ background: AMBER }}
      />
      {/* Small amber square — rotated */}
      <div
        className="absolute top-[60%] right-[20%] w-8 h-8 rotate-45 rounded-sm opacity-[0.06]"
        style={{ background: AMBER }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Noise texture overlay (CSS-generated)
   ───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ═════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═════════════════════════════════════════════ */
export default function FrontendDesignLandingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = useTranslations();

  const stats = [
    { number: "15", label: "Dimensions Assessed" },
    { number: "5 min", label: "Start to Report" },
    { number: "AI", label: "Powered Analysis" },
    { number: "100%", label: "Personalized" },
  ];

  const features = [
    {
      icon: SlidersHorizontal,
      title: "Role-Specific Weights",
      desc: "Weights automatically adjust to your target role. A Growth PM gets scored differently than a Platform PM -- because the job is different.",
      color: CORAL,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: BarChart3,
      title: "Evidence-Based Scoring",
      desc: "Not vibes -- real evidence. AI extracts concrete signals from your experience and scores each dimension with transparent reasoning.",
      color: TEAL,
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Upgrade-Style Feedback",
      desc: "Every gap comes with a concrete upgrade path. Know exactly what to do next to level up, with actionable recommendations.",
      color: AMBER,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      icon: FileText,
      title: "Complete Caliber Report",
      desc: "15-dimension radar, top strengths, hidden gems, growth areas, and your personalized upgrade plan -- all in one actionable report.",
      color: CORAL,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  const steps = [
    {
      step: 1,
      icon: Target,
      title: "Choose Your Role",
      desc: "Select your target PM role -- Growth, Platform, AI, B2B, or 10+ others. The framework adapts to what matters for that role.",
    },
    {
      step: 2,
      icon: Upload,
      title: "Share Your Experience",
      desc: "Paste your resume, describe key projects, or answer guided prompts. The more context, the richer the analysis.",
    },
    {
      step: 3,
      icon: FileText,
      title: "Get Your Report",
      desc: "AI analyzes your experience across 15 dimensions and delivers your complete Caliber Report with scores, insights, and upgrade paths.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <AppHeader showNav showAuth showCta />

      {/* ════════════════════════════════════════════════
          HERO SECTION — Light cream, asymmetric layout
          ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <FloatingShapes />
        <NoiseOverlay />

        {/* Warm gradient mesh — very subtle */}
        <div
          className="absolute top-0 right-0 w-[60%] h-[80%] opacity-[0.04] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, ${CORAL}, transparent 60%), radial-gradient(ellipse at 90% 70%, ${AMBER}, transparent 50%)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 sm:pt-32 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
            {/* ── Left: Copy (asymmetric — pushed slightly down) ── */}
            <div className="lg:pt-4">
              <Reveal>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${CORAL}12, ${AMBER}12)`,
                    color: CORAL_DARK,
                    border: `1px solid ${CORAL}20`,
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: TEAL }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: TEAL }}
                    />
                  </span>
                  What&apos;s Your PM Caliber?
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-serif font-bold tracking-[-0.03em] leading-[1.1] text-stone-900">
                  Know exactly where
                  <br />
                  you stand{" "}
                  <span
                    className="italic"
                    style={{
                      background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    &mdash; and what
                    <br />
                    to do next
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-7 text-lg text-stone-500 max-w-lg leading-relaxed font-sans">
                  AI analyzes your real experience against 15 dimensions. Get
                  your strengths to highlight, gaps to address, and a concrete
                  upgrade plan &mdash; in 5 minutes.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-col sm:flex-row items-start gap-3">
                  <Link href="/assess">
                    <Button
                      size="lg"
                      className="cursor-pointer text-[15px] px-8 h-13 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DARK})`,
                        boxShadow: `0 8px 30px ${CORAL}30`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 12px 40px ${CORAL}45`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 30px ${CORAL}30`;
                      }}
                    >
                      Get Your Caliber Report
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-stone-400">
                  {[
                    "Free -- No credit card",
                    "5 minute assessment",
                    "AI-powered analysis",
                  ].map((txt) => (
                    <span key={txt} className="flex items-center gap-1.5">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: TEAL }}
                      />
                      {txt}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* ── Right: Product preview card — offset + slight rotation ── */}
            <Reveal delay={200} direction="left" className="hidden lg:block">
              <div className="relative ml-4">
                {/* Decorative circle behind card */}
                <div
                  className="absolute -top-8 -right-8 w-[280px] h-[280px] rounded-full opacity-[0.06] -z-10"
                  style={{ background: CORAL }}
                />

                {/* Floating AI badge — top right, rotated */}
                <div
                  className="absolute -top-4 -right-3 z-10 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2 rotate-3 transition-transform duration-300 hover:rotate-0"
                  style={{
                    background: "white",
                    border: `1px solid ${CORAL}20`,
                    boxShadow: `0 8px 30px ${CORAL}10`,
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: CORAL }} />
                  <span className="text-xs font-bold text-stone-800">
                    AI-Powered
                  </span>
                </div>

                {/* Main preview card — warm tones, slight rotation */}
                <Card
                  className="border-0 shadow-2xl overflow-hidden -rotate-1 transition-transform duration-500 hover:rotate-0"
                  style={{
                    background: "linear-gradient(145deg, #FFF8F0, #FFFFFF)",
                    boxShadow: `0 25px 60px ${CORAL}12, 0 0 0 1px ${CORAL}08`,
                  }}
                >
                  <div
                    className="h-1"
                    style={{
                      background: `linear-gradient(90deg, ${CORAL}, ${AMBER}, ${TEAL})`,
                    }}
                  />
                  <CardContent className="py-7 px-6">
                    <div className="grid grid-cols-3 gap-6 items-center">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-1.5">
                          Caliber Score
                        </p>
                        <div
                          className="text-4xl font-serif font-bold tracking-tight"
                          style={{ color: CORAL }}
                        >
                          82
                        </div>
                        <div className="text-stone-400 text-xs mt-0.5">
                          /100
                        </div>
                        <Badge
                          className="mt-2 text-[10px] px-2 border"
                          style={{
                            background: `${CORAL}10`,
                            color: CORAL_DARK,
                            borderColor: `${CORAL}25`,
                          }}
                        >
                          Advanced
                        </Badge>
                      </div>
                      {/* Radar */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-1">
                          Capability Radar
                        </p>
                        <MiniRadar size={110} />
                      </div>
                      {/* Archetype */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-1.5">
                          PM Archetype
                        </p>
                        <div className="text-sm font-serif font-bold text-stone-800 mb-1">
                          The Strategist
                        </div>
                        <MiniBarChart />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating dimensions badge — bottom left, counter-rotated */}
                <div
                  className="absolute -bottom-4 -left-3 z-10 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2 -rotate-2 transition-transform duration-300 hover:rotate-0"
                  style={{
                    background: "white",
                    border: `1px solid ${TEAL}20`,
                    boxShadow: `0 8px 30px ${TEAL}10`,
                  }}
                >
                  <Target className="w-4 h-4" style={{ color: TEAL }} />
                  <div>
                    <div className="text-[10px] text-stone-400">Dimensions</div>
                    <div className="text-xs font-bold text-stone-800">
                      15 analyzed
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Wavy section divider */}
        <div className="relative -mb-1">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V30C240 5 480 5 720 30C960 55 1200 55 1440 30V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Mobile-only report card */}
      <div className="lg:hidden px-6 -mt-4 mb-8">
        <Reveal>
          <Card
            className="border-0 shadow-xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #FFF8F0, #FFFFFF)",
              boxShadow: `0 15px 40px ${CORAL}12`,
            }}
          >
            <div
              className="h-1"
              style={{
                background: `linear-gradient(90deg, ${CORAL}, ${AMBER}, ${TEAL})`,
              }}
            />
            <CardContent className="py-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                    Score
                  </p>
                  <div
                    className="text-3xl font-serif font-bold"
                    style={{ color: CORAL }}
                  >
                    82
                  </div>
                  <div className="text-stone-400 text-xs">/100</div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                    Radar
                  </p>
                  <MiniRadar size={90} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <div className="text-xs font-serif font-bold text-stone-800">
                    Strategist
                  </div>
                  <MiniBarChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* ════════════════════════════════════════════════
          STATS STRIP — Asymmetric, warm accents
          ════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div
                  className="relative text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    background:
                      idx === 0
                        ? `linear-gradient(145deg, ${CORAL}06, ${CORAL}02)`
                        : idx === 1
                        ? `linear-gradient(145deg, ${AMBER}06, ${AMBER}02)`
                        : idx === 2
                        ? `linear-gradient(145deg, ${TEAL}06, ${TEAL}02)`
                        : `linear-gradient(145deg, ${CORAL}06, ${AMBER}02)`,
                  }}
                >
                  {/* Accent dot */}
                  <div
                    className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{
                      background:
                        idx === 0
                          ? CORAL
                          : idx === 1
                          ? AMBER
                          : idx === 2
                          ? TEAL
                          : CORAL,
                    }}
                  />
                  <div
                    className="text-3xl md:text-4xl font-serif font-bold tracking-tight"
                    style={{
                      color:
                        idx === 0
                          ? CORAL
                          : idx === 1
                          ? AMBER
                          : idx === 2
                          ? TEAL
                          : CORAL_DARK,
                    }}
                  >
                    {stat.number}
                  </div>
                  <div className="mt-2 text-sm text-stone-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES — Bento Grid, asymmetric, warm cards
          ════════════════════════════════════════════════ */}
      <section className="relative" style={{ background: CREAM }}>
        <NoiseOverlay />
        <div className="relative max-w-5xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <span
                className="inline-block text-[13px] font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: CORAL }}
              >
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                Not another generic assessment
              </h2>
              <p className="mt-4 text-stone-500 max-w-lg mx-auto text-lg">
                Every dimension, every score, every recommendation is calibrated
                to your specific PM role.
              </p>
            </div>
          </Reveal>

          {/* Bento grid — asymmetric 5-column layout */}
          <div className="grid md:grid-cols-5 gap-5">
            {/* Feature 1 — spans 3 cols, role-specific weights */}
            <Reveal className="md:col-span-3">
              <div
                className="group relative h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden"
                style={{
                  background: "white",
                  border: `1px solid ${CORAL}12`,
                  boxShadow: `0 4px 20px ${CORAL}06`,
                }}
              >
                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-bl-[60px] opacity-[0.03]"
                  style={{ background: CORAL }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-300"
                    style={{ background: `${CORAL}12` }}
                  >
                    <SlidersHorizontal
                      className="w-5 h-5"
                      style={{ color: CORAL }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
                      {features[0].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-5">
                      {features[0].desc}
                    </p>
                    {/* Weight sliders preview */}
                    <div className="space-y-3">
                      {[
                        { name: "Product Sense", pct: 35, w: "70%" },
                        { name: "Business Acumen", pct: 25, w: "50%" },
                        { name: "AI Expertise", pct: 20, w: "40%" },
                        { name: "Soft Skills", pct: 12, w: "24%" },
                        { name: "Global Readiness", pct: 8, w: "16%" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span className="w-28 text-stone-600 shrink-0 truncate font-medium">
                            {item.name}
                          </span>
                          <div className="h-2 rounded-full bg-stone-100 flex-1">
                            <div
                              className="h-2 rounded-full transition-all duration-700"
                              style={{
                                width: item.w,
                                background: `linear-gradient(90deg, ${CORAL}, ${AMBER})`,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right text-stone-400 tabular-nums font-medium">
                            {item.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 — spans 2 cols, evidence-based */}
            <Reveal delay={100} className="md:col-span-2">
              <div
                className="group relative h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden"
                style={{
                  background: "white",
                  border: `1px solid ${TEAL}12`,
                  boxShadow: `0 4px 20px ${TEAL}06`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 -rotate-3 group-hover:rotate-0 transition-transform duration-300"
                  style={{ background: `${TEAL}12` }}
                >
                  <BarChart3 className="w-5 h-5" style={{ color: TEAL }} />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
                  {features[1].title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                  {features[1].desc}
                </p>
                {/* Evidence preview */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: `${TEAL}04`,
                    border: `1px solid ${TEAL}10`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="text-lg leading-none"
                      style={{ color: TEAL }}
                    >
                      &ldquo;
                    </span>
                    <p className="text-xs text-stone-500 italic leading-relaxed">
                      Led migration to microservices, reducing deploy time by
                      60%...
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Badge
                      className="text-[10px] px-1.5 h-4 border"
                      style={{
                        background: `${TEAL}10`,
                        color: TEAL,
                        borderColor: `${TEAL}20`,
                      }}
                    >
                      4.5/5
                    </Badge>
                    <span className="text-[10px] text-stone-400">
                      System Architecture
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 — spans 2 cols, upgrade feedback */}
            <Reveal delay={150} className="md:col-span-2">
              <div
                className="group relative h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden"
                style={{
                  background: "white",
                  border: `1px solid ${AMBER}15`,
                  boxShadow: `0 4px 20px ${AMBER}06`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 rotate-2 group-hover:rotate-0 transition-transform duration-300"
                  style={{ background: `${AMBER}12` }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: AMBER }} />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
                  {features[2].title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                  {features[2].desc}
                </p>
                {/* Upgrade path preview */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: `${AMBER}04`,
                    border: `1px solid ${AMBER}10`,
                  }}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Badge
                      className="text-[10px] px-1.5 h-4 border"
                      style={{
                        background: `${AMBER}10`,
                        color: "#B45309",
                        borderColor: `${AMBER}25`,
                      }}
                    >
                      2.5
                    </Badge>
                    <div
                      className="flex-1 h-px"
                      style={{
                        background: `linear-gradient(90deg, ${AMBER}, ${TEAL})`,
                      }}
                    />
                    <Badge
                      className="text-[10px] px-1.5 h-4 border"
                      style={{
                        background: `${TEAL}10`,
                        color: TEAL,
                        borderColor: `${TEAL}25`,
                      }}
                    >
                      4.0
                    </Badge>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2.5 leading-relaxed">
                    Your data skills can accelerate growth experiments...
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Feature 4 — spans 3 cols, complete report */}
            <Reveal delay={200} className="md:col-span-3">
              <div
                className="group relative h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${CORAL}06, ${AMBER}04, white)`,
                  border: `1px solid ${CORAL}10`,
                  boxShadow: `0 4px 20px ${CORAL}06`,
                }}
              >
                {/* Decorative accent */}
                <div
                  className="absolute bottom-0 left-0 w-40 h-40 rounded-tr-[80px] opacity-[0.02]"
                  style={{ background: AMBER }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 -rotate-2 group-hover:rotate-0 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${CORAL}15, ${AMBER}15)`,
                    }}
                  >
                    <FileText className="w-5 h-5" style={{ color: CORAL }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-1.5">
                      {features[3].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-5">
                      {features[3].desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Radar Chart",
                        "Strengths",
                        "Hidden Gems",
                        "Growth Plan",
                        "PDF Export",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-3 py-1.5 rounded-full font-medium transition-colors duration-200"
                          style={{
                            background: `${CORAL}08`,
                            color: CORAL_DARK,
                            border: `1px solid ${CORAL}15`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS — 3 steps, diagonal connection
          ════════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        {/* Diagonal background stripe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(170deg, transparent 30%, ${CORAL}02 50%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <span
                className="inline-block text-[13px] font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: TEAL }}
              >
                Three Simple Steps
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                From input to full report in 5 minutes
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) — gradient coral to teal */}
            <div
              className="hidden md:block absolute top-14 left-[18%] right-[18%] h-[2px]"
              style={{
                background: `linear-gradient(90deg, ${CORAL}40, ${AMBER}40, ${TEAL}40)`,
              }}
            />

            {steps.map(({ step, icon: Icon, title, desc }, idx) => {
              const color = idx === 0 ? CORAL : idx === 1 ? AMBER : TEAL;
              return (
                <Reveal key={step} delay={idx * 120}>
                  <div className="relative text-center group">
                    {/* Step circle */}
                    <div
                      className="w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-6 relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                      style={{
                        background: color,
                        boxShadow: `0 8px 25px ${color}30`,
                        transform: `rotate(${idx === 0 ? -3 : idx === 2 ? 3 : 0}deg)`,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* Step label */}
                    <div
                      className="text-xs font-bold uppercase tracking-[0.15em] mb-2"
                      style={{ color }}
                    >
                      Step {step}
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed max-w-[280px] mx-auto">
                      {desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA — Warm gradient, bold typography
          ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: CREAM }}>
        <NoiseOverlay />
        {/* Large decorative circles */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: CORAL }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: AMBER }}
        />

        <div className="relative py-28 px-6">
          <Reveal direction="scale">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                Ready to Discover
                <br />
                <span
                  className="italic"
                  style={{
                    background: `linear-gradient(135deg, ${CORAL}, ${AMBER})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Your Caliber?
                </span>
              </h2>
              <p className="mt-6 text-lg text-stone-500 leading-relaxed max-w-md mx-auto">
                Join PMs who&apos;ve already mapped their strengths, identified
                blind spots, and built a concrete plan to level up.
              </p>
              <div className="mt-10">
                <Link href="/assess">
                  <Button
                    size="lg"
                    className="cursor-pointer text-base px-12 h-14 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DARK})`,
                      boxShadow: `0 8px 30px ${CORAL}35`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 16px 50px ${CORAL}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 8px 30px ${CORAL}35`;
                    }}
                  >
                    Get Your Caliber Report
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <p className="mt-5 text-sm text-stone-400">
                Free &middot; No credit card &middot; 5 min assessment
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
