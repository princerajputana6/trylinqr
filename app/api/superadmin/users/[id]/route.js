import connectDB from '@/lib/mongodb';
import User from '@/models/User';
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
