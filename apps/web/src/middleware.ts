import { auth } from '@acme/auth';
import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PREFIXES = ['/auth', '/api/trpc', '/api/auth'];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Fast cookie presence check (avoid network calls in middleware)
  // Support both standard and secure cookie names
  const hasSessionCookie =
    req.cookies.has('better-auth.session_token') ||
    req.cookies.has('__Secure-better-auth.session_token');

  const isPublicPath = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthPath = pathname.startsWith('/auth');

  // If authenticated, keep auth pages inaccessible
  if (isAuthPath && hasSessionCookie) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow explicitly public prefixes to pass through
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protect everything else (todos are the base path)
  if (!hasSessionCookie) {
    const redirectUrl = new URL('/auth/sign-in', req.url);
    const redirectTo = `${pathname}${search}`;
    if (redirectTo && redirectTo !== '/') {
      redirectUrl.searchParams.set('redirectTo', redirectTo);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|assets).*)']
};
