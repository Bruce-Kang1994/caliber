import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, score, archetype, locale } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("email_leads").upsert(
      {
        email: email.toLowerCase().trim(),
        score: score || null,
        archetype: archetype || null,
        locale: locale || "en",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Email collection error:", error);
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
