import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { razorpayConfigured } from '@/lib/razorpay';
import {
  createPendingBooking,
  finalizeBooking,
  checkAvailability,
} from '@/lib/bookingService';

// Direct booking — used for FREE events, and for paid events when
// Razorpay is not configured (simulated payment for local/demo use).
export async function POST(req) {
  try {
    const auth = await requireUser(['customer', 'admin', 'superadmin']);
    if (auth.error) return fail('Please log in to book', auth.status);

    await connectDB();
    const { eventId, tierId, quantity } = await req.json();
    const qty = Math.max(1, parseInt(quantity || 1, 10));

    const event = await Event.findById(eventId);
    if (!event) return fail('Event not found', 404);
    if (event.status !== 'published')
      return fail('This event is not open for booking');

    const tier = event.ticketTiers.id(tierId) || event.ticketTiers[0];
    if (!tier) return fail('Invalid ticket tier');
    if (!checkAvailability(tier, qty))
      return fail('Not enough tickets available');

    const amount = tier.price * qty;
    if (amount > 0 && razorpayConfigured()) {
      return fail('Use the payment flow for paid events', 400);
    }

    const booking = await createPendingBooking({
      customerId: auth.user.id,
      event,
      tier,
      quantity: qty,
    });
    await finalizeBooking(booking._id);

    return ok({ bookingId: booking._id, bookingCode: booking.bookingCode }, 201);
  } catch (e) {
    console.error(e);
    return fail('Failed to create booking', 500);
  }
}
