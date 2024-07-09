import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware';

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

    const latestConversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestConversation) {
      return NextResponse.json({ conversationId: latestConversation.id }, { status: 200 });
    } else {
      // Respond with a neutral message indicating no conversations found
      return NextResponse.json({ message: 'No conversations found', userId }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching latest conversation:', error); // Log error message
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
