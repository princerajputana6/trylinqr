import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { sendMail, emails, notifyAdmin } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, password, phone, orgName, orgDescription } =
      await req.json();
    if (!name || !email || !password || !orgName) {
      return fail('Name, email, password and organization name are required');
    }
    if (password.length < 6) {
      return fail('Password must be at least 6 characters');
    }

    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail('An account with this email already exists', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(24).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: 'admin',
      orgName,
      orgDescription,
      isApproved: false,
      verifyToken,
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}&email=${user.email}`;
    await sendMail({ to: user.email, ...emails.welcome(name, verifyUrl) });
    await sendMail({ to: user.email, ...emails.adminPending(name) });
    // Copy the platform team so they can review this organizer.
    await notifyAdmin({
      subject: `New organizer pending approval — ${orgName || name}`,
      html: `<p><b>${orgName || name}</b> just registered as an organizer.</p>
             <p>Name: ${name}<br/>Email: ${user.email}<br/>Phone: ${phone || '—'}<br/>
             Org: ${orgName || '—'}</p>
             <p>Review them in the superadmin queue.</p>`,
    });

    return ok(
      {
        message:
          'Organizer account created. It will be reviewed by our team before activation.',
      },
      201
    );
  } catch (e) {
    console.error(e);
    return fail('Something went wrong', 500);
  }
}
