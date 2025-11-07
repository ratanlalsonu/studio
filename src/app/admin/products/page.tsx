"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          This is where you would manage your products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Product management functionality coming soon.</p>
      </CardContent>
    </Card>
  )
}