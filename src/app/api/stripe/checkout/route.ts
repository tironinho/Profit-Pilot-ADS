import { NextResponse } from "next/server";
import { getStripe, getStripePriceId } from "@/lib/stripe";
import { getAppUrlFromEnv } from "@/lib/urls";

export async function POST() {
  try {
    const stripe = getStripe();
    const priceId = getStripePriceId();
    const appUrl = getAppUrlFromEnv();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "checkout_error" }, { status: 400 });
  }
}
