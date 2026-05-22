import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const user = await User.findById(auth.user.id);
    if (!user) return fail('Not found', 404);
    return ok({ user: user.toSafeJSON() });
  } catch (e) {
    console.error(e);
    return fail('Failed', 500);
  }
}

export async function PUT(req) {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const body = await req.json();
    const user = await User.findById(auth.user.id);
    if (!user) return fail('Not found', 404);

    ['name', 'phone', 'avatar', 'orgName', 'orgDescription'].forEach((f) => {
      if (body[f] !== undefined) user[f] = body[f];
    });
    await user.save();

    return ok({ user: user.toSafeJSON() });
  } catch (e) {
    console.error(e);
    return fail('Failed to update profile', 500);
  }
}
