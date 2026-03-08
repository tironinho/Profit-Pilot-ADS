import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Install on Shopify</h1>
        <p className="mt-3 text-neutral-300">
          Get ProfitPilot Ads running in your Shopify Admin in a few steps.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-800/50 bg-amber-950/20 p-6 text-sm">
        <p className="font-medium text-amber-200">Shopify App Store listing: coming soon.</p>
        <p className="mt-1 text-amber-200/90">
          Contact support for early access:{" "}
          <a href="mailto:support@profitpilotads.com" className="underline hover:text-amber-100">support@profitpilotads.com</a>
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8">
        <h2 className="font-semibold text-white">Steps</h2>
        <ol className="mt-6 space-y-6">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-300">1</span>
            <div>
              <span className="font-medium text-white">Start subscription</span>
              <p className="mt-1 text-sm text-neutral-400">
                Go to <Link href="/pricing" className="text-neutral-200 underline hover:text-white">Pricing</Link> and complete checkout. You need an active subscription to use the app.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-300">2</span>
            <div>
              <span className="font-medium text-white">Install the Shopify app</span>
              <p className="mt-1 text-sm text-neutral-400">
                Once the app is listed, you&apos;ll install it from the Shopify App Store. For now, use the contact below for early access.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-300">3</span>
            <div>
              <span className="font-medium text-white">Connect channels</span>
              <p className="mt-1 text-sm text-neutral-400">
                Inside the app, connect Meta, Google and/or TikTok. Preflight and Budget Shield will be available from your Shopify Admin.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 text-center">
        <p className="text-sm font-medium text-neutral-300">Open Shopify Admin App</p>
        <p className="mt-2 text-sm text-neutral-500">Coming soon. Request early access via support@profitpilotads.com</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/pricing"
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
        >
          Start subscription
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-200 hover:border-neutral-600 hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
