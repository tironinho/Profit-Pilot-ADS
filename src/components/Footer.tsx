export function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-neutral-400">
        <div className="flex flex-col gap-2">
          <div>© {new Date().getFullYear()} ProfitPilot Ads</div>
          <div>Stop burning ad budget in the dark.</div>
        </div>
      </div>
    </footer>
  );
}
