import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (formerly Middleware)
 * Runs on the server before requests are completed.
 * Used for maintaining a controlled auth structure and route-level protection.
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected routes: restrict access to /dashboard and its sub-paths
    if (pathname.startsWith('/dashboard')) {
        const accessToken = request.cookies.get('accessToken')?.value;
        const refreshToken = request.cookies.get('refreshToken')?.value;

        // If no tokens are present, redirect to the login page
        if (!accessToken && !refreshToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

/**
 * Config to specify which paths the proxy should run on.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
export default proxy;
