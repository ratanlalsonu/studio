
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
import { SellerProfile } from '@/firebase/firestore/sellerService';
import { getSellers } from '@/firebase/firestore/sellerService';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      const fetchedSellers = await getSellers();
      setSellers(fetchedSellers);
      setIsLoading(false);
    };
    fetchSellers();
  }, []);
  
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // Handle both Date objects and Firestore Timestamp objects
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-IN');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sellers</CardTitle>
        <CardDescription>
          A list of all registered sellers on your platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {isLoading ? (
           <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sellers.length === 0 ? (
          <p>No sellers found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Joined On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <Avatar>
                        <AvatarFallback>{seller.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <span className="font-medium">{seller.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{seller.email}</TableCell>
                   <TableCell>{seller.phone}</TableCell>
                  <TableCell className="text-right">{formatDate(seller.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
