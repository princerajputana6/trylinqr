'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Locate, MapPin, Loader2 } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import { SHIPPING_CITIES, haversineKm } from '@/lib/bikeShipping';

// We reuse the shipping city coordinate map (already covers all CITIES + more)
// to find the nearest city to a given location and redirect there.
function nearestCity(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const c of SHIPPING_CITIES) {
    if (!CITIES.includes(c.name) && c.name !== 'Gurugram' && c.name !== 'Noida')
      continue;
    const d = haversineKm({ lat, lng }, c);
    if (d < bestDist) {
      bestDist = d;
      best = c.name;
    }
  }
  // collapse Gurugram/Noida → Delhi for our CITY list
  if (best === 'Gurugram' || best === 'Noida') best = 'Delhi';
  return best;
}

export default function NearbyBar() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  const detect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not available in this browser.');
      return;
    }
    setBusy(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const c = nearestCity(coords.latitude, coords.longitude);
        setBusy(false);
        if (!c) {
          setError('Couldn’t match a city near you. Try the explore filters.');
          return;
        }
        setCity(c);
        router.push(`/explore?city=${encodeURIComponent(c)}`);
      },
      () => {
        setBusy(false);
        setError('Location permission denied.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <section className="container-page -mt-10 mb-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-ink-line bg-white p-5 shadow-card sm:p-6"
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-obsidian">
                What&apos;s happening near you?
              </p>
              <p className="mt-0.5 text-sm text-obsidian/65">
                {city
                  ? `Showing events near ${city}.`
                  : 'Use your location for an instant feed of nearby events.'}
              </p>
              {error && (
                <p className="mt-1 text-xs text-brand-700">{error}</p>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={detect}
            disabled={busy}
            className="btn-primary"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4" />
            )}
            {busy ? 'Locating…' : 'Find near me'}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
