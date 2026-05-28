import { notFound } from 'next/navigation';
import { getCategoryEvents } from '@/lib/data';
import { categoryBySlug, CATEGORY_SLUGS } from '@/lib/constants';
import { themeFor } from '@/lib/categoryThemes';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryFilters from '@/components/category/CategoryFilters';
import CategoryPerks from '@/components/category/CategoryPerks';
import CategoryCta from '@/components/category/CategoryCta';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const cat = categoryBySlug(params.cat);
  const theme = themeFor(params.cat);
  return {
    title: `${cat.label} events — ${theme.headline}`,
    description: theme.sub,
  };
}

export default async function CategoryPage({ params }) {
  if (!CATEGORY_SLUGS.includes(params.cat)) notFound();
  const theme = themeFor(params.cat);
  let events = [];
  try {
    events = await getCategoryEvents(params.cat);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="-mt-[68px] bg-pearl">
      <CategoryHero
        slug={params.cat}
        theme={theme}
        eventCount={events.length}
      />
      <CategoryFilters theme={theme} events={events} />
      <CategoryPerks theme={theme} />
      <CategoryCta cta={theme.ctaCard} accent={theme.accent} />
    </div>
  );
}
