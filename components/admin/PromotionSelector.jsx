'use client';

import { useMemo, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { PROMOTIONS, calcPromoTotal } from '@/lib/promotions';

/**
 * Simple promotion selector for event creation (no payment, just selection).
 * The actual payment happens after the event is saved.
 *
 * Props:
 *   selected: string[] - array of selected promotion types
 *   onChange: (types: string[]) => void - callback when selection changes
 *   disabled: boolean - whether selections are disabled
 */
export default function PromotionSelector({ selected = [], onChange, disabled = false }) {
  const toggle = (type) => {
    if (disabled) return;
    const isSelected = selected.includes(type);
    const newSelected = isSelected
      ? selected.filter((t) => t !== type)
      : [...selected, type];
    onChange?.(newSelected);
  };

  const total = calcPromoTotal(selected);

  return (
    <div className="rounded-2xl border border-ink-line bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-700" />
        <h3 className="font-display text-base font-bold text-obsidian">
          Promote this event{' '}
          <span className="text-xs font-normal text-ink-muted">
            (select placements · payment after saving)
          </span>
        </h3>
      </div>

      <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900">
        Select your desired promotional placements below. After you submit the
        event, you'll be taken to payment for the selected promotions.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {PROMOTIONS.map((p) => {
          const picked = selected.includes(p.type);
          return (
            <button
              type="button"
              key={p.type}
              onClick={() => toggle(p.type)}
              disabled={disabled}
              className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                picked
                  ? 'border-brand-700 bg-brand-700/[0.06] ring-2 ring-brand-700/40'
                  : 'border-ink-line bg-white hover:border-brand-700/40'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-brand-700/30">
                {picked && <Check className="h-4 w-4 text-brand-700" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-bold text-obsidian">
                    {p.label}
                  </p>
                  <span className="text-sm font-bold text-brand-700">
                    ₹{p.price}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-obsidian/65">
                  {p.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-line pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-obsidian/55">
              Total
            </p>
            <p className="font-display text-xl font-extrabold text-brand-700">
              ₹{total}
            </p>
          </div>
          <div className="text-right text-xs text-ink-muted">
            {selected.length} placement{selected.length > 1 ? 's' : ''} selected
            <br />
            Payment after event is saved
          </div>
        </div>
      )}
    </div>
  );
}
