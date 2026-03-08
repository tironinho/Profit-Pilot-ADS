import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Security — ProfitPilot Ads",
  description: "Security practices for ProfitPilot Ads.",
};

const UPDATED_AT = "March 6, 2026";

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security"
      updatedAt={UPDATED_AT}
    >
      <h2>Token storage</h2>
      <p>
        Access tokens for ad platforms (Meta, Google, TikTok) and other sensitive data are stored encrypted at rest. Traffic between your browser and our services uses HTTPS.
      </p>
      <h2>Security practices</h2>
      <p>
        We recommend: keeping your Shopify account password secure and enabling two-factor authentication where available; not sharing app or ad platform credentials; and periodically reviewing connected ad accounts in the app and revoking those you no longer need.
      </p>
      <p>
        Payments are processed by Stripe; we do not store full card details. For privacy and data handling, see our <Link href="/privacy">Privacy Policy</Link>. Contact: <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>.
      </p>
    </LegalLayout>
  );
}
