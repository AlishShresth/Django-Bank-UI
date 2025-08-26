"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AccountCard } from "@/components/accounts/account-card"
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { Account } from "@/types/banking"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"

// Mock data - replace with actual API calls
const mockAccounts: Account[] = [
  {
    id: "1",
    accountNumber: "1234567890",
    accountType: "checking",
    balance: 8234.5,
    currency: "USD",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    userId: "user1",
  },
  {
    id: "2",
    accountNumber: "1234567891",
    accountType: "savings",
    balance: 4111.17,
    currency: "USD",
    status: "active",
    createdAt: "2024-01-10T10:00:00Z",
    userId: "user1",
  },
  {
    id: "3",
    accountNumber: "1234567892",
    accountType: "business",
    balance: 45678.9,
    currency: "USD",
    status: "active",
    createdAt: "2024-01-05T10:00:00Z",
    userId: "user2",
  },
  {
    id: "4",
    accountNumber: "1234567893",
    accountType: "checking",
    balance: 1500.0,
    currency: "USD",
    status: "frozen",
    createdAt: "2024-01-01T10:00:00Z",
    userId: "user3",
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuthStore()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(mockAccounts)
      setFilteredAccounts(mockAccounts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = accounts

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.accountNumber.includes(searchTerm) ||
          account.accountType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => account.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((account) => account.accountType === typeFilter)
    }

    setFilteredAccounts(filtered)
  }, [accounts, searchTerm, statusFilter, typeFilter])

  const handleCreateAccount = async (accountData: any) => {
    // Simulate API call
    const newAccount: Account = {
      id: Date.now().toString(),
      accountNumber: Math.random().toString().slice(2, 12),
      accountType: accountData.accountType,
      balance: accountData.initialDeposit,
      currency: "USD",
      status: "active",
      createdAt: new Date().toISOString(),
      userId: "new-user",
    }

    setAccounts([...accounts, newAccount])
  }

  const handleFreezeAccount = async (accountId: string) => {
    setAccounts(
      accounts.map((account) => (account.id === accountId ? { ...account, status: "frozen" as const } : account)),
    )
  }

  const handleUnfreezeAccount = async (accountId: string) => {
    setAccounts(
      accounts.map((account) => (account.id === accountId ? { ...account, status: "active" as const } : account)),
    )
  }

  const canManageAccounts = user && hasPermission(user.role, "manage_customer_accounts")

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
            <p className="text-muted-foreground">
              {canManageAccounts ? "Manage customer accounts" : "View your account information"}
            </p>
          </div>
          {canManageAccounts && <CreateAccountDialog onCreateAccount={handleCreateAccount} />}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No accounts found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onFreeze={canManageAccounts ? handleFreezeAccount : undefined}
                onUnfreeze={canManageAccounts ? handleUnfreezeAccount : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
