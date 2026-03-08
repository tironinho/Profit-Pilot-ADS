import { useLoaderData, Form } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { getPaidOrdersMetrics } from "../services/shopifyMetrics.server";
import { fetchAllSpendAndConversions } from "../services/providers/providerRegistry.server";
import { getOpenAlerts } from "../services/shield.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });

  const since7 = new Date();
  since7.setDate(since7.getDate() - 7);
  const since30 = new Date();
  since30.setDate(since30.getDate() - 30);
  const until = new Date();

  let revenue7 = 0,
    revenue30 = 0,
    orders7 = 0,
    orders30 = 0;
  try {
    const m7 = await getPaidOrdersMetrics(admin, { sinceDays: 7 });
    const m30 = await getPaidOrdersMetrics(admin, { sinceDays: 30 });
    revenue7 = m7.revenue;
    revenue30 = m30.revenue;
    orders7 = m7.orders;
    orders30 = m30.orders;
  } catch (e) {
    console.error("Shopify metrics error:", e);
  }

  const spend7 = await fetchAllSpendAndConversions(shop.id, { since: since7, until });
  const spend30 = await fetchAllSpendAndConversions(shop.id, { since: since30, until });

  const totalSpend7 =
    (spend7.META?.spend ?? 0) + (spend7.GOOGLE?.spend ?? 0) + (spend7.TIKTOK?.spend ?? 0);
  const totalSpend30 =
    (spend30.META?.spend ?? 0) + (spend30.GOOGLE?.spend ?? 0) + (spend30.TIKTOK?.spend ?? 0);

  const marginRate = shop.marginRate ?? 0.35;
  const profit7 = revenue7 * (1 - marginRate) - totalSpend7;
  const profit30 = revenue30 * (1 - marginRate) - totalSpend30;

  const mer7 = totalSpend7 > 0 ? revenue7 / totalSpend7 : 0;
  const mer30 = totalSpend30 > 0 ? revenue30 / totalSpend30 : 0;

  const alerts = await getOpenAlerts(shop.id, 30);

  return {
    shopId: shop.id,
    currency: shop.currency || "BRL",
    marginRate,
    revenue7,
    revenue30,
    orders7,
    orders30,
    totalSpend7,
    totalSpend30,
    profit7,
    profit30,
    mer7,
    mer30,
    byChannel7: spend7,
    byChannel30: spend30,
    alerts,
  };
};

export default function Dashboard() {
  const data = useLoaderData();

  return (
    <s-page heading="Profit Dashboard">
      <s-stack slot="primary-action" direction="inline" gap="base">
        <Form method="post" action="/app/preflight">
          <s-button type="submit" variant="primary">Run Preflight</s-button>
        </Form>
        <Form method="post" action="/app/shield">
          <s-button type="submit" variant="primary">Run Shield</s-button>
        </Form>
      </s-stack>

      {data.alerts?.length > 0 && (
        <s-section heading="Alerts">
          <s-stack direction="block" gap="base">
            {data.alerts.slice(0, 5).map((a) => (
              <s-badge key={a.id} tone={a.severity === "critical" ? "critical" : a.severity === "warn" ? "warning" : "info"}>
                {a.title}: {a.message}
              </s-badge>
            ))}
            <s-link href="/app/shield">View all in Budget Shield</s-link>
          </s-stack>
        </s-section>
      )}

      <s-section heading="KPIs (7d / 30d)">
        <s-stack direction="block" gap="base">
          <s-stack direction="inline" gap="base">
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text fontWeight="bold">Revenue</s-text>
              <s-text>
                {data.currency} {data.revenue7?.toFixed(2) ?? "0"} / {data.revenue30?.toFixed(2) ?? "0"}
              </s-text>
            </s-box>
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text fontWeight="bold">Orders</s-text>
              <s-text>
                {data.orders7 ?? 0} / {data.orders30 ?? 0}
              </s-text>
            </s-box>
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text fontWeight="bold">Spend</s-text>
              <s-text>
                {data.currency} {data.totalSpend7?.toFixed(2) ?? "0"} / {data.totalSpend30?.toFixed(2) ?? "0"}
              </s-text>
            </s-box>
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text fontWeight="bold">MER</s-text>
              <s-text>
                {data.mer7?.toFixed(2) ?? "—"} / {data.mer30?.toFixed(2) ?? "—"}
              </s-text>
            </s-box>
            <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text fontWeight="bold">Profit est.</s-text>
              <s-text>
                {data.currency} {data.profit7?.toFixed(2) ?? "0"} / {data.profit30?.toFixed(2) ?? "0"}
              </s-text>
            </s-box>
          </s-stack>
        </s-stack>
      </s-section>

      <s-section heading="By channel (7d)">
        <s-stack direction="block" gap="base">
          {["META", "GOOGLE", "TIKTOK"].map((ch) => {
            const d = data.byChannel7?.[ch];
            const spend = d?.spend ?? 0;
            const purchases = d?.purchases ?? 0;
            if (spend === 0 && purchases === 0) return null;
            return (
              <s-box key={ch} padding="base" borderWidth="base" borderRadius="base" background="subdued">
                <s-text fontWeight="bold">{ch}</s-text>
                <s-text>Spend: {data.currency} {spend.toFixed(2)}</s-text>
                {purchases != null && <s-text>Purchases: {purchases}</s-text>}
                {data.alerts?.some((a) => a.provider === ch) && (
                  <s-badge tone="warning">Alerts</s-badge>
                )}
              </s-box>
            );
          })}
          {!data.byChannel7?.META && !data.byChannel7?.GOOGLE && !data.byChannel7?.TIKTOK && (
            <s-paragraph>
              <s-link href="/app/connect">Connect channels</s-link> to see spend by channel.
            </s-paragraph>
          )}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Quick actions">
        <s-stack direction="block" gap="base">
          <s-link href="/app/preflight">Run Preflight</s-link>
          <s-link href="/app/shield">Run Budget Shield</s-link>
          <s-link href="/app/connect">Connect channels</s-link>
          <s-link href="/app/settings">Settings</s-link>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
