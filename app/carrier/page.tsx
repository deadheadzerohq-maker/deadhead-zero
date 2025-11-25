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

export default function CarrierDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const role = (user?.user_metadata?.role as string | undefined) ?? null;

      setAuthorized(role === "carrier");
      setEmail(user?.email ?? null);
      setLoading(false);

      setSuggestions([
        { id: "1", origin: "Dallas, TX", destination: "Atlanta, GA", savingsMiles: 120 },
        { id: "2", origin: "Chicago, IL", destination: "Columbus, OH", savingsMiles: 80 },
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
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Carrier dashboard</h1>
                <p className="text-xs text-slate-400">
                  See AI-matched loads, suggestions to reduce deadhead, and how brokers are performing.
                </p>
              </div>
              {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
            </div>

            {/* Carrier app nav */}
            <div className="mb-6 flex flex-wrap gap-2 text-[11px] md:text-xs">
              <Link
                href="/carrier"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
              >
                Overview
              </Link>
              <Link
                href="/carrier/matches"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
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

            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-1">Matched loads (coming soon)</h3>
                  <p className="text-[11px] text-slate-400 mb-2">
                    As AI matching is wired in, this card will surface the loads that best fit your home base, lanes,
                    and equipment.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    You&apos;ll see why you were matched, broker reputation badges, and quick contact options.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-1">Deadhead reduction ideas</h3>
                  <p className="text-[11px] text-slate-400 mb-3">
                    These are example lanes where Grok-like logic would suggest ways to tighten your network and cut
                    empty miles.
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {suggestions.map((s) => (
                      <li key={s.id}>
                        <span className="font-semibold">
                          {s.origin} → {s.destination}
                        </span>{" "}
                        could save approximately{" "}
                        <span className="font-mono">{s.savingsMiles.toLocaleString()} miles</span> per month with the
                        right freight mix.
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold mb-1">Broker score (concept)</h3>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Future versions will show broker badges for on-time pay, communication, and load quality so you can
                    quickly assess risk.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Scores will be based on anonymized feedback and event timing—never on Deadhead Zero acting as a
                    broker or holding funds.
                  </p>
                </div>
              </div>

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
