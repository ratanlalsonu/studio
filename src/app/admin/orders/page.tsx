"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          This is where you would manage your orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Order management functionality coming soon.</p>
      </CardContent>
    </Card>
  )
}