
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <span className="text-muted-foreground">Rupees</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            New Orders
          </CardTitle>
          <span className="text-muted-foreground">📦</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+23</div>
          <p className="text-xs text-muted-foreground">
            in the last 24 hours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <span className="text-muted-foreground">📈</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Now
          </CardTitle>
          <span className="text-muted-foreground">🟢</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">
            +201 since last hour
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
