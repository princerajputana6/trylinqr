import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedList from '@/components/home/FeaturedList';
import CategoryGrid from '@/components/home/CategoryGrid';
import EventRow from '@/components/home/EventRow';
import StatsSection from '@/components/home/StatsSection';
import FestivalBanner from '@/components/home/FestivalBanner';
import PopularOrganizers from '@/components/home/PopularOrganizers';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import OrganizerCTA from '@/components/home/OrganizerCTA';
import {
  getFeaturedEvents,
  getWeekendEvents,
  getTrendingEvents,
  getRecentEvents,
  getPopularOrganizers,
  getPlatformCounts,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured = [],
    weekend = [],
    trending = [],
    recent = [],
    organizers = [],
    counts = { events: 0, organizers: 0 };
  try {
    [featured, weekend, trending, recent, organizers, counts] =
      await Promise.all([
        getFeaturedEvents(),
        getWeekendEvents(),
        getTrendingEvents(),
        getRecentEvents(6),
        getPopularOrganizers(6),
        getPlatformCounts(),
      ]);
  } catch (e) {
    console.error('home data error', e);
  }

  // Hero — prefer featured then recent (need at least the banner image)
  const heroSlides = [...featured, ...recent]
    .filter((e) => e && e.bannerImage)
    .reduce((acc, e) => {
      if (!acc.find((x) => String(x._id) === String(e._id))) acc.push(e);
      return acc;
    }, [])
    .slice(0, 6);

  const spotlight = featured[0] || trending[0] || recent[0];
  // Merge featured + weekend + trending so the Featured list always has plenty
  const seen = new Set();
  const upcoming = [...featured, ...weekend, ...trending, ...recent]
    .filter((e) => e && !seen.has(String(e._id)) && seen.add(String(e._id)))
    .slice(0, 8);

  return (
    <>
      <HeroCarousel events={heroSlides.length ? heroSlides : recent} />

      <StatsSection counts={counts} />

      <FeaturedList
        events={upcoming}
        title="Featured Upcoming Events"
        subtitle="Keep checking back to stay informed about the activities in our community and reserve your preferred seats in advance."
      />

      <CategoryGrid />

      {spotlight && <FestivalBanner event={spotlight} />}

      <EventRow
        title="Trending now"
        subtitle="What everyone's booking right now"
        events={trending}
        viewAllHref="/explore?sort=popular"
      />

      <PopularOrganizers organizers={organizers} />

      <WhyChooseUs />

      <Testimonials />

      <OrganizerCTA />
    </>
  );
}
