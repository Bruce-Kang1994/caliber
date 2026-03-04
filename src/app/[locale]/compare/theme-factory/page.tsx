"use client";

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

/* ═══════════════════════════════════════════════
   THEME: Tech Innovation (Light Violet)
   Primary:   Deep Violet  #7C3AED
   Secondary: Cyan         #06B6D4
   Accent:    Rose         #F43F5E
   Bg:        Light Violet #FAFAFE / White
   Text:      Slate-900    #0F172A (headings)
              Slate-500    #64748B (body)
   ═══════════════════════════════════════════════ */

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
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ───────── MiniRadar (Violet themed) ───────── */
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
      {/* Axis lines */}
      {RADAR_DATA.map((_, i) => {
        const a = (Math.PI * 2 * i) / RADAR_DATA.length - Math.PI / 2;
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a)}
            y2={cy + r * Math.sin(a)}
            stroke="#e2e8f0"
            strokeWidth={0.3}
          />
        );
      })}
      {/* Data polygon — violet themed */}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="#7C3AED"
        fillOpacity={0.15}
        stroke="#7C3AED"
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#7C3AED" />
      ))}
      {/* Labels */}
      {RADAR_DATA.map((d, i) => {
        const a = (Math.PI * 2 * i) / RADAR_DATA.length - Math.PI / 2;
        const lx = cx + (r + 12) * Math.cos(a);
        const ly = cy + (r + 12) * Math.sin(a);
        return (
          <text
            key={`label-${i}`}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-400"
            fontSize={8}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ───────── MiniBarChart (Violet/Cyan/Rose themed) ───────── */
function MiniBarChart() {
  const bars = [
    { label: "Req", v: 4.2, color: "#7C3AED" },
    { label: "Design", v: 3.8, color: "#06B6D4" },
    { label: "Arch", v: 3.5, color: "#06B6D4" },
    { label: "0→1", v: 4.5, color: "#F43F5E" },
    { label: "Data", v: 3.2, color: "#7C3AED" },
  ];
  return (
    <div className="flex items-end gap-1.5 h-14 justify-center">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className="w-[18px] rounded-t transition-all"
            style={{
              height: `${(b.v / 5) * 44}px`,
              background: b.color,
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

/* ═══════════════════════════════════════════════
   MAIN PAGE — Theme Factory: Tech Innovation
   ═══════════════════════════════════════════════ */
export default function ThemeFactoryLandingPage() {
  const stats = [
    { number: "15", label: "Dimensions Analyzed", icon: Target },
    { number: "5 min", label: "Full Assessment", icon: Sparkles },
    { number: "AI", label: "Powered Analysis", icon: BarChart3 },
    { number: "100%", label: "Personalized Report", icon: FileText },
  ];

  const features = [
    {
      icon: SlidersHorizontal,
      title: "Role-Specific Weights",
      desc: "Each PM role demands different strengths. Caliber adjusts dimension weights based on your target role — Growth PM, Platform PM, AI PM, and more.",
      gradient: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      icon: BarChart3,
      title: "Evidence-Based Scoring",
      desc: "No vague self-ratings. AI extracts concrete achievements from your experience and maps them to a validated PM competency framework.",
      gradient: "from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      icon: TrendingUp,
      title: "Upgrade-Style Feedback",
      desc: "Think RPG skill trees. See exactly what level you are in each dimension and the specific actions to reach the next tier.",
      gradient: "from-rose-500 to-rose-600",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: FileText,
      title: "Complete Caliber Report",
      desc: "15-dimension radar chart, top strengths, hidden gems, growth areas, and your personalized upgrade plan — all in one actionable report.",
      gradient: "from-violet-500 to-cyan-500",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  const steps = [
    {
      step: 1,
      icon: Target,
      title: "Choose Your Role",
      desc: "Select your current or target PM role so weights are calibrated to what matters most.",
    },
    {
      step: 2,
      icon: Upload,
      title: "Share Your Experience",
      desc: "Paste your resume or describe key projects. Our AI does the heavy lifting — no tedious forms.",
    },
    {
      step: 3,
      icon: FileText,
      title: "Get Your Report",
      desc: "In under 5 minutes, receive a comprehensive Caliber Report with scores, insights, and an upgrade plan.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AppHeader showNav showAuth showCta />

      {/* ════════════════════════════════════════════════════════
          HERO — Light violet-tinted background
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#FAFAFE]">
        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #7C3AED 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating gradient orbs */}
        <div className="absolute top-[-15%] left-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[0%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-[20%] right-[15%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-violet-200/60 text-[13px] text-violet-600 mb-8 shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                  </span>
                  Free · No credit card · 5 min assessment
                </div>
              </Reveal>

              <Reveal delay={80}>
                <p className="text-sm font-semibold tracking-[0.15em] uppercase text-violet-500 mb-4">
                  What&apos;s Your PM Caliber?
                </p>
              </Reveal>

              <Reveal delay={120}>
                <h1 className="text-[2.5rem] md:text-5xl lg:text-[3.25rem] font-bold tracking-[-0.04em] leading-[1.1]">
                  <span className="text-slate-900">Know exactly where </span>
                  <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    you stand
                  </span>
                  <br />
                  <span className="text-slate-900">
                    — and what to do next
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-6 text-lg text-slate-500 max-w-lg leading-relaxed">
                  AI analyzes your real experience against 15 dimensions. Get
                  your strengths to highlight, gaps to address, and a concrete
                  upgrade plan — in 5 minutes.
                </p>
              </Reveal>

              <Reveal delay={280}>
                <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                  <Link href="/assess">
                    <Button
                      size="lg"
                      className="cursor-pointer text-[15px] px-7 h-12 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                    >
                      Get Your Caliber Report
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="cursor-pointer text-[15px] px-7 h-12 rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                    >
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={360}>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-slate-500">
                  {[
                    "15 PM Dimensions",
                    "Evidence-Based Scoring",
                    "Upgrade Roadmap",
                  ].map((txt) => (
                    <span key={txt} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
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
                <div className="absolute -top-3 -right-2 z-10 bg-white rounded-xl px-3.5 py-2 shadow-lg shadow-violet-500/10 border border-violet-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    AI-Powered
                  </span>
                </div>

                {/* Card with violet border glow */}
                <Card className="border-0 shadow-2xl shadow-violet-500/10 bg-white overflow-hidden ring-1 ring-violet-200/50">
                  {/* Top gradient accent line */}
                  <div className="h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-rose-400" />
                  <CardContent className="py-7 px-6">
                    <div className="grid grid-cols-3 gap-6 items-center">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                          Caliber Score
                        </p>
                        <div className="text-4xl font-bold tracking-tight bg-gradient-to-b from-violet-600 to-violet-500 bg-clip-text text-transparent">
                          82
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          /100
                        </div>
                        <Badge className="mt-2 bg-violet-50 text-violet-600 border border-violet-200/60 text-[10px] px-2">
                          Advanced
                        </Badge>
                      </div>
                      {/* Radar */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                          Capability Radar
                        </p>
                        <MiniRadar size={110} />
                      </div>
                      {/* Archetype */}
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">
                          PM Archetype
                        </p>
                        <div className="text-sm font-bold text-slate-800 mb-1">
                          The Strategist
                        </div>
                        <MiniBarChart />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-3 -left-2 z-10 bg-white rounded-xl px-3.5 py-2 shadow-lg shadow-violet-500/10 border border-violet-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-500" />
                  <div>
                    <div className="text-[10px] text-slate-400">Dimensions</div>
                    <div className="text-xs font-bold text-slate-800">
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
      <div className="lg:hidden px-6 -mt-4 mb-8">
        <Reveal>
          <Card className="border-0 shadow-xl bg-white overflow-hidden ring-1 ring-violet-200/50">
            <div className="h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-rose-400" />
            <CardContent className="py-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Score
                  </p>
                  <div className="text-3xl font-bold bg-gradient-to-b from-violet-600 to-violet-500 bg-clip-text text-transparent">
                    82
                  </div>
                  <div className="text-slate-400 text-xs">/100</div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Radar
                  </p>
                  <MiniRadar size={90} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <div className="text-xs font-bold text-slate-800">
                    Strategist
                  </div>
                  <MiniBarChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* ════════════════════════════════════════════════════════
          STATS — Violet icons & numbers
          ════════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Reveal key={idx} delay={idx * 80}>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4 transition-colors duration-200 group-hover:bg-violet-100">
                      <Icon className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="mt-1.5 text-sm text-slate-500 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES — 2-column grid with gradient borders
          ════════════════════════════════════════════════════════ */}
      <section className="bg-[#FAFAFE]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-[0.15em] uppercase text-violet-500 mb-3">
                Why Caliber
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                A smarter way to{" "}
                <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  measure PM skills
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="group relative h-full">
                    {/* Gradient border effect on hover */}
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-violet-400/0 via-cyan-400/0 to-violet-400/0 group-hover:from-violet-400/40 group-hover:via-cyan-400/30 group-hover:to-violet-400/40 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                    <div className="relative h-full bg-white rounded-2xl p-7 border border-slate-200/80 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/5 group-hover:border-transparent">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}
                        >
                          <Icon className={`w-5 h-5 ${f.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {f.title}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </div>

                      {/* Feature-specific visual elements */}
                      {idx === 0 && (
                        <div className="mt-5 space-y-2.5">
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
                              <span className="w-28 text-slate-600 shrink-0 truncate">
                                {item.name}
                              </span>
                              <div className="h-1.5 rounded-full bg-slate-100 flex-1">
                                <div
                                  className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-700"
                                  style={{ width: item.w }}
                                />
                              </div>
                              <span className="w-8 text-right text-slate-400 tabular-nums">
                                {item.pct}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {idx === 1 && (
                        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-start gap-2">
                            <span className="text-cyan-400 text-lg leading-none">
                              &ldquo;
                            </span>
                            <p className="text-xs text-slate-500 italic leading-relaxed">
                              Led migration to microservices, reducing deploy
                              time by 60%...
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <Badge className="bg-cyan-50 text-cyan-700 text-[10px] px-1.5 h-4 border border-cyan-200/60">
                              4.5/5
                            </Badge>
                            <span className="text-[10px] text-slate-400">
                              System Architecture
                            </span>
                          </div>
                        </div>
                      )}

                      {idx === 2 && (
                        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2.5 text-xs">
                            <Badge className="bg-rose-50 text-rose-600 text-[10px] px-1.5 h-4 border border-rose-200/60">
                              2.5
                            </Badge>
                            <div className="flex-1 h-px bg-gradient-to-r from-rose-300 via-violet-300 to-cyan-300" />
                            <Badge className="bg-cyan-50 text-cyan-700 text-[10px] px-1.5 h-4 border border-cyan-200/60">
                              4.0
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                            Your data skills can accelerate growth
                            experiments...
                          </p>
                        </div>
                      )}

                      {idx === 3 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {[
                            "Radar Chart",
                            "Strengths",
                            "Hidden Gems",
                            "Growth Plan",
                            "PDF Export",
                          ].map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          HOW IT WORKS — Numbered violet circles + cyan dots
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-[0.15em] uppercase text-cyan-500 mb-3">
                How It Works
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                From input to full report in{" "}
                <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  under 5 minutes
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting dots (desktop) */}
            <div className="hidden md:flex absolute top-10 left-[22%] right-[22%] items-center justify-between">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-300/60"
                />
              ))}
            </div>

            {steps.map(({ step, icon: Icon, title, desc }, idx) => (
              <Reveal key={step} delay={idx * 120}>
                <div className="relative text-center">
                  {/* Numbered violet circle */}
                  <div className="relative z-10 mx-auto mb-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20 transition-transform duration-200 hover:scale-105">
                      <Icon className="w-7 h-7" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-violet-600">
                        {step}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA — Subtle violet-to-cyan gradient background
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-cyan-50/60" />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #7C3AED 0.4px, transparent 0.4px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative py-24 px-6">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              {/* Decorative sparkle */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-cyan-50 mb-6">
                <Sparkles className="w-7 h-7 text-violet-500" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                <span className="text-slate-900">Ready to Discover </span>
                <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Your Caliber?
                </span>
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
                Join thousands of product managers who use Caliber to understand
                their strengths and accelerate their career growth.
              </p>

              <Link href="/assess">
                <Button
                  size="lg"
                  className="cursor-pointer text-base px-10 h-13 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-semibold shadow-lg shadow-rose-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
                >
                  Get Your Caliber Report
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="mt-5 text-sm text-slate-400">
                Free · No credit card · 5 min assessment
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
