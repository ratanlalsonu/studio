'use server';
/**
 * @fileOverview A helpful and friendly chatbot for a Dairy Business Website.
 *
 * - chatbotQuery - A function that handles user questions.
 */

import { ai } from '@/ai/genkit';
import { generate } from 'genkit';
import { z } from 'zod';

const ChatbotInputSchema = z.string();
const ChatbotOutputSchema = z.string();

export async function chatbotQuery(input: string): Promise<string> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (prompt) => {
    const llmResponse = await generate({
      model: 'googleai/gemini-pro',
      prompt: `You are a helpful and friendly chatbot for a Dairy Business Website called ApnaDairy.
Your role is to answer user questions related to:

- Buffalo milk
- Cow milk
- Milk quality, fat, SNF
- Dairy farming guidance
- Cattle feed & nutrition
- Milk prices & delivery
- Online orders and customer support
- Farmer assistance and dairy tips

Keywords:
buffalo milk, cow milk, dairy farm, dairy products, milk fat, SNF,
lactose, A2 cow milk, fresh milk, organic milk, milk price,
milk delivery, dairy farming tips, cattle feed, green fodder,
dry fodder, silage, TMR feed, mineral mixture, Murrah buffalo,
Sahiwal cow, milk testing, lactation, milking machine, milk order,
subscription milk service, dairy management, cattle nutrition,
milk production increase, farmer support, milk packaging,
cold chain, dairy website support.

Guidelines:
1. Give clear, simple, and accurate answers.
2. Always maintain a polite and friendly tone.
3. If asked about product details or milk rates, provide helpful information.
4. If you are not sure about something, say “I am not fully sure, but I can help you check!”
5. Do not provide medical or veterinary diagnosis; give only general guidance.
6. Support customers with order help, delivery info, and dairy-related queries.

Always end your response with:
"How else can I help you?"

User question: ${prompt}
`,
    });

    return (
      llmResponse.text ||
      "I'm sorry, I couldn't generate a response. How else can I help you?"
    );
  }
);
