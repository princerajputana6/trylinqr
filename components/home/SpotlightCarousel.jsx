'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

function minPrice(e) {
  if (e.minPrice != null) return e.minPrice;
  if (e.ticketTiers?.length) return Math.min(...e.ticketTiers.map((t) => t.price));
  return 0;
}

/* Large editorial card */
function HeroCard({ event }) {
  const price = minPrice(event);
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="relative h-[280px] overflow-hidden rounded-2xl bg-black"
      >
        <img
          src={event.bannerImage}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
            {event.category}
          </span>
          <h3 className="mt-2 font-display text-2xl font-black leading-tight text-white">
            {event.title}
          </h3>
          <div className="mt-2 flex flex-col gap-1 text-[12px] text-white/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(event.startDate, { weekday: 'short' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue?.city || 'Online'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-lg font-black text-white">
              {price === 0 ? 'FREE' : `₹${price}`}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-black opacity-0 transition-opacity group-hover:opacity-100">
              Book <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* Compact card — stacked image + text for 2×2 grid */
function CompactCard({ event }) {
  const price = minPrice(event);
  return (
    <Link href={`/events/${event.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-white transition-all hover:border-black/20 hover:shadow-md">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-black/5">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=70'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-2.5">
        <h4 className="line-clamp-1 text-[12px] font-bold leading-snug text-black">{event.title}</h4>
        <p className="mt-0.5 text-[10px] text-neutral-500">
          {formatDate(event.startDate, { weekday: 'short' })} · {event.venue?.city || 'Online'}
        </p>
        <p className="mt-1 text-[11px] font-bold text-black">
          {price === 0 ? 'FREE' : `₹${price}`}
        </p>
      </div>
    </Link>
  );
}

export default function SpotlightCarousel({ events = [] }) {
  const filtered = events.filter((e) => e?.bannerImage);
  if (filtered.length < 2) return null;

  const hero = filtered[0];
  const rest = filtered.slice(1, 5);

  return (
    <section className="bg-white py-8">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-end justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              Spotlight
            </p>
            <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-black sm:text-3xl">
              In the spotlight
            </h2>
          </div>
          <Link
            href="/explore"
            className="hidden items-center gap-1 text-[13px] font-semibold text-black underline-offset-4 hover:underline sm:flex"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid: hero left + 2×2 compact right, both fixed height */}
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: hero card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroCard event={hero} />
          </motion.div>

          {/* Right: 2×2 compact grid, same height as hero */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid h-[280px] grid-cols-2 grid-rows-2 gap-2"
          >
            {rest.map((e, i) => (
              <motion.div
                key={String(e._id)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                className="min-h-0"
              >
                <CompactCard event={e} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
