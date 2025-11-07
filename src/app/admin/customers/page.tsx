"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminCustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          This is where you would manage your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Customer management functionality coming soon.</p>
      </CardContent>
    </Card>
  )
}