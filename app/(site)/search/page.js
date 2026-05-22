import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import EventGrid from '@/components/events/EventGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  return { title: searchParams.q ? `Search: ${searchParams.q}` : 'Search' };
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';
  let events = [];
  if (q) {
    try {
      await connectDB();
      const raw = await Event.find({
        status: 'published',
        $or: [
          { title: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { tags: new RegExp(q, 'i') },
          { 'venue.city': new RegExp(q, 'i') },
          { category: new RegExp(q, 'i') },
        ],
      })
        .populate('organizer', 'name orgName')
        .lean();
      events = JSON.parse(
        JSON.stringify(
          raw.map((e) => ({
            ...e,
            minPrice: e.ticketTiers?.length
              ? Math.min(...e.ticketTiers.map((t) => t.price))
              : 0,
          }))
        )
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">
        {q ? `Search results for "${q}"` : 'Search events'}
      </h1>
      <p className="mb-8 mt-1 text-sm text-ink-muted">
        {q ? `${events.length} result${events.length !== 1 ? 's' : ''}` : 'Type a query in the search bar above.'}
      </p>
      {q && <EventGrid events={events} empty="No events match your search." />}
    </div>
  );
}
