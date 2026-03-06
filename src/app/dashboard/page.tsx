import Link from "next/link";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";

export default async function DashboardPage() {
  const customerId = cookies().get("pp_customer")?.value;

  if (!customerId) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/20 p-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-neutral-200">
          No customer session found yet. Start a subscription first.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/pricing" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            Go to pricing
          </Link>
          <Link href="/" className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900">
            Home
          </Link>
        </div>
      </div>
    );
  }

  const stripe = getStripe();
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10
  });

  const active = subs.data.find((s) => ["active", "trialing", "past_due"].includes(s.status));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-neutral-200">
          Customer: <span className="font-mono text-neutral-100">{customerId}</span>
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-5">
            <div className="text-sm text-neutral-400">Subscription status</div>
            <div className="mt-1 text-lg font-semibold">
              {active ? active.status : "none"}
            </div>
            <div className="mt-2 text-sm text-neutral-300">
              {active ? `Current period ends: ${new Date(active.current_period_end * 1000).toLocaleString()}` : "Subscribe to unlock the app."}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-5">
            <div className="text-sm text-neutral-400">Next steps</div>
            <ul className="mt-2 space-y-1 text-sm text-neutral-300">
              <li>• Connect ad channels</li>
              <li>• Run Preflight</li>
              <li>• Enable Budget Shield</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action="/api/stripe/portal" method="POST">
            <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
              Open billing portal
            </button>
          </form>
          <Link href="/pricing" className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900">
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
