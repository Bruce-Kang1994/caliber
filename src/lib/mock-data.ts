import type { AssessmentResult, WorkExperience, ActionItemV2, NextStepV2 } from "./types";

// Mock resume parse result (based on Bruce's real resume)
export const MOCK_EXPERIENCES: WorkExperience[] = [
  {
    company: "Super IP Consultant (Beijing) Co., Ltd",
    title: "Product Manager",
    duration: "2023.09 - Present",
    responsibilities:
      "Led academic capability building and scholar achievement dissemination module for Xinhua Net's Academic China platform — China's first national-level IP intelligence service platform.",
    projects: [
      {
        name: "Xinhua Net Academic China IP Service Platform",
        background:
          "As product owner, led the construction of academic achievement dissemination service system covering academic infrastructure + personal achievement management, solving pain points of irregular achievement management, weak IP protection, and low conversion efficiency.",
        actions:
          "Built 5 core capabilities (literature search, plagiarism check, AIGC detection, patent detection, patent evaluation). Designed publishing, authorization, and conversion modules. Coordinated with legal team for standardized agreements and e-signatures.",
        results:
          "Publishing conversion rate +57%, copyright confirmation efficiency +90%, 5000+ blockchain certificates generated. Authorization conversion rate +42%, dispute rate -65%. Conversion rate +27%, 300+ items published.",
      },
    ],
    achievements: [
      "Complete academic workflow with 1890 new users, 72% from universities",
      "Built back-office system: lead management, contract management, order management, invoice management",
    ],
  },
  {
    company: "Zhuang Xiaomi",
    title: "Product Manager",
    duration: "2023.03 - 2023.07",
    responsibilities:
      "Responsible for monitoring business product optimization, focusing on improving user service completion rate.",
    projects: [
      {
        name: "Monitoring Service Completion Rate Improvement",
        background:
          "User churn rate exceeded 30% after signing. Root causes: service process opacity (44%), high communication cost with monitors (38%), lack of trust (18%).",
        actions:
          "Built service progress visualization module, launched monitor communication features, established trust mechanisms. Created monitor workbench for standardized service delivery.",
        results: "User service completion rate improved by 17%.",
      },
    ],
    achievements: [
      "Monitor response rate ≥80% within 1 hour",
      "Service standardization rate significantly improved",
    ],
  },
  {
    company: "VIPKID",
    title: "Product Manager",
    duration: "2018.03 - 2020.09",
    responsibilities:
      "Led e-commerce after-sales system restructuring and operational strategy optimization for online education platform.",
    projects: [
      {
        name: "E-commerce After-Sales System Restructuring",
        background:
          "Platform order volume surged but after-sales capacity couldn't keep up. No complete online information flow, cross-department delays, manual errors, long processing cycles.",
        actions:
          "As project owner, built end-to-end automation: self-service application + auto response/review + order visualization + customer service workbench. Integrated warehouse and finance systems.",
        results:
          "After-sales completion time reduced from 72 hours to 48 hours.",
      },
    ],
    achievements: [
      "Improved course attendance rate and lesson consumption rate through interactive ranking and certificate strategies",
      "After-sales completion time reduced by 33%",
    ],
  },
  {
    company: "China Merchants Bank, Tianjin Branch",
    title: "Product Operations",
    duration: "2016.08 - 2018.01",
    responsibilities:
      "Managed retail credit cooperation loan business development, product R&D, market research, and competitive analysis.",
    projects: [],
    achievements: [
      "10+ cooperation loan disbursements",
      "700+ new customers from single credit card marketing campaign",
    ],
  },
];

// Mock assessment result (based on Bruce's actual diagnosis from conversation)
export const MOCK_ASSESSMENT_RESULT: AssessmentResult = {
  roleType: "ai-pm",
  weightedScore: 58,
  archetype: "craftsperson",
  summary:
    "A PM with solid B2B product foundations in system design and business problem decomposition. Currently transitioning to AI product management with strong AI tool application skills, but significant gaps remain in C2C product sense, commercialization, and growth — the core competencies required for an AI PM role.",
  scores: {
    "requirement-analysis": 3.5,
    "product-design": 4.0,
    "system-architecture": 3.5,
    "zero-to-one": 3.5,
    "user-research": 3.0,
    "data-experimentation": 2.5,
    "business-decomposition": 4.0,
    "commercialization-growth": 1.5,
    "product-vision": 3.0,
    "stakeholder-management": 3.0,
    "project-management": 3.5,
    "self-awareness": 1.5,
    "ai-product-design": 2.0,
    "ai-tech-application": 3.5,
    "cross-cultural": 2.0,
    "product-sense": 2.0,
  },
  justifications: {
    "requirement-analysis":
      "Demonstrated solid requirement analysis at VIPKID (decomposing after-sales pain points) and Academic China (multi-scenario requirement definition). Can independently identify and structure requirements from business context.",
    "product-design":
      "Strong evidence across multiple projects: VIPKID after-sales system (user + CS + warehouse + finance flows), Academic China platform (publishing + authorization + conversion scenarios), Zhuang Xiaomi monitoring workbench. Consistently delivers well-structured B2B product designs.",
    "system-architecture":
      "VIPKID after-sales restructuring involved multi-system coordination (user-facing, CS workbench, warehouse, finance). Academic China required integrating blockchain for certificates. Shows ability to think in systems.",
    "zero-to-one":
      "Academic China achievement dissemination module was built from 0-to-1 with measurable outcomes (+57% conversion, 1890 users). However, this was within an existing platform, not a standalone product launch.",
    "user-research":
      "Conducted 20 user interviews for PostMem startup. Zhuang Xiaomi project showed user-centric analysis with quantified pain point attribution. Has foundations but hasn't built systematic research practices.",
    "data-experimentation":
      "Resume shows data outcomes (72h→48h, +57%, -65%) but candidate self-reported lacking data-driven decision habits during VIPKID. Data appears to be post-hoc reporting rather than driving product decisions. No evidence of structured experimentation frameworks or A/B testing methodology.",
    "business-decomposition":
      "Excellent example at Zhuang Xiaomi: decomposed 30% churn rate into 3 quantified root causes (44% opacity, 38% communication cost, 18% trust deficit) and designed targeted solutions for each. This is textbook business problem decomposition.",
    "commercialization-growth":
      "No evidence of pricing strategy, monetization model design, or revenue optimization experience across any role. Growth experience limited to one data point: 700+ customers from a single credit card campaign at China Merchants Bank. No internet product growth experience (acquisition funnels, retention optimization, experimentation frameworks). This is a critical gap for an AI PM targeting commercial products.",
    "product-vision":
      "PostMem startup demonstrates ability to articulate a product vision and identify a market opportunity. Academic China also required defining a product direction within a complex stakeholder environment. However, no evidence of long-term roadmap thinking or vision-driven prioritization across multiple cycles.",
    "stakeholder-management":
      "Coordinated with legal teams for standardized agreements at Academic China and managed cross-functional alignment across sales, warehouse, and finance at VIPKID. Shows functional stakeholder coordination, though no evidence of executive-level influence or managing competing stakeholder priorities strategically.",
    "project-management":
      "Multiple project owner experiences across companies. Coordinated cross-functional teams (sales, legal, warehouse, finance). Demonstrated ability to manage complex multi-stakeholder projects.",
    "self-awareness":
      "Significant gap identified: systematically undervalues own experience. Described VIPKID's after-sales system restructuring (major project) as 'CRM tool building' (minor work). Called Academic China experience 'no real capability improvement' despite strong quantitative results.",
    "ai-product-design":
      "Academic China included AIGC detection features, which shows exposure to AI capabilities in product context. However, no experience designing AI-native products where AI is the core value proposition.",
    "ai-tech-application":
      "CS undergraduate + CS master's degree provides strong technical foundation. Currently using Claude Code and mainstream AI models extensively, with deep understanding of model differences and capabilities. Heavy practical user: applies AI tools for market research, competitive analysis, product decisions, prototype generation, and growth planning — placing the candidate in the top tier of PM AI tool adoption. Lacks production-level prompt engineering or AI architecture experience.",
    "cross-cultural":
      "Master's degree from University of Science Malaysia provides cross-cultural exposure. Currently building AI product for overseas market. But no shipped international product yet.",
    "product-sense":
      "Entire career has been B2B-focused with no C2C product experience. No demonstrated ability to intuitively evaluate consumer-facing product decisions, identify user delight moments, or assess product-market fit from a consumer lens. PostMem represents an opportunity to develop this skill, but it remains unproven.",
  },
  topStrengths: [
    {
      dimension: "business-decomposition",
      dimensionName: "Business Problem Decomposition",
      score: 4.0,
      evidence:
        "At Zhuang Xiaomi, decomposed a 30% user churn rate into three quantified root causes (44% process opacity, 38% high communication cost, 18% trust deficit) and designed targeted solutions for each — resulting in 17% completion rate improvement. This structured analytical approach is consistently demonstrated across roles.",
    },
    {
      dimension: "product-design",
      dimensionName: "Product Design",
      score: 4.0,
      evidence:
        "Designed complex multi-system products: VIPKID after-sales system (user self-service + auto-review + CS workbench + warehouse + finance integration), Academic China platform (5 core capabilities + 3 business scenarios + back-office system). Consistently delivers comprehensive, well-structured B2B product architectures.",
    },
    {
      dimension: "ai-tech-application",
      dimensionName: "AI Technology & Tool Application",
      score: 3.5,
      evidence:
        "Combines strong technical foundations (CS undergraduate + master's) with extensive practical AI tool usage for core PM work: market research, competitive analysis, product decisions, prototype generation, and growth planning. Currently using Claude Code as primary development tool. This level of AI integration into PM workflow is significantly above average.",
    },
  ],
  topWeaknesses: [
    {
      dimension: "commercialization-growth",
      dimensionName: "Commercialization & Growth",
      score: 1.5,
      upgradeAdvice:
        "Your business decomposition skill is already at 4.0 — apply that same structured thinking to commercial model design and growth strategy. Break down pricing the way you broke down Zhuang Xiaomi's churn rate: analyze competitor pricing tiers, map user willingness-to-pay segments, and model unit economics. Then extend that analytical rigor to acquisition funnels and retention metrics. Your framework is strong; you just haven't pointed it at monetization and growth yet.",
      actionItems: [
        { action: "Design a complete pricing model for PostMem — including free tier, paid tiers, and the reasoning behind each price point", timeframe: "2 weeks", artifact: "A pricing doc with tier breakdown, willingness-to-pay analysis, and unit economics model" },
        { action: "Study 3 successful AI SaaS products' pricing pages and reverse-engineer their pricing logic", timeframe: "1 month", artifact: "Competitive pricing teardown document with comparison table" },
        { action: "Define PostMem's north star metric and set up basic analytics tracking before launch", timeframe: "this week", artifact: "Analytics dashboard with north star metric tracked" },
      ] as ActionItemV2[],
    },
    {
      dimension: "self-awareness",
      dimensionName: "Self-Awareness & Communication",
      score: 1.5,
      upgradeAdvice:
        "Your Academic China project delivered +57% publishing conversion and 5000+ blockchain certificates — these are strong results for any PM. Yet you described this experience as having 'no real capability improvement.' Similarly, you called your VIPKID work 'CRM building' when it was actually a multi-system after-sales restructuring. Reframe each experience using the STAR method to capture its full value.",
      actionItems: [
        { action: "Rewrite each work experience using Background → Action → Result → Learning structure, ensuring every achievement is quantified", timeframe: "this week", artifact: "Revised resume with STAR-formatted experience descriptions" },
        { action: "Practice describing your top 3 projects in 2-minute pitches — record yourself and listen back to identify where you undersell", timeframe: "2 weeks", artifact: "3 recorded pitch videos with self-review notes" },
        { action: "Ask a trusted colleague to review your resume and flag places where you undersell yourself", timeframe: "1 month", artifact: "Peer-reviewed resume with highlighted improvements" },
      ] as ActionItemV2[],
    },
    {
      dimension: "product-sense",
      dimensionName: "Product Sense",
      score: 2.0,
      upgradeAdvice:
        "Your entire career has been B2B-focused, which means you haven't had opportunities to develop the intuitive consumer product judgment that C2C roles demand. Product sense is built through repeated exposure: studying why successful consumer products feel 'right,' deconstructing user delight moments, and making quick product bets with real user feedback. PostMem is your ideal training ground — treat every feature decision as a chance to sharpen your C2C intuition.",
      actionItems: [
        { action: "Do a weekly teardown of one consumer product you admire — document what makes key interactions feel intuitive and where friction exists", timeframe: "ongoing", artifact: "Weekly product teardown notes (at least 4 entries)" },
        { action: "For each PostMem feature decision, write a 'product instinct check' before validating with data", timeframe: "ongoing", artifact: "Instinct-vs-data log comparing predictions to actual user behavior" },
        { action: "Interview 5 target users about their current workflow and pain points to build consumer empathy", timeframe: "2 weeks", artifact: "User interview synthesis document with key insights" },
      ] as ActionItemV2[],
    },
  ],
  undervaluedExperiences: [
    "Academic China Platform: This is a national-level project (Xinhua Net backed) with impressive quantitative results (+57% conversion, +90% efficiency, 5000+ certificates). The fact that you were product owner for a government-backed platform is a significant credential that should be prominently featured in interviews.",
    "CS Education Background: Having both a software engineering undergraduate degree and a computer science master's degree is rare among PMs. Combined with your hands-on coding ability, this gives you a technical credibility edge that most PM candidates cannot match — especially valuable for AI PM roles.",
    "Cross-Industry Experience: Working across banking, edtech, home services, and IP/academic sectors gives you a breadth of business model understanding that specialists lack. Frame this as 'rapid domain learning ability' rather than 'couldn't settle in one industry.'",
  ],
  missingElements: [
    "No C2C product experience: Your entire career has been B2B-focused. For AI PM roles that often involve consumer-facing products, you need to demonstrate user empathy and consumer product thinking. PostMem can fill this gap if you approach it deliberately.",
    "No shipped product with real revenue: While you have strong project delivery records, none of your products have a commercialization story. Launching PostMem with even modest revenue would significantly strengthen your profile.",
    "No growth metrics: You lack quantified growth achievements (DAU/MAU growth, retention improvement, CAC optimization). This is expected given your B2B background but needs addressing for AI PM roles.",
  ],
  nextSteps: [
    { action: "Rewrite your resume using the STAR framework — clearly separate YOUR decisions from the team's work, ensure every achievement has a specific number", timeframe: "this week", rationale: "Your current resume undersells strong projects like Academic China; fixing this is the highest-ROI move for interviews" },
    { action: "Launch PostMem MVP and focus on getting your first 100 users", timeframe: "1 month", rationale: "This single action fills three gaps simultaneously: C2C experience, 0-to-1 with real users, and growth metrics" },
    { action: "Build a pricing model for PostMem — even if you start free, have the strategy ready", timeframe: "2 weeks", rationale: "Demonstrates commercialization thinking, which is your largest gap at 1.5/5.0" },
    { action: "Set up basic analytics (north star metric + retention cohorts) before PostMem launch", timeframe: "2 weeks", rationale: "Without data infrastructure, you can't build the data-driven decision habit you currently lack" },
    { action: "Do weekly consumer product teardowns and document your product instinct predictions vs actual outcomes", timeframe: "ongoing", rationale: "Builds the C2C product sense you need for AI PM roles through deliberate practice" },
  ] as NextStepV2[],
  timestamp: new Date().toISOString(),
};

// Chinese mock assessment result
export const MOCK_ASSESSMENT_RESULT_ZH: AssessmentResult = {
  roleType: "ai-pm",
  weightedScore: 58,
  archetype: "craftsperson",
  summary:
    "一位具备扎实B2B产品基础的PM，在系统设计和业务问题拆解方面表现突出。目前正在向AI产品经理转型，AI工具应用能力强，但在C端产品感觉、商业化和增长方面存在明显短板——这些恰恰是AI PM岗位的核心能力要求。",
  scores: {
    "requirement-analysis": 3.5,
    "product-design": 4.0,
    "system-architecture": 3.5,
    "zero-to-one": 3.5,
    "user-research": 3.0,
    "data-experimentation": 2.5,
    "business-decomposition": 4.0,
    "commercialization-growth": 1.5,
    "product-vision": 3.0,
    "stakeholder-management": 3.0,
    "project-management": 3.5,
    "self-awareness": 1.5,
    "ai-product-design": 2.0,
    "ai-tech-application": 3.5,
    "cross-cultural": 2.0,
    "product-sense": 2.0,
  },
  justifications: {
    "requirement-analysis": "在VIPKID（拆解售后痛点）和学术中国（多场景需求定义）中展现了扎实的需求分析能力。",
    "product-design": "多个项目中表现强劲：VIPKID售后系统、学术中国平台、装小蜜监理工作台。",
    "system-architecture": "VIPKID售后重构涉及多系统协调，学术中国需要集成区块链。具备系统思维能力。",
    "zero-to-one": "学术中国成果传播模块从0到1搭建，成果显著（+57%转化，1890用户）。",
    "user-research": "为PostMem做了20次用户访谈。装小蜜项目展示了用户导向的分析方法。",
    "data-experimentation": "简历展示了数据结果，但数据更多是事后汇报而非驱动产品决策。缺乏结构化实验框架或A/B测试方法论的证据。",
    "business-decomposition": "装小蜜案例堪称教科书级：将30%流失率拆解为3个量化根因并逐一设计解决方案。",
    "commercialization-growth": "没有定价策略、商业模式设计或收入优化的经验。增长经验仅有招商银行一次营销活动（700+新客户），缺乏互联网产品增长经验（获客漏斗、留存优化、实验框架）。这是AI PM的关键短板。",
    "product-vision": "PostMem创业展示了表达产品愿景和识别市场机会的能力。学术中国也需要在复杂利益相关者环境中定义产品方向。但缺乏长期路线图思维或跨多个周期的愿景驱动优先级排序的证据。",
    "stakeholder-management": "在学术中国协调法务团队完成标准化协议，在VIPKID管理销售、仓储、财务的跨职能对齐。展示了职能层面的利益相关者协调能力，但缺乏高管层面影响力或战略性管理竞争性利益相关者优先级的证据。",
    "project-management": "多个项目负责人经验，协调跨职能团队（销售、法务、仓储、财务）。",
    "self-awareness": "系统性低估自身经验。将VIPKID售后系统重构描述为'CRM工具搭建'。",
    "ai-product-design": "学术中国包含AIGC检测功能，但没有设计过AI原生产品的经验。",
    "ai-tech-application": "计算机本科+硕士提供了强技术基础，大量使用Claude Code和主流AI模型，深入理解模型差异和能力。深度AI工具用户：用AI做市场调研、竞品分析、产品决策、原型生成和增长规划——AI融入PM工作流的程度处于行业领先水平。缺乏生产级提示工程或AI架构经验。",
    "cross-cultural": "马来西亚理科大学硕士学位提供了跨文化背景。正在构建面向海外市场的AI产品。",
    "product-sense": "整个职业生涯聚焦B端，缺乏C端产品经验。没有展示出直觉性评估消费者产品决策、识别用户愉悦时刻或从消费者视角判断产品市场契合度的能力。PostMem是培养此能力的机会，但目前尚未验证。",
  },
  topStrengths: [
    {
      dimension: "business-decomposition",
      dimensionName: "业务问题拆解",
      score: 4.0,
      evidence:
        "在装小蜜，将30%的用户流失率拆解为三个量化根因（44%流程不透明、38%沟通成本高、18%信任缺失），并为每个根因设计了针对性解决方案——最终服务完成率提升17%。这种结构化分析能力在各段经历中一以贯之。",
    },
    {
      dimension: "product-design",
      dimensionName: "产品设计",
      score: 4.0,
      evidence:
        "设计了多个复杂多系统产品：VIPKID售后系统（用户自助+自动审核+客服工作台+仓储+财务集成），学术中国平台（5大核心能力+3个业务场景+后台管理系统）。持续交付全面、结构清晰的B2B产品架构。",
    },
    {
      dimension: "ai-tech-application",
      dimensionName: "AI技术与工具应用",
      score: 3.5,
      evidence:
        "结合扎实的技术基础（计算机本科+硕士）与广泛的AI工具实践应用：市场调研、竞品分析、产品决策、原型生成和增长规划。目前使用Claude Code作为主力开发工具。这种AI融入PM工作流的程度显著高于平均水平。",
    },
  ],
  topWeaknesses: [
    {
      dimension: "commercialization-growth",
      dimensionName: "商业化与增长",
      score: 1.5,
      upgradeAdvice:
        "你的业务拆解能力已达4.0分——把同样的结构化思维用到商业模式设计和增长策略上。像拆解装小蜜流失率一样拆解定价：分析竞品定价层级，绘制用户支付意愿分布，建模单位经济。然后将同样的分析严谨性延伸到获客漏斗和留存指标。你的分析框架很强，只是还没对准变现和增长方向。",
      actionItems: [
        { action: "为PostMem设计一套完整的定价模型——包括免费层、付费层以及每个定价点背后的逻辑", timeframe: "2 weeks", artifact: "定价文档：层级拆解、支付意愿分析、单位经济模型" },
        { action: "研究3个成功AI SaaS产品的定价页面，逆向拆解它们的定价逻辑", timeframe: "1 month", artifact: "竞品定价拆解文档，含对比表格" },
        { action: "定义PostMem的北极星指标，在上线前搭建基础数据追踪", timeframe: "this week", artifact: "已配置的数据看板，包含北极星指标追踪" },
      ] as ActionItemV2[],
    },
    {
      dimension: "self-awareness",
      dimensionName: "自我认知与表达",
      score: 1.5,
      upgradeAdvice:
        "你的学术中国项目实现了+57%发布转化率和5000+区块链证书——这对任何PM来说都是强结果。但你把这段经历描述为'没有真正的能力提升'。同样，你把VIPKID的工作称为'CRM搭建'，实际上是一次多系统售后重构。用STAR方法重新描述每段经历，呈现其完整价值。",
      actionItems: [
        { action: "用 背景→行动→结果→收获 结构重写每段工作经历，确保每个成就都有具体数字", timeframe: "this week", artifact: "STAR格式重写的简历" },
        { action: "练习用2分钟讲述你的Top 3项目——录下来回听，找到你低估自己的地方", timeframe: "2 weeks", artifact: "3段录制的项目陈述视频+自评笔记" },
        { action: "请一位信任的同事审阅你的简历，标出你低估自己的地方", timeframe: "1 month", artifact: "同行评审后的简历，标注改进点" },
      ] as ActionItemV2[],
    },
    {
      dimension: "product-sense",
      dimensionName: "产品感觉",
      score: 2.0,
      upgradeAdvice:
        "你的整个职业生涯都聚焦B端，这意味着你还没有机会培养C端岗位所要求的直觉性消费者产品判断力。产品感觉是通过反复接触来建立的：研究成功消费者产品为什么用起来'对'，拆解用户愉悦时刻，并通过真实用户反馈来做快速产品决策。PostMem是你理想的训练场——把每一个功能决策都当作磨练C端直觉的机会。",
      actionItems: [
        { action: "每周拆解一个你欣赏的消费者产品——记录关键交互为什么感觉直觉化，以及摩擦点在哪里", timeframe: "ongoing", artifact: "每周产品拆解笔记（至少4篇）" },
        { action: "为PostMem的每个功能决策写一段'产品直觉检验'——先写下直觉判断，再用数据验证", timeframe: "ongoing", artifact: "直觉-vs-数据对比日志" },
        { action: "访谈5位目标用户，了解他们当前的工作流和痛点，培养C端同理心", timeframe: "2 weeks", artifact: "用户访谈综合文档，含关键洞察" },
      ] as ActionItemV2[],
    },
  ],
  undervaluedExperiences: [
    "学术中国平台：这是国家级项目（新华网背书），有令人印象深刻的量化成果（+57%转化、+90%效率、5000+证书）。作为国家平台的产品负责人，这是面试中应该重点展示的资历。",
    "计算机教育背景：同时拥有软件工程本科和计算机硕士学位在PM中非常稀缺。结合你的实际编码能力，这给你一个大多数PM候选人无法匹配的技术可信度优势——对AI PM岗位尤其有价值。",
    "跨行业经验：横跨银行、在线教育、家居服务和IP/学术领域的工作经历，给你带来专家型候选人缺乏的商业模式理解广度。将此定位为'快速领域学习能力'，而非'无法在一个行业扎根'。",
  ],
  missingElements: [
    "缺乏C端产品经验：你的整个职业生涯都聚焦B端。对于经常涉及消费者产品的AI PM岗位，你需要展示用户同理心和C端产品思维。PostMem可以填补这一空白。",
    "没有真正产生收入的产品：虽然你有出色的项目交付记录，但没有一个产品有商业化故事。哪怕PostMem上线后产生微薄收入，都会显著增强你的简历。",
    "缺乏增长指标：你没有量化的增长成就（DAU/MAU增长、留存提升、获客成本优化）。这在B2B背景下可以理解，但转AI PM必须补上。",
  ],
  nextSteps: [
    { action: "用STAR框架重写简历——每段经历清楚区分你个人的决策和行动，确保每个成就都有具体数字", timeframe: "this week", rationale: "你当前的简历严重低估了学术中国等强项目，修改简历是面试前ROI最高的行动" },
    { action: "上线PostMem MVP，目标获取前100个用户", timeframe: "1 month", rationale: "这一个行动同时填补三个短板：C端经验、真实用户的0到1、增长指标" },
    { action: "为PostMem设计定价模型——即使一开始免费，也要准备好定价策略", timeframe: "2 weeks", rationale: "展示商业化思维，这是你最大的短板（1.5/5.0）" },
    { action: "在PostMem上线前搭建基础数据体系（北极星指标+留存队列）", timeframe: "2 weeks", rationale: "没有数据基础设施，就无法养成你目前缺乏的数据驱动决策习惯" },
    { action: "每周做消费者产品拆解，记录你的产品直觉预测和实际结果对比", timeframe: "ongoing", rationale: "通过刻意练习建立AI PM岗位需要的C端产品感觉" },
  ] as NextStepV2[],
  timestamp: new Date().toISOString(),
};

// Get mock data by locale
export function getMockAssessmentResult(locale: string): AssessmentResult {
  return locale === "zh" ? MOCK_ASSESSMENT_RESULT_ZH : MOCK_ASSESSMENT_RESULT;
}
