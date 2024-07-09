import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async (req) => {
  try {
    const body = await req.json() // res now contains body
    const { name, email, password } = body;

    // Check if email, name, and password are provided
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Please provide name, email, and password' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: { name, email, password }
    });

    // Generate a token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send the token in the response
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Error during signup process:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = async (req) => {
  return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
};