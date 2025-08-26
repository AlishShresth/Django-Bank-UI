import { StatsCard } from "./stats-card"
import { QuickActions } from "./quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, TrendingUp, Activity } from "lucide-react"

export function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here's an overview of your accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value="$12,345.67"
          change="+2.5% from last month"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Checking Account"
          value="$8,234.50"
          change="+$1,200 this month"
          changeType="positive"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatsCard
          title="Savings Account"
          value="$4,111.17"
          change="+0.5% interest"
          changeType="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Cards"
          value="3"
          change="2 debit, 1 credit"
          changeType="neutral"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { description: "Online Purchase - Amazon", amount: "-$89.99", date: "Today" },
                { description: "Salary Deposit", amount: "+$3,500.00", date: "Yesterday" },
                { description: "Coffee Shop", amount: "-$4.50", date: "2 days ago" },
                { description: "ATM Withdrawal", amount: "-$100.00", date: "3 days ago" },
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
