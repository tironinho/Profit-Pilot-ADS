import { useState } from "react";
import Footer from "../components/Footer";
import styles from "../styles/data-deletion.module.css";

export const meta = () => [
  { title: "Data Deletion — ProfitPilot Ads" },
  {
    name: "description",
    content: "Request deletion of your data from ProfitPilot Ads.",
  },
];

const PROVIDERS = [
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "shopify", label: "Shopify" },
  { value: "all", label: "All platforms" },
];

export default function DataDeletionPage() {
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      email: form.email.value.trim(),
      shopDomain: form.shopDomain.value.trim(),
      provider: form.provider.value,
      message: form.message.value.trim(),
    };

    setLoading(true);
    setSubmitted(null);
    try {
      const res = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted({ requestId: data.requestId });
        form.reset();
      } else {
        setSubmitted({ error: data.error || "Request failed" });
      }
    } catch (err) {
      setSubmitted({ error: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Data Deletion</h1>
      <p className={styles.subtitle}>How to request deletion of your data</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. What data we process</h2>
        <p className={styles.sectionContent}>
          We store and process: Shopify store identifiers (shop domain), connected
          ad account IDs (Meta, Google, TikTok), aggregated metrics, encrypted
          OAuth tokens, and billing-related IDs. We do not sell your data.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. How to request deletion</h2>
        <p className={styles.sectionContent}>
          Send an email to{" "}
          <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>{" "}
          with the subject and details below. Include: your Shopify store domain,
          the account email associated with the store, the platform (Meta, Google,
          or TikTok), and the request type (delete all data / revoke access only).
        </p>
        <div className={styles.callout}>
          <p className={styles.calloutTitle}>Email template</p>
          <pre className={styles.calloutContent}>
{`Subject: Data Deletion Request — ProfitPilot Ads

Store domain: your-store.myshopify.com
Account email: your@email.com
Platform: Meta / Google / TikTok / All
Request type: Delete all my data / Revoke access only

Optional message:
[Your additional instructions]`}
          </pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. What happens next</h2>
        <ul className={styles.sectionContent}>
          <li>We confirm your identity (e.g. via the email or store you provide).</li>
          <li>We revoke stored tokens and disconnect ad accounts where applicable.</li>
          <li>We delete stored data related to your store and accounts.</li>
          <li>We confirm completion by email (when you request via email).</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Timeline</h2>
        <p className={styles.sectionContent}>
          We process deletion requests typically within 30 days. You will receive a
          confirmation when the process is complete.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Immediate steps you can take</h2>
        <ul className={styles.sectionContent}>
          <li>
            Disconnect ad channels inside the ProfitPilot Ads app when that option
            is available.
          </li>
          <li>
            Revoke access in each provider&apos;s account settings (Meta Business
            Manager, Google Ads, TikTok For Business) to remove our app&apos;s
            access from your side.
          </li>
        </ul>
      </section>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Optional: submit a request form</h2>
        <p className={styles.sectionContent} style={{ marginBottom: "1rem" }}>
          You can also submit the form below. We will reply by email to confirm
          receipt and next steps.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="shopDomain">Shop domain</label>
            <input
              id="shopDomain"
              name="shopDomain"
              type="text"
              required
              placeholder="your-store.myshopify.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="provider">Provider</label>
            <select id="provider" name="provider" required>
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message (optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="e.g. Delete all my data / Revoke access only"
            />
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Sending…" : "Submit request"}
          </button>
        </form>
        {submitted?.requestId && (
          <div className={styles.successMsg} role="alert">
            <strong>Request received.</strong>
            We will reply by email. Reference ID: {submitted.requestId}
          </div>
        )}
        {submitted?.error && (
          <div className={styles.successMsg} style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }} role="alert">
            {submitted.error}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}
