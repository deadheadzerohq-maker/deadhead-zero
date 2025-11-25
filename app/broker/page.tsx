"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type SubscriptionStatus =
  | "pending"
  | "active"
  | "free"
  | "canceled"
  | string;

interface Lane {
  id: string;
  origin: string;
  destination: string;
  score: number;
  deadheadRisk: number;
}

interface MyLoad {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string | null;
  delivery_date: string | null;
  rate_offer: number | null;
  notes: string | null;
}

export default function BrokerDashboardPage() {
  const supabase = supabaseBrowserClient();
  const [loads, setLoads] = useState<MyLoad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLoads() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch only loads belonging to logged-in broker
      const { data, error } = await supabase
        .from("loads")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching loads:", error);
      } else {
        setLoads(data || []);
      }

      setLoading(false);
    }

    fetchLoads();
  }, []);

  const formatCurrency = (value: number | null) => {
    if (!value) return "$0.00";
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  return (
    <>
      <Nav />

      <div className="max-w-6xl mx-auto py-16 px-6 text-white">
        <h1 className="text-4xl font-bold mb-8">Broker Dashboard</h1>

        {/* Loads Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-lg font-semibold">Loads posted</p>
            <p className="text-3xl mt-2">{loads.length}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-lg font-semibold">Est. hours saved</p>
            <p className="text-3xl mt-2">{loads.length * 0.25}</p>
            <p className="text-xs text-gray-400 mt-1">
              Assuming 15 min saved per load
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-lg font-semibold">Est. value ($)</p>
            <p className="text-3xl mt-2">{loads.length * 150}</p>
            <p className="text-xs text-gray-400 mt-1">
              At $150/hr fully loaded cost
            </p>
          </div>
        </div>

        {/* My Loads Section */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 mb-12">
          <h2 className="text-2xl font-semibold mb-4">My loads</h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : loads.length === 0 ? (
            <p className="text-gray-400">
              You haven’t posted any loads yet. Once you do, they’ll appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {loads.map((load) => (
                <div
                  key={load.id}
                  className="p-5 rounded-lg border border-gray-700 bg-gray-800"
                >
                  <p className="font-semibold text-lg">
                    {load.origin} → {load.destination}
                  </p>

                  <p className="text-gray-300 text-sm mt-2">
                    Pickup:{" "}
                    {load.pickup_date
                      ? new Date(load.pickup_date).toLocaleDateString()
                      : "—"}
                    <br />
                    Delivery:{" "}
                    {load.delivery_date
                      ? new Date(load.delivery_date).toLocaleDateString()
                      : "—"}
                  </p>

                  <p className="text-green-400 font-semibold mt-2">
                    Rate: {formatCurrency(load.rate_offer)}
                  </p>

                  {load.notes && (
                    <p className="text-gray-300 text-sm mt-2">{load.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI-matched carriers placeholder */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 mb-12">
          <h2 className="text-2xl font-semibold mb-4">AI-matched carriers</h2>
          <p className="text-gray-400">
            As AI matching is wired in, you'll see top carriers recommended here.
          </p>
        </div>

        {/* Footer */}
      </div>

      <Footer />
    </>
  );
}
