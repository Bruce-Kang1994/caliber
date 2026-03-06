# Caliber 全方位产品评审报告 V2 — 实施指南

> **生成日期**: 2026-03-04
> **项目路径**: `/Users/kangxin/Desktop/pm-assessment/`
> **技术栈**: Next.js 16.1.6 + React 19 + TypeScript + Tailwind 4 + Supabase + next-intl 4.8
> **目标**: 提供给 Claude Code 的逐任务实施指南，每个任务包含精确的文件路径、行号、代码变更和验证方式

---

## 代码库关键文件索引

| 简称 | 完整路径 |
|------|---------|
| `constants.ts` | `src/lib/constants.ts` |
| `types.ts` | `src/lib/types.ts` |
| `StepIndicator.tsx` | `src/components/StepIndicator.tsx` |
| `RadarChart.tsx` | `src/components/RadarChart.tsx` |
| `AppHeader.tsx` | `src/components/AppHeader.tsx` |
| `report/page.tsx` | `src/app/[locale]/assess/report/page.tsx` |
| `input/page.tsx` | `src/app/[locale]/assess/input/page.tsx` |
| `share/page.tsx` | `src/app/[locale]/share/[token]/page.tsx` |
| `landing/page.tsx` | `src/app/[locale]/page.tsx` |
| `layout.tsx` | `src/app/[locale]/layout.tsx` |
| `globals.css` | `src/app/globals.css` |
| `en.json` | `src/messages/en.json` |
| `zh.json` | `src/messages/zh.json` |
| `ja.json` | `src/messages/ja.json` |
| `ko.json` | `src/messages/ko.json` |
| `package.json` | `package.json` |

---

## Phase 4A：关键Bug修复 + 基础完善

### 任务 4A-1：修复 Growth Hacker 原型计算 Bug

**文件**: `src/lib/constants.ts` 第 260 行
**问题**: `business` 变量已经是 `getCategoryAverage(scores, "business")` 的结果（第253行），第260行又重复取同一个值取平均，等价于 `business` 本身。Growth Hacker 永远和 Strategist 分数相同，无法被单独分配。

**当前代码** (第260行):
```typescript
{ key: "growth-hacker", score: (business + getCategoryAverage(scores, "business")) / 2, label: "The Growth Hacker" },
```

**修改为**:
```typescript
{ key: "growth-hacker", score: (scores["growth"] ?? 0) * 0.35 + (scores["data-driven"] ?? 0) * 0.35 + (scores["commercialization"] ?? 0) * 0.3, label: "The Growth Hacker" },
```

**理由**: Growth Hacker 应该以增长(growth)、数据驱动(data-driven)、商业化(commercialization)为核心评估维度，而非单纯的商业类别平均值。

**验证**: 构造一个 scores 对象，其中 growth=4.5, data-driven=4.0, commercialization=3.5，business-decomposition=2.0。确认 assignArchetype 返回 "growth-hacker" 而非 "strategist"。

---

### 任务 4A-2：Step 标签国际化

**文件**: `src/components/StepIndicator.tsx` 第 11 行
**问题**: `STEP_SHORT` 数组硬编码英文 `["Role", "Input", "Analyze", "Report"]`

**当前代码**:
```typescript
const STEP_SHORT = ["Role", "Input", "Analyze", "Report"];
```

**修改方案**: 删除 `STEP_SHORT` 常量，改用 `useTranslations()` 获取 i18n 文案：

```typescript
// 删除第11行的 STEP_SHORT

// 在 StepIndicatorBar 组件内部（第29行后），添加：
const t = useTranslations();
const stepLabels = [
  t("steps.role"),
  t("steps.input"),
  t("steps.analyze"),
  t("steps.report"),
];
```

第68行将 `{STEP_SHORT[i]}` 改为 `{stepLabels[i]}`

**4个locale文件各增加 `steps` 字段**:

**en.json** 添加:
```json
"steps": {
  "role": "Role",
  "input": "Input",
  "analyze": "Analyze",
  "report": "Report"
}
```

**zh.json** 添加:
```json
"steps": {
  "role": "选角色",
  "input": "填经历",
  "analyze": "分析中",
  "report": "报告"
}
```

**ja.json** 添加:
```json
"steps": {
  "role": "職種",
  "input": "入力",
  "analyze": "分析",
  "report": "レポート"
}
```

**ko.json** 添加:
```json
"steps": {
  "role": "직무",
  "input": "입력",
  "analyze": "분석",
  "report": "보고서"
}
```

---

### 任务 4A-3：Share 页面 i18n 修复

**文件**: `src/app/[locale]/share/[token]/page.tsx`
**问题**: 3处硬编码英文

**问题1** — 第13-19行 `ROLE_LABELS` 硬编码英文:
```typescript
const ROLE_LABELS: Record<string, string> = {
  "b2b-pm": "B2B Product Manager",
  ...
};
```
**修改**: 删除 `ROLE_LABELS` 常量。第97行改为：
```typescript
<h1 className="text-3xl font-bold text-slate-900">
  {t(`roles.${result.roleType}`)}
</h1>
```

**问题2** — 第21-27行 `getScoreLevel` 硬编码英文 label:
```typescript
function getScoreLevel(score: number) {
  if (score >= 86) return { label: "Expert", ... };
  ...
}
```
**修改**: 函数签名添加 `t` 参数并改用 i18n:
```typescript
function getScoreLevel(score: number, t: (key: string) => string) {
  if (score >= 86) return { label: t("report.levelExpert"), color: "text-violet-600", bg: "bg-violet-50" };
  if (score >= 71) return { label: t("report.levelAdvanced"), color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 51) return { label: t("report.levelCompetent"), color: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 31) return { label: t("report.levelDeveloping"), color: "text-amber-600", bg: "bg-amber-50" };
  return { label: t("report.levelBeginner"), color: "text-slate-600", bg: "bg-slate-100" };
}
```
调用处（第108行）改为 `getScoreLevel(result.weightedScore, t)`

**问题3** — 第173行硬编码英文 CTA:
```tsx
<p className="text-slate-600 mb-4">Want to know your own PM caliber?</p>
```
**修改**: 改为 `{t("share.ctaText")}`

**4个locale文件的 `share` 字段增加**:

| key | en | zh | ja | ko |
|-----|----|----|----|----|
| `share.ctaText` | `"Want to know your own PM caliber?"` | `"想知道你的PM水准吗？"` | `"あなたのPM実力を知りたいですか？"` | `"당신의 PM 실력을 알고 싶으세요?"` |

---

### 任务 4A-4：添加 OG Meta 标签

**文件**: `src/app/[locale]/layout.tsx` 第14-18行
**问题**: 仅有基础 title/description，无 Open Graph 和 Twitter Card 标签，社交分享无预览图

**当前代码**:
```typescript
export const metadata: Metadata = {
  title: "Caliber — What's Your PM Caliber?",
  description: "AI-powered capability assessment...",
};
```

**修改为**:
```typescript
export const metadata: Metadata = {
  title: "Caliber — What's Your PM Caliber?",
  description:
    "AI-powered capability assessment across 15 dimensions, tailored to your target PM role. Get evidence-based scores and a personalized upgrade plan.",
  metadataBase: new URL("https://caliber.pm"),
  openGraph: {
    title: "Caliber — Know Your PM Caliber",
    description: "AI analyzes your real experience across 15 dimensions. Get your strengths, gaps, and upgrade plan in 5 minutes.",
    type: "website",
    siteName: "Caliber",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caliber - PM Capability Assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caliber — Know Your PM Caliber",
    description: "AI analyzes your real experience across 15 dimensions. Get your strengths, gaps, and upgrade plan in 5 minutes.",
    images: ["/og-image.png"],
  },
};
```

**额外**: 需要在 `public/` 目录下放一张 1200x630 的 `og-image.png`。如果暂时没有设计稿，可以用代码生成一个带 Caliber logo + tagline 的简单 OG 图，或使用 Next.js 的 `opengraph-image.tsx` 动态生成。

---

### 任务 4A-5：输入页最小内容质量检查

**文件**: `src/app/[locale]/assess/input/page.tsx` 第176行
**问题**: 用户只需填 company + title（各1字符即可提交），AI因缺乏证据会给低分，体验极差

**当前代码**:
```typescript
const hasValidExperience = experiences.some(
  (exp) => exp.company.trim() && exp.title.trim()
);
```

**修改为**:
```typescript
// 计算总输入内容长度
const totalInputLength = experiences.reduce((total, exp) => {
  const expText = [
    exp.company,
    exp.title,
    exp.duration,
    exp.responsibilities,
    ...exp.projects.flatMap(p => [p.name, p.background, p.actions, p.results]),
    ...exp.achievements,
  ].join("");
  return total + expText.length;
}, 0);

const hasValidExperience = experiences.some(
  (exp) => exp.company.trim() && exp.title.trim()
);

const hasEnoughContent = totalInputLength >= 100;
```

第475行 submit 按钮的 `disabled` 改为:
```tsx
<Button disabled={!hasValidExperience || !hasEnoughContent} onClick={handleSubmit}>
```

在按钮下方（第477行后）添加不足提示:
```tsx
{hasValidExperience && !hasEnoughContent && (
  <p className="text-xs text-amber-600 text-center mt-2">
    {t("input.minContentHint")}
  </p>
)}
```

**4个locale文件的 `input` 字段增加**:

| key | en | zh | ja | ko |
|-----|----|----|----|----|
| `input.minContentHint` | `"Please provide more details (at least responsibilities or one project) for a meaningful assessment."` | `"请提供更多细节（至少填写职责或一个项目），以获得有意义的评估。"` | `"より正確な評価のため、詳細情報（職責または1つ以上のプロジェクト）を追加してください。"` | `"더 의미 있는 평가를 위해 세부 정보(업무 또는 프로젝트 1개 이상)를 추가해 주세요."` |

---

### 任务 4A-6：报告页分数动画（从0计数到最终值）

**文件**: `src/app/[locale]/assess/report/page.tsx` 第172-174行
**问题**: 分数直接显示，无动画效果，缺乏仪式感

**修改方案**: 添加一个 `useCountUp` hook 并应用到分数显示

在 `ReportContent` 函数内（第29行后）添加:
```typescript
// 分数计数动画
const [displayScore, setDisplayScore] = useState(0);

useEffect(() => {
  if (!result) return;
  const target = result.weightedScore;
  const duration = 1500; // ms
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      setDisplayScore(target);
      clearInterval(timer);
    } else {
      setDisplayScore(Math.round(current));
    }
  }, duration / steps);
  return () => clearInterval(timer);
}, [result]);
```

第173行将 `{result.weightedScore}` 替换为 `{displayScore}`

---

### 任务 4A-7：移动端修复

#### 7a. 报告数字太大
**文件**: `src/app/[locale]/assess/report/page.tsx` 第173行
**当前**: `className="text-7xl font-bold"`
**修改为**: `className="text-5xl sm:text-7xl font-bold"`

同时修改第174行 `/100` 部分:
**当前**: `className="text-2xl text-slate-400 mb-3"`
**修改为**: `className="text-xl sm:text-2xl text-slate-400 mb-2 sm:mb-3"`

#### 7b. 雷达图响应式高度
**文件**: `src/components/RadarChart.tsx` 第20行
**当前**: `<div className="w-full h-[420px]">`
**修改为**: `<div className="w-full h-[300px] sm:h-[420px]">`

同时修改 `report/page.tsx` 第201行:
**当前**: `<div className="h-[400px]">`
**修改为**: `<div className="h-[300px] sm:h-[400px]">`

#### 7c. Share 页面分数同样缩小
**文件**: `src/app/[locale]/share/[token]/page.tsx` 第105行
**当前**: `className="text-7xl font-bold mb-2"`
**修改为**: `className="text-5xl sm:text-7xl font-bold mb-2"`

---

## Phase 4B：Landing Page 升级

### 任务 4B-1：Hero 区域添加样本报告交互预览

**文件**: `src/app/[locale]/page.tsx` Hero Section（第25-57行）
**问题**: 纯文字 Hero，无产品预览，用户不知道报告长什么样

**修改方案**: 在 Hero CTA 按钮下方（第55行后），添加一个"样本报告"预览卡片：

```tsx
{/* Sample Report Preview */}
<div className="mt-16 max-w-3xl mx-auto">
  <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 text-center">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
        {t("landing.sampleReportLabel")}
      </p>
      <div className="flex items-end justify-center gap-1">
        <span className="text-4xl sm:text-5xl font-bold">82</span>
        <span className="text-lg text-slate-400 mb-1">/100</span>
      </div>
      <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
        <span className="text-xs font-semibold text-blue-600">{t("report.levelAdvanced")}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t("report.archetypeLabel")}</p>
        <p className="text-lg font-bold">{t("report.archetype_visionary")}</p>
      </div>
    </div>
    {/* Mini radar chart area - 用简化的5点图示意 */}
    <div className="p-6 grid grid-cols-5 gap-3 text-center">
      {[
        { label: t("dimensionCategories.product-hard"), score: 4.2, color: "bg-blue-500" },
        { label: t("dimensionCategories.business"), score: 3.5, color: "bg-emerald-500" },
        { label: t("dimensionCategories.ai"), score: 4.6, color: "bg-violet-500" },
        { label: t("dimensionCategories.soft"), score: 3.8, color: "bg-amber-500" },
        { label: t("dimensionCategories.international"), score: 2.5, color: "bg-slate-400" },
      ].map((cat, i) => (
        <div key={i}>
          <div className="h-16 flex items-end justify-center mb-2">
            <div
              className={`w-6 rounded-t-sm ${cat.color}`}
              style={{ height: `${(cat.score / 5) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">{cat.label}</p>
          <p className="text-xs font-bold text-slate-700">{cat.score}</p>
        </div>
      ))}
    </div>
    {/* Blur overlay hinting full report */}
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-4">
      <span className="text-xs text-slate-400">{t("landing.sampleReportHint")}</span>
    </div>
  </div>
</div>
```

**4个locale文件添加**:

| key | en | zh | ja | ko |
|-----|----|----|----|----|
| `landing.sampleReportLabel` | `"Sample Report"` | `"示例报告"` | `"サンプルレポート"` | `"샘플 보고서"` |
| `landing.sampleReportHint` | `"Get your own personalized report →"` | `"获取你的专属报告 →"` | `"あなた専用のレポートを取得 →"` | `"나만의 맞춤 보고서 받기 →"` |

---

### 任务 4B-2：Stats Bar 改为价值主张信号

**文件**: `src/app/[locale]/page.tsx` Stats Bar Section（第59-73行）
**问题**: 当前 Stats Bar 显示功能参数（15维度/5角色/AI/5分钟），无社会证明

**修改方案**: 将4个stat改为价值主张，替换4个locale文件中的内容：

| key | en（新值） | zh | ja | ko |
|-----|-----------|----|----|-----|
| `stat1Number` | `"15"` → `"15"` | 不变 | 不变 | 不变 |
| `stat1Label` | `"Capability Dimensions"` → `"Dimensions from Top Tech Hiring Rubrics"` | `"源自头部科技公司招聘标准的维度"` | `"トップテック企業の採用基準に基づく次元"` | `"탑 테크 기업 채용 기준 기반 차원"` |
| `stat2Number` | `"5"` → `"5 min"` | `"5 分钟"` | `"5分"` | `"5분"` |
| `stat2Label` | `"Role Specializations"` → `"From Input to Full Report"` | `"从输入到完整报告"` | `"入力からフルレポートまで"` | `"입력부터 전체 보고서까지"` |
| `stat3Number` | `"AI"` → `"AI"` | 不变 | 不变 | 不变 |
| `stat3Label` | `"Powered Analysis"` → `"Evidence-Based, Not Generic"` | `"基于证据，非泛泛而谈"` | `"汎用ではない、証拠に基づく分析"` | `"일반적이지 않은 증거 기반 분석"` |
| `stat4Number` | `"< 5 min"` → `"100%"` | `"100%"` | `"100%"` | `"100%"` |
| `stat4Label` | `"To Complete"` → `"Personalized to Your Experience"` | `"基于你的真实经历个性化"` | `"あなたの経験に完全パーソナライズ"` | `"당신의 경험에 완전 맞춤화"` |

---

### 任务 4B-3：Features 区域配产品截图/Mini组件预览

**文件**: `src/app/[locale]/page.tsx` Features Section（第76-123行）
**问题**: 纯文字+图标，无产品实际截图

**修改方案**: 在每个 feature 的描述文字后添加一个 mini 组件预览。例如：

Feature 1 (角色权重) — 添加一个小型的权重对比条:
```tsx
{/* Mini weight visualization */}
<div className="mt-4 space-y-1.5">
  {[
    { label: "B2B", weights: [5, 4, 5, 3] },
    { label: "AI", weights: [4, 4, 4, 5] },
  ].map((r) => (
    <div key={r.label} className="flex items-center gap-2 text-xs">
      <span className="w-8 text-slate-400">{r.label}</span>
      <div className="flex gap-0.5 flex-1">
        {r.weights.map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full bg-blue-500/80"
            style={{ width: `${(w / 5) * 100}%`, opacity: 0.3 + w * 0.14 }}
          />
        ))}
      </div>
    </div>
  ))}
</div>
```

Feature 2 (证据评分) — 显示一个迷你评分行:
```tsx
<div className="mt-4 bg-emerald-50 rounded-lg p-3">
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-600">Data-Driven Decision</span>
    <span className="font-bold text-emerald-600">4.2/5.0</span>
  </div>
  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
    "Led A/B testing framework that improved conversion by 23%..."
  </p>
</div>
```

Feature 3 (升级建议) — 显示一个迷你建议卡:
```tsx
<div className="mt-4 bg-amber-50 rounded-lg p-3">
  <p className="text-xs font-medium text-amber-700">Growth: 2.0 → How to level up</p>
  <p className="text-[10px] text-slate-500 mt-1">
    "Your data skills (4.2) can accelerate growth experiments..."
  </p>
</div>
```

---

### 任务 4B-4：添加滚动触发渐入动画

**文件**: `src/app/[locale]/page.tsx` 整页
**问题**: 除 hover scale 外无任何入场动画

**修改方案**: 创建一个简单的 `useInView` hook 或使用 Intersection Observer：

方案A（推荐，无额外依赖）— 创建 `src/hooks/useInView.ts`:
```typescript
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

然后在 landing page 的各个 section 使用:
```tsx
function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

在 Stats Bar、Features、Report Preview、How It Works、Why Caliber 各 section 外层包裹 `<FadeInSection>`

---

### 任务 4B-5：字体升级 Geist → Inter

**文件**: `src/app/[locale]/layout.tsx` 第5行和第9-12行
**问题**: Geist 是 Vercel 默认字体，"Next.js 模板感"太强

**当前代码**:
```typescript
import { Geist } from "next/font/google";
// ...
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

**修改为**:
```typescript
import { Inter } from "next/font/google";
// ...
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
```

第38行 body className:
**当前**: `className={`${geistSans.variable} font-sans antialiased`}`
**修改为**: `className={`${inter.variable} font-sans antialiased`}`

**文件**: `src/app/globals.css` 第10行
**当前**: `--font-sans: var(--font-geist-sans);`
**修改为**: `--font-sans: var(--font-inter);`

---

### 任务 4B-6：定位文案更新

**问题**: 当前 heroTitle "Before Your Next Interview" 限制了使用场景

**4个locale文件 `landing.heroTitle` 修改**:

| locale | 当前 | 改为 |
|--------|------|------|
| en | `"Know Your PM Caliber\nBefore Your Next Interview"` | `"Know exactly where you stand\n— and what to do next"` |
| zh | `"面试前，先摸清\n你的PM实力水位"` | `"5分钟，精准定位\n你的PM能力坐标"` |
| ja | `"次の面接の前に\nPMとしての実力を把握しよう"` | `"5分でわかる\nあなたのPM実力と次の一手"` |
| ko | `"다음 면접 전에\n나의 PM 실력을 파악하세요"` | `"5분 만에 파악하는\n나의 PM 역량과 다음 스텝"` |

---

## Phase 4C：付费墙 + 商业化

### 任务 4C-1：报告页付费墙（Free用户看摘要，模糊详细内容）

**文件**: `src/app/[locale]/assess/report/page.tsx`
**问题**: 所有用户看到完整报告，无任何收入路径。Pricing页面声称 Free 只给总分+原型+雷达图+Top1摘要

**实现方案**:

1. 创建 `src/lib/subscription.ts` — 用户等级判断：
```typescript
export type UserTier = "free" | "single" | "pro";

export function getUserTier(): UserTier {
  // Phase 4C MVP: 从 sessionStorage/localStorage 读取
  // 后续接入 Stripe 后改为从 Supabase 读取
  const tier = typeof window !== "undefined"
    ? (localStorage.getItem("caliberTier") as UserTier)
    : null;
  return tier || "free";
}

export function canAccessFullReport(tier: UserTier): boolean {
  return tier === "single" || tier === "pro";
}
```

2. 报告页添加门控逻辑 — 在 `ReportContent` 组件顶部:
```typescript
import { getUserTier, canAccessFullReport } from "@/lib/subscription";

// 在 ReportContent 内部
const tier = getUserTier();
const isPaid = canAccessFullReport(tier);
```

3. 15维度详细分数区域（第204-244行的 Score Grid）包裹门控:
```tsx
{/* Score Grid */}
<div className={`mt-6 space-y-4 ${!isPaid ? "relative" : ""}`}>
  {!isPaid && (
    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[6px] rounded-xl flex flex-col items-center justify-center">
      <div className="text-center p-6">
        <p className="font-semibold text-slate-900 mb-2">{t("paywall.detailedScores")}</p>
        <p className="text-sm text-slate-500 mb-4">{t("paywall.unlockDesc")}</p>
        <Link href="/pricing">
          <Button size="sm">{t("paywall.unlock")}</Button>
        </Link>
      </div>
    </div>
  )}
  {/* 原有的 categoryKeys.map... */}
</div>
```

4. 优劣势详细内容门控（第260-325行的 Strengths & Weaknesses）:
- Free用户: 只显示第1个 strength 和第1个 weakness，其余模糊
- 证据(evidence)和行动建议(actionItems)也模糊

5. Undervalued Experiences（第328-356行）、Missing Elements（第358-387行）、Next Steps（第389-411行）: Free用户全部模糊

6. PDF导出按钮（第470行）: Free用户 disabled，显示 "Upgrade to download"

**4个locale文件添加 `paywall` 字段**:

```json
// en.json
"paywall": {
  "detailedScores": "Detailed 15-Dimension Breakdown",
  "unlockDesc": "Unlock the full analysis with evidence-based scoring",
  "unlock": "Unlock Full Report — $4.99",
  "upgradeToDownload": "Upgrade to Download PDF",
  "upgradeForMore": "Unlock full analysis"
}

// zh.json
"paywall": {
  "detailedScores": "15维度详细分析",
  "unlockDesc": "解锁带证据支撑的完整分析",
  "unlock": "解锁完整报告 — ¥29.9",
  "upgradeToDownload": "升级后可下载PDF",
  "upgradeForMore": "解锁完整分析"
}

// ja.json
"paywall": {
  "detailedScores": "15次元の詳細分析",
  "unlockDesc": "エビデンス付きの完全分析をアンロック",
  "unlock": "フルレポートをアンロック — $4.99",
  "upgradeToDownload": "PDFダウンロードにはアップグレードが必要",
  "upgradeForMore": "完全分析をアンロック"
}

// ko.json
"paywall": {
  "detailedScores": "15차원 상세 분석",
  "unlockDesc": "증거 기반 완전 분석 잠금 해제",
  "unlock": "풀 리포트 잠금 해제 — $4.99",
  "upgradeToDownload": "PDF 다운로드에는 업그레이드 필요",
  "upgradeForMore": "전체 분석 잠금 해제"
}
```

---

### 任务 4C-2：Email 收集连接 Supabase

**文件**: `src/app/[locale]/assess/report/page.tsx` 第424-435行
**问题**: Email 存入 `sessionStorage` 而非数据库，用户数据完全丢失

**当前代码**:
```typescript
sessionStorage.setItem("caliberEmail", email);
setEmailSaved(true);
```

**修改方案**:

1. 创建 API Route `src/app/api/collect-email/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, assessmentData } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("email_leads").upsert(
      {
        email,
        assessment_score: assessmentData?.weightedScore,
        assessment_role: assessmentData?.roleType,
        assessment_archetype: assessmentData?.archetype,
        source: "report_save",
        created_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
```

2. 报告页的 email submit handler 改为:
```typescript
onSubmit={async (e) => {
  e.preventDefault();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setEmailError("Please enter a valid email");
    return;
  }
  setEmailError("");
  try {
    const res = await fetch("/api/collect-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        assessmentData: result ? {
          weightedScore: result.weightedScore,
          roleType: result.roleType,
          archetype: result.archetype,
        } : null,
      }),
    });
    if (!res.ok) throw new Error();
    setEmailSaved(true);
  } catch {
    setEmailError("Failed to save. Please try again.");
  }
}}
```

3. **Supabase 迁移**: 需要在 Supabase 创建 `email_leads` 表:
```sql
CREATE TABLE email_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  assessment_score integer,
  assessment_role text,
  assessment_archetype text,
  source text DEFAULT 'report_save',
  created_at timestamptz DEFAULT now()
);

-- RLS: 只允许 insert，不允许 select/update/delete（除admin）
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON email_leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin read" ON email_leads
  FOR SELECT TO authenticated USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );
```

---

### 任务 4C-3：Stripe/LemonSqueezy 支付集成

**说明**: 这是最复杂的任务，分解为子步骤。推荐使用 **LemonSqueezy**（比 Stripe 更适合个人开发者，自动处理增值税和退款）

**子步骤**:

1. **安装**: `npm install @lemonsqueezy/lemonsqueezy.js`

2. **创建 `src/lib/lemonsqueezy.ts`**: 初始化 SDK + 创建 checkout

3. **创建 API Routes**:
   - `src/app/api/checkout/route.ts` — 创建支付链接
   - `src/app/api/webhook/lemonsqueezy/route.ts` — 接收支付成功回调

4. **Pricing 页面接入**: 将 "Get Full Report" 和 "Upgrade to Pro" 按钮连接到 checkout API

5. **支付后解锁**: webhook 回调更新 Supabase 用户 tier，报告页根据 tier 显示/隐藏内容

**注意**: 本任务依赖 LemonSqueezy 账号配置，建议先完成 4C-1（付费墙UI）和 4C-2（Email收集），支付集成可以后续接入。MVP阶段可以先用 localStorage 手动标记 tier 做测试。

---

### 任务 4C-4：Error Boundary 组件

**问题**: AI调用失败时用户看到白屏

**创建文件**: `src/components/ErrorBoundary.tsx`

```typescript
"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-slate-600 mb-6">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**使用**: 在 `layout.tsx` 中包裹 children:
```typescript
import { ErrorBoundary } from "@/components/ErrorBoundary";

// 在 return 中
<body className={...}>
  <NextIntlClientProvider messages={messages}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </NextIntlClientProvider>
</body>
```

---

## 已确认不做的事项（避免 Scope Creep）

| 项目 | 原因 |
|------|------|
| 暗色模式 | CSS变量已定义但无激活机制，MVP不做，减少测试面 |
| 国际化雷达图重组（4类→去掉international） | 改动影响面太大，需要重新设计评估框架 |
| 色彩系统大改（蓝→靛蓝/teal） | 可以后续做，不阻塞功能 |
| 课程/题库/模拟面试 | 那是Exponent的领域 |
| 简历重写功能 | Pricing页"coming soon"保留即可 |
| 社区论坛 | 无用户基础 |

---

## 验证清单

每个Phase完成后执行:

```bash
# 1. TypeScript 类型检查
cd /Users/kangxin/Desktop/pm-assessment && npx tsc --noEmit

# 2. 构建检查
npm run build

# 3. Dev模式手动测试
npm run dev
```

**手动测试流程**:
1. 访问 `/` → Landing Page → 检查Hero预览、Stats Bar、Features、动画
2. 点击"Get Started" → `/assess` → 选择角色
3. → `/assess/input` → 检查最小内容验证（少于100字应禁止提交）
4. → `/assess/analyzing` → 等待AI分析（Mock模式）
5. → `/assess/report` → 检查：
   - 分数计数动画
   - 移动端字体大小
   - 雷达图响应式
   - 付费墙模糊效果（Free用户）
   - Email收集存入Supabase
   - PDF导出按钮状态
6. 测试 `/share/[token]` → 检查i18n（切换语言看标签是否变化）
7. Chrome DevTools → iPhone 14 Pro (390x844) / iPad (820x1180) 视口测试
8. 切换4种语言检查文案完整性（无missing key报错）

---

## 文件变更汇总

| Phase | 新建文件 | 修改文件 |
|-------|---------|---------|
| 4A | — | `constants.ts`, `StepIndicator.tsx`, `share/[token]/page.tsx`, `layout.tsx`, `input/page.tsx`, `report/page.tsx`, `RadarChart.tsx`, `en.json`, `zh.json`, `ja.json`, `ko.json` |
| 4B | `src/hooks/useInView.ts` | `page.tsx`(landing), `layout.tsx`, `globals.css`, `en.json`, `zh.json`, `ja.json`, `ko.json` |
| 4C | `src/lib/subscription.ts`, `src/app/api/collect-email/route.ts`, `src/components/ErrorBoundary.tsx` | `report/page.tsx`, `layout.tsx`, `en.json`, `zh.json`, `ja.json`, `ko.json` |

**总计**: 新建 3 个文件，修改 ~15 个文件
