import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const bookings = await Booking.find({ customer: auth.user.id })
      .populate('event', 'title slug bannerImage startDate venue status')
      .sort({ createdAt: -1 })
      .lean();

    return ok({ bookings });
  } catch (e) {
    console.error(e);
    return fail('Failed to load bookings', 500);
  }
}
