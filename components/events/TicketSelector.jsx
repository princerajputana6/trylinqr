'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Minus, Plus, Ticket, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/shared/Toast';

export default function TicketSelector({ event }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const tiers = event.ticketTiers || [];
  const [selected, setSelected] = useState(tiers[0]?._id || null);
  const [qty, setQty] = useState(1);

  const tier = tiers.find((t) => t._id === selected) || tiers[0];
  const soldOut = tier && tier.totalQuantity - tier.soldQuantity <= 0;
  const remaining = tier ? tier.totalQuantity - tier.soldQuantity : 0;
  const maxQty = Math.min(10, remaining);
  const total = (tier?.price || 0) * qty;
  const eventOver = new Date(event.startDate) < new Date();
  const notPublished = event.status !== 'published';

  const proceed = () => {
    if (!session) {
      toast('Please log in to book', 'info');
      router.push(`/login?callbackUrl=/events/${event.slug}`);
      return;
    }
    router.push(
      `/checkout?event=${event._id}&tier=${tier._id}&qty=${qty}`
    );
  };

  if (!tiers.length) {
    return (
      <div className="card p-5 text-sm text-ink-muted">
        Ticket information is not available yet.
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <Ticket className="h-5 w-5 text-brand-700" /> Select tickets
      </h3>

      <div className="space-y-2">
        {tiers.map((t) => {
          const left = t.totalQuantity - t.soldQuantity;
          const active = t._id === selected;
          return (
            <button
              key={t._id}
              onClick={() => {
                setSelected(t._id);
                setQty(1);
              }}
              disabled={left <= 0}
              className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition-colors disabled:opacity-50 ${
                active
                  ? 'border-brand-700 bg-brand-700/[0.06]'
                  : 'border-ink-line hover:border-obsidian/25'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  {t.name}
                  {active && <Check className="h-4 w-4 text-brand-700" />}
                </div>
                {t.description && (
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t.description}
                  </p>
                )}
                {t.benefits?.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {t.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-ink-muted">
                        • {b}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1 text-xs text-ink-muted">
                  {left > 0 ? `${left} left` : 'Sold out'}
                </p>
              </div>
              <div className="shrink-0 font-bold">
                {t.price === 0 ? 'FREE' : formatCurrency(t.price)}
              </div>
            </button>
          );
        })}
      </div>

      {!soldOut && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-ink-muted">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line bg-pearl hover:bg-pearl/70"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line bg-pearl hover:bg-pearl/70"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-ink-line pt-4">
        <span className="text-sm text-ink-muted">Total</span>
        <span className="text-xl font-extrabold">
          {total === 0 ? 'FREE' : formatCurrency(total)}
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={proceed}
        disabled={soldOut || eventOver || notPublished}
        className="btn-primary mt-4 w-full"
      >
        {notPublished
          ? 'Not available'
          : eventOver
          ? 'Event ended'
          : soldOut
          ? 'Sold out'
          : 'Proceed to book'}
      </motion.button>
    </div>
  );
}
