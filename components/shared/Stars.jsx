'use client';

import { Star } from 'lucide-react';

export default function Stars({ value = 0, size = 14, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            style={{ width: size, height: size }}
            className={
              n <= Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-white/20'
            }
          />
        </button>
      ))}
    </div>
  );
}
