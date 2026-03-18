"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DIMENSIONS,
  DIMENSION_CATEGORIES,
  ROLE_WEIGHTS,
  PM_ROLES,
  PM_LEVELS,
  getCategoryAverage,
} from "@/lib/constants";
import type { DimensionKey, PMRole, PMLevel } from "@/lib/types";
import type { DimensionCategory } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════
// Constants & Hardcoded Translations
// ═══════════════════════════════════════════════════════════

const CATEGORY_CONFIG: Record<
  DimensionCategory,
  { name: string; color: string; lightBg: string; borderClass: string }
> = {
  "product-execution": {
    name: "产品执行力",
    color: "#6366f1",
    lightBg: "bg-indigo-50",
    borderClass: "border-indigo-100",
  },
  "customer-insight": {
    name: "用户与数据洞察",
    color: "#06b6d4",
    lightBg: "bg-cyan-50",
    borderClass: "border-cyan-100",
  },
  "product-strategy": {
    name: "产品战略与商业",
    color: "#8b5cf6",
    lightBg: "bg-violet-50",
    borderClass: "border-violet-100",
  },
  "influencing-people": {
    name: "影响力与领导力",
    color: "#f59e0b",
    lightBg: "bg-amber-50",
    borderClass: "border-amber-100",
  },
  "ai-emerging": {
    name: "AI 与新兴能力",
    color: "#10b981",
    lightBg: "bg-emerald-50",
    borderClass: "border-emerald-100",
  },
};

const DIM_NAMES_ZH: Record<DimensionKey, string> = {
  "requirement-analysis": "需求分析与规格",
  "product-design": "产品设计与UX",
  "system-architecture": "系统架构理解",
  "zero-to-one": "从0到1交付",
  "user-research": "用户研究与洞察",
  "data-experimentation": "数据驱动与实验",
  "business-decomposition": "商业问题拆解",
  "commercialization-growth": "商业化与增长",
  "product-vision": "产品愿景与战略",
  "stakeholder-management": "干系人管理",
  "project-management": "项目管理与执行",
  "self-awareness": "自我认知与沟通",
  "ai-product-design": "AI 产品设计",
  "ai-tech-application": "AI 技术应用",
  "cross-cultural": "跨文化与本地化",
  "product-sense": "产品直觉与创造力",
};

const DIM_DESC_ZH: Record<DimensionKey, string> = {
  "requirement-analysis": "从业务/用户需求中提取清晰需求，撰写可执行的 PRD",
  "product-design": "用户旅程、信息架构、交互逻辑和用户体验设计",
  "system-architecture": "设计多模块协作方案，做出合理的技术权衡",
  "zero-to-one": "从想法到上线的完整交付，MVP 定义和迭代规划",
  "user-research": "访谈设计、洞察提取、需求验证和用户导向思维",
  "data-experimentation": "用数据发现问题，设计 A/B 测试，实验驱动迭代",
  "business-decomposition": "将模糊的商业问题结构化，找到核心杠杆点",
  "commercialization-growth": "定价策略、变现模型、LTV/CAC 和增长闭环",
  "product-vision": "定义长期产品方向、竞争定位和路线图优先级",
  "stakeholder-management": "对齐多方利益相关者，无授权影响力，跨部门推进",
  "project-management": "跨职能协调、优先级决策、资源管理和推进落地",
  "self-awareness": "准确自我评估，清晰表达经验价值，有效沟通",
  "ai-product-design": "设计 AI 原生产品体验，理解 AI UX 模式",
  "ai-tech-application": "理解模型能力/局限，Prompt 工程，AI 提效",
  "cross-cultural": "目标市场文化理解，本地化产品设计能力",
  "product-sense": "识别产品问题的直觉，创造性解决方案和权衡评估",
};

const ROLE_NAMES_ZH: Record<PMRole, string> = {
  "b2b-pm": "B2B 产品经理",
  "c2c-pm": "消费者产品经理",
  "ai-pm": "AI 产品经理",
  "growth-pm": "增长产品经理",
  "data-pm": "数据产品经理",
};

const ROLE_DESC_ZH: Record<PMRole, string> = {
  "b2b-pm": "企业工具、SaaS 平台、内部系统",
  "c2c-pm": "消费级应用、社交产品、电商",
  "ai-pm": "AI 原生产品、LLM 应用、ML 平台",
  "growth-pm": "用户获取、激活、留存、变现",
  "data-pm": "数据平台、分析工具、BI 仪表盘",
};

const ROLE_ICONS: Record<PMRole, React.ReactNode> = {
  "b2b-pm": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  "c2c-pm": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  "ai-pm": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
  ),
  "growth-pm": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
  "data-pm": (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
};

const LEVEL_NAMES_ZH: Record<PMLevel, string> = {
  junior: "初级 PM / APM",
  mid: "产品经理",
  senior: "高级 PM / Lead",
  director: "总监 / VP",
};

const LEVEL_DESC_ZH: Record<PMLevel, string> = {
  junior: "0-2年 · 学习阶段，执行明确任务",
  mid: "2-5年 · 独立负责产品模块",
  senior: "5-10年 · 驱动战略，跨团队影响力",
  director: "10年+ · 产品组合，组织级领导力",
};

const LEVEL_MULTIPLIER: Record<PMLevel, number> = {
  junior: 0.55,
  mid: 0.7,
  senior: 0.85,
  director: 1.0,
};

const SCORE_LABELS = ["", "入门", "基础", "熟练", "精通", "专家"];

// ═══════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════

function getScoreLevel(score: number) {
  if (score >= 86) return { label: "Expert 专家", color: "text-violet-600", bg: "bg-violet-50" };
  if (score >= 71) return { label: "Advanced 精通", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 51) return { label: "Competent 熟练", color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 31) return { label: "Developing 发展中", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "Entry Level 入门", color: "text-slate-600", bg: "bg-slate-100" };
}

function calculateWeightedScore(scores: Record<DimensionKey, number>, role: PMRole): number {
  const weights = ROLE_WEIGHTS[role];
  let weightedSum = 0;
  let maxSum = 0;
  for (const dim of DIMENSIONS) {
    const w = weights[dim.key] || 1;
    weightedSum += (scores[dim.key] || 0) * w;
    maxSum += 5 * w;
  }
  return Math.round((weightedSum / maxSum) * 100);
}

function getTargetScore(dimKey: DimensionKey, role: PMRole, level: PMLevel): number {
  const weight = ROLE_WEIGHTS[role][dimKey] || 1;
  return Math.min(5, weight * LEVEL_MULTIPLIER[level]);
}

function getCategoryTargetAvg(category: DimensionCategory, role: PMRole, level: PMLevel): number {
  const dims = DIMENSION_CATEGORIES[category];
  const sum = dims.reduce((acc, k) => acc + getTargetScore(k, role, level), 0);
  return sum / dims.length;
}

// ═══════════════════════════════════════════════════════════
// Score Slider Component
// ═══════════════════════════════════════════════════════════

function ScoreSlider({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="mt-3 mb-1">
      <div className="flex items-center w-full">
        {[1, 2, 3, 4, 5].map((n, idx) => (
          <Fragment key={n}>
            <button
              type="button"
              onClick={() => onChange(n)}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shrink-0 ${
                n <= value
                  ? "text-white"
                  : "bg-white text-slate-300 border-2 border-slate-200 hover:border-slate-300 hover:text-slate-400"
              }`}
              style={{
                ...(n <= value ? { backgroundColor: color } : {}),
                ...(n === value ? { boxShadow: `0 0 0 4px ${color}20`, transform: "scale(1.1)" } : {}),
              }}
            >
              {n}
            </button>
            {idx < 4 && (
              <div
                className="flex-1 h-0.5 rounded-full transition-colors duration-200"
                style={{ backgroundColor: n < value ? `${color}40` : "#e2e8f0" }}
              />
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-[10px] text-slate-300">入门</span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {SCORE_LABELS[value]}
        </span>
        <span className="text-[10px] text-slate-300">专家</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Radar Chart Component (inline SVG pentagon)
// ═══════════════════════════════════════════════════════════

function ResultRadarChart({
  categoryScores,
  categoryTargets,
}: {
  categoryScores: { key: DimensionCategory; name: string; score: number; color: string }[];
  categoryTargets: { key: DimensionCategory; target: number }[];
}) {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 145;
  const n = categoryScores.length;

  const getPoint = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + maxR * ratio * Math.cos(angle),
      y: cy + maxR * ratio * Math.sin(angle),
    };
  };

  const userPoly = categoryScores
    .map((_, i) => {
      const p = getPoint(i, categoryScores[i].score / 5);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const targetPoly = categoryTargets
    .map((_, i) => {
      const p = getPoint(i, categoryTargets[i].target / 5);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        <defs>
          <radialGradient id="sr-user-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
          </radialGradient>
          <filter id="sr-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {[1, 2, 3, 4, 5].map((level) => {
          const pts = Array.from({ length: n }, (_, i) => {
            const p = getPoint(i, level / 5);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={level === 5 ? 1 : 0.5}
              opacity={level === 5 ? 0.6 : 0.35}
            />
          );
        })}

        {/* Axes */}
        {categoryScores.map((_, i) => {
          const p = getPoint(i, 1);
          return (
            <line key={`ax-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth={0.5} />
          );
        })}

        {/* Target polygon */}
        <polygon
          points={targetPoly}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.45}
        />

        {/* User polygon */}
        <polygon
          points={userPoly}
          fill="url(#sr-user-fill)"
          stroke="#6366f1"
          strokeWidth={2.5}
          strokeLinejoin="round"
          filter="url(#sr-glow)"
        />

        {/* Data points */}
        {categoryScores.map((c, i) => {
          const p = getPoint(i, c.score / 5);
          return (
            <g key={`dp-${i}`}>
              <circle cx={p.x} cy={p.y} r={8} fill={c.color} opacity={0.12} />
              <circle cx={p.x} cy={p.y} r={5} fill={c.color} stroke="white" strokeWidth={2} />
            </g>
          );
        })}

        {/* Labels */}
        {categoryScores.map((c, i) => {
          const labelR = maxR + 40;
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <g key={`lbl-${i}`}>
              <text
                x={lx}
                y={ly - 7}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-bold"
                fill={c.color}
              >
                {c.name}
              </text>
              <text
                x={lx}
                y={ly + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[13px] font-semibold"
                fill="#334155"
              >
                {c.score.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 -mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-indigo-500 rounded" />
          你的水平
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400" />
          目标期望
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Gap Analysis Bar Component
// ═══════════════════════════════════════════════════════════

function GapBar({
  name,
  score,
  target,
  color,
  weight,
}: {
  name: string;
  score: number;
  target: number;
  color: string;
  weight: number;
}) {
  const gap = target - score;
  const isAbove = gap <= 0;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">{name}</span>
          <span className="text-[10px] text-slate-400">W{weight}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs tabular-nums">
          <span className="font-bold" style={{ color: isAbove ? "#10b981" : "#f59e0b" }}>
            {score}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">{target.toFixed(1)}</span>
          {!isAbove && (
            <span className="text-red-400 text-[10px] font-medium ml-0.5">-{gap.toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 w-px h-full bg-slate-400/50 z-10"
          style={{ left: `${(target / 5) * 100}%` }}
        />
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(score / 5) * 100}%`,
            backgroundColor: isAbove ? "#10b981" : color,
            opacity: isAbove ? 0.6 : 0.5,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════

export default function SkillsRadarPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<PMRole | null>(null);
  const [level, setLevel] = useState<PMLevel | null>(null);
  const [scores, setScores] = useState<Record<DimensionKey, number>>(() => {
    const init: Partial<Record<DimensionKey, number>> = {};
    DIMENSIONS.forEach((d) => (init[d.key] = 3));
    return init as Record<DimensionKey, number>;
  });
  const [expandedCats, setExpandedCats] = useState<Set<string>>(
    () => new Set(Object.keys(DIMENSION_CATEGORIES))
  );
  const [displayScore, setDisplayScore] = useState(0);

  const goToStep = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // ─── Computed Results ───
  const results = useMemo(() => {
    if (!role || !level) return null;

    const weightedScore = calculateWeightedScore(scores, role);
    const scoreLevel = getScoreLevel(weightedScore);

    const categoryScores = (Object.keys(DIMENSION_CATEGORIES) as DimensionCategory[]).map((cat) => ({
      key: cat,
      name: CATEGORY_CONFIG[cat].name,
      score: getCategoryAverage(scores, cat),
      color: CATEGORY_CONFIG[cat].color,
    }));

    const categoryTargets = (Object.keys(DIMENSION_CATEGORIES) as DimensionCategory[]).map((cat) => ({
      key: cat,
      target: getCategoryTargetAvg(cat, role, level),
    }));

    const dimResults = DIMENSIONS.map((d) => {
      const target = getTargetScore(d.key, role, level);
      const weight = ROLE_WEIGHTS[role][d.key] || 1;
      return {
        key: d.key,
        name: DIM_NAMES_ZH[d.key],
        score: scores[d.key],
        target,
        weight,
        gap: target - scores[d.key],
        contribution: scores[d.key] * weight,
      };
    });

    const strengths = [...dimResults].sort((a, b) => b.contribution - a.contribution).slice(0, 3);
    const weaknesses = [...dimResults]
      .filter((d) => d.gap > 0)
      .sort((a, b) => b.gap * b.weight - a.gap * a.weight)
      .slice(0, 3);

    return { weightedScore, scoreLevel, categoryScores, categoryTargets, dimResults, strengths, weaknesses };
  }, [scores, role, level]);

  // ─── Score count-up animation ───
  useEffect(() => {
    if (step !== 3 || !results) return;
    let current = 0;
    const target = results.weightedScore;
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setDisplayScore(current);
    }, 12);
    return () => clearInterval(timer);
  }, [step, results]);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
          >
            Caliber
          </Link>
          <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
            免费工具
          </span>
        </div>
      </header>

      {/* ════════════════════════════════════════════════ */}
      {/* Step 1: Role & Level Selection                  */}
      {/* ════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto px-6 py-14 animate-in fade-in duration-500">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-slate-500 border border-slate-200 mb-6">
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
              免费 · 无需登录 · 3 分钟
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              PM 能力雷达自评
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              快速了解你的 PM 能力画像，找到提升方向
            </p>
          </div>

          {/* Role selection */}
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              选择目标角色
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(PM_ROLES as typeof PM_ROLES).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                    role === r.id
                      ? "border-indigo-500 bg-white shadow-md ring-1 ring-indigo-500/20"
                      : "border-transparent bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`mb-3 ${role === r.id ? "text-indigo-500" : "text-slate-400"} transition-colors`}>
                    {ROLE_ICONS[r.id]}
                  </div>
                  <div className="font-semibold text-slate-900">{ROLE_NAMES_ZH[r.id]}</div>
                  <div className="text-sm text-slate-500 mt-1">{ROLE_DESC_ZH[r.id]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Level selection */}
          <div className="mb-12">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              选择资历级别
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(PM_LEVELS as typeof PM_LEVELS).map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                    level === l.id
                      ? "border-indigo-500 bg-white shadow-md ring-1 ring-indigo-500/20"
                      : "border-transparent bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-sm">{LEVEL_NAMES_ZH[l.id]}</div>
                  <div className="text-xs text-slate-500 mt-1">{LEVEL_DESC_ZH[l.id]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Next */}
          <div className="text-center">
            <Button
              size="lg"
              className="rounded-full px-10 h-12 text-base"
              disabled={!role || !level}
              onClick={() => goToStep(2)}
            >
              开始自评
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* Step 2: Self-Assessment                         */}
      {/* ════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto px-6 py-10 animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => goToStep(1)}
              className="text-sm text-slate-400 hover:text-slate-600 mb-4 inline-flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              返回
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">为每个维度打分</h1>
            <p className="mt-2 text-slate-500">
              基于你的真实经验，对 16 个 PM 能力维度进行 1-5 分自评
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>1 = 入门</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>3 = 熟练</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>5 = 专家</span>
            </div>
          </div>

          {/* Category accordion */}
          <div className="space-y-3">
            {(Object.entries(DIMENSION_CATEGORIES) as [DimensionCategory, DimensionKey[]][]).map(
              ([catKey, dimKeys]) => {
                const config = CATEGORY_CONFIG[catKey];
                const isOpen = expandedCats.has(catKey);
                const catAvg = dimKeys.reduce((s, dk) => s + scores[dk], 0) / dimKeys.length;

                return (
                  <div key={catKey} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                    {/* Category header */}
                    <button
                      type="button"
                      onClick={() => toggleCat(catKey)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                        <span className="font-semibold text-slate-900">{config.name}</span>
                        <span className="text-xs text-slate-400">{dimKeys.length} 维度</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold tabular-nums" style={{ color: config.color }}>
                          {catAvg.toFixed(1)}
                        </span>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {/* Dimensions */}
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-300">
                        {dimKeys.map((dk) => (
                          <div key={dk} className="pt-4">
                            <h4 className="text-sm font-semibold text-slate-800">{DIM_NAMES_ZH[dk]}</h4>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{DIM_DESC_ZH[dk]}</p>
                            <ScoreSlider
                              value={scores[dk]}
                              onChange={(v) => setScores((p) => ({ ...p, [dk]: v }))}
                              color={config.color}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* Submit */}
          <div className="text-center mt-8">
            <Button size="lg" className="rounded-full px-10 h-12 text-base" onClick={() => goToStep(3)}>
              查看结果
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* Step 3: Results                                 */}
      {/* ════════════════════════════════════════════════ */}
      {step === 3 && results && (
        <div className="max-w-3xl mx-auto px-6 py-10 animate-in fade-in duration-500">
          {/* Back */}
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            调整评分
          </button>

          {/* ── Score Hero Card ── */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm text-center mb-6">
            <div className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-3">
              PM 能力评估
            </div>
            <div className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight tabular-nums">
              {displayScore}
            </div>
            <div className="mt-3">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${results.scoreLevel.color} ${results.scoreLevel.bg}`}>
                {results.scoreLevel.label}
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-400">
              {ROLE_NAMES_ZH[role!]} · {LEVEL_NAMES_ZH[level!]}
            </div>
          </div>

          {/* ── Radar Chart ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-900 text-center mb-4">五维能力雷达</h2>
            <ResultRadarChart categoryScores={results.categoryScores} categoryTargets={results.categoryTargets} />
          </div>

          {/* ── Strengths & Weaknesses ── */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-emerald-800 text-sm">Top 3 优势</h3>
              </div>
              <div className="space-y-3">
                {results.strengths.map((s, i) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-xs">#{i + 1}</span>
                      <span className="text-sm font-medium text-slate-700">{s.name}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 tabular-nums">{s.score}/5</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-amber-800 text-sm">Top 3 短板</h3>
              </div>
              <div className="space-y-3">
                {results.weaknesses.length > 0 ? (
                  results.weaknesses.map((w, i) => (
                    <div key={w.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold text-xs">#{i + 1}</span>
                        <span className="text-sm font-medium text-slate-700">{w.name}</span>
                      </div>
                      <span className="text-xs text-amber-600 tabular-nums">
                        {w.score} → {w.target.toFixed(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">所有维度均达标</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Gap Analysis ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">差距分析</h2>
            <p className="text-sm text-slate-400 mb-6">
              你的得分 vs {LEVEL_NAMES_ZH[level!]}级{ROLE_NAMES_ZH[role!]}的目标期望
            </p>

            {(Object.entries(DIMENSION_CATEGORIES) as [DimensionCategory, DimensionKey[]][]).map(
              ([catKey, dimKeys]) => {
                const config = CATEGORY_CONFIG[catKey];
                return (
                  <div key={catKey} className="mb-5 last:mb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      <span className="text-xs font-semibold text-slate-500">{config.name}</span>
                    </div>
                    {dimKeys.map((dk) => (
                      <GapBar
                        key={dk}
                        name={DIM_NAMES_ZH[dk]}
                        score={scores[dk]}
                        target={getTargetScore(dk, role!, level!)}
                        color={config.color}
                        weight={ROLE_WEIGHTS[role!][dk] || 1}
                      />
                    ))}
                  </div>
                );
              }
            )}
          </div>

          {/* ── CTA ── */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-8 md:p-10 text-center border border-indigo-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              自评只是开始
            </h2>
            <p className="mt-3 text-slate-600 max-w-md mx-auto leading-relaxed">
              让 AI 基于你的真实工作经历，给出更客观、更全面的能力评估。发现自评盲区，获取个性化提升建议。
            </p>
            <Link href="/assess" className="mt-6 inline-block">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                试试 Caliber AI 评估
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <p className="mt-3 text-xs text-slate-400">免费试用 · 3 分钟出结果 · 16 维度深度分析</p>
          </div>

          {/* Restart */}
          <div className="text-center mt-8 pb-8">
            <button
              onClick={() => {
                setRole(null);
                setLevel(null);
                setScores(() => {
                  const init: Partial<Record<DimensionKey, number>> = {};
                  DIMENSIONS.forEach((d) => (init[d.key] = 3));
                  return init as Record<DimensionKey, number>;
                });
                goToStep(1);
              }}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              重新评估
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
