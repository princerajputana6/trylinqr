import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Show tickets either assigned to this organizer OR raised by them
    const base = {
      $or: [
        { assignedRole: 'admin', assignedTo: auth.user.id },
        { customer: auth.user.id },
      ],
    };
    const filter = status ? { ...base, status } : base;

    const tickets = await SupportTicket.find(filter)
      .populate('customer', 'name email avatar')
      .populate('relatedEvent', 'title slug')
      .populate('relatedBooking', 'bookingCode')
      .sort({ updatedAt: -1 })
      .lean();

    const counts = {
      open: await SupportTicket.countDocuments({ ...base, status: 'open' }),
      in_progress: await SupportTicket.countDocuments({
        ...base,
        status: 'in_progress',
      }),
      resolved: await SupportTicket.countDocuments({
        ...base,
        status: 'resolved',
      }),
    };

    return ok({ tickets, counts });
  } catch (e) {
    console.error(e);
    return fail('Failed to load tickets', 500);
  }
}
