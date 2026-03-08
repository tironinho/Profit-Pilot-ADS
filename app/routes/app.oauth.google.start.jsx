/**
 * POST /app/oauth/google/start — Returns { authUrl } for user-gesture redirect (embedded app).
 * Use this from Connect page onClick; do not navigate here via Link (avoids Chrome blocking).
 */
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { createOAuthState } from "../services/oauthState.server";
import * as Google from "../services/providers/google.server";
import * as config from "../services/providers/config.server";

export const loader = async () => {
  return new Response(JSON.stringify({ error: "Use POST from Connect page" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });

  let returnTo = `/app/connect`;
  try {
    const body = await request.json().catch(() => ({}));
    if (body.returnTo && typeof body.returnTo === "string") {
      returnTo = body.returnTo.startsWith("/") ? body.returnTo : `/app/connect`;
    }
  } catch {
    // keep default returnTo
  }

  if (!config.encryptionEnabled) {
    return new Response(
      JSON.stringify({ error: "encryption", redirect: `/app/connect?error=encryption` }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  if (!config.googleEnabled) {
    return new Response(
      JSON.stringify({ error: "provider", redirect: `/app/connect?error=provider&provider=GOOGLE` }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const credentials = await Google.getGoogleCredentials(shop.id);
  if (!credentials) {
    return new Response(
      JSON.stringify({ error: "provider", redirect: `/app/connect?error=provider&provider=GOOGLE` }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const redirectUri = Google.getGoogleRedirectUriForOAuth();
  if (!redirectUri) {
    return new Response(
      JSON.stringify({ error: "config", redirect: `/app/connect?error=provider&provider=GOOGLE` }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const state = await createOAuthState(shop.id, "GOOGLE", returnTo);
  const authUrl = Google.getAuthorizationUrl({
    state,
    redirectUri,
    clientId: credentials.clientId,
  });

  console.log("[OAuth Google] start", {
    redirectUri,
    clientId: credentials.clientId ? `${credentials.clientId.slice(0, 10)}…` : null,
    authUrl: authUrl ? `${authUrl.slice(0, 60)}…` : null,
  });

  return new Response(JSON.stringify({ authUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
