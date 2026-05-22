'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function HeroEventSlider({ events = [] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const count = events.length;

  const go = useCallback(
    (d) => {
      setDir(d);
      setIndex((i) => (i + d + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % count);
    }, 4200);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;

  const event = events[index];
  const cat = categoryBySlug(event.category);
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=75';

  return (
    <div className="relative w-full">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Recently added
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-white/80 backdrop-blur transition-colors hover:bg-white/15"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[400px] overflow-hidden rounded-3xl border border-white/10 sm:h-[440px]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -60, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Link href={`/events/${event.slug}`} className="group block h-full">
              <img
                src={banner}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span
                  className="chip text-white shadow-lg"
                  style={{ background: cat.color }}
                >
                  {cat.emoji} {cat.label}
                </span>
                {event.isFeatured && (
                  <span className="chip bg-amber-400 text-ink shadow-lg">
                    ★ Featured
                  </span>
                )}
              </div>

              <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-xl font-extrabold leading-snug text-white drop-shadow">
                  {event.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.startDate, { weekday: 'short' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {event.venue?.city || 'Online'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
                    {event.minPrice === 0
                      ? 'FREE ENTRY'
                      : `From ${formatCurrency(event.minPrice)}`}
                  </span>
                  <span className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow">
                    Book now
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress dots */}
      <div className="mt-4 flex justify-center gap-2">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDir(i > index ? 1 : -1);
              setIndex(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-brand-500' : 'w-2.5 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
