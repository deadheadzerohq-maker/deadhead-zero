"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";

type Role = "broker" | "carrier" | "owner";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const linkClasses = (href: string) =>
    `text-xs md:text-sm px-3 py-1 rounded-full transition ${
      pathname === href ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"
    }`;

  useEffect(() => {
    const supabase = supabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        setIsAuthed(true);
        setRole((user.user_metadata?.role as Role) ?? null);
        setEmail(user.email ?? null);
      } else {
        setIsAuthed(false);
        setRole(null);
        setEmail(null);
      }
      setLoadingUser(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        setIsAuthed(true);
        setRole((user.user_metadata?.role as Role) ?? null);
        setEmail(user.email ?? null);
      } else {
        setIsAuthed(false);
        setRole(null);
        setEmail(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = supabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const dashboardHref =
    role === "carrier" ? "/carrier" : role === "owner" ? "/owner" : "/broker";

  const profileHref =
    role === "carrier" ? "/carrier/profile" : role === "owner" ? "/owner/profile" : "/broker/profile";

  const roleLabel =
    role === "carrier" ? "Carrier" : role === "owner" ? "Admin" : role === "broker" ? "Broker" : null;

  const shortEmail = email ? (email.length > 24 ? email.slice(0, 21) + "..." : email) : null;

  return (
    <header className="border-b border-slate-800/80 bg-black/40 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-400/10 border border-emerald-400/60 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-300">DZ</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base font-semibold text-white">Deadhead Zero</span>
            <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide">
              AI Lane Intelligence Platform
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
          {/* Public links */}
          <Link href="/pricing" className={linkClasses("/pricing")}>
            Pricing
          </Link>
          <Link href="/lane-targeting" className={linkClasses("/lane-targeting")}>
            Lane targeting
          </Link>
          <Link href="/terms" className={linkClasses("/terms")}>
            Terms
          </Link>
          <Link href="/privacy" className={linkClasses("/privacy")}>
            Privacy
          </Link>

          {!loadingUser && !isAuthed && (
            <>
              <Link href="/auth/login" className={linkClasses("/auth/login")}>
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-xs md:text-sm px-3 py-1 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
              >
                Sign up
              </Link>
            </>
          )}

          {!loadingUser && isAuthed && (
            <>
              <Link href={dashboardHref} className={linkClasses(dashboardHref)}>
                Dashboard
              </Link>
              <Link href={profileHref} className={linkClasses(profileHref)}>
                Profile
              </Link>

              {roleLabel && (
                <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-300">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
                    {roleLabel}
                  </span>
                  {shortEmail && <span className="font-mono text-[10px] text-slate-400">{shortEmail}</span>}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs md:text-sm px-3 py-1 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800/70 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
