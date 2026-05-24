'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  LifeBuoy,
  Calendar,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusPill from '@/components/support/StatusPill';
import { formatDateTime } from '@/lib/utils';

const FAQS = [
  {
    q: 'How do I get my QR ticket after booking?',
    a: 'Your QR ticket is emailed to you the moment payment is confirmed, and is also available in My Bookings → tap a booking to view & download.',
  },
  {
    q: 'Can I cancel a booking and get a refund?',
    a: 'Yes — open the booking in My Bookings and use Cancel. Refunds follow the organizer\'s cancellation policy shown on the event page.',
  },
  {
    q: 'My payment failed but money was deducted',
    a: 'Bank holds are typically released within 5–7 business days. If you don\'t see a refund, raise a ticket below with the booking ID — our team will investigate.',
  },
  {
    q: 'How do I become an event organizer?',
    a: 'Click "Become Organizer" in the header. Your account is reviewed by our team — once approved you can publish events and manage bookings.',
  },
];

export default function SupportCenter() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/support/my')
      .then((r) => r.json())
      .then((d) => {
        setTickets(d.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="section-eyebrow">Help & support</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-obsidian/65 sm:text-base">
            Raise a ticket about a booking, payment, event or your account —
            our team responds quickly and can route you to the right organizer
            when needed.
          </p>
        </div>
        <Link href="/support/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Raise a ticket
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* tickets */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-brand-700" />
            <h2 className="font-display text-xl font-bold text-obsidian">
              Your tickets
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : tickets.length === 0 ? (
            <div className="card grid place-items-center py-14 text-center">
              <LifeBuoy className="h-10 w-10 text-ink-muted" />
              <p className="mt-3 font-semibold text-obsidian">
                No tickets yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-ink-muted">
                Got a question or hit a snag? Raise a ticket and we&apos;ll
                jump on it.
              </p>
              <Link href="/support/new" className="btn-primary mt-5">
                <Plus className="h-4 w-4" /> Raise a ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <Link
                  key={t._id}
                  href={`/support/${t._id}`}
                  className="hover-glow card flex items-start gap-4 p-4 transition-colors hover:border-brand-700/30"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
                    <LifeBuoy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-base font-bold text-obsidian">
                        {t.subject}
                      </p>
                      <StatusPill status={t.status} />
                    </div>
                    <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-muted">
                      {t.ticketCode} · {t.category}
                    </p>
                    {t.relatedEvent && (
                      <p className="mt-1 text-xs text-obsidian/65">
                        On{' '}
                        <span className="font-semibold">
                          {t.relatedEvent.title}
                        </span>
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      Updated {formatDateTime(t.updatedAt)}
                      {t.customerUnread > 0 && (
                        <span className="ml-2 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">
                          {t.customerUnread} new
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-ink-muted" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* FAQs */}
        <aside>
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-700" />
            <h2 className="font-display text-xl font-bold text-obsidian">
              Common questions
            </h2>
          </div>
          <div className="card divide-y divide-ink-line">
            {FAQS.map((f, i) => (
              <details key={i} className="group p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-obsidian">
                  {f.q}
                  <span className="float-right text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-obsidian/70">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <div className="card mt-4 p-5 text-sm">
            <p className="font-semibold text-obsidian">Need to host events?</p>
            <p className="mt-1 text-ink-muted">
              For organizer-specific questions, log in to your dashboard and use
              the Support tab there.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
