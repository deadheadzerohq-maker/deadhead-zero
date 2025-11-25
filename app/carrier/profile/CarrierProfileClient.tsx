"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface CarrierProfileForm {
  fullName: string;
  companyName: string;
  dotNumber: string;
  homeBase: string;
  phone: string;
  equipment: string;
}

export default function CarrierProfileClient() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<CarrierProfileForm>({
    fullName: "",
    companyName: "",
    dotNumber: "",
    homeBase: "",
    phone: "",
    equipment: "",
  });
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
      if (meta.role !== "carrier") {
        router.push("/");
        return;
      }

      setEmail(user.email ?? "");

      setForm({
        fullName: meta.fullName ?? "",
        companyName: meta.companyName ?? "",
        dotNumber: meta.dotNumber ?? "",
        homeBase: meta.homeBase ?? "",
        phone: meta.phone ?? "",
        equipment: Array.isArray(meta.equipment) ? meta.equipment.join(", ") : meta.equipment ?? "",
      });

      setLoading(false);
    });
  }, [router]);

  const handleChange = (field: keyof CarrierProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const supabase = supabaseBrowserClient();
      const equipmentArray = form.equipment
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.auth.updateUser({
        data: {
          role: "carrier",
          fullName: form.fullName,
          companyName: form.companyName,
          dotNumber: form.dotNumber,
          homeBase: form.homeBase,
          phone: form.phone,
          equipment: equipmentArray,
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
            <h1 className="text-2xl md:text-3xl font-semibold mb-1">Carrier profile</h1>
            <p className="text-xs text-slate-400">
              Manage your account details and the lanes and equipment you want to run.
            </p>
          </div>
          {email && <p className="text-[11px] text-slate-500">Signed in as {email}</p>}
        </div>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold mb-3">Account & lanes</h2>
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
                    <label className="block text-[11px] mb-1 text-slate-400">Home base</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.homeBase}
                      onChange={(e) => handleChange("homeBase", e.target.value)}
                      placeholder="City, state"
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
                    <label className="block text-[11px] mb-1 text-slate-400">Equipment</label>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                      value={form.equipment}
                      onChange={(e) => handleChange("equipment", e.target.value)}
                      placeholder="e.g. dry van, reefer, flatbed"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Separate multiple equipment types with commas. These preferences will be used when matching you to
                      loads.
                    </p>
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

          <div className="rounded-2xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="text-sm font-semibold text-rose-200 mb-2">Account deletion</h2>
            <p className="text-[11px] text-rose-100 mb-2">
              If you want your account and associated personal data removed from Deadhead Zero, contact us and we will
              process your request.
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
