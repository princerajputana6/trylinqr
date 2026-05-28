'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import {
  GOOGLE_MAPS_KEY,
  isGoogleMapsConfigured,
} from '@/lib/googleMaps';

/**
 * Embedded map for event detail / venue pages.
 *  - Uses the Google Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
 *  - Falls back to an OpenStreetMap iframe otherwise
 *  - Always shows an "Open in Google Maps" external link below
 */
export default function MiniMap({
  lat,
  lng,
  name,
  address,
  zoom = 15,
  className = '',
}) {
  const [ready, setReady] = useState(false);
  if (!lat || !lng) {
    return (
      <div
        className={`flex h-56 items-center justify-center rounded-xl border border-ink-line bg-pearl text-sm text-ink-muted ${className}`}
      >
        <MapPin className="mr-2 h-4 w-4 text-brand-700" />
        Map will appear once coordinates are available.
      </div>
    );
  }

  const query = encodeURIComponent(
    [name, address].filter(Boolean).join(', ') || `${lat},${lng}`
  );

  const src = isGoogleMapsConfigured()
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${lat},${lng}&zoom=${zoom}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${
        lng - 0.01
      }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
        lat + 0.01
      }&layer=mapnik&marker=${lat}%2C${lng}`;

  const externalHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=`;

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-xl border border-ink-line bg-pearl">
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-xs text-ink-muted">
            Loading map…
          </div>
        )}
        <motion.iframe
          title="Venue map"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          src={src}
          className="h-64 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setReady(true)}
        />
      </div>
      <a
        href={externalHref}
        target="_blank"
        rel="noopener"
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
      >
        Open in Google Maps
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
