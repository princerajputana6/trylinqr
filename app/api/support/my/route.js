import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const tickets = await SupportTicket.find({ customer: auth.user.id })
      .populate('relatedEvent', 'title slug')
      .populate('relatedBooking', 'bookingCode')
      .sort({ updatedAt: -1 })
      .lean();

    return ok({ tickets });
  } catch (e) {
    console.error(e);
    return fail('Failed to load tickets', 500);
  }
}
