import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export const config = {
  matcher: [
    '/api/cart/:path*',
    '/api/items/:id', // Only dynamic item routes (e.g., /api/items/123)
    '/api/users/:path*',
  ],
  runtime: 'nodejs',
};

export async function middleware(req: NextRequest) {
  console.log('Middleware path:', req.nextUrl.pathname);
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded = verifyToken(token);
    const response = NextResponse.next();
    response.headers.set('userId', decoded.userId);
    return response;
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}