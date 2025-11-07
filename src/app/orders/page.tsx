import Link from 'next/link';
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, Receipt } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold">My Orders</h1>

       {orders.length === 0 ? (
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
                  <CardTitle>Order #{order.id}</CardTitle>
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
                    <span>&#8377;{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold">Total: &#8377;{order.total.toFixed(2)}</p>
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
