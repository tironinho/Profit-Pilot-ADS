/**
 * Google Ads OAuth. Credentials from .env only (no DB config).
 */

import prisma from "../../db.server.js";
import { encryptString, decryptString } from "../../utils/crypto.server.js";
import { getBaseUrl } from "../../utils/baseUrl.server.js";

const PROVIDER = "GOOGLE";

/** ENV-based config. */
export function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    enabled: Boolean(clientId && clientSecret),
    clientId: clientId || null,
    clientSecret: clientSecret || null,
  };
}

/** Provider available when ENV is set (no DB). */
export function isGoogleEnabled() {
  return getGoogleConfig().enabled;
}

/** Credentials from ENV only. Never return to client. */
export async function getGoogleCredentials(_shopId) {
  const env = getGoogleConfig();
  if (env.enabled && env.clientId && env.clientSecret) {
    return { clientId: env.clientId, clientSecret: env.clientSecret };
  }
  return null;
}

export function getGoogleRedirectUri(request) {
  const base = getBaseUrl(request);
  return `${base}/app/oauth/google/callback`;
}

/**
 * OAuth redirect_uri must always use SHOPIFY_APP_URL (not request host) so Google
 * redirects to the same origin that started the flow (embedded app may use different host).
 */
export function getGoogleRedirectUriForOAuth() {
  const base = process.env.SHOPIFY_APP_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/app/oauth/google/callback`;
}

/** Build Google OAuth consent URL (use with clientId from getGoogleCredentials). */
export function buildGoogleAuthUrl({ request, state }) {
  const redirectUri = getGoogleRedirectUri(request);
  return { redirectUri };
}

export function getAuthorizationUrl({ state, redirectUri, clientId }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/adwords",
    state,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/** Exchange code for tokens and save encrypted. */
export async function exchangeCodeAndSave({ code, shopId, redirectUri, clientId, clientSecret }) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error || "Google token exchange failed");

  const accessEnc = encryptString(data.access_token || "");
  const refreshEnc = data.refresh_token ? encryptString(data.refresh_token) : null;
  const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null;

  await prisma.providerConnection.upsert({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
    create: {
      shopId,
      provider: PROVIDER,
      status: "CONNECTED",
      accessTokenEnc: accessEnc,
      refreshTokenEnc: refreshEnc,
      tokenExpiresAt: expiresAt,
    },
    update: {
      status: "CONNECTED",
      accessTokenEnc: accessEnc,
      refreshTokenEnc: refreshEnc ?? undefined,
      tokenExpiresAt: expiresAt,
    },
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
  const conn = await prisma.providerConnection.findUnique({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
  });
  return Boolean(conn?.accessTokenEnc || conn?.refreshTokenEnc);
}

export async function listAccounts(shopId) {
  const conn = await prisma.providerConnection.findUnique({
    where: { shopId_provider: { shopId, provider: PROVIDER } },
  });
  if (!conn) return [];
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
    await prisma.providerAccount.update({
      where: { id: existing.id },
      data: { isSelected: true },
    });
  } else {
    await prisma.providerAccount.create({
      data: {
        shopId,
        provider: PROVIDER,
        externalAccountId,
        name: name || `Google ${externalAccountId}`,
        isSelected: true,
      },
    });
  }
}

export async function fetchSpendAndConversions(shopId, { since, until }) {
  const token = await getAccessToken(shopId);
  if (!token) return null;
  return { spend: 0, purchases: 0 };
}

export function getGoogleProvider() {
  return {
    isConnected,
    listAccounts,
    fetchSpendAndConversions,
    saveSelectedAccount: (shopId, id, name) => saveSelectedAccount(shopId, id, name),
    isEnabled: () => isGoogleEnabled(),
  };
}
