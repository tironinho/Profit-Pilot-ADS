export function getAppUrlFromEnv(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!env) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  return env.replace(/\/$/, "");
}
