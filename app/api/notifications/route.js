import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const notifications = await Notification.find({ user: auth.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    const unread = notifications.filter((n) => !n.isRead).length;

    return ok({ notifications, unread });
  } catch (e) {
    console.error(e);
    return fail('Failed to load notifications', 500);
  }
}

export async function PUT() {
  try {
    const auth = await requireUser();
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    await Notification.updateMany(
      { user: auth.user.id, isRead: false },
      { isRead: true }
    );
    return ok();
  } catch (e) {
    console.error(e);
    return fail('Failed', 500);
  }
}
