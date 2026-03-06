import Link from "next/link";

type LegalLayoutProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="mb-8 inline-block text-sm text-neutral-400 hover:text-white">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {updatedAt}</p>
      <div className="legal-content mt-10 space-y-6 text-neutral-300">
        {children}
      </div>
    </div>
  );
}
