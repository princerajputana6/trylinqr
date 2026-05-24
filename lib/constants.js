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
  Sparkles,
} from 'lucide-react';

export const CATEGORIES = [
  { slug: 'bike-ride', label: 'Bike Rides', icon: Bike, color: '#f97316' },
  { slug: 'jagran', label: 'Jagrans', icon: Flame, color: '#eab308' },
  { slug: 'function', label: 'Functions', icon: PartyPopper, color: '#ec4899' },
  { slug: 'concert', label: 'Concerts', icon: Mic2, color: '#8b5cf6' },
  { slug: 'workshop', label: 'Workshops', icon: Wrench, color: '#06b6d4' },
  { slug: 'sports', label: 'Sports', icon: Trophy, color: '#22c55e' },
  { slug: 'festival', label: 'Festivals', icon: Tent, color: '#710014' },
  { slug: 'exhibition', label: 'Exhibitions', icon: Frame, color: '#3b82f6' },
  { slug: 'food', label: 'Food', icon: UtensilsCrossed, color: '#b38f6f' },
  { slug: 'comedy', label: 'Comedy', icon: Laugh, color: '#a855f7' },
  { slug: 'corporate', label: 'Corporate', icon: Briefcase, color: '#64748b' },
  { slug: 'other', label: 'Other', icon: Sparkles, color: '#94a3b8' },
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
