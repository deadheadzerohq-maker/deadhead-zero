"use client";
import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-sm text-slate-400">Last updated: January 2025</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-slate-200">
          <p>
            These Terms of Service ("Terms") govern your access to and use of the
            Deadhead Zero platform ("Deadhead Zero", "we", "us", or "our"). By
            creating an account or using the platform, you agree to these Terms.
          </p>
          <p>
            Deadhead Zero is a software-as-a-service (SaaS) technology platform only.
            We are not a licensed freight broker, freight forwarder, carrier, or
            money transmitter. We do not arrange transportation, select carriers,
            negotiate rates, or hold or transmit freight-related funds. All
            transportation arrangements and payments occur directly between brokers
            and carriers.
          </p>
        </section>
      </div>
    </div>
  );
}
