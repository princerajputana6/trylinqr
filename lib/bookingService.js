import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { generateQR } from '@/lib/qr';
import { sendMail, emails } from '@/lib/mailer';
import { notify } from '@/lib/api';
import { generateBookingCode, calcPlatformFee } from '@/lib/utils';

export async function resolveTier(event, tierId) {
  const tier = event.ticketTiers.id(tierId) || event.ticketTiers[0];
  return tier;
}

export function checkAvailability(tier, quantity) {
  const remaining = tier.totalQuantity - tier.soldQuantity;
  return remaining >= quantity;
}

export async function createPendingBooking({ customerId, event, tier, quantity }) {
  const amount = tier.price * quantity;
  const platformFee = calcPlatformFee(amount);
  return Booking.create({
    bookingCode: generateBookingCode(),
    customer: customerId,
    event: event._id,
    ticketTier: { tierId: String(tier._id), name: tier.name, price: tier.price },
    quantity,
    totalAmount: amount,
    platformFee,
    paymentStatus: amount === 0 ? 'paid' : 'pending',
  });
}

export async function finalizeBooking(bookingId) {
  await connectDB();
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const event = await Event.findById(booking.event);
  const tier = event.ticketTiers.id(booking.ticketTier.tierId);
  if (tier) {
    tier.soldQuantity += booking.quantity;
    await event.save();
  }

  booking.paymentStatus = 'paid';
  // QR encodes a PUBLIC scan URL so any phone-camera that scans the ticket
  // opens the verification page directly — no app required.
  // IMPORTANT: in production we must never bake a localhost URL into the
  // ticket (a phone camera can't open localhost). If NEXT_PUBLIC_APP_URL
  // is missing or points at localhost, fall back to the live host.
  const envUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim();
  const isLocal = !envUrl || /localhost|127\.0\.0\.1/i.test(envUrl);
  const appUrl =
    process.env.NODE_ENV === 'production' && isLocal
      ? 'https://trylinqr.com'
      : envUrl || 'https://trylinqr.com';
  const scanUrl = `${appUrl.replace(/\/$/, '')}/t/${booking._id}?c=${booking.bookingCode}`;
  const qr = await generateQR(scanUrl);
  booking.qrCode = qr;
  await booking.save();

  const customer = await User.findById(booking.customer);
  if (customer?.email) {
    const mail = emails.bookingConfirmed(booking, event, qr);
    await sendMail({ to: customer.email, ...mail });
  }
  await notify(
    booking.customer,
    'booking_confirmed',
    `Booking confirmed for ${event.title}`,
    `/booking/${booking._id}`
  );
  await notify(
    event.organizer,
    'new_booking',
    `New booking for ${event.title} (${booking.quantity} ticket${booking.quantity > 1 ? 's' : ''})`,
    `/bookings`
  );

  return booking;
}
