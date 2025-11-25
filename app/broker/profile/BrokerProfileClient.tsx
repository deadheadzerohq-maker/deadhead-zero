"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface BrokerProfileForm {
  fullName: string;
  companyName: string;
  dotNumber: string;
  phone: string;
  website: string;
}

export default function BrokerProfileClient() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<BrokerProfileForm>({
    fullName: "",
    companyName: "",
    dotNumber: "",
    phone: "",
    website: "",
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("pending");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const meta = (user.user_metadata ?? {}) as Record<string, any>;
      if (meta.role !== "broker") {
        router.push("/");
        return;
      }

      setEmail(user.email ?? "");
      setSubscriptionStatus(meta.subscription_status ?? "pending");
      setPlan(meta.plan ?? "");

      setForm({
        fullName: meta.fullName ?? "",
        companyName: meta.companyName ?? "",
        dotNumber: meta.dotNumber ?? "",
        phone: meta.phone ?? "",
        website: meta.website ?? "",
      });

      setLoading(false);
    });
  }, [router]);

  const handleChange = (field: keyof BrokerProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const supabase = supabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          role: "broker",
          fullName: form.fullName,
          companyName: form.companyName,
          dotNumber: form.dotNumber,
          phone: form.phone,
          website: form.website,
          plan: plan || "broker-platform-799",
          subscription_status: subscriptionStatus || "pending",
          billing_model: "monthly-799",
        },
      });

      if (error) {
        setErrorMsg(error.message || "Unable to save profile.");
        return;
      }

      setMessage("Profile saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-1">Broker profile</h1>
            <p className="text-xs text-slate-400">
              Manage your account details, subscription status, and platform settings.
            </p>
          </div>
          {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
        </div>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold mb-3">Account details</h2>
            {loading ? (
              <p className="text-[11px] text-slate-400">Loading profile…</p>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 text-xs md:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">Full name</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">Company</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">DOT number (optional)</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.dotNumber}
                      onChange={(e) => handleChange("dotNumber", e.target.value)}
                      placeholder="If applicable"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">Phone (optional)</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Contact phone"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1 text-slate-400">Website (optional)</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2">
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
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs md:text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold mb-2">Subscription & billing</h2>
              <p className="text-[11px] text-slate-400 mb-2">
                Broker accounts use a platform subscription of <span className="font-semibold">$799/month</span>,
                billed immediately at registration and every 30 days thereafter. You can cancel any time; access
                continues until the end of the current billing period.
              </p>
              <p className="text-[11px] text-slate-400 mb-2">
                Current status:{" "}
                <span className="font-semibold text-emerald-300">{subscriptionStatus || "unknown"}</span>
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                Billing is handled via your payment provider. Once your Stripe customer portal is configured, a button
                will appear here to let you update payment details or cancel on your own.
              </p>
              <p className="text-[11px] text-slate-400">
                To update payment info or cancel today, email{" "}
                <a href="mailto:support@deadheadzero.com" className="underline">
                  support@deadheadzero.com
                </a>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-rose-900 bg-rose-950/40 p-5">
              <h2 className="text-sm font-semibold text-rose-200 mb-2">Account deletion</h2>
              <p className="text-[11px] text-rose-100 mb-2">
                If you want your account and associated personal data removed from Deadhead Zero, contact us and we
                will process your request.
              </p>
              <p className="text-[11px] text-rose-200">
                Email{" "}
                <a href="mailto:support@deadheadzero.com" className="underline">
                  support@deadheadzero.com
                </a>{" "}
                from the address associated with this account and request deletion. Account deletion is permanent and
                cannot be undone.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
