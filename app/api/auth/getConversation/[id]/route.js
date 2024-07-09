// app/api/auth/getConversation/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware';

// Function to retrieve messages in a conversation by conversationId
export const getConversation = async (conversationId) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; // Throw error for handling in controller or service layer
  }
};

// Endpoint handler for retrieving messages in a conversation
export const GET = async (req) => {
  try {
    // Invoke your custom middleware to check authentication if required
    await middleware(req);

    // Ensure user is authenticated before proceeding
    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Extract conversationId from request parameters
    const conversationId = req.nextUrl.pathname.split('/').pop();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Call the function to retrieve messages for the specified conversationId
    const messages = await getConversation(conversationId);

    // Respond with the retrieved messages or an empty array if no messages are found
    return NextResponse.json({ conversation: { messages: messages || [] } }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
