'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import EventCard from '@/components/events/EventCard';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeaturedList({
  events = [],
  title = 'Featured Events',
  subtitle,
  viewAllHref = '/explore',
  autoplay,
}) {
  if (!events.length) return null;

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
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              What's on
            </p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-black sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-lg text-[14px] text-neutral-500">{subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className="hidden shrink-0 items-center gap-1 text-[13px] font-semibold text-black underline-offset-4 hover:underline sm:flex"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* 4-column card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {events.slice(0, 8).map((e, i) => (
            <motion.div key={String(e._id)} variants={item}>
              <EventCard event={e} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {/* See all — mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-black px-5 py-2.5 text-[13px] font-semibold text-black hover:bg-black hover:text-white transition-all"
          >
            See all events <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
