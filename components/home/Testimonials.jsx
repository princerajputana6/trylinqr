'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Aanya Verma',
    role: 'Concert enthusiast · Mumbai',
    body: 'TryLinqr is the only app I check now. Booked an indie gig in 20 seconds and the QR check-in at the door felt premium.',
    rating: 5,
  },
  {
    name: 'Rohan Sharma',
    role: 'Workshop organizer · Bengaluru',
    body: 'Sold out my first photography workshop here. The dashboard, analytics and zero-fuss payouts made it effortless.',
    rating: 5,
  },
  {
    name: 'Priya Kapoor',
    role: 'Festival-goer · Delhi',
    body: 'The discovery feed surfaces events I never would have found. The experience feels handcrafted — not generic.',
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-20">
      {/* Parallax dot grid */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-[-10%]" aria-hidden>
        <div
          className="h-full w-full opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </motion.div>

      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">Loved by</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            Voices from the crowd
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-sm"
            >
              <span className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-[100px] font-black leading-none text-white/[0.04]" aria-hidden>
                "
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-white text-white" />
                ))}
              </div>
              <p className="relative mt-4 text-[14px] leading-relaxed text-white/80">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 font-bold text-white">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{r.name}</p>
                  <p className="text-[11px] text-white/55">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
