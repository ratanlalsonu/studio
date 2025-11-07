import { chatbotQuery } from '@/ai/flows/chatbot-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await chatbotQuery(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json({ error: 'Failed to get response from chatbot' }, { status: 500 });
  }
}
