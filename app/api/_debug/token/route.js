// TEMPORARY production diagnostic — confirms what middleware's getToken sees.
// Returns the cookie names present and whether NextAuth can decode the JWT
// for each candidate cookie name. SAFE: returns no PII other than role/email.
// DELETE this file once login is confirmed working.

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const BUILD_MARKER = 'auth-fix-v2';

export const runtime = 'nodejs';

export async function GET(req) {
  const cookieNames = [
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
  ];

  const cookieHeader = req.headers.get('cookie') || '';
  const presentCookies = cookieHeader
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter(Boolean);

  const probes = [];
  for (const name of cookieNames) {
    for (const secureCookie of [true, false]) {
      try {
        const t = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          cookieName: name,
          secureCookie,
        });
        probes.push({
          cookieName: name,
          secureCookie,
          found: !!t,
          role: t?.role || null,
        });
      } catch (e) {
        probes.push({
          cookieName: name,
          secureCookie,
          found: false,
          error: String(e?.message || e),
        });
      }
    }
  }

  return NextResponse.json({
    buildMarker: BUILD_MARKER,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL || null,
    },
    cookiesPresent: presentCookies,
    forwardedProto: req.headers.get('x-forwarded-proto'),
    host: req.headers.get('host'),
    probes,
  });
}
