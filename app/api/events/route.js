import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { uniqueSlug } from '@/lib/utils';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const query = { status: 'published' };
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('q');
    const price = searchParams.get('price'); // free | paid
    const featured = searchParams.get('featured');
    const organizer = searchParams.get('organizer');
    const sort = searchParams.get('sort') || 'date';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(48, parseInt(searchParams.get('limit') || '12', 10));

    if (category) query.category = category;
    if (city) query['venue.city'] = city;
    if (featured === 'true') query.isFeatured = true;
    if (organizer) query.organizer = organizer;
    if (search) query.$text = { $search: search };

    let events = await Event.find(query)
      .populate('organizer', 'name orgName avatar')
      .lean();

    if (price === 'free') {
      events = events.filter((e) =>
        (e.ticketTiers || []).every((t) => t.price === 0)
      );
    } else if (price === 'paid') {
      events = events.filter((e) =>
        (e.ticketTiers || []).some((t) => t.price > 0)
      );
    }

    const minPriceOf = (e) =>
      e.ticketTiers?.length ? Math.min(...e.ticketTiers.map((t) => t.price)) : 0;

    if (sort === 'price-low') events.sort((a, b) => minPriceOf(a) - minPriceOf(b));
    else if (sort === 'price-high')
      events.sort((a, b) => minPriceOf(b) - minPriceOf(a));
    else if (sort === 'popular')
      events.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    else
      events.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );

    const total = events.length;
    const paged = events.slice((page - 1) * limit, page * limit);

    return ok({
      events: paged.map((e) => ({ ...e, minPrice: minPriceOf(e) })),
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to load events', 500);
  }
}

export async function POST(req) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const body = await req.json();
    if (!body.title || !body.category || !body.startDate) {
      return fail('Title, category and start date are required');
    }
    if (!body.ticketTiers?.length) {
      return fail('Add at least one ticket tier');
    }

    // No more "pending superadmin approval" — organizers publish themselves.
    const event = await Event.create({
      ...body,
      slug: uniqueSlug(body.title),
      organizer: auth.user.id,
      status: body.publish ? 'published' : 'draft',
    });

    return ok({ event }, 201);
  } catch (e) {
    console.error(e);
    return fail('Failed to create event', 500);
  }
}
