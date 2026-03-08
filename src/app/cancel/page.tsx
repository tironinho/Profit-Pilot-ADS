import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/20 p-8">
      <h1 className="text-2xl font-semibold">Checkout canceled</h1>
      <p className="mt-2 text-neutral-200">
        No worries — you can start again whenever you’re ready.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/pricing" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
          Back to pricing
        </Link>
        <Link href="/" className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900">
          Home
        </Link>
      </div>
    </div>
  );
}
