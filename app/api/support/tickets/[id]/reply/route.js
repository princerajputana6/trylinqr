import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

export async function POST(req, { params }) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { body } = await req.json();
    if (!body?.trim()) return fail('Message body required');

    const ticket = await SupportTicket.findById(params.id);
    if (!ticket) return fail('Ticket not found', 404);

    // permission: customer (owner), assignee, or superadmin
    let role;
    if (String(ticket.customer) === auth.user.id) role = 'customer';
    else if (auth.user.role === 'superadmin') role = 'superadmin';
    else if (
      auth.user.role === 'admin' &&
      String(ticket.assignedTo) === auth.user.id &&
      ticket.assignedRole === 'admin'
    )
      role = 'admin';
    else return fail('forbidden', 403);

    ticket.messages.push({
      author: auth.user.id,
      role,
      body: body.trim(),
    });

    // status transitions: any handler reply → in_progress; closed → reopen via separate route
    if (ticket.status === 'open' && role !== 'customer') {
      ticket.status = 'in_progress';
    }
    if (role === 'customer' && ticket.status === 'resolved') {
      ticket.status = 'in_progress';
    }

    if (role === 'customer') {
      ticket.handlerUnread = (ticket.handlerUnread || 0) + 1;
    } else {
      ticket.customerUnread = (ticket.customerUnread || 0) + 1;
    }

    await ticket.save();

    // notify the other side
    const customer = await User.findById(ticket.customer).select('name email');
    if (role === 'customer') {
      // notify assignee or superadmins
      if (ticket.assignedRole === 'admin' && ticket.assignedTo) {
        const handler = await User.findById(ticket.assignedTo).select('name email');
        if (handler?.email) {
          await sendMail({ to: handler.email, ...emails.supportReply(ticket, 'customer') });
        }
        await notify(
          ticket.assignedTo,
          'general',
          `New reply on ${ticket.ticketCode}`,
          `/dashboard/support/${ticket._id}`
        );
      } else {
        const supers = await User.find({ role: 'superadmin' }).select('email _id');
        for (const sa of supers) {
          if (sa.email) {
            await sendMail({ to: sa.email, ...emails.supportReply(ticket, 'customer') });
          }
          await notify(
            sa._id,
            'general',
            `New reply on ${ticket.ticketCode}`,
            `/superadmin/support/${ticket._id}`
          );
        }
      }
    } else {
      if (customer?.email) {
        await sendMail({ to: customer.email, ...emails.supportReply(ticket, role) });
      }
      await notify(
        ticket.customer,
        'general',
        `New reply on your ticket ${ticket.ticketCode}`,
        `/support/${ticket._id}`
      );
    }

    return ok({ message: 'Reply posted' });
  } catch (e) {
    console.error(e);
    return fail('Failed to post reply', 500);
  }
}
