export default function PrivacyPage() {
  return (
    <div className=\"min-h-screen bg-slate-950 text-slate-50 py-10 px-4\">
      <div className=\"max-w-4xl mx-auto space-y-8\">
        <h1 className=\"text-3xl font-semibold\">Privacy Policy</h1>
        <p className=\"text-sm text-slate-400\">Last updated: January 2025</p>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">1. Information We Collect</h2>
          <p>We collect the following categories of information:</p>
          <ul className=\"list-disc ml-6 space-y-1\">
            <li>Account information (name, email, company)</li>
            <li>Broker load postings and carrier preferences</li>
            <li>Performance data used for AI insights</li>
            <li>Analytics about Platform usage</li>
          </ul>
        </section>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">2. How We Use Data</h2>
          <p>
            We use data to provide Platform functionality, generate AI insights, improve user experience, and operate
            Deadhead Zero as a SaaS application. We never sell personal information.
          </p>
        </section>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">3. Sharing of Information</h2>
          <p>
            Contact information is shared only when a broker and carrier match to a load so they may communicate
            directly. We do not control or manage conversations or agreements between parties.
          </p>
        </section>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">4. AI &amp; Data</h2>
          <p>
            Some data is processed by Grok AI to generate predictions and insights. Data shared with Grok AI follows the
            provider&apos;s privacy guidelines. Predictions are not guarantees and must be independently evaluated.
          </p>
        </section>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">5. Security</h2>
          <p>We use encrypted communication and access controls to help protect your data.</p>
        </section>

        <section className=\"space-y-4 text-sm text-slate-300\">
          <h2 className=\"text-xl font-semibold text-slate-100\">6. Contact</h2>
          <p>
            Questions may be emailed to: <span className=\"text-emerald-400\">support@deadheadzero.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}
