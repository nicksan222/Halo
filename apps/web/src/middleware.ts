import { auth } from '@acme/auth';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Routes that should bypass authentication checks entirely.
 * These are either:
 * - Auth-related routes (/auth/*) - handled by Better Auth directly
 * - API routes (/api/trpc, /api/auth) - have their own auth mechanisms
 */
const PUBLIC_PREFIXES = ['/auth', '/api/trpc', '/api/auth'];

export async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;

	/**
	 * STEP 1: Check if this is a public route that should bypass auth
	 * 
	 * We check this first to avoid unnecessary session validation calls.
	 * Public routes include:
	 * - /auth/* - Better Auth handles these directly
	 * - /api/trpc/* - tRPC has its own auth middleware
	 * - /api/auth/* - Better Auth API routes
	 */
	const isPublicPath = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
	if (isPublicPath) {
		return NextResponse.next();
	}

	/**
	 * STEP 2: Validate session using Better Auth's API (typesafe, no custom fetch)
	 * 
	 * We call `auth.api.getSession` with the incoming headers so Better Auth can:
	 * - Verify/refresh the session
	 * - Return Set-Cookie for token rotation when needed
	 * - Keep behavior consistent with server-side usages
	 */
	const normalizedHeaders = new Headers(req.headers);
	const sessionResponse = await auth.api.getSession({
		headers: normalizedHeaders,
		asResponse: true
	});

	/**
	 * STEP 3: Extract session renewal headers
	 * 
	 * Better Auth may return Set-Cookie headers when:
	 * - Session tokens are rotated for security
	 * - Session is refreshed due to approaching expiration
	 * - New session is created after validation
	 * 
	 * We need to forward these headers to ensure the client gets updated cookies.
	 */
	const setCookie = sessionResponse.headers.get('set-cookie');

	/**
	 * STEP 4: Determine if user has a valid session
	 * 
	 * Better Auth can return different response formats:
	 * - 200 + JSON body: Valid session with user data
	 * - 200 + no body: Valid session (edge case)
	 * - 204 No Content: No valid session
	 * - 401/403: Invalid/expired session
	 * 
	 * We handle each case carefully to avoid false positives/negatives.
	 */
	let hasSession = false;
	try {
		const contentType = sessionResponse.headers.get('content-type') ?? '';
		
		if (sessionResponse.status === 200 && contentType.includes('application/json')) {
			// Valid session with JSON response - parse and check for user data
			const data = await sessionResponse.json();
			hasSession = Boolean(data);
		} else if (sessionResponse.status === 200) {
			// 200 without JSON - treat as authenticated to avoid false negatives
			// This handles edge cases where Better Auth returns 200 but no body
			hasSession = true;
		} else if (sessionResponse.status === 204) {
			// 204 No Content - explicitly no session
			hasSession = false;
		}
		// Other status codes (401, 403, 500, etc.) are treated as no session
	} catch (_error) {
		// If JSON parsing fails or any other error occurs, assume no session
		// This is a security-first approach - better to redirect to login than allow access
		hasSession = false;
	}

	/**
	 * STEP 5: Handle authenticated users trying to access auth pages
	 * 
	 * If a user is already logged in and tries to access /auth/sign-in,
	 * /auth/sign-up, etc., redirect them to the home page to avoid confusion.
	 * This prevents authenticated users from seeing login forms.
	 */
	const isAuthPath = pathname.startsWith('/auth');
	if (isAuthPath && hasSession) {
		const res = NextResponse.redirect(new URL('/', req.url));
		// Forward any session renewal headers even on redirect
		if (setCookie) res.headers.set('set-cookie', setCookie);
		return res;
	}

	/**
	 * STEP 6: Protect routes from unauthenticated users
	 * 
	 * If no valid session exists, redirect to the sign-in page.
	 * We preserve the original URL as a redirectTo parameter so users
	 * can be sent back to their intended destination after login.
	 */
	if (!hasSession) {
		const redirectUrl = new URL('/auth/sign-in', req.url);
		const redirectTo = `${pathname}${search}`;
		
		// Only add redirectTo if it's not the root path
		// This prevents redirect loops and keeps URLs clean
		if (redirectTo && redirectTo !== '/') {
			redirectUrl.searchParams.set('redirectTo', redirectTo);
		}
		
		const res = NextResponse.redirect(redirectUrl);
		// Forward any session renewal headers even on redirect
		// This ensures session state is consistent even for unauthenticated users
		if (setCookie) res.headers.set('set-cookie', setCookie);
		return res;
	}

	/**
	 * STEP 7: Allow authenticated users to proceed
	 * 
	 * If we reach here, the user has a valid session and is accessing
	 * a protected route. Allow the request to continue to the page/API.
	 */
	const res = NextResponse.next();
	// Forward any session renewal headers to ensure client gets updated cookies
	if (setCookie) res.headers.set('set-cookie', setCookie);
	return res;
}

/**
 * Configure which routes this middleware should run on.
 * 
 * We exclude:
 * - _next/* - Next.js internal routes (static files, API routes, etc.)
 * - favicon.ico - Browser favicon requests
 * - assets/* - Static assets that don't need auth
 * 
 * This pattern ensures the middleware only runs on actual page requests
 * and API routes that need authentication checking.
 */
export const config = {
	runtime: 'nodejs',
	matcher: ['/((?!_next|favicon.ico|assets).*)']
};
