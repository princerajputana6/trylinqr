// IFSC lookup via Razorpay's free public endpoint.
//   GET https://ifsc.razorpay.com/<IFSC>  →  200 with bank/branch/etc.
//                                            404 if the code doesn't exist.
//
// We proxy through this Next.js route so:
//  - the browser doesn't run into CORS / cache issues,
//  - we can normalise the response shape for the client,
//  - we can swap providers later without touching the UI.

import { NextResponse } from 'next/server';

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export async function GET(req, { params }) {
  const code = String(params.code || '').toUpperCase().trim();

  if (!IFSC_RE.test(code)) {
    return NextResponse.json(
      { ok: false, valid: false, error: 'IFSC format is invalid' },
      { status: 400 },
    );
  }

  try {
    const r = await fetch(`https://ifsc.razorpay.com/${code}`, {
      // Razorpay's IFSC dataset is static — cache aggressively.
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (r.status === 404) {
      return NextResponse.json(
        { ok: false, valid: false, error: 'No bank found for this IFSC' },
        { status: 200 },
      );
    }
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, valid: false, error: `Lookup failed (${r.status})` },
        { status: 200 },
      );
    }

    const data = await r.json();
    // Normalise the keys we actually use.
    return NextResponse.json({
      ok: true,
      valid: true,
      ifsc: data.IFSC || code,
      bank: data.BANK || '',
      branch: data.BRANCH || '',
      city: data.CITY || '',
      state: data.STATE || '',
      address: data.ADDRESS || '',
      micr: data.MICR || '',
      contact: data.CONTACT || '',
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, valid: false, error: 'IFSC service unreachable' },
      { status: 200 },
    );
  }
}
