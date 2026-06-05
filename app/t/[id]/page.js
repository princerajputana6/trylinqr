// Public ticket-scan page — what an organizer sees after scanning a QR
// at the gate with their phone. No login required; the secret bookingCode
// in the URL gates access.

import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

export const dynamic = 'force-dynamic';

async function loadTicket(id, code) {
  if (!id || !code) return null;
  if (!/^[0-9a-fA-F]{24}$/.test(String(id))) return null;
  try {
    await connectDB();
    const booking = await Booking.findById(id)
      .populate('customer', 'name email')
      .lean();
    if (!booking) return null;
    if (String(booking.bookingCode).trim() !== String(code).trim()) return null;
    const event = await Event.findById(booking.event)
      .populate('organizer', 'name orgName')
      .lean();
    return { booking, event };
  } catch {
    return null;
  }
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function TicketScanPage({ params, searchParams }) {
  const data = await loadTicket(params.id, searchParams?.c);
  if (!data) {
    return (
      <main className="min-h-screen bg-white px-4 py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-brand-700/30 bg-brand-50 p-8 text-center">
          <p className="text-2xl">⛔</p>
          <h1 className="mt-3 font-display text-xl font-extrabold text-brand-800">
            Invalid or expired ticket
          </h1>
          <p className="mt-2 text-sm text-obsidian/70">
            This QR code doesn't match any booking on TryLinqr. Ask the guest
            to show the original ticket email.
          </p>
        </div>
      </main>
    );
  }

  const { booking, event } = data;
  const checkedIn = !!booking.checkedInAt;

  return (
    <main className="min-h-screen bg-pearl px-4 py-10">
      <div className="mx-auto max-w-md">
        {/* Brand bar */}
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/trylinqr.png"
            alt="TryLinqr"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-elevated ring-1 ring-obsidian/5">
          {/* Status banner */}
          <div
            className={`px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white ${
              checkedIn ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
          >
            {checkedIn ? '✓ Already checked in' : '✓ Valid ticket'}
          </div>

          <div className="space-y-5 p-6">
            {/* Event */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-700">
                {event?.category}
              </p>
              <h1 className="mt-1 font-display text-xl font-extrabold leading-tight text-obsidian">
                {event?.title || 'Event'}
              </h1>
              <p className="mt-1 text-sm text-obsidian/70">
                {fmtDate(event?.startDate)}
                {event?.startTime ? ` · ${event.startTime}` : ''}
              </p>
              {event?.venue?.name && (
                <p className="mt-0.5 text-sm text-obsidian/70">
                  {event.venue.name}
                  {event.venue.city ? `, ${event.venue.city}` : ''}
                </p>
              )}
              {event?.organizer && (
                <p className="mt-1 text-xs text-obsidian/55">
                  Hosted by {event.organizer}
                </p>
              )}
            </div>

            <hr className="border-dashed border-obsidian/15" />

            {/* Booking facts */}
            <dl className="space-y-2 text-sm">
              <Row label="Booking code" value={booking.bookingCode} mono />
              <Row
                label="Tier"
                value={`${booking.ticketTier?.name || '—'} × ${booking.quantity}`}
              />
              <Row
                label="Amount paid"
                value={
                  booking.totalAmount === 0
                    ? 'FREE'
                    : `₹${booking.totalAmount}`
                }
              />
              <Row
                label="Payment"
                value={booking.paymentStatus?.toUpperCase()}
              />
              {checkedIn && (
                <Row
                  label="Checked in at"
                  value={new Date(booking.checkedInAt).toLocaleString('en-IN')}
                />
              )}
            </dl>

            <hr className="border-dashed border-obsidian/15" />

            {/* Guest */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-obsidian/55">
                Guest
              </p>
              <p className="mt-1 text-sm font-semibold text-obsidian">
                {booking.customer?.name || 'Guest'}
              </p>
              <p className="text-xs text-obsidian/55">
                {booking.customer?.email}
              </p>
            </div>
          </div>

          {/* footer note */}
          <div className="border-t border-obsidian/8 bg-pearl px-6 py-3 text-center text-[11px] text-obsidian/55">
            Verified on TryLinqr ·{' '}
            <a
              href="https://trylinqr.com"
              className="font-semibold text-brand-700"
            >
              trylinqr.com
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-obsidian/55">
          Organizers can mark this ticket as checked-in from the bookings
          dashboard.
        </p>
      </div>
    </main>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs uppercase tracking-wider text-obsidian/55">
        {label}
      </dt>
      <dd
        className={`text-right text-sm font-semibold text-obsidian ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
