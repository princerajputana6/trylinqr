'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

const CATEGORIES = [
  { v: 'booking', l: 'Booking' },
  { v: 'payment', l: 'Payment' },
  { v: 'ticket', l: 'Ticket / QR code' },
  { v: 'event', l: 'About an event' },
  { v: 'account', l: 'My account' },
  { v: 'general', l: 'Something else' },
];

function NewTicketInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { toast } = useToast();
  const presetBooking = sp.get('booking') || '';
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    subject: '',
    category: presetBooking ? 'booking' : 'general',
    priority: 'normal',
    message: '',
    relatedBookingId: presetBooking,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/bookings/my')
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      return toast('Add a subject and message', 'error');
    }
    setBusy(true);
    const res = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return toast(data.error, 'error');
    toast('Ticket raised — we’ll reply shortly', 'success');
    router.push(`/support/${data.ticket._id}`);
  };

  return (
    <div className="container-page max-w-2xl py-10">
      <Link
        href="/support"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to support
      </Link>

      <div className="card p-6 sm:p-8">
        <h1 className="font-display text-2xl font-extrabold text-obsidian sm:text-3xl">
          Raise a support ticket
        </h1>
        <p className="mt-1 text-sm text-obsidian/65">
          Tell us what&apos;s going on — our team will respond and route it to
          the right organizer when needed.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.v} value={c.v}>
                    {c.l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Subject</label>
            <input
              required
              maxLength={140}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Short summary of the issue"
              className="input"
            />
          </div>

          {bookings.length > 0 && (
            <div>
              <label className="label">Link to a booking (optional)</label>
              <select
                value={form.relatedBookingId}
                onChange={(e) =>
                  setForm({ ...form, relatedBookingId: e.target.value })
                }
                className="input"
              >
                <option value="">— No booking —</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.bookingCode} · {b.event?.title || 'Event'}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-ink-muted">
                Linking a booking lets the team and organizer see all the
                relevant details.
              </p>
            </div>
          )}

          <div>
            <label className="label">Describe the issue</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              placeholder="Explain what happened, what you expected, and any steps you've already tried…"
              className="input resize-none"
            />
          </div>

          <button disabled={busy} className="btn-primary w-full sm:w-auto">
            <Send className="h-4 w-4" />
            {busy ? 'Submitting…' : 'Submit ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewTicketPage() {
  return (
    <Suspense fallback={null}>
      <NewTicketInner />
    </Suspense>
  );
}
