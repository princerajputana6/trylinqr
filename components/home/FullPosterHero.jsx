'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Music,
  Bike,
  Laugh,
  Dumbbell,
  BookOpen,
  Star,
} from 'lucide-react';
import { CITIES } from '@/lib/constants';
import { HERO_POSTERS } from '@/lib/heroPosters';

const AUTO_MS = 6500;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const QUICK_CATS = [
  { label: 'Concerts', slug: 'concert', icon: Music },
  { label: 'Bike Rides', slug: 'bike-ride', icon: Bike },
  { label: 'Comedy', slug: 'comedy', icon: Laugh },
  { label: 'Sports', slug: 'sports', icon: Dumbbell },
  { label: 'Workshops', slug: 'workshop', icon: BookOpen },
];

export default function FullPosterHero() {
  const router = useRouter();
  const slides = HERO_POSTERS;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTO_MS
    );
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const go = (d) => setIndex((i) => (i + d + slides.length) % slides.length);
  const poster = slides[index];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city) params.set('city', city);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section
      className="relative -mt-[68px] flex min-h-[92vh] flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background photo — crossfade on slide change ── */}
      <AnimatePresence initial={false}>
        <motion.img
          key={`bg-${poster.slug}`}
          src={poster.photo}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* ── Overlays ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${poster.accent}30 0%, transparent 70%)`,
        }}
      />

      {/* ── Main content — centered ── */}
      <div className="container-page relative flex flex-1 flex-col items-center justify-center pb-16 pt-[100px] text-center sm:pt-[120px]">

        {/* Eyebrow — current category label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`eyebrow-${poster.slug}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm"
          >
            <Star className="h-3 w-3" style={{ color: poster.accentSoft || '#fff' }} />
            {poster.eyebrow}
          </motion.div>
        </AnimatePresence>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          custom={0.05}
          initial="hidden"
          animate="visible"
          className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-[3.8rem]"
        >
          Find &amp; Book Events{' '}
          <span style={{ color: poster.accentSoft || '#f97316' }}>
            Happening Near You
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={0.15}
          initial="hidden"
          animate="visible"
          className="mt-4 max-w-xl text-base text-white/75 sm:text-lg"
        >
          Concerts, bike rides, comedy nights, workshops &amp; more — discover
          what&apos;s on and book your seat in seconds.
        </motion.p>

        {/* ── Search bar ── */}
        <motion.form
          variants={fadeUp}
          custom={0.25}
          initial="hidden"
          animate="visible"
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.35)] sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-brand-700" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium text-obsidian placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          <div className="hidden w-px self-stretch bg-ink-line sm:block" />
          <div className="relative sm:w-44">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-700" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-transparent py-4 pl-11 pr-4 text-sm font-medium text-obsidian focus:outline-none"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-brand-700 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        {/* ── Quick category pills ── */}
        <motion.div
          variants={fadeUp}
          custom={0.35}
          initial="hidden"
          animate="visible"
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
            Browse:
          </span>
          {QUICK_CATS.map(({ label, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white/25 hover:border-white/50"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </motion.div>

        {/* ── Slide navigation ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center gap-4"
        >
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                onClick={() => setIndex(i)}
                aria-label={`Show ${s.slug}`}
                className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all"
                style={{ width: i === index ? 32 : 8 }}
              >
                {i === index && !paused && (
                  <motion.span
                    key={`p-${i}-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-white"
                  />
                )}
                {i === index && paused && (
                  <span className="absolute inset-0 bg-white" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
