"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

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
    tagline: string;
    description: string;
    cardGradient: string;
    traits: string[];
    strengths: string[];
    blindSpots: string[];
  }
> = {
  craftsperson: {
    name: "匠心产品人",
    tagline: "用户体验的极致追求者",
    description:
      "你是那种会为一个交互细节反复打磨的人。不是因为谁要求，而是因为你知道——好产品和伟大产品之间的距离，往往就在别人觉得「差不多了」的地方。你的用户同理心和对质量的执着，是团队最珍贵的资产。",
    cardGradient: "linear-gradient(135deg, #4338ca, #3b82f6)",
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
    tagline: "商业与产品的桥梁建造者",
    description:
      "当所有人都在讨论下个 sprint 做什么的时候，你的脑子里已经在推演明年的市场格局了。你能在复杂的商业环境中找到那个「一切都说得通」的逻辑，把它变成路线图上清晰的每一步。",
    cardGradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
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
    tagline: "用数据驱动一切决策",
    description:
      "你看到的不是产品，而是一个由数据驱动的增长系统。每个按钮、每条推送、每个定价策略在你眼里都是可以优化的变量。你的实验思维让团队总能找到别人没发现的增长路径。",
    cardGradient: "linear-gradient(135deg, #059669, #10b981)",
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
    tagline: "看到别人看不到的可能性",
    description:
      "别人看到的是当下的产品，你看到的是三年后的可能性。你对技术趋势有近乎直觉的敏感，能在 AI、新平台、新范式中看到别人还没看到的产品机会。你描绘的愿景，让团队知道为什么而战。",
    cardGradient: "linear-gradient(135deg, #d97706, #f59e0b)",
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
    tagline: "让复杂的事情有序发生",
    description:
      "混乱是你的舞台。当项目陷入僵局、团队意见不合、截止日期逼近的时候，你反而越冷静。你能在混沌中建立秩序，让对的事情按对的顺序发生。没有你，再好的想法都只是停留在白板上的便利贴。",
    cardGradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
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
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <p className="text-sm font-medium text-slate-400 tracking-wide mb-5">
          2 分钟 · 10 道真实场景题
        </p>
        <h1 className="text-4xl md:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.15]">
          你是哪种产品经理？
        </h1>
        <p className="mt-5 text-base md:text-lg text-slate-500 leading-relaxed max-w-md mx-auto">
          10 道真实工作场景，没有标准答案。
          <br className="hidden md:block" />
          你的直觉选择会揭示你的 PM 原型。
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            onClick={onStart}
            className="rounded-full px-10 h-12 text-sm font-medium"
          >
            开始测试
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
        {(Object.keys(ARCHETYPES) as ArchetypeKey[]).map((key) => {
          const a = ARCHETYPES[key];
          return (
            <div
              key={key}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-sm font-semibold text-slate-800 mb-1">{a.name}</div>
              <div className="text-[11px] text-slate-400 leading-snug">{a.tagline}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            无需注册
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            约 2 分钟
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            结果即时生成
          </span>
        </div>
        <p className="text-[11px] text-slate-300">
          评估框架参考 Reforge PM Competency Model 与 SVPG Product Management Framework
        </p>
      </div>
    </div>
  );
}

// ─── Question Screen ───
const OPTION_LABELS = ["A", "B", "C", "D"];

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
    <div className="min-h-[calc(100vh-56px)] flex flex-col">
      <div className="w-full bg-slate-100 h-1">
        <div
          className="h-full bg-slate-900 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 md:py-12 max-w-[640px] mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-medium text-slate-400">
            {index + 1} / {total}
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed mb-8">
          {question.scenario}
        </h2>

        <div className="space-y-2.5 flex-1">
          {question.options.map((option, oi) => {
            const isSelected = selectedOption === oi;
            return (
              <button
                key={oi}
                onClick={() => onSelect(oi)}
                className={`w-full text-left rounded-xl px-4 py-3.5 border transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-xs font-semibold mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0
                    ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    {OPTION_LABELS[oi]}
                  </span>
                  <span className="text-sm leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="text-sm text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← 上一题
          </button>
          <Button
            onClick={onNext}
            disabled={selectedOption === null}
            size="sm"
            className="rounded-full px-6 h-9 text-sm"
          >
            {index === total - 1 ? "查看结果" : "下一题 →"}
          </Button>
        </div>
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
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveImage = useCallback(async () => {
    if (!shareCardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `caliber-pm-${primary}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  }, [primary, saving]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `我是「${p.name}」— Caliber PM 原型测试`,
          text: `${p.tagline}。来测测你是哪种产品经理？`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  }, [p.name, p.tagline, handleCopyLink]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      {/* Share card — visible as hero, also used for image capture */}
      <div
        ref={shareCardRef}
        className="rounded-2xl overflow-hidden mb-8"
        style={{ background: p.cardGradient }}
      >
        <div className="px-8 py-12 md:py-16 text-center text-white">
          <p className="text-sm font-medium text-white/60 mb-6 tracking-wide">
            你的 PM 原型
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {p.name}
          </h1>
          <p className="text-base text-white/75 mb-8">{p.tagline}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {p.traits.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-1">
              {percentages[primary]}% 匹配
            </span>
            <span className="text-xs text-white/50">
              次要: {s.name} {percentages[secondary]}%
            </span>
          </div>
          <p className="mt-6 text-[11px] text-white/30 tracking-wider">
            CALIBER · PM ARCHETYPE ASSESSMENT
          </p>
        </div>
      </div>

      {/* Share actions */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {saving ? "生成中..." : "保存图片"}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          {copied ? "已复制链接" : "分享"}
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 transition-colors"
        >
          重测
        </button>
      </div>

      {/* Warm description */}
      <div className="mb-8">
        <p className="text-base text-slate-600 leading-[1.8]">
          {p.description}
        </p>
      </div>

      {/* Distribution */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-6">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
          原型分布
        </h3>
        <div className="space-y-3">
          {sorted.map(([key]) => {
            const a = ARCHETYPES[key];
            const pct = percentages[key];
            const isPrimary = key === primary;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className={`text-sm w-28 shrink-0 ${isPrimary ? "font-semibold text-slate-900" : "text-slate-500"}`}>
                  {a.name}
                </span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${isPrimary ? "bg-slate-900" : "bg-slate-300"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs w-8 text-right tabular-nums ${isPrimary ? "font-semibold text-slate-900" : "text-slate-400"}`}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Blind Spots */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-3">
            核心优势
          </h3>
          <ul className="space-y-2.5">
            {p.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-500 mt-0.5 shrink-0 text-sm">+</span>
                <span className="text-sm text-slate-600 leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-3">
            成长盲区
          </h3>
          <ul className="space-y-2.5">
            {p.blindSpots.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-amber-500 mt-0.5 shrink-0 text-sm">!</span>
                <span className="text-sm text-slate-600 leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Secondary archetype */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-sm font-semibold text-slate-800">次要原型: {s.name}</span>
          <span className="text-xs text-slate-400">{percentages[secondary]}%</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          你同时具备{s.traits[0]}和{s.traits[1]}特质。{p.name}的核心能力加上{s.name}的辅助视角，让你在面对复杂问题时有更多维度的思考方式。
        </p>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-slate-900 p-6 md:p-8 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          想要基于真实经历的深度评估？
        </h3>
        <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto">
          Caliber 通过 AI 分析你的工作经历，从 16 个维度生成专业报告和行动计划。
        </p>
        <Link href="/assess">
          <Button size="sm" className="rounded-full px-6 bg-white text-slate-900 hover:bg-slate-100">
            免费开始评估 →
          </Button>
        </Link>
      </div>

      {/* Framework note */}
      <p className="text-center text-[11px] text-slate-300 mt-8">
        原型模型参考 Reforge PM Competency Model 与 SVPG Product Management Framework
      </p>
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <AppHeader showNav showAuth />

      <main className="flex-1">
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
      </main>

      {phase !== "quiz" && <AppFooter />}
    </div>
  );
}
