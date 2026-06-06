/*
 * Per-category landing-page metadata. Each category gets its own
 * hero copy, banner imagery, quick filters and contextual CTA so the
 * /categories/[cat] page feels tailored — not a generic list.
 */

export const CATEGORY_THEMES = {
  'bike-ride': {
    headline: 'Throttle on. Find your next ride.',
    sub: 'Sunrise breakfast loops, weekend escapes and Himalayan tours — group rides curated for every skill level.',
    eyebrow: 'Two-wheel adventures',
    heroImage:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1800&q=75',
    accent: '#f97316',
    metaCards: [
      { label: 'Avg group', value: '14 riders' },
      { label: 'Distance', value: '60 – 360 km' },
      { label: 'Difficulty', value: 'Easy → Expert' },
    ],
    quickFilters: [
      { label: 'Day rides', q: 'day' },
      { label: 'Weekend escapes', q: 'weekend' },
      { label: 'Himalayan tours', q: 'himalayan' },
      { label: 'Free RSVP', q: 'free' },
    ],
    perks: [
      {
        icon: 'Map',
        title: 'Live route share',
        body: 'Track lead + sweep riders in real time on a shared link.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Pre-ride briefing',
        body: 'Gear check, fuel-up, formation rules — every ride, every time.',
      },
      {
        icon: 'LifeBuoy',
        title: 'Backup support',
        body: 'A support vehicle on multi-day rides plus 24/7 line.',
      },
    ],
    ctaCard: {
      eyebrow: 'Logistics',
      title: 'Need to ship your bike?',
      body: 'Get an instant indicative quote to send your bike to the ride start — anywhere in India.',
      cta: 'Calculate shipping',
      href: '/bike-shipping',
    },
  },

  jagran: {
    headline: 'Devotional nights, together.',
    sub: 'Bhajan sandhyas, Mata jagrans and Sufi nights — find a community gathering near you.',
    eyebrow: 'Spiritual gatherings',
    heroImage:
      'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=1800&q=75',
    accent: '#eab308',
    metaCards: [
      { label: 'Avg duration', value: '4 – 8 hrs' },
      { label: 'Typical entry', value: 'Free / Pass' },
      { label: 'Held in', value: 'Halls · Temples' },
    ],
    quickFilters: [
      { label: 'Mata jagrans', q: 'mata' },
      { label: 'Bhajan sandhyas', q: 'bhajan' },
      { label: 'Sufi nights', q: 'sufi' },
      { label: 'Free entry', q: 'free' },
    ],
    perks: [
      {
        icon: 'Flame',
        title: 'Verified organizers',
        body: 'Hosted by community-trusted samitis and groups.',
      },
      {
        icon: 'Users',
        title: 'Family friendly',
        body: 'All ages welcome — kids and elders included.',
      },
      {
        icon: 'Ticket',
        title: 'Instant pass',
        body: 'QR pass delivered to your phone within seconds.',
      },
    ],
  },

  function: {
    headline: 'Functions that feel handcrafted.',
    sub: 'Weddings, anniversaries, milestone parties — book celebrations curated by the best in the business.',
    eyebrow: 'Celebrations',
    heroImage:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1800&q=75',
    accent: '#ec4899',
    metaCards: [
      { label: 'Avg guests', value: '50 – 400' },
      { label: 'Booking lead', value: '2 – 8 weeks' },
      { label: 'Venue types', value: 'Banquet · Lawn' },
    ],
    quickFilters: [
      { label: 'Engagements', q: 'engagement' },
      { label: 'Birthdays', q: 'birthday' },
      { label: 'Anniversaries', q: 'anniversary' },
    ],
    perks: [
      {
        icon: 'Sparkles',
        title: 'Vetted hosts',
        body: 'Only organizers with proven track records make it here.',
      },
      {
        icon: 'Calendar',
        title: 'Flexible dates',
        body: 'Filter by date range and capacity to find a fit fast.',
      },
      {
        icon: 'PartyPopper',
        title: 'All-in-one packages',
        body: 'Decor, catering, entertainment — bundled where possible.',
      },
    ],
  },

  concert: {
    headline: 'Live music that hits different.',
    sub: 'Indie gigs, headliner shows, festival stages — every show, one tap to your QR pass.',
    eyebrow: 'Live music',
    heroImage:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&q=75',
    accent: '#8b5cf6',
    metaCards: [
      { label: 'Genres', value: 'Indie · Hip-hop · Rock' },
      { label: 'Avg capacity', value: '200 – 5000' },
      { label: 'Cities', value: '12+' },
    ],
    quickFilters: [
      { label: 'This weekend', q: 'weekend' },
      { label: 'Indie', q: 'indie' },
      { label: 'Hip-hop', q: 'hiphop' },
      { label: 'Free entry', q: 'free' },
    ],
    perks: [
      {
        icon: 'Mic2',
        title: 'Verified line-ups',
        body: 'Confirmed artist lists, never bait-and-switch.',
      },
      {
        icon: 'Ticket',
        title: 'Instant QR ticket',
        body: 'Skip the queue with a tap-to-scan entry.',
      },
      {
        icon: 'Sparkles',
        title: 'Early-bird drops',
        body: 'Be first in line on featured-event releases.',
      },
    ],
  },

  workshop: {
    headline: 'Learn something worth showing off.',
    sub: 'Hands-on workshops led by working pros — pottery, photography, code, coffee and beyond.',
    eyebrow: 'Skills & craft',
    heroImage:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=75',
    accent: '#06b6d4',
    metaCards: [
      { label: 'Avg class size', value: '8 – 20' },
      { label: 'Duration', value: '2 hrs – Full day' },
      { label: 'Levels', value: 'Beginner → Pro' },
    ],
    quickFilters: [
      { label: 'Beginner', q: 'beginner' },
      { label: 'Weekend', q: 'weekend' },
      { label: 'Hands-on', q: 'hands' },
      { label: 'Online', q: 'online' },
    ],
    perks: [
      {
        icon: 'Wrench',
        title: 'Small group sizes',
        body: 'You\'re a participant, not a face in the crowd.',
      },
      {
        icon: 'Sparkles',
        title: 'Take work home',
        body: 'Most workshops include the materials and a piece to keep.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Refund safety net',
        body: 'Hassle-free refunds if a class is cancelled.',
      },
    ],
  },

  sports: {
    headline: 'Play, run, ride — together.',
    sub: 'Tournaments, marathons, pickleball ladders and Sunday football — find your next game.',
    eyebrow: 'Sport & fitness',
    heroImage:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1800&q=75',
    accent: '#22c55e',
    metaCards: [
      { label: 'Formats', value: 'Solo · Team' },
      { label: 'Levels', value: 'Casual → Pro' },
      { label: 'Avg participants', value: '24 – 500' },
    ],
    quickFilters: [
      { label: 'Marathons', q: 'marathon' },
      { label: 'Tournaments', q: 'tournament' },
      { label: 'Pickleball', q: 'pickleball' },
      { label: 'Free entry', q: 'free' },
    ],
    perks: [
      {
        icon: 'Trophy',
        title: 'Live leaderboards',
        body: 'Standings updated through the event, not after.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Insurance covered',
        body: 'Most paid events include base accident cover.',
      },
      {
        icon: 'Users',
        title: 'Find a team',
        body: 'Solo? Join the open pool to be paired up.',
      },
    ],
  },

  festival: {
    headline: 'Festivals worth the trip.',
    sub: 'Multi-day cultural festivals, food carnivals and arts events — book passes and plan the weekend.',
    eyebrow: 'Festivals',
    heroImage:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1800&q=75',
    accent: '#710014',
    metaCards: [
      { label: 'Duration', value: '1 – 5 days' },
      { label: 'Includes', value: 'Lineup · Food · Stay' },
      { label: 'Cities', value: 'Pan-India' },
    ],
    quickFilters: [
      { label: 'Multi-day', q: 'multi' },
      { label: 'Food', q: 'food' },
      { label: 'Cultural', q: 'cultural' },
      { label: 'With stay', q: 'stay' },
    ],
    perks: [
      {
        icon: 'Tent',
        title: 'Camping options',
        body: 'On-site stay packages with select festivals.',
      },
      {
        icon: 'Sparkles',
        title: 'Featured spotlight',
        body: 'Hand-picked headliners and curated lineups.',
      },
      {
        icon: 'Ticket',
        title: 'Day-pass flexibility',
        body: 'Pick a day or go all-in with a festival pass.',
      },
    ],
  },

  exhibition: {
    headline: 'Art, design and ideas worth seeing.',
    sub: 'Solo shows, art fairs, design weeks and pop-up galleries — book entries to the moment.',
    eyebrow: 'Exhibitions & galleries',
    heroImage:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1800&q=75',
    accent: '#3b82f6',
    metaCards: [
      { label: 'Avg run', value: '3 – 30 days' },
      { label: 'Includes', value: 'Guided walks' },
      { label: 'Cities', value: 'Delhi · Mumbai · BLR' },
    ],
    quickFilters: [
      { label: 'Art', q: 'art' },
      { label: 'Design', q: 'design' },
      { label: 'Photography', q: 'photography' },
      { label: 'Free entry', q: 'free' },
    ],
    perks: [
      {
        icon: 'Frame',
        title: 'Curated walks',
        body: 'Optional guided tours led by curators.',
      },
      {
        icon: 'Calendar',
        title: 'Time-slot entry',
        body: 'No queues — book a slot, walk straight in.',
      },
      {
        icon: 'Sparkles',
        title: 'Member previews',
        body: 'Special access on opening nights.',
      },
    ],
  },

  food: {
    headline: 'Taste the city, one event at a time.',
    sub: 'Food trails, supper clubs, brewery nights and pop-ups — eat well, drink well, repeat.',
    eyebrow: 'Food & drink',
    heroImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=75',
    accent: '#b38f6f',
    metaCards: [
      { label: 'Formats', value: 'Trails · Supper clubs' },
      { label: 'Avg seats', value: '10 – 60' },
      { label: 'Cuisines', value: '12+' },
    ],
    quickFilters: [
      { label: 'Supper clubs', q: 'supper' },
      { label: 'Brewery nights', q: 'brewery' },
      { label: 'Food trails', q: 'trail' },
      { label: 'Veg-only', q: 'veg' },
    ],
    perks: [
      {
        icon: 'UtensilsCrossed',
        title: 'Chef-led nights',
        body: 'Meet the people behind your plate.',
      },
      {
        icon: 'Sparkles',
        title: 'Small-batch menus',
        body: 'Tasting menus you won\'t find on regular service.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Allergen disclosed',
        body: 'Full ingredient breakdown for every dish.',
      },
    ],
  },

  comedy: {
    headline: 'A night of stand-up, every night.',
    sub: 'Open mics, headliner sets, sketch nights and improv — laugh harder this weekend.',
    eyebrow: 'Comedy',
    heroImage:
      'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=1800&q=75',
    accent: '#a855f7',
    metaCards: [
      { label: 'Format', value: 'Open mic · Headliner' },
      { label: 'Venue size', value: '50 – 400' },
      { label: 'Cities', value: '12+' },
    ],
    quickFilters: [
      { label: 'Open mic', q: 'open-mic' },
      { label: 'Headliner', q: 'headliner' },
      { label: 'Improv', q: 'improv' },
      { label: 'Free entry', q: 'free' },
    ],
    perks: [
      {
        icon: 'Laugh',
        title: 'Verified comics',
        body: 'Curated rosters, no spam events.',
      },
      {
        icon: 'Ticket',
        title: 'Reserved seating',
        value: 'Pick your row at checkout where venues support it.',
      },
      {
        icon: 'Sparkles',
        title: 'New voices first',
        body: 'Discover next-wave comics before they blow up.',
      },
    ],
  },

  corporate: {
    headline: 'Corporate events without the chaos.',
    sub: 'Off-sites, conferences, leadership summits — book and manage as a team in one place.',
    eyebrow: 'Business & corporate',
    heroImage:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=75',
    accent: '#64748b',
    metaCards: [
      { label: 'Avg attendees', value: '30 – 500' },
      { label: 'Formats', value: 'Off-site · Summit' },
      { label: 'GST invoicing', value: 'Yes' },
    ],
    quickFilters: [
      { label: 'Conferences', q: 'conference' },
      { label: 'Off-sites', q: 'offsite' },
      { label: 'Networking', q: 'networking' },
    ],
    perks: [
      {
        icon: 'Briefcase',
        title: 'Group invoicing',
        body: 'Single GST invoice for the whole team.',
      },
      {
        icon: 'Users',
        title: 'Bulk seating',
        body: 'Block large allocations in a single click.',
      },
      {
        icon: 'ShieldCheck',
        title: 'NDA-friendly',
        body: 'Private events with controlled access lists.',
      },
    ],
  },

  travel: {
    headline: 'Pack light. Travel together.',
    sub: 'Group tours, weekend getaways, treks, retreats and curated trips — discover and book travel experiences across India and beyond.',
    eyebrow: 'Tours & getaways',
    heroImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&q=75',
    accent: '#a6c5dc',
    metaCards: [
      { label: 'Avg group', value: '6 – 24 travellers' },
      { label: 'Duration', value: '2 – 10 days' },
      { label: 'Destinations', value: 'Pan-India & abroad' },
    ],
    quickFilters: [
      { label: 'Weekend trips', q: 'weekend' },
      { label: 'Treks', q: 'trek' },
      { label: 'Retreats', q: 'retreat' },
      { label: 'Beach', q: 'beach' },
      { label: 'Free RSVP', q: 'free' },
    ],
    perks: [
      {
        icon: 'Plane',
        title: 'Curated itineraries',
        body: 'Day-by-day plans by experienced travel hosts — no guesswork.',
      },
      {
        icon: 'Users',
        title: 'Small-group vibe',
        body: 'Group sizes capped so you actually meet your trip-mates.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Verified hosts',
        body: 'Travel organizers vetted before they can publish trips.',
      },
    ],
  },

  other: {
    headline: 'One-of-a-kind experiences.',
    sub: 'The events that don\'t fit a box — workshops, gatherings, pop-ups and everything in between.',
    eyebrow: 'Something different',
    heroImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=75',
    accent: '#94a3b8',
    metaCards: [
      { label: 'Anything goes', value: '✦' },
      { label: 'Curated weekly', value: 'New drops' },
      { label: 'Across', value: 'India' },
    ],
    quickFilters: [
      { label: 'This weekend', q: 'weekend' },
      { label: 'Free entry', q: 'free' },
      { label: 'Featured', q: 'featured' },
    ],
    perks: [
      {
        icon: 'Sparkles',
        title: 'Hand-picked',
        body: 'Every event reviewed before going live.',
      },
      {
        icon: 'Users',
        title: 'Small-crowd vibes',
        body: 'Intimate formats, easy to mingle.',
      },
      {
        icon: 'Ticket',
        title: 'Easy in, easy out',
        body: 'QR entry, refund-friendly policies.',
      },
    ],
  },
};

export function themeFor(slug) {
  return CATEGORY_THEMES[slug] || CATEGORY_THEMES.other;
}
