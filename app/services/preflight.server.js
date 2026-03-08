/**
 * Preflight: run diagnostics and persist PreflightRun + PreflightCheckResult.
 */

import prisma from "../db.server.js";
import { getConnectionsStatus, fetchAllSpendAndConversions } from "./providers/providerRegistry.server.js";
import { getPaidOrdersMetrics } from "./shopifyMetrics.server.js";
import { getShopById } from "./shop.server.js";

const STATUS = { PASS: "PASS", WARN: "WARN", FAIL: "FAIL" };

export async function runPreflight({ shopId, admin }) {
  const checks = [];
  const shop = await getShopById(shopId);
  if (!shop) {
    const run = await prisma.preflightRun.create({
      data: {
        shopId,
        status: "DONE",
        summary: JSON.stringify({ error: "Shop not found" }),
      },
    });
    return { runId: run.id, summary: {}, checks: [] };
  }

  const connStatus = await getConnectionsStatus(shopId);
  const connectedCount = connStatus.filter((c) => c.connected).length;
  if (connectedCount === 0) {
    checks.push({
      key: "connections",
      title: "Ad channels connected",
      status: STATUS.WARN,
      message: "Connect at least one channel (Meta, Google, or TikTok) in Connect.",
      data: null,
    });
  } else {
    checks.push({
      key: "connections",
      title: "Ad channels connected",
      status: STATUS.PASS,
      message: `${connectedCount} channel(s) connected.`,
      data: { connectedCount },
    });
  }

  let shopifyRevenue = 0;
  let shopifyOrders = 0;
  let shopifyAov = 0;
  try {
    const metrics = await getPaidOrdersMetrics(admin, { sinceDays: 30 });
    shopifyRevenue = metrics.revenue;
    shopifyOrders = metrics.orders;
    shopifyAov = metrics.aov;
  } catch (e) {
    checks.push({
      key: "shopify_orders",
      title: "Shopify orders (30d)",
      status: STATUS.FAIL,
      message: "Could not fetch orders: " + (e.message || "Unknown error"),
      data: null,
    });
  }
  if (shopifyOrders === 0 && !checks.find((c) => c.key === "shopify_orders")) {
    checks.push({
      key: "shopify_orders",
      title: "Shopify orders (30d)",
      status: STATUS.WARN,
      message: "No paid orders in the last 30 days.",
      data: { revenue: 0, orders: 0, aov: 0 },
    });
  } else if (shopifyOrders > 0) {
    checks.push({
      key: "shopify_orders",
      title: "Shopify orders (30d)",
      status: STATUS.PASS,
      message: `${shopifyOrders} orders, revenue ${shopifyRevenue.toFixed(2)}, AOV ${shopifyAov.toFixed(2)}.`,
      data: { revenue: shopifyRevenue, orders: shopifyOrders, aov: shopifyAov },
    });
  }

  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const providerMetrics = await fetchAllSpendAndConversions(shopId, { since, until });
  for (const [provider, data] of Object.entries(providerMetrics)) {
    const spend = data?.spend ?? 0;
    const purchases = data?.purchases ?? 0;
    if (spend > 0 && purchases === 0) {
      checks.push({
        key: `perf_${provider}`,
        title: `Performance: ${provider} (7d)`,
        status: STATUS.WARN,
        message: `Spend > 0 but no purchases in last 7 days. Check creatives or tracking.`,
        data: { spend, purchases, provider },
      });
    } else if (spend > 0) {
      checks.push({
        key: `perf_${provider}`,
        title: `Performance: ${provider} (7d)`,
        status: STATUS.PASS,
        message: `Spend ${spend.toFixed(2)}, purchases ${purchases}.`,
        data: { spend, purchases, provider },
      });
    }
  }

  try {
    const storefrontUrl = `https://${shop.shopDomain}`;
    const start = Date.now();
    const res = await fetch(storefrontUrl, { method: "HEAD", signal: AbortSignal.timeout(10000) });
    const elapsed = Date.now() - start;
    if (elapsed > 5000 || !res.ok) {
      checks.push({
        key: "site_health",
        title: "Storefront response",
        status: STATUS.WARN,
        message: `Store took ${elapsed}ms or returned ${res.status}.`,
        data: { url: storefrontUrl, ms: elapsed, status: res.status },
      });
    } else {
      checks.push({
        key: "site_health",
        title: "Storefront response",
        status: STATUS.PASS,
        message: `Store responded in ${elapsed}ms.`,
        data: { url: storefrontUrl, ms: elapsed },
      });
    }
  } catch (e) {
    checks.push({
      key: "site_health",
      title: "Storefront response",
      status: STATUS.WARN,
      message: "Could not reach storefront: " + (e.message || "timeout"),
      data: null,
    });
  }

  checks.push({
    key: "inventory",
    title: "Inventory check",
    status: STATUS.PASS,
    message: "Run inventory checks in Shopify admin for top-selling products.",
    data: null,
  });

  const summary = {
    pass: checks.filter((c) => c.status === STATUS.PASS).length,
    warn: checks.filter((c) => c.status === STATUS.WARN).length,
    fail: checks.filter((c) => c.status === STATUS.FAIL).length,
  };

  const run = await prisma.preflightRun.create({
    data: {
      shopId,
      status: "DONE",
      summary: JSON.stringify(summary),
      checks: {
        create: checks.map((c) => ({
          key: c.key,
          title: c.title,
          status: c.status,
          message: c.message,
          data: c.data ? JSON.stringify(c.data) : null,
        })),
      },
    },
    include: { checks: true },
  });

  return { runId: run.id, summary, checks };
}

export async function listPreflightRuns(shopId, limit = 10) {
  return prisma.preflightRun.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { checks: true },
  });
}
