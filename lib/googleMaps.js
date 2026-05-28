'use client';

/*
 * Lazy loader for the Google Maps JS SDK + Places library.
 * The script is loaded at most once per page; concurrent callers share
 * a single promise.
 *
 * Needs `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set in env. Enable:
 *   - Maps JavaScript API
 *   - Places API   (required for AutocompleteService + PlacesService)
 *   - Maps Embed API
 * on the key in your Google Cloud console.
 */

import { useEffect, useState } from 'react';

let scriptPromise = null;

export const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
  '';

export function isGoogleMapsConfigured() {
  return Boolean(GOOGLE_MAPS_KEY);
}

// True only when the script AND the Places constructors are live.
export function isPlacesReady() {
  return Boolean(
    typeof window !== 'undefined' &&
      window.google?.maps?.places?.AutocompleteService &&
      window.google?.maps?.places?.PlacesService
  );
}

export function loadGoogleMaps() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (isPlacesReady()) return Promise.resolve(true);
  if (!GOOGLE_MAPS_KEY) return Promise.resolve(false);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const id = 'tlq-google-maps';

    const waitForPlaces = (tries = 0) => {
      if (isPlacesReady()) return resolve(true);
      if (tries > 60) {
        // Script downloaded but Places never showed up — usually means
        // the Places API isn't enabled on the API key. Fall back gracefully.
        scriptPromise = null;
        console.warn(
          '[Google Maps] Places library not available — falling back to Nominatim. ' +
            'Enable the Places API on your key.'
        );
        return resolve(false);
      }
      setTimeout(() => waitForPlaces(tries + 1), 100);
    };

    if (document.getElementById(id)) return waitForPlaces();

    const s = document.createElement('script');
    s.id = id;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&v=weekly&loading=async`;
    s.onload = () => waitForPlaces();
    s.onerror = (e) => {
      scriptPromise = null;
      console.error('[Google Maps] script failed to load', e);
      resolve(false);
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(() => isPlacesReady());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || loaded) return;
    loadGoogleMaps()
      .then((ok) => setLoaded(Boolean(ok)))
      .catch((e) => {
        console.error('Google Maps load failed', e);
        setError(e);
        setLoaded(false);
      });
  }, [loaded]);

  return { loaded, error, enabled: isGoogleMapsConfigured() && loaded };
}

/**
 * Parse a Google address_components array into the structure used by
 * the rest of the app (mirrors what LocationPicker emits).
 */
export function parsePlace(place) {
  if (!place) return null;
  const comps = place.address_components || [];
  const get = (type) =>
    comps.find((c) => c.types.includes(type))?.long_name || '';

  const city =
    get('locality') ||
    get('administrative_area_level_2') ||
    get('postal_town') ||
    get('sublocality_level_1');
  const state = get('administrative_area_level_1');
  const country = get('country');
  const pincode = get('postal_code');

  const loc = place.geometry?.location;
  const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
  const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;

  return {
    placeId: place.place_id || '',
    displayName: place.formatted_address || place.name || '',
    name: place.name || '',
    address:
      [get('street_number'), get('route'), get('sublocality_level_1')]
        .filter(Boolean)
        .join(' ') || place.formatted_address || '',
    city,
    state,
    country,
    pincode,
    lat,
    lng,
  };
}
