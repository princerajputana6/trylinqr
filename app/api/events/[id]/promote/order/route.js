// POST /api/events/[id]/promote/order
//
// Body: { types: ['hero'|'list'|'spotlight'|'trending', ...] }
//
// Validates ownership + the requested placements, creates a Razorpay
// order for the cumulative amount, returns the order so the client can
// open the Razorpay checkout modal. Flags are NOT applied until
// /promote/verify confirms the payment signature.

import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { getRazorpay, razorpayConfigured } from '@/lib/razorpay';
import { PROMO_BY_TYPE, calcPromoTotal } from '@/lib/promotions';

export async function POST(req, { params }) {
  try {
    const auth = await requireUser(['organizer', 'admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);
    
    // Validate event ID first
    if (!params.id || params.id === 'undefined' || params.id === 'null') {
      return fail('Event must be saved before purchasing promotions', 400);
    }
    
    if (!razorpayConfigured())
      return fail('Razorpay keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.', 503);

    await connectDB();
    const { types = [] } = (await req.json().catch(() => ({}))) || {};
    if (!Array.isArray(types) || !types.length) {
      return fail('Pick at least one placement');
    }
    const valid = types.filter((t) => PROMO_BY_TYPE[t]);
    if (!valid.length) return fail('No valid placements selected');

    const event = await Event.findById(params.id);
    if (!event) return fail('Event not found', 404);
    if (
      auth.user.role !== 'superadmin' &&
      auth.user.role !== 'admin' &&
      String(event.organizer) !== auth.user.id
    ) {
      return fail('You can only promote your own events', 403);
    }

    const amount = calcPromoTotal(valid);
    if (amount <= 0) return fail('Amount must be greater than zero');

    let order;
    try {
      const rzp = getRazorpay();
      order = await rzp.orders.create({
        amount: amount * 100, // paise
        currency: 'INR',
        receipt: `promo-${event._id}`.slice(0, 40),
        notes: {
          eventId: String(event._id),
          types: valid.join(','),
          purpose: 'event_promotion',
        },
      });
    } catch (rzpErr) {
      const detail =
        rzpErr?.error?.description ||
        rzpErr?.message ||
        'Unknown Razorpay error';
      console.error('Razorpay promote-order failed:', detail, rzpErr);
      return fail(`Razorpay: ${detail}`, 502);
    }

    return ok({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      types: valid,
      breakdown: valid.map((t) => ({
        type: t,
        label: PROMO_BY_TYPE[t].label,
        price: PROMO_BY_TYPE[t].price,
      })),
      total: amount,
    });
  } catch (e) {
    console.error('promote/order', e);
    return fail('Could not create promotion order', 500);
  }
}
