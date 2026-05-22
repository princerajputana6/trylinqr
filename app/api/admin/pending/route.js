import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const pending = await User.find({ role: 'admin', isApproved: false })
      .sort({ createdAt: -1 })
      .select('-passwordHash -verifyToken')
      .lean();

    return ok({ pending });
  } catch (e) {
    console.error(e);
    return fail('Failed', 500);
  }
}
