'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Headless pagination control.
 *
 * Props:
 *   page        — current 1-based page index
 *   pages       — total page count
 *   onPage      — fn(nextPage) called on navigation
 *   className   — wrapper classes
 *   showInfo    — bool: render "Page X of Y · N items" left-side label
 *   total       — optional total item count for the showInfo label
 */
export default function Pagination({
  page = 1,
  pages = 1,
  onPage,
  className = '',
  showInfo = true,
  total,
}) {
  if (pages <= 1) return null;
  const go = (n) => {
    const next = Math.max(1, Math.min(pages, n));
    if (next !== page) onPage?.(next);
  };

  // Compute a compact window of page buttons: first · … · current ± 1 · … · last.
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const items = Array.from(set)
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  const withGaps = [];
  for (let i = 0; i < items.length; i++) {
    if (i > 0 && items[i] - items[i - 1] > 1) withGaps.push('…');
    withGaps.push(items[i]);
  }

  return (
    <nav
      className={`mt-6 flex flex-col items-center justify-between gap-3 border-t border-ink-line pt-4 sm:flex-row ${className}`}
      aria-label="Pagination"
    >
      {showInfo ? (
        <p className="text-xs text-obsidian/55">
          Page <span className="font-semibold text-obsidian">{page}</span> of{' '}
          <span className="font-semibold text-obsidian">{pages}</span>
          {typeof total === 'number' ? (
            <>
              {' · '}
              <span className="font-semibold text-obsidian">{total}</span>{' '}
              item{total === 1 ? '' : 's'}
            </>
          ) : null}
        </p>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line bg-white text-obsidian transition-colors hover:border-brand-700/40 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {withGaps.map((n, i) =>
          n === '…' ? (
            <span
              key={`gap-${i}`}
              className="px-2 text-xs text-obsidian/45"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                n === page
                  ? 'bg-brand-700 text-white'
                  : 'border border-ink-line bg-white text-obsidian/70 hover:border-brand-700/40 hover:text-brand-700'
              }`}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line bg-white text-obsidian transition-colors hover:border-brand-700/40 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

/**
 * Tiny hook for client-side pagination over an in-memory list.
 * Returns { page, setPage, pages, slice } so the caller can render
 * slice instead of the full list.
 */
export function usePagedList(list = [], { pageSize = 12, page, setPage } = {}) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page || 1), pages);
  const start = (safePage - 1) * pageSize;
  const slice = list.slice(start, start + pageSize);
  return { page: safePage, setPage, pages, total, slice, pageSize };
}
