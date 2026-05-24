'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { LifeBuoy, ArrowRight, Filter } from 'lucide-react';
import StatusPill from './StatusPill';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatDateTime } from '@/lib/utils';

const STATUSES = [
  { v: '', l: 'All' },
  { v: 'open', l: 'Open' },
  { v: 'in_progress', l: 'In progress' },
  { v: 'resolved', l: 'Resolved' },
  { v: 'closed', l: 'Closed' },
];

export default function TicketQueue({ apiPath, basePath, title }) {
  const [status, setStatus] = useState('');
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const url = status ? `${apiPath}?status=${status}` : apiPath;
    const res = await fetch(url);
    const d = await res.json();
    setTickets(d.tickets || []);
    setCounts(d.counts || {});
    setLoading(false);
  }, [apiPath, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow">Support</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
          {['open', 'in_progress', 'resolved'].map((k) => (
            <span key={k} className="rounded-full bg-white px-3 py-1.5 shadow-card">
              <b className="font-bold text-obsidian">{counts[k] ?? 0}</b>{' '}
              {k.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-ink-muted" />
        {STATUSES.map((s) => (
          <button
            key={s.v}
            onClick={() => setStatus(s.v)}
            className={`chip border transition-colors ${
              status === s.v
                ? 'border-brand-700 bg-brand-700/[0.08] text-brand-700'
                : 'border-ink-line bg-white text-obsidian/75 hover:border-obsidian/25'
            }`}
          >
            {s.l}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <div className="card grid place-items-center py-14 text-center">
          <LifeBuoy className="h-10 w-10 text-ink-muted" />
          <p className="mt-3 font-semibold text-obsidian">No tickets here</p>
          <p className="mt-1 text-sm text-ink-muted">
            Nothing matches the current filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              href={`${basePath}/${t._id}`}
              className="hover-glow card flex items-start gap-4 p-4 transition-colors hover:border-brand-700/30"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-display text-base font-bold text-obsidian">
                    {t.subject}
                  </p>
                  <StatusPill status={t.status} />
                  {t.handlerUnread > 0 && (
                    <span className="rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {t.handlerUnread} new
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">
                  {t.ticketCode} · {t.category} · {t.priority}
                </p>
                <p className="mt-1 text-xs text-obsidian/70">
                  From <b className="font-semibold">{t.customer?.name}</b>
                  {t.customer?.email ? ` · ${t.customer.email}` : ''}
                  {t.assignedTo && (
                    <>
                      {' · assigned to '}
                      <b className="font-semibold">
                        {t.assignedTo.orgName || t.assignedTo.name}
                      </b>
                    </>
                  )}
                </p>
                {t.relatedEvent && (
                  <p className="mt-1 text-xs text-obsidian/65">
                    On <b className="font-semibold">{t.relatedEvent.title}</b>
                  </p>
                )}
                <p className="mt-1 text-xs text-ink-muted">
                  Updated {formatDateTime(t.updatedAt)}
                </p>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-ink-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
