import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // Check if host starts with www.
  if (host && host.startsWith('www.')) {
    // Remove www. from the host
    const newHost = host.replace('www.', '');
    
    // Construct the new URL with the same protocol, new host, and path
    const newUrl = new URL(url.pathname + url.search, `${url.protocol}//${newHost}`);
    
    // Redirect with 301 Moved Permanently for SEO
    return NextResponse.redirect(newUrl, 301);
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
