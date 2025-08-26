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
import type { Account } from "@/types/banking"

interface RequestCardDialogProps {
  accounts: Account[]
  onRequestCard: (cardData: any) => Promise<void>
}

export function RequestCardDialog({ accounts, onRequestCard }: RequestCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardType: "",
    accountId: "",
    deliveryAddress: "",
    reason: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardType) {
      newErrors.cardType = "Please select a card type"
    }

    if (!formData.accountId) {
      newErrors.accountId = "Please select an account"
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required"
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for the card request"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onRequestCard({
        cardType: formData.cardType,
        accountId: formData.accountId,
        deliveryAddress: formData.deliveryAddress,
        reason: formData.reason,
      })
      setOpen(false)
      setFormData({ cardType: "", accountId: "", deliveryAddress: "", reason: "" })
      setErrors({})
    } catch (error: any) {
      setErrors({ general: error.message || "Card request failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Request New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Request New Card
          </DialogTitle>
          <DialogDescription>Request a new debit or credit card for your account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Card Type</label>
            <Select value={formData.cardType} onValueChange={(value) => setFormData({ ...formData, cardType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit Card</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
              </SelectContent>
            </Select>
            {errors.cardType && <p className="text-sm text-destructive">{errors.cardType}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Link to Account</label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountType} ****{account.accountNumber.slice(-4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accountId && <p className="text-sm text-destructive">{errors.accountId}</p>}
          </div>

          <FormInput
            label="Delivery Address"
            type="text"
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            error={errors.deliveryAddress}
            placeholder="Enter your full address"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason for Request</label>
            <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_customer">New Customer</SelectItem>
                <SelectItem value="replacement">Replacement Card</SelectItem>
                <SelectItem value="lost_stolen">Lost/Stolen Card</SelectItem>
                <SelectItem value="damaged">Damaged Card</SelectItem>
                <SelectItem value="expired">Expired Card</SelectItem>
                <SelectItem value="additional">Additional Card</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
          </div>

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
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
