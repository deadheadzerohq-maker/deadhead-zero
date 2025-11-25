"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface ResultLane {
  id: string;
  label: string;
  origin: string;
  destination: string;
  score: number; // 0–100
  deadheadRisk: number; // 0–1
}

export default function LaneTargetingPage() {
  const [origin, setOrigin] = useState("dallas tx");
  const [destination, setDestination] = useState("seattle wa");
  const [results, setResults] = useState<ResultLane[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScoreLane = () => {
    setLoading(true);

    try {
      const baseHash = origin.length + destination.length;
      const primaryScore = 60 + (baseHash % 40); // 60–99
      const primaryDeadhead = 0.4 + ((baseHash % 20) / 100); // 40–59%

      const hubs = ["Chicago, IL", "Memphis, TN", "Kansas City, MO", "Phoenix, AZ", "Jacksonville, FL"];
      const hubIndex = (origin.charCodeAt(0) + destination.charCodeAt(0)) % hubs.length;
      const viaHub = hubs[hubIndex];

      const altScore = Math.max(40, primaryScore - 4 + ((hubIndex % 3) - 1));
      const altDeadhead = Math.max(0.2, primaryDeadhead - 0.08);

      const normalizedOrigin = origin.trim();
      const normalizedDest = destination.trim();

      const mockResults: ResultLane[] = [
        {
          id: "primary",
          label: `${normalizedOrigin} → ${normalizedDest}`,
          origin: normalizedOrigin,
          destination: normalizedDest,
          score: primaryScore,
          deadheadRisk: primaryDeadhead,
        },
        {
          id: "alt",
          label: `${normalizedOrigin} → ALT route via ${viaHub}`,
          origin: normalizedOrigin,
          destination: normalizedDest,
          score: altScore,
          deadheadRisk: altDeadhead,
        },
      ];

      setResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-slate-950 to-black">
      <Nav />
      <main className="flex-1 mx-auto max-w-6xl px-4 pt-10 pb-16 text-xs md:text-sm">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Lane targeting</h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl mb-6">
          Enter an origin and destination and Deadhead Zero will score the lane, estimate deadhead risk, and suggest a
          potential alternative route. When Grok AI is enabled, this same surface will be powered by live intelligence
          instead of mock scores.
        </p>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-[11px] mb-1 text-slate-400">Origin</label>
              <input
                className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="city, state"
              />
            </div>
            <div>
              <label className="block text-[11px] mb-1 text-slate-400">Destination</label>
              <input
                className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="city, state"
              />
            </div>
            <button
              onClick={handleScoreLane}
              disabled={loading}
              className="mt-2 md:mt-0 rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Scoring..." : "Score lane"}
            </button>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 space-y-1">
            <p>
              <span className="font-semibold text-slate-300">Score</span> is a 0–100 view of how attractive this lane is
              for your network. Higher scores mean better balance, more carrier coverage, and healthier freight density.
            </p>
            <p>
              <span className="font-semibold text-slate-300">Deadhead</span> is the estimated share of empty miles you
              might run around this lane. Lower deadhead means fewer wasted miles and better asset utilization.
            </p>
          </div>
        </div>

        {results && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((lane) => (
              <div
                key={lane.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-sm font-semibold mb-1 capitalize">{lane.label}</h2>
                  <p className="text-[11px] text-slate-400 mb-3">Predicted lane performance</p>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-xs text-slate-400">
                    <div>
                      <span className="font-semibold text-emerald-300">Score: </span>
                      <span className="font-mono">{lane.score}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-amber-300">Deadhead: </span>
                      <span className="font-mono">{Math.round(lane.deadheadRisk * 100)}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Current results are generated using mock logic for demonstration only. When Grok AI is wired in, this
                  surface will draw from real freight patterns and your own account data. Always validate scores against
                  your carrier network, contracts, and risk appetite.
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
