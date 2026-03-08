import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { runPreflight, listPreflightRuns } from "../services/preflight.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const runs = await listPreflightRuns(shop.id, 10);
  return { shopId: shop.id, runs };
};

export const action = async ({ request }) => {
  if (request.method !== "POST") return { ok: false };
  const { admin, session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  await runPreflight({ shopId: shop.id, admin });
  return Response.redirect(new URL("/app/preflight", request.url).toString(), 302);
};

export default function Preflight() {
  const { runs } = useLoaderData();
  const fetcher = useFetcher();
  const latestRun = runs?.[0];

  return (
    <s-page heading="Preflight">
      <s-section heading="Run diagnostic">
        <s-paragraph>
          Run Preflight to check connections, Shopify orders, ad performance, and storefront health.
        </s-paragraph>
        <fetcher.Form method="post">
          <s-button
            type="submit"
            variant="primary"
            loading={fetcher.state !== "idle"}
          >
            Run Preflight now
          </s-button>
        </fetcher.Form>
      </s-section>

      {latestRun && (
        <s-section heading="Latest run result">
          <s-stack direction="block" gap="base">
            {(latestRun.checks || []).map((c) => (
              <s-box key={c.key || c.id} padding="base" borderWidth="base" borderRadius="base" background="subdued">
                <s-stack direction="inline" gap="base">
                  <s-badge tone={c.status === "PASS" ? "success" : c.status === "WARN" ? "warning" : "critical"}>
                    {c.status}
                  </s-badge>
                  <s-text fontWeight="bold">{c.title}</s-text>
                </s-stack>
                <s-text>{c.message}</s-text>
              </s-box>
            ))}
          </s-stack>
        </s-section>
      )}

      <s-section heading="Previous runs">
        <s-stack direction="block" gap="base">
          {runs?.length === 0 && (
            <s-paragraph>No runs yet. Click &quot;Run Preflight now&quot; above.</s-paragraph>
          )}
          {runs?.map((run) => (
            <s-box key={run.id} padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-text>{new Date(run.createdAt).toLocaleString()}</s-text>
              {run.summary && (
                <s-text>
                  Pass: {typeof run.summary === "string" ? JSON.parse(run.summary).pass : run.summary.pass},
                  Warn: {typeof run.summary === "string" ? JSON.parse(run.summary).warn : run.summary.warn},
                  Fail: {typeof run.summary === "string" ? JSON.parse(run.summary).fail : run.summary.fail}
                </s-text>
              )}
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
