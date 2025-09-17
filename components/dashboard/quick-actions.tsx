"use client"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, CreditCard, Download, Plus, Users, FileText } from "lucide-react"

export function QuickActions() {
  const { user } = useAuthStore()

  if (!user) return null

  const actions = [
    {
      title: "Transfer Money",
      description: "Send money to another account",
      icon: ArrowLeftRight,
      href: "/transfers",
      role: ["customer", "teller"],
      variant: "default" as const,
    },
    {
      title: "View Accounts",
      description: "Manage your accounts",
      icon: CreditCard,
      href: "/accounts",
      role: ["customer", "teller", "account_executive", "branch_manager"],
      variant: "outline" as const,
    },
    {
      title: "View Cards",
      description: "Manage your cards",
      icon: CreditCard,
      href: "/cards",
      role: ["customer", "teller", "account_executive", "branch_manager"],
      variant: "outline" as const,
    },
    {
      title: "Download Statement",
      description: "Get account statements",
      icon: Download,
      href: "/statements",
      role: ["customer"],
      variant: "outline" as const,
    },
    {
      title: "Add Customer",
      description: "Register new customer",
      icon: Plus,
      href: "/customers/new",
      role: ["teller", "account_executive", "branch_manager"],
      variant: "outline" as const,
    },
    {
      title: "View All Customers",
      description: "Manage customer accounts",
      icon: Users,
      href: "/customers",
      role: ["teller", "account_executive", "branch_manager"],
      variant: "outline" as const,
    },
    {
      title: "Branch Reports",
      description: "View performance reports",
      icon: FileText,
      href: "/reports",
      role: ["branch_manager"],
      variant: "outline" as const,
    },
  ]

  const filteredActions = actions.filter((action) =>  action.role.includes(user.role!))

  if (filteredActions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button variant={action.variant} className="w-full h-auto p-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span className={`text-xs text-muted-foreground text-left ${action.variant == 'default' ? 'text-white/80' : ''}`}>{action.description}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
