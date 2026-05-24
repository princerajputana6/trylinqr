export default function LoadingSpinner({ label = 'Loading…', full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        full ? 'min-h-[60vh]' : 'py-16'
      }`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-line border-t-brand-700" />
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="relative h-44 overflow-hidden bg-pearl">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-pearl" />
        <div className="h-3 w-1/2 rounded bg-pearl" />
      </div>
    </div>
  );
}
