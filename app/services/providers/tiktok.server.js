/**
 * TikTok for Business OAuth. Credentials from .env only (TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET).
 */

import prisma from "../../db.server.js";
import { encryptString, decryptString } from "../../utils/crypto.server.js";
import { getBaseUrl } from "../../utils/baseUrl.server.js";

const PROVIDER = "TIKTOK";

export function getTikTokConfig() {
  const key = process.env.TIKTOK_CLIENT_KEY;
  const secret = process.env.TIKTOK_CLIENT_SECRET;
  return {
    enabled: Boolean(key && secret),
    clientKey: key || null,
    clientSecret: secret || null,
  };
}

export function isTikTokEnabled() {
  return getTikTokConfig().enabled;
}

/** Credentials from ENV only (client_key = TIKTOK_CLIENT_KEY). */
export async function getTikTokCredentials(_shopId) {
  const c = getTikTokConfig();
  if (c.enabled && c.clientKey && c.clientSecret) {
    return { clientKey: c.clientKey, clientSecret: c.clientSecret };
  }
  return null;
}

export function getTikTokRedirectUri(request) {
  const base = getBaseUrl(request);
  return `${base}/app/oauth/tiktok/callback`;
}

export function getAuthorizationUrl({ state, redirectUri, clientKey }) {
  const params = new URLSearchParams({
    client_key: clientKey,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "user.info.basic,advertiser.list,advertiser.creative.read",
    state,
  });
  return `https://business-api.tiktok.com/portal/auth?${params.toString()}`;
}

export async function exchangeCodeAndSave({ code, shopId, redirectUri, clientKey, clientSecret }) {
  const res = await fetch("https://business-api.tiktok.com/open_api/v2/oauth2/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (data.data?.error_code) throw new Error(data.data?.message || "TikTok token exchange failed");
  const accessToken = data.data?.access_token;
  if (!accessToken) throw new Error("No access_token in TikTok response");

  const encrypted = encryptString(accessToken);
  await prisma.providerConnection.upsert({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
    create: { shopId, provider: PROVIDER, status: "CONNECTED", accessTokenEnc: encrypted },
    update: { status: "CONNECTED", accessTokenEnc: encrypted },
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
  const accounts = await prisma.providerAccount.findMany({
    where: { shopId, provider: PROVIDER },
  });
  return accounts.map((a) => ({ id: a.externalAccountId, name: a.name || a.externalAccountId }));
}

export async function saveSelectedAccount(shopId, externalAccountId, name) {
  await prisma.providerAccount.updateMany({
    where: { shopId, provider: PROVIDER },
    data: { isSelected: false },
  });
  const existing = await prisma.providerAccount.findFirst({
    where: { shopId, provider: PROVIDER, externalAccountId },
  });
  if (existing) {
    await prisma.providerAccount.update({ where: { id: existing.id }, data: { isSelected: true } });
  } else {
    await prisma.providerAccount.create({
      data: { shopId, provider: PROVIDER, externalAccountId, name: name || `TikTok ${externalAccountId}`, isSelected: true },
    });
  }
}

export async function fetchSpendAndConversions(shopId, { since, until }) {
  const token = await getAccessToken(shopId);
  if (!token) return null;
  return { spend: 0, purchases: 0 };
}

export function getTikTokProvider() {
  return {
    isConnected,
    listAccounts,
    fetchSpendAndConversions,
    saveSelectedAccount: (shopId, id, name) => saveSelectedAccount(shopId, id, name),
    isEnabled: () => isTikTokEnabled(),
  };
}
