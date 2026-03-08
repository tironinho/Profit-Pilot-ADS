/**
 * TikTok OAuth callback: validate state, exchange code, save connection. Credentials from .env.
 */
import { redirect } from "react-router";
import * as TikTok from "../services/providers/tiktok.server";
import { consumeOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return redirect("/app/connect?error=missing_params");

  const parsed = await consumeOAuthState(state);
  if (!parsed) return redirect("/app/connect?error=invalid_state");
  const { shopId, provider } = parsed;
  if (provider !== "TIKTOK") return redirect("/app/connect?error=invalid_state");

  const credentials = await TikTok.getTikTokCredentials(shopId);
  if (!credentials) return redirect("/app/connect?error=not_configured&provider=TIKTOK");

  const redirectUri = TikTok.getTikTokRedirectUri(request);
  await TikTok.exchangeCodeAndSave({
    code,
    shopId,
    redirectUri,
    clientKey: credentials.clientKey,
    clientSecret: credentials.clientSecret,
  });

  const accounts = await TikTok.listAccounts(shopId);
  for (const acc of accounts) {
    const existing = await prisma.providerAccount.findFirst({
      where: { shopId, provider: "TIKTOK", externalAccountId: acc.id },
    });
    if (!existing) {
      await prisma.providerAccount.create({
        data: { shopId, provider: "TIKTOK", externalAccountId: acc.id, name: acc.name },
      });
    }
  }
  const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { shopDomain: true } });
  const base = getBaseUrl(request);
  return redirect(`${base}/app/connect?shop=${encodeURIComponent(shop?.shopDomain || "")}&connected=TIKTOK`);
};
