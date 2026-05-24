'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

function attendeesOf(e) {
  if (!e?.ticketTiers?.length) return 0;
  return e.ticketTiers.reduce((s, t) => s + (t.soldQuantity || 0), 0);
}

export default function FloatingEventStack({ events = [] }) {
  const [index, setIndex] = useState(0);
  const list = events.slice(0, 6);
  const count = list.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;

  const visible = [0, 1, 2].map((offset) => list[(index + offset) % count]);

  return (
    <div className="relative mx-auto h-[500px] w-full max-w-md sm:h-[540px]">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -inset-8 bg-radial-spot blur-2xl" />

      <AnimatePresence initial={false}>
        {visible.map((event, depth) => (
          <CardLayer
            key={`${event._id}-${depth}`}
            event={event}
            depth={depth}
            isFront={depth === 0}
          />
        ))}
      </AnimatePresence>

      {/* live attendees floating chip */}
      <motion.div
        key={`live-${list[index]._id}`}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute -left-3 top-10 z-30 flex items-center gap-2 rounded-2xl border border-ink-line bg-white px-3 py-2 shadow-elevated sm:-left-6"
      >
        <span className="relative grid h-2 w-2 place-items-center">
          <span className="absolute h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold text-obsidian">
          {(attendeesOf(list[index]) || 0) + 24} going this week
        </span>
      </motion.div>

      {/* progress dots */}
      <div className="absolute -bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show event ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-7 bg-brand-700'
                : 'w-2 bg-obsidian/15 hover:bg-obsidian/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CardLayer({ event, depth, isFront }) {
  const offsets = [
    { x: 0, y: 0, scale: 1, rotate: -3, blur: 0, opacity: 1, z: 20 },
    { x: 36, y: 26, scale: 0.92, rotate: 4, blur: 1.5, opacity: 0.65, z: 10 },
    { x: 64, y: 50, scale: 0.84, rotate: 9, blur: 3, opacity: 0.4, z: 5 },
  ];
  const o = offsets[depth] || offsets[2];
  const cat = categoryBySlug(event.category);
  const CatIcon = cat.icon;
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=75';
  const attendees = attendeesOf(event);

  const card = (
    <motion.div
      initial={{ opacity: 0, scale: o.scale - 0.05, x: o.x + 30 }}
      animate={{
        opacity: o.opacity,
        scale: o.scale,
        x: o.x,
        y: o.y,
        rotate: o.rotate,
        filter: `blur(${o.blur}px)`,
      }}
      exit={{ opacity: 0, scale: o.scale - 0.05 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22, mass: 0.9 }}
      style={{ zIndex: o.z }}
      className="absolute inset-0 overflow-hidden rounded-3xl border border-ink-line bg-white shadow-elevated"
    >
      <img
        src={banner}
        alt={event.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

      <span
        className="chip absolute left-4 top-4 gap-1.5 text-white shadow-lg backdrop-blur"
        style={{ background: `${cat.color}E6` }}
      >
        <CatIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {cat.label}
      </span>

      {isFront && (
        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-brand-700">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-white drop-shadow-md">
          {event.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.startDate, { weekday: 'short' })}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue?.city || 'Online'}
          </span>
          {attendees > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {attendees}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-lg border border-white/15 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
            {event.minPrice === 0
              ? 'FREE'
              : `From ${formatCurrency(event.minPrice)}`}
          </span>
          {isFront && (
            <span className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white shadow-glow-soft">
              Book now
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return isFront ? (
    <Link href={`/events/${event.slug}`} className="block h-full w-full">
      {card}
    </Link>
  ) : (
    <div className="pointer-events-none">{card}</div>
  );
}
