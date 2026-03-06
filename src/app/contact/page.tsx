import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Contact — ProfitPilot Ads",
  description: "Support and contact for ProfitPilot Ads.",
};

const UPDATED_AT = "March 6, 2026";

export default function ContactPage() {
  return (
    <LegalLayout
      title="Contact"
      updatedAt={UPDATED_AT}
    >
      <h2>Support</h2>
      <p>
        Email: <a href="mailto:support@profitpilotads.com">support@profitpilotads.com</a>
      </p>
      <p>
        We respond on business days (business hours, Brazil). We aim to reply as soon as possible. For data deletion requests or legal inquiries, see our <Link href="/privacy">Privacy Policy</Link> and <Link href="/data-deletion">Data Deletion</Link> page.
      </p>
    </LegalLayout>
  );
}
