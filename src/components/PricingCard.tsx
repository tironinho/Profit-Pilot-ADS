"use client";

import { useState } from "react";

async function postJson(url: string, body?: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {})
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export function PricingCard() {
  const [loading, setLoading] = useState(false);
  const price = "$49.90";
  const period = "/month";

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
      <div className="text-sm text-neutral-300">Pro Plan</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-4xl font-semibold">{price}</div>
        <div className="pb-1 text-neutral-300">{period}</div>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-neutral-200">
        <li>• Connect Meta + Google + TikTok</li>
        <li>• Preflight checks (tracking, spend vs conversions)</li>
        <li>• Budget Shield alerts (anti-burn)</li>
        <li>• Profit-first dashboard (MER & revenue)</li>
        <li>• Email support</li>
      </ul>

      <button
        disabled={loading}
        onClick={async () => {
          try {
            setLoading(true);
            const { url } = await postJson("/api/stripe/checkout");
            window.location.href = url;
          } catch (e: any) {
            alert(e?.message ?? "Checkout failed");
          } finally {
            setLoading(false);
          }
        }}
        className="mt-6 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Start subscription"}
      </button>

      <div className="mt-3 text-xs text-neutral-400">
        Uses Stripe Checkout. Cancel anytime.
      </div>
    </div>
  );
}
