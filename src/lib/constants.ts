import type { PMRole, PMRoleConfig, Dimension, DimensionKey } from "./types";

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
// Assessment Dimensions (15 total)
// ============================================================
export const DIMENSIONS: Dimension[] = [
  {
    key: "requirement-analysis",
    name: "Requirement Analysis & Definition",
    description:
      "Ability to extract clear requirements from business/user needs and write actionable PRDs",
  },
  {
    key: "product-design",
    name: "Product Design",
    description:
      "User journey, information architecture, interaction logic design quality",
  },
  {
    key: "system-architecture",
    name: "System Architecture Understanding",
    description:
      "Ability to design multi-module/multi-system collaborative product solutions",
  },
  {
    key: "zero-to-one",
    name: "0-to-1 Capability",
    description:
      "Experience building products from idea to launch with complete delivery loop",
  },
  {
    key: "data-driven",
    name: "Data-Driven Decision Making",
    description:
      "Using data to discover problems, validate hypotheses, and guide iterations",
  },
  {
    key: "business-decomposition",
    name: "Business Problem Decomposition",
    description:
      "Structuring ambiguous business problems and identifying core leverage points",
  },
  {
    key: "commercialization",
    name: "Commercialization",
    description:
      "Pricing strategy, monetization model design, LTV/CAC business thinking",
  },
  {
    key: "growth",
    name: "Growth",
    description:
      "Hands-on experience in acquisition, activation, retention, and monetization",
  },
  {
    key: "ai-product-design",
    name: "AI Product Design",
    description:
      "Designing AI-native product experiences, not just adding AI features",
  },
  {
    key: "ai-tech-understanding",
    name: "AI Technical Understanding",
    description:
      "Understanding model capabilities, prompt engineering, AI architecture patterns",
  },
  {
    key: "ai-tool-application",
    name: "AI Tool Application",
    description:
      "Using AI tools to enhance PM work efficiency in real-world practice",
  },
  {
    key: "user-research",
    name: "User Research",
    description:
      "Interview design, insight extraction, and needs validation capabilities",
  },
  {
    key: "project-management",
    name: "Project Management & Collaboration",
    description:
      "Cross-functional coordination, priority decisions, resource management",
  },
  {
    key: "self-awareness",
    name: "Self-Awareness & Communication",
    description:
      "Accurate self-assessment and ability to articulate experience value clearly",
  },
  {
    key: "cross-cultural",
    name: "Cross-Cultural & Localization",
    description:
      "Cultural understanding of target market and localized product design ability",
  },
];

// ============================================================
// Role-Specific Dimension Weights (1-5)
// ============================================================
export const ROLE_WEIGHTS: Record<PMRole, Record<DimensionKey, number>> = {
  "b2b-pm": {
    "requirement-analysis": 5,
    "product-design": 4,
    "system-architecture": 5,
    "zero-to-one": 3,
    "data-driven": 3,
    "business-decomposition": 5,
    commercialization: 3,
    growth: 2,
    "ai-product-design": 1,
    "ai-tech-understanding": 1,
    "ai-tool-application": 2,
    "user-research": 3,
    "project-management": 5,
    "self-awareness": 3,
    "cross-cultural": 1,
  },
  "c2c-pm": {
    "requirement-analysis": 4,
    "product-design": 5,
    "system-architecture": 2,
    "zero-to-one": 4,
    "data-driven": 4,
    "business-decomposition": 3,
    commercialization: 4,
    growth: 5,
    "ai-product-design": 1,
    "ai-tech-understanding": 1,
    "ai-tool-application": 2,
    "user-research": 5,
    "project-management": 3,
    "self-awareness": 3,
    "cross-cultural": 2,
  },
  "ai-pm": {
    "requirement-analysis": 4,
    "product-design": 4,
    "system-architecture": 4,
    "zero-to-one": 5,
    "data-driven": 3,
    "business-decomposition": 4,
    commercialization: 4,
    growth: 3,
    "ai-product-design": 5,
    "ai-tech-understanding": 5,
    "ai-tool-application": 4,
    "user-research": 4,
    "project-management": 4,
    "self-awareness": 3,
    "cross-cultural": 3,
  },
  "growth-pm": {
    "requirement-analysis": 3,
    "product-design": 3,
    "system-architecture": 2,
    "zero-to-one": 3,
    "data-driven": 5,
    "business-decomposition": 4,
    commercialization: 5,
    growth: 5,
    "ai-product-design": 2,
    "ai-tech-understanding": 1,
    "ai-tool-application": 3,
    "user-research": 4,
    "project-management": 3,
    "self-awareness": 3,
    "cross-cultural": 2,
  },
  "data-pm": {
    "requirement-analysis": 3,
    "product-design": 3,
    "system-architecture": 3,
    "zero-to-one": 2,
    "data-driven": 5,
    "business-decomposition": 4,
    commercialization: 3,
    growth: 4,
    "ai-product-design": 2,
    "ai-tech-understanding": 3,
    "ai-tool-application": 3,
    "user-research": 3,
    "project-management": 3,
    "self-awareness": 3,
    "cross-cultural": 1,
  },
};

// ============================================================
// Dimension Categories for Archetype Assignment
// ============================================================
export const DIMENSION_CATEGORIES = {
  "product-hard": ["requirement-analysis", "product-design", "system-architecture", "zero-to-one"] as DimensionKey[],
  "business": ["data-driven", "business-decomposition", "commercialization", "growth"] as DimensionKey[],
  "ai": ["ai-product-design", "ai-tech-understanding", "ai-tool-application"] as DimensionKey[],
  "soft": ["user-research", "project-management", "self-awareness"] as DimensionKey[],
  "international": ["cross-cultural"] as DimensionKey[],
};

export type DimensionCategory = keyof typeof DIMENSION_CATEGORIES;

export function getCategoryAverage(scores: Record<string, number>, category: DimensionCategory): number {
  const dims = DIMENSION_CATEGORIES[category];
  const sum = dims.reduce((acc, key) => acc + (scores[key] || 0), 0);
  return sum / dims.length;
}

// PM Archetype assignment based on score distribution
export function assignArchetype(scores: Record<string, number>): { archetype: string; key: string } {
  const productHard = getCategoryAverage(scores, "product-hard");
  const business = getCategoryAverage(scores, "business");
  const ai = getCategoryAverage(scores, "ai");
  const soft = getCategoryAverage(scores, "soft");

  const profiles = [
    { key: "craftsperson", score: productHard, label: "The Craftsperson" },
    { key: "strategist", score: business, label: "The Strategist" },
    { key: "growth-hacker", score: (scores["growth"] ?? 0) * 0.35 + (scores["data-driven"] ?? 0) * 0.35 + (scores["commercialization"] ?? 0) * 0.3, label: "The Growth Hacker" },
    { key: "visionary", score: (ai + productHard) / 2, label: "The Visionary" },
    { key: "operator", score: (soft + productHard) / 2, label: "The Operator" },
  ];

  // Find the highest scoring archetype
  profiles.sort((a, b) => b.score - a.score);
  return { archetype: profiles[0].label, key: profiles[0].key };
}

// Helper to get dimension name by key
export function getDimensionName(key: DimensionKey): string {
  return DIMENSIONS.find((d) => d.key === key)?.name ?? key;
}

// Helper to get role config by id
export function getRoleConfig(id: PMRole): PMRoleConfig | undefined {
  return PM_ROLES.find((r) => r.id === id);
}
