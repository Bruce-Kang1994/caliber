// Locale-specific content for archetype quiz
// Only weights/scoring logic stays in page.tsx

export type ArchetypeKey =
  | "craftsperson"
  | "strategist"
  | "growth-hacker"
  | "visionary"
  | "operator";

export interface ArchetypeContent {
  name: string;
  tagline: string;
  description: string;
  traits: string[];
  strengths: string[];
  blindSpots: string[];
}

export interface QuestionContent {
  scenario: string;
  options: string[];
}

export interface UIContent {
  intro: {
    badge: string;
    title: string;
    subtitle: string;
    startButton: string;
    noSignup: string;
    duration: string;
    instant: string;
    framework: string;
  };
  quiz: {
    prev: string;
    next: string;
    viewResult: string;
  };
  result: {
    yourType: string;
    match: string;
    secondary: string;
    distribution: string;
    strengths: string;
    blindSpots: string;
    secondaryType: string;
    saveImage: string;
    saving: string;
    share: string;
    copied: string;
    retest: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    brandmark: string;
    framework: string;
    secondaryDesc: (p: { sName: string; pct: number; trait1: string; trait2: string; pName: string }) => string;
  };
}

// ─── Chinese ───
const zhArchetypes: Record<ArchetypeKey, ArchetypeContent> = {
  craftsperson: {
    name: "匠心产品人",
    tagline: "用户体验的极致追求者",
    description:
      "你是那种会为一个交互细节反复打磨的人。不是因为谁要求，而是因为你知道——好产品和伟大产品之间的距离，往往就在别人觉得「差不多了」的地方。你的用户同理心和对质量的执着，是团队最珍贵的资产。",
    traits: ["注重细节", "用户同理心强", "高交付标准", "技术敏感度高"],
    strengths: ["能把模糊需求转化为精确的产品方案", "对用户体验有天然直觉", "交付质量稳定可靠"],
    blindSpots: ["可能过度打磨细节而忽视大局", "商业敏感度有提升空间", "有时难以割舍「不完美」的方案"],
  },
  strategist: {
    name: "全局战略家",
    tagline: "商业与产品的桥梁建造者",
    description:
      "当所有人都在讨论下个 sprint 做什么的时候，你的脑子里已经在推演明年的市场格局了。你能在复杂的商业环境中找到那个「一切都说得通」的逻辑，把它变成路线图上清晰的每一步。",
    traits: ["全局思维", "商业嗅觉敏锐", "擅长优先级决策", "长期主义"],
    strengths: ["能在复杂环境中找到核心杠杆点", "将商业目标转化为产品路线图", "跨部门影响力强"],
    blindSpots: ["可能忽视执行层面的细节", "容易被宏大叙事带偏节奏", "对一线用户痛点的感知可能不够深"],
  },
  "growth-hacker": {
    name: "增长黑客",
    tagline: "用数据驱动一切决策",
    description:
      "你看到的不是产品，而是一个由数据驱动的增长系统。每个按钮、每条推送、每个定价策略在你眼里都是可以优化的变量。你的实验思维让团队总能找到别人没发现的增长路径。",
    traits: ["数据驱动", "实验思维", "结果导向", "快速迭代"],
    strengths: ["用数据发现别人看不到的机会", "擅长设计和分析 A/B 测试", "对转化漏斗有超强直觉"],
    blindSpots: ["可能过度依赖数据而忽视定性洞察", "容易追求短期指标增长", "对长期产品体验的耐心有限"],
  },
  visionary: {
    name: "未来洞察者",
    tagline: "看到别人看不到的可能性",
    description:
      "别人看到的是当下的产品，你看到的是三年后的可能性。你对技术趋势有近乎直觉的敏感，能在 AI、新平台、新范式中看到别人还没看到的产品机会。你描绘的愿景，让团队知道为什么而战。",
    traits: ["前瞻性强", "创新驱动", "技术直觉好", "善于描绘愿景"],
    strengths: ["能预判技术趋势并提前布局", "擅长从 0 到 1 创造新产品", "用愿景激发团队和利益相关者"],
    blindSpots: ["可能脱离当前用户的实际需求", "理想与执行之间容易出现落差", "有时低估「无聊但重要」的基础工作"],
  },
  operator: {
    name: "卓越运营者",
    tagline: "让复杂的事情有序发生",
    description:
      "混乱是你的舞台。当项目陷入僵局、团队意见不合、截止日期逼近的时候，你反而越冷静。你能在混沌中建立秩序，让对的事情按对的顺序发生。没有你，再好的想法都只是停留在白板上的便利贴。",
    traits: ["高执行力", "擅长协调", "流程思维", "沟通能力强"],
    strengths: ["能在混乱中建立秩序和流程", "跨团队协调和推动能力一流", "让项目按时高质量交付"],
    blindSpots: ["可能过于依赖流程而限制创新", "容易陷入「救火」模式", "产品直觉和战略思维有提升空间"],
  },
};

const zhQuestions: QuestionContent[] = [
  {
    scenario: "CEO 突然宣布：「我们要砍掉 50% 的产品路线图。」你的第一反应是？",
    options: [
      "立刻拉数据，看哪些功能的用户留存和 ROI 最低，用数据说服老板砍哪些",
      "先梳理每个项目和公司战略目标的关联度，保留对长期愿景最关键的项目",
      "找核心用户聊聊，搞清楚他们最离不开的功能是什么，从用户视角决定",
      "召集各团队 lead 开会，对齐优先级，确保砍掉的部分不会打断正在进行的关键交付",
    ],
  },
  {
    scenario: "竞品刚发布了一个火爆的 AI 功能，团队都在问「我们要不要跟？」",
    options: [
      "先研究这个功能的底层技术路线，思考有没有更前沿的方式弯道超车",
      "拉竞品的用户评价数据，分析他们的获客和留存变化，判断是否真的有效",
      "回到我们的用户场景，想想用户真正需要的是这个功能还是背后的需求",
      "评估我们的资源和路线图，判断在不影响核心交付的前提下能否快速跟进",
    ],
  },
  {
    scenario: "你负责的产品上线三个月了，DAU 一直涨不动，老板开始不耐烦了。你怎么办？",
    options: [
      "搭建完整的数据漏斗，找到流失最严重的环节，设计针对性的实验来优化",
      "退后一步看看：我们是不是在错误的市场里打仗？是否需要重新定义目标用户",
      "深入访谈 20 个流失用户，找到他们不回来的真正原因，逐一修复体验问题",
      "拉齐市场、运营、研发团队，制定一个 30 天冲刺计划，集中火力突破",
    ],
  },
  {
    scenario: "工程团队说「这个需求技术上可以做，但至少要 3 个月」。你的反应是？",
    options: [
      "和工程师一起深入技术方案，看能不能拆分成更小的可交付单元，先上 MVP",
      "重新评估这个需求的业务价值——如果 3 个月后市场窗口关闭了还值得做吗？",
      "考虑有没有技术捷径或第三方方案，用最小成本先验证假设",
      "评估是否可以调配更多资源或调整并行项目的优先级来加速交付",
    ],
  },
  {
    scenario: "公司准备进入一个全新市场（比如从国内走向海外），你会怎么切入？",
    options: [
      "研究目标市场的技术趋势和用户习惯差异，思考能不能用新技术建立差异化优势",
      "先做一个简单的落地页 + 付费广告测试，用最低成本验证市场需求",
      "全面分析目标市场的竞争格局、监管环境和商业模式，制定分阶段进入策略",
      "找到目标市场的标杆用户，深入了解他们的工作流和痛点，打造本地化产品体验",
    ],
  },
  {
    scenario: "设计师拿出了一个方案，视觉上很好看但交互逻辑复杂。你怎么决策？",
    options: [
      "自己画一个简化的交互方案，确保每一步都符合用户心智模型和使用习惯",
      "做一个快速的 A/B 测试，看用户在复杂方案和简化方案上的转化数据对比",
      "从产品定位角度判断——这个复杂交互是否强化了我们的核心价值主张？",
      "拉上设计和工程一起讨论，在开发成本、上线时间和体验之间找到最优折中",
    ],
  },
  {
    scenario: "公司有一个内部工具严重拖慢了团队效率，但没有人愿意花精力去改。你的选择是？",
    options: [
      "趁周末自己先做个原型，证明改进后效率能提升多少，用事实推动决策",
      "算一笔经济账：团队因此浪费的人力成本 vs 改造投入，写一份 business case 给管理层",
      "研究市场上的自动化工具或 AI 方案，看能否用低代码/AI 方式快速解决",
      "发起一个跨团队改进项目，设定明确的里程碑和 owner，推动它作为正式项目落地",
    ],
  },
  {
    scenario: "用户访谈中，有个用户提了一个你从没想过的使用场景，看起来很小众但他非常激动。你会？",
    options: [
      "深入挖掘这个场景背后的需求本质，思考是否能演化成下一个核心功能",
      "先记录下来，然后去数据库里查有多少用户有类似行为，用数据判断优先级",
      "认真倾听并记录完整的用户故事，思考如何在现有产品框架内优雅地支持它",
      "把它放到更大的产品愿景和市场定位中评估，判断它是否打开了新的市场空间",
    ],
  },
  {
    scenario: "老板要求你在两周内上一个新功能，但你知道质量肯定会打折扣。怎么处理？",
    options: [
      "拆分功能范围，找出核心体验路径，只做最关键的 20%，但确保这 20% 完美",
      "设计一个最小可行实验，用 2 天上线一个灰度版本，根据数据反馈再决定投入多少",
      "向老板展示完整版和极简版的 ROI 对比，争取合理的时间线或资源",
      "制定详细的两周冲刺计划，明确每天的交付物，协调团队全力以赴按时交付",
    ],
  },
  {
    scenario: "你刚接手一个新产品线，发现前任 PM 留下的文档几乎为零，代码库也很混乱。第一步做什么？",
    options: [
      "先把产品完整地用一遍，记录每一个体验问题和技术 bug，建立质量基线",
      "调取所有用户数据和业务指标，搞清楚这个产品到底为公司创造了多少价值",
      "和所有相关的工程师、设计师、运营人员聊一圈，了解历史背景和团队现状",
      "研究这个产品所在的市场和竞品，重新思考它的战略定位和未来可能性",
    ],
  },
];

const zhUI: UIContent = {
  intro: {
    badge: "2 分钟 · 10 道真实场景题",
    title: "你是哪种产品经理？",
    subtitle: "10 道真实工作场景，没有标准答案。\n你的直觉选择会揭示你的 PM 原型。",
    startButton: "开始测试",
    noSignup: "无需注册",
    duration: "约 2 分钟",
    instant: "结果即时生成",
    framework: "评估框架参考 Reforge PM Competency Model 与 SVPG Product Management Framework",
  },
  quiz: { prev: "← 上一题", next: "下一题 →", viewResult: "查看结果" },
  result: {
    yourType: "你的 PM 原型",
    match: "匹配",
    secondary: "次要",
    distribution: "原型分布",
    strengths: "核心优势",
    blindSpots: "成长盲区",
    secondaryType: "次要原型",
    saveImage: "保存图片",
    saving: "生成中...",
    share: "分享",
    copied: "已复制链接",
    retest: "重测",
    ctaTitle: "想要基于真实经历的深度评估？",
    ctaDesc: "Caliber 通过 AI 分析你的工作经历，从 16 个维度生成专业报告和行动计划。",
    ctaButton: "免费开始评估 →",
    brandmark: "CALIBER · PM ARCHETYPE ASSESSMENT",
    framework: "原型模型参考 Reforge PM Competency Model 与 SVPG Product Management Framework",
    secondaryDesc: ({ sName, pct, trait1, trait2, pName }) =>
      `你同时具备${trait1}和${trait2}特质。${pName}的核心能力加上${sName}的辅助视角，让你在面对复杂问题时有更多维度的思考方式。`,
  },
};

// ─── English ───
const enArchetypes: Record<ArchetypeKey, ArchetypeContent> = {
  craftsperson: {
    name: "The Craftsperson",
    tagline: "Relentless pursuer of user experience excellence",
    description:
      "You're the kind of PM who stays late perfecting an interaction detail — not because anyone asked, but because you know the gap between a good product and a great one lives in the places others call 'good enough.' Your user empathy and quality obsession are your team's most valuable assets.",
    traits: ["Detail-oriented", "Strong user empathy", "High delivery standards", "Tech-savvy"],
    strengths: ["Turns ambiguous requirements into precise product specs", "Natural intuition for user experience", "Consistently reliable delivery quality"],
    blindSpots: ["May over-polish details at the expense of the bigger picture", "Business acumen could be stronger", "Sometimes struggles to ship 'imperfect' solutions"],
  },
  strategist: {
    name: "The Strategist",
    tagline: "Bridge builder between business and product",
    description:
      "While everyone debates what to build next sprint, you're already mapping out next year's market landscape. You find the logic that makes everything click in complex business environments, then translate it into a clear step-by-step roadmap.",
    traits: ["Systems thinking", "Sharp business instinct", "Prioritization expert", "Long-term oriented"],
    strengths: ["Finds the core leverage point in complex situations", "Translates business goals into product roadmaps", "Strong cross-functional influence"],
    blindSpots: ["May overlook execution-level details", "Can get swept up in grand narratives", "May not feel frontline user pain deeply enough"],
  },
  "growth-hacker": {
    name: "The Growth Hacker",
    tagline: "Data drives every decision",
    description:
      "You don't see a product — you see a data-driven growth system. Every button, every push notification, every pricing strategy is a variable to optimize. Your experimental mindset helps the team discover growth paths that others miss entirely.",
    traits: ["Data-driven", "Experimental mindset", "Results-oriented", "Fast iteration"],
    strengths: ["Spots opportunities others can't see through data", "Expert at designing and analyzing A/B tests", "Exceptional intuition for conversion funnels"],
    blindSpots: ["May over-rely on data while missing qualitative insights", "Tendency to chase short-term metrics", "Limited patience for long-term product experience"],
  },
  visionary: {
    name: "The Visionary",
    tagline: "Sees possibilities others can't",
    description:
      "Others see today's product; you see what's possible three years from now. You have an almost instinctive feel for technology trends, spotting product opportunities in AI, new platforms, and emerging paradigms before anyone else. Your vision gives the team a reason to fight.",
    traits: ["Forward-thinking", "Innovation-driven", "Strong tech intuition", "Compelling vision"],
    strengths: ["Anticipates tech trends and positions ahead of time", "Excels at creating products from 0 to 1", "Inspires teams and stakeholders through vision"],
    blindSpots: ["May disconnect from current user needs", "Gap between ideals and execution can be wide", "Sometimes undervalues 'boring but important' foundational work"],
  },
  operator: {
    name: "The Operator",
    tagline: "Makes complex things happen in order",
    description:
      "Chaos is your stage. When projects stall, teams disagree, and deadlines loom, you get calmer. You build order from chaos, making the right things happen in the right sequence. Without you, the best ideas are just sticky notes on a whiteboard.",
    traits: ["High execution", "Expert coordinator", "Process-minded", "Strong communicator"],
    strengths: ["Builds order and processes from chaos", "World-class cross-team coordination", "Delivers projects on time with quality"],
    blindSpots: ["May rely too heavily on process, limiting innovation", "Tendency to fall into firefighting mode", "Product intuition and strategic thinking could grow"],
  },
};

const enQuestions: QuestionContent[] = [
  {
    scenario: "The CEO suddenly announces: 'We're cutting 50% of the product roadmap.' Your first reaction?",
    options: [
      "Pull the data immediately — which features have the lowest retention and ROI? Use numbers to decide what to cut",
      "Map each project to company strategic goals, keeping the ones most critical to the long-term vision",
      "Talk to core users first — find out which features they can't live without and decide from their perspective",
      "Gather team leads to align on priorities, ensuring cuts don't disrupt critical ongoing deliveries",
    ],
  },
  {
    scenario: "A competitor just launched a viral AI feature. The team is asking: 'Should we follow?'",
    options: [
      "Research the underlying tech architecture — is there a more cutting-edge approach to leapfrog them?",
      "Pull competitor user reviews and analyze their acquisition and retention metrics to see if it actually works",
      "Go back to our user scenarios — do users need this specific feature, or is there a deeper need behind it?",
      "Assess our resources and roadmap — can we follow quickly without derailing core deliveries?",
    ],
  },
  {
    scenario: "Your product launched 3 months ago but DAU won't grow. Your boss is getting impatient. What do you do?",
    options: [
      "Build a complete data funnel, find the worst drop-off point, and design targeted experiments to optimize it",
      "Step back: are we fighting in the wrong market? Do we need to redefine our target users entirely?",
      "Interview 20 churned users to find the real reasons they left, then fix experience issues one by one",
      "Align marketing, ops, and engineering on a 30-day sprint plan to break through with concentrated effort",
    ],
  },
  {
    scenario: "Engineering says: 'This feature is technically feasible, but it'll take at least 3 months.' Your reaction?",
    options: [
      "Dive into the technical approach with engineers — can we break it into smaller deliverables and ship an MVP first?",
      "Re-evaluate the business value — if the market window closes in 3 months, is it still worth building?",
      "Look for technical shortcuts or third-party solutions to validate the hypothesis at minimal cost",
      "Assess whether we can reallocate resources or reprioritize parallel projects to accelerate delivery",
    ],
  },
  {
    scenario: "The company is entering a completely new market (e.g., expanding internationally). How do you approach it?",
    options: [
      "Research tech trends and user behavior differences in the target market — can new tech create differentiation?",
      "Launch a simple landing page + paid ads test to validate demand at minimal cost",
      "Analyze the competitive landscape, regulatory environment, and business models, then build a phased entry strategy",
      "Find benchmark users in the target market, deeply understand their workflows and pain points, build a localized experience",
    ],
  },
  {
    scenario: "A designer presents a proposal that looks great visually but has complex interaction logic. How do you decide?",
    options: [
      "Draft a simplified interaction flow yourself, ensuring every step matches user mental models and habits",
      "Run a quick A/B test comparing conversion data between the complex and simplified approaches",
      "Judge from a product positioning angle — does this complex interaction reinforce our core value proposition?",
      "Bring design and engineering together to find the optimal trade-off between dev cost, timeline, and experience",
    ],
  },
  {
    scenario: "An internal tool is severely slowing down the team, but nobody wants to spend effort fixing it. What do you do?",
    options: [
      "Build a prototype over the weekend proving how much efficiency improves, using facts to drive the decision",
      "Do the math: team hours wasted vs. rebuild cost, then write a business case for management",
      "Research automation tools or AI solutions on the market — can low-code/AI solve this quickly?",
      "Launch a cross-team improvement initiative with clear milestones and owners, making it an official project",
    ],
  },
  {
    scenario: "During user interviews, someone describes a use case you never imagined. It seems niche but they're very excited. You...",
    options: [
      "Dig deep into the underlying need behind this scenario — could it evolve into the next core feature?",
      "Note it down, then check the database for how many users show similar behavior — let data decide priority",
      "Listen carefully, document the full user story, and think about how to elegantly support it within existing architecture",
      "Evaluate it against the broader product vision and market positioning — does it open a new market space?",
    ],
  },
  {
    scenario: "Your boss wants a new feature shipped in 2 weeks, but you know quality will suffer. How do you handle it?",
    options: [
      "Scope down — find the core experience path, build only the critical 20%, but make that 20% perfect",
      "Design a minimum viable experiment — ship a gray release in 2 days, then decide investment based on data",
      "Show the boss ROI comparison between full and minimal versions, negotiating for a reasonable timeline or resources",
      "Create a detailed 2-week sprint plan with daily deliverables, coordinating the team to go all-in on delivery",
    ],
  },
  {
    scenario: "You just inherited a product line with virtually zero documentation and a messy codebase. First step?",
    options: [
      "Use the product end-to-end yourself, documenting every experience issue and bug to establish a quality baseline",
      "Pull all user data and business metrics to understand how much value this product actually creates for the company",
      "Talk to every engineer, designer, and ops person involved — understand the history and current team situation",
      "Research this product's market and competitors, rethinking its strategic positioning and future possibilities",
    ],
  },
];

const enUI: UIContent = {
  intro: {
    badge: "2 min · 10 real-world scenarios",
    title: "What type of Product Manager are you?",
    subtitle: "10 real work scenarios with no right answers.\nYour instinctive choices reveal your PM archetype.",
    startButton: "Start the Quiz",
    noSignup: "No signup needed",
    duration: "~2 minutes",
    instant: "Instant results",
    framework: "Framework based on Reforge PM Competency Model & SVPG Product Management Framework",
  },
  quiz: { prev: "← Previous", next: "Next →", viewResult: "View Results" },
  result: {
    yourType: "Your PM Archetype",
    match: "match",
    secondary: "Secondary",
    distribution: "Archetype Distribution",
    strengths: "Core Strengths",
    blindSpots: "Growth Areas",
    secondaryType: "Secondary Archetype",
    saveImage: "Save Image",
    saving: "Generating...",
    share: "Share",
    copied: "Link copied",
    retest: "Retake",
    ctaTitle: "Want a deeper assessment based on real experience?",
    ctaDesc: "Caliber uses AI to analyze your work history across 16 PM dimensions, generating a professional report and action plan.",
    ctaButton: "Start Free Assessment →",
    brandmark: "CALIBER · PM ARCHETYPE ASSESSMENT",
    framework: "Archetype model based on Reforge PM Competency Model & SVPG Product Management Framework",
    secondaryDesc: ({ sName, pct, trait1, trait2, pName }) =>
      `You also show strong ${trait1} and ${trait2} traits. The combination of ${pName}'s core abilities with ${sName}'s perspective gives you a multi-dimensional approach to complex problems.`,
  },
};

// ─── Content index ───
const ALL_CONTENT: Record<string, {
  archetypes: Record<ArchetypeKey, ArchetypeContent>;
  questions: QuestionContent[];
  ui: UIContent;
}> = {
  zh: { archetypes: zhArchetypes, questions: zhQuestions, ui: zhUI },
  en: { archetypes: enArchetypes, questions: enQuestions, ui: enUI },
};

export function getContent(locale: string) {
  return ALL_CONTENT[locale] || ALL_CONTENT.en;
}

// Card gradients (locale-independent)
export const CARD_GRADIENTS: Record<ArchetypeKey, string> = {
  craftsperson: "linear-gradient(135deg, #4338ca, #3b82f6)",
  strategist: "linear-gradient(135deg, #7c3aed, #a855f7)",
  "growth-hacker": "linear-gradient(135deg, #059669, #10b981)",
  visionary: "linear-gradient(135deg, #d97706, #f59e0b)",
  operator: "linear-gradient(135deg, #0284c7, #38bdf8)",
};
