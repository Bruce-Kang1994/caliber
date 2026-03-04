"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { useInView } from "@/hooks/useInView";
import {
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  FileText,
  Target,
  Upload,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/* ================================================================
   SCROLL REVEAL
   Intersection Observer reveal with 150-300ms transition range.
   Uses transform + opacity only for GPU-composited animations.
   ================================================================ */
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
      className={`transition-[opacity,transform] duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ================================================================
   MINI RADAR CHART
   SVG radar for hero product preview card.
   Accessible via role="img" and aria-label.
   ================================================================ */
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
      aria-label="Capability radar chart showing scores across Product, Business, AI, Soft Skills, and Global dimensions"
    >
      {/* Grid rings */}
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
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        );
      })}
      {/* Data polygon */}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="#2563EB"
        fillOpacity={0.12}
        stroke="#2563EB"
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#2563EB" />
      ))}
    </svg>
  );
}

/* ================================================================
   MINI BAR CHART
   Compact bar visualization for hero product preview.
   ================================================================ */
function MiniBarChart() {
  const bars = [
    { label: "Req", v: 4.2 },
    { label: "Design", v: 3.8 },
    { label: "Arch", v: 3.5 },
    { label: "0->1", v: 4.5 },
    { label: "Data", v: 3.2 },
  ];
  return (
    <div
      className="flex items-end gap-1.5 h-14 justify-center"
      role="img"
      aria-label="Bar chart showing skill scores for Requirements, Design, Architecture, Zero-to-One, and Data"
    >
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-[18px] rounded-t transition-all duration-300"
            style={{
              height: `${(b.v / 5) * 44}px`,
              background:
                b.v >= 4.5 ? "#059669" : b.v >= 3.5 ? "#2563EB" : "#94a3b8",
            }}
          />
          <span className="text-[9px] text-slate-400 leading-none">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   FEATURES DATA
   ================================================================ */
const FEATURES = [
  {
    icon: SlidersHorizontal,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Role-Specific Weights",
    description:
      "Dimensions are weighted differently for Growth PM vs. Platform PM vs. AI PM. Your assessment adapts to the role you are targeting.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Evidence-Based Scoring",
    description:
      "AI extracts concrete evidence from your experience and scores each dimension against industry benchmarks, not vague self-ratings.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Upgrade-Style Feedback",
    description:
      "Instead of vague advice, get concrete next steps framed as upgrades: from your current level to the next, with specific actions.",
  },
  {
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Complete Caliber Report",
    description:
      "15-dimension radar chart, top strengths, hidden gems, growth areas, and your personalized upgrade plan — all in one actionable report.",
  },
];

/* ================================================================
   STEPS DATA
   ================================================================ */
const STEPS = [
  {
    number: 1,
    icon: Target,
    title: "Choose Your Target Role",
    description:
      "Select from Growth PM, Platform PM, AI PM, and more. Weights adjust automatically to match role expectations.",
  },
  {
    number: 2,
    icon: Upload,
    title: "Share Your Experience",
    description:
      "Paste your resume or describe your background. AI extracts the evidence it needs — no tedious questionnaires.",
  },
  {
    number: 3,
    icon: FileText,
    title: "Get Your Caliber Report",
    description:
      "Receive your scored radar chart, strengths, gaps, and a concrete upgrade plan you can act on immediately.",
  },
];

/* ================================================================
   STATS DATA
   ================================================================ */
const STATS = [
  { value: "15", label: "Dimensions Assessed" },
  { value: "5 min", label: "To Complete" },
  { value: "AI", label: "Powered Analysis" },
  { value: "100%", label: "Personalized" },
];

/* ================================================================
   TRUST BAR COMPANIES
   ================================================================ */
const TRUST_COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple"];

/* ================================================================
   MAIN PAGE COMPONENT
   Swiss Minimalist, accessibility-first, SaaS trust pattern.
   Pure white hero with blue accents — Exponent.com reference.
   ================================================================ */
export default function UIUXProMaxLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader showNav showAuth showCta />

      {/* ════════════════════ HERO ════════════════════ */}
      <section
        className="bg-white"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            {/* Left - Copy */}
            <div className="text-center lg:text-left">
              <Reveal>
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-sm font-medium text-blue-700 mb-8"
                  role="status"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  What&apos;s Your PM Caliber?
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] text-slate-900 leading-[1.1]"
                >
                  Know exactly where you stand
                  <span className="relative inline-block">
                    <span className="relative z-10"> — and what to do next</span>
                    <span
                      className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100 -z-0 rounded-sm"
                      aria-hidden="true"
                    />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
                  AI analyzes your real experience against 15 dimensions. Get
                  your strengths to highlight, gaps to address, and a concrete
                  upgrade plan — in 5 minutes.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4">
                  <Link href="/assess">
                    <Button
                      size="lg"
                      className="cursor-pointer text-base px-8 h-12 min-w-[200px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                      aria-label="Start the Caliber assessment"
                    >
                      Get Your Caliber Report
                      <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <p className="mt-4 text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-1.5">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-500 shrink-0"
                    aria-hidden="true"
                  />
                  Free &middot; No credit card &middot; 5 min assessment
                </p>
              </Reveal>
            </div>

            {/* Right - Product preview card */}
            <Reveal delay={200} className="hidden lg:block">
              <div className="relative" aria-hidden="true">
                {/* Floating badge - top right */}
                <div className="absolute -top-3 -right-3 z-10 bg-white rounded-xl px-4 py-2.5 shadow-lg shadow-slate-200/60 border border-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-900">
                    AI-Powered
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                  {/* Top accent line */}
                  <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-3 gap-6 items-center">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">
                          Caliber Score
                        </p>
                        <div className="text-4xl font-bold tracking-tight text-slate-900">
                          82
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          /100
                        </div>
                        <span className="inline-flex mt-2 text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Advanced
                        </span>
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
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">
                          PM Archetype
                        </p>
                        <div className="text-sm font-bold text-slate-900 mb-1">
                          The Strategist
                        </div>
                        <MiniBarChart />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge - bottom left */}
                <div className="absolute -bottom-3 -left-3 z-10 bg-white rounded-xl px-4 py-2.5 shadow-lg shadow-slate-200/60 border border-gray-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-slate-500">Dimensions</div>
                    <div className="text-xs font-bold text-slate-900">
                      15 analyzed
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mobile-only report card */}
      <div className="lg:hidden px-4 sm:px-6 -mt-4 mb-8" aria-hidden="true">
        <Reveal>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Score
                  </p>
                  <div className="text-3xl font-bold text-slate-900">82</div>
                  <div className="text-slate-400 text-xs">/100</div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Radar
                  </p>
                  <MiniRadar size={90} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <div className="text-xs font-bold text-slate-900">
                    Strategist
                  </div>
                  <MiniBarChart />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ════════════════════ TRUST BAR ════════════════════ */}
      <section
        className="border-y border-gray-200 bg-slate-50/50"
        aria-label="Trusted by product managers at leading companies"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest text-center mb-6">
            Trusted by PMs at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {TRUST_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-lg sm:text-xl font-bold text-slate-300 tracking-tight select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ STATS ════════════════════ */}
      <section className="border-b border-gray-200" aria-label="Key statistics">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section
        className="bg-white"
        aria-labelledby="features-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <Reveal>
            <div className="text-center mb-14 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-sm font-medium text-blue-700 mb-4">
                Features
              </span>
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              >
                Built for serious PM career growth
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Every dimension is weighted, every score is evidence-based, and
                every recommendation is actionable.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="group h-full bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:shadow-slate-100/80 hover:border-gray-300 cursor-default">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5`}
                    >
                      <Icon
                        className={`w-6 h-6 ${feature.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ HOW IT WORKS ════════════════════ */}
      <section
        className="bg-slate-50 border-y border-gray-200"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <Reveal>
            <div className="text-center mb-14 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-sm font-medium text-blue-700 mb-4">
                How It Works
              </span>
              <h2
                id="how-it-works-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
              >
                From input to full report in 5 minutes
              </h2>
              <p className="mt-4 text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                Three simple steps to a complete picture of your PM capabilities.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 relative">
            {/* Connecting line (desktop only) */}
            <div
              className="hidden md:block absolute top-[44px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gray-200"
              aria-hidden="true"
            />

            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={idx * 120}>
                  <div className="relative text-center">
                    {/* Numbered circle */}
                    <div className="relative z-10 mx-auto mb-6">
                      <div className="w-[88px] h-[88px] rounded-2xl bg-white border-2 border-gray-200 flex flex-col items-center justify-center mx-auto shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                        <Icon
                          className="w-6 h-6 text-blue-600 mb-1"
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Step {step.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ FINAL CTA ════════════════════ */}
      <section
        className="bg-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <Reveal>
            <div className="text-center">
              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4"
              >
                Ready to Discover Your Caliber?
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto">
                Join thousands of product managers who use Caliber to understand
                their strengths, close their gaps, and accelerate their careers.
              </p>
              <Link href="/assess">
                <Button
                  size="lg"
                  className="cursor-pointer text-base px-10 h-13 min-w-[240px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  aria-label="Start your free Caliber assessment"
                >
                  Get Your Caliber Report
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <p className="mt-5 text-sm text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle2
                  className="w-4 h-4 text-emerald-500 shrink-0"
                  aria-hidden="true"
                />
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
