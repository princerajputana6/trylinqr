'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

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

const CAT_ACCENT = {
  'bike-ride': '#f97316',
  concert: '#ef4444',
  workshop: '#22d3ee',
  jagran: '#ec4899',
  sports: '#3b82f6',
  festival: '#f59e0b',
  comedy: '#eab308',
  food: '#b45309',
  exhibition: '#a855f7',
  corporate: '#64748b',
  function: '#d946ef',
  other: '#6b7280',
};

function toCard(ev) {
  const date = ev.startDate
    ? new Date(ev.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';
  const city = ev.venue?.city || '';
  return {
    label: ev.title,
    sub: [city, date].filter(Boolean).join(' · '),
    img: ev.bannerImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80',
    accent: CAT_ACCENT[ev.category] || '#f97316',
    href: `/events/${ev.slug}`,
  };
}

export default function FullPosterHero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [row1, setRow1] = useState(ROW1);
  const [row2, setRow2] = useState(ROW2);

  useEffect(() => {
    const t = setInterval(
      () => setWordIdx((i) => (i + 1) % CYCLING_WORDS.length),
      2500
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('/api/events?limit=24&sort=popular')
      .then((r) => r.json())
      .then((data) => {
        const evts = (data.events || []).filter((e) => e.bannerImage);
        if (evts.length >= 4) {
          const half = Math.ceil(evts.length / 2);
          setRow1(evts.slice(0, half).map(toCard));
          setRow2(evts.slice(half).map(toCard));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative -mt-[68px] flex min-h-screen flex-col overflow-hidden bg-[#06040f]">

      <style>{`
        @keyframes bg-float { 0%,100%{ transform:translateY(0) scale(1); } 50%{ transform:translateY(-18px) scale(1.03); } }
      `}</style>

      {/* ── Floating blurred bg images ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[8%] -top-[8%] h-[55%] w-[42%] overflow-hidden rounded-[60%] opacity-[0.22] blur-[90px]"
          style={{ animation: 'bg-float 9s ease-in-out infinite' }}>
          <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -right-[6%] top-[5%] h-[50%] w-[40%] overflow-hidden rounded-[60%] opacity-[0.18] blur-[90px]"
          style={{ animation: 'bg-float 11s ease-in-out 2.5s infinite' }}>
          <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute bottom-[2%] left-[18%] h-[40%] w-[52%] overflow-hidden rounded-[50%] opacity-[0.15] blur-[90px]"
          style={{ animation: 'bg-float 14s ease-in-out 5s infinite' }}>
          <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&q=50" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute left-[8%] top-[38%] h-60 w-60 rounded-full bg-brand-700/20 blur-[110px]" />
        <div className="absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-[8%] right-[28%] h-56 w-56 rounded-full bg-orange-500/15 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/72 via-black/55 to-black/88" />

      {/* ══ TOP: Cycling CTA + search ══ */}
      <div className="container-page relative z-10 flex flex-col items-center pt-[96px] text-center sm:pt-[112px]">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 text-orange-400" />
          India&apos;s Premium Event Ecosystem
        </motion.div>

        {/* ── Cycling headline: "Organize [word] in 2 min" ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0"
        >
          <span className="font-display text-4xl font-extrabold text-white sm:text-5xl xl:text-[3.5rem]">
            Organize
          </span>
          <span className="relative inline-flex h-12 items-center overflow-hidden sm:h-14 xl:h-[3.7rem]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ y: 52, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -52, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-extrabold text-orange-400 sm:text-5xl xl:text-[3.5rem]"
              >
                {CYCLING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="font-display text-4xl font-extrabold text-white sm:text-5xl xl:text-[3.5rem]">
            in 2 min
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="mt-3 text-base text-white/50 sm:text-[17px]"
        >
          No hassle &middot; No paperwork &middot; QR entry
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-5 flex items-center divide-x divide-white/15"
        >
          {[
            { val: '10,000+', label: 'Events' },
            { val: '50+', label: 'Cities' },
            { val: '< 2 min', label: 'To Book' },
          ].map(({ val, label }) => (
            <div key={label} className="px-6 text-center first:pl-0 last:pr-0 sm:px-8">
              <p className="font-display text-xl font-extrabold text-white sm:text-2xl">{val}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{label}</p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* ══ MARQUEE ROWS — auto-scroll + user-draggable ══ */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.7 }}
        className="relative z-10 flex flex-1 flex-col justify-center gap-5 overflow-hidden py-10"
      >
        <DragMarquee items={row1} />
        <DragMarquee items={row2} rtl />
      </motion.div>

      {/* ══ BOTTOM CTA buttons ══ */}
      <div className="relative z-10 pb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(249,115,22,0.5)]"
          >
            Explore Events <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin-register"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            Become Organizer
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Draggable + auto-scrolling marquee row ─── */
function DragMarquee({ items, rtl = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const half = useRef(0);
  const dragging = useRef(false);
  const didDrag = useRef(false);

  useAnimationFrame((_, delta) => {
    if (dragging.current) return;
    if (!half.current) {
      if (ref.current) {
        half.current = ref.current.scrollWidth / 2;
        if (rtl) x.set(-half.current);
      }
      return;
    }
    const h = half.current;
    const cur = x.get();
    const spd = 0.052 * Math.min(delta, 50);
    if (!rtl) {
      let next = cur - spd;
      if (next < -h) next += h;
      x.set(next);
    } else {
      let next = cur + spd;
      if (next > 0) next -= h;
      x.set(next);
    }
  });

  return (
    <div
      className="cursor-grab overflow-hidden select-none active:cursor-grabbing"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
    >
      <motion.div
        ref={ref}
        style={{ x, display: 'flex' }}
        drag="x"
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => { dragging.current = true; didDrag.current = false; }}
        onDrag={(_, info) => { if (Math.abs(info.offset.x) > 8) didDrag.current = true; }}
        onDragEnd={() => {
          dragging.current = false;
          const h = half.current;
          if (!h) return;
          const cur = x.get();
          const mod = ((-cur % h) + h) % h;
          x.set(-mod);
        }}
      >
        {[...items, ...items].map((item, i) => (
          <MarqueeCard key={i} {...item} didDrag={didDrag} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Individual event card in the marquee ─── */
function MarqueeCard({ label, sub, img, accent, href, didDrag }) {
  const inner = (
    <>
      <img src={img} alt={label} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-transparent" />
      <div className="absolute left-0 right-0 top-0 h-1" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">{sub}</p>
        </div>
        <p className="mt-1 text-[17px] font-bold leading-snug text-white">{label}</p>
      </div>
    </>
  );

  const cls = 'relative mr-5 h-[215px] w-[330px] shrink-0 overflow-hidden rounded-2xl border border-white/10 block';
  const style = { boxShadow: `0 6px 36px rgba(0,0,0,0.55), 0 0 0 1px ${accent}25` };

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={style}
        onClick={(e) => { if (didDrag?.current) e.preventDefault(); }}
      >
        {inner}
      </Link>
    );
  }
  return <div className={cls} style={style}>{inner}</div>;
}
