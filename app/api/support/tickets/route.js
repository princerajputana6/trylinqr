import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

function ticketCode() {
  return 'TLQ-T-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail('Please log in to raise a ticket', auth.status);

    await connectDB();
    const body = await req.json();
    const { subject, message, category, priority, relatedBookingId } = body;
    if (!subject || !message) {
      return fail('Subject and message are required');
    }

    const isOrganizer = auth.user.role === 'admin';
    const isSuper = auth.user.role === 'superadmin';

    // Optional: link to a booking the customer owns
    let relatedBooking, relatedEvent, eventOrganizerId;
    if (relatedBookingId) {
      const b = await Booking.findById(relatedBookingId);
      if (b && String(b.customer) === auth.user.id) {
        relatedBooking = b._id;
        relatedEvent = b.event;
        const ev = await Event.findById(b.event).select('organizer');
        if (ev) eventOrganizerId = ev.organizer;
      }
    }

    // Routing:
    //  - Organizer raising → straight to superadmin queue
    //  - Customer with linked booking → route to that event's organizer
    //  - Customer with no booking link → superadmin
    let assignedRole = 'superadmin';
    let assignedTo;
    if (isOrganizer || isSuper) {
      assignedRole = 'superadmin';
    } else if (eventOrganizerId) {
      assignedRole = 'admin';
      assignedTo = eventOrganizerId;
    }

    const ticket = await SupportTicket.create({
      ticketCode: ticketCode(),
      subject: subject.slice(0, 140),
      category: category || 'general',
      priority: priority || 'normal',
      customer: auth.user.id,
      relatedBooking,
      relatedEvent,
      assignedRole,
      assignedTo,
      assignedAt: new Date(),
      status: 'open',
      messages: [
        {
          author: auth.user.id,
          role: isOrganizer ? 'admin' : isSuper ? 'superadmin' : 'customer',
          body: message,
        },
      ],
      handlerUnread: 1,
      customerUnread: 0,
    });

    // Confirmation to the raiser
    if (auth.user.email) {
      await sendMail({
        to: auth.user.email,
        ...emails.supportTicketReceived(ticket),
      });
    }
    await notify(
      auth.user.id,
      'general',
      `Ticket ${ticket.ticketCode} received.`,
      `/support/${ticket._id}`
    );

    // Notify the handler(s)
    if (assignedRole === 'admin' && assignedTo) {
      const handler = await User.findById(assignedTo).select('_id email name orgName');
      if (handler?.email) {
        await sendMail({
          to: handler.email,
          ...emails.supportNewForHandler(ticket, auth.user.name),
        });
      }
      await notify(
        handler._id,
        'general',
        `New ticket ${ticket.ticketCode}: ${ticket.subject}`,
        `/dashboard/support/${ticket._id}`
      );
    } else {
      const supers = await User.find({ role: 'superadmin' })
        .select('_id email')
        .lean();
      for (const sa of supers) {
        await notify(
          sa._id,
          'general',
          `New ${isOrganizer ? 'organizer' : 'customer'} ticket ${ticket.ticketCode}: ${ticket.subject}`,
          `/superadmin/support/${ticket._id}`
        );
        if (sa.email) {
          await sendMail({
            to: sa.email,
            ...emails.supportNewForHandler(ticket, auth.user.name),
          });
        }
      }
    }

    return ok({ ticket }, 201);
  } catch (e) {
    console.error(e);
    return fail('Failed to create ticket', 500);
  }
}
