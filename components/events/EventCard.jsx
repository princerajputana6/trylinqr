'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

function attendeesOf(e) {
  if (!e?.ticketTiers?.length) return 0;
  return e.ticketTiers.reduce((s, t) => s + (t.soldQuantity || 0), 0);
}

function shortId(id) {
  return String(id || '').slice(-6).toUpperCase();
}

/**
 * Vertical vintage ticket card.
 *  - Image on top, content in the middle, dashed perforation, date stub at
 *    the bottom (movie-ticket style)
 *  - No right-side ribbon, so it doesn't squeeze in narrow grids/rows
 */
export default function EventCard({ event, index = 0 }) {
  const cat = categoryBySlug(event.category);
  const CatIcon = cat.icon;
  const minPrice =
    event.minPrice ??
    (event.ticketTiers?.length
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0);
  const banner =
    event.bannerImage ||
    `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70`;
  const attendees = attendeesOf(event);
  const day = new Date(event.startDate).getDate();
  const month = formatDate(event.startDate, { month: 'short' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4) }}
      className="h-full"
    >
      <Link href={`/events/${event.slug}`} className="group block h-full">
        <motion.article
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-900/12 bg-sand-50 shadow-card"
        >
          {/* subtle paper noise */}
          <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.18]" />

          {/* IMAGE — top */}
          <div className="relative h-44 overflow-hidden">
            <img
              src={banner}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-sand-50/0 to-transparent" />

            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-card backdrop-blur"
              style={{ background: `${cat.color}E6` }}
            >
              <CatIcon className="h-3 w-3" strokeWidth={2.6} />
              {cat.label}
            </span>
            {event.isFeatured && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-sand-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-card">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            )}

            {/* date tab at bottom-left over the image */}
            <div className="absolute bottom-3 left-3 flex flex-col items-center rounded-lg bg-white/95 px-3 py-1.5 shadow-card backdrop-blur">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                {month}
              </span>
              <span className="font-display text-lg font-extrabold leading-none text-brand-900">
                {day}
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="relative flex flex-1 flex-col px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-700">
              {cat.label}
            </p>
            <h3 className="mt-1.5 line-clamp-2 min-h-[2.5em] font-display text-base font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-700">
              {event.title}
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-brand-900/70">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-700" />
                <span className="line-clamp-1">
                  {formatDate(event.startDate, { weekday: 'short' })}
                  {event.startTime ? ` · ${event.startTime}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-700" />
                <span className="line-clamp-1">
                  {event.venue?.name ? `${event.venue.name}, ` : ''}
                  {event.venue?.city || 'Online'}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between pt-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-brand-900/55">
                  Price
                </p>
                <p className="font-display text-lg font-extrabold leading-none text-brand-700">
                  {minPrice === 0 ? 'FREE' : formatCurrency(minPrice)}
                </p>
              </div>
              {attendees > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-brand-900/65">
                  <Users className="h-3 w-3 text-brand-700" />
                  {attendees} going
                </span>
              )}
            </div>
          </div>

          {/* dashed perforation line */}
          <div className="relative h-3 shrink-0">
            <span className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t border-dashed border-brand-700/35" />
            <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />
          </div>

          {/* BOTTOM STUB STRIP */}
          <div className="relative flex shrink-0 items-center justify-between gap-3 bg-brand-700 px-5 py-3 text-sand-50">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sand-200">
              No. {shortId(event._id)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand-50 transition-transform group-hover:translate-x-0.5">
              Get Tickets <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
