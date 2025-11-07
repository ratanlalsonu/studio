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

const qaMap = [
  // Pricing
  { keywords: ["buffalo milk price", "bhains ka doodh rate"], answer: "Buffalo milk price is ₹70 per litre. How else can I help you?" },
  { keywords: ["cow milk price", "gai ka doodh rate"], answer: "Cow milk price is ₹55 per litre. How else can I help you?" },
  { keywords: ["a2 milk price", "a2 cow milk available"], answer: "Yes, A2 cow milk is available at ₹90 per litre. How else can I help you?" },
  // Quality
  { keywords: ["fat kitna hai", "snf kitna hai", "fat snf"], answer: "Our milk maintains high-quality Fat and SNF values according to fresh dairy standards. How else can I help you?" },
  { keywords: ["milk fresh hai?", "fresh milk?"], answer: "Yes! We provide daily fresh milk from our trusted dairy sources. How else can I help you?" },
  { keywords: ["pure milk?", "adulteration free"], answer: "Our milk is 100% pure and free from any adulteration. How else can I help you?" },
  // Packaging
  { keywords: ["packet", "bottle", "packaging"], answer: "We provide milk in secured packets and sealed bottles depending on availability. How else can I help you?" },
  { keywords: ["half litre packet", "1 litre packet"], answer: "Yes! We provide both 500ml and 1 litre milk packs. How else can I help you?" },
  // Delivery
  { keywords: ["delivery timing", "delivery kab hoti hai"], answer: "We deliver fresh milk every morning. Bulk orders can be delivered based on schedule. How else can I help you?" },
  { keywords: ["home delivery", "delivery charge"], answer: "We offer home delivery. Delivery charges depend on your area. How else can I help you?" },
  { keywords: ["kitna time lagta hai", "delivery speed"], answer: "Usually delivery takes 20–40 minutes depending on location. How else can I help you?" },
  { keywords: ["agar ghar par nahi hoon?"], answer: "If you are not at home, we will contact you for alternate delivery instructions. How else can I help you?" },
  // Products
  { keywords: ["paneer price", "fresh paneer"], answer: "Yes, fresh paneer is available at ₹350 per kg. How else can I help you?" },
  { keywords: ["curd price", "dahi"], answer: "Fresh curd is available at ₹70 per kg. How else can I help you?" },
  { keywords: ["ghee price", "a2 ghee"], answer: "Pure ghee is available at ₹900 per litre, and A2 ghee is available. How else can I help you?" },
  { keywords: ["butter milta hai?"], answer: "Yes, fresh butter is available on order. How else can I help you?" },
  // Order
  { keywords: ["order kaise kare", "order place"], answer: "You can place your order directly on our website or WhatsApp. How else can I help you?" },
  { keywords: ["minimum order", "minimum quantity"], answer: "There is no minimum order for regular customers. For bulk orders, minimum may apply. How else can I help you?" },
  { keywords: ["shop address", "location"], answer: "You can visit our dairy shop at the address mentioned on our Contact Us page. How else can I help you?" },
  { keywords: ["cash on delivery", "cod"], answer: "Yes, cash on delivery is available. How else can I help you?" },
  { keywords: ["online payment"], answer: "We accept UPI, PhonePe, Google Pay, Paytm, and all digital payments. How else can I help you?" },
  { keywords: ["order modify", "order change"], answer: "You can modify your order by contacting customer support before delivery time. How else can I help you?" },
  { keywords: ["order cancel", "cancel order"], answer: "You can cancel your order before it is dispatched. How else can I help you?" },
  // Subscription
  { keywords: ["monthly subscription", "milk subscription"], answer: "Yes! Monthly milk subscription is available. You can choose daily quantity and preferred delivery time. How else can I help you?" },
  { keywords: ["subscription pause", "stop milk"], answer: "You can pause your subscription anytime by contacting support. How else can I help you?" },
  { keywords: ["out of station", "stop delivery"], answer: "If you are traveling, we will stop delivery temporarily. How else can I help you?" },
  { keywords: ["subscription discount"], answer: "Subscription customers get priority delivery and special offers. How else can I help you?" },
  // Bulk
  { keywords: ["bulk supply", "bulk milk"], answer: "Yes, we provide bulk milk supply for hotels, restaurants, and shops. How else can I help you?" },
  { keywords: ["bulk discount", "wholesale rate"], answer: "Bulk orders receive special discounted pricing. How else can I help you?" },
  { keywords: ["daily 20-30 litre supply"], answer: "Yes, daily 20–100 litres supply is available based on your needs. How else can I help you?" },
  { keywords: ["monthly billing"], answer: "Yes, we offer monthly billing for bulk and regular clients. How else can I help you?" },
  { keywords: ["cold chain", "quality in bulk"], answer: "We maintain a proper cold chain for all bulk milk deliveries. How else can I help you?" },
  // Issues
  { keywords: ["order late", "late delivery"], answer: "Sorry for the delay! Delivery may take extra time due to traffic. How else can I help you?" },
  { keywords: ["milk khatta", "bad milk"], answer: "We provide quick replacement for spoiled or bad milk. How else can I help you?" },
  { keywords: ["wrong order"], answer: "If you received a wrong order, we will replace it immediately. How else can I help you?" },
  { keywords: ["payment cut gaya", "payment issue"], answer: "If payment was deducted but order not placed, our support team will assist you. How else can I help you?" },
  // General
  { keywords: ["farm kahan hai", "farm location"], answer: "Our farm/location details are available on our Contact page. How else can I help you?" },
  { keywords: ["milk test report", "test available"], answer: "Milk quality test reports are available on request. How else can I help you?" },
  { keywords: ["low fat milk", "diet milk"], answer: "Yes, low-fat milk option is available. How else can I help you?" },
  { keywords: ["lactose free milk"], answer: "Lactose-free milk is available only on advance order. How else can I help you?" },
];

const defaultAnswer = "Please contact us at 1234567891. How else can I help you?";

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

  const getBotResponse = (userInput: string): string => {
    const lowerCaseInput = userInput.toLowerCase();
    for (const item of qaMap) {
      for (const keyword of item.keywords) {
        if (lowerCaseInput.includes(keyword.toLowerCase())) {
          return item.answer;
        }
      }
    }
    return defaultAnswer;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate thinking delay
    setTimeout(() => {
      const botReply = getBotResponse(input);
      const botMessage: Message = { text: botReply, isUser: false };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
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
