'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import EventCard from '@/components/events/EventCard';

export default function EventRow({ title, subtitle, events, viewAllHref }) {
  const ref = useRef(null);
  if (!events?.length) return null;

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="container-page py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden items-center gap-1 text-sm font-medium text-brand-400 hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2"
      >
        {events.map((e, i) => (
          <div key={e._id} className="w-[280px] shrink-0 snap-start">
            <EventCard event={e} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
