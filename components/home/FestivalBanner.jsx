'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { categoryBySlug } from '@/lib/constants';

export default function FestivalBanner({ event }) {
  if (!event) return null;
  const cat = categoryBySlug(event.category);
  const CatIcon = cat.icon;
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&q=75';

  return (
    <section className="container-page py-16">
      <p className="section-eyebrow mb-3">Don&apos;t miss</p>
      <h2 className="font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
        Upcoming spotlight
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mt-6"
      >
        <Link href={`/events/${event.slug}`} className="group block">
          <div className="relative overflow-hidden rounded-3xl border border-ink-line shadow-card">
            <img
              src={banner}
              alt={event.title}
              className="h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 sm:h-[460px]"
            />
            {/* dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

            {/* content */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 sm:p-10 md:max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-sand-400" />
                  Featured spotlight
                </div>
                <h3 className="font-display text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-5xl">
                  {event.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
                  <span
                    className="chip gap-1.5 text-white shadow-lg"
                    style={{ background: `${cat.color}E6` }}
                  >
                    <CatIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {cat.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-sand-400" />
                    {formatDate(event.startDate, { weekday: 'long' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-sand-400" />
                    {event.venue?.city || 'Online'}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="btn-primary">
                    Book your spot
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-white/70">
                    Starting at{' '}
                    <span className="font-bold text-white">
                      {event.minPrice === 0
                        ? 'FREE'
                        : formatCurrency(event.minPrice)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
