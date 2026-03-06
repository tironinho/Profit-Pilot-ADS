import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
      <p className="mt-4 text-neutral-400">
        Privacy policy content will be published here. Contact{" "}
        <a href="mailto:support@profitpilotads.com" className="text-neutral-200 hover:text-white">support@profitpilotads.com</a> for questions.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-400 hover:text-white">← Back to home</Link>
    </div>
  );
}
