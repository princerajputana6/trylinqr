import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import {
  signUpload,
  cloudinaryConfigured,
  CLOUD_NAME,
  API_KEY,
} from '@/lib/cloudinary';

// Returns a signature so the browser can upload directly to Cloudinary.
export async function POST(req) {
  try {
    const auth = await requireUser(['admin', 'superadmin', 'customer']);
    if (auth.error) return fail(auth.error, auth.status);

    if (!cloudinaryConfigured()) {
      return fail('Image uploads are not configured on this server', 503);
    }

    const { folder = 'trylinqr' } = await req.json().catch(() => ({}));
    const timestamp = Math.round(Date.now() / 1000);
    const signature = signUpload({ timestamp, folder });

    return ok({
      signature,
      timestamp,
      folder,
      apiKey: API_KEY,
      cloudName: CLOUD_NAME,
    });
  } catch (e) {
    console.error(e);
    return fail('Failed to sign upload', 500);
  }
}
