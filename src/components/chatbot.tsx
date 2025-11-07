"use client";

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface ChatStep {
  id: string;
  type: 'question' | 'answer';
  content: ReactNode;
}

const faqData = [
    {
        category: 'Pricing',
        questions: [
            { q: 'What is the price of Buffalo milk?', a: 'Buffalo milk price is ₹70 per litre. How else can I help you?' },
            { q: 'What is the price of Cow milk?', a: 'Cow milk price is ₹55 per litre. How else can I help you?' },
            { q: 'Is A2 cow milk available and what is its price?', a: 'Yes, A2 cow milk is available at ₹90 per litre. How else can I help you?' },
        ]
    },
    {
        category: 'Quality & Purity',
        questions: [
            { q: 'What are the Fat and SNF values?', a: 'Our milk maintains high-quality Fat and SNF values according to fresh dairy standards. How else can I help you?' },
            { q: 'Is the milk fresh?', a: 'Yes! We provide daily fresh milk from our trusted dairy sources. How else can I help you?' },
            { q: 'Is the milk pure and free from adulteration?', a: 'Our milk is 100% pure and free from any adulteration. How else can I help you?' },
        ]
    },
    {
        category: 'Delivery',
        questions: [
            { q: 'What are the delivery timings?', a: 'We deliver fresh milk every morning. Bulk orders can be delivered based on schedule. How else can I help you?' },
            { q: 'Do you offer home delivery?', a: 'We offer home delivery. Delivery charges depend on your area. How else can I help you?' },
            { q: 'How long does delivery take?', a: 'Usually delivery takes 20–40 minutes depending on location. How else can I help you?' },
        ]
    },
    {
        category: 'Products',
        questions: [
            { q: 'What products do you offer?', a: 'We offer a range of fresh dairy products including Cow Milk, Buffalo Milk, Ghee, Paneer, Curd, and more. You can see all of them on our Products page. How else can I help you?' },
            { q: 'What is the price of Paneer?', a: 'Yes, fresh paneer is available at ₹350 per kg. How else can I help you?' },
            { q: 'What is the price of Curd (Dahi)?', a: 'Fresh curd is available at ₹70 per kg. How else can I help you?' },
            { q: 'What is the price of Ghee?', a: 'Pure ghee is available at ₹900 per litre, and A2 ghee is available. How else can I help you?' },
        ]
    },
    {
        category: 'Orders & Payment',
        questions: [
            { q: 'How can I place an order?', a: 'You can place your order directly on our website or WhatsApp. How else can I help you?' },
            { q: 'Is Cash on Delivery (COD) available?', a: 'Yes, cash on delivery is available. How else can I help you?' },
            { q: 'What online payment methods are accepted?', a: 'We accept UPI, PhonePe, Google Pay, Paytm, and all digital payments. How else can I help you?' },
            { q: 'Can I modify or cancel my order?', a: 'You can modify or cancel your order by contacting customer support before it is dispatched. How else can I help you?' },
        ]
    },
];

const defaultAnswer = "For any other queries, please contact us at 9696282959. How else can I help you?";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatStep[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const showQuestion = (question: string, answer: string) => {
    setHistory([
      ...history,
      { id: `q-${history.length}`, type: 'question', content: question },
      { id: `a-${history.length}`, type: 'answer', content: answer },
    ]);
  };

  const resetToMainMenu = () => {
    setHistory([]);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if(isOpen) { // if closing
        resetToMainMenu();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [history]);
  
  const MainMenu = () => (
    <div className="space-y-2">
        <p className="p-2 text-sm text-center bg-accent rounded-md">Please select a topic from the options below.</p>
        <Accordion type="single" collapsible className="w-full">
            {faqData.map((categoryItem) => (
                 <AccordionItem value={categoryItem.category} key={categoryItem.category}>
                    <AccordionTrigger>{categoryItem.category}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                        {categoryItem.questions.map((item) => (
                            <Button key={item.q} variant="outline" className="w-full h-auto text-wrap justify-start" onClick={() => showQuestion(item.q, item.a)}>
                                {item.q}
                            </Button>
                        ))}
                        </div>
                    </AccordionContent>
                 </AccordionItem>
            ))}
        </Accordion>
        <p className='pt-4 text-center text-xs text-muted-foreground'>Can't find your answer?</p>
        <Button variant="link" className="w-full" onClick={() => showQuestion("I have a different question.", defaultAnswer)}>
          Other Questions
        </Button>
    </div>
  );

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
          <Card className="flex h-[70vh] w-80 flex-col shadow-2xl sm:w-96">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    {history.length > 0 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetToMainMenu}><ChevronLeft /></Button>
                    )}
                    <CardTitle className="flex items-center gap-2">
                        <Bot /> ApnaDairy Assistant
                    </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef as any}>
                    <div className="flex flex-col gap-4">
                        <div className='flex items-start gap-3 rounded-lg p-3 text-sm justify-start'>
                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className='bg-muted rounded-lg px-3 py-2 max-w-[80%]'>
                                Hello! I'm your friendly dairy assistant. How can I help you today?
                            </div>
                        </div>

                    {history.map((step) => (
                        <div
                        key={step.id}
                        className={cn(
                            'flex items-start gap-3 rounded-lg p-3 text-sm',
                            step.type === 'question' ? 'justify-end' : 'justify-start'
                        )}
                        >
                        {step.type === 'answer' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                            </div>
                        )}
                        <div className={cn(
                            'max-w-[80%] rounded-lg px-3 py-2',
                            step.type === 'question' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            {step.content}
                        </div>
                        {step.type === 'question' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <User className="h-5 w-5" />
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col items-start">
              {history.length === 0 ? <MainMenu /> : (
                <Button onClick={resetToMainMenu} className="w-full">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Main Menu
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
