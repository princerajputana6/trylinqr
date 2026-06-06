import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const body = await req.json();
    const user = await User.findById(params.id);
    if (!user) return fail('User not found', 404);
    if (user.role === 'superadmin') return fail('Cannot modify a super admin');

    if (body.isBanned !== undefined) user.isBanned = body.isBanned;
    await user.save();

    return ok({ message: body.isBanned ? 'User banned' : 'User reinstated' });
  } catch (e) {
    console.error(e);
    return fail('Failed to update user', 500);
  }
}

/**
 * DELETE /api/superadmin/users/[id]
 *
 * Hard-delete a user. Refuses to delete the only superadmin and the
 * superadmin currently signed in. For organizers, all their events are
 * also cancelled so they stop showing in public feeds.
 */
export async function DELETE(req, { params }) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    if (String(auth.user.id) === String(params.id)) {
      return fail('You cannot delete your own account', 400);
    }

    const user = await User.findById(params.id);
    if (!user) return fail('User not found', 404);
    if (user.role === 'superadmin') {
      return fail('Cannot delete a super admin', 400);
    }

    // For organizers, mark their events cancelled so booked customers
    // are notified through the existing flow and the events drop off
    // public listings instead of orphaning.
    if (user.role === 'admin') {
      await Event.updateMany(
        { organizer: user._id, status: { $ne: 'cancelled' } },
        { $set: { status: 'cancelled' } },
      );
    }

    // For customers, leave their past bookings intact (audit trail) but
    // anonymise the user reference. Hard-delete the account itself.
    await Booking.updateMany(
      { customer: user._id },
      { $set: { customerDeleted: true } },
    );

    await User.deleteOne({ _id: user._id });

    return ok({ message: 'User deleted' });
  } catch (e) {
    console.error('DELETE user', e);
    return fail('Failed to delete user', 500);
  }
}
