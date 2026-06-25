'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryGrid() {
  return (
    <section className="border-b border-black/[0.06] bg-white py-0">
      <div className="container-page">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-4">
          <Link
            href="/explore"
            className="flex shrink-0 items-center gap-2 rounded-full border border-black px-4 py-2 text-[13px] font-semibold text-black transition-all hover:bg-black hover:text-white"
          >
            All Events
          </Link>
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.03, duration: 0.35 }}
              >
                <Link
                  href={`/categories/${c.slug}`}
                  className="group flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-[13px] font-medium text-black/60 transition-all hover:border-black hover:bg-black hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  {c.label}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
