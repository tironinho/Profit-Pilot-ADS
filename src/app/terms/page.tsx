import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — ProfitPilot Ads",
  description: "Terms of use for the ProfitPilot Ads app and subscription.",
};

const UPDATED_AT = "March 6, 2026";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service — ProfitPilot Ads"
      updatedAt={UPDATED_AT}
    >
      <h2 id="acceptance">Acceptance</h2>
      <p>
        By using ProfitPilot Ads (the &quot;Service&quot;), operated by <strong>Tironi Tech</strong>, you agree to these Terms of Service and our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service.
      </p>

      <h2 id="service-description">Service description</h2>
      <p>
        ProfitPilot Ads is a Shopify app that lets you connect ad channels (Meta, Google, TikTok), run preflight checks (tracking, store health), use Budget Shield (alerts and optional auto-pause), and view a profit-first dashboard (e.g. MER, revenue, spend). Use of the Service requires an active paid subscription and compliance with Shopify and ad platform policies. We do not guarantee any specific results (e.g. conversions, ROAS, or revenue); outcomes depend on your campaigns, store, and data quality.
      </p>

      <h2 id="eligibility">Eligibility</h2>
      <p>
        You must have a valid Shopify store and be at least 18 years old (or the age of majority in your jurisdiction) or have authority to bind the business. You are responsible for keeping your credentials secure and for notifying us of any unauthorized use.
      </p>

      <h2 id="installation">Installation and permissions</h2>
      <p>
        By installing the app, you grant us the permissions required to provide the Service (e.g. reading store and order data for MER, connecting ad accounts you authorize). You may revoke access via Shopify or by disconnecting channels in the app; revocation may limit or disable features.
      </p>

      <h2 id="third-party">Third-party connections</h2>
      <p>
        The Service integrates with Shopify, Stripe, and ad platforms (Meta, Google, TikTok). Your use of those services is subject to their respective terms and policies. We are not responsible for their availability, actions, or data practices.
      </p>

      <h2 id="billing">Billing and subscription</h2>
      <p>
        Subscription is billed via Stripe according to the plan you choose (e.g. monthly). Prices and billing terms are on the <Link href="/pricing">pricing</Link> page. By subscribing, you authorize recurring charges until you cancel. You may cancel anytime through the billing portal or by contacting us. <strong>Refund policy:</strong> Except where required by law, payments are non-refundable.
      </p>

      <h2 id="acceptable-use">Acceptable use</h2>
      <p>
        You agree to use the Service lawfully and in line with these Terms, Shopify policies, and ad platform policies. You may not: use the Service for illegal or fraudulent purposes; circumvent technical or security measures; resell or redistribute access without authorization; or interfere with the Service or third-party systems.
      </p>

      <h2 id="ip">Intellectual property</h2>
      <p>
        The Service, including software, trademarks, text, and design, is owned by Tironi Tech or its licensors. Nothing here grants you any rights to that property beyond the right to use the Service during your subscription in accordance with these Terms.
      </p>

      <h2 id="confidentiality">Confidentiality</h2>
      <p>
        Each party may receive confidential information of the other. Each agrees to keep it confidential and use it only for the purpose of the Service. Confidential information does not include information that is public, independently developed, or rightfully received from a third party without restriction.
      </p>

      <h2 id="availability">Availability and changes</h2>
      <p>
        We strive to keep the Service available but do not guarantee uninterrupted access. We may change, suspend, or discontinue features with reasonable notice when practicable. Continued use after changes constitutes acceptance.
      </p>

      <h2 id="disclaimers">Disclaimers</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available.&quot; We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose. We do not guarantee specific campaign results, conversions, or metrics. Metrics such as MER depend on data from platforms and your store; we are not liable for decisions you make based on reports from the app.
      </p>

      <h2 id="limitation">Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Tironi Tech shall not be liable for any indirect, incidental, special, or consequential damages (including loss of profits or data) arising from use or inability to use the Service. Our total liability in any case shall not exceed the amount you paid us in the twelve (12) months before the event giving rise to the claim.
      </p>

      <h2 id="indemnification">Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Tironi Tech and its affiliates from any claims, damages, or expenses (including reasonable attorneys&apos; fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.
      </p>

      <h2 id="termination">Termination</h2>
      <p>
        You may end your subscription at any time via the billing portal or by <Link href="/contact">contacting</Link> us. We may suspend or terminate your access for breach of these Terms, non-payment, or for business reasons with notice where reasonable. Upon termination, your right to use the Service ceases. Data retention and deletion are described in our <Link href="/privacy">Privacy Policy</Link> and <Link href="/data-deletion">Data Deletion</Link> page.
      </p>

      <h2 id="privacy-link">Privacy</h2>
      <p>
        Processing of personal data is governed by our <Link href="/privacy">Privacy Policy</Link>. By using the Service and connecting ad accounts, you authorize us to process data as described there and in the applicable platform policies.
      </p>

      <h2 id="governing-law">Governing law and venue</h2>
      <p>
        These Terms are governed by the laws of <strong>Brazil</strong>. Any disputes shall be resolved in the courts of <strong>Ibaiti/PR</strong>, to which you consent and waive any other, more favorable forum.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        For questions about these Terms: <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>. Other channels: <Link href="/contact">Contact</Link>.
      </p>
    </LegalLayout>
  );
}
