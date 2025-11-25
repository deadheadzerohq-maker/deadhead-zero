"use client";
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-sm text-slate-400">Last updated: January 2025</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-slate-200">
          <p>
            This Privacy Policy describes how Deadhead Zero (&quot;Deadhead
            Zero&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            collects, uses, and protects information in connection with your use
            of the Deadhead Zero platform.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold">Account information:</span> name,
              company, work email, role (broker, carrier, owner), and related
              profile details you choose to provide.
            </li>
            <li>
              <span className="font-semibold">Platform usage data:</span> pages
              you visit, buttons you click, load postings, preferences, and in-app
              interactions.
            </li>
            <li>
              <span className="font-semibold">Technical data:</span> device,
              browser, IP address, and basic log data.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. How We Use Information</h2>
          <p>We use information to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide, maintain, and improve the Deadhead Zero platform.</li>
            <li>
              Power product features like lane insights, analytics, and
              AI-assisted matching.
            </li>
            <li>
              Communicate with you about updates, security alerts, and account
              matters.
            </li>
            <li>
              Analyze usage trends to improve performance, reliability, and user
              experience.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. AI &amp; Data Usage</h2>
          <p>
            Deadhead Zero may use AI tools (such as Grok) to generate lane
            scores, narrative analytics, and suggested matches. Inputs to these
            systems may include lane details, load data, carrier preferences, and
            historical usage patterns. We use these tools to generate
            informational insights only; final commercial decisions are always up
            to you.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Sharing of Information</h2>
          <p>We may share information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              With other users when there is a match (for example, sharing broker
              contact details with a matched carrier and vice versa).
            </li>
            <li>
              With service providers that help us run the platform (such as cloud
              hosting, analytics, and payment processors).
            </li>
            <li>
              If required by law, regulation, or legal process, or to protect our
              rights, users, or the Platform.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect
            information. However, no system can be guaranteed 100% secure, and
            you use the platform at your own risk.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Your Choices</h2>
          <p>
            You may update certain account and profile information within the
            platform. If you wish to request deletion of your account or have
            questions about your data, you can contact us at{" "}
            <a
              href="mailto:support@deadheadzero.com"
              className="text-sky-400 hover:underline"
            >
              support@deadheadzero.com
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will update the &quot;Last updated&quot; date at the top of this
            page. Your continued use of the platform after any update constitutes
            your acceptance of the revised policy.
          </p>
        </section>
      </div>
    </div>
  );
}
