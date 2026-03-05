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
const BARS_SCALES = `
BEHAVIORALLY ANCHORED RATING SCALES (BARS):

1. Requirement Analysis & Specification:
   1.0 = Cannot independently write requirements; relies on others to define scope
   2.0 = Writes basic requirement docs but misses edge cases, error states, and acceptance criteria
   3.0 = Independently produces complete PRDs with user stories, acceptance criteria, and technical constraints
   4.0 = Extracts clear product requirements from ambiguous business goals; proactively identifies requirement conflicts and dependencies
   5.0 = Establishes systematic requirements management processes at the organizational level; defines standards others follow

2. Product Design & UX:
   1.0 = Cannot create wireframes or user flows; no design thinking methodology
   2.0 = Creates basic wireframes but designs lack consideration for edge cases and accessibility
   3.0 = Designs complete user journeys with logical information architecture and reasonable interaction patterns
   4.0 = Designs that demonstrably improve key UX metrics; balances business goals with user experience elegantly
   5.0 = Establishes design systems and UX principles that scale across multiple products; recognized for design excellence

3. System Architecture Understanding:
   1.0 = Cannot describe the basic technical components of the products they manage
   2.0 = Understands basic client-server architecture but cannot reason about technical tradeoffs
   3.0 = Can design multi-component product solutions and communicate technical constraints to stakeholders
   4.0 = Makes informed build-vs-buy decisions; understands scalability, latency, and reliability tradeoffs that shape product roadmaps
   5.0 = Designs platform-level architectures; drives technical strategy decisions with engineering leadership

4. 0-to-1 Delivery Capability:
   1.0 = No experience taking a product from concept to launch
   2.0 = Has participated in launches but only executed predefined tasks
   3.0 = Has led at least one product from concept through MVP to launch with measurable outcomes
   4.0 = Repeatedly delivers new products with strong market fit; excels at scoping MVPs and iterating based on signals
   5.0 = Systematically builds new product lines with predictable success patterns; mentors others through 0-to-1 journeys

5. User Research & Insight:
   1.0 = No experience conducting user interviews or analyzing user behavior
   2.0 = Can follow an interview script but struggles to extract non-obvious insights
   3.0 = Independently designs research plans, conducts interviews, and translates findings into product requirements
   4.0 = Uncovers strategic insights that reshape product direction; builds ongoing customer feedback loops
   5.0 = Establishes organizational research culture; develops novel research methodologies that become team standards

6. Data-Driven & Experimentation:
   1.0 = Cannot define meaningful product metrics or interpret basic analytics
   2.0 = Tracks basic metrics but relies on intuition for decisions; no experimentation experience
   3.0 = Defines clear success metrics, designs valid A/B tests, and makes decisions based on statistically significant results
   4.0 = Builds sophisticated experimentation frameworks; identifies metric traps and causal relationships beyond correlation
   5.0 = Establishes data-driven culture across the organization; develops novel measurement approaches for hard-to-quantify outcomes

7. Business Problem Decomposition:
   1.0 = Cannot structure ambiguous problems; jumps to solutions without analysis
   2.0 = Can follow frameworks (MECE, issue trees) when prompted but struggles with novel problems
   3.0 = Independently decomposes complex business problems into actionable components with clear prioritization
   4.0 = Identifies non-obvious leverage points; reframes problems in ways that unlock new solution spaces
   5.0 = Tackles industry-level challenges; structures problems that span multiple business units with clarity

8. Commercialization & Growth:
   1.0 = No understanding of business models, pricing, or growth mechanics
   2.0 = Basic understanding of revenue models but no hands-on monetization or growth experience
   3.0 = Has designed pricing tiers, run growth experiments, or managed acquisition/retention funnels with measurable results
   4.0 = Owns P&L-adjacent decisions; optimizes full-funnel metrics (LTV/CAC, conversion, expansion revenue) with proven impact
   5.0 = Designs monetization strategies that become competitive advantages; builds self-sustaining growth engines

9. Product Vision & Strategic Thinking:
   1.0 = Cannot articulate why the product exists or where it should go
   2.0 = Can describe the product roadmap but cannot explain the strategic rationale behind prioritization
   3.0 = Defines a clear product vision with competitive positioning and connects quarterly goals to long-term strategy
   4.0 = Creates product strategies that anticipate market shifts; influences company-level strategy through product insights
   5.0 = Defines industry-shaping product visions; portfolio-level strategic planning with multi-year horizon

10. Stakeholder Management & Cross-functional Influence:
    1.0 = Struggles to communicate with teams outside their own function
    2.0 = Can present to stakeholders but avoids conflict and cannot drive alignment
    3.0 = Effectively manages expectations across engineering, design, and business stakeholders; resolves routine conflicts
    4.0 = Influences senior leadership decisions without positional authority; builds strong cross-functional coalitions
    5.0 = Drives organizational alignment on complex, contentious issues; trusted advisor to executive leadership

11. Project Management & Execution Drive:
    1.0 = Cannot maintain a project timeline; frequently misses deadlines
    2.0 = Follows existing project processes but cannot adapt when plans change
    3.0 = Independently manages project timelines, identifies blockers proactively, and makes priority tradeoffs
    4.0 = Delivers complex, multi-team projects under tight constraints; excels at unblocking teams and managing dependencies
    5.0 = Establishes project management standards for the organization; drives delivery culture across multiple teams

12. Self-Awareness & Communication:
    1.0 = Cannot accurately describe their own strengths and weaknesses; poor communication clarity
    2.0 = Has some self-awareness but struggles to articulate experience value to different audiences
    3.0 = Accurately assesses own capabilities; communicates clearly in writing and presentations to technical and business audiences
    4.0 = Deep self-awareness that drives continuous improvement; compelling storyteller who adapts communication style to context
    5.0 = Role model for reflective practice; thought leader whose communication inspires and educates others

13. AI Product Design:
    1.0 = No understanding of how to design products that incorporate AI capabilities
    2.0 = Can add AI features to existing products but designs feel bolted-on rather than native
    3.0 = Designs AI-native experiences that account for model uncertainty, graceful degradation, and appropriate user expectations
    4.0 = Creates novel AI interaction patterns; designs products where AI meaningfully changes the user value proposition
    5.0 = Pioneers new categories of AI-native products; establishes AI UX patterns that others in the industry adopt

14. AI Technical Understanding & Application:
    1.0 = Cannot describe the difference between rule-based systems and ML, or what an LLM does
    2.0 = Basic awareness of AI capabilities but cannot make informed decisions about model selection or architecture
    3.0 = Understands model capabilities/limitations, can write effective prompts, and uses AI tools to enhance PM work efficiency
    4.0 = Makes informed model selection and architecture decisions; evaluates AI systems for quality, cost, and latency tradeoffs
    5.0 = Drives AI technical strategy; collaborates with ML engineers at a deep level to shape model training and deployment decisions

15. Cross-Cultural & Localization:
    1.0 = No awareness of cultural differences that affect product design
    2.0 = Aware that localization matters but approaches it as translation only
    3.0 = Adapts product features and UX patterns for different cultural contexts with measurable local market improvement
    4.0 = Designs product mechanisms that work across fundamentally different user behavior patterns (e.g., privacy norms, payment habits)
    5.0 = Builds frameworks for systematic cultural adaptation; leads successful multi-market launches with locally optimized strategies

16. Product Sense & Creativity:
    1.0 = Cannot evaluate a product experience or identify what could be improved
    2.0 = Can point out obvious UX issues but struggles to generate creative solutions or prioritize improvements
    3.0 = Quickly identifies product problems, generates multiple solution options, and evaluates tradeoffs with sound reasoning
    4.0 = Consistently produces innovative solutions that others miss; strong intuition for what users will love
    5.0 = Legendary product intuition; consistently predicts user behavior and market trends before data confirms it
`;

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

CRITICAL: ALL text content in your response (summary, justifications, evidence, advice, action items, etc.) MUST be written in ${lang}. The JSON keys and dimension keys must remain in English, but ALL values/text MUST be in ${lang}.

${BARS_SCALES}

EVALUATION RULES:
1. Every score (1.0-5.0) MUST be based on specific evidence from the candidate's experience AND anchored to the BARS behavioral descriptions above
2. Quote or reference specific projects, metrics, and actions when justifying scores
3. Match scores to the behavioral anchor that best describes the candidate's demonstrated level
4. Use "upgrade-style" language for weaknesses: NOT "you lack X" but "your Y skill (4.0) combined with Z practice could elevate X from 2.0 to 3.5"
5. If information is insufficient to evaluate a dimension, give a conservative score and note what's missing
6. Actively identify experiences the candidate may be undervaluing
7. Be honest but constructive — the goal is to help them grow, not to discourage
8. Calibrate all scores to the candidate's stated seniority level (${levelInfo.label})

SCORING STANDARDS (calibrated to ${levelInfo.label}):
1.0 = No evidence of this capability at any level
2.0 = Below expectations for ${levelInfo.label} — basic awareness but insufficient practical experience
3.0 = Meets expectations for ${levelInfo.label} — solid capability at this career stage
4.0 = Exceeds expectations for ${levelInfo.label} — strong capability with proven results above level
5.0 = Outstanding for ${levelInfo.label} — expert level with systematic methodology and exceptional results

OUTPUT FORMAT (strict JSON, no markdown):
{
  "weightedScore": <number 0-100>,
  "summary": "<one sentence describing the candidate's PM profile, in ${lang}>",
  "scores": {
    "<dimension-key>": <number 1.0-5.0>,
    ...all 16 dimensions
  },
  "justifications": {
    "<dimension-key>": "<2-3 sentence justification referencing specific experience AND citing the BARS level matched, in ${lang}>",
    ...all 16 dimensions
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
Candidate seniority level: ${levelInfo.label}

EVALUATION DIMENSIONS & WEIGHTS:
${dimensionsList}

CANDIDATE'S WORK EXPERIENCE:
${experienceJson}

Please provide a comprehensive assessment. Return ONLY valid JSON, no markdown code blocks. Remember: ALL text content must be in ${lang}. Anchor every score to the BARS behavioral descriptions provided.`;

  return { system, user };
}
