"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
        setMessages([
            { text: "Hello! I'm your friendly dairy assistant from ApnaDairy. How can I help you today?", isUser: false }
        ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage: Message = { text: data.reply, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg"
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50">
          <Card className="flex h-[60vh] w-80 flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot /> ApnaDairy Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef as any}>
                    <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                        key={index}
                        className={cn(
                            'flex items-start gap-3 rounded-lg p-3 text-sm',
                            msg.isUser ? 'justify-end' : 'justify-start'
                        )}
                        >
                        {!msg.isUser && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                            </div>
                        )}
                        <div className={cn(
                            'max-w-[80%] rounded-lg px-3 py-2',
                            msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            {msg.text}
                        </div>
                        {msg.isUser && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <User className="h-5 w-5" />
                            </div>
                        )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 rounded-lg p-3 text-sm justify-start">
                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </div>
                             <div className="bg-muted px-3 py-2 rounded-lg flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Thinking...
                             </div>
                        </div>
                    )}
                    </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={handleSendMessage}
                className="flex w-full items-center space-x-2"
              >
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 resize-none"
                  rows={1}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
