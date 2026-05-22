import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = {};
    if (status) query.status = status;

    const events = await Event.find(query)
      .populate('organizer', 'name orgName email')
      .sort({ createdAt: -1 })
      .lean();

    return ok({ events });
  } catch (e) {
    console.error(e);
    return fail('Failed to load events', 500);
  }
}
