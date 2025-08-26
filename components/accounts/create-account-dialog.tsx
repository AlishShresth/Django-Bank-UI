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
import { Plus } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/lib/rbac"

interface CreateAccountDialogProps {
  onCreateAccount: (accountData: any) => Promise<void>
}

export function CreateAccountDialog({ onCreateAccount }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountType: "",
    initialDeposit: "",
    customerEmail: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { user } = useAuthStore()

  if (!user || !hasPermission(user.role, "manage_customer_accounts")) {
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountType) {
      newErrors.accountType = "Account type is required"
    }

    if (!formData.initialDeposit) {
      newErrors.initialDeposit = "Initial deposit is required"
    } else if (isNaN(Number(formData.initialDeposit)) || Number(formData.initialDeposit) < 0) {
      newErrors.initialDeposit = "Please enter a valid amount"
    }

    if (!formData.customerEmail) {
      newErrors.customerEmail = "Customer email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onCreateAccount({
        accountType: formData.accountType,
        initialDeposit: Number(formData.initialDeposit),
        customerEmail: formData.customerEmail,
      })
      setOpen(false)
      setFormData({ accountType: "", initialDeposit: "", customerEmail: "" })
      setErrors({})
    } catch (error) {
      setErrors({ general: "Failed to create account. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>Create a new bank account for a customer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Customer Email"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            error={errors.customerEmail}
            placeholder="customer@example.com"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Account Type</label>
            <Select
              value={formData.accountType}
              onValueChange={(value) => setFormData({ ...formData, accountType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="business">Business Account</SelectItem>
              </SelectContent>
            </Select>
            {errors.accountType && <p className="text-sm text-destructive">{errors.accountType}</p>}
          </div>

          <FormInput
            label="Initial Deposit"
            type="number"
            value={formData.initialDeposit}
            onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
            error={errors.initialDeposit}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
