"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TransactionList } from "@/components/transactions/transaction-list"
import type { Transaction } from "@/types/banking"

// Mock data - replace with actual API calls
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
  {
    id: "5",
    accountId: "1",
    type: "payment",
    amount: 250.0,
    currency: "USD",
    description: "Utility Bill Payment",
    status: "pending",
    createdAt: "2024-01-16T12:00:00Z",
    reference: "PAY001",
  },
  {
    id: "6",
    accountId: "1",
    type: "withdrawal",
    amount: 50.0,
    currency: "USD",
    description: "ATM Withdrawal",
    status: "failed",
    createdAt: "2024-01-15T18:30:00Z",
    reference: "ATM001",
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>

        <TransactionList transactions={transactions} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  )
}
