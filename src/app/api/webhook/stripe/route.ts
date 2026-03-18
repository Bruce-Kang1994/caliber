import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) {
        return NextResponse.json({ received: true });
      }

      // Update user tier
      const { error: upsertError } = await supabase.from("user_subscriptions").upsert(
        {
          user_id: userId,
          tier: plan === "pro" ? "pro" : "single",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (upsertError) {
        console.error("Failed to update user tier:", upsertError);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
      }

      // For subscriptions, copy user_id to subscription metadata
      // so we can identify the user in future webhook events
      if (session.subscription) {
        await getStripe().subscriptions.update(session.subscription as string, {
          metadata: { user_id: userId },
        });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;

      if (!userId) {
        return NextResponse.json({ received: true });
      }

      const isActive =
        subscription.status === "active" ||
        subscription.status === "trialing";

      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          tier: isActive ? "pro" : "free",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
      if (updateError) {
        console.error("Failed to update subscription status:", updateError);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
