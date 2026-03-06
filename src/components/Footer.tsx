import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-semibold text-neutral-100">ProfitPilot Ads</div>
            <p className="mt-2 text-sm text-neutral-400">
              Built for Shopify merchants. Secure token storage (encrypted at rest).
            </p>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="text-neutral-400 hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link href="/install" className="text-neutral-400 hover:text-white">Install</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Legal & support</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white">Privacy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-white">Terms</Link>
              </li>
              <li>
                <Link href="/data-deletion" className="text-neutral-400 hover:text-white">Data Deletion</Link>
              </li>
              <li>
                <Link href="/security" className="text-neutral-400 hover:text-white">Security</Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Support</div>
            <p className="mt-3 text-sm text-neutral-400">
              Support: <a href="mailto:support@profitpilotads.com" className="hover:text-white">
                support@profitpilotads.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-800 pt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} ProfitPilot Ads. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
