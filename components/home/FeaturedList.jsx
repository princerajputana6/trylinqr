'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import VintageTicket from '@/components/shared/VintageTicket';

export default function FeaturedList({
  events = [],
  title = 'Featured Upcoming Events',
  subtitle = 'Hand-picked experiences across every kind of evening — swipe to browse the next drops.',
  viewAllHref = '/explore',
}) {
  const ref = useRef(null);
  if (!events.length) return null;

  const scroll = (dir) => {
    const node = ref.current;
    if (!node) return;
    // Page = (~one slot width)
    const slot = node.querySelector('[data-slot]');
    const step = slot ? slot.getBoundingClientRect().width + 24 : 480;
    node.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-12">
      <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-6 max-w-3xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="section-eyebrow"
        >
          What&apos;s on
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 text-sm leading-relaxed text-obsidian/65 sm:text-base"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative"
      >
        {/* arrows */}
        <motion.button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          whileHover={{ scale: 1.1, y: '-55%' }}
          whileTap={{ scale: 0.95 }}
          className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card hover:border-brand-700/40 sm:grid"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        <motion.button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          whileHover={{ scale: 1.1, y: '-55%' }}
          whileTap={{ scale: 0.95 }}
          className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card hover:border-brand-700/40 sm:grid"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>

        {/* scroller */}
        <div
          ref={ref}
          className="no-scrollbar snap-x snap-mandatory overflow-x-auto pb-3"
        >
          {/* one slot = 50% on sm+, 90% on mobile (so two cards visible) */}
          <div className="flex gap-6 px-1">
            {events.map((e, i) => (
              <motion.div
                key={e._id}
                data-slot
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: Math.min(i * 0.1, 0.5), duration: 0.5 }}
                className="w-[88%] shrink-0 snap-start sm:w-[calc(50%-12px)]"
              >
                <VintageTicket event={e} size="list" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 text-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href={viewAllHref} className="btn-outline">
            View all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
