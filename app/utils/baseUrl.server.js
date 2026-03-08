/**
 * Server-only: get the public base URL of the app for OAuth redirects.
 * @param {Request} request
 * @returns {string} Base URL without trailing slash
 */
export function getBaseUrl(request) {
  const env = process.env.SHOPIFY_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  return `${proto}://${host}`.replace(/\/$/, "");
}
