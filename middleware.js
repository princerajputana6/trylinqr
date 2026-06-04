import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Decide whether the request is hitting an HTTPS production host.
 *
 * On Vercel / a typical proxy setup the request comes in over HTTPS but the
 * Edge runtime sees `req.url` as `http://...` (the internal hop). NextAuth
 * therefore needs to be told explicitly that secure cookies are in play —
 * otherwise `getToken()` looks for `next-auth.session-token` while the
 * browser actually sent `__Secure-next-auth.session-token`, returns null,
 * and middleware decides the user isn't logged in.
 */
function isSecureRequest(req) {
  if (process.env.NODE_ENV === 'production') return true;
  if (process.env.NEXTAUTH_URL?.startsWith('https://')) return true;
  const xfProto = req.headers.get('x-forwarded-proto');
  if (xfProto === 'https') return true;
  return req.nextUrl.protocol === 'https:';
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isSuperadmin = pathname.startsWith('/superadmin');
  const isDashboard = pathname.startsWith('/dashboard');
  if (!isSuperadmin && !isDashboard) return NextResponse.next();

  const secureCookie = isSecureRequest(req);
  const cookieName = secureCookie
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
    cookieName,
  });

  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isSuperadmin && token.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (
    isDashboard &&
    token.role !== 'admin' &&
    token.role !== 'superadmin'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/superadmin/:path*'],
};
