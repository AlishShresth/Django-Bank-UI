import { useAuthStore } from "@/stores/auth-store"
import { StatsCard } from "./stats-card"
import { QuickActions } from "./quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, FileText, AlertCircle } from "lucide-react"

export function StaffDashboard() {
  const { user } = useAuthStore()

  if (!user) return null

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "account_executive":
        return "Account Executive Dashboard"
      case "teller":
        return "Teller Dashboard"
      case "branch_manager":
        return "Branch Manager Dashboard"
      default:
        return "Staff Dashboard"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{getRoleTitle(user.role)}</h1>
        <p className="text-muted-foreground">Manage customer accounts and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Customers"
          value="1,234"
          change="+23 this month"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Today's Transactions"
          value="89"
          change="+12% vs yesterday"
          changeType="positive"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Approvals"
          value="7"
          change="Requires attention"
          changeType="neutral"
          icon={<AlertCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Branch Performance"
          value="98.5%"
          change="+0.5% this quarter"
          changeType="positive"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />

        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { description: "New account opened - John Smith", type: "Account", time: "10 min ago" },
                { description: "Large withdrawal - $5,000", type: "Transaction", time: "25 min ago" },
                { description: "Card replacement request", type: "Service", time: "1 hour ago" },
                { description: "Loan application submitted", type: "Application", time: "2 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
