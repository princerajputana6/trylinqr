'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

// Brand-palette accent presets
const ACCENTS = {
  brand:   { hex: '#944268', bg: 'rgba(148,66,104,0.12)'  },
  sand:    { hex: '#c97a3a', bg: 'rgba(230,142,88,0.13)'  },
  orchid:  { hex: '#b078a0', bg: 'rgba(215,168,203,0.18)' },
  mellow:  { hex: '#b09a2a', bg: 'rgba(233,216,138,0.20)' },
  baby:    { hex: '#5a8fb0', bg: 'rgba(166,197,220,0.20)' },
  jade:    { hex: '#6a9a50', bg: 'rgba(201,221,177,0.22)' },
};

export default function StatCard({ icon: Icon, label, value, prefix, suffix, accent = 'brand', index = 0 }) {
  const a = ACCENTS[accent] || ACCENTS.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="card group p-5 transition-shadow hover:shadow-elevated"
    >
      {/* Icon badge */}
      <div
        className="grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:scale-110"
        style={{ background: a.bg, color: a.hex }}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Value */}
      <div className="mt-4 font-display text-2xl font-extrabold text-obsidian">
        <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} />
      </div>

      {/* Label */}
      <div className="mt-0.5 text-sm text-ink-muted">{label}</div>

      {/* Bottom accent bar */}
      <div
        className="mt-4 h-0.5 w-8 rounded-full opacity-40 transition-all group-hover:w-full group-hover:opacity-70"
        style={{ background: a.hex }}
      />
    </motion.div>
  );
}
