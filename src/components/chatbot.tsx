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
  { keywords: ["buffalo milk price", "bhains ka doodh rate", "buffalo milk rate"], answer: "Buffalo milk price is ₹70 per litre. How else can I help you?" },
  { keywords: ["cow milk price", "gai ka doodh rate", "cow milk rate"], answer: "Cow milk price is ₹55 per litre. How else can I help you?" },
  { keywords: ["a2 milk price", "a2 cow milk available", "a2 milk rate"], answer: "Yes, A2 cow milk is available at ₹90 per litre. How else can I help you?" },
  // Quality
  { keywords: ["fat kitna hai", "snf kitna hai", "fat snf", "milk fat", "milk quality", "quality of milk"], answer: "Our milk maintains high-quality Fat and SNF values according to fresh dairy standards. How else can I help you?" },
  { keywords: ["milk fresh hai?", "fresh milk?", "organic milk", "is milk fresh"], answer: "Yes! We provide daily fresh milk from our trusted dairy sources. How else can I help you?" },
  { keywords: ["pure milk?", "adulteration free", "is milk pure", "milawat"], answer: "Our milk is 100% pure and free from any adulteration. How else can I help you?" },
  // Packaging
  { keywords: ["packet", "bottle", "packaging", "milk packaging", "milk packet", "milk bottle"], answer: "We provide milk in secured packets and sealed bottles depending on availability. How else can I help you?" },
  { keywords: ["half litre packet", "1 litre packet", "500ml", "1l pack"], answer: "Yes! We provide both 500ml and 1 litre milk packs. How else can I help you?" },
  // Delivery
  { keywords: ["delivery timing", "delivery kab hoti hai", "delivery time"], answer: "We deliver fresh milk every morning. Bulk orders can be delivered based on schedule. How else can I help you?" },
  { keywords: ["home delivery", "delivery charge", "doorstep delivery"], answer: "We offer home delivery. Delivery charges depend on your area. How else can I help you?" },
  { keywords: ["kitna time lagta hai", "delivery speed", "how long for delivery"], answer: "Usually delivery takes 20–40 minutes depending on location. How else can I help you?" },
  { keywords: ["agar ghar par nahi hoon?", "not at home"], answer: "If you are not at home, we will contact you for alternate delivery instructions. How else can I help you?" },
  // Products
  { keywords: ["paneer price", "fresh paneer", "paneer rate"], answer: "Yes, fresh paneer is available at ₹350 per kg. How else can I help you?" },
  { keywords: ["curd price", "dahi", "dahi rate", "yogurt price"], answer: "Fresh curd is available at ₹70 per kg. How else can I help you?" },
  { keywords: ["ghee price", "a2 ghee", "desi ghee", "ghee rate"], answer: "Pure ghee is available at ₹900 per litre, and A2 ghee is available. How else can I help you?" },
  { keywords: ["butter milta hai?", "butter", "buy butter"], answer: "Yes, fresh butter is available on order. How else can I help you?" },
  { keywords: ["what products", "products available", "dairy products", "all products"], answer: "We offer a range of fresh dairy products including Cow Milk, Buffalo Milk, Ghee, Paneer, Curd, and more. You can see all of them on our Products page. How else can I help you?" },
  // Order
  { keywords: ["order kaise kare", "order place", "milk order", "how to order"], answer: "You can place your order directly on our website or WhatsApp. How else can I help you?" },
  { keywords: ["minimum order", "minimum quantity"], answer: "There is no minimum order for regular customers. For bulk orders, minimum may apply. How else can I help you?" },
  { keywords: ["shop address", "location", "where is your shop"], answer: "You can visit our dairy shop at the address mentioned on our Contact Us page. How else can I help you?" },
  { keywords: ["cash on delivery", "cod", "pay on delivery"], answer: "Yes, cash on delivery is available. How else can I help you?" },
  { keywords: ["online payment", "website support", "payment methods", "upi"], answer: "We accept UPI, PhonePe, Google Pay, Paytm, and all digital payments. How else can I help you?" },
  { keywords: ["order modify", "order change", "change my order"], answer: "You can modify your order by contacting customer support before delivery time. How else can I help you?" },
  { keywords: ["order cancel", "cancel order", "cancel my order"], answer: "You can cancel your order before it is dispatched. How else can I help you?" },
  // Subscription
  { keywords: ["monthly subscription", "milk subscription", "subscription milk service", "subscribe"], answer: "Yes! Monthly milk subscription is available. You can choose daily quantity and preferred delivery time. How else can I help you?" },
  { keywords: ["subscription pause", "stop milk", "pause subscription"], answer: "You can pause your subscription anytime by contacting support. How else can I help you?" },
  { keywords: ["out of station", "stop delivery", "vacation"], answer: "If you are traveling, we will stop delivery temporarily. How else can I help you?" },
  { keywords: ["subscription discount", "offer on subscription"], answer: "Subscription customers get priority delivery and special offers. How else can I help you?" },
  // Bulk
  { keywords: ["bulk supply", "bulk milk", "milk for hotel", "milk for restaurant"], answer: "Yes, we provide bulk milk supply for hotels, restaurants, and shops. How else can I help you?" },
  { keywords: ["bulk discount", "wholesale rate", "wholesale price"], answer: "Bulk orders receive special discounted pricing. How else can I help you?" },
  { keywords: ["daily 20-30 litre supply", "bulk quantity"], answer: "Yes, daily 20–100 litres supply is available based on your needs. How else can I help you?" },
  { keywords: ["monthly billing", "billing for bulk"], answer: "Yes, we offer monthly billing for bulk and regular clients. How else can I help you?" },
  { keywords: ["cold chain", "quality in bulk", "bulk milk quality"], answer: "We maintain a proper cold chain for all bulk milk deliveries. How else can I help you?" },
  // Issues
  { keywords: ["order late", "late delivery", "delivery is late"], answer: "Sorry for the delay! Delivery may take extra time due to traffic. How else can I help you?" },
  { keywords: ["milk khatta", "bad milk", "milk spoiled", "sour milk"], answer: "We provide quick replacement for spoiled or bad milk. How else can I help you?" },
  { keywords: ["wrong order", "incorrect item"], answer: "If you received a wrong order, we will replace it immediately. How else can I help you?" },
  { keywords: ["payment cut gaya", "payment issue", "payment failed"], answer: "If payment was deducted but order not placed, our support team will assist you. How else can I help you?" },
  // Farmer & Farming Support
  { keywords: ["dairy farm", "farming guidance", "farmer support", "dairy farming tips", "start dairy farm"], answer: "We provide guidance and support for dairy farmers, including tips on best practices and cattle management. How else can I help you?" },
  { keywords: ["cattle feed", "green fodder", "dry fodder", "silage", "tmr feed", "mineral mixture", "cattle nutrition", "what to feed cows"], answer: "We provide guidance on cattle nutrition, including information on green fodder, dry fodder, silage, TMR, and mineral mixtures for better milk production. How else can I help you?" },
  { keywords: ["murrah buffalo", "sahiwal cow", "best cattle breed", "cow breed", "buffalo breed"], answer: "Murrah buffaloes and Sahiwal cows are excellent breeds for dairy farming. We can provide more information if you need it. How else can I help you?" },
  { keywords: ["milk testing", "milk quality test", "test milk"], answer: "We perform regular quality tests for Fat, SNF, and purity. Test reports are available on request. How else can I help you?" },
  { keywords: ["lactation", "milking machine", "milk production increase", "dairy management", "increase milk"], answer: "For increasing milk production, we recommend proper nutrition, a healthy lactation cycle, and modern dairy management practices like using a milking machine. How else can I help you?" },
  // General
  { keywords: ["farm kahan hai", "farm location", "where is your farm"], answer: "Our farm/location details are available on our Contact page. How else can I help you?" },
  { keywords: ["milk test report", "test available", "quality report"], answer: "Milk quality test reports are available on request. How else can I help you?" },
  { keywords: ["low fat milk", "diet milk", "skim milk"], answer: "Yes, low-fat milk option is available. How else can I help you?" },
  { keywords: ["lactose free milk", "lactose", "lactose intolerance"], answer: "Lactose-free milk is available only on advance order. How else can I help you?" },
];

const defaultAnswer = "Please contact us at 9696282959. How else can I help you?";

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
