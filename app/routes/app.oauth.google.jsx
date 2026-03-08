/**
 * Start Google OAuth. Credentials from .env only.
 * Loader returns json({ authUrl }); default component redirects in top frame.
 */
import { redirect } from "react-router";
import { useLoaderData } from "react-router";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { createOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";
import * as Google from "../services/providers/google.server";
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
  if (!config.googleEnabled) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=provider&provider=GOOGLE`);
  }

  const credentials = await Google.getGoogleCredentials(shop.id);
  if (!credentials) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=provider&provider=GOOGLE`);
  }

  const state = await createOAuthState(shop.id, "GOOGLE", returnTo);
  const base = getBaseUrl(request);
  const redirectUri = `${base}/app/oauth/google/callback`;
  const authUrl = Google.getAuthorizationUrl({
    state,
    redirectUri,
    clientId: credentials.clientId,
  });

  return { authUrl };
};

export default function OAuthGoogleStart() {
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
      <p>Redirecting to Google authorization…</p>
    </div>
  );
}
