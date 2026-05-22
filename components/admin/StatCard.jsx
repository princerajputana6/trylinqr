'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

export default function StatCard({ icon: Icon, label, value, prefix, suffix, accent = '#e63e62', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card p-5"
    >
      <div
        className="grid h-10 w-10 place-items-center rounded-xl"
        style={{ background: `${accent}22`, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-2xl font-extrabold">
        <AnimatedCounter value={value} prefix={prefix || ''} suffix={suffix || ''} />
      </div>
      <div className="text-sm text-ink-muted">{label}</div>
    </motion.div>
  );
}
