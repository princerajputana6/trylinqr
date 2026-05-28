'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, ChevronDown, X } from 'lucide-react';
import LocationPicker from '@/components/shared/LocationPicker';
import { useUserLocation } from '@/lib/userLocation';
import { CITIES } from '@/lib/constants';

/**
 * Pill button in the navbar that opens a Google-Places powered popover
 * for picking the user's location. On select:
 *   - persists to localStorage (so all listening components update)
 *   - navigates to /explore?city=… for instant filtering
 *
 * `dark` switches text/border to white treatment for use over the
 * transparent navbar on the homepage hero.
 */
export default function HeaderLocationPicker({ dark = false }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loc, setLoc] = useUserLocation();
  const boxRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const apply = (city, extra = {}) => {
    if (!city) return;
    const payload = {
      city,
      ...extra,
      pickedAt: Date.now(),
    };
    setLoc(payload);
    setOpen(false);
    router.push(`/explore?city=${encodeURIComponent(city)}`);
  };

  const display = loc?.city || 'Set location';

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex max-w-[200px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
          dark
            ? 'border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20'
            : 'border-ink-line bg-white text-obsidian shadow-card hover:border-brand-700/40'
        }`}
      >
        <MapPin
          className={`h-4 w-4 shrink-0 ${
            dark ? 'text-white' : 'text-brand-700'
          }`}
        />
        <span className="truncate">
          <span
            className={`mr-1 text-[10px] uppercase tracking-[0.18em] ${
              dark ? 'text-white/60' : 'text-ink-muted'
            }`}
          >
            {loc ? 'Events in' : 'Pick'}
          </span>
          {display}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-ink-line bg-white p-4 shadow-elevated sm:w-[380px]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-display text-base font-bold text-obsidian">
                  Find events near you
                </p>
                <p className="text-xs text-obsidian/65">
                  Pick a city or use your live location.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-md text-ink-muted hover:bg-pearl"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <LocationPicker
              label={null}
              placeholder="Search city, area or landmark…"
              onSelect={(picked) => {
                const city =
                  picked.city ||
                  picked.displayName?.split(',')[0] ||
                  '';
                if (!city) return;
                apply(city, {
                  lat: picked.lat,
                  lng: picked.lng,
                  displayName: picked.displayName,
                });
              }}
            />

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                Popular cities
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CITIES.slice(0, 8).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => apply(c)}
                    className={`chip border text-xs transition-colors ${
                      loc?.city === c
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-ink-line bg-white text-obsidian/75 hover:border-brand-700/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {loc && (
              <button
                type="button"
                onClick={() => {
                  setLoc(null);
                  setOpen(false);
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                <X className="h-3 w-3" /> Clear location
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
