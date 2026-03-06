import { cookies } from "next/headers";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";

type Props = { searchParams: { session_id?: string } };

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;
  if (!sessionId) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/20 p-8">
        <h1 className="text-2xl font-semibold">Missing session_id</h1>
        <p className="mt-2 text-neutral-200">Please return to pricing and try again.</p>
        <div className="mt-6">
          <Link href="/pricing" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            Back to pricing
          </Link>
        </div>
      </div>
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["customer"] });

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (customerId) {
    cookies().set("pp_customer", customerId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/20 p-8">
      <h1 className="text-2xl font-semibold">Subscription started</h1>
      <p className="mt-2 text-neutral-200">
        You’re in. Your account is now linked to Stripe customer <span className="font-mono text-neutral-100">{customerId ?? "unknown"}</span>.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <form action="/api/stripe/portal" method="POST">
          <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            Manage subscription
          </button>
        </form>

        <Link href="/dashboard" className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900">
          Go to dashboard
        </Link>
      </div>

      <div className="mt-5 text-xs text-neutral-400">
        If the portal button fails, open /dashboard and try again.
      </div>
    </div>
  );
}
