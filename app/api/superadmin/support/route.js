import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = {};
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name orgName')
      .populate('relatedEvent', 'title slug')
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    const counts = {
      open: await SupportTicket.countDocuments({ status: 'open' }),
      in_progress: await SupportTicket.countDocuments({ status: 'in_progress' }),
      resolved: await SupportTicket.countDocuments({ status: 'resolved' }),
      closed: await SupportTicket.countDocuments({ status: 'closed' }),
    };

    return ok({ tickets, counts });
  } catch (e) {
    console.error(e);
    return fail('Failed to load tickets', 500);
  }
}
