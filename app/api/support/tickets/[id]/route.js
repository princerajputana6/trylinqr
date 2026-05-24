import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

function canView(ticket, user) {
  if (user.role === 'superadmin') return true;
  if (String(ticket.customer?._id || ticket.customer) === user.id) {
    return { role: 'customer' };
  }
  if (
    user.role === 'admin' &&
    String(ticket.assignedTo) === user.id &&
    ticket.assignedRole === 'admin'
  ) {
    return { role: 'admin' };
  }
  return false;
}

export async function GET(req, { params }) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const ticket = await SupportTicket.findById(params.id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name orgName email')
      .populate('forwardedBy', 'name')
      .populate('relatedEvent', 'title slug organizer')
      .populate('relatedBooking', 'bookingCode totalAmount paymentStatus')
      .populate('messages.author', 'name avatar role')
      .lean();
    if (!ticket) return fail('Ticket not found', 404);

    const ok_ = canView(ticket, auth.user);
    if (!ok_) return fail('forbidden', 403);

    // mark read for current viewer
    const update = {};
    if (String(ticket.customer._id) === auth.user.id) update.customerUnread = 0;
    else update.handlerUnread = 0;
    await SupportTicket.updateOne({ _id: params.id }, update);

    return ok({ ticket });
  } catch (e) {
    console.error(e);
    return fail('Failed to load ticket', 500);
  }
}
