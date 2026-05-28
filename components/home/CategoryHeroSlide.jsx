'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';

/**
 * Category-themed slide used inside the homepage hero carousel
 * alongside event tickets. Big cinematic image + headline + CTA.
 */
export default function CategoryHeroSlide({ slug, theme }) {
  const cat = categoryBySlug(slug);
  const CatIcon = cat.icon;
  return (
    <Link href={`/categories/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative overflow-hidden rounded-[26px] border border-white/15 shadow-elevated"
      >
        <div className="relative h-[360px] w-full sm:h-[420px]">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            src={theme.heroImage}
            alt={cat.label}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(50% 60% at 30% 40%, ${theme.accent}33 0%, transparent 70%)`,
            }}
          />

          {/* content */}
          <div className="absolute inset-0 flex items-end p-6 sm:p-10">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur"
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-md text-white"
                  style={{ background: theme.accent }}
                >
                  <CatIcon className="h-3 w-3" strokeWidth={2.6} />
                </span>
                {theme.eyebrow}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.55 }}
                className="mt-4 font-display text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-5xl"
              >
                {theme.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.55 }}
                className="mt-3 max-w-lg text-sm text-white/80 sm:text-base"
              >
                {theme.sub}
              </motion.p>

              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-obsidian transition-transform group-hover:-translate-y-0.5"
              >
                Explore {cat.label}
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
