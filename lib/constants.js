import {
  Bike,
  Flame,
  PartyPopper,
  Mic2,
  Wrench,
  Trophy,
  Tent,
  Frame,
  UtensilsCrossed,
  Laugh,
  Briefcase,
  Plane,
  Sparkles,
} from 'lucide-react';

// Pantone 6-pastel rotation, mapped to natural category moods.
// Each color resolves to a deeper variant on the rendered tile so the icon
// stays legible against the soft tint.
export const CATEGORIES = [
  { slug: 'bike-ride',  label: 'Bike Rides',  icon: Bike,             color: '#f8c49c' }, // Bleached Apricot
  { slug: 'jagran',     label: 'Jagrans',     icon: Flame,            color: '#e9d88a' }, // Mellow Yellow
  { slug: 'function',   label: 'Functions',   icon: PartyPopper,      color: '#efb3c7' }, // Rose Shadow
  { slug: 'concert',    label: 'Concerts',    icon: Mic2,             color: '#d7a8cb' }, // Winsome Orchid
  { slug: 'workshop',   label: 'Workshops',   icon: Wrench,           color: '#a6c5dc' }, // Baby Blue
  { slug: 'sports',     label: 'Sports',      icon: Trophy,           color: '#c9ddb1' }, // White Jade
  { slug: 'festival',   label: 'Festivals',   icon: Tent,             color: '#efb3c7' }, // Rose Shadow
  { slug: 'exhibition', label: 'Exhibitions', icon: Frame,            color: '#a6c5dc' }, // Baby Blue
  { slug: 'food',       label: 'Food',        icon: UtensilsCrossed,  color: '#f8c49c' }, // Bleached Apricot
  { slug: 'comedy',     label: 'Comedy',      icon: Laugh,            color: '#e9d88a' }, // Mellow Yellow
  { slug: 'corporate',  label: 'Corporate',   icon: Briefcase,        color: '#d7a8cb' }, // Winsome Orchid
  { slug: 'travel',     label: 'Travel',      icon: Plane,            color: '#a6c5dc' }, // Baby Blue
  { slug: 'other',      label: 'Other',       icon: Sparkles,         color: '#c9ddb1' }, // White Jade
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

// Defaults for bike-ride organizers
export const RIDE_DOCUMENTS = ['RC', 'DL', 'Insurance', 'Pollution'];
export const RIDE_GEARS = [
  'Helmet',
  'Riding Jacket',
  'Gloves',
  'Knee Guards',
  'Elbow Guards',
  'Riding Boots',
];
export const RIDE_DIFFICULTY = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
  { value: 'expert', label: 'Expert' },
];

export const ROLES = ['superadmin', 'admin', 'customer'];

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[CATEGORIES.length - 1];
}
