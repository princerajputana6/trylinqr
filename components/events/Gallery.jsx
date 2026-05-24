'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Gallery({ images = [] }) {
  const [active, setActive] = useState(null);
  if (!images.length) return null;

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold text-obsidian">Gallery</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((src, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.04 }}
            onClick={() => setActive(src)}
            className="aspect-square overflow-hidden rounded-xl"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-4"
          >
            <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-white backdrop-blur">
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={active}
              alt=""
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
