import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "overview";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    if (tab === "users") {
      let query = admin
        .from("profiles")
        .select("id, display_name, avatar_url, role, created_at", { count: "exact" });

      if (search) {
        query = query.ilike("display_name", `%${search}%`);
      }

      const { data: users, count } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

      // Get email from auth.users for each profile
      const userIds = (users || []).map((u: { id: string }) => u.id);
      const usersWithEmail = [];

      if (userIds.length > 0) {
        const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
        const emailMap: Record<string, string> = {};
        for (const au of authData?.users || []) {
          emailMap[au.id] = au.email || "";
        }

        for (const u of users || []) {
          usersWithEmail.push({
            ...u,
            email: emailMap[(u as { id: string }).id] || "",
          });
        }
      }

      return NextResponse.json({
        users: usersWithEmail,
        total: count || 0,
        page,
        pageSize,
      });
    }

    if (tab === "assessments") {
      let query = admin
        .from("assessments")
        .select("id, target_role, input_method, overall_score, locale, is_public, share_token, created_at, user_id, profiles(display_name)", { count: "exact" });

      if (search) {
        query = query.ilike("target_role", `%${search}%`);
      }

      const { data: assessments, count } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

      return NextResponse.json({
        assessments: assessments || [],
        total: count || 0,
        page,
        pageSize,
      });
    }

    if (tab === "export") {
      const [{ data: allUsers }, { data: allAssessments }] = await Promise.all([
        admin.from("profiles").select("id, display_name, role, created_at").order("created_at", { ascending: false }),
        admin.from("assessments").select("id, target_role, input_method, overall_score, locale, is_public, created_at, user_id, profiles(display_name)").order("created_at", { ascending: false }),
      ]);

      const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const emailMap: Record<string, string> = {};
      for (const au of authData?.users || []) {
        emailMap[au.id] = au.email || "";
      }

      return NextResponse.json({
        users: (allUsers || []).map((u: { id: string; display_name: string | null; role: string; created_at: string }) => ({
          ...u,
          email: emailMap[u.id] || "",
        })),
        assessments: allAssessments || [],
      });
    }

    // Default: overview metrics
    const [
      { count: totalUsers },
      { count: totalAssessments },
      { count: todayCount },
      { data: roleData },
    ] = await Promise.all([
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("assessments").select("*", { count: "exact", head: true }),
      admin
        .from("assessments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().split("T")[0]),
      admin
        .from("assessments")
        .select("target_role, overall_score"),
    ]);

    let avgScore = 0;
    const roleDistribution: Record<string, number> = {};
    if (roleData) {
      const scores = roleData
        .map((a: { target_role: string; overall_score: number | null }) => a.overall_score)
        .filter((s): s is number => typeof s === "number");
      if (scores.length > 0) {
        avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
      for (const item of roleData) {
        const role = (item as { target_role: string }).target_role;
        roleDistribution[role] = (roleDistribution[role] || 0) + 1;
      }
    }

    return NextResponse.json({
      metrics: {
        totalUsers: totalUsers || 0,
        totalAssessments: totalAssessments || 0,
        todayAssessments: todayCount || 0,
        avgScore,
      },
      roleDistribution,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, role } = body;
    const admin = createAdminClient();

    if (action === "updateRole") {
      if (!userId || !role || !["user", "admin"].includes(role)) {
        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
      }
      if (userId === adminUser.id) {
        return NextResponse.json({ error: "Cannot change own role" }, { status: 400 });
      }

      const { error } = await admin
        .from("profiles")
        .update({ role })
        .eq("id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const admin = createAdminClient();

    if (type === "user" && id) {
      if (id === adminUser.id) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
      }
      // Delete profile (cascade deletes assessments) then auth user
      await admin.from("profiles").delete().eq("id", id);
      await admin.auth.admin.deleteUser(id);
      return NextResponse.json({ success: true });
    }

    if (type === "assessment" && id) {
      await admin.from("assessments").delete().eq("id", id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("Admin DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
