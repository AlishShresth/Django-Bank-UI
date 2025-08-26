"use client"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"
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
      permission: "transfer_funds" as const,
      variant: "default" as const,
    },
    {
      title: "View Cards",
      description: "Manage your cards",
      icon: CreditCard,
      href: "/cards",
      permission: "manage_cards" as const,
      variant: "outline" as const,
    },
    {
      title: "Download Statement",
      description: "Get account statements",
      icon: Download,
      href: "/statements",
      permission: "view_accounts" as const,
      variant: "outline" as const,
    },
    {
      title: "Add Customer",
      description: "Register new customer",
      icon: Plus,
      href: "/customers/new",
      permission: "manage_customer_accounts" as const,
      variant: "outline" as const,
    },
    {
      title: "View All Customers",
      description: "Manage customer accounts",
      icon: Users,
      href: "/customers",
      permission: "view_all_customers" as const,
      variant: "outline" as const,
    },
    {
      title: "Branch Reports",
      description: "View performance reports",
      icon: FileText,
      href: "/reports",
      permission: "view_branch_reports" as const,
      variant: "outline" as const,
    },
  ]

  const filteredActions = actions.filter((action) => hasPermission(user.role, action.permission))

  if (filteredActions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button variant={action.variant} className="w-full h-auto p-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">{action.description}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
