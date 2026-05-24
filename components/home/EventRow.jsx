'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import EventCard from '@/components/events/EventCard';

export default function EventRow({ title, subtitle, events, viewAllHref, eyebrow }) {
  const ref = useRef(null);
  if (!events?.length) return null;

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="section-eyebrow mb-2"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-display text-2xl font-extrabold text-obsidian sm:text-3xl"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-1 text-sm text-obsidian/65"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2"
        >
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <motion.button
            onClick={() => scroll(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line bg-white text-obsidian shadow-card hover:bg-pearl"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => scroll(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line bg-white text-obsidian shadow-card hover:bg-pearl"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3"
      >
        {events.map((e, i) => (
          <div key={e._id} className="w-[280px] shrink-0 snap-start">
            <EventCard event={e} index={i} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
