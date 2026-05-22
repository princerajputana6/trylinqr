import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, fail } from '@/lib/api';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const filter = params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: params.id }
      : { slug: params.id };
    await Event.updateOne(filter, { $inc: { totalViews: 1 } });
    return ok();
  } catch (e) {
    return fail('Failed', 500);
  }
}
