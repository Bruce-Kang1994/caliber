import OpenAI from "openai";

// AI provider selection: OpenAI (fast from Vercel US) or DeepSeek (cheap)
// Set AI_PROVIDER=openai in Vercel env, or defaults to deepseek for local dev

const provider = process.env.AI_PROVIDER || "deepseek";

function createClient(): { client: OpenAI; model: string } {
  if (provider === "openai") {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "",
      }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  // Default: DeepSeek
  return {
    client: new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY || "",
    }),
    model: "deepseek-chat",
  };
}

export const { client: aiClient, model: aiModel } = createClient();

// Keep backward compatibility
export const deepseek = aiClient;
