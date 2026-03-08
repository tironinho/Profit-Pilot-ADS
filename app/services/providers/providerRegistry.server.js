/**
 * Provider registry: status from ENV (config.server) + connection from DB. Never exposes secrets.
 */

import * as config from "./config.server.js";
import { getMetaProvider } from "./meta.server.js";
import { getGoogleProvider } from "./google.server.js";
import { getTikTokProvider } from "./tiktok.server.js";

const PROVIDERS = {
  META: getMetaProvider(),
  GOOGLE: getGoogleProvider(),
  TIKTOK: getTikTokProvider(),
};

export function getProvider(provider) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unknown provider: ${provider}`);
  return p;
}

/**
 * @param {string} shopId
 * @returns {Promise<{ provider: string, configured: boolean, connected: boolean, available: boolean, encryptionEnabled: boolean, accounts?: Array<{ id: string, name: string }> }[]>}
 */
export async function getConnectionsStatus(shopId) {
  const result = [];
  for (const [name, adapter] of Object.entries(PROVIDERS)) {
    const available = config.isProviderAvailable(name);
    const connected = available ? await adapter.isConnected(shopId) : false;
    const item = {
      provider: name,
      configured: available,
      connected,
      available,
      encryptionEnabled: config.encryptionEnabled,
    };
    if (connected) {
      try {
        item.accounts = await adapter.listAccounts(shopId);
      } catch (e) {
        item.accounts = [];
        item.error = e.message;
      }
    }
    result.push(item);
  }
  return result;
}

export async function fetchAllSpendAndConversions(shopId, { since, until }) {
  const out = {};
  for (const [name, adapter] of Object.entries(PROVIDERS)) {
    if (!(await adapter.isConnected(shopId))) continue;
    try {
      const data = await adapter.fetchSpendAndConversions(shopId, { since, until });
      if (data) out[name] = data;
    } catch (e) {
      console.error(`[Provider ${name}] fetchSpendAndConversions error:`, e.message);
    }
  }
  return out;
}
