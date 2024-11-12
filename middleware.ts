import { auth } from '@utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers.get('host')!.replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Handle Vercel preview deployment URLs
  if (hostname.includes('---') && hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)) {
    hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  const pathname = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Rewrites for app pages (dashboard)
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await auth();

    const authRoutes = ['/signin', '/signup', '/verify-email'];

    // Unauthenticated users, go to signin
    if (!session && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Authenticated user is in signin, go to dashboard
    if (session && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.rewrite(new URL(`/app${pathname === '/' ? '' : pathname}`, req.url));
  }

  // Rewrite for public site pages
  if (hostname === 'localhost:3000' || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return res;
  }

  // Rewrite everything multi-tenant pages
  return NextResponse.rewrite(new URL(`/${hostname}${pathname}`, req.url));
}
