import OpenAI from "openai";

// DeepSeek uses OpenAI-compatible API format
export const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});
