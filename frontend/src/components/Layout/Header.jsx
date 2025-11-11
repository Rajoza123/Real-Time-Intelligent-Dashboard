export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <h1 className="text-lg font-semibold tracking-tight">
            Real-Time Intelligent Dashboard
          </h1>
        </div>
        <div className="text-xs text-neutral-400">
          24×7 Monitoring • REST Polling
        </div>
      </div>
    </header>
  );
}
