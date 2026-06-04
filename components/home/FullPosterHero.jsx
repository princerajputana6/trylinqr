'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

/* ─── Quick pastel constants used by the marquee accents ─── */
const P_MELLOW  = '#e9d88a';
const P_APRICOT = '#f8c49c';
const P_ROSE    = '#efb3c7';
const P_ORCHID  = '#d7a8cb';
const P_BABY    = '#a6c5dc';
const P_JADE    = '#c9ddb1';
const PASTELS   = [P_MELLOW, P_APRICOT, P_ROSE, P_ORCHID, P_BABY, P_JADE];

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
  { label: 'Live Concert',       sub: '5,000+ attendees',     img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80', accent: P_ROSE },
  { label: 'Music Festival',     sub: 'Multi-day pass',       img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&q=80', accent: P_APRICOT },
  { label: 'Photography Walk',   sub: 'Guided city tour',     img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', accent: P_BABY },
  { label: 'Art Exhibition',     sub: 'Limited seats',        img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=80', accent: P_ORCHID },
  { label: 'Stand-up Comedy',    sub: '200 seats left',       img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80', accent: P_MELLOW },
  { label: 'Cultural Jagran',    sub: 'All-night event',      img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=500&q=80', accent: P_ROSE },
  { label: 'Tech Workshop',      sub: 'Hands-on session',     img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&q=80', accent: P_BABY },
  { label: 'Theater Night',      sub: 'Classic play revival', img: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&q=80', accent: P_JADE },
];

const ROW2 = [
  { label: 'Weekend Bike Ride',  sub: 'Group of 50+',         img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80', accent: P_APRICOT },
  { label: 'Yoga & Wellness',    sub: 'Morning session',      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', accent: P_JADE },
  { label: 'Marathon Run',       sub: '10K & 21K routes',     img: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&q=80', accent: P_ROSE },
  { label: 'Dance Performance',  sub: 'Classical & fusion',   img: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&q=80', accent: P_ORCHID },
  { label: 'Sports Tournament',  sub: 'Open registration',    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80', accent: P_BABY },
  { label: 'Pottery Workshop',   sub: 'Take home your art',   img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80', accent: P_APRICOT },
  { label: 'Rock Concert',       sub: 'Selling out fast',     img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80', accent: P_ROSE },
  { label: 'Craft Beer Festival',sub: '40+ local breweries',  img: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=500&q=80', accent: P_MELLOW },
];

const CAT_ACCENT = {
  'bike-ride': P_APRICOT,
  concert:     P_ORCHID,
  workshop:    P_BABY,
  jagran:      P_MELLOW,
  sports:      P_JADE,
  festival:    P_ROSE,
  comedy:      P_MELLOW,
  food:        P_APRICOT,
  exhibition:  P_BABY,
  corporate:   P_ORCHID,
  function:    P_ROSE,
  other:       P_JADE,
};

function toCard(ev, idx = 0) {
  const date = ev.startDate
    ? new Date(ev.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';
  const city = ev.venue?.city || '';
  return {
    label: ev.title,
    sub: [city, date].filter(Boolean).join(' · '),
    img: ev.bannerImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80',
    accent: CAT_ACCENT[ev.category] || PASTELS[idx % PASTELS.length],
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
          setRow1(evts.slice(0, half).map((e, i) => toCard(e, i)));
          setRow2(evts.slice(half).map((e, i) => toCard(e, i)));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative -mt-[68px] flex flex-col overflow-hidden bg-white">
      {/* ══ TOP: cycling headline + stats (text part — gets the gradient) ══ */}
      <div
        className="relative w-full"
        style={{
          background: 'linear-gradient(180deg, #ffffff 39.9%, #f8f8f8 100%)',
        }}
      >
        <div className="container-page relative z-10 flex flex-col items-center pt-[88px] pb-8 text-center sm:pt-[96px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-obsidian/80 shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 text-brand-700" />
          India&apos;s Premium Event Ecosystem
        </motion.div>

        {/* Cycling headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0"
        >
          <span className="font-display text-4xl font-extrabold text-obsidian sm:text-5xl xl:text-[3.5rem]">
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
                className="font-display text-4xl font-extrabold sm:text-5xl xl:text-[3.5rem]" style={{ color: '#f8c49c' }}
              >
                {CYCLING_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="font-display text-4xl font-extrabold text-obsidian sm:text-5xl xl:text-[3.5rem]">
            in 2 min
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3 text-base text-obsidian/70 sm:text-[17px]"
        >
          No hassle &middot; No paperwork &middot; QR entry
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-5 flex items-center divide-x divide-obsidian/15"
        >
          {[
            { val: '10,000+', label: 'Events' },
            { val: '50+', label: 'Cities' },
            { val: '< 2 min', label: 'To Book' },
          ].map(({ val, label }) => (
            <div key={label} className="px-6 text-center first:pl-0 last:pr-0 sm:px-8">
              <p className="font-display text-xl font-extrabold text-obsidian sm:text-2xl">
                {val}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-obsidian/55">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
        </div>
      </div>

      {/* ══ MARQUEE ROWS — auto-scroll + user-draggable ══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="relative z-10 flex flex-col gap-4 overflow-hidden py-6"
      >
        <DragMarquee items={row1} />
        <DragMarquee items={row2} rtl />
      </motion.div>

      {/* ══ BOTTOM CTA buttons ══ */}
      <div className="relative z-10 pb-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-800"
          >
            Explore Events <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin-register"
            className="inline-flex items-center gap-2 rounded-xl border border-obsidian/15 bg-white px-6 py-3 text-sm font-bold text-obsidian transition-all hover:bg-rose-50"
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
      className="cursor-grab select-none overflow-hidden active:cursor-grabbing"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      <motion.div
        ref={ref}
        style={{ x, display: 'flex' }}
        drag="x"
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => {
          dragging.current = true;
          didDrag.current = false;
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 8) didDrag.current = true;
        }}
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

/* ─── Individual event card in the marquee — full-bleed photo with a
       dark translucent caption strip across the bottom. ─── */
function MarqueeCard({ label, sub, img, href, didDrag }) {
  // Normalize the sub-line so it reads as "CITY | 17 JUN" instead of "City · 17 Jun"
  const subLine = (sub || '').replace(/\s*·\s*/g, ' | ').toUpperCase();

  const inner = (
    <>
      <img
        src={img}
        alt={label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* dark translucent caption strip — image shows through */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-5 py-3.5 backdrop-blur-[2px]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
            {subLine}
          </p>
        </div>
        <p className="mt-1 line-clamp-1 text-[17px] font-bold leading-snug text-white">
          {label}
        </p>
      </div>
    </>
  );

  const cls =
    'relative mr-5 block h-[215px] w-[330px] shrink-0 overflow-hidden rounded-2xl';
  const style = { boxShadow: '0 10px 32px rgba(42,34,54,0.18)' };

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={style}
        onClick={(e) => {
          if (didDrag?.current) e.preventDefault();
        }}
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}
