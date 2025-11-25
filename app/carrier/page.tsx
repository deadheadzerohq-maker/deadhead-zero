"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface Suggestion {
  id: string;
  origin: string;
  destination: string;
  savingsMiles: number;
}

interface CarrierLoad {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  delivery_date: string | null;
  equipment: string | null;
  weight_lbs: number | null;
  rate_offer: string | number | null;
  broker_company: string | null;
  broker_contact_name: string | null;
  created_at: string | null;
}

interface CarrierMatch {
  id: string;
  match_score: number | null;
  explanation: string | null;
  created_at: string | null;
  loads: CarrierLoad | null;
}

const formatCurrency = (value: string | number | null) => {
  if (value === null || value === undefined || value === "") return "$0.00";

  const num =
    typeof value === "number"
      ? value
      : parseFloat(value.toString().replace(/,/g, ""));

  if (Number.isNaN(num)) return "$0.00";

  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CarrierDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [matches, setMatches] = useState<CarrierMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowserClient();

    const run = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;
      const role = (user?.user_metadata?.role as string | undefined) ?? null;

      setEmail(user?.email ?? null);

      if (error || !user || role !== "carrier") {
        setAuthorized(false);
        setLoading(false);
        setMatchesLoading(false);
        return;
      }

      setAuthorized(true);

      // Fetch only loads this carrier is matched to, via load_matches
      const { data: matchData, error: matchErr } = await supabase
        .from("load_matches")
        .select(
          `
          id,
          match_score,
          explanation,
          created_at,
          loads (
            id,
            origin,
            destination,
            pickup_date,
            delivery_date,
            equipment,
            weight_lbs,
            rate_offer,
            broker_company,
            broker_contact_name,
            created_at
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (matchErr) {
        console.error("Error loading matches for carrier", matchErr);
        setMatchesError("Unable to load matched loads right now.");
        setMatches([]);
      } else {
        setMatches((matchData ?? []) as CarrierMatch[]);
      }

      // Keep some lightweight “deadhead ideas” placeholder content
      setSuggestions([
        { id: "1", origin: "Dallas, TX", destination: "Atlanta, GA", savingsMiles: 120 },
        { id: "2", origin: "Chicago, IL", destination: "Columbus, OH", savingsMiles: 80 },
      ]);

      setLoading(false);
      setMatchesLoading(false);
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Nav />
      <main className="flex-1">
        {loading ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-sm text-slate-400">Loading your carrier workspace…</p>
          </div>
        ) : !authorized ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-xl font-semibold mb-2">Carrier access only</h1>
            <p className="text-sm text-slate-400 mb-4">
              This dashboard is reserved for carriers. If you believe you should have carrier access, log in with your
              carrier credentials or contact Deadhead Zero support.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 hover:bg-slate-800"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <section className="border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/80">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-emerald-300/80 mb-1">
                      Carrier workspace
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                      Keep trucks moving—without gambling on bad freight
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                      Deadhead Zero scores lanes and surfaces only the loads that match your profile. You stay in full
                      control of which brokers you work with and how you run your trucks.
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p className="font-mono text-[11px] text-slate-500">Signed in as</p>
                    <p className="font-semibold text-slate-100">{email}</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-slate-300">Carrier account</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
                  <Link
                    href="/carrier/matches"
                    className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-800"
                  >
                    View all matches
                  </Link>
                  <Link
                    href="/carrier/profile"
                    className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-800"
                  >
                    Carrier profile &amp; preferences
                  </Link>
                </div>
              </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Matched loads summary */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-semibold text-slate-300 mb-1">
                    Matched freight from trusted brokers
                  </p>
                  <p className="text-2xl font-semibold">
                    {matches.length}
                    <span className="text-sm text-slate-400 ml-1">active match{matches.length === 1 ? "" : "es"}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    You only see loads that Deadhead Zero has matched to your profile—not a random firehose of freight.
                  </p>
                </div>

                {/* Deadhead reduction ideas (placeholder) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-semibold text-slate-300 mb-1">
                    Deadhead reduction ideas
                  </p>
                  <ul className="space-y-1">
                    {suggestions.map((s) => (
                      <li key={s.id} className="flex justify-between text-[11px]">
                        <span className="text-slate-200">
                          {s.origin} → {s.destination}
                        </span>
                        <span className="text-emerald-300">
                          ~{s.savingsMiles} mi
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-500 mt-2">
                    As AI matching matures, these ideas will be driven by your real freight history and preferred lanes.
                  </p>
                </div>

                {/* Broker quality & risk (copy-only for now) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-semibold text-slate-300 mb-1">
                    Broker quality &amp; risk
                  </p>
                  <p className="text-sm text-slate-200 mb-1">
                    Reputation without the rumor mill.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Deadhead Zero will surface structured signals on brokers you&apos;re matched with—claims history,
                    payment reliability, and audit flags—so you can make informed decisions while staying in full
                    control.
                  </p>
                </div>
              </div>

              {/* Matched loads list */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Matched loads</h3>
                  {matchesLoading && (
                    <p className="text-[11px] text-slate-400">Loading…</p>
                  )}
                </div>

                {matchesError && (
                  <p className="text-[11px] text-rose-400 mb-2">
                    {matchesError}
                  </p>
                )}

                {!matchesLoading && !matchesError && matches.length === 0 && (
                  <p className="text-[11px] text-slate-400">
                    You don&apos;t have any matched loads yet. As brokers post freight that fits your profile, Deadhead
                    Zero will surface those opportunities here.
                  </p>
                )}

                {!matchesLoading && !matchesError && matches.length > 0 && (
                  <ul className="divide-y divide-slate-800">
                    {matches.map((m) => {
                      const load = m.loads;
                      if (!load) return null;

                      return (
                        <li
                          key={m.id}
                          className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-semibold">
                              {load.origin} → {load.destination}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {(load.pickup_date ?? "Pickup tbd")} •{" "}
                              {(load.delivery_date ?? "Delivery tbd")}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {load.equipment || "Equipment tbd"}
                              {typeof load.weight_lbs === "number" &&
                              !Number.isNaN(load.weight_lbs)
                                ? ` • ${load.weight_lbs.toLocaleString("en-US")} lbs`
                                : ""}
                            </p>
                          </div>

                          <div className="text-right text-[11px] text-slate-300">
                            <p className="text-xs font-semibold">
                              {load.rate_offer
                                ? formatCurrency(load.rate_offer)
                                : "Call for rate"}
                            </p>
                            {m.match_score !== null && !Number.isNaN(m.match_score) && (
                              <p className="text-[11px] text-emerald-300">
                                Match score: {Math.round(m.match_score * 100)}%
                              </p>
                            )}
                            {m.explanation && (
                              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                                {m.explanation}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-500">
                              {load.broker_company || "Broker details provided on request"}
                            </p>
                            {load.broker_contact_name && (
                              <p className="text-[11px] text-slate-500">
                                Contact: {load.broker_contact_name}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p className="mt-3 text-[11px] text-slate-500">
                  Deadhead Zero is a technology platform only. You decide which loads to accept and which brokers to
                  work with. This view is informational—not a brokerage or money transmission service.
                </p>
              </div>

              {/* Staying in control copy block */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-sm font-semibold mb-2">Staying in control</h3>
                <p className="text-[11px] text-slate-400 mb-2">
                  Deadhead Zero is a technology platform only. You decide which loads to accept, which brokers to work
                  with, and how to run your trucks. The goal is to surface signal—not tell you how to operate.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
