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
      'rideDetails',
    ];
    for (const f of fields) {
      if (body[f] !== undefined) event[f] = body[f];
    }

    // Status transitions — organizers manage their own publish state now.
    // (Previously only superadmin could move an event to 'published'.)
    if (body.status) {
      const allowed = ['draft', 'published', 'cancelled', 'completed'];
      if (allowed.includes(body.status)) {
        const wasPublished = event.status === 'published';
        event.status = body.status;
        if (!wasPublished && body.status === 'published') {
          await notify(
            event.organizer,
            'event_approved',
            `Your event "${event.title}" is now live`,
            `/events/${event.slug}`
          );
        }
      }
    }
    // Organizers can mark/unmark their own events as featured (hero slider).
    if (body.isFeatured !== undefined) {
      event.isFeatured = !!body.isFeatured;
    }
    // Auto-embed flag — controls whether the event flows into the
    // organizer's website widget (/widget.js + /api/embed/events).
    if (body.showOnOrgSite !== undefined) {
      event.showOnOrgSite = !!body.showOnOrgSite;
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

    const paidBookings = await Booking.find({
      event: event._id,
      paymentStatus: 'paid',
    }).populate('customer', 'email name');

    // If there are PAID bookings we can't hard-delete — bookings would
    // be orphaned and refunds need an audit trail. Cancel + notify +
    // refund-flag instead, and surface that in the response so the UI
    // can show a different message.
    if (paidBookings.length > 0) {
      event.status = 'cancelled';
      await event.save();

      for (const b of paidBookings) {
        if (b.customer?.email) {
          await sendMail({
            to: b.customer.email,
            ...emails.eventCancelled(event),
          });
        }
        await notify(
          b.customer?._id || b.customer,
          'event_cancelled',
          `"${event.title}" was cancelled`,
          `/booking/${b._id}`,
        );
      }
      return ok({
        message: `Event cancelled — ${paidBookings.length} booked customer${paidBookings.length > 1 ? 's' : ''} notified and refunded.`,
        deleted: false,
        cancelled: true,
        notified: paidBookings.length,
      });
    }

    // No paid bookings → actually remove the document so the list
    // doesn't keep showing it. Also clean up any free/cancelled
    // bookings so they don't dangle.
    await Booking.deleteMany({ event: event._id });
    await Event.deleteOne({ _id: event._id });

    return ok({
      message: 'Event deleted',
      deleted: true,
      cancelled: false,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to delete event', 500);
  }
}
