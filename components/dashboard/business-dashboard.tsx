import { StatsCard } from "./stats-card"
import { QuickActions } from "./quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, Building } from "lucide-react"

export function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Dashboard</h1>
        <p className="text-muted-foreground">Manage your business finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Business Account"
          value="$45,678.90"
          change="+5.2% from last month"
          changeType="positive"
          icon={<Building className="h-4 w-4" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$23,456.78"
          change="+12.3% vs last month"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Payroll Account"
          value="$15,000.00"
          change="Ready for next cycle"
          changeType="neutral"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Credit Line Available"
          value="$50,000.00"
          change="$10K used"
          changeType="neutral"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />

        <Card>
          <CardHeader>
            <CardTitle>Recent Business Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { description: "Client Payment - Invoice #1234", amount: "+$5,000.00", date: "Today" },
                { description: "Office Supplies", amount: "-$234.56", date: "Yesterday" },
                { description: "Payroll Processing", amount: "-$12,500.00", date: "2 days ago" },
                { description: "Equipment Purchase", amount: "-$1,899.99", date: "3 days ago" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      transaction.amount.startsWith("+") ? "text-success" : "text-foreground"
                    }`}
                  >
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
