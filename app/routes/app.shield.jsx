import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { getShieldRules, getOpenAlerts, evaluateShield, saveShieldRules } from "../services/shield.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const [rules, alerts] = await Promise.all([
    getShieldRules(shop.id),
    getOpenAlerts(shop.id, 30),
  ]);
  return { shopId: shop.id, rules, alerts };
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "evaluate") {
    const result = await evaluateShield({ shopId: shop.id, admin });
    return Response.redirect(new URL("/app/shield", request.url).toString(), 302);
  }

  if (intent === "save_rules") {
    const maxSpendNoPurchase = form.get("maxSpendNoPurchase");
    const dailyRiskCap = form.get("dailyRiskCap");
    const targetCPA = form.get("targetCPA");
    const minROAS = form.get("minROAS");
    const ruleId = form.get("ruleId");
    await saveShieldRules(shop.id, [{
      id: ruleId || undefined,
      enabled: true,
      windowHours: 24,
      maxSpendNoPurchase: maxSpendNoPurchase ? parseFloat(maxSpendNoPurchase) : undefined,
      dailyRiskCap: dailyRiskCap ? parseFloat(dailyRiskCap) : undefined,
      targetCPA: targetCPA ? parseFloat(targetCPA) : undefined,
      minROAS: minROAS ? parseFloat(minROAS) : undefined,
    }]);
    return { ok: true };
  }

  return { ok: false };
};

export default function Shield() {
  const { rules, alerts } = useLoaderData();
  const fetcher = useFetcher();
  const defaultRule = rules?.[0];

  return (
    <s-page heading="Budget Shield">
      <s-section heading="Rules">
        <s-paragraph>
          Configure guardrails to avoid burning budget. When a rule is violated, an alert is created. With Autopilot ON (in Settings), critical alerts can trigger safe actions (e.g. pause).
        </s-paragraph>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="save_rules" />
          {defaultRule && <input type="hidden" name="ruleId" value={defaultRule.id} />}
          <s-stack direction="block" gap="base">
            <s-stack direction="inline" gap="base">
              <label>Max spend without purchase (currency)</label>
              <input
                type="number"
                name="maxSpendNoPurchase"
                defaultValue={defaultRule?.maxSpendNoPurchase ?? 500}
                step="0.01"
              />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Daily risk cap</label>
              <input
                type="number"
                name="dailyRiskCap"
                defaultValue={defaultRule?.dailyRiskCap ?? 1000}
                step="0.01"
              />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Target CPA (optional)</label>
              <input
                type="number"
                name="targetCPA"
                defaultValue={defaultRule?.targetCPA ?? ""}
                step="0.01"
                placeholder="e.g. 50"
              />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Min ROAS (optional)</label>
              <input
                type="number"
                name="minROAS"
                defaultValue={defaultRule?.minROAS ?? ""}
                step="0.01"
                placeholder="e.g. 2"
              />
            </s-stack>
            <s-button type="submit" variant="primary">Save rules</s-button>
          </s-stack>
        </fetcher.Form>
      </s-section>

      <s-section heading="Evaluate now">
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="evaluate" />
          <s-button type="submit" variant="primary" loading={fetcher.state !== "idle"}>
            Evaluate Shield now
          </s-button>
        </fetcher.Form>
        {fetcher.data?.alertsCount != null && (
          <s-text>Created {fetcher.data.alertsCount} alert(s).</s-text>
        )}
      </s-section>

      <s-section heading="Alerts">
        <s-stack direction="block" gap="base">
          {alerts?.length === 0 && (
            <s-paragraph>No open alerts.</s-paragraph>
          )}
          {alerts?.map((a) => (
            <s-box key={a.id} padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-stack direction="inline" gap="base">
                <s-badge tone={a.severity === "critical" ? "critical" : a.severity === "warn" ? "warning" : "info"}>
                  {a.severity}
                </s-badge>
                <s-text fontWeight="bold">{a.title}</s-text>
                {a.provider && <s-text>{a.provider}</s-text>}
              </s-stack>
              <s-text>{a.message}</s-text>
              <s-text>{new Date(a.createdAt).toLocaleString()}</s-text>
            </s-box>
          ))}
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
