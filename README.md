# Deadhead Zero – AI Lane Intelligence SaaS (v4)

This is a production-style Next.js 14 app for **Deadhead Zero Logistics LLC** with:

- Landing page with black hero theme
- Broker, Carrier, Lane Targeting, and Owner dashboards
- Supabase auth (email/password) with role-based routing
- Seat-based broker plans with 2-day free trials (Stripe-ready)
- Carrier equipment capture for better AI matching
- Hidden Carrier Pro tier wired for future monetization
- Owner dashboard locked to `deadheadzerohq@gmail.com`
- Grok lane targeting stub ready for your API key

> **Legal:** Deadhead Zero is implemented as a pure technology platform. It does not arrange transportation, act as broker of record, or touch freight funds.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

GROK_API_KEY=your_grok_key
```

## Deploying

1. Upload this project into a GitHub repo.
2. Import the repo into Vercel.
3. Set env vars in Vercel matching `.env.local.example`.
4. Connect your domain `deadheadzero.com` to the Vercel project.

## Notes

- Auth and dashboards will work once Supabase is configured.
- Broker trials and plans are described in the UI; when you're ready you can connect Stripe Billing and use real subscriptions.
- Grok scoring is currently mocked for safety; replace the stub in `app/lane-targeting/page.tsx` with real API calls when you have your key.
