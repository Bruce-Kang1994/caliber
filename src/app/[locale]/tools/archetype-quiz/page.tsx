"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";

// ─── Types ───
type ArchetypeKey =
  | "craftsperson"
  | "strategist"
  | "growth-hacker"
  | "visionary"
  | "operator";

interface Option {
  text: string;
  weights: Partial<Record<ArchetypeKey, number>>;
}

interface Question {
  scenario: string;
  options: Option[];
}

// ─── Archetype Metadata ───
const ARCHETYPES: Record<
  ArchetypeKey,
  {
    name: string;
    emoji: string;
    gradient: string;
    textColor: string;
    tagline: string;
    traits: string[];
    strengths: string[];
    blindSpots: string[];
  }
> = {
  craftsperson: {
    name: "匠心产品人",
    emoji: "🔧",
    gradient: "from-indigo-500 via-blue-500 to-cyan-400",
    textColor: "text-indigo-600",
    tagline: "用户体验的极致追求者",
    traits: ["注重细节", "用户同理心强", "高交付标准", "技术敏感度高"],
    strengths: [
      "能把模糊需求转化为精确的产品方案",
      "对用户体验有天然直觉",
      "交付质量稳定可靠",
    ],
    blindSpots: [
      "可能过度打磨细节而忽视大局",
      "商业敏感度有提升空间",
      "有时难以割舍「不完美」的方案",
    ],
  },
  strategist: {
    name: "全局战略家",
    emoji: "♟️",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-400",
    textColor: "text-violet-600",
    tagline: "商业与产品的桥梁建造者",
    traits: ["全局思维", "商业嗅觉敏锐", "擅长优先级决策", "长期主义"],
    strengths: [
      "能在复杂环境中找到核心杠杆点",
      "将商业目标转化为产品路线图",
      "跨部门影响力强",
    ],
    blindSpots: [
      "可能忽视执行层面的细节",
      "容易被宏大叙事带偏节奏",
      "对一线用户痛点的感知可能不够深",
    ],
  },
  "growth-hacker": {
    name: "增长黑客",
    emoji: "📈",
    gradient: "from-emerald-500 via-green-500 to-teal-400",
    textColor: "text-emerald-600",
    tagline: "用数据驱动一切决策",
    traits: ["数据驱动", "实验思维", "结果导向", "快速迭代"],
    strengths: [
      "用数据发现别人看不到的机会",
      "擅长设计和分析 A/B 测试",
      "对转化漏斗有超强直觉",
    ],
    blindSpots: [
      "可能过度依赖数据而忽视定性洞察",
      "容易追求短期指标增长",
      "对长期产品体验的耐心有限",
    ],
  },
  visionary: {
    name: "未来洞察者",
    emoji: "🔮",
    gradient: "from-amber-500 via-orange-500 to-rose-400",
    textColor: "text-amber-600",
    tagline: "看到别人看不到的可能性",
    traits: ["前瞻性强", "创新驱动", "技术直觉好", "善于描绘愿景"],
    strengths: [
      "能预判技术趋势并提前布局",
      "擅长从 0 到 1 创造新产品",
      "用愿景激发团队和利益相关者",
    ],
    blindSpots: [
      "可能脱离当前用户的实际需求",
      "理想与执行之间容易出现落差",
      "有时低估「无聊但重要」的基础工作",
    ],
  },
  operator: {
    name: "卓越运营者",
    emoji: "⚙️",
    gradient: "from-sky-500 via-blue-500 to-indigo-400",
    textColor: "text-sky-600",
    tagline: "让复杂的事情有序发生",
    traits: ["高执行力", "擅长协调", "流程思维", "沟通能力强"],
    strengths: [
      "能在混乱中建立秩序和流程",
      "跨团队协调和推动能力一流",
      "让项目按时高质量交付",
    ],
    blindSpots: [
      "可能过于依赖流程而限制创新",
      "容易陷入「救火」模式",
      "产品直觉和战略思维有提升空间",
    ],
  },
};

// ─── 10 Scenario Questions ───
const QUESTIONS: Question[] = [
  {
    scenario:
      "CEO 突然宣布：「我们要砍掉 50% 的产品路线图。」你的第一反应是？",
    options: [
      {
        text: "立刻拉数据，看哪些功能的用户留存和 ROI 最低，用数据说服老板砍哪些",
        weights: { "growth-hacker": 3, strategist: 1 },
      },
      {
        text: "先梳理每个项目和公司战略目标的关联度，保留对长期愿景最关键的项目",
        weights: { strategist: 3, visionary: 1 },
      },
      {
        text: "找核心用户聊聊，搞清楚他们最离不开的功能是什么，从用户视角决定",
        weights: { craftsperson: 3, operator: 1 },
      },
      {
        text: "召集各团队 lead 开会，对齐优先级，确保砍掉的部分不会打断正在进行的关键交付",
        weights: { operator: 3, craftsperson: 1 },
      },
    ],
  },
  {
    scenario:
      "竞品刚发布了一个火爆的 AI 功能，团队都在问「我们要不要跟？」",
    options: [
      {
        text: "先研究这个功能的底层技术路线，思考有没有更前沿的方式弯道超车",
        weights: { visionary: 3, craftsperson: 1 },
      },
      {
        text: "拉竞品的用户评价数据，分析他们的获客和留存变化，判断是否真的有效",
        weights: { "growth-hacker": 3, strategist: 1 },
      },
      {
        text: "回到我们的用户场景，想想用户真正需要的是这个功能还是背后的需求",
        weights: { craftsperson: 3, "growth-hacker": 1 },
      },
      {
        text: "评估我们的资源和路线图，判断在不影响核心交付的前提下能否快速跟进",
        weights: { operator: 3, strategist: 1 },
      },
    ],
  },
  {
    scenario:
      "你负责的产品上线三个月了，DAU 一直涨不动，老板开始不耐烦了。你怎么办？",
    options: [
      {
        text: "搭建完整的数据漏斗，找到流失最严重的环节，设计针对性的实验来优化",
        weights: { "growth-hacker": 3, craftsperson: 1 },
      },
      {
        text: "退后一步看看：我们是不是在错误的市场里打仗？是否需要重新定义目标用户",
        weights: { strategist: 3, visionary: 1 },
      },
      {
        text: "深入访谈 20 个流失用户，找到他们不回来的真正原因，逐一修复体验问题",
        weights: { craftsperson: 3, operator: 1 },
      },
      {
        text: "拉齐市场、运营、研发团队，制定一个 30 天冲刺计划，集中火力突破",
        weights: { operator: 3, "growth-hacker": 1 },
      },
    ],
  },
  {
    scenario:
      "工程团队说「这个需求技术上可以做，但至少要 3 个月」。你的反应是？",
    options: [
      {
        text: "和工程师一起深入技术方案，看能不能拆分成更小的可交付单元，先上 MVP",
        weights: { craftsperson: 3, operator: 1 },
      },
      {
        text: "重新评估这个需求的业务价值——如果 3 个月后市场窗口关闭了还值得做吗？",
        weights: { strategist: 3, "growth-hacker": 1 },
      },
      {
        text: "考虑有没有技术捷径或第三方方案，用最小成本先验证假设",
        weights: { "growth-hacker": 3, visionary: 1 },
      },
      {
        text: "评估是否可以调配更多资源或调整并行项目的优先级来加速交付",
        weights: { operator: 3, strategist: 1 },
      },
    ],
  },
  {
    scenario: "公司准备进入一个全新市场（比如从国内走向海外），你会怎么切入？",
    options: [
      {
        text: "研究目标市场的技术趋势和用户习惯差异，思考能不能用新技术建立差异化优势",
        weights: { visionary: 3, strategist: 1 },
      },
      {
        text: "先做一个简单的落地页 + 付费广告测试，用最低成本验证市场需求",
        weights: { "growth-hacker": 3, operator: 1 },
      },
      {
        text: "全面分析目标市场的竞争格局、监管环境和商业模式，制定分阶段进入策略",
        weights: { strategist: 3, "growth-hacker": 1 },
      },
      {
        text: "找到目标市场的标杆用户，深入了解他们的工作流和痛点，打造本地化产品体验",
        weights: { craftsperson: 3, visionary: 1 },
      },
    ],
  },
  {
    scenario:
      "设计师拿出了一个方案，视觉上很好看但交互逻辑复杂。你怎么决策？",
    options: [
      {
        text: "自己画一个简化的交互方案，确保每一步都符合用户心智模型和使用习惯",
        weights: { craftsperson: 3, visionary: 1 },
      },
      {
        text: "做一个快速的 A/B 测试，看用户在复杂方案和简化方案上的转化数据对比",
        weights: { "growth-hacker": 3, craftsperson: 1 },
      },
      {
        text: "从产品定位角度判断——这个复杂交互是否强化了我们的核心价值主张？",
        weights: { strategist: 3, "growth-hacker": 1 },
      },
      {
        text: "拉上设计和工程一起讨论，在开发成本、上线时间和体验之间找到最优折中",
        weights: { operator: 3, strategist: 1 },
      },
    ],
  },
  {
    scenario:
      "公司有一个内部工具严重拖慢了团队效率，但没有人愿意花精力去改。你的选择是？",
    options: [
      {
        text: "趁周末自己先做个原型，证明改进后效率能提升多少，用事实推动决策",
        weights: { craftsperson: 3, "growth-hacker": 1 },
      },
      {
        text: "算一笔经济账：团队因此浪费的人力成本 vs 改造投入，写一份 business case 给管理层",
        weights: { strategist: 3, operator: 1 },
      },
      {
        text: "研究市场上的自动化工具或 AI 方案，看能否用低代码/AI 方式快速解决",
        weights: { visionary: 3, "growth-hacker": 1 },
      },
      {
        text: "发起一个跨团队改进项目，设定明确的里程碑和 owner，推动它作为正式项目落地",
        weights: { operator: 3, craftsperson: 1 },
      },
    ],
  },
  {
    scenario:
      "用户访谈中，有个用户提了一个你从没想过的使用场景，看起来很小众但他非常激动。你会？",
    options: [
      {
        text: "深入挖掘这个场景背后的需求本质，思考是否能演化成下一个核心功能",
        weights: { visionary: 3, craftsperson: 1 },
      },
      {
        text: "先记录下来，然后去数据库里查有多少用户有类似行为，用数据判断优先级",
        weights: { "growth-hacker": 3, strategist: 1 },
      },
      {
        text: "认真倾听并记录完整的用户故事，思考如何在现有产品框架内优雅地支持它",
        weights: { craftsperson: 3, operator: 1 },
      },
      {
        text: "把它放到更大的产品愿景和市场定位中评估，判断它是否打开了新的市场空间",
        weights: { strategist: 3, visionary: 1 },
      },
    ],
  },
  {
    scenario:
      "老板要求你在两周内上一个新功能，但你知道质量肯定会打折扣。怎么处理？",
    options: [
      {
        text: "拆分功能范围，找出核心体验路径，只做最关键的 20%，但确保这 20% 完美",
        weights: { craftsperson: 3, strategist: 1 },
      },
      {
        text: "设计一个最小可行实验，用 2 天上线一个灰度版本，根据数据反馈再决定投入多少",
        weights: { "growth-hacker": 3, visionary: 1 },
      },
      {
        text: "向老板展示完整版和极简版的 ROI 对比，争取合理的时间线或资源",
        weights: { strategist: 3, operator: 1 },
      },
      {
        text: "制定详细的两周冲刺计划，明确每天的交付物，协调团队全力以赴按时交付",
        weights: { operator: 3, "growth-hacker": 1 },
      },
    ],
  },
  {
    scenario:
      "你刚接手一个新产品线，发现前任 PM 留下的文档几乎为零，代码库也很混乱。第一步做什么？",
    options: [
      {
        text: "先把产品完整地用一遍，记录每一个体验问题和技术 bug，建立质量基线",
        weights: { craftsperson: 3, operator: 1 },
      },
      {
        text: "调取所有用户数据和业务指标，搞清楚这个产品到底为公司创造了多少价值",
        weights: { "growth-hacker": 3, strategist: 1 },
      },
      {
        text: "和所有相关的工程师、设计师、运营人员聊一圈，了解历史背景和团队现状",
        weights: { operator: 3, craftsperson: 1 },
      },
      {
        text: "研究这个产品所在的市场和竞品，重新思考它的战略定位和未来可能性",
        weights: { strategist: 3, visionary: 1 },
      },
    ],
  },
];

// ─── Scoring Logic ───
function calculateResults(answers: number[]) {
  const scores: Record<ArchetypeKey, number> = {
    craftsperson: 0,
    strategist: 0,
    "growth-hacker": 0,
    visionary: 0,
    operator: 0,
  };

  answers.forEach((optionIdx, qIdx) => {
    const option = QUESTIONS[qIdx].options[optionIdx];
    for (const [key, weight] of Object.entries(option.weights)) {
      scores[key as ArchetypeKey] += weight;
    }
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const sorted = (Object.entries(scores) as [ArchetypeKey, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const percentages: Record<ArchetypeKey, number> = {} as Record<
    ArchetypeKey,
    number
  >;
  sorted.forEach(([key, val]) => {
    percentages[key] = total > 0 ? Math.round((val / total) * 100) : 20;
  });

  return {
    primary: sorted[0][0],
    secondary: sorted[1][0],
    percentages,
    sorted,
  };
}

// ─── Intro Screen ───
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-100/50 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-100/50 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          2 分钟 · 10 道情景题
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          你是哪种
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            产品经理？
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
          不是自评打分，而是真实场景下的直觉选择。
          <br />
          发现你的 PM 原型，了解你的独特优势和成长方向。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="rounded-full px-10 h-13 text-base shadow-lg shadow-primary/20"
          >
            开始测试
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-5 gap-4 max-w-md mx-auto">
          {(Object.keys(ARCHETYPES) as ArchetypeKey[]).map((key) => (
            <div key={key} className="text-center">
              <div className="text-2xl mb-1">{ARCHETYPES[key].emoji}</div>
              <div className="text-[11px] text-slate-400 leading-tight">
                {ARCHETYPES[key].name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Question Screen ───
function QuestionScreen({
  question,
  index,
  total,
  selectedOption,
  onSelect,
  onNext,
  onPrev,
}: {
  question: Question;
  index: number;
  total: number;
  selectedOption: number | null;
  onSelect: (optionIdx: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="min-h-[80vh] flex flex-col px-6 py-8 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
        <span>
          {index + 1} / {total}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1.5 mb-10" />

      {/* Scenario */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest mb-3">
          情景 {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-8">
          {question.scenario}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, oi) => {
            const isSelected = selectedOption === oi;
            return (
              <button
                key={oi}
                onClick={() => onSelect(oi)}
                className={`w-full text-left rounded-2xl px-5 py-4 border-2 transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/80 shadow-sm shadow-indigo-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200
                    ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm md:text-base leading-relaxed ${isSelected ? "text-slate-900 font-medium" : "text-slate-600"}`}
                  >
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-full text-slate-400"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          上一题
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedOption === null}
          className="rounded-full px-8"
        >
          {index === total - 1 ? "查看结果" : "下一题"}
          {index < total - 1 && (
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Result Screen ───
function ResultScreen({
  primary,
  secondary,
  percentages,
  sorted,
  onRestart,
}: {
  primary: ArchetypeKey;
  secondary: ArchetypeKey;
  percentages: Record<ArchetypeKey, number>;
  sorted: [ArchetypeKey, number][];
  onRestart: () => void;
}) {
  const p = ARCHETYPES[primary];
  const s = ARCHETYPES[secondary];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero result card */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${p.gradient} text-white`}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/[0.06] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/[0.04] translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-8">
            <span>你的 PM 原型</span>
          </div>

          <div className="text-6xl mb-4">{p.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {p.name}
          </h1>
          <p className="mt-3 text-lg text-white/80">{p.tagline}</p>

          {/* Primary + Secondary badges */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
              主要原型: {p.name} {percentages[primary]}%
            </span>
            <span className="rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm">
              次要原型: {s.name} {percentages[secondary]}%
            </span>
          </div>
        </div>
      </div>

      {/* Distribution bars */}
      <div className="max-w-2xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
            原型分布
          </h3>
          <div className="space-y-4">
            {sorted.map(([key]) => {
              const a = ARCHETYPES[key];
              const pct = percentages[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{a.emoji}</span>
                      <span
                        className={`text-sm font-semibold ${key === primary ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {a.name}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold ${key === primary ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${a.gradient} transition-all duration-1000 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Traits & strengths */}
      <div className="max-w-2xl mx-auto px-6 mt-8 space-y-6">
        {/* Traits */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
            性格特点
          </h3>
          <div className="flex flex-wrap gap-2">
            {p.traits.map((trait) => (
              <span
                key={trait}
                className={`rounded-full px-4 py-1.5 text-sm font-medium bg-white ${p.textColor} border border-slate-200`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-100/60">
          <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-4">
            核心优势
          </h3>
          <ul className="space-y-3">
            {p.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Blind Spots */}
        <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-100/60">
          <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-widest mb-4">
            成长盲区
          </h3>
          <ul className="space-y-3">
            {p.blindSpots.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary archetype note */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                你的次要原型：{s.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{s.tagline}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            你在「{s.name}」维度上也表现出色（{percentages[secondary]}%），
            这意味着你不仅有{p.name}的核心能力，还兼具{s.traits[0]}和
            {s.traits[1]}等特质。 这种组合在团队中非常有价值。
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-6 mt-12 mb-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            想基于真实经历获得 AI 深度评估？
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Caliber 完整评估基于你的真实工作经历，通过 AI 分析 16 个 PM
            维度，生成专业报告、成长建议和行动计划。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/assess">
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100"
              >
                免费开始完整评估
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={onRestart}
              className="rounded-full px-6 text-slate-400 hover:text-white hover:bg-white/10"
            >
              重新测试
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function ArchetypeQuizPage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  );

  const handleSelect = useCallback(
    (optionIdx: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQ] = optionIdx;
        return next;
      });
    },
    [currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      setPhase("result");
    }
  }, [currentQ]);

  const handlePrev = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }, [currentQ]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
  }, []);

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const validAnswers = answers.filter((a): a is number => a !== null);
    if (validAnswers.length !== QUESTIONS.length) return null;
    return calculateResults(validAnswers);
  }, [phase, answers]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 tracking-tight"
          >
            Caliber
          </Link>
          {phase === "quiz" && (
            <span className="text-xs text-slate-400">
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          )}
          {phase !== "quiz" && (
            <Link href="/assess">
              <Button variant="ghost" size="sm" className="rounded-full text-xs">
                完整评估 →
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      {phase === "intro" && (
        <IntroScreen onStart={() => setPhase("quiz")} />
      )}

      {phase === "quiz" && (
        <QuestionScreen
          question={QUESTIONS[currentQ]}
          index={currentQ}
          total={QUESTIONS.length}
          selectedOption={answers[currentQ]}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {phase === "result" && result && (
        <ResultScreen
          primary={result.primary}
          secondary={result.secondary}
          percentages={result.percentages}
          sorted={result.sorted}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
