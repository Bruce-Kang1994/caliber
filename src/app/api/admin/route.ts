import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    // Verify admin role
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Use admin client to bypass RLS
    const admin = createAdminClient();

    // Fetch metrics in parallel
    const [
      { count: totalUsers },
      { count: totalAssessments },
      { data: todayData },
      { data: avgData },
      { data: recentUsers },
      { data: recentAssessments },
      { data: roleData },
    ] = await Promise.all([
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("assessments").select("*", { count: "exact", head: true }),
      admin
        .from("assessments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]),
      admin.rpc("avg_score"),
      admin
        .from("profiles")
        .select("id, display_name, avatar_url, role, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("assessments")
        .select("id, target_role, overall_score, locale, created_at, user_id, profiles(display_name)")
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("assessments")
        .select("target_role, overall_score"),
    ]);

    // Calculate average score manually if rpc doesn't exist
    let avgScore = 0;
    if (avgData && typeof avgData === "number") {
      avgScore = avgData;
    } else if (roleData) {
      const scores = roleData
        .map((a: { target_role: string; overall_score: number | null }) => a.overall_score)
        .filter((s): s is number => typeof s === "number");
      if (scores.length > 0) {
        avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }

    // Calculate role distribution
    const roleDistribution: Record<string, number> = {};
    if (roleData) {
      for (const item of roleData) {
        const role = (item as { target_role: string }).target_role;
        roleDistribution[role] = (roleDistribution[role] || 0) + 1;
      }
    }

    return NextResponse.json({
      metrics: {
        totalUsers: totalUsers || 0,
        totalAssessments: totalAssessments || 0,
        todayAssessments: todayData?.length || 0,
        avgScore,
      },
      recentUsers: recentUsers || [],
      recentAssessments: recentAssessments || [],
      roleDistribution,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
