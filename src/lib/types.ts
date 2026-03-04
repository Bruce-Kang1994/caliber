// ============================================================
// PM Assessment Tool - Type Definitions
// ============================================================

// --- PM Role Types ---
export type PMRole = "b2b-pm" | "c2c-pm" | "ai-pm" | "growth-pm" | "data-pm";

export interface PMRoleConfig {
  id: PMRole;
  name: string;
  description: string;
  icon: string;
}

// --- Assessment Dimensions ---
export type DimensionKey =
  | "requirement-analysis"
  | "product-design"
  | "system-architecture"
  | "zero-to-one"
  | "data-driven"
  | "business-decomposition"
  | "commercialization"
  | "growth"
  | "ai-product-design"
  | "ai-tech-understanding"
  | "ai-tool-application"
  | "user-research"
  | "project-management"
  | "self-awareness"
  | "cross-cultural";

export interface Dimension {
  key: DimensionKey;
  name: string;
  description: string;
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
  experiences: WorkExperience[];
  inputMethod: "resume" | "manual";
}

// --- Assessment Result ---
// --- PM Archetypes ---
export type PMArchetype = "craftsperson" | "visionary" | "operator" | "growth-hacker" | "strategist";

export interface AssessmentResult {
  roleType: PMRole;
  weightedScore: number;
  archetype?: PMArchetype;
  archetypeDescription?: string;
  summary: string;
  scores: Record<DimensionKey, number>;
  justifications: Record<DimensionKey, string>;
  topStrengths: StrengthItem[];
  topWeaknesses: WeaknessItem[];
  undervaluedExperiences: string[];
  missingElements: string[];
  nextSteps: string[];
  timestamp: string;
}

export interface StrengthItem {
  dimension: DimensionKey;
  dimensionName: string;
  score: number;
  evidence: string;
}

export interface WeaknessItem {
  dimension: DimensionKey;
  dimensionName: string;
  score: number;
  upgradeAdvice: string;
  actionItems: string[];
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
export type Locale = "en" | "zh" | "ja" | "ko";
