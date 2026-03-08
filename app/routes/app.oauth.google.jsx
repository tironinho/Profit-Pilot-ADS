/**
 * Legacy /app/oauth/google — No auto-redirect (Chrome blocks it in iframe).
 * Renders a link with target="_top" so user can click to open Google auth.
 * Prefer using Connect page "Connect Google" button (POST to /app/oauth/google/start) instead.
 */
import { redirect } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { createOAuthState } from "../services/oauthState.server";
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

  const redirectUri = Google.getGoogleRedirectUriForOAuth();
  if (!redirectUri) {
    return redirect(`/app/connect${search}${search ? "&" : "?"}error=provider&provider=GOOGLE`);
  }

  const state = await createOAuthState(shop.id, "GOOGLE", returnTo);
  const authUrl = Google.getAuthorizationUrl({
    state,
    redirectUri,
    clientId: credentials.clientId,
  });

  console.log("[OAuth Google] legacy route", {
    redirectUri,
    clientId: credentials.clientId ? `${credentials.clientId.slice(0, 10)}…` : null,
  });

  return { authUrl };
};

export default function OAuthGoogleStart() {
  const data = useLoaderData();
  const authUrl = data?.authUrl;

  if (!authUrl) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Unable to start Google authorization. Go back to Connect and use &quot;Connect Google&quot;.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Click the link below to open Google authorization (opens in the same tab).</p>
      <p>
        <a href={authUrl} target="_top" rel="noopener noreferrer" style={{ fontSize: "1rem" }}>
          Open Google to authorize
        </a>
      </p>
    </div>
  );
}
