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
        <div className="text-4xl">🔍</div>
        <p className="mt-3 font-semibold">No events found</p>
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
