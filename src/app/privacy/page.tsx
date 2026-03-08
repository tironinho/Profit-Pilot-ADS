import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — ProfitPilot Ads",
  description: "How ProfitPilot Ads collects, uses, and protects your data.",
};

const UPDATED_AT = "March 6, 2026";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy — ProfitPilot Ads"
      updatedAt={UPDATED_AT}
    >
      <h2 id="who-we-are">Who we are</h2>
      <p>
        The data controller for the personal data processed in connection with ProfitPilot Ads is <strong>Tironi Tech</strong> (&quot;we&quot;, &quot;us&quot;). Contact: <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>. Address for formal correspondence: Brazil (remote-first).
      </p>

      <h2 id="what-this-covers">What this policy covers</h2>
      <p>
        This Privacy Policy describes how we collect, use, store, and protect information when you use the ProfitPilot Ads app (the &quot;Service&quot;) on Shopify and connect ad platforms (Meta, Google, TikTok). It applies to data we process as part of the Service; it does not override the privacy policies of Shopify, Stripe, or the ad platforms you connect.
      </p>

      <h2 id="data-we-collect">Data we collect</h2>
      <p>
        We collect data necessary to operate the app and provide the Service:
      </p>
      <ul>
        <li><strong>Shopify store data:</strong> Store identification, merchant/account details provided by Shopify when you install and use the app.</li>
        <li><strong>Ad platform data:</strong> When you connect Meta, Google, or TikTok, we receive and store access tokens and data those platforms make available (e.g. campaign and spend data, conversion signals) to power preflight checks, Budget Shield, and the profit dashboard.</li>
        <li><strong>Tokens:</strong> We store ad platform access tokens in encrypted form to sync and display your ad performance.</li>
        <li><strong>Stripe billing:</strong> Subscription and billing are processed by Stripe. We do not store full payment card details; we may store Stripe customer or subscription identifiers to manage your account.</li>
        <li><strong>Cookies and logs:</strong> We use cookies and similar technologies for session, security, and operation of the Service. We collect logs and usage events (e.g. app opens, feature use) to operate, secure, and improve the product.</li>
      </ul>

      <h2 id="how-we-use">How we use data</h2>
      <p>
        We use the data to: provide and operate the Service (preflight, Budget Shield, profit dashboard); connect and sync your ad accounts; compute metrics (MER, spend, conversions); improve the product and security; comply with legal obligations; and respond to lawful requests from authorities.
      </p>

      <h2 id="legal-bases">Legal bases</h2>
      <p>
        Where applicable under GDPR, LGPD, or similar frameworks: we process data for <strong>contract performance</strong> (providing the Service), <strong>legitimate interests</strong> (security, product improvement, fraud prevention), and, where required, your <strong>consent</strong> (e.g. when you connect an ad platform). You may withdraw consent where it is the sole basis, without affecting the lawfulness of processing before withdrawal.
      </p>

      <h2 id="sharing">Sharing with third parties</h2>
      <p>
        We may share data with: <strong>Shopify</strong> (app environment and store context); <strong>Stripe</strong> (billing and subscription); <strong>Meta, Google, TikTok</strong> (as authorized by you when connecting accounts); and <strong>infrastructure and service providers</strong> that process data on our behalf under contractual obligations (e.g. hosting, monitoring). We do not sell your personal data.
      </p>

      <h2 id="retention">Retention and deletion</h2>
      <p>
        We retain data while your account is active and as needed to comply with law, resolve disputes, and enforce our <Link href="/terms">Terms of Service</Link>. After account closure, we delete or anonymize data within applicable timeframes, except where we must retain it for legal or regulatory reasons. You may request deletion as described in <Link href="/data-deletion">Data Deletion</Link>.
      </p>

      <h2 id="security">Security</h2>
      <p>
        We implement technical and organizational measures to protect your data, including encryption of tokens at rest and secure transmission (e.g. HTTPS). For more detail, see our <Link href="/security">Security</Link> page.
      </p>

      <h2 id="international">International transfers</h2>
      <p>
        Data may be processed or stored on servers outside your country (e.g. cloud providers). Where we transfer data internationally, we ensure appropriate safeguards by contract and/or applicable standards (e.g. standard contractual clauses where relevant).
      </p>

      <h2 id="your-rights">Your rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, export, delete, or restrict processing of your data, or to object to certain processing. To exercise these rights or request data deletion, contact us at <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a> or use the process on our <Link href="/data-deletion">Data Deletion</Link> page. You may also have the right to lodge a complaint with a supervisory authority. Governing law may be that of <strong>Brazil</strong> (e.g. LGPD) or another jurisdiction depending on your residence.
      </p>

      <h2 id="children">Children</h2>
      <p>
        The Service is not directed at individuals under the age of 16 (or equivalent minimum age in your jurisdiction). We do not knowingly collect personal data from them. If you believe we have collected such data, please contact us and we will delete it.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        We may update this Privacy Policy. Material changes will be communicated by email or notice in the product. Continued use after the effective date constitutes acceptance. The &quot;Last updated&quot; date at the top indicates the current version.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        For privacy questions or to exercise your rights: <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>. For other channels, see <Link href="/contact">Contact</Link>.
      </p>
    </LegalLayout>
  );
}
