import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function proxy(request: NextRequest) {
  
  const path = request.nextUrl.pathname;
  const isAuthenticated = request.cookies.get('token')?.value;

  if (!isAuthenticated && (path === '/scripts' || path === '/profile')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (path === '/login' || path === '/signup' || path === '/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/scripts';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: [ '/', '/login', '/signup', '/scripts/:path*', '/profile', '/verifyemail', '/resetpassword', '/forgotpassword' ],
}