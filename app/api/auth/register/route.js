import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { sendMail, emails } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return fail('Name, email and password are required');
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
      role: 'customer',
      isApproved: true,
      verifyToken,
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}&email=${user.email}`;
    const mail = emails.welcome(name, verifyUrl);
    await sendMail({ to: user.email, ...mail });

    return ok({ message: 'Account created. Check your email to verify.' }, 201);
  } catch (e) {
    console.error(e);
    return fail('Something went wrong', 500);
  }
}
