import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail, notify } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { sendMail, emails, notifyAdmin } from '@/lib/mailer';

export async function PUT(req, { params }) {
  try {
    const auth = await requireUser(['superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const user = await User.findById(params.id);
    if (!user || user.role !== 'admin') return fail('Organizer not found', 404);

    user.isApproved = true;
    user.rejectionReason = undefined;
    await user.save();

    await sendMail({ to: user.email, ...emails.adminApproved(user.name) });
    await notifyAdmin({
      subject: `Organizer approved — ${user.orgName || user.name}`,
      html: `<p>You approved <b>${user.orgName || user.name}</b> (${user.email}).</p>`,
    });
    await notify(
      user._id,
      'admin_approved',
      'Your organizer account has been approved. You can now create events.',
      '/dashboard'
    );

    return ok({ message: 'Organizer approved' });
  } catch (e) {
    console.error(e);
    return fail('Failed to approve', 500);
  }
}
