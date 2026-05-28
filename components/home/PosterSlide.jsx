'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const lineUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const pop = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Magazine-cover / creative-poster style hero slide.
 * One per category — the homepage hero carousel cycles through them.
 */
export default function PosterSlide({ poster }) {
  const isDark = !!poster.dark;
  return (
    <Link
      href={poster.href || '/explore'}
      className="block h-full w-full"
    >
      <motion.article
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative h-[540px] w-full overflow-hidden rounded-[28px] border border-brand-900/15 shadow-elevated sm:h-[580px]"
      >
        {/* photo */}
        <motion.img
          src={poster.photo}
          alt=""
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark base scrim */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Strong left-to-right fade — keeps all text on left fully readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        {/* Bottom-up scrim protects tagline + badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div
          className="pointer-events-none absolute -right-20 top-1/4 h-[280px] w-[280px] rounded-full blur-[120px]"
          style={{ background: `${poster.accent}55` }}
        />

        {/* eyebrow — top */}
        <motion.div
          variants={lineUp}
          className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur"
        >
          <Sparkles
            className="h-3 w-3"
            style={{ color: poster.accentSoft || poster.accent }}
          />
          {poster.eyebrow}
        </motion.div>

        {/* HEADLINE — stacked, tilted, multi-colour */}
        <div className="absolute left-5 top-20 max-w-[78%] sm:left-7 sm:top-24">
          {poster.headline.map((line, i) => (
            <motion.h2
              key={i}
              variants={lineUp}
              style={{
                color: line.color,
                transform: `rotate(${-3 + i * 0.6}deg) translateX(${
                  i * 6
                }px)`,
              }}
              className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-6xl"
            >
              {line.text}
            </motion.h2>
          ))}
        </div>

        {/* tagline — curved, lower-left */}
        <motion.p
          variants={lineUp}
          style={{ transform: 'rotate(-2deg)' }}
          className="absolute bottom-[180px] left-7 max-w-[60%] font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
        >
          {poster.tagline}
        </motion.p>

        {/* BADGES */}
        <motion.div
          variants={stagger}
          className="absolute bottom-[80px] left-6 flex items-end gap-3 sm:bottom-[96px] sm:left-7"
        >
          {poster.badges.map((b, i) => (
            <motion.div
              key={i}
              variants={pop}
              whileHover={{ y: -3, rotate: i % 2 === 0 ? -3 : 3 }}
              style={{
                transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)`,
                background:
                  b.tone === 'sand'
                    ? '#b38f6f'
                    : b.tone === 'cream'
                    ? '#fff7e9'
                    : '#161616',
                color: b.tone === 'sand' || b.tone === 'cream' ? '#161616' : '#fff7e9',
              }}
              className="grid h-[88px] w-[88px] place-items-center rounded-full border-2 border-white/20 shadow-elevated text-center sm:h-[100px] sm:w-[100px]"
            >
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] opacity-80">
                  {b.label}
                </p>
                <p className="font-display text-base font-extrabold uppercase leading-tight sm:text-lg">
                  {b.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM STRIP — accent split */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60px]"
          style={{ background: poster.accent }}
        >
          <div className="bg-noise absolute inset-0 opacity-25" />
          <div className="container-fluid relative flex h-full items-center justify-between px-5 sm:px-7">
            <Barcode label={poster.stamp || 'TICKET · SERIAL 24-TLQ-001'} />
            <motion.span
              variants={lineUp}
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-obsidian shadow-card"
            >
              {poster.cta}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function Barcode({ label }) {
  // procedurally-generated bar widths so it looks like a real barcode
  const bars = Array.from({ length: 28 }, (_, i) => ({
    w: 1 + ((i * 31) % 4),
    gap: 1 + ((i * 11) % 3),
  }));
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-[1px]">
        {bars.map((b, i) => (
          <span
            key={i}
            style={{
              width: `${b.w}px`,
              marginRight: `${b.gap}px`,
              height: '26px',
              background: '#fff7e9',
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
        {label}
      </span>
    </div>
  );
}
