"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = supabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message || "Unable to send reset email.");
        return;
      }

      setMessage("If an account exists for this email, a password reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-950 text-slate-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h1 className="text-xl font-semibold mb-2">Reset your password</h1>
          <p className="text-xs text-slate-400 mb-4">
            Enter the email associated with your Deadhead Zero account and we&apos;ll email you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2">
                {errorMsg}
              </div>
            )}
            {message && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-900 rounded-md px-3 py-2">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-500 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
