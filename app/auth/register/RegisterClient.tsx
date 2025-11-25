"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type Role = "broker" | "carrier";

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || "broker";

  const [role, setRole] = useState<Role>(initialRole);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dotNumber, setDotNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setErrorMsg("You must acknowledge the platform terms before creating an account.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowserClient();

      const metadata: Record<string, any> = {
        role,
        fullName,
        companyName,
        dotNumber,
      };

      if (role === "broker") {
        metadata.plan = "broker-platform-799";
        metadata.subscription_status = "pending"; // backend/Stripe webhook should set to "active" on successful payment
        metadata.billing_model = "monthly-799";
      } else {
        metadata.plan = "carrier-free";
        metadata.subscription_status = "free";
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?from=email_confirm`,
          data: metadata,
        },
      });

      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        const looksDuplicate =
          msg.includes("already registered") ||
          msg.includes("user already exists") ||
          msg.includes("duplicate key");

        if (looksDuplicate) {
          setErrorMsg("Email already registered. Please log in.");
          setTimeout(() => {
            router.push(
              `/auth/login?email=${encodeURIComponent(email)}&from=signup_duplicate`
            );
          }, 900);
          return;
        }

        setErrorMsg(error.message || "Something went wrong creating your account.");
        return;
      }

      // After signup + email confirmation, brokers will need an active subscription to use the broker dashboard.
      router.push(`/auth/login?email=${encodeURIComponent(email)}&from=signup`);
    } finally {
      setLoading(false);
    }
  };

  const isBroker = role === "broker";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-950 text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h1 className="text-xl font-semibold mb-1">Create your account</h1>
          {isBroker ? (
            <p className="text-xs text-slate-400 mb-4">
              Broker accounts require a platform subscription of{" "}
              <span className="font-semibold text-emerald-300">$799/month</span>. Billing occurs immediately upon
              registration and then every 30 days thereafter. You can cancel at any time; access continues until the
              end of the current billing period.
            </p>
          ) : (
            <p className="text-xs text-slate-400 mb-4">
              Carrier accounts are free. You&apos;ll receive AI-matched loads and insights based on your lanes and
              equipment.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-2 text-xs">
              <button
                type="button"
                onClick={() => setRole("broker")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  role === "broker"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                Broker
              </button>
              <button
                type="button"
                onClick={() => setRole("carrier")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  role === "carrier"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                Carrier
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs mb-1">Full name</label>
                <input
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Company</label>
                <input
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1">DOT number (optional)</label>
                <input
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={dotNumber}
                  onChange={(e) => setDotNumber(e.target.value)}
                  placeholder="If applicable"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Work email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400 border border-slate-800 rounded-lg p-3 bg-black/40">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="agree">
                I understand that Deadhead Zero is a technology platform only. Deadhead Zero is{" "}
                <span className="font-semibold">not a licensed freight broker or money transmitter</span>, does not
                arrange transportation, does not negotiate freight, and does not hold freight dollars. All transportation
                arrangements, payments, compliance, and communications occur directly between brokers and carriers.{" "}
                {isBroker && (
                  <>
                    I acknowledge that for broker accounts, platform subscription fees of{" "}
                    <span className="font-semibold">$799/month</span> will be billed immediately upon registration and
                    then every 30 days thereafter until cancelled. I understand I can cancel at any time and that access
                    may be suspended if payment is not received.
                  </>
                )}{" "}
                I agree to the{" "}
                <a href="/terms" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-500 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
