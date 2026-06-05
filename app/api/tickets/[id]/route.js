// Public ticket-scan endpoint.
//
//   GET /api/tickets/<bookingId>?c=<bookingCode>
//
// Returns the minimum information needed to verify a ticket at the gate.
// Requires the booking's own `bookingCode` as a query param to avoid
// enumeration attacks (random GUIDs can't list all bookings without the
// short code that ships inside the QR).

import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const code = String(searchParams.get('c') || '').trim();
    if (!code) return fail('Missing ticket code', 400);
    // Reject obviously-malformed booking IDs without hitting Mongo.
    if (!/^[0-9a-fA-F]{24}$/.test(String(params.id || ''))) {
      return fail('Ticket not found', 404);
    }

    const booking = await Booking.findById(params.id)
      .populate('customer', 'name email')
      .lean();
    if (!booking) return fail('Ticket not found', 404);
    if (String(booking.bookingCode).trim() !== code)
      return fail('Invalid ticket', 401);

    const event = await Event.findById(booking.event)
      .populate('organizer', 'name orgName')
      .lean();

    return ok({
      ticket: {
        id: String(booking._id),
        bookingCode: booking.bookingCode,
        quantity: booking.quantity,
        tier: booking.ticketTier?.name,
        amount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        checkedIn: !!booking.checkedInAt,
        checkedInAt: booking.checkedInAt || null,
        customer: {
          name: booking.customer?.name,
          email: booking.customer?.email,
        },
        event: event
          ? {
              title: event.title,
              startDate: event.startDate,
              startTime: event.startTime,
              venue: event.venue,
              category: event.category,
              organizer:
                event.organizer?.orgName || event.organizer?.name || '',
            }
          : null,
      },
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to load ticket', 500);
  }
}
