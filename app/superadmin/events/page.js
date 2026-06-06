'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Star, ExternalLink, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination, { usePagedList } from '@/components/shared/Pagination';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';
import { categoryBySlug } from '@/lib/constants';

// Order matches the dashboard for consistency. No 'pending' — organizers
// publish themselves now.
const FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'draft',     label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

function EventsInner() {
  const sp = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState(sp.get('status') || 'all');
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);

  // Reset to page 1 when the status filter changes.
  useEffect(() => setPage(1), [status]);

  const PAGE_SIZE = 10;
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const q = status === 'all' ? '' : `?status=${status}`;
    fetch(`/api/superadmin/events${q}`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
        setLoading(false);
      });
  };
  useEffect(load, [status]);

  const act = async (id, body, msg) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(msg, 'success');
    load();
  };

  const del = async (e) => {
    if (
      !confirm(
        `Delete "${e.title}"?\n\nThe event will be cancelled and any booked customers will be notified + refunded. This action cannot be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/events/${e._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast('Event deleted', 'success');
    load();
  };

  return (
    <div>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              status === f.value
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-ink-line bg-white text-obsidian/70 hover:border-brand-700/40 hover:text-brand-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <div className="card py-20 text-center text-sm text-ink-muted">
          No events in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((e, i) => {
            const cat = categoryBySlug(e.category);
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={
                    e.bannerImage ||
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=70'
                  }
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{e.title}</h3>
                    <StatusBadge status={e.status} />
                    {e.isFeatured && (
                      <span className="chip gap-1 bg-sand-500/20 text-sand-700">
                        <Star className="h-3 w-3 fill-sand-700" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                    <CatIcon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                    {cat.label} · by{' '}
                    {e.organizer?.orgName || e.organizer?.name} ·{' '}
                    {formatDate(e.startDate)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {e.status === 'pending' && (
                    <button
                      onClick={() =>
                        act(e._id, { status: 'published' }, 'Event published')
                      }
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {e.status === 'published' && (
                    <>
                      <button
                        onClick={() =>
                          act(
                            e._id,
                            { isFeatured: !e.isFeatured },
                            e.isFeatured ? 'Unfeatured' : 'Featured'
                          )
                        }
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {e.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <Link
                        href={`/events/${e.slug}`}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  )}
                  {e.status !== 'cancelled' && (
                    <button
                      onClick={() =>
                        act(e._id, { status: 'cancelled' }, 'Event cancelled')
                      }
                      className="btn-ghost px-3 py-1.5 text-xs text-brand-700"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  )}
                  <button
                    onClick={() => del(e)}
                    className="btn-ghost px-3 py-1.5 text-xs text-brand-700"
                    title="Delete event"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
          <Pagination
            page={page}
            pages={Math.max(1, Math.ceil(events.length / PAGE_SIZE))}
            total={events.length}
            onPage={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default function SuperadminEventsPage() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
      <EventsInner />
    </Suspense>
  );
}
