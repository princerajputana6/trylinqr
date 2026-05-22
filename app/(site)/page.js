import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import EventRow from '@/components/home/EventRow';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import {
  getFeaturedEvents,
  getWeekendEvents,
  getTrendingEvents,
  getRecentEvents,
  getPlatformCounts,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured = [],
    weekend = [],
    trending = [],
    recent = [],
    counts = { events: 0, organizers: 0 };
  try {
    [featured, weekend, trending, recent, counts] = await Promise.all([
      getFeaturedEvents(),
      getWeekendEvents(),
      getTrendingEvents(),
      getRecentEvents(6),
      getPlatformCounts(),
    ]);
  } catch (e) {
    console.error('home data error', e);
  }

  return (
    <>
      <HeroSection events={recent.length ? recent : featured} />

      <section className="container-page mt-12">
        <div className="card grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {[
            { label: 'Live events', value: counts.events, suffix: '+' },
            { label: 'Organizers', value: counts.organizers, suffix: '+' },
            { label: 'Categories', value: 12 },
            { label: 'Cities', value: 12 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-brand-400 sm:text-3xl">
                <AnimatedCounter value={s.value} suffix={s.suffix || ''} />
              </div>
              <div className="mt-1 text-xs text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <CategoryGrid />

      <EventRow
        title="Featured events"
        subtitle="Hand-picked highlights you won't want to miss"
        events={featured}
        viewAllHref="/explore?featured=true"
      />

      <EventRow
        title="Happening this week"
        subtitle="Plan your next 7 days"
        events={weekend}
        viewAllHref="/explore"
      />

      <EventRow
        title="Trending now"
        subtitle="What everyone's booking right now"
        events={trending}
        viewAllHref="/explore?sort=popular"
      />

      <section className="container-page py-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600/30 via-ink-soft to-royal-600/30 p-10 text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Got something to host?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Become a TryLinqr organizer and reach thousands of people looking
            for their next experience.
          </p>
          <Link href="/admin-register" className="btn-primary mt-6">
            Become an organizer
          </Link>
        </div>
      </section>
    </>
  );
}
