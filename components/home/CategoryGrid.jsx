'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryGrid() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="section-eyebrow">Browse</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
            Every kind of experience
          </h2>
          <p className="mt-2 max-w-md text-sm text-obsidian/65">
            Concerts, workshops, festivals, sports, food and beyond — pick a
            vibe and dive in.
          </p>
        </div>
        <Link
          href="/explore"
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          Explore all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
            >
              <Link href={`/categories/${c.slug}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="hover-glow group relative overflow-hidden rounded-2xl border border-ink-line bg-white p-5 shadow-card"
                >
                  <div
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
                    style={{ background: c.color }}
                  />
                  <div className="relative">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: `${c.color}1F`, color: c.color }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-obsidian">
                      {c.label}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
