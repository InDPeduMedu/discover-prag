import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const { pathname, search } = request.nextUrl;

  // Check if host starts with www.
  if (host && host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    // Hardcoding https:// to break any internal http<->https redirect loops
    return NextResponse.redirect(`https://${newHost}${pathname}${search}`, 301);
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths, avoiding assets/api if necessary
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|bg-pattern.svg).*)',
  ],
};
