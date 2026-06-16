import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// Public, cross-origin feed consumed by /widget.js running on an organizer's
// own website. Returns only PUBLISHED events the organizer explicitly opted
// in to ("Show on my website") — never drafts, never other organizers' events.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  // Short cache so newly-published events appear within a minute without
  // hammering the DB from every page view on the organizer's site.
  'Cache-Control': 'public, max-age=60, s-maxage=60',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const org = searchParams.get('org');
    const limit = Math.min(
      24,
      Math.max(1, parseInt(searchParams.get('limit') || '6', 10)),
    );

    if (!org || !mongoose.Types.ObjectId.isValid(org)) {
      return json({ ok: false, error: 'A valid org id is required' }, 400);
    }

    await connectDB();

    let events = await Event.find({
      organizer: org,
      status: 'published',
      showOnOrgSite: true,
    })
      .populate('organizer', 'isApproved isBanned')
      .sort({ startDate: 1 })
      .limit(limit)
      .lean();

    // Mirror the public-feed verification gate.
    events = events.filter(
      (e) =>
        e.organizer &&
        e.organizer.isApproved !== false &&
        e.organizer.isBanned !== true,
    );

    const out = events.map((e) => ({
      id: String(e._id),
      slug: e.slug,
      title: e.title,
      category: e.category,
      startDate: e.startDate,
      endDate: e.endDate,
      startTime: e.startTime || '',
      endTime: e.endTime || '',
      bannerImage: e.bannerImage || '',
      venue: {
        name: e.venue?.name || '',
        city: e.venue?.city || '',
      },
      minPrice: e.ticketTiers?.length
        ? Math.min(...e.ticketTiers.map((t) => t.price || 0))
        : 0,
    }));

    return json({ ok: true, events: out });
  } catch (e) {
    console.error('embed feed failed', e);
    return json({ ok: false, error: 'Failed to load events' }, 500);
  }
}
