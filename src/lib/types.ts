// ============================================================
// PM Assessment Tool - Type Definitions
// ============================================================

// --- PM Role Types ---
export type PMRole = "b2b-pm" | "c2c-pm" | "ai-pm" | "growth-pm" | "data-pm";

// --- PM Seniority Levels ---
export type PMLevel = "junior" | "mid" | "senior" | "director";

export interface PMRoleConfig {
  id: PMRole;
  name: string;
  description: string;
  icon: string;
}

export interface PMLevelConfig {
  id: PMLevel;
  name: string;
  description: string;
  yearsRange: string;
}

// --- Assessment Dimensions (16 total, v2.0) ---
// Framework sources: Ravi Mehta/Reforge, SVPG/Marty Cagan, Google/Meta PM rubrics
export type DimensionKey =
  | "requirement-analysis"    // Product Execution — Ravi Mehta: Feature Specification
  | "product-design"          // Product Execution — Ravi Mehta: UX Design + SVPG: Product Discovery
  | "system-architecture"     // Product Execution — Google: Technical Insight
  | "zero-to-one"             // Product Execution — Ravi Mehta: Product Delivery
  | "user-research"           // Customer Insight — Ravi Mehta: Voice of Customer + SVPG: User Knowledge
  | "data-experimentation"    // Customer Insight — Ravi Mehta: Fluency with Data + Experimentation methodology
  | "business-decomposition"  // Product Strategy — SVPG: Business Knowledge
  | "commercialization-growth" // Product Strategy — Ravi Mehta: Business Outcome + Strategic Impact
  | "product-vision"          // Product Strategy — Ravi Mehta: Product Vision & Roadmapping [NEW]
  | "stakeholder-management"  // Influencing People — Ravi Mehta: Stakeholder Management [NEW]
  | "project-management"      // Influencing People — retained from v1
  | "self-awareness"          // Influencing People — retained from v1
  | "ai-product-design"       // AI & Emerging — Caliber original (2026 forward-looking)
  | "ai-tech-application"     // AI & Emerging — merged: AI Tech Understanding + AI Tool Application
  | "cross-cultural"          // AI & Emerging — Caliber original (Asia-Pacific positioning)
  | "product-sense";          // AI & Emerging — Meta: Product Sense [NEW]

export interface Dimension {
  key: DimensionKey;
  name: string;
  description: string;
  source: string; // theoretical framework source
}

// --- Work Experience ---
export interface WorkExperience {
  company: string;
  title: string;
  duration: string;
  responsibilities: string;
  projects: ProjectDetail[];
  achievements: string[];
}

export interface ProjectDetail {
  name: string;
  background: string;
  actions: string;
  results: string;
}

// --- Assessment Input ---
export interface AssessmentInput {
  roleType: PMRole;
  level: PMLevel;
  experiences: WorkExperience[];
  inputMethod: "resume" | "manual";
}

// --- Assessment Result ---
// --- PM Archetypes ---
export type PMArchetype = "craftsperson" | "visionary" | "operator" | "growth-hacker" | "strategist";

export interface ArchetypeProfile {
  primary: { key: PMArchetype; label: string; percentage: number };
  secondary: { key: PMArchetype; label: string; percentage: number };
}

export interface AssessmentResult {
  roleType: PMRole;
  level?: PMLevel;
  weightedScore: number;
  archetype?: PMArchetype;
  archetypeProfile?: ArchetypeProfile;
  archetypeDescription?: string;
  summary: string;
  scores: Record<DimensionKey, number>;
  justifications: Record<DimensionKey, string>;
  topStrengths: StrengthItem[];
  topWeaknesses: WeaknessItem[];
  undervaluedExperiences: string[];
  missingElements: string[];
  nextSteps: (NextStepV2 | string)[];
  timestamp: string;
}

export interface StrengthItem {
  dimension: DimensionKey;
  dimensionName: string;
  score: number;
  evidence: string;
}

export interface ActionItemV2 {
  action: string;
  timeframe: string;    // "this week" / "2 weeks" / "1 month" / "ongoing"
  artifact: string;     // measurable deliverable
}

export interface NextStepV2 {
  action: string;
  timeframe: string;
  rationale: string;    // why this step matters
}

export function isActionItemV2(item: unknown): item is ActionItemV2 {
  return typeof item === "object" && item !== null && "action" in item && "timeframe" in item && "artifact" in item;
}

export function isNextStepV2(step: unknown): step is NextStepV2 {
  return typeof step === "object" && step !== null && "action" in step && "timeframe" in step && "rationale" in step;
}

export interface WeaknessItem {
  dimension: DimensionKey;
  dimensionName: string;
  score: number;
  upgradeAdvice: string;
  actionItems: (ActionItemV2 | string)[];
}

// --- Radar Chart Data ---
export interface RadarDataPoint {
  dimension: string;
  score: number;
  fullMark: number;
}

// --- API Response Types ---
export interface ParseResumeResponse {
  experiences: WorkExperience[];
}

export interface AnalyzeResponse {
  result: AssessmentResult;
}

export interface ApiError {
  error: string;
  details?: string;
}

// --- Locale ---
export type Locale = "en" | "zh" | "ja" | "ko" | "fr" | "es";
