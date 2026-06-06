'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { categoryBySlug } from '@/lib/constants';

/**
 * Auto-sliding multi-slide spotlight carousel.
 * Replaces the old FestivalBanner that only ever showed one event.
 *
 * Each slide is a full-bleed image with the event title, meta and a
 * book CTA. Auto-advances every 6s, pauses on hover, respects
 * prefers-reduced-motion. Manual left/right arrows + bullet dots.
 */
export default function SpotlightCarousel({ events = [] }) {
  const slides = (events || []).filter((e) => e?.bannerImage).slice(0, 6);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || paused || slides.length < 2) return;
    timer.current = setInterval(
      () => setI((cur) => (cur + 1) % slides.length),
      6000,
    );
    return () => clearInterval(timer.current);
  }, [paused, reduced, slides.length]);

  if (!slides.length) return null;
  const e = slides[i];
  const cat = categoryBySlug(e.category);
  const CatIcon = cat.icon;
  const go = (delta) =>
    setI((cur) => (cur + delta + slides.length) % slides.length);

  return (
    <section className="bg-white py-10">
      <div className="container-page">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow">Spotlight</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
              In the SPOTLIGHT right now
            </h2>
            <p className="mt-2 max-w-md text-sm text-obsidian/65">
              The events our team can&apos;t stop talking about this week.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => go(-1)}
              aria-label="Previous spotlight"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card hover:border-brand-700/40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next spotlight"
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card hover:border-brand-700/40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl border border-ink-line shadow-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={String(e._id)}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <Link href={`/events/${e.slug}`} className="group block">
                <img
                  src={e.bannerImage}
                  alt={e.title}
                  className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[480px]"
                />
                {/* solid scrim — no gradient, keeps single-color rule */}
                <div className="absolute inset-0 bg-obsidian/55" />
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-6 sm:p-10 md:max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                      Spotlight {i + 1}/{slides.length}
                    </div>
                    <h3 className="font-display text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-5xl">
                      {e.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
                      <span
                        className="chip gap-1.5 text-white shadow-lg"
                        style={{ background: `${cat.color}E6` }}
                      >
                        <CatIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {cat.label}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-brand-300" />
                        {formatDate(e.startDate, { weekday: 'long' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-brand-300" />
                        {e.venue?.city || 'Online'}
                      </span>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <span className="btn-primary">
                        Book your spot
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-white/80">
                        Starting at{' '}
                        <span className="font-bold text-white">
                          {e.minPrice === 0 ? 'FREE' : formatCurrency(e.minPrice)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* dot indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, k) => (
                <button
                  key={k}
                  aria-label={`Go to spotlight ${k + 1}`}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all ${
                    k === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
