import { SearchX } from 'lucide-react';
import EventCard from './EventCard';
import { SkeletonCard } from '@/components/shared/LoadingSpinner';

export default function EventGrid({ events = [], loading = false, empty }) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="card grid place-items-center py-20 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700/[0.08] text-brand-700">
          <SearchX className="h-7 w-7" />
        </div>
        <p className="mt-4 font-semibold text-obsidian">No events found</p>
        <p className="mt-1 text-sm text-ink-muted">
          {empty || 'Try adjusting your filters or check back later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((e, i) => (
        <EventCard key={e._id} event={e} index={i} />
      ))}
    </div>
  );
}
