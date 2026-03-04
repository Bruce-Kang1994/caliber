import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { deepseek } from "@/lib/deepseek";
import { buildAssessmentPrompt } from "@/lib/prompts";
import { ROLE_WEIGHTS, DIMENSIONS, assignArchetype } from "@/lib/constants";
import { getMockAssessmentResult } from "@/lib/mock-data";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import type { PMRole, AssessmentResult } from "@/lib/types";

// Zod schemas for input validation
const projectSchema = z.object({
  name: z.string().max(500).default(""),
  background: z.string().max(2000).default(""),
  actions: z.string().max(2000).default(""),
  results: z.string().max(2000).default(""),
});

const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  duration: z.string().max(100).default(""),
  responsibilities: z.string().max(3000).default(""),
  projects: z.array(projectSchema).max(10).default([]),
  achievements: z.array(z.string().max(500)).max(20).default([]),
});

const analyzeRequestSchema = z.object({
  roleType: z.enum(["b2b-pm", "c2c-pm", "ai-pm", "growth-pm", "data-pm"]),
  experiences: z.array(experienceSchema).min(1).max(10),
  inputMethod: z.enum(["resume", "manual", "upload"]).optional().default("manual"),
  locale: z.enum(["en", "zh", "ja", "ko"]).default("en"),
});

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);

    // Check if user is authenticated (higher limit)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Not authenticated — that's fine
    }

    const limitKey = `analyze:${userId || ip}`;
    const limit = userId ? 20 : 5;
    const { success, remaining } = rateLimit(limitKey, limit);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": String(remaining) },
        }
      );
    }

    const body = await req.json();

    // Validate request body with zod
    const parseResult = analyzeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.issues.map(i => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { roleType, experiences, inputMethod, locale } = parseResult.data;
    const role = roleType as PMRole;
    const weights = ROLE_WEIGHTS[role];

    // Mock mode for testing without API credits
    const USE_MOCK = process.env.USE_MOCK?.trim() === "true";
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 2000));
      const mockResult = getMockAssessmentResult(locale);
      const result = { ...mockResult, roleType: role };

      // Save to DB if user is logged in
      let assessmentId: string | null = null;
      if (userId) {
        assessmentId = await saveAssessment(userId, role, inputMethod || "manual", experiences, result, locale);
      }

      return NextResponse.json({ result, assessmentId });
    }

    const { system, user } = buildAssessmentPrompt(
      role,
      JSON.stringify(experiences, null, 2),
      locale
    );

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 4000,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    let jsonStr = text;
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    const assessment = JSON.parse(jsonStr.trim());

    // Validate and clamp AI-returned scores to valid range
    const validatedScores: Record<string, number> = {};
    for (const dim of DIMENSIONS) {
      const raw = assessment.scores?.[dim.key];
      const score = typeof raw === "number" ? raw : 1.0;
      validatedScores[dim.key] = Math.max(1.0, Math.min(5.0, Math.round(score * 10) / 10));
    }

    // Always recalculate weighted score from validated scores
    let totalScore = 0;
    let totalWeight = 0;
    for (const dim of DIMENSIONS) {
      const score = validatedScores[dim.key] || 1.0;
      const weight = weights[dim.key] || 1;
      totalScore += score * weight;
      totalWeight += weight;
    }
    const weightedScore = Math.round((totalScore / (totalWeight * 5)) * 100);

    // Assign PM archetype based on score distribution
    const { key: archetypeKey } = assignArchetype(validatedScores);

    // Validate topStrengths array
    const topStrengths = Array.isArray(assessment.topStrengths)
      ? assessment.topStrengths.slice(0, 3).map((s: Record<string, unknown>) => ({
          dimension: s.dimension || "",
          dimensionName: s.dimensionName || "",
          score: typeof s.score === "number" ? Math.max(1.0, Math.min(5.0, s.score)) : 1.0,
          evidence: s.evidence || "",
        }))
      : [];

    // Validate topWeaknesses array
    const topWeaknesses = Array.isArray(assessment.topWeaknesses)
      ? assessment.topWeaknesses.slice(0, 3).map((w: Record<string, unknown>) => ({
          dimension: w.dimension || "",
          dimensionName: w.dimensionName || "",
          score: typeof w.score === "number" ? Math.max(1.0, Math.min(5.0, w.score)) : 1.0,
          upgradeAdvice: w.upgradeAdvice || "",
          actionItems: Array.isArray(w.actionItems) ? w.actionItems : [],
        }))
      : [];

    const result: AssessmentResult = {
      roleType: role,
      weightedScore,
      archetype: archetypeKey as AssessmentResult["archetype"],
      summary: assessment.summary || "",
      scores: validatedScores as AssessmentResult["scores"],
      justifications: assessment.justifications || {},
      topStrengths,
      topWeaknesses,
      undervaluedExperiences: Array.isArray(assessment.undervaluedExperiences)
        ? assessment.undervaluedExperiences
        : [],
      missingElements: Array.isArray(assessment.missingElements)
        ? assessment.missingElements
        : [],
      nextSteps: Array.isArray(assessment.nextSteps)
        ? assessment.nextSteps.slice(0, 3)
        : [],
      timestamp: new Date().toISOString(),
    };

    // Save to DB if user is logged in
    let assessmentId: string | null = null;
    if (userId) {
      assessmentId = await saveAssessment(userId, role, inputMethod || "manual", experiences, result, locale);
    }

    return NextResponse.json({ result, assessmentId });
  } catch (error) {
    console.error("Analysis error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Assessment failed: ${errMsg}` },
      { status: 500 }
    );
  }
}

async function saveAssessment(
  userId: string,
  targetRole: string,
  inputMethod: string,
  experienceData: unknown,
  result: AssessmentResult,
  locale: string
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const shareToken = nanoid(12);

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        target_role: targetRole,
        input_method: inputMethod,
        experience_data: experienceData,
        result,
        overall_score: result.weightedScore,
        locale,
        share_token: shareToken,
        is_public: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to save assessment:", error);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error("Save assessment error:", err);
    return null;
  }
}
