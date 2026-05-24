const styles = {
  open: 'bg-brand-700/[0.08] text-brand-700 border-brand-700/20',
  in_progress: 'bg-sand-100 text-sand-800 border-sand-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-pearl text-obsidian/60 border-ink-line',
};
const labels = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};
export default function StatusPill({ status }) {
  return (
    <span
      className={`chip border font-semibold ${styles[status] || styles.open}`}
    >
      {labels[status] || status}
    </span>
  );
}
