import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          ProfitPilot Ads
        </Link>

        <nav className="flex items-center gap-4 text-sm text-neutral-200">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link
            href="/pricing"
            className="rounded-md bg-white px-3 py-1.5 font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
