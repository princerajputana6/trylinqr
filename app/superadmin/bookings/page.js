'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatDateTime, formatCurrency } from '@/lib/utils';

const STATUS_STYLE = {
  paid: 'bg-emerald-500/15 text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-400',
  failed: 'bg-brand-500/15 text-brand-700',
  refunded: 'bg-pearl text-ink-muted',
};

export default function SuperadminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/superadmin/bookings')
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookings || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner full />;

  const filtered = bookings.filter(
    (b) =>
      !search ||
      b.bookingCode?.toLowerCase().includes(search.toLowerCase()) ||
      b.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const revenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xl font-extrabold">{bookings.length}</p>
          <p className="text-xs text-ink-muted">Total bookings</p>
        </div>
        <div className="card p-4">
          <p className="text-xl font-extrabold">
            {bookings.filter((b) => b.paymentStatus === 'paid').length}
          </p>
          <p className="text-xs text-ink-muted">Confirmed</p>
        </div>
        <div className="card p-4">
          <p className="text-xl font-extrabold">{formatCurrency(revenue)}</p>
          <p className="text-xs text-ink-muted">Gross revenue</p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, event or customer…"
          className="input pl-9"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-line text-left text-xs uppercase text-ink-muted">
              <th className="p-3">Code</th>
              <th className="p-3">Event</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <motion.tr
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-white/5"
              >
                <td className="p-3 font-mono text-xs text-brand-700">
                  {b.bookingCode}
                </td>
                <td className="p-3">{b.event?.title || '—'}</td>
                <td className="p-3">{b.customer?.name || '—'}</td>
                <td className="p-3">{b.quantity}</td>
                <td className="p-3">{formatCurrency(b.totalAmount)}</td>
                <td className="p-3 text-ink-muted">
                  {formatCurrency(b.platformFee || 0)}
                </td>
                <td className="p-3">
                  <span
                    className={`chip ${STATUS_STYLE[b.paymentStatus]}`}
                  >
                    {b.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-xs text-ink-muted">
                  {formatDateTime(b.createdAt)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
