
"use client"

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SellerDashboardPage() {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || profile?.role !== 'seller')) {
            router.push('/seller/login');
        }
    }, [user, profile, isLoading, router]);

    if (isLoading || !profile) {
        return (
            <div className="container mx-auto p-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-1/3 mb-8" />
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {profile.fullName}!</h1>
            <p className="text-muted-foreground mb-8">This is your seller dashboard. Here you can manage your products and view your sales.</p>
            
            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>My Products</CardTitle>
                            <CardDescription>View, add, and manage your product listings.</CardDescription>
                        </div>
                        <Button disabled>Add New Product</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground py-8">
                            Product management functionality coming soon.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
