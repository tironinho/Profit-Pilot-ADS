/**
 * POST /api/data-deletion — Receives data deletion requests (TikTok/Meta/Google compliance).
 * Logs request and returns a request_id. No secrets are logged.
 */

const ALLOWED_PROVIDERS = ["meta", "google", "tiktok", "shopify", "all"];

function validate(body) {
  const { email, shopDomain, provider, message } = body || {};
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { error: "Valid email is required." };
  }
  if (!shopDomain || typeof shopDomain !== "string" || shopDomain.trim().length <= 3) {
    return { error: "Shop domain must be longer than 3 characters." };
  }
  if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
    return { error: "Provider must be one of: meta, google, tiktok, shopify, all." };
  }
  return {
    email: email.trim(),
    shopDomain: shopDomain.trim(),
    provider,
    message: typeof message === "string" ? message.trim() : "",
  };
}

export const loader = async ({ request }) => {
  if (request.method !== "GET") return new Response(null, { status: 405 });
  return new Response(
    JSON.stringify({ ok: false, error: "Method not allowed. Use POST." }),
    {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    },
  );
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed. Use POST." }),
      { status: 405, headers: { "Content-Type": "application/json" } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON body." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const validated = validate(body);
  if (validated.error) {
    return new Response(
      JSON.stringify({ ok: false, error: validated.error }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const requestId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const logPayload = {
    requestId,
    email: validated.email,
    shopDomain: validated.shopDomain,
    provider: validated.provider,
    message: validated.message,
    createdAt,
  };
  console.log("[data-deletion]", JSON.stringify(logPayload));

  return new Response(
    JSON.stringify({
      ok: true,
      requestId,
      message: "Request received. We will reply by email.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
