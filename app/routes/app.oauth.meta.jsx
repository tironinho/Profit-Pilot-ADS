/**
 * Start Meta OAuth. Credentials from .env only.
 * Loader returns json({ authUrl }); default component redirects in top frame.
 */
import { redirect } from "react-router";
import { useLoaderData } from "react-router";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { createOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";
import * as Meta from "../services/providers/meta.server";
import * as config from "../services/providers/config.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });
  const url = new URL(request.url);
  const search = url.search || "";
  const returnTo = `/app/connect${search}`;

  if (!config.encryptionEnabled) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=encryption`);
  }
  if (!config.metaEnabled) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=provider&provider=META`);
  }

  const credentials = await Meta.getMetaCredentials(shop.id);
  if (!credentials) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=provider&provider=META`);
  }

  const state = await createOAuthState(shop.id, "META", returnTo);
  const base = getBaseUrl(request);
  const redirectUri = `${base}/app/oauth/meta/callback`;
  const authUrl = Meta.getAuthorizationUrl({
    state,
    redirectUri,
    clientId: credentials.clientId,
  });

  return { authUrl };
};

export default function OAuthMetaStart() {
  const data = useLoaderData();
  const authUrl = data?.authUrl;

  useEffect(() => {
    if (!authUrl) return;
    try {
      window.top.location.href = authUrl;
    } catch {
      window.location.href = authUrl;
    }
  }, [authUrl]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Redirecting to Meta authorization…</p>
    </div>
  );
}
