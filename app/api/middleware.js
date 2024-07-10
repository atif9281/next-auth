import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if(token == undefined) return NextResponse.redirect(new URL('/login', req.url));

  if (!token) {
    // Redirect unauthenticated users trying to access protected routes to '/login'
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    req.user = payload; // Attach user info to the request object
    return NextResponse.next(); // Proceed to the next middleware or the route handler
  } catch (error) {
    console.error('Error verifying token:', error);
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Define the matcher to specify which paths should trigger this middleware
export const config = {
  matcher: ['/'], // Adjust paths as needed
};
