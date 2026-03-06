import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";

export default function HomePage() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/40 px-3 py-1 text-xs text-neutral-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Ads autopilot for Shopify
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Stop burning ad budget in the dark.
        </h1>

        <p className="mt-4 max-w-prose text-neutral-200">
          ProfitPilot Ads connects Meta, Google and TikTok to your Shopify store, runs a preflight checklist,
          and flags waste before it drains your cash.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
          >
            See pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900"
          >
            Go to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-neutral-200">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
            <div className="font-medium">Preflight</div>
            <div className="text-neutral-300">Checks tracking + basic spend/conversion signals before scaling.</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
            <div className="font-medium">Budget Shield</div>
            <div className="text-neutral-300">Alerts when spend rises without purchases, high CPA, or tracking suspicion.</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
            <div className="font-medium">Profit dashboard</div>
            <div className="text-neutral-300">Revenue + spend + MER in one place (profit-first, not vanity ROAS).</div>
          </div>
        </div>
      </section>

      <aside className="md:sticky md:top-8">
        <PricingCard />
      </aside>
    </div>
  );
}
