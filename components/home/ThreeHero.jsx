'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { CITIES, CATEGORIES } from '@/lib/constants';

const WaveScene = dynamic(() => import('./WaveScene'), { ssr: false });

const FEATURED_CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa'];

/* ── Aurora — SVG radial glows in brand rose-red ── */
function Aurora() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1200 800"
    >
      <defs>
        {/* top-left deep rose */}
        <radialGradient id="rl1" cx="15%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#944268" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#944268" stopOpacity="0" />
        </radialGradient>
        {/* top-right warm rose */}
        <radialGradient id="rl2" cx="85%" cy="15%" r="45%">
          <stop offset="0%" stopColor="#c46090" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c46090" stopOpacity="0" />
        </radialGradient>
        {/* bottom-center deep burgundy */}
        <radialGradient id="rl3" cx="50%" cy="95%" r="60%">
          <stop offset="0%" stopColor="#71304f" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#71304f" stopOpacity="0" />
        </radialGradient>
        {/* center accent */}
        <radialGradient id="rl4" cx="50%" cy="45%" r="35%">
          <stop offset="0%" stopColor="#944268" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#944268" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#rl1)" />
      <rect width="1200" height="800" fill="url(#rl2)" />
      <rect width="1200" height="800" fill="url(#rl3)" />
      <rect width="1200" height="800" fill="url(#rl4)" />
    </svg>
  );
}

/* ── Floating particles ── */
function Particles({ count = 18 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(id);
  }, []);
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 8,
      })),
    [count]
  );
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: '#944268',
            boxShadow: '0 0 8px 2px rgba(148,66,104,0.7)',
            animation: `heroFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

function formatStatNumber(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
  return `${n}+`;
}

/* Staggered text reveal — each word slides up */
const sentence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const word = {
  hidden:  { opacity: 0, y: 40, skewY: 4 },
  visible: { opacity: 1, y: 0,  skewY: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* Infinite marquee strip of event cards */
function EventStrip({ events }) {
  if (!events.length) return null;
  const cards = events.filter((e) => e?.bannerImage).slice(0, 10);
  if (cards.length < 2) return null;
  /* duplicate so the loop is seamless */
  const loop = [...cards, ...cards, ...cards];
  const cardW = 148; /* px — matches w-[148px] */
  const gap = 10;
  const halfW = cards.length * (cardW + gap);

  return (
    <div className="relative mt-8 w-full max-w-3xl overflow-hidden">
      {/* left/right fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent" />

      <motion.div
        className="flex gap-[10px]"
        animate={{ x: [0, -halfW] }}
        transition={{ duration: cards.length * 3, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
      >
        {loop.map((e, i) => (
          <Link
            key={i}
            href={`/events/${e.slug}`}
            className="group relative h-[82px] w-[148px] shrink-0 overflow-hidden rounded-xl"
          >
            <img
              src={e.bannerImage}
              alt={e.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 line-clamp-2 px-2 pb-1.5 text-[10px] font-bold leading-tight text-white">
              {e.title}
            </p>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

export default function ThreeHero({ events = [], counts }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const heroRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);

  /* mouse-following spotlight */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX} ${spotY}, rgba(148,66,104,0.18), transparent 50%)`;

  useEffect(() => {
    const refresh = () => { rectRef.current = heroRef.current?.getBoundingClientRect() ?? null; };
    refresh();
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('scroll', refresh, { passive: true });
    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMouseMove = (e) => {
    if (rafRef.current) return;
    const cx = e.clientX, cy = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const r = rectRef.current;
      if (!r) return;
      mx.set((cx - r.left) / r.width);
      my.set((cy - r.top) / r.height);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city) params.set('city', city);
    router.push(`/explore?${params.toString()}`);
  };

  const headline1 = ['Discover', '&', 'Book'];
  const headline2 = ['Experiences', 'in', '2', 'Minutes.'];

  const posters = events.filter((e) => e?.bannerImage).slice(0, 8);

  const stats = [
    { n: counts?.events,     label: 'Live Events' },
    { n: counts?.organizers, label: 'Organizers' },
    { n: counts?.categories, label: 'Categories' },
    { n: counts?.cities,     label: 'Cities' },
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative -mt-[68px] min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* ── AURORA GLOWS ── */}
      <Aurora />

      {/* ── THREE.JS WAVE TERRAIN ── */}
      <WaveScene />

      {/* ── MOUSE SPOTLIGHT ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ background: spotlight }}
      />

      {/* ── PARTICLES ── */}
      <div className="absolute inset-0 z-[3]">
        <Particles count={18} />
      </div>

      {/* ── BACKGROUND MOSAIC ── */}
      {posters.length > 0 && (
        <div className="pointer-events-none absolute inset-0 grid grid-cols-4 opacity-[0.12]">
          {[...posters, ...posters, ...posters, ...posters]
            .slice(0, 16)
            .map((e, i) => (
              <div key={i} className="relative overflow-hidden">
                <img src={e.bannerImage} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          <div className="absolute inset-0 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      {/* ── GRID LINES ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── CONTENT ── */}
      <motion.div
        style={{ y: heroY }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-16 pt-[68px]"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
            India's Premium Event Platform
          </span>
        </motion.div>

        {/* Headline — all words bright white */}
        <div className="overflow-hidden text-center">
          <motion.h1
            className="font-display text-[44px] font-black leading-[1.0] tracking-tight text-white sm:text-[64px] lg:text-[80px]"
            variants={sentence}
            initial="hidden"
            animate="visible"
          >
            {headline1.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span variants={word} className="inline-block">
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
            <br />
            {headline2.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span variants={word} className="inline-block text-white">
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-4 text-center text-[15px] text-white/60 sm:text-[17px]"
        >
          Concerts · Workshops · Festivals · Sports · Comedy &amp; more
        </motion.p>

        {/* ── SEARCH BAR ── */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 w-full max-w-2xl"
        >
          <div className="flex items-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl transition-all duration-300 focus-within:border-white/40 focus-within:bg-white/[0.12]">
            <Search className="ml-5 h-5 w-5 shrink-0 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="flex-1 bg-transparent px-4 py-4 text-[15px] text-white placeholder-white/35 outline-none"
            />
            <div className="hidden border-l border-white/10 sm:block">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-full bg-transparent px-4 py-4 text-[13px] text-white/60 outline-none"
              >
                <option value="" className="bg-black">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="m-1.5 shrink-0 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-black transition-all hover:bg-white/90 active:scale-95"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* City pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.78 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Popular:
          </span>
          {FEATURED_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => router.push(`/explore?city=${encodeURIComponent(c)}`)}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/[0.12] hover:text-white"
            >
              <MapPin className="h-3 w-3" />
              {c}
            </button>
          ))}
        </motion.div>

        {/* ── STATS (4, dynamic) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="mt-10 flex items-center divide-x divide-white/10"
        >
          {stats.map(({ n, label }) => (
            <div key={label} className="px-5 text-center first:pl-0 last:pr-0">
              <p className="font-display text-2xl font-black text-white">{formatStatNumber(n)}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/55">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── EVENT CARDS SLIDER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.1 }}
          className="w-full max-w-3xl"
        >
          <EventStrip events={events} />
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-white/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
