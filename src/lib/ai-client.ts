import OpenAI from "openai";

// AI provider selection via AI_PROVIDER env var:
//   "groq"     → Groq (free, fast, US servers) — recommended for Vercel
//   "openai"   → OpenAI (GPT-4o-mini, cheap, US servers)
//   "deepseek" → DeepSeek (default, for local dev)

const provider = process.env.AI_PROVIDER || "deepseek";

function getRequiredKey(name: string): string {
  const key = process.env[name];
  if (!key) {
    console.error(`Missing required environment variable: ${name}. AI features will not work.`);
    return "MISSING_API_KEY";
  }
  return key;
}

function createClient(): { client: OpenAI; model: string } {
  if (provider === "groq") {
    return {
      client: new OpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: getRequiredKey("GROQ_API_KEY"),
      }),
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    };
  }

  if (provider === "openai") {
    return {
      client: new OpenAI({
        apiKey: getRequiredKey("OPENAI_API_KEY"),
      }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }

  // Default: DeepSeek
  return {
    client: new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: getRequiredKey("DEEPSEEK_API_KEY"),
    }),
    model: "deepseek-chat",
  };
}

export const { client: aiClient, model: aiModel } = createClient();

// Keep backward compatibility
export const deepseek = aiClient;
