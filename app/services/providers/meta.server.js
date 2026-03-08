/**
 * Meta Marketing API: OAuth, ad accounts. Credentials from .env only (no DB config).
 */

import prisma from "../../db.server.js";
import { encryptString, decryptString } from "../../utils/crypto.server.js";
import { getBaseUrl } from "../../utils/baseUrl.server.js";

const PROVIDER = "META";
const API_VERSION = "v21.0";
const BASE = `https://graph.facebook.com/${API_VERSION}`;

/** ENV-based config. No secrets to client. */
export function getMetaConfig() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  return {
    enabled: Boolean(appId && appSecret),
    appId: appId || null,
    appSecret: appSecret || null,
  };
}

/** Provider available when ENV is set (no DB). */
export function isMetaEnabled() {
  return getMetaConfig().enabled;
}

/** Credentials from ENV only. Never return to client. */
export async function getMetaCredentials(_shopId) {
  const env = getMetaConfig();
  if (env.enabled && env.appId && env.appSecret) {
    return { clientId: env.appId, clientSecret: env.appSecret };
  }
  return null;
}

export function getMetaRedirectUri(request) {
  const base = getBaseUrl(request);
  return `${base}/app/oauth/meta/callback`;
}

/** Build Meta OAuth URL. Pass decrypted appId from config or ENV. */
export function buildMetaAuthUrl({ request, state }) {
  const redirectUri = getMetaRedirectUri(request);
  return { redirectUri };
}

/** Build Meta OAuth consent URL (use with clientId from getMetaCredentials). */
export function getAuthorizationUrl({ state, redirectUri, clientId }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "ads_management,ads_read,business_management",
    response_type: "code",
  });
  return `https://www.facebook.com/${API_VERSION}/dialog/oauth?${params.toString()}`;
}
export async function exchangeCodeAndSave({ code, shopId, redirectUri, clientId, clientSecret }) {
  const tokenUrl = `${BASE}/oauth/access_token?${new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  })}`;
  const tokenRes = await fetch(tokenUrl);
  const tokenData = await tokenRes.json();
  if (tokenData.error) throw new Error(tokenData.error.message || "Meta token exchange failed");
  let accessToken = tokenData.access_token;
  if (!accessToken) throw new Error("No access_token in Meta response");

  const longUrl = `${BASE}/oauth/access_token?${new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: clientId,
    client_secret: clientSecret,
    fb_exchange_token: accessToken,
  })}`;
  const longRes = await fetch(longUrl);
  const longData = await longRes.json();
  if (longData.access_token) accessToken = longData.access_token;
  const expiresAt = longData.expires_in ? new Date(Date.now() + longData.expires_in * 1000) : null;

  const encrypted = encryptString(accessToken);
  await prisma.providerConnection.upsert({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
    create: { shopId, provider: PROVIDER, status: "CONNECTED", accessTokenEnc: encrypted, tokenExpiresAt: expiresAt },
    update: { status: "CONNECTED", accessTokenEnc: encrypted, tokenExpiresAt: expiresAt },
  });
}

async function getAccessToken(shopId) {
  const conn = await prisma.providerConnection.findUnique({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
  });
  if (!conn?.accessTokenEnc) return null;
  try {
    return decryptString(conn.accessTokenEnc);
  } catch {
    return null;
  }
}

export async function isConnected(shopId) {
  const token = await getAccessToken(shopId);
  return Boolean(token);
}

export async function listAccounts(shopId) {
  const token = await getAccessToken(shopId);
  if (!token) return [];
  const url = `${BASE}/me/adaccounts?fields=id,name,account_id&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Meta ad accounts failed");
  const list = data.data || [];
  return list.map((a) => ({
    id: a.account_id || a.id?.replace("act_", "") || a.id,
    name: a.name || a.id,
  }));
}

export async function saveSelectedAccount(shopId, externalAccountId) {
  const cleanId = String(externalAccountId).replace("act_", "");
  await prisma.providerAccount.updateMany({
    where: { shopId, provider: PROVIDER },
    data: { isSelected: false },
  });
  const existing = await prisma.providerAccount.findFirst({
    where: { shopId, provider: PROVIDER, externalAccountId: cleanId },
  });
  if (existing) {
    await prisma.providerAccount.update({ where: { id: existing.id }, data: { isSelected: true } });
  } else {
    await prisma.providerAccount.create({
      data: { shopId, provider: PROVIDER, externalAccountId: cleanId, name: `Meta Ad Account ${cleanId}`, isSelected: true },
    });
  }
}

export async function fetchSpendAndConversions(shopId, { since, until }) {
  const token = await getAccessToken(shopId);
  if (!token) return null;
  const account = await prisma.providerAccount.findFirst({
    where: { shopId, provider: PROVIDER, isSelected: true },
  });
  const actId = account?.externalAccountId;
  if (!actId) return null;
  const adAccountId = actId.startsWith("act_") ? actId : `act_${actId}`;
  const sinceStr = since.toISOString().slice(0, 10);
  const untilStr = until.toISOString().slice(0, 10);
  const timeRange = encodeURIComponent(JSON.stringify({ since: sinceStr, until: untilStr }));
  const url = `${BASE}/${adAccountId}/insights?fields=spend,actions&time_range=${timeRange}&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) return { spend: 0, purchases: 0 };
  let spend = 0, purchases = 0;
  for (const row of data.data || []) {
    spend += parseFloat(row.spend || "0");
    const purchase = (row.actions || []).find((a) => (a.action_type || "").toLowerCase().includes("purchase") || (a.action_type || "").toLowerCase().includes("omni_purchase"));
    if (purchase) purchases += parseInt(purchase.value || "0", 10);
  }
  return { spend, purchases };
}

export async function pauseEntities(shopId, _params) {
  const token = await getAccessToken(shopId);
  if (!token) return { actionAttempted: "none", success: false };
  return { actionAttempted: "stub", success: true };
}

export function getMetaProvider() {
  return {
    isConnected,
    listAccounts,
    fetchSpendAndConversions,
    pauseEntities,
    saveSelectedAccount: (shopId, externalAccountId) => saveSelectedAccount(shopId, externalAccountId),
    isEnabled: () => isMetaEnabled(),
  };
}
