/*
 * Curated "AI-creative" poster configs used by the homepage hero carousel.
 * Each poster gets:
 *   - a strong full-bleed photo (Unsplash, category-appropriate)
 *   - three stacked headline words in different brand colors
 *   - a tagline + two badge callouts
 *   - a CTA pill that links to the relevant category page
 */

export const HERO_POSTERS = [
  {
    slug: 'bike-ride',
    eyebrow: 'TryLinqr Vol. 24 · The Riders Issue',
    photo:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=80',
    accent: '#a01524',
    accentSoft: '#f97316',
    headline: [
      { text: 'WEEKEND', color: '#ffffff' },
      { text: 'RIDES', color: '#f97316' },
      { text: 'BOOK LIVE', color: '#fff7e9' },
    ],
    tagline: 'Group rides · Outstation tours · QR pass at the start point',
    badges: [
      { label: 'Register', value: '2 min', tone: 'dark' },
      { label: 'Pay', value: 'Online', tone: 'sand' },
    ],
    cta: 'Book this ride',
    href: '/categories/bike-ride',
    stamp: 'ADMIT ONE · SERIAL 24-BR-079',
    dark: true,
  },
  {
    slug: 'concert',
    eyebrow: 'TryLinqr Vol. 24 · Live Music Edit',
    photo:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
    accent: '#710014',
    accentSoft: '#b38f6f',
    headline: [
      { text: 'FRONT', color: '#fff7e9' },
      { text: 'ROW', color: '#b38f6f' },
      { text: 'EVERY NIGHT', color: '#fff7e9' },
    ],
    tagline: 'Indie · Hip-hop · Rock · Tribute nights',
    badges: [
      { label: 'Lineup', value: 'Verified', tone: 'sand' },
      { label: 'Entry', value: 'QR tap', tone: 'dark' },
    ],
    cta: 'See gigs near you',
    href: '/categories/concert',
    stamp: 'ADMIT ONE · SERIAL 24-CN-104',
    dark: true,
  },
  {
    slug: 'jagran',
    eyebrow: 'TryLinqr Vol. 24 · Devotional Nights',
    photo:
      'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=1600&q=80',
    accent: '#8a0c1b',
    accentSoft: '#eab308',
    headline: [
      { text: 'BHAJAN', color: '#fff7e9' },
      { text: 'KIRTAN', color: '#eab308' },
      { text: 'ALL NIGHT', color: '#fff7e9' },
    ],
    tagline: 'Mata jagrans · Sufi nights · Community gatherings',
    badges: [
      { label: 'Entry', value: 'Often free', tone: 'sand' },
      { label: 'Family', value: 'All ages', tone: 'dark' },
    ],
    cta: 'Find a jagran',
    href: '/categories/jagran',
    stamp: 'PASS · SERIAL 24-JG-051',
    dark: true,
  },
  {
    slug: 'workshop',
    eyebrow: 'TryLinqr Vol. 24 · The Craft Issue',
    photo:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80',
    accent: '#06b6d4',
    accentSoft: '#22d3ee',
    headline: [
      { text: 'LEARN', color: '#ffffff' },
      { text: 'BY DOING', color: '#22d3ee' },
      { text: 'HANDS ON', color: '#fff7e9' },
    ],
    tagline: 'Pottery · Photography · Coffee · Code · Yoga',
    badges: [
      { label: 'Class', value: 'Small group', tone: 'dark' },
      { label: 'Take', value: 'Work home', tone: 'sand' },
    ],
    cta: 'Pick a workshop',
    href: '/categories/workshop',
    stamp: 'SEAT · SERIAL 24-WS-218',
    dark: true,
  },
  {
    slug: 'festival',
    eyebrow: 'TryLinqr Vol. 24 · Festival Drop',
    photo:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80',
    accent: '#710014',
    accentSoft: '#b38f6f',
    headline: [
      { text: 'WEEKEND', color: '#fff7e9' },
      { text: 'LONG', color: '#b38f6f' },
      { text: 'FESTIVALS', color: '#fff7e9' },
    ],
    tagline: 'Multi-day passes · Camping options · Curated lineups',
    badges: [
      { label: 'Day', value: 'Pass', tone: 'sand' },
      { label: 'Full', value: 'Festival', tone: 'dark' },
    ],
    cta: 'Plan the weekend',
    href: '/categories/festival',
    stamp: 'PASS · SERIAL 24-FS-040',
    dark: true,
  },
];
