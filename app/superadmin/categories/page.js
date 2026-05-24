'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { CATEGORIES } from '@/lib/constants';

export default function CategoriesPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/superadmin/stats')
      .then((r) => r.json())
      .then((d) => {
        const map = {};
        (d.eventsByCategory || []).forEach((c) => {
          map[c.name] = c.value;
        });
        setCounts(map);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h2 className="text-lg font-bold">Platform categories</h2>
      <p className="mb-6 mt-1 text-sm text-ink-muted">
        TryLinqr supports {CATEGORIES.length} event categories. Each organizer
        picks one when creating an event.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="card flex items-center gap-4 p-5"
              style={{ borderColor: `${c.color}40` }}
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-xl"
                style={{ background: `${c.color}22`, color: c.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <p className="font-bold text-obsidian">{c.label}</p>
                <p className="text-xs text-ink-muted">
                  {counts[c.label] || 0} event
                  {(counts[c.label] || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
