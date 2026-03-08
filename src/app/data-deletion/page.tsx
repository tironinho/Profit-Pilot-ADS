import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Data Deletion — ProfitPilot Ads",
  description: "How to request deletion of your data from ProfitPilot Ads.",
};

const UPDATED_AT = "March 6, 2026";

export default function DataDeletionPage() {
  return (
    <LegalLayout
      title="Data Deletion"
      updatedAt={UPDATED_AT}
    >
      <h2>How to request deletion</h2>
      <p>
        You may request deletion of personal data associated with your account and use of ProfitPilot Ads. Send an email to <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a> with the subject line &quot;Data deletion request&quot; and, if possible, the email of the Shopify account linked to the app.
      </p>
      <p>
        After we verify your identity, we will process the request in line with our <Link href="/privacy">Privacy Policy</Link> and applicable law. Data we must keep for legal or accounting reasons may be retained as required.
      </p>
      <p>
        For more on how we handle your data, see the <Link href="/privacy">Privacy Policy</Link>. General inquiries: <Link href="/contact">Contact</Link>.
      </p>
    </LegalLayout>
  );
}
