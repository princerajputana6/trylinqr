import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import Event from '@/models/Event';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

// Superadmin forwards a ticket to a specific organizer (or back to superadmin)
export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { organizerId, reason, takeBack } = await req.json();

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) return fail('Ticket not found', 404);

    if (takeBack) {
      ticket.assignedRole = 'superadmin';
      ticket.assignedTo = undefined;
      ticket.forwardedBy = auth.user.id;
      ticket.forwardedReason = reason || 'Taken back by platform team';
      ticket.handlerUnread = 1;
      ticket.messages.push({
        author: auth.user.id,
        role: 'system',
        body: `Ticket reassigned to platform team. ${reason || ''}`.trim(),
      });
      await ticket.save();
      return ok({ message: 'Ticket reassigned to platform team' });
    }

    if (!organizerId) return fail('Pick an organizer to forward to');

    const organizer = await User.findById(organizerId).select(
      'name email role isApproved orgName'
    );
    if (!organizer || organizer.role !== 'admin' || !organizer.isApproved) {
      return fail('Selected user is not an approved organizer');
    }

    ticket.assignedRole = 'admin';
    ticket.assignedTo = organizer._id;
    ticket.forwardedBy = auth.user.id;
    ticket.forwardedReason = reason || '';
    ticket.handlerUnread = 1;
    ticket.messages.push({
      author: auth.user.id,
      role: 'system',
      body: `Ticket forwarded to ${organizer.orgName || organizer.name}.${
        reason ? ' Note: ' + reason : ''
      }`,
    });
    await ticket.save();

    if (organizer.email) {
      await sendMail({
        to: organizer.email,
        ...emails.supportForwarded(
          ticket,
          organizer.orgName || organizer.name,
          reason
        ),
      });
    }
    await notify(
      organizer._id,
      'general',
      `Ticket ${ticket.ticketCode} forwarded to you`,
      `/dashboard/support/${ticket._id}`
    );
    await notify(
      ticket.customer,
      'general',
      `Your ticket ${ticket.ticketCode} was routed to the event organizer`,
      `/support/${ticket._id}`
    );

    return ok({ message: 'Ticket forwarded' });
  } catch (e) {
    console.error(e);
    return fail('Failed to forward ticket', 500);
  }
}
