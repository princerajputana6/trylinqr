'use client';

import { motion } from 'framer-motion';
import { Compass, Zap, ShieldCheck, Sparkles } from 'lucide-react';

const items = [
  { icon: Compass,    num: '01', title: 'Smart discovery',      body: 'Personalised event recommendations tuned to your city, vibe and past bookings.' },
  { icon: Zap,        num: '02', title: 'Lightning checkout',    body: 'Pay and get your QR ticket in under 30 seconds. Free events confirm instantly.' },
  { icon: ShieldCheck, num: '03', title: 'Secure & verified',   body: 'Every organiser is vetted, every payment encrypted, every refund honoured.' },
  { icon: Sparkles,   num: '04', title: 'Tools for organisers', body: 'Beautiful event pages, real-time analytics and one-tap QR check-in at the door.' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            Why TryLinqr
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-black sm:text-4xl">
            Built for moments that matter
          </h2>
        </motion.div>

        <div className="grid gap-px bg-black/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group relative overflow-hidden bg-white p-8 transition-colors hover:bg-black"
              >
                <span className="pointer-events-none absolute right-5 top-4 font-display text-[60px] font-black leading-none text-black/[0.04] group-hover:text-white/[0.05]">
                  {it.num}
                </span>
                <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-xl border border-black/10 text-black transition-all group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-black text-black group-hover:text-white">
                  {it.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-black/50 group-hover:text-white/50">
                  {it.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
