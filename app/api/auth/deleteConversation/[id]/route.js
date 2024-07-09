import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware';

// Function to delete a conversation by its ID along with its associated messages
const deleteConversationById = async (conversationId) => {
  // Delete messages associated with the conversation
  await prisma.message.deleteMany({
    where: { conversationId },
  });

  // Delete the conversation
  await prisma.conversation.delete({
    where: { id: conversationId },
  });
};

// Endpoint handler for deleting a conversation
export const DELETE = async (req) => {
  try {
    // Invoke your custom middleware to check authentication
    await middleware(req);

    // Extract the conversation ID from the request parameters
    const conversationId = req.nextUrl.pathname.split('/').pop();
    const userId = req.user?.id;

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Ensure the conversation belongs to the authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await deleteConversationById(conversationId);
    return NextResponse.json({ success: true, message: 'Conversation deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
};
