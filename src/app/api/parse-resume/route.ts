import { NextRequest, NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";
import { buildResumeParsePrompt } from "@/lib/prompts";
import { MOCK_EXPERIENCES } from "@/lib/mock-data";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const USE_MOCK = process.env.USE_MOCK?.trim() === "true";
  try {
    // Rate limiting: 10 requests per hour per IP
    const ip = getClientIp(req.headers);
    const { success } = rateLimit(`parse-resume:${ip}`, 10);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const pdf = formData.get("pdf") as File | null;
    const locale = (formData.get("locale") as string) || "en";

    if (!pdf) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    // Mock mode for testing without API credits
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({ experiences: MOCK_EXPERIENCES });
    }

    // Extract text from PDF using unpdf (serverless compatible)
    const arrayBuffer = await pdf.arrayBuffer();
    const { extractText } = await import("unpdf");
    const { text: textPages } = await extractText(new Uint8Array(arrayBuffer));
    const textContent = Array.isArray(textPages) ? textPages.join("\n") : String(textPages);

    if (!textContent || textContent.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please try a different file or use manual input." },
        { status: 400 }
      );
    }

    // Use DeepSeek to parse the resume text
    const prompt = buildResumeParsePrompt(locale);

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n---\nRESUME CONTENT:\n${textContent.slice(0, 8000)}`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to extract structured data from resume" },
        { status: 500 }
      );
    }

    const experiences = JSON.parse(jsonMatch[0]);

    const mapped = experiences.map(
      (exp: {
        company?: string;
        title?: string;
        duration?: string;
        responsibilities?: string;
        projects?: Array<{
          name?: string;
          background?: string;
          actions?: string;
          results?: string;
        }>;
        achievements?: string[];
      }) => ({
        company: exp.company || "",
        title: exp.title || "",
        duration: exp.duration || "",
        responsibilities: exp.responsibilities || "",
        projects: (exp.projects || []).map(
          (p: {
            name?: string;
            background?: string;
            actions?: string;
            results?: string;
          }) => ({
            name: p.name || "",
            background: p.background || "",
            actions: p.actions || "",
            results: p.results || "",
          })
        ),
        achievements: exp.achievements || [],
      })
    );

    return NextResponse.json({ experiences: mapped });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Resume parse error:", errMsg, error);
    return NextResponse.json(
      { error: `Failed to parse resume: ${errMsg}` },
      { status: 500 }
    );
  }
}
