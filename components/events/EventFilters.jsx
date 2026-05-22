'use client';

import { CATEGORIES, CITIES } from '@/lib/constants';
import { SlidersHorizontal, X } from 'lucide-react';

export default function EventFilters({ filters, setFilters }) {
  const update = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? '' : value }));

  const reset = () =>
    setFilters({ category: '', city: '', price: '', sort: 'date' });

  const active =
    filters.category || filters.city || filters.price || filters.sort !== 'date';

  return (
    <div className="card space-y-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          Filters
        </div>
        {active && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div>
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => update('category', c.slug)}
              className={`chip border transition-colors ${
                filters.category === c.slug
                  ? 'border-brand-500 bg-brand-500/15 text-brand-400'
                  : 'border-white/10 text-white/70 hover:border-white/25'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">City</p>
        <select
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="input"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="label">Price</p>
        <div className="flex gap-1.5">
          {[
            { v: 'free', l: 'Free' },
            { v: 'paid', l: 'Paid' },
          ].map((p) => (
            <button
              key={p.v}
              onClick={() => update('price', p.v)}
              className={`chip flex-1 justify-center border ${
                filters.price === p.v
                  ? 'border-brand-500 bg-brand-500/15 text-brand-400'
                  : 'border-white/10 text-white/70'
              }`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Sort by</p>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="input"
        >
          <option value="date">Date — soonest</option>
          <option value="popular">Most popular</option>
          <option value="price-low">Price — low to high</option>
          <option value="price-high">Price — high to low</option>
        </select>
      </div>
    </div>
  );
}
