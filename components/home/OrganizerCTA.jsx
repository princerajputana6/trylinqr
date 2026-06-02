'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function OrganizerCTA() {
  return (
    <section className="container-page py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-obsidian p-10 text-white sm:p-14"
      >
        {/* Single accent — one solid rose strip on the left edge. No gradients, no dual blur. */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-brand-700" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sand-400">
              <Sparkles className="h-3.5 w-3.5" /> For organizers
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              Host your next event{' '}
              <span className="text-sand-400">with TryLinqr</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm text-white/70 sm:text-base">
              Launch a beautiful event page in minutes. Sell tickets, check in
              attendees with QR scans, and grow your audience — all from one
              cinematic dashboard.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/admin-register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-800 hover:-translate-y-0.5"
              >
                Start organizing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                See what&apos;s on
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { k: '0%', v: 'commission to start' },
              { k: 'Instant', v: 'payouts' },
              { k: 'QR', v: 'check-in built-in' },
              { k: '24/7', v: 'organizer support' },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
              >
                <p className="font-display text-3xl font-extrabold text-sand-400">
                  {s.k}
                </p>
                <p className="mt-1 text-xs text-white/70">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
