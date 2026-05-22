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

export default function MyEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const next = e.status === 'published' ? 'draft' : 'pending';
    const res = await fetch(`/api/events/${e._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast(
      next === 'pending' ? 'Submitted for review' : 'Event unpublished',
      'success'
    );
    load();
  };

  const cancel = async (e) => {
    if (!confirm(`Cancel "${e.title}"? Booked customers will be notified.`))
      return;
    const res = await fetch(`/api/events/${e._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast('Event cancelled', 'success');
    load();
  };

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

      {events.length === 0 ? (
        <div className="card grid place-items-center py-20 text-center">
          <p className="font-semibold">No events yet</p>
          <Link href="/dashboard/events/create" className="btn-primary mt-4">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e, i) => (
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
                    className="btn-ghost text-sm text-brand-400"
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
