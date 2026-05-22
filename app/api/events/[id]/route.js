import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

async function loadEvent(id) {
  // accepts mongo id or slug
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Event.findById(id).populate('organizer', 'name orgName avatar orgDescription');
  }
  return Event.findOne({ slug: id }).populate(
    'organizer',
    'name orgName avatar orgDescription'
  );
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const event = await loadEvent(params.id);
    if (!event) return fail('Event not found', 404);
    return ok({ event });
  } catch (e) {
    console.error(e);
    return fail('Failed to load event', 500);
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return fail('Event not found', 404);

    if (
      auth.user.role !== 'superadmin' &&
      String(event.organizer) !== auth.user.id
    ) {
      return fail('You can only edit your own events', 403);
    }

    const body = await req.json();
    const fields = [
      'title',
      'description',
      'category',
      'subCategory',
      'venue',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'bannerImage',
      'galleryImages',
      'promoVideo',
      'ticketTiers',
      'tags',
      'ageRestriction',
      'dressCode',
      'cancellationPolicy',
    ];
    for (const f of fields) {
      if (body[f] !== undefined) event[f] = body[f];
    }

    // status transitions
    if (body.status) {
      if (auth.user.role === 'superadmin') {
        event.status = body.status;
        if (body.status === 'published') {
          await notify(
            event.organizer,
            'event_approved',
            `Your event "${event.title}" is now live`,
            `/events/${event.slug}`
          );
        }
      } else {
        // admins can move between draft/pending/published(unpublish->draft) limited
        if (['draft', 'pending'].includes(body.status)) {
          event.status = body.status;
        } else if (body.status === 'cancelled') {
          event.status = 'cancelled';
        }
      }
    }
    if (body.isFeatured !== undefined && auth.user.role === 'superadmin') {
      event.isFeatured = body.isFeatured;
    }

    await event.save();
    return ok({ event });
  } catch (e) {
    console.error(e);
    return fail('Failed to update event', 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return fail('Event not found', 404);

    if (
      auth.user.role !== 'superadmin' &&
      String(event.organizer) !== auth.user.id
    ) {
      return fail('You can only delete your own events', 403);
    }

    // notify booked customers and refund-flag
    const bookings = await Booking.find({
      event: event._id,
      paymentStatus: 'paid',
    }).populate('customer', 'email name');

    event.status = 'cancelled';
    await event.save();

    for (const b of bookings) {
      if (b.customer?.email) {
        await sendMail({ to: b.customer.email, ...emails.eventCancelled(event) });
      }
      await notify(
        b.customer?._id || b.customer,
        'event_cancelled',
        `"${event.title}" was cancelled`,
        `/booking/${b._id}`
      );
    }

    return ok({ message: 'Event cancelled', notified: bookings.length });
  } catch (e) {
    console.error(e);
    return fail('Failed to delete event', 500);
  }
}
