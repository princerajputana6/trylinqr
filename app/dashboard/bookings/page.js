'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, QrCode, Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDateTime, formatCurrency } from '@/lib/utils';

export default function DashboardBookingsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((d) => {
        const list = d.events || [];
        setEvents(list);
        if (list.length) setSelected(list[0]._id);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingBookings(true);
    fetch(`/api/bookings/event/${selected}`)
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookings || []);
        setLoadingBookings(false);
      });
  }, [selected]);

  const checkIn = async (b) => {
    const res = await fetch(`/api/bookings/${b._id}/checkin`, {
      method: 'PUT',
    });
    const data = await res.json();
    if (!data.ok) return toast(data.error, 'error');
    toast('Checked in', 'success');
    setBookings((list) =>
      list.map((x) =>
        x._id === b._id
          ? { ...x, checkedIn: true, checkedInAt: new Date().toISOString() }
          : x
      )
    );
  };

  if (loading) return <LoadingSpinner full />;

  if (!events.length) {
    return (
      <div className="card grid place-items-center py-20 text-center">
        <p className="font-semibold">No events yet</p>
        <p className="mt-1 text-sm text-ink-muted">
          Create an event to start receiving bookings.
        </p>
      </div>
    );
  }

  const filtered = bookings.filter(
    (b) =>
      !search ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paid = bookings.filter((b) => b.paymentStatus === 'paid');
  const checkedIn = paid.filter((b) => b.checkedIn).length;
  const tickets = paid.reduce((s, b) => s + b.quantity, 0);
  const revenue = paid.reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input sm:max-w-xs"
        >
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name or email"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini label="Bookings" value={paid.length} />
        <Mini label="Tickets" value={tickets} />
        <Mini label="Checked in" value={`${checkedIn}/${paid.length}`} />
        <Mini label="Revenue" value={formatCurrency(revenue)} />
      </div>

      {loadingBookings ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card py-16 text-center text-sm text-ink-muted">
          No bookings found.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase text-ink-muted">
                <th className="p-3">Code</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Booked</th>
                <th className="p-3"></th>
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
                  <td className="p-3 font-mono text-xs text-brand-400">
                    {b.bookingCode}
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{b.customer?.name}</p>
                    <p className="text-xs text-ink-muted">
                      {b.customer?.email}
                    </p>
                  </td>
                  <td className="p-3">{b.ticketTier?.name}</td>
                  <td className="p-3">{b.quantity}</td>
                  <td className="p-3">{formatCurrency(b.totalAmount)}</td>
                  <td className="p-3 capitalize">{b.paymentStatus}</td>
                  <td className="p-3 text-xs text-ink-muted">
                    {formatDateTime(b.createdAt)}
                  </td>
                  <td className="p-3">
                    {b.paymentStatus === 'paid' &&
                      (b.checkedIn ? (
                        <span className="chip bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> In
                        </span>
                      ) : (
                        <button
                          onClick={() => checkIn(b)}
                          className="btn-outline px-3 py-1.5 text-xs"
                        >
                          <QrCode className="h-3.5 w-3.5" /> Check in
                        </button>
                      ))}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
