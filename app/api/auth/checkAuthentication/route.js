import { NextResponse } from 'next/server';
import { middleware } from '@/app/api/middleware';

export const GET = async (req, res) => {
  try {
    await middleware(req);
    const user = req.user;

    if (!req.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: req.user }, { status: 200 });
  } catch (error) {
    console.error('Error during authentication check:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
