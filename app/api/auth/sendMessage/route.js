// app/api/auth/sendMessage/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware';
import { getTogetherAIResponse } from '@/lib/togetherAI'; // Assume you have a function to get the AI response

// Function to send a message and get a response from the bot
export const sendMessage = async (conversationId, message, sender) => {
  if (!conversationId || !message || !sender) {
    throw new Error('Missing conversationId, message, or sender');
  }

  const botResponse = await getTogetherAIResponse(message);

  // Store user's message
  await prisma.message.create({
    data: {
      conversationId,
      sender,
      content: message,
    },
  });

  // Store bot's response
  await prisma.message.create({
    data: {
      conversationId,
      sender: 'bot',
      content: botResponse,
    },
  });

  return botResponse;
};

// Endpoint handler for sending a message
export const POST = async (req) => {
  try {
    // Invoke your custom middleware to check authentication
    await middleware(req);

    // Ensure user is authenticated before proceeding
    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { conversationId, message, sender } = await req.json();
    
    if (!conversationId || !message || !sender) {
      return NextResponse.json({ error: 'Missing conversationId, message, or sender' }, { status: 400 });
    }

    const botResponse = await sendMessage(conversationId, message, sender);

    return NextResponse.json({ response: botResponse }, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
