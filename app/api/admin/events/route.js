import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const events = await Event.find({ organizer: auth.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const ids = events.map((e) => e._id);
    const bookings = await Booking.find({
      event: { $in: ids },
      paymentStatus: 'paid',
    }).lean();

    const byEvent = {};
    for (const b of bookings) {
      const k = String(b.event);
      byEvent[k] = byEvent[k] || { count: 0, revenue: 0, tickets: 0 };
      byEvent[k].count += 1;
      byEvent[k].tickets += b.quantity;
      byEvent[k].revenue += b.totalAmount;
    }

    return ok({
      events: events.map((e) => ({
        ...e,
        stats: byEvent[String(e._id)] || { count: 0, revenue: 0, tickets: 0 },
      })),
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to load events', 500);
  }
}
