import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { CATEGORIES } from '@/lib/constants';

export async function GET() {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const [events, bookings, users] = await Promise.all([
      Event.find().lean(),
      Booking.find({ paymentStatus: 'paid' }).lean(),
      User.find().lean(),
    ]);

    const totalRevenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
    const platformEarnings = bookings.reduce(
      (s, b) => s + (b.platformFee || 0),
      0
    );

    const byCategory = CATEGORIES.map((c) => ({
      name: c.label,
      value: events.filter((e) => e.category === c.slug).length,
    })).filter((c) => c.value > 0);

    return ok({
      stats: {
        totalUsers: users.length,
        customers: users.filter((u) => u.role === 'customer').length,
        admins: users.filter((u) => u.role === 'admin').length,
        pendingAdmins: users.filter(
          (u) => u.role === 'admin' && !u.isApproved
        ).length,
        totalEvents: events.length,
        publishedEvents: events.filter((e) => e.status === 'published').length,
        pendingEvents: events.filter((e) => e.status === 'pending').length,
        totalBookings: bookings.length,
        totalRevenue,
        platformEarnings,
      },
      eventsByCategory: byCategory,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to load stats', 500);
  }
}
