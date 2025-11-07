"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { QrCode } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const router = useRouter();
  const { toast } = useToast();

  if (cartItems.length === 0) {
    // Redirect to home or products if cart is empty
    if(typeof window !== "undefined") router.push('/products');
    return null;
  }

  const handlePlaceOrder = () => {
    // In a real app, this would submit the order to the backend.
    // Here, we just show a success message and clear the cart.
    clearCart();
    toast({
      title: "Order Confirmed!",
      description: "Your order has been placed successfully. You can track it in the 'My Orders' section.",
    });
    // TODO: Actually create the order and save it.
    router.push('/orders');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-grow cursor-pointer">Cash on Delivery (COD)</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-grow cursor-pointer">UPI</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr" className="flex-grow cursor-pointer">Scan QR Code</Label>
                </div>
              </RadioGroup>
              {paymentMethod === 'qr' && (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted p-6">
                    <p className='mb-4 text-center text-muted-foreground'>Scan this QR code with your UPI app</p>
                    <Icons.qrCode className="h-48 w-48" />
                    <p className='mt-4 text-center font-semibold'>ApnaDairy Online</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.unit}`} className="flex justify-between text-sm">
                    <span className="flex-grow truncate pr-2">{item.name} ({item.quantity} {item.unit})</span>
                    <span className="flex-shrink-0">&#8377;{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>&#8377;{totalPrice.toFixed(2)}</span>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="mt-6 w-full">Place Order</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to place an order with a total of &#8377;{totalPrice.toFixed(2)}. Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePlaceOrder}>Confirm Order</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
