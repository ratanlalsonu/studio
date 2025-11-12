
"use client";

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Order } from '@/lib/types';
import { getOrders } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;

  const OrderDetails = ({ order }: { order: Order }) => (
    <div className="grid gap-4 md:grid-cols-2 p-4">
      <div>
        <h4 className="font-semibold mb-2">Items Ordered</h4>
        <div className="space-y-2">
            {order.items.map(item => (
              <div key={`${item.id}-${item.unit}`} className="flex justify-between text-sm">
                <span>{item.name} <span className="text-muted-foreground">x {item.quantity} {item.unit}</span></span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Shipping Details</h4>
        <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">{order.shippingDetails.fullName}</p>
            <p>{order.shippingDetails.street}</p>
            <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
            <p>Phone: {order.shippingDetails.phone}</p>
        </div>
        <h4 className="font-semibold mt-4 mb-2">Payment Method</h4>
        <p className="text-sm uppercase">{order.paymentMethod}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          A list of all recent orders from your store. Click an order to see details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-8 w-8" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
            </Table>
            {orders.map((order) => (
            <AccordionItem value={order.id} key={order.id} className="border-b">
                 <AccordionTrigger className="hover:no-underline">
                    <Table className="w-full">
                         <TableBody>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableCell className="w-[100px]"></TableCell>
                                <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell>{order.shippingDetails.fullName}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                                    {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                            </TableRow>
                         </TableBody>
                    </Table>
                 </AccordionTrigger>
                 <AccordionContent>
                    <OrderDetails order={order} />
                 </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
