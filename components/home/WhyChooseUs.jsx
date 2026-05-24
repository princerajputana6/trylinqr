'use client';

import { motion } from 'framer-motion';
import { Compass, Zap, ShieldCheck, Sparkles } from 'lucide-react';

const items = [
  {
    icon: Compass,
    title: 'Smart discovery',
    body: 'Personalized event recommendations tuned to your city, vibe and past bookings.',
  },
  {
    icon: Zap,
    title: 'Lightning checkout',
    body: 'Pay and get your QR ticket in under 30 seconds. Free events confirm instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & verified',
    body: 'Every organizer is vetted, every payment is encrypted, every refund is honoured.',
  },
  {
    icon: Sparkles,
    title: 'Tools for organizers',
    body: 'Beautiful event pages, real-time analytics and one-tap QR check-in at the door.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="section-eyebrow">Why TryLinqr</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
          Built for the moments that matter
        </h2>
        <p className="mt-3 text-sm text-obsidian/65 sm:text-base">
          A premium ecosystem designed for both attendees and organizers — fast,
          beautiful, and dependable.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="hover-glow group rounded-2xl border border-ink-line bg-white p-6 shadow-card transition-colors hover:border-brand-700/30"
            >
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-brand-700/[0.08] text-brand-700 transition-all group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-obsidian">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-obsidian/65">
                {it.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
