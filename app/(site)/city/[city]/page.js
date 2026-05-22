import EventGrid from '@/components/events/EventGrid';
import { getCityEvents } from '@/lib/data';

export async function generateMetadata({ params }) {
  const city = decodeURIComponent(params.city);
  return { title: `Events in ${city}` };
}

export const dynamic = 'force-dynamic';

export default async function CityPage({ params }) {
  const city = decodeURIComponent(params.city);
  let events = [];
  try {
    events = await getCityEvents(city);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">📍 Events in {city}</h1>
      <p className="mb-8 mt-1 text-sm text-ink-muted">
        {events.length} event{events.length !== 1 ? 's' : ''} happening near you
      </p>
      <EventGrid events={events} empty={`No events in ${city} yet.`} />
    </div>
  );
}
