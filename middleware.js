import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isSuperadmin = pathname.startsWith('/superadmin');
  const isDashboard = pathname.startsWith('/dashboard');

  if (!isSuperadmin && !isDashboard) return NextResponse.next();

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
