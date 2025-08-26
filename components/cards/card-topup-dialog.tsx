"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormInput } from "@/components/ui/form-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, CreditCard } from "lucide-react"
import type { Card as BankCard, Account } from "@/types/banking"

interface CardTopupDialogProps {
  card: BankCard
  accounts: Account[]
  onTopup: (cardId: string, amount: number, fromAccountId: string) => Promise<void>
}

export function CardTopupDialog({ card, accounts, onTopup }: CardTopupDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    fromAccountId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Only show topup for cards that have a balance (prepaid/debit cards)
  if (card.balance === undefined) {
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else if (Number(formData.amount) < 10) {
      newErrors.amount = "Minimum topup amount is $10"
    } else if (Number(formData.amount) > 1000) {
      newErrors.amount = "Maximum topup amount is $1,000"
    }

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = "Please select a source account"
    } else {
      const sourceAccount = accounts.find((acc) => acc.id === formData.fromAccountId)
      if (sourceAccount && Number(formData.amount) > sourceAccount.balance) {
        newErrors.amount = "Insufficient funds in source account"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onTopup(card.id, Number(formData.amount), formData.fromAccountId)
      setOpen(false)
      setFormData({ amount: "", fromAccountId: "" })
      setErrors({})
    } catch (error: any) {
      setErrors({ general: error.message || "Topup failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const formatBalance = (balance: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(balance)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Top Up Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Top Up Card
          </DialogTitle>
          <DialogDescription>
            Add money to your card from one of your accounts. Current balance: {formatBalance(card.balance || 0)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Source Account</label>
            <Select
              value={formData.fromAccountId}
              onValueChange={(value) => setFormData({ ...formData, fromAccountId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account to transfer from" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {account.accountType} ****{account.accountNumber.slice(-4)}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {formatBalance(account.balance, account.currency)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fromAccountId && <p className="text-sm text-destructive">{errors.fromAccountId}</p>}
          </div>

          <FormInput
            label="Top Up Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            placeholder="0.00"
            min="10"
            max="1000"
            step="0.01"
            helperText="Minimum $10, Maximum $1,000"
            required
          />

          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : `Top Up $${formData.amount || "0.00"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
