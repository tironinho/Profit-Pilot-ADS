import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold tracking-tight">
            ProfitPilot Ads
          </Link>
          <span className="rounded border border-neutral-700 bg-neutral-800/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
            Shopify App
          </span>
        </div>

        <nav className="flex items-center gap-4 text-sm text-neutral-200">
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link
            href="/install"
            className="rounded-md bg-white px-3 py-1.5 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Install on Shopify
          </Link>
        </nav>
      </div>
    </header>
  );
}
