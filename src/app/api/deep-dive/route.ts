import { NextRequest } from "next/server";
import { z } from "zod";
import { deepseek } from "@/lib/deepseek";
import { buildDeepDiveSystemPrompt } from "@/lib/deep-dive";
import { DIMENSIONS } from "@/lib/constants";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type { DimensionKey } from "@/lib/types";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const requestSchema = z.object({
  dimensionKey: z.string(),
  dimensionName: z.string().max(200),
  currentScore: z.number().min(1).max(5),
  messages: z.array(messageSchema).max(12),
  locale: z.enum(["en", "zh", "ja", "ko", "fr", "es"]).default("en"),
  forceFinalize: z.boolean().optional().default(false),
});

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Not authenticated
    }

    const limitKey = `deep-dive:${userId || ip}`;
    const limit = userId ? 30 : 5;
    const { success } = rateLimit(limitKey, limit);

    if (!success) {
      return Response.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        { error: "Invalid request", details: parseResult.error.issues.map(i => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { dimensionKey, dimensionName, currentScore, messages, locale, forceFinalize } = parseResult.data;

    // Validate dimensionKey
    if (!DIMENSIONS.find(d => d.key === dimensionKey)) {
      return Response.json({ error: "Invalid dimension key" }, { status: 400 });
    }

    // Mock mode for testing without API credits
    const USE_MOCK = process.env.USE_MOCK?.trim() === "true";
    if (USE_MOCK) {
      const isFirstMessage = messages.length === 0;
      const exchangeCount = messages.filter(m => m.role === "user").length;

      let mockResponse: string;
      if (forceFinalize || exchangeCount >= 3) {
        const adjustedScore = Math.min(5.0, Math.max(1.0, currentScore + 0.3));
        mockResponse = JSON.stringify({
          adjusted_score: adjustedScore,
          evidence: [
            locale === "zh" ? "在项目中展现了该维度的实际应用能力" : "Demonstrated practical application in projects",
            locale === "zh" ? "能够清晰描述决策过程和结果" : "Clearly articulated decision process and outcomes",
          ],
          gaps: [
            locale === "zh" ? "可以进一步加强数据驱动的决策方式" : "Could strengthen data-driven decision making",
          ],
          suggestion: locale === "zh"
            ? "建议在下一个项目中主动设计实验框架，用数据验证你的产品假设。"
            : "Consider designing experiment frameworks in your next project to validate product hypotheses with data.",
        });
      } else if (isFirstMessage) {
        mockResponse = locale === "zh"
          ? `让我们深入了解你在「${dimensionName}」方面的能力。\n\n你目前的评分是 ${currentScore.toFixed(1)}/5.0。能否分享一个你在这个维度上最有代表性的项目经历？请具体描述你做了什么、遇到了什么挑战、以及最终的结果。`
          : `Let's explore your capabilities in "${dimensionName}".\n\nYour current score is ${currentScore.toFixed(1)}/5.0. Can you share a specific project experience that best demonstrates your ability in this dimension? Please describe what you did, the challenges you faced, and the outcomes.`;
      } else {
        mockResponse = locale === "zh"
          ? "谢谢你的分享。这个经历很有参考价值。能否再补充一下：在这个过程中，你是如何做决策的？有没有遇到需要在多个方案之间权衡取舍的情况？"
          : "Thank you for sharing. This experience is very informative. Could you elaborate on how you made decisions during this process? Were there situations where you had to weigh trade-offs between different approaches?";
      }

      const encoder = new TextEncoder();
      const mockStream = new ReadableStream({
        async start(controller) {
          // Simulate streaming by sending chunks
          const words = mockResponse.split("");
          for (let i = 0; i < words.length; i += 5) {
            const chunk = words.slice(i, i + 5).join("");
            controller.enqueue(encoder.encode(chunk));
            await new Promise(r => setTimeout(r, 20));
          }
          controller.close();
        },
      });
      return new Response(mockStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
      });
    }

    const systemPrompt = buildDeepDiveSystemPrompt(
      dimensionKey as DimensionKey,
      dimensionName,
      currentScore,
      locale,
      forceFinalize
    );

    // Build conversation messages
    const apiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      ...(forceFinalize
        ? [{
            role: "user" as const,
            content:
              locale === "zh"
                ? "这是最后一轮，请现在直接输出最终 JSON 评估，不要再提问。"
                : locale === "ja"
                  ? "これが最終ターンです。追加質問はせず、最終JSON評価を返してください。"
                  : locale === "ko"
                    ? "이번이 마지막 턴입니다. 추가 질문 없이 최종 JSON 평가를 반환하세요."
                    : "This is the final turn. Return the final JSON assessment now and do not ask another question.",
          }]
        : []),
    ];

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResponse = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            max_tokens: 500,
            temperature: 0.3,
            stream: true,
            messages: apiMessages,
          });

          for await (const chunk of streamResponse) {
            const delta = chunk.choices[0]?.delta?.content || "";
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          controller.enqueue(encoder.encode(`\n\n[Error: ${errMsg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Deep dive error:", error);
    return Response.json(
      { error: "Deep dive failed" },
      { status: 500 }
    );
  }
}
