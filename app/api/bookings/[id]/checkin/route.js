import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail('Booking not found', 404);

    const event = await Event.findById(booking.event);
    if (
      auth.user.role !== 'superadmin' &&
      String(event.organizer) !== auth.user.id
    ) {
      return fail('You can only check in your own event bookings', 403);
    }
    if (booking.paymentStatus !== 'paid')
      return fail('Booking is not paid / confirmed');
    if (booking.checkedIn) return fail('Already checked in');

    booking.checkedIn = true;
    booking.checkedInAt = new Date();
    await booking.save();

    return ok({ message: 'Checked in', booking });
  } catch (e) {
    console.error(e);
    return fail('Check-in failed', 500);
  }
}
