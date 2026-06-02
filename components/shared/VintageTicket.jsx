'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

/**
 * Real-ticket event card.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │  IMAGE BANNER (with category chip)       │
 *   │                          [date pill]     │
 *   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← horizontal perforation
 *   o                                          o  ← left + right notches
 *   ├──────────────────────────────────┬───────┤
 *   │  TITLE (2 lines)                 │  JAN  │
 *   │  City · Day · Time               │  24   │
 *   │  ▓▓▓▓▓ barcode ▓▓▓▓▓             │ ━━━━  │
 *   │  FREE     [ Get Tickets → ]      │ #ABC  │
 *   └──────────────────────────────────┴───────┘
 *
 * Keeps the same prop API the rest of the app uses:
 *   <VintageTicket event size="hero|list|compact" href showActions />
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
  const month = formatDate(event.startDate, { month: 'short' }).toUpperCase();
  const linkHref = href || `/events/${event.slug}`;
  const serial = String(event._id || '').slice(-6).toUpperCase() || 'ABC123';

  const sizes = {
    hero: {
      banner: 'h-[220px] sm:h-[260px]',
      stub:   'w-[110px] sm:w-[120px]',
      title:  'text-xl sm:text-2xl',
      day:    'text-4xl sm:text-5xl',
    },
    list: {
      banner: 'h-[170px] sm:h-[190px]',
      stub:   'w-[92px] sm:w-[104px]',
      title:  'text-base sm:text-lg',
      day:    'text-3xl sm:text-[2.4rem]',
    },
    compact: {
      banner: 'h-[120px]',
      stub:   'w-[78px]',
      title:  'text-sm',
      day:    'text-2xl',
    },
  }[size] || {};

  return (
    <Link href={linkHref} className={`group block h-full ${className}`}>
      <motion.article
        whileHover={size === 'compact' ? {} : { y: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-obsidian/5"
      >
        {/* ── BANNER ── */}
        <div className={`relative ${sizes.banner} w-full overflow-hidden`}>
          <motion.img
            src={banner}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* category chip */}
          <span
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-obsidian shadow-sm"
            style={{ backgroundColor: cat.color }}
          >
            <CatIcon className="h-3 w-3" strokeWidth={2.6} />
            {cat.label}
          </span>
          {/* corner label — top right */}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-obsidian/75">
            Admit One
          </span>
        </div>

        {/* ── HORIZONTAL PERFORATION (with notch cutouts on both edges) ── */}
        <div className="relative">
          {/* left semicircle notch */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl"
          />
          {/* right semicircle notch */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pearl"
          />
          {/* dashed perforation line */}
          <div className="mx-4 border-t border-dashed border-obsidian/25" />
        </div>

        {/* ── BODY  +  STUB ── */}
        <div className="flex flex-1">
          {/* BODY */}
          <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-700">
              {cat.label} · {event.venue?.city || 'Online'}
            </p>

            <h3
              className={`mt-1.5 line-clamp-2 min-h-[2.1em] font-display font-extrabold leading-tight tracking-tight text-obsidian ${sizes.title}`}
            >
              {event.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-obsidian/70">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-brand-700" />
                {formatDate(event.startDate, { weekday: 'short' })}
              </span>
              {event.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-brand-700" />
                  {event.startTime}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-700" />
                {event.venue?.city || 'Online'}
              </span>
            </div>

            {/* spacer */}
            <div className="flex-1" />

            {/* barcode strip */}
            <div className="mt-3" aria-hidden>
              <Barcode />
            </div>

            {/* price + CTA */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-obsidian/55">
                  Price
                </p>
                <p className="font-display text-lg font-extrabold leading-none text-brand-700">
                  {minPrice === 0 ? 'FREE' : formatCurrency(minPrice)}
                </p>
              </div>
              {showActions && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform group-hover:-translate-y-0.5">
                  Get Tickets
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>

          {/* VERTICAL PERFORATION between body + stub */}
          <div
            className="my-3 w-px self-stretch border-l border-dashed border-obsidian/25"
            aria-hidden
          />

          {/* STUB */}
          <div
            className={`relative flex ${sizes.stub} flex-col items-center justify-center gap-1 px-2 py-4`}
            style={{ backgroundColor: cat.color }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-obsidian/65">
              {month}
            </span>
            <span
              className={`font-display font-extrabold leading-none text-obsidian ${sizes.day}`}
            >
              {day}
            </span>
            <div className="my-1.5 h-px w-8 bg-obsidian/30" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-obsidian/70">
              No.
            </span>
            <span className="text-[10px] font-bold tracking-[0.18em] text-obsidian">
              {serial}
            </span>
            {/* mini vertical "ADMIT ONE" */}
            <span
              className="mt-2 text-[8px] font-bold uppercase tracking-[0.22em] text-obsidian/60"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Admit One
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ─── Simple SVG barcode strip ─── */
function Barcode() {
  // Pseudo-random but stable widths so each card has a "real" barcode look.
  const bars = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2];
  return (
    <div className="flex h-8 items-end gap-[2px]">
      {bars.map((w, i) => (
        <span
          key={i}
          className="block h-full bg-obsidian"
          style={{ width: `${w}px` }}
        />
      ))}
    </div>
  );
}
