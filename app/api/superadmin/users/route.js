import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-passwordHash -verifyToken')
      .lean();

    return ok({ users });
  } catch (e) {
    console.error(e);
    return fail('Failed to load users', 500);
  }
}
