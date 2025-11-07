import { notFound } from 'next/navigation';
import { orders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = orders.find((o) => o.id === params.id);
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  if (!order) {
    notFound();
  }

  const trackingSteps = [
    { name: 'Order Placed', icon: CheckCircle2, completed: true },
    { name: 'Processing', icon: Package, completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
    { name: 'Shipped', icon: Truck, completed: ['Shipped', 'Delivered'].includes(order.status) },
    { name: 'Delivered', icon: Home, completed: order.status === 'Delivered' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 font-headline text-3xl font-bold">Order Details</h1>
      <p className="mb-8 text-muted-foreground">Order #{order.id} &bull; Placed on {new Date(order.date).toLocaleDateString()}</p>
      
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
        
        <div className="lg:col-span-1">
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
        </div>
      </div>
    </div>
  );
}
