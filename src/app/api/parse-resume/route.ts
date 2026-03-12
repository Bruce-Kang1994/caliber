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

    // Mock mode for testing without API credits — return NDJSON stream (same as real API)
    if (USE_MOCK) {
      const mockEncoder = new TextEncoder();
      const mockStream = new ReadableStream({
        async start(controller) {
          const send = (data: Record<string, unknown>) => {
            controller.enqueue(mockEncoder.encode(JSON.stringify(data) + "\n"));
          };
          send({ type: "progress", step: "extracting" });
          await new Promise((r) => setTimeout(r, 800));
          send({ type: "progress", step: "parsing" });
          await new Promise((r) => setTimeout(r, 700));
          send({ type: "result", experiences: MOCK_EXPERIENCES });
          controller.close();
        },
      });
      return new Response(mockStream, {
        headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache" },
      });
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

    // Use DeepSeek to parse the resume text (streaming to keep connection alive)
    const prompt = buildResumeParsePrompt(locale);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        };

        try {
          send({ type: "progress", step: "extracting" });

          const streamResponse = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            max_tokens: 2000,
            stream: true,
            messages: [
              {
                role: "user",
                content: `${prompt}\n\n---\nRESUME CONTENT:\n${textContent.slice(0, 8000)}`,
              },
            ],
          });

          let text = "";
          let chunkCount = 0;
          for await (const chunk of streamResponse) {
            const delta = chunk.choices[0]?.delta?.content || "";
            text += delta;
            chunkCount++;
            if (chunkCount % 15 === 0) {
              send({ type: "progress", step: "parsing", tokens: chunkCount });
            }
          }

          if (!text) {
            send({ type: "error", error: "No response from AI" });
            controller.close();
            return;
          }

          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (!jsonMatch) {
            send({ type: "error", error: "Failed to extract structured data from resume" });
            controller.close();
            return;
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

          send({ type: "result", experiences: mapped });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          send({ type: "error", error: `Failed to parse resume: ${errMsg}` });
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
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Resume parse error:", errMsg, error);
    return NextResponse.json(
      { error: `Failed to parse resume: ${errMsg}` },
      { status: 500 }
    );
  }
}
