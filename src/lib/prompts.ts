import type { PMRole, PMLevel } from "./types";
import { DIMENSIONS, ROLE_WEIGHTS, LEVEL_EXPECTATIONS } from "./constants";

// ============================================================
// AI Prompt Templates for PM Assessment (v2.0)
//
// Framework Sources:
// - Ravi Mehta / Reforge: 12-competency PM Skills model
// - Marty Cagan / SVPG: Coaching Assessment framework
// - Google PM Hiring: Technical Insight, GCA
// - Meta PM Evaluation: Product Sense, Execution, Leadership
// ============================================================

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
};

export function buildResumeParsePrompt(locale: string = "en"): string {
  const lang = LANGUAGE_MAP[locale] || "English";
  return `You are an expert resume parser. Extract structured work experience from this resume.

For each job/position, extract:
- company: Company name
- title: Job title
- duration: Time period (e.g., "2020.03-2022.09")
- responsibilities: Core responsibilities (1-2 sentences)
- projects: Array of key projects, each with:
  - name: Project name
  - background: Business context and problem being solved
  - actions: What the candidate specifically did (their decisions and actions, not the team's)
  - results: Quantified outcomes (metrics, percentages, numbers)
- achievements: Notable achievements with data

IMPORTANT:
- Extract EXACTLY what is written. Do not infer or embellish.
- If a field has no information, use an empty string or empty array.
- Preserve all numerical data and metrics exactly as stated.
- Return valid JSON only, no markdown formatting.
- ALL text content MUST be written in ${lang}.

Return as JSON array:
[
  {
    "company": "...",
    "title": "...",
    "duration": "...",
    "responsibilities": "...",
    "projects": [{"name": "...", "background": "...", "actions": "...", "results": "..."}],
    "achievements": ["..."]
  }
]`;
}

// Keep backward compatibility
export const RESUME_PARSE_PROMPT = buildResumeParsePrompt("en");

// ============================================================
// BARS: Behaviorally Anchored Rating Scales
// 16 dimensions × 5 levels = 80 behavioral descriptions
//
// These anchor the AI's scoring to observable behaviors,
// ensuring consistency and reducing subjective interpretation.
// ============================================================
// Compressed BARS: only 1.0/3.0/5.0 anchors to reduce token count
const BARS_SCALES = `
BARS ANCHORS (1.0=Novice, 3.0=Competent, 5.0=Expert):
1. Requirement Analysis: 1=Cannot write reqs independently | 3=Complete PRDs with user stories & acceptance criteria | 5=Org-level requirements standards
2. Product Design & UX: 1=No wireframes/flows | 3=Complete user journeys with good IA | 5=Design systems scaling across products
3. System Architecture: 1=Cannot describe tech stack | 3=Multi-component solutions, communicates constraints | 5=Platform architecture, drives tech strategy
4. 0-to-1 Delivery: 1=No launch experience | 3=Led concept→MVP→launch with outcomes | 5=Systematic new product creation, mentors others
5. User Research: 1=No interview experience | 3=Independent research plans→product requirements | 5=Org research culture, novel methodologies
6. Data & Experimentation: 1=Cannot define metrics | 3=Clear metrics, valid A/B tests, stat-sig decisions | 5=Org data culture, novel measurement
7. Business Decomposition: 1=Cannot structure problems | 3=Decomposes complex problems with prioritization | 5=Industry-level problem structuring
8. Commercialization & Growth: 1=No biz model understanding | 3=Pricing/growth experiments with results | 5=Monetization as competitive advantage
9. Product Vision: 1=Cannot articulate product direction | 3=Clear vision with competitive positioning | 5=Industry-shaping vision, portfolio strategy
10. Stakeholder Management: 1=Cannot communicate cross-functionally | 3=Manages expectations, resolves conflicts | 5=Executive trusted advisor
11. Project Execution: 1=Misses deadlines | 3=Manages timelines, identifies blockers proactively | 5=Org delivery standards
12. Self-Awareness & Communication: 1=Poor self-assessment | 3=Accurate self-view, clear communicator | 5=Thought leader, inspires others
13. AI Product Design: 1=No AI design understanding | 3=AI-native UX with graceful degradation | 5=Pioneers AI product categories
14. AI Tech Application: 1=Cannot distinguish ML from rules | 3=Understands models, effective prompts, AI tools | 5=Drives AI technical strategy
15. Cross-Cultural: 1=No cultural awareness | 3=Adapts features for cultural contexts | 5=Systematic cultural adaptation frameworks
16. Product Sense: 1=Cannot evaluate products | 3=Identifies problems, generates solutions, evaluates tradeoffs | 5=Legendary product intuition
Use 2.0 for "below expectations" and 4.0 for "exceeds expectations" by interpolating between adjacent anchors.`;

export function buildAssessmentPrompt(
  roleType: PMRole,
  experienceJson: string,
  locale: string = "en",
  level: PMLevel = "mid"
): { system: string; user: string } {
  const weights = ROLE_WEIGHTS[roleType];
  const levelInfo = LEVEL_EXPECTATIONS[level];
  const lang = LANGUAGE_MAP[locale] || "English";
  const dimensionsList = DIMENSIONS.map(
    (d) => `- ${d.key}: ${d.name} (weight: ${weights[d.key]}) [Source: ${d.source}]`
  ).join("\n");

  const system = `You are a senior Product Manager capability assessment expert with 15+ years of experience hiring and coaching PMs.

YOUR FRAMEWORK: This assessment is built on the Ravi Mehta/Reforge PM competency model (12 dimensions across 4 categories: Product Execution, Customer Insight, Product Strategy, Influencing People), extended with Marty Cagan/SVPG coaching methodology and Google/Meta interview evaluation standards, plus forward-looking AI capability dimensions for the 2026 market.

YOUR TASK: Evaluate a PM candidate's capabilities across 16 dimensions based on their work experience, for a specific target role and seniority level.

CANDIDATE SENIORITY: ${levelInfo.label}
SENIORITY SCORING CONTEXT: ${levelInfo.scoringContext}

CRITICAL: ALL text values MUST be in ${lang}. JSON keys stay in English.

${BARS_SCALES}

RULES:
1. Score 1.0-5.0 based on evidence anchored to BARS
2. Calibrate to ${levelInfo.label}: 1.0=no evidence, 3.0=meets expectations, 5.0=outstanding
3. Insufficient info → conservative score
4. CONCISE. Short sentences only.

OUTPUT (strict JSON, no markdown, no code blocks):
{
  "summary": "<1 sentence>",
  "scores": {"<dim-key>": <1.0-5.0>, ...all 16},
  "topStrengths": [{"dimension":"<key>","dimensionName":"<name>","score":<n>,"evidence":"<1 sentence>"}],
  "topWeaknesses": [{"dimension":"<key>","dimensionName":"<name>","score":<n>,"upgradeAdvice":"<1 sentence>","actionItems":["<short>"]}],
  "nextSteps": ["<short>","<short>","<short>"]
}`;

  const user = `Assess this PM candidate for the target role: ${roleType}
Candidate seniority level: ${levelInfo.label}

EVALUATION DIMENSIONS & WEIGHTS:
${dimensionsList}

CANDIDATE'S WORK EXPERIENCE:
${experienceJson}

Please provide a comprehensive assessment. Return ONLY valid JSON, no markdown code blocks. Remember: ALL text content must be in ${lang}. Anchor every score to the BARS behavioral descriptions provided.`;

  return { system, user };
}
