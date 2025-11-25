import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-slate-950 to-black">
      <Nav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-24 grid md:grid-cols-[1.3fr,1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1 text-xs text-emerald-200 mb-6">
              <span>Grok-powered lane targeting</span>
              <span className="text-slate-500">•</span>
              <span>Carriers free (for now)</span>
              <span className="text-slate-500">•</span>
              <span>Pure SaaS platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Kill empty miles with{" "}
              <span className="text-emerald-400">deadhead-only AI.</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mb-8">
              Deadhead Zero focuses on the most deadhead-heavy lanes in the US network and uses Grok to match
              carriers to lanes with surgical precision. Brokers pay a simple SaaS subscription. Carriers start free.
              Freight payments never touch the platform.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/auth/register?role=broker"
                className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
              >
                Brokers · Open dashboard
              </Link>
              <Link
                href="/auth/register?role=carrier"
                className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition"
              >
                Carriers · Reduce deadhead
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 gradient-ring blur-3xl opacity-60" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur p-5 text-sm text-slate-200 shadow-2xl">
              <div className="text-xs text-sky-300 mb-2">Live lane cluster · Powered by Grok</div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">ATL, GA → ORL, FL</div>
                    <div className="text-slate-500 text-[11px]">Van · 53&apos;</div>
                  </div>
                  <div className="text-amber-300 text-xs font-semibold">Deadhead: 83%</div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">DFW, TX → ATL, GA</div>
                    <div className="text-slate-500 text-[11px]">Reefer · 53&apos;</div>
                  </div>
                  <div className="text-amber-300 text-xs font-semibold">Deadhead: 78%</div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">
                  Lane scores and matches are AI predictions only. Deadhead Zero does not arrange transportation, act
                  as broker of record, or control freight payments. All contracts and payments are strictly between
                  brokers, shippers, and carriers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
