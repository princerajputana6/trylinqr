import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

export async function GET(req, { params }) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const booking = await Booking.findById(params.id)
      .populate('event')
      .populate('customer', 'name email phone')
      .lean();
    if (!booking) return fail('Booking not found', 404);

    const isOwner = String(booking.customer._id) === auth.user.id;
    const isOrganizer =
      booking.event && String(booking.event.organizer) === auth.user.id;
    if (!isOwner && !isOrganizer && auth.user.role !== 'superadmin') {
      return fail('forbidden', 403);
    }

    return ok({ booking });
  } catch (e) {
    console.error(e);
    return fail('Failed to load booking', 500);
  }
}

// Cancel a booking
export async function DELETE(req, { params }) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail('Booking not found', 404);
    if (
      String(booking.customer) !== auth.user.id &&
      auth.user.role !== 'superadmin'
    ) {
      return fail('forbidden', 403);
    }
    if (booking.checkedIn) return fail('Cannot cancel — already checked in');
    if (booking.paymentStatus === 'refunded')
      return fail('Booking already cancelled');

    const event = await Event.findById(booking.event);
    if (event && new Date(event.startDate) < new Date()) {
      return fail('Cannot cancel — event has already started');
    }

    let body = {};
    try {
      body = await req.json();
    } catch {}

    // release inventory
    if (event) {
      const tier = event.ticketTiers.id(booking.ticketTier.tierId);
      if (tier) {
        tier.soldQuantity = Math.max(0, tier.soldQuantity - booking.quantity);
        await event.save();
      }
    }

    booking.paymentStatus =
      booking.totalAmount > 0 ? 'refunded' : booking.paymentStatus;
    booking.cancellationReason = body.reason || 'Cancelled by customer';
    await booking.save();

    const customer = await User.findById(booking.customer);
    if (customer?.email && event) {
      await sendMail({
        to: customer.email,
        ...emails.bookingCancelled(booking, event),
      });
    }
    await notify(
      booking.customer,
      'booking_cancelled',
      `Booking ${booking.bookingCode} cancelled`,
      `/my-bookings`
    );

    return ok({ message: 'Booking cancelled' });
  } catch (e) {
    console.error(e);
    return fail('Failed to cancel booking', 500);
  }
}
