/**
 * Start TikTok OAuth. Credentials from .env only (TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET). Redirect in top frame.
 */
import { authenticate } from "../shopify.server";
import { getOrCreateShop } from "../services/shop.server";
import { createOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";
import * as TikTok from "../services/providers/tiktok.server";
import * as config from "../services/providers/config.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = await getOrCreateShop({ shopDomain: session.shop });

  if (!config.encryptionEnabled) {
    return new Response(
      `<!DOCTYPE html><html><body><p>Connect unavailable: missing APP_ENCRYPTION_KEY</p><script>setTimeout(function(){ window.top.location.href = "/app/connect?error=encryption"; }, 2000);</script></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }
  if (!config.tiktokEnabled) {
    return new Response(
      `<!DOCTYPE html><html><body><p>TikTok is not configured. Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in .env</p><script>setTimeout(function(){ window.top.location.href = "/app/connect?error=provider&provider=TIKTOK"; }, 2000);</script></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const credentials = await TikTok.getTikTokCredentials(shop.id);
  if (!credentials) {
    return new Response(
      `<!DOCTYPE html><html><body><p>TikTok credentials missing</p><script>setTimeout(function(){ window.top.location.href = "/app/connect?error=provider&provider=TIKTOK"; }, 2000);</script></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const state = await createOAuthState(shop.id, "TIKTOK");
  const base = getBaseUrl(request);
  const redirectUri = `${base}/app/oauth/tiktok/callback`;
  const authUrl = TikTok.getAuthorizationUrl({
    state,
    redirectUri,
    clientKey: credentials.clientKey,
  });

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><p>Redirecting to TikTok…</p><script>window.top.location.href = ${JSON.stringify(authUrl)};</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
