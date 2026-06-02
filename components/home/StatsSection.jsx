'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

export default function StatsSection({ counts }) {
  const stats = [
    { label: 'Live events', value: counts.events, suffix: '+' },
    { label: 'Organizers', value: counts.organizers, suffix: '+' },
    { label: 'Categories', value: 12 },
    { label: 'Cities', value: 12 },
  ];

  return (
    <section className="bg-white py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container-page grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: 0.1 + i * 0.1,
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="font-display text-3xl font-extrabold text-gradient sm:text-4xl"
            >
              <AnimatedCounter value={s.value} suffix={s.suffix || ''} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="mt-1 text-xs text-ink-muted"
            >
              {s.label}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
