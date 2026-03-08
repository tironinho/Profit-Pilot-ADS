/**
 * Server-only: provider and encryption availability from .env only.
 * Used by /app/connect to show Available / Unavailable (no DB config).
 */

export const metaEnabled =
  !!process.env.META_APP_ID && !!process.env.META_APP_SECRET;

export const googleEnabled =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const tiktokEnabled =
  !!process.env.TIKTOK_CLIENT_KEY && !!process.env.TIKTOK_CLIENT_SECRET;

export const encryptionEnabled = !!(
  process.env.APP_ENCRYPTION_KEY && process.env.APP_ENCRYPTION_KEY.trim().length > 0
);

/** Provider is available for Connect when ENV credentials exist and encryption is on */
export function isProviderAvailable(provider) {
  if (!encryptionEnabled) return false;
  switch (provider) {
    case "META":
      return metaEnabled;
    case "GOOGLE":
      return googleEnabled;
    case "TIKTOK":
      return tiktokEnabled;
    default:
      return false;
  }
}
