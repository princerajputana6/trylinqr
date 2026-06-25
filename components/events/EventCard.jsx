'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

function minPriceOf(event) {
  if (event.minPrice != null) return event.minPrice;
  if (event.ticketTiers?.length)
    return Math.min(...event.ticketTiers.map((t) => t.price));
  return 0;
}

/**
 * BookMyShow-style event card — pure black/white.
 * Image on top (16:9), category chip overlay, clean info below.
 */
export default function EventCard({ event, index = 0 }) {
  if (!event) return null;
  const cat = categoryBySlug(event.category);
  const CatIcon = cat?.icon;
  const minPrice = minPriceOf(event);
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35) }}
    >
      <Link href={`/events/${event.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="overflow-hidden rounded-xl bg-white"
        >
          {/* Image */}
          <div className="relative aspect-[3/2] overflow-hidden bg-black/5">
            <img
              src={banner}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle bottom fade for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category chip */}
            {cat && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-sm">
                {CatIcon && <CatIcon className="h-3 w-3" strokeWidth={2.5} />}
                {cat.label}
              </span>
            )}

            {/* Price badge — bottom right */}
            <span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              {minPrice === 0 ? 'FREE' : `₹${minPrice}`}
            </span>
          </div>

          {/* Info */}
          <div className="px-1 pb-1 pt-3">
            <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-black group-hover:text-black/80">
              {event.title}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {formatDate(event.startDate, { weekday: 'short' })}
                  {event.startTime ? ` · ${event.startTime}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {event.venue?.city || 'Online'}
                  {event.venue?.name ? ` · ${event.venue.name}` : ''}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
