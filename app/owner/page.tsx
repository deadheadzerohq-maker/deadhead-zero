"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function OwnerDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const meta = (user?.user_metadata ?? {}) as Record<string, any>;
      const isOwner = meta.role === "owner";
      setAuthorized(isOwner);
      setEmail(user?.email ?? null);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        {!authorized && !loading && (
          <div className="max-w-md mx-auto rounded-2xl border border-rose-800 bg-rose-950/40 p-6 text-center">
            <h1 className="text-lg font-semibold mb-2">Admin only</h1>
            <p className="text-xs text-slate-300 mb-3">
              This area is for the Deadhead Zero owner account only. Please sign in with the correct admin login or
              contact support if you believe this is an error.
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
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Owner dashboard</h1>
                <p className="text-xs text-slate-400">
                  High-level view of platform health across brokers, carriers, and lanes.
                </p>
              </div>
              {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
            </div>

            {/* Owner app nav */}
            <div className="mb-6 flex flex-wrap gap-2 text-[11px] md:text-xs">
              <Link
                href="/owner"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
              >
                Overview
              </Link>
              <Link
                href="/owner/profile"
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Admin profile
              </Link>
            </div>

            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h2 className="text-sm font-semibold mb-1">Broker footprint</h2>
                  <p className="text-[11px] text-slate-400 mb-2">
                    This card will surface how many active broker accounts you have, which ones are most engaged, and
                    which are at risk of churn.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Grok can generate narrative summaries about which broker segments are growing and which need
                    attention.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h2 className="text-sm font-semibold mb-1">Carrier footprint</h2>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Track how many carriers are regularly matching to loads and where they are based.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Useful for seeing coverage gaps in your network and prioritizing new carrier outreach.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <h2 className="text-sm font-semibold mb-1">Lane intelligence</h2>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Aggregate view of which lanes are driving the most activity, where deadhead risk is highest, and
                    which brokers are over/under-indexed.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Over time, Grok can summarize trends for you automatically.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h2 className="text-sm font-semibold mb-2">Activity & risk</h2>
                <p className="text-[11px] text-slate-300 mb-2">
                  Alerts for inactive brokers, carriers, and lanes. Feed this into your sales and customer success
                  motions.
                </p>
                <p className="text-[11px] text-slate-500">
                  Logic will plug into your production usage events so you can see which accounts are at risk or ready
                  for upsell.
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
