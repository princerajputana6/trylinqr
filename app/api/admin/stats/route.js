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
    const events = await Event.find({ organizer: auth.user.id }).lean();
    const ids = events.map((e) => e._id);
    const bookings = await Booking.find({
      event: { $in: ids },
      paymentStatus: 'paid',
    })
      .populate('event', 'title')
      .lean();

    const totalRevenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
    const totalFees = bookings.reduce((s, b) => s + (b.platformFee || 0), 0);
    const totalTickets = bookings.reduce((s, b) => s + b.quantity, 0);
    const totalViews = events.reduce((s, e) => s + (e.totalViews || 0), 0);

    // revenue per event for chart
    const revenueByEvent = {};
    for (const b of bookings) {
      const t = b.event?.title || 'Unknown';
      revenueByEvent[t] = (revenueByEvent[t] || 0) + b.totalAmount;
    }

    // bookings over last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = bookings.filter(
        (b) => new Date(b.createdAt) >= d && new Date(b.createdAt) < next
      ).length;
      days.push({
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        bookings: count,
      });
    }

    return ok({
      stats: {
        totalEvents: events.length,
        publishedEvents: events.filter((e) => e.status === 'published').length,
        totalBookings: bookings.length,
        totalTickets,
        totalRevenue,
        netRevenue: totalRevenue - totalFees,
        totalViews,
      },
      revenueByEvent: Object.entries(revenueByEvent).map(([name, revenue]) => ({
        name,
        revenue,
      })),
      bookingsTrend: days,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to load stats', 500);
  }
}
