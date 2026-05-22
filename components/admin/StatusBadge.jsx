export default function StatusBadge({ status }) {
  const map = {
    draft: 'bg-white/10 text-ink-muted',
    pending: 'bg-amber-500/15 text-amber-400',
    published: 'bg-emerald-500/15 text-emerald-400',
    cancelled: 'bg-brand-500/15 text-brand-400',
    completed: 'bg-sky-500/15 text-sky-400',
  };
  return (
    <span className={`chip capitalize ${map[status] || map.draft}`}>
      {status}
    </span>
  );
}
