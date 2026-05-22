import { notFound } from 'next/navigation';
import EventGrid from '@/components/events/EventGrid';
import { getCategoryEvents } from '@/lib/data';
import { categoryBySlug, CATEGORY_SLUGS } from '@/lib/constants';

export async function generateMetadata({ params }) {
  const cat = categoryBySlug(params.cat);
  return { title: `${cat.label} events` };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }) {
  if (!CATEGORY_SLUGS.includes(params.cat)) notFound();
  const cat = categoryBySlug(params.cat);
  let events = [];
  try {
    events = await getCategoryEvents(params.cat);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="container-page py-10">
      <div
        className="mb-8 rounded-3xl border border-white/10 p-8"
        style={{ background: `${cat.color}18` }}
      >
        <div className="text-5xl">{cat.emoji}</div>
        <h1 className="mt-3 text-3xl font-extrabold">{cat.label}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {events.length} event{events.length !== 1 ? 's' : ''} available
        </p>
      </div>
      <EventGrid events={events} empty={`No ${cat.label} events yet.`} />
    </div>
  );
}
