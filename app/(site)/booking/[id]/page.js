'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Protected from '@/components/auth/Protected';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatDate, formatCurrency } from '@/lib/utils';

function BookingInner() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setBooking(d.booking);
        setLoading(false);
      });
  };
  useEffect(load, [id]);

  if (loading) return <LoadingSpinner full />;
  if (!booking)
    return (
      <div className="container-page py-20 text-center">
        Booking not found.
      </div>
    );

  const event = booking.event || {};
  const eventOver = new Date(event.startDate) < new Date();
  const canCancel =
    !booking.checkedIn &&
    !eventOver &&
    booking.paymentStatus === 'paid';

  const cancel = async () => {
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    setCancelling(true);
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setCancelling(false);
    if (!data.ok) return toast(data.error, 'error');
    toast('Booking cancelled', 'success');
    load();
  };

  const downloadQR = () => {
    if (!booking.qrCode) return;
    const a = document.createElement('a');
    a.href = booking.qrCode;
    a.download = `${booking.bookingCode}.png`;
    a.click();
  };

  return (
    <div className="container-page max-w-2xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-800 p-6">
          <CheckCircle2 className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-extrabold">
              {booking.paymentStatus === 'refunded'
                ? 'Booking cancelled'
                : 'Booking confirmed'}
            </h1>
            <p className="text-sm text-white/80">
              Code: {booking.bookingCode}
            </p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold">{event.title}</h2>
          <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startDate, { weekday: 'long' })}
            </p>
            {event.startTime && (
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {event.startTime}
              </p>
            )}
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.venue?.name
                ? `${event.venue.name}, ${event.venue.city}`
                : event.venue?.city || 'Online'}
            </p>
          </div>

          <div className="my-5 grid grid-cols-3 gap-3 rounded-xl bg-white/5 p-4 text-center">
            <div>
              <p className="text-xs text-ink-muted">Tier</p>
              <p className="font-semibold">{booking.ticketTier?.name}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Quantity</p>
              <p className="font-semibold">{booking.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Paid</p>
              <p className="font-semibold">
                {booking.totalAmount === 0
                  ? 'FREE'
                  : formatCurrency(booking.totalAmount)}
              </p>
            </div>
          </div>

          {booking.qrCode && booking.paymentStatus !== 'refunded' ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-ink-muted">
                Show this QR code at the venue entrance
              </p>
              <img
                src={booking.qrCode}
                alt="QR ticket"
                className="h-52 w-52 rounded-2xl border-4 border-white"
              />
              {booking.checkedIn ? (
                <span className="chip bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
                </span>
              ) : (
                <button onClick={downloadQR} className="btn-outline">
                  <Download className="h-4 w-4" /> Download ticket
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-6 text-sm text-ink-muted">
              <XCircle className="h-5 w-5" />
              {booking.paymentStatus === 'refunded'
                ? 'This booking was cancelled.'
                : 'Payment is pending.'}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Link
              href={`/events/${event.slug}`}
              className="btn-ghost flex-1"
            >
              View event
            </Link>
            {canCancel && (
              <button
                onClick={cancel}
                disabled={cancelling}
                className="btn-outline flex-1 text-brand-400"
              >
                {cancelling ? 'Cancelling…' : 'Cancel booking'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Protected>
      <BookingInner />
    </Protected>
  );
}
