export const CATEGORIES = [
  { slug: 'bike-ride', label: 'Bike Rides', emoji: '🏍️', color: '#f97316' },
  { slug: 'jagran', label: 'Jagrans', emoji: '🪔', color: '#eab308' },
  { slug: 'function', label: 'Functions', emoji: '🎊', color: '#ec4899' },
  { slug: 'concert', label: 'Concerts', emoji: '🎤', color: '#8b5cf6' },
  { slug: 'workshop', label: 'Workshops', emoji: '🛠️', color: '#06b6d4' },
  { slug: 'sports', label: 'Sports', emoji: '⚽', color: '#22c55e' },
  { slug: 'festival', label: 'Festivals', emoji: '🎪', color: '#e63e62' },
  { slug: 'exhibition', label: 'Exhibitions', emoji: '🖼️', color: '#3b82f6' },
  { slug: 'food', label: 'Food', emoji: '🍔', color: '#f59e0b' },
  { slug: 'comedy', label: 'Comedy', emoji: '😂', color: '#a855f7' },
  { slug: 'corporate', label: 'Corporate', emoji: '💼', color: '#64748b' },
  { slug: 'other', label: 'Other', emoji: '✨', color: '#94a3b8' },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export const CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Ahmedabad',
  'Chandigarh',
  'Lucknow',
  'Goa',
];

export const EVENT_STATUS = ['draft', 'pending', 'published', 'cancelled', 'completed'];

export const ROLES = ['superadmin', 'admin', 'customer'];

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[CATEGORIES.length - 1];
}
