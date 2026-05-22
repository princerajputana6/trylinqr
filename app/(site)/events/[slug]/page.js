import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  Star,
  ShieldCheck,
  Shirt,
  Users,
} from 'lucide-react';
import {
  getEventBySlug,
  getRelatedEvents,
  getEventReviews,
} from '@/lib/data';
import { categoryBySlug } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import TicketSelector from '@/components/events/TicketSelector';
import ReviewSection from '@/components/events/ReviewSection';
import Gallery from '@/components/events/Gallery';
import ViewPing from '@/components/events/ViewPing';
import EventCard from '@/components/events/EventCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const event = await getEventBySlug(params.slug).catch(() => null);
  if (!event) return { title: 'Event not found' };
  return {
    title: event.title,
    description: (event.description || '').slice(0, 160),
    openGraph: {
      title: event.title,
      description: (event.description || '').slice(0, 160),
      images: event.bannerImage ? [event.bannerImage] : [],
    },
  };
}

export default async function EventPage({ params }) {
  const event = await getEventBySlug(params.slug).catch(() => null);
  if (!event) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedEvents(event).catch(() => []),
    getEventReviews(event._id).catch(() => []),
  ]);

  const cat = categoryBySlug(event.category);
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=70';

  return (
    <div>
      <ViewPing slug={event.slug} />

      {/* banner */}
      <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        <img src={banner} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-6">
          <span
            className="chip text-white"
            style={{ background: cat.color }}
          >
            {cat.emoji} {cat.label}
          </span>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-4xl">
            {event.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(event.startDate, { weekday: 'long' })}
            </span>
            {event.startTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {event.startTime}
                {event.endTime ? ` – ${event.endTime}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.venue?.city || 'Online'}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {event.totalViews || 0} views
            </span>
            {event.reviewCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" /> {event.rating} (
                {event.reviewCount})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-bold">About this event</h2>
            <p className="whitespace-pre-line text-white/80">
              {event.description || 'No description provided.'}
            </p>
            {event.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.map((t) => (
                  <span key={t} className="chip bg-white/5 text-white/70">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {(event.ageRestriction || event.dressCode || event.cancellationPolicy) && (
            <section className="grid gap-3 sm:grid-cols-3">
              {event.ageRestriction && (
                <InfoBox icon={Users} label="Age" value={event.ageRestriction} />
              )}
              {event.dressCode && (
                <InfoBox icon={Shirt} label="Dress code" value={event.dressCode} />
              )}
              {event.cancellationPolicy && (
                <InfoBox
                  icon={ShieldCheck}
                  label="Cancellation"
                  value={event.cancellationPolicy}
                />
              )}
            </section>
          )}

          {event.venue?.name && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Venue</h2>
              <div className="card p-4">
                <p className="font-semibold">{event.venue.name}</p>
                <p className="text-sm text-ink-muted">
                  {[
                    event.venue.address,
                    event.venue.city,
                    event.venue.state,
                    event.venue.pincode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {event.venue.lat && event.venue.lng && (
                  <iframe
                    title="map"
                    className="mt-3 h-56 w-full rounded-xl border border-white/10"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      event.venue.lng - 0.01
                    }%2C${event.venue.lat - 0.01}%2C${
                      event.venue.lng + 0.01
                    }%2C${event.venue.lat + 0.01}&marker=${event.venue.lat}%2C${
                      event.venue.lng
                    }`}
                  />
                )}
              </div>
            </section>
          )}

          <Gallery images={event.galleryImages} />

          {event.promoVideo && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Promo</h2>
              <video
                controls
                src={event.promoVideo}
                className="w-full rounded-xl border border-white/10"
              />
            </section>
          )}

          <section>
            <h2 className="mb-3 text-xl font-bold">Organizer</h2>
            <div className="card flex items-center gap-4 p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-lg font-bold text-brand-400">
                {(event.organizer?.orgName || event.organizer?.name || 'O')[0]}
              </div>
              <div>
                <p className="font-semibold">
                  {event.organizer?.orgName || event.organizer?.name}
                </p>
                <p className="text-sm text-ink-muted">
                  {event.organizer?.orgDescription || 'Event organizer on TryLinqr'}
                </p>
              </div>
            </div>
          </section>

          <ReviewSection eventId={event._id} initialReviews={reviews} />
        </div>

        {/* sticky ticket panel */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <TicketSelector event={event} />
        </aside>
      </div>

      {related.length > 0 && (
        <div className="container-page pb-14">
          <h2 className="mb-5 text-2xl font-extrabold">More {cat.label}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((e, i) => (
              <EventCard key={e._id} event={e} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <Icon className="h-5 w-5 text-brand-400" />
      <p className="mt-2 text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
