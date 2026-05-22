import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('event');
    if (!eventId) return fail('event id required');

    const reviews = await Review.find({ event: eventId, isApproved: true })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return ok({ reviews });
  } catch (e) {
    console.error(e);
    return fail('Failed to load reviews', 500);
  }
}

export async function POST(req) {
  try {
    const auth = await requireUser(['customer', 'admin', 'superadmin']);
    if (auth.error) return fail('Please log in to review', auth.status);

    await connectDB();
    const { eventId, rating, comment } = await req.json();
    if (!eventId || !rating) return fail('Event and rating are required');

    const hasBooking = await Booking.findOne({
      event: eventId,
      customer: auth.user.id,
      paymentStatus: 'paid',
    });
    if (!hasBooking)
      return fail('Only attendees who booked can review this event', 403);

    const existing = await Review.findOne({
      event: eventId,
      customer: auth.user.id,
    });
    if (existing) return fail('You already reviewed this event', 409);

    const review = await Review.create({
      event: eventId,
      customer: auth.user.id,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment || '',
    });

    // recompute event rating
    const all = await Review.find({ event: eventId, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / (all.length || 1);
    const event = await Event.findByIdAndUpdate(eventId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: all.length,
    });
    if (event) {
      await notify(
        event.organizer,
        'review_posted',
        `New ${rating}★ review on "${event.title}"`,
        `/events/${event.slug}`
      );
    }

    return ok({ review }, 201);
  } catch (e) {
    console.error(e);
    return fail('Failed to post review', 500);
  }
}
