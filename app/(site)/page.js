import ThreeHero from '@/components/home/ThreeHero';
import FeaturedList from '@/components/home/FeaturedList';
import CategoryGrid from '@/components/home/CategoryGrid';
import EventRow from '@/components/home/EventRow';
import StatsSection from '@/components/home/StatsSection';
import SpotlightCarousel from '@/components/home/SpotlightCarousel';
import PopularOrganizers from '@/components/home/PopularOrganizers';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import OrganizerCTA from '@/components/home/OrganizerCTA';
import NearbyBar from '@/components/home/NearbyBar';
import {
  getFeaturedEvents,
  getWeekendEvents,
  getTrendingEvents,
  getRecentEvents,
  getPopularOrganizers,
  getPlatformCounts,
  getSpotlightEvents,
  getFeaturedListEvents,
} from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured = [],
    weekend = [],
    trending = [],
    recent = [],
    organizers = [],
    paidSpotlight = [],
    paidList = [],
    counts = { events: 0, organizers: 0, cities: 0, categories: 0 };
  try {
    [featured, weekend, trending, recent, organizers, counts, paidSpotlight, paidList] =
      await Promise.all([
        getFeaturedEvents(),
        getWeekendEvents(),
        getTrendingEvents(),
        getRecentEvents(6),
        getPopularOrganizers(6),
        getPlatformCounts(),
        getSpotlightEvents(6),
        getFeaturedListEvents(8),
      ]);
  } catch (e) {
    console.error('home data error', e);
  }

  // Spotlight carousel — paid 'spotlight' placements first, then fall back
  // to featured + trending so the section is never empty in dev.
  const spotlightSeen = new Set();
  const spotlightEvents = [...paidSpotlight, ...featured, ...trending]
    .filter(
      (e) => e && !spotlightSeen.has(String(e._id)) && spotlightSeen.add(String(e._id)),
    )
    .slice(0, 6);

  // Featured upcoming list (auto-sliding) — paid 'list' first, then merge.
  const upcomingSeen = new Set();
  const upcoming = [...paidList, ...featured, ...weekend, ...trending, ...recent]
    .filter(
      (e) => e && !upcomingSeen.has(String(e._id)) && upcomingSeen.add(String(e._id)),
    )
    .slice(0, 8);

  return (
    <>
      {/* 1. Hero (NearbyBar now lives inside the hero) */}
      <ThreeHero events={featured} counts={counts} />

      {/* 3. Spotlight carousel */}
      <SpotlightCarousel events={spotlightEvents} />

      {/* 4. Featured events (auto-sliding card row) */}
      <FeaturedList
        events={upcoming}
        title="Featured Events"
        subtitle="Keep checking back to stay informed about the activities in our community and reserve your preferred seats in advance."
        autoplay
      />

      {/* 5. Every kind of experience — categories */}
      <CategoryGrid />

      {/* 6. Trending now (auto-sliding card row) */}
      <EventRow
        title="Trending now"
        subtitle="What everyone's booking right now"
        events={trending}
        viewAllHref="/explore?sort=popular"
        autoplay
      />

      {/* 7. Dynamic platform stats */}
      <StatsSection counts={counts} />

      <PopularOrganizers organizers={organizers} />

      <WhyChooseUs />

      <Testimonials />

      <OrganizerCTA />
    </>
  );
}
