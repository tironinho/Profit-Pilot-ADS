import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { getAppUrlFromEnv } from "@/lib/urls";

export async function POST() {
  try {
    const customerId = cookies().get("pp_customer")?.value;
    if (!customerId) {
      return NextResponse.redirect(new URL("/pricing", getAppUrlFromEnv()));
    }

    const stripe = getStripe();
    const appUrl = getAppUrlFromEnv();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard`
    });

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "portal_error" }, { status: 400 });
  }
}
