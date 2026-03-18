import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { aiClient, aiModel } from "@/lib/ai-client";
import { buildAssessmentPrompt } from "@/lib/prompts";
import { ROLE_WEIGHTS, DIMENSIONS, assignArchetype } from "@/lib/constants";
import { getMockAssessmentResult } from "@/lib/mock-data";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import type { PMRole, ArchetypeProfile, AssessmentResult } from "@/lib/types";

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
  level: z.enum(["junior", "mid", "senior", "director"]).default("mid"),
  experiences: z.array(experienceSchema).min(1).max(10),
  inputMethod: z.enum(["resume", "manual", "upload"]).optional().default("manual"),
  locale: z.enum(["en", "zh", "ja", "ko", "fr", "es"]).default("en"),
});

export const maxDuration = 60;
// Deploy function to Hong Kong — closest region to DeepSeek China servers
export const preferredRegion = "hkg1";

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

    const { roleType, level, experiences, inputMethod, locale } = parseResult.data;
    const role = roleType as PMRole;
    const weights = ROLE_WEIGHTS[role];

    // Mock mode for testing without API credits
    const USE_MOCK = process.env.USE_MOCK?.trim() === "true";
    if (USE_MOCK) {
      const mockResult = getMockAssessmentResult(locale);
      const result = { ...mockResult, roleType: role, level };

      // Save to DB if user is logged in
      let assessmentId: string | null = null;
      let shareToken: string | null = null;
      if (userId) {
        const saved = await saveAssessment(userId, role, inputMethod || "manual", experiences, result, locale);
        if (saved) { assessmentId = saved.id; shareToken = saved.shareToken; }
      }

      // Return NDJSON stream format (same as real API) so the client parser works
      const mockEncoder = new TextEncoder();
      const mockStream = new ReadableStream({
        async start(controller) {
          const send = (data: Record<string, unknown>) => {
            controller.enqueue(mockEncoder.encode(JSON.stringify(data) + "\n"));
          };
          send({ type: "progress", step: 1 });
          await new Promise((r) => setTimeout(r, 500));
          send({ type: "progress", step: 2 });
          await new Promise((r) => setTimeout(r, 500));
          send({ type: "progress", step: 3 });
          await new Promise((r) => setTimeout(r, 500));
          send({ type: "result", result, assessmentId, shareToken });
          controller.close();
        },
      });
      return new Response(mockStream, {
        headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" },
      });
    }

    const { system, user } = buildAssessmentPrompt(
      role,
      JSON.stringify(experiences, null, 2),
      locale,
      level
    );

    // Use streaming to avoid Vercel function timeout (~38-60s for DeepSeek)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        };

        try {
          send({ type: "progress", step: 1 });

          // Stream from DeepSeek and accumulate chunks
          const streamResponse = await aiClient.chat.completions.create({
            model: aiModel,
            max_tokens: 2400,
            temperature: 0,
            stream: true,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          });

          let text = "";
          let chunkCount = 0;
          for await (const chunk of streamResponse) {
            const delta = chunk.choices[0]?.delta?.content || "";
            text += delta;
            chunkCount++;
            // Send progress updates periodically to keep connection alive
            if (chunkCount % 20 === 0) {
              send({ type: "progress", step: 2, tokens: chunkCount });
            }
          }

          send({ type: "progress", step: 3 });

          if (!text) {
            send({ type: "error", error: "No response from AI" });
            controller.close();
            return;
          }

          // Extract JSON robustly: strip code fences (even if truncated/unclosed)
          let jsonStr = text.trim();
          // Remove opening ```json or ```
          jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "");
          // Remove closing ``` if present
          jsonStr = jsonStr.replace(/```\s*$/, "");
          // Find the first { and last } to extract JSON object
          const firstBrace = jsonStr.indexOf("{");
          const lastBrace = jsonStr.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
          }

          let assessment;
          try {
            assessment = JSON.parse(jsonStr.trim());
          } catch (parseErr) {
            send({ type: "error", error: "AI returned invalid response. Please try again." });
            controller.close();
            return;
          }

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
          const { key: archetypeKey, profile: archetypeProfileData } = assignArchetype(validatedScores);

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
                actionItems: Array.isArray(w.actionItems)
                  ? w.actionItems.map((item: unknown) => {
                      if (typeof item === "object" && item !== null && "action" in item) {
                        const obj = item as Record<string, unknown>;
                        return { action: String(obj.action || ""), timeframe: String(obj.timeframe || ""), artifact: String(obj.artifact || "") };
                      }
                      return String(item);
                    })
                  : [],
              }))
            : [];

          const result: AssessmentResult = {
            roleType: role,
            level,
            weightedScore,
            archetype: archetypeKey as AssessmentResult["archetype"],
            archetypeProfile: archetypeProfileData.length >= 2
              ? {
                  primary: { key: archetypeProfileData[0].key, label: archetypeProfileData[0].label, percentage: archetypeProfileData[0].percentage } as ArchetypeProfile["primary"],
                  secondary: { key: archetypeProfileData[1].key, label: archetypeProfileData[1].label, percentage: archetypeProfileData[1].percentage } as ArchetypeProfile["secondary"],
                }
              : undefined,
            summary: assessment.summary || "",
            scores: validatedScores as AssessmentResult["scores"],
            // Justifications removed from AI output to save tokens; pass through if available
            justifications: Object.fromEntries(
              DIMENSIONS.map((d) => [d.key, assessment.justifications?.[d.key] || ""])
            ) as AssessmentResult["justifications"],
            topStrengths,
            topWeaknesses,
            undervaluedExperiences: Array.isArray(assessment.undervaluedExperiences)
              ? assessment.undervaluedExperiences
              : [],
            missingElements: Array.isArray(assessment.missingElements)
              ? assessment.missingElements
              : [],
            nextSteps: Array.isArray(assessment.nextSteps)
              ? assessment.nextSteps.map((step: unknown) => {
                  if (typeof step === "object" && step !== null && "action" in step) {
                    const obj = step as Record<string, unknown>;
                    return { action: String(obj.action || ""), timeframe: String(obj.timeframe || ""), rationale: String(obj.rationale || "") };
                  }
                  return String(step);
                })
              : [],
            timestamp: new Date().toISOString(),
          };

          // Save to DB if user is logged in
          let assessmentId: string | null = null;
          let shareToken: string | null = null;
          if (userId) {
            const saved = await saveAssessment(userId, role, inputMethod || "manual", experiences, result, locale);
            if (saved) { assessmentId = saved.id; shareToken = saved.shareToken; }
          }

          send({ type: "result", result, assessmentId, shareToken });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          send({ type: "error", error: `Assessment failed: ${errMsg}` });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
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
): Promise<{ id: string; shareToken: string } | null> {
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
        is_public: true,
      })
      .select("id, share_token")
      .single();

    if (error) {
      console.error("Failed to save assessment:", error);
      return null;
    }

    return { id: data.id, shareToken: data.share_token };
  } catch (err) {
    console.error("Save assessment error:", err);
    return null;
  }
}
