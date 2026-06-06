// Paid promotion catalogue — single source of truth for prices and labels.
// Shared between the API (amount validation) and the EventForm UI.

export const PROMOTIONS = [
  {
    type: 'hero',
    label: 'Homepage hero slider',
    description: 'Featured in the rotating hero carousel at the top of TryLinqr.',
    price: 399,
    eventField: 'isFeatured',
  },
  {
    type: 'list',
    label: 'Featured Events list',
    description: 'Surface inside the auto-sliding Featured Events row.',
    price: 699,
    eventField: 'inFeaturedList',
  },
  {
    type: 'spotlight',
    label: 'Spotlight carousel',
    description: 'Big poster slot in the SPOTLIGHT section of the homepage.',
    price: 999,
    eventField: 'inSpotlight',
  },
  {
    type: 'trending',
    label: 'Trending Now row',
    description: 'Pinned into the Trending Now row regardless of view count.',
    price: 199,
    eventField: 'inTrending',
  },
];

export const PROMO_BY_TYPE = Object.fromEntries(
  PROMOTIONS.map((p) => [p.type, p]),
);

export function calcPromoTotal(types = []) {
  return types
    .filter((t) => PROMO_BY_TYPE[t])
    .reduce((sum, t) => sum + PROMO_BY_TYPE[t].price, 0);
}
