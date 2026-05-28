'use client';

import { useEffect, useState } from 'react';

const KEY = 'tlq:location';
const EVT = 'tlq:location-changed';

/**
 * Lightweight cross-component user-location store.
 *  - Persists to localStorage so the choice survives reloads + page navigation
 *  - Dispatches a custom event so listening components re-render immediately
 */
export function getUserLocation() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUserLocation(loc) {
  if (typeof window === 'undefined') return;
  try {
    if (!loc) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(loc));
    window.dispatchEvent(new CustomEvent(EVT, { detail: loc }));
  } catch {}
}

export function useUserLocation() {
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    setLoc(getUserLocation());
    const handler = (e) => setLoc(e.detail || getUserLocation());
    window.addEventListener(EVT, handler);
    return () => window.removeEventListener(EVT, handler);
  }, []);
  return [loc, setUserLocation];
}
