import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  return {
    shopId: shop.id,
    currency: shop.currency ?? "BRL",
    timezone: shop.timezone ?? "America/Sao_Paulo",
    marginRate: shop.marginRate ?? 0.35,
    targetCPA: shop.targetCPA,
    minROAS: shop.minROAS,
    targetMER: shop.targetMER,
    dailyRiskCap: shop.dailyRiskCap,
    autopilotEnabled: shop.autopilotEnabled ?? false,
  };
};

export const action = async ({ request }) => {
  if (request.method !== "POST") return { ok: false };
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const form = await request.formData();

  const currency = form.get("currency") || undefined;
  const timezone = form.get("timezone") || undefined;
  const marginRate = form.get("marginRate") !== "" ? parseFloat(form.get("marginRate")) : undefined;
  const targetCPA = form.get("targetCPA") !== "" ? parseFloat(form.get("targetCPA")) : undefined;
  const minROAS = form.get("minROAS") !== "" ? parseFloat(form.get("minROAS")) : undefined;
  const targetMER = form.get("targetMER") !== "" ? parseFloat(form.get("targetMER")) : undefined;
  const dailyRiskCap = form.get("dailyRiskCap") !== "" ? parseFloat(form.get("dailyRiskCap")) : undefined;
  const autopilotEnabled = form.get("autopilotEnabled") === "on";

  await prisma.shop.update({
    where: { id: shop.id },
    data: {
      currency: currency ?? null,
      timezone: timezone ?? null,
      marginRate: marginRate ?? null,
      targetCPA: targetCPA ?? null,
      minROAS: minROAS ?? null,
      targetMER: targetMER ?? null,
      dailyRiskCap: dailyRiskCap ?? null,
      autopilotEnabled,
    },
  });

  return { ok: true };
};

export default function Settings() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  return (
    <s-page heading="Settings">
      <s-section heading="Metas &amp; margins">
        <s-paragraph>
          Set targets and average margin for profit estimates. Autopilot is off by default; enable only when you understand the safe actions.
        </s-paragraph>
        <fetcher.Form method="post">
          <s-stack direction="block" gap="base">
            <s-stack direction="inline" gap="base">
              <label>Currency</label>
              <input type="text" name="currency" defaultValue={data.currency} placeholder="BRL" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Timezone</label>
              <input type="text" name="timezone" defaultValue={data.timezone} placeholder="America/Sao_Paulo" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Average margin (0–1, e.g. 0.35)</label>
              <input
                type="number"
                name="marginRate"
                defaultValue={data.marginRate}
                step="0.01"
                min="0"
                max="1"
              />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Target CPA (optional)</label>
              <input type="number" name="targetCPA" defaultValue={data.targetCPA ?? ""} step="0.01" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Min ROAS (optional)</label>
              <input type="number" name="minROAS" defaultValue={data.minROAS ?? ""} step="0.01" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Target MER (optional)</label>
              <input type="number" name="targetMER" defaultValue={data.targetMER ?? ""} step="0.01" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>Daily risk cap (currency)</label>
              <input type="number" name="dailyRiskCap" defaultValue={data.dailyRiskCap ?? ""} step="0.01" />
            </s-stack>
            <s-stack direction="inline" gap="base">
              <label>
                <input
                  type="checkbox"
                  name="autopilotEnabled"
                  defaultChecked={data.autopilotEnabled}
                  value="on"
                />
                Autopilot (auto-pause / safe actions on critical alerts)
              </label>
            </s-stack>
            <s-button type="submit" variant="primary">Save settings</s-button>
          </s-stack>
        </fetcher.Form>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
