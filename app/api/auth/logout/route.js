import { NextResponse } from 'next/server';

export const GET = async (req) => {
  try {
    // Set the cookies 'jwt' and 'token' to 'loggedout' with an expiration of 10 seconds for 'jwt' and immediate expiration for 'token'
    const logoutCookie = new Response('Logged out', {
      headers: {
        'Set-Cookie': [
          `jwt=loggedout; Max-Age=10; Path=/; HttpOnly`,
          `token=; Max-Age=0; Path=/; HttpOnly`
        ],
      },
    });

    return NextResponse.json(
      { status: 'success', message: 'Cookies cleared successfully!' },
      { status: 200, headers: logoutCookie.headers }
    );
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
