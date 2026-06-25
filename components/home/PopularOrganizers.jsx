'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar } from 'lucide-react';
import { categoryBySlug } from '@/lib/constants';

export default function PopularOrganizers({ organizers = [] }) {
  if (!organizers.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            Trusted hosts
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-black sm:text-4xl">
            Popular organizers
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {organizers.map((o, i) => (
            <motion.div
              key={String(o._id)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                href={`/explore?organizer=${o._id}`}
                className="group flex items-start gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 transition-all hover:border-black/20 hover:shadow-xl"
              >
                {/* Avatar */}
                <img
                  src={
                    o.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(o.orgName || o.name || 'O')}&background=111111&color=ffffff&bold=true&size=96`
                  }
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-black/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-display text-[15px] font-black text-black">
                      {o.orgName || o.name}
                    </p>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-400" />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-500">
                    {o.orgDescription || 'Trusted event organizer'}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {o.categories?.slice(0, 3).map((slug) => {
                      const c = categoryBySlug(slug);
                      const Icon = c?.icon;
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] px-2 py-0.5 text-[10px] font-semibold text-black/50"
                        >
                          {Icon && <Icon className="h-3 w-3" />}
                          {c?.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {o.eventCount} event{o.eventCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
