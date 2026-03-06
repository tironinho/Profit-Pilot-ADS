# ProfitPilot Ads — Marketing Site + Stripe Subscription (Next.js)

Deploy-ready Next.js (React) site for Vercel:
- Landing + Pricing
- Stripe Checkout (subscription)
- Stripe Billing Portal
- Success/cancel pages
- Minimal dashboard (reads Stripe customer cookie)

## Create the Stripe price ($49.90/month)
Stripe Dashboard:
- Products -> Add product
- Pricing: Recurring, Monthly, USD 49.90
- Copy the **Price ID** (looks like `price_...`) into `STRIPE_PRICE_ID`

## Configure environment variables
Create `.env.local`:
- copy `.env.example` and fill values

## Run locally
```bash
npm i
npm run dev
```

## Deploy to Vercel
- Import the project
- Set the env vars
- Deploy

## Webhook (optional)
Stripe webhook endpoint:
- URL: https://YOUR_DOMAIN/api/stripe/webhook
- Events: checkout.session.completed, customer.subscription.*, invoice.*
