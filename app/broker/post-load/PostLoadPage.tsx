"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface LoadFormState {
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  weightLbs: string;
  rateOffer: string;
  notes: string;
}

export default function PostLoadPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("pending");
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<LoadFormState>({
    origin: "",
    destination: "",
    pickupDate: "",
    deliveryDate: "",
    equipment: "",
    weightLbs: "",
    rateOffer: "",
    notes: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const meta = (user?.user_metadata ?? {}) as Record<string, any>;
      const role = (meta.role as string | undefined) ?? null;
      const status = (meta.subscription_status as string | undefined) ?? "pending";

      setAuthorized(role === "broker");
      setSubscriptionStatus(status);
      setEmail(user?.email ?? null);
      setLoadingUser(false);
    });
  }, []);

  const isLocked = authorized && subscriptionStatus !== "active";

  const handleChange = (field: keyof LoadFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);

    if (!authorized) {
      setErrorMsg("Only broker accounts can post loads.");
      return;
    }
    if (isLocked) {
      setErrorMsg("Your subscription must be active before posting loads.");
      return;
    }

    if (
      !form.origin ||
      !form.destination ||
      !form.pickupDate ||
      !form.deliveryDate ||
      !form.equipment ||
      !form.weightLbs ||
      !form.rateOffer
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const weightNumber = Number(form.weightLbs.replace(/,/g, ""));
    if (!Number.isFinite(weightNumber) || weightNumber <= 0) {
      setErrorMsg("Please enter a valid weight in pounds.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = supabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setErrorMsg("You must be signed in as a broker to post a load.");
        return;
      }

      const meta = (user.user_metadata ?? {}) as Record<string, any>;
      const brokerCompany = (meta.companyName as string) || (meta.company as string) || "";
      const brokerContactName = (meta.fullName as string) || "";
      const brokerBadgeLevel = (meta.broker_badge_level as string) || "new";

      const insertPayload = {
        broker_id: user.id,
        origin: form.origin,
        destination: form.destination,
        pickup_date: form.pickupDate,
        delivery_date: form.deliveryDate,
        equipment: form.equipment,
        weight_lbs: weightNumber,
        rate_offer: form.rateOffer,
        notes: form.notes,
        broker_company: brokerCompany,
        broker_contact_name: brokerContactName,
        broker_badge_level: brokerBadgeLevel,
      };

      const { error } = await supabase.from("loads").insert(insertPayload);

      if (error) {
        setErrorMsg(
          error.message ||
            "Unable to post load. Ensure the 'loads' table exists in Supabase with matching columns for this payload."
        );
        return;
      }

      setMessage("Load posted successfully. AI matching will surface carriers once wired in.");
      setForm({
        origin: "",
        destination: "",
        pickupDate: "",
        deliveryDate: "",
        equipment: "",
        weightLbs: "",
        rateOffer: "",
        notes: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        {!authorized && !loadingUser && (
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
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">Post a load</h1>
                <p className="text-xs text-slate-400">
                  Enter all required details so AI can match this load with the best carriers. Contact details are shared
                  directly between you and the carrier.
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
                className="rounded-full border border-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800/60"
              >
                Matches
              </Link>
              <Link
                href="/broker/post-load"
                className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-200 font-medium"
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
                  Your broker account needs an active platform subscription to post loads. Once your $799 monthly
                  subscription is active, you&apos;ll be able to post loads and see AI matches.
                </p>
              </div>
            )}

            {!isLocked && (
              <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Origin *</label>
                      <input
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.origin}
                        onChange={(e) => handleChange("origin", e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Destination *</label>
                      <input
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.destination}
                        onChange={(e) => handleChange("destination", e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Pickup date *</label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.pickupDate}
                        onChange={(e) => handleChange("pickupDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Delivery date *</label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.deliveryDate}
                        onChange={(e) => handleChange("deliveryDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Equipment *</label>
                      <input
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.equipment}
                        onChange={(e) => handleChange("equipment", e.target.value)}
                        placeholder="e.g. 53' dry van"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Weight (lbs) *</label>
                      <input
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.weightLbs}
                        onChange={(e) => handleChange("weightLbs", e.target.value)}
                        placeholder="e.g. 42000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1 text-slate-400">Rate offer (USD) *</label>
                      <input
                        className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500"
                        value={form.rateOffer}
                        onChange={(e) => handleChange("rateOffer", e.target.value)}
                        placeholder="e.g. 3200 all-in"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">Notes / special instructions</label>
                    <textarea
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 outline-none focus:border-emerald-500 min-h-[80px]"
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Any accessorials, appointment requirements, or special considerations."
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2">
                      {errorMsg}
                    </div>
                  )}
                  {message && (
                    <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-md px-3 py-2">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {submitting ? "Posting..." : "Post load"}
                  </button>
                </form>

                <p className="mt-4 text-[11px] text-slate-500 max-w-3xl">
                  Deadhead Zero only stores the load details and surfaces AI matches. All rate negotiations,
                  confirmations, and payments occur directly between you and the carrier. The Platform does not act as a
                  licensed freight broker or money transmitter and never holds freight dollars.
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
