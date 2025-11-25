"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type SubscriptionStatus = "pending" | "active" | "free" | "canceled" | string;

interface Lane {
  id: string;
  origin: string;
  destination: string;
  score: number;
  deadheadRisk: number;
}

interface MyLoad {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  delivery_date: string | null;
  rate_offer: string | null;
  created_at: string | null;
}

export default function BrokerDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [myLoads, setMyLoads] = useState<MyLoad[]>([]);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      const role = (user?.user_metadata?.role as string | undefined) ?? null;
      const status = (user?.user_metadata?.subscription_status as SubscriptionStatus | undefined) ?? "pending";

      setEmail(user?.email ?? null);
      setSubscriptionStatus(status);
      setAuthorized(role === "broker");
      setLoading(false);

      // Mock lane data for the AI overview card
      setLanes([
        { id: "1", origin: "Dallas, TX", destination: "Seattle, WA", score: 88, deadheadRisk: 0.42 },
        { id: "2", origin: "Atlanta, GA", destination: "Chicago, IL", score: 82, deadheadRisk: 0.35 },
      ]);

      // Load this broker's posted loads for the "My loads" list
      if (user) {
        const { data: loadsData } = await supabase
          .from("loads")
          .select("id, origin, destination, pickup_date, delivery_date, rate_offer, created_at")
          .eq("broker_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);

        setMyLoads((loadsData ?? []) as MyLoad[]);
      }
    });
  }, []);

  const isLocked = authorized && subscriptionStatus !== "active";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        {!authorized && !loading && (
          <div className="max-w-md mx-auto rounded-2xl border border-rose-800 bg-rose-950/40 p-6 text-center">
            <h1 className="text-lg font-semibold mb-2">Not authorized</h1>
            <p className="text-xs text-slate-300 mb-3">
              This area is for broker accounts only. Please sign in with a broker account or contact support if you
              believe this is an error.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-black hover:bg-emerald-400"
            >
              Back to login
            </Link>
          </div>
        )}

        {authorized && (
          <>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Broker dashboard</h1>
                <p className="text-xs text-slate-400">
                  AI-powered lane intelligence, matching, and performance analytics for your brokerage.
                </p>
              </div>
              {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
            </div>

            {/* Broker app nav */}
            <div className="mb-6 flex flex-wrap gap-2 text-[11px] md:text-xs">
              <Link
                href="/broker"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
              >
                Overview
              </Link>
              <Link
                href="/broker/matches"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Matches
              </Link>
              <Link
                href="/broker/post-load"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Post load
              </Link>
              <Link
                href="/broker/profile"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Profile & billing
              </Link>
              <Link
                href="/lane-targeting"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Lane targeting
              </Link>
            </div>

            {isLocked && (
              <div className="mb-6 rounded-2xl border border-amber-500/70 bg-amber-950/40 p-4 text-[11px]">
                <h2 className="text-xs font-semibold text-amber-200 mb-1">Subscription required</h2>
                <p className="text-amber-100 mb-1">
                  Your broker account is currently locked because an active platform subscription has not been detected.
                </p>
                <p className="text-amber-100 mb-2">
                  Broker subscriptions are billed at <span className="font-semibold">$799/month</span>, charged
                  immediately upon registration and every 30 days thereafter. You can cancel at any time, but access may
                  be suspended if payment is not received.
                </p>
                <p className="text-amber-200">
                  Once your payment is processed and your subscription is marked active, you&apos;ll have full access to
                  Deadhead Zero&apos;s broker features. If you believe this is an error, contact{" "}
                  <a href="mailto:support@deadheadzero.com" className="underline">
                    support@deadheadzero.com
                  </a>
                  .
                </p>
              </div>
            )}

            {!isLocked && (
              <section className="space-y-6">
                {/* ROI snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-emerald-500/60 bg-emerald-500/5 p-4">
                    <h3 className="text-sm font-semibold mb-1">Estimated ROI</h3>
                    <p className="text-[11px] text-slate-300 mb-3">
                      High-level view of how your usage of Deadhead Zero may be compounding for your brokerage.
                      Estimates are directional only and should be cross-checked against your own P&L.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <p className="text-slate-400 mb-1">Loads posted</p>
                        <p className="text-lg font-semibold text-emerald-300">{myLoads.length}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Est. hours saved</p>
                        <p className="text-lg font-semibold text-emerald-300">
                          {Math.round(myLoads.length * 0.25)}
                        </p>
                        <p className="text-[10px] text-slate-500">Assuming 15 min saved per load</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Est. value ($)</p>
                        <p className="text-lg font-semibold text-emerald-300">
                          {Math.round(myLoads.length * 0.25 * 150)}
                        </p>
                        <p className="text-[10px] text-slate-500">At $150/hr fully loaded cost</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold mb-1">AI lane overview</h3>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Grok summarizes how your core lanes are performing and where to double down.
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {lanes.map((lane) => (
                        <li key={lane.id}>
                          <span className="font-semibold">
                            {lane.origin} → {lane.destination}
                          </span>
                          , score <span className="font-mono">{lane.score}</span>, deadhead{" "}
                          <span className="font-mono">{Math.round(lane.deadheadRisk * 100)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold mb-1">Reputation & payment</h3>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Future versions will surface an on-time payment score, carrier ratings, and Grok-powered
                      explanations of your reputation.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Scores are based on carrier feedback and event timestamps (e.g., when carriers report payment
                      received vs. due dates).
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-1">AI-matched carriers</h3>
                  <p className="text-[11px] text-slate-400 mb-3">
                    As AI matching is wired in, you&apos;ll see top carriers suggested for each load you post, with
                    explanations tailored by Grok.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Contact details are exchanged directly between you and the carrier. Deadhead Zero remains a
                    technology platform only.
                  </p>
                </div>

                {/* My loads list */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-2">My loads</h3>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Recent loads you&apos;ve posted to Deadhead Zero. AI uses this history, along with your lanes and
                    carrier behavior, to improve matching and ROI estimates.
                  </p>
                  {myLoads.length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      You haven&apos;t posted any loads yet. Once you start posting, they&apos;ll appear here for quick
                      reference.
                    </p>
                  )}
                  {myLoads.length > 0 && (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {myLoads.map((load) => (
                        <div
                          key={load.id}
                          className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-semibold">
                              {load.origin} → {load.destination}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Pickup: {load.pickup_date || "n/a"} · Delivery: {load.delivery_date || "n/a"}
                            </p>
                            {load.created_at && (
                              <p className="text-[10px] text-slate-500">
                                Posted: {new Date(load.created_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-[11px] text-slate-300">
                            <p className="text-xs font-semibold">
                              {load.rate_offer ? load.rate_offer : "Rate n/a"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-2">Posting loads & AI scoring</h3>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Future versions of this dashboard will allow you to post loads, have Grok score each load, and match
                    those loads to signed-up carriers based on their preferences and historical behavior.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Loads will automatically expire after a defined window if no matches occur, and both brokers and
                    carriers will receive direct notifications and emails when AI matches are identified.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
