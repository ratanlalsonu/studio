
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
import { SellerApplication } from '@/lib/types';
import { getSellerApplications } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AdminSellersPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const fetchedApps = await getSellerApplications();
      setApplications(fetchedApps);
      setIsLoading(false);
    };
    fetchApplications();
  }, []);

  const formatPrice = (price: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(price)}`;
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-IN');
  };

  const ApplicationDetails = ({ app }: { app: SellerApplication }) => (
    <div className="grid gap-6 md:grid-cols-2 p-4 bg-muted/50">
      <div>
        <h4 className="font-semibold mb-2">Seller Information</h4>
        <div className="text-sm space-y-1">
            <p><span className="font-medium">Name:</span> {app.sellerName}</p>
            <p><span className="font-medium">Email:</span> {app.sellerContact}</p>
            <p><span className="font-medium">Phone:</span> {app.sellerPhone}</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Product Proposal</h4>
        <div className="text-sm space-y-1">
            <p><span className="font-medium">Product:</span> {app.productName}</p>
            <p><span className="font-medium">Category:</span> {app.productCategory}</p>
            <p><span className="font-medium">Proposed Price:</span> {formatPrice(app.price)} / Ltr or Kg</p>
            <p className="mt-2"><span className="font-medium">Description:</span> {app.productDescription}</p>
        </div>
      </div>
       <div className="md:col-span-2">
         <h4 className="font-semibold mb-2">Proposed Image</h4>
         <Image src={app.image} alt={app.productName} width={100} height={100} className="rounded-md border object-cover"/>
       </div>
       <div className="md:col-span-2 flex justify-end gap-2">
            <Button variant="destructive" size="sm" disabled>Reject</Button>
            <Button size="sm" disabled>Approve</Button>
       </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Applications</CardTitle>
        <CardDescription>
          Review and manage applications from potential sellers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-8 w-8" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <p>No seller applications found.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Seller Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
            </Table>
            {applications.map((app) => (
            <AccordionItem value={app.id} key={app.id} className="border-b">
                 <AccordionTrigger className="hover:no-underline">
                    <Table className="w-full">
                         <TableBody>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableCell className="w-[100px]"></TableCell>
                                <TableCell className="font-medium">{app.sellerName}</TableCell>
                                <TableCell>{app.productName}</TableCell>
                                <TableCell>{formatDate(app.submittedAt)}</TableCell>
                                <TableCell>
                                    <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                                      {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatPrice(app.price)}</TableCell>
                            </TableRow>
                         </TableBody>
                    </Table>
                 </AccordionTrigger>
                 <AccordionContent>
                    <ApplicationDetails app={app} />
                 </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
