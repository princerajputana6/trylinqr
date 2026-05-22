'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Star, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/admin/StatusBadge';
import { useToast } from '@/components/shared/Toast';
import { formatDate } from '@/lib/utils';
import { categoryBySlug } from '@/lib/constants';

const FILTERS = ['all', 'pending', 'published', 'draft', 'cancelled'];

function EventsInner() {
  const sp = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState(sp.get('status') || 'all');
  const [events, setEvents] = useState([]);
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

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              status === f
                ? 'bg-brand-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {f}
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
          {events.map((e, i) => {
            const cat = categoryBySlug(e.category);
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
                      <span className="chip bg-amber-400/20 text-amber-400">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {cat.emoji} {cat.label} · by{' '}
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
                      className="btn-ghost px-3 py-1.5 text-xs text-brand-400"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
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
