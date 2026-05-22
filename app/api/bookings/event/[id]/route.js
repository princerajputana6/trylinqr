import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req, { params }) {
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
      return fail('forbidden', 403);
    }

    const bookings = await Booking.find({ event: params.id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return ok({ bookings, event: { title: event.title, _id: event._id } });
  } catch (e) {
    console.error(e);
    return fail('Failed to load bookings', 500);
  }
}
