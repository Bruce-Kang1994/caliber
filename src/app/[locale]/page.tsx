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

// ─── Hero Radar — vivid animated pentagon with orbits, particles, glow ───
const RADAR_CATEGORIES = [
  { label: "Product", score: 4.2, color: "#6366f1" },   // indigo
  { label: "Insight", score: 3.6, color: "#06b6d4" },    // cyan
  { label: "Strategy", score: 4.5, color: "#8b5cf6" },   // violet
  { label: "People", score: 3.8, color: "#f59e0b" },     // amber
  { label: "AI", score: 4.0, color: "#10b981" },          // emerald
];

const PARTICLES = [
  { x: 75, y: 110, r: 1.8, color: "#6366f1", dur: "5s", delay: "0s" },
  { x: 385, y: 85, r: 1.2, color: "#06b6d4", dur: "4.5s", delay: "1.2s" },
  { x: 410, y: 300, r: 1.6, color: "#8b5cf6", dur: "5.5s", delay: "0.6s" },
  { x: 55, y: 340, r: 1.2, color: "#f59e0b", dur: "4s", delay: "1.8s" },
  { x: 240, y: 430, r: 1.8, color: "#10b981", dur: "5s", delay: "0.3s" },
  { x: 140, y: 55, r: 1, color: "#06b6d4", dur: "6s", delay: "2.1s" },
  { x: 360, y: 400, r: 1, color: "#6366f1", dur: "4.5s", delay: "1.5s" },
  { x: 330, y: 45, r: 1.4, color: "#f59e0b", dur: "5s", delay: "0.9s" },
  { x: 95, y: 230, r: 0.8, color: "#10b981", dur: "5.5s", delay: "2.5s" },
  { x: 400, y: 180, r: 0.8, color: "#8b5cf6", dur: "4s", delay: "3s" },
];

function HeroRadar() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setProgress(1), 400);
    return () => clearTimeout(t);
  }, []);

  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const r = 160;
  const data = RADAR_CATEGORIES;

  const getPoint = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const dataPoints = data.map((d, i) => getPoint(i, (d.score / 5) * progress));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Precompute label positions for hover hit areas
  const labelPositions = data.map((_, i) => {
    const labelR = r + 42;
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
    };
  });

  // Check if an edge is adjacent to the hovered dimension
  const isEdgeAdjacentToHovered = (edgeIndex: number) => {
    if (hovered === null) return false;
    const prev = (hovered - 1 + data.length) % data.length;
    return edgeIndex === hovered || edgeIndex === prev;
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes hero-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hero-particle {
          0%, 100% { opacity: 0; transform: translateY(0px); }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-18px); }
        }
        @keyframes hero-breathe {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.06); }
        }
        @keyframes hero-ring-pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.06; }
        }
      `}</style>

      {/* Multi-layer glow behind SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-indigo-500/[0.07] blur-[80px]" style={{ animation: "hero-breathe 4s ease-in-out infinite" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-violet-500/[0.09] blur-[50px]" style={{ animation: "hero-breathe 5s ease-in-out infinite 1s" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 rounded-full bg-cyan-400/[0.07] blur-[35px]" style={{ animation: "hero-breathe 3.5s ease-in-out infinite 0.5s" }} />
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative mx-auto">
        <defs>
          {/* Per-edge gradients for colored strokes */}
          {data.map((d, i) => {
            const next = data[(i + 1) % data.length];
            const p1 = dataPoints[i];
            const p2 = dataPoints[(i + 1) % data.length];
            return (
              <linearGradient key={`eg-${i}`} id={`eg-${i}`} gradientUnits="userSpaceOnUse"
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}>
                <stop offset="0%" stopColor={d.color} />
                <stop offset="100%" stopColor={next.color} />
              </linearGradient>
            );
          })}
          {/* Orbit gradient */}
          <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="33%" stopColor="#06b6d4" />
            <stop offset="66%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          {/* Radial fill */}
          <radialGradient id="rfill2" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
          </radialGradient>
          {/* Center core glow */}
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Edge glow filter */}
          <filter id="edge-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Point glow filter */}
          <filter id="pt-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Score glow filter (subtle) */}
          <filter id="score-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Rotating orbit rings (strengthened) ── */}
        <circle cx={cx} cy={cy} r={r + 28} fill="none" stroke="url(#orbit-grad)"
          strokeWidth={1.2} strokeDasharray="8 6" opacity={0.5}
          filter="url(#edge-glow)"
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: "hero-orbit 25s linear infinite" }} />
        <circle cx={cx} cy={cy} r={r + 40} fill="none" stroke="#94a3b8"
          strokeWidth={0.6} strokeDasharray="3 10" opacity={0.25}
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: "hero-orbit 40s linear infinite reverse" }} />

        {/* ── Orbit light points ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "hero-orbit 25s linear infinite" }}>
          <circle cx={cx} cy={cy - (r + 28)} r={3} fill="#6366f1" opacity={0.8} filter="url(#pt-glow)" />
        </g>
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "hero-orbit 40s linear infinite reverse" }}>
          <circle cx={cx + (r + 40)} cy={cy} r={2} fill="#8b5cf6" opacity={0.6} filter="url(#pt-glow)" />
        </g>

        {/* ── Center glow core ── */}
        <circle cx={cx} cy={cy} r={90} fill="url(#core-glow)" />

        {/* ── Grid rings ── */}
        {[1, 2, 3, 4, 5].map((level) => {
          const pts = data.map((_, i) => getPoint(i, level / 5)).map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <polygon key={level} points={pts} fill="none" stroke="#94a3b8"
              strokeWidth={level === 5 ? 0.7 : 0.3} opacity={level === 5 ? 0.3 : 0.12} />
          );
        })}

        {/* ── Axes — faint colored lines ── */}
        {data.map((d, i) => {
          const p = getPoint(i, 1);
          return (
            <line key={`ax-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke={d.color} strokeWidth={0.5} opacity={0.12} />
          );
        })}

        {/* ── Filled data polygon ── */}
        <polygon points={polygon} fill="url(#rfill2)"
          style={{ transition: "all 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }} />

        {/* ── Per-edge colored strokes with glow ── */}
        {dataPoints.map((p, i) => {
          const next = dataPoints[(i + 1) % data.length];
          const isAdj = isEdgeAdjacentToHovered(i);
          const dimmed = hovered !== null && !isAdj;
          return (
            <line key={`edge-${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y}
              stroke={`url(#eg-${i})`}
              strokeWidth={isAdj ? 4 : 2.5}
              strokeLinecap="round"
              filter="url(#edge-glow)"
              opacity={dimmed ? 0.3 : 1}
              style={{ transition: "all 0.25s ease-out, x1 1.4s cubic-bezier(0.22, 1, 0.36, 1), y1 1.4s cubic-bezier(0.22, 1, 0.36, 1), x2 1.4s cubic-bezier(0.22, 1, 0.36, 1), y2 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }} />
          );
        })}

        {/* ── Floating particles ── */}
        {PARTICLES.map((pt, i) => (
          <circle key={`fp-${i}`} cx={pt.x} cy={pt.y} r={pt.r} fill={pt.color}
            style={{ animation: `hero-particle ${pt.dur} ease-in-out infinite ${pt.delay}` }} />
        ))}

        {/* ── Data points with animated glow ── */}
        {dataPoints.map((p, i) => {
          const isActive = hovered === i;
          const dimmed = hovered !== null && !isActive;
          return (
            <g key={`dp-${i}`} style={{ transition: "opacity 0.25s ease-out" }} opacity={dimmed ? 0.3 : 1}>
              {/* Pulsing outer ring */}
              <circle cx={p.x} cy={p.y} r={isActive ? 24 : 16} fill={data[i].color}
                opacity={isActive ? 0.15 : 0.1}
                style={{ transition: "r 0.25s ease-out, opacity 0.25s ease-out", animation: `hero-ring-pulse 2.5s ease-in-out infinite ${i * 0.5}s` }} />
              {/* Soft halo */}
              <circle cx={p.x} cy={p.y} r={10} fill={data[i].color} opacity={0.08} filter="url(#pt-glow)" />
              {/* Main dot */}
              <circle cx={p.x} cy={p.y} r={isActive ? 8 : 5.5} fill={data[i].color}
                style={{ transition: "r 0.25s ease-out" }} />
              {/* Inner highlight */}
              <circle cx={p.x} cy={p.y} r={isActive ? 3 : 2.2} fill="white" opacity={0.85}
                style={{ transition: "r 0.25s ease-out" }} />
            </g>
          );
        })}

        {/* ── Labels with hover hit areas ── */}
        {data.map((d, i) => {
          const lx = labelPositions[i].x;
          const ly = labelPositions[i].y;
          const isActive = hovered === i;
          const dimmed = hovered !== null && !isActive;
          return (
            <g key={`lbl-${i}`} style={{ transition: "opacity 0.25s ease-out" }} opacity={dimmed ? 0.3 : 1}>
              {/* Invisible hit area for hover */}
              <circle cx={lx} cy={ly} r={30} fill="transparent" cursor="pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)} />
              <text x={lx} y={ly - 7} textAnchor="middle" dominantBaseline="middle"
                className={`${isActive ? "text-[15px]" : "text-[12px]"} font-bold tracking-wide`}
                fill={d.color}
                filter={isActive ? "url(#edge-glow)" : undefined}
                style={{ transition: "font-size 0.25s ease-out" }}>
                {d.label}
              </text>
              <text x={lx} y={ly + 9} textAnchor="middle" dominantBaseline="middle"
                className={`${isActive ? "text-[13px]" : "text-[11px]"} font-medium`}
                fill={isActive ? d.color : "#94a3b8"}
                style={{ transition: "font-size 0.25s ease-out, fill 0.25s ease-out" }}>
                {d.score}
              </text>
            </g>
          );
        })}

        {/* ── Center score (enhanced) ── */}
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle"
          className="text-[32px] font-black tracking-tight" fill="#1e293b"
          filter="url(#score-glow)"
          opacity={progress} style={{ transition: "opacity 1s ease-out 1.2s" }}>
          82
        </text>
        {/* Decorative divider line */}
        <rect x={cx - 15} y={cy + 5} width={30} height={1} rx={0.5}
          fill="#6366f1" opacity={progress ? 0.3 : 0}
          style={{ transition: "opacity 1s ease-out 1.3s" }} />
        <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="middle"
          className="text-[11px] font-semibold tracking-[0.3em]" fill="#6366f1"
          opacity={progress} style={{ transition: "opacity 1s ease-out 1.4s" }}>
          CALIBER
        </text>
      </svg>
    </div>
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
  icon,
}: {
  title: string;
  subtitle: string;
  dark?: boolean;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl min-h-[340px] flex flex-col items-center justify-center text-center px-8 py-14 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        dark
          ? "bg-slate-900 text-white"
          : accent
            ? "bg-gradient-to-br from-indigo-50 to-violet-50 text-slate-900"
            : "bg-white text-slate-900"
      }`}
    >
      {icon && (
        <div className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center ${
          dark ? "bg-white/[0.08]" : accent ? "bg-white/80 shadow-sm" : "bg-slate-50"
        }`}>
          {icon}
        </div>
      )}
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

      {/* ═══ Stats Bar ═══ */}
      <section className="bg-white border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: t("landing.stat1Number"), label: t("landing.stat1Label") },
            { num: t("landing.stat2Number"), label: t("landing.stat2Label") },
            { num: t("landing.stat3Number"), label: t("landing.stat3Label") },
            { num: t("landing.stat4Number"), label: t("landing.stat4Label") },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {s.num}
              </div>
              <div className="mt-1.5 text-sm text-slate-500 leading-snug">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
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

      {/* ═══ How It Works ═══ */}
      <section className="bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              {t("landing.howItWorks")}
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: t("landing.step1Title"),
                desc: t("landing.step1Desc"),
                icon: (
                  <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: t("landing.step2Title"),
                desc: t("landing.step2Desc"),
                icon: (
                  <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: t("landing.step3Title"),
                desc: t("landing.step3Desc"),
                icon: (
                  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-slate-300 tracking-widest mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
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
            icon={
              <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            }
          />
          <GridCard
            title={t("landing.gridTitle2")}
            subtitle={t("landing.gridSub2")}
            dark
            icon={
              <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            }
          />
          <GridCard
            title={t("landing.gridTitle3")}
            subtitle={t("landing.gridSub3")}
            accent
            icon={
              <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
            }
          />
          <GridCard
            title={t("landing.gridTitle4")}
            subtitle={t("landing.gridSub4")}
            dark
            icon={
              <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            }
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
