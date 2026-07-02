import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get('token')?.value;

  if (!isAuthenticated && (path === '/notes')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (path === '/login' || path === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/notes';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [ '/login', '/signup', '/notes/:path*' ],
}