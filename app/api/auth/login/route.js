import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
    }

    const passwordsMatch = (user.password === password); 
    if (!passwordsMatch) {
        return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send the token in the response
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error during login process:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


export const GET = async (req) => {
  return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
};