import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const shareToken = searchParams.get("share");

    // Get shared assessment (public, no auth required)
    if (shareToken) {
      const { data, error } = await supabase
        .from("assessments")
        .select("id, target_role, result, overall_score, locale, created_at")
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ assessment: data });
    }

    // Get single assessment by ID
    if (id) {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ assessment: data });
    }

    // List all assessments for current user
    const { data, error } = await supabase
      .from("assessments")
      .select("id, target_role, input_method, overall_score, locale, share_token, is_public, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ assessments: data || [] });
  } catch (error) {
    console.error("Assessments API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("assessments")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete assessment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, is_public } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("assessments")
      .update({ is_public })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("share_token")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, share_token: data.share_token });
  } catch (error) {
    console.error("Update assessment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
