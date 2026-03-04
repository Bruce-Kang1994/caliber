// LemonSqueezy API integration
// Docs: https://docs.lemonsqueezy.com/api

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

// Product variant IDs — set these in your .env.local
// after creating products in LemonSqueezy dashboard
const VARIANT_SINGLE_REPORT = process.env.LEMONSQUEEZY_VARIANT_SINGLE;
const VARIANT_PRO = process.env.LEMONSQUEEZY_VARIANT_PRO;

export function getVariantId(plan: "single" | "pro"): string | undefined {
  return plan === "single" ? VARIANT_SINGLE_REPORT : VARIANT_PRO;
}

export function getWebhookSecret(): string | undefined {
  return LEMONSQUEEZY_WEBHOOK_SECRET;
}

export async function createCheckout(options: {
  variantId: string;
  email?: string;
  userId?: string;
  redirectUrl?: string;
}) {
  if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID) {
    throw new Error("LemonSqueezy not configured");
  }

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          embed: false,
          media: false,
          button_color: "#4338ca",
        },
        checkout_data: {
          email: options.email,
          custom: {
            user_id: options.userId || "",
          },
        },
        product_options: {
          redirect_url: options.redirectUrl || "",
        },
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: LEMONSQUEEZY_STORE_ID,
          },
        },
        variant: {
          data: {
            type: "variants",
            id: options.variantId,
          },
        },
      },
    },
  };

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`LemonSqueezy checkout failed: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.data.attributes.url as string;
}
