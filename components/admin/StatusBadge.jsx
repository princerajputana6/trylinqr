export default function StatusBadge({ status }) {
  const map = {
    draft:     'bg-ink-line text-ink-muted border border-ink-line',
    pending:   'bg-mellow-400/20 text-yellow-700 border border-mellow-400/40',
    published: 'bg-jade-300/25 text-green-700 border border-jade-300/50',
    cancelled: 'bg-brand-300/20 text-brand-700 border border-brand-300/40',
    completed: 'bg-baby-300/20 text-blue-700 border border-baby-300/40',
  };
  const dot = {
    draft:     'bg-ink-muted',
    pending:   'bg-yellow-500',
    published: 'bg-green-500',
    cancelled: 'bg-brand-700',
    completed: 'bg-blue-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] || map.draft}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status] || dot.draft}`} />
      {status}
    </span>
  );
}
