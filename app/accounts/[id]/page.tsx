"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownLeft, ArrowUpRight, Download, Settings, Fence as Freeze, Play } from "lucide-react"
import type { Account, Transaction } from "@/types/banking"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"

// Mock data
const mockAccount: Account = {
  id: "1",
  accountNumber: "1234567890",
  accountType: "checking",
  balance: 8234.5,
  currency: "USD",
  status: "active",
  createdAt: "2024-01-15T10:00:00Z",
  userId: "user1",
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    type: "deposit",
    amount: 3500.0,
    currency: "USD",
    description: "Salary Deposit",
    status: "completed",
    createdAt: "2024-01-20T10:00:00Z",
    reference: "SAL001",
  },
  {
    id: "2",
    accountId: "1",
    type: "withdrawal",
    amount: 89.99,
    currency: "USD",
    description: "Online Purchase - Amazon",
    status: "completed",
    createdAt: "2024-01-19T14:30:00Z",
    reference: "PUR001",
  },
  {
    id: "3",
    accountId: "1",
    type: "withdrawal",
    amount: 4.5,
    currency: "USD",
    description: "Coffee Shop",
    status: "completed",
    createdAt: "2024-01-18T08:15:00Z",
    reference: "PUR002",
  },
  {
    id: "4",
    accountId: "1",
    type: "transfer",
    amount: 100.0,
    currency: "USD",
    description: "Transfer to Savings",
    status: "completed",
    createdAt: "2024-01-17T16:45:00Z",
    reference: "TRF001",
    beneficiaryAccount: "1234567891",
  },
]

export default function AccountDetailsPage() {
  const params = useParams()
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuthStore()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccount(mockAccount)
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(balance)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-success" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-destructive" />
      case "transfer":
        return <ArrowUpRight className="h-4 w-4 text-primary" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const canManageAccount = user && hasPermission(user.role, "manage_customer_accounts")

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!account) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Account not found.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
            </h1>
            <p className="text-muted-foreground">Account Number: ****{account.accountNumber.slice(-4)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
            {canManageAccount && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                {account.status === "active" ? (
                  <Button variant="outline" size="sm">
                    <Freeze className="h-4 w-4 mr-2" />
                    Freeze
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Unfreeze
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{formatBalance(account.balance, account.currency)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground capitalize">{account.accountType}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Opened</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{formatDate(account.createdAt)}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)} • {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "deposit" ? "text-success" : "text-foreground"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}
                          {formatBalance(transaction.amount, transaction.currency)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements">
            <Card>
              <CardHeader>
                <CardTitle>Account Statements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Download your monthly account statements.</p>
                <div className="mt-4 space-y-2">
                  {["January 2024", "December 2023", "November 2023"].map((month) => (
                    <div key={month} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{month}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                    <p className="font-mono">{account.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Routing Number</p>
                    <p className="font-mono">021000021</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <p className="capitalize">{account.accountType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
