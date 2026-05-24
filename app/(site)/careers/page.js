import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Careers at TryLinqr' };

const roles = [
  {
    title: 'Senior Full-Stack Engineer',
    location: 'Remote · India',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    location: 'Delhi-NCR · Hybrid',
    type: 'Full-time',
  },
  {
    title: 'Community & Partnerships Lead',
    location: 'Mumbai · On-site',
    type: 'Full-time',
  },
  {
    title: 'Customer Experience Associate',
    location: 'Remote · India',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <LegalPage
      eyebrow="Careers"
      title="Build the next chapter of live experiences."
      intro="We&apos;re building TryLinqr with a small, senior team of people who love events as much as they love product craft. If that&apos;s you, we&apos;d love to talk."
      lastUpdated="May 2026"
    >
      <h2>Open roles</h2>
      <div className="not-prose mt-4 space-y-3">
        {roles.map((r) => (
          <div
            key={r.title}
            className="flex flex-col gap-1 rounded-xl border border-ink-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-base font-bold text-obsidian">
                {r.title}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-ink-muted">
                {r.location} · {r.type}
              </p>
            </div>
            <a
              href="mailto:careers@trylinqr.com"
              className="self-start rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-glow-soft hover:bg-brand-800 sm:self-auto"
            >
              Apply
            </a>
          </div>
        ))}
      </div>

      <h2>What we offer</h2>
      <ul>
        <li>Competitive cash + meaningful equity.</li>
        <li>Remote-first culture with quarterly team meetups in great cities.</li>
        <li>Top-tier health insurance for you and dependants.</li>
        <li>
          A real budget to attend the events you care about — yes, that
          counts as research.
        </li>
        <li>Hardware of your choice and a fully kitted home setup.</li>
      </ul>

      <h2>Don&apos;t see your role?</h2>
      <p>
        We&apos;re always interested in exceptional people. Send a note and a
        link or two to{' '}
        <a href="mailto:careers@trylinqr.com">careers@trylinqr.com</a>.
      </p>
    </LegalPage>
  );
}
