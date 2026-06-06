import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { getRazorpay, razorpayConfigured } from '@/lib/razorpay';
import { createPendingBooking, checkAvailability } from '@/lib/bookingService';

export async function POST(req) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail('Please log in to book', auth.status);
    if (!razorpayConfigured())
      return fail('Online payments are not configured', 503);

    await connectDB();
    const { eventId, tierId, quantity } = await req.json();
    const qty = Math.max(1, parseInt(quantity || 1, 10));

    const event = await Event.findById(eventId);
    if (!event || event.status !== 'published')
      return fail('Event not available for booking', 404);

    const tier = event.ticketTiers.id(tierId) || event.ticketTiers[0];
    if (!tier) return fail('Invalid ticket tier');
    if (!checkAvailability(tier, qty))
      return fail('Not enough tickets available');

    const amount = tier.price * qty;
    if (amount <= 0) return fail('Use free booking flow for free events');

    const booking = await createPendingBooking({
      customerId: auth.user.id,
      event,
      tier,
      quantity: qty,
    });

    let order;
    try {
      const rzp = getRazorpay();
      order = await rzp.orders.create({
        amount: amount * 100,
        currency: 'INR',
        receipt: booking.bookingCode,
        notes: { bookingId: String(booking._id) },
      });
    } catch (rzpErr) {
      // Razorpay SDK throws structured errors — surface the real one so
      // we don't hide things like "account not activated for live mode"
      // or "invalid key" behind a generic 500.
      const detail =
        rzpErr?.error?.description ||
        rzpErr?.message ||
        'Unknown Razorpay error';
      console.error('Razorpay order.create failed:', detail, rzpErr);
      return fail(`Razorpay: ${detail}`, 502);
    }

    booking.razorpayOrderId = order.id;
    await booking.save();

    return ok({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to create payment order', 500);
  }
}
