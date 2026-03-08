/**
 * Meta OAuth callback: validate state, exchange code, save connection and accounts.
 */
import { redirect } from "react-router";
import * as Meta from "../services/providers/meta.server";
import { consumeOAuthState } from "../services/oauthState.server";
import { getBaseUrl } from "../utils/baseUrl.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  console.log("[OAuth Meta] callback received");
  if (!code || !state) {
    console.log("[OAuth Meta] callback missing code or state");
    return redirect("/app/connect?error=provider&provider=META");
  }
  const parsed = await consumeOAuthState(state);
  if (!parsed) {
    console.log("[OAuth Meta] callback invalid or expired state");
    return redirect("/app/connect?error=provider&provider=META");
  }
  const { shopId, provider, returnTo } = parsed;
  if (provider !== "META") return redirect("/app/connect?error=provider&provider=META");

  const credentials = await Meta.getMetaCredentials(shopId);
  if (!credentials) return redirect("/app/connect?error=provider&provider=META");

  try {
    const redirectUri = Meta.getMetaRedirectUri(request);
    await Meta.exchangeCodeAndSave({
      code,
      shopId,
      redirectUri,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    });
    console.log("[OAuth Meta] tokens saved (encrypted), listing ad accounts");
    const accounts = await Meta.listAccounts(shopId);
    for (const acc of accounts) {
      const existing = await prisma.providerAccount.findFirst({
        where: { shopId, provider: "META", externalAccountId: acc.id },
      });
      if (!existing) {
        await prisma.providerAccount.create({
          data: { shopId, provider: "META", externalAccountId: acc.id, name: acc.name },
        });
      }
    }
    if (accounts.length > 0) {
      await prisma.providerAccount.updateMany({
        where: { shopId, provider: "META" },
        data: { isSelected: false },
      });
      const first = await prisma.providerAccount.findFirst({
        where: { shopId, provider: "META", externalAccountId: accounts[0].id },
      });
      if (first) await prisma.providerAccount.update({ where: { id: first.id }, data: { isSelected: true } });
    }
  } catch (e) {
    console.error("[OAuth Meta] callback error:", e.message);
    return redirect("/app/connect?error=provider&provider=META");
  }
  const base = getBaseUrl(request);
  const fallbackPath = `/app/connect?connected=META`;
  const targetPath = returnTo
    ? `${returnTo}${returnTo.includes("?") ? "&" : "?"}connected=META`
    : fallbackPath;
  return redirect(`${base}${targetPath}`);
};
