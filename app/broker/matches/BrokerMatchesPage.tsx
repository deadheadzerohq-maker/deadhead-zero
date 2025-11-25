"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type CarrierBadgeLevel = "gold" | "silver" | "bronze" | "new" | "unrated";

interface BrokerMatch {
  id: string;
  loadOrigin: string;
  loadDestination: string;
  matchScore: number;
  carrierName: string;
  carrierCompany: string;
  carrierEmail: string;
  carrierPhone?: string;
  homeBase?: string;
  equipment: string[];
  badgeLevel: CarrierBadgeLevel;
  reason: string;
}

function getCarrierBadge(level: CarrierBadgeLevel) {
  switch (level) {
    case "gold":
      return { label: "Premier carrier", icon: "🚚", color: "text-emerald-300", bg: "bg-emerald-500/10" };
    case "silver":
      return { label: "Trusted carrier", icon: "✔", color: "text-slate-200", bg: "bg-slate-500/10" };
    case "bronze":
      return { label: "Growing carrier", icon: "▲", color: "text-amber-300", bg: "bg-amber-500/10" };
    case "new":
      return { label: "New on Deadhead Zero", icon: "🆕", color: "text-emerald-300", bg: "bg-emerald-500/10" };
    default:
      return { label: "Unrated", icon: "○", color: "text-slate-400", bg: "bg-slate-700/20" };
  }
}

export default function BrokerMatchesPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<BrokerMatch[]>([]);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const meta = (user?.user_metadata ?? {}) as Record<string, any>;
      const role = (meta.role as string | undefined) ?? null;
      const status = (meta.subscription_status as string | undefined) ?? "pending";

      setAuthorized(role === "broker");
      setEmail(user?.email ?? null);
      setSubscriptionStatus(status);
      setLoading(false);

      // Placeholder AI matches; will be replaced with real logic and Grok.
      setMatches([
        {
          id: "cm1",
          loadOrigin: "Dallas, TX",
          loadDestination: "Atlanta, GA",
          matchScore: 94,
          carrierName: "Alex Rivera",
          carrierCompany: "Rivera Transport LLC",
          carrierEmail: "alex@riveratransport.com",
          carrierPhone: "(555) 555-1010",
          homeBase: "Dallas, TX",
          equipment: ["53' dry van"],
          badgeLevel: "gold",
          reason: "Strong on-time delivery record on similar lanes with compatible equipment and home base.",
        },
        {
          id: "cm2",
          loadOrigin: "Chicago, IL",
          loadDestination: "Columbus, OH",
          matchScore: 86,
          carrierName: "Morgan Patel",
          carrierCompany: "Patel Hauling",
          carrierEmail: "morgan@patelhauling.com",
          carrierPhone: "(555) 555-2020",
          homeBase: "Indianapolis, IN",
          equipment: ["48' flatbed"],
          badgeLevel: "silver",
          reason: "Healthy performance on Midwest lanes with equipment that fits your load profile.",
        },
      ]);
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
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Matched carriers</h1>
                <p className="text-xs text-slate-400">
                  See the carriers Deadhead Zero has matched to your posted loads based on lanes, equipment, and
                  historical performance.
                </p>
              </div>
              {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
            </div>

            {/* Broker app nav */}
            <div className="mb-6 flex flex-wrap gap-2 text-[11px] md:text-xs">
              <Link
                href="/broker"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Overview
              </Link>
              <Link
                href="/broker/matches"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
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
                <p className="text-amber-100 mb-2">
                  Your broker account needs an active platform subscription to see AI-matched carriers. Once your $799
                  monthly subscription is active, matches will appear here.
                </p>
              </div>
            )}

            {!isLocked && (
              <section className="space-y-4">
                {matches.length === 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-[11px] text-slate-400">
                      As AI matching is wired in, carriers that best fit your loads will appear here with contact details
                      and performance badges.
                    </p>
                  </div>
                )}

                {matches.map((m) => {
                  const badge = getCarrierBadge(m.badgeLevel);
                  return (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="flex-1">
                        <h2 className="text-sm font-semibold mb-1">
                          Load: {m.loadOrigin} → {m.loadDestination}
                        </h2>
                        <p className="text-[11px] text-slate-400 mb-2">
                          Match score: <span className="font-mono text-emerald-300">{m.matchScore}</span>/100
                        </p>
                        <p className="text-[11px] text-slate-400 mb-2">{m.reason}</p>
                      </div>
                      <div className="w-full md:w-64 text-[11px] text-slate-300 space-y-1">
                        <p className="font-semibold">
                          {m.carrierName} — {m.carrierCompany}
                        </p>
                        {m.homeBase && <p>Home base: {m.homeBase}</p>}
                        <p>Equipment: {m.equipment.join(", ")}</p>
                        <p>
                          Email:{" "}
                          <a href={`mailto:${m.carrierEmail}`} className="text-emerald-300 underline">
                            {m.carrierEmail}
                          </a>
                        </p>
                        {m.carrierPhone && <p>Phone: {m.carrierPhone}</p>}
                        <div
                          className={`inline-flex items-center gap-1 mt-2 rounded-full px-2 py-1 ${badge.bg} ${badge.color}`}
                        >
                          <span className="text-xs">{badge.icon}</span>
                          <span className="text-[10px] uppercase tracking-wide">{badge.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <p className="text-[11px] text-slate-500 mt-4 max-w-3xl">
                  Deadhead Zero surfaces matches and carrier reputation signals only. You contact carriers directly and
                  negotiate your own agreements. The Platform never acts as a licensed freight broker or money transmitter
                  and never holds freight dollars.
                </p>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
