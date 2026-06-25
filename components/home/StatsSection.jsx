'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

export default function StatsSection({ counts }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const stats = [
    { label: 'Live events',  value: counts?.events || 0,      suffix: '+' },
    { label: 'Organizers',   value: counts?.organizers || 0,  suffix: '+' },
    { label: 'Categories',   value: counts?.categories || 0,  suffix: ''  },
    { label: 'Cities',       value: counts?.cities || 0,      suffix: ''  },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-20">
      {/* Parallax grid */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-[-10%]"
        aria-hidden
      >
        <div
          className="h-full w-full opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      <div className="container-page relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-white/60"
        >
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-black px-8 py-10 text-center transition-colors hover:bg-white/[0.03]"
            >
              <div className="font-display text-5xl font-black text-white sm:text-6xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/60 transition-colors group-hover:text-white/60">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
