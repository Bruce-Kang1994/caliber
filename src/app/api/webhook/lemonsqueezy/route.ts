import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWebhookSecret } from "@/lib/lemonsqueezy";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = getWebhookSecret();
  if (!secret) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

type WebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      status: string;
      variant_id: number;
      order_id: number;
      customer_id: number;
      product_name: string;
      variant_name: string;
      user_email: string;
      first_order_item?: {
        variant_id: number;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: WebhookEvent = JSON.parse(rawBody);
    const eventName = event.meta.event_name;
    const userId = event.meta.custom_data?.user_id;

    if (!userId) {
      console.warn("Webhook missing user_id in custom_data");
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    if (eventName === "order_created") {
      // One-time purchase (single report)
      const tier = "single";

      await supabase.from("user_subscriptions").upsert(
        {
          user_id: userId,
          tier,
          lemonsqueezy_order_id: String(event.data.id),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const status = event.data.attributes.status;
      const tier = status === "active" ? "pro" : "free";

      await supabase.from("user_subscriptions").upsert(
        {
          user_id: userId,
          tier,
          lemonsqueezy_subscription_id: String(event.data.id),
          lemonsqueezy_status: status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      await supabase
        .from("user_subscriptions")
        .update({
          tier: "free",
          lemonsqueezy_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
