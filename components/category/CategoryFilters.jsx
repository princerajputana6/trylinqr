'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import { SkeletonCard } from '@/components/shared/LoadingSpinner';

const grid = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function CategoryFilters({ theme, events }) {
  const [active, setActive] = useState('all');

  const filtered = useMemo(() => {
    if (active === 'all') return events;
    return events.filter((e) => {
      const blob = `${e.title} ${e.description} ${e.subCategory} ${(
        e.tags || []
      ).join(' ')}`.toLowerCase();
      if (active === 'free')
        return (e.ticketTiers || []).every((t) => t.price === 0);
      return blob.includes(active);
    });
  }, [active, events]);

  return (
    <section
      id="events"
      className="container-page py-16"
      style={{ scrollMarginTop: 90 }}
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Browse the lineup</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'}{' '}
            available
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-ink-muted" />
          <FilterChip
            label="All"
            active={active === 'all'}
            onClick={() => setActive('all')}
          />
          {(theme.quickFilters || []).map((f) => (
            <FilterChip
              key={f.q}
              label={f.label}
              active={active === f.q}
              onClick={() => setActive(f.q)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={grid}
          initial="hidden"
          animate="visible"
          key={active}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((e, i) => (
            <motion.div key={e._id} variants={item}>
              <EventCard event={e} index={i} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={`chip border text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
        active
          ? 'border-brand-700 bg-brand-700 text-white'
          : 'border-ink-line bg-white text-obsidian/70 hover:border-brand-700/40'
      }`}
    >
      {label}
    </motion.button>
  );
}

function EmptyState() {
  return (
    <div className="card grid place-items-center py-16 text-center">
      <p className="font-display text-lg font-bold text-obsidian">
        Nothing matches this filter
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Try a different chip — or check back soon.
      </p>
    </div>
  );
}
