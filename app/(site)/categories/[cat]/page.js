import { notFound } from 'next/navigation';
import { getCategoryEvents } from '@/lib/data';
import { categoryBySlug, CATEGORY_SLUGS } from '@/lib/constants';
import CategoryPageClient from '@/components/categories/CategoryPageClient';

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

  return <CategoryPageClient categorySlug={params.cat} events={events} />;
}
