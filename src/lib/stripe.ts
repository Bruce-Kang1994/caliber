import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export function getPriceId(plan: "single" | "pro"): string | undefined {
  return plan === "single"
    ? process.env.STRIPE_PRICE_SINGLE
    : process.env.STRIPE_PRICE_PRO;
}
