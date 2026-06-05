'use client';

import { Plus, Trash2 } from 'lucide-react';

export default function TicketTierBuilder({ tiers, setTiers }) {
  const add = () =>
    setTiers([
      ...tiers,
      {
        name: '',
        // Leave numeric fields empty so the inputs aren't pre-filled with 0/1.
        // Validation requires them on submit.
        price: '',
        totalQuantity: '',
        description: '',
        benefits: [],
      },
    ]);

  const update = (i, key, value) => {
    const next = [...tiers];
    next[i] = { ...next[i], [key]: value };
    setTiers(next);
  };

  const remove = (i) => setTiers(tiers.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {tiers.map((t, i) => (
        <div key={i} className="card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Tier {i + 1}</span>
            {tiers.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-brand-700 hover:text-brand-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="General / VIP"
                value={t.name}
                onChange={(e) => update(i, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Price (₹) — 0 = free</label>
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 499"
                value={t.price ?? ''}
                onChange={(e) => update(i, 'price', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                min={1}
                className="input"
                placeholder="e.g. 100"
                value={t.totalQuantity ?? ''}
                onChange={(e) => update(i, 'totalQuantity', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <input
              className="input"
              placeholder="What's included"
              value={t.description}
              onChange={(e) => update(i, 'description', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Benefits (comma separated)</label>
            <input
              className="input"
              placeholder="Front row, Free drink"
              value={(t.benefits || []).join(', ')}
              onChange={(e) =>
                update(
                  i,
                  'benefits',
                  e.target.value
                    .split(',')
                    .map((b) => b.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-outline w-full">
        <Plus className="h-4 w-4" /> Add ticket tier
      </button>
    </div>
  );
}
