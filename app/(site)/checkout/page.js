'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, ShieldCheck, Loader2 } from 'lucide-react';
import Protected from '@/components/auth/Protected';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/shared/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CheckoutInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { toast } = useToast();
  const eventId = sp.get('event');
  const tierId = sp.get('tier');
  const qty = Math.max(1, parseInt(sp.get('qty') || '1', 10));

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!eventId) {
      router.replace('/explore');
      return;
    }
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEvent(d.event);
        setLoading(false);
      });
  }, [eventId, router]);

  if (loading) return <LoadingSpinner full />;
  if (!event)
    return (
      <div className="container-page py-20 text-center">Event not found.</div>
    );

  const tier =
    (event.ticketTiers || []).find((t) => t._id === tierId) ||
    event.ticketTiers[0];
  const subtotal = (tier?.price || 0) * qty;
  const platformFee =
    subtotal > 0
      ? Math.round(
          (subtotal * Number(process.env.NEXT_PUBLIC_PLATFORM_FEE || 5)) / 100
        )
      : 0;
  const hasRazorpay = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  const freeBooking = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, tierId: tier._id, quantity: qty }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    return data.bookingId;
  };

  const paidBooking = async () => {
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, tierId: tier._id, quantity: qty }),
    });
    const order = await orderRes.json();
    if (!order.ok) throw new Error(order.error);

    const loaded = await loadRazorpay();
    if (!loaded) throw new Error('Could not load payment gateway');

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TryLinqr',
        description: event.title,
        order_id: order.orderId,
        theme: { color: '#e63e62' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: order.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const v = await verifyRes.json();
          if (v.ok) resolve(v.bookingId);
          else reject(new Error(v.error));
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      });
      rzp.open();
    });
  };

  const pay = async () => {
    setPaying(true);
    try {
      let bookingId;
      if (subtotal > 0 && hasRazorpay) {
        bookingId = await paidBooking();
      } else {
        bookingId = await freeBooking();
      }
      toast('Booking confirmed!', 'success');
      router.push(`/booking/${bookingId}`);
    } catch (e) {
      toast(e.message || 'Payment failed', 'error');
      setPaying(false);
    }
  };

  return (
    <div className="container-page max-w-3xl py-10">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-3xl font-extrabold"
      >
        Checkout
      </motion.h1>

      <div className="grid gap-5 sm:grid-cols-[1fr_300px]">
        <div className="card overflow-hidden">
          <img
            src={
              event.bannerImage ||
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70'
            }
            alt={event.title}
            className="h-40 w-full object-cover"
          />
          <div className="space-y-2 p-5">
            <h2 className="text-lg font-bold">{event.title}</h2>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <Calendar className="h-4 w-4" />
              {formatDate(event.startDate, { weekday: 'long' })}
              {event.startTime ? ` · ${event.startTime}` : ''}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-4 w-4" />
              {event.venue?.name
                ? `${event.venue.name}, ${event.venue.city}`
                : event.venue?.city || 'Online'}
            </p>
            <div className="flex items-center gap-1.5 text-sm">
              <Ticket className="h-4 w-4 text-brand-400" />
              <span className="font-medium">{tier?.name}</span>
              <span className="text-ink-muted">× {qty}</span>
            </div>
          </div>
        </div>

        <div className="card h-fit p-5">
          <h3 className="mb-3 font-bold">Order summary</h3>
          <Row label={`${tier?.name} × ${qty}`} value={formatCurrency(subtotal)} />
          {platformFee > 0 && (
            <Row
              label="Platform fee"
              value={formatCurrency(platformFee)}
              muted
            />
          )}
          <div className="my-3 border-t border-white/10" />
          <Row
            label="Total"
            value={subtotal === 0 ? 'FREE' : formatCurrency(subtotal)}
            bold
          />
          <button
            onClick={pay}
            disabled={paying}
            className="btn-primary mt-4 w-full"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : subtotal === 0 ? (
              'Confirm free booking'
            ) : (
              `Pay ${formatCurrency(subtotal)}`
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5" />
            {subtotal > 0 && hasRazorpay
              ? 'Secured by Razorpay'
              : 'Instant confirmation'}
          </p>
          {subtotal > 0 && !hasRazorpay && (
            <p className="mt-2 text-center text-xs text-amber-400/80">
              Demo mode — payment is simulated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, muted }) {
  return (
    <div
      className={`flex items-center justify-between py-1 text-sm ${
        bold ? 'font-bold' : muted ? 'text-ink-muted' : ''
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Protected>
      <Suspense fallback={<LoadingSpinner full />}>
        <CheckoutInner />
      </Suspense>
    </Protected>
  );
}
