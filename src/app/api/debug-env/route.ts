import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    USE_MOCK: process.env.USE_MOCK,
    USE_MOCK_TYPE: typeof process.env.USE_MOCK,
    USE_MOCK_EQUALS_TRUE: process.env.USE_MOCK === "true",
    HAS_DEEPSEEK: !!process.env.DEEPSEEK_API_KEY,
    HAS_SUPABASE: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}
