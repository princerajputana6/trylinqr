import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Review from '@/models/Review';
import User from '@/models/User';
import Blog from '@/models/Blog';

function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

function minPriceOf(e) {
  return e.ticketTiers?.length
    ? Math.min(...e.ticketTiers.map((t) => t.price))
    : 0;
}

/**
 * Public feeds should ONLY surface events from approved + non-banned
 * organizers. Self-registered organizers can publish, but their events
 * stay private until the platform team approves the account.
 */
function isVisible(e) {
  const o = e.organizer;
  if (!o) return false;
  if (o.isBanned) return false;
  if (o.isApproved === false) return false;
  // Hide events that have already ended
  const now = new Date();
  const endDate = e.endDate ? new Date(e.endDate) : null;
  const startDate = e.startDate ? new Date(e.startDate) : null;
  if (endDate && endDate < now) return false;
  if (!endDate && startDate && startDate < now) return false;
  return true;
}

const ORG_FIELDS = 'name orgName avatar isApproved isBanned';

export async function getFeaturedEvents(limit = 8) {
  await connectDB();
  // Hero slider = paid 'hero' placement (stored as isFeatured) OR
  // legacy isFeatured. Fall back to recent-by-views if nothing's been
  // promoted yet so the slider doesn't look empty.
  let events = await Event.find({ status: 'published', isFeatured: true })
    .populate('organizer', ORG_FIELDS)
    .sort({ startDate: 1 })
    .limit(limit * 2)
    .lean();
  events = events.filter(isVisible);
  if (events.length < 4) {
    const extra = await Event.find({ status: 'published' })
      .populate('organizer', ORG_FIELDS)
      .sort({ totalViews: -1 })
      .limit(limit * 2)
      .lean();
    const seen = new Set(events.map((e) => String(e._id)));
    for (const e of extra.filter(isVisible)) {
      if (!seen.has(String(e._id))) events.push(e);
    }
  }
  events = events.slice(0, limit);
  return serialize(events.map((e) => ({ ...e, minPrice: minPriceOf(e) })));
}

/**
 * Spotlight = paid 'spotlight' placement only. Falls back to featured/
 * trending if none paid (the SpotlightCarousel handles the merge).
 */
export async function getSpotlightEvents(limit = 6) {
  await connectDB();
  const events = await Event.find({
    status: 'published',
    inSpotlight: true,
  })
    .populate('organizer', ORG_FIELDS)
    .sort({ startDate: 1 })
    .limit(limit * 2)
    .lean();
  return serialize(
    events.filter(isVisible).slice(0, limit).map((e) => ({ ...e, minPrice: minPriceOf(e) })),
  );
}

/**
 * Paid 'list' placements — surfaced first in the Featured Upcoming row.
 */
export async function getFeaturedListEvents(limit = 8) {
  await connectDB();
  const events = await Event.find({
    status: 'published',
    inFeaturedList: true,
  })
    .populate('organizer', ORG_FIELDS)
    .sort({ startDate: 1 })
    .limit(limit * 2)
    .lean();
  return serialize(
    events.filter(isVisible).slice(0, limit).map((e) => ({ ...e, minPrice: minPriceOf(e) })),
  );
}

export async function getWeekendEvents(limit = 8) {
  await connectDB();
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  const events = await Event.find({
    status: 'published',
    startDate: { $gte: now, $lte: end },
  })
    .populate('organizer', ORG_FIELDS)
    .sort({ startDate: 1 })
    .limit(limit * 2)
    .lean();
  return serialize(
    events.filter(isVisible).slice(0, limit).map((e) => ({ ...e, minPrice: minPriceOf(e) })),
  );
}

export async function getRecentEvents(limit = 6) {
  await connectDB();
  const events = await Event.find({ status: 'published' })
    .populate('organizer', ORG_FIELDS)
    .sort({ createdAt: -1 })
    .limit(limit * 2)
    .lean();
  return serialize(
    events.filter(isVisible).slice(0, limit).map((e) => ({ ...e, minPrice: minPriceOf(e) })),
  );
}

export async function getTrendingEvents(limit = 8) {
  await connectDB();
  // Paid trending placements rank first, then organic by view count.
  const events = await Event.find({ status: 'published' })
    .populate('organizer', ORG_FIELDS)
    .sort({ inTrending: -1, totalViews: -1, createdAt: -1 })
    .limit(limit * 2)
    .lean();
  return serialize(
    events.filter(isVisible).slice(0, limit).map((e) => ({ ...e, minPrice: minPriceOf(e) })),
  );
}

export async function getEventBySlug(slug) {
  await connectDB();
  const event = await Event.findOne({ slug })
    .populate('organizer', 'name orgName avatar orgDescription')
    .lean();
  if (!event) return null;
  return serialize({ ...event, minPrice: minPriceOf(event) });
}

export async function getRelatedEvents(event, limit = 4) {
  await connectDB();
  const events = await Event.find({
    status: 'published',
    category: event.category,
    _id: { $ne: event._id },
  })
    .populate('organizer', 'name orgName')
    .limit(limit)
    .lean();
  return serialize(events.map((e) => ({ ...e, minPrice: minPriceOf(e) })));
}

export async function getEventReviews(eventId) {
  await connectDB();
  const reviews = await Review.find({ event: eventId, isApproved: true })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();
  return serialize(reviews);
}

export async function getCategoryEvents(category) {
  await connectDB();
  const events = await Event.find({ status: 'published', category })
    .populate('organizer', 'name orgName')
    .sort({ startDate: 1 })
    .lean();
  return serialize(events.map((e) => ({ ...e, minPrice: minPriceOf(e) })));
}

export async function getCityEvents(city) {
  await connectDB();
  const events = await Event.find({
    status: 'published',
    'venue.city': new RegExp(`^${city}$`, 'i'),
  })
    .populate('organizer', 'name orgName')
    .sort({ startDate: 1 })
    .lean();
  return serialize(events.map((e) => ({ ...e, minPrice: minPriceOf(e) })));
}

export async function getPopularOrganizers(limit = 6) {
  await connectDB();
  const events = await Event.find({ status: 'published' })
    .populate('organizer', 'name orgName avatar orgDescription')
    .select('organizer category totalViews')
    .lean();

  const byOrg = new Map();
  for (const e of events) {
    if (!e.organizer) continue;
    const id = String(e.organizer._id);
    const cur =
      byOrg.get(id) ||
      { ...e.organizer, _id: id, eventCount: 0, totalViews: 0, categories: new Set() };
    cur.eventCount += 1;
    cur.totalViews += e.totalViews || 0;
    cur.categories.add(e.category);
    byOrg.set(id, cur);
  }
  return Array.from(byOrg.values())
    .map((o) => ({ ...o, categories: Array.from(o.categories) }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, limit);
}

export async function getPlatformCounts() {
  await connectDB();
  const [events, organizers, distinctCities, distinctCategories, blogs] =
    await Promise.all([
      Event.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'admin', isApproved: true }),
      Event.distinct('venue.city', { status: 'published' }),
      Event.distinct('category', { status: 'published' }),
      Blog.countDocuments({ status: 'published' }),
    ]);
  const cities = (distinctCities || []).filter(Boolean).length;
  const categories = (distinctCategories || []).filter(Boolean).length;
  return { events, organizers, cities, categories, blogs };
}
