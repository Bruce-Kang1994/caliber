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
  fr: "French",
  es: "Spanish",
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

  const system = `You are a PM assessment expert writing a premium-caliber capability report for a product manager candidate.

Score 1.0-5.0 per dimension. Calibrate to ${levelInfo.label}: 1.0=no evidence, 3.0=meets expectations, 5.0=outstanding. Insufficient info -> conservative score.
ALL narrative text MUST be in ${lang}. JSON keys MUST remain in English.

WRITING QUALITY RULES:
- Write a report that feels rich, specific, and evidence-based, not generic.
- Use concrete facts from the candidate's experience whenever possible.
- Do not repeat the same sentence structure across sections.
- Avoid filler, but do provide enough depth to be useful.
- Prefer 2-4 sentences for substantial explanation fields.
- For action items, give specific, practical steps with a clear artifact, habit, or outcome.

RETURN STRICT JSON ONLY (no markdown, no code fences):
{
  "summary": "<2-3 sentences summarizing profile, strengths, and core gaps>",
  "scores": {"<key>": <1.0-5.0>, "...all 16 dimensions": 0},
  "justifications": {"<key>": "<1-2 sentence evidence-based explanation for every one of the 16 dimensions>"},
  "topStrengths": [
    {
      "dimension": "<key>",
      "dimensionName": "<localized display name>",
      "score": <n>,
      "evidence": "<WHAT: 1-2 sentences describing the concrete behavior or achievement> <WHY: 1-2 sentences explaining why this matters for the target PM role> <IMPACT: 1 sentence with specific metrics or outcomes>"
    }
  ],
  "topWeaknesses": [
    {
      "dimension": "<key>",
      "dimensionName": "<localized display name>",
      "score": <n>,
      "upgradeAdvice": "<4-6 sentence explanation connecting current gap, why it matters, and how existing strengths can help close it>",
      "actionItems": [
        {"action": "<what to do>", "timeframe": "<this week | 2 weeks | 1 month | 3 months | ongoing>", "artifact": "<measurable deliverable or outcome>"},
        {"action": "<what to do>", "timeframe": "<this week | 2 weeks | 1 month | 3 months | ongoing>", "artifact": "<measurable deliverable or outcome>"},
        {"action": "<what to do>", "timeframe": "<this week | 2 weeks | 1 month | 3 months | ongoing>", "artifact": "<measurable deliverable or outcome>"}
      ]
    }
  ],
  "undervaluedExperiences": [
    "<2-3 sentence explanation of an experience the candidate is underselling and why it should be framed differently>",
    "<...>",
    "<...>"
  ],
  "missingElements": [
    "<2-3 sentence explanation of an important missing proof point for the target role>",
    "<...>",
    "<...>"
  ],
  "nextSteps": [
    {"action": "<specific action>", "timeframe": "<this week | 2 weeks | 1 month | 3 months | ongoing>", "rationale": "<1 sentence why this step matters most>"},
    {"action": "<specific action>", "timeframe": "<...>", "rationale": "<...>"},
    {"action": "<specific action>", "timeframe": "<...>", "rationale": "<...>"},
    {"action": "<specific action>", "timeframe": "<...>", "rationale": "<...>"},
    {"action": "<specific action>", "timeframe": "<...>", "rationale": "<...>"}
  ]
}

CONTENT RULES:
- Fill all 16 scores.
- Fill all 16 justifications (keep each to 1-2 sentences to save space for important sections).
- Return exactly 3 topStrengths and exactly 3 topWeaknesses.
- Each weakness must include exactly 3 actionItems as structured objects with action/timeframe/artifact.
- Return exactly 3 undervaluedExperiences and exactly 3 missingElements when possible from available evidence.
- Return exactly 5 nextSteps as structured objects with action/timeframe/rationale, ordered by impact.
- If evidence is missing, say so explicitly instead of inventing details.`;

  const user = `Role: ${roleType} | Level: ${levelInfo.label}

DIMENSIONS & WEIGHTS:
${dimensionsList}

EXPERIENCE:
${experienceJson}

Return ONLY valid JSON.`;

  return { system, user };
}
