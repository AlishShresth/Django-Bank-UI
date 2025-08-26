"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/ui/form-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Shield } from "lucide-react"
import type { Account, Transfer } from "@/types/banking"

interface TransferFormProps {
  accounts: Account[]
  onTransfer: (transfer: Transfer) => Promise<void>
}

export function TransferForm({ accounts, onTransfer }: TransferFormProps) {
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    description: "",
    reference: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = "Please select a source account"
    }

    if (!formData.toAccountId) {
      newErrors.toAccountId = "Please select a destination account"
    }

    if (formData.fromAccountId === formData.toAccountId) {
      newErrors.toAccountId = "Source and destination accounts must be different"
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else {
      const sourceAccount = accounts.find((acc) => acc.id === formData.fromAccountId)
      if (sourceAccount && Number(formData.amount) > sourceAccount.balance) {
        newErrors.amount = "Insufficient funds"
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsLoading(true)
    try {
      await onTransfer({
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        amount: Number(formData.amount),
        description: formData.description,
        reference: formData.reference || undefined,
      })

      // Reset form
      setFormData({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
        description: "",
        reference: "",
      })
      setShowConfirmation(false)
      setErrors({})
    } catch (error: any) {
      setErrors({ general: error.message || "Transfer failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const sourceAccount = accounts.find((acc) => acc.id === formData.fromAccountId)
  const destinationAccount = accounts.find((acc) => acc.id === formData.toAccountId)

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(balance)
  }

  if (showConfirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confirm Transfer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>Please review the transfer details before confirming.</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {sourceAccount?.accountType} ****{sourceAccount?.accountNumber.slice(-4)}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">To</p>
                <p className="text-sm text-muted-foreground">
                  {destinationAccount?.accountType} ****{destinationAccount?.accountNumber.slice(-4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatBalance(Number(formData.amount), sourceAccount?.currency || "USD")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="font-medium">{formData.description}</p>
              </div>
            </div>

            {formData.reference && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference</p>
                <p className="font-medium">{formData.reference}</p>
              </div>
            )}
          </div>

          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : "Confirm Transfer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From Account</label>
              <Select
                value={formData.fromAccountId}
                onValueChange={(value) => setFormData({ ...formData, fromAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To Account</label>
              <Select
                value={formData.toAccountId}
                onValueChange={(value) => setFormData({ ...formData, toAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountType} ****{account.accountNumber.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.toAccountId && <p className="text-sm text-destructive">{errors.toAccountId}</p>}
            </div>
          </div>

          <FormInput
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <FormInput
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            placeholder="What is this transfer for?"
            required
          />

          <FormInput
            label="Reference (Optional)"
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            error={errors.reference}
            placeholder="Reference number or note"
          />

          {sourceAccount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Available balance: {formatBalance(sourceAccount.balance, sourceAccount.currency)}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Review Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
