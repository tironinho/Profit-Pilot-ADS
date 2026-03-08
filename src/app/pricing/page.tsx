import type { Metadata } from "next";
import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — ProfitPilot Ads",
  description: "One simple plan for Shopify stores. Connect Meta, Google and TikTok. Preflight, Budget Shield, profit-first dashboard.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-white">Pricing</h1>
      <p className="mt-3 text-neutral-200">
        One simple plan for Shopify stores that want predictable acquisition without budget waste.
      </p>

      <div className="mt-8">
        <PricingCard />
      </div>

      <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="font-semibold text-white">What&apos;s included</h2>
        <ul className="mt-4 space-y-2 text-sm text-neutral-300">
          <li>• Connect Meta + Google + TikTok in one place</li>
          <li>• Preflight checks (tracking, spend vs conversions)</li>
          <li>• Budget Shield alerts and optional auto-pause</li>
          <li>• Profit-first dashboard (MER, revenue, spend)</li>
          <li>• Creative fatigue signals (CTR/CPM hints)</li>
          <li>• Email support</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="font-semibold text-white">Who it&apos;s for</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Shopify stores spending $3k+/month on ads or scaling. Merchants who want guardrails without an agency.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="font-semibold text-white">Outcomes</h2>
        <ul className="mt-4 space-y-2 text-sm text-neutral-300">
          <li>• Less wasted spend (circuit breakers, preflight)</li>
          <li>• Faster detection of tracking and performance issues</li>
          <li>• Clearer MER and profit-first metrics</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="font-semibold text-white">FAQ</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-neutral-200">Cancel anytime?</dt>
            <dd className="mt-1 text-neutral-400">Yes. No long-term commitment.</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-200">How do I pay?</dt>
            <dd className="mt-1 text-neutral-400">Stripe Checkout. Secure and simple.</dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/install"
          className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
        >
          Install on Shopify
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-200 hover:border-neutral-600 hover:text-white"
        >
          Back to home
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 text-sm text-neutral-400">
        <div className="font-medium text-neutral-300">Need a custom plan?</div>
        <div className="mt-1">
          Contact us for enterprise features (SLA, multi-store, custom integrations).{" "}
          <a href="mailto:support@profitpilotads.com" className="text-neutral-200 hover:text-white">support@profitpilotads.com</a>
        </div>
      </div>
    </div>
  );
}
