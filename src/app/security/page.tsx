import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold text-white">Security</h1>
      <p className="mt-4 text-neutral-400">
        We use secure token storage (encrypted at rest). Security and compliance details will be published here. Contact{" "}
        <a href="mailto:support@profitpilotads.com" className="text-neutral-200 hover:text-white">support@profitpilotads.com</a> for questions.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-400 hover:text-white">← Back to home</Link>
    </div>
  );
}
