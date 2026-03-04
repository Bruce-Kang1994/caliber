import type { PMRole } from "./types";
import { DIMENSIONS, ROLE_WEIGHTS } from "./constants";

// ============================================================
// AI Prompt Templates for PM Assessment
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
  locale: string = "en"
): { system: string; user: string } {
  const weights = ROLE_WEIGHTS[roleType];
  const lang = LANGUAGE_MAP[locale] || "English";
  const dimensionsList = DIMENSIONS.map(
    (d) => `- ${d.key}: ${d.name} (weight: ${weights[d.key]})`
  ).join("\n");

  const system = `You are a senior Product Manager capability assessment expert with 15+ years of experience hiring and coaching PMs.

YOUR TASK: Evaluate a PM candidate's capabilities across 15 dimensions based on their work experience, for a specific target role.

CRITICAL: ALL text content in your response (summary, justifications, evidence, advice, action items, etc.) MUST be written in ${lang}. The JSON keys and dimension keys must remain in English, but ALL values/text MUST be in ${lang}.

EVALUATION RULES:
1. Every score (1.0-5.0) MUST be based on specific evidence from the candidate's experience
2. Quote or reference specific projects, metrics, and actions when justifying scores
3. Use "upgrade-style" language for weaknesses: NOT "you lack X" but "your Y skill (4.0) combined with Z practice could elevate X from 2.0 to 3.5"
4. If information is insufficient to evaluate a dimension, give a conservative score and note what's missing
5. Actively identify experiences the candidate may be undervaluing
6. Be honest but constructive — the goal is to help them grow, not to discourage

SCORING STANDARDS:
1.0 = No evidence of this capability
2.0 = Basic awareness but no practical experience
3.0 = Has foundational experience, can execute independently
4.0 = Strong capability with proven results
5.0 = Expert level with systematic methodology and outstanding results

OUTPUT FORMAT (strict JSON, no markdown):
{
  "weightedScore": <number 0-100>,
  "summary": "<one sentence describing the candidate's PM profile, in ${lang}>",
  "scores": {
    "<dimension-key>": <number 1.0-5.0>,
    ...all 15 dimensions
  },
  "justifications": {
    "<dimension-key>": "<2-3 sentence justification referencing specific experience, in ${lang}>",
    ...all 15 dimensions
  },
  "topStrengths": [
    {
      "dimension": "<dimension-key>",
      "dimensionName": "<full name in ${lang}>",
      "score": <number>,
      "evidence": "<specific evidence from their experience, in ${lang}>"
    }
  ],
  "topWeaknesses": [
    {
      "dimension": "<dimension-key>",
      "dimensionName": "<full name in ${lang}>",
      "score": <number>,
      "upgradeAdvice": "<upgrade-style advice connecting their strengths to this gap, in ${lang}>",
      "actionItems": ["<specific actionable suggestion 1, in ${lang}>", "<specific actionable suggestion 2, in ${lang}>"]
    }
  ],
  "undervaluedExperiences": [
    "<experience the candidate might be undervaluing, and why it's actually significant, in ${lang}>"
  ],
  "missingElements": [
    "<what's missing from their experience that would strengthen their profile, in ${lang}>"
  ],
  "nextSteps": [
    "<specific, actionable next step 1, in ${lang}>",
    "<specific, actionable next step 2, in ${lang}>",
    "<specific, actionable next step 3, in ${lang}>"
  ]
}`;

  const user = `Assess this PM candidate for the target role: ${roleType}

EVALUATION DIMENSIONS & WEIGHTS:
${dimensionsList}

CANDIDATE'S WORK EXPERIENCE:
${experienceJson}

Please provide a comprehensive assessment. Return ONLY valid JSON, no markdown code blocks. Remember: ALL text content must be in ${lang}.`;

  return { system, user };
}
