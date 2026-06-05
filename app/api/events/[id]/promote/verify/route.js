// POST /api/events/[id]/promote/verify
//
// Body: {
//   types: ['hero', ...],
//   razorpayOrderId, razorpayPaymentId, razorpaySignature,
// }
//
// Verifies the Razorpay HMAC, then flips the corresponding placement
// flags on the event and records the payment in event.promotionPayments.

import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { verifySignature } from '@/lib/razorpay';
import { PROMO_BY_TYPE, calcPromoTotal } from '@/lib/promotions';

export async function POST(req, { params }) {
  try {
    const auth = await requireUser(['organizer', 'admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const body = await req.json();
    const {
      types = [],
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return fail('Missing payment fields', 400);
    }
    const valid = (types || []).filter((t) => PROMO_BY_TYPE[t]);
    if (!valid.length) return fail('No valid placements selected', 400);

    const event = await Event.findById(params.id);
    if (!event) return fail('Event not found', 404);
    if (
      auth.user.role !== 'superadmin' &&
      auth.user.role !== 'admin' &&
      String(event.organizer) !== auth.user.id
    ) {
      return fail('Forbidden', 403);
    }

    const sigOk = verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });
    if (!sigOk) return fail('Payment signature invalid', 400);

    // Apply each placement.
    for (const t of valid) {
      const cfg = PROMO_BY_TYPE[t];
      event[cfg.eventField] = true;
      event.promotionPayments.push({
        type: t,
        amount: cfg.price,
        razorpayOrderId,
        razorpayPaymentId,
        paidAt: new Date(),
      });
    }
    await event.save();

    return ok({
      message: 'Promotions activated',
      placements: valid,
      total: calcPromoTotal(valid),
    });
  } catch (e) {
    console.error('promote/verify', e);
    return fail('Could not verify payment', 500);
  }
}
