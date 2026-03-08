import { useLoaderData, useFetcher, Link, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { getConnectionsStatus } from "../services/providers/providerRegistry.server";
import prisma from "../db.server";
import * as Meta from "../services/providers/meta.server";
import * as Google from "../services/providers/google.server";
import * as TikTok from "../services/providers/tiktok.server";

const OAUTH_PATHS = {
  META: "/app/oauth/meta",
  GOOGLE: "/app/oauth/google",
  GOOGLE_START: "/app/oauth/google/start",
  TIKTOK: "/app/oauth/tiktok",
};

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const connections = await getConnectionsStatus(shop.id);
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const errorProvider = url.searchParams.get("provider");
  const connected = url.searchParams.get("connected");
  return {
    shopId: shop.id,
    shopDomain: session.shop,
    connections,
    error: error === "provider" ? errorProvider || true : error === "encryption" ? "encryption" : null,
    connected: connected || null,
  };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "select_account") {
    const provider = form.get("provider");
    const accountId = form.get("accountId");
    if (!provider || !accountId) return { ok: false };
    if (provider === "META") {
      await Meta.saveSelectedAccount(shop.id, accountId);
    } else if (provider === "GOOGLE") {
      await Google.saveSelectedAccount(shop.id, accountId, form.get("accountName") || undefined);
    } else if (provider === "TIKTOK") {
      await TikTok.saveSelectedAccount(shop.id, accountId, form.get("accountName") || undefined);
    }
    return { ok: true };
  }

  if (intent === "disconnect_provider" || intent === "disconnect") {
    const provider = form.get("provider");
    if (provider !== "META" && provider !== "GOOGLE" && provider !== "TIKTOK") return { ok: false };
    await prisma.providerAccount.deleteMany({ where: { shopId: shop.id, provider } });
    await prisma.providerConnection.updateMany({
      where: { shopId: shop.id, provider },
      data: { accessTokenEnc: null, refreshTokenEnc: null, status: "DISCONNECTED" },
    });
    return { ok: true };
  }

  return { ok: false };
};

function StatusBadge({ c }) {
  if (!c.encryptionEnabled) {
    return <s-badge tone="critical">Unavailable (missing APP_ENCRYPTION_KEY)</s-badge>;
  }
  if (!c.available) {
    return <s-badge tone="default">Unavailable</s-badge>;
  }
  if (c.connected) {
    return <s-badge tone="success">Connected</s-badge>;
  }
  return <s-badge tone="attention">Not connected</s-badge>;
}

export default function Connect() {
  const { connections, error, connected } = useLoaderData();
  const fetcher = useFetcher();
  const location = useLocation();
  const qs = location.search || "";

  async function handleConnectGoogle(e) {
    e.preventDefault();
    const returnTo = `/app/connect${qs}`;
    try {
      const res = await fetch(OAUTH_PATHS.GOOGLE_START, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnTo }),
      });
      const data = await res.json();
      if (data.redirect) {
        window.open(data.redirect, "_top");
        return;
      }
      if (!data.authUrl) {
        window.open(`/app/connect?error=provider&provider=GOOGLE`, "_top");
        return;
      }
      window.open(data.authUrl, "_top");
    } catch {
      window.open(`/app/connect?error=provider&provider=GOOGLE`, "_top");
    }
  }

  return (
    <s-page heading="Connect Channels">
      {error === "encryption" && (
        <s-banner tone="critical">
          Connect is unavailable: set APP_ENCRYPTION_KEY in .env (base64 32 bytes).
        </s-banner>
      )}
      {error && error !== "encryption" && (
        <s-banner tone="critical">
          Connection error for {error === true ? "provider" : error}. Check redirect URL (SHOPIFY_APP_URL) and .env credentials.
        </s-banner>
      )}
      {connected && (
        <s-banner tone="success">
          {connected} connected successfully.
        </s-banner>
      )}
      <s-section heading="Ad channels">
        <s-stack direction="block" gap="large">
          {connections?.map((c) => (
            <s-box key={c.provider} padding="base" borderWidth="base" borderRadius="base" background="subdued">
              <s-stack direction="block" gap="base">
                <s-stack direction="inline" gap="base">
                  <s-text fontWeight="bold">{c.provider}</s-text>
                  <StatusBadge c={c} />
                </s-stack>
                {c.available && !c.connected && (
                  c.provider === "GOOGLE" ? (
                    <s-button variant="primary" onClick={handleConnectGoogle}>
                      + connect {c.provider}
                    </s-button>
                  ) : (
                    <Link to={`${OAUTH_PATHS[c.provider]}${qs}`}>
                      <s-button variant="primary">+ connect {c.provider}</s-button>
                    </Link>
                  )
                )}
                {c.connected && (
                  <>
                    <s-stack direction="inline" gap="base">
                      {c.provider === "GOOGLE" ? (
                        <s-button variant="secondary" size="slim" onClick={handleConnectGoogle}>
                          Reconnect
                        </s-button>
                      ) : (
                        <Link to={`${OAUTH_PATHS[c.provider]}${qs}`}>
                          <s-button variant="secondary" size="slim">Reconnect</s-button>
                        </Link>
                      )}
                      <fetcher.Form method="post" style={{ display: "inline" }}>
                        <input type="hidden" name="intent" value="disconnect_provider" />
                        <input type="hidden" name="provider" value={c.provider} />
                        <s-button type="submit" variant="plain" size="slim" tone="critical">Disconnect</s-button>
                      </fetcher.Form>
                    </s-stack>
                    {c.accounts?.length > 0 && (
                      <s-stack direction="block" gap="base">
                        <s-text>Select ad account:</s-text>
                        {c.accounts.map((acc) => (
                          <fetcher.Form key={acc.id} method="post">
                            <input type="hidden" name="intent" value="select_account" />
                            <input type="hidden" name="provider" value={c.provider} />
                            <input type="hidden" name="accountId" value={acc.id} />
                            <input type="hidden" name="accountName" value={acc.name || ""} />
                            <s-button type="submit" variant="secondary" size="slim">
                              Select: {acc.name || acc.id}
                            </s-button>
                          </fetcher.Form>
                        ))}
                      </s-stack>
                    )}
                    {c.connected && (!c.accounts || c.accounts.length === 0) && c.provider === "META" && (
                      <s-text>No ad accounts found. Check app permissions.</s-text>
                    )}
                  </>
                )}
              </s-stack>
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
