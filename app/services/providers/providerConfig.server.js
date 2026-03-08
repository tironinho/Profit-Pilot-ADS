/**
 * Server-only: load provider client config from DB (decrypted). Never send to client.
 */

import prisma from "../../db.server.js";
import { decryptString, encryptString } from "../../utils/crypto.server.js";

/**
 * @param {string} shopId
 * @param {"META"|"GOOGLE"|"TIKTOK"} provider
 * @returns {Promise<{ configured: true, clientId: string, clientSecret: string, extra?: Record<string, string> } | { configured: false }>}
 */
export async function getProviderClientConfig(shopId, provider) {
  const row = await prisma.providerClientConfig.findUnique({
    where: { shopId_provider: { shopId, provider } },
  });
  if (!row?.clientIdEnc || !row?.clientSecretEnc) return { configured: false };

  try {
    const clientId = decryptString(row.clientIdEnc);
    const clientSecret = decryptString(row.clientSecretEnc);
    let extra = null;
    if (row.extraEnc) {
      const raw = decryptString(row.extraEnc);
      if (raw) extra = JSON.parse(raw);
    }
    return {
      configured: true,
      clientId,
      clientSecret,
      extra: extra || {},
    };
  } catch (e) {
    console.error("[ProviderConfig] decrypt error:", e);
    return { configured: false };
  }
}

/**
 * Check if provider has config (no decrypt). For loaders that must not touch secrets.
 */
export async function isProviderConfigured(shopId, provider) {
  const row = await prisma.providerClientConfig.findUnique({
    where: { shopId_provider: { shopId, provider } },
    select: { id: true },
  });
  return Boolean(row);
}

/**
 * Save provider client config (encrypt and store). Never pass plain secrets to client.
 * @param {{ shopId: string, provider: "META"|"GOOGLE"|"TIKTOK", clientId: string, clientSecret: string, extra?: Record<string, string> }}
 */
export async function saveProviderClientConfig({ shopId, provider, clientId, clientSecret, extra }) {
  const clientIdEnc = encryptString(clientId);
  const clientSecretEnc = encryptString(clientSecret);
  const extraEnc = extra && Object.keys(extra).length > 0 ? encryptString(JSON.stringify(extra)) : null;
  await prisma.providerClientConfig.upsert({
    where: { shopId_provider: { shopId, provider } },
    create: { shopId, provider, clientIdEnc, clientSecretEnc, extraEnc },
    update: { clientIdEnc, clientSecretEnc, extraEnc },
  });
}
