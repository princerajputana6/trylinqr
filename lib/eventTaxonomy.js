/*
 * Curated sub-category suggestions per category + a lightweight client-side
 * tag suggester that combines title / description keywords with category
 * domain words. Used by the EventForm.
 */

export const SUB_CATEGORIES = {
  'bike-ride': [
    'Sunrise Ride',
    'Breakfast Ride',
    'Weekend Escape',
    'Multi-day Tour',
    'Track Day',
    'Charity Ride',
    'Cafe Run',
    'Sunset Cruise',
  ],
  jagran: [
    'Mata Jagran',
    'Bhajan Sandhya',
    'Sufi Night',
    'Devotional Concert',
    'Kirtan',
    'Akhand Path',
  ],
  function: [
    'Engagement',
    'Birthday',
    'Anniversary',
    'Mehndi',
    'Reception',
    'Sangeet',
    'Baby Shower',
    'Retirement',
  ],
  concert: [
    'Indie',
    'Hip-hop',
    'Rock',
    'EDM',
    'Classical',
    'Acoustic',
    'Tribute',
    'Singer-songwriter',
    'Jazz',
    'Folk',
  ],
  workshop: [
    'Photography',
    'Pottery',
    'Coding',
    'Coffee',
    'Painting',
    'Yoga',
    'Cooking',
    'Writing',
    'Calligraphy',
    'Public Speaking',
  ],
  sports: [
    'Marathon',
    'Football',
    'Cricket',
    'Pickleball',
    'Cycling',
    'Tournament',
    'Badminton',
    'Hike',
    'Trek',
  ],
  festival: [
    'Cultural',
    'Food',
    'Arts',
    'Music',
    'Film',
    'Literature',
    'Heritage',
  ],
  exhibition: [
    'Art',
    'Design',
    'Photography',
    'Sculpture',
    'Tech',
    'Auto',
    'Craft',
  ],
  food: [
    'Supper Club',
    'Brewery Night',
    'Food Trail',
    'Pop-up',
    'Tasting Menu',
    'Wine Pairing',
    'Cooking Class',
  ],
  comedy: [
    'Stand-up',
    'Open Mic',
    'Improv',
    'Sketch',
    'Headliner',
    'Roast',
  ],
  corporate: [
    'Conference',
    'Off-site',
    'Networking',
    'Launch',
    'Summit',
    'Hackathon',
  ],
  other: [],
};

const STOP = new Set(
  'a an and the of to in on at is are was were be been being for from with by as that this these those it its their our your you we i my mine yours so very much will would can could may might shall should into onto about over under near up down out off out also more most less few some any all just only such no not nor only own same than then there here who what when where why how if while because before after during through within without ride event events night day evening morning weekend live join us our we get tickets book now featured spotlight'
    .split(/\s+/)
);

const CATEGORY_KEYWORDS = {
  'bike-ride': [
    'ride',
    'rider',
    'motorcycle',
    'bike',
    'helmet',
    'highway',
    'sunrise',
    'cruise',
    'tour',
  ],
  jagran: ['jagran', 'bhajan', 'sufi', 'devotional', 'mata', 'community'],
  function: ['celebration', 'party', 'family', 'gathering'],
  concert: ['concert', 'live', 'music', 'gig', 'show', 'artist', 'stage'],
  workshop: ['workshop', 'class', 'learn', 'beginner', 'hands-on', 'pro'],
  sports: ['sports', 'fitness', 'race', 'tournament', 'match', 'play'],
  festival: ['festival', 'fest', 'lineup', 'pass', 'weekend', 'open-air'],
  exhibition: ['exhibition', 'gallery', 'art', 'curated', 'preview'],
  food: ['food', 'chef', 'dining', 'menu', 'cuisine', 'drinks'],
  comedy: ['comedy', 'standup', 'humor', 'comic', 'mic'],
  corporate: ['corporate', 'business', 'leadership', 'team', 'enterprise'],
  other: ['curated', 'unique'],
};

export function suggestTags({ title = '', description = '', category, city }) {
  const blob = `${title} ${description}`.toLowerCase();
  const tokens = blob
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3 && !STOP.has(t));

  // count frequency
  const freq = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;

  // pick top by frequency
  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)
    .slice(0, 6);

  // add category keywords (whichever appear in blob)
  const catWords = (CATEGORY_KEYWORDS[category] || []).filter((w) =>
    blob.includes(w)
  );

  // include city as a tag (helps discovery)
  const cityTag = city ? city.toLowerCase().replace(/\s+/g, '-') : null;

  const all = Array.from(
    new Set(
      [...catWords, ...top, cityTag, category]
        .filter(Boolean)
        .map((t) => t.replace(/[^a-z0-9-]/g, ''))
    )
  ).filter((t) => t.length >= 3);

  return all.slice(0, 8);
}
