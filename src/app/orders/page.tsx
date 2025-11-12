
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, Receipt } from 'lucide-react';
import { Order, CartItem } from '@/lib/types';
import { getOrders } from '@/lib/firebase-service'; // Assuming you have a function to get orders
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const formatPrice = (price: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;

  const getItemTotal = (item: CartItem) => {
    let itemPrice = item.price * item.quantity;
    if (item.unit === 'ml' || item.unit === 'g') {
        itemPrice = (item.price / 1000) * item.quantity;
    }
    return itemPrice;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      // Here you would typically fetch orders for the logged-in user.
      // For now, we'll fetch all orders as an example.
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">My Orders</h1>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-12 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <Receipt className="mx-auto h-24 w-24 text-muted-foreground" />
          <p className="mt-4 text-xl text-muted-foreground">You have no orders yet.</p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Order #{order.id.slice(0, 8)}...</CardTitle>
                    <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge 
                    variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                    className="w-fit"
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={`${item.id}-${item.unit}`} className="flex justify-between text-sm">
                      <span>{item.name} <span className="text-muted-foreground">x {item.quantity} {item.unit}</span></span>
                      <span>{formatPrice(getItemTotal(item))}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">Total: {formatPrice(order.total)}</p>
                <Button asChild>
                  <Link href={`/orders/${order.id}`}>
                    <Package className="mr-2 h-4 w-4" /> Track Order
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
