import prisma from "../db.server.js";

/**
 * Get or create shop by domain.
 * @param {{ shopDomain: string }}
 * @returns {Promise<{ id: string, shopDomain: string, ... }>}
 */
export async function getOrCreateShop({ shopDomain }) {
  let shop = await prisma.shop.findUnique({
    where: { shopDomain },
  });
  if (!shop) {
    shop = await prisma.shop.create({
      data: { shopDomain },
    });
  }
  return shop;
}

/**
 * Get selected ad accounts per provider for a shop.
 * @param {string} shopId
 * @returns {Promise<Array<{ provider: string, externalAccountId: string, name: string | null }>>}
 */
export async function getSelectedAccounts(shopId) {
  const accounts = await prisma.providerAccount.findMany({
    where: { shopId, isSelected: true },
    select: {
      provider: true,
      externalAccountId: true,
      name: true,
    },
  });
  return accounts;
}

/**
 * Get shop by domain (no create).
 * @param {string} shopDomain
 */
export async function getShopByDomain(shopDomain) {
  return prisma.shop.findUnique({
    where: { shopDomain },
    include: {
      connections: true,
      accounts: true,
    },
  });
}

/**
 * Get shop by id.
 * @param {string} shopId
 */
export async function getShopById(shopId) {
  return prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      connections: true,
      accounts: true,
    },
  });
}
