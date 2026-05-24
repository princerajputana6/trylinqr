'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import VintageTicket from '@/components/shared/VintageTicket';

const AUTO_MS = 6000;

export default function HeroCarousel({ events = [] }) {
  const slides = events.slice(0, 6);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (d) => {
      setDir(d);
      setIndex((i) => (i + d + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!slides.length) {
    return (
      <section className="-mt-[68px] grid h-[60vh] place-items-center bg-obsidian text-white/60">
        No featured events yet.
      </section>
    );
  }

  const event = slides[index];
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=75';

  return (
    <section
      className="relative -mt-[68px] flex min-h-[640px] items-center overflow-hidden bg-obsidian py-12 pt-[100px] sm:py-16 sm:pt-[120px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* background image stack with soft fade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${event._id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={banner}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-obsidian/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/55 to-obsidian" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(113,0,20,0.25)_0%,transparent_70%)]" />
        </motion.div>
      </AnimatePresence>

      {/* nav arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous event"
        className="group absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-sand-100/20 bg-sand-50/10 text-sand-50 backdrop-blur-md transition-all hover:bg-sand-50/25 sm:grid"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next event"
        className="group absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-sand-100/20 bg-sand-50/10 text-sand-50 backdrop-blur-md transition-all hover:bg-sand-50/25 sm:grid"
      >
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="container-page relative w-full">
        {/* eyebrow above ticket */}
        <div className="mx-auto mb-5 flex max-w-4xl items-center justify-center gap-3 text-center">
          <span className="h-px w-12 bg-sand-100/30" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-sand-200/80">
            Now Showing on TryLinqr
          </span>
          <span className="h-px w-12 bg-sand-100/30" />
        </div>

        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={event._id}
              custom={dir}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.12,
              }}
            >
              <VintageTicket event={event} size="hero" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls — progress + pause */}
        <div className="mt-7 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Slide ${i + 1}`}
                className="group relative h-1.5 overflow-hidden rounded-full bg-sand-100/25 transition-all"
                style={{ width: i === index ? 56 : 18 }}
              >
                {i === index && !paused && (
                  <motion.div
                    key={`progress-${i}-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-sand-300"
                  />
                )}
                {i === index && paused && (
                  <span className="absolute inset-0 bg-sand-300" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex items-center gap-1.5 rounded-full border border-sand-100/20 bg-sand-50/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sand-100/85 backdrop-blur transition-colors hover:bg-sand-50/20"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      </div>
    </section>
  );
}
