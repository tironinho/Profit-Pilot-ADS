import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      {/* A) HERO */}
      <section className="mx-auto max-w-4xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded-full border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-neutral-300">
            Shopify App
          </span>
          <span className="rounded-full border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-neutral-300">
            Meta + Google + TikTok
          </span>
          <span className="rounded-full border border-neutral-700 bg-neutral-900/60 px-3 py-1 text-neutral-300">
            Budget Shield
          </span>
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          The Shopify Ads Copilot that stops budget waste — and boosts conversions.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">
          Connect Meta, Google and TikTok. ProfitPilot runs a preflight checklist, protects your budget with guardrails, and shows profit-first performance in one dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/install"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
          >
            Install on Shopify
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-neutral-700 px-5 py-3 text-sm font-semibold text-neutral-200 hover:border-neutral-600 hover:text-white"
          >
            See pricing
          </Link>
        </div>
        <p className="mt-6 text-sm text-neutral-400">
          Reduce waste, increase signal quality, scale what works.
        </p>
      </section>

      {/* B) BUILT FOR SHOPIFY */}
      <section className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          Built for Shopify
        </h2>
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8 text-center">
          <p className="text-lg font-medium text-neutral-100">
            Runs inside your Shopify Admin
          </p>
          <ul className="mt-6 space-y-4 text-left sm:mx-auto sm:max-w-md">
            <li className="flex gap-3 text-neutral-300">
              <span className="text-neutral-500">▸</span>
              Reads paid orders + revenue to compute MER
            </li>
            <li className="flex gap-3 text-neutral-300">
              <span className="text-neutral-500">▸</span>
              Detects tracking gaps before you scale
            </li>
            <li className="flex gap-3 text-neutral-300">
              <span className="text-neutral-500">▸</span>
              Stops spend when purchases stall
            </li>
          </ul>
        </div>
      </section>

      {/* C) HOW IT WORKS */}
      <section className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-2xl font-bold text-neutral-500">1</div>
            <h3 className="mt-2 font-semibold text-white">Connect channels</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Link Meta, Google and TikTok. One place to manage all paid channels.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-2xl font-bold text-neutral-500">2</div>
            <h3 className="mt-2 font-semibold text-white">Preflight</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Tracking sanity, store speed, spend vs purchase signals — before you scale.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-2xl font-bold text-neutral-500">3</div>
            <h3 className="mt-2 font-semibold text-white">Budget Shield + Profit Dashboard</h3>
            <p className="mt-2 text-sm text-neutral-400">
              MER, spend, conversions in one view. Alerts and optional auto-pause to prevent burn.
            </p>
          </div>
        </div>
      </section>

      {/* D) FEATURES */}
      <section className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          Features
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-lg">✓</div>
            <h3 className="mt-2 font-semibold text-white">Preflight Checklist</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Tracking sanity, store speed, spend vs purchase signals.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-lg">🛡</div>
            <h3 className="mt-2 font-semibold text-white">Budget Shield</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Alerts + optional auto-pause to prevent burn.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-lg">◉</div>
            <h3 className="mt-2 font-semibold text-white">Profit Dashboard</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Revenue + spend + MER (profit-first, not vanity ROAS).
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-lg">◐</div>
            <h3 className="mt-2 font-semibold text-white">Creative fatigue hints</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Signals when CTR drops and CPM rises.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="text-lg">⊞</div>
            <h3 className="mt-2 font-semibold text-white">Multi-channel view</h3>
            <p className="mt-2 text-sm text-neutral-400">
              One dashboard across Meta, Google and TikTok.
            </p>
          </div>
        </div>
      </section>

      {/* E) WHY IT WINS */}
      <section className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          Why it wins
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-800">
          <div className="grid grid-cols-2 border-b border-neutral-800 bg-neutral-900/50 px-6 py-4 text-sm font-medium">
            <div className="text-neutral-400">Typical Ads setup</div>
            <div className="text-white">ProfitPilot Ads</div>
          </div>
          <div className="grid grid-cols-2 border-b border-neutral-800 px-6 py-4 text-sm">
            <div className="text-neutral-400">Spend without guardrails</div>
            <div className="text-neutral-200">Circuit breakers</div>
          </div>
          <div className="grid grid-cols-2 border-b border-neutral-800 px-6 py-4 text-sm">
            <div className="text-neutral-400">ROAS noise</div>
            <div className="text-neutral-200">Profit-first MER</div>
          </div>
          <div className="grid grid-cols-2 px-6 py-4 text-sm">
            <div className="text-neutral-400">Manual checks</div>
            <div className="text-neutral-200">Automated preflight</div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-neutral-500">
          We help reduce waste, improve signal quality and scale what works — without promising impossible results.
        </p>
      </section>

      {/* F) FAQ */}
      <section className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
          FAQ
        </h2>
        <dl className="mt-10 space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
            <dt className="font-medium text-white">Does this run inside Shopify?</dt>
            <dd className="mt-2 text-sm text-neutral-400">
              Yes. ProfitPilot Ads is a Shopify app that runs inside your Shopify Admin. No separate dashboard to juggle.
            </dd>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
            <dt className="font-medium text-white">Do I need an agency?</dt>
            <dd className="mt-2 text-sm text-neutral-400">
              No. The app is built for merchants who want to run ads with guardrails and profit-first metrics without hiring an agency.
            </dd>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
            <dt className="font-medium text-white">Can I connect only one channel?</dt>
            <dd className="mt-2 text-sm text-neutral-400">
              Yes. You can connect Meta, Google or TikTok individually or combine them. You’re not forced to use all three.
            </dd>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
            <dt className="font-medium text-white">Does it auto-pause campaigns?</dt>
            <dd className="mt-2 text-sm text-neutral-400">
              Budget Shield can alert you when spend rises without purchases. Optional auto-pause helps prevent burn — you control the settings.
            </dd>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
            <dt className="font-medium text-white">How do you measure performance?</dt>
            <dd className="mt-2 text-sm text-neutral-400">
              We use orders and spend from your connected channels and Shopify to compute MER (Merchant Earnings Ratio). Profit-first, not vanity ROAS.
            </dd>
          </div>
        </dl>
      </section>

      {/* G) FINAL CTA */}
      <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/30 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Install ProfitPilot Ads on Shopify
        </h2>
        <p className="mt-4 text-neutral-400">
          Connect Meta, Google and TikTok. Get preflight checks and Budget Shield in one place.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/install"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
          >
            Install on Shopify
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-neutral-700 px-5 py-3 text-sm font-semibold text-neutral-200 hover:border-neutral-600 hover:text-white"
          >
            See pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
