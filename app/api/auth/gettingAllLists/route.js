import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware'; // Import your custom middleware

export const GET = async (req) => {
  try {
    // Invoke your custom middleware to check authentication
    await middleware(req);

    // Log the authenticated user information
    const user = req.user;

    // Ensure user is authenticated before proceeding
    const userId = req.user?.id;

    if (!userId) {
      // If user is not authenticated, respond with 401 Unauthorized
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Fetch conversation IDs for the authenticated user
    const conversationIds = await prisma.conversation.findMany({
      where: { userId },
      select: { id: true },
    });


    // Always respond with 200 OK, even if conversationIds.length === 0
    return NextResponse.json(conversationIds, { status: 200 });

  } catch (error) {
    // Handle any errors that occur during authentication or fetching conversations
    console.error('Error fetching conversation IDs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  } finally {
    // Ensure Prisma disconnects after completing database operations
    await prisma.$disconnect();
  }
};
