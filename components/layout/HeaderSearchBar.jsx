'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search, ChevronDown, X, ArrowRight } from 'lucide-react';
import LocationPicker from '@/components/shared/LocationPicker';
import { useUserLocation } from '@/lib/userLocation';
import { CITIES } from '@/lib/constants';

/**
 * Single pill that combines:
 *   1. Location segment — opens a Places dropdown, persists choice
 *   2. Search input — types a query, hits Enter or the arrow button
 *   3. Submits to /explore?q=…&city=…
 *
 * `dark` switches the styling for use over the transparent navbar
 * on the homepage hero.
 */
export default function HeaderSearchBar({ dark = false }) {
  const router = useRouter();
  const [loc, setLoc] = useUserLocation();
  const [openLoc, setOpenLoc] = useState(false);
  const [q, setQ] = useState('');
  const boxRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpenLoc(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const applyLocation = (city, extra = {}) => {
    if (!city) return;
    setLoc({ city, ...extra, pickedAt: Date.now() });
    setOpenLoc(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (loc?.city) params.set('city', loc.city);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-[520px]">
      <form
        onSubmit={submit}
        className={`group flex items-center gap-1 rounded-full border p-1.5 transition-colors ${
          dark
            ? 'border-white/20 bg-white/10 backdrop-blur-xl focus-within:bg-white/20'
            : 'border-ink-line bg-white shadow-card focus-within:border-brand-700/40'
        }`}
      >
        {/* location segment */}
        <button
          type="button"
          onClick={() => setOpenLoc((o) => !o)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
            dark
              ? 'text-white hover:bg-white/10'
              : 'text-obsidian hover:bg-pearl'
          }`}
        >
          <MapPin
            className={`h-3.5 w-3.5 ${
              dark ? 'text-white' : 'text-brand-700'
            }`}
          />
          <span className="max-w-[110px] truncate">
            {loc?.city || 'Set city'}
          </span>
          <ChevronDown
            className={`h-3 w-3 opacity-70 ${
              openLoc ? 'rotate-180' : ''
            } transition-transform`}
          />
        </button>

        {/* divider */}
        <span
          className={`h-5 w-px ${
            dark ? 'bg-white/25' : 'bg-ink-line'
          }`}
        />

        {/* search input */}
        <div className="relative flex-1">
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
              dark ? 'text-white/60' : 'text-ink-muted'
            }`}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, organizers…"
            className={`w-full bg-transparent py-2 pl-8 pr-2 text-sm focus:outline-none ${
              dark
                ? 'text-white placeholder:text-white/55'
                : 'text-obsidian placeholder:text-ink-muted'
            }`}
          />
        </div>

        {/* submit */}
        <button
          type="submit"
          aria-label="Search"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 text-white shadow-glow-soft transition-transform hover:bg-brand-800 hover:-translate-y-0.5"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* location dropdown */}
      <AnimatePresence>
        {openLoc && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-ink-line bg-white p-4 shadow-elevated sm:w-[420px]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold text-obsidian">
                  Where are you?
                </p>
                <p className="text-xs text-obsidian/65">
                  Find events near you — we&apos;ll filter the feed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenLoc(false)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-pearl"
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
                applyLocation(city, {
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
                    onClick={() => applyLocation(c)}
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

            {loc?.city && (
              <button
                type="button"
                onClick={() => {
                  setLoc(null);
                  setOpenLoc(false);
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
