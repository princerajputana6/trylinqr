import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails } from '@/lib/mailer';

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const { reason } = await req.json().catch(() => ({}));
    const user = await User.findById(params.id);
    if (!user || user.role !== 'admin') return fail('Organizer not found', 404);

    user.isApproved = false;
    user.rejectionReason = reason || 'Application did not meet our criteria';
    await user.save();

    await sendMail({
      to: user.email,
      ...emails.adminRejected(user.name, user.rejectionReason),
    });
    await notify(
      user._id,
      'admin_rejected',
      `Your organizer application was not approved. ${user.rejectionReason}`,
      '/'
    );

    return ok({ message: 'Organizer rejected' });
  } catch (e) {
    console.error(e);
    return fail('Failed to reject', 500);
  }
}
