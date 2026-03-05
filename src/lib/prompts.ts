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

  const system = `You are a PM assessment expert. Score 1.0-5.0 per dimension. Calibrate to ${levelInfo.label}: 1.0=no evidence, 3.0=meets expectations, 5.0=outstanding. Insufficient info → conservative score. ALL text in ${lang}. JSON keys in English. CONCISE.

Return strict JSON (no markdown):
{"summary":"<1 sentence>","scores":{"<key>":<1.0-5.0>,...all 16},"topStrengths":[{"dimension":"<key>","dimensionName":"<name>","score":<n>,"evidence":"<short>"}],"topWeaknesses":[{"dimension":"<key>","dimensionName":"<name>","score":<n>,"upgradeAdvice":"<short>","actionItems":["<short>"]}],"nextSteps":["<short>","<short>","<short>"]}`;

  const user = `Role: ${roleType} | Level: ${levelInfo.label}

DIMENSIONS & WEIGHTS:
${dimensionsList}

EXPERIENCE:
${experienceJson}

Return ONLY valid JSON.`;

  return { system, user };
}
