'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { CITIES } from '@/lib/constants';

const CYCLING_WORDS = [
  'Events',
  'Bike Rides',
  'Concerts',
  'Workshops',
  'Festivals',
  'Comedy Shows',
  'Jagrans',
];

const ROW1 = [
  { label: 'Live Concert', sub: '5,000+ attendees', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80', accent: '#ef4444' },
  { label: 'Music Festival', sub: 'Multi-day pass', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&q=80', accent: '#f97316' },
  { label: 'Photography Walk', sub: 'Guided city tour', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', accent: '#06b6d4' },
  { label: 'Art Exhibition', sub: 'Limited seats', img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=80', accent: '#a855f7' },
  { label: 'Stand-up Comedy', sub: '200 seats left', img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80', accent: '#eab308' },
  { label: 'Cultural Jagran', sub: 'All-night event', img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=500&q=80', accent: '#ec4899' },
  { label: 'Tech Workshop', sub: 'Hands-on session', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=80', accent: '#22d3ee' },
  { label: 'Theater Night', sub: 'Classic play revival', img: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&q=80', accent: '#f59e0b' },
];

const ROW2 = [
  { label: 'Weekend Bike Ride', sub: 'Group of 50+', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80', accent: '#f97316' },
  { label: 'Yoga & Wellness', sub: 'Morning session', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', accent: '#22c55e' },
  { label: 'Marathon Run', sub: '10K & 21K routes', img: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&q=80', accent: '#ef4444' },
  { label: 'Dance Performance', sub: 'Classical & fusion', img: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&q=80', accent: '#d946ef' },
  { label: 'Sports Tournament', sub: 'Open registration', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80', accent: '#3b82f6' },
  { label: 'Pottery Workshop', sub: 'Take home your art', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80', accent: '#a16207' },
  { label: 'Rock Concert', sub: 'Selling out fast', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80', accent: '#ef4444' },
  { label: 'Craft Beer Festival', sub: '40+ local breweries', img: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=500&q=80', accent: '#b45309' },
];

export default function FullPosterHero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setWordIdx((i) => (i + 1) % CYCLING_WORDS.length),
      2500
    );
    return () => clearInterval(t);
  }, []);

  const search = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (city) p.set('city', city);
    router.push(`/explore?${p}`);
  };

  return (
    <section className="relative -mt-[68px] flex min-h-screen flex-col overflow-hidden bg-[#06040f]">

      {/* ── CSS keyframes for marquee & float ── */}
      <style>{`
        @keyframes mq-ltr { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mq-rtl { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .mq-ltr { display:flex; animation: mq-ltr 38s linear infinite; will-change: transform; }
        .mq-rtl { display:flex; animation: mq-rtl 38s linear infinite; will-change: transform; }
        @keyframes bg-float { 0%,100%{ transform:translateY(0) scale(1);} 50%{ transform:translateY(-18px) scale(1.03);} }
        .bg-float { animation: bg-float 9s ease-in-out infinite; }
        .bg-float-d { animation: bg-float 11s ease-in-out 2.5s infinite; }
        .bg-float-s { animation: bg-float 14s ease-in-out 5s infinite; }
      `}</style>

      {/* ── Background floating blurred images ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-float absolute -left-[8%] -top-[8%] h-[55%] w-[42%] overflow-hidden rounded-[60%] opacity-[0.22] blur-[90px]">
          <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="bg-float-d absolute -right-[6%] top-[5%] h-[50%] w-[40%] overflow-hidden rounded-[60%] opacity-[0.20] blur-[90px]">
          <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="bg-float-s absolute bottom-[2%] left-[18%] h-[40%] w-[52%] overflow-hidden rounded-[50%] opacity-[0.18] blur-[90px]">
          <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        {/* color accent glows */}
        <div className="absolute left-[8%] top-[35%] h-64 w-64 rounded-full bg-brand-700/25 blur-[110px]" />
        <div className="absolute right-[12%] top-[20%] h-72 w-72 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[30%] h-56 w-56 rounded-full bg-orange-500/15 blur-[100px]" />
      </div>

      {/* ── Dark overlay ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/88" />

      {/* ══════════════════════════════════════
          TOP — badge · headline · search bar
      ══════════════════════════════════════ */}
      <div className="container-page relative z-10 flex flex-col items-center pt-[96px] text-center sm:pt-[116px]">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 text-orange-400" />
          India&apos;s Premium Event Ecosystem
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl xl:text-[3.6rem]"
        >
          Find &amp; Book Events{' '}
          <span className="text-orange-400">Happening Near You</span>
        </motion.h1>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          onSubmit={search}
          className="mt-7 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_48px_rgba(0,0,0,0.55)] sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-700" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="w-full bg-transparent py-[14px] pl-12 pr-4 text-sm font-medium text-obsidian placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          <div className="hidden w-px self-stretch bg-ink-line sm:block" />
          <div className="relative sm:w-44">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-700" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-transparent py-[14px] pl-11 pr-4 text-sm font-medium text-obsidian focus:outline-none"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-brand-700 px-7 py-[14px] text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </div>

      {/* ══════════════════════════════════════
          MIDDLE — two infinite marquee rows
      ══════════════════════════════════════ */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 overflow-hidden py-10">

        {/* Row 1 → left to right */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="mq-ltr">
            {[...ROW1, ...ROW1].map((item, i) => (
              <MarqueeCard key={i} {...item} />
            ))}
          </div>
        </div>

        {/* Row 2 ← right to left */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="mq-rtl">
            {[...ROW2, ...ROW2].map((item, i) => (
              <MarqueeCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM — cycling CTA + buttons
      ══════════════════════════════════════ */}
      <div className="relative z-10 pb-12 pt-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="font-display text-2xl font-bold text-white sm:text-3xl">
            Organize
          </span>
          <span className="relative inline-flex h-9 items-center overflow-hidden sm:h-10">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -32, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-2xl font-extrabold text-orange-400 sm:text-3xl"
              >
                {CYCLING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="font-display text-2xl font-bold text-white sm:text-3xl">
            in 2 minutes
          </span>
        </div>
        <p className="mt-1.5 text-sm text-white/50">
          No hassle · No paperwork · QR entry
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-800"
          >
            Explore Events
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin-register"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Become Organizer
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MarqueeCard({ label, sub, img, accent }) {
  return (
    <div
      className="relative mr-4 h-[158px] w-[264px] shrink-0 overflow-hidden rounded-2xl border border-white/10"
      style={{ boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 0 1px ${accent}22` }}
    >
      <img
        src={img}
        alt={label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {sub}
          </p>
        </div>
        <p className="mt-0.5 text-[15px] font-bold leading-snug text-white">{label}</p>
      </div>
    </div>
  );
}
