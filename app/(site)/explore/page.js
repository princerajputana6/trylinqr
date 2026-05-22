'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

function ExploreInner() {
  const sp = useSearchParams();
  const [filters, setFilters] = useState({
    category: sp.get('category') || '',
    city: sp.get('city') || '',
    price: sp.get('price') || '',
    sort: sp.get('sort') || 'date',
  });
  const [q] = useState(sp.get('q') || '');
  const [featured] = useState(sp.get('featured') || '');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.city) params.set('city', filters.city);
    if (filters.price) params.set('price', filters.price);
    if (filters.sort) params.set('sort', filters.sort);
    if (q) params.set('q', q);
    if (featured) params.set('featured', featured);
    params.set('page', String(page));
    params.set('limit', '12');
    const res = await fetch(`/api/events?${params.toString()}`);
    const data = await res.json();
    setEvents(data.events || []);
    setPages(data.pages || 1);
    setLoading(false);
  }, [filters, q, featured, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold">
          {q ? `Results for "${q}"` : 'Explore events'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {featured ? 'Featured events · ' : ''}
          Find your next experience across 12 categories.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <EventFilters filters={filters} setFilters={setFilters} />
        </aside>
        <div>
          <EventGrid events={events} loading={loading} />
          {!loading && pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-outline"
              >
                Previous
              </button>
              <span className="text-sm text-ink-muted">
                Page {page} of {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
      <ExploreInner />
    </Suspense>
  );
}
