import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserTier } from "@/lib/subscription";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ tier: "free" as UserTier });
    }

    const admin = createAdminClient();
    const { data } = await admin
      .from("user_subscriptions")
      .select("tier")
      .eq("user_id", user.id)
      .single();

    const tier: UserTier = data?.tier || "free";
    return NextResponse.json({ tier });
  } catch {
    return NextResponse.json({ tier: "free" as UserTier });
  }
}
