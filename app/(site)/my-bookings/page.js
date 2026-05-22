'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, QrCode, Ticket } from 'lucide-react';
import Protected from '@/components/auth/Protected';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatDate, formatCurrency } from '@/lib/utils';

const STATUS_STYLE = {
  paid: 'bg-emerald-500/15 text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-400',
  failed: 'bg-brand-500/15 text-brand-400',
  refunded: 'bg-white/10 text-ink-muted',
};

function MyBookingsInner() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    fetch('/api/bookings/my')
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookings || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner full />;

  const now = Date.now();
  const filtered = bookings.filter((b) => {
    const upcoming =
      b.event && new Date(b.event.startDate).getTime() >= now;
    return tab === 'upcoming' ? upcoming : !upcoming;
  });

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">My bookings</h1>
      <p className="mb-6 mt-1 text-sm text-ink-muted">
        {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
      </p>

      <div className="mb-6 flex gap-2">
        {['upcoming', 'past'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'bg-brand-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card grid place-items-center py-20 text-center">
          <Ticket className="h-10 w-10 text-ink-muted" />
          <p className="mt-3 font-semibold">No {tab} bookings</p>
          <Link href="/explore" className="btn-primary mt-4">
            Explore events
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/booking/${b._id}`}>
                <div className="card flex gap-4 overflow-hidden p-3 transition-colors hover:border-brand-500/40">
                  <img
                    src={
                      b.event?.bannerImage ||
                      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=70'
                    }
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 font-bold">
                        {b.event?.title || 'Event'}
                      </h3>
                      <span
                        className={`chip ${STATUS_STYLE[b.paymentStatus]}`}
                      >
                        {b.paymentStatus}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(b.event?.startDate)}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      {b.event?.venue?.city || 'Online'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-ink-muted">
                        {b.ticketTier?.name} × {b.quantity}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-brand-400">
                        <QrCode className="h-3.5 w-3.5" />
                        {b.bookingCode}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Protected>
      <MyBookingsInner />
    </Protected>
  );
}
