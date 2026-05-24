'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Eye } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';

export default function PopularOrganizers({ organizers = [] }) {
  if (!organizers.length) return null;
  return (
    <section className="container-page py-16">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow">Trusted hosts</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-obsidian sm:text-4xl">
            Popular organizers
          </h2>
          <p className="mt-2 max-w-md text-sm text-obsidian/65">
            Hand-picked event creators putting on the best experiences.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizers.map((o, i) => (
          <motion.div
            key={o._id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/explore?organizer=${o._id}`}
              className="hover-glow group block rounded-2xl border border-ink-line bg-white p-5 shadow-card transition-colors hover:border-sand-400"
            >
              <div className="flex items-center gap-4">
                <Avatar org={o} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-display text-base font-bold text-obsidian">
                      {o.orgName || o.name}
                    </p>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-sand-500" />
                  </div>
                  <p className="line-clamp-1 text-xs text-ink-muted">
                    {o.orgDescription || 'Trusted event organizer'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {o.categories.slice(0, 3).map((slug) => {
                  const c = categoryBySlug(slug);
                  const Icon = c.icon;
                  return (
                    <span
                      key={slug}
                      className="chip gap-1.5 border border-ink-line bg-pearl text-obsidian/80"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                      {c.label}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-5 border-t border-ink-line pt-4 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-700" />
                  {o.eventCount} event{o.eventCount > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-brand-700" />
                  {o.totalViews.toLocaleString('en-IN')} views
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Avatar({ org }) {
  const src =
    org.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      org.orgName || org.name || 'O'
    )}&background=710014&color=fff&bold=true&size=128`;
  return (
    <img
      src={src}
      alt=""
      className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-sand-400/40"
    />
  );
}
