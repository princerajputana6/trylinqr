import { NextResponse } from 'next/server';
import { razorpayConfigured } from '@/lib/razorpay';
import { mailerConfigured } from '@/lib/mailer';
import { cloudinaryConfigured } from '@/lib/cloudinary';

export async function GET() {
  return NextResponse.json({
    ok: true,
    integrations: {
      database: Boolean(process.env.MONGODB_URI),
      razorpay: razorpayConfigured(),
      mailer: mailerConfigured(),
      cloudinary: cloudinaryConfigured(),
    },
  });
}
