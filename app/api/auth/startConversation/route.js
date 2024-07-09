// pages/api/startConversation.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { middleware } from '@/app/api/middleware';

// Function to start a new conversation
const startConversation = async (userId) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId: userId, // Associate the conversation with the user ID
      },
    });
    return conversation; // Return the created conversation object
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error; // Throw error for handling in controller or service layer
  }
};

// Endpoint handler for starting a new conversation
export const POST = async (req) => {
  try {
    // Invoke your custom middleware to check authentication if required
    await middleware(req);

    // Ensure user is authenticated before proceeding
    const userId = req.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Call the function to start a new conversation for the authenticated user
    const newConversation = await startConversation(userId);

    // Respond with the newly created conversation object
    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
