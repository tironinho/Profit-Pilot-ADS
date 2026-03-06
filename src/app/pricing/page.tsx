import { PricingCard } from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-3 text-neutral-200">
        One simple plan for Shopify stores that want predictable acquisition without budget waste.
      </p>

      <div className="mt-8">
        <PricingCard />
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 text-sm text-neutral-200">
        <div className="font-medium">Need a custom plan?</div>
        <div className="mt-1 text-neutral-300">
          Contact us for enterprise features (SLA, multi-store, custom integrations).
        </div>
      </div>
    </div>
  );
}
