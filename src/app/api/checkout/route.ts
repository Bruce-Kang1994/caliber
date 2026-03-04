import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckout, getVariantId } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan: "single" | "pro" };

    if (plan !== "single" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const variantId = getVariantId(plan);
    if (!variantId) {
      return NextResponse.json(
        { error: "Payment not configured" },
        { status: 503 }
      );
    }

    const origin = req.headers.get("origin") || "";

    const checkoutUrl = await createCheckout({
      variantId,
      email: user.email,
      userId: user.id,
      redirectUrl: `${origin}/assess/report?upgraded=true`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
