/**
 * Optional cron: when ENABLE_CRON=1, run shield evaluation periodically.
 * In production call this from a scheduler. Simple in-memory lock per shop.
 */
import prisma from "../db.server.js";
import { evaluateShield } from "../services/shield.server.js";

const runningShops = new Set();

export async function runScheduledShield() {
  if (process.env.ENABLE_CRON !== "1") return;
  const shops = await prisma.shop.findMany({
    where: { autopilotEnabled: true },
    select: { id: true },
  });
  for (const shop of shops) {
    if (runningShops.has(shop.id)) continue;
    runningShops.add(shop.id);
    try {
      await evaluateShield({ shopId: shop.id });
    } catch (e) {
      console.error("[Cron] Shield error shop", shop.id, e);
    } finally {
      runningShops.delete(shop.id);
    }
  }
}
