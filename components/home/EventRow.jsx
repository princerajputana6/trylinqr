'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import EventCard from '@/components/events/EventCard';

export default function EventRow({
  title,
  subtitle,
  events,
  viewAllHref,
  eyebrow,
  autoplay = false,
  intervalMs = 4500,
}) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoplay || paused || !events?.length) return;
    const t = setInterval(() => {
      const node = ref.current;
      if (!node) return;
      const max = node.scrollWidth - node.clientWidth - 4;
      if (node.scrollLeft >= max) node.scrollTo({ left: 0, behavior: 'smooth' });
      else node.scrollBy({ left: 280 + 16, behavior: 'smooth' });
    }, intervalMs);
    return () => clearInterval(t);
  }, [autoplay, paused, intervalMs, events?.length]);

  if (!events?.length) return null;

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * (280 + 16), behavior: 'smooth' });

  return (
    <section className="bg-white py-16">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/30">
              {eyebrow || 'Events'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-black sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-[14px] text-black/45">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden items-center gap-1 text-[13px] font-semibold text-black underline-offset-4 hover:underline sm:flex"
              >
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => scroll(-1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-black transition-all hover:border-black hover:bg-black hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-black transition-all hover:border-black hover:bg-black hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal scroll track */}
        <div
          ref={ref}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2"
        >
          {events.map((e, i) => (
            <div key={String(e._id)} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
              <EventCard event={e} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
