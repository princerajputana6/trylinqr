'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { HERO_POSTERS } from '@/lib/heroPosters';

const AUTO_MS = 6500;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const lineUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const pop = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Full-bleed creative-poster hero. The active poster fills the entire
 * hero — including the area behind the (transparent) navbar. Auto
 * rotates through all HERO_POSTERS.
 */
export default function FullPosterHero() {
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
  const poster = slides[index];

  return (
    <section
      className="relative -mt-[68px] flex min-h-screen flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* photo — full bleed, swaps with crossfade */}
      <AnimatePresence initial={false}>
        <motion.img
          key={`bg-${poster.slug}`}
          src={poster.photo}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* left-side dark fade — covers ~30% of width then dissolves into the photo.
          This replaces the old rectangular text panel; copy sits inside the fade. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-obsidian via-obsidian/82 via-30% to-transparent" />
      {/* gentle bottom-to-obsidian so controls have contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/90 to-transparent" />
      {/* accent glow tinted by current poster */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(55% 65% at 18% 50%, ${poster.accent}40 0%, transparent 70%)`,
        }}
      />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.10]" />

      {/* hero content */}
      <div className="container-page relative flex flex-1 flex-col gap-12 pb-10 pt-[120px] sm:pt-[140px] lg:gap-10">
        {/* top: poster headline + badges (animated) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={poster.slug}
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.9fr]"
          >
            {/* LEFT — copy sits inside the left-side fade scrim,
                no card border / rectangle */}
            <div className="relative max-w-[640px]">
              <motion.div
                variants={lineUp}
                className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur"
              >
                <Sparkles
                  className="h-3 w-3"
                  style={{ color: poster.accentSoft || '#fff' }}
                />
                {poster.eyebrow}
              </motion.div>

              {/* HEADLINE — three distinct treatments per line */}
              <div className="relative mt-6 max-w-2xl">
                {/* tiny asterisk ornament */}
                <motion.span
                  variants={lineUp}
                  className="absolute -left-2 -top-3 font-display text-lg text-white/60 sm:-left-3 sm:text-2xl"
                  style={{ transform: 'rotate(-12deg)' }}
                >
                  ✦
                </motion.span>

                {poster.headline.map((line, i) => {
                  const style = ['outline', 'serif', 'stamp'][i] || 'stamp';

                  if (style === 'outline') {
                    // Line 0: thin outlined uppercase — stencil style
                    return (
                      <motion.h1
                        key={i}
                        variants={lineUp}
                        style={{
                          color: 'transparent',
                          WebkitTextStroke: `1.5px ${line.color}`,
                          transform: 'rotate(-3deg)',
                          textShadow: '0 6px 18px rgba(0,0,0,0.35)',
                        }}
                        className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-[2.4rem] sm:text-5xl xl:text-[4.6rem]"
                      >
                        {line.text}
                      </motion.h1>
                    );
                  }

                  if (style === 'serif') {
                    // Line 1: HUGE Playfair italic lowercase with swash
                    return (
                      <motion.h1
                        key={i}
                        variants={lineUp}
                        style={{
                          color: line.color,
                          transform: 'rotate(-1deg) translateX(8px)',
                          textShadow:
                            '0 4px 0 rgba(0,0,0,0.18), 0 12px 32px rgba(0,0,0,0.55)',
                        }}
                        className="relative -mt-1 font-serif italic font-black leading-[0.9] tracking-tight text-[4.6rem] sm:text-[7rem] xl:text-[9rem]"
                      >
                        {line.text.toLowerCase()}
                        {/* swash underline */}
                        <svg
                          aria-hidden
                          viewBox="0 0 320 18"
                          className="absolute -bottom-2 left-2 h-3 w-[85%] sm:w-[78%]"
                        >
                          <motion.path
                            d="M2 12 C 80 0, 220 0, 318 8"
                            stroke={poster.accentSoft || '#fff'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              delay: 0.7,
                              duration: 1.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                        </svg>
                      </motion.h1>
                    );
                  }

                  // Line 2: filled stamp — wide letter-spacing
                  return (
                    <motion.div
                      key={i}
                      variants={lineUp}
                      className="mt-2 flex items-center gap-3"
                      style={{ transform: 'rotate(-1.5deg)' }}
                    >
                      <span
                        className="hidden h-px flex-1 sm:block"
                        style={{ background: `${line.color}66` }}
                      />
                      <motion.h1
                        style={{
                          color: line.color,
                          textShadow:
                            '0 2px 0 rgba(0,0,0,0.25), 0 8px 22px rgba(0,0,0,0.5)',
                        }}
                        className="font-display font-extrabold uppercase leading-none text-[1.6rem] tracking-[0.22em] sm:text-[2.4rem] xl:text-[3rem]"
                      >
                        {line.text}
                      </motion.h1>
                      <span
                        className="hidden h-px flex-1 sm:block"
                        style={{ background: `${line.color}66` }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* tagline — flanked by dividers, more deliberate */}
              <motion.div
                variants={lineUp}
                className="mt-8 flex max-w-md items-center gap-3"
              >
                <span className="h-px flex-1 bg-white/25" />
                <p className="text-center font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-white/85 sm:text-[13px]">
                  {poster.tagline}
                </p>
                <span className="h-px flex-1 bg-white/25" />
              </motion.div>

              <motion.div variants={lineUp} className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={poster.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-obsidian shadow-elevated transition-transform hover:-translate-y-0.5"
                >
                  {poster.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/admin-register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/20"
                >
                  Become Organizer
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — badges + barcode stamp (stacked) */}
            <motion.div
              variants={stagger}
              className="flex flex-col items-end gap-6 lg:items-end"
            >
              <div className="flex flex-wrap items-center gap-4">
                {poster.badges.map((b, i) => (
                  <motion.div
                    key={i}
                    variants={pop}
                    whileHover={{ y: -4, rotate: i % 2 === 0 ? -3 : 3 }}
                    style={{
                      transform: `rotate(${i % 2 === 0 ? -5 : 5}deg)`,
                      background:
                        b.tone === 'sand'
                          ? '#b38f6f'
                          : b.tone === 'cream'
                          ? '#fff7e9'
                          : '#161616',
                      color:
                        b.tone === 'sand' || b.tone === 'cream'
                          ? '#161616'
                          : '#fff7e9',
                    }}
                    className="grid h-[110px] w-[110px] place-items-center rounded-full border-2 border-white/25 text-center shadow-elevated sm:h-[124px] sm:w-[124px]"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
                        {b.label}
                      </p>
                      <p className="font-display text-lg font-extrabold uppercase leading-tight sm:text-xl">
                        {b.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* barcode stamp */}
              <motion.div
                variants={pop}
                className="hidden items-center gap-3 rounded-xl bg-white/10 px-3 py-2 backdrop-blur sm:flex"
              >
                <Barcode />
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
                  {poster.stamp || 'TICKET · 24-TLQ-001'}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* bottom: just nav controls (search/city now lives in the header) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-auto flex items-center justify-center gap-3"
        >
            <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.slug}
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.slug} poster`}
                  className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all"
                  style={{ width: i === index ? 36 : 10 }}
                >
                  {i === index && !paused && (
                    <motion.span
                      key={`prog-${i}-${index}`}
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
              className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Barcode() {
  const bars = Array.from({ length: 22 }, (_, i) => ({
    w: 1 + ((i * 31) % 4),
    gap: 1 + ((i * 11) % 3),
  }));
  return (
    <div className="flex items-end gap-[1px]">
      {bars.map((b, i) => (
        <span
          key={i}
          style={{
            width: `${b.w}px`,
            marginRight: `${b.gap}px`,
            height: '24px',
            background: '#fff',
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}
