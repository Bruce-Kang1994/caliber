import type { DimensionKey } from "./types";

// ============================================================
// Deep Dive: BARS (Behaviorally Anchored Rating Scales)
// + Dimension-specific question banks
//
// Each dimension has:
// 1. BARS anchors (1.0-5.0) — objective behavioral descriptions
// 2. Diagnostic questions — STAR-based probing questions
// 3. Key signals — what the AI should listen for
// ============================================================

export interface BARSLevel {
  score: number;
  description: string;
}

export interface DimensionDeepDive {
  bars: BARSLevel[];
  questions: string[];
  keySignals: string[];
}

export const DEEP_DIVE_DATA: Record<DimensionKey, DimensionDeepDive> = {
  "requirement-analysis": {
    bars: [
      { score: 1.0, description: "Cannot distinguish user requests from actual requirements; PRDs lack structure and miss edge cases" },
      { score: 2.0, description: "Can write basic PRDs with functional requirements, but misses non-functional requirements, edge cases, or acceptance criteria" },
      { score: 3.0, description: "Writes structured PRDs covering functional/non-functional requirements, edge cases, and acceptance criteria; can prioritize requirements by impact" },
      { score: 4.0, description: "Drives requirement discovery through stakeholder interviews and data analysis; PRDs include system constraints, migration plans, and measurable success metrics" },
      { score: 5.0, description: "Establishes requirement frameworks adopted by the team/org; can decompose ambiguous strategic goals into actionable requirement hierarchies" },
    ],
    questions: [
      "Describe a PRD you wrote that you're proud of. What made it effective?",
      "How do you handle conflicting requirements from different stakeholders?",
      "Tell me about a time when missing an edge case caused problems. What did you learn?",
      "How do you decide what NOT to include in a requirement specification?",
      "Walk me through how you go from a vague business request to a clear, actionable spec.",
    ],
    keySignals: ["PRD structure", "edge case handling", "acceptance criteria", "stakeholder alignment", "requirement prioritization framework"],
  },

  "product-design": {
    bars: [
      { score: 1.0, description: "No awareness of UX principles; designs are engineer-driven without user consideration" },
      { score: 2.0, description: "Can sketch basic wireframes and user flows, but designs lack consistency and don't consider accessibility or error states" },
      { score: 3.0, description: "Designs complete user journeys with clear information architecture; considers error states, loading states, and basic accessibility" },
      { score: 4.0, description: "Uses research-backed design decisions; can articulate design tradeoffs; creates design systems or patterns reused across products" },
      { score: 5.0, description: "Drives product-level design vision; has shipped designs that measurably improved key metrics; influences org-wide design standards" },
    ],
    questions: [
      "Walk me through a product design decision where you had to make a significant tradeoff. What data informed your choice?",
      "How do you validate that your design actually solves the user's problem before engineering starts?",
      "Describe a time when user feedback fundamentally changed your design direction.",
      "How do you handle the tension between 'what users say they want' and 'what data shows they need'?",
      "Tell me about a design you shipped that didn't work. What did you learn?",
    ],
    keySignals: ["user journey completeness", "design validation method", "data-informed design", "design system thinking", "iteration based on feedback"],
  },

  "system-architecture": {
    bars: [
      { score: 1.0, description: "Cannot discuss system architecture; relies entirely on engineering for all technical decisions" },
      { score: 2.0, description: "Understands basic client-server architecture; can read API documentation but cannot evaluate technical tradeoffs" },
      { score: 3.0, description: "Can discuss system components, data flow, and basic scalability concerns; makes informed buy-vs-build decisions" },
      { score: 4.0, description: "Evaluates architectural tradeoffs (latency vs consistency, monolith vs microservices); influences technical roadmap with product constraints" },
      { score: 5.0, description: "Drives technical strategy jointly with engineering; has experience with complex system migrations or platform architecture decisions" },
    ],
    questions: [
      "Describe a technical architecture decision you influenced. What were the tradeoffs?",
      "How do you evaluate whether to build a feature in-house vs. using a third-party service?",
      "Tell me about a time when a technical constraint changed your product approach.",
      "How do you communicate technical complexity to non-technical stakeholders?",
      "Have you been involved in a system migration or major technical refactoring? What was your role?",
    ],
    keySignals: ["technical tradeoff reasoning", "buy vs build analysis", "system scalability awareness", "cross-system data flow understanding", "technical debt management"],
  },

  "zero-to-one": {
    bars: [
      { score: 1.0, description: "No experience building products from scratch; only worked on existing feature iterations" },
      { score: 2.0, description: "Has participated in a 0-to-1 project but was not the primary driver; limited MVP scoping experience" },
      { score: 3.0, description: "Has led a 0-to-1 product from ideation to launch; can scope MVPs and plan iteration cycles" },
      { score: 4.0, description: "Multiple 0-to-1 launches with measurable business impact; strong at validating ideas before heavy investment" },
      { score: 5.0, description: "Serial product builder with track record of successful launches; can set up repeatable 0-to-1 processes for the team" },
    ],
    questions: [
      "Describe a product you built from scratch. How did you decide what to include in the MVP?",
      "How did you validate the idea before committing engineering resources?",
      "What was the biggest risk in your 0-to-1 project and how did you mitigate it?",
      "How long from initial idea to first user? What would you do differently?",
      "Tell me about a 0-to-1 project that failed or was killed. What happened?",
    ],
    keySignals: ["MVP scoping discipline", "validation before building", "launch execution", "iteration speed", "failure learning"],
  },

  "user-research": {
    bars: [
      { score: 1.0, description: "No user research experience; product decisions based purely on internal opinions or stakeholder requests" },
      { score: 2.0, description: "Has conducted basic user interviews but lacks structured methodology; findings are anecdotal rather than systematic" },
      { score: 3.0, description: "Designs research plans with clear objectives; can synthesize qualitative insights into actionable product decisions" },
      { score: 4.0, description: "Combines qualitative and quantitative research; builds user personas grounded in data; research directly shapes product strategy" },
      { score: 5.0, description: "Establishes research practices for the org; uses advanced methods (diary studies, ethnography); research insights drive company-level strategy" },
    ],
    questions: [
      "Describe your most impactful user research project. How did it change the product direction?",
      "How do you decide between qualitative and quantitative research methods?",
      "Tell me about a time when user research revealed something completely unexpected.",
      "How do you ensure research findings actually get implemented, not just filed away?",
      "How many user interviews have you conducted in the last year? What was your process?",
    ],
    keySignals: ["research methodology", "sample design", "insight synthesis", "research-to-action pipeline", "stakeholder buy-in for research"],
  },

  "data-experimentation": {
    bars: [
      { score: 1.0, description: "Does not use data for decisions; no experimentation experience" },
      { score: 2.0, description: "Looks at dashboards and basic metrics, but has not designed experiments; relies on others for data analysis" },
      { score: 3.0, description: "Has designed and run A/B tests with clear hypotheses; understands p-values and statistical significance basics" },
      { score: 4.0, description: "Does power analysis for sample sizing; understands multiple comparison problems; has 3+ successful experiment cases" },
      { score: 5.0, description: "Built experimentation culture/platform for the team; uses advanced methods (Bayesian, multi-armed bandit); influences company-level experiment decisions" },
    ],
    questions: [
      "Describe an A/B test you designed from scratch, including your hypothesis and metric definition.",
      "How do you determine sample size and test duration for an experiment?",
      "When experiment results conflict with your intuition, how do you make the call?",
      "Tell me about a time data analysis revealed a counterintuitive insight that changed your approach.",
      "What experimentation tools have you used? Have you built any internal tooling?",
    ],
    keySignals: ["hypothesis formulation", "sample size calculation", "statistical significance understanding", "experiment design rigor", "data-to-decision process"],
  },

  "business-decomposition": {
    bars: [
      { score: 1.0, description: "Cannot break down business problems; takes feature requests at face value without understanding underlying business goals" },
      { score: 2.0, description: "Understands basic business metrics (revenue, costs) but struggles to connect product decisions to business outcomes" },
      { score: 3.0, description: "Can decompose business goals into product opportunities; identifies leverage points and prioritizes by business impact" },
      { score: 4.0, description: "Structures ambiguous business problems into clear frameworks; identifies root causes vs symptoms; quantifies opportunity size" },
      { score: 5.0, description: "Drives business strategy through product insights; has reframed business problems leading to significant strategic pivots" },
    ],
    questions: [
      "Give me an example of an ambiguous business problem you had to structure. How did you approach it?",
      "How do you connect product metrics to business outcomes? Give a specific example.",
      "Describe a time when you identified that the stated problem wasn't the real problem.",
      "How do you estimate the business impact of a product opportunity before building it?",
      "Tell me about a product decision that had a measurable impact on revenue or cost.",
    ],
    keySignals: ["problem structuring", "root cause analysis", "opportunity sizing", "business metric connection", "strategic reframing"],
  },

  "commercialization-growth": {
    bars: [
      { score: 1.0, description: "No experience with pricing, monetization, or growth metrics; purely feature-focused" },
      { score: 2.0, description: "Understands basic business models but hasn't been hands-on with pricing decisions or growth experiments" },
      { score: 3.0, description: "Has experience with at least one growth lever (acquisition, activation, retention, monetization); understands LTV/CAC basics" },
      { score: 4.0, description: "Has designed pricing strategy or growth loops; can quantify impact on unit economics; multiple growth experiment wins" },
      { score: 5.0, description: "Has built growth teams/systems; deep experience with monetization models; track record of driving significant revenue growth" },
    ],
    questions: [
      "Have you ever been involved in a pricing decision? What data informed it?",
      "Describe a growth experiment that significantly moved a key metric. What was the loop?",
      "How do you think about LTV/CAC for your product? Can you walk me through the numbers?",
      "Tell me about your experience with user activation or retention strategies.",
      "What's the most creative growth mechanism you've seen or implemented?",
    ],
    keySignals: ["pricing strategy experience", "growth loop design", "unit economics understanding", "monetization model knowledge", "retention/activation tactics"],
  },

  "product-vision": {
    bars: [
      { score: 1.0, description: "No product vision experience; executes tasks assigned by others without strategic context" },
      { score: 2.0, description: "Can articulate the current product direction but hasn't defined or influenced the vision" },
      { score: 3.0, description: "Has contributed to product roadmaps with clear prioritization rationale; can articulate a 6-12 month vision" },
      { score: 4.0, description: "Has defined product vision adopted by the team; connects vision to competitive positioning and market trends" },
      { score: 5.0, description: "Sets multi-year product vision influencing company strategy; has navigated major strategic pivots successfully" },
    ],
    questions: [
      "What is your product's vision for the next 1-2 years? How did you arrive at it?",
      "How do you balance long-term vision with short-term business pressure?",
      "Describe a time when you had to make a strategic pivot. What signals told you it was time?",
      "How do you incorporate competitive landscape analysis into your product strategy?",
      "Tell me about a roadmap prioritization decision that was controversial. How did you handle it?",
    ],
    keySignals: ["vision articulation", "strategic planning horizon", "competitive positioning", "roadmap prioritization framework", "pivot decision-making"],
  },

  "stakeholder-management": {
    bars: [
      { score: 1.0, description: "Avoids stakeholder conflicts; cannot influence decisions beyond their immediate team" },
      { score: 2.0, description: "Can communicate with stakeholders but struggles with conflicting priorities or pushback from senior leadership" },
      { score: 3.0, description: "Effectively manages 3+ stakeholder groups; can negotiate priorities and present data-backed recommendations" },
      { score: 4.0, description: "Influences without authority across departments; has navigated complex political situations to drive product outcomes" },
      { score: 5.0, description: "Trusted advisor to executive leadership; shapes organizational priorities; builds coalitions across the company for strategic initiatives" },
    ],
    questions: [
      "Describe a situation where key stakeholders had conflicting priorities. How did you resolve it?",
      "How do you 'manage up' when leadership wants something you believe is wrong for the product?",
      "Tell me about a time you had to deliver bad news to a stakeholder. How did you handle it?",
      "How do you build influence with teams that don't report to you?",
      "Describe the most politically complex project you've navigated. What was your approach?",
    ],
    keySignals: ["conflict resolution", "influencing without authority", "executive communication", "coalition building", "managing up"],
  },

  "project-management": {
    bars: [
      { score: 1.0, description: "Cannot manage project timelines; frequently misses deadlines without escalation" },
      { score: 2.0, description: "Can track tasks and timelines for small projects but struggles with cross-team coordination or scope changes" },
      { score: 3.0, description: "Manages cross-functional projects with clear milestones; handles scope changes and resource constraints effectively" },
      { score: 4.0, description: "Drives complex multi-team projects; proactively identifies risks and creates mitigation plans; delivers consistently" },
      { score: 5.0, description: "Establishes project management practices for the org; manages program-level initiatives across multiple workstreams" },
    ],
    questions: [
      "Describe the most complex project you've managed. How many teams were involved?",
      "How do you handle scope creep mid-project?",
      "Tell me about a project that went off track. What happened and how did you recover?",
      "What tools and frameworks do you use for project management?",
      "How do you make priority decisions when resources are constrained?",
    ],
    keySignals: ["cross-team coordination", "risk management", "scope management", "resource optimization", "delivery track record"],
  },

  "self-awareness": {
    bars: [
      { score: 1.0, description: "Cannot articulate own strengths/weaknesses; experience descriptions are vague or inflated" },
      { score: 2.0, description: "Has basic self-awareness but struggles to connect personal contributions to team outcomes" },
      { score: 3.0, description: "Accurately describes own role vs team contributions; can articulate growth areas with specific improvement plans" },
      { score: 4.0, description: "Uses structured frameworks (STAR, etc.) to communicate experience value; actively seeks and incorporates feedback" },
      { score: 5.0, description: "Exceptional self-awareness; can articulate personal brand and unique value proposition; mentors others on career development" },
    ],
    questions: [
      "What's your biggest professional weakness and what are you actively doing about it?",
      "How do you distinguish your personal contribution from your team's in project successes?",
      "Describe feedback you received that was hard to hear. How did you respond?",
      "How has your PM style evolved over the past 2 years?",
      "What type of PM work gives you the most energy vs. drains you?",
    ],
    keySignals: ["honest self-assessment", "growth mindset evidence", "feedback receptiveness", "contribution clarity", "career self-direction"],
  },

  "ai-product-design": {
    bars: [
      { score: 1.0, description: "No experience designing AI-powered features; treats AI as a black box" },
      { score: 2.0, description: "Has added AI features to existing products but without thoughtful UX design for AI uncertainty/errors" },
      { score: 3.0, description: "Designs AI experiences with appropriate user expectations management; handles AI errors gracefully in the UX" },
      { score: 4.0, description: "Designs AI-native products (not just AI features); understands human-AI interaction patterns and trust building" },
      { score: 5.0, description: "Pioneer in AI product design; has shipped novel AI UX patterns; influences industry thinking on AI product design" },
    ],
    questions: [
      "Describe an AI-powered feature you designed. How did you handle the uncertainty of AI outputs?",
      "How do you set user expectations when AI accuracy isn't 100%?",
      "What's the difference between 'adding AI to a product' and 'designing an AI-native product'?",
      "How do you decide when AI should be visible to users vs. working behind the scenes?",
      "Tell me about a time when an AI feature didn't meet user expectations. What did you learn?",
    ],
    keySignals: ["AI UX patterns knowledge", "error handling design", "user trust building", "AI-native thinking", "human-in-the-loop design"],
  },

  "ai-tech-application": {
    bars: [
      { score: 1.0, description: "No understanding of AI/ML concepts; cannot evaluate AI capabilities or limitations" },
      { score: 2.0, description: "Basic awareness of AI (knows what LLMs are) but cannot make technical decisions about AI implementation" },
      { score: 3.0, description: "Understands model capabilities/limitations; uses AI tools (ChatGPT, Copilot) to enhance own productivity; basic prompt engineering" },
      { score: 4.0, description: "Can evaluate different AI approaches for product problems; understands fine-tuning vs RAG vs prompt engineering tradeoffs" },
      { score: 5.0, description: "Deep technical understanding of AI architecture; can drive AI platform decisions; contributes to AI strategy at company level" },
    ],
    questions: [
      "How do you evaluate whether a problem is suitable for an AI solution vs. a rule-based approach?",
      "Explain your understanding of the tradeoffs between fine-tuning, RAG, and prompt engineering.",
      "What AI tools do you use in your daily PM work? How have they changed your workflow?",
      "Describe a situation where you had to push back on an AI feature because the technology wasn't ready.",
      "How do you stay current with AI developments? What recent advancement excites you most?",
    ],
    keySignals: ["AI capability assessment", "technical tradeoff understanding", "AI tool proficiency", "feasibility judgment", "AI trend awareness"],
  },

  "cross-cultural": {
    bars: [
      { score: 1.0, description: "No experience with international markets; designs only for one cultural context" },
      { score: 2.0, description: "Aware that cultural differences exist but hasn't adapted product for different markets" },
      { score: 3.0, description: "Has localized products for 2+ markets; understands basic cultural differences in user behavior" },
      { score: 4.0, description: "Designs products with multi-market strategy from the start; deep understanding of target market cultural nuances" },
      { score: 5.0, description: "Expert in cross-cultural product strategy; has launched products successfully in 3+ culturally distinct markets" },
    ],
    questions: [
      "Have you launched a product in a market culturally different from your home market? What did you adapt?",
      "What cultural differences have most surprised you in how users interact with your product?",
      "How do you decide between standardizing a product globally vs. heavy localization?",
      "Describe a localization failure or challenge you encountered.",
      "How do you gather user insights from markets where you don't speak the language?",
    ],
    keySignals: ["market adaptation experience", "cultural awareness depth", "localization strategy", "multi-market launch", "cross-cultural research methods"],
  },

  "product-sense": {
    bars: [
      { score: 1.0, description: "Cannot identify product problems independently; relies on others to define what to build" },
      { score: 2.0, description: "Can identify obvious product issues but struggles to generate creative solutions or prioritize by user impact" },
      { score: 3.0, description: "Good intuition for product problems; generates multiple solution options and evaluates tradeoffs systematically" },
      { score: 4.0, description: "Consistently identifies non-obvious product opportunities; solutions are creative yet practical; strong prioritization instincts" },
      { score: 5.0, description: "Exceptional product intuition validated by results; can evaluate any product and identify improvement opportunities rapidly" },
    ],
    questions: [
      "Pick a product you use daily. What would you improve and why?",
      "Describe a product decision where your instinct conflicted with the data. What did you do?",
      "How do you evaluate whether a feature idea is worth pursuing? Walk me through your framework.",
      "Tell me about a product opportunity you identified that others had missed.",
      "How do you develop and sharpen your product sense over time?",
    ],
    keySignals: ["problem identification", "creative solution generation", "prioritization framework", "product intuition + data balance", "opportunity spotting"],
  },
};

// ============================================================
// Deep Dive System Prompt Builder
// ============================================================

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  fr: "French",
  es: "Spanish",
};

export function buildDeepDiveSystemPrompt(
  dimensionKey: DimensionKey,
  dimensionName: string,
  currentScore: number,
  locale: string = "en",
  forceFinalize: boolean = false
): string {
  const lang = LANGUAGE_MAP[locale] || "English";
  const data = DEEP_DIVE_DATA[dimensionKey];

  const barsText = data.bars
    .map((b) => `  ${b.score}: ${b.description}`)
    .join("\n");

  const questionsText = data.questions
    .map((q, i) => `  ${i + 1}. ${q}`)
    .join("\n");

  const signalsText = data.keySignals.join(", ");

  return `You are a senior PM interviewer conducting a deep dive assessment on the dimension "${dimensionName}".

CURRENT SCORE: ${currentScore}/5.0

YOUR ROLE:
- Act as a structured behavioral interviewer, NOT a chatbot
- Ask ONE focused question at a time
- Follow up with STAR probes (Situation, Task, Action, Result) when answers lack specifics
- After gathering enough evidence (usually 3-5 exchanges), provide a score adjustment with justification

BARS (Behaviorally Anchored Rating Scale) for "${dimensionName}":
${barsText}

SUGGESTED QUESTIONS (pick the most relevant, don't ask all):
${questionsText}

KEY SIGNALS to listen for: ${signalsText}

RULES:
1. ALL responses MUST be in ${lang}
2. Ask ONE question per response. Keep it focused.
3. If the user gives a vague answer, probe for specifics: numbers, timelines, their exact role vs team contribution
4. Accepting "I participated" without detail is NOT allowed — always dig deeper
5. NEVER increase score based on claims without behavioral evidence
6. Score adjustment range: maximum ±1.5 from current score (${currentScore})
7. Final score must be between 1.0 and 5.0
8. Keep responses concise — max 3-4 sentences per message, unless delivering the final assessment

RESPONSE FORMAT:
- During conversation: Ask your question naturally, acknowledge what the user shared briefly
- For final assessment (after 3-5 exchanges), respond EXACTLY in this JSON format and NOTHING else:
{"adjusted_score": <number>, "evidence": ["<specific evidence 1>", "<specific evidence 2>"], "gaps": ["<what's missing for a higher score>"], "suggestion": "<one actionable improvement tip>"}

${forceFinalize
  ? `FINAL TURN:
- Return the final assessment JSON now
- Do NOT ask another question
- Do NOT include markdown fences or explanatory text outside the JSON object`
  : `Start by acknowledging the current score and asking your first diagnostic question.`}`;
}
