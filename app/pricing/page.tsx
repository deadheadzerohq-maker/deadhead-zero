import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="flex-1 mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Simple pricing</h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl mb-8">
          One platform subscription for brokers. Carriers get free access to see matched loads and performance insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start">
          {/* Broker plan */}
          <div className="rounded-2xl border border-emerald-500/70 bg-slate-950/80 p-6 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
            <h2 className="text-lg font-semibold mb-1">Deadhead Zero Platform</h2>
            <p className="text-xs text-emerald-300 mb-4">
              Full-lane intelligence, AI matching, and analytics for brokers.
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-semibold">$799</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Billed immediately at registration and every 30 days thereafter. Cancel any time; your access continues
              until the end of the current billing period.
            </p>
            <ul className="text-[11px] text-slate-200 space-y-1 mb-5">
              <li>• Unlimited broker users under one organization</li>
              <li>• AI-powered lane scoring and deadhead risk insights</li>
              <li>• AI matching between your posted loads and signed-up carriers</li>
              <li>• Reputation signals and Grok-powered narratives</li>
              <li>• Owner/admin analytics and monitoring</li>
            </ul>
            <div className="text-xs text-slate-400 mb-4">
              <p className="mb-1">
                This is a{" "}
                <span className="font-semibold">
                  technology platform subscription only; Deadhead Zero is not a licensed freight broker or money
                  transmitter and never holds freight dollars.
                </span>
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/auth/register?role=broker"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
              >
                Start broker subscription
              </Link>
            </div>
          </div>

          {/* Carrier info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="text-sm font-semibold mb-1">Carrier access</h2>
            <p className="text-xs text-slate-400 mb-3">
              Carriers can sign up for free to receive AI-matched loads and performance insights. No subscription fee is
              charged for carrier accounts.
            </p>
            <ul className="text-[11px] text-slate-200 space-y-1 mb-4">
              <li>• Free carrier profiles and lane preferences</li>
              <li>• AI-matched loads based on your lanes and equipment</li>
              <li>• Broker reputation signals and Grok explanations</li>
            </ul>
            <Link
              href="/auth/register?role=carrier"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800/70"
            >
              Sign up as a carrier
            </Link>
          </div>
        </div>

        <div className="mt-10 text-[11px] text-slate-500 max-w-3xl">
          <p className="mb-2">
            Technology platform only, not a licensed freight broker or money transmitter. We never hold freight dollars.
            All transportation arrangements, payments, and compliance remain strictly between brokers and carriers.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
