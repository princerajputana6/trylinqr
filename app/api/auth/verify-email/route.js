import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { sendMail, emails } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { token, email } = await req.json();
    if (!token || !email) return fail('Invalid verification link');

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return fail('Account not found', 404);

    if (user.isVerified) return ok({ message: 'Email already verified' });
    if (user.verifyToken !== token) return fail('Invalid or expired token');

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    await sendMail({ to: user.email, ...emails.emailVerified(user.name) });

    return ok({ message: 'Email verified successfully' });
  } catch (e) {
    console.error(e);
    return fail('Something went wrong', 500);
  }
}
