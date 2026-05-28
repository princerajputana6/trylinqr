'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/constants';
import HeroImageCarousel from '@/components/home/HeroImageCarousel';

const quickCats = [
  'concert',
  'bike-ride',
  'comedy',
  'workshop',
  'sports',
  'festival',
  'food',
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function HeroCarousel() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city) params.set('city', city);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative -mt-[68px] overflow-hidden bg-pearl pb-20 pt-[120px] sm:pb-24 sm:pt-[140px]">
      {/* ambient layers */}
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute -left-44 top-1/4 h-[520px] w-[520px] rounded-full bg-brand-700/10 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-sand-400/25 blur-[140px]" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        {/* LEFT — animated text */}
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div
            variants={fadeUp}
            className="flex w-fit items-center gap-2 rounded-full border border-ink-line bg-white px-4 py-1.5 text-xs font-medium text-obsidian shadow-card"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-700" />
            India&apos;s premium event ecosystem
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.04] tracking-tight text-obsidian sm:text-5xl xl:text-[4rem]"
          >
            Discover events that{' '}
            <span className="relative whitespace-nowrap">
              <span className="text-brand-700">match your vibe</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  d="M2 9 C90 -2 220 -2 298 6"
                  stroke="#710014"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 0.55,
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-base leading-relaxed text-obsidian/70 md:text-lg"
          >
            From bike rides and jagrans to concerts, workshops, sports and
            festivals — one cinematic place to find what&apos;s on, book in
            seconds, and never miss a moment.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={search}
            className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-ink-line bg-white p-2 shadow-card sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events, organizers, keywords…"
                className="w-full rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm text-obsidian placeholder:text-ink-muted focus:outline-none"
              />
            </div>
            <div className="hidden w-px self-stretch bg-ink-line sm:block" />
            <div className="relative sm:w-40">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm text-obsidian focus:outline-none"
              >
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-800"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.form>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link href="/explore" className="btn-primary">
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/admin-register" className="btn-outline">
              Become Organizer
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-2"
          >
            <span className="self-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Trending:
            </span>
            {quickCats.map((slug) => {
              const c = CATEGORIES.find((x) => x.slug === slug);
              if (!c) return null;
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="group flex items-center gap-1.5 rounded-full border border-ink-line bg-white px-3.5 py-1.5 text-xs font-medium text-obsidian/80 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-700 hover:text-brand-700"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                  {c.label}
                </Link>
              );
            })}
          </motion.div>
        </motion.div>

        {/* RIGHT — animated image carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroImageCarousel />
        </motion.div>
      </div>
    </section>
  );
}
