'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/admin/StatusBadge';
import { useToast } from '@/components/shared/Toast';
import { formatDate, formatCurrency } from '@/lib/utils';

const STATUS_TABS = [
  { value: 'all',       label: 'All' },
  { value: 'draft',     label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export default function MyEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
        setLoading(false);
      });
  };
  useEffect(load, []);

  const togglePublish = async (e) => {
    // Organizers self-publish now (no superadmin review step) — go straight
    // to 'published' / 'draft'.
    const next = e.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/events/${e._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(
      next === 'published' ? 'Event published' : 'Event unpublished',
      'success',
    );
    load();
  };

  const cancel = async (e) => {
    if (
      !confirm(
        `Delete "${e.title}"?\n\nThe event will be cancelled and any booked customers will be notified + refunded automatically. This can't be undone.`,
      )
    )
      return;
    const res = await fetch(`/api/events/${e._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast('Event deleted', 'success');
    load();
  };

  // Count per status for the filter pills
  const counts = events.reduce(
    (acc, e) => {
      acc.all++;
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    { all: 0 },
  );
  const filtered =
    filter === 'all' ? events : events.filter((e) => e.status === filter);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          My events{' '}
          <span className="text-ink-muted">({events.length})</span>
        </h2>
        <Link href="/dashboard/events/create" className="btn-primary">
          <Plus className="h-4 w-4" /> New event
        </Link>
      </div>

      {/* Status filter pills */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((t) => {
          const isOn = filter === t.value;
          const n = counts[t.value] || 0;
          return (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isOn
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-ink-line bg-white text-obsidian/70 hover:border-brand-700/40 hover:text-brand-700'
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  isOn ? 'bg-white/20 text-white' : 'bg-pearl text-obsidian/60'
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card grid place-items-center py-20 text-center">
          <p className="font-semibold">
            {events.length === 0
              ? 'No events yet'
              : `No ${filter === 'all' ? '' : filter + ' '}events`}
          </p>
          <Link href="/dashboard/events/create" className="btn-primary mt-4">
            {events.length === 0 ? 'Create your first event' : 'Create new event'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e, i) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <img
                src={
                  e.bannerImage ||
                  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=70'
                }
                alt=""
                className="h-20 w-full rounded-lg object-cover sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{e.title}</h3>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {formatDate(e.startDate)} · {e.venue?.city || 'Online'}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {e.stats?.tickets || 0} tickets ·{' '}
                  {formatCurrency(e.stats?.revenue || 0)} · {e.totalViews || 0}{' '}
                  views
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/events/${e._id}/edit`}
                  className="btn-ghost text-sm"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                {e.status !== 'cancelled' && (
                  <button
                    onClick={() => togglePublish(e)}
                    className="btn-ghost text-sm"
                  >
                    {e.status === 'published' ? (
                      <>
                        <EyeOff className="h-4 w-4" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" /> Publish
                      </>
                    )}
                  </button>
                )}
                {e.status === 'published' && (
                  <Link
                    href={`/events/${e.slug}`}
                    className="btn-ghost text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                {e.status !== 'cancelled' && (
                  <button
                    onClick={() => cancel(e)}
                    className="btn-ghost text-sm text-brand-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
