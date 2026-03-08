/**
 * OAuth state: create and consume state for OAuth callbacks. Server-only.
 */

import { randomBytes } from "node:crypto";
import prisma from "../db.server.js";

const STATE_TTL_MS = 10 * 60 * 1000; // 10 min

/**
 * Create state, persist, return state string.
 * @param {string} shopId
 * @param {"META"|"GOOGLE"|"TIKTOK"} provider
 * @param {string} [returnTo] - path + search to redirect after callback (e.g. /app/connect?host=...&shop=...)
 * @returns {Promise<string>}
 */
export async function createOAuthState(shopId, provider, returnTo = null) {
  const state = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + STATE_TTL_MS);
  await prisma.oAuthState.create({
    data: { state, shopId, provider, expiresAt, returnTo: returnTo || null },
  });
  return state;
}

/**
 * Consume state: validate, return shopId, provider, returnTo; delete row.
 * @param {string} state
 * @returns {Promise<{ shopId: string, provider: string, returnTo?: string } | null>}
 */
export async function consumeOAuthState(state) {
  if (!state) return null;
  const row = await prisma.oAuthState.findUnique({
    where: { state },
  });
  if (!row || new Date() > row.expiresAt) return null;
  const returnTo = row.returnTo || null;
  await prisma.oAuthState.delete({ where: { state } }).catch(() => {});
  return { shopId: row.shopId, provider: row.provider, returnTo };
}
