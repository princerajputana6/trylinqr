'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

/**
 * Reusable "vintage ticket" event card.
 *  - Cream linen surface, crimson + sand accents
 *  - Image left, content middle, date stub on the right
 *  - Equal-height structure: title clamped to 2 lines, description to 2
 *    lines, content area uses flex-1, parent uses h-full — so siblings in
 *    a grid/scroller stay perfectly aligned.
 *
 * size = 'hero' | 'list' | 'compact'
 */
export default function VintageTicket({
  event,
  size = 'list',
  href,
  showActions = true,
  className = '',
}) {
  if (!event) return null;
  const cat = categoryBySlug(event.category);
  const CatIcon = cat.icon;
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=75';
  const minPrice =
    event.minPrice ??
    (event.ticketTiers?.length
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0);
  const day = new Date(event.startDate).getDate();
  const month = formatDate(event.startDate, { month: 'short' });
  const linkHref = href || `/events/${event.slug}`;

  // sizing — both image & content adopt a shared minimum height for the
  // size variant, and `h-full` on the article lets parent grids force
  // equal heights across siblings.
  const sizes = {
    hero: {
      grid: 'grid-cols-[1.05fr_1.4fr_0.42fr]',
      minH: 'min-h-[420px] sm:min-h-[460px]',
      title: 'text-2xl sm:text-3xl',
      ticketCornerLabel: 'EVENT TICKET · ADMIT ONE',
      stubLabel: 'No. ' + slugId(event._id),
    },
    list: {
      grid: 'grid-cols-[150px_1fr_72px] sm:grid-cols-[200px_1fr_84px]',
      minH: 'min-h-[360px] sm:min-h-[380px]',
      title: 'text-lg sm:text-xl',
      ticketCornerLabel: 'EVENT TICKET',
      stubLabel: 'No. ' + slugId(event._id),
    },
    compact: {
      grid: 'grid-cols-[110px_1fr_60px]',
      minH: 'min-h-[220px]',
      title: 'text-base',
      ticketCornerLabel: 'TICKET',
      stubLabel: '',
    },
  }[size] || {};

  return (
    <Link href={linkHref} className={`group block h-full ${className}`}>
      <motion.article
        whileHover={size === 'compact' ? {} : { y: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={`relative flex h-full ${sizes.minH} overflow-hidden rounded-[26px] border border-brand-900/15 bg-sand-50 shadow-elevated`}
      >
        {/* paper texture */}
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.22]" />
        {/* outer ornamental dashed border */}
        <div className="pointer-events-none absolute inset-2 rounded-[20px] border border-dashed border-brand-700/25" />
        {/* corner label */}
        <div className="pointer-events-none absolute left-5 top-3 z-10 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-700/70">
          {sizes.ticketCornerLabel}
        </div>

        {/* main grid — items-stretch + h-full so all 3 columns are equal */}
        <div className={`relative grid h-full w-full ${sizes.grid} items-stretch`}>
          {/* IMAGE — fills the column */}
          <div className="relative h-full overflow-hidden">
            <motion.img
              src={banner}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/15 via-transparent to-sand-700/15 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-sand-50/40 via-transparent to-transparent" />
            <span className="pointer-events-none absolute inset-y-4 right-0 border-l border-dashed border-brand-700/30" />

            <span
              className="absolute left-3 top-9 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-card backdrop-blur"
              style={{ background: `${cat.color}E6` }}
            >
              <CatIcon className="h-3 w-3" strokeWidth={2.6} />
              {cat.label}
            </span>
          </div>

          {/* CONTENT — flex column, bottom-anchored actions */}
          <div className="relative flex h-full flex-col px-5 pb-5 pt-9 sm:px-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">
              {cat.label} · {event.venue?.city || 'Online'}
            </p>

            {/* title — clamped to 2 lines for equal height */}
            <h3
              className={`mt-2 line-clamp-2 min-h-[2.1em] font-display font-extrabold leading-tight tracking-tight text-brand-900 ${sizes.title}`}
            >
              {event.title}
            </h3>

            {/* description — clamped to 2 lines, reserves space */}
            {size !== 'compact' && (
              <p className="mt-2 line-clamp-2 min-h-[2.6em] text-sm text-brand-900/70">
                {event.description || ' '}
              </p>
            )}

            {/* meta */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-brand-900/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-700" />
                {formatDate(event.startDate, { weekday: 'short' })}
              </span>
              {event.startTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-700" />
                  {event.startTime}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-700" />
                {event.venue?.city || 'Online'}
              </span>
            </div>

            {/* spacer pushes price + actions to bottom */}
            <div className="flex-1" />

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-900/55">
                  Price
                </p>
                <p className="font-display text-xl font-extrabold leading-none text-brand-700">
                  {minPrice === 0 ? 'FREE' : formatCurrency(minPrice)}
                </p>
              </div>
              {showActions && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sand-50 shadow-glow-soft transition-transform group-hover:-translate-y-0.5">
                  Get Tickets
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            {showActions && (
              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-brand-900/45 group-hover:text-brand-900/70">
                View details →
              </p>
            )}
          </div>

          {/* STUB */}
          <div className="relative flex h-full flex-col items-center justify-center gap-1.5 bg-brand-700 px-2 text-sand-50">
            <span className="pointer-events-none absolute inset-y-4 left-0 border-l border-dashed border-sand-100/40" />
            <div className="absolute inset-y-3 right-2 w-px bg-sand-100/15" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-sand-200">
              {month}
            </span>
            <span className="font-display text-3xl font-extrabold leading-none sm:text-4xl">
              {day}
            </span>
            {event.startTime && (
              <span className="mt-1 rounded-md bg-sand-50/15 px-2 py-0.5 text-[10px] tracking-wider">
                {event.startTime}
              </span>
            )}
            {sizes.stubLabel && (
              <span
                className="mt-3 text-[8px] uppercase tracking-[0.2em] text-sand-200/80"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {sizes.stubLabel}
              </span>
            )}
          </div>
        </div>

        {/* punched cutout indicators on the outer left/right edges */}
        <span className="pointer-events-none absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />
        <span className="pointer-events-none absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl ring-1 ring-brand-700/15" />
      </motion.article>
    </Link>
  );
}

function slugId(id) {
  return String(id || '').slice(-6).toUpperCase();
}
