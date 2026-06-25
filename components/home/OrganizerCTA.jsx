'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart2, QrCode, Zap, HeadphonesIcon } from 'lucide-react';

const perks = [
  { icon: Zap,             k: '0%',     v: 'Commission to start' },
  { icon: BarChart2,       k: 'Live',   v: 'Analytics dashboard' },
  { icon: QrCode,          k: 'QR',     v: 'Check-in built-in' },
  { icon: HeadphonesIcon,  k: '24/7',   v: 'Organizer support' },
];

export default function OrganizerCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-20">
      {/* Parallax grid */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-[-10%]" aria-hidden>
        <div
          className="h-full w-full opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
        >
          {/* Top accent bar */}
          <div className="h-[2px] w-full bg-white/20" />

          <div className="grid items-center gap-10 p-10 sm:p-14 lg:grid-cols-2">
            {/* Left */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">
                For organizers
              </p>
              <h2 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Host your next
                <br />
                <span className="text-white/50">event with us.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
                Launch a beautiful event page in minutes. Sell tickets, scan QR codes at the door, and grow your audience — all from one clean dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/admin-register"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Start for free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
                >
                  Browse events
                </Link>
              </div>
            </div>

            {/* Right — perk grid with backdrop blur */}
            <div className="grid grid-cols-2 gap-3">
              {perks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.k}
                    initial={{ opacity: 0, scale: 0.93 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-md"
                  >
                    <Icon className="mb-3 h-5 w-5 text-white/60" />
                    <p className="font-display text-3xl font-black text-white">{p.k}</p>
                    <p className="mt-1 text-[12px] text-white/60">{p.v}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
