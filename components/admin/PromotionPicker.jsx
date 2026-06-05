'use client';

import { useMemo, useState } from 'react';
import { Loader2, Sparkles, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';
import { PROMOTIONS, calcPromoTotal } from '@/lib/promotions';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Lets an organizer pick paid placements for an event and pay via Razorpay.
 *
 * Props:
 *   eventId   — mongo id of the event (REQUIRED — promotions only work
 *               on a saved event so the order can be associated).
 *   eventTitle— shown in the Razorpay modal.
 *   alreadyActive — string[] of placement types already paid for, so
 *                   the UI can show them as "active".
 *   onApplied — callback fired after a successful verify with the new
 *               active placements (parent can refresh local state).
 *
 * NOTE: Promotions are independent of the event ticket price — even free
 * (₹0) events can be promoted via paid placements.
 */
export default function PromotionPicker({
  eventId,
  eventTitle = 'your event',
  alreadyActive = [],
  onApplied,
}) {
  const { toast } = useToast();
  const [selected, setSelected] = useState({});
  const [paying, setPaying] = useState(false);

  // Client-side Razorpay key presence check (does NOT reveal the secret)
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const toggle = (type) =>
    setSelected((s) => ({ ...s, [type]: !s[type] }));

  const chosen = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected],
  );
  const total = calcPromoTotal(chosen);

  const pay = async () => {
    if (!eventId) {
      toast('Save the event first, then upgrade with paid promotions.', 'info');
      return;
    }
    if (!chosen.length) {
      toast('Pick at least one placement', 'info');
      return;
    }
    if (!razorpayKeyId) {
      toast(
        'Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.',
        'error',
      );
      return;
    }
    setPaying(true);
    try {
      const orderRes = await fetch(
        `/api/events/${eventId}/promote/order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ types: chosen }),
        },
      );
      const order = await orderRes.json();
      if (!order.ok) throw new Error(order.error || 'Could not start payment');

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Payment gateway failed to load. Check your internet connection and try again.');

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          // Prefer keyId returned by server; fall back to the public env var
          key: order.keyId || razorpayKeyId,
          amount: order.amount,
          currency: order.currency,
          name: 'TryLinqr',
          description: `Promotion for ${eventTitle}`,
          order_id: order.orderId,
          theme: { color: '#944268' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch(
                `/api/events/${eventId}/promote/verify`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    types: chosen,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                },
              );
              const v = await verifyRes.json();
              if (!v.ok) return reject(new Error(v.error));
              toast('Promotions activated!', 'success');
              setSelected({});
              onApplied?.(v.placements || chosen);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      });
    } catch (e) {
      // Don't show an error toast when the user dismisses the modal
      if (e.message !== 'Payment cancelled') {
        toast(e.message || 'Payment failed', 'error');
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-line bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-700" />
        <h3 className="font-display text-base font-bold text-obsidian">
          Promote this event{' '}
          <span className="text-xs font-normal text-ink-muted">
            (paid placements — applied instantly after payment)
          </span>
        </h3>
      </div>

      {/* Warning: event not yet saved */}
      {!eventId && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Save the event first — promotions can be purchased from the edit
          page after the event exists.
        </p>
      )}

      {/* Warning: Razorpay keys missing (client-side check) */}
      {eventId && !razorpayKeyId && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            Razorpay is not configured. Add{' '}
            <code className="font-mono">NEXT_PUBLIC_RAZORPAY_KEY_ID</code>,{' '}
            <code className="font-mono">RAZORPAY_KEY_ID</code> and{' '}
            <code className="font-mono">RAZORPAY_KEY_SECRET</code> to your
            environment variables and restart the server.
          </span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {PROMOTIONS.map((p) => {
          const active = alreadyActive.includes(p.type);
          const picked = !!selected[p.type];
          // Tiles are disabled ONLY if already active or no eventId saved yet.
          // Event ticket price does NOT gate promotions — even ₹0 events can be promoted.
          const isDisabled = active || !eventId;
          return (
            <button
              type="button"
              key={p.type}
              onClick={() => !isDisabled && toggle(p.type)}
              disabled={isDisabled}
              className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                active
                  ? 'border-emerald-300 bg-emerald-50/50 opacity-90'
                  : picked
                  ? 'border-brand-700 bg-brand-700/[0.06] ring-2 ring-brand-700/40'
                  : 'border-ink-line bg-white hover:border-brand-700/40'
              }`}
            >
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-brand-700/30">
                {active ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : picked ? (
                  <Check className="h-4 w-4 text-brand-700" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-bold text-obsidian">
                    {p.label}
                  </p>
                  <span className="text-sm font-bold text-brand-700">
                    ₹{p.price}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-obsidian/65">
                  {p.description}
                </p>
                {active && (
                  <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-line pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-obsidian/55">
            Total
          </p>
          <p className="font-display text-xl font-extrabold text-brand-700">
            ₹{total}
          </p>
        </div>
        <button
          type="button"
          onClick={pay}
          disabled={!eventId || !chosen.length || paying}
          className="btn-primary"
        >
          {paying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {paying ? 'Opening payment…' : `Pay ₹${total} & promote`}
        </button>
      </div>
    </div>
  );
}
