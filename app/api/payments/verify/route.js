import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { verifySignature } from '@/lib/razorpay';
import { finalizeBooking } from '@/lib/bookingService';

export async function POST(req) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    const booking = await Booking.findById(bookingId);
    if (!booking) return fail('Booking not found', 404);
    if (String(booking.customer) !== auth.user.id)
      return fail('forbidden', 403);

    const valid = verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });
    if (!valid) {
      booking.paymentStatus = 'failed';
      await booking.save();
      return fail('Payment signature verification failed', 400);
    }

    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpaySignature = razorpaySignature;
    await booking.save();

    await finalizeBooking(booking._id);

    return ok({ bookingId: booking._id, bookingCode: booking.bookingCode });
  } catch (e) {
    console.error(e);
    return fail('Payment verification failed', 500);
  }
}
