import type { PMRole, PMLevel, PMRoleConfig, PMLevelConfig, Dimension, DimensionKey } from "./types";

// ============================================================
// PM Roles Configuration
// ============================================================
export const PM_ROLES: PMRoleConfig[] = [
  {
    id: "b2b-pm",
    name: "B2B Product Manager",
    description:
      "Enterprise tools, SaaS platforms, internal systems, CRM, ERP",
    icon: "Building2",
  },
  {
    id: "c2c-pm",
    name: "Consumer Product Manager",
    description:
      "Consumer apps, social products, e-commerce, content platforms",
    icon: "Users",
  },
  {
    id: "ai-pm",
    name: "AI Product Manager",
    description:
      "AI-native products, LLM applications, ML platforms, AI features",
    icon: "Brain",
  },
  {
    id: "growth-pm",
    name: "Growth Product Manager",
    description:
      "User acquisition, activation, retention, monetization, experimentation",
    icon: "TrendingUp",
  },
  {
    id: "data-pm",
    name: "Data Product Manager",
    description:
      "Data platforms, analytics tools, BI dashboards, data pipelines",
    icon: "BarChart3",
  },
];

// ============================================================
// PM Seniority Levels
// ============================================================
export const PM_LEVELS: PMLevelConfig[] = [
  {
    id: "junior",
    name: "Junior PM / APM",
    description: "Entry-level, learning the craft, executing well-defined tasks",
    yearsRange: "0-2 years",
  },
  {
    id: "mid",
    name: "Product Manager",
    description: "Independent execution, owns a product area or feature set",
    yearsRange: "2-5 years",
  },
  {
    id: "senior",
    name: "Senior PM / Lead PM",
    description: "Drives product strategy, mentors others, cross-team influence",
    yearsRange: "5-10 years",
  },
  {
    id: "director",
    name: "Director / VP of Product",
    description: "Owns product portfolio, organizational leadership, business impact",
    yearsRange: "10+ years",
  },
];

// ============================================================
// Assessment Dimensions (16 total, v2.0)
//
// Framework Sources:
// - Ravi Mehta / Reforge: 12-competency PM Skills model
// - Marty Cagan / SVPG: Coaching Assessment framework
// - Google PM Hiring: Technical Insight, GCA
// - Meta PM Evaluation: Product Sense, Execution, Leadership
// ============================================================
export const DIMENSIONS: Dimension[] = [
  // --- Category: Product Execution (4 dimensions) ---
  {
    key: "requirement-analysis",
    name: "Requirement Analysis & Specification",
    description:
      "Extract clear requirements from business/user needs and write actionable PRDs with edge cases and acceptance criteria",
    source: "Ravi Mehta: Feature Specification",
  },
  {
    key: "product-design",
    name: "Product Design & UX",
    description:
      "User journey, information architecture, interaction logic, and user experience design quality",
    source: "Ravi Mehta: UX Design + SVPG: Product Discovery",
  },
  {
    key: "system-architecture",
    name: "System Architecture Understanding",
    description:
      "Ability to design multi-module/multi-system collaborative product solutions and make informed technical tradeoffs",
    source: "Google: Technical Insight",
  },
  {
    key: "zero-to-one",
    name: "0-to-1 Delivery Capability",
    description:
      "Experience building products from idea to launch with complete delivery loop, MVP scoping, and iteration planning",
    source: "Ravi Mehta: Product Delivery",
  },

  // --- Category: Customer & Data Insight (2 dimensions) ---
  {
    key: "user-research",
    name: "User Research & Insight",
    description:
      "Interview design, insight extraction, needs validation, and strategic customer orientation",
    source: "Ravi Mehta: Voice of Customer + SVPG: User/Customer Knowledge",
  },
  {
    key: "data-experimentation",
    name: "Data-Driven & Experimentation",
    description:
      "Using data to discover problems, designing statistically valid A/B tests, interpreting results, and guiding iterations through hypothesis-driven experimentation",
    source: "Ravi Mehta: Fluency with Data + Growth experimentation methodology",
  },

  // --- Category: Product Strategy & Business (3 dimensions) ---
  {
    key: "business-decomposition",
    name: "Business Problem Decomposition",
    description:
      "Structuring ambiguous business problems, identifying core leverage points, and translating business goals into product opportunities",
    source: "SVPG: Business/Company Knowledge",
  },
  {
    key: "commercialization-growth",
    name: "Commercialization & Growth",
    description:
      "Pricing strategy, monetization model design, LTV/CAC thinking, and hands-on experience in acquisition, activation, retention, and monetization",
    source: "Ravi Mehta: Business Outcome Ownership + Strategic Impact",
  },
  {
    key: "product-vision",
    name: "Product Vision & Strategic Thinking",
    description:
      "Defining long-term product direction, competitive positioning, roadmap prioritization, and connecting product decisions to business strategy",
    source: "Ravi Mehta: Product Vision & Roadmapping",
  },

  // --- Category: Influencing People (3 dimensions) ---
  {
    key: "stakeholder-management",
    name: "Stakeholder Management & Cross-functional Influence",
    description:
      "Aligning diverse stakeholders, influencing without authority, managing up, and driving consensus across engineering, design, marketing, and leadership",
    source: "Ravi Mehta: Stakeholder Management + Team Leadership",
  },
  {
    key: "project-management",
    name: "Project Management & Execution Drive",
    description:
      "Cross-functional coordination, priority decisions, resource management, and driving projects to completion under constraints",
    source: "Retained from v1, aligned with Ravi Mehta: Product Delivery",
  },
  {
    key: "self-awareness",
    name: "Self-Awareness & Communication",
    description:
      "Accurate self-assessment, ability to articulate experience value clearly, and effective written/verbal communication for different audiences",
    source: "Retained from v1, unique to Caliber career assessment context",
  },

  // --- Category: AI & Emerging Capabilities (4 dimensions) ---
  {
    key: "ai-product-design",
    name: "AI Product Design",
    description:
      "Designing AI-native product experiences (not just adding AI features), understanding AI UX patterns, and managing user expectations around AI capabilities",
    source: "Caliber original — 2026 forward-looking dimension",
  },
  {
    key: "ai-tech-application",
    name: "AI Technical Understanding & Application",
    description:
      "Understanding model capabilities/limitations, prompt engineering, AI architecture patterns, and using AI tools to enhance PM work efficiency",
    source: "Caliber original — merged AI Tech Understanding + AI Tool Application from v1",
  },
  {
    key: "cross-cultural",
    name: "Cross-Cultural & Localization",
    description:
      "Cultural understanding of target markets, localized product design ability, and adapting product mechanisms across different user behavior patterns",
    source: "Caliber original — Asia-Pacific market positioning",
  },
  {
    key: "product-sense",
    name: "Product Sense & Creativity",
    description:
      "Intuitive ability to identify product problems, generate creative solutions, evaluate tradeoffs, and prioritize by user impact",
    source: "Meta: Product Sense — core PM evaluation dimension",
  },
];

// ============================================================
// Role-Specific Dimension Weights (1-5)
//
// Updated based on 10 expert PM reviews:
// - B2B/Consumer AI weights raised for 2026 reality
// - B2B Growth raised (PLG transformation)
// - Growth PM User Research lowered (quantitative > qualitative)
// - New dimensions weighted appropriately per role
// ============================================================
export const ROLE_WEIGHTS: Record<PMRole, Record<DimensionKey, number>> = {
  "b2b-pm": {
    "requirement-analysis": 5,
    "product-design": 4,
    "system-architecture": 5,
    "zero-to-one": 4,          // raised from 3 (Amazon expert)
    "user-research": 4,        // raised from 3 (SaaS VP expert)
    "data-experimentation": 3,
    "business-decomposition": 5,
    "commercialization-growth": 4, // raised from 3 (Amazon expert)
    "product-vision": 4,       // NEW: important for B2B strategy
    "stakeholder-management": 5, // NEW: critical for enterprise PM
    "project-management": 5,
    "self-awareness": 3,
    "ai-product-design": 3,    // raised from 1 (2026 reality)
    "ai-tech-application": 2,  // raised from 1
    "cross-cultural": 2,       // raised from 1 (global SaaS)
    "product-sense": 3,        // NEW
  },
  "c2c-pm": {
    "requirement-analysis": 4,
    "product-design": 5,
    "system-architecture": 3,  // raised from 2 (Meta expert)
    "zero-to-one": 4,
    "user-research": 5,
    "data-experimentation": 4,
    "business-decomposition": 3,
    "commercialization-growth": 5,
    "product-vision": 4,       // NEW
    "stakeholder-management": 3, // NEW
    "project-management": 3,
    "self-awareness": 3,
    "ai-product-design": 3,    // raised from 1 (2026 reality)
    "ai-tech-application": 2,  // raised from 1
    "cross-cultural": 3,       // raised from 2
    "product-sense": 5,        // NEW: core for consumer PM
  },
  "ai-pm": {
    "requirement-analysis": 4,
    "product-design": 4,
    "system-architecture": 4,
    "zero-to-one": 5,
    "user-research": 3,        // lowered from 4 (AI CPO expert)
    "data-experimentation": 4, // raised from 3
    "business-decomposition": 4,
    "commercialization-growth": 3, // lowered from 4 (AI CPO expert)
    "product-vision": 5,       // NEW: AI PM is vision-heavy
    "stakeholder-management": 4, // NEW
    "project-management": 4,
    "self-awareness": 3,
    "ai-product-design": 5,
    "ai-tech-application": 5,
    "cross-cultural": 2,       // lowered from 3
    "product-sense": 4,        // NEW
  },
  "growth-pm": {
    "requirement-analysis": 2, // lowered from 3 (Uber growth expert)
    "product-design": 3,
    "system-architecture": 2,
    "zero-to-one": 3,
    "user-research": 2,        // lowered from 4 (Growth PMs use quantitative > qualitative)
    "data-experimentation": 5, // renamed and core skill
    "business-decomposition": 4,
    "commercialization-growth": 5,
    "product-vision": 3,       // NEW
    "stakeholder-management": 3, // NEW
    "project-management": 3,
    "self-awareness": 3,
    "ai-product-design": 2,
    "ai-tech-application": 3,
    "cross-cultural": 2,
    "product-sense": 4,        // NEW: growth requires product intuition
  },
  "data-pm": {
    "requirement-analysis": 3,
    "product-design": 3,
    "system-architecture": 4,  // raised from 3 (Netflix data PM expert)
    "zero-to-one": 3,          // raised from 2
    "user-research": 3,
    "data-experimentation": 5,
    "business-decomposition": 4,
    "commercialization-growth": 4,
    "product-vision": 3,       // NEW
    "stakeholder-management": 3, // NEW
    "project-management": 3,
    "self-awareness": 3,
    "ai-product-design": 2,
    "ai-tech-application": 4,  // raised from 3 (ML platform reality)
    "cross-cultural": 1,
    "product-sense": 3,        // NEW
  },
};

// ============================================================
// Seniority Level Score Modifiers
//
// These adjust what each score level MEANS at different seniority:
// - Junior: 3.0 = "meets expectations" (basic independent execution)
// - Mid: 3.0 = "meets expectations" (solid independent execution)
// - Senior: 3.0 = "meets expectations" (drives strategy + mentors)
// - Director: 3.0 = "meets expectations" (org-level impact)
//
// The modifier shifts how AI interprets the scoring rubric.
// ============================================================
export const LEVEL_EXPECTATIONS: Record<PMLevel, {
  label: string;
  scoringContext: string;
}> = {
  junior: {
    label: "Junior PM / APM (0-2 years)",
    scoringContext: "Evaluate against entry-level expectations. A score of 3.0 means the candidate can execute well-defined tasks independently. Emphasis on learning speed, foundational skills, and potential over track record.",
  },
  mid: {
    label: "Product Manager (2-5 years)",
    scoringContext: "Evaluate against mid-level expectations. A score of 3.0 means the candidate owns a product area with solid independent execution. Emphasis on structured thinking, cross-functional collaboration, and data-informed decisions.",
  },
  senior: {
    label: "Senior PM / Lead PM (5-10 years)",
    scoringContext: "Evaluate against senior-level expectations. A score of 3.0 means the candidate drives product strategy, mentors junior PMs, and has cross-team influence. Emphasis on strategic impact, leadership, and organizational influence.",
  },
  director: {
    label: "Director / VP of Product (10+ years)",
    scoringContext: "Evaluate against director/VP-level expectations. A score of 3.0 means the candidate owns a product portfolio with organizational leadership and measurable business impact. Emphasis on vision, team building, and executive-level decision making.",
  },
};

// ============================================================
// Dimension Categories (v2.0: 4 core + 1 emerging)
// Aligned with Ravi Mehta's 4-category industry standard
// ============================================================
export const DIMENSION_CATEGORIES = {
  "product-execution": [
    "requirement-analysis",
    "product-design",
    "system-architecture",
    "zero-to-one",
  ] as DimensionKey[],
  "customer-insight": [
    "user-research",
    "data-experimentation",
  ] as DimensionKey[],
  "product-strategy": [
    "business-decomposition",
    "commercialization-growth",
    "product-vision",
  ] as DimensionKey[],
  "influencing-people": [
    "stakeholder-management",
    "project-management",
    "self-awareness",
  ] as DimensionKey[],
  "ai-emerging": [
    "ai-product-design",
    "ai-tech-application",
    "cross-cultural",
    "product-sense",
  ] as DimensionKey[],
};

export type DimensionCategory = keyof typeof DIMENSION_CATEGORIES;

export function getCategoryAverage(scores: Record<string, number>, category: DimensionCategory): number {
  const dims = DIMENSION_CATEGORIES[category];
  const sum = dims.reduce((acc, key) => acc + (scores[key] || 0), 0);
  return sum / dims.length;
}

// ============================================================
// PM Archetype Assignment (v2.0: Composite profiles)
//
// Returns primary + secondary archetype with percentages
// instead of a single reductive label.
// ============================================================
export function assignArchetype(scores: Record<string, number>): {
  archetype: string;
  key: string;
  profile: { key: string; label: string; percentage: number }[];
} {
  const productExecution = getCategoryAverage(scores, "product-execution");
  const customerInsight = getCategoryAverage(scores, "customer-insight");
  const productStrategy = getCategoryAverage(scores, "product-strategy");
  const influencingPeople = getCategoryAverage(scores, "influencing-people");
  const aiEmerging = getCategoryAverage(scores, "ai-emerging");

  const profiles = [
    { key: "craftsperson", score: productExecution, label: "The Craftsperson" },
    { key: "strategist", score: productStrategy, label: "The Strategist" },
    {
      key: "growth-hacker",
      score:
        (scores["commercialization-growth"] ?? 0) * 0.35 +
        (scores["data-experimentation"] ?? 0) * 0.35 +
        (scores["product-sense"] ?? 0) * 0.3,
      label: "The Growth Hacker",
    },
    { key: "visionary", score: (aiEmerging + productStrategy) / 2, label: "The Visionary" },
    { key: "operator", score: (influencingPeople + customerInsight) / 2, label: "The Operator" },
  ];

  // Calculate total for percentage distribution
  const totalScore = profiles.reduce((sum, p) => sum + p.score, 0);

  // Sort by score descending
  profiles.sort((a, b) => b.score - a.score);

  // Build percentage profile
  const profileWithPercentage = profiles.map((p) => ({
    key: p.key,
    label: p.label,
    percentage: totalScore > 0 ? Math.round((p.score / totalScore) * 100) : 20,
  }));

  return {
    archetype: profiles[0].label,
    key: profiles[0].key,
    profile: profileWithPercentage,
  };
}

// Helper to get dimension name by key
export function getDimensionName(key: DimensionKey): string {
  return DIMENSIONS.find((d) => d.key === key)?.name ?? key;
}

// Helper to get role config by id
export function getRoleConfig(id: PMRole): PMRoleConfig | undefined {
  return PM_ROLES.find((r) => r.id === id);
}

// Helper to get level config by id
export function getLevelConfig(id: PMLevel): PMLevelConfig | undefined {
  return PM_LEVELS.find((l) => l.id === id);
}
