'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Aanya Verma',
    role: 'Concert enthusiast · Mumbai',
    body: 'TryLinqr is the only app I check now. Booked an indie gig in 20 seconds and the QR check-in at the door felt premium.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Aanya+Verma&background=944268&color=fff',
  },
  {
    name: 'Rohan Sharma',
    role: 'Workshop organizer · Bengaluru',
    body: 'I sold out my first photography workshop here. The dashboard, analytics and zero-fuss payouts made it effortless.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Rohan+Sharma&background=944268&color=fff',
  },
  {
    name: 'Priya Kapoor',
    role: 'Festival-goer · Delhi',
    body: 'The discovery feed surfaces events I never would have found. The whole experience feels handcrafted — not generic.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Priya+Kapoor&background=944268&color=fff',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-10">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-eyebrow">Loved by</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
            Voices from the crowd
          </h2>
          <p className="mt-3 text-sm text-obsidian/65 sm:text-base">
            Real stories from attendees and organizers using TryLinqr every day.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-ink-line bg-white p-7 shadow-card"
            >
              <Quote className="absolute right-6 top-6 h-7 w-7 text-brand-700/15" />
              <div className="flex items-center gap-1 text-brand-700">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-brand-700" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-obsidian/85">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-ink-line pt-5">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-obsidian">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
