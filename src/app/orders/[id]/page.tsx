
"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/lib/types';
import { getOrderById } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';

function OrderDetailsDisplay({ order }: { order: Order }) {
  const formatPrice = (price: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;

  const trackingSteps = [
    { name: 'Order Placed', icon: CheckCircle2, completed: true },
    { name: 'Processing', icon: Package, completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
    { name: 'Shipped', icon: Truck, completed: ['Shipped', 'Delivered'].includes(order.status) },
    { name: 'Delivered', icon: Home, completed: order.status === 'Delivered' },
  ];

  return (
    <>
      <h1 className="mb-4 font-headline text-3xl font-bold">Order Details</h1>
      <p className="mb-8 text-muted-foreground">Order #{order.id.slice(0, 8)} &bull; Placed on {new Date(order.date).toLocaleDateString()}</p>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-6 top-6 h-full w-0.5 bg-border" />
                <ul className="space-y-8">
                  {trackingSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "z-10 flex h-12 w-12 items-center justify-center rounded-full",
                        step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className={cn(
                        "font-medium",
                        step.completed ? "text-foreground" : "text-muted-foreground"
                      )}>{step.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={`${item.id}-${item.unit}`} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">{order.shippingDetails.fullName}</p>
                    <p>{order.shippingDetails.street}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
                    <p>Phone: {order.shippingDetails.phone}</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const fetchedOrder = await getOrderById(params.id);
      if (!fetchedOrder) {
        notFound();
      }
      setOrder(fetchedOrder);
      setIsLoading(false);
    };

    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <OrderDetailsDisplay order={order} />
    </div>
  );
}
