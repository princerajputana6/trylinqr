'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function EventCard({ event, index = 0 }) {
  const cat = categoryBySlug(event.category);
  const minPrice =
    event.minPrice ??
    (event.ticketTiers?.length
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0);
  const banner =
    event.bannerImage ||
    `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/events/${event.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="card overflow-hidden transition-shadow group-hover:shadow-2xl group-hover:shadow-brand-900/30"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={banner}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <span
              className="chip absolute left-3 top-3 text-white"
              style={{ background: cat.color }}
            >
              {cat.emoji} {cat.label}
            </span>
            {event.isFeatured && (
              <span className="chip absolute right-3 top-3 bg-amber-400 text-ink">
                ★ Featured
              </span>
            )}
            <span className="absolute bottom-3 right-3 rounded-lg bg-ink/80 px-2.5 py-1 text-sm font-bold backdrop-blur">
              {minPrice === 0 ? 'FREE' : formatCurrency(minPrice)}
            </span>
          </div>
          <div className="space-y-2 p-4">
            <h3 className="line-clamp-1 font-bold transition-colors group-hover:text-brand-400">
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(event.startDate, { weekday: 'short' })}
              {event.startTime ? ` · ${event.startTime}` : ''}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">
                {event.venue?.name ? `${event.venue.name}, ` : ''}
                {event.venue?.city || 'Online'}
              </span>
            </div>
            {event.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {event.rating} · {event.reviewCount} review
                {event.reviewCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
