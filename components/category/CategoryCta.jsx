'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoryCta({ cta, accent }) {
  if (!cta) return null;
  return (
    <section className="container-page py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-obsidian-line bg-obsidian p-10 text-white sm:p-12"
      >
        <div
          className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full blur-[140px]"
          style={{ background: `${accent}40` }}
        />
        <div className="bg-grid-dark absolute inset-0 opacity-25" />

        <div className="relative grid items-center gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: accent }}
            >
              <Sparkles className="h-3.5 w-3.5" /> {cta.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/70 sm:text-base">
              {cta.body}
            </p>
          </div>
          <div className="lg:text-right">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-obsidian transition-transform hover:-translate-y-0.5"
            >
              {cta.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
