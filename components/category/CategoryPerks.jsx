'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/shared/Icon';

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CategoryPerks({ theme }) {
  if (!theme.perks?.length) return null;
  return (
    <section className="container-page py-16">
      <div className="mb-10 text-center">
        <p className="section-eyebrow">What you get</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
          Why this category, on TryLinqr
        </h2>
      </div>

      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {theme.perks.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            whileHover={{ y: -6 }}
            className="hover-glow rounded-2xl border border-ink-line bg-white p-6 shadow-card"
          >
            <div
              className="mb-4 grid h-12 w-12 place-items-center rounded-xl text-white"
              style={{ background: theme.accent }}
            >
              <Icon name={p.icon} className="h-5 w-5" />
            </div>
            <p className="font-display text-lg font-bold text-obsidian">
              {p.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-obsidian/65">
              {p.body || p.value}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
