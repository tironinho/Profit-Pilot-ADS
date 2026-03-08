/**
 * Google OAuth callback: validate state, exchange code, save connection.
 */
import { redirect } from "react-router";
import * as Google from "../services/providers/google.server";
import { consumeOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  console.log("[OAuth Google] callback received", { hasCode: Boolean(code), hasState: Boolean(state) });
  if (!code || !state) {
    console.log("[OAuth Google] callback missing code or state");
    return redirect("/app/connect?error=provider&provider=GOOGLE");
  }
  const parsed = await consumeOAuthState(state);
  if (!parsed) {
    console.log("[OAuth Google] callback invalid or expired state");
    return redirect("/app/connect?error=provider&provider=GOOGLE");
  }
  const { shopId, provider, returnTo } = parsed;
  if (provider !== "GOOGLE") return redirect("/app/connect?error=provider&provider=GOOGLE");

  const credentials = await Google.getGoogleCredentials(shopId);
  if (!credentials) return redirect("/app/connect?error=provider&provider=GOOGLE");

  try {
    const redirectUri = Google.getGoogleRedirectUriForOAuth() ?? Google.getGoogleRedirectUri(request);
    if (!redirectUri) return redirect("/app/connect?error=provider&provider=GOOGLE");
    await Google.exchangeCodeAndSave({
      code,
      shopId,
      redirectUri,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });
    console.log("[OAuth Google] tokens saved (encrypted)");
  } catch (e) {
    console.error("[OAuth Google] callback error:", e.message);
    return redirect("/app/connect?error=provider&provider=GOOGLE");
  }
  const base = process.env.SHOPIFY_APP_URL?.replace(/\/$/, "") || getBaseUrl(request);
  const fallbackPath = `/app/connect?connected=GOOGLE`;
  const targetPath = returnTo
    ? `${returnTo}${returnTo.includes("?") ? "&" : "?"}connected=GOOGLE`
    : fallbackPath;
  return redirect(`${base}${targetPath}`);
};
