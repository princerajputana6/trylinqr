import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

const ALLOWED = ['open', 'in_progress', 'resolved', 'closed'];

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { status } = await req.json();
    if (!ALLOWED.includes(status)) return fail('Invalid status');

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) return fail('Ticket not found', 404);

    const isCustomer = String(ticket.customer) === auth.user.id;
    const isAssignee =
      auth.user.role === 'admin' &&
      String(ticket.assignedTo) === auth.user.id &&
      ticket.assignedRole === 'admin';
    const isSuper = auth.user.role === 'superadmin';

    // permissions: customer can close their own (or reopen by replying); handler can resolve / reopen
    if (status === 'closed' && !(isCustomer || isSuper)) {
      return fail('forbidden', 403);
    }
    if (
      (status === 'resolved' || status === 'in_progress' || status === 'open') &&
      !(isAssignee || isSuper)
    ) {
      return fail('forbidden', 403);
    }

    ticket.status = status;
    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = auth.user.id;
      const customer = await User.findById(ticket.customer).select('email name');
      if (customer?.email) {
        await sendMail({ to: customer.email, ...emails.supportResolved(ticket) });
      }
      await notify(
        ticket.customer,
        'general',
        `Ticket ${ticket.ticketCode} marked as resolved`,
        `/support/${ticket._id}`
      );
    }
    await ticket.save();

    return ok({ message: `Ticket ${status}` });
  } catch (e) {
    console.error(e);
    return fail('Failed to update ticket', 500);
  }
}
