'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import HeroEventSlider from '@/components/home/HeroEventSlider';

const HERO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
const HERO_POSTER =
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&q=75';

export default function HeroSection({ events = [] }) {
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
    <section className="relative -mt-[68px] flex min-h-screen items-center overflow-hidden">
      {/* background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* overlays */}
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-brand-600/25 blur-[130px]" />
      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-royal-600/25 blur-[130px]" />

      <div className="container-page relative grid w-full items-center gap-12 pb-16 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        {/* left — copy + search */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            India&apos;s multi-domain event platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-[3.7rem]"
          >
            Where every
            <br />
            event finds its{' '}
            <span className="relative whitespace-nowrap">
              <span className="text-gradient">crowd</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 9c50-6 146-8 196-3"
                  stroke="#e11d2e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-base text-white/70 md:text-lg"
          >
            Bike rides, jagrans, concerts, workshops, sports and more —
            discover, book and experience events near you. Anyone can host,
            everyone can join.
          </motion.p>

          {/* search */}
          <motion.form
            onSubmit={search}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 backdrop-blur-xl sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events…"
                className="w-full rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
            </div>
            <div className="hidden w-px self-stretch bg-white/10 sm:block" />
            <div className="relative sm:w-40">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-xl bg-transparent py-3 pl-11 pr-3 text-sm text-white focus:outline-none"
              >
                <option value="" className="bg-ink-soft">
                  All cities
                </option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-ink-soft">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-600 hover:-translate-y-0.5"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <Link href="/explore" className="btn-primary">
              Explore all events
            </Link>
            <Link
              href="/admin-register"
              className="flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <PlayCircle className="h-5 w-5 text-brand-400" />
              Host your own event
            </Link>
          </motion.div>
        </div>

        {/* right — recent events slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <HeroEventSlider events={events} />
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/25 p-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  );
}
