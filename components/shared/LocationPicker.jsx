'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, Locate, X } from 'lucide-react';
import {
  useGoogleMaps,
  parsePlace,
  GOOGLE_MAPS_KEY,
} from '@/lib/googleMaps';

/**
 * Address autocomplete.
 *  - Prefers Google Places (when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set)
 *  - Falls back to OpenStreetMap Nominatim if Google is unavailable
 *  - "Use my location" works in both modes (Geocoder vs Nominatim reverse)
 *
 * Normalised onSelect payload:
 *   { displayName, address, city, state, country, pincode, lat, lng }
 */
export default function LocationPicker({
  value = '',
  onSelect,
  placeholder = 'Search address, landmark or city…',
  countryCodes = 'in',
  label = 'Search location',
}) {
  const { loaded: googleReady, enabled: googleEnabled } = useGoogleMaps();

  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoBusy, setGeoBusy] = useState(false);

  const boxRef = useRef(null);
  const debounceRef = useRef();
  const acService = useRef(null);
  const detailsService = useRef(null);
  const sessionToken = useRef(null);

  // sync external value
  useEffect(() => setQuery(value), [value]);

  // outside click closes dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  // init Google services once loaded
  useEffect(() => {
    if (!googleReady || acService.current) return;
    if (!window.google?.maps?.places?.AutocompleteService) return;
    try {
      acService.current =
        new window.google.maps.places.AutocompleteService();
      detailsService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      sessionToken.current =
        new window.google.maps.places.AutocompleteSessionToken();
    } catch (e) {
      console.error('Failed to init Places services', e);
      acService.current = null;
      detailsService.current = null;
    }
  }, [googleReady]);

  // debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        if (googleEnabled && googleReady && acService.current) {
          await searchGoogle(query, countryCodes, setResults, sessionToken);
        } else {
          await searchNominatim(query, countryCodes, setResults);
        }
        setOpen(true);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, countryCodes, googleEnabled, googleReady]);

  const chooseGoogle = (prediction) => {
    if (!detailsService.current) return;
    detailsService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: [
          'address_components',
          'formatted_address',
          'geometry',
          'name',
          'place_id',
        ],
        sessionToken: sessionToken.current,
      },
      (place, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !place
        )
          return;
        const norm = parsePlace(place);
        setQuery(norm.displayName);
        setOpen(false);
        // rotate session token after a select (per Google billing rules)
        sessionToken.current =
          new window.google.maps.places.AutocompleteSessionToken();
        onSelect?.(norm);
      }
    );
  };

  const chooseNominatim = (item) => {
    const a = item.address || {};
    const norm = {
      placeId: '',
      displayName: item.display_name,
      name: item.namedetails?.name || '',
      address: [a.road, a.suburb, a.neighbourhood, a.village]
        .filter(Boolean)
        .join(', '),
      city:
        a.city || a.town || a.village || a.municipality || a.county || '',
      state: a.state || a.region || '',
      country: a.country || '',
      pincode: a.postcode || '',
      lat: Number(item.lat),
      lng: Number(item.lon),
    };
    setQuery(norm.displayName);
    setOpen(false);
    onSelect?.(norm);
  };

  const choose = (item) => {
    if (item._google) chooseGoogle(item._google);
    else chooseNominatim(item);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          if (googleEnabled && googleReady && window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: coords.latitude, lng: coords.longitude } },
              (results, status) => {
                if (status === 'OK' && results?.[0]) {
                  const norm = parsePlace(results[0]);
                  setQuery(norm.displayName);
                  setOpen(false);
                  onSelect?.(norm);
                }
                setGeoBusy(false);
              }
            );
            return;
          }
          // Nominatim reverse
          const url = new URL(
            'https://nominatim.openstreetmap.org/reverse'
          );
          url.searchParams.set('format', 'json');
          url.searchParams.set('addressdetails', '1');
          url.searchParams.set('lat', String(coords.latitude));
          url.searchParams.set('lon', String(coords.longitude));
          const res = await fetch(url.toString(), {
            headers: { Accept: 'application/json' },
          });
          const data = await res.json();
          if (data?.display_name) chooseNominatim(data);
        } finally {
          setGeoBusy(false);
        }
      },
      () => setGeoBusy(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div ref={boxRef} className="relative">
      {label && (
        <label className="label flex items-center gap-2">
          {label}
          {googleEnabled && (
            <span className="text-[10px] font-normal uppercase tracking-wider text-emerald-700">
              · Google Places
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-700" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className="input pl-10 pr-24"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setOpen(false);
              }}
              className="grid h-7 w-7 place-items-center rounded-md text-ink-muted hover:bg-pearl"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={useMyLocation}
            disabled={geoBusy}
            className="inline-flex items-center gap-1 rounded-md bg-brand-700 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-glow-soft transition-colors hover:bg-brand-800"
          >
            {geoBusy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Locate className="h-3 w-3" />
            )}
            Me
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (results.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-ink-line bg-white shadow-elevated"
          >
            {loading && (
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-ink-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching{googleEnabled ? ' Google Places' : ' OpenStreetMap'}…
              </div>
            )}
            {results.map((r, i) => (
              <button
                type="button"
                key={r._key || r.place_id || i}
                onClick={() => choose(r)}
                className="flex w-full items-start gap-3 border-t border-ink-line/70 px-4 py-3 text-left transition-colors first:border-t-0 hover:bg-pearl"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-semibold text-obsidian">
                    {r.primary || r.display_name?.split(',')[0]}
                  </p>
                  <p className="line-clamp-1 text-xs text-ink-muted">
                    {r.secondary || r.display_name}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!googleEnabled && GOOGLE_MAPS_KEY === '' && (
        <p className="mt-1 text-[11px] text-ink-muted">
          Tip: add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in
          <code>.env.local</code> for richer Google Places results.
        </p>
      )}
    </div>
  );
}

/* --- search backends --- */

async function searchGoogle(query, countryCodes, setResults, sessionTokenRef) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.places?.AutocompleteService) {
      setResults([]);
      return resolve();
    }
    const ac = new window.google.maps.places.AutocompleteService();
    ac.getPlacePredictions(
      {
        input: query,
        sessionToken: sessionTokenRef.current,
        componentRestrictions: countryCodes
          ? { country: countryCodes.split(',').map((c) => c.trim()) }
          : undefined,
      },
      (preds) => {
        const list = (preds || []).map((p) => ({
          _key: p.place_id,
          place_id: p.place_id,
          primary: p.structured_formatting?.main_text || p.description,
          secondary: p.structured_formatting?.secondary_text || '',
          display_name: p.description,
          _google: p,
        }));
        setResults(list);
        resolve();
      }
    );
  });
}

async function searchNominatim(query, countryCodes, setResults) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '6');
  if (countryCodes) url.searchParams.set('countrycodes', countryCodes);
  url.searchParams.set('q', query);
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  const data = await res.json();
  const list = (Array.isArray(data) ? data : []).map((r) => ({
    ...r,
    _key: r.place_id,
    primary: r.display_name?.split(',')[0],
    secondary: r.display_name,
  }));
  setResults(list);
}
