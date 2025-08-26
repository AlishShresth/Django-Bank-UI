"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/types/banking"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"

interface AccountCardProps {
  account: Account
  onFreeze?: (accountId: string) => void
  onUnfreeze?: (accountId: string) => void
}

export function AccountCard({ account, onFreeze, onUnfreeze }: AccountCardProps) {
  const { user } = useAuthStore()

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-800"
      case "savings":
        return "bg-green-100 text-green-800"
      case "business":
        return "bg-purple-100 text-purple-800"
      case "credit":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground"
      case "frozen":
        return "bg-warning text-warning-foreground"
      case "closed":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(balance)
  }

  const canManageAccount = user && hasPermission(user.role, "manage_customer_accounts")

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">****{account.accountNumber.slice(-4)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
          <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-foreground">{formatBalance(account.balance, account.currency)}</p>
            <p className="text-xs text-muted-foreground">Available Balance</p>
          </div>

          <div className="flex items-center justify-between">
            <Link href={`/accounts/${account.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>

            {canManageAccount && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {account.status === "active" && onFreeze && (
                    <DropdownMenuItem onClick={() => onFreeze(account.id)}>Freeze Account</DropdownMenuItem>
                  )}
                  {account.status === "frozen" && onUnfreeze && (
                    <DropdownMenuItem onClick={() => onUnfreeze(account.id)}>Unfreeze Account</DropdownMenuItem>
                  )}
                  <DropdownMenuItem>View Statements</DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
