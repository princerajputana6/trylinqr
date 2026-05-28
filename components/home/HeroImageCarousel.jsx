'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PosterSlide from '@/components/home/PosterSlide';
import { HERO_POSTERS } from '@/lib/heroPosters';

const AUTO_MS = 5500;

export default function HeroImageCarousel() {
  const slides = HERO_POSTERS;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTO_MS
    );
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const go = (d) => setIndex((i) => (i + d + slides.length) % slides.length);
  const current = slides[index];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PosterSlide poster={current} />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          aria-label="Previous poster"
          className="absolute -left-4 top-1/2 z-30 hidden -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card transition-all hover:-translate-y-[55%] hover:border-brand-700/30 sm:grid"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next poster"
          className="absolute -right-4 top-1/2 z-30 hidden -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-ink-line bg-white text-obsidian shadow-card transition-all hover:-translate-y-[55%] hover:border-brand-700/30 sm:grid"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.slug} poster`}
            className="group relative h-1.5 overflow-hidden rounded-full bg-obsidian/15 transition-all"
            style={{ width: i === index ? 34 : 10 }}
          >
            {i === index && !paused && (
              <motion.span
                key={`prog-${i}-${index}`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                className="absolute inset-y-0 left-0 bg-brand-700"
              />
            )}
            {i === index && paused && (
              <span className="absolute inset-0 bg-brand-700" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
