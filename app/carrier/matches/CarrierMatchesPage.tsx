"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type BrokerBadgeLevel = "gold" | "silver" | "bronze" | "new" | "unrated";

interface CarrierMatch {
  id: string;
  origin: string;
  destination: string;
  matchScore: number;
  brokerCompany: string;
  brokerContact: string;
  brokerEmail: string;
  brokerPhone?: string;
  badgeLevel: BrokerBadgeLevel;
  reason: string;
}

function getBrokerBadge(level: BrokerBadgeLevel) {
  switch (level) {
    case "gold":
      return { label: "Premier broker", icon: "⭐", color: "text-yellow-300", bg: "bg-yellow-500/10" };
    case "silver":
      return { label: "Trusted broker", icon: "⬡", color: "text-slate-200", bg: "bg-slate-500/10" };
    case "bronze":
      return { label: "Growing broker", icon: "◆", color: "text-amber-300", bg: "bg-amber-500/10" };
    case "new":
      return { label: "New on Deadhead Zero", icon: "🆕", color: "text-emerald-300", bg: "bg-emerald-500/10" };
    default:
      return { label: "Unrated", icon: "○", color: "text-slate-400", bg: "bg-slate-700/20" };
  }
}

export default function CarrierMatchesPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<CarrierMatch[]>([]);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const role = (user?.user_metadata?.role as string | undefined) ?? null;

      setAuthorized(role === "carrier");
      setEmail(user?.email ?? null);
      setLoading(false);

      // Placeholder AI-matched loads. In production, this will be fed by real matching & Grok.
      setMatches([
        {
          id: "m1",
          origin: "Dallas, TX",
          destination: "Atlanta, GA",
          matchScore: 96,
          brokerCompany: "Signal Freight LLC",
          brokerContact: "Jordan Lee",
          brokerEmail: "jordan@signal-freight.com",
          brokerPhone: "(555) 123-4510",
          badgeLevel: "gold",
          reason: "Consistent reefer freight on your preferred lane with excellent on-time pay history.",
        },
        {
          id: "m2",
          origin: "Chicago, IL",
          destination: "Columbus, OH",
          matchScore: 88,
          brokerCompany: "Blue Ridge Logistics",
          brokerContact: "Taylor Smith",
          brokerEmail: "taylor@blueridgelog.com",
          brokerPhone: "(555) 987-2222",
          badgeLevel: "silver",
          reason: "Short-haul dry van opportunities that line up with your home base and equipment.",
        },
      ]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        {!authorized && !loading && (
          <div className="max-w-md mx-auto rounded-2xl border border-rose-800 bg-rose-950/40 p-6 text-center">
            <h1 className="text-lg font-semibold mb-2">Not authorized</h1>
            <p className="text-xs text-slate-300 mb-3">
              This area is for carrier accounts only. Please sign in with a carrier account or contact support if you
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
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Matched loads</h1>
                <p className="text-xs text-slate-400">
                  Personalized AI-matching between your profile and broker-posted loads. Contact brokers directly to
                  move freight—Deadhead Zero stays a technology platform only.
                </p>
              </div>
              {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
            </div>

            {/* Carrier app nav */}
            <div className="mb-6 flex flex-wrap gap-2 text-[11px] md:text-xs">
              <Link
                href="/carrier"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Overview
              </Link>
              <Link
                href="/carrier/matches"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
              >
                Matches
              </Link>
              <Link
                href="/carrier/profile"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Profile & lanes
              </Link>
            </div>

            <section className="space-y-4">
              {matches.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[11px] text-slate-400">
                    As AI matching is wired in, any loads that fit your lanes and equipment will appear here with broker
                    contact details and badges.
                  </p>
                </div>
              )}

              {matches.map((m) => {
                const badge = getBrokerBadge(m.badgeLevel);
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold mb-1">
                        {m.origin} → {m.destination}
                      </h2>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Match score: <span className="font-mono text-emerald-300">{m.matchScore}</span>/100
                      </p>
                      <p className="text-[11px] text-slate-400 mb-2">{m.reason}</p>
                    </div>
                    <div className="w-full md:w-64 text-[11px] text-slate-300 space-y-1">
                      <p className="font-semibold">{m.brokerCompany}</p>
                      <p>{m.brokerContact}</p>
                      <p>
                        Email:{" "}
                        <a href={`mailto:${m.brokerEmail}`} className="text-emerald-300 underline">
                          {m.brokerEmail}
                        </a>
                      </p>
                      {m.brokerPhone && <p>Phone: {m.brokerPhone}</p>}
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
                Deadhead Zero only surfaces matches and reputation signals. All conversations, agreements, and payments
                are handled directly between you and the broker. The platform never acts as a licensed freight broker or
                money transmitter and never holds freight dollars.
              </p>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
