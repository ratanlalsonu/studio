"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
          <p className="mt-4 text-xl text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map(item => (
              <Card key={`${item.id}-${item.unit}`} className="overflow-hidden">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Price: {formatPrice((item.price * 1000) / (item.unit === 'ml' || item.unit === 'g' ? 1 : 1000))} per {item.unit.replace('ml', 'litre').replace('g', 'kg')}
                    </p>
                    <p className="text-sm font-medium">Item Total: {formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.unit, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                     <Input readOnly value={item.quantity} className="h-8 w-12 text-center" />
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.unit, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                   <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id, item.unit)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
