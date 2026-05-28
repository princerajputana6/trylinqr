'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

export default function CategoryHero({ slug, theme, eventCount }) {
  const cat = categoryBySlug(slug);
  const CatIcon = cat.icon;
  return (
    <section className="relative overflow-hidden">
      {/* image + scrim */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={theme.heroImage}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/55 via-obsidian/65 to-obsidian" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 50% 30%, ${theme.accent}30 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="container-page relative grid items-center gap-10 pb-20 pt-[140px] sm:pt-[160px] lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur"
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-md"
              style={{ background: theme.accent, color: 'white' }}
            >
              <CatIcon className="h-3 w-3" strokeWidth={2.6} />
            </span>
            {theme.eyebrow}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-[3.6rem]"
          >
            {theme.headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          >
            {theme.sub}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center gap-3 text-sm text-white/80"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-white"
              style={{ background: theme.accent }}
            >
              {eventCount} live event{eventCount === 1 ? '' : 's'}
            </span>
            <a
              href="#events"
              className="inline-flex items-center gap-1.5 text-white/75 hover:text-white"
            >
              Jump to events
              <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {/* meta cards on right */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1"
        >
          {theme.metaCards.map((m) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                {m.label}
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-white">
                {m.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
