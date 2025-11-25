"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type LoadRow = {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  delivery_date: string | null;
  broker_company: string | null;
  broker_contact_name: string | null;
  broker_badge_level: string | null;
  created_at: string | null;
};

function getBrokerBadge(level: string | null | undefined) {
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

export default function OwnerProfileClient() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loads, setLoads] = useState<LoadRow[]>([]);
  const [loadsError, setLoadsError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const meta = (user.user_metadata ?? {}) as Record<string, any>;
      if (meta.role !== "owner") {
        router.push("/");
        return;
      }
      setEmail(user.email ?? "");
      setLoading(false);

      try {
        const { data: loadsData, error } = await supabase
          .from("loads")
          .select(
            "id, origin, destination, pickup_date, delivery_date, broker_company, broker_contact_name, broker_badge_level, created_at"
          )
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) {
          setLoadsError(
            error.message ||
              "Unable to load posted loads. Ensure the 'loads' table exists in Supabase with the expected columns."
          );
        } else {
          setLoads((loadsData ?? []) as LoadRow[]);
        }
      } catch (err: any) {
        setLoadsError("Unable to load posted loads.");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-1">Admin profile</h1>
            <p className="text-xs text-slate-400">
              Owner-level view for platform operations. Hidden from all other users.
            </p>
          </div>
          {!loading && email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
        </div>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="text-sm font-semibold mb-2">Admin & security</h2>
            <p className="text-[11px] text-slate-400 mb-2">
              This admin account is for monitoring platform activity and high-level health only. It is not advertised
              anywhere in the product and is accessible only by direct login.
            </p>
            <p className="text-[11px] text-rose-100 mb-2">
              Do not share this admin login with anyone. The admin account can see summarized views of broker and carrier
              activity and is intended solely for platform operations.
            </p>
            <p className="text-[11px] text-rose-200">
              For day-to-day use, create separate broker or carrier accounts rather than using the owner login.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <h2 className="text-sm font-semibold mb-2">All posted loads</h2>
            <p className="text-[11px] text-slate-400 mb-3">
              View all loads posted by brokers across the platform along with their reputation badges. This is a
              read-only operational view; you still do not arrange transportation or handle freight payments.
            </p>

            {loadsError && (
              <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2 mb-3">
                {loadsError}
              </div>
            )}

            {!loadsError && loads.length === 0 && (
              <p className="text-[11px] text-slate-500">No loads have been posted yet.</p>
            )}

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {loads.map((load) => {
                const badge = getBrokerBadge(load.broker_badge_level);
                return (
                  <div
                    key={load.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold">
                        {load.origin} → {load.destination}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Pickup: {load.pickup_date || "n/a"} · Delivery: {load.delivery_date || "n/a"}
                      </p>
                      {load.created_at && (
                        <p className="text-[10px] text-slate-500">Posted: {new Date(load.created_at).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="w-full md:w-60 text-[11px] text-slate-300 space-y-1">
                      <p className="font-semibold">{load.broker_company || "Unknown broker"}</p>
                      {load.broker_contact_name && <p>{load.broker_contact_name}</p>}
                      <div
                        className={`inline-flex items-center gap-1 mt-1 rounded-full px-2 py-1 ${badge.bg} ${badge.color}`}
                      >
                        <span className="text-xs">{badge.icon}</span>
                        <span className="text-[10px] uppercase tracking-wide">{badge.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              Deadhead Zero remains a technology platform only. Load visibility is provided for monitoring and analytics;
              all transportation arrangements and payments occur directly between brokers and carriers.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
