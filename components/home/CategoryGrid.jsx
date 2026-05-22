'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryGrid() {
  return (
    <section className="container-page py-14">
      <h2 className="mb-1 text-2xl font-extrabold">Browse by category</h2>
      <p className="mb-6 text-sm text-ink-muted">
        From spiritual gatherings to high-energy concerts.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link href={`/categories/${c.slug}`}>
              <motion.div
                whileHover={{ y: -5, scale: 1.04 }}
                className="card flex flex-col items-center gap-2 p-4 text-center"
                style={{ borderColor: `${c.color}30` }}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-xs font-semibold">{c.label}</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
