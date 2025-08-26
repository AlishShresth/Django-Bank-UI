"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CardDisplay } from "@/components/cards/card-display"
import { CardTopupDialog } from "@/components/cards/card-topup-dialog"
import { RequestCardDialog } from "@/components/cards/request-card-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"
import type { Card as BankCard, Account } from "@/types/banking"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"

// Mock data - replace with actual API calls
const mockCards: BankCard[] = [
  {
    id: "1",
    accountId: "1",
    cardNumber: "4532123456789012",
    cardType: "debit",
    status: "active",
    expiryDate: "12/27",
    balance: 1250.75,
  },
  {
    id: "2",
    accountId: "1",
    cardNumber: "5555123456789012",
    cardType: "credit",
    status: "active",
    expiryDate: "08/26",
    creditLimit: 5000.0,
  },
  {
    id: "3",
    accountId: "2",
    cardNumber: "4111123456789012",
    cardType: "debit",
    status: "blocked",
    expiryDate: "03/25",
    balance: 500.0,
  },
]

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
]

export default function CardsPage() {
  const [cards, setCards] = useState<BankCard[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { user } = useAuthStore()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCards(mockCards)
      setAccounts(mockAccounts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleBlockCard = async (cardId: string) => {
    try {
      setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "blocked" as const } : card)))
      showNotification("success", "Card has been blocked successfully")
    } catch (error) {
      showNotification("error", "Failed to block card")
    }
  }

  const handleUnblockCard = async (cardId: string) => {
    try {
      setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "active" as const } : card)))
      showNotification("success", "Card has been unblocked successfully")
    } catch (error) {
      showNotification("error", "Failed to unblock card")
    }
  }

  const handleReportLoss = async (cardId: string) => {
    try {
      setCards(cards.map((card) => (card.id === cardId ? { ...card, status: "blocked" as const } : card)))
      showNotification("success", "Card has been reported as lost/stolen and blocked")
    } catch (error) {
      showNotification("error", "Failed to report card loss")
    }
  }

  const handleRequestReplacement = async (cardId: string) => {
    try {
      showNotification("success", "Replacement card request submitted successfully")
    } catch (error) {
      showNotification("error", "Failed to submit replacement request")
    }
  }

  const handleTopup = async (cardId: string, amount: number, fromAccountId: string) => {
    try {
      // Update card balance
      setCards(
        cards.map((card) =>
          card.id === cardId && card.balance !== undefined ? { ...card, balance: card.balance + amount } : card,
        ),
      )
      // Update account balance
      setAccounts(
        accounts.map((account) =>
          account.id === fromAccountId ? { ...account, balance: account.balance - amount } : account,
        ),
      )
      showNotification("success", `Card topped up with $${amount.toFixed(2)} successfully`)
    } catch (error) {
      showNotification("error", "Failed to top up card")
    }
  }

  const handleRequestCard = async (cardData: any) => {
    try {
      showNotification(
        "success",
        "New card request submitted successfully. You will receive it within 7-10 business days.",
      )
    } catch (error) {
      showNotification("error", "Failed to submit card request")
    }
  }

  const canManageCards = user && hasPermission(user.role, "manage_cards")

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
            <h1 className="text-3xl font-bold text-foreground">My Cards</h1>
            <p className="text-muted-foreground">Manage your debit and credit cards</p>
          </div>
          {canManageCards && <RequestCardDialog accounts={accounts} onRequestCard={handleRequestCard} />}
        </div>

        {notification && (
          <Alert className={notification.type === "success" ? "border-success bg-success/10" : "border-destructive"}>
            {notification.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription className={notification.type === "success" ? "text-success" : "text-destructive"}>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any cards yet.</p>
            {canManageCards && <RequestCardDialog accounts={accounts} onRequestCard={handleRequestCard} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cards.map((card) => (
              <div key={card.id} className="space-y-4">
                <CardDisplay
                  card={card}
                  onBlock={handleBlockCard}
                  onUnblock={handleUnblockCard}
                  onReportLoss={handleReportLoss}
                  onRequestReplacement={handleRequestReplacement}
                />
                {card.balance !== undefined && (
                  <CardTopupDialog card={card} accounts={accounts} onTopup={handleTopup} />
                )}
              </div>
            ))}
          </div>
        )}

        {cards.length > 0 && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Card Security Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Never share your PIN or card details with anyone</li>
              <li>• Report lost or stolen cards immediately</li>
              <li>• Monitor your transactions regularly</li>
              <li>• Use secure networks when making online purchases</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
