import { NextResponse } from 'next/server';
import { middleware } from '@/app/api/middleware';

export const GET = async (req, res) => {
  try {
    await middleware(req);
    const user = req.user;
    console.log("user being logged from midddleware", req.user);

    if (req.user === undefined) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!req.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: req.user }, { status: 200 });
  } catch (error) {
    console.log('Error during authentication check');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
