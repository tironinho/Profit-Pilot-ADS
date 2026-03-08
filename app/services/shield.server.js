/**
 * Budget Shield: evaluate rules, create alerts, optional autopilot action.
 */

import prisma from "../db.server.js";
import { getShopById } from "./shop.server.js";
import { fetchAllSpendAndConversions } from "./providers/providerRegistry.server.js";
import { getPaidOrdersMetrics } from "./shopifyMetrics.server.js";
import { getMetaProvider } from "./providers/meta.server.js";

const SEVERITY = { info: "info", warn: "warn", critical: "critical" };
const ALERT_TYPES = {
  NO_PURCHASE_SPEND: "NO_PURCHASE_SPEND",
  CPA_TOO_HIGH: "CPA_TOO_HIGH",
  ROAS_LOW: "ROAS_LOW",
  TRACKING_SUSPECT: "TRACKING_SUSPECT",
  INVENTORY_RISK: "INVENTORY_RISK",
};

export async function evaluateShield({ shopId, admin }) {
  const shop = await getShopById(shopId);
  if (!shop) return { alerts: [] };

  let rules = await prisma.shieldRule.findMany({
    where: { shopId, enabled: true },
  });
  if (rules.length === 0) {
    await prisma.shieldRule.create({
      data: {
        shopId,
        enabled: true,
        windowHours: 24,
        maxSpendNoPurchase: 500,
        dailyRiskCap: 1000,
      },
    });
    rules = await prisma.shieldRule.findMany({ where: { shopId, enabled: true } });
  }

  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - 3);
  const providerData = await fetchAllSpendAndConversions(shopId, { since, until });

  let shopifyRevenue = 0;
  if (admin) {
    try {
      const m = await getPaidOrdersMetrics(admin, { sinceDays: 3 });
      shopifyRevenue = m.revenue;
    } catch (_) {}
  }

  const alertsCreated = [];

  for (const rule of rules) {
    const windowHours = rule.windowHours || 24;
    const maxSpendNoPurchase = rule.maxSpendNoPurchase;
    const targetCPA = rule.targetCPA;
    const minROAS = rule.minROAS;
    const dailyRiskCap = rule.dailyRiskCap ?? shop.dailyRiskCap;

    const provider = rule.provider ? rule.provider : null;
    const sources = provider ? [provider] : Object.keys(providerData);

    for (const prov of sources) {
      const data = providerData[prov];
      if (!data) continue;

      const spend = data.spend ?? 0;
      const purchases = data.purchases ?? 0;

      if (maxSpendNoPurchase != null && spend >= maxSpendNoPurchase && purchases === 0) {
        const severity = spend >= (dailyRiskCap || 999999) ? SEVERITY.critical : SEVERITY.warn;
        const alert = await prisma.shieldAlert.create({
          data: {
            shopId,
            provider: prov,
            severity,
            type: ALERT_TYPES.NO_PURCHASE_SPEND,
            title: "Spend without purchases",
            message: `${prov}: ${spend.toFixed(2)} spent in last ${windowHours}h with no purchases.`,
            data: JSON.stringify({ spend, purchases, windowHours, ruleId: rule.id }),
            status: "OPEN",
          },
        });
        alertsCreated.push(alert);
      }

      if (targetCPA != null && purchases > 0) {
        const cpa = spend / purchases;
        if (cpa > targetCPA) {
          const alert = await prisma.shieldAlert.create({
            data: {
              shopId,
              provider: prov,
              severity: SEVERITY.warn,
              type: ALERT_TYPES.CPA_TOO_HIGH,
              title: "CPA above target",
              message: `${prov}: CPA ${cpa.toFixed(2)} > target ${targetCPA}.`,
              data: JSON.stringify({ cpa, targetCPA, spend, purchases }),
              status: "OPEN",
            },
          });
          alertsCreated.push(alert);
        }
      }

      if (minROAS != null && spend > 0 && shopifyRevenue > 0) {
        const roas = shopifyRevenue / spend;
        if (roas < minROAS) {
          const alert = await prisma.shieldAlert.create({
            data: {
              shopId,
              provider: prov,
              severity: SEVERITY.warn,
              type: ALERT_TYPES.ROAS_LOW,
              title: "ROAS below minimum",
              message: `${prov}: ROAS ${roas.toFixed(2)} < min ${minROAS}.`,
              data: JSON.stringify({ roas, minROAS, spend, revenue: shopifyRevenue }),
              status: "OPEN",
            },
          });
          alertsCreated.push(alert);
        }
      }
    }
  }

  if (shop.autopilotEnabled) {
    for (const alert of alertsCreated) {
      if (alert.severity === SEVERITY.critical) {
        const meta = getMetaProvider();
        if (meta.pauseEntities) {
          await meta.pauseEntities(shopId, { alertId: alert.id });
        }
      }
    }
  }

  return { alerts: alertsCreated };
}

export async function getOpenAlerts(shopId, sinceDays = 30) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);
  return prisma.shieldAlert.findMany({
    where: { shopId, status: "OPEN", createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getShieldRules(shopId) {
  let rules = await prisma.shieldRule.findMany({ where: { shopId } });
  if (rules.length === 0) {
    await prisma.shieldRule.create({
      data: {
        shopId,
        enabled: true,
        windowHours: 24,
        maxSpendNoPurchase: 500,
        dailyRiskCap: 1000,
      },
    });
    rules = await prisma.shieldRule.findMany({ where: { shopId } });
  }
  return rules;
}

export async function saveShieldRules(shopId, rulesInput) {
  const rules = Array.isArray(rulesInput) ? rulesInput : [rulesInput];
  for (const r of rules) {
    if (r.id) {
      await prisma.shieldRule.update({
        where: { id: r.id },
        data: {
          enabled: r.enabled !== false,
          windowHours: r.windowHours ?? 24,
          maxSpendNoPurchase: r.maxSpendNoPurchase != null ? r.maxSpendNoPurchase : undefined,
          targetCPA: r.targetCPA != null ? r.targetCPA : undefined,
          minROAS: r.minROAS != null ? r.minROAS : undefined,
          dailyRiskCap: r.dailyRiskCap != null ? r.dailyRiskCap : undefined,
        },
      });
    } else {
      await prisma.shieldRule.create({
        data: {
          shopId,
          provider: r.provider || null,
          enabled: r.enabled !== false,
          windowHours: r.windowHours ?? 24,
          maxSpendNoPurchase: r.maxSpendNoPurchase ?? undefined,
          targetCPA: r.targetCPA ?? undefined,
          minROAS: r.minROAS ?? undefined,
          dailyRiskCap: r.dailyRiskCap ?? undefined,
        },
      });
    }
  }
  return getShieldRules(shopId);
}
